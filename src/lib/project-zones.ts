/**
 * Project zones used on every enquiry form and for matching case studies to
 * country pages. Forms ask for a zone (not a long country list) so a buyer in
 * any African country can answer in one tap and the enquiry still routes to
 * the right hub.
 */
export const PROJECT_ZONES = [
  "Southern Africa",
  "East Africa",
  "West Africa",
  "North Africa",
  "Other",
] as const;

export type ProjectZone = (typeof PROJECT_ZONES)[number];

/** Delivery scope options shared by the enquiry forms. */
export const PROJECT_SCOPES = [
  "Supply only",
  "Supply + installation",
  "Installation only",
  "Testing / CQA",
  "Design support",
] as const;

/** Languages our teams quote and report in. */
export const PROJECT_LANGUAGES = ["English", "Français", "Português"] as const;

/**
 * Country → zone. DRC and the Copperbelt sit in Southern Africa because they
 * are served by road from Johannesburg through SADC corridors; countries with
 * no natural hub fall back to "Other".
 */
const COUNTRY_ZONES: Record<string, ProjectZone> = {
  "south africa": "Southern Africa",
  botswana: "Southern Africa",
  namibia: "Southern Africa",
  zimbabwe: "Southern Africa",
  zambia: "Southern Africa",
  mozambique: "Southern Africa",
  malawi: "Southern Africa",
  angola: "Southern Africa",
  eswatini: "Southern Africa",
  swaziland: "Southern Africa",
  lesotho: "Southern Africa",
  madagascar: "Southern Africa",
  mauritius: "Southern Africa",
  "democratic republic of congo": "Southern Africa",
  "democratic republic of the congo": "Southern Africa",
  "dr congo": "Southern Africa",
  drc: "Southern Africa",
  tanzania: "East Africa",
  kenya: "East Africa",
  uganda: "East Africa",
  rwanda: "East Africa",
  burundi: "East Africa",
  ethiopia: "East Africa",
  "south sudan": "East Africa",
  djibouti: "East Africa",
  eritrea: "East Africa",
  somalia: "East Africa",
  mali: "West Africa",
  "burkina faso": "West Africa",
  niger: "West Africa",
  ghana: "West Africa",
  "côte d'ivoire": "West Africa",
  "cote d'ivoire": "West Africa",
  "ivory coast": "West Africa",
  guinea: "West Africa",
  "sierra leone": "West Africa",
  liberia: "West Africa",
  senegal: "West Africa",
  nigeria: "West Africa",
  togo: "West Africa",
  benin: "West Africa",
  gambia: "West Africa",
  "guinea-bissau": "West Africa",
  egypt: "North Africa",
  morocco: "North Africa",
  mauritania: "North Africa",
  algeria: "North Africa",
  tunisia: "North Africa",
  libya: "North Africa",
  sudan: "North Africa",
};

export function zoneForCountry(country: string | null | undefined): ProjectZone | null {
  if (!country) return null;
  const key = country
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\(.*?\)/g, "")
    .trim();
  return COUNTRY_ZONES[key] ?? null;
}

/** Formats the extra enquiry fields as labelled lines for the stored request. */
export function formatEnquiryMeta(meta: {
  zone?: string | null;
  country?: string | null;
  scope?: string | null;
  language?: string | null;
}): string {
  const lines = [
    meta.zone ? `Zone: ${meta.zone}` : "",
    meta.country ? `Country: ${meta.country}` : "",
    meta.scope ? `Scope: ${meta.scope}` : "",
    meta.language ? `Preferred language: ${meta.language}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}
