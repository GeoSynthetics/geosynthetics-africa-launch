import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsLanding } from "@/pages/ApplicationsLanding";
import { supabase } from "@/integrations/supabase/client";

async function loadApplicationsLandingData() {
  const { data: templateRow } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_applications")
    .maybeSingle();
  const templates = (templateRow?.value as Record<string, any>) || {};
  return {
    templates,
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
