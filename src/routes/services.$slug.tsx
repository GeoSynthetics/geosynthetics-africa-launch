import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/components/site/mega-menu-data";
import { ServicePage } from "@/pages/ServicePage";
import { supabase } from "@/integrations/supabase/client";

async function loadServiceData(slug: string) {
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
      heroImage: pc.heroImage || "",
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
    templateData = templates[slug] || null;
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
