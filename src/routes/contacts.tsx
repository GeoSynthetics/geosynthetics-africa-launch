import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ContactsPage } from "@/pages/ContactsPage";

export const Route = createFileRoute("/contacts")({
  loader: async () => {
    const { data } = await supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle();
    const seoMap = (data?.value as Record<string, any>) || {};
    return { seo: seoMap["/contacts"] || null };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "Contact — Johannesburg Head Office | Geosynthetics Africa";
    const desc = seo?.description || "Geosynthetics Africa Johannesburg Head Office — Southern Africa regional hub for supply, installation, QA/QC and logistics. Upload your BOQ or speak to the technical team.";
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
  component: ContactsPage,
});
