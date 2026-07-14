import { useState, useEffect } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { megaMenus, type MegaMenuConfig } from "@/components/site/mega-menu-data";
import { buildMegaMenuFromHierarchy, getDefaultSections } from "@/lib/hierarchy-utils";

// Module-level in-memory cache to keep data across route transitions / remounts
let _cache: MegaMenuConfig[] | null = null;
let _fetchPromise: Promise<MegaMenuConfig[]> | null = null;

export function fetchDynamicMenus(): Promise<MegaMenuConfig[]> {
  const isServer = typeof window === "undefined";
  if (!isServer && _cache) return Promise.resolve(_cache);
  if (!isServer && _fetchPromise) return _fetchPromise;

  const fetchPromise = (async () => {
    const SECTION_KEYS = ["applications", "products", "services", "industries"] as const;
    const keysToFetch = [
      ...SECTION_KEYS.map((k) => `hierarchy_${k}`),
      "template_services",
      "template_applications",
      "template_industries",
    ];

    try {
      const { data } = await supabase
        .from("site_config")
        .select("key, value")
        .in("key", keysToFetch);

      if (!data || data.length === 0) {
        if (!isServer) {
          _cache = megaMenus;
        }
        return megaMenus;
      }

      const defaults = getDefaultSections();
      const sections = SECTION_KEYS.map((key) => {
        const row = data.find((d) => d.key === `hierarchy_${key}`);
        const dbVal = row?.value as any;
        if (dbVal && Array.isArray(dbVal.items)) {
          return dbVal;
        }
        return defaults.find((d: any) => d.key === key);
      }).filter(Boolean);

      if (sections.length === 0) {
        if (!isServer) {
          _cache = megaMenus;
        }
        return megaMenus;
      }

      let builtMenus = buildMegaMenuFromHierarchy(sections);

      // Fetch templates map
      const servicesTemplates = (data.find((d) => d.key === "template_services")?.value ??
        {}) as Record<string, any>;
      const applicationsTemplates = (data.find((d) => d.key === "template_applications")?.value ??
        {}) as Record<string, any>;
      const industriesTemplates = (data.find((d) => d.key === "template_industries")?.value ??
        {}) as Record<string, any>;

      // Collect all topSellingProductId values
      const topSellingProductIds = new Set<string>();

      const getTemplateTopSellingIds = (
        menuKey: string,
        slug: string,
        itemMegaContent?: any,
      ): string[] => {
        if (
          itemMegaContent?.topSellingProductIds &&
          itemMegaContent.topSellingProductIds.length > 0
        ) {
          return itemMegaContent.topSellingProductIds;
        }
        if (itemMegaContent?.topSellingProductId) {
          return [itemMegaContent.topSellingProductId];
        }

        let template: any = null;
        if (menuKey === "services") {
          template = servicesTemplates[slug];
        } else if (menuKey === "applications") {
          template = applicationsTemplates[slug];
        } else if (menuKey === "industries") {
          template = industriesTemplates[slug];
        }

        if (template) {
          if (template.topSellingProductIds && template.topSellingProductIds.length > 0) {
            return template.topSellingProductIds;
          }
          if (template.topSellingProductId) {
            return [template.topSellingProductId];
          }
        }
        return [];
      };

      for (const menu of builtMenus) {
        if (menu.key === "services" || menu.key === "applications" || menu.key === "industries") {
          for (const primary of menu.columns.primary) {
            const slug = primary.slug || primary.params?.slug || primary.params?.category;
            if (slug) {
              const ids = getTemplateTopSellingIds(menu.key, slug, primary.content);
              for (const id of ids) {
                if (id) {
                  topSellingProductIds.add(id);
                }
              }
            }
          }
        }
      }

      // Fetch products by id for top selling product highlight
      const topSellingMap = new Map<
        string,
        { id: string; name: string; slug: string; image: string; short_description: string }
      >();
      if (topSellingProductIds.size > 0) {
        const { data: dbProducts } = await supabase
          .from("products_public")
          .select("id, name, slug, image_url, short_description")
          .in("id", Array.from(topSellingProductIds));

        if (dbProducts) {
          for (const p of dbProducts) {
            topSellingMap.set(p.id, {
              id: p.id,
              name: p.name,
              slug: p.slug,
              image: p.image_url || "",
              short_description: p.short_description || "",
            });
          }
        }
      }

      // Hydrate both featured products and top-selling products
      const slugsToHydrate = new Set<string>();

      const getProductSlug = (item: any): string | undefined => {
        if (item.params?.family) return item.params.family;
        if (item.params?.slug) return item.params.slug;
        if (typeof item.to === "string") {
          const parts = item.to.split("/").filter(Boolean);
          const last = parts[parts.length - 1];
          if (last && !last.startsWith("$")) return last;
        }
        return undefined;
      };

      const collectSlugs = (featured: any[]) => {
        for (const item of featured) {
          const slug = getProductSlug(item);
          if (slug) slugsToHydrate.add(slug);
        }
      };

      for (const menu of builtMenus) {
        if (menu.columns.featuredKind === "product" && menu.columns.featured) {
          collectSlugs(menu.columns.featured as any[]);
        }
        for (const primary of menu.columns.primary) {
          if (primary.content?.featuredKind === "product" && primary.content.featured) {
            collectSlugs(primary.content.featured as any[]);
          }
        }
      }

      const productMap = new Map<string, { image_url: string | null; category_slug: string }>();
      if (slugsToHydrate.size > 0) {
        const { data: productData } = await supabase
          .from("products_public")
          .select("slug, image_url, product_categories ( slug )")
          .in("slug", Array.from(slugsToHydrate));

        if (productData) {
          for (const p of productData as any[]) {
            const catSlug = Array.isArray(p.product_categories)
              ? p.product_categories[0]?.slug
              : p.product_categories?.slug;
            productMap.set(p.slug, {
              image_url: p.image_url,
              category_slug: catSlug || "geomembranes",
            });
          }
        }
      }

      const hydrateFeatured = (featured: any[]) =>
        featured.map((item) => {
          const slug = getProductSlug(item);
          const dbProduct = slug ? productMap.get(slug) : undefined;
          if (dbProduct) {
            return {
              ...item,
              to: "/catalogue/$slug",
              params: {
                slug: slug,
              },
              image: dbProduct.image_url || item.image || "",
            };
          }
          return item;
        });

      builtMenus = builtMenus.map((menu) => {
        const isTargetMenu =
          menu.key === "services" || menu.key === "applications" || menu.key === "industries";

        return {
          ...menu,
          columns: {
            ...menu.columns,
            featured:
              menu.columns.featuredKind === "product" && menu.columns.featured
                ? (hydrateFeatured(menu.columns.featured as any[]) as any)
                : menu.columns.featured,
            primary: menu.columns.primary.map((p) => {
              const slug = p.slug || p.params?.slug || p.params?.category;
              const pIds = slug ? getTemplateTopSellingIds(menu.key, slug, p.content) : [];
              const topProds = pIds
                .map((id) => topSellingMap.get(id))
                .filter((item): item is NonNullable<typeof item> => !!item);

              const content = p.content
                ? {
                    ...p.content,
                    featured:
                      p.content.featuredKind === "product" && p.content.featured
                        ? (hydrateFeatured(p.content.featured as any[]) as any)
                        : p.content.featured,
                    topSellingProducts: topProds,
                    topSellingProduct: topProds[0],
                  }
                : isTargetMenu
                  ? {
                      secondaryTitle: p.label,
                      secondary: [],
                      featuredTitle: "Featured",
                      featuredKind: "product" as const,
                      featured: [],
                      quickActionsTitle: "Quick Actions",
                      quickActions: [],
                      topSellingProducts: topProds,
                      topSellingProduct: topProds[0],
                    }
                  : undefined;

              return {
                ...p,
                content,
              };
            }),
          },
        };
      });

      if (!isServer) {
        _cache = builtMenus;
      }
      return builtMenus;
    } catch (error) {
      console.error("Error loading dynamic menus:", error);
      return megaMenus;
    }
  })();

  if (!isServer) {
    _fetchPromise = fetchPromise;
  }

  return fetchPromise;
}

export function invalidateDynamicMenusCache() {
  _cache = null;
  _fetchPromise = null;
}

export function useDynamicMegaMenus() {
  const rootData = useLoaderData({ from: "__root__" }) as { megaMenu: MegaMenuConfig[] } | undefined;
  const menus = rootData?.megaMenu ?? _cache ?? megaMenus;
  return { menus, isLoading: false };
}
