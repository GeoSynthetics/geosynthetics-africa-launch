/**
 * Transactional email for the website forms, sent through Resend (resend.com).
 * Sends the sales/regional notification and the customer confirmation.
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
import { SITE_URL } from "@/lib/site-url";
import { resolveRegionalRouting } from "@/types/regionalCoverage";
import { getEmailConfig } from "@/lib/email-config";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailPayload {
  to: EmailRecipient[];
  cc?: EmailRecipient[];
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

/** Formats a recipient as Resend expects: `Name <email>` or just `email`. */
function formatAddress({ email, name }: EmailRecipient): string {
  const cleanName = (name || "").replace(/[<>"\r\n]/g, "").trim();
  return cleanName ? `${cleanName} <${email}>` : email;
}

/**
 * Sends a transactional email through the Resend API.
 * Server-side only: the API key is read from the Vercel environment.
 */
export async function sendEmail(
  payload: SendEmailPayload,
): Promise<{ success: boolean; messageId?: string }> {
  const { apiKey, fromEmail, fromName } = getEmailConfig();

  if (!apiKey) {
    console.error("[Email] RESEND_API_KEY is not set. Email not sent.");
    return { success: false };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: formatAddress({ email: fromEmail, name: fromName }),
        to: payload.to.map(formatAddress),
        ...(payload.cc?.length ? { cc: payload.cc.map(formatAddress) } : {}),
        ...(payload.replyTo ? { reply_to: formatAddress(payload.replyTo) } : {}),
        subject: payload.subject,
        html: payload.htmlContent,
        ...(payload.textContent ? { text: payload.textContent } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Email] Resend API error ${response.status}:`, errorText);
      return { success: false };
    }

    const result = (await response.json()) as { id?: string };
    console.log(
      `[Email] Sent via Resend. ID: ${result.id} to ${payload.to.map((t) => t.email).join(", ")}`,
    );
    return { success: true, messageId: result.id };
  } catch (err) {
    console.error("[Email] Could not reach Resend:", err);
    return { success: false };
  }
}

/**
 * Sends both Customer Confirmation and Admin Notification emails upon quote submission.
 */
export async function dispatchQuoteEmails(
  params: SendQuoteEmailParams,
): Promise<{ adminSent: boolean; customerSent: boolean }> {
  const adminEmail = getEmailConfig().notifyEmail;

  const reference = formatReference(params.reference);
  const siteUrl = SITE_URL;

  const customerHtml = generateQuoteCustomerEmail({ ...params, reference, siteUrl });
  const adminHtml = generateQuoteAdminEmail({ ...params, reference, siteUrl });

  // Notify the sales team first: this is the email that must arrive
  const admin = await sendEmail({
    to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
    replyTo: { email: params.contactEmail, name: params.contactName },
    subject: `[New Quote] ${params.contactName} (${params.productName || "General Quote"}) — REF ${reference}`,
    htmlContent: adminHtml,
  });

  // Confirmation to the customer
  const customer = await sendEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail, name: "Geosynthetics Sales Team" },
    subject: `Quote request received — we will respond within 24 hours | Geosynthetics Africa (REF ${reference})`,
    htmlContent: customerHtml,
  });

  return { adminSent: admin.success, customerSent: customer.success };
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
 * TanStack Start Server Function to trigger email dispatch safely from client components.
 */
export const sendQuoteEmailFn = createServerFn({ method: "POST" })
  .inputValidator(sendQuoteEmailParamsSchema)
  .handler(async ({ data }) => {
    const result = await dispatchQuoteEmails(data);
    return { success: result.adminSent, ...result };
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
export async function dispatchContactEmails(
  params: SendContactEmailParams,
): Promise<{ adminSent: boolean; customerSent: boolean }> {
  const adminEmail = getEmailConfig().notifyEmail;

  const reference = formatReference(params.reference);
  const siteUrl = SITE_URL;

  const customerHtml = generateContactCustomerEmail({ ...params, reference, siteUrl });
  const adminHtml = generateContactAdminEmail({ ...params, reference, siteUrl });

  // Notify the sales team first: this is the email that must arrive
  const admin = await sendEmail({
    to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
    replyTo: { email: params.contactEmail, name: params.contactName },
    subject: `[Quick Contact] ${params.contactName} — REF ${reference}`,
    htmlContent: adminHtml,
  });

  // Confirmation to the customer
  const customer = await sendEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail, name: "Geosynthetics Sales Team" },
    subject: `We received your message — Geosynthetics Africa (REF ${reference})`,
    htmlContent: customerHtml,
  });

  return { adminSent: admin.success, customerSent: customer.success };
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
    const result = await dispatchContactEmails(data);
    return { success: result.adminSent, ...result };
  });

// ─── Hero "Start Your Project" Form ──────────────────────────────────────────

export interface SendHeroProjectEmailParams {
  need: string;
  region: string;
  contact: string;
  contactEmail?: string;
  contactPhone?: string;
  attachmentName?: string;
  reference?: string;
}

/**
 * Notifies the regional desk for the selected region (CC the central mailbox) and,
 * when the enquirer left an email address, sends them a confirmation.
 * Recipients are resolved here on the server so the client cannot choose them.
 */
export async function dispatchHeroProjectEmails(
  params: SendHeroProjectEmailParams,
): Promise<{ notified: boolean }> {
  const adminEmail = getEmailConfig().notifyEmail;
  const routing = resolveRegionalRouting(params.region);

  const reference = formatReference(params.reference);
  const siteUrl = SITE_URL;
  const contactName = params.contact.split("@")[0].slice(0, 50) || params.contact;
  const projectDescription = params.attachmentName
    ? `${params.need}\n\nAttached BOQ / drawing: ${params.attachmentName}\nDownload it from ${siteUrl}/admin/quotes`
    : params.need;

  const templateParams = {
    contactName,
    contactEmail: params.contactEmail ?? "Not provided",
    contactPhone: params.contactPhone,
    country: params.region,
    productName: `Hero Project Request — ${routing.targetName}`,
    projectDescription,
    attachments: params.attachmentName,
    reference,
    siteUrl,
  };

  const cc =
    adminEmail && adminEmail.toLowerCase() !== routing.targetEmail.toLowerCase()
      ? [{ email: adminEmail, name: "Geosynthetics Sales" }]
      : undefined;

  const { success: notified } = await sendEmail({
    to: [{ email: routing.targetEmail, name: routing.targetName }],
    cc,
    replyTo: params.contactEmail ? { email: params.contactEmail, name: contactName } : undefined,
    subject: `[New Project Request] ${params.region} — ${params.contact.slice(0, 40)} — REF ${reference}`,
    htmlContent: generateQuoteAdminEmail(templateParams),
  });

  if (params.contactEmail) {
    await sendEmail({
      to: [{ email: params.contactEmail, name: contactName }],
      replyTo: { email: routing.targetEmail, name: routing.targetName },
      subject: `Project request received — we will respond within 24 hours | Geosynthetics Africa (REF ${reference})`,
      htmlContent: generateQuoteCustomerEmail(templateParams),
    });
  }

  return { notified };
}

const sendHeroProjectEmailParamsSchema = z.object({
  need: z.string().trim().min(1).max(5000),
  region: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(200),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(50).optional(),
  attachmentName: z.string().max(255).optional(),
  reference: z.string().optional(),
});

/**
 * TanStack Start Server Function for the homepage hero form, so the email API key stays server-side.
 */
export const sendHeroProjectEmailFn = createServerFn({ method: "POST" })
  .inputValidator(sendHeroProjectEmailParamsSchema)
  .handler(async ({ data }) => dispatchHeroProjectEmails(data));
