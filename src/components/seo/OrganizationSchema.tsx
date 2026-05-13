import { JsonLd } from "./JsonLd";

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
        name: "Geosynthetics Africa",
        legalName: "Geosynthetics Africa (Pty) Ltd",
        url: "https://geosynthetics.co.za",
        logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/4a931b85-67d6-4d84-8611-c5fe69e8ab12",
        description:
          "Africa's Integrated Geosynthetics Execution Platform — supply, installation, QA/QC testing and logistics for geomembranes, geotextiles, geogrids and engineered lining systems.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "7 Tamar Avenue, Lea Glen",
          addressLocality: "Randburg, Johannesburg",
          postalCode: "2191",
          addressCountry: "ZA",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+27-78-1355-926",
            contactType: "sales",
            email: "sales@geosynthetics.co.za",
            availableLanguage: ["English"],
            areaServed: [
              "ZA",
              "BW",
              "NA",
              "ZW",
              "MZ",
              "ZM",
            ],
          },
        ],
        sameAs: [],
        areaServed: {
          "@type": "Place",
          name: "Southern Africa",
        },
        foundingLocation: {
          "@type": "Place",
          name: "Johannesburg, South Africa",
        },
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
