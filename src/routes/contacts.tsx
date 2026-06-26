import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ContactsPage } from "@/pages/ContactsPage";
import { z } from "zod";

const contactsSearchSchema = z.object({
  country: z.string().optional(),
});

export const Route = createFileRoute("/contacts")({
  validateSearch: (search) => contactsSearchSchema.parse(search),
  loader: async () => {
    const { data: seoData } = await supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle();
    const seoMap = (seoData?.value as Record<string, any>) || {};

    const { data: caseStudies, error } = await supabase
      .from("case_studies")
      .select("id, title, slug, summary, location, country, hero_image_url")
      .eq("status", "published")
      .order("project_year", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error loading case studies for contacts page:", error);
    }

    return {
      seo: seoMap["/contacts"] || null,
      caseStudies: caseStudies || [],
    };
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
