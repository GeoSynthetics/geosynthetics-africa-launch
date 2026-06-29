import { describe, it, expect } from "vitest";
import { VIDEO_HOST_RE, getCategory } from "@/lib/resource-categories";

describe("RESOURCE_CATEGORIES utilities", () => {
  it("should match valid video host domains using VIDEO_HOST_RE", () => {
    const validUrls = [
      "https://youtube.com/watch?v=123",
      "http://youtu.be/123",
      "https://vimeo.com/456",
      "https://wistia.com/medias/789",
      "https://www.youtube.com/embed/abc",
    ];

    for (const url of validUrls) {
      expect(VIDEO_HOST_RE.test(url)).toBe(true);
    }
  });

  it("should reject non-video urls using VIDEO_HOST_RE", () => {
    const invalidUrls = [
      "https://geosynthetics.co.za/datasheet.pdf",
      "https://example.com/installation-guide.docx",
      "https://github.com",
      "",
    ];

    for (const url of invalidUrls) {
      expect(VIDEO_HOST_RE.test(url)).toBe(false);
    }
  });

  it("should retrieve resource categories correctly using getCategory", () => {
    const category = getCategory("datasheets");
    expect(category).toBeDefined();
    expect(category?.title).toBe("Datasheets");
    expect(category?.types).toContain("tds");

    const nonExistent = getCategory("invalid-slug");
    expect(nonExistent).toBeUndefined();
  });
});
