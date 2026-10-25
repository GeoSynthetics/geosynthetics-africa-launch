import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AboutPage } from "@/pages/AboutPage";
import { fetchAboutContent } from "@/hooks/use-about-content";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [seoResult, about] = await Promise.all([
      supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle(),
      fetchAboutContent(),
    ]);
    const seoMap = (seoResult.data?.value as Record<string, any>) || {};
    return { seo: seoMap["/about"] || null, about };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "About Us — Geosynthetics Africa";
    const desc =
      seo?.description ||
      "Geosynthetics Africa combines material supply, manufacturing and fabrication, specialist installation and documented QA/QC for projects across Africa.";
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
