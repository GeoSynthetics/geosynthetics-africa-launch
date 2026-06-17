import { supabase } from "@/integrations/supabase/client";

let redirectsCache: Record<string, string> | null = null;
let loadingPromise: Promise<Record<string, string>> | null = null;

export function normalizePath(path: string): string {
  let clean = path.trim().toLowerCase();
  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }
  if (clean.endsWith("/") && clean.length > 1) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

export async function loadRedirects(): Promise<Record<string, string>> {
  if (redirectsCache) return redirectsCache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("redirects")
        .select("from_path, to_path");

      if (error) {
        console.error("[loadRedirects] Failed to fetch redirects:", error.message);
        return {};
      }

      const cache: Record<string, string> = {};
      for (const row of data || []) {
        cache[normalizePath(row.from_path)] = row.to_path;
      }
      redirectsCache = cache;
      return cache;
    } catch (err) {
      console.error("[loadRedirects] Unexpected error:", err);
      return {};
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

export async function getRedirectTarget(path: string): Promise<string | null> {
  const clean = normalizePath(path);

  // Match /product/$slug pattern dynamically
  if (clean.startsWith("/product/")) {
    const slug = clean.substring("/product/".length);
    if (slug) {
      return `/catalogue/${slug}`;
    }
  }

  // Match /products/$category prefix and map dynamically
  // Note: Parent category resolution will run normally, but we ensure no legacy patterns slip
  const cache = await loadRedirects();
  return cache[clean] || null;
}
