import { describe, it, expect } from "vitest";
import {
  baseNameFromUrl,
  findExternalUrls,
  isExternalUploadUrl,
  replaceExternalUrls,
} from "@/lib/external-images";

const OLD =
  "https://geosynthetics.com/wp-content/uploads/2026/01/Leakage-detection-liner-south-africa-hdpe.png";
const OLD2 = "https://www.geosynthetics.com/wp-content/uploads/2026/04/Bera-Gravel-Fix-Pro.jpg";

describe("external-images", () => {
  it("only accepts old-site uploads", () => {
    expect(isExternalUploadUrl(OLD)).toBe(true);
    expect(isExternalUploadUrl(OLD2)).toBe(true);
    expect(isExternalUploadUrl("https://geosynthetics.com/contact/")).toBe(false);
    expect(isExternalUploadUrl("https://evil.example.com/wp-content/uploads/x.png")).toBe(false);
    expect(isExternalUploadUrl("not a url")).toBe(false);
  });

  it("finds URLs nested in JSON values and HTML strings", () => {
    const row = {
      image_url: OLD,
      gallery: [{ url: OLD2 }, { url: "https://www.geosyntheticsafrica.com/a.png" }],
      body: `<p><img src="${OLD}"></p>`,
    };
    expect([...findExternalUrls(row)].sort()).toEqual([OLD, OLD2].sort());
  });

  it("replaces only mapped URLs", () => {
    const map = new Map([
      [OLD, "https://www.geosyntheticsafrica.com/api/storage/media-center/x.webp"],
    ]);
    const out = replaceExternalUrls({ a: OLD, b: [OLD2], c: `<img src="${OLD}">` }, map);
    expect(out.a).toBe("https://www.geosyntheticsafrica.com/api/storage/media-center/x.webp");
    expect(out.b[0]).toBe(OLD2);
    expect(out.c).toContain("/api/storage/media-center/x.webp");
  });

  it("builds descriptive file names", () => {
    expect(baseNameFromUrl(OLD)).toBe("leakage-detection-liner-south-africa-hdpe");
  });
});
