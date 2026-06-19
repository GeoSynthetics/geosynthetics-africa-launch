import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";

if (typeof globalThis.document === "undefined") {
  const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
  });
  (globalThis as any).window = jsdom.window;
  (globalThis as any).document = jsdom.window.document;
  (globalThis as any).navigator = jsdom.window.navigator;
  (globalThis as any).HTMLElement = jsdom.window.HTMLElement;
  (globalThis as any).HTMLAnchorElement = jsdom.window.HTMLAnchorElement;
  (globalThis as any).HTMLButtonElement = jsdom.window.HTMLButtonElement;
  
  // Set up requestAnimationFrame and cancelAnimationFrame
  (globalThis as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
  (globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}

// Mock IntersectionObserver globally for tests
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    if (options) {
      this.root = options.root ?? null;
      this.rootMargin = options.rootMargin ?? "";
      this.thresholds = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold ?? 0];
    }
  }

  observe(target: Element) {
    (target as any)._intersectionObserver = this;
  }

  unobserve(target: Element) {
    delete (target as any)._intersectionObserver;
  }

  disconnect() {}
}

(globalThis as any).IntersectionObserver = MockIntersectionObserver;

// Mock localStorage globally for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

(globalThis as any).localStorage = localStorageMock;
if ((globalThis as any).window) {
  Object.defineProperty((globalThis as any).window, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
}


