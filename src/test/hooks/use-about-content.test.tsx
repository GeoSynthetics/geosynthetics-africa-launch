import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useAboutContent,
  fetchAboutContent,
  updateAboutCache,
  invalidateAboutCache,
} from "@/hooks/use-about-content";
import { DEFAULT_ABOUT_PAGE_CONTENT, type AboutPageContent } from "@/types/about";

describe("useAboutContent Hook and utilities", () => {
  beforeEach(() => {
    invalidateAboutCache();
    vi.clearAllMocks();
  });

  it("should return default fallback about page content", () => {
    const { result } = renderHook(() => useAboutContent());

    expect(result.current.hero.eyebrow).toBe(DEFAULT_ABOUT_PAGE_CONTENT.hero.eyebrow);
    expect(result.current.hero.title).toBe(DEFAULT_ABOUT_PAGE_CONTENT.hero.title);
    expect(result.current.accountability.cards.length).toBe(3);
    expect(result.current.partners.partnerNames.length).toBeGreaterThan(0);
  });

  it("should update cache and notify listeners when updateAboutCache is called", () => {
    const { result } = renderHook(() => useAboutContent());

    const customContent: AboutPageContent = {
      ...DEFAULT_ABOUT_PAGE_CONTENT,
      hero: {
        ...DEFAULT_ABOUT_PAGE_CONTENT.hero,
        title: "Customized Hero Title",
      },
    };

    act(() => {
      updateAboutCache(customContent);
    });

    expect(result.current.hero.title).toBe("Customized Hero Title");
  });
});
