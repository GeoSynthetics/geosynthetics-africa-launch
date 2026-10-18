import { describe, it, expect } from "vitest";
import { buildLlmsTxt } from "@/lib/llms-txt";
import type { SitemapEntry } from "@/lib/sitemap";

const entries: SitemapEntry[] = [
  { path: "/", title: "Home", section: "pages", group: "Company" },
  {
    path: "/services/geomembrane-liner-installation-africa",
    title: "Geomembrane Installation",
    section: "solutions",
    group: "Services",
  },
  {
    path: "/zimbabwe-geosynthetics-supplier-installer",
    title: "Zimbabwe",
    section: "countries",
    group: "Southern Africa",
  },
  {
    path: "/catalogue/hdpe-liner",
    title: "HDPE [Smooth] Liner",
    section: "catalogue",
    group: "Product Catalogue",
  },
  { path: "/fr/geomembranes-pehd", title: "Géomembranes", section: "fr", group: "Français" },
  { path: "/", title: "Home duplicate", section: "pages", group: "Company" },
];

describe("buildLlmsTxt", () => {
  const txt = buildLlmsTxt(entries);

  it("starts with the llmstxt.org header and a summary", () => {
    expect(txt.startsWith("# Geosynthetics Africa\n\n> ")).toBe(true);
    expect(txt).toContain("- Website: https://www.geosyntheticsafrica.com");
    expect(txt).toContain("- Sales: sales@geosyntheticsafrica.com");
  });

  it("links every page with an absolute URL under its section", () => {
    expect(txt).toContain("## Products, Applications, Services & Industries");
    expect(txt).toContain(
      "- [Geomembrane Installation](https://www.geosyntheticsafrica.com/services/geomembrane-liner-installation-africa)",
    );
    expect(txt).toContain("### Southern Africa");
    expect(txt).toContain(
      "(https://www.geosyntheticsafrica.com/zimbabwe-geosynthetics-supplier-installer)",
    );
  });

  it("keeps link text valid Markdown and drops duplicate paths", () => {
    expect(txt).toContain("- [HDPE Smooth Liner](");
    expect(txt).not.toContain("Home duplicate");
  });

  it("puts translated pages under Optional, after the main sections", () => {
    const optional = txt.indexOf("## Optional");
    expect(optional).toBeGreaterThan(txt.indexOf("## Product Catalogue"));
    expect(txt.slice(optional)).toContain("/fr/geomembranes-pehd");
  });
});
