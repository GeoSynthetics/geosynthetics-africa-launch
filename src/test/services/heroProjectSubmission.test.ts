import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { insertResult, sendHeroProjectEmailFn } = vi.hoisted(() => ({
  insertResult: {
    current: { data: { id: "quote-123" }, error: null as { message: string } | null },
  },
  sendHeroProjectEmailFn: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) },
    from: () => ({
      insert: () => ({ select: () => ({ maybeSingle: async () => insertResult.current }) }),
    }),
    storage: { from: () => ({ upload: vi.fn().mockResolvedValue({ error: null }) }) },
  },
}));

vi.mock("@/lib/email", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/email")>()),
  sendHeroProjectEmailFn,
}));

import { submitHeroProjectRequest } from "@/services/leadRoutingService";
import { dispatchHeroProjectEmails } from "@/lib/email";

const fetchMock = vi.fn();

beforeEach(() => {
  insertResult.current = { data: { id: "quote-123" }, error: null };
  sendHeroProjectEmailFn.mockReset().mockResolvedValue({ notified: true });
  fetchMock.mockReset().mockResolvedValue(new Response(JSON.stringify({ id: "m1" })));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("submitHeroProjectRequest", () => {
  it("sends the email through the server function, never the email API from the browser", async () => {
    const result = await submitHeroProjectRequest({
      need: "Geogrid for 40 km haul road",
      region: "Central Africa",
      contact: "buyer@mine.co",
    });

    expect(result.success).toBe(true);
    expect(sendHeroProjectEmailFn).toHaveBeenCalledWith({
      data: expect.objectContaining({
        need: "Geogrid for 40 km haul road",
        region: "Central Africa",
        contact: "buyer@mine.co",
        contactEmail: "buyer@mine.co",
        reference: "quote-123",
      }),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("passes a phone-only contact without a placeholder email", async () => {
    await submitHeroProjectRequest({
      need: "HDPE liner",
      region: "Southern Africa",
      contact: "+27 11 555 0100",
    });

    const { data } = sendHeroProjectEmailFn.mock.calls[0][0];
    expect(data.contactEmail).toBeUndefined();
    expect(data.contactPhone).toBe("+27 11 555 0100");
  });

  it("accepts separate email and phone fields", async () => {
    await submitHeroProjectRequest({
      need: "Floating cover",
      region: "East Africa",
      email: "buyer@utility.co",
      phone: "+255 22 000 000",
    });

    const { data } = sendHeroProjectEmailFn.mock.calls[0][0];
    expect(data.contactEmail).toBe("buyer@utility.co");
    expect(data.contactPhone).toBe("+255 22 000 000");
    expect(data.contact).toBe("buyer@utility.co · +255 22 000 000");
  });

  it("accepts a phone in the phone field only", async () => {
    await submitHeroProjectRequest({
      need: "GCL",
      region: "Not specified",
      email: "",
      phone: "+260 97 000 0000",
    });

    const { data } = sendHeroProjectEmailFn.mock.calls[0][0];
    expect(data.contactEmail).toBeUndefined();
    expect(data.contactPhone).toBe("+260 97 000 0000");
  });

  it("fails when neither the database save nor the email went through", async () => {
    insertResult.current = { data: null as never, error: { message: "permission denied" } };
    sendHeroProjectEmailFn.mockRejectedValue(new Error("network"));

    await expect(
      submitHeroProjectRequest({ need: "Liner", region: "West Africa", contact: "a@b.co" }),
    ).rejects.toThrow(/couldn't send your request/i);
  });

  it("still succeeds when the email fails but the request was saved", async () => {
    sendHeroProjectEmailFn.mockResolvedValue({ notified: false });

    const result = await submitHeroProjectRequest({
      need: "Liner",
      region: "West Africa",
      contact: "a@b.co",
    });
    expect(result.success).toBe(true);
  });
});

describe("dispatchHeroProjectEmails", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("EMAIL_FROM", "notifications@example.com");
    vi.stubEnv("NOTIFICATION_TO_EMAIL", "leads@example.com");
  });

  const sentBodies = () => fetchMock.mock.calls.map(([, init]) => JSON.parse(init.body));

  it("sends every region to the sales mailbox and confirms to the customer", async () => {
    const res = await dispatchHeroProjectEmails({
      need: "Geomembrane for tailings dam",
      region: "West Africa",
      contact: "buyer@mine.co",
      contactEmail: "buyer@mine.co",
    });

    expect(res.notified).toBe(true);
    const [team, customer] = sentBodies();
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.resend.com/emails");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer test-key");
    expect(team.from).toBe("Geosynthetics Africa <notifications@example.com>");
    expect(team.to).toEqual(["Geosynthetics Sales <leads@example.com>"]);
    expect(team.cc).toBeUndefined();
    expect(team.reply_to).toBe("buyer <buyer@mine.co>");
    expect(team.html).toContain("Geomembrane for tailings dam");
    expect(customer.to).toEqual(["buyer <buyer@mine.co>"]);
  });

  it("only notifies the team when the enquirer left a phone number", async () => {
    await dispatchHeroProjectEmails({
      need: "Geotextile",
      region: "Southern Africa",
      contact: "+27 11 555 0100",
      contactPhone: "+27 11 555 0100",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBodies()[0].to).toEqual(["Geosynthetics Sales <leads@example.com>"]);
  });

  it("reports failure when Resend rejects the team notification", async () => {
    fetchMock.mockResolvedValue(new Response("unauthorised", { status: 401 }));

    const res = await dispatchHeroProjectEmails({
      need: "Geotextile",
      region: "East Africa",
      contact: "+254 700 000000",
    });
    expect(res.notified).toBe(false);
  });
});
