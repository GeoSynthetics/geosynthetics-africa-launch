/**
 * Brevo (formerly Sendinblue) Transactional Email Utility
 * Integrates with Brevo REST API v3 to send automated customer confirmations and admin notifications.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
}

/**
 * Sends a transactional email using Brevo HTTP API v3.
 */
export async function sendBrevoEmail(payload: SendEmailPayload): Promise<{ success: boolean; messageId?: string }> {
  const apiKey =
    process.env.BREVO_API_KEY ||
    process.env.VITE_BREVO_API_KEY;

  const fromEmail =
    process.env.BREVO_FROM_EMAIL ||
    process.env.VITE_BREVO_FROM_EMAIL;

  const fromName = "GeoSynthetics Africa";

  if (!apiKey) {
    console.warn("[Brevo] API key missing. Email sending skipped.");
    return { success: false };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
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
    console.log(`[Brevo Email Sent Successfully] Message ID: ${result.messageId} to ${payload.to.map(t => t.email).join(", ")}`);
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
  const adminEmail =
    process.env.NOTIFICATION_TO_EMAIL ||
    process.env.VITE_NOTIFICATION_TO_EMAIL;

  // 1. Email to Customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Quote Request Received</h2>
      <p>Dear ${params.contactName},</p>
      <p>Thank you for reaching out to <strong>GeoSynthetics Africa</strong>. We have successfully received your quote request.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e293b;">Summary of your request:</h3>
        <ul style="list-style: none; padding-left: 0; line-height: 1.6;">
          ${params.productName ? `<li><strong>Product / Service:</strong> ${params.productName}</li>` : ""}
          ${params.company ? `<li><strong>Company:</strong> ${params.company}</li>` : ""}
          ${params.country ? `<li><strong>Country:</strong> ${params.country}</li>` : ""}
          ${params.projectDescription ? `<li><strong>Project Details:</strong> ${params.projectDescription}</li>` : ""}
        </ul>
      </div>

      <p>Our engineering & sales team will review your specs and respond with an official quotation shortly.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">GeoSynthetics Africa — High-Performance Geosynthetic Solutions across the Continent.</p>
    </div>
  `;

  // 2. Email to Admin / Sales Team
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb;">New Web Quote Submission</h2>
      <p>A new quote request has been submitted on the GeoSynthetics website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.contactName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${params.contactEmail}">${params.contactEmail}</a></td></tr>
        ${params.contactPhone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.contactPhone}</td></tr>` : ""}
        ${params.company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.company}</td></tr>` : ""}
        ${params.country ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Country:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.country}</td></tr>` : ""}
        ${params.productName ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Product:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.productName}</td></tr>` : ""}
        ${params.projectDescription ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Project Details:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.projectDescription}</td></tr>` : ""}
      </table>
    </div>
  `;

  // Send to customer
  await sendBrevoEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail ?? "", name: "GeoSynthetics Sales Team" },
    subject: "We received your quote request — GeoSynthetics Africa",
    htmlContent: customerHtml,
  });

  // Send notification to admin
  if (adminEmail && adminEmail !== params.contactEmail) {
    await sendBrevoEmail({
      to: [{ email: adminEmail, name: "GeoSynthetics Sales" }],
      replyTo: { email: params.contactEmail, name: params.contactName },
      subject: `[New Quote] ${params.contactName} (${params.productName || "General Quote"})`,
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
  message: string;
}

/**
 * Sends both a customer confirmation and an admin notification for a quick-contact enquiry.
 */
export async function dispatchContactEmails(params: SendContactEmailParams): Promise<void> {
  const adminEmail =
    process.env.NOTIFICATION_TO_EMAIL ||
    process.env.VITE_NOTIFICATION_TO_EMAIL;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">We've Received Your Message</h2>
      <p>Dear ${params.contactName},</p>
      <p>Thank you for contacting <strong>GeoSynthetics Africa</strong>. Our team has received your enquiry and will get back to you within 1 business day.</p>

      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e293b;">Your message:</h3>
        <p style="white-space: pre-wrap;">${params.message}</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">GeoSynthetics Africa — High-Performance Geosynthetic Solutions across the Continent.</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb;">[Quick Contact] New Enquiry from Website</h2>
      <p>A new contact enquiry has been submitted:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.contactName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${params.contactEmail}">${params.contactEmail}</a></td></tr>
        ${params.contactPhone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.contactPhone}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${params.message}</td></tr>
      </table>
    </div>
  `;

  // Send confirmation to the enquirer
  await sendBrevoEmail({
    to: [{ email: params.contactEmail, name: params.contactName }],
    replyTo: { email: adminEmail ?? "", name: "GeoSynthetics Sales Team" },
    subject: "We received your message — GeoSynthetics Africa",
    htmlContent: customerHtml,
  });

  // Notify the admin / sales team
  if (adminEmail && adminEmail !== params.contactEmail) {
    await sendBrevoEmail({
      to: [{ email: adminEmail, name: "GeoSynthetics Sales" }],
      replyTo: { email: params.contactEmail, name: params.contactName },
      subject: `[Quick Contact] ${params.contactName}`,
      htmlContent: adminHtml,
    });
  }
}

const sendContactEmailParamsSchema = z.object({
  contactName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string().optional(),
  message: z.string(),
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
