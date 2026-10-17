import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL, isProductionHost } from "@/lib/site-url";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
        const isProd = isProductionHost(hostHeader);

        if (!isProd) {
          const devRobots = `# Geosynthetics Africa — Development / Preview Site
# Crawling disabled for non-production environments
User-agent: *
Disallow: /
`;
          return new Response(devRobots, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-store, no-cache, must-revalidate",
              "X-Robots-Tag": "noindex, nofollow",
            },
          });
        }

        const robots = `# Geosynthetics Africa — robots.txt
# https://www.robotstxt.org/robotstxt.html

User-agent: *
Allow: /

# Disallow admin, auth, and private routes
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /profile

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml
`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      },
    },
  },
});

