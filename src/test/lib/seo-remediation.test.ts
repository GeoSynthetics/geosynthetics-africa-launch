import { describe, expect, it } from "vitest";
import { countryBrandCopy } from "@/lib/country-brand-copy";
import { productFamilySeo } from "@/lib/product-family-seo";
import { correctFamilyContent } from "@/lib/product-content-corrections";

describe("public product information corrections", () => {
  it("updates legacy country branding but preserves live URLs and identifiers", () => {
    const input = {
      title: "Bidim geotextiles Zambia",
      seo: { description: "Bidim® for filtration" },
      slug: "bidim-zambia",
      imageUrl: "https://example.com/Bidim.jpg",
    };
    expect(countryBrandCopy(input)).toEqual({
      ...input,
      title: "MIRAFI® geotextiles Zambia",
      seo: { description: "MIRAFI® for filtration" },
    });
    expect(input.title).toBe("Bidim geotextiles Zambia");
  });
  it("replaces generic fallback descriptions while preserving deliberate CMS edits", () => {
    const seo = productFamilySeo("pp-polytape-silt-fence", "PolyTape", "Geotextiles", {
      seo: {
        description:
          "Explore our premium Pp Polytape Silt Fence, fully specified for African projects.",
      },
    });
    expect(seo.title).toContain("Sediment Control Africa");
    expect(seo.description).toContain("Selvedged edges");
    expect(
      productFamilySeo("pp-polytape-silt-fence", "PolyTape", "Geotextiles", {
        seo: { title: "Edited title", description: "Edited description" },
      }),
    ).toEqual({ title: "Edited title", description: "Edited description" });
  });
  it("removes only the unit-invalid flow row and preserves verified values", () => {
    const rows = [
      ["Water Flow Rate", "EN ISO 11058", "39 l/m²/s"],
      ["Water Flow Rate", "EN ISO 11058", "100 g/m²"],
      ["Mass per Unit Area", "EN ISO 9864", "145 g/m²"],
    ];
    const input = { propertiesTable: { headers: ["Property", "Method", "Value"], rows } };
    expect(correctFamilyContent("pp-polytape-silt-fence", input).propertiesTable.rows).toEqual([
      rows[0],
      rows[2],
    ]);
    expect(input.propertiesTable.rows).toHaveLength(3);
    expect(correctFamilyContent("another-family", input)).toBe(input);
  });
});
