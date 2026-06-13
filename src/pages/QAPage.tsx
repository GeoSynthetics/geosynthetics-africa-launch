import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/quality-assurance.index";
import * as LucideIcons from "lucide-react";
import {
  ShieldCheck,
  FileCheck,
  Microscope,
  BadgeCheck,
  Wrench,
  ChevronRight,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { cn } from "@/lib/utils";

const getIconComp = (name: string | undefined): React.ComponentType<any> => {
  if (!name) return FileCheck;
  return (LucideIcons as any)[name] || FileCheck;
};

// Static brand content — these are core GSA brand pillars that don't change
const QA_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Material Verification",
    desc: "We verify every product against manufacturer specifications before installation. Mill certificates, batch numbers, and certificates of conformance are cross-referenced.",
  },
  {
    icon: Wrench,
    title: "Installation Procedures",
    desc: "Our team follows IAGI-certified installation procedures for every project — from subgrade preparation through final sign-off.",
  },
  {
    icon: Microscope,
    title: "On-Site Quality Control",
    desc: "We conduct field inspections, pressure tests, and performance checks at every stage of installation.",
  },
  {
    icon: FileCheck,
    title: "Documentation & Compliance",
    desc: "All installations are backed by full QA documentation, traceability records, and project handover certification packages.",
  },
  {
    icon: BadgeCheck,
    title: "Certificates",
    desc: "Project handover includes a complete certification package — weld logs, test results, as-built plans, and material certificates.",
  },
  {
    icon: Award,
    title: "IAGI Standards",
    desc: "As IAGI members (one of only 5 in Africa), our installation practices align with globally recognised international standards.",
  },
];

export function QAPage() {
  const { qaDocuments = [], landingContent = null } = Route.useLoaderData() || {};
  const landing = (landingContent as any) || {};

  // Custom Hero section
  const heroTitle = landing.heroTitle || "No System Leaves\nSite Unverified.";
  const heroSubtitle = landing.heroSubtitle || "Geosynthetics Africa delivers documented quality assurance and QA/QC for geosynthetics installation across Africa, aligned with IAGI best practice and manufacturer requirements.";
  const heroImage = landing.heroImage || "";
  const heroChecklist = landing.heroChecklist && landing.heroChecklist.length > 0 ? landing.heroChecklist : [
    "Material Verification — every product verified before installation",
    "Installation Procedures — IAGI-certified methods on every project",
    "On-Site Quality Control — field inspections throughout installation",
    "Documentation & Compliance — full traceability and handover dossier",
  ];

  // Custom framework section
  const frameworkTitle = landing.frameworkTitle || "Manufacturer-Aligned Quality Assurance\nfor Geosynthetics Installations Across Africa";
  const frameworkEyebrow = landing.frameworkEyebrow || "Our QA/QC Framework";

  // Custom pillars section
  const pillars = landing.pillars && landing.pillars.length > 0 ? landing.pillars : QA_PILLARS;

  // Custom hero stats
  const heroStats = landing.heroStats && landing.heroStats.length > 0 ? landing.heroStats : [
    { value: "340+", label: "Projects QA'd", accent: true },
    { value: "17", label: "African Countries" },
    { value: "100%", label: "Welds Tested" },
    { value: "IAGI", label: "International Standard" },
  ];

  // Custom IAGI section
  const iagiTitle = landing.iagiTitle || "International Standards.\nAfrican Execution.";
  const iagiDescription = landing.iagiDescription || "Geosynthetics Africa is a recognised IAGI Installer Member, adhering to international best-practice standards for geosynthetic installation quality assurance and project execution across Africa's mining, water, and civil infrastructure sectors.";
  const iagiStats = landing.iagiStats && landing.iagiStats.length > 0 ? landing.iagiStats : [
    { value: "17", label: "African Countries Covered" },
    { value: "100%", label: "QA/QC Performed On All Installations" },
    { value: "340+", label: "Projects Delivered" },
    { value: "One of 5", label: "IAGI Members in Africa" },
  ];

  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section 
        className="relative bg-gradient-to-br from-[#0B0B0C] via-[#161515] to-[#121111] text-white pt-10 pb-14 overflow-hidden border-b border-[#2A2A2A]"
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        {heroImage && <div className="absolute inset-0 bg-black/75 pointer-events-none" />}
        {/* Decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(228,30,43,0.07),_transparent_60%)] pointer-events-none" />

        <div className="container-page relative z-10">
          {/* Breadcrumb */}
          <nav className="text-[10px] font-bold uppercase tracking-widest text-white/55 flex items-center gap-2 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <span className="text-primary">Quality Assurance</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
                <span className="w-6 h-[1.5px] bg-primary" />
                IAGI Member · One of only 5 in Africa
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white mb-5 whitespace-pre-line">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-white/75 leading-relaxed mb-6">
                {heroSubtitle}
              </p>

              {/* QA Checklist */}
              <div className="space-y-2.5 mb-8">
                {heroChecklist.map((item: string) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 uppercase font-bold tracking-wide border-0 cursor-pointer text-white">
                  <Link to="/contacts">Request QA/QC Documentation</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-[1px] bg-white/10 border border-white/10 rounded-lg overflow-hidden">
                {heroStats.map((s: any) => (
                  <div key={s.label} className="bg-[#0D0D0E] p-6 flex flex-col justify-center">
                    <div className={cn("font-display font-black text-3xl leading-none mb-1", s.accent ? "text-primary" : "text-white")}>
                      {s.value}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QA PILLARS GRID ============ */}
      <section className="bg-background border-b border-border">
        <div className="container-page py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              {frameworkEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-foreground whitespace-pre-line">
              {frameworkTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar: any, i: number) => {
              const IconComp = typeof pillar.icon === "string" ? getIconComp(pillar.icon) : pillar.icon;
              return (
                <div key={i} className="rounded border border-border bg-card p-6 hover:border-foreground/30 transition-colors group">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ QA CATEGORY CARDS ============ */}
      <section className="bg-surface/30 border-b border-border">
        <div className="container-page py-16 md:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">QA Documentation</div>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
                QA by Product &amp; System
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                Select a product line or programme to explore the specific quality assurance documentation, standards, and processes we apply.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 font-bold uppercase tracking-wide cursor-pointer">
              <Link to="/contacts">Request Full QA Dossier <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>

          {qaDocuments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qaDocuments.map((doc: any) => {
                const docPillars: any[] = doc.key_pillars || [];
                const firstPillar = docPillars[0];
                const IconComp = firstPillar?.icon ? getIconComp(firstPillar.icon) : FileCheck;

                return (
                  <Link
                    key={doc.id}
                    to="/quality-assurance/$slug"
                    params={{ slug: doc.slug }}
                    className="group flex flex-col border border-border bg-card rounded-lg overflow-hidden hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* Card image / gradient header */}
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#0B0B0C] to-[#1C1917]">
                      {doc.hero_image_url && (
                        <img
                          src={doc.hero_image_url}
                          alt={doc.category_name}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                            <IconComp className="h-4 w-4" />
                          </div>
                          {doc.eyebrow && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary/90 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                              {doc.eyebrow}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                        {doc.category_name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4 line-clamp-3">
                        {doc.short_description}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-primary mt-auto">
                        {doc.cta_label || "View QA Documentation"}
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Fallback — placeholder cards when DB is empty */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "GSE® / Solmax Quality Assurance", slug: "gse-solmax-quality-assurance" },
                { name: "Eurobent® GCL Quality Assurance", slug: "eurobent-gcl-quality-assurance" },
                { name: "Tensar® Geogrids Quality Assurance", slug: "tensar-geogrids-quality-assurance" },
                { name: "Geosynthetics Africa QA Framework", slug: "geosynthetics-africa-quality-assurance" },
                { name: "IAGI Membership", slug: "iagi-membership" },
              ].map((item) => (
                <Link
                  key={item.slug}
                  to="/quality-assurance/$slug"
                  params={{ slug: item.slug }}
                  className="group flex flex-col border border-border bg-card rounded-lg p-6 hover:border-primary transition-all"
                >
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-primary mt-4">
                    View QA <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ IAGI DARK BAND ============ */}
      <section className="bg-foreground text-background py-16 border-t border-[#2A2A2A]">
        <div className="container-page grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-primary" />
              IAGI Member — One of only 5 in Africa
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase leading-none text-white mb-4 whitespace-pre-line">
              {iagiTitle}
            </h2>
            <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-md">
              {iagiDescription}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-white/10 rounded border border-white/5 overflow-hidden">
              {iagiStats.map((s: any) => (
                <div key={s.label} className="bg-foreground p-5 flex flex-col hover:bg-white/5 transition">
                  <div className="font-display font-black text-2xl text-primary leading-none mb-1">{s.value}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-white/60 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BoqCtaBand />
      <PartnerStrip />
    </>
  );
}
