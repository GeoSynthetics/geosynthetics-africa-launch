import { createFileRoute } from "@tanstack/react-router";
import { SiteBuilderPage } from "@/pages/SiteBuilderPage";

export const Route = createFileRoute("/admin/site-builder")({
  component: SiteBuilderPage,
});
