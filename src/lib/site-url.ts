/**
 * Canonical public URL of this site (geosyntheticsafrica.com).
 *
 * Single source of truth for the sitemap, robots.txt, canonical tags,
 * structured data and breadcrumbs. Do not hardcode the domain elsewhere.
 */
export const SITE_URL = "https://www.geosyntheticsafrica.com";

/** Hostnames that serve the indexable production site. */
export const PRODUCTION_HOSTS = ["geosyntheticsafrica.com", "www.geosyntheticsafrica.com"];

/** Build an absolute URL on the canonical site, e.g. siteUrl("/catalogue/x"). */
export function siteUrl(path = ""): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True when the request host is the production site (not a preview/dev host). */
export function isProductionHost(requestHost: string | null): boolean {
  if (!requestHost) return false;
  const hostname = requestHost.split(":")[0].toLowerCase();
  return PRODUCTION_HOSTS.includes(hostname);
}
