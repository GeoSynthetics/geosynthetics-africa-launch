import { createFileRoute } from "@tanstack/react-router";
import { BlogLandingPage } from "@/pages/BlogLandingPage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

function BlogLandingSkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Hero Skeleton */}
      <section className="bg-surface-dark text-white py-16 md:py-24">
        <div className="container-page">
          <Skeleton className="h-4 w-32 bg-primary/35 mb-4" />
          <Skeleton className="h-10 md:h-12 w-2/3 bg-white/20 mb-6" />
          <Skeleton className="h-4 w-1/2 bg-white/20" />
        </div>
      </section>

      {/* Filter Skeleton */}
      <div className="border-b border-border bg-surface py-6">
        <div className="container-page flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <section className="py-16">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border rounded-2xl overflow-hidden bg-card space-y-4"
            >
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-3 w-16 bg-primary/30 rounded" />
                <Skeleton className="h-5 w-5/6 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3.5 w-24 pt-2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:author_id (
          full_name
        )
      `,
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error loading blog posts:", error);
    }

    return {
      posts: data || [],
    };
  },
  pendingComponent: BlogLandingSkeleton,
  pendingMs: 0,
  head: () => {
    const title = "Geosynthetics Blog — Technical Insights & Industry News | Geosynthetics Africa";
    const description =
      "Stay informed with the latest technical specifications, engineering insights, and industry news for geosynthetics installations across Africa.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BlogLandingPage,
});
