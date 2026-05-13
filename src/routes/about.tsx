import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AboutPage } from "@/pages/AboutPage";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const { data } = await supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle();
    const seoMap = (data?.value as Record<string, any>) || {};
    return { seo: seoMap["/about"] || null };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "About Us — Geosynthetics Africa";
    const desc = seo?.description || "Africa's Only Integrated Geosynthetics Execution Partner.";
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
  component: AboutPage,
});
