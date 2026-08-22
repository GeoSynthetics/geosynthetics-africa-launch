import { createFileRoute } from "@tanstack/react-router";

function isProductionHost(requestHost: string | null): boolean {
  if (!requestHost) return false;
  const hostname = requestHost.split(":")[0].toLowerCase();
  return hostname === "geosynthetics.co.za" || hostname === "www.geosynthetics.co.za";
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const hostHeader =
          request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
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

        const productionSiteUrl = "https://geosynthetics.co.za";
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
Sitemap: ${productionSiteUrl}/sitemap.xml
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
