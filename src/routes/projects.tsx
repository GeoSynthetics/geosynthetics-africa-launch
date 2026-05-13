import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/pages/ProjectsPage";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Geosynthetics Africa" },
      { name: "description", content: "Explore our successful geosynthetic installations across Africa." },
      { property: "og:title", content: "Projects — Geosynthetics Africa" },
    ],
  }),
  component: ProjectsPage,
});
