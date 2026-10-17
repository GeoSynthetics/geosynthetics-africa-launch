import { describe, it, expect } from "vitest";
import { urlsetXml, sitemapIndexXml, type SitemapEntry } from "@/lib/sitemap";

const entries: SitemapEntry[] = [
  { path: "/products/geomembrane-liners", title: "Geomembranes", section: "solutions", group: "Products" },
  {
    path: "/catalogue/hdpe-liner",
    title: "HDPE Liner",
    section: "catalogue",
    group: "Product Catalogue",
    lastmod: "2026-10-01",
    images: ["https://cdn.example.com/a.jpg?x=1&y=2"],
  },
  { path: "/fr/geomembranes-pehd", title: "Géomembranes", section: "fr", group: "Français" },
];

describe("sitemap XML", () => {
  it("adds hreflang alternates for pages with translations", () => {
    const xml = urlsetXml([entries[0]]);
    expect(xml).toContain('hreflang="fr" href="https://www.geosyntheticsafrica.com/fr/geomembranes-pehd"');
    expect(xml).toContain('hreflang="pt" href="https://www.geosyntheticsafrica.com/pt/geomembranas-pead"');
    expect(xml).toContain('hreflang="x-default" href="https://www.geosyntheticsafrica.com/products/geomembrane-liners"');
  });

  it("includes images and real dates, escaping URLs", () => {
    const xml = urlsetXml([entries[1]]);
    expect(xml).toContain("<lastmod>2026-10-01</lastmod>");
    expect(xml).toContain("<image:loc>https://cdn.example.com/a.jpg?x=1&amp;y=2</image:loc>");
  });

  it("omits lastmod when no real date is known", () => {
    expect(urlsetXml([entries[0]])).not.toContain("<lastmod>");
  });

  it("indexes every section sitemap", () => {
    const xml = sitemapIndexXml(entries);
    expect(xml).toContain("<loc>https://www.geosyntheticsafrica.com/sitemap-solutions.xml</loc>");
    expect(xml).toContain("<loc>https://www.geosyntheticsafrica.com/sitemap-catalogue.xml</loc>\n    <lastmod>2026-10-01</lastmod>");
    expect(xml).toContain("sitemap-fr.xml");
    expect(xml).toContain("sitemap-pt.xml");
    expect(xml).toContain("sitemap-insights.xml");
  });
});
