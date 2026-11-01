import { ArrowRight } from "lucide-react";

const manufacturingBrands = [
  {
    name: "FlowTex",
    wordmark: ["Flow", "Tex"],
    slug: "flowtex",
    category: "Dewatering & sand containers",
    description:
      "Dewatering bags, tubes and woven, nonwoven and three-layer sand containers.",
    href: "/services/manufacturing-fabrication#made-dewatering-tubes",
  },
  {
    name: "GeoBarrier",
    wordmark: ["Geo", "Barrier"],
    slug: "geobarrier",
    category: "Mole barrier systems",
    description: "Impermeable HDPE mole barrier systems.",
    href: "/services/manufacturing-fabrication#made-geobarrier-hd",
  },
  {
    name: "SoilLock",
    wordmark: ["Soil", "Lock"],
    slug: "soillock",
    category: "Erosion control blankets",
    description: "Jute, coir, straw and wood wool erosion control blankets.",
    href: "/products/erosion-control-geocells",
  },
  {
    name: "PolyTape",
    wordmark: ["Poly", "Tape"],
    slug: "polytape",
    category: "Woven geotextiles & silt fences",
    description:
      "Standard and high flow woven geotextiles up to 100 kN/m, plus reinforced and non-reinforced silt fences with selvedged edges.",
    href: "/products/geotextile-fabrics/pp-polytape-silt-fence",
  },
  {
    name: "FilterDrain",
    wordmark: ["Filter", "Drain"],
    slug: "filterdrain",
    category: "Integrated drainage & filtration",
    description:
      "Drainage pipes with factory fitted MIRAFI® S filtration and separation geotextile.",
    href: "/services/manufacturing-fabrication#made-filterdrain",
  },
  {
    name: "GeoCurtain",
    wordmark: ["Geo", "Curtain"],
    slug: "geocurtain",
    category: "Floating sediment barriers",
    description: "Class 1–3 silt curtains and floating sediment barriers.",
    href: "/products/dewatering-systems/geo-curtain-silt-turbidity-curtains",
  },
] as const;

export function ManufacturingBrands({
  heading = "In-House Manufacturing & Fabrication",
  description,
}: {
  heading?: string;
  description?: string;
}) {
  return (
    <section aria-labelledby="manufacturing-brands-title" className="bg-background">
      <div className="container-page py-12 md:py-16">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Our product systems
            </p>
            <h2
              id="manufacturing-brands-title"
              className="mt-2 font-display text-2xl font-bold uppercase tracking-tight md:text-3xl"
            >
              {heading}
            </h2>
          </div>
          <a
            href="/services/manufacturing-fabrication"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Explore manufacturing <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        {description ? (
          <p className="mb-8 max-w-4xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {manufacturingBrands.map((brand) => (
            <a
              key={brand.slug}
              href={brand.href}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 text-card-foreground transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <h3 className="font-display text-3xl font-bold tracking-tight">
                {brand.wordmark[0]}<span className="text-primary">{brand.wordmark[1]}</span>
              </h3>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider">
                {brand.category}
              </p>
              <p className="mt-2 grow text-sm leading-relaxed text-muted-foreground">
                {brand.description}
              </p>
              <span className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm font-bold text-primary">
                Explore {brand.name}
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
