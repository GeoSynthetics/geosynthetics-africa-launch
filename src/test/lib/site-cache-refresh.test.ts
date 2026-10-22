import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const refreshSiteCacheFn = vi.fn().mockResolvedValue({ refreshed: true });
vi.mock("@/lib/site-cache.functions", () => ({ refreshSiteCacheFn }));

const fetchMock = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  refreshSiteCacheFn.mockClear();
  fetchMock.mockReset().mockResolvedValue(new Response("[]", { status: 201, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.history.pushState({}, "", "/");
});

async function loadClient() {
  vi.resetModules();
  return (await import("@/integrations/supabase/client")).supabase;
}

describe("admin saves refresh the cached pages", () => {
  it("refreshes once after saves made in the admin", async () => {
    window.history.pushState({}, "", "/admin/site-builder");
    const supabase = await loadClient();
    await supabase.from("site_config").upsert({ key: "a", value: 1 } as never);
    await supabase.from("site_config").upsert({ key: "b", value: 2 } as never);
    await vi.advanceTimersByTimeAsync(2500);
    expect(refreshSiteCacheFn).toHaveBeenCalledTimes(1);
  });

  it("does nothing for reads or outside the admin", async () => {
    window.history.pushState({}, "", "/contacts");
    const supabase = await loadClient();
    await supabase.from("quote_requests").insert({ a: 1 } as never);
    window.history.pushState({}, "", "/admin");
    fetchMock.mockResolvedValue(new Response("[]", { status: 200, headers: { "content-type": "application/json" } }));
    await supabase.from("site_config").select("*");
    await vi.advanceTimersByTimeAsync(2500);
    expect(refreshSiteCacheFn).not.toHaveBeenCalled();
  });
});
