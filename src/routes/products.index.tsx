import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductsLanding } from "@/pages/ProductsLanding";
import { supabase } from "@/integrations/supabase/client";

async function loadProductsLandingData() {
  const [templatesRes, hierarchyRes] = await Promise.all([
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_product_categories")
      .maybeSingle(),
    supabase.from("site_config").select("value").eq("key", "hierarchy_products").maybeSingle(),
  ]);

  const templates = (templatesRes.data?.value as Record<string, any>) || {};
  const hierarchy = (hierarchyRes.data?.value as any) || null;

  return {
    templates,
    hierarchy,
  };
}

export const Route = createFileRoute("/products/")({
  loader: loadProductsLandingData,
  head: ({ loaderData }) => {
    const landing = loaderData?.templates?.["__landing"] || {};
    const title = landing.seo?.title || "Products — Geosynthetics Africa";
    const description =
      landing.seo?.description ||
      "Browse 200+ geosynthetic products: HDPE Geomembranes, Geotextiles, Geogrids, Geocells, GCLs, Drainage Composites and more.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content:
            landing.seo?.description ||
            "Global best-in-class materials, integrated into engineered systems.",
        },
      ],
    };
  },
  component: ProductsLanding,
  notFoundComponent: () => {
    throw notFound();
  },
});
