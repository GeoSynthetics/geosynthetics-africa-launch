import { createFileRoute } from "@tanstack/react-router";
import { sectionSitemapResponse } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap-countries.xml")({
  server: { handlers: { GET: () => sectionSitemapResponse("countries") } },
});
