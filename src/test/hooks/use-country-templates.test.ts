import { describe, it, expect } from "vitest";
import { mergeCountryTemplatesWithDefaults } from "@/hooks/use-country-templates";
import { DEFAULT_COUNTRY_TEMPLATES } from "@/types/country-template";

describe("mergeCountryTemplatesWithDefaults", () => {
  it("keeps one page per country when Site Builder uses a different slug", () => {
    const merged = mergeCountryTemplatesWithDefaults({
      "zimbabwe-geosynthetics-supplier-installer": {
        country: "Zimbabwe",
        slug: "zimbabwe-geosynthetics-supplier-installer",
      },
    });
    const zim = Object.values(merged).filter((t) => t.country === "Zimbabwe");
    expect(zim).toHaveLength(1);
    expect(zim[0].slug).toBe("zimbabwe-geosynthetics-supplier-installer");
    expect(merged["zimbabwe-geosynthetics-supplier-contact"]).toBeUndefined();
  });

  it("keeps built-in pages for countries not saved in Site Builder", () => {
    const merged = mergeCountryTemplatesWithDefaults({});
    expect(Object.keys(merged)).toEqual(Object.keys(DEFAULT_COUNTRY_TEMPLATES));
  });
});
