import { createFileRoute } from "@tanstack/react-router";
import { PagesSeoAdminPage } from "@/pages/PagesSeoAdminPage";

export const Route = createFileRoute("/admin/pages-seo")({
  head: () => ({
    meta: [{ title: "Pages SEO — Admin Dashboard" }],
  }),
  component: PagesSeoAdminPage,
});
