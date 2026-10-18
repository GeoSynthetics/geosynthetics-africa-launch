/**
 * Single source of truth for the public site address.
 *
 * Everything that prints an absolute URL (canonical tags, og:url, sitemap,
 * robots.txt, JSON-LD schema, emails) must read it from here, so a domain
 * change is one setting instead of edits across the codebase.
 *
 * Override per environment with VITE_CANONICAL_SITE_URL, e.g.
 *   VITE_CANONICAL_SITE_URL=https://www.geosyntheticsafrica.com
 */
export const DEFAULT_SITE_URL = "https://www.geosyntheticsafrica.com";

function readEnvSiteUrl(): string | undefined {
  let value: string | undefined;
  try {
    value = (import.meta as any).env?.VITE_CANONICAL_SITE_URL as string | undefined;
  } catch {
    value = undefined;
  }
  if (!value && typeof process !== "undefined") {
    value = process.env?.VITE_CANONICAL_SITE_URL;
  }
  return value?.trim() || undefined;
}

function normalise(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Absolute site origin without a trailing slash, e.g. https://www.geosyntheticsafrica.com */
export const SITE_URL: string = normalise(readEnvSiteUrl() || DEFAULT_SITE_URL);

/** Hostname of the canonical site, e.g. www.geosyntheticsafrica.com */
export const SITE_HOST: string = new URL(SITE_URL).hostname;

/** Stable JSON-LD @id of the business, so Service/Product/WebSite schema can reference it. */
export const ORGANIZATION_ID: string = `${SITE_URL}/#organization`;

/** The canonical host plus its www / non-www twin — both serve the live site. */
export const PRODUCTION_HOSTS: readonly string[] = (() => {
  const bare = SITE_HOST.replace(/^www\./, "");
  return [bare, `www.${bare}`];
})();

/** True when a request Host header belongs to the live site (not a preview or Vercel URL). */
export function isProductionHost(requestHost: string | null | undefined): boolean {
  if (!requestHost) return false;
  const hostname = requestHost.split(",")[0].trim().split(":")[0].toLowerCase();
  return PRODUCTION_HOSTS.includes(hostname);
}

/**
 * Builds an absolute URL on the canonical site.
 * Strips query strings and hashes and drops trailing slashes (except for the homepage).
 */
export function absoluteUrl(path: string = "/"): string {
  const clean = (path || "/").split(/[?#]/)[0];
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, "") : withSlash;
  return trimmed === "/" ? `${SITE_URL}/` : `${SITE_URL}${trimmed}`;
}
