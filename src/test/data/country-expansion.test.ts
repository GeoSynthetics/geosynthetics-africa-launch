import { describe, it, expect } from "vitest";
import { EXPANSION_COUNTRY_TEMPLATES, regionForCountry } from "@/data/country-expansion";
import { DEFAULT_COUNTRY_TEMPLATES } from "@/types/country-template";
import { mergeCountryTemplatesWithDefaults } from "@/hooks/use-country-templates";
import { toCountryLinks } from "@/routes/countries";

describe("country expansion", () => {
  it("adds the priority markets as country pages", () => {
    for (const country of ["Nigeria", "Egypt", "Morocco", "Ethiopia", "Angola", "Senegal"]) {
      const t = Object.values(DEFAULT_COUNTRY_TEMPLATES).find((x) => x.country === country);
      expect(t, country).toBeDefined();
      expect(t!.seo.title).toContain(country);
    }
  });

  it("uses the head office contact, not invented local offices", () => {
    for (const t of Object.values(EXPANSION_COUNTRY_TEMPLATES)) {
      expect(t.email).toBe("sales@geosyntheticsafrica.com");
      expect(t.phone).toBe("+27 72 343 0868");
    }
  });

  it("gives every country a region", () => {
    for (const t of Object.values(DEFAULT_COUNTRY_TEMPLATES)) {
      expect(regionForCountry(t.country), t.country).not.toBe("Other");
    }
  });

  it("lists each country once on the countries page", () => {
    const merged = mergeCountryTemplatesWithDefaults({
      "nigeria-lagos-page": { country: "Nigeria", slug: "nigeria-lagos-page" },
    });
    const links = toCountryLinks(merged).filter((l) => l.country === "Nigeria");
    expect(links).toHaveLength(1);
    expect(links[0].slug).toBe("nigeria-lagos-page");
  });
});
