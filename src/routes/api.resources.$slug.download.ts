import { createFileRoute } from "@tanstack/react-router";
import { fetchPublishedResource } from "@/lib/public-resources";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/api/resources/$slug/download")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
        try {
          const resource = await fetchPublishedResource(params.slug);
          // Never expose gated or unpublished files through this public link.
          if (!resource?.is_public) return new Response("Not found", { status: 404, headers });
          let target = resource.external_url;
          if (resource.file_path) {
            const { data, error } = await supabase.storage
              .from("technical-docs")
              .createSignedUrl(resource.file_path, 300);
            if (error || !data)
              return new Response("Document temporarily unavailable", { status: 503, headers });
            target = data.signedUrl;
          }
          if (!target || !/^https?:\/\//i.test(target))
            return new Response("Not found", { status: 404, headers });
          return new Response(null, { status: 302, headers: { ...headers, Location: target } });
        } catch {
          return new Response("Document temporarily unavailable", { status: 503, headers });
        }
      },
    },
  },
});
