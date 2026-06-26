import { useMemo } from "react";
import { Link, useLoaderData } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface CapabilityItem {
  icon: string;
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_CAPABILITIES: CapabilityItem[] = [
  {
    icon: "Truck",
    title: "HDPE & LLDPE Lining",
    description: "Precision welding and installation of geomembranes for containment systems.",
  },
  {
    icon: "Grid3x3",
    title: "Geotextile Cushions & Filters",
    description: "Non-woven and woven geotextile deployment for protection and filtration.",
  },
  {
    icon: "Sheet",
    title: "GCL Barrier Systems",
    description: "Installing Geosynthetic Clay Liners as high-performance composite barriers.",
  },
  {
    icon: "Grid2x2",
    title: "Geogrid Soil Reinforcement",
    description: "Basal and pavement reinforcement using biaxial/uniaxial geogrids.",
  },
  {
    icon: "Hexagon",
    title: "Geocell Slope Stabilization",
    description: "Cellular confinement systems for erosion control and load support.",
  },
  {
    icon: "ShieldCheck",
    title: "QA/QC Non-Destructive Testing",
    description: "Vacuum box, air-pressure, and spark testing of welded seams.",
  },
  {
    icon: "ClipboardCheck",
    title: "Destructive Weld Testing",
    description: "Tensiometer peel and shear testing of liner welds to SANS 1526.",
  },
  {
    icon: "Ship",
    title: "Logistics & Border Clearance",
    description: "Cross-border delivery management with SADC Certificates of Origin.",
  },
  {
    icon: "Boxes",
    title: "Logistics Container Optimization",
    description: "Maximizing transport efficiency with customized packing plans.",
  },
  {
    icon: "PencilRuler",
    title: "Engineering Design Support",
    description: "CAD detailing and value-engineering optimization for bill of quantities (BOQ).",
  },
  {
    icon: "HardHat",
    title: "On-Site Installation Supervision",
    description: "Certified QA/QC technicians managing local subcontractor performance.",
  },
  {
    icon: "FileText",
    title: "CQA Certification Reporting",
    description: "Comprehensive handover packages compiling all test results and panel layouts.",
  },
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "Do you supply and install, or can we purchase materials only?",
    answer:
      "We offer complete flexibility. We can supply materials directly to your site, provide installation services with our certified crews, or deliver a fully integrated supply-and-install package with full system certification.",
  },
  {
    question: "What international standards do your installation crews follow?",
    answer:
      "Our installation teams are trained and certified. We adhere to GRI-GM13/17 standards for geomembranes and perform QA/QC testing in accordance with ASTM and SANS 1526 requirements.",
  },
  {
    question: "Can you issue SADC Certificates of Origin for cross-border shipments?",
    answer:
      "Yes. As a registered exporter, we handle all customs clearance, HS-code classification, and provide SADC and AfCFTA Certificates of Origin to minimize duties for client projects across Africa.",
  },
  {
    question: "What quality documentation do we receive at project completion?",
    answer:
      "We provide a comprehensive Construction Quality Assurance (CQA) handover package. This includes panel layout drawings, seam weld test logs (destructive and non-destructive), material data sheets, and official warranty certificates.",
  },
];

const WHY_WORK_WITH_US = [
  {
    title: "Single-Point Accountability",
    description:
      "We eliminate fingers-pointing between manufacturer, logistics provider, and installer. We own the entire chain.",
  },
  {
    title: "100% QA/QC Traceability",
    description:
      "From resin to roll to welded seam, we track and document everything. You receive complete CQA packages.",
  },
  {
    title: "Pan-African Compliance",
    description:
      "We clear customs smoothly, issue SADC Certificates of Origin, and comply with local content rules.",
  },
  {
    title: "Proven Under Pressure",
    description:
      "Our containment systems are deployed in major mines and infrastructure projects across the continent.",
  },
];

export function ServicesPage() {
  const { templates, hierarchy } = useLoaderData({ from: "/services/" }) as {
    templates: Record<string, any>;
    hierarchy: any;
  };

  const landing = templates?.["__landing"] || {};
  const heroTitle = landing.landingTitle || "One Partner. Full Accountability.";
  const heroDescription =
    landing.landingSubtitle ||
    "From design through certification, our integrated services ensure system performance — not just material delivery.";
  const heroImage =
    landing.landingHeroImage ||
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80";

  const capabilitiesTitle =
    landing.capabilitiesTitle || "Our Logistics & Installation Capabilities";
  const capabilitiesList: CapabilityItem[] =
    landing.capabilities?.length > 0 ? landing.capabilities : DEFAULT_CAPABILITIES;
  const faqsList: FaqItem[] = landing.faqs?.length > 0 ? landing.faqs : DEFAULT_FAQS;

  const ctaTitle = landing.ctaTitle || "Need a custom supply, installation, or logistics package?";
  const ctaButtonText = landing.ctaButtonText || "Contact Our Experts";
  const ctaButtonUrl = landing.ctaButtonUrl || "/contacts";

  const servicesItems = useMemo(() => {
    if (hierarchy?.items && hierarchy.items.length > 0) {
      return hierarchy.items;
    }
    // Fallback if hierarchy is not present
    return Object.entries(templates || {})
      .filter(([key]) => key !== "__landing")
      .map(([slug, data]: [string, any]) => ({
        id: slug,
        slug,
        label: data.title || slug,
        icon: "Layers",
      }));
  }, [hierarchy, templates]);

  const serviceDetails = (slug: string, fallbackLabel: string) => {
    const t = templates?.[slug] || {};
    return {
      title: t.title || fallbackLabel,
      description:
        t.description ||
        "Professional supply and quality-controlled installation services across Africa.",
    };
  };

  const resolveIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    if (IconComp)
      return (
        <IconComp className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
      );
    return <Icons.CheckCircle2 className="h-6 w-6 text-primary" />;
  };

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={heroTitle}
        description={heroDescription}
        image={heroImage}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider cursor-pointer border-0"
        >
          <Link to="/contacts">Speak to Technical Team</Link>
        </Button>
      </PageHero>

      {/* ── Services Grid ── */}
      <section className="bg-background border-b border-border">
        <div className="container-page py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/15 px-3 py-1.5 rounded-full">
              Specialized Execution
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground">
              Our Specialized Services
            </h2>
            <div className="h-1.5 w-20 bg-primary mx-auto mt-4 rounded-full" />
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              From high-integrity geomembrane welding to modular concrete channel lining, we manage
              procurement, logistics, and SANS-compliant installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesItems.map((s: any) => {
              const details = serviceDetails(s.slug || s.id, s.label);
              return (
                <Link
                  key={s.slug || s.id}
                  to="/$slug"
                  params={{ slug: s.slug || s.id }}
                  className="group relative rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-xl" />
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                      {resolveIcon(s.icon || "Layers")}
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-foreground">
                      {details.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {details.description}
                    </p>
                  </div>
                  <div className="mt-6 text-primary text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 group-hover:text-primary-hover transition-colors">
                    Explore Service{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="bg-background border-b border-border">
        <div className="container-page py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground">
              {capabilitiesTitle}
            </h2>
            <div className="h-1.5 w-20 bg-primary mx-auto mt-4 rounded-full" />
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              We provide full-spectrum engineering, supply chain, and quality control support across
              sub-Saharan Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilitiesList.map((c, i) => (
              <div
                key={i}
                className="group relative rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-xl" />
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                    {resolveIcon(c.icon)}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Work With Us (Typographic, Sleek Dark-ish Theme) ── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/15 px-3 py-1.5 rounded-full">
                Single-Contract Guarantee
              </span>
              <h2 className="mt-6 font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground leading-tight">
                Why work with us?
              </h2>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
                Geosynthetics Africa manages the entire containment system workflow. We take full
                responsibility for materials specification, import clearance, site delivery, and
                precision installation.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="border-border hover:border-primary/50 hover:bg-transparent font-bold uppercase tracking-wider text-xs gap-2 cursor-pointer"
                >
                  <Link to="/about">
                    About Our Approach <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {WHY_WORK_WITH_US.map((item, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-display font-bold uppercase text-sm tracking-wider text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Accordion FAQs ── */}
      <section className="bg-background py-16 md:py-24 border-t border-border">
        <div className="container-page max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Got questions about our African delivery network and installation processes?
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqsList.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-lg bg-card px-6 py-2 transition hover:border-muted-foreground/30"
              >
                <AccordionTrigger className="text-left font-display font-bold uppercase text-sm md:text-base tracking-wide hover:no-underline hover:text-primary transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA Banner Box (Premium Earthy Orange style) ── */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="container-page relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight leading-tight">
              {ctaTitle}
            </h2>
            <p className="mt-2 text-sm md:text-base text-white/80 max-w-xl">
              Tell us your project specifications, and we will tailor a single-contract solution
              covering supply, logistics, and SANS-compliant QA/QC installation.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-neutral-100 text-primary font-bold uppercase tracking-wider cursor-pointer border-0 shrink-0 shadow-lg"
          >
            <Link to={ctaButtonUrl}>{ctaButtonText}</Link>
          </Button>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
