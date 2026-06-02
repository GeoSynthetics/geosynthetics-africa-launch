import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProductPageContent } from "@/data/product-pages";
import { supabase } from "@/integrations/supabase/client";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => {
  const maybeSingleMock = vi.fn();
  const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
  const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
  const fromMock = vi.fn().mockReturnValue({ select: selectMock });

  return {
    supabase: {
      from: fromMock,
    },
  };
});

describe("getProductPageContent data resolver", () => {
  const mockFrom = supabase.from as any;
  let mockMaybeSingle: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMaybeSingle = vi.fn().mockResolvedValue({
      data: {
        value: {
          geomembranes: {
            slug: "geomembranes",
            label: "Custom Geomembranes",
            heroImage: "https://example.com/custom.jpg",
            subtitle: "Custom Subtitle",
            description: ["Line 1", "Line 2"],
            features: ["Feature 1"],
            popularProducts: [],
            applications: [],
            industries: [],
            seo: {
              title: "Custom SEO Title",
              description: "Custom SEO Description",
              keywords: "custom, geomembranes, liners"
            }
          }
        }
      },
      error: null
    });

    const eqMock = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    mockFrom.mockReturnValue({ select: selectMock } as any);
  });

  it("should fetch custom template and merge custom SEO keywords correctly", async () => {
    const content = await getProductPageContent("geomembranes");

    expect(content).toBeDefined();
    expect(content?.label).toBe("Custom Geomembranes");
    expect(content?.seo).toBeDefined();
    expect(content?.seo?.title).toBe("Custom SEO Title");
    expect(content?.seo?.description).toBe("Custom SEO Description");
    expect(content?.seo?.keywords).toBe("custom, geomembranes, liners");

    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
  });

  it("should fall back to seeded category configurations if template is not found in database", async () => {
    // Reset DB template response to be empty
    mockMaybeSingle.mockResolvedValue({ data: { value: {} }, error: null });

    const content = await getProductPageContent("geomembranes");

    expect(content).toBeDefined();
    expect(content?.slug).toBe("geomembranes");
    expect(content?.label).toBe("Geomembranes");
    // geomembranes default seed doesn't have keywords set by default
    expect(content?.seo).toBeUndefined(); 
  });
});
