import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail, dispatchQuoteEmails } from "@/lib/email";

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
