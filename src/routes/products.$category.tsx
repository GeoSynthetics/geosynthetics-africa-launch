import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/components/site/mega-menu-data";
import { ProductCategoryPage } from "@/pages/ProductCategoryPage";
import { getProductPageContent } from "@/data/product-pages";

export const Route = createFileRoute("/products/$category")({
  head: ({ params }) => {
    const content = getProductPageContent(params.category, params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    const label = content.label;
    return {
      meta: [
        { title: `${label} — Geosynthetics Africa` },
        { name: "description", content: `${label} — global best-in-class materials, fully specified for African projects.` },
        { property: "og:title", content: `${label} — Geosynthetics Africa` },
        { property: "og:description", content: `Engineered ${label.toLowerCase()} systems for mining, water, waste and infrastructure.` },
      ],
    };
  },
  loader: ({ params }) => {
    const content = getProductPageContent(params.category, params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    return { category: { slug: params.category, label: content.label } };
  },
  component: ProductCategoryPage,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Product not found</h1>
      <p className="mt-2 text-muted-foreground">That product category isn't in our catalogue.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/products">Back to Products</Link>
      </Button>
    </div>
  ),
});
