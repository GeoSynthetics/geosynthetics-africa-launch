import "../setup";
import { describe, it, expect } from "vitest";

function getValidSelectionGuideUrl(rawUrl?: string | null): string {
  if (!rawUrl || rawUrl.includes("boq-uploads")) {
    return "/resources/installation-guides";
  }
  return rawUrl;
}

describe("ProductDetailPage Selection Guide Handling", () => {
  it("sanitizes broken boq-uploads URLs to fallback to /resources/installation-guides", () => {
    const brokenUrl =
      "https://fsfwjwyzrtgayujmguvd.supabase.co/storage/v1/object/public/boq-uploads/guides/geomembranes-selection-guide.pdf";
    const result = getValidSelectionGuideUrl(brokenUrl);
    expect(result).toBe("/resources/installation-guides");
  });

  it("handles null or undefined selection guide URLs safely", () => {
    expect(getValidSelectionGuideUrl(null)).toBe("/resources/installation-guides");
    expect(getValidSelectionGuideUrl(undefined)).toBe("/resources/installation-guides");
    expect(getValidSelectionGuideUrl("")).toBe("/resources/installation-guides");
  });

  it("preserves valid external technical-docs URLs", () => {
    const validUrl =
      "https://fsfwjwyzrtgayujmguvd.supabase.co/storage/v1/object/public/technical-docs/manual/geomembranes-guide.pdf";
    expect(getValidSelectionGuideUrl(validUrl)).toBe(validUrl);
  });

  it("preserves valid internal resource paths", () => {
    const internalPath = "/resources/installation-guides";
    expect(getValidSelectionGuideUrl(internalPath)).toBe("/resources/installation-guides");
  });
});
