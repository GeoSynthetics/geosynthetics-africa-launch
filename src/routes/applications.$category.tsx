import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { ApplicationCategoryPage } from "@/pages/ApplicationCategoryPage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export async function loadApplicationData(categorySlug: string) {
  // Per-slug fallback hero images so pages look great before James configures them
  const FALLBACK_HEROES: Record<string, string> = {
    "mining-systems": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    "water-containment": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    "waste-landfills": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80",
    "roads-infrastructure":
      "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80",
    "erosion-control": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80",
    "drainage-systems": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    "agriculture-aquaculture":
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=80",
  };
  const DEFAULT_HERO = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";

  // Load templates from Supabase first
  const { data: templateRow } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_applications")
    .maybeSingle();
  const templates = (templateRow?.value as Record<string, any>) || {};

  // Try loading from hierarchy
  const { data: hierarchyRow, error: hierarchyError } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "hierarchy_applications")
    .maybeSingle();

  if (hierarchyError) {
    console.error("Failed to load hierarchy_applications:", hierarchyError);
  }

  const hierarchy = (hierarchyRow?.value as any) || {};
  const matchedItem = hierarchy.items?.find(
    (item: any) => item.slug === categorySlug || item.id === categorySlug,
  );

  // Determine which template to load (prioritize matchedItem's slug, fallback to matchedItem's id, and then categorySlug)
  let tmpl = null;
  if (matchedItem) {
    tmpl = templates[matchedItem.slug] || templates[matchedItem.id];
  }
  if (!tmpl) {
    tmpl = templates[categorySlug];
  }

  let templateData = null;
  if (tmpl) {
    templateData = {
      ...tmpl,
      heroImage: tmpl.heroImage || FALLBACK_HEROES[categorySlug] || DEFAULT_HERO,
    };
  } else if (matchedItem && matchedItem.pageContent) {
    // Legacy fallback if no template exists but hierarchy pageContent has some fields
    const pc = matchedItem.pageContent;
    templateData = {
      title: matchedItem.label,
      description: pc.subtitle || "",
      heroImage: pc.heroImage || FALLBACK_HEROES[categorySlug] || DEFAULT_HERO,
      content: {
        subsystems: pc.features || [],
        sections: pc.sections || [],
      },
      seo: pc.seo || null,
    };
  }

  // Merge hierarchy-specific overrides (like customized SEO, title, etc.) if a hierarchy item is matched
  if (matchedItem) {
    if (templateData) {
      if (matchedItem.label) {
        templateData.title = matchedItem.label;
      }
      if (matchedItem.pageContent) {
        const pc = matchedItem.pageContent;
        if (pc.subtitle) templateData.description = pc.subtitle;
        if (pc.heroImage) templateData.heroImage = pc.heroImage;
        if (pc.seo) {
          templateData.seo = {
            ...(templateData.seo || {}),
            ...pc.seo,
          };
        }
      }
    }
  }

  const staticCat = APPLICATION_CATEGORIES.find((c) => c.slug === categorySlug);
  const label =
    matchedItem?.label ??
    staticCat?.label ??
    categorySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Fetch dynamic case studies that match this application category
  let caseStudies: any[] = [];
  try {
    let queryTerm = label;
    if (categorySlug === "mining-systems") queryTerm = "Mining";
    else if (categorySlug === "water-containment") queryTerm = "Water";
    else if (categorySlug === "waste-landfills") queryTerm = "Landfill";
    else if (categorySlug === "roads-infrastructure") queryTerm = "Road";

    const { data: casesData } = await supabase
      .from("case_studies")
      .select(
        "id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year",
      )
      .eq("status", "published");

    if (casesData) {
      caseStudies = casesData.filter((cs: any) => {
        const text = `${cs.title} ${cs.summary} ${cs.sector}`.toLowerCase();
        return (
          text.includes(queryTerm.toLowerCase()) ||
          (categorySlug === "mining-systems" && text.includes("tsf")) ||
          (categorySlug === "waste-landfills" && text.includes("waste"))
        );
      });
    }
  } catch (e) {
    console.error("Failed to load application case studies:", e);
  }

  // Load selected products from Supabase
  let linkedProducts: any[] = [];
  if (templateData?.products && templateData.products.length > 0) {
    try {
      const { data: prodsData, error: prodsError } = await supabase
        .from("products_public")
        .select(
          "id, name, slug, image_url, short_description, thickness_mm, roll_width_m, roll_length_m, product_categories(slug, name)",
        )
        .in("id", templateData.products);
      if (!prodsError && prodsData) {
        linkedProducts = prodsData.map((d: any) => ({
          ...d,
          product_categories: Array.isArray(d.product_categories)
            ? d.product_categories[0]
            : d.product_categories,
        }));
      }
    } catch (e) {
      console.error("Failed to load template products:", e);
    }
  }

  // Load selected featured case study from Supabase
  let featuredCaseStudy = null;
  if (templateData?.featuredCaseStudySlug) {
    try {
      const { data: fcData, error: fcError } = await supabase
        .from("case_studies")
        .select(
          "id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year",
        )
        .eq("slug", templateData.featuredCaseStudySlug)
        .eq("status", "published")
        .maybeSingle();
      if (!fcError && fcData) {
        featuredCaseStudy = fcData;
      }
    } catch (e) {
      console.error("Failed to load featured case study:", e);
    }
  }

  return {
    category: { slug: categorySlug, label },
    templateData,
    caseStudies,
    linkedProducts,
    featuredCaseStudy,
  };
}

export function ApplicationCategorySkeleton() {
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
      </section>

      {/* Sticky Tab Navigation */}
      <div className="border-b border-border bg-surface py-4 sticky z-40 top-[80px]">
        <div className="container-page flex gap-8 overflow-x-auto no-scrollbar">
          {[
            "Overview",
            "System Components",
            "Design Considerations",
            "Installation",
            "QA & Testing",
            "Products Used",
            "Case Studies",
            "Downloads",
          ].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20 shrink-0" />
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
              <Skeleton className="h-6 w-44" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </section>

          <section className="border-t border-border pt-16">
            <div className="flex items-center mb-6">
              <span className="w-1.5 h-6 bg-primary/30 mr-4 block"></span>
              <Skeleton className="h-6 w-52" />
            </div>
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <Skeleton className="h-4 w-32" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right column / Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-border p-3 rounded-lg flex flex-col items-center justify-center min-h-[90px]"
                >
                  <Skeleton className="h-6 w-6 rounded-full mb-2" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/applications/$category")({
  ssr: false,
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug",
      params: { slug: params.category },
      statusCode: 301,
    });
  },
  loader: ({ params }) => loadApplicationData(params.category),
  pendingComponent: ApplicationCategorySkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const { category, templateData } = loaderData || {
      category: { slug: "", label: "" },
      templateData: null,
    };
    const label = category.label;

    const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
    const description =
      templateData?.seo?.description ||
      `Explore our advanced ${label.toLowerCase()} applications and projects.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ApplicationCategoryRoute,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Application not found</h1>
      <p className="mt-2 text-muted-foreground">That application category isn't defined.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/applications">Back to Applications</Link>
      </Button>
    </div>
  ),
});

function ApplicationCategoryRoute() {
  const data = Route.useLoaderData();
  return <ApplicationCategoryPage data={data} />;
}
