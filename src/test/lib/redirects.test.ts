import { describe, it, expect } from "vitest";
import { normalizePath, getRedirectTarget } from "@/lib/redirects";

describe("normalizePath function", () => {
  it("should lowercase and strip trailing slash", () => {
    expect(normalizePath("/Contact/")).toBe("/contact");
    expect(normalizePath("/CONTACT")).toBe("/contact");
    expect(normalizePath("CONTACT/")).toBe("/contact");
    expect(normalizePath("contacts")).toBe("/contacts");
  });

  it("should preserve single slash for root", () => {
    expect(normalizePath("/")).toBe("/");
  });
});

describe("getRedirectTarget function", () => {
  it("should dynamically map legacy WooCommerce product paths", async () => {
    const target = await getRedirectTarget("/product/gse-hdpe-smooth");
    expect(target).toBe("/catalogue/gse-hdpe-smooth");
  });
});
