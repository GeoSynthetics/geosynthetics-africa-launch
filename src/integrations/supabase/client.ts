import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/site-url";

const supabaseUrl =
  // Static `import.meta.env.X` access only: optional chaining makes Vite inline the whole
  // env object (every VITE_* secret) into the browser bundle.
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? process.env.SUPABASE_URL;
const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
}

/**
 * Image links stored in the database point straight at Supabase Storage, so
 * every visitor downloaded every photo from Supabase. That is slow from Africa
 * and used up the plan's data transfer. Database responses are rewritten to the
 * site's own /api/storage proxy, which Vercel's CDN caches for a year, so
 * Supabase sends each file about once per CDN region.
 */
const STORAGE_PUBLIC_PREFIX = `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/`;
const CDN_STORAGE_PREFIX = `${SITE_URL}/api/storage/`;

export function toCdnStorageUrls(text: string): string {
  return text.includes(STORAGE_PUBLIC_PREFIX)
    ? text.split(STORAGE_PUBLIC_PREFIX).join(CDN_STORAGE_PREFIX)
    : text;
}

const cdnImageFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok || !url.includes("/rest/v1/") || !contentType.includes("json")) {
    return response;
  }
  const text = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(toCdnStorageUrls(text), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  global: { fetch: cdnImageFetch },
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
    detectSessionInUrl: typeof window !== "undefined",
  },
});
