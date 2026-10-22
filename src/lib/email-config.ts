import { BUSINESS } from "@/lib/business-info";

/**
 * Email settings for form notifications. Server-side only: these read the
 * Vercel environment and must never be bundled into the browser.
 *
 *   RESEND_API_KEY         Resend API key (required)
 *   EMAIL_FROM             Sender address; its domain must be verified in Resend
 *   NOTIFICATION_TO_EMAIL  Mailbox that receives every enquiry
 *
 * Sender and recipient default to sales@geosyntheticsafrica.com.
 */
export const SALES_EMAIL = BUSINESS.email;

function env(name: string): string {
  if (typeof process === "undefined") return "";
  return (process.env?.[name] || "").trim();
}

export function getEmailConfig() {
  return {
    apiKey: env("RESEND_API_KEY"),
    fromEmail: env("EMAIL_FROM") || SALES_EMAIL,
    fromName: "Geosynthetics Africa",
    notifyEmail: env("NOTIFICATION_TO_EMAIL") || SALES_EMAIL,
  };
}
