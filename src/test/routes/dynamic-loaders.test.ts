import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Route as ApplicationsRoute } from "@/routes/applications.$category";
import { Route as ServicesRoute } from "@/routes/services.$slug";
import { Route as IndustriesRoute } from "@/routes/industries.$slug";

// Mock pages to avoid rendering/import issues
vi.mock("@/pages/ApplicationCategoryPage", () => ({
  ApplicationCategoryPage: () => null,
}));
vi.mock("@/pages/ServicePage", () => ({
  ServicePage: () => null,
}));
vi.mock("@/pages/IndustryPage", () => ({
  IndustryPage: () => null,
}));

// Shared mock database responses
const mockDb = {
  template_applications: {} as any,
  hierarchy_applications: {} as any,
  template_services: {} as any,
  hierarchy_services: {} as any,
  template_industries: {} as any,
  hierarchy_industries: {} as any,
  case_studies: [] as any[],
  products_public: [] as any[],
};

// Mock Supabase client using a dynamic fluent mock builder
vi.mock("@/integrations/supabase/client", () => {
  class SupabaseQueryMock {
    table: string;
    filters: Record<string, any> = {};

    constructor(table: string) {
      this.table = table;
    }

    select() {
      return this;
    }

    eq(col: string, val: any) {
      this.filters[col] = val;
      return this;
    }

    in(col: string, val: any[]) {
      this.filters[col] = val;
      return this;
    }

    order(col: string, options?: any) {
      return this;
    }

    async maybeSingle() {
      if (this.table === "site_config" && this.filters.key) {
        const key = this.filters.key;
        return { data: { value: mockDb[key as keyof typeof mockDb] }, error: null };
      }
      if (this.table === "case_studies" && this.filters.slug) {
        const found = mockDb.case_studies.find((cs) => cs.slug === this.filters.slug);
        return { data: found || null, error: null };
      }
      return { data: null, error: null };
    }

    then(resolve: any) {
      let data: any = [];
      if (this.table === "case_studies") {
        if (this.filters.sector) {
          data = mockDb.case_studies.filter(
            (cs) => cs.sector === this.filters.sector && cs.status === "published",
          );
        } else if (this.filters.status === "published") {
          data = mockDb.case_studies.filter((cs) => cs.status === "published");
        }
      } else if (this.table === "products_public") {
        if (this.filters.id) {
          data = mockDb.products_public.filter((p) => this.filters.id.includes(p.id));
        }
      }
      return Promise.resolve({ data, error: null }).then(resolve);
    }
  }

  return {
    supabase: {
      from: vi.fn((table) => new SupabaseQueryMock(table)),
    },
  };
});

describe("Dynamic Route Loaders", () => {
  beforeEach(() => {
    // Reset mock database
    mockDb.template_applications = {};
    mockDb.hierarchy_applications = {};
    mockDb.template_services = {};
    mockDb.hierarchy_services = {};
    mockDb.template_industries = {};
    mockDb.hierarchy_industries = {};
    mockDb.case_studies = [];
    mockDb.products_public = [];
    vi.clearAllMocks();
  });

  describe("applications.$category loader", () => {
    it("should fallback to default values when no template or hierarchy matches", async () => {
      const result = await (ApplicationsRoute.options.loader as any)({
        params: { category: "non-existent-category" },
      } as any);

      expect(result.category.slug).toBe("non-existent-category");
      expect(result.templateData).toBeNull();
      expect(result.caseStudies).toEqual([]);
      expect(result.linkedProducts).toEqual([]);
    });

    it("should load template matching categorySlug when hierarchy is empty", async () => {
      mockDb.template_applications = {
        "mining-systems": {
          title: "Mining Systems Template",
          description: "Premium mining systems template details",
          heroImage: "mining-hero.jpg",
          products: ["p1"],
        },
      };

      const result = await (ApplicationsRoute.options.loader as any)({
        params: { category: "mining-systems" },
      } as any);

      expect(result.templateData).toBeDefined();
      expect(result.templateData?.title).toBe("Mining Systems Template");
      expect(result.templateData?.heroImage).toBe("mining-hero.jpg");
    });

    it("should prioritize template matching hierarchy item ID over URL slug", async () => {
      mockDb.hierarchy_applications = {
        items: [
          {
            id: "tailings-storage-facilities-tsfs",
            slug: "tailings-storage-facility-lining",
            label: "Tailings Custom Label",
          },
        ],
      };

      mockDb.template_applications = {
        "tailings-storage-facilities-tsfs": {
          title: "Tailings Storage Facility Lining",
          description: "Rich template content",
          heroImage: "tailings-hero.jpg",
        },
      };

      const result = await (ApplicationsRoute.options.loader as any)({
        params: { category: "tailings-storage-facility-lining" },
      } as any);

      expect(result.templateData).toBeDefined();
      expect(result.templateData?.title).toBe("Tailings Custom Label");
      expect(result.templateData?.description).toBe("Rich template content");
    });

    it("should overlay hierarchy pageContent overrides on top of resolved template", async () => {
      mockDb.hierarchy_applications = {
        items: [
          {
            id: "tailings-storage-facilities-tsfs",
            slug: "tailings-storage-facility-lining",
            label: "Tailings Custom Label Overridden",
            pageContent: {
              subtitle: "Custom Subtitle Override",
              heroImage: "override-hero.jpg",
              seo: {
                title: "Custom SEO Title",
                description: "Custom SEO Desc",
              },
            },
          },
        ],
      };

      mockDb.template_applications = {
        "tailings-storage-facilities-tsfs": {
          title: "Original Title",
          description: "Original Description",
          heroImage: "original-hero.jpg",
          seo: {
            title: "Original SEO Title",
            description: "Original SEO Desc",
          },
        },
      };

      const result = await (ApplicationsRoute.options.loader as any)({
        params: { category: "tailings-storage-facility-lining" },
      } as any);

      expect(result.templateData).toBeDefined();
      expect(result.templateData?.title).toBe("Tailings Custom Label Overridden");
      expect(result.templateData?.description).toBe("Custom Subtitle Override");
      expect(result.templateData?.heroImage).toBe("override-hero.jpg");
      expect(result.templateData?.seo?.title).toBe("Custom SEO Title");
      expect(result.templateData?.seo?.description).toBe("Custom SEO Desc");
    });
  });

  describe("services.$slug loader", () => {
    it("should prioritize template matching hierarchy item ID over URL slug", async () => {
      mockDb.hierarchy_services = {
        items: [
          {
            id: "custom-supply-id",
            slug: "custom-supply-slug",
            label: "Custom Supply Label",
          },
        ],
      };

      mockDb.template_services = {
        "custom-supply-id": {
          title: "Supply Template Content",
          description: "Logistics supply template description",
          heroImage: "supply-hero.jpg",
        },
      };

      const result = await (ServicesRoute.options.loader as any)({
        params: { slug: "custom-supply-slug" },
      } as any);

      expect(result.templateData).toBeDefined();
      expect(result.templateData?.title).toBe("Custom Supply Label");
      expect(result.templateData?.description).toBe("Logistics supply template description");
    });
  });

  describe("industries.$slug loader", () => {
    it("should load matching template and sector case studies", async () => {
      mockDb.hierarchy_industries = {
        items: [
          {
            id: "custom-mining-id",
            slug: "custom-mining-slug",
            label: "Custom Mining Label",
          },
        ],
      };

      mockDb.template_industries = {
        "custom-mining-id": {
          title: "Mining Industry Template",
          description: "Custom mining industry desc",
          heroImage: "mining-ind.jpg",
        },
      };

      mockDb.case_studies = [
        {
          id: "cs1",
          title: "Tailing Storage Project",
          sector: "Custom Mining Label",
          status: "published",
        },
      ];

      const result = await (IndustriesRoute.options.loader as any)({
        params: { slug: "custom-mining-slug" },
      } as any);

      expect(result.templateData).toBeDefined();
      expect(result.templateData?.title).toBe("Custom Mining Label");
      expect(result.caseStudies).toHaveLength(1);
      expect(result.caseStudies[0].title).toBe("Tailing Storage Project");
    });
  });
});
