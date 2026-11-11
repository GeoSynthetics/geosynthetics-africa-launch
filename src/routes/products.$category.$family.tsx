import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { canonicalProductPath, fetchProductHierarchy } from "@/lib/section-paths";
import { getErrorMessage } from "@/lib/error-message";
import { Button } from "@/components/ui/button";
import { ProductFamilyPage } from "@/pages/ProductFamilyPage";
import { supabase } from "@/integrations/supabase/client";
import { productFamilySeo } from "@/lib/product-family-seo";
import { correctFamilyContent } from "@/lib/product-content-corrections";
import { PageLoading } from "@/components/site/PageLoading";

async function loadProductFamily(category: string, family: string) {
  // Project examples sit below the product details and must not delay the hero,
  // specification, or quote action. TanStack streams this promise separately.
  const dynamicCaseStudies = Promise.resolve(
    supabase
      .from("case_study_products")
      .select(
        "case_studies(id, title, slug, summary, location, country, hero_image_url, sector, service_type, project_year), products!inner(family_slug)",
      )
      .eq("products.family_slug", family),
  ).then(
    ({ data, error }) => {
      if (error) console.error("Failed to fetch family case studies:", error);
      const seen = new Set();
      return (data || [])
        .map((item: any) => item.case_studies)
        .filter((item: any) => {
          if (!item || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
    },
    (error) => {
      console.error("Failed to fetch family case studies:", error);
      return [];
    },
  );
  const [hierarchy, { data, error }] = await Promise.all([
    fetchProductHierarchy(),
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_product_categories")
      .maybeSingle(),
  ]);
  const resolved = canonicalProductPath(hierarchy, category, family);
  if (resolved && resolved.path !== `/products/${category}/${family}`) {
    throw redirect({ href: resolved.path, statusCode: 301 });
  }
  const familyId = resolved?.family?.id;
  if (error) {
    console.error("Failed to load product family template data:", error);
  }

  // The value is expected to be a map of familySlug -> templateData
  const templates = (data?.value as Record<string, any>) || {};
  // Templates are keyed by the family's slug or, for older entries, its id
  const familyData = templates[family] || (familyId ? templates[familyId] : null) || null;

  return {
    category,
    family,
    familyData: correctFamilyContent(family, familyData),
    dynamicCaseStudies,
  };
}

export const Route = createFileRoute("/products/$category/$family")({
  loader: async ({ params }) => {
    return loadProductFamily(params.category, params.family);
  },
  pendingComponent: PageLoading,
  pendingMs: 1500,
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const { category, family, familyData } = loaderData || {
      category: "",
      family: "",
      familyData: null,
    };
    const familyLabel =
      familyData?.label ||
      familyData?.title ||
      family
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const categoryLabel = category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const rangeTitles: Record<string, string> = {
      "bera-gravel-fix": "BERA Gravel Fix Systems Africa | Supply & Installation",
      "bera-grass-fix": "BERA Grass Paving Systems Africa | Selection & Supply",
      "studded-hdpe-concrete-liners-cpl": "Concrete Protection Liner Systems Africa | Studded HDPE",
    };
    const metadata = productFamilySeo(family, familyLabel, categoryLabel, familyData);
    const title = rangeTitles[family] || metadata.title;
    const description = metadata.description;
    const keywords = familyData?.seo?.keywords;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      ],
    };
  },
  component: ProductFamilyPage,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{getErrorMessage(error)}</p>
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
