import { createFileRoute } from "@tanstack/react-router";
import { PageTemplatesAdminPage } from "@/pages/PageTemplatesAdminPage";

export const Route = createFileRoute("/admin/page-templates")({
  head: () => ({
    meta: [{ title: "Page Templates — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: PageTemplatesAdminPage,
});
