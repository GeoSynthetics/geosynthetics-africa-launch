import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, ExternalLink, Search, ArrowRight, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { VIDEO_HOST_RE, getCategory } from "@/lib/resource-categories";
import {
  fetchPublishedResources,
  resourceMatchesCategory,
  resourceDownloadPath,
  type PublicResource,
} from "@/lib/public-resources";

export const Route = createFileRoute("/resources/$category/")({
  staleTime: 60_000,
  beforeLoad: ({ params }) => {
    if (!getCategory(params.category)) throw notFound();
  },
  loader: async ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return {
      rows: (await fetchPublishedResources()).filter((row) => resourceMatchesCategory(row, cat)),
    };
  },
  head: ({ params }) => {
    const cat = getCategory(params.category);
    const title = cat ? `${cat.title} — Resources` : "Resources";
    return {
      meta: [
        { title: `${title} — Geosynthetics Africa` },
        { name: "description", content: cat?.desc ?? "Technical resources." },
        { property: "og:title", content: title },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = getCategory(category)!;
  const { rows } = Route.useLoaderData();
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => (q.trim() ? rows.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())) : rows),
    [rows, q],
  );

  const download = async (r: PublicResource) => {
    if (r.file_path) {
      const { data, error } = await supabase.storage
        .from("technical-docs")
        .createSignedUrl(r.file_path, 60 * 5);
      if (error || !data) return toast.error(error?.message ?? "Cannot download");
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } else if (r.external_url) {
      window.open(r.external_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <PageHero eyebrow="Resources" title={cat.title} description={cat.desc} />
      <section className="bg-background">
        <div className="container-page py-12">
          <div className="mb-6 flex items-center gap-3">
            <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary">
              ← All resources
            </Link>
            <div className="ml-auto relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${cat.title.toLowerCase()}`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              No {cat.title.toLowerCase()} available yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => {
                const isVideo =
                  cat.videoOnly || (r.external_url && VIDEO_HOST_RE.test(r.external_url));
                return (
                  <article
                    key={r.id}
                    className="rounded border border-border bg-card p-5 flex flex-col hover:border-primary transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-base font-bold uppercase leading-snug">
                        {r.title}
                      </h3>
                      {isVideo ? (
                        <PlayCircle className="h-5 w-5 text-primary shrink-0" />
                      ) : r.file_path ? (
                        <Download className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <ExternalLink className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {r.description}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                      {r.is_public && (r.file_path || r.external_url) ? (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={resourceDownloadPath(r.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {isVideo ? "Watch" : r.file_path ? "Download" : "Open"}
                            {isVideo ? (
                              <PlayCircle className="h-4 w-4" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void download(r)}
                          disabled={!r.file_path && !r.external_url}
                        >
                          {isVideo ? "Watch" : r.file_path ? "Download" : "Open"}
                          {isVideo ? (
                            <PlayCircle className="h-4 w-4" />
                          ) : r.file_path ? (
                            <Download className="h-4 w-4" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Link
                        to="/resources/$category/$slug"
                        params={{ category, slug: r.slug }}
                        className="ml-auto text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
