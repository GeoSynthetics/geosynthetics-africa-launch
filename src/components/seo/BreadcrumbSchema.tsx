import { JsonLd } from "./JsonLd";

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * BreadcrumbList structured data.
 * Renders a JSON-LD breadcrumb trail for rich snippets in Google search results.
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
