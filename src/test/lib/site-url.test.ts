import { describe, it, expect } from "vitest";
import {
  SITE_URL,
  SITE_HOST,
  absoluteUrl,
  isProductionHost,
  DEFAULT_SITE_URL,
} from "@/lib/site-url";

describe("site-url", () => {
  it("defaults to the live geosyntheticsafrica.com domain", () => {
    expect(DEFAULT_SITE_URL).toBe("https://www.geosyntheticsafrica.com");
    expect(SITE_URL).toBe("https://www.geosyntheticsafrica.com");
    expect(SITE_HOST).toBe("www.geosyntheticsafrica.com");
  });

  it("treats both www and bare geosyntheticsafrica.com as production", () => {
    expect(isProductionHost("www.geosyntheticsafrica.com")).toBe(true);
    expect(isProductionHost("geosyntheticsafrica.com")).toBe(true);
    expect(isProductionHost("GeosyntheticsAfrica.com:443")).toBe(true);
  });

  it("treats preview and old hosts as non-production", () => {
    expect(isProductionHost("geosynthetics-africa.vercel.app")).toBe(false);
    expect(isProductionHost("geosynthetics.co.za")).toBe(false);
    expect(isProductionHost("localhost:5173")).toBe(false);
    expect(isProductionHost(null)).toBe(false);
  });

  it("builds clean canonical URLs", () => {
    expect(absoluteUrl("/")).toBe("https://www.geosyntheticsafrica.com/");
    expect(absoluteUrl("/projects/")).toBe("https://www.geosyntheticsafrica.com/projects");
    expect(absoluteUrl("/catalogue?q=liner#top")).toBe(
      "https://www.geosyntheticsafrica.com/catalogue",
    );
    expect(absoluteUrl("blog/post")).toBe("https://www.geosyntheticsafrica.com/blog/post");
  });
});
