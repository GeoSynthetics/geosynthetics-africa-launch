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
