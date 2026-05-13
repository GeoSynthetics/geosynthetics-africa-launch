import { createFileRoute } from "@tanstack/react-router";
import { ResourcesIndexPage } from "@/pages/ResourcesIndexPage";

export const Route = createFileRoute("/resources/")(
  {
    head: () => ({
      meta: [
        { title: "Resources — Geosynthetics Africa" },
        { name: "description", content: "Datasheets, installation guides, technical articles, case studies, videos and FAQs." },
        { property: "og:title", content: "Resources — Geosynthetics Africa" },
      ],
    }),
    component: ResourcesIndexPage,
  },
);
