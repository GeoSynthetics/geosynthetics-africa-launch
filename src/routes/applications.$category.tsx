import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { ApplicationCategoryPage } from "@/pages/ApplicationCategoryPage";
import { supabase } from "@/integrations/supabase/client";

async function loadApplicationData(categorySlug: string) {
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_applications")
    .maybeSingle();

  const templates = data?.value as Record<string, any> || {};
  const templateData = templates[categorySlug] || null;

  const staticCat = APPLICATION_CATEGORIES.find((c) => c.slug === categorySlug);
  const label = staticCat?.label ?? categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    category: { slug: categorySlug, label },
    templateData
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
