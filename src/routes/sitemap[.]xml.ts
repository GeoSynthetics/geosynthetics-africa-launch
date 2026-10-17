import { createFileRoute } from "@tanstack/react-router";
import { collectSitemapEntries, sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

/**
 * GET /sitemap.xml — sitemap index pointing to one sitemap per section
 * (/sitemap-pages.xml, /sitemap-catalogue.xml, ...). Submit this URL in
 * Google Search Console and Bing Webmaster Tools.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(sitemapIndexXml(await collectSitemapEntries())),
    },
  },
});
