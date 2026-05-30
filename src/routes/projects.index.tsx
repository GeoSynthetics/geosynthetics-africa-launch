import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects/")({
  loader: async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("status", "published")
      .order("project_year", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading case studies:", error);
      return { caseStudies: [] };
    }

    return { caseStudies: data || [] };
  },
  head: () => ({
    meta: [
      { title: "Projects — 340+ engineered geosynthetic projects across Africa | Geosynthetics Africa" },
      { name: "description", content: "Explore our successful geosynthetic installations across Africa. Filter by industry, application, and service type." },
      { property: "og:title", content: "Projects — Geosynthetics Africa" },
    ],
  }),
  component: ProjectsPage,
});
