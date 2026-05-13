import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsLanding } from "@/pages/ApplicationsLanding";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Geosynthetics Africa" },
      { name: "description", content: "Engineered geosynthetic systems for mining, water containment, waste, roads, erosion control and more." },
      { property: "og:title", content: "Applications — Geosynthetics Africa" },
    ],
  }),
  component: ApplicationsLanding,
});
