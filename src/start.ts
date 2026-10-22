import { createMiddleware, createStart } from "@tanstack/react-start";
import { SITE_PAGES_CACHE_TAG } from "@/lib/site-cache";

/**
 * Tags every page response so the whole site's CDN cache can be refreshed the
 * moment something is saved in the admin (see site-cache.functions.ts).
 * API routes, including the image proxy, are left untagged so images stay cached.
 */
const tagPagesForCacheRefresh = createMiddleware().server(async ({ next, pathname, handlerType }) => {
  const result = await next();
  if (handlerType === "router" && !pathname.startsWith("/api/")) {
    try {
      result.response.headers.set("Vercel-Cache-Tag", SITE_PAGES_CACHE_TAG);
    } catch {
      // Immutable headers (e.g. a redirect created elsewhere): nothing to tag.
    }
  }
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [tagPagesForCacheRefresh],
}));
