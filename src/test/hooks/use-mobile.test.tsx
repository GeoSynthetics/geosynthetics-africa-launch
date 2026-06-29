import "../setup";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

describe("useIsMobile hook", () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;
  let addEventListenerMock: any;
  let removeEventListenerMock: any;

  beforeEach(() => {
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();

    // Mock matchMedia API
    (window as any).matchMedia = vi.fn().mockImplementation((query) => ({
      matches: window.innerWidth < 768,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    (window as any).innerWidth = originalInnerWidth;
    vi.clearAllMocks();
  });

  it("should return true when innerWidth is below mobile breakpoint (768px)", () => {
    (window as any).innerWidth = 500;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("should return false when innerWidth is equal to or above mobile breakpoint (768px)", () => {
    (window as any).innerWidth = 800;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("should setup listener on mount and cleanup listener on unmount", () => {
    (window as any).innerWidth = 1024;

    const { unmount } = renderHook(() => useIsMobile());

    expect(addEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should update isMobile state when the media query listener fires", () => {
    (window as any).innerWidth = 1024;
    let changeHandler: any = null;
    addEventListenerMock.mockImplementation((_event: string, handler: any) => {
      changeHandler = handler;
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      (window as any).innerWidth = 400;
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(true);
  });
});
