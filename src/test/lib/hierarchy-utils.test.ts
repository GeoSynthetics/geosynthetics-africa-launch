import { describe, it, expect } from "vitest";
import { buildMegaMenuFromHierarchy, getDefaultSections } from "@/lib/hierarchy-utils";
import type { HierarchySection } from "@/types/hierarchy";

describe("buildMegaMenuFromHierarchy", () => {
  it("should correctly map HierarchySection to MegaMenuConfig structure", () => {
    const input: HierarchySection[] = [
      {
        key: "products",
        label: "Products",
        to: "/products",
        primaryTitle: "Products Section",
        items: [
          {
            id: "geomembranes",
            slug: "geomembranes",
            label: "Geomembranes",
            icon: "Layers",
            to: "/products/$category",
            params: { category: "geomembranes" },
            children: [
              {
                id: "hdpe-geomembranes",
                slug: "hdpe-geomembranes",
                label: "HDPE Geomembranes",
                to: "/products/$category/$family",
                params: { category: "geomembranes", family: "hdpe-geomembranes" },
              },
            ],
            quickActions: [
              { label: "Request Quote", to: "/contact" }
            ]
          },
        ],
      },
    ];

    const result = buildMegaMenuFromHierarchy(input);

    expect(result).toHaveLength(1);
    const mega = result[0];
    expect(mega.key).toBe("products");
    expect(mega.label).toBe("Products");
    expect(mega.to).toBe("/products");
    
    const primary = mega.columns.primary;
    expect(primary).toHaveLength(1);
    expect(primary[0].label).toBe("Geomembranes");
    expect(primary[0].icon).toBe("Layers");
    expect(primary[0].to).toBe("/products/$category");
    expect(primary[0].params).toEqual({ category: "geomembranes" });

    // Secondary column derived from children
    const secondary = primary[0].content.secondary;
    expect(secondary).toHaveLength(1);
    expect(secondary[0].label).toBe("HDPE Geomembranes");
    
    // Quick actions mapped correctly
    expect(primary[0].content.quickActions).toHaveLength(1);
    expect(primary[0].content.quickActions[0].label).toBe("Request Quote");
  });

  it("should handle custom megaFallback content and override default layouts", () => {
    const customFallback = {
      secondaryTitle: "Specialized Liners",
      secondary: [{ label: "Heavy Duty EPDM", to: "/special-epdm" }],
      featuredTitle: "Monthly Highlight",
      featuredKind: "image" as const,
      featured: [{ label: "Cover Photo", imageUrl: "/img.jpg" }],
      quickActionsTitle: "Immediate Actions",
      quickActions: [{ label: "Call Experts", to: "/call" }],
    };

    const input: HierarchySection[] = [
      {
        key: "custom",
        label: "Custom",
        to: "/custom",
        primaryTitle: "Custom Title",
        items: [
          {
            id: "special",
            slug: "special",
            label: "Special Category",
            icon: "Shield",
            to: "/special",
            params: {},
            children: [],
            megaFallback: customFallback,
          },
        ],
      },
    ];

    const result = buildMegaMenuFromHierarchy(input);
    const itemContent = result[0].columns.primary[0].content;

    expect(itemContent.secondaryTitle).toBe("Specialized Liners");
    expect(itemContent.secondary).toEqual(customFallback.secondary);
    expect(itemContent.featuredTitle).toBe("Monthly Highlight");
    expect(itemContent.featuredKind).toBe("image");
    expect(itemContent.featured).toEqual(customFallback.featured);
    expect(itemContent.quickActionsTitle).toBe("Immediate Actions");
    expect(itemContent.quickActions).toEqual(customFallback.quickActions);
  });

  it("should return valid default sections structure from getDefaultSections", () => {
    const sections = getDefaultSections();
    expect(sections).toBeInstanceOf(Array);
    expect(sections.length).toBeGreaterThan(0);

    const products = sections.find(s => s.key === "products");
    expect(products).toBeDefined();
    expect(products?.label).toBe("Products");
    expect(products?.items.length).toBeGreaterThan(0);
    expect(products?.items[0].children.length).toBeGreaterThan(0);
  });
});
