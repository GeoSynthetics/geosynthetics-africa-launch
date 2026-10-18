import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { cleanFaqEntries } from "@/lib/faq";

const items = [
  { question: "What roll widths are available?", answer: "Standard 5.8m and 7.0m rolls." },
  { question: "Do you install in Zambia?", answer: "Yes, with our own <b>IAGI</b> crews." },
];

describe("FaqAccordion", () => {
  const html = renderToString(<FaqAccordion items={items} />);

  it("server-renders every answer, including closed ones", () => {
    expect(html).toContain("Standard 5.8m and 7.0m rolls.");
    expect(html).toContain("<details");
    expect(html).not.toContain("<details open");
  });

  it("emits one FAQPage JSON-LD block matching the visible questions", () => {
    const blocks = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/g) || [];
    expect(blocks).toHaveLength(1);
    const json = JSON.parse(blocks[0].replace(/<\/?script[^>]*>/g, ""));
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity).toHaveLength(2);
    expect(json.mainEntity[1].acceptedAnswer.text).toBe("Yes, with our own IAGI crews.");
  });

  it("can skip the schema and renders nothing for an empty list", () => {
    expect(renderToString(<FaqAccordion items={items} withSchema={false} />)).not.toContain(
      "ld+json",
    );
    expect(renderToString(<FaqAccordion items={[]} />)).toBe("");
  });
});

describe("cleanFaqEntries", () => {
  it("drops incomplete entries and strips HTML", () => {
    expect(
      cleanFaqEntries([
        { question: " Q1 ", answer: "<p>A1</p>" },
        { question: "", answer: "orphan" },
        { question: "Q3", answer: "   " },
      ]),
    ).toEqual([{ question: "Q1", answer: "A1" }]);
  });
});
