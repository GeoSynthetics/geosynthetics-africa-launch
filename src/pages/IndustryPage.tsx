import { Link } from "@tanstack/react-router";
import { ChevronRight, FileText, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GeoGrid } from "@/components/site/shapes";
import { INDUSTRY_DELIVERY_GUIDES } from "@/data/industry-delivery";
import { INDUSTRY_PROFILES, industryProducts } from "@/data/industry-structures";
import { ServiceSectionBlock } from "@/components/site/ServiceSectionBlock";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";
import { useQuickQuote } from "@/hooks/use-quick-quote";

export function IndustryPage({ data }: { data: any }) {
  const loaderData = data;
  const { industry, templateData, caseStudies = [], keyProducts = [] } = loaderData;
  const profile = INDUSTRY_DELIVERY_GUIDES[industry.slug];
  const built = INDUSTRY_PROFILES[industry.slug];
  const builtProducts = built ? industryProducts(built) : [];
  const { open } = useQuickQuote();

  const title = templateData?.title || industry.label;
  const description =
    built?.summary ||
    profile?.summary ||
    templateData?.description ||
    `High-performance geosynthetic solutions for the ${industry.label.toLowerCase()} sector.`;
  const heroImage =
    templateData?.heroImage ||
    "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80";

  const challenges = templateData?.content?.challenges || [
    "Strict environmental regulations and compliance",
    "Extreme operating conditions and remote locations",
    "Demand for rapid deployment and cost efficiency",
  ];

  const applications = profile
    ? profile.applications.map((slug) => {
        const app = APPLICATION_DIRECTORY.find((item) => item.slug === slug)!;
        return { title: app.label, description: app.summary, link: "/applications/" + slug };
      })
    : templateData?.content?.applications || [
        "Containment Systems",
        "Erosion Protection",
        "Structural Reinforcement",
      ];

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Industries", to: "/industries" },
    { label: title },
  ];

  return (
    <>
      <section
        className="relative isolate overflow-hidden bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.4)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-20">
          <Breadcrumbs items={breadcrumbs} variant="default" />
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">{description}</p>
          <Button className="mt-7" onClick={() => open(title)}>
            Request a Project Proposal
          </Button>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-background">
        <GeoGrid opacity={0.06} color="var(--primary)" gridSize={8} />
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {built && (
              <>
                <nav
                  aria-label="Industry page sections"
                  className="mb-10 flex gap-6 overflow-x-auto border-b border-border pb-4 text-xs font-bold uppercase whitespace-nowrap"
                >
                  <a href="#structures" className="hover:text-primary">
                    What We Build
                  </a>
                  {built.sections.map((section) => (
                    <a key={section.id} href={"#" + section.id} className="hover:text-primary">
                      {section.label}
                    </a>
                  ))}
                  <a href="#products" className="hover:text-primary">
                    Products We Supply
                  </a>
                  <a href="#qaqc" className="hover:text-primary">
                    QA/QC
                  </a>
                </nav>
                <section id="structures" className="scroll-mt-36">
                  <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">
                    {built.structuresTitle}
                  </h2>
                  <div className="mt-6 grid gap-5">
                    {built.structures.map((structure, index) => (
                      <article
                        key={structure.name}
                        className="rounded-xl border border-border bg-card p-5 md:p-6"
                      >
                        <div className="flex items-start gap-4">
                          <span className="font-display text-2xl font-bold text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <h3 className="font-display text-lg font-bold uppercase leading-tight">
                              {structure.name}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                              {structure.what}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {structure.products.map((product) => (
                                <a
                                  key={product.href}
                                  href={product.href}
                                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                                >
                                  {product.label}
                                </a>
                              ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-wider">
                              {structure.application && (
                                <a
                                  href={"/applications/" + structure.application}
                                  className="text-primary hover:underline"
                                >
                                  How we build it →
                                </a>
                              )}
                              {structure.service && (
                                <a
                                  href={structure.service.href}
                                  className="text-primary hover:underline"
                                >
                                  {structure.service.label} →
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
                {built.sections.map((section) => (
                  <div key={section.id} className="mt-12">
                    <ServiceSectionBlock section={section} first={false} />
                  </div>
                ))}
                <section id="products" className="mt-12 scroll-mt-36 border-t border-border pt-10">
                  <h2 className="font-display text-2xl font-bold uppercase">
                    Products We Supply for {title}
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Every product below is in our catalogue and in the structures above. We supply,
                    manufacture where required and install.
                  </p>
                  <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {builtProducts.map((product) => (
                      <a
                        key={product.href}
                        href={product.href}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm font-semibold hover:border-primary min-h-[56px]"
                      >
                        {product.label}
                        <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                      </a>
                    ))}
                  </div>
                </section>
              </>
            )}
            {profile && (
              <section
                id="qaqc"
                className={
                  "scroll-mt-36 mb-12 rounded-xl border border-border bg-surface/40 p-6 md:p-8" +
                  (built ? " mt-12" : "")
                }
              >
                <h2 className="font-display text-2xl font-bold uppercase">What We Need From You</h2>
                <ul className="list-disc pl-5 mt-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {profile.inputs.map((input) => (
                    <li key={input}>{input}</li>
                  ))}
                </ul>
                <h3 className="mt-7 font-bold text-sm">Our QA/QC & handover scope</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {profile.quality}
                </p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  We supply, manufacture where required, deliver across borders and install with our
                  own crews. Our proposal sets out availability, delivery terms, inspection stages
                  and the handover records we provide.
                </p>
                <Link
                  to="/technical-centre"
                  className="mt-5 inline-flex text-sm font-bold text-primary"
                >
                  Review material selection guidance →
                </Link>
              </section>
            )}
            {!built && (
              <>
                <h2 className="font-display text-2xl font-bold uppercase mb-6">
                  Industry Challenges Solved
                </h2>
                <div className="space-y-4">
                  {challenges.map((challenge: string, i: number) => (
                    <div
                      key={i}
                      className="rounded border border-border bg-card p-6 flex items-start gap-4"
                    >
                      <Factory className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-display text-lg font-bold">{challenge}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="font-display text-2xl font-bold uppercase mt-12 mb-6">
                  Key Applications in {title}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {applications.map((app: any, i: number) => {
                    if (typeof app === "string") {
                      return (
                        <div
                          key={i}
                          className="border-l-2 border-primary pl-4 py-2 bg-card/40 rounded-r"
                        >
                          <div className="font-bold uppercase text-foreground">{app}</div>
                        </div>
                      );
                    }

                    const heading = app.heading || app.title || "";
                    const desc = app.description || "";
                    const link = app.link || app.to || "";

                    return (
                      <div
                        key={i}
                        className="rounded border border-border bg-card p-6 flex flex-col justify-between hover:border-primary transition duration-200"
                      >
                        <div>
                          <h3 className="font-display text-base font-bold uppercase text-foreground mb-2">
                            {heading}
                          </h3>
                          {desc && (
                            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                              {desc}
                            </p>
                          )}
                        </div>
                        {link && (
                          <Link
                            to={link as any}
                            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1 mt-auto"
                          >
                            Learn More <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Render any additional custom sections defined in the CMS */}
            {templateData?.content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="mt-12">
                <h2 className="font-display text-2xl font-bold uppercase mb-4">{section.title}</h2>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </div>
            ))}

            {/* Nominated Key Products block */}
            {keyProducts && keyProducts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border">
                <h2 className="font-display text-2xl font-bold uppercase mb-8 flex items-center">
                  <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                  Featured Products
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {keyProducts.map((p: any, idx: number) => (
                    <Link
                      key={idx}
                      to="/catalogue/$slug"
                      params={{ slug: p.slug }}
                      className="group flex flex-col rounded border border-border bg-card overflow-hidden hover:border-primary transition duration-200"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-surface">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Factory className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col font-sans">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          {p.product_categories?.name || "Product"}
                        </span>
                        <h3 className="font-display text-sm font-bold uppercase leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {p.name}
                        </h3>
                        {p.short_description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                            {p.short_description}
                          </p>
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider text-primary mt-auto flex items-center gap-1">
                          View Product <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects section in Industry Page */}
            {caseStudies && caseStudies.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border">
                <h2 className="font-display text-2xl font-bold uppercase mb-8 flex items-center">
                  <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                  Featured Case Studies
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {caseStudies.map((cs: any, idx: number) => (
                    <Link
                      key={idx}
                      to="/projects/$slug"
                      params={{ slug: cs.slug }}
                      className="group flex flex-col rounded border border-border bg-card overflow-hidden hover:border-foreground transition duration-200"
                    >
                      <div
                        className="aspect-[16/10] relative overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: `url(${cs.hero_image_url})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                            {cs.service_type === "supply_install"
                              ? "Supply & Install"
                              : cs.service_type === "supply_only"
                                ? "Supply Only"
                                : "Services Only"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between font-sans">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
                            {cs.project_year || "2024"}
                          </div>
                          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-150 leading-tight mb-2">
                            {cs.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {cs.summary}
                          </p>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary mt-4 flex items-center gap-1">
                          View Case Study <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="lg:col-span-4">
            <div className="space-y-6 sticky top-32">
              <QuoteCard
                contextLabel={title}
                heading="Discuss Your Project"
                description="Send us your drawings or BOQ and we will return a supply and installation proposal."
              />
              <Button
                asChild
                variant="outline"
                className="w-full uppercase font-bold tracking-wide"
              >
                <Link to="/resources">
                  <FileText className="h-4 w-4 mr-2" />
                  Industry Case Studies
                </Link>
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
