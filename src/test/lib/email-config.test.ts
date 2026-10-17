import { describe, it, expect, afterEach } from "vitest";
import { getEmailConfig, SALES_EMAIL } from "@/lib/email-config";

const KEYS = ["NOTIFICATION_TO_EMAIL", "VITE_NOTIFICATION_TO_EMAIL", "BREVO_FROM_EMAIL", "VITE_BREVO_FROM_EMAIL"];
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("getEmailConfig", () => {
  it("sends enquiries to sales@geosyntheticsafrica.com when nothing is configured", () => {
    for (const k of KEYS) delete process.env[k];
    const cfg = getEmailConfig();
    expect(SALES_EMAIL).toBe("sales@geosyntheticsafrica.com");
    expect(cfg.notifyEmail).toBe(SALES_EMAIL);
    expect(cfg.fromEmail).toBe(SALES_EMAIL);
  });

  it("uses the Vercel settings when present", () => {
    process.env.NOTIFICATION_TO_EMAIL = "leads@example.com";
    process.env.BREVO_FROM_EMAIL = "noreply@example.com";
    const cfg = getEmailConfig();
    expect(cfg.notifyEmail).toBe("leads@example.com");
    expect(cfg.fromEmail).toBe("noreply@example.com");
  });
});
