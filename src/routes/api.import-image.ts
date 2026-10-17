import { createFileRoute } from "@tanstack/react-router";
import { isExternalUploadUrl } from "@/lib/external-images";

/**
 * GET /api/import-image?url=https://geosynthetics.co.za/wp-content/uploads/...
 *
 * Server-side download used by the admin "Move old-site images" tool, because
 * the browser cannot read files from the old site directly (CORS).
 * Only files under geosynthetics.co.za/wp-content/uploads/ are allowed, so this
 * is not an open proxy.
 */
const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_TYPES = /^(image\/|application\/pdf)/i;

export const Route = createFileRoute("/api/import-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const target = new URL(request.url).searchParams.get("url") || "";
        if (!isExternalUploadUrl(target)) {
          return new Response("Only geosynthetics.co.za uploads can be imported", { status: 400 });
        }

        try {
          const upstream = await fetch(target, { redirect: "follow" });
          if (!upstream.ok) {
            return new Response(`Source returned ${upstream.status}`, { status: 502 });
          }

          const contentType = upstream.headers.get("Content-Type") || "";
          if (!ALLOWED_TYPES.test(contentType)) {
            return new Response("Source is not an image or PDF", { status: 415 });
          }

          const length = Number(upstream.headers.get("Content-Length") || 0);
          if (length > MAX_BYTES) {
            return new Response("File too large", { status: 413 });
          }

          const body = await upstream.arrayBuffer();
          if (body.byteLength > MAX_BYTES) {
            return new Response("File too large", { status: 413 });
          }

          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-store",
              "X-Robots-Tag": "noindex",
            },
          });
        } catch (error: any) {
          return new Response(`Download failed: ${error?.message || error}`, { status: 502 });
        }
      },
    },
  },
});
