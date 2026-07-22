/**
 * GeoSynthetics Africa — Modular Transactional Email Templates Engine
 * Clean Code implementation strictly adhering to SRP, DRY, and explicit self-documenting layout rendering.
 * Matches stakeholder specification: gsa-quote-confirmation-email.html
 */

export interface BaseEmailParams {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  company?: string;
  country?: string;
  reference?: string;
  date?: string;
  siteUrl?: string;
}

export interface QuoteEmailParams extends BaseEmailParams {
  productName?: string;
  projectDescription?: string;
  attachments?: string[] | string;
}

export interface ContactEmailParams extends BaseEmailParams {
  message: string;
  subject?: string;
}

const DEFAULT_SITE_URL = "https://geosynthetics.co.za";
const DEFAULT_BREVO_IMG_HOST = "https://img.emailer.geosynthetics.co.za";

/**
 * Resolves the authenticated Brevo image redirection host or site fallback URL.
 */
export function getEmailImgHost(siteUrl: string = DEFAULT_SITE_URL): string {
  const envHost = process.env.BREVO_IMG_HOST || process.env.VITE_BREVO_IMG_HOST;
  if (envHost && envHost.trim()) {
    return envHost.trim().replace(/\/$/, "");
  }
  if (siteUrl && siteUrl.includes("geosynthetics.co.za")) {
    return DEFAULT_BREVO_IMG_HOST;
  }
  return siteUrl.replace(/\/$/, "");
}

/**
 * Formats a clean reference code if not provided (e.g. GSA-2026-8942)
 */
export function formatReference(providedRef?: string): string {
  if (providedRef && providedRef.trim()) {
    return providedRef.trim();
  }
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `GSA-${year}-${randomNum}`;
}

/**
 * Formats current date nicely for email transmittal summary (e.g. 21 July 2026)
 */
export function formatSubmissionDate(providedDate?: string): string {
  if (providedDate && providedDate.trim()) {
    return providedDate.trim();
  }
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-GB", { month: "long" });
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Escapes HTML entities to prevent injection in email templates
 */
export function escapeHtml(text?: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders shared branded email header with Navy background, site logo image, brand title, and Amber accent line.
 * Uses Brevo's authenticated image redirection domain (img.emailer.geosynthetics.co.za).
 */
function renderEmailHeader(siteUrl: string = DEFAULT_SITE_URL): string {
  const imgHost = getEmailImgHost(siteUrl);
  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const logoIconUrl = `${imgHost}/assets/email-africa-icon.png`;
  const fallbackIconUrl = `${cleanSiteUrl}/assets/email-africa-icon.png`;

  return `
    <!-- ===== HEADER ===== -->
    <tr>
      <td style="background-color:#0C1F35; padding:28px 40px 24px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle; padding-right:12px;">
                    <a href="${cleanSiteUrl}" style="text-decoration:none;">
                      <img src="${logoIconUrl}" width="32" height="32" alt="GeoSynthetics Africa Logo" style="display:block; width:32px; height:32px; border:0; outline:none; text-decoration:none;" onerror="this.onerror=null;this.src='${fallbackIconUrl}';" />
                    </a>
                  </td>
                  <td style="vertical-align:middle; font-family:Arial, Helvetica, sans-serif; font-size:20px; font-weight:bold; letter-spacing:2px; color:#FFFFFF;">
                    <a href="${cleanSiteUrl}" style="color:#FFFFFF; text-decoration:none;">
                      GEOSYNTHETICS<span style="color:#F2A900;">AFRICA</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:10px; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:1.5px; color:#8FA3B8; text-transform:uppercase;">
              Supply &nbsp;&middot;&nbsp; Logistics &nbsp;&middot;&nbsp; Installation &nbsp;&middot;&nbsp; QA/QC
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Amber rule — brand accent -->
    <tr><td style="background-color:#F2A900; height:4px; line-height:4px; font-size:0;">&nbsp;</td></tr>
  `;
}

/**
 * Renders shared Credentials Strip (IAGI, 30+ Countries, 15M+ m²)
 */
function renderCredentialsStrip(): string {
  return `
    <!-- ===== CREDENTIALS STRIP ===== -->
    <tr>
      <td style="background-color:#0C1F35; padding:20px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif;">
          <tr>
            <td class="stack" width="33%" align="center" style="padding:6px 4px;">
              <div style="font-size:16px; font-weight:bold; color:#F2A900;">IAGI</div>
              <div style="font-size:10px; letter-spacing:1px; color:#8FA3B8; text-transform:uppercase; padding-top:4px;">Installer Member &mdash; 1 of only 5 in Africa</div>
            </td>
            <td class="stack" width="33%" align="center" style="padding:6px 4px;">
              <div style="font-size:16px; font-weight:bold; color:#F2A900;">30+</div>
              <div style="font-size:10px; letter-spacing:1px; color:#8FA3B8; text-transform:uppercase; padding-top:4px;">African countries delivered to</div>
            </td>
            <td class="stack" width="33%" align="center" style="padding:6px 4px;">
              <div style="font-size:16px; font-weight:bold; color:#F2A900;">15M+ m&sup2;</div>
              <div style="font-size:10px; letter-spacing:1px; color:#8FA3B8; text-transform:uppercase; padding-top:4px;">Installed &middot; 100% QA/QC tested</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

/**
 * Renders primary CTA button and reply subtext.
 */
function renderCtaSection(siteUrl: string = DEFAULT_SITE_URL): string {
  const catalogueUrl = `${siteUrl.replace(/\/$/, "")}/catalogue`;
  return `
    <!-- ===== CTA ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:28px 40px;" class="px" align="center">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color:#F2A900; border-radius:2px;">
              <a href="${catalogueUrl}" style="display:inline-block; padding:13px 28px; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:bold; letter-spacing:1.5px; color:#0C1F35; text-decoration:none; text-transform:uppercase;">
                Explore the catalogue
              </a>
            </td>
          </tr>
        </table>
        <div style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#5A6B7E; padding-top:14px;">
          Need to add specs or drawings? Reply directly to this email &mdash; it reaches our engineering team.
        </div>
      </td>
    </tr>
  `;
}

/**
 * Renders shared footer with legal details, certifications, and active links.
 */
function renderEmailFooter(siteUrl: string = DEFAULT_SITE_URL): string {
  const cleanSiteUrl = siteUrl.replace(/\/$/, "");
  const contactUrl = `${cleanSiteUrl}/contacts`;
  const domainLabel = cleanSiteUrl.replace(/^https?:\/\//, "");

  return `
    <!-- ===== FOOTER ===== -->
    <tr>
      <td style="background-color:#F4F6F9; border-top:1px solid #D8DEE6; padding:22px 40px;" class="px" align="center">
        <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; color:#5A6B7E;">
          <strong style="color:#0C1F35;">Geosynthetics Africa (Pty) Ltd</strong> &mdash; Geosynthetics Supply, Installation &amp; QA/QC Across Africa.<br>
          SUPPLY. LOGISTICS. INSTALLATION. &mdash; ONE CONTRACT. ONE CREW. ONE SIGNATURE.
        </div>
        <div style="font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:18px; color:#8A94A6; padding-top:10px;">
          IAGI Installer Member &nbsp;|&nbsp; B-BBEE Level 2 &nbsp;|&nbsp; QA/QC Certified &nbsp;|&nbsp; Pan-African Logistics<br>
          <a href="${cleanSiteUrl}" style="color:#5A6B7E; text-decoration:underline;">${domainLabel}</a> &nbsp;&middot;&nbsp; <a href="${contactUrl}" style="color:#5A6B7E; text-decoration:underline;">Contact us</a>
        </div>
        <div style="font-family:Arial, Helvetica, sans-serif; font-size:10px; color:#A6AFBC; padding-top:12px;">
          &copy; ${new Date().getFullYear()} Geosynthetics Africa (Pty) Ltd. All rights reserved.
        </div>
      </td>
    </tr>
  `;
}

/**
 * Wraps content in the core responsive email wrapper.
 */
function wrapInEmailContainer(content: string, preheaderText: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Geosynthetics Africa</title>
<style>
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .stack { display: block !important; width: 100% !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#EDEFF2; -webkit-text-size-adjust:100%;">
  <!-- Preheader (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${escapeHtml(preheaderText)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EDEFF2;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. Customer Confirmation Email for Quote Requests (BOQ, Quick Quote, Product Quote)
 * Matches stakeholder template specification exactly.
 */
export function generateQuoteCustomerEmail(params: QuoteEmailParams): string {
  const reference = formatReference(params.reference);
  const dateStr = formatSubmissionDate(params.date);
  const name = escapeHtml(params.contactName || "there");
  const company = params.company ? escapeHtml(params.company) : "N/A";
  const country = params.country ? escapeHtml(params.country) : "Not specified";
  const product = params.productName ? escapeHtml(params.productName) : undefined;
  const projectDetails = params.projectDescription ? escapeHtml(params.projectDescription) : "Standard quote request.";

  let attachmentsStr = "None";
  if (Array.isArray(params.attachments) && params.attachments.length > 0) {
    attachmentsStr = params.attachments.map(a => escapeHtml(a)).join(", ");
  } else if (typeof params.attachments === "string" && params.attachments.trim()) {
    attachmentsStr = escapeHtml(params.attachments.trim());
  }

  const preheader = `Reference ${reference} · Your specs are with our engineering & sales team.`;

  const bodyContent = `
    ${renderEmailHeader(params.siteUrl)}

    <!-- ===== BODY ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:36px 40px 8px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; color:#8A94A6; text-transform:uppercase; padding-bottom:8px;">
              Quote request received
            </td>
          </tr>
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:24px; line-height:32px; font-weight:bold; color:#0C1F35; padding-bottom:20px;">
              Your specs are with our engineers.
            </td>
          </tr>
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#3D4756; padding-bottom:12px;">
              Dear ${name},
            </td>
          </tr>
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#3D4756; padding-bottom:24px;">
              Thank you for reaching out to <strong style="color:#0C1F35;">Geosynthetics Africa</strong>. Your quote request has been logged and assigned to our engineering &amp; sales team. <strong style="color:#0C1F35;">An engineer will respond with an official quotation within 24 hours.</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ===== TRANSMITTAL RECORD (summary block) ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:0 40px 28px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D8DEE6; border-left:4px solid #F2A900;">
          <tr>
            <td style="background-color:#F4F6F9; padding:14px 20px; border-bottom:1px solid #D8DEE6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; letter-spacing:2px; color:#0C1F35; text-transform:uppercase;">
                    Request summary
                  </td>
                  <td align="right" style="font-family:'Courier New', Courier, monospace; font-size:12px; color:#5A6B7E;">
                    REF&nbsp;${reference}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 20px 6px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3D4756;">
                ${product ? `
                <tr>
                  <td width="130" style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Product / System</td>
                  <td style="padding:6px 0; color:#0C1F35; font-weight:bold;">${product}</td>
                </tr>` : ""}
                <tr>
                  <td width="130" style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Company</td>
                  <td style="padding:6px 0; color:#0C1F35; font-weight:bold;">${company}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Country</td>
                  <td style="padding:6px 0;">${country}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Submitted</td>
                  <td style="padding:6px 0;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Project details</td>
                  <td style="padding:6px 0; line-height:22px; white-space:pre-wrap;">${projectDetails}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 16px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Attachments</td>
                  <td style="padding:6px 0 16px 0;">${attachmentsStr}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ===== WHAT HAPPENS NEXT ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:0 40px 28px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif;">
          <tr>
            <td style="font-size:11px; font-weight:bold; letter-spacing:2px; color:#0C1F35; text-transform:uppercase; padding-bottom:12px;">
              What happens next
            </td>
          </tr>
          <tr>
            <td style="font-size:14px; line-height:24px; color:#3D4756;">
              <strong style="color:#0C1F35;">1&nbsp;&nbsp;Review</strong> &mdash; An engineer reviews your specs, quantities and site conditions.<br>
              <strong style="color:#0C1F35;">2&nbsp;&nbsp;Quotation</strong> &mdash; You receive an official quotation covering material supply, pan-African logistics and, where required, QA/QC-controlled installation.<br>
              <strong style="color:#0C1F35;">3&nbsp;&nbsp;One contract</strong> &mdash; Design through certification, delivered under one contract, one crew, one signature.
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${renderCredentialsStrip()}
    ${renderCtaSection(params.siteUrl)}
    ${renderEmailFooter(params.siteUrl)}
  `;

  return wrapInEmailContainer(bodyContent, preheader);
}

/**
 * 2. Admin Notification Email for Quote Requests
 * Styled with high-contrast branded header and actionable lead breakdown.
 */
export function generateQuoteAdminEmail(params: QuoteEmailParams): string {
  const reference = formatReference(params.reference);
  const dateStr = formatSubmissionDate(params.date);
  const name = escapeHtml(params.contactName);
  const email = escapeHtml(params.contactEmail);
  const phone = params.contactPhone ? escapeHtml(params.contactPhone) : "Not provided";
  const company = params.company ? escapeHtml(params.company) : "Not provided";
  const country = params.country ? escapeHtml(params.country) : "Not specified";
  const product = params.productName ? escapeHtml(params.productName) : "General Quote Request";
  const projectDetails = params.projectDescription ? escapeHtml(params.projectDescription) : "None provided";

  const preheader = `[New Quote] ${name} (${product}) - REF: ${reference}`;

  const bodyContent = `
    ${renderEmailHeader(params.siteUrl)}

    <tr>
      <td style="background-color:#FFFFFF; padding:32px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif;">
          <tr>
            <td style="font-size:11px; letter-spacing:2px; color:#F2A900; font-weight:bold; text-transform:uppercase; padding-bottom:6px;">
              Admin Notification &middot; New Quote Request
            </td>
          </tr>
          <tr>
            <td style="font-size:22px; font-weight:bold; color:#0C1F35; padding-bottom:16px;">
              New Web Lead: ${name}
            </td>
          </tr>
          <tr>
            <td style="font-size:14px; color:#3D4756; padding-bottom:24px;">
              A new quote request was submitted on the website. Summary details are logged below:
            </td>
          </tr>
        </table>

        <!-- Summary Table -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D8DEE6; border-left:4px solid #0C1F35; font-family:Arial, Helvetica, sans-serif;">
          <tr style="background-color:#F4F6F9;">
            <td colspan="2" style="padding:12px 18px; border-bottom:1px solid #D8DEE6; font-size:12px; font-weight:bold; color:#0C1F35;">
              LEAD TRANSMITTAL &mdash; REF ${reference} (${dateStr})
            </td>
          </tr>
          <tr>
            <td width="130" style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Contact Name:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#0C1F35; font-weight:bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Email:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px;"><a href="mailto:${email}" style="color:#0C1F35; font-weight:bold; text-decoration:underline;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Phone:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#3D4756;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Company:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#3D4756;">${company}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Country:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#3D4756;">${country}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Product / Context:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#0C1F35; font-weight:bold;">${product}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; font-size:12px; font-weight:bold; color:#5A6B7E; vertical-align:top;">Project Details:</td>
            <td style="padding:10px 18px; font-size:14px; color:#3D4756; line-height:22px; white-space:pre-wrap;">${projectDetails}</td>
          </tr>
        </table>
      </td>
    </tr>

    ${renderEmailFooter(params.siteUrl)}
  `;

  return wrapInEmailContainer(bodyContent, preheader);
}

/**
 * 3. Customer Confirmation Email for General Contact Enquiries
 */
export function generateContactCustomerEmail(params: ContactEmailParams): string {
  const reference = formatReference(params.reference);
  const dateStr = formatSubmissionDate(params.date);
  const name = escapeHtml(params.contactName || "there");
  const messageText = escapeHtml(params.message);

  const preheader = `We received your message · Reference ${reference}`;

  const bodyContent = `
    ${renderEmailHeader(params.siteUrl)}

    <!-- ===== BODY ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:36px 40px 8px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; color:#8A94A6; text-transform:uppercase; padding-bottom:8px;">
              Enquiry Received
            </td>
          </tr>
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:24px; line-height:32px; font-weight:bold; color:#0C1F35; padding-bottom:20px;">
              We've received your message.
            </td>
          </tr>
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#3D4756; padding-bottom:12px;">
              Dear ${name},
            </td>
          </tr>
          <tr>
            <td style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:24px; color:#3D4756; padding-bottom:24px;">
              Thank you for contacting <strong style="color:#0C1F35;">Geosynthetics Africa</strong>. Our team has received your enquiry and an engineering/sales specialist will get back to you within 1 business day.
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ===== TRANSMITTAL RECORD ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:0 40px 28px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D8DEE6; border-left:4px solid #F2A900;">
          <tr>
            <td style="background-color:#F4F6F9; padding:14px 20px; border-bottom:1px solid #D8DEE6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:bold; letter-spacing:2px; color:#0C1F35; text-transform:uppercase;">
                    Enquiry Summary
                  </td>
                  <td align="right" style="font-family:'Courier New', Courier, monospace; font-size:12px; color:#5A6B7E;">
                    REF&nbsp;${reference}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 20px 16px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#3D4756;">
                <tr>
                  <td width="130" style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Submitted</td>
                  <td style="padding:6px 0;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:11px; letter-spacing:1px; color:#8A94A6; text-transform:uppercase; vertical-align:top;">Your Message</td>
                  <td style="padding:6px 0; line-height:22px; white-space:pre-wrap;">${messageText}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ===== WHAT HAPPENS NEXT ===== -->
    <tr>
      <td style="background-color:#FFFFFF; padding:0 40px 28px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif;">
          <tr>
            <td style="font-size:11px; font-weight:bold; letter-spacing:2px; color:#0C1F35; text-transform:uppercase; padding-bottom:12px;">
              What happens next
            </td>
          </tr>
          <tr>
            <td style="font-size:14px; line-height:24px; color:#3D4756;">
              <strong style="color:#0C1F35;">1&nbsp;&nbsp;Review</strong> &mdash; Our sales &amp; engineering team evaluates your request.<br>
              <strong style="color:#0C1F35;">2&nbsp;&nbsp;Response</strong> &mdash; We respond with technical advice or quote details within 24 hours.<br>
              <strong style="color:#0C1F35;">3&nbsp;&nbsp;Support</strong> &mdash; Continuous assistance from project consultation to certified installation.
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${renderCredentialsStrip()}
    ${renderCtaSection(params.siteUrl)}
    ${renderEmailFooter(params.siteUrl)}
  `;

  return wrapInEmailContainer(bodyContent, preheader);
}

/**
 * 4. Admin Notification Email for General Contact Enquiries
 */
export function generateContactAdminEmail(params: ContactEmailParams): string {
  const reference = formatReference(params.reference);
  const dateStr = formatSubmissionDate(params.date);
  const name = escapeHtml(params.contactName);
  const email = escapeHtml(params.contactEmail);
  const phone = params.contactPhone ? escapeHtml(params.contactPhone) : "Not provided";
  const messageText = escapeHtml(params.message);

  const preheader = `[Quick Contact] New Enquiry from ${name} - REF ${reference}`;

  const bodyContent = `
    ${renderEmailHeader(params.siteUrl)}

    <tr>
      <td style="background-color:#FFFFFF; padding:32px 40px;" class="px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial, Helvetica, sans-serif;">
          <tr>
            <td style="font-size:11px; letter-spacing:2px; color:#F2A900; font-weight:bold; text-transform:uppercase; padding-bottom:6px;">
              Admin Notification &middot; Website Contact Form
            </td>
          </tr>
          <tr>
            <td style="font-size:22px; font-weight:bold; color:#0C1F35; padding-bottom:16px;">
              New Message from ${name}
            </td>
          </tr>
        </table>

        <!-- Summary Table -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #D8DEE6; border-left:4px solid #0C1F35; font-family:Arial, Helvetica, sans-serif;">
          <tr style="background-color:#F4F6F9;">
            <td colspan="2" style="padding:12px 18px; border-bottom:1px solid #D8DEE6; font-size:12px; font-weight:bold; color:#0C1F35;">
              CONTACT TRANSMITTAL &mdash; REF ${reference} (${dateStr})
            </td>
          </tr>
          <tr>
            <td width="130" style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Contact Name:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#0C1F35; font-weight:bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Email:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px;"><a href="mailto:${email}" style="color:#0C1F35; font-weight:bold; text-decoration:underline;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:12px; font-weight:bold; color:#5A6B7E;">Phone:</td>
            <td style="padding:10px 18px; border-bottom:1px solid #E2E8F0; font-size:14px; color:#3D4756;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:10px 18px; font-size:12px; font-weight:bold; color:#5A6B7E; vertical-align:top;">Message:</td>
            <td style="padding:10px 18px; font-size:14px; color:#3D4756; line-height:22px; white-space:pre-wrap;">${messageText}</td>
          </tr>
        </table>
      </td>
    </tr>

    ${renderEmailFooter(params.siteUrl)}
  `;

  return wrapInEmailContainer(bodyContent, preheader);
}
