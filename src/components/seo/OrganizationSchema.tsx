import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/site-url";
import { BUSINESS, AFRICAN_COUNTRY_CODES } from "@/lib/business-info";

/**
 * Global Organization structured data.
 * Renders once in the root layout so every page inherits it.
 *
 * @see https://schema.org/Organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@type": "Organization",
        name: BUSINESS.name,
        legalName: BUSINESS.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/logo-512.png`,
        description: BUSINESS.description,
        address: {
          "@type": "PostalAddress",
          ...BUSINESS.address,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: BUSINESS.telephone,
            contactType: "sales",
            email: BUSINESS.email,
            availableLanguage: ["English"],
            areaServed: [...AFRICAN_COUNTRY_CODES],
          },
        ],
        sameAs: [],
        areaServed: { "@type": "Continent", name: "Africa" },
        knowsAbout: [
          "Geomembranes",
          "Geotextiles",
          "Geogrids",
          "Geocells",
          "GCLs",
          "HDPE Liner Installation",
          "Geosynthetic QA/QC Testing",
          "Mining Containment Systems",
          "Dam Lining",
          "Erosion Control",
        ],
      }}
    />
  );
}
