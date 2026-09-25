import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/components/site/mega-menu-data";
import { ServicePage } from "@/pages/ServicePage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_SERVICES_TEMPLATES, type ServiceTemplate } from "@/types/service-template";

export async function loadServiceData(slug: string) {
  // Per-slug fallback hero images — kept in sync with the static SERVICE_CONTENT map in ServicePage.tsx
  const FALLBACK_HEROES: Record<string, string> = {
    supply: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1920&q=80",
    installation: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    "qa-qc": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80",
    "design-support": "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    "after-sales": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  };
  const DEFAULT_HERO = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";

  // Load templates from Supabase first
  const { data: templateRow } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_services")
    .maybeSingle();
  const templates = (templateRow?.value as Record<string, any>) || {};

  // Try loading from hierarchy
  const { data: hierarchyRow, error: hierarchyError } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "hierarchy_services")
    .maybeSingle();

  if (hierarchyError) {
    console.error("Failed to load hierarchy_services:", hierarchyError);
  }

  const hierarchy = (hierarchyRow?.value as any) || {};
  const matchedItem = hierarchy.items?.find((item: any) => item.slug === slug || item.id === slug);

  // Determine which template to load (prioritize matchedItem's slug, fallback to matchedItem's id, and then slug)
  let tmpl = null;
  if (matchedItem) {
    tmpl = templates[matchedItem.slug] || templates[matchedItem.id];
  }
  if (!tmpl) {
    tmpl = templates[slug];
  }

  const defaultTemplate = DEFAULT_SERVICES_TEMPLATES[slug] || null;

  let templateData: ServiceTemplate | null = null;
  if (tmpl) {
    templateData = {
      ...(defaultTemplate || {}),
      ...tmpl,
      title: tmpl.title || defaultTemplate?.title || "",
      description: tmpl.description || defaultTemplate?.description || "",
      heroImage:
        tmpl.heroImage || defaultTemplate?.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO,
      badge: tmpl.badge || defaultTemplate?.badge,
      overviewParagraphs:
        tmpl.overviewParagraphs && tmpl.overviewParagraphs.length > 0
          ? tmpl.overviewParagraphs
          : defaultTemplate?.overviewParagraphs || [],
      whyChooseTitle: tmpl.whyChooseTitle || defaultTemplate?.whyChooseTitle,
      whyChoose:
        tmpl.whyChoose && tmpl.whyChoose.length > 0
          ? tmpl.whyChoose
          : defaultTemplate?.whyChoose || [],
      whatWeDeliverTitle: tmpl.whatWeDeliverTitle || defaultTemplate?.whatWeDeliverTitle,
      whatWeDeliver:
        tmpl.whatWeDeliver && tmpl.whatWeDeliver.length > 0
          ? tmpl.whatWeDeliver
          : defaultTemplate?.whatWeDeliver || [],
      coverageTitle: tmpl.coverageTitle || defaultTemplate?.coverageTitle,
      coverageText: tmpl.coverageText || defaultTemplate?.coverageText,
      coverageBullets:
        tmpl.coverageBullets && tmpl.coverageBullets.length > 0
          ? tmpl.coverageBullets
          : defaultTemplate?.coverageBullets || [],
      coverageImage: tmpl.coverageImage || defaultTemplate?.coverageImage,
      coverageCaption: tmpl.coverageCaption || defaultTemplate?.coverageCaption,
      sidebarImage:
        tmpl.sidebarImage || defaultTemplate?.sidebarImage || FALLBACK_HEROES[slug] || DEFAULT_HERO,
      sidebarCaption: tmpl.sidebarCaption || defaultTemplate?.sidebarCaption,
      directModelTitle: tmpl.directModelTitle || defaultTemplate?.directModelTitle,
      directModelText: tmpl.directModelText || defaultTemplate?.directModelText,
      directModelItems:
        tmpl.directModelItems && tmpl.directModelItems.length > 0
          ? tmpl.directModelItems
          : defaultTemplate?.directModelItems || [],
      packagingTitle: tmpl.packagingTitle || defaultTemplate?.packagingTitle,
      packagingText: tmpl.packagingText || defaultTemplate?.packagingText,
      packagingItems:
        tmpl.packagingItems && tmpl.packagingItems.length > 0
          ? tmpl.packagingItems
          : defaultTemplate?.packagingItems || [],
      afcftaTitle: tmpl.afcftaTitle || defaultTemplate?.afcftaTitle,
      afcftaText: tmpl.afcftaText || defaultTemplate?.afcftaText,
      afcftaItems:
        tmpl.afcftaItems && tmpl.afcftaItems.length > 0
          ? tmpl.afcftaItems
          : defaultTemplate?.afcftaItems || [],
      playbookTitle: tmpl.playbookTitle || defaultTemplate?.playbookTitle,
      playbookItems:
        tmpl.playbookItems && tmpl.playbookItems.length > 0
          ? tmpl.playbookItems
          : defaultTemplate?.playbookItems || [],
      statsTitle: tmpl.statsTitle || defaultTemplate?.statsTitle,
      statsDescription: tmpl.statsDescription || defaultTemplate?.statsDescription,
      stats: tmpl.stats && tmpl.stats.length > 0 ? tmpl.stats : defaultTemplate?.stats || [],
      productsTitle: tmpl.productsTitle || defaultTemplate?.productsTitle,
      products:
        tmpl.products && tmpl.products.length > 0 ? tmpl.products : defaultTemplate?.products || [],
      downloadsTitle: tmpl.downloadsTitle || defaultTemplate?.downloadsTitle,
      downloads:
        tmpl.downloads && tmpl.downloads.length > 0
          ? tmpl.downloads
          : defaultTemplate?.downloads || [],
      seo: {
        ...(defaultTemplate?.seo || { title: "", description: "", keywords: "" }),
        ...(tmpl.seo || {}),
      },
    };
  } else if (defaultTemplate) {
    templateData = { ...defaultTemplate };
  } else if (matchedItem && matchedItem.pageContent) {
    // Legacy fallback if no template exists but hierarchy pageContent has some fields
    const pc = matchedItem.pageContent;
    templateData = {
      title: matchedItem.label,
      description: pc.subtitle || "",
      heroImage: pc.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO,
      content: {
        features: pc.features || [],
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
            ...(templateData.seo || { title: "", description: "", keywords: "" }),
            ...pc.seo,
          };
        }
      }
    }
  }

  const staticSvc = SERVICES.find((s) => s.slug === slug);
  const label =
    matchedItem?.label ??
    staticSvc?.label ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

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

  return {
    service: { slug, label, icon: staticSvc?.icon || "CheckCircle" },
    templateData,
    linkedProducts,
  };
}

export function ServiceDetailSkeleton() {
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

export const Route = createFileRoute("/services/$slug")({
  ssr: false,
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
  loader: ({ params }) => loadServiceData(params.slug),
  pendingComponent: ServiceDetailSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const { service, templateData } = loaderData || {
      service: { slug: "", label: "", icon: "" },
      templateData: null,
    };
    const label = service.label;

    const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
    const description =
      templateData?.seo?.description ||
      `Professional ${label.toLowerCase()} services by Geosynthetics Africa.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServiceRoute,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Service not found</h1>
      <p className="mt-2 text-muted-foreground">That service isn't defined.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/services">Back to Services</Link>
      </Button>
    </div>
  ),
});

function ServiceRoute() {
  const data = Route.useLoaderData();
  return <ServicePage data={data} />;
}
