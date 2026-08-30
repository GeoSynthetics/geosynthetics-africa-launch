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
  (globalThis as any).Element = jsdom.window.Element;
  (globalThis as any).Node = jsdom.window.Node;
  (globalThis as any).HTMLElement = jsdom.window.HTMLElement;
  (globalThis as any).HTMLAnchorElement = jsdom.window.HTMLAnchorElement;
  (globalThis as any).HTMLButtonElement = jsdom.window.HTMLButtonElement;
  (globalThis as any).HTMLInputElement = jsdom.window.HTMLInputElement;
  (globalThis as any).HTMLTextAreaElement = jsdom.window.HTMLTextAreaElement;
  (globalThis as any).HTMLSelectElement = jsdom.window.HTMLSelectElement;
  (globalThis as any).HTMLOptionElement = jsdom.window.HTMLOptionElement;
  (globalThis as any).DocumentFragment = jsdom.window.DocumentFragment;
  (globalThis as any).NodeFilter = jsdom.window.NodeFilter;
  (globalThis as any).Event = jsdom.window.Event;
  (globalThis as any).CustomEvent = jsdom.window.CustomEvent;
  (globalThis as any).MutationObserver = jsdom.window.MutationObserver;

  // Set up requestAnimationFrame and cancelAnimationFrame
  (globalThis as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
  (globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}

// Mock IntersectionObserver globally for tests
class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
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

// Mock ResizeObserver globally for tests
class MockResizeObserver {
  constructor(public callback: ResizeObserverCallback) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
}

(globalThis as any).ResizeObserver = MockResizeObserver;

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

  const matchMediaMock = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });

  (globalThis as any).window.matchMedia = matchMediaMock;
  (globalThis as any).matchMedia = matchMediaMock;

  const getComputedStyleMock = (elt: any) =>
    elt?.style || {
      getPropertyValue: () => "",
      transform: "none",
      opacity: "1",
    };

  if (!(globalThis as any).window.getComputedStyle) {
    (globalThis as any).window.getComputedStyle = getComputedStyleMock;
  }
  if (!(globalThis as any).getComputedStyle) {
    (globalThis as any).getComputedStyle = getComputedStyleMock;
  }
}


