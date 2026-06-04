import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/components/site/mega-menu-data";
import { ServicePage } from "@/pages/ServicePage";
import { supabase } from "@/integrations/supabase/client";

async function loadServiceData(slug: string) {
  // Per-slug fallback hero images — kept in sync with the static SERVICE_CONTENT map in ServicePage.tsx
  const FALLBACK_HEROES: Record<string, string> = {
    "supply": "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1920&q=80",
    "installation": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    "qa-qc": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80",
    "design-support": "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    "logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    "after-sales": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  };
  const DEFAULT_HERO = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";

  // Try loading from hierarchy first
  const { data: hierarchyRow, error: hierarchyError } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "hierarchy_services")
    .maybeSingle();

  if (hierarchyError) {
    console.error("Failed to load hierarchy_services:", hierarchyError);
  }

  const hierarchy = hierarchyRow?.value as any || {};
  const matchedItem = hierarchy.items?.find(
    (item: any) => item.slug === slug || item.id === slug
  );

  let templateData = null;
  if (matchedItem && matchedItem.pageContent) {
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

  // Fallback to template_services if no custom hierarchy pageContent is present
  if (!templateData) {
    const { data: templateRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_services")
      .maybeSingle();
    const templates = templateRow?.value as Record<string, any> || {};
    const tmpl = templates[slug];
    templateData = tmpl
      ? { ...tmpl, heroImage: tmpl.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO }
      : null;
  }

  const staticSvc = SERVICES.find((s) => s.slug === slug);
  const label = matchedItem?.label ?? staticSvc?.label ?? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    service: { slug, label, icon: staticSvc?.icon || "CheckCircle" },
    templateData
  };
}

export const Route = createFileRoute("/services/$slug")({
  ssr: false,
  loader: ({ params }) => loadServiceData(params.slug),
  head: ({ loaderData }) => {
    const { service, templateData } = loaderData || { service: { slug: "", label: "", icon: "" }, templateData: null };
    const label = service.label;
    
    const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
    const description = templateData?.seo?.description || `Professional ${label.toLowerCase()} services by Geosynthetics Africa.`;
    
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServicePage,
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
