import { createFileRoute } from "@tanstack/react-router";
import { publicConfigQuery } from "@/lib/public-config-cache";
import { SITE_PAGES_CACHE_TAG } from "@/lib/site-cache";

const NO_STORE = { "Cache-Control": "private, no-store", "Vercel-CDN-Cache-Control": "no-store" };

export async function servePublicConfig(request: Request): Promise<Response> {
  const query = publicConfigQuery(new URL(request.url).searchParams);
  if (!query) return new Response("Not found", { status: 404, headers: NO_STORE });
  const backend = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!backend || !key)
    return new Response("Content unavailable", { status: 503, headers: NO_STORE });
  const single = query.get("_single") === "1";
  query.delete("_single");
  try {
    // Always use the public key. Never forward visitor cookies or authorization.
    const upstream = await fetch(`${backend.replace(/\/$/, "")}/rest/v1/site_config?${query}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: single ? "application/vnd.pgrst.object+json" : "application/json",
      },
    });
    if (!upstream.ok)
      return new Response("Content unavailable", { status: 503, headers: NO_STORE });
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=30, s-maxage=3600, stale-while-revalidate=86400",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Vercel-Cache-Tag": SITE_PAGES_CACHE_TAG,
        "X-Robots-Tag": "noindex",
      },
    });
  } catch {
    return new Response("Content unavailable", { status: 503, headers: NO_STORE });
  }
}

export const Route = createFileRoute("/api/public-config")({
  server: { handlers: { GET: ({ request }) => servePublicConfig(request) } },
});
