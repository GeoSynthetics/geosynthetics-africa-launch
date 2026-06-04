import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/components/site/mega-menu-data";
import { IndustryPage } from "@/pages/IndustryPage";
import { supabase } from "@/integrations/supabase/client";

async function loadIndustryData(slug: string) {
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
      heroImage: pc.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO,
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
    const tmpl = templates[slug];
    templateData = tmpl
      ? { ...tmpl, heroImage: tmpl.heroImage || FALLBACK_HEROES[slug] || DEFAULT_HERO }
      : null;
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
