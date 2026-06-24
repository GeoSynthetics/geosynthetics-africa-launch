import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsLanding } from "@/pages/ApplicationsLanding";
import { supabase } from "@/integrations/supabase/client";

async function loadApplicationsLandingData() {
  const { data: rows } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", ["template_applications", "hierarchy_applications"]);

  const templates = (rows?.find(r => r.key === "template_applications")?.value as Record<string, any>) || {};
  const hierarchy = (rows?.find(r => r.key === "hierarchy_applications")?.value as any) || null;

  return {
    templates,
    hierarchy,
  };
}

export const Route = createFileRoute("/applications/")({
  loader: loadApplicationsLandingData,
  head: ({ loaderData }) => {
    const landing = loaderData?.templates?.["__landing"] || {};
    const title = landing.seo?.title || "Applications — Geosynthetics Africa";
    const description = landing.seo?.description || "Engineered geosynthetic systems for mining, water containment, waste, roads, erosion control and more.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ApplicationsLanding,
});
