import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/components/site/mega-menu-data";
import { IndustryPage } from "@/pages/IndustryPage";
import { supabase } from "@/integrations/supabase/client";

async function loadIndustryData(slug: string) {
  // Try loading from hierarchy first
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

  let templateData = null;
  if (matchedItem && matchedItem.pageContent) {
    const pc = matchedItem.pageContent;
    templateData = {
      title: matchedItem.label,
      description: pc.subtitle || "",
      heroImage: pc.heroImage || "",
      content: {
        challenges: pc.features || [],
        applications: pc.types?.map((t: any) => t.name) || [],
        sections: pc.sections || [],
      },
      seo: pc.seo || null,
    };
  }

  // Fallback to template_industries if no custom hierarchy pageContent is present
  if (!templateData) {
    const { data: templateRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_industries")
      .maybeSingle();
    const templates = templateRow?.value as Record<string, any> || {};
    templateData = templates[slug] || null;
  }

  const staticInd = INDUSTRIES.find((i) => i.slug === slug);
  const label = matchedItem?.label ?? staticInd?.label ?? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch dynamic Case Studies matching this industry (sector)
  let caseStudies: any[] = [];
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

  return {
    industry: { slug, label, icon: staticInd?.icon || "Factory" },
    templateData,
    caseStudies
  };
}

export const Route = createFileRoute("/industries/$slug")({
  ssr: false,
  loader: ({ params }) => loadIndustryData(params.slug),
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
