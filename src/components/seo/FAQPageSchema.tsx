import { JsonLd } from "./JsonLd";
import { cleanFaqEntries, type FaqEntry } from "@/lib/faq";

/**
 * FAQPage structured data for a page's visible FAQ list.
 * Render at most once per page, with the same questions the page shows.
 *
 * @see https://schema.org/FAQPage
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function FAQPageSchema({ items }: { items: FaqEntry[] | null | undefined }) {
  const entries = cleanFaqEntries(items);
  if (entries.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@type": "FAQPage",
        mainEntity: entries.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}
