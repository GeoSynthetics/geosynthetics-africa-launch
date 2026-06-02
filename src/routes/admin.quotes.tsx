import { createFileRoute } from "@tanstack/react-router";
import { QuotesAdminPage } from "@/pages/QuotesAdminPage";

export const Route = createFileRoute("/admin/quotes")({
  head: () => ({
    meta: [
      { title: "Quote Requests — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuotesAdminPage,
});
