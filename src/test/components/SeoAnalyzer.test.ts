import { describe, it, expect } from "vitest";
import { analyzeSeo, type SeoInput } from "@/components/admin/SeoAnalyzer";

describe("analyzeSeo core logic", () => {
  it("should evaluate a perfect SEO configuration with high score", () => {
    const input: SeoInput = {
      type: "product",
      name: "Premium HDPE Geomembrane Liner",
      slug: "premium-hdpe-geomembrane-liner",
      metaTitle: "Premium HDPE Geomembrane Liner — Geosynthetics Africa", // 52 chars (perfect 40-60 range)
      metaDescription:
        "Purchase high quality Premium HDPE Geomembrane Liner. Designed for mining reservoirs, waste containment, and water management systems in Africa.", // 142 chars (perfect 120-160 range)
      keywords: "Premium HDPE Geomembrane, Geomembrane",
      shortDescription:
        "Premium HDPE Geomembrane Liner is a highly robust containment barrier engineered for mining and industrial applications in Africa.", // >80 chars and contains focus keyword
      imageUrl: "https://example.com/hdpe.jpg",
    };

    const { score, checks } = analyzeSeo(input);

    expect(score).toBeGreaterThanOrEqual(90);

    const titleLenCheck = checks.find((c) => c.id === "title-len");
    expect(titleLenCheck?.status).toBe("good");

    const descLenCheck = checks.find((c) => c.id === "desc-len");
    expect(descLenCheck?.status).toBe("good");

    const kwTitleCheck = checks.find((c) => c.id === "kw-title");
    expect(kwTitleCheck?.status).toBe("good");

    const kwDescCheck = checks.find((c) => c.id === "kw-desc");
    expect(kwDescCheck?.status).toBe("good");
  });

  it("should flag bad/warning statuses for empty and suboptimal SEO parameters", () => {
    const input: SeoInput = {
      type: "product",
      name: "Geotextile",
      slug: "geotextile",
      metaTitle: "Short", // Too short title (under 40)
      metaDescription: "", // Missing description
      keywords: "", // Missing focus keywords
      shortDescription: "", // Missing short desc
      imageUrl: null, // Missing image
    };

    const { score, checks } = analyzeSeo(input);

    expect(score).toBeLessThan(40);

    const kwSetCheck = checks.find((c) => c.id === "kw-set");
    expect(kwSetCheck?.status).toBe("bad");

    const titleLenCheck = checks.find((c) => c.id === "title-len");
    expect(titleLenCheck?.status).toBe("warn");

    const descLenCheck = checks.find((c) => c.id === "desc-len");
    expect(descLenCheck?.status).toBe("bad");

    const imageCheck = checks.find((c) => c.id === "image");
    expect(imageCheck?.status).toBe("bad");
  });

  it("should calculate correct focus keyword mappings and token rules on pages", () => {
    const input: SeoInput = {
      type: "page",
      slug: "about-us",
      metaTitle: "About Geosynthetics Africa Professional Services",
      metaDescription: "Learn more about us and our team at Geosynthetics Africa.",
      keywords: "about us, team",
    };

    const { checks } = analyzeSeo(input);

    // Keyword in URL slug check for page
    const kwSlugCheck = checks.find((c) => c.id === "kw-slug");
    expect(kwSlugCheck?.status).toBe("good"); // "about-us" contains "about-us" (spaces replaced by dashes)

    // Checks exclusive to products should NOT be present
    expect(checks.find((c) => c.id === "kw-name")).toBeUndefined();
    expect(checks.find((c) => c.id === "body")).toBeUndefined();
  });
});
