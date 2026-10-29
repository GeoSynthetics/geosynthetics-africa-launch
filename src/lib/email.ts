/**
 * Transactional email for the website forms, sent through the configured Resend or Brevo provider.
 * Sends the sales notification and the customer confirmation.
 */

import { createServerFn } from "@tanstack/react-start";
import { isPlaceholderEmail } from "@/lib/contact-input";
import { z } from "zod";
import {
  generateQuoteCustomerEmail,
  generateQuoteAdminEmail,
  generateContactCustomerEmail,
  generateContactAdminEmail,
  formatReference,
} from "./email-templates";
import { SITE_URL } from "@/lib/site-url";
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

/** Keep sales notifications and customer replies on the same clear subject. */
function enquirySubject(reference: string, productName?: string): string {
  const shortReference = /^GSA-/i.test(reference)
    ? reference
    : `GSA-${reference.replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase()}`;
  const product = productName?.replace(/[\r\n|]/g, " ").replace(/\s+/g, " ").trim();
  const topic = product && !/^(general quote|geosynthetics)$/i.test(product)
    ? product.slice(0, 50).trim()
    : "geosynthetics";
  return `Your ${topic} enquiry | ${shortReference}`;
}

/** Formats a recipient as Resend expects: `Name <email>` or just `email`. */
function formatAddress({ email, name }: EmailRecipient): string {
  const cleanName = (name || "").replace(/[<>"\r\n]/g, "").trim();
  return cleanName ? `${cleanName} <${email}>` : email;
}

/**
 * Sends a transactional email through the configured provider API.
 * Server-side only: the API key is read from the Vercel environment.
 */
export async function sendEmail(
  payload: SendEmailPayload,
): Promise<{ success: boolean; messageId?: string }> {
  const { provider, apiKey, fromEmail, fromName } = getEmailConfig();

  if (!apiKey) {
    console.error("[Email] No server-side email API key is configured. Email not sent.");
    return { success: false };
  }

  try {
    const isBrevo = provider === "brevo";
    const response = await fetch(
      isBrevo ? "https://api.brevo.com/v3/smtp/email" : "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          ...(isBrevo ? { "api-key": apiKey } : { Authorization: `Bearer ${apiKey}` }),
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify(
          isBrevo
            ? {
                sender: { email: fromEmail, name: fromName },
                to: payload.to,
                ...(payload.cc?.length ? { cc: payload.cc } : {}),
                ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
                subject: payload.subject,
                htmlContent: payload.htmlContent,
                ...(payload.textContent ? { textContent: payload.textContent } : {}),
              }
            : {
                from: formatAddress({ email: fromEmail, name: fromName }),
                to: payload.to.map(formatAddress),
                ...(payload.cc?.length ? { cc: payload.cc.map(formatAddress) } : {}),
                ...(payload.replyTo ? { reply_to: formatAddress(payload.replyTo) } : {}),
                subject: payload.subject,
                html: payload.htmlContent,
                ...(payload.textContent ? { text: payload.textContent } : {}),
              },
        ),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Email] ${provider} API error ${response.status}:`, errorText);
      return { success: false };
    }

    const result = (await response.json()) as { id?: string; messageId?: string };
    console.log(
      `[Email] Accepted by ${provider}. ID: ${result.id || result.messageId} to ${payload.to.map((t) => t.email).join(", ")}`,
    );
    return { success: true, messageId: result.id || result.messageId };
  } catch (err) {
    console.error("[Email] Could not reach the email provider:", err);
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
  const hasRealEmail = !isPlaceholderEmail(params.contactEmail);

  const reference = formatReference(params.reference);
  const siteUrl = SITE_URL;
  const subject = enquirySubject(reference, params.productName);

  const customerHtml = generateQuoteCustomerEmail({ ...params, reference, siteUrl });
  const adminHtml = generateQuoteAdminEmail({ ...params, reference, siteUrl });

  // Notify the sales team first: this is the email that must arrive
  const admin = await sendEmail({
    to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
    ...(hasRealEmail ? { replyTo: { email: params.contactEmail, name: params.contactName } } : {}),
    subject,
    htmlContent: adminHtml,
  });

  // Confirmation to the customer (skipped when they left only a phone number)
  if (!hasRealEmail) return { adminSent: admin.success, customerSent: false };
  const customer = await sendEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail, name: "Geosynthetics Sales Team" },
    subject,
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
  const hasRealEmail = !isPlaceholderEmail(params.contactEmail);

  const reference = formatReference(params.reference);
  const siteUrl = SITE_URL;
  const subject = enquirySubject(reference);

  const customerHtml = generateContactCustomerEmail({ ...params, reference, siteUrl });
  const adminHtml = generateContactAdminEmail({ ...params, reference, siteUrl });

  // Notify the sales team first: this is the email that must arrive
  const admin = await sendEmail({
    to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
    ...(hasRealEmail ? { replyTo: { email: params.contactEmail, name: params.contactName } } : {}),
    subject,
    htmlContent: adminHtml,
  });

  // Confirmation to the customer (skipped when they left only a phone number)
  if (!hasRealEmail) return { adminSent: admin.success, customerSent: false };
  const customer = await sendEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail, name: "Geosynthetics Sales Team" },
    subject,
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
 * Notifies the sales mailbox (NOTIFICATION_TO_EMAIL, default sales@geosyntheticsafrica.com)
 * and, when the enquirer left an email address, sends them a confirmation.
 * Recipients are set here on the server so the client cannot choose them.
 */
export async function dispatchHeroProjectEmails(
  params: SendHeroProjectEmailParams,
): Promise<{ notified: boolean }> {
  const adminEmail = getEmailConfig().notifyEmail;

  const reference = formatReference(params.reference);
  const siteUrl = SITE_URL;
  const subject = enquirySubject(reference);
  const contactName = params.contact.split("@")[0].slice(0, 50) || params.contact;
  const projectDescription = params.attachmentName
    ? `${params.need}\n\nAttached BOQ / drawing: ${params.attachmentName}\nDownload it from ${siteUrl}/admin/quotes`
    : params.need;

  const templateParams = {
    contactName,
    contactEmail: params.contactEmail ?? "Not provided",
    contactPhone: params.contactPhone,
    country: params.region,
    productName: `Hero Project Request — ${params.region}`,
    projectDescription,
    attachments: params.attachmentName,
    reference,
    siteUrl,
  };

  // All enquiries go to the sales mailbox; the region is included in the message body.
  const { success: notified } = await sendEmail({
    to: [{ email: adminEmail, name: "Geosynthetics Sales" }],
    replyTo: params.contactEmail ? { email: params.contactEmail, name: contactName } : undefined,
    subject,
    htmlContent: generateQuoteAdminEmail(templateParams),
  });

  if (params.contactEmail) {
    await sendEmail({
      to: [{ email: params.contactEmail, name: contactName }],
      replyTo: { email: adminEmail, name: "Geosynthetics Sales Team" },
      subject,
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
