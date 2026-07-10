import { createFileRoute, Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductDetailPage } from "@/pages";
import { getProductDetail } from "@/lib/catalogue.functions";

function ProductDetailSkeleton() {
  return (
    <div className="w-full">
      {/* Breadcrumb + Hero with background skeleton */}
      <section className="relative bg-surface-dark text-surface-dark-foreground overflow-hidden py-12 md:py-16">
        <div className="relative container-page">
          <nav className="flex items-center gap-2 mb-8">
            <Skeleton className="h-3 w-12 bg-white/20" />
            <span className="text-white/30 text-xs">/</span>
            <Skeleton className="h-3 w-16 bg-white/20" />
            <span className="text-white/30 text-xs">/</span>
            <Skeleton className="h-3 w-24 bg-white/20" />
          </nav>

          <div className="max-w-2xl">
            {/* Category skeleton */}
            <Skeleton className="h-4 w-32 bg-primary/30 mb-4" />

            {/* Title skeleton */}
            <Skeleton className="h-12 md:h-16 w-3/4 bg-white/20 mb-6" />

            {/* Short description skeleton */}
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-5/6 bg-white/20" />
            </div>

            {/* Key features skeleton */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-2xl mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10 border border-white/20" />
                  <Skeleton className="h-3 w-16 bg-white/20 mt-2" />
                </div>
              ))}
            </div>

            {/* CTAs skeleton */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-44 bg-primary/45" />
              <Skeleton className="h-11 w-44 bg-white/20" />
              <Skeleton className="h-11 w-44 bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs skeleton */}
      <div className="border-b border-border bg-background py-4 sticky z-30 shadow-sm top-[72px] md:top-[96px]">
        <div className="container-page flex gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0" />
          ))}
        </div>
      </div>

      {/* Body section skeleton */}
      <section className="bg-background">
        <div className="container-page py-12 grid lg:grid-cols-12 gap-10">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-14">
            {/* Overview */}
            <div>
              <Skeleton className="h-7 w-32 mb-5" />
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="rounded border border-border p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-1 border-b border-border/50 last:border-0"
                    >
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <Skeleton className="h-7 w-44 mb-5" />
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-surface p-3 flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="p-3 divide-y divide-border space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between pt-3 first:pt-0">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Need help */}
            <div className="rounded border border-border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full mt-4" />
            </div>

            {/* Quote form */}
            <div className="rounded border border-border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/catalogue/$slug")({
  loader: ({ params }) => getProductDetail({ data: { slug: params.slug } }),
  pendingComponent: ProductDetailSkeleton,
  pendingMs: 0,
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p
      ? p.meta_title?.trim() || `${p.name} — Geosynthetics Africa`
      : "Product — Geosynthetics Africa";
    const desc =
      p?.meta_description?.trim() ||
      p?.short_description ||
      "Engineered geosynthetic product specified, supplied and certified by Geosynthetics Africa.";
    const keywords = p?.seo_keywords?.trim();
    const img = p?.image_url || p?.images?.[0] || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(img
          ? [
              { property: "og:image", content: img },
              { name: "twitter:image", content: img },
            ]
          : []),
      ],
      links: p
        ? [{ rel: "canonical", href: `https://geosynthetics.co.za/catalogue/${p.slug}` }]
        : [],
    };
  },
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Button asChild className="mt-6">
        <Link to="/catalogue" search={{ q: "", cats: [], mans: [], sort: "newest" }}>
          Back to catalogue
        </Link>
      </Button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Product not found</h1>
      <p className="mt-2 text-muted-foreground">That product isn't in our catalogue.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/catalogue" search={{ q: "", cats: [], mans: [], sort: "newest" }}>
          Back to catalogue
        </Link>
      </Button>
    </div>
  ),
  component: ProductDetailPage,
});
