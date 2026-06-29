import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

// Helper to render Lucide icons dynamically by string name
function IconRenderer({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}

export function ApplicationCategoryPage({ data }: { data: any }) {
  const loaderData = data;
  const {
    category,
    templateData,
    caseStudies = [],
    linkedProducts = [],
    featuredCaseStudy = null,
  } = loaderData;

  // ─── Visual Fields Fallbacks & Mapping ──────────────────────────────────────
  const title = templateData?.title || category.label;
  const description =
    templateData?.description ||
    "Complete engineered system — design, supply, install, test and certify.";
  const heroImage =
    templateData?.heroImage ||
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";

  const downloadGuideLabel = templateData?.downloadGuideLabel || "Download System Guide";
  const downloadGuideUrl = templateData?.downloadGuideUrl || "";

  const heroHighlights = templateData?.heroHighlights || [
    { icon: "Shield", label: "Premium Protection" },
    { icon: "CheckCircle2", label: "Certified Installers" },
  ];

  const overviewParagraphs =
    templateData?.overviewParagraphs && templateData.overviewParagraphs.length > 0
      ? templateData.overviewParagraphs
      : [description];

  const keyBenefits = templateData?.keyBenefits || [
    "High performance containment barrier",
    "Optimized logistics & deployment",
    "Standardized QA / QC protocols",
  ];

  const suitableFor =
    templateData?.suitableFor && templateData.suitableFor.length > 0
      ? templateData.suitableFor
      : (templateData?.content?.subsystems || ["Lining Systems", "Leak Detection", "Drainage"]).map(
          (s: string) => ({
            icon: "Droplets",
            label: s,
          }),
        );

  const assistancePhone = templateData?.assistancePhone || "+27 11 794 0974";
  const assistanceEmail = templateData?.assistanceEmail || "sales@geosynthetics.co.za";

  const componentsTitle = templateData?.componentsTitle || "Typical System Components";
  const componentsImage = templateData?.componentsImage || "";
  const componentsDrawingLink = templateData?.componentsDrawingLink || "";
  const componentsCallouts = templateData?.componentsCallouts || [];

  const designTitle = templateData?.designTitle || "Design Considerations";
  const designParagraphs = templateData?.designParagraphs || [];

  const installationTitle = templateData?.installationTitle || "Installation Guidelines";
  const installationParagraphs = templateData?.installationParagraphs || [];

  const qaTitle = templateData?.qaTitle || "QA & Testing";
  const qaItems = templateData?.qaItems || [];

  const productsTitle = templateData?.productsTitle || "Products Used in this Application";
  const downloadsTitle = templateData?.downloadsTitle || "Technical Downloads";
  const downloads = templateData?.downloads || [];

  // ─── Scroll Spy Navigation ──────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const sectionIds = [
      "overview",
      "components",
      "design",
      "installation",
      "qa",
      "products",
      "projects",
      "downloads",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // offset for header + sticky nav

      let currentSection = "overview";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset;
          if (scrollPosition >= top - 20) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 140; // Approx header + sticky nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background relative">
      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section
        className="bg-surface-dark text-white relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.9), rgba(10,10,12,0.55)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-24 relative z-10">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Applications", to: "/applications" },
              { label: title },
            ]}
            variant="primary-bold"
          />

          <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 leading-relaxed pl-4 border-l-2 border-primary">
            {description}
          </p>

          {/* Highlights */}
          {heroHighlights.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-white/10 pt-6">
              {heroHighlights.map((hl: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <IconRenderer name={hl.icon} className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-white/95 leading-tight">
                    {hl.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide text-white border-0 cursor-pointer"
              onClick={() => {
                document
                  .getElementById("quote")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Request A Quote
            </Button>
            {downloadGuideUrl && (
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white hover:text-surface-dark uppercase font-bold tracking-wide cursor-pointer"
              >
                <a href={downloadGuideUrl} target="_blank" rel="noopener noreferrer">
                  <Icons.Download className="h-4 w-4 mr-2" />
                  {downloadGuideLabel}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Sticky Tab Navigation ─────────────────────────────────────────────── */}
      <div className="sticky top-[70px] z-40 bg-surface border-b border-border shadow-sm">
        <div className="container-page">
          <ul className="flex items-center overflow-x-auto no-scrollbar gap-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "components", label: "System Components", show: !!componentsImage },
              { id: "design", label: "Design Considerations", show: designParagraphs.length > 0 },
              {
                id: "installation",
                label: "Installation Guidelines",
                show: installationParagraphs.length > 0,
              },
              { id: "qa", label: "QA & Testing", show: qaItems.length > 0 },
              { id: "products", label: "Products Used", show: linkedProducts.length > 0 },
              { id: "projects", label: "Case Studies", show: caseStudies.length > 0 },
              { id: "downloads", label: "Downloads", show: downloads.length > 0 },
            ].map((link) => {
              if (link.show === false) return null;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={cn(
                      "block py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap",
                      activeSection === link.id
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-primary hover:border-primary",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ─── Main Content Split Layout ─────────────────────────────────────────── */}
      <div className="container-page py-16 grid lg:grid-cols-12 gap-16">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-20">
          {/* Section: Overview */}
          <section id="overview" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              System Overview
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4">
              {overviewParagraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          {/* Section: System Components */}
          {componentsImage && (
            <section id="components" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {componentsTitle}
              </h2>
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="border border-border rounded-xl p-4 bg-surface/30">
                    <img
                      src={componentsImage}
                      alt={componentsTitle}
                      className="w-full h-auto rounded-lg object-contain bg-white mx-auto"
                    />
                  </div>
                  {componentsDrawingLink && (
                    <Button
                      asChild
                      variant="outline"
                      className="uppercase font-bold tracking-wider text-xs cursor-pointer"
                    >
                      <a href={componentsDrawingLink} target="_blank" rel="noopener noreferrer">
                        View Detailed Drawing <Icons.ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Components Legend
                  </h3>
                  <div className="space-y-4">
                    {componentsCallouts.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="h-6 w-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {item.number}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-tight text-foreground leading-tight">
                            {item.label}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section: Design Considerations */}
          {designParagraphs.length > 0 && (
            <section id="design" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {designTitle}
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4">
                {designParagraphs.map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Section: Installation Guidelines */}
          {installationParagraphs.length > 0 && (
            <section id="installation" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {installationTitle}
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4">
                {installationParagraphs.map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Section: QA & Testing */}
          {qaItems.length > 0 && (
            <section id="qa" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {qaTitle}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {qaItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-border bg-card p-5 rounded-lg hover:border-primary transition"
                  >
                    <IconRenderer name={item.icon} className="h-6 w-6 text-primary mb-3" />
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Products Used */}
          {linkedProducts.length > 0 && (
            <section id="products" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {productsTitle}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {linkedProducts.map((prod: any, idx: number) => (
                  <Link
                    key={idx}
                    to="/products/$category/$family"
                    params={{
                      category: prod.product_categories?.slug || "geomembranes",
                      family: prod.slug,
                    }}
                    className="group border border-border bg-card rounded-lg overflow-hidden flex flex-col hover:border-primary transition"
                  >
                    <div className="aspect-square bg-surface-dark overflow-hidden relative">
                      <img
                        src={
                          prod.image_url ||
                          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wide text-foreground group-hover:text-primary transition line-clamp-2 mb-1">
                          {prod.name}
                        </h4>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none">
                          {prod.thickness_mm
                            ? `${prod.thickness_mm}mm thickness`
                            : prod.short_description || ""}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition mt-4 inline-flex items-center gap-1">
                        View Product <Icons.ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Section: Case Studies */}
          {caseStudies.length > 0 && (
            <section id="projects" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                Featured Case Studies
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {caseStudies.slice(0, 4).map((cs: any, idx: number) => (
                  <Link
                    key={idx}
                    to="/projects/$slug"
                    params={{ slug: cs.slug }}
                    className="group flex flex-col rounded border border-border bg-card overflow-hidden hover:border-foreground transition duration-200"
                  >
                    <div
                      className="aspect-[16/10] relative overflow-hidden bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${cs.hero_image_url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border-0">
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
                        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-150 leading-tight mb-2">
                          {cs.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {cs.summary}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary mt-4 flex items-center gap-1">
                        View Case Study <Icons.ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Section: Downloads */}
          {downloads.length > 0 && (
            <section id="downloads" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {downloadsTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {downloads.map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border border-border bg-surface rounded-lg p-5 hover:border-primary transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-white transition shrink-0">
                        <Icons.FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-wide text-foreground group-hover:text-primary transition">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                          Technical specification sheet (PDF)
                        </div>
                      </div>
                    </div>
                    <Icons.Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column - Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="space-y-6 sticky top-[160px]">
            {/* Sidebar element: Key Benefits */}
            {keyBenefits.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                  <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {keyBenefits.map((kb: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                    >
                      <Icons.CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{kb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sidebar element: Suitable For */}
            {suitableFor.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                  <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
                  Suitable For
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {suitableFor.map((sf: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-surface/50 hover:border-primary/50 transition text-center min-h-[90px] shadow-sm"
                    >
                      <IconRenderer name={sf.icon} className="h-5 w-5 text-primary mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-foreground">
                        {sf.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar element: Need Assistance */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
                Need Assistance?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our team can help you design and specify the right containment and engineering cover
                solutions.
              </p>
              <div className="space-y-3 pt-1 border-t border-border/60">
                {assistancePhone && (
                  <a
                    href={`tel:${assistancePhone}`}
                    className="flex items-center gap-2.5 text-xs font-semibold text-foreground hover:text-primary transition"
                  >
                    <Icons.Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>{assistancePhone}</span>
                  </a>
                )}
                {assistanceEmail && (
                  <a
                    href={`mailto:${assistanceEmail}`}
                    className="flex items-center gap-2.5 text-xs font-semibold text-foreground hover:text-primary transition truncate"
                  >
                    <Icons.Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{assistanceEmail}</span>
                  </a>
                )}
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold uppercase tracking-wider h-9 mt-2 cursor-pointer"
              >
                <a
                  href="#quote"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Contact Our Team <Icons.ChevronRight className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            {/* Sidebar element: Featured Case Study */}
            {featuredCaseStudy && (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div
                  className="aspect-[16/10] relative overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${featuredCaseStudy.hero_image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                      {featuredCaseStudy.project_year || "FEATURED CASE STUDY"}
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-tight text-white line-clamp-1 mt-0.5">
                      {featuredCaseStudy.title}
                    </h4>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 bg-card justify-between">
                  <div className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {featuredCaseStudy.summary}
                  </div>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: featuredCaseStudy.slug }}
                    className="text-xs font-bold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    View Case Study <Icons.ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Quote Form box */}
            <div id="quote" className="scroll-mt-32">
              <QuoteCard
                contextLabel={title}
                heading="Request Support"
                description="Describe your application requirements and our engineers will specify the right geosynthetics system."
              />
            </div>
          </div>
        </aside>
      </div>

      <PartnerStrip />
      <BoqCtaBand />
    </div>
  );
}
