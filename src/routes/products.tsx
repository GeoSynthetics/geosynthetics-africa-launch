import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductsLanding } from "@/pages/ProductsLanding";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Geosynthetics Africa" },
      { name: "description", content: "Browse 200+ geosynthetic products: HDPE Geomembranes, Geotextiles, Geogrids, Geocells, GCLs, Drainage Composites and more." },
      { property: "og:title", content: "Products — Geosynthetics Africa" },
      { property: "og:description", content: "Global best-in-class materials, integrated into engineered systems." },
    ],
  }),
  component: ProductsLanding,
  notFoundComponent: () => {
    throw notFound();
  },
});
