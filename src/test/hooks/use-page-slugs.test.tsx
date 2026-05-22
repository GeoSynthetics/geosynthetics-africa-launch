import "../setup";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  fetchSeoPages,
  invalidateSeoCache,
  resolveSlugToPath,
  getSlugForPath,
  usePageSlugs,
} from "@/hooks/use-page-slugs";
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

describe("use-page-slugs utilities and hook", () => {
  const mockFrom = supabase.from as any;
  let mockMaybeSingle: any;

  beforeEach(() => {
    vi.clearAllMocks();
    invalidateSeoCache();

    // Re-bind the chained mocks
    mockMaybeSingle = vi.fn().mockResolvedValue({
      data: {
        value: {
          "/about": {
            title: "About Us",
            description: "About geosynthetics Africa",
            keywords: "about",
            urlSlug: "about-us-slug",
            pageLabel: "About",
          },
          "/contact": {
            title: "Contact",
            description: "Get in touch",
            keywords: "contact",
            urlSlug: "", // No custom slug
            pageLabel: "Contact",
          },
        },
      },
      error: null,
    });

    const eqMock = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    mockFrom.mockReturnValue({ select: selectMock } as any);
  });

  it("should fetch and cache SEO pages config", async () => {
    const map1 = await fetchSeoPages();
    expect(map1).toBeDefined();
    expect(map1["/about"].urlSlug).toBe("about-us-slug");

    // Fetch again immediately to verify caching
    const map2 = await fetchSeoPages();
    expect(map2).toBe(map1); // In-memory reference should be identical
    expect(mockMaybeSingle).toHaveBeenCalledTimes(1); // DB query made only once
  });

  it("should invalidate the cache and trigger a new fetch on next call", async () => {
    await fetchSeoPages();
    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);

    invalidateSeoCache();

    await fetchSeoPages();
    expect(mockMaybeSingle).toHaveBeenCalledTimes(2); // Should trigger a second DB fetch
  });

  it("should resolve dynamic custom slugs back to original paths", async () => {
    const path = await resolveSlugToPath("about-us-slug");
    expect(path).toBe("/about");

    const nonExistent = await resolveSlugToPath("non-existent-slug");
    expect(nonExistent).toBeNull();
  });

  it("should get custom slug for a given path", async () => {
    const slug1 = await getSlugForPath("/about");
    expect(slug1).toBe("/about-us-slug");

    // Path without custom slug should return the original path
    const slug2 = await getSlugForPath("/contact");
    expect(slug2).toBe("/contact");
  });

  it("should behave correctly within the usePageSlugs React hook", async () => {
    const { result } = renderHook(() => usePageSlugs());

    // Hook starts loading
    expect(result.current.loaded).toBe(false);

    // Wait for the hook to finish resolution
    await waitFor(() => {
      expect(result.current.loaded).toBe(true);
    });

    // Check slug Map resolution
    expect(result.current.slugMap["/about"]).toBe("/about-us-slug");
    expect(result.current.slugMap["/contact"]).toBe("/contact");

    // Test resolve utility inside hook
    expect(result.current.resolve("/about")).toBe("/about-us-slug");
    expect(result.current.resolve("/contact")).toBe("/contact");
    expect(result.current.resolve("/unmapped")).toBe("/unmapped"); // fallback
  });
});
