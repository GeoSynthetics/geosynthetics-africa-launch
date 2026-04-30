import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, MessageCircle, FileText, PencilRuler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";

export const Route = createFileRoute("/applications/$category")({
  head: ({ params }) => {
    const cat = APPLICATION_CATEGORIES.find((c) => c.slug === params.category);
    const label = cat?.label ?? "Application";
    return {
      meta: [
        { title: `${label} — Geosynthetics Africa` },
        { name: "description", content: `Engineered ${label.toLowerCase()} solutions, delivered as a complete system.` },
        { property: "og:title", content: `${label} — Geosynthetics Africa` },
      ],
    };
  },
  loader: ({ params }) => {
    const cat = APPLICATION_CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  component: ApplicationCategoryPage,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => {
    const { category } = Route.useParams();
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase">Application not found</h1>
        <p className="mt-2 text-muted-foreground">"{category}" isn't in our catalogue.</p>
        <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
          <Link to="/applications">Back to Applications</Link>
        </Button>
      </div>
    );
  },
});

function ApplicationCategoryPage() {
  const { category } = Route.useLoaderData();
  return (
    <>
      <section
        className="bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.4)), url(https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-20">
          <nav className="text-xs uppercase tracking-wider text-surface-dark-foreground/70 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/applications" className="hover:text-primary">Applications</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{category.label}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">{category.label}</h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">
            Complete engineered system — design, supply, install, test and certify. One partner, full accountability.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Sub-systems</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {["Lining Systems", "Leak Detection", "Drainage", "Cover Systems", "Reinforcement", "Erosion Protection"].map((t) => (
                <div key={t} className="rounded border border-border bg-card p-5 hover:border-primary transition">
                  <PencilRuler className="h-5 w-5 text-primary" />
                  <div className="mt-3 font-display text-base font-bold uppercase">{t}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Engineered {t.toLowerCase()} for {category.label.toLowerCase()} — specified, supplied and installed.
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded bg-surface-dark text-surface-dark-foreground p-6 sticky top-32">
              <h3 className="font-display text-lg font-bold uppercase">Design Support</h3>
              <p className="mt-2 text-sm text-surface-dark-foreground/75">
                Get application-specific engineering assistance for {category.label}.
              </p>
              <Button asChild className="mt-5 w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
                <Link to="/contacts"><MessageCircle className="h-4 w-4 mr-2" />Request Design Support</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/resources"><FileText className="h-4 w-4 mr-2" />Case Studies</Link>
              </Button>
              <Link to="/products" className="mt-4 text-xs uppercase tracking-wider text-primary inline-flex items-center gap-2">
                Related Products <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
