import { describe, it, expect } from "vitest";
import { PRODUCT_CATEGORIES } from "@/components/site/mega-menu-data";
import { getDefaultSections } from "@/lib/hierarchy-utils";

describe("Product Categories Unification", () => {
  const EXPECTED_CATEGORIES = [
    { slug: "geomembranes", label: "Geomembranes" },
    { slug: "geotextiles", label: "Geotextiles" },
    { slug: "geogrids", label: "Geogrids" },
    { slug: "geocells", label: "Geocells" },
    { slug: "gcls", label: "GCLs" },
    { slug: "drainage-composites", label: "Drainage Composites" },
    { slug: "erosion-control", label: "Erosion Control" },
    { slug: "damp-proofing", label: "Damp Proofing" },
    { slug: "dewatering-systems", label: "Dewatering Systems" },
    { slug: "gabion-baskets", label: "Gabion Baskets" },
    { slug: "accessories", label: "Tools & Accessories" },
  ];

  it("PRODUCT_CATEGORIES contains all 11 unified categories matching database", () => {
    expect(PRODUCT_CATEGORIES).toHaveLength(11);

    for (const expected of EXPECTED_CATEGORIES) {
      const found = PRODUCT_CATEGORIES.find((c) => c.slug === expected.slug);
      expect(found).toBeDefined();
      expect(found?.label).toBe(expected.label);
    }
  });

  it("getDefaultSections includes all 11 categories in products hierarchy", () => {
    const sections = getDefaultSections();
    const productsSection = sections.find((s) => s.key === "products");
    expect(productsSection).toBeDefined();
    expect(productsSection?.items).toHaveLength(11);

    for (const expected of EXPECTED_CATEGORIES) {
      const item = productsSection?.items.find((i) => i.slug === expected.slug);
      expect(item).toBeDefined();
      expect(item?.label).toBe(expected.label);
      expect(item?.to).toBe("/products/$category");
      expect(item?.params).toEqual({ category: expected.slug });
    }
  });
});
