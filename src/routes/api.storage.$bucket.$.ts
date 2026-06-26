import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/storage/$bucket/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const prefix = "/api/storage/";
          const pathname = url.pathname;

          if (!pathname.startsWith(prefix)) {
            return new Response("Not Found", { status: 404 });
          }

          const relativePath = pathname.substring(prefix.length);
          // Load env variable dynamically at runtime (server-side)
          const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;

          if (!supabaseUrl) {
            return new Response("Server configuration error: missing Supabase URL", {
              status: 500,
            });
          }

          const targetUrl = `${supabaseUrl}/storage/v1/object/public/${relativePath}`;

          const response = await fetch(targetUrl, {
            method: "GET",
          });

          if (!response.ok) {
            return new Response(`Failed to fetch storage asset: ${response.statusText}`, {
              status: response.status,
            });
          }

          const contentType = response.headers.get("Content-Type") || "application/octet-stream";
          const contentEncoding = response.headers.get("Content-Encoding");

          const headers = new Headers();
          headers.set("Content-Type", contentType);
          if (contentEncoding) {
            headers.set("Content-Encoding", contentEncoding);
          }

          // Force highly performant Edge CDN caching
          headers.set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");

          return new Response(response.body, {
            status: 200,
            headers,
          });
        } catch (error: any) {
          console.error("Storage proxy route error:", error);
          return new Response(`Internal Server Error: ${error.message || error}`, { status: 500 });
        }
      },
    },
  },
});
