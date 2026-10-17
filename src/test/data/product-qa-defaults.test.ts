import { describe, it, expect } from "vitest";
import { FAMILY_QA_PROFILE, defaultQaForFamily } from "@/data/product-qa-defaults";

describe("product QA defaults", () => {
  it("has content for every family it maps", () => {
    for (const family of Object.keys(FAMILY_QA_PROFILE)) {
      const qa = defaultQaForFamily(family);
      expect(qa, family).not.toBeNull();
      expect(qa!.checklist.length, family).toBeGreaterThan(0);
      expect(qa!.standards.length, family).toBeGreaterThan(0);
    }
  });

  it("gives gabions gabion standards, not geomembrane welding", () => {
    const qa = defaultQaForFamily("galvanised-woven-gabion-baskets")!;
    const text = JSON.stringify(qa);
    expect(text).toContain("EN 10223-3");
    expect(text).not.toMatch(/vacuum box|GRI-GM/i);
  });

  it("returns null for an unknown family", () => {
    expect(defaultQaForFamily("unknown-family", undefined, null)).toBeNull();
  });
});
