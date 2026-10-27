import { describe, expect, it } from "vitest";
import { COUNTRY_PROFILES, countryProfileFor } from "@/data/country-profiles";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";
import { DEFAULT_COUNTRY_TEMPLATES } from "@/types/country-template";
import { EXPANSION_COUNTRY_TEMPLATES } from "@/data/country-expansion";

describe("country profiles", () => {
  it("covers every built-in country page", () => {
    const templates = [
      ...Object.values(DEFAULT_COUNTRY_TEMPLATES),
      ...Object.values(EXPANSION_COUNTRY_TEMPLATES),
    ];
    const missing = templates
      .filter((t) => !countryProfileFor(t.slug, t.country))
      .map((t) => `${t.slug} (${t.country})`);
    expect(missing).toEqual([]);
  });

  it("only links to application pages that exist", () => {
    const known = new Set(APPLICATION_DIRECTORY.map((app) => app.slug));
    const unknown = Object.values(COUNTRY_PROFILES)
      .flatMap((p) => p.industries.flatMap((i) => i.applications))
      .filter((slug) => !known.has(slug));
    expect(unknown).toEqual([]);
  });

  it("matches the DRC page by name", () => {
    expect(countryProfileFor(undefined, "Democratic Republic of Congo (DRC)")).toBe(
      COUNTRY_PROFILES["drc-geosynthetics-supplier-installer"],
    );
  });
});
