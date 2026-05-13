import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";

const IMAGES: Record<string, string> = {
  "mining-systems": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
  "water-containment": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  "waste-landfills": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "roads-infrastructure": "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=800&q=80",
  "erosion-control": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  "drainage-systems": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  "agriculture-aquaculture": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
};

export function ApplicationsLanding() {
  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Engineered Systems for Every Application"
        description="From tailings storage to road stabilisation — full-system solutions, designed and certified for African operating conditions."
      />
      <section className="bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APPLICATION_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/applications/$category"
                params={{ category: c.slug }}
                className="group relative aspect-[4/3] overflow-hidden rounded"
              >
                <img
                  src={IMAGES[c.slug] ?? IMAGES["mining-systems"]}
                  alt={c.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-surface-dark-foreground">
                  <div className="font-display text-xl font-bold uppercase">{c.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider opacity-80 inline-flex items-center gap-2">
                    Explore System <ArrowRight className="h-3 w-3" />
                  </div>
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
