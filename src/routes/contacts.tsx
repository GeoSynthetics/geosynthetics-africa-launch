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
    const { data: seoData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "seo_pages")
      .maybeSingle();
    const seoMap = (seoData?.value as Record<string, any>) || {};

    const { data: contentData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "contacts_page_content")
      .maybeSingle();
    const { data: regionalData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "regional_coverage")
      .maybeSingle();

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
      content: contentData?.value || null,
      regionalCoverage: regionalData?.value || null,
      caseStudies: caseStudies || [],
    };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "Contact Geosynthetics Africa | Project Quotes & Support";
    const desc =
      seo?.description ||
      "Contact Geosynthetics Africa in Cape Town for material supply, fabrication, African delivery and installation enquiries. Send your BOQ, drawings and site location.";
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
