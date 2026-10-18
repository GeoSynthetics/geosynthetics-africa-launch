import { SITE_URL, absoluteUrl } from "@/lib/site-url";
import { BUSINESS, GROUP_COMPANIES } from "@/lib/business-info";
import { SITEMAP_SECTIONS, type SitemapEntry } from "@/lib/sitemap";

/** Sections listed first; the French / Portuguese pages go under "Optional". */
const MAIN_SECTIONS = ["pages", "solutions", "countries", "catalogue", "insights"] as const;

function linkLine(e: SitemapEntry): string {
  return `- [${e.title.replace(/[[\]]/g, "")}](${absoluteUrl(e.path)})`;
}

function sectionBlock(entries: SitemapEntry[], label: string): string {
  if (entries.length === 0) return "";
  const lines = [`## ${label}`, ""];
  let group = "";
  for (const e of entries) {
    if (e.group && e.group !== group && e.group !== label) {
      group = e.group;
      lines.push("", `### ${group}`, "");
    }
    lines.push(linkLine(e));
  }
  return lines.join("\n");
}

/**
 * Builds /llms.txt (https://llmstxt.org): a plain-Markdown summary of who
 * Geosynthetics Africa is and links to every indexable page, so AI assistants
 * can understand the business and cite the right pages.
 */
export function buildLlmsTxt(entries: SitemapEntry[]): string {
  const labelOf = (key: string) => SITEMAP_SECTIONS.find((s) => s.key === key)?.label || key;
  const seen = new Set<string>();
  const unique = entries.filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)));

  const a = BUSINESS.address;
  const header = [
    `# ${BUSINESS.name}`,
    "",
    `> ${BUSINESS.description}`,
    "",
    `${BUSINESS.name} (${BUSINESS.legalName}) supplies and installs geosynthetics across Africa: geomembrane liners (HDPE, LLDPE, PVC, EPDM), geotextiles, geogrids, geocells, geosynthetic clay liners (GCLs), drainage geocomposites, gabions and erosion-control products. Services include certified liner installation, QA/QC testing, design support and logistics to site for mining, water, landfill, agriculture and civil infrastructure projects.`,
    "",
    `- Website: ${SITE_URL}`,
    `- Head office: ${a.streetAddress}, ${a.addressLocality}, ${a.addressRegion}, ${a.postalCode}, South Africa`,
    `- Sales: ${BUSINESS.email} · ${BUSINESS.telephone}`,
    `- In business since: ${BUSINESS.foundingDate}`,
    ...BUSINESS.memberOf.map((m) => `- Member of: ${m.name} (${m.url})`),
    ...GROUP_COMPANIES.map((c) => `- Group company: ${c.name} (${c.url}), ${c.country}`),
    `- Area served: all 54 African countries`,
    `- Languages: English, French, Portuguese`,
  ].join("\n");

  const main = MAIN_SECTIONS.map((key) =>
    sectionBlock(
      unique.filter((e) => e.section === key),
      labelOf(key),
    ),
  ).filter(Boolean);

  const optional = unique.filter((e) => !(MAIN_SECTIONS as readonly string[]).includes(e.section));
  const optionalBlock = optional.length
    ? ["## Optional", "", ...optional.map(linkLine)].join("\n")
    : "";

  return [header, ...main, optionalBlock].filter(Boolean).join("\n\n") + "\n";
}
