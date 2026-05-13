import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { PRODUCT_CATEGORIES } from "@/components/site/mega-menu-data";

const IMAGES: Record<string, string> = {
  geomembranes: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
  geotextiles: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=600&q=80",
  geogrids: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80",
  geocells: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  gcls: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&q=80",
  "drainage-composites": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "erosion-control": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  accessories: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
};

export function ProductsLanding() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Engineered Materials for Every Application"
        description="Browse our full catalogue of geosynthetic products — sourced from global best-in-class manufacturers and specified to fit your engineered system."
      />
      <section className="bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {PRODUCT_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/products/$category"
                params={{ category: c.slug }}
                className="group rounded overflow-hidden border border-border bg-card hover:border-primary transition"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={IMAGES[c.slug] ?? IMAGES.geomembranes}
                    alt={c.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="font-display text-base font-bold uppercase">{c.label}</div>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
