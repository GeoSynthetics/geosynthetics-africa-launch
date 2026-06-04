import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, FileText, PencilRuler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Route } from "@/routes/applications.$category";

export function ApplicationCategoryPage() {
  const { category, templateData, caseStudies = [] } = Route.useLoaderData();
  
  // Use templateData if available, fallback to basic category label otherwise
  const title = templateData?.title || category.label;
  const description = templateData?.description || `Complete engineered system — design, supply, install, test and certify. One partner, full accountability.`;
  const heroImage = templateData?.heroImage || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";
  const subsystems = templateData?.content?.subsystems || ["Lining Systems", "Leak Detection", "Drainage", "Cover Systems", "Reinforcement", "Erosion Protection"];

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
          <nav className="text-xs uppercase tracking-wider text-surface-dark-foreground/70 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/applications" className="hover:text-primary">Applications</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{category.label}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">{title}</h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">
            {description}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Sub-systems</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {subsystems.map((t: string) => (
                <div key={t} className="rounded border border-border bg-card p-5 hover:border-primary transition">
                  <PencilRuler className="h-5 w-5 text-primary" />
                  <div className="mt-3 font-display text-base font-bold uppercase">{t}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Engineered {t.toLowerCase()} for {title.toLowerCase()} — specified, supplied and installed.
                  </p>
                </div>
              ))}
            </div>

            {/* Render any additional custom sections defined in the CMS */}
            {templateData?.content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="mt-12">
                <h2 className="font-display text-2xl font-bold uppercase mb-4">{section.title}</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            ))}

            {/* Featured Projects section in Application Category Page */}
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
                      <div className="aspect-[16/10] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${cs.hero_image_url})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                            {cs.service_type === "supply_install" ? "Supply & Install" : cs.service_type === "supply_only" ? "Supply Only" : "Services Only"}
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
                contextLabel={category.label}
                heading="Request Engineering Support"
                description="Tell us about your project and we'll provide application-specific recommendations."
              />
              <Button asChild variant="outline" className="w-full uppercase font-bold tracking-wide">
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
