import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Route } from "@/routes/services.$slug";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

// Interface Definitions for Type Safety
interface BulletItem {
  title: string;
  description?: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface DownloadItem {
  label: string;
  url: string;
}

// Fallback Content Map based on Slug
const FALLBACK_HEROES: Record<string, string> = {
  supply: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1920&q=80",
  installation: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
  "qa-qc": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80",
  "design-support": "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
  logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
  "after-sales": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
};

const DEFAULT_HERO = "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80";

export function ServicePage({ data }: { data?: any } = {}) {
  const loaderData = data ? data : Route.useLoaderData();
  const { service, templateData, linkedProducts = [] } = loaderData;

  // General details
  const title = templateData?.title || service.label;
  const description =
    templateData?.description ||
    "High-performance geosynthetic solutions for African environmental, civil, and mining projects.";
  const heroImage = templateData?.heroImage || FALLBACK_HEROES[service.slug] || DEFAULT_HERO;
  const badgeText = templateData?.badge || `Geosynthetics Africa ${service.label}`;

  // Left Column Content & Fallbacks
  const overviewParagraphs =
    templateData?.overviewParagraphs && templateData.overviewParagraphs.length > 0
      ? templateData.overviewParagraphs
      : [description];

  const whyChooseTitle = templateData?.whyChooseTitle || "Why Choose Geosynthetics Africa?";
  const whyChooseItems: BulletItem[] =
    templateData?.whyChoose && templateData.whyChoose.length > 0
      ? templateData.whyChoose
      : [
          {
            title: "Direct Manufacturer Sourcing",
            description: "No distributor markup. Container-direct supply from global brands.",
          },
          {
            title: "SANS-Compliant Operations",
            description: "Full quality control reports matching regional regulatory frameworks.",
          },
          {
            title: "Single-Point Accountability",
            description: "Procurement, logistics, and installation managed under one contract.",
          },
        ];

  const whatWeDeliverTitle = templateData?.whatWeDeliverTitle || "What We Deliver — At Speed";
  const whatWeDeliverItems: BulletItem[] =
    templateData?.whatWeDeliver && templateData.whatWeDeliver.length > 0
      ? templateData.whatWeDeliver
      : [
          {
            title: "Resin-to-Roll Traceability",
            description: "Complete documentation, laboratory tests, and roll data sheets.",
          },
          {
            title: "Custom Seam Layout Maps",
            description: "Pre-installation design and post-handover as-built seaming layout plans.",
          },
          {
            title: "Comprehensive QA Test Logs",
            description: "Vacuum box, air pressure, and destructive tensiometer test records.",
          },
        ];

  const coverageTitle = templateData?.coverageTitle || "Pan-African Coverage & Stock Hubs";
  const coverageText =
    templateData?.coverageText ||
    "We maintain material stockpiles and logistics corridors to serve projects in remote mining and infrastructure centers across the continent. We manage the entire border clearance workflow, ensuring readiness upon arrival.";
  const coverageBullets =
    templateData?.coverageBullets && templateData.coverageBullets.length > 0
      ? templateData.coverageBullets
      : [
          "Core distribution yards in South Africa for regional dispatch",
          "SADC Certificates of Origin issued to minimize import duties",
          "Pre-cleared border files to eliminate customs delays",
        ];
  const coverageImage =
    templateData?.coverageImage ||
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80";
  const coverageCaption =
    templateData?.coverageCaption || "Consignment flatbed shipping for remote African sites.";

  // Right Column Sidebar Content & Fallbacks
  const sidebarImage = templateData?.sidebarImage || FALLBACK_HEROES[service.slug] || DEFAULT_HERO;
  const sidebarCaption =
    templateData?.sidebarCaption || `${service.label} operations in sub-Saharan Africa.`;

  const directModelTitle =
    templateData?.directModelTitle || "Direct Model. Direct Support. No Distributors.";
  const directModelText =
    templateData?.directModelText ||
    "We keep the communication chain short. You work directly with the logistics and technical team executing your project.";
  const directModelItems: BulletItem[] =
    templateData?.directModelItems && templateData.directModelItems.length > 0
      ? templateData.directModelItems
      : [
          {
            title: "Direct Contact",
            description: "Access to the logistics manager and site engineer directly.",
          },
          {
            title: "Transparent Pricing",
            description: "No distributor markup. Exact manufacturer costing.",
          },
        ];

  const packagingTitle = templateData?.packagingTitle || "Packaging & Transport Optimization";
  const packagingText =
    templateData?.packagingText ||
    "We adjust packing methods to ensure zero damage during long-haul transit to remote locations:";
  const packagingItems: string[] =
    templateData?.packagingItems && templateData.packagingItems.length > 0
      ? templateData.packagingItems
      : [
          "Heavy-duty end caps to protect roll cores from impact",
          "Extra-wrap UV protection layer for outdoor seaport storage",
          "Container stuffing blueprints (20' / 40' / HC) to optimize volume",
        ];

  const afcftaTitle = templateData?.afcftaTitle || "AfCFTA & SADC: Smarter Cross-Border Moves";
  const afcftaText =
    templateData?.afcftaText ||
    "We provide complete trade support to avoid project delays and reduce import tax burdens:";
  const afcftaItems: string[] =
    templateData?.afcftaItems && templateData.afcftaItems.length > 0
      ? templateData.afcftaItems
      : [
          "Registered exporter SADC Certificates of Origin",
          "HS-code alignment on commercial invoices",
          "Pre-alert clearances with border clearing agents",
        ];

  const playbookTitle = templateData?.playbookTitle || "Logistics Playbook";
  const playbookItems: BulletItem[] =
    templateData?.playbookItems && templateData.playbookItems.length > 0
      ? templateData.playbookItems
      : [
          {
            title: "Road Transit",
            description:
              "Dedicated flatbeds and tri-axles moving along regional African corridors.",
          },
          {
            title: "Ocean Transit",
            description:
              "Direct shipment configurations into major ocean ports (Durban, Beira, Dar es Salaam).",
          },
        ];

  // Stats Bar Content & Fallbacks
  const statsTitle = templateData?.statsTitle || "Pan-African Supply & Installation Support";
  const statsDescription =
    templateData?.statsDescription ||
    "Operating across 15+ African countries, managing full system performance.";
  const statsList: StatItem[] =
    templateData?.stats && templateData.stats.length > 0
      ? templateData.stats
      : [
          { value: "15+", label: "African Countries Delivered" },
          { value: "100%", label: "Traceability Reports" },
          { value: "SANS 1526", label: "Installation Standards" },
        ];

  // Products & Downloads
  const productsTitle = templateData?.productsTitle || "Products Supplied";
  const downloadsTitle = templateData?.downloadsTitle || "Technical Downloads & Guides";
  const downloadsList: DownloadItem[] =
    templateData?.downloads && templateData.downloads.length > 0
      ? templateData.downloads
      : [{ label: "Geosynthetics Africa Service Capability Statement", url: "/resources" }];

  // Helpers
  const renderIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    if (IconComp) return <IconComp className="h-5 w-5 text-primary shrink-0" />;
    return <Icons.CheckCircle2 className="h-5 w-5 text-primary shrink-0" />;
  };

  return (
    <div className="bg-background">
      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section
        className="bg-surface-dark text-white relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15,15,18,0.9), rgba(15,15,18,0.55)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-24 relative z-10">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Services", to: "/services" },
              { label: title },
            ]}
            variant="primary-bold"
          />

          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/15 px-3 py-1.5 rounded-full border border-primary/20">
            {badgeText}
          </span>

          <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 leading-relaxed pl-4 border-l-2 border-primary">
            {description}
          </p>

          <div className="mt-8">
            <Button
              className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wider text-white border-0 cursor-pointer shadow-lg px-6"
              onClick={() => {
                document
                  .getElementById("quote")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Get Technical Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Main Content Split Layout ─────────────────────────────────────────── */}
      <div className="container-page py-16 md:py-24 grid lg:grid-cols-12 gap-12 xl:gap-16">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-16">
          {/* Section: Overview */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block rounded-full" />
              Service Overview
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4 font-sans">
              {overviewParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          {/* Section: Why Choose */}
          <section className="space-y-6 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block rounded-full" />
              {whyChooseTitle}
            </h2>
            <div className="grid sm:grid-cols-1 gap-6 mt-4">
              {whyChooseItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/10">
                    <Icons.CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase text-sm tracking-wide text-foreground">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: What We Deliver */}
          <section className="space-y-6 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block rounded-full" />
              {whatWeDeliverTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 mt-4">
              {whatWeDeliverItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition duration-300 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icons.Shield className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold uppercase text-sm tracking-wide text-foreground">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Coverage & Stock Hubs */}
          <section className="space-y-6 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block rounded-full" />
              {coverageTitle}
            </h2>
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{coverageText}</p>
                <ul className="space-y-3">
                  {coverageBullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2.5 items-start text-xs text-muted-foreground leading-relaxed"
                    >
                      <Icons.CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-5 space-y-3">
                <div className="border border-border rounded-xl p-3 bg-surface/30">
                  <img
                    src={coverageImage}
                    alt={coverageTitle}
                    className="w-full h-auto rounded-lg object-cover bg-white"
                  />
                  {coverageCaption && (
                    <p className="text-[10px] text-muted-foreground italic mt-2 text-center">
                      {coverageCaption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Linked Products */}
          {linkedProducts.length > 0 && (
            <section className="space-y-6 border-t border-border pt-12">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block rounded-full" />
                {productsTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {linkedProducts.map((prod: any, idx: number) => (
                  <Link
                    key={idx}
                    to="/products/$category/$family"
                    params={{
                      category: prod.product_categories?.slug || "geomembranes",
                      family: prod.slug,
                    }}
                    className="group border border-border bg-card rounded-xl overflow-hidden flex hover:border-primary transition duration-300 shadow-sm"
                  >
                    <div className="w-24 bg-surface-dark overflow-hidden relative shrink-0">
                      <img
                        src={
                          prod.image_url ||
                          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wide text-foreground group-hover:text-primary transition line-clamp-1 mb-1">
                          {prod.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {prod.short_description}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary group-hover:text-primary transition mt-2 inline-flex items-center gap-1">
                        Specs & Catalog <Icons.ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Section: Downloads */}
          {downloadsList.length > 0 && (
            <section className="space-y-6 border-t border-border pt-12">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block rounded-full" />
                {downloadsTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {downloadsList.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border border-border bg-surface rounded-xl p-5 hover:border-primary transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent group-hover:bg-primary group-hover:text-white transition shrink-0">
                        <Icons.FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs uppercase tracking-wide text-foreground group-hover:text-primary transition truncate">
                          {item.label}
                        </div>
                        <div className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                          Technical specifications (PDF)
                        </div>
                      </div>
                    </div>
                    <Icons.Download className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="space-y-6 sticky top-[100px]">
            {/* Sidebar Image */}
            <div className="border border-border rounded-xl p-3 bg-card shadow-sm space-y-3">
              <img src={sidebarImage} alt={title} className="w-full h-48 object-cover rounded-lg" />
              {sidebarCaption && (
                <p className="text-[10px] text-muted-foreground text-center italic leading-none">
                  {sidebarCaption}
                </p>
              )}
            </div>

            {/* Direct Model Box */}
            <div className="border border-border rounded-xl p-6 bg-accent/20 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground flex items-center">
                <span className="w-1 h-3.5 bg-primary rounded-full mr-2" />
                {directModelTitle}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{directModelText}</p>
              <div className="space-y-3 pt-2">
                {directModelItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <Icons.ShieldAlert className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight text-foreground leading-none">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packaging & Transport */}
            <div className="border border-border rounded-xl p-6 bg-card shadow-sm space-y-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                <span className="w-1 h-3 bg-primary rounded-full mr-2" />
                {packagingTitle}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{packagingText}</p>
              <ul className="space-y-2.5">
                {packagingItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 items-start text-[11px] text-muted-foreground leading-relaxed"
                  >
                    <Icons.Box className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AfCFTA & SADC */}
            <div className="border border-border rounded-xl p-6 bg-card shadow-sm space-y-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                <span className="w-1 h-3 bg-primary rounded-full mr-2" />
                {afcftaTitle}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{afcftaText}</p>
              <ul className="space-y-2.5">
                {afcftaItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 items-start text-[11px] text-muted-foreground leading-relaxed"
                  >
                    <Icons.Scale className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logistics Playbook */}
            <div className="border border-border rounded-xl p-6 bg-card shadow-sm space-y-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                <span className="w-1 h-3 bg-primary rounded-full mr-2" />
                {playbookTitle}
              </h3>
              <div className="space-y-3.5">
                {playbookItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5">
                      {item.title}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Form Card */}
            <div id="quote" className="scroll-mt-24">
              <QuoteCard
                contextLabel={title}
                heading={`Request ${title}`}
                description={`Get pricing, technical details, or dispatch logistics estimates for ${title.toLowerCase()}.`}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Bottom Stats Bar (Premium Earthy Texture) ─────────────────────────── */}
      <section className="bg-[#4D3626] text-white py-16 relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="container-page relative z-10 text-center max-w-4xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/20 px-3 py-1 rounded-full border border-primary/20">
            Performance Index
          </span>
          <h2 className="mt-4 font-display text-2xl md:text-3xl font-bold uppercase tracking-wide">
            {statsTitle}
          </h2>
          <p className="mt-2 text-xs md:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
            {statsDescription}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {statsList.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm flex flex-col justify-center min-h-[120px]"
              >
                <div className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="mt-2.5 text-xs font-bold uppercase tracking-widest text-primary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </div>
  );
}
