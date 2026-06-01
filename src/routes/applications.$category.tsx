import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { ApplicationCategoryPage } from "@/pages/ApplicationCategoryPage";
import { supabase } from "@/integrations/supabase/client";

async function loadApplicationData(categorySlug: string) {
  // Try loading from hierarchy first
  const { data: hierarchyRow, error: hierarchyError } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "hierarchy_applications")
    .maybeSingle();

  if (hierarchyError) {
    console.error("Failed to load hierarchy_applications:", hierarchyError);
  }

  const hierarchy = hierarchyRow?.value as any || {};
  const matchedItem = hierarchy.items?.find(
    (item: any) => item.slug === categorySlug || item.id === categorySlug
  );

  let templateData = null;
  if (matchedItem && matchedItem.pageContent) {
    const pc = matchedItem.pageContent;
    templateData = {
      title: matchedItem.label,
      description: pc.subtitle || "",
      heroImage: pc.heroImage || "",
      content: {
        subsystems: pc.features || [],
        sections: pc.sections || [],
      },
      seo: pc.seo || null,
    };
  }

  // Fallback to template_applications key if no custom hierarchy pageContent is present
  if (!templateData) {
    const { data: templateRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_applications")
      .maybeSingle();
    const templates = templateRow?.value as Record<string, any> || {};
    templateData = templates[categorySlug] || null;
  }

  const staticCat = APPLICATION_CATEGORIES.find((c) => c.slug === categorySlug);
  const label = matchedItem?.label ?? staticCat?.label ?? categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
      .select("id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year")
      .eq("status", "published");
    
    if (casesData) {
      caseStudies = casesData.filter((cs: any) => {
        const text = `${cs.title} ${cs.summary} ${cs.sector}`.toLowerCase();
        return text.includes(queryTerm.toLowerCase()) || 
               (categorySlug === "mining-systems" && text.includes("tsf")) ||
               (categorySlug === "waste-landfills" && text.includes("waste"));
      });
    }
  } catch (e) {
    console.error("Failed to load application case studies:", e);
  }

  return {
    category: { slug: categorySlug, label },
    templateData,
    caseStudies
  };
}

export const Route = createFileRoute("/applications/$category")({
  ssr: false,
  loader: ({ params }) => loadApplicationData(params.category),
  head: ({ loaderData }) => {
    const { category, templateData } = loaderData || { category: { slug: "", label: "" }, templateData: null };
    const label = category.label;
    
    const title = templateData?.seo?.title || `${label} — Geosynthetics Africa`;
    const description = templateData?.seo?.description || `Explore our advanced ${label.toLowerCase()} applications and projects.`;
    
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ApplicationCategoryPage,
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
