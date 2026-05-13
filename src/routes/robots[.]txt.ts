import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;

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
Sitemap: ${baseUrl}/sitemap.xml
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
