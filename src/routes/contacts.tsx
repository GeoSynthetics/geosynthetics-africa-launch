import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ContactsPage } from "@/pages/ContactsPage";
import { z } from "zod";

const contactsSearchSchema = z.object({
  country: z.string().optional(),
});

export const Route = createFileRoute("/contacts")({
  staleTime: 60_000,
  validateSearch: (search) => contactsSearchSchema.parse(search),
  loader: async () => {
    const related = Promise.resolve(
      supabase
        .from("case_studies")
        .select("id, title, slug, summary, location, country, hero_image_url")
        .eq("status", "published")
        .order("project_year", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3),
    ).then(
      ({ data, error }) => {
        if (error) console.error("Error loading contact project examples:", error);
        return { caseStudies: data || [] };
      },
      () => ({ caseStudies: [] }),
    );
    const { data: config } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["seo_pages", "contacts_page_content", "regional_coverage"]);
    const values = Object.fromEntries((config || []).map((row) => [row.key, row.value]));
    const seoMap = (values.seo_pages as Record<string, any>) || {};

    return {
      seo: seoMap["/contacts"] || null,
      content: values.contacts_page_content || null,
      regionalCoverage: values.regional_coverage || null,
      related,
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
