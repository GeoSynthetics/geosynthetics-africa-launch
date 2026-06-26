import { createFileRoute } from "@tanstack/react-router";
import { UsersAdminPage } from "@/pages/UsersAdminPage";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [{ title: "Users & Roles — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: UsersAdminPage,
});
