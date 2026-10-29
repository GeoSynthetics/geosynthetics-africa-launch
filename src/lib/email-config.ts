import { BUSINESS, ENQUIRY_EMAIL } from "@/lib/business-info";

/**
 * Email settings for form notifications. Server-side only: these read the
 * Vercel environment and must never be bundled into the browser.
 *
 *   RESEND_API_KEY         Resend API key (preferred when configured)
 *   BREVO_API_KEY          Existing Brevo API key, used when Resend is not configured
 *   BREVO_FROM_EMAIL       Verified Brevo sender
 *   EMAIL_FROM             Sender address; its domain must be verified in Resend
 *                          (default website@notify.geosyntheticsafrica.com)
 *   NOTIFICATION_TO_EMAIL  Mailbox that receives every enquiry
 *
 * Every form enquiry goes to info@geosyntheticsafrica.com by default. The sender uses the
 * notify. subdomain so Resend's DNS records stay separate from Microsoft 365 on
 * the main domain; replies go to the customer through reply-to.
 */
export const SALES_EMAIL = BUSINESS.email;
export { ENQUIRY_EMAIL };
export const DEFAULT_FROM_EMAIL = "website@notify.geosyntheticsafrica.com";

function env(name: string): string {
  if (typeof process === "undefined") return "";
  return (process.env?.[name] || "").trim();
}

export function getEmailConfig() {
  const resendKey = env("RESEND_API_KEY");
  const brevoKey = env("BREVO_API_KEY");
  const provider = resendKey ? "resend" : brevoKey ? "brevo" : "resend";
  return {
    provider,
    apiKey: resendKey || brevoKey,
    fromEmail:
      provider === "brevo"
        ? env("BREVO_FROM_EMAIL") || SALES_EMAIL
        : env("EMAIL_FROM") || DEFAULT_FROM_EMAIL,
    fromName: "Geosynthetics Africa",
    notifyEmail: env("NOTIFICATION_TO_EMAIL") || ENQUIRY_EMAIL,
  };
}
