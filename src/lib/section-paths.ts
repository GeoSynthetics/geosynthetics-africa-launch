import { supabase } from "@/integrations/supabase/client";

/**
 * URL structure for CMS-driven section pages.
 *
 * Every application, service and industry page lives under its section:
 *   /applications/{slug}   /services/{slug}   /industries/{slug}
 * The {slug} is always the page's own slug from Site Builder (never its
 * internal id), so the URL always matches the page that is shown.
 */
export type SectionKey = "applications" | "services" | "industries";

export const SECTION_KEYS: SectionKey[] = ["applications", "services", "industries"];

export const SECTION_LABELS: Record<SectionKey, string> = {
  applications: "Applications",
  services: "Services",
  industries: "Industries",
};

export function sectionPath(section: SectionKey, slug: string): string {
  return `/${section}/${slug}`;
}

/**
 * Old addresses that are not (or no longer) pages in Site Builder, mapped to
 * the closest live page. They come from earlier versions of the site and its
 * sitemap; redirecting them keeps any existing link working.
 */
export const LEGACY_SECTION_REDIRECTS: Record<string, string> = {
  // Former service pages
  supply: "/services",
  installation: "/services/geomembrane-liner-installation-africa",
  "qa-qc": "/quality-assurance",
  "design-support": "/services",
  logistics: "/services/hdpe-liners-geotextiles-gcl-geogrids-delivery-afric",
  "after-sales": "/services",
  "channel-lining-installation-gccm-systems-across-africa":
    "/services/gccm-channel-lining-contractor-africa",
  // Former application categories
  "mining-systems": "/applications/tailings-storage-facility-lining",
  "water-containment": "/applications/reservoir-dam-lining",
  "waste-landfills": "/applications/landfill-ash-bund-lining",
  "roads-infrastructure": "/applications/roads-railways",
  "erosion-control": "/applications/slope-erosion-protection",
  "drainage-systems": "/applications/drainage-filtration-systems-africa",
  "mse-retaining-wall-geogrids": "/applications/retaining-wall-systems",
};

type HierarchyItem = { id: string; slug?: string; label?: string };
type Hierarchies = Record<SectionKey, HierarchyItem[]> & {
  /** Keys of page templates saved in Site Builder, per section */
  templates: Record<SectionKey, Set<string>>;
};

/** Loads the applications, services and industries hierarchies (and template keys) in one query. */
export async function fetchSectionHierarchies(): Promise<Hierarchies> {
  const result: Hierarchies = {
    applications: [],
    services: [],
    industries: [],
    templates: { applications: new Set(), services: new Set(), industries: new Set() },
  };
  const { data } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", [
      ...SECTION_KEYS.map((k) => `hierarchy_${k}`),
      ...SECTION_KEYS.map((k) => `template_${k}`),
    ]);
  for (const row of data || []) {
    if (row.key.startsWith("hierarchy_")) {
      const key = row.key.replace("hierarchy_", "") as SectionKey;
      const items = (row.value as any)?.items;
      if (Array.isArray(items)) result[key] = items;
    } else if (row.key.startsWith("template_")) {
      const key = row.key.replace("template_", "") as SectionKey;
      const keys = Object.keys((row.value as Record<string, unknown>) || {}).filter(
        (k) => k !== "__landing",
      );
      result.templates[key] = new Set(keys);
    }
  }
  return result;
}

/** Finds an item by its slug first, then by its internal id. */
export function findItem<T extends HierarchyItem>(items: T[], value: string): T | undefined {
  return items.find((i) => i.slug === value) || items.find((i) => i.id === value);
}

export function itemSlug(item: HierarchyItem): string {
  return item.slug || item.id;
}

/**
 * For a nested section URL (/services/{param}), returns the canonical path to
 * redirect to when {param} is an internal id or an old address, or null when
 * {param} is already correct, has its own Site Builder template, or is unknown.
 */
export async function canonicalSectionRedirect(
  section: SectionKey,
  param: string,
  hierarchies?: Hierarchies,
): Promise<string | null> {
  const all = hierarchies ?? (await fetchSectionHierarchies());
  const item = findItem(all[section], param);
  if (item) {
    const slug = itemSlug(item);
    return slug !== param ? sectionPath(section, slug) : null;
  }
  if (all.templates[section].has(param)) return null;
  const legacy = LEGACY_SECTION_REDIRECTS[param];
  if (legacy && legacy !== sectionPath(section, param)) return legacy;
  return null;
}

/**
 * For a top-level address (/{slug}), returns the nested section path it now
 * lives at, or null when it is not a section page.
 * Industries are checked first because one slug (agriculture-aquaculture)
 * was used both as an industry and an old application category.
 */
export async function sectionPathForTopLevelSlug(slug: string): Promise<string | null> {
  const all = await fetchSectionHierarchies();
  const order: SectionKey[] = ["industries", "services", "applications"];
  for (const section of order) {
    const item = findItem(all[section], slug);
    if (item) return sectionPath(section, itemSlug(item));
  }
  for (const section of order) {
    if (all.templates[section].has(slug)) return sectionPath(section, slug);
  }
  return LEGACY_SECTION_REDIRECTS[slug] ?? null;
}

/* ------------------------------------------------------------------ */
/* Products: /products/{category} and /products/{category}/{family}   */
/* ------------------------------------------------------------------ */

/** Old product category addresses that are not a category id or slug. */
export const LEGACY_PRODUCT_CATEGORIES: Record<string, string> = {
  geogrids: "geogrids-interlayers",
  gcls: "geosynthetic-clay-liners-gcl",
  "damp-proofing": "waterproofing-concrete-protection",
};

type ProductCategory = HierarchyItem & { children?: HierarchyItem[] };

export async function fetchProductHierarchy(): Promise<ProductCategory[]> {
  const { data } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "hierarchy_products")
    .maybeSingle();
  const items = (data?.value as any)?.items;
  return Array.isArray(items) ? items : [];
}

/**
 * Canonical product path for a category (and optional family) given as either
 * slugs, internal ids or old names. Returns null when nothing matches.
 */
export function canonicalProductPath(
  categories: ProductCategory[],
  categoryParam: string,
  familyParam?: string,
): { path: string; category?: ProductCategory; family?: HierarchyItem } | null {
  const category =
    findItem(categories, categoryParam) ||
    findItem(categories, LEGACY_PRODUCT_CATEGORIES[categoryParam] || "");
  if (!category) return null;
  const catSlug = itemSlug(category);
  if (!familyParam) return { path: `/products/${catSlug}`, category };
  const family = findItem(category.children || [], familyParam);
  if (!family) return { path: `/products/${catSlug}/${familyParam}`, category };
  return { path: `/products/${catSlug}/${itemSlug(family)}`, category, family };
}
