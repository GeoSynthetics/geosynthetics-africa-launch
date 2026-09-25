import { supabase } from "@/integrations/supabase/client";
import {
  resolveRegionalRouting,
  MAMADOU_COULIBALY_CONTACT,
  SOUTH_AFRICA_CONTACT,
} from "@/types/regionalCoverage";

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(trimmed)) {
    return { email: trimmed, phone: null };
  }

  // If contains digits and phone format
  const isLikelyPhone = /^[\d\s+\-()]{6,}$/.test(trimmed);
  if (isLikelyPhone) {
    return { email: `${trimmed.replace(/[^\d+]/g, "")}@phone-inquiry.geosynthetics.co.za`, phone: trimmed };
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
 * Sends transactional email notification via Brevo API.
 */
async function sendNotificationEmail(params: {
  toEmail: string;
  toName: string;
  fromEmail: string;
  customerContact: string;
  customerEmail: string;
  customerPhone: string | null;
  region: string;
  projectNeed: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  routingRole: string;
  isWestAfrica: boolean;
}): Promise<boolean> {
  const apiKey =
    (typeof process !== "undefined" && process.env?.BREVO_API_KEY) ||
    import.meta.env.VITE_BREVO_API_KEY ||
    "";

  if (!apiKey) {
    console.warn("Brevo API key not configured; skipping email dispatch.");
    return false;
  }

  const generalNotificationEmail =
    (typeof process !== "undefined" && process.env?.NOTIFICATION_TO_EMAIL) ||
    import.meta.env.VITE_NOTIFICATION_TO_EMAIL ||
    "info@geosynthetics.co.za";

  const routingTag = params.isWestAfrica
    ? "[West Africa — Mamadou Coulibaly, Côte d'Ivoire]"
    : "[South Africa Sales Desk]";

  const emailSubject = `🚀 New Project Request ${routingTag} — ${params.region}: ${params.customerContact.slice(0, 30)}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 24px; color: #1e293b; }
        .card { background-color: #ffffff; border-radius: 12px; padding: 28px; max-width: 620px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; background-color: ${params.isWestAfrica ? '#fef3c7; color: #92400e;' : '#fee2e2; color: #991b1b;' } }
        .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 8px 0 4px 0; text-transform: uppercase; }
        .lead-meta { font-size: 13px; color: #64748b; margin: 0; }
        .detail-group { margin-bottom: 16px; }
        .detail-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .detail-value { font-size: 15px; color: #1e293b; font-weight: 500; background-color: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; }
        .footer { border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">${params.isWestAfrica ? "West Africa Regional Desk" : "South Africa Operations HQ"}</span>
          <h1 class="title">New Hero Project Inquiry</h1>
          <p class="lead-meta">Received via geosynthetics.co.za Hero Start Project Form</p>
        </div>

        <div class="detail-group">
          <div class="detail-label">Assigned Representative / Desk</div>
          <div class="detail-value" style="border-left: 4px solid #dc2626;">
            <strong>${params.toName}</strong> (${params.routingRole})<br>
            Direct: <a href="mailto:${params.toEmail}">${params.toEmail}</a>
          </div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Selected Region / Country</div>
          <div class="detail-value"><strong>${params.region}</strong></div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Client Contact Details</div>
          <div class="detail-value">
            <strong>${params.customerContact}</strong>
            ${params.customerPhone ? `<br>Phone: <a href="tel:${params.customerPhone}">${params.customerPhone}</a>` : ""}
            ${params.customerEmail ? `<br>Email: <a href="mailto:${params.customerEmail}">${params.customerEmail}</a>` : ""}
          </div>
        </div>

        <div class="detail-group">
          <div class="detail-label">Project Requirement / Scope</div>
          <div class="detail-value">${params.projectNeed}</div>
        </div>

        ${
          params.attachmentUrl
            ? `
        <div class="detail-group">
          <div class="detail-label">Attached BOQ / Drawing</div>
          <div class="detail-value">
            📎 <a href="${params.attachmentUrl}" target="_blank" style="color: #dc2626; font-weight: bold; text-decoration: underline;">
              ${params.attachmentName || "Download Attachment"}
            </a>
          </div>
        </div>`
            : ""
        }

        <div class="footer">
          Geosynthetics Africa Platform · Pan-African Supply, Installation & QA/QC<br>
          One Contract. One Crew. One Signature.
        </div>
      </div>
    </body>
    </html>
  `;

  // Build recipient array (primary regional recipient + CC general mailbox)
  const toList = [
    { email: params.toEmail, name: params.toName },
  ];

  // If primary isn't info@, add info@ as CC or recipient
  const ccList: Array<{ email: string; name?: string }> = [];
  if (params.toEmail.toLowerCase() !== generalNotificationEmail.toLowerCase()) {
    ccList.push({ email: generalNotificationEmail, name: "GSA Central Dispatch" });
  }

  // If West Africa, also ensure civ@geosynthetics.co.za receives it
  if (params.isWestAfrica && params.toEmail.toLowerCase() !== MAMADOU_COULIBALY_CONTACT.email.toLowerCase()) {
    ccList.push({
      email: MAMADOU_COULIBALY_CONTACT.email,
      name: MAMADOU_COULIBALY_CONTACT.name,
    });
  }

  try {
    const payload: Record<string, unknown> = {
      sender: {
        name: "Geosynthetics Africa Project Desk",
        email: params.fromEmail,
      },
      to: toList,
      replyTo: {
        email: params.customerEmail.includes("@phone-inquiry") ? params.fromEmail : params.customerEmail,
        name: params.customerContact,
      },
      subject: emailSubject,
      htmlContent: htmlBody,
    };

    if (ccList.length > 0) {
      payload.cc = ccList;
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Brevo API non-OK response:", response.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("Brevo email transmission error (offline or network policy):", err);
    return false;
  }
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
  let publicFileUrl: string | null = null;
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
        const { data: urlData } = supabase.storage.from("boq-uploads").getPublicUrl(path);
        publicFileUrl = urlData?.publicUrl || null;
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

  const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
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
    // Don't completely fail if database insert was blocked by permissions — attempt notification
  }

  // 4. Dispatch Email Notification
  const fromEmail =
    (typeof process !== "undefined" && process.env?.BREVO_FROM_EMAIL) ||
    import.meta.env.VITE_BREVO_FROM_EMAIL ||
    "info@geosynthetics.co.za";

  void sendNotificationEmail({
    toEmail: routing.targetEmail,
    toName: routing.targetName,
    fromEmail,
    customerContact: contact,
    customerEmail: email,
    customerPhone: phone,
    region,
    projectNeed: need,
    attachmentUrl: publicFileUrl,
    attachmentName: fileName,
    routingRole: routing.targetRole,
    isWestAfrica: routing.isWestAfrica,
  });

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
