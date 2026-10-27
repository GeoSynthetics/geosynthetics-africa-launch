import { productImage } from "@/lib/product-imagery";
import { useState, useEffect, useMemo } from "react";
import { publicBusinessCopy } from "@/lib/public-business-copy";
import { Link } from "@tanstack/react-router";
import {
  Globe,
  Truck,
  ShieldCheck,
  Wrench,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Clock,
  Award,
  Package,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { GeoGrid } from "@/components/site/shapes";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import type { CountryTemplate } from "@/types/country-template";
import { useCountryTemplate } from "@/hooks/use-country-templates";
import { fetchProductsByIdsOrSlugs } from "@/lib/products-query";
import { countryProfileFor } from "@/data/country-profiles";
import { PRODUCT_FAMILIES } from "@/lib/product-families";
import { applicationPath } from "@/data/material-selection";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";

/** Our own site photos, used wherever a country page would show a stock image. */
const OWN_PHOTOS = {
  hero: "/api/storage/media-center/Geosynthetics_Africa_Installtion_-_TSF_HDPE_Lining_Project_West_Africa_04928623-815e-43cc-8bdc-949985b70f28.webp",
  installation:
    "/api/storage/media-center/Geosynthetics_Africa_-_TSF_HDPE_Liner_Installtion_Gold_Mine_West_Africa_c304ffa8-7262-4403-9e3d-4772e986fa80.webp",
  project:
    "/api/storage/media-center/GSE-HDPE-LINER-SUPPLY-TO-TANZANIA-GEOSYNTHETICS-AFRICA-GEOMEMBRANES_7d14427f-3dab-4433-b992-090e9594f3c6.webp",
};

/** Replaces stock-library images (stored in older CMS entries) with our own photos. */
function ownPhoto(url: string | null | undefined, fallback: string): string {
  if (!url || /images\.unsplash\.com|unsplash\.com\/photo/i.test(url)) return fallback;
  return url;
}

function applicationLabel(slug: string): string {
  return APPLICATION_DIRECTORY.find((app) => app.slug === slug)?.label || slug;
}

export function CountryPage({ data }: { data: any }) {
  const {
    countryTemplate: initialTemplate,
    linkedProducts: initialLinkedProducts = [],
    caseStudies = [],
  } = data;
  const rawTemplate = useCountryTemplate(initialTemplate, initialTemplate?.slug);
  const template: CountryTemplate | null = useMemo(
    () => publicBusinessCopy(rawTemplate),
    [rawTemplate],
  );
  const [linkedProducts, setLinkedProducts] = useState<any[]>(initialLinkedProducts);
  const hasLocalProject = Boolean(
    template?.country &&
    caseStudies.some((cs: any) =>
      String(cs?.country || "")
        .toLowerCase()
        .includes(template.country.toLowerCase()),
    ),
  );

  useEffect(() => {
    let isMounted = true;
    async function loadFeaturedProducts() {
      if (!template?.featuredProductIds || template.featuredProductIds.length === 0) {
        setLinkedProducts([]);
        return;
      }

      try {
        const matched = await fetchProductsByIdsOrSlugs(template.featuredProductIds);
        if (isMounted) {
          if (matched.length > 0) {
            setLinkedProducts(matched);
          } else if (initialLinkedProducts && initialLinkedProducts.length > 0) {
            setLinkedProducts(initialLinkedProducts);
          }
        }
      } catch (err) {
        console.error("Error loading products for country template:", err);
      }
    }

    if (template?.featuredProductIds) {
      loadFeaturedProducts();
    }
  }, [template?.featuredProductIds, initialLinkedProducts]);

  const { open: openQuickQuote } = useQuickQuote();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!template) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Country template not found.</p>
      </div>
    );
  }

  const profile = countryProfileFor(template.slug, template.country);

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
            src={ownPhoto(productImage(template.heroImage), OWN_PHOTOS.hero)}
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
                Request Project Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
                <p className="text-sm font-bold text-foreground">Documented Installation QC</p>
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
        {/* ── PRIORITY INDUSTRIES & APPLICATIONS IN THIS COUNTRY ── */}
        {profile && profile.industries.length > 0 && (
          <section className="space-y-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Globe className="h-4 w-4" />
                What We Do in {template.country}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Geosynthetics for {template.country}&apos;s Key Industries
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Supply, installation and QA/QC for the projects that matter most in{" "}
                {template.country}. Pick your industry to see the systems we build.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {profile.industries.map((industry) => (
                <div
                  key={industry.label}
                  className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-xs"
                >
                  <h3 className="font-bold text-foreground">{industry.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {industry.summary}
                  </p>
                  <ul className="mt-4 space-y-1.5 flex-1">
                    {industry.applications.map((slug) => (
                      <li key={slug}>
                        <Link
                          to={applicationPath(slug) as any}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition"
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                          {applicationLabel(slug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {industry.industrySlug && (
                    <Link
                      to="/industries/$slug"
                      params={{ slug: industry.industrySlug }}
                      className="mt-4 pt-3 border-t border-border text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Explore {industry.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EVERY PRODUCT FAMILY ── */}
        <section className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Package className="h-4 w-4" />
              Full Product Range
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Every Product Family, Supplied and Installed in {template.country}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PRODUCT_FAMILIES.map((family) => (
              <Link
                key={family.slug}
                to="/products/$category"
                params={{ category: family.slug }}
                className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary transition"
              >
                {family.label}
                <ArrowRight className="h-4 w-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── SITE CONDITIONS ── */}
        {profile && (
          <section className="rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Wrench className="h-4 w-4" />
              Site Conditions We Plan For
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Engineering for {template.country}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {profile.conditions.map((condition) => (
                <li
                  key={condition}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

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
                src={ownPhoto(
                  productImage(template.supplyImage),
                  "/images/geotextile-product-supply.webp",
                )}
                alt={template.supplyCardTitle || "Geotextile material supply"}
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
                src={ownPhoto(template.installationImage, OWN_PHOTOS.installation)}
                alt={template.installationCardTitle || "Geomembrane Field Welding"}
                className="w-full h-72 object-cover"
              />
              <div className="p-6 bg-card space-y-3">
                <h3 className="font-bold text-foreground text-lg">
                  {template.installationCardTitle || "Dual-Track Wedge & Extrusion Welding Rigs"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.installationCardDescription ||
                    "Mobilisation of trained welding technicians with equipment and seam-test methods matched to the approved installation scope."}
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
              {template.installationTitle ||
                `Specialist Lining Installation in ${template.country}`}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {template.installationDescription ||
                `Our field crews coordinate deployment, welding, seam testing and repair records against the approved specification and inspection plan for the agreed lining scope.`}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Mobilization
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {template.equipmentMobilization || "Planned per project"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                <Award className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">
                    Installation Capability
                  </h4>
                  <p className="text-sm font-bold text-foreground">
                    {template.masterSeamersCount || "Specialist installation crews"}
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
                      src={ownPhoto(
                        prod.image_url || prod.image || prod.hero_image_url,
                        OWN_PHOTOS.project,
                      )}
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
                  {hasLocalProject
                    ? `Projects & Case Studies in ${template.country}`
                    : `Related Projects Near ${template.country}`}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasLocalProject
                    ? `Supply, installation and QA/QC work delivered in ${template.country} and the wider region.`
                    : `Comparable supply, installation and QA/QC work from the same region and industries.`}
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
                      src={ownPhoto(study.hero_image_url, OWN_PHOTOS.project)}
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

        {/* ── 6. ONE CONTRACT: MANUFACTURING, SUPPLY, QA/QC-CONTROLLED INSTALLATION ── */}
        <section className="bg-surface-dark text-surface-dark-foreground rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  One Contract · {template.country}
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  Manufacturing. Supply. QA/QC-Controlled Installation.
                </h2>
                <p className="text-sm sm:text-base text-surface-dark-foreground/80 leading-relaxed max-w-2xl">
                  One contract and one accountable team for your {template.country} project, from
                  the factory floor to the signed handover dossier. No gaps between supplier,
                  fabricator and installer.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col items-stretch lg:items-end gap-3">
                <Button
                  size="lg"
                  onClick={() => openQuickQuote()}
                  className="w-full lg:w-auto bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg cursor-pointer"
                >
                  Request Project Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-surface-dark-foreground/60 text-left lg:text-right">
                  Reply within 24 hours · English, French or Portuguese
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-px rounded-xl overflow-hidden bg-surface-dark-foreground/10">
              {[
                {
                  icon: Package,
                  step: "01",
                  title: "Manufacturing",
                  text: "Liners, floating covers and panels fabricated in our own facility, so most seams are made and tested before they reach site.",
                },
                {
                  icon: Truck,
                  step: "02",
                  title: "Supply",
                  text: `Certified materials from Solmax GSE, Tensar and our own ranges, with freight, clearance and duties planned to your ${template.country} site.`,
                },
                {
                  icon: Wrench,
                  step: "03",
                  title: "QA/QC-Controlled Installation",
                  text: "Our own crews, trial welds every shift, 100% non-destructive seam testing and a full as-built and test dossier at handover.",
                },
              ].map(({ icon: Icon, step, title, text }) => (
                <div key={title} className="bg-surface-dark p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-xs font-bold tracking-widest text-surface-dark-foreground/40">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{title}</h3>
                  <p className="text-sm text-surface-dark-foreground/75 leading-relaxed">{text}</p>
                </div>
              ))}
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

            <FAQPageSchema items={template.faqs} />
            <div className="space-y-3">
              {template.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-border rounded-xl bg-card overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`country-faq-${idx}`}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-foreground hover:text-primary transition"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {/* Always rendered (hidden when closed) so crawlers can read every answer */}
                    <div
                      id={`country-faq-${idx}`}
                      hidden={!isOpen}
                      className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3"
                    >
                      {faq.answer}
                    </div>
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
