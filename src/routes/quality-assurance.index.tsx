import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { QAPage } from "@/pages/QAPage";

export const Route = createFileRoute("/quality-assurance/")({
  loader: async () => {
    const { data, error } = await supabase
      .from("qa_documents")
      .select("id, slug, category_name, short_description, hero_image_url, eyebrow, key_pillars, cta_label, sort_order")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error loading QA documents:", error);
      return { qaDocuments: [] };
    }

    return { qaDocuments: data || [] };
  },
  head: () => ({
    meta: [
      { title: "Quality Assurance — Geosynthetics Africa" },
      { name: "description", content: "QA/QC standards, testing methods, documentation and certificates. No system leaves site unverified. IAGI-aligned installer serving Africa." },
      { property: "og:title", content: "Quality Assurance — Geosynthetics Africa" },
    ],
  }),
  component: QAPage,
});
