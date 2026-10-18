import { JsonLd } from "./JsonLd";
import { SITE_URL, ORGANIZATION_ID } from "@/lib/site-url";

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
        "@id": `${SITE_URL}/#website`,
        name: "Geosynthetics Africa",
        url: SITE_URL,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: ["en", "fr", "pt"],
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
