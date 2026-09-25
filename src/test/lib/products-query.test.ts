import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { isUuid, fetchProductsByIdsOrSlugs } from "@/lib/products-query";
import { supabase } from "@/integrations/supabase/client";

vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe("products-query utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isUuid", () => {
    it("returns true for standard UUIDs", () => {
      expect(isUuid("b6d25153-84b0-4de7-b8fa-343235a5d649")).toBe(true);
      expect(isUuid("9F3CAEDB-C291-4D7A-8C92-818D20C9F510")).toBe(true);
      expect(isUuid("  74708d6b-8309-4148-b5dd-10714c0ec540  ")).toBe(true);
    });

    it("returns false for non-UUID strings, slugs, and invalid inputs", () => {
      expect(isUuid("hdpe-smooth-geomembrane")).toBe(false);
      expect(isUuid("bidim-geotextile")).toBe(false);
      expect(isUuid("12345")).toBe(false);
      expect(isUuid("")).toBe(false);
      expect(isUuid(null as any)).toBe(false);
      expect(isUuid(undefined as any)).toBe(false);
    });
  });

  describe("fetchProductsByIdsOrSlugs", () => {
    it("returns empty array for empty inputs", async () => {
      const result = await fetchProductsByIdsOrSlugs([]);
      expect(result).toEqual([]);
    });

    it("safely queries UUIDs and slugs separately, preserving input order", async () => {
      const mockUuidProduct = {
        id: "b6d25153-84b0-4de7-b8fa-343235a5d649",
        name: "HDPE Liner 1.5mm",
        slug: "hdpe-liner-1-5mm",
        product_categories: [{ slug: "geomembranes", name: "Geomembranes" }],
      };

      const mockSlugProduct = {
        id: "46ef9029-6a72-481f-89e7-fcc54fae0894",
        name: "Bidim Geotextile",
        slug: "bidim-geotextile",
        product_categories: { slug: "geotextiles", name: "Geotextiles" },
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockImplementation((col: string, vals: string[]) => {
            if (col === "id" && vals.includes("b6d25153-84b0-4de7-b8fa-343235a5d649")) {
              return Promise.resolve({ data: [mockUuidProduct], error: null });
            }
            if (col === "slug" && vals.includes("bidim-geotextile")) {
              return Promise.resolve({ data: [mockSlugProduct], error: null });
            }
            return Promise.resolve({ data: [], error: null });
          }),
        }),
      });

      // Request order: slug first, then UUID
      const identifiers = ["bidim-geotextile", "b6d25153-84b0-4de7-b8fa-343235a5d649"];
      const result = await fetchProductsByIdsOrSlugs(identifiers);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("bidim-geotextile");
      expect(result[1].id).toBe("b6d25153-84b0-4de7-b8fa-343235a5d649");
      expect(result[0].product_categories).toEqual({ slug: "geotextiles", name: "Geotextiles" });
      expect(result[1].product_categories).toEqual({ slug: "geomembranes", name: "Geomembranes" });
    });
  });
});
