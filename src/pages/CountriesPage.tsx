import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { REGION_ORDER } from "@/data/country-expansion";

export interface CountryLink {
  country: string;
  slug: string;
  flag?: string;
  region: string;
  summary?: string;
}

const REGION_INTRO: Record<string, string> = {
  "Southern Africa":
    "Road freight from our Cape Town and Johannesburg base reaches most Southern African sites within days.",
  "East Africa":
    "Delivered through Mombasa, Dar es Salaam and Djibouti, then inland by road and rail.",
  "West Africa":
    "Shipped to Lagos, Tema, Abidjan, Dakar, Conakry and Freetown, then trucked to mines and project sites.",
  "Central Africa":
    "Delivered through Douala, Kribi, Owendo and the Southern African road corridors.",
  "North Africa": "Shipped to Alexandria, Port Said, Tanger Med, Casablanca and Nouakchott.",
  "Indian Ocean": "Shipped to Toamasina and other island ports.",
};

export function CountriesPage({ countries }: { countries: CountryLink[] }) {
  const regions = [...REGION_ORDER, "Other"]
    .map((region) => ({
      region,
      items: countries
        .filter((c) => c.region === region)
        .sort((a, b) => a.country.localeCompare(b.country)),
    }))
    .filter((r) => r.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Countries We Serve"
        title="Geosynthetics Across Africa"
        description={`Supply, installation and QA/QC of geomembranes, GCLs, geotextiles, geogrids and erosion control in ${countries.length} African countries, delivered from our South African base.`}
        image="/images/geotextile-product-supply.webp"
      />
      <section className="bg-background">
        <div className="container-page py-14 md:py-20 space-y-14">
          {regions.map(({ region, items }) => (
            <div key={region}>
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide">
                {region}
              </h2>
              {REGION_INTRO[region] && (
                <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
                  {REGION_INTRO[region]}
                </p>
              )}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    to="/$slug"
                    params={{ slug: c.slug }}
                    className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition flex items-start gap-4"
                  >
                    <span className="text-3xl leading-none" aria-hidden="true">
                      {c.flag || <MapPin className="h-6 w-6 text-primary" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display font-bold uppercase tracking-wide group-hover:text-primary transition">
                        Geosynthetics {c.country}
                      </span>
                      {c.summary && (
                        <span className="mt-1 block text-xs text-muted-foreground line-clamp-2">
                          {c.summary}
                        </span>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary mt-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <BoqCtaBand />
    </>
  );
}
