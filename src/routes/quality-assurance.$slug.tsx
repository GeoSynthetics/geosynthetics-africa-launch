import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { QADetailPage } from "@/pages/QADetailPage";

async function loadQADocument(slug: string) {
  const { data, error } = await supabase
    .from("qa_documents")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading QA document:", error);
    throw error;
  }

  if (!data) {
    throw notFound();
  }

  return { qaDocument: data };
}

export const Route = createFileRoute("/quality-assurance/$slug")({
  loader: ({ params }) => loadQADocument(params.slug),
  head: ({ loaderData }) => {
    const doc = loaderData?.qaDocument;
    const title = doc
      ? `${doc.category_name} — Quality Assurance | Geosynthetics Africa`
      : "Quality Assurance — Geosynthetics Africa";
    const desc = doc?.short_description || "Manufacturer-aligned quality assurance for geosynthetics installations across Africa.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(doc?.hero_image_url ? [{ property: "og:image", content: doc.hero_image_url }] : []),
      ],
    };
  },
  component: QADetailPage,
});
