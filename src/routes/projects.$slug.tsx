import { createFileRoute, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";

async function loadProject(slug: string) {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading project detail:", error);
    throw error;
  }

  if (!data) {
    throw notFound();
  }

  return { project: data };
}

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => loadProject(params.slug),
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title} — Case Study | Geosynthetics Africa` : "Case Study — Geosynthetics Africa";
    const desc = p?.meta_description || p?.summary || "Engineered geosynthetic case study by Geosynthetics Africa.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.hero_image_url ? [{ property: "og:image", content: p.hero_image_url }] : []),
      ],
    };
  },
  component: ProjectDetailPage,
});
