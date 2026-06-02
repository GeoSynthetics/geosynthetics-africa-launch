import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCategoryPage } from "@/pages/ProductCategoryPage";
import { getProductPageContent } from "@/data/product-pages";

export const Route = createFileRoute("/products/$category/")({
  loader: async ({ params }) => {
    const content = await getProductPageContent(params.category);
    if (!content) throw notFound();
    return { category: { slug: params.category, label: content.label }, content };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: `Products — Geosynthetics Africa` }] };
    }
    const content = loaderData.content;
    const label = content.label;
    
    const title = content.seo?.title || `${label} — Geosynthetics Africa`;
    const description = content.seo?.description || `${label} — global best-in-class materials, fully specified for African projects.`;
    const keywords = content.seo?.keywords;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      ],
    };
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
      <h1 className="font-display text-3xl font-bold uppercase">Product category not found</h1>
      <p className="mt-2 text-muted-foreground">
        This category hasn't been set up yet. An admin can configure it in{" "}
        <Link to="/admin/page-templates" className="text-primary underline">Page Templates</Link>.
      </p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/products">Back to Products</Link>
      </Button>
    </div>
  ),
});
