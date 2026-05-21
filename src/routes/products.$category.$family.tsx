import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductFamilyPage } from "@/pages/ProductFamilyPage";
import { supabase } from "@/integrations/supabase/client";

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
  const templates = data?.value as Record<string, any> || {};
  const familyData = templates[family] || null;

  return {
    category,
    family,
    familyData
  };
}

export const Route = createFileRoute("/products/$category/$family")({
  ssr: false,
  loader: ({ params }) => loadProductFamily(params.category, params.family),
  head: ({ loaderData }) => {
    const { category, family, familyData } = loaderData || { category: "", family: "", familyData: null };
    const familyLabel = family.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const categoryLabel = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const title = familyData?.seo?.title || `${familyLabel} | ${categoryLabel} — Geosynthetics Africa`;
    const description = familyData?.seo?.description || `Explore our premium ${familyLabel}, fully specified for African projects.`;
    
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
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
