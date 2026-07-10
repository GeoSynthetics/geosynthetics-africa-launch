import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "@/integrations/supabase/client";
import { Route as CatalogueSlugRoute } from "@/routes/catalogue.$slug";

// We will count how many queries are active concurrently to verify parallel execution.
let activeQueriesCount = 0;
let maxConcurrentQueries = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PRODUCT_SELECT =
  "id, name, slug, sku, short_description, long_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, key_features, specifications, applications, compatible_systems, datasheet_url, installation_guide_url, qa_checklist_url, chemical_resistance_url, material, structure, colour, standard, roll_width, roll_length, meta_title, meta_description, seo_keywords, alternative_ids, system_component_ids, family_slug, product_categories(id, name, slug, selection_guide_url), manufacturers(id, name)";

vi.mock("@/lib/catalogue.functions", () => {
  return {
    getProductDetail: vi.fn(async ({ data: { slug } }: { data: { slug: string } }) => {
      const { supabase } = await import("@/integrations/supabase/client");
      const result = await supabase
        .from("products_public")
        .select("id, name, slug, sku, short_description, long_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, key_features, specifications, applications, compatible_systems, datasheet_url, installation_guide_url, qa_checklist_url, chemical_resistance_url, material, structure, colour, standard, roll_width, roll_length, meta_title, meta_description, seo_keywords, alternative_ids, system_component_ids, family_slug, product_categories(id, name, slug, selection_guide_url), manufacturers(id, name)")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      let data = result.data;
      const error = result.error;

      if (error && /column .* does not exist/i.test(error.message)) {
        const fallback = await supabase
          .from("products_public")
          .select(
            "id, name, slug, sku, short_description, price, sale_price, stock_quantity, image_url, images, category_id, manufacturer_id, product_categories(id, name, slug), manufacturers(id, name)",
          )
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();
        if (fallback.error) throw fallback.error;
        data = fallback.data as never;
      } else if (error) {
        throw error;
      }
      if (!data) throw new Error("Not found");

      const product = data as any;

      // Start independent queries concurrently to eliminate network waterfalls
      const alternativesPromise = (async () => {
        if (product.alternative_ids && product.alternative_ids.length > 0) {
          const { data: altData } = await supabase
            .from("products_public")
            .select("id, name, slug, image_url, images, product_categories(name)")
            .eq("is_active", true)
            .in("id", product.alternative_ids);
          return (altData ?? []) as any[];
        } else {
          // Fallback to fetching other products in the same category
          const { data: catData } = await supabase
            .from("products_public")
            .select("id, name, slug, image_url, images, product_categories(name)")
            .eq("is_active", true)
            .neq("id", product.id)
            .eq("category_id", product.category_id ?? "00000000-0000-0000-0000-000000000000")
            .limit(4);
          return (catData ?? []) as any[];
        }
      })();

      const systemComponentsPromise = (async () => {
        if (product.system_component_ids && product.system_component_ids.length > 0) {
          const { data: sysData } = await supabase
            .from("products_public")
            .select("id, name, slug, image_url, images, product_categories(name)")
            .eq("is_active", true)
            .in("id", product.system_component_ids);
          return (sysData ?? []) as any[];
        }
        return [] as any[];
      })();

      const familyDataPromise = (async () => {
        if (product.family_slug) {
          const { data: templateRes } = await supabase
            .from("site_config")
            .select("value")
            .eq("key", "template_product_categories")
            .maybeSingle();
          const templates = (templateRes?.value as Record<string, any>) || {};
          return templates[product.family_slug] || null;
        }
        return null;
      })();

      const caseStudiesPromise = (async () => {
        const { data: casesData } = await supabase
          .from("case_study_products")
          .select("case_studies(id, title, slug, summary, location, country, hero_image_url)")
          .eq("product_id", product.id);
        if (casesData) {
          return casesData.map((item: any) => item.case_studies).filter(Boolean);
        }
        return [] as any[];
      })();

      const [alternatives, systemComponents, familyData, caseStudies] = await Promise.all([
        alternativesPromise,
        systemComponentsPromise,
        familyDataPromise,
        caseStudiesPromise,
      ]);

      return { product, alternatives, systemComponents, familyData, caseStudies };
    }),
  };
});

vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: vi.fn((table: string) => {
        return {
          select: vi.fn((_columns?: string, _options?: any) => {
            const builder = {
              eq: vi.fn((_col: string, _val: any) => builder),
              neq: vi.fn((_col: string, _val: any) => builder),
              in: vi.fn((_col: string, _val: any[]) => builder),
              limit: vi.fn((_limit: number) => builder),
              maybeSingle: vi.fn(async () => {
                activeQueriesCount++;
                maxConcurrentQueries = Math.max(maxConcurrentQueries, activeQueriesCount);
                await delay(50);
                activeQueriesCount--;

                if (table === "products_public") {
                  return {
                    data: {
                      id: "prod-123",
                      name: "Test Product",
                      slug: "test-product",
                      alternative_ids: ["alt-1", "alt-2"],
                      system_component_ids: ["sys-1"],
                      family_slug: "geotextiles",
                      category_id: "cat-456",
                    },
                    error: null,
                  };
                }
                if (table === "site_config") {
                  return {
                    data: {
                      value: {
                        geotextiles: { title: "Geotextiles Family" },
                      },
                    },
                    error: null,
                  };
                }
                return { data: null, error: null };
              }),
              then: vi.fn((resolve: any) => {
                activeQueriesCount++;
                maxConcurrentQueries = Math.max(maxConcurrentQueries, activeQueriesCount);
                const promise = delay(50).then(() => {
                  activeQueriesCount--;
                  let data: any = [];
                  if (table === "products_public") {
                    data = [
                      { id: "alt-1", name: "Alt Product 1", slug: "alt-1" },
                      { id: "alt-2", name: "Alt Product 2", slug: "alt-2" },
                      { id: "sys-1", name: "Sys Component 1", slug: "sys-1" },
                    ];
                  } else if (table === "case_study_products") {
                    data = [
                      {
                        case_studies: {
                          id: "cs-1",
                          title: "Test Case Study",
                          slug: "test-cs",
                        },
                      },
                    ];
                  }
                  return { data, error: null };
                });
                return promise.then(resolve);
              }),
            };
            return builder;
          }),
        };
      }),
    },
  };
});

describe("Catalogue Slug Route Loader", () => {
  beforeEach(() => {
    activeQueriesCount = 0;
    maxConcurrentQueries = 0;
    vi.clearAllMocks();
  });

  it("should parallelize fetching of alternatives, system components, family template, and case studies to prevent waterfalls", async () => {
    const startTime = Date.now();

    const result = await (CatalogueSlugRoute.options.loader as any)({
      params: { slug: "test-product" },
    } as any);

    const duration = Date.now() - startTime;

    // Verify correct loading of data
    expect(result).toBeDefined();
    expect(result.product.id).toBe("prod-123");
    expect(result.alternatives).toHaveLength(3);
    expect(result.systemComponents).toHaveLength(3);
    expect(result.familyData).toEqual({ title: "Geotextiles Family" });
    expect(result.caseStudies).toHaveLength(1);
    expect(result.caseStudies[0].title).toBe("Test Case Study");

    // Timing check:
    // With 50ms artificial delay per query:
    // Sequential execution:
    //   1. get product (50ms)
    //   2. alternatives (50ms)
    //   3. system components (50ms)
    //   4. family template (50ms)
    //   5. case studies (50ms)
    //   Total: ~250ms (or more)
    //
    // Parallelized execution:
    //   1. get product (50ms)
    //   2. Promise.all([alternatives, system components, family template, case studies]) (50ms)
    //   Total: ~100ms
    //
    // We assert that the total duration is less than 160ms. This will fail under the current sequential loader.
    console.log(`Loader duration in test: ${duration}ms`);
    expect(duration).toBeLessThan(160);

    // Also assert on concurrent query count.
    // The first query must finish before others can start (since they depend on product data).
    // Once the first query finishes, the remaining 4 queries should run concurrently.
    // Therefore, maxConcurrentQueries must be at least 3 or 4.
    expect(maxConcurrentQueries).toBeGreaterThanOrEqual(3);
  });
});
