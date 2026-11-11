import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { getCategory, VIDEO_HOST_RE } from "@/lib/resource-categories";
import {
  fetchPublishedResource,
  resourceMatchesCategory,
  resourceDownloadPath,
} from "@/lib/public-resources";

export const Route = createFileRoute("/resources/$category/$slug")({
  beforeLoad: ({ params }) => {
    if (!getCategory(params.category)) throw notFound();
  },
  loader: async ({ params }) => {
    const cat = getCategory(params.category);
    const row = await fetchPublishedResource(params.slug);
    if (!cat || !row || !resourceMatchesCategory(row, cat)) throw notFound();
    return { row };
  },
  head: ({ loaderData }) => {
    const row = loaderData?.row;
    const title = row
      ? `${row.title} | Geosynthetics Africa`
      : "Technical Resource | Geosynthetics Africa";
    const description =
      row?.description ||
      `Technical information for ${row?.title || "geosynthetic products"}. Download the published document or request project-specific support.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ResourceDetail,
});

function getEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* noop */
  }
  return null;
}

function ResourceDetail() {
  const { category } = Route.useParams();
  const cat = getCategory(category)!;
  const { row } = Route.useLoaderData();

  const download = async () => {
    if (!row) return;
    if (row.file_path) {
      const { data, error } = await supabase.storage
        .from("technical-docs")
        .createSignedUrl(row.file_path, 60 * 5);
      if (error || !data) return toast.error(error?.message ?? "Cannot download");
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } else if (row.external_url) {
      window.open(row.external_url, "_blank", "noopener,noreferrer");
    }
  };

  const isVideo = !!row?.external_url && VIDEO_HOST_RE.test(row.external_url);
  const embed = row?.external_url ? getEmbed(row.external_url) : null;

  return (
    <>
      <PageHero eyebrow={cat.title} title={row.title} description={row?.description ?? undefined} />
      <section className="bg-background">
        <div className="container-page py-12 max-w-4xl">
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/resources" className="hover:text-primary">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <Link to="/resources/$category" params={{ category }} className="hover:text-primary">
              {cat.title}
            </Link>
          </div>

          <div className="space-y-6">
            {isVideo && embed && (
              <div className="aspect-video w-full overflow-hidden rounded border border-border bg-card">
                <iframe src={embed} title={row.title} className="h-full w-full" allowFullScreen />
              </div>
            )}

            {row.description && (
              <div className="rounded border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold uppercase mb-3">Overview</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {row.description}
                </p>
              </div>
            )}

            <div className="rounded border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold uppercase mb-4">Details</h2>
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-semibold">{cat.title}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-semibold uppercase">{row.type}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Access</dt>
                  <dd className="font-semibold">{row.is_public ? "Public" : "Gated"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Published</dt>
                  <dd className="font-semibold">{new Date(row.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                {row.is_public && (row.file_path || row.external_url) ? (
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <a
                      href={resourceDownloadPath(row.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />{" "}
                      {isVideo ? "Watch" : row.file_path ? "Download" : "Open link"}
                    </a>
                  </Button>
                ) : row.file_path ? (
                  <Button
                    onClick={() => void download()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                ) : row.external_url ? (
                  <Button
                    onClick={() => void download()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isVideo ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    {isVideo ? "Watch" : "Open link"}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
