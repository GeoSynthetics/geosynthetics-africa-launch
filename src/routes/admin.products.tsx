import { createFileRoute } from "@tanstack/react-router";
import { ProductsAdminPage } from "@/pages";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductsAdminPage,
});
