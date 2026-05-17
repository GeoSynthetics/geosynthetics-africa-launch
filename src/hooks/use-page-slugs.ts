import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PageSeoEntry {
  title: string;
  description: string;
  keywords: string;
  urlSlug: string;
  pageLabel: string;
}

type SeoMap = Record<string, PageSeoEntry>;

let _cache: SeoMap | null = null;
let _fetchPromise: Promise<SeoMap> | null = null;

/**
 * Fetches the seo_pages config once and caches it in memory.
 * Returns a map from original route path → SEO entry.
 */
export async function fetchSeoPages(): Promise<SeoMap> {
  if (_cache) return _cache;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    const { data } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "seo_pages")
      .maybeSingle();
    const map = (data?.value as SeoMap) ?? {};
    _cache = map;
    return map;
  })();

  return _fetchPromise;
}

/** Invalidate the in-memory cache (call after admin saves). */
export function invalidateSeoCache() {
  _cache = null;
  _fetchPromise = null;
}

/**
 * Given a custom URL slug, find the original route path it maps to.
 * e.g. "gse-hdpe-liners" → "/about"
 */
export async function resolveSlugToPath(slug: string): Promise<string | null> {
  const map = await fetchSeoPages();
  for (const [path, entry] of Object.entries(map)) {
    if (entry.urlSlug && entry.urlSlug === slug) {
      return path;
    }
  }
  return null;
}

/**
 * Given an original route path (e.g. "/about"), get the custom URL slug if set.
 * Returns the original path segment if no custom slug.
 */
export async function getSlugForPath(originalPath: string): Promise<string> {
  const map = await fetchSeoPages();
  const entry = map[originalPath];
  if (entry?.urlSlug) {
    return `/${entry.urlSlug}`;
  }
  return originalPath;
}

/**
 * React hook: returns a map of original paths → resolved href strings.
 * Useful for navigation components like Footer/Header.
 */
export function usePageSlugs() {
  const [slugMap, setSlugMap] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSeoPages().then((map) => {
      const result: Record<string, string> = {};
      for (const [path, entry] of Object.entries(map)) {
        result[path] = entry.urlSlug ? `/${entry.urlSlug}` : path;
      }
      setSlugMap(result);
      setLoaded(true);
    });
  }, []);

  /** Resolve a path like "/about" to its custom slug href, or fall back to original. */
  const resolve = (originalPath: string): string => {
    return slugMap[originalPath] ?? originalPath;
  };

  return { resolve, loaded, slugMap };
}
