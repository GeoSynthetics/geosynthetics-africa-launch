import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCategoryPage } from "@/pages/ProductCategoryPage";
import { getProductPageContent } from "@/data/product-pages";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCategorySkeleton() {
  return (
    <div className="w-full bg-background animate-pulse">
      {/* Hero Section */}
      <section className="bg-surface-dark text-white relative py-16 md:py-24">
        <div className="container-page relative z-10 flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-3 w-16 bg-white/20" />
              <span className="text-white/30 text-xs">/</span>
              <Skeleton className="h-3 w-20 bg-white/20" />
              <span className="text-white/30 text-xs">/</span>
              <Skeleton className="h-3 w-32 bg-white/20" />
            </div>
            <Skeleton className="h-10 md:h-12 lg:h-14 w-2/3 bg-white/20 mb-6" />
            <div className="space-y-2 mb-8 max-w-2xl border-l-2 border-primary/30 pl-4">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
            </div>
            <div className="flex gap-4 mt-8">
              <Skeleton className="h-10 w-36 bg-primary/45" />
              <Skeleton className="h-10 w-36 bg-white/20" />
            </div>
          </div>
          <div className="hidden md:block w-1/3">
            <Skeleton className="aspect-square w-full rounded-lg bg-white/10" />
          </div>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <div className="container-page py-16 grid lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-16">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-primary/30 mr-2 font-bold">|</span>
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-6">
              <span className="text-primary/30 mr-2 font-bold">|</span>
              <Skeleton className="h-6 w-80" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-border p-5 rounded bg-surface space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="rounded bg-surface-dark p-8 space-y-4">
              <Skeleton className="h-6 w-32 bg-white/25" />
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-10 w-full bg-primary/45" />
            </div>

            <div className="rounded border border-border bg-surface p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/products/$category/")({
  loader: async ({ params }) => {
    const content = await getProductPageContent(params.category);
    if (!content) throw notFound();
    return { category: { slug: params.category, label: content.label }, content };
  },
  pendingComponent: ProductCategorySkeleton,
  pendingMs: 0,
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
