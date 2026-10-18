import { BUSINESS } from "@/lib/business-info";

/**
 * Email settings for form notifications. Server-side only: these read the
 * Vercel environment and must never be bundled into the browser.
 *
 *   BREVO_API_KEY          Brevo API key (required)
 *   BREVO_FROM_EMAIL       Sender address; must be a verified sender in Brevo
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
    apiKey: env("BREVO_API_KEY") || env("VITE_BREVO_API_KEY"),
    fromEmail: env("BREVO_FROM_EMAIL") || env("VITE_BREVO_FROM_EMAIL") || SALES_EMAIL,
    fromName: "Geosynthetics Africa",
    notifyEmail: env("NOTIFICATION_TO_EMAIL") || env("VITE_NOTIFICATION_TO_EMAIL") || SALES_EMAIL,
  };
}
