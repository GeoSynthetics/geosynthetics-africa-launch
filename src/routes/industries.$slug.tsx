import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/components/site/mega-menu-data";
import { IndustryPage } from "@/pages/IndustryPage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export async function loadIndustryData(slug: string) {
  // Per-slug fallback hero images so every industry page looks great before James configures them
  const FALLBACK_HEROES: Record<string, string> = {
    "construction-infrastructure": "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80",
    "mining": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    "environmental-waste": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80",
    "water-management": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
    "agriculture-aquaculture": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=80",
    "energy": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
  };
  const DEFAULT_HERO = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";

  // Load templates from Supabase first
  const { data: templateRow } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_industries")
    .maybeSingle();
  const templates = templateRow?.value as Record<string, any> || {};

  // Try loading from hierarchy
  const { data: hierarchyRow, error: hierarchyError } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "hierarchy_industries")
    .maybeSingle();

  if (hierarchyError) {
    console.error("Failed to load hierarchy_industries:", hierarchyError);
  }

  const hierarchy = hierarchyRow?.value as any || {};
  const matchedItem = hierarchy.items?.find(
    (item: any) => item.slug === slug || item.id === slug
  );

  // Determine which template to load (prioritize matchedItem's slug, fallback to matchedItem's id, and then slug)
  let tmpl = null;
  if (matchedItem) {
    tmpl = templates[matchedItem.slug] || templates[matchedItem.id];
  }
  if (!tmpl) {
    tmpl = templates[slug];
  }

  let templateData = null;
  if (tmpl) {
    templateData = {
      ...tmpl,
      heroImage: tmpl.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO,
    };
  } else if (matchedItem && matchedItem.pageContent) {
    // Legacy fallback if no template exists but hierarchy pageContent has some fields
    const pc = matchedItem.pageContent;
    templateData = {
      title: matchedItem.label,
      description: pc.subtitle || "",
      heroImage: pc.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO,
      content: {
        challenges: pc.features || [],
        applications: pc.types?.map((t: any) => t.name) || [],
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

  const staticInd = INDUSTRIES.find((i) => i.slug === slug);
  const label = matchedItem?.label ?? staticInd?.label ?? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch dynamic Case Studies (prioritize nominated, fallback to sector matching)
  let caseStudies: any[] = [];
  if (templateData?.caseStudies && templateData.caseStudies.length > 0) {
    try {
      const { data: casesData } = await supabase
        .from("case_studies")
        .select("id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year")
        .in("id", templateData.caseStudies)
        .eq("status", "published");

      if (casesData) {
        // Sort case studies in the order they were nominated
        const ordered = templateData.caseStudies
          .map((id: string) => casesData.find((c) => c.id === id))
          .filter(Boolean);
        caseStudies = ordered;
      }
    } catch (e) {
      console.error("Failed to load nominated case studies:", e);
    }
  } else {
    try {
      const { data: casesData } = await supabase
        .from("case_studies")
        .select("id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year")
        .eq("sector", label)
        .eq("status", "published")
        .order("project_year", { ascending: false });

      if (casesData) {
        caseStudies = casesData;
      }
    } catch (e) {
      console.error("Failed to load industry case studies:", e);
    }
  }

  // Fetch nominated Key Products
  let keyProducts: any[] = [];
  if (templateData?.keyProducts && templateData.keyProducts.length > 0) {
    try {
      const { data: prodsData } = await supabase
        .from("products_public")
        .select("id, name, slug, image_url, short_description, thickness_mm, roll_width_m, roll_length_m, product_categories(slug, name)")
        .in("id", templateData.keyProducts);

      if (prodsData) {
        // Order products in the order they were nominated
        const ordered = templateData.keyProducts
          .map((id: string) => prodsData.find((p) => p.id === id))
          .filter(Boolean);
        keyProducts = ordered.map((d: any) => ({
          ...d,
          product_categories: Array.isArray(d.product_categories) ? d.product_categories[0] : d.product_categories
        }));
      }
    } catch (e) {
      console.error("Failed to load nominated key products:", e);
    }
  }

  return {
    industry: { slug, label, icon: staticInd?.icon || "Factory" },
    templateData,
    caseStudies,
    keyProducts
  };
}

export function IndustryDetailSkeleton() {
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
              <Skeleton className="h-6 w-44" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-border p-5 rounded space-y-3 bg-surface">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
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
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/industries/$slug")({
  ssr: false,
  beforeLoad: ({ params }) => {
    throw redirect({
      to: `/${params.slug}`,
      statusCode: 301,
    });
  },
  loader: ({ params }) => loadIndustryData(params.slug),
  pendingComponent: IndustryDetailSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const { industry, templateData } = loaderData || { industry: { slug: "", label: "", icon: "" }, templateData: null };
    const label = industry.label;

    const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
    const description = templateData?.seo?.description || `High-performance geosynthetic solutions for the ${label.toLowerCase()} sector.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: IndustryPage,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Industry not found</h1>
      <p className="mt-2 text-muted-foreground">That industry isn't defined.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  ),
});
