import { createFileRoute } from "@tanstack/react-router";
import { collectSitemapEntries } from "@/lib/sitemap";
import { buildLlmsTxt } from "@/lib/llms-txt";

/* GET /llms.txt: plain-Markdown site summary for AI assistants (llmstxt.org) */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = buildLlmsTxt(await collectSitemapEntries());
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
