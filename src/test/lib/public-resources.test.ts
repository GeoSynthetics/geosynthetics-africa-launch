import { beforeEach, describe, expect, it, vi } from "vitest";
const { query, from, signed } = vi.hoisted(() => {
  const query: any = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
  };
  for (const name of ["select", "eq", "order"]) query[name].mockReturnValue(query);
  return { query, from: vi.fn(() => query), signed: vi.fn() };
});
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from, storage: { from: () => ({ createSignedUrl: signed }) } },
}));
import { fetchPublishedResources, resourceCategoryFor } from "@/lib/public-resources";
import { Route } from "@/routes/api.resources.$slug.download";
const row = {
  id: "tds-1",
  slug: "geodrain",
  title: "GeoDrain",
  type: "tds",
  description: null,
  file_path: "drain.pdf",
  external_url: null,
  is_public: true,
  created_at: "2026-11-11",
};
const get = (slug: string) => (Route.options as any).server.handlers.GET({ params: { slug } });

describe("published technical resources", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("filters publication status and surfaces backend failures instead of reporting an empty catalogue", async () => {
    query.limit.mockResolvedValue({ data: [row], error: null });
    expect(await fetchPublishedResources()).toEqual([row]);
    expect(query.eq).toHaveBeenCalledWith("status", "published");
    query.limit.mockResolvedValue({ data: null, error: new Error("offline") });
    await expect(fetchPublishedResources()).rejects.toThrow("offline");
  });
  it("never signs a gated or missing document", async () => {
    query.maybeSingle.mockResolvedValue({ data: { ...row, is_public: false }, error: null });
    expect((await get(row.slug)).status).toBe(404);
    expect(signed).not.toHaveBeenCalled();
    query.maybeSingle.mockResolvedValue({ data: null, error: null });
    expect((await get("missing")).status).toBe(404);
  });
  it("provides a fresh download redirect without caching the signed URL", async () => {
    query.maybeSingle.mockResolvedValue({ data: row, error: null });
    signed.mockResolvedValue({
      data: { signedUrl: "https://files.example.com/drain.pdf?token=test" },
      error: null,
    });
    const response = await get(row.slug);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toContain("drain.pdf");
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(query.eq).toHaveBeenCalledWith("status", "published");
  });
  it("assigns a single preferred category to video resources", () => {
    expect(
      resourceCategoryFor({ ...row, external_url: "https://www.youtube.com/watch?v=123" })?.slug,
    ).toBe("videos");
    expect(resourceCategoryFor(row)?.slug).toBe("datasheets");
  });
});
