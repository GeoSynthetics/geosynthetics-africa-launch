/**
 * Geosynthetics Africa business details used in structured data (JSON-LD).
 *
 * Keep these identical to the Geosynthetics Africa Google Business Profile
 * (name, address, phone), so Google treats the website and the profile as the
 * same business. Do not mix in the geosynthetics.com head-office details.
 */
export const BUSINESS = {
  name: "Geosynthetics Africa",
  legalName: "Geosynthetics Africa (Pty) Ltd",
  email: "sales@geosyntheticsafrica.com",
  telephone: "+27-72-343-0868",
  address: {
    streetAddress: "11 Arum Lily Street, Fisantekraal Industrial",
    addressLocality: "Durbanville, Cape Town",
    addressRegion: "Western Cape",
    postalCode: "7550",
    addressCountry: "ZA",
  },
  openingHours: {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:30",
    closes: "17:00",
  },
  description:
    "Africa's Integrated Geosynthetics Execution Platform — supply, installation, QA/QC testing and logistics for geomembranes, geotextiles, geogrids and engineered lining systems.",
  /** Year the business started (About page: "Geosynthetics specialist since 2016"). */
  foundingDate: "2016",
  /** Industry bodies the business belongs to. */
  memberOf: [
    {
      name: "International Association of Geosynthetic Installers (IAGI)",
      url: "https://www.iagi.org",
    },
  ],
} as const;

/** ISO 3166-1 alpha-2 codes for all 54 African countries. */
export const AFRICAN_COUNTRY_CODES = [
  "DZ",
  "AO",
  "BJ",
  "BW",
  "BF",
  "BI",
  "CV",
  "CM",
  "CF",
  "TD",
  "KM",
  "CG",
  "CD",
  "CI",
  "DJ",
  "EG",
  "GQ",
  "ER",
  "SZ",
  "ET",
  "GA",
  "GM",
  "GH",
  "GN",
  "GW",
  "KE",
  "LS",
  "LR",
  "LY",
  "MG",
  "MW",
  "ML",
  "MR",
  "MU",
  "MA",
  "MZ",
  "NA",
  "NE",
  "NG",
  "RW",
  "ST",
  "SN",
  "SC",
  "SL",
  "SO",
  "ZA",
  "SS",
  "SD",
  "TZ",
  "TG",
  "TN",
  "UG",
  "ZM",
  "ZW",
] as const;

/**
 * Country companies in the Geosynthetics Africa group, each with its own
 * website. Linked from the footer and listed as sub-organisations in the
 * Organization schema so search engines see one group, not competitors.
 * Add each country company's website here as it goes live.
 */
export const GROUP_COMPANIES: { name: string; url: string; country: string }[] = [
  {
    name: "Geosynthetics South Africa",
    url: "https://geosynthetics.co.za",
    country: "South Africa",
  },
];
