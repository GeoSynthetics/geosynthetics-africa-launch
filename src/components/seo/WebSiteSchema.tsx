import { JsonLd } from "./JsonLd";

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
        url: "https://geosynthetics.co.za",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://geosynthetics.co.za/catalogue?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
