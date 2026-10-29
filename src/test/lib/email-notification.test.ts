import { describe, expect, it, vi } from "vitest";
import { checkEmailNotification } from "@/lib/email-notification";

describe("saved enquiry notification", () => {
  it("waits for notification acceptance before reporting success", async () => {
    let complete!: (value: { success: boolean }) => void;
    const pending = new Promise<{ success: boolean }>((resolve) => {
      complete = resolve;
    });
    let finished = false;
    const result = checkEmailNotification(pending).then((ok) => {
      finished = true;
      return ok;
    });
    await Promise.resolve();
    expect(finished).toBe(false);
    complete({ success: true });
    expect(await result).toBe(true);
  });

  it("reports rejection without throwing away the saved enquiry", async () => {
    expect(await checkEmailNotification(Promise.resolve({ success: false }))).toBe(false);
    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await checkEmailNotification(Promise.reject(new Error("offline")))).toBe(false);
    log.mockRestore();
  });
});
