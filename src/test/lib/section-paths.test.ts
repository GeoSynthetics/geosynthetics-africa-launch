import { describe, it, expect, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: vi.fn() } }));

import { canonicalProductPath, findItem, sectionPath } from "@/lib/section-paths";

const industries = [
  { id: "construction-infrastructure", slug: "mining-minerals-processing" },
  { id: "mining", slug: "water-utilities-irrigation" },
];

const products = [
  {
    id: "accessories",
    slug: "gabion-baskets",
    children: [{ id: "fixing-pins", slug: "river-reno-matresses" }],
  },
  { id: "tester-category", slug: "geosynthetic-clay-liners-gcl", children: [] },
];

describe("section-paths", () => {
  it("nests section pages under their section", () => {
    expect(sectionPath("applications", "tailings-storage-facility-lining")).toBe(
      "/applications/tailings-storage-facility-lining",
    );
  });

  it("matches a slug before an internal id", () => {
    expect(findItem(industries, "water-utilities-irrigation")?.id).toBe("mining");
    expect(findItem(industries, "mining")?.slug).toBe("water-utilities-irrigation");
  });

  it("resolves product category ids and old names to slugs", () => {
    expect(canonicalProductPath(products, "accessories")?.path).toBe("/products/gabion-baskets");
    expect(canonicalProductPath(products, "gcls")?.path).toBe(
      "/products/geosynthetic-clay-liners-gcl",
    );
    expect(canonicalProductPath(products, "unknown")).toBeNull();
  });

  it("resolves product family ids to slugs", () => {
    expect(canonicalProductPath(products, "accessories", "fixing-pins")?.path).toBe(
      "/products/gabion-baskets/river-reno-matresses",
    );
  });
});
