import { Link } from "@tanstack/react-router";
import { ChevronRight, FileText, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export function IndustryPage({ data }: { data: any }) {
  const loaderData = data;
  const { industry, templateData, caseStudies = [], keyProducts = [] } = loaderData;

  const title = templateData?.title || industry.label;
  const description =
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

  const applications = templateData?.content?.applications || [
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
        className="bg-surface-dark text-surface-dark-foreground"
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
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
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
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{desc}</p>
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
                description={`Our engineers understand the specific demands of the ${title.toLowerCase()} sector.`}
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
