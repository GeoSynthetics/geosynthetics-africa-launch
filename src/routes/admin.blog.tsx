import { createFileRoute } from "@tanstack/react-router";
import { BlogAdminPage } from "@/pages/BlogAdminPage";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({
    meta: [{ title: "Blog Management — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: BlogAdminPage,
});
