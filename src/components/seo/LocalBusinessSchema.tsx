import { JsonLd } from "./JsonLd";

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
        name: "Geosynthetics Africa",
        url: "https://geosynthetics.co.za",
        telephone: "+27-78-1355-926",
        email: "sales@geosynthetics.co.za",
        address: {
          "@type": "PostalAddress",
          streetAddress: "7 Tamar Avenue, Lea Glen",
          addressLocality: "Randburg, Johannesburg",
          postalCode: "2191",
          addressRegion: "Gauteng",
          addressCountry: "ZA",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -26.1467,
          longitude: 27.9164,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:30",
          closes: "17:00",
        },
        areaServed: [
          { "@type": "Country", name: "South Africa" },
          { "@type": "Country", name: "Botswana" },
          { "@type": "Country", name: "Namibia" },
          { "@type": "Country", name: "Zimbabwe" },
          { "@type": "Country", name: "Mozambique" },
          { "@type": "Country", name: "Zambia" },
        ],
        description:
          "Africa's Integrated Geosynthetics Execution Platform — supply, installation, QA/QC testing and logistics for geomembranes, geotextiles, geogrids and engineered lining systems.",
      }}
    />
  );
}
