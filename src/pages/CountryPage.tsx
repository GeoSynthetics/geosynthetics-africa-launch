import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Globe,
  Truck,
  ShieldCheck,
  Wrench,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Clock,
  Award,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { GeoGrid } from "@/components/site/shapes";
import type { CountryTemplate } from "@/types/country-template";

export function CountryPage({ data }: { data: any }) {
  const { countryTemplate, linkedProducts = [], caseStudies = [] } = data;
  const template: CountryTemplate = countryTemplate;

  const { open: openQuickQuote } = useQuickQuote();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!template) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Country template not found.</p>
      </div>
    );
  }

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── 1. HERO BANNER ── */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center bg-surface-dark text-surface-dark-foreground overflow-hidden py-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={template.heroImage}
            alt={`${template.country} Geosynthetics Supply`}
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent" />
        </div>

        {/* Dynamic Background Shapes */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
          <GeoGrid className="w-full h-full text-primary" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Regional Coverage", to: "/contacts" },
                { label: template.country },
              ]}
              variant="contacts"
            />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-xs font-semibold tracking-wide">
              <span className="text-base">{template.flag}</span>
              <span>{template.badge || `Pan-African Operations — ${template.country}`}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {template.title}
            </h1>

            {/* Overview Description */}
            <p className="text-base sm:text-lg text-surface-dark-foreground/80 leading-relaxed font-normal max-w-2xl">
              {template.description}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => openQuickQuote()}
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg cursor-pointer"
              >
                Request SADC / Freight Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {template.phone && (
                <a
                  href={`tel:${template.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-center rounded-md border border-surface-dark-foreground/30 px-5 py-3 text-sm font-semibold text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition"
                >
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  Call {template.hubName || template.country} Hub
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. METRICS STRIP ── */}
      <section className="border-y border-border bg-surface py-6 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Freight Transit
                </p>
                <p className="text-sm font-bold text-foreground">
                  {template.transitTime || "2 - 3 Days Dispatch"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Field Crews
                </p>
                <p className="text-sm font-bold text-foreground">
                  {template.masterSeamersCount || "IAGI Master Seamers"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  QA/QC Testing
                </p>
                <p className="text-sm font-bold text-foreground">100% Seam Verification</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Compliance
                </p>
                <p className="text-sm font-bold text-foreground">
                  {(template.complianceStandards && template.complianceStandards[0]) ||
                    "SANS & ASTM"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DETAILED SHOWCASE SECTIONS ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* SECTION A: MATERIAL SUPPLY & LOGISTICS */}
        <section className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Package className="h-4 w-4" />
              Material Supply & Logistics
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {template.supplyTitle || `Geosynthetics Supply in ${template.country}`}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {template.supplyDescription ||
                `We manage container-direct supply and cross-border transport for mining, municipal, and civil infrastructure projects across ${template.country}.`}
            </p>

            {/* Logistics details pills */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {template.logisticsRoutes && (
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Logistics Corridors
                  </h4>
                  <p className="text-sm font-medium text-foreground">{template.logisticsRoutes}</p>
                </div>
              )}
              {template.customsInfo && (
                <div className="p-4 rounded-lg bg-card border border-border">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Customs & Tariff Status
                  </h4>
                  <p className="text-sm font-medium text-foreground">{template.customsInfo}</p>
                </div>
              )}
            </div>

            {/* Supply Bullet Highlights */}
            {template.supplyHighlights && template.supplyHighlights.length > 0 && (
              <div className="space-y-3 pt-2">
                {template.supplyHighlights.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground text-sm">
                        {bullet.title}:{" "}
                      </span>
                      <span className="text-sm text-muted-foreground">{bullet.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
              <img
                src={
                  template.supplyImage ||
                  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                }
                alt={template.supplyCardTitle || "Logistics and Freight Delivery"}
                className="w-full h-72 object-cover"
              />
              <div className="p-6 bg-card space-y-3">
                <h3 className="font-bold text-foreground text-lg">
                  {template.supplyCardTitle || "Container Direct & Local Warehouse Inventory"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.supplyCardDescription ||
                    "Material rolls shipped in heavy-duty protective wrapping, verified with full resin-to-roll laboratory reports."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B: FIELD INSTALLATION & WELDING */}
        <section className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
              <img
                src={
                  template.installationImage ||
                  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80"
                }
                alt={template.installationCardTitle || "Geomembrane Field Welding"}
                className="w-full h-72 object-cover"
              />
              <div className="p-6 bg-card space-y-3">
                <h3 className="font-bold text-foreground text-lg">
                  {template.installationCardTitle || "Dual-Track Wedge & Extrusion Welding Rigs"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.installationCardDescription ||
                    "Deployment of IAGI-certified welding crews with automated dual-track seamers for continuous air channel testing."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Wrench className="h-4 w-4" />
              Field Installation & Contracting
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {template.installationTitle || `Certified Lining Installation in ${template.country}`}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {template.installationDescription ||
                `Our experienced field crews deploy automated hot wedge welders and extrusion guns to ensure fast, leak-free installation across heap leach pads, TSF dams, and reservoirs.`}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Mobilization
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {template.equipmentMobilization || "24 - 48 Hours"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                <Award className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Master Seamers
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {template.masterSeamersCount || "IAGI Certified"}
                  </p>
                </div>
              </div>
            </div>

            {template.installationHighlights && template.installationHighlights.length > 0 && (
              <div className="space-y-3 pt-2">
                {template.installationHighlights.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground text-sm">
                        {bullet.title}:{" "}
                      </span>
                      <span className="text-sm text-muted-foreground">{bullet.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION C: QA/QC TESTING & COMPLIANCE */}
        <section className="bg-surface rounded-2xl border border-border p-8 lg:p-12 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <ShieldCheck className="h-4 w-4" />
              Quality Control & Standards Compliance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {template.qaqcTitle || "Rigorous Field & Laboratory Quality Assurance"}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {template.qaqcDescription ||
                "Every seam undergoes non-destructive pressure and vacuum testing alongside daily destructive field tensiometer testing."}
            </p>
          </div>

          {/* Compliance Badges */}
          {template.complianceStandards && template.complianceStandards.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {template.complianceStandards.map((std, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md bg-card border border-border text-xs font-bold text-foreground uppercase tracking-wider shadow-xs"
                >
                  ✓ {std}
                </span>
              ))}
            </div>
          )}

          {template.qaqcHighlights && template.qaqcHighlights.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
              {template.qaqcHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{highlight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 4. FEATURED PRODUCTS IN THIS COUNTRY ── */}
        {linkedProducts && linkedProducts.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Featured Products Offered in {template.country}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Container-direct and warehouse inventory available for immediate dispatch.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                View Full Product Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedProducts.map((prod: any) => (
                <div
                  key={prod.id || prod.slug}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-200 shadow-xs flex flex-col"
                >
                  <div className="h-44 overflow-hidden bg-muted relative">
                    <img
                      src={
                        prod.image ||
                        prod.hero_image_url ||
                        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80"
                      }
                      alt={prod.name || prod.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition">
                        {prod.name || prod.label}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {prod.short_description ||
                          prod.description ||
                          "High-performance geosynthetic lining system."}
                      </p>
                    </div>
                    <Link
                      to="/catalogue/$slug"
                      params={{ slug: prod.slug }}
                      className="inline-flex items-center justify-between text-xs font-bold text-primary pt-2 border-t border-border group-hover:underline"
                    >
                      <span>Explore Technical Specs</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. FEATURED PROJECTS IN THIS COUNTRY / SADC ── */}
        {caseStudies && caseStudies.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Featured Projects & Case Studies in {template.country}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Proven containment, tailings dam, and infrastructure installations across Southern
                  and Pan-Africa.
                </p>
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                View All Case Studies <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((study: any) => (
                <Link
                  key={study.id || study.slug}
                  to="/projects/$slug"
                  params={{ slug: study.slug }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition shadow-xs flex flex-col"
                >
                  <div className="h-48 overflow-hidden bg-muted relative">
                    <img
                      src={
                        study.hero_image_url ||
                        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80"
                      }
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {study.country && (
                      <span className="absolute top-3 right-3 bg-surface-dark/90 text-surface-dark-foreground text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {study.country}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-foreground text-base group-hover:text-primary transition line-clamp-2">
                        {study.title}
                      </h3>
                      {study.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          {study.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-2">
                        {study.summary}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-xs font-bold text-primary pt-2 border-t border-border gap-1">
                      <span>Read Project Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 6. REGIONAL OFFICE & LOGISTICS HUB ── */}
        <section className="bg-surface-dark text-surface-dark-foreground rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <MapPin className="h-4 w-4" />
                {template.hubName || `${template.country} Regional Hub`}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {template.officeTitle || `${template.country} Operations & Logistics Hub`}
              </h2>

              <div className="space-y-2.5 text-sm text-surface-dark-foreground/80 pt-2">
                {template.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{template.address}</span>
                  </div>
                )}
                {template.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <a
                      href={`tel:${template.phone.replace(/\s+/g, "")}`}
                      className="hover:text-primary transition"
                    >
                      {template.phone}
                    </a>
                  </div>
                )}
                {template.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <a href={`mailto:${template.email}`} className="hover:text-primary transition">
                      {template.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-4">
              <Button
                size="lg"
                onClick={() => openQuickQuote()}
                className="w-full sm:w-auto bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg cursor-pointer"
              >
                Contact {template.country} Hub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-surface-dark-foreground/60 text-left lg:text-right">
                Immediate response for BOQ pricing, roll availability & freight lead times.
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. LOCAL FAQS ACCORDION ── */}
        {template.faqs && template.faqs.length > 0 && (
          <section className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Frequently Asked Questions — {template.country}
              </h2>
              <p className="text-xs text-muted-foreground">
                Logistics, import clearance, and technical specifications for local projects.
              </p>
            </div>

            <div className="space-y-3">
              {template.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-xl bg-card overflow-hidden transition"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-foreground hover:text-primary transition"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ── 8. PARTNER LOGOS STRIP ── */}
      <PartnerStrip />

      {/* ── 9. BOTTOM BOQ CTA BAND ── */}
      <BoqCtaBand />
    </div>
  );
}
