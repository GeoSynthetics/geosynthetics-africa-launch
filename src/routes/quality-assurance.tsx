import { createFileRoute } from "@tanstack/react-router";
import { QAPage } from "@/pages/QAPage";

export const Route = createFileRoute("/quality-assurance")({
  head: () => ({
    meta: [
      { title: "Quality Assurance — Geosynthetics Africa" },
      { name: "description", content: "QA/QC standards, testing methods, documentation and certificates. No system leaves site unverified." },
      { property: "og:title", content: "Quality Assurance — Geosynthetics Africa" },
    ],
  }),
  component: QAPage,
});
