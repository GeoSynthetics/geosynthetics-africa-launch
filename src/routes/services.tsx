import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/pages/ServicesPage";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Geosynthetics Africa" },
      { name: "description", content: "Supply, Installation, QA/QC, Design Support, Logistics & After Sales — one partner, full accountability." },
      { property: "og:title", content: "Services — Geosynthetics Africa" },
    ],
  }),
  component: ServicesPage,
});
