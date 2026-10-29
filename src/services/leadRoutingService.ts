import { SAVED_ENQUIRY_MESSAGE } from "@/lib/email-notification";
import { supabase } from "@/integrations/supabase/client";
import { ENQUIRY_EMAIL } from "@/lib/business-info";
import {
  EMAIL_REGEX,
  PHONE_PLACEHOLDER_DOMAIN,
  parseContactInput as parseContact,
  resolveContact,
} from "@/lib/contact-input";
import { sendHeroProjectEmailFn } from "@/lib/email";
import { resolveRegionalRouting } from "@/types/regionalCoverage";

export interface HeroProjectSubmission {
  need: string;
  region: string;
  /** Legacy single "email or phone" value; used when email and phone are not given. */
  contact?: string;
  email?: string;
  phone?: string;
  file?: File | null;
}

export interface HeroSubmissionResult {
  success: boolean;
  message: string;
  notified: boolean;
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
 * Handles the complete lifecycle of a Hero Project Request submission:
 * 1. Resolves dynamic regional routing (West Africa -> Mamadou Coulibaly; SA -> South Africa Desk).
 * 2. Uploads any attached BOQ/drawings to Supabase Storage.
 * 3. Records entry in Supabase `quote_requests` table.
 * 4. Dispatches transactional email through Resend and notifications.
 */
export async function submitHeroProjectRequest(
  submission: HeroProjectSubmission,
): Promise<HeroSubmissionResult> {
  const { need, region, file } = submission;
  const emailInput = submission.email?.trim() ?? "";
  const phoneInput = submission.phone?.trim() ?? "";
  const separateFields = Boolean(emailInput || phoneInput);
  const contact = separateFields
    ? [emailInput, phoneInput].filter(Boolean).join(" · ")
    : (submission.contact ?? "").trim();

  if (!need.trim()) {
    throw new Error("Please describe what you need for your project.");
  }
  if (!contact.trim()) {
    throw new Error("Please provide your email or phone number.");
  }

  // 1. Resolve regional routing
  const routing = resolveRegionalRouting(region);
  const { email, phone } = separateFields
    ? resolveContact(emailInput, phoneInput)
    : parseContact(contact);

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
  // All requests go to the enquiries mailbox; the region is kept for reference.
  const routingDescriptionTag = `[ROUTED TO: Enquiries (${ENQUIRY_EMAIL})]`;

  const fullDescription = `${need.trim()}\n\n${routingDescriptionTag}\n[region: ${region}]\n[contact: ${contact.trim()}]${
    uploadedFilePath ? `\n\n[attachments]\n${uploadedFilePath}` : ""
  }`;

  const { data: sessionData } = await supabase.auth
    .getSession()
    .catch(() => ({ data: { session: null } }));
  const userId = sessionData.session?.user.id ?? null;

  const basePayload: Record<string, unknown> = {
    contact_name: (emailInput || contact).trim().split("@")[0].slice(0, 50),
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

  // 4. Dispatch email notifications server-side (the email API key must never reach the browser)
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
      console.error("[Email Trigger Error]:", err);
      return false;
    });

  if (lastError && !notified) {
    throw new Error(
      "We couldn't send your request. Please try again or email info@geosyntheticsafrica.com.",
    );
  }

  return {
    success: true,
    notified,
    message: notified
      ? "Request received! Our sales team will be in touch within 24 hours."
      : SAVED_ENQUIRY_MESSAGE,
    routedTo: routing,
    attachmentPath: uploadedFilePath,
    quoteId,
  };
}
