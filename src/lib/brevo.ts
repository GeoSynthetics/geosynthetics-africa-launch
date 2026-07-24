/**
 * Brevo (formerly Sendinblue) Transactional Email Utility
 * Integrates with Brevo REST API v3 to send automated customer confirmations and admin notifications.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  generateQuoteCustomerEmail,
  generateQuoteAdminEmail,
  generateContactCustomerEmail,
  generateContactAdminEmail,
  formatReference,
} from "./email-templates";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailPayload {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: EmailRecipient;
}

export interface SendQuoteEmailParams {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  company?: string;
  country?: string;
  productName?: string;
  projectDescription?: string;
  attachments?: string[] | string;
  reference?: string;
}

/**
 * Sends a transactional email using Brevo HTTP API v3.
 */
export async function sendBrevoEmail(
  payload: SendEmailPayload,
): Promise<{ success: boolean; messageId?: string }> {
  const apiKey = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;

  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.VITE_BREVO_FROM_EMAIL;

  const fromName = "Geosynthetics Africa";

  if (!apiKey) {
    console.warn("[Brevo] API key missing. Email sending skipped.");
    return { success: false };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        htmlContent: payload.htmlContent,
        textContent: payload.textContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Brevo API Error ${response.status}]:`, errorText);
      return { success: false };
    }

    const result = (await response.json()) as { messageId?: string };
    console.log(
      `[Brevo Email Sent Successfully] Message ID: ${result.messageId} to ${payload.to.map((t) => t.email).join(", ")}`,
    );
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("[Brevo Email Exception]:", err);
    return { success: false };
  }
}

/**
 * Sends both Customer Confirmation and Admin Notification emails upon quote submission.
 */
export async function dispatchQuoteEmails(params: SendQuoteEmailParams): Promise<void> {
  const adminEmail = process.env.NOTIFICATION_TO_EMAIL || process.env.VITE_NOTIFICATION_TO_EMAIL;

  const reference = formatReference(params.reference);
  const siteUrl = process.env.VITE_SITE_URL;

  const customerHtml = generateQuoteCustomerEmail({ ...params, reference, siteUrl });
  const adminHtml = generateQuoteAdminEmail({ ...params, reference, siteUrl });

  // Send to customer
  await sendBrevoEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail ?? "sales@geosynthetics.co.za", name: "Geosynthetics Sales Team" },
    subject: `Quote request received — we will respond within 24 hours | Geosynthetics Africa (REF ${reference})`,
    htmlContent: customerHtml,
  });

  // Send notification to admin
  if (adminEmail && adminEmail !== params.contactEmail) {
    await sendBrevoEmail({
      to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
      replyTo: { email: params.contactEmail, name: params.contactName },
      subject: `[New Quote] ${params.contactName} (${params.productName || "General Quote"}) — REF ${reference}`,
      htmlContent: adminHtml,
    });
  }
}

const sendQuoteEmailParamsSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  productName: z.string().optional(),
  projectDescription: z.string().optional(),
  attachments: z.union([z.array(z.string()), z.string()]).optional(),
  reference: z.string().optional(),
});

/**
 * TanStack Start Server Function to trigger Brevo email dispatch safely from client components.
 */
export const sendQuoteEmailFn = createServerFn({ method: "POST" })
  .inputValidator(sendQuoteEmailParamsSchema)
  .handler(async ({ data }) => {
    await dispatchQuoteEmails(data);
    return { success: true };
  });

// ─── Contact Form (Quick Contact / General Enquiry) ──────────────────────────

export interface SendContactEmailParams {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  company?: string;
  country?: string;
  message: string;
  reference?: string;
}

/**
 * Sends both a customer confirmation and an admin notification for a quick-contact enquiry.
 */
export async function dispatchContactEmails(params: SendContactEmailParams): Promise<void> {
  const adminEmail = process.env.NOTIFICATION_TO_EMAIL || process.env.VITE_NOTIFICATION_TO_EMAIL;

  const reference = formatReference(params.reference);
  const siteUrl = process.env.VITE_SITE_URL;

  const customerHtml = generateContactCustomerEmail({ ...params, reference, siteUrl });
  const adminHtml = generateContactAdminEmail({ ...params, reference, siteUrl });

  // Send confirmation to the enquirer
  await sendBrevoEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail ?? "sales@geosynthetics.co.za", name: "Geosynthetics Sales Team" },
    subject: `We received your message — Geosynthetics Africa (REF ${reference})`,
    htmlContent: customerHtml,
  });

  // Notify the admin / sales team
  if (adminEmail && adminEmail !== params.contactEmail) {
    await sendBrevoEmail({
      to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
      replyTo: { email: params.contactEmail, name: params.contactName },
      subject: `[Quick Contact] ${params.contactName} — REF ${reference}`,
      htmlContent: adminHtml,
    });
  }
}

const sendContactEmailParamsSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  message: z.string(),
  reference: z.string().optional(),
});

/**
 * TanStack Start Server Function to trigger contact email dispatch safely from client components.
 */
export const sendContactEmailFn = createServerFn({ method: "POST" })
  .inputValidator(sendContactEmailParamsSchema)
  .handler(async ({ data }) => {
    await dispatchContactEmails(data);
    return { success: true };
  });
