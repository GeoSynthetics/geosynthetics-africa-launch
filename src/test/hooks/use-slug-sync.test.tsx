import "../setup";
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { formatSlugInput, slugify } from "@/lib/utils";
import { useSlugSync } from "@/hooks/use-slug-sync";

describe("Slug Utilities", () => {
  describe("formatSlugInput", () => {
    it("should lowercase inputs", () => {
      expect(formatSlugInput("TEST")).toBe("test");
      expect(formatSlugInput("Test-Slug")).toBe("test-slug");
    });

    it("should replace spaces with hyphens", () => {
      expect(formatSlugInput("test slug")).toBe("test-slug");
      expect(formatSlugInput("test  slug  with   spaces")).toBe("test-slug-with-spaces");
    });

    it("should replace other special characters with hyphens", () => {
      expect(formatSlugInput("test@slug!")).toBe("test-slug-");
      expect(formatSlugInput("test/slug#2")).toBe("test-slug-2");
    });

    it("should collapse multiple hyphens", () => {
      expect(formatSlugInput("test--slug")).toBe("test-slug");
      expect(formatSlugInput("test---slug")).toBe("test-slug");
    });

    it("should preserve trailing hyphens for typing", () => {
      expect(formatSlugInput("test-")).toBe("test-");
    });
  });

  describe("slugify", () => {
    it("should perform full clean (including stripping trailing/leading hyphens)", () => {
      expect(slugify("  -TEST-SLUG-  ")).toBe("test-slug");
      expect(slugify("test-slug-")).toBe("test-slug");
      expect(slugify("-test-slug")).toBe("test-slug");
    });
  });
});

describe("useSlugSync Hook", () => {
  it("should auto-sync slug when title changes", () => {
    let currentSlug = "";
    const onSlugChange = vi.fn((newSlug) => {
      currentSlug = newSlug;
    });

    const { rerender } = renderHook(
      ({ title, slug }) => useSlugSync({ title, slug, onSlugChange }),
      { initialProps: { title: "", slug: "" } }
    );

    // Change title
    rerender({ title: "New Title", slug: currentSlug });
    expect(onSlugChange).toHaveBeenCalledWith("new-title");
    expect(currentSlug).toBe("new-title");

    // Change title again
    rerender({ title: "Another Title!", slug: currentSlug });
    expect(onSlugChange).toHaveBeenCalledWith("another-title");
  });

  it("should stop syncing once slug is manually edited", () => {
    let currentSlug = "";
    const onSlugChange = vi.fn((newSlug) => {
      currentSlug = newSlug;
    });

    const { result, rerender } = renderHook(
      ({ title, slug }) => useSlugSync({ title, slug, onSlugChange }),
      { initialProps: { title: "Title", slug: "" } }
    );

    // Initial sync
    rerender({ title: "Title", slug: currentSlug });
    expect(currentSlug).toBe("title");

    // Manually change slug
    act(() => {
      result.current.handleSlugChange("custom-slug");
    });
    expect(onSlugChange).toHaveBeenLastCalledWith("custom-slug");
    expect(result.current.isManual).toBe(true);

    // Change title — slug should NOT change
    onSlugChange.mockClear();
    rerender({ title: "Brand New Title", slug: currentSlug });
    expect(onSlugChange).not.toHaveBeenCalled();
    expect(currentSlug).toBe("custom-slug");
  });

  it("should start syncing again if slug is cleared", () => {
    let currentSlug = "";
    const onSlugChange = vi.fn((newSlug) => {
      currentSlug = newSlug;
    });

    const { result, rerender } = renderHook(
      ({ title, slug }) => useSlugSync({ title, slug, onSlugChange }),
      { initialProps: { title: "Title", slug: "" } }
    );

    // Initial sync
    rerender({ title: "Title", slug: currentSlug });

    // Manually edit slug
    act(() => {
      result.current.handleSlugChange("custom-slug");
    });
    expect(result.current.isManual).toBe(true);

    // Clear slug
    act(() => {
      result.current.handleSlugChange("");
    });
    expect(result.current.isManual).toBe(false);

    // Change title — should sync again
    rerender({ title: "New Hope", slug: "" });
    expect(onSlugChange).toHaveBeenLastCalledWith("new-hope");
  });

  it("should clean up trailing hyphens on blur", () => {
    let currentSlug = "test-slug-";
    const onSlugChange = vi.fn((newSlug) => {
      currentSlug = newSlug;
    });

    const { result } = renderHook(() =>
      useSlugSync({ title: "Test Slug", slug: currentSlug, onSlugChange })
    );

    act(() => {
      result.current.handleSlugBlur();
    });

    expect(onSlugChange).toHaveBeenCalledWith("test-slug");
    expect(currentSlug).toBe("test-slug");
  });
});
