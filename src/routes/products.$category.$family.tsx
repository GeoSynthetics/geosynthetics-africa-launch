import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductFamilyPage } from "@/pages/ProductFamilyPage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

async function loadProductFamily(category: string, family: string) {
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_product_categories")
    .maybeSingle();

  if (error) {
    console.error("Failed to load product family template data:", error);
  }

  // The value is expected to be a map of familySlug -> templateData
  const templates = (data?.value as Record<string, any>) || {};
  const familyData = templates[family] || null;

  // Fetch dynamic case studies that are linked to products belonging to this product family
  let dynamicCaseStudies: any[] = [];
  try {
    const { data: casesData } = await supabase
      .from("case_study_products")
      .select(
        "case_studies(id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year), products!inner(family_slug)",
      )
      .eq("products.family_slug", family);

    if (casesData) {
      const seen = new Set();
      dynamicCaseStudies = casesData
        .map((item: any) => item.case_studies)
        .filter((cs: any) => {
          if (!cs) return false;
          if (seen.has(cs.id)) return false;
          seen.add(cs.id);
          return true;
        });
    }
  } catch (e) {
    console.error("Failed to fetch dynamic case studies for family:", e);
  }

  return {
    category,
    family,
    familyData,
    dynamicCaseStudies,
  };
}

function ProductFamilySkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Hero Section */}
      <section className="bg-surface-dark text-white relative py-16 md:py-24">
        <div className="container-page relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-3 w-16 bg-white/20" />
              <span className="text-white/30 text-xs">/</span>
              <Skeleton className="h-3 w-20 bg-white/20" />
              <span className="text-white/30 text-xs">/</span>
              <Skeleton className="h-3 w-32 bg-white/20" />
            </div>
            <Skeleton className="h-10 md:h-12 lg:h-14 w-2/3 bg-white/20 mb-6" />
            <div className="space-y-2 mb-8 max-w-2xl border-l-2 border-primary/30 pl-4">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
            </div>
            <div className="flex gap-4 mt-8">
              <Skeleton className="h-10 w-36 bg-primary/45" />
              <Skeleton className="h-10 w-36 bg-white/20" />
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <Skeleton className="aspect-video w-full max-w-md rounded bg-white/10" />
          </div>
        </div>
        {/* Stats Row */}
        <div className="border-t border-white/10 relative z-10 bg-black/20">
          <div className="container-page grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-6 px-4 text-center space-y-2">
                <Skeleton className="h-8 w-16 bg-primary/35 mx-auto" />
                <Skeleton className="h-3 w-20 bg-white/20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <div className="border-b border-border bg-surface py-4 sticky z-40 top-[80px]">
        <div className="container-page flex gap-8 overflow-x-auto no-scrollbar">
          {[
            "Description",
            "Specifications",
            "Documents",
            "Applications & Industries",
            "Projects",
            "FAQs",
          ].map((label, i) => (
            <Skeleton key={i} className="h-4 w-24 shrink-0" />
          ))}
        </div>
      </div>

      {/* Main Content Split Layout */}
      <div className="container-page py-16 grid lg:grid-cols-12 gap-16">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-16">
          <section>
            <div className="flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary/30 mr-4 block"></span>
              <Skeleton className="h-6 w-52" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-surface border border-border p-5 rounded text-center space-y-2"
                >
                  <Skeleton className="h-3 w-16 mx-auto" />
                  <Skeleton className="h-6 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-16">
            <div className="flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary/30 mr-4 block"></span>
              <Skeleton className="h-6 w-44" />
            </div>
            <Skeleton className="h-44 w-full rounded border border-border" />
          </section>
        </div>

        {/* Right column / Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-surface border-t-4 border-t-primary border-x border-b border-border p-6 rounded-b shadow-sm sticky top-[160px] space-y-4">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/products/$category/$family")({
  ssr: false,
  loader: ({ params }) => loadProductFamily(params.category, params.family),
  pendingComponent: ProductFamilySkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const { category, family, familyData } = loaderData || {
      category: "",
      family: "",
      familyData: null,
    };
    const familyLabel = family
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const categoryLabel = category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const title =
      familyData?.seo?.title || `${familyLabel} | ${categoryLabel} — Geosynthetics Africa`;
    const description =
      familyData?.seo?.description ||
      `Explore our premium ${familyLabel}, fully specified for African projects.`;
    const keywords = familyData?.seo?.keywords;

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
  component: ProductFamilyPage,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Product Family not found</h1>
      <p className="mt-2 text-muted-foreground">That product family isn't in our catalogue.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/products">Back to Products</Link>
      </Button>
    </div>
  ),
});
