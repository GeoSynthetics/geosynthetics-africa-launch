/**
 * Sitemap data shared by the XML sitemaps (/sitemap.xml index plus one
 * sitemap per section) and the human-readable /site-map page.
 *
 * Rules:
 * - Only canonical, indexable URLs (each returns 200 and is its own canonical).
 * - <lastmod> only where a real modification date exists (catalogue products,
 *   blog posts, projects). Pages without a trustworthy date get none, rather
 *   than "today" on every request, which search engines learn to ignore.
 * - Every page that exists in several languages lists all versions with
 *   xhtml:link hreflang alternates, matching the <link rel="alternate"> tags.
 * - Product, blog and project URLs carry their images (image sitemap).
 */
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";
import { fetchCompanyPageTemplates } from "@/hooks/use-company-page-templates";
import { SECTION_KEYS, SECTION_LABELS, sectionPath } from "@/lib/section-paths";
import { fetchCountryTemplates } from "@/hooks/use-country-templates";
import { DEFAULT_COUNTRY_TEMPLATES } from "@/types/country-template";
import { regionForCountry } from "@/data/country-expansion";
import {
  LOCALIZED_PAGES,
  LANG_LABELS,
  alternatesFor,
  localizedPath,
} from "@/i18n/localized-pages";

export type SitemapSection =
  | "pages"
  | "solutions"
  | "catalogue"
  | "insights"
  | "countries"
  | "fr"
  | "pt";

export const SITEMAP_SECTIONS: { key: SitemapSection; label: string }[] = [
  { key: "pages", label: "Company" },
  { key: "solutions", label: "Products, Applications, Services & Industries" },
  { key: "catalogue", label: "Product Catalogue" },
  { key: "insights", label: "Projects & Blog" },
  { key: "countries", label: "Countries We Serve" },
  { key: "fr", label: "Français" },
  { key: "pt", label: "Português" },
];

export interface SitemapEntry {
  path: string;
  title: string;
  section: SitemapSection;
  /** Sub-heading on the /site-map page */
  group: string;
  lastmod?: string;
  images?: string[];
}

const STATIC_PAGES: { path: string; title: string }[] = [
  { path: "/", title: "Home" },
  { path: "/about", title: "About Us" },
  { path: "/products", title: "Products" },
  { path: "/applications", title: "Applications" },
  { path: "/services", title: "Services" },
  { path: "/industries", title: "Industries" },
  { path: "/projects", title: "Projects" },
  { path: "/countries", title: "Countries We Serve" },
  { path: "/catalogue", title: "Product Catalogue" },
  { path: "/quality-assurance", title: "Quality Assurance" },
  { path: "/resources", title: "Resources" },
  { path: "/blog", title: "Blog" },
  { path: "/contacts", title: "Contacts" },
  { path: "/careers", title: "Careers" },
  { path: "/sustainability", title: "Sustainability" },
  { path: "/site-map", title: "Site Map" },
  { path: "/privacy-policy", title: "Privacy Policy" },
  { path: "/terms-and-conditions", title: "Terms & Conditions" },
];

function day(value?: string | null): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
}

function absoluteImage(src?: string | null): string | null {
  if (!src || typeof src !== "string") return null;
  if (src.startsWith("data:")) return null;
  if (/^https?:\/\//.test(src)) return src;
  return src.startsWith("/") ? `${SITE_URL}${src}` : null;
}

function uniqueImages(list: unknown[]): string[] | undefined {
  const urls = list.map((x: any) => (typeof x === "string" ? x : x?.url || x?.src || null));
  const out = [...new Set(urls.map(absoluteImage).filter((x): x is string => !!x))].slice(0, 10);
  return out.length ? out : undefined;
}

/** Collects every indexable URL on the site. Each source fails independently. */
export async function collectSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const add = (e: SitemapEntry) => entries.push(e);

  for (const p of STATIC_PAGES) add({ ...p, section: "pages", group: "Company" });

  // Products, applications, services, industries — exactly what the menus link to
  try {
    const { data } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["hierarchy_products", ...SECTION_KEYS.map((k) => `hierarchy_${k}`)]);
    const itemsFor = (key: string): any[] =>
      ((data || []).find((r) => r.key === key)?.value as any)?.items || [];
    const slugOf = (item: any): string => item?.slug || item?.id;

    for (const cat of itemsFor("hierarchy_products")) {
      const catSlug = slugOf(cat);
      if (!catSlug) continue;
      const group = `Products — ${cat.label || catSlug}`;
      add({ path: `/products/${catSlug}`, title: cat.label || catSlug, section: "solutions", group });
      for (const family of cat.children || []) {
        const familySlug = slugOf(family);
        if (!familySlug) continue;
        add({
          path: `/products/${catSlug}/${familySlug}`,
          title: family.label || familySlug,
          section: "solutions",
          group,
        });
      }
    }
    for (const section of SECTION_KEYS) {
      for (const item of itemsFor(`hierarchy_${section}`)) {
        const slug = slugOf(item);
        if (!slug) continue;
        add({
          path: sectionPath(section, slug),
          title: item.label || slug,
          section: "solutions",
          group: SECTION_LABELS[section],
        });
      }
    }
  } catch {
    // skip
  }

  // Catalogue products, with images and real modification dates
  try {
    const { data } = await supabase
      .from("products_public")
      .select("name, slug, image_url, images, updated_at")
      .eq("is_active", true)
      .order("name");
    for (const p of data || []) {
      if (!p.slug) continue;
      add({
        path: `/catalogue/${p.slug}`,
        title: p.name || p.slug,
        section: "catalogue",
        group: "Product Catalogue",
        lastmod: day(p.updated_at),
        images: uniqueImages([p.image_url, ...(Array.isArray(p.images) ? (p.images as unknown[]) : [])]),
      });
    }
  } catch {
    // skip
  }

  // Projects
  try {
    const { data } = await supabase
      .from("case_studies")
      .select("title, slug, hero_image_url, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    for (const c of data || []) {
      if (!c.slug) continue;
      add({
        path: `/projects/${c.slug}`,
        title: c.title || c.slug,
        section: "insights",
        group: "Projects",
        lastmod: day(c.updated_at || c.published_at),
        images: uniqueImages([c.hero_image_url]),
      });
    }
  } catch {
    // skip
  }

  // Blog
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("title, slug, cover_image, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    for (const b of data || []) {
      if (!b.slug) continue;
      add({
        path: `/blog/${b.slug}`,
        title: b.title || b.slug,
        section: "insights",
        group: "Blog",
        lastmod: day(b.updated_at || b.published_at),
        images: uniqueImages([b.cover_image]),
      });
    }
  } catch {
    // skip
  }

  // Admin-created company pages and custom SEO slugs
  try {
    const staticPaths = new Set(STATIC_PAGES.map((p) => p.path));
    const templates = await fetchCompanyPageTemplates();
    for (const t of Object.values(templates) as any[]) {
      if (!t?.slug || staticPaths.has(`/${t.slug}`)) continue;
      add({
        path: `/${t.slug}`,
        title: t.title || t.seo?.title || t.slug,
        section: "pages",
        group: "Company",
        lastmod: day(t.updatedAt),
      });
    }
  } catch {
    // skip
  }
  try {
    const { data } = await supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle();
    for (const e of Object.values((data?.value as Record<string, any>) || {})) {
      if (e?.urlSlug) {
        add({ path: `/${e.urlSlug}`, title: e.title || e.urlSlug, section: "pages", group: "Company" });
      }
    }
  } catch {
    // skip
  }

  // Country pages: one per country
  let countries = Object.values(DEFAULT_COUNTRY_TEMPLATES);
  try {
    countries = Object.values(await fetchCountryTemplates());
  } catch {
    // defaults
  }
  const seenCountries = new Set<string>();
  for (const t of countries) {
    if (!t?.slug || !t.country) continue;
    const key = t.country.trim().toLowerCase();
    if (seenCountries.has(key)) continue;
    seenCountries.add(key);
    add({
      path: `/${t.slug}`,
      title: `Geosynthetics ${t.country}`,
      section: "countries",
      group: regionForCountry(t.country),
    });
  }

  // French and Portuguese pages
  for (const p of LOCALIZED_PAGES) {
    add({
      path: localizedPath(p),
      title: p.heading,
      section: p.lang,
      group: p.lang === "fr" ? "Français" : "Português",
    });
  }

  // One entry per URL (first source wins)
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.path)) return false;
    seen.add(e.path);
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* XML                                                                 */
/* ------------------------------------------------------------------ */

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlXml(e: SitemapEntry): string {
  const lines = [`    <loc>${escapeXml(absoluteUrl(e.path))}</loc>`];
  if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
  const alternates = alternatesFor(e.path);
  if (alternates.length) {
    for (const a of alternates) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${LANG_LABELS[a.lang].hreflang}" href="${escapeXml(absoluteUrl(a.path))}"/>`,
      );
    }
    const en = alternates.find((a) => a.lang === "en");
    if (en) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(en.path))}"/>`,
      );
    }
  }
  for (const img of e.images || []) {
    lines.push(`    <image:image><image:loc>${escapeXml(img)}</image:loc></image:image>`);
  }
  return `  <url>\n${lines.join("\n")}\n  </url>`;
}

export function urlsetXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(urlXml).join("\n")}
</urlset>`;
}

export function sitemapIndexXml(entries: SitemapEntry[]): string {
  // Every section is always listed, so a temporary database error never drops one
  const items = SITEMAP_SECTIONS.map((s) => {
    const dates = entries
      .filter((e) => e.section === s.key && e.lastmod)
      .map((e) => e.lastmod!)
      .sort();
    const lastmod = dates.length ? `\n    <lastmod>${dates[dates.length - 1]}</lastmod>` : "";
    return `  <sitemap>\n    <loc>${SITE_URL}/sitemap-${s.key}.xml</loc>${lastmod}\n  </sitemap>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join("\n")}
</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}

/** Sections whose pages all come from the database */
const DATABASE_SECTIONS: SitemapSection[] = ["solutions", "catalogue", "insights"];

export async function sectionSitemapResponse(section: SitemapSection): Promise<Response> {
  const entries = (await collectSitemapEntries()).filter((e) => e.section === section);
  if (entries.length === 0 && DATABASE_SECTIONS.includes(section)) {
    // Database unreachable: ask crawlers to retry rather than serve an empty, cached list
    return new Response("Sitemap temporarily unavailable", {
      status: 503,
      headers: { "Retry-After": "600", "Cache-Control": "no-store" },
    });
  }
  return xmlResponse(urlsetXml(entries));
}
