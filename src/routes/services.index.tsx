import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/pages/ServicesPage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

async function loadServicesLandingData() {
  const { data: rows } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", ["template_services", "hierarchy_services"]);

  const templates =
    (rows?.find((r) => r.key === "template_services")?.value as Record<string, any>) || {};
  const hierarchy = (rows?.find((r) => r.key === "hierarchy_services")?.value as any) || null;

  return {
    templates,
    hierarchy,
  };
}

function ServicesLandingSkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Hero Section */}
      <section className="bg-surface-dark text-white py-16 md:py-24">
        <div className="container-page text-center">
          <Skeleton className="h-4 w-32 bg-primary/35 mx-auto mb-4" />
          <Skeleton className="h-10 md:h-12 lg:h-14 w-2/3 bg-white/20 mx-auto mb-6" />
          <Skeleton className="h-4 w-1/2 bg-white/20 mx-auto" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container-page grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border p-6 rounded-lg bg-card space-y-4">
              <Skeleton className="h-10 w-10 rounded bg-primary/25" />
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/services/")({
  loader: loadServicesLandingData,
  pendingComponent: ServicesLandingSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const landing = loaderData?.templates?.["__landing"] || {};
    const title = landing.seo?.title || "Services — Geosynthetics Africa";
    const description =
      landing.seo?.description ||
      "Supply, Installation, QA/QC, Design Support, Logistics & After Sales — one partner, full accountability.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServicesPage,
});
