import "../setup";
import { describe, it, expect, vi } from "vitest";
import { Route as CategoryRoute } from "@/routes/products.$category.index";
import { Route as FamilyRoute } from "@/routes/products.$category.$family";

// Mock ProductCategoryPage and ProductFamilyPage components to avoid rendering complications
vi.mock("@/pages/ProductCategoryPage", () => ({
  ProductCategoryPage: () => null,
}));

vi.mock("@/pages/ProductFamilyPage", () => ({
  ProductFamilyPage: () => null,
}));

describe("Route SEO Metadata generation", () => {
  describe("Category Index Route metadata", () => {
    it("should generate default meta tags when loaderData is empty", () => {
      const headResult = CategoryRoute.options.head!({ loaderData: undefined } as any);
      expect(headResult).toBeDefined();
      expect(headResult.meta).toBeDefined();
      expect(headResult.meta).toContainEqual({ title: "Products — Geosynthetics Africa" });
    });

    it("should generate keywords meta tag when keywords are configured in SEO properties", () => {
      const mockLoaderData = {
        category: { slug: "geomembranes", label: "Geomembranes" },
        content: {
          label: "Geomembranes",
          seo: {
            title: "Custom Title",
            description: "Custom Description",
            keywords: "geomembrane, liner, pond"
          }
        }
      };

      const headResult = CategoryRoute.options.head!({ loaderData: mockLoaderData } as any);
      expect(headResult).toBeDefined();
      expect(headResult.meta).toBeDefined();
      expect(headResult.meta).toContainEqual({ title: "Custom Title" });
      expect(headResult.meta).toContainEqual({ name: "description", content: "Custom Description" });
      expect(headResult.meta).toContainEqual({ name: "keywords", content: "geomembrane, liner, pond" });
    });

    it("should NOT include keywords tag if keywords are not present in SEO", () => {
      const mockLoaderData = {
        category: { slug: "geomembranes", label: "Geomembranes" },
        content: {
          label: "Geomembranes",
          seo: {
            title: "Custom Title",
            description: "Custom Description"
          }
        }
      };

      const headResult = CategoryRoute.options.head!({ loaderData: mockLoaderData } as any);
      expect(headResult.meta).not.toContainEqual(expect.objectContaining({ name: "keywords" }));
    });
  });

  describe("Product Family Route metadata", () => {
    it("should generate default meta tags when familyData has no SEO keywords", () => {
      const mockLoaderData = {
        category: "geomembranes",
        family: "hdpe-geomembranes",
        familyData: {
          label: "HDPE Geomembranes",
          subtitle: "Standard liners"
        }
      };

      const headResult = FamilyRoute.options.head!({ loaderData: mockLoaderData } as any);
      expect(headResult).toBeDefined();
      expect(headResult.meta).toContainEqual({ title: "Hdpe Geomembranes | Geomembranes — Geosynthetics Africa" });
      expect(headResult.meta).not.toContainEqual(expect.objectContaining({ name: "keywords" }));
    });

    it("should generate keywords meta tag when familyData has SEO keywords", () => {
      const mockLoaderData = {
        category: "geomembranes",
        family: "hdpe-geomembranes",
        familyData: {
          label: "HDPE Geomembranes",
          seo: {
            title: "HDPE Liners - Premium Quality",
            description: "Premium HDPE liners specified for mining and waste",
            keywords: "hdpe, geomembrane, mining liner, containment"
          }
        }
      };

      const headResult = FamilyRoute.options.head!({ loaderData: mockLoaderData } as any);
      expect(headResult.meta).toContainEqual({ title: "HDPE Liners - Premium Quality" });
      expect(headResult.meta).toContainEqual({ name: "keywords", content: "hdpe, geomembrane, mining liner, containment" });
    });
  });
});
