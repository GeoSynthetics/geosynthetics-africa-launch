import { supabase } from "@/integrations/supabase/client";
import { sendHeroProjectEmailFn } from "@/lib/brevo";
import { resolveRegionalRouting, SOUTH_AFRICA_CONTACT } from "@/types/regionalCoverage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PLACEHOLDER_DOMAIN = "@phone-inquiry.geosynthetics.com";

export interface HeroProjectSubmission {
  need: string;
  region: string;
  contact: string; // Email or phone
  file?: File | null;
}

export interface HeroSubmissionResult {
  success: boolean;
  message: string;
  routedTo: {
    targetName: string;
    targetEmail: string;
    targetRole: string;
    isWestAfrica: boolean;
    isSouthAfrica: boolean;
  };
  attachmentPath?: string | null;
  quoteId?: string | null;
}

/**
 * Parses user contact input to identify whether it is an email, phone, or both.
 */
function parseContact(contactInput: string): { email: string; phone: string | null } {
  const trimmed = contactInput.trim();

  if (EMAIL_REGEX.test(trimmed)) {
    return { email: trimmed, phone: null };
  }

  // If contains digits and phone format
  const isLikelyPhone = /^[\d\s+\-()]{6,}$/.test(trimmed);
  if (isLikelyPhone) {
    return {
      email: `${trimmed.replace(/[^\d+]/g, "")}${PHONE_PLACEHOLDER_DOMAIN}`,
      phone: trimmed,
    };
  }

  // If user typed both email and phone or name
  const matchEmail = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (matchEmail) {
    const email = matchEmail[0];
    const phone = trimmed.replace(email, "").trim() || null;
    return { email, phone };
  }

  return { email: trimmed, phone: null };
}

/**
 * Handles the complete lifecycle of a Hero Project Request submission:
 * 1. Resolves dynamic regional routing (West Africa -> Mamadou Coulibaly; SA -> South Africa Desk).
 * 2. Uploads any attached BOQ/drawings to Supabase Storage.
 * 3. Records entry in Supabase `quote_requests` table.
 * 4. Dispatches transactional email through Brevo with routing and notifications.
 */
export async function submitHeroProjectRequest(
  submission: HeroProjectSubmission,
): Promise<HeroSubmissionResult> {
  const { need, region, contact, file } = submission;

  if (!need.trim()) {
    throw new Error("Please describe what you need for your project.");
  }
  if (!region.trim()) {
    throw new Error("Please select your project region or country.");
  }
  if (!contact.trim()) {
    throw new Error("Please provide your email or phone number.");
  }

  // 1. Resolve regional routing
  const routing = resolveRegionalRouting(region);
  const { email, phone } = parseContact(contact);

  // 2. Upload attachment if present
  let uploadedFilePath: string | null = null;
  let fileName: string | null = null;

  if (file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    fileName = file.name;
    const path = `quotes/hero/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("boq-uploads")
        .upload(path, file, { contentType: file.type || undefined, upsert: false });

      if (uploadError) {
        console.warn("Could not upload hero file attachment:", uploadError.message);
      } else {
        uploadedFilePath = path;
      }
    } catch (upErr) {
      console.warn("Storage upload exception:", upErr);
    }
  }

  // 3. Save into Supabase `quote_requests` table
  const routingDescriptionTag = routing.isWestAfrica
    ? `[ROUTED TO: Mamadou Coulibaly (West Africa Regional Hub - ${routing.targetEmail})]`
    : routing.isSouthAfrica
      ? `[ROUTED TO: South Africa Sales Desk (${routing.targetEmail})]`
      : `[ROUTED TO: ${routing.targetName} (${routing.targetEmail})]`;

  const fullDescription = `${need.trim()}\n\n${routingDescriptionTag}\n[region: ${region}]\n[contact: ${contact.trim()}]${
    uploadedFilePath ? `\n\n[attachments]\n${uploadedFilePath}` : ""
  }`;

  const { data: sessionData } = await supabase.auth
    .getSession()
    .catch(() => ({ data: { session: null } }));
  const userId = sessionData.session?.user.id ?? null;

  const basePayload: Record<string, unknown> = {
    contact_name: contact.trim().split("@")[0].slice(0, 50),
    contact_email: email,
    contact_phone: phone,
    company: null,
    country: region,
    project_description: fullDescription,
    product_id: null,
    product_name: "Hero Project Request",
    attachment_paths: uploadedFilePath ? [uploadedFilePath] : [],
    boq_file_path: uploadedFilePath,
    user_id: userId,
    status: "new",
    source: "hero_start_project_form",
  };

  const optionalKeys = [
    "product_id",
    "product_name",
    "attachment_paths",
    "boq_file_path",
    "user_id",
    "source",
    "country",
  ];

  const payload = { ...basePayload };
  let lastError: { message: string } | null = null;
  let quoteId: string | null = null;

  for (let attempt = 0; attempt <= optionalKeys.length; attempt += 1) {
    const { data: insertData, error } = await supabase
      .from("quote_requests")
      .insert(payload)
      .select("id")
      .maybeSingle();

    if (!error) {
      lastError = null;
      quoteId = insertData?.id || null;
      break;
    }

    lastError = error;
    const match =
      /column ['"]?(\w+)['"]? .* (does not exist|not found)/i.exec(error.message) ??
      /Could not find the ['"]?(\w+)['"]? column/i.exec(error.message);
    const missing = match?.[1];

    if (missing && missing in payload) {
      delete (payload as Record<string, unknown>)[missing];
      continue;
    }
    break;
  }

  if (lastError) {
    console.error("Failed to insert quote request:", lastError);
    // Don't fail yet if the insert was blocked by permissions — the email may still deliver the lead
  }

  // 4. Dispatch email notifications server-side (the Brevo key must never reach the browser)
  const realEmail = email.endsWith(PHONE_PLACEHOLDER_DOMAIN) ? undefined : email;
  const notified = await sendHeroProjectEmailFn({
    data: {
      need: need.trim(),
      region,
      contact: contact.trim(),
      contactEmail: realEmail && EMAIL_REGEX.test(realEmail) ? realEmail : undefined,
      contactPhone: phone ?? undefined,
      attachmentName: uploadedFilePath ? (fileName ?? undefined) : undefined,
      reference: quoteId ?? undefined,
    },
  })
    .then((res) => res.notified)
    .catch((err) => {
      console.error("[Brevo Email Trigger Error]:", err);
      return false;
    });

  if (lastError && !notified) {
    throw new Error(
      "We couldn't send your request. Please try again or email sales@geosyntheticsafrica.com.",
    );
  }

  return {
    success: true,
    message: routing.isWestAfrica
      ? `Request received! Forwarded directly to Mamadou Coulibaly in Côte d'Ivoire.`
      : routing.isSouthAfrica
        ? `Request received! Sent to our South Africa Operations Desk at ${SOUTH_AFRICA_CONTACT.email}.`
        : `Request received! Forwarded to our ${routing.targetName}.`,
    routedTo: routing,
    attachmentPath: uploadedFilePath,
    quoteId,
  };
}
