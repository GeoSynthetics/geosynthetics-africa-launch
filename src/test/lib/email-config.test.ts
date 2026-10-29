import { describe, it, expect, afterEach } from "vitest";
import { getEmailConfig, ENQUIRY_EMAIL, DEFAULT_FROM_EMAIL } from "@/lib/email-config";

const KEYS = [
  "NOTIFICATION_TO_EMAIL",
  "VITE_NOTIFICATION_TO_EMAIL",
  "EMAIL_FROM",
  "RESEND_API_KEY",
  "BREVO_API_KEY",
  "BREVO_FROM_EMAIL",
];
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("getEmailConfig", () => {
  it("sends enquiries to info@geosyntheticsafrica.com when nothing is configured", () => {
    for (const k of KEYS) delete process.env[k];
    const cfg = getEmailConfig();
    expect(ENQUIRY_EMAIL).toBe("info@geosyntheticsafrica.com");
    expect(cfg.notifyEmail).toBe(ENQUIRY_EMAIL);
    expect(cfg.fromEmail).toBe(DEFAULT_FROM_EMAIL);
    expect(DEFAULT_FROM_EMAIL).toBe("website@notify.geosyntheticsafrica.com");
  });

  it("restores the configured Brevo provider when Resend is absent", () => {
    delete process.env.RESEND_API_KEY;
    process.env.BREVO_API_KEY = "existing-brevo-key";
    process.env.BREVO_FROM_EMAIL = "verified@example.com";
    expect(getEmailConfig()).toMatchObject({
      provider: "brevo",
      apiKey: "existing-brevo-key",
      fromEmail: "verified@example.com",
    });
  });

  it("uses Resend and its sender once a Resend key is configured", () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.BREVO_API_KEY = "existing-brevo-key";
    process.env.EMAIL_FROM = "resend@example.com";
    expect(getEmailConfig()).toMatchObject({
      provider: "resend",
      apiKey: "resend-key",
      fromEmail: "resend@example.com",
    });
  });

  it("uses the Vercel settings when present", () => {
    process.env.NOTIFICATION_TO_EMAIL = "leads@example.com";
    process.env.EMAIL_FROM = "noreply@example.com";
    const cfg = getEmailConfig();
    expect(cfg.notifyEmail).toBe("leads@example.com");
    expect(cfg.fromEmail).toBe("noreply@example.com");
  });
});
