import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createPublicConfigCache,
  publicConfigQuery,
  publicConfigRequest,
} from "@/lib/public-config-cache";
import { servePublicConfig } from "@/routes/api.public-config";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
const url =
  "https://example.supabase.co/rest/v1/site_config?select=value&key=eq.template_product_categories";

describe("public navigation content cache", () => {
  it("accepts only the public configuration keys and fixed read shape", () => {
    expect(
      publicConfigQuery(new URLSearchParams("select=value&key=eq.template_product_categories")),
    ).toBeTruthy();
    for (const query of [
      "select=*&key=eq.template_product_categories",
      "select=value&key=eq.smtp_password",
      "select=value",
      "select=value&key=in.(homepage_content,private_settings)",
      "select=value&key=eq.seo_pages&or=(key.eq.secrets)",
      "select=value&key=eq.seo_pages&key=eq.secrets",
    ]) {
      expect(publicConfigQuery(new URLSearchParams(query))).toBeNull();
    }
  });
  it("never routes signed-in reads, writes, another origin, or non-content tables through the shared cache", () => {
    expect(
      publicConfigRequest(
        url,
        { headers: { Authorization: "Bearer public-key" } },
        "https://example.supabase.co",
        "public-key",
      ),
    ).toContain("/api/public-config?");
    expect(
      publicConfigRequest(
        url,
        { headers: { Authorization: "Bearer user-token" } },
        "https://example.supabase.co",
        "public-key",
      ),
    ).toBeNull();
    expect(
      publicConfigRequest(url, { method: "PATCH" }, "https://example.supabase.co", "public-key"),
    ).toBeNull();
    expect(
      publicConfigRequest(
        url.replace("site_config", "profiles"),
        undefined,
        "https://example.supabase.co",
        "public-key",
      ),
    ).toBeNull();
    expect(
      publicConfigRequest(url, undefined, "https://other.supabase.co", "public-key"),
    ).toBeNull();
  });
  it("deduplicates concurrent and subsequent reads without consuming another caller's response body", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('[{"value":{"heading":"HDPE"}}]'));
    let time = 0;
    const read = createPublicConfigCache(fetcher, () => time);
    const results = await Promise.all([
      read("/api/public-config?one"),
      read("/api/public-config?one"),
    ]);
    expect(await results[0].json()).toEqual(await results[1].json());
    await read("/api/public-config?one");
    expect(fetcher).toHaveBeenCalledTimes(1);
    time = 60_001;
    await read("/api/public-config?one");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("retries failures rather than caching them", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValue(new Response("[]"));
    const read = createPublicConfigCache(fetcher);
    expect((await read("/api/public-config?one")).status).toBe(503);
    expect((await read("/api/public-config?one")).status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("serves anonymously with cache tags and never forwards a visitor's authorization or cookies", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "public-key");
    const upstream = vi.fn().mockResolvedValue(new Response('[{"value":{"heading":"HDPE"}}]'));
    vi.stubGlobal("fetch", upstream);
    const response = await servePublicConfig(
      new Request(
        "https://site.example/api/public-config?select=value&key=eq.template_product_categories",
        { headers: { Authorization: "Bearer user-token", Cookie: "private=session" } },
      ),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Vercel-CDN-Cache-Control")).toContain("s-maxage=3600");
    expect(response.headers.get("Vercel-Cache-Tag")).toBe("site-pages");
    const sent = upstream.mock.calls[0][1].headers;
    expect(sent.Authorization).toBe("Bearer public-key");
    expect(sent.Cookie).toBeUndefined();
    expect(await response.json()).toEqual([{ value: { heading: "HDPE" } }]);
    expect(
      (
        await servePublicConfig(
          new Request(
            "https://site.example/api/public-config?select=value&key=eq.private_settings",
          ),
        )
      ).status,
    ).toBe(404);
    upstream.mockResolvedValue(new Response("error", { status: 500 }));
    const failed = await servePublicConfig(
      new Request("https://site.example/api/public-config?select=value&key=eq.seo_pages"),
    );
    expect(failed.headers.get("Vercel-CDN-Cache-Control")).toBe("no-store");
  });
});
