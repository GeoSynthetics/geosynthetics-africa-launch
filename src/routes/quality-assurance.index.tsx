import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { QAPage } from "@/pages/QAPage";
import { Skeleton } from "@/components/ui/skeleton";

function QALandingSkeleton() {
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

      {/* QA Grid */}
      <section className="py-16">
        <div className="container-page grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border rounded overflow-hidden bg-card flex flex-col"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-24 bg-primary/30" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <Skeleton className="h-4 w-28 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/quality-assurance/")({
  loader: async () => {
    const { data: qaDocuments, error: qaError } = await supabase
      .from("qa_documents")
      .select(
        "id, slug, category_name, short_description, hero_image_url, eyebrow, key_pillars, cta_label, sort_order",
      )
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (qaError) {
      console.error("Error loading QA documents:", qaError);
    }

    const { data: landingRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "qa_landing_content")
      .maybeSingle();

    return {
      qaDocuments: qaDocuments || [],
      landingContent: landingRow?.value || null,
    };
  },
  pendingComponent: QALandingSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const landing = (loaderData?.landingContent as any) || {};
    const title = landing.seo?.title || "Quality Assurance — Geosynthetics Africa";
    const description =
      landing.seo?.description ||
      "QA/QC standards, testing methods, documentation and certificates. No system leaves site unverified. IAGI-aligned installer serving Africa.";
    const keywords = landing.seo?.keywords || "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      ],
    };
  },
  component: QAPage,
});
