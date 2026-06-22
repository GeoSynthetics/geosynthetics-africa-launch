import type { HierarchySection, HierarchyItem, MegaContent } from "@/types/hierarchy";
import type { MegaMenuConfig } from "@/components/site/mega-menu-data";

/**
 * Derives a MegaMenuConfig[] from HierarchySection[] so the MegaMenu
 * component can continue rendering unchanged.
 */
export function buildMegaMenuFromHierarchy(sections: HierarchySection[]): MegaMenuConfig[] {
  return sections.map((section) => {
    const firstItem = section.items[0];
    const fallback = section.fallbackContent ?? firstItem?.megaFallback ?? {};

    return {
      key: section.key as any,
      label: section.label,
      to: section.to,
      columns: {
        primaryTitle: section.primaryTitle,
        primary: section.items.map((item) => {
          let targetTo = item.to;
          let targetParams = item.params;
          if (section.key === "services" || section.key === "industries" || section.key === "applications") {
            targetTo = "/$slug";
            targetParams = { slug: item.slug || item.id };
          }

          return {
            label: item.label,
            icon: item.icon,
            to: targetTo,
            params: targetParams,
            slug: item.slug,
            content: item.megaFallback
              ? {
                  secondaryTitle: item.megaFallback.secondaryTitle ?? item.label,
                  secondary: (item.megaFallback.secondary && item.megaFallback.secondary.length > 0)
                    ? item.megaFallback.secondary
                    : (item.children || []).map((c) => ({
                        label: c.label,
                        to: c.to,
                        params: c.params,
                      })),
                  featuredTitle: item.megaFallback.featuredTitle ?? "Featured",
                  featuredKind: item.megaFallback.featuredKind ?? "product",
                  featured: item.megaFallback.featured ?? [],
                  quickActionsTitle: item.megaFallback.quickActionsTitle ?? "Quick Actions",
                  quickActions: (item.megaFallback.quickActions && item.megaFallback.quickActions.length > 0)
                    ? item.megaFallback.quickActions
                    : undefined,
                  topSellingProductId: item.megaFallback.topSellingProductId,
                  topSellingProductIds: item.megaFallback.topSellingProductIds,
                }
              : {
                  secondaryTitle: item.label,
                  secondary: item.children.map((c) => ({
                    label: c.label,
                    to: c.to,
                    params: c.params,
                  })),
                  featuredTitle: "Featured",
                  featuredKind: "product" as const,
                  featured: [],
                  quickActionsTitle: "Quick Actions",
                  quickActions: (item.quickActions && item.quickActions.length > 0)
                    ? item.quickActions
                    : undefined,
                  topSellingProductId: undefined,
                  topSellingProductIds: undefined,
                },
          };
        }),
        secondaryTitle: fallback.secondaryTitle ?? firstItem?.label ?? "",
        secondary: fallback.secondary ?? firstItem?.children?.map((c) => ({ label: c.label, to: c.to, params: c.params })) ?? [],
        featuredTitle: fallback.featuredTitle ?? "Featured",
        featuredKind: (fallback.featuredKind ?? "product") as "product" | "image",
        featured: (fallback.featured ?? []) as any,
        quickActionsTitle: fallback.quickActionsTitle ?? "Quick Actions",
        quickActions: (fallback.quickActions ?? []) as any,
      },
    };
  });
}

/**
 * Converts the old site_config keys (mega_menu, template_product_families, etc.)
 * into the new unified hierarchy format stored under hierarchy_*.
 * Called once on migration, then the old keys can be removed.
 */
export function getDefaultSections(): HierarchySection[] {
  return [
    {
      key: "products",
      label: "Products",
      to: "/products",
      primaryTitle: "Browse Products",
      items: [
        mkCategoryItem("geomembranes", "Geomembranes", "Layers", "/products/$category", { category: "geomembranes" }, [
          mkChild("hdpe-geomembranes", "HDPE Geomembranes", "geomembranes"),
          mkChild("lldpe-geomembranes", "LLDPE Geomembranes", "geomembranes"),
          mkChild("pvc-geomembranes", "PVC Geomembranes", "geomembranes"),
          mkChild("epdm-geomembranes", "EPDM Geomembranes", "geomembranes"),
          mkChild("pp-geomembranes", "PP Geomembranes", "geomembranes"),
          mkChild("textured-geomembranes", "Textured Geomembranes", "geomembranes"),
          mkChild("speciality-geomembranes", "Speciality Geomembranes", "geomembranes"),
          mkChild("floating-cover-geomembranes", "Floating Cover Geomembranes", "geomembranes"),
        ]),
        mkCategoryItem("geotextiles", "Geotextiles", "Grid3x3", "/products/$category", { category: "geotextiles" }, [
          mkChild("non-woven-geotextiles", "Non-Woven Geotextiles", "geotextiles"),
          mkChild("woven-geotextiles", "Woven Geotextiles", "geotextiles"),
          mkChild("high-strength-geotextiles", "High-Strength Geotextiles", "geotextiles"),
          mkChild("geotextile-tubes", "Geotextile Tubes", "geotextiles"),
          mkChild("paving-fabrics", "Paving Fabrics", "geotextiles"),
        ]),
        mkCategoryItem("geogrids", "Geogrids", "Grid2x2", "/products/$category", { category: "geogrids" }, [
          mkChild("biaxial-geogrids", "Biaxial Geogrids", "geogrids"),
          mkChild("uniaxial-geogrids", "Uniaxial Geogrids", "geogrids"),
          mkChild("triaxial-geogrids", "Triaxial Geogrids", "geogrids"),
          mkChild("fiberglass-geogrids", "Fiberglass Geogrids", "geogrids"),
        ]),
        mkCategoryItem("geocells", "Geocells", "Hexagon", "/products/$category", { category: "geocells" }, [
          mkChild("standard-geocells", "Standard Geocells", "geocells"),
          mkChild("textured-geocells", "Textured Geocells", "geocells"),
          mkChild("slope-protection-geocells", "Slope Protection Geocells", "geocells"),
        ]),
        mkCategoryItem("gcls", "GCLs", "Sheet", "/products/$category", { category: "gcls" }, [
          mkChild("standard-gcls", "Standard GCLs", "gcls"),
          mkChild("pe-coated-gcls", "PE Coated GCLs", "gcls"),
          mkChild("reinforced-gcls", "Reinforced GCLs", "gcls"),
        ]),
        mkCategoryItem("drainage-composites", "Drainage Composites", "Waves", "/products/$category", { category: "drainage-composites" }, [
          mkChild("geonets", "Geonets", "drainage-composites"),
          mkChild("geocomposite-drains", "Geocomposite Drains", "drainage-composites"),
          mkChild("drainage-boards", "Drainage Boards", "drainage-composites"),
        ]),
        mkCategoryItem("erosion-control", "Erosion Control", "Mountain", "/products/$category", { category: "erosion-control" }, [
          mkChild("erosion-control-blankets", "Erosion Control Blankets", "erosion-control"),
          mkChild("turf-reinforcement-mats", "Turf Reinforcement Mats", "erosion-control"),
          mkChild("coir-logs", "Coir Logs", "erosion-control"),
        ]),
        mkCategoryItem("accessories", "Accessories", "Wrench", "/products/$category", { category: "accessories" }, [
          mkChild("welding-rods", "Welding Rods", "accessories"),
          mkChild("bentonite-paste", "Bentonite Paste", "accessories"),
          mkChild("fixing-pins", "Fixing Pins & Pegs", "accessories"),
        ]),
      ],
    },
    {
      key: "applications",
      label: "Applications",
      to: "/applications",
      primaryTitle: "Application Categories",
      items: [
        mkSimpleItem("mining-systems", "Mining Systems", "Pickaxe", "/$slug", { slug: "mining-systems" }),
        mkSimpleItem("water-containment", "Water Containment", "Droplets", "/$slug", { slug: "water-containment" }),
        mkSimpleItem("waste-landfills", "Waste & Landfills", "Trash2", "/$slug", { slug: "waste-landfills" }),
        mkSimpleItem("roads-infrastructure", "Roads & Infrastructure", "Construction", "/$slug", { slug: "roads-infrastructure" }),
        mkSimpleItem("erosion-control-app", "Erosion Control", "Mountain", "/$slug", { slug: "erosion-control" }),
        mkSimpleItem("drainage-systems", "Drainage Systems", "Waves", "/$slug", { slug: "drainage-systems" }),
        mkSimpleItem("agriculture-aquaculture", "Agriculture & Aquaculture", "Sprout", "/$slug", { slug: "agriculture-aquaculture" }),
      ],
    },
    {
      key: "services",
      label: "Services",
      to: "/services",
      primaryTitle: "Our Services",
      items: [
        mkSimpleItem("supply", "Supply", "Truck", "/$slug", { slug: "supply" }),
        mkSimpleItem("installation", "Installation", "HardHat", "/$slug", { slug: "installation" }),
        mkSimpleItem("qa-qc", "QA / QC & Testing", "ClipboardCheck", "/$slug", { slug: "qa-qc" }),
        mkSimpleItem("design-support", "Design Support", "PencilRuler", "/$slug", { slug: "design-support" }),
        mkSimpleItem("logistics", "Logistics & Customs", "Ship", "/$slug", { slug: "logistics" }),
        mkSimpleItem("after-sales", "After Sales Support", "LifeBuoy", "/$slug", { slug: "after-sales" }),
      ],
    },
    {
      key: "industries",
      label: "Industries",
      to: "/industries",
      primaryTitle: "Industries We Serve",
      items: [
        mkSimpleItem("construction-infrastructure", "Construction & Infrastructure", "Building2", "/$slug", { slug: "construction-infrastructure" }),
        mkSimpleItem("mining", "Mining", "Pickaxe", "/$slug", { slug: "mining" }),
        mkSimpleItem("environmental-waste", "Environmental & Waste", "Trash2", "/$slug", { slug: "environmental-waste" }),
        mkSimpleItem("water-management", "Water Management", "Droplets", "/$slug", { slug: "water-management" }),
        mkSimpleItem("agriculture-aquaculture-ind", "Agriculture & Aquaculture", "Sprout", "/$slug", { slug: "agriculture-aquaculture" }),
        mkSimpleItem("energy", "Energy", "Zap", "/$slug", { slug: "energy" }),
      ],
    },
  ];
}

function mkCategoryItem(
  slug: string, label: string, icon: string, to: string,
  params: Record<string, string>, children: HierarchyItem["children"]
): HierarchyItem {
  return { id: slug, slug, label, icon, to, params, children };
}

function mkChild(slug: string, label: string, category: string): import("@/types/hierarchy").HierarchyChild {
  return {
    id: slug, slug, label,
    to: "/products/$category/$family",
    params: { category, family: slug },
  };
}

function mkSimpleItem(
  slug: string, label: string, icon: string, to: string,
  params: Record<string, string>
): HierarchyItem {
  return { id: slug, slug, label, icon, to, params, children: [] };
}
