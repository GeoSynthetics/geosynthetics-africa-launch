import { createFileRoute } from "@tanstack/react-router";
import { ResourcesAdminPage } from "@/pages/ResourcesAdminPage";

export const Route = createFileRoute("/admin/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResourcesAdminPage,
});
