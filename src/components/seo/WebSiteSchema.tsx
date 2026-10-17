import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/site-url";

/**
 * WebSite structured data with SearchAction.
 * Enables the sitelinks search box in Google search results.
 *
 * Rendered once in the root layout so Google discovers the site search feature.
 *
 * @see https://schema.org/WebSite
 * @see https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@type": "WebSite",
        name: "Geosynthetics Africa",
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/catalogue?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
