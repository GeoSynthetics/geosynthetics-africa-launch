import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { canonicalProductPath, fetchProductHierarchy } from "@/lib/section-paths";
import { getErrorMessage } from "@/lib/error-message";
import { Button } from "@/components/ui/button";
import { ProductCategoryPage } from "@/pages/ProductCategoryPage";
import { getProductPageContent } from "@/data/product-pages";
import { correctDrainageOverview } from "@/lib/product-content-corrections";
import { PageLoading } from "@/components/site/PageLoading";

export const Route = createFileRoute("/products/$category/")({
  loader: async ({ params }) => {
    const [hierarchy, content] = await Promise.all([
      fetchProductHierarchy(),
      getProductPageContent(params.category),
    ]);
    const resolved = canonicalProductPath(hierarchy, params.category);
    if (resolved && resolved.path !== `/products/${params.category}`) {
      throw redirect({ href: resolved.path, statusCode: 301 });
    }
    if (!content) throw notFound();
    return {
      category: { slug: params.category, label: content.label },
      content: correctDrainageOverview(params.category, content),
    };
  },
  pendingComponent: PageLoading,
  pendingMs: 1500,
  staleTime: 60_000,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: `Products — Geosynthetics Africa` }] };
    }
    const content = loaderData.content;
    const label = content.label;

    const title = content.seo?.title || `${label} — Geosynthetics Africa`;
    const description =
      content.seo?.description ||
      `${label} — global best-in-class materials, fully specified for African projects.`;
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
      <p className="mt-2 text-muted-foreground">{getErrorMessage(error)}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Product category not found</h1>
      <p className="mt-2 text-muted-foreground">
        This category hasn't been set up yet. An admin can configure it in{" "}
        <Link to="/admin/page-templates" className="text-primary underline">
          Page Templates
        </Link>
        .
      </p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/products">Back to Products</Link>
      </Button>
    </div>
  ),
});
