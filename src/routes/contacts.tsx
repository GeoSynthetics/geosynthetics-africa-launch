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
    const [{ data: config }, { data: caseStudies, error }] = await Promise.all([
      supabase
        .from("site_config")
        .select("key, value")
        .in("key", ["seo_pages", "contacts_page_content", "regional_coverage"]),
      supabase
        .from("case_studies")
        .select("id, title, slug, summary, location, country, hero_image_url")
        .eq("status", "published")
        .order("project_year", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3),
    ]);
    const values = Object.fromEntries((config || []).map((row) => [row.key, row.value]));
    const seoMap = (values.seo_pages as Record<string, any>) || {};

    if (error) {
      console.error("Error loading case studies for contacts page:", error);
    }

    return {
      seo: seoMap["/contacts"] || null,
      content: values.contacts_page_content || null,
      regionalCoverage: values.regional_coverage || null,
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
