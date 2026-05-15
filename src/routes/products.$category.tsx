import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, FileText, MessageCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { PRODUCT_CATEGORIES } from "@/components/site/mega-menu-data";

export const Route = createFileRoute("/products/$category")({
  head: ({ params }) => {
    const staticCat = PRODUCT_CATEGORIES.find((c) => c.slug === params.category);
    const label = staticCat?.label ?? params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
    const staticCat = PRODUCT_CATEGORIES.find((c) => c.slug === params.category);
    const label = staticCat?.label ?? params.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { category: { slug: params.category, label } };
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

function ProductCategoryPage() {
  const { category } = Route.useLoaderData();
  return (
    <>
      <section
        className="bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.5)), url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-20">
          <nav className="text-xs uppercase tracking-wider text-surface-dark-foreground/70 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-primary">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{category.label}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">{category.label}</h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">
            Specified, supplied and certified by Geosynthetics Africa. Choose from leading global manufacturers — engineered to perform across African operating environments.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Available Variants</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded border border-border bg-card p-5 hover:border-primary transition">
                  <div className="h-32 rounded bg-surface mb-4" />
                  <div className="font-display text-base font-bold uppercase">{category.label} — Type {String.fromCharCode(65 + i)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Thickness: 0.5mm – 3.0mm</div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                    Request Datasheet <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded bg-surface-dark text-surface-dark-foreground p-6 sticky top-32">
              <h3 className="font-display text-lg font-bold uppercase">Need Help Selecting?</h3>
              <p className="mt-2 text-sm text-surface-dark-foreground/75">
                Speak to our technical team for application-specific recommendations.
              </p>
              <Button asChild className="mt-5 w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
                <Link to="/contacts"><MessageCircle className="h-4 w-4 mr-2" />Speak to Expert</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/resources"><Download className="h-4 w-4 mr-2" />Datasheets</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/catalogue" search={{ q: "", cats: [], mans: [], sort: "newest" }}><FileText className="h-4 w-4 mr-2" />Full Catalogue</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
