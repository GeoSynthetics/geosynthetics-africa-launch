import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Route as CatalogueSlugRoute } from "@/routes/catalogue.$slug";

// We will count how many queries are active concurrently to verify parallel execution.
let activeQueriesCount = 0;
let maxConcurrentQueries = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
