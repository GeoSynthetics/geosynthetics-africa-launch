import { describe, it, expect } from "vitest";
import {
  LOCALIZED_PAGES,
  alternatesFor,
  langFromPath,
  localizedPath,
  switchLanguagePath,
} from "@/i18n/localized-pages";

describe("localized pages", () => {
  it("has unique paths", () => {
    const paths = LOCALIZED_PAGES.map(localizedPath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("has a home page for each language", () => {
    expect(LOCALIZED_PAGES.some((p) => p.lang === "fr" && p.slug === "")).toBe(true);
    expect(LOCALIZED_PAGES.some((p) => p.lang === "pt" && p.slug === "")).toBe(true);
  });

  it("gives every page a title, description and English equivalent", () => {
    for (const p of LOCALIZED_PAGES) {
      expect(p.title.length, localizedPath(p)).toBeGreaterThan(10);
      expect(p.description.length, localizedPath(p)).toBeGreaterThan(50);
      expect(p.enPath.startsWith("/"), localizedPath(p)).toBe(true);
    }
  });

  it("links language versions to each other", () => {
    const fromEnglish = alternatesFor("/products/geomembrane-liners");
    expect(fromEnglish).toEqual(
      expect.arrayContaining([
        { lang: "en", path: "/products/geomembrane-liners" },
        { lang: "fr", path: "/fr/geomembranes-pehd" },
        { lang: "pt", path: "/pt/geomembranas-pead" },
      ]),
    );
    expect(alternatesFor("/fr/geomembranes-pehd")).toEqual(fromEnglish);
    expect(alternatesFor("/about")).toEqual([]);
  });

  it("detects the language from the URL", () => {
    expect(langFromPath("/fr/geotextiles")).toBe("fr");
    expect(langFromPath("/pt")).toBe("pt");
    expect(langFromPath("/products")).toBe("en");
    expect(langFromPath("/fraud")).toBe("en");
  });

  it("switches to the same page in another language", () => {
    expect(switchLanguagePath("/products/gabion-baskets", "fr")).toBe("/fr/gabions");
    expect(switchLanguagePath("/fr/gabions", "en")).toBe("/products/gabion-baskets");
    expect(switchLanguagePath("/fr/gabions", "pt")).toBe("/pt/gabioes");
    expect(switchLanguagePath("/about", "fr")).toBe("/fr");
    expect(switchLanguagePath("/fr/geosynthetiques-senegal", "pt")).toBe("/pt");
  });
});
