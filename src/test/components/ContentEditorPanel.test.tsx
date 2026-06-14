import { describe, it, expect } from "vitest";
import { stripHtml, truncateSpec } from "@/components/admin/ContentEditorPanel";

describe("ContentEditorPanel - stripHtml utility", () => {
  it("should strip simple HTML tags and clean up whitespace", () => {
    const html = "<p>Hello <strong>World</strong>!</p>";
    expect(stripHtml(html)).toBe("Hello World !");
  });

  it("should handle null and undefined inputs gracefully", () => {
    expect(stripHtml(null)).toBe("");
    expect(stripHtml(undefined)).toBe("");
  });

  it("should replace &nbsp; with spaces", () => {
    const html = "Hello&nbsp;World";
    expect(stripHtml(html)).toBe("Hello World");
  });

  it("should handle complex nested HTML elements", () => {
    const html =
      "<ul>\r\n <li>High-strength monofilament polypropylene</li>\r\n <li>Superior filtration: 30 L/s/m² water permeability; retains ultra-fines</li>\r\n</ul>";
    const result = stripHtml(html);
    expect(result).toContain("High-strength monofilament polypropylene");
    expect(result).toContain(
      "Superior filtration: 30 L/s/m² water permeability; retains ultra-fines",
    );
    expect(result).not.toContain("<ul>");
    expect(result).not.toContain("<li>");
  });
});

describe("ContentEditorPanel - truncateSpec utility", () => {
  it("should return empty string for null, undefined, or empty input", () => {
    expect(truncateSpec(null)).toBe("");
    expect(truncateSpec(undefined)).toBe("");
    expect(truncateSpec("")).toBe("");
  });

  it("should not modify strings under 62 characters", () => {
    const shortText = "Short description";
    expect(truncateSpec(shortText)).toBe(shortText);
  });

  it("should truncate strings longer than 62 characters to exactly 62 characters", () => {
    const longText =
      "This is a very long description that is definitely going to exceed the maximum character limit of sixty-two characters.";
    const result = truncateSpec(longText);
    expect(result).toHaveLength(62);
    expect(result).toBe("This is a very long description that is definitely going to ex");
  });
});
