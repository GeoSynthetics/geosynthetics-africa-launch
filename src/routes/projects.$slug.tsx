import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { Skeleton } from "@/components/ui/skeleton";

async function loadProject(slug: string) {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading project detail:", error);
    throw error;
  }

  if (!data) {
    throw notFound();
  }

  return { project: data };
}

function ProjectDetailSkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Hero Section */}
      <section className="bg-surface-dark text-white relative py-16 md:py-24">
        <div className="container-page relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-3 w-12 bg-white/20" />
            <span className="text-white/30 text-xs">/</span>
            <Skeleton className="h-3 w-16 bg-white/20" />
            <span className="text-white/30 text-xs">/</span>
            <Skeleton className="h-3 w-32 bg-white/20" />
          </div>
          <Skeleton className="h-10 md:h-12 w-3/4 bg-white/20 mb-6" />
          <Skeleton className="h-4 w-1/3 bg-primary/35" />
        </div>
      </section>

      {/* Main Content Split Layout */}
      <div className="container-page py-16 grid lg:grid-cols-12 gap-12">
        {/* Left column - Content */}
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-[300px] md:h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>

        {/* Right column - Sidebar Project Details */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3 pt-3 border-t border-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between py-1 border-b border-border/50 last:border-0"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => loadProject(params.slug),
  pendingComponent: ProjectDetailSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const title = p
      ? `${p.title} — Case Study | Geosynthetics Africa`
      : "Case Study — Geosynthetics Africa";
    const desc =
      p?.meta_description ||
      p?.summary ||
      "Engineered geosynthetic case study by Geosynthetics Africa.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.hero_image_url ? [{ property: "og:image", content: p.hero_image_url }] : []),
      ],
    };
  },
  component: ProjectDetailPage,
});
