import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { QADetailPage } from "@/pages/QADetailPage";
import { Skeleton } from "@/components/ui/skeleton";

async function loadQADocument(slug: string) {
  const { data, error } = await supabase
    .from("qa_documents")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading QA document:", error);
    throw error;
  }

  if (!data) {
    throw notFound();
  }

  return { qaDocument: data };
}

function QADetailSkeleton() {
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

        {/* Right column - Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/quality-assurance/$slug")({
  loader: ({ params }) => loadQADocument(params.slug),
  pendingComponent: QADetailSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const doc = loaderData?.qaDocument;
    const title = doc
      ? `${doc.category_name} — Quality Assurance | Geosynthetics Africa`
      : "Quality Assurance — Geosynthetics Africa";
    const desc =
      doc?.short_description ||
      "Manufacturer-aligned quality assurance for geosynthetics installations across Africa.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(doc?.hero_image_url ? [{ property: "og:image", content: doc.hero_image_url }] : []),
      ],
    };
  },
  component: QADetailPage,
});
