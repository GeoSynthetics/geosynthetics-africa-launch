import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/pages/ServicesPage";
import { supabase } from "@/integrations/supabase/client";

async function loadServicesLandingData() {
  const { data: templateRow } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_services")
    .maybeSingle();
  const templates = (templateRow?.value as Record<string, any>) || {};
  return {
    templates,
  };
}

export const Route = createFileRoute("/services/")({
  loader: loadServicesLandingData,
  head: ({ loaderData }) => {
    const landing = loaderData?.templates?.["__landing"] || {};
    const title = landing.seo?.title || "Services — Geosynthetics Africa";
    const description = landing.seo?.description || "Supply, Installation, QA/QC, Design Support, Logistics & After Sales — one partner, full accountability.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServicesPage,
});
