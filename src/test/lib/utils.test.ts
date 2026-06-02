import { describe, it, expect } from "vitest";
import { splitIntoParagraphs } from "@/lib/utils";

describe("splitIntoParagraphs utility function", () => {
  it("should split single string with double newlines into clean paragraph arrays", () => {
    const input = "First paragraph.\n\nSecond paragraph.\r\n\r\nThird paragraph.";
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(3);
    expect(result[0]).toBe("First paragraph.");
    expect(result[1]).toBe("Second paragraph.");
    expect(result[2]).toBe("Third paragraph.");
  });

  it("should handle array of strings and split each item correctly", () => {
    const input = [
      "Para 1.\n\nPara 2.",
      "Para 3.",
      "Para 4.\r\n\r\nPara 5."
    ];
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(5);
    expect(result[0]).toBe("Para 1.");
    expect(result[1]).toBe("Para 2.");
    expect(result[2]).toBe("Para 3.");
    expect(result[3]).toBe("Para 4.");
    expect(result[4]).toBe("Para 5.");
  });

  it("should trim surrounding whitespace and ignore empty elements", () => {
    const input = "   First paragraph.   \n\n\n\n   \n\n   Second paragraph.   ";
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe("First paragraph.");
    expect(result[1]).toBe("Second paragraph.");
  });

  it("should return an empty array if input is null, undefined, or empty string", () => {
    expect(splitIntoParagraphs(null)).toEqual([]);
    expect(splitIntoParagraphs(undefined)).toEqual([]);
    expect(splitIntoParagraphs("")).toEqual([]);
    expect(splitIntoParagraphs("   ")).toEqual([]);
  });
});
