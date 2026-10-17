import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/site-url";
import { BUSINESS } from "@/lib/business-info";

/**
 * LocalBusiness structured data for the Contacts page.
 * Enables Google Knowledge Panel and local business rich results.
 *
 * @see https://schema.org/LocalBusiness
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 */
export function LocalBusinessSchema() {
  return (
    <JsonLd
      data={{
        "@type": "LocalBusiness",
        name: BUSINESS.name,
        url: SITE_URL,
        image: `${SITE_URL}/og-image.jpg`,
        logo: `${SITE_URL}/logo-512.png`,
        telephone: BUSINESS.telephone,
        email: BUSINESS.email,
        address: {
          "@type": "PostalAddress",
          ...BUSINESS.address,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          ...BUSINESS.openingHours,
        },
        areaServed: { "@type": "Continent", name: "Africa" },
        description: BUSINESS.description,
      }}
    />
  );
}
