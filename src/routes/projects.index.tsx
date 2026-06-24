import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectsLandingSkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Page Hero */}
      <section className="bg-surface-dark text-white py-16 md:py-24">
        <div className="container-page">
          <Skeleton className="h-4 w-32 bg-primary/35 mb-4" />
          <Skeleton className="h-10 md:h-12 w-2/3 bg-white/20 mb-6" />
          <Skeleton className="h-4 w-1/2 bg-white/20" />
        </div>
      </section>

      {/* Filter Bar */}
      <div className="border-b border-border bg-surface py-6">
        <div className="container-page flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Grid of Projects */}
      <section className="py-16">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded overflow-hidden bg-card space-y-4">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-3 w-16 bg-primary/30" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3.5 w-24 pt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/projects/")({
  loader: async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("status", "published")
      .order("project_year", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading case studies:", error);
    }

    const { data: landingRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "projects_landing_content")
      .maybeSingle();

    return {
      caseStudies: data || [],
      landingContent: landingRow?.value || null,
    };
  },
  pendingComponent: ProjectsLandingSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const landing = (loaderData?.landingContent as any) || {};
    const title = landing.seo?.title || "Projects — 340+ engineered geosynthetic projects across Africa | Geosynthetics Africa";
    const description = landing.seo?.description || "Explore our successful geosynthetic installations across Africa. Filter by industry, application, and service type.";
    const keywords = landing.seo?.keywords || "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      ],
    };
  },
  component: ProjectsPage,
});
