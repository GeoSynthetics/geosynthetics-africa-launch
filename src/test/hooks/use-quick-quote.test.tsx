import "../setup";
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QuickQuoteProvider, useQuickQuote } from "@/hooks/use-quick-quote";
import * as React from "react";

describe("useQuickQuote hook & Provider", () => {
  it("should throw an error when used outside of QuickQuoteProvider", () => {
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useQuickQuote());
    }).toThrow("useQuickQuote must be used within QuickQuoteProvider");

    console.error = consoleError;
  });

  it("should provide initial state as closed", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuickQuoteProvider>{children}</QuickQuoteProvider>
    );

    const { result } = renderHook(() => useQuickQuote(), { wrapper });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.productName).toBeNull();
    expect(result.current.productId).toBeNull();
  });

  it("should update state correctly when open is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuickQuoteProvider>{children}</QuickQuoteProvider>
    );

    const { result } = renderHook(() => useQuickQuote(), { wrapper });

    act(() => {
      result.current.open("HDPE Geomembrane", "prod_123");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.productName).toBe("HDPE Geomembrane");
    expect(result.current.productId).toBe("prod_123");
  });

  it("should fallback to nulls if open is called without arguments", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuickQuoteProvider>{children}</QuickQuoteProvider>
    );

    const { result } = renderHook(() => useQuickQuote(), { wrapper });

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.productName).toBeNull();
    expect(result.current.productId).toBeNull();
  });

  it("should ignore non-string arguments such as SyntheticEvent objects", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuickQuoteProvider>{children}</QuickQuoteProvider>
    );

    const { result } = renderHook(() => useQuickQuote(), { wrapper });

    act(() => {
      // Simulate click event being passed directly as parameter
      (result.current.open as any)({ _reactName: "onClick", type: "click" });
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.productName).toBeNull();
    expect(result.current.productId).toBeNull();
  });

  it("should reset state correctly when close is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuickQuoteProvider>{children}</QuickQuoteProvider>
    );

    const { result } = renderHook(() => useQuickQuote(), { wrapper });

    act(() => {
      result.current.open("HDPE Geomembrane", "prod_123");
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.productName).toBeNull();
    expect(result.current.productId).toBeNull();
  });
});
