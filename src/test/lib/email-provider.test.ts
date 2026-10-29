import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail, dispatchQuoteEmails, dispatchContactEmails, dispatchHeroProjectEmails } from "@/lib/email";

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("BREVO_API_KEY", "brevo-test-key");
  vi.stubEnv("BREVO_FROM_EMAIL", "verified@example.com");
  vi.stubEnv("NOTIFICATION_TO_EMAIL", "sales@example.com");
  fetchMock
    .mockReset()
    .mockResolvedValue(new Response(JSON.stringify({ messageId: "brevo-message" })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("configured email provider", () => {
  it("uses the existing Brevo key and preserves the customer's reply address", async () => {
    const result = await sendEmail({
      to: [{ email: "sales@example.com" }],
      replyTo: { email: "client@example.com", name: "Client" },
      subject: "Enquiry",
      htmlContent: "<p>HDPE liner</p>",
    });
    expect(result).toEqual({ success: true, messageId: "brevo-message" });
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(request.headers["api-key"]).toBe("brevo-test-key");
    expect(JSON.parse(request.body)).toMatchObject({
      sender: { email: "verified@example.com" },
      replyTo: { email: "client@example.com" },
      htmlContent: "<p>HDPE liner</p>",
    });
  });

  it("reports failure when the provider rejects the notification", async () => {
    fetchMock.mockResolvedValue(new Response("unauthorized", { status: 401 }));
    const result = await dispatchQuoteEmails({
      contactName: "Client",
      contactEmail: "client@example.com",
    });
    expect(result.adminSent).toBe(false);
  });

  it("does not send when neither provider has a key", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    expect(
      await sendEmail({
        to: [{ email: "sales@example.com" }],
        subject: "Enquiry",
        htmlContent: "Test",
      }),
    ).toEqual({ success: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});


describe("enquiry email subjects", () => {
  it("shares a product-specific subject and preserves reply routing", async () => {
    await dispatchQuoteEmails({ contactName: "Client", contactEmail: "client@example.com", productName: "HDPE liner", reference: "3630cd1f-eaa0-42b3-8476-fb2b06d1213f" });
    const [sales, customer] = fetchMock.mock.calls.map(([, request]) => JSON.parse(request.body));
    expect(sales.subject).toBe("Your HDPE liner enquiry | GSA-3630CD1FEA");
    expect(customer.subject).toBe(sales.subject);
    expect(sales.replyTo.email).toBe("client@example.com");
    expect(customer.replyTo.email).toBe("sales@example.com");
    expect(sales.htmlContent).toContain("3630cd1f-eaa0-42b3-8476-fb2b06d1213f");
  });

  it("uses a new short reference shared across contact messages", async () => {
    await dispatchContactEmails({ contactName: "Client", contactEmail: "client@example.com", message: "Please contact me" });
    const [sales, customer] = fetchMock.mock.calls.map(([, request]) => JSON.parse(request.body));
    expect(sales.subject).toMatch(/^Your geosynthetics enquiry \| GSA-[A-F0-9]{10}$/);
    expect(customer.subject).toBe(sales.subject);
    expect(sales.htmlContent).toContain(sales.subject.split(" | ")[1]);
  });

  it("keeps homepage subjects clear and distinct for each lead", async () => {
    for (const reference of ["3630cd1f-eaa0-42b3-8476-fb2b06d1213f", "12345678-abcd-42b3-8476-fb2b06d1213f"]) {
      await dispatchHeroProjectEmails({ need: "Project details", region: "Southern Africa", contact: "client@example.com", contactEmail: "client@example.com", reference });
    }
    const subjects = fetchMock.mock.calls.map(([, request]) => JSON.parse(request.body).subject);
    expect(subjects[0]).toBe("Your geosynthetics enquiry | GSA-3630CD1FEA");
    expect(subjects[1]).toBe(subjects[0]);
    expect(subjects[2]).not.toBe(subjects[0]);
    expect(subjects[3]).toBe(subjects[2]);
  });
});
