import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  PRODUCT_CATEGORIES,
  APPLICATION_CATEGORIES,
  SERVICES,
} from "@/components/site/mega-menu-data";

/* ------------------------------------------------------------------ */
/* Helper: build a single <url> entry                                  */
/* ------------------------------------------------------------------ */
function urlEntry(
  loc: string,
  opts?: {
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  },
): string {
  const parts = [`    <loc>${escapeXml(loc)}</loc>`];
  if (opts?.lastmod) parts.push(`    <lastmod>${opts.lastmod}</lastmod>`);
  if (opts?.changefreq)
    parts.push(`    <changefreq>${opts.changefreq}</changefreq>`);
  if (opts?.priority !== undefined)
    parts.push(`    <priority>${opts.priority.toFixed(1)}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

/** Escape XML special characters in URLs */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Today's date in YYYY-MM-DD format */
function today(): string {
  return new Date().toISOString().split("T")[0];
}

/* ------------------------------------------------------------------ */
/* GET /sitemap.xml                                                    */
/* ------------------------------------------------------------------ */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Derive base URL from the incoming request so it works on any host
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const now = today();

        const urls: string[] = [];

        /* ── 1. Static core pages ─────────────────────────────── */
        const staticPages: {
          path: string;
          changefreq: string;
          priority: number;
        }[] = [
          { path: "/", changefreq: "daily", priority: 1.0 },
          { path: "/about", changefreq: "monthly", priority: 0.8 },
          { path: "/products", changefreq: "weekly", priority: 0.9 },
          { path: "/applications", changefreq: "weekly", priority: 0.9 },
          { path: "/services", changefreq: "monthly", priority: 0.9 },
          { path: "/projects", changefreq: "monthly", priority: 0.7 },
          {
            path: "/quality-assurance",
            changefreq: "monthly",
            priority: 0.6,
          },
          { path: "/catalogue", changefreq: "weekly", priority: 0.8 },
          { path: "/resources", changefreq: "weekly", priority: 0.7 },
          { path: "/contacts", changefreq: "monthly", priority: 0.7 },
        ];

        for (const page of staticPages) {
          urls.push(
            urlEntry(`${baseUrl}${page.path}`, {
              lastmod: now,
              changefreq: page.changefreq,
              priority: page.priority,
            }),
          );
        }

        /* ── 2. Product category pages ────────────────────────── */
        for (const cat of PRODUCT_CATEGORIES) {
          urls.push(
            urlEntry(`${baseUrl}/products/${cat.slug}`, {
              lastmod: now,
              changefreq: "weekly",
              priority: 0.7,
            }),
          );
        }

        /* ── 3. Application category pages ────────────────────── */
        for (const cat of APPLICATION_CATEGORIES) {
          urls.push(
            urlEntry(`${baseUrl}/applications/${cat.slug}`, {
              lastmod: now,
              changefreq: "monthly",
              priority: 0.7,
            }),
          );
        }

        /* ── 4. Service detail pages ──────────────────────────── */
        for (const svc of SERVICES) {
          urls.push(
            urlEntry(`${baseUrl}/services/${svc.slug}`, {
              lastmod: now,
              changefreq: "monthly",
              priority: 0.7,
            }),
          );
        }

        /* ── 5. Dynamic catalogue product pages from Supabase ── */
        try {
          const { data: products } = await supabase
            .from("products_public")
            .select("slug, updated_at")
            .eq("is_active", true)
            .order("updated_at", { ascending: false });

          if (products) {
            for (const product of products) {
              const lastmod = product.updated_at
                ? new Date(product.updated_at).toISOString().split("T")[0]
                : now;
              urls.push(
                urlEntry(`${baseUrl}/catalogue/${product.slug}`, {
                  lastmod,
                  changefreq: "weekly",
                  priority: 0.6,
                }),
              );
            }
          }
        } catch {
          // Silently skip if Supabase is unreachable — static routes are still included
        }

        /* ── 6. Custom SEO slug pages ─────────────────────────── */
        try {
          const { data: seoConfig } = await supabase
            .from("site_config")
            .select("value")
            .eq("key", "seo_pages")
            .maybeSingle();

          if (seoConfig?.value) {
            const seoMap = seoConfig.value as Record<
              string,
              { urlSlug?: string }
            >;
            for (const entry of Object.values(seoMap)) {
              if (entry.urlSlug) {
                urls.push(
                  urlEntry(`${baseUrl}/${entry.urlSlug}`, {
                    lastmod: now,
                    changefreq: "monthly",
                    priority: 0.6,
                  }),
                );
              }
            }
          }
        } catch {
          // Silently skip
        }

        /* ── Build final XML ──────────────────────────────────── */
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
