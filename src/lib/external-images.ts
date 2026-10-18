/**
 * Helpers for finding and replacing images that are still hot-linked from the
 * old WordPress site (geosynthetics.com/wp-content/...). Used by the admin
 * "Move old-site images" tool to copy them into the Media Center.
 */

/** Hosts whose uploaded files may be copied into the Media Center. */
export const EXTERNAL_IMAGE_HOSTS = ["geosynthetics.com", "www.geosynthetics.com"] as const;

const EXTERNAL_URL_RE =
  /https?:\/\/(?:www\.)?geosynthetics\.co\.za\/wp-content\/uploads\/[^\s"'<>()\\]+/gi;

/** True when a URL points at a file uploaded to the old WordPress site. */
export function isExternalUploadUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (EXTERNAL_IMAGE_HOSTS as readonly string[]).includes(u.hostname.toLowerCase()) &&
      u.pathname.startsWith("/wp-content/uploads/")
    );
  } catch {
    return false;
  }
}

/** Collects every old-site upload URL found anywhere inside a value (strings, arrays, objects). */
export function findExternalUrls(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (typeof value === "string") {
    for (const match of value.matchAll(EXTERNAL_URL_RE)) {
      found.add(match[0]);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item) => findExternalUrls(item, found));
  } else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) =>
      findExternalUrls(item, found),
    );
  }
  return found;
}

/** Returns a deep copy of value with every mapped URL replaced. Unmapped URLs are left as they are. */
export function replaceExternalUrls<T>(value: T, replacements: Map<string, string>): T {
  if (typeof value === "string") {
    return value.replace(EXTERNAL_URL_RE, (url) => replacements.get(url) ?? url) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceExternalUrls(item, replacements)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        replaceExternalUrls(v, replacements),
      ]),
    ) as T;
  }
  return value;
}

/**
 * Builds a descriptive, SEO-friendly file name from the original URL,
 * e.g. ".../2026/01/Leak-Detection-Core-300x300.jpg" -> "leak-detection-core-300x300".
 */
export function baseNameFromUrl(url: string): string {
  try {
    const last = decodeURIComponent(new URL(url).pathname.split("/").pop() || "image");
    const base = last.includes(".") ? last.slice(0, last.lastIndexOf(".")) : last;
    const slug = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
    return slug || "image";
  } catch {
    return "image";
  }
}
