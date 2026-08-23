import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [seoRes, hpRes, caseStudiesRes] = await Promise.all([
      supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle(),
      supabase.from("site_config").select("value").eq("key", "homepage_content").maybeSingle(),
      supabase
        .from("case_studies")
        .select("id, slug, title, hero_image_url, sector, country, location, scale, summary, products_used, service_type, project_year")
        .eq("status", "published")
        .order("project_year", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

    const seoMap = (seoRes.data?.value as Record<string, any>) || {};
    return {
      seo: seoMap["/"] || null,
      hp: hpRes.data?.value || null,
      caseStudies: caseStudiesRes.data || [],
    };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title =
      seo?.title || "Geosynthetics Africa — Africa's Integrated Geosynthetics Execution Platform";
    const desc =
      seo?.description ||
      "Designed. Supplied. Installed. Tested. Certified. Complete engineered geosynthetic systems delivered across Africa with global best-in-class materials.";
    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ];
    if (seo?.keywords) {
      meta.push({ name: "keywords", content: seo.keywords });
    }
    return { meta };
  },
  component: HomePage,
});
