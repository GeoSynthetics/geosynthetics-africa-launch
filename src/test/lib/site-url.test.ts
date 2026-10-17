import { describe, it, expect } from "vitest";
import { SITE_URL, siteUrl, isProductionHost } from "@/lib/site-url";

describe("site-url", () => {
  it("uses geosyntheticsafrica.com as the canonical site", () => {
    expect(SITE_URL).toBe("https://www.geosyntheticsafrica.com");
  });

  it("builds absolute URLs on the canonical site", () => {
    expect(siteUrl()).toBe(SITE_URL);
    expect(siteUrl("/")).toBe(SITE_URL);
    expect(siteUrl("/catalogue/abc")).toBe(`${SITE_URL}/catalogue/abc`);
    expect(siteUrl("catalogue")).toBe(`${SITE_URL}/catalogue`);
  });

  it("treats only geosyntheticsafrica.com hosts as production", () => {
    expect(isProductionHost("geosyntheticsafrica.com")).toBe(true);
    expect(isProductionHost("www.geosyntheticsafrica.com")).toBe(true);
    expect(isProductionHost("WWW.GeosyntheticsAfrica.com:443")).toBe(true);
    expect(isProductionHost("geosynthetics.co.za")).toBe(false);
    expect(isProductionHost("preview.vercel.app")).toBe(false);
    expect(isProductionHost(null)).toBe(false);
  });
});
