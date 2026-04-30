import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Lock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { PRODUCT_CATEGORIES } from "@/components/site/mega-menu-data";
import { toast } from "sonner";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue — Geosynthetics Africa" },
      { name: "description", content: "Search and filter over 200 engineered geosynthetic materials by category, polymer type and technical specification." },
      { property: "og:title", content: "Catalogue — Geosynthetics Africa" },
    ],
  }),
  component: CataloguePage,
});

function CataloguePage() {
  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="200+ Engineered Materials"
        description="Search, filter and explore our full product catalogue."
      />
      <section className="bg-background">
        <div className="container-page py-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.info("Live search is coming soon — reach out and our team will help find the right product.");
            }}
            className="flex gap-2 max-w-3xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products, applications, standards…" className="pl-10 h-12" />
            </div>
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
              Search
            </Button>
          </form>
        </div>
        <div className="container-page pb-20 grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="rounded border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-bold uppercase">Filters</h3>
                <Lock className="h-3 w-3 text-muted-foreground ml-auto" aria-label="Coming soon" />
              </div>
              <div className="space-y-5 opacity-60">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Category</div>
                  <ul className="space-y-1.5 text-sm">
                    {PRODUCT_CATEGORIES.slice(0, 6).map((c) => (
                      <li key={c.slug} className="flex items-center gap-2">
                        <input type="checkbox" disabled className="rounded border-border" />
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Polymer Type</div>
                  <ul className="space-y-1.5 text-sm">
                    {["HDPE", "LLDPE", "PVC", "EPDM", "PP"].map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <input type="checkbox" disabled className="rounded border-border" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Live filtering launches with the catalogue release.</p>
            </div>
          </aside>
          <div className="lg:col-span-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded border border-border bg-card p-5">
                <div className="h-32 rounded bg-surface mb-4" />
                <div className="font-display text-sm font-bold uppercase">Product Placeholder {i + 1}</div>
                <div className="text-xs text-muted-foreground mt-1">Catalogue data syncs at launch.</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BoqCtaBand />
    </>
  );
}
