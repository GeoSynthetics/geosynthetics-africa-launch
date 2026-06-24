import { createFileRoute } from "@tanstack/react-router";
import { IndustriesLanding } from "@/pages/IndustriesLanding";
import { supabase } from "@/integrations/supabase/client";

async function loadIndustriesLandingData() {
  const { data: rows } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", ["template_industries", "hierarchy_industries"]);

  const templates = (rows?.find(r => r.key === "template_industries")?.value as Record<string, any>) || {};
  const hierarchy = (rows?.find(r => r.key === "hierarchy_industries")?.value as any) || null;

  return {
    templates,
    hierarchy,
  };
}

export const Route = createFileRoute("/industries/")({
  loader: loadIndustriesLandingData,
  head: ({ loaderData }) => {
    const landing = loaderData?.templates?.["__landing"] || {};
    const title = landing.seo?.title || "Industries — Geosynthetics Africa";
    const description = landing.seo?.description || "High-performance geosynthetic systems tailored for key African industries, including mining, infrastructure, and agriculture.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: IndustriesLanding,
});
