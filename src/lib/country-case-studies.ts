import { zoneForCountry } from "@/lib/project-zones";

export interface CountryCaseStudyCandidate {
  id: string;
  title?: string | null;
  summary?: string | null;
  country?: string | null;
  sector?: string | null;
  project_year?: number | string | null;
  [key: string]: unknown;
}

const RESIDENTIAL_PATTERN =
  /\b(residential|residence|driveway|guest\s?house|garden|house\s+\w+|landscap\w*|cycle path)\b/i;

function isResidential(cs: CountryCaseStudyCandidate): boolean {
  return RESIDENTIAL_PATTERN.test(`${cs.sector ?? ""} ${cs.title ?? ""}`);
}

function sameCountry(a: string | null | undefined, b: string): boolean {
  if (!a) return false;
  return a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase());
}

/**
 * Picks the case studies shown on a country page: projects in that country
 * first, then projects in the same zone, then other infrastructure projects.
 * Residential and landscaping jobs are only shown on their own country's page,
 * so a mining-country page never leads with a driveway.
 */
export function rankCountryCaseStudies<T extends CountryCaseStudyCandidate>(
  countryName: string,
  studies: T[],
  limit = 3,
  /** Projects matching this (e.g. the country's lead industry) rank first within each tier */
  preferred?: RegExp,
): T[] {
  const country = countryName.trim();
  if (!country) return studies.filter((cs) => !isResidential(cs)).slice(0, limit);
  const zone = zoneForCountry(country);

  const scored = studies
    .map((cs) => {
      const inCountry = sameCountry(cs.country, country);
      const inZone = !inCountry && zone !== null && zoneForCountry(cs.country) === zone;
      const residential = isResidential(cs);
      let score = 0;
      if (inCountry) score = 3;
      else if (residential) score = -1;
      else if (inZone) score = 2;
      else score = 1;
      const boost = preferred && preferred.test(`${cs.sector ?? ""} ${cs.title ?? ""}`) ? 0.5 : 0;
      return { cs, score: score > 0 ? score + boost : score, year: Number(cs.project_year) || 0 };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.year - a.year);

  return scored.slice(0, limit).map((row) => row.cs);
}

const INDUSTRY_PATTERNS: Record<string, RegExp> = {
  "mining-minerals-processing":
    /\b(min(e|es|ing)|tailings|TSF|ore|gold|copper|cobalt|lithium|diamond|leach|ROM)\b/i,
  "water-utilities-irrigation": /\b(reservoir|potable|water|dam|irrigation|canal)\b/i,
  "agriculture-aquaculture": /\b(irrigation|farm|aquaculture|pond)\b/i,
  "transport-infrastructure": /\b(road|rail|geogrid|stabilisation|wall|platform)\b/i,
  "waste-management-landfills": /\b(landfill|waste|sewer|wastewater|leachate)\b/i,
};

/** Keyword pattern for an industry page slug, used to prefer matching projects. */
export function industryPattern(industrySlug?: string): RegExp | undefined {
  return industrySlug ? INDUSTRY_PATTERNS[industrySlug] : undefined;
}
