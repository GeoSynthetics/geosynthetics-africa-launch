import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Download,
  Upload,
  FileText,
  Phone,
  Mail,
  Package,
  Layers,
  Palette,
  ShieldCheck,
  Ruler,
  Scroll,
  CheckCircle2,
  Sun,
  Wrench,
  Sparkles,
  Droplets,
  ArrowLeftRight,
  Puzzle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { cn, splitIntoParagraphs } from "@/lib/utils";
import { ProductSchema } from "@/components/seo/ProductSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Route } from "@/routes/catalogue.$slug";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

interface KeyFeature {
  label: string;
  icon?: string;
}
interface SpecRow {
  property: string;
  test_method?: string;
  unit?: string;
  typical_value?: string;
}
interface StripItem {
  title: string;
  subtitle?: string;
  image_url?: string;
}

const FEATURE_ICONS = {
  filter: Droplets,
  durable: ShieldCheck,
  uv: Sun,
  install: Wrench,
  cost: Sparkles,
} as const;

const DEFAULT_FEATURES: KeyFeature[] = [
  { label: "High Filtration Efficiency", icon: "filter" },
  { label: "Excellent Durability", icon: "durable" },
  { label: "UV & Chemical Resistant", icon: "uv" },
  { label: "Easy to Install", icon: "install" },
  { label: "Cost Effective", icon: "cost" },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "applications", label: "Applications" },
  { id: "systems", label: "Systems" },
  { id: "installation", label: "Installation" },
  { id: "qa", label: "QA & Testing" },
  { id: "documents", label: "Documents" },
  { id: "case-studies", label: "Case Studies" },
];

export function ProductDetailPage() {
  const { product, alternatives, systemComponents, familyData, caseStudies } =
    Route.useLoaderData();
  const { open } = useQuickQuote();
  const [activeTab, setActiveTab] = useState("overview");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [headerH, setHeaderH] = useState(96);
  const [tabsVisible, setTabsVisible] = useState(true);
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height;
      if (h) setHeaderH(Math.round(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const heroImg = product.image_url || product.images?.[0] || null;

  const features = useMemo(() => {
    if (product.key_features && product.key_features.length > 0) {
      return product.key_features;
    }
    if (familyData?.features && familyData.features.length > 0) {
      return familyData.features.map((f: string) => ({ label: f }));
    }
    return DEFAULT_FEATURES;
  }, [product.key_features, familyData?.features]);

  const downloads = useMemo(
    () =>
      [
        { label: "Datasheet", url: product.datasheet_url, size: "PDF" },
        {
          label: "Installation Guide",
          url:
            product.installation_guide_url ||
            (familyData?.installationSpecs ? "#installation" : null),
          size: "PDF",
        },
        { label: "QA/QC Checklist", url: product.qa_checklist_url, size: "PDF" },
        { label: "Chemical Resistance Guide", url: product.chemical_resistance_url, size: "PDF" },
      ].filter((d) => d.url),
    [product, familyData],
  );

  const ataGlance = [
    { icon: Package, label: "Material", value: product.material },
    { icon: Layers, label: "Structure", value: product.structure },
    { icon: Palette, label: "Colour", value: product.colour },
    {
      icon: ShieldCheck,
      label: "Standard",
      value: product.standard || familyData?.technicalHighlights?.[0]?.value,
    },
    {
      icon: Ruler,
      label: "Roll Width",
      value:
        product.roll_width ||
        (familyData?.technicalHighlights?.[1]?.value &&
        familyData.technicalHighlights[1].label.toLowerCase().includes("width")
          ? familyData.technicalHighlights[1].value
          : null),
    },
    {
      icon: Scroll,
      label: "Roll Length",
      value:
        product.roll_length ||
        (familyData?.technicalHighlights?.[2]?.value &&
        familyData.technicalHighlights[2].label.toLowerCase().includes("length")
          ? familyData.technicalHighlights[2].value
          : null),
    },
  ].filter((r) => r.value);

  const applicationsList = useMemo(() => {
    if (product.applications && product.applications.length > 0) {
      return product.applications;
    }
    if (familyData?.applications && familyData.applications.length > 0) {
      return familyData.applications.map((app: any) => ({
        title: app.label || app.title,
        subtitle: app.description || "",
        image_url: app.image_url || undefined,
      }));
    }
    return [];
  }, [product.applications, familyData?.applications]);

  const systemsList = useMemo(() => {
    if (product.compatible_systems && product.compatible_systems.length > 0) {
      return product.compatible_systems;
    }
    if (familyData?.types && familyData.types.length > 0) {
      return familyData.types.map((t: any) => ({
        title: t.name,
        subtitle: t.description,
      }));
    }
    return [];
  }, [product.compatible_systems, familyData?.types]);

  const documentGrid = useMemo(() => {
    return [
      {
        label: "Product Selection Guide",
        desc: "Compare performance properties across the entire category hierarchy before specifying.",
        url: product.product_categories?.selection_guide_url || null,
        tag: "CATEGORY GUIDE",
      },
      {
        label: "Installation & Method Statement",
        desc: "Standard deployment procedures, installation specifications, and field application method statements.",
        url: product.installation_guide_url || null,
        tag: "INSTALLATION",
        isAnchor:
          !product.installation_guide_url && familyData?.installationSpecs
            ? "#installation"
            : false,
      },
      {
        label: "QA/QC Site Checklist",
        desc: "Field quality control procedures, inspection checklists, and testing standards to verify installation integrity.",
        url: product.qa_checklist_url || null,
        tag: "QUALITY CHECKLIST",
      },
      {
        label: "Technical Data Sheet (TDS)",
        desc: "Guaranteed minimum average roll values (MARV) and material testing properties.",
        url: product.datasheet_url || null,
        tag: "TECHNICAL SPEC",
      },
      {
        label: "Chemical Resistance / Accessories Guide",
        desc: "Chemical compatibility matrix and list of auxiliary materials needed for installation.",
        url: product.chemical_resistance_url || null,
        tag: "ACCESSORIES GUIDE",
      },
    ];
  }, [product, familyData]);

  // Active section tracking — pick the last section whose top has crossed the threshold.
  useEffect(() => {
    const handler = () => {
      const threshold = headerH + 80;
      let current = TABS[0].id;
      for (const t of TABS) {
        const el = document.getElementById(t.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) {
          current = t.id;
        } else {
          break;
        }
      }
      setActiveTab(current);

      // Hide tabs when scrolled past the bottom of the last section
      const lastEl = document.getElementById(TABS[TABS.length - 1].id);
      if (lastEl) {
        const bottom = lastEl.getBoundingClientRect().bottom;
        setTabsVisible(bottom > threshold);
      }
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [headerH]);

  // Mobile: keep the active tab's "page of 3" in view as the user scrolls
  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (idx < 0) return;
    const page = Math.floor(idx / 3);
    const left = page * container.clientWidth;
    if (Math.abs(container.scrollLeft - left) > 4) {
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeTab]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - (headerH + 60);
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Structured data for search engines */}
      <ProductSchema
        name={product.name}
        description={
          product.meta_description ||
          product.short_description ||
          `${product.name} — engineered geosynthetic product by Geosynthetics Africa.`
        }
        slug={product.slug}
        image={heroImg}
        sku={product.sku}
        category={product.product_categories?.name}
        manufacturer={product.manufacturers?.name}
        price={product.price}
        inStock={(product.stock_quantity ?? 0) > 0}
        material={product.material}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://geosynthetics.co.za/" },
          { name: "Catalogue", url: "https://geosynthetics.co.za/catalogue" },
          ...(product.product_categories?.name
            ? [
                {
                  name: product.product_categories.name,
                  url: `https://geosynthetics.co.za/products/${product.product_categories.slug || product.product_categories.name.toLowerCase().replace(/\s+/g, "-")}`,
                },
              ]
            : []),
          { name: product.name, url: `https://geosynthetics.co.za/catalogue/${product.slug}` },
        ]}
      />

      {/* Breadcrumb + Hero with product image as background (landscape, left-dark fade) */}
      <section className="relative bg-surface-dark text-surface-dark-foreground overflow-hidden">
        {/* Background image */}
        {heroImg && (
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        {/* Left-to-right dark fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.85) 35%, rgba(10,10,12,0.4) 65%, rgba(10,10,12,0.05) 100%)",
          }}
        />

        <div className="relative container-page pt-6 pb-12 md:pt-8 md:pb-16">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              {
                label: "Catalogue",
                to: "/catalogue",
                search: { q: "", cats: [], mans: [], sort: "newest" },
              },
              ...(product.product_categories?.name
                ? [
                    product.product_categories.slug
                      ? {
                          label: product.product_categories.name,
                          to: "/products/$category",
                          params: { category: product.product_categories.slug },
                        }
                      : {
                          label: product.product_categories.name,
                          to: "/catalogue",
                          search: {
                            q: "",
                            cats: [product.product_categories.id],
                            mans: [],
                            sort: "newest",
                          },
                        },
                  ]
                : []),
              ...(product.manufacturers?.name
                ? [
                    {
                      label: product.manufacturers.name,
                      to: "/catalogue",
                      search: { q: "", cats: [], mans: [product.manufacturers.id], sort: "newest" },
                    },
                  ]
                : []),
              { label: product.name },
            ]}
            variant="default"
          />

          <div className="mt-8 max-w-2xl">
            {product.product_categories?.name && (
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
                {product.product_categories.name}
              </p>
            )}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.05]">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="mt-5 text-base md:text-lg text-surface-dark-foreground/85 max-w-xl">
                {product.short_description}
              </p>
            )}

            {/* Key features */}
            <div className="mt-7 grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-2xl">
              {features.slice(0, 5).map((f: KeyFeature, i: number) => {
                const Icon =
                  (f.icon && FEATURE_ICONS[f.icon as keyof typeof FEATURE_ICONS]) || CheckCircle2;
                return (
                  <div key={i} className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full border border-surface-dark-foreground/20 bg-surface-dark/40 backdrop-blur-sm flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-wide text-surface-dark-foreground/85 leading-tight">
                      {f.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide text-white border-0"
                onClick={() => scrollTo("quote")}
              >
                Request Material Supply
                <Download className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide cursor-pointer border border-surface-dark-foreground/30"
                onClick={() => open(product.name, product.id)}
              >
                Upload Project BOQ
                <Upload className="ml-2 h-4 w-4" />
              </Button>
              <Button
                asChild={!!product.datasheet_url}
                disabled={!product.datasheet_url}
                size="lg"
                variant="outline"
                className="bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide"
              >
                {product.datasheet_url ? (
                  <a href={product.datasheet_url} target="_blank" rel="noopener noreferrer">
                    Download Datasheet
                    <Download className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <span>Download Datasheet</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky tabs — stick beneath the site header */}
      <div
        className={cn(
          "sticky z-30 bg-background border-b border-border shadow-sm transition-all duration-300",
          tabsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none",
        )}
        style={{ top: headerH }}
      >
        <div className="container-page">
          <div
            ref={tabsScrollRef}
            className={cn(
              "flex overflow-x-auto no-scrollbar",
              // Mobile: snap 3 tabs per page (each tab = 1/3 viewport width)
              "snap-x snap-mandatory md:snap-none",
              "md:gap-1",
            )}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => scrollTo(t.id)}
                className={cn(
                  "py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors snap-start",
                  // Mobile: each tab takes 1/3 of the container so swiping reveals 3 at a time
                  "basis-1/3 shrink-0 grow-0 text-center px-2",
                  "md:basis-auto md:shrink md:grow-0 md:px-4",
                  activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-background">
        <div className="container-page py-12 grid lg:grid-cols-12 gap-10">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-14">
            {/* Overview */}
            <div id="overview">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">Overview</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4 text-sm leading-relaxed text-foreground/85">
                  {(product.long_description ?? product.short_description ?? "")
                    .split(/\n\n+/)
                    .map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                  {!product.long_description && !product.short_description && (
                    <p className="text-muted-foreground italic">Detailed overview coming soon.</p>
                  )}
                </div>
                {ataGlance.length > 0 && (
                  <div className="rounded border border-border bg-surface p-4">
                    <ul className="divide-y divide-border">
                      {ataGlance.map((r) => (
                        <li key={r.label} className="flex items-center gap-3 py-2.5 text-sm">
                          <r.icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-muted-foreground w-24">{r.label}</span>
                          <span className="font-medium text-foreground">{r.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div id="specifications">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">Typical Properties</h2>
              {product.specifications && product.specifications.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Property</th>
                          <th className="px-4 py-3 font-semibold">Test Method</th>
                          <th className="px-4 py-3 font-semibold">Unit</th>
                          <th className="px-4 py-3 font-semibold">Typical Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {product.specifications.map((s: SpecRow, i: number) => (
                          <tr key={i} className="hover:bg-surface/60">
                            <td className="px-4 py-3 font-medium">{s.property}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {s.test_method ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{s.unit ?? "—"}</td>
                            <td className="px-4 py-3">{s.typical_value ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Note: The above values are typical and not intended for specification purposes.
                    Please refer to the product datasheet for full details.
                  </p>
                </>
              ) : familyData?.propertiesTable?.rows &&
                familyData.propertiesTable.rows.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <tr>
                          {familyData.propertiesTable.headers.map((h: string, idx: number) => (
                            <th key={idx} className="px-4 py-3 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {familyData.propertiesTable.rows.map((row: string[], i: number) => (
                          <tr key={i} className="hover:bg-surface/60">
                            {row.map((cell: string, idx: number) => (
                              <td
                                key={idx}
                                className={cn(
                                  "px-4 py-3",
                                  idx === 0 ? "font-medium" : "text-muted-foreground",
                                )}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Note: The above specifications represent the product family properties. Please
                    refer to the product datasheet for individual SKU values.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Technical specifications will be published shortly. Request the datasheet for full
                  property values.
                </p>
              )}
            </div>

            {/* Applications */}
            <Strip
              id="applications"
              title="Typical Applications"
              cta={{ label: "View all applications", to: "/applications" }}
              items={applicationsList}
            />

            {/* Systems */}
            <Strip
              id="systems"
              title="Compatible Systems"
              cta={{ label: "View all systems", to: "/services" }}
              items={systemsList}
            />

            {/* Installation Guidance */}
            <div id="installation">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">
                Installation Guidance
              </h2>
              {familyData?.installationSpecs && familyData.installationSpecs.length > 0 ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-3 text-primary mb-4">
                      <Wrench className="h-6 w-6" />
                      <h3 className="font-display text-lg font-bold uppercase">
                        Standard Method Statement
                      </h3>
                    </div>
                    <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
                      {splitIntoParagraphs(familyData.installationSpecs).map(
                        (spec: string, i: number) => (
                          <p key={i}>{spec}</p>
                        ),
                      )}
                    </div>
                  </div>
                  {product.installation_guide_url && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5 cursor-pointer uppercase font-bold tracking-wider text-[11px] h-9"
                    >
                      <a
                        href={product.installation_guide_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Download Complete Installation
                        Guide (PDF)
                      </a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
                  Installation guides and method statements available on request. Download our
                  installation guide above or speak to our technical team.
                </div>
              )}
            </div>

            {/* QA & Testing */}
            <div id="qa">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">
                Quality Assurance & Testing
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                    <h3 className="font-display text-lg font-bold uppercase">
                      Field QA/QC Checklist
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To ensure certified performance and long-term integrity, the following field quality control
                    procedures must be completed by the contractor:
                  </p>
                  <ul className="space-y-2.5 text-xs text-foreground/85">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Subgrade/Foundation Acceptance:</strong> Surface smooth, compacted, free of
                        sharp protrusions (&gt;10mm), vegetation, and standing water.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Material Verification:</strong> Roll, panel, or unit batch numbers and certificates
                        of conformance checked against approved specifications before installation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Installation Compliance:</strong> Placement, overlap, anchoring, jointing, or
                        connection method (welding, lacing, interlocking, mechanical, or solvent joints) verified
                        per manufacturer's installation guide for the specific product.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Joint &amp; Connection Testing:</strong> 100% visual inspection of all seams, laps, or
                        connections, plus non-destructive testing (e.g., air channel, vacuum box, or pressure testing)
                        where applicable to the product type.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Destructive/Performance Sampling:</strong> Representative samples or connections
                        tested on-site or at an accredited lab (shear, peel, tensile, or pull-out strength) to confirm
                        performance meets spec.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Damage &amp; Curing Inspection:</strong> Full surface check for punctures, tears, UV
                        degradation, or (for cementitious products) correct hydration/curing prior to backfilling
                        or cover placement.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-primary">
                      <Scroll className="h-6 w-6" />
                      <h3 className="font-display text-lg font-bold uppercase">
                        Manufacturing Standards
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This product is supplied with full Mill Test Certificates (MTC) proving
                      compliance to strict international specifications (ASTM, ISO, and GRI).
                    </p>
                    <div className="bg-surface border border-border rounded-lg p-3 text-xs leading-normal">
                      <strong>Standard Conformance:</strong>{" "}
                      {product.standard ||
                        familyData?.technicalHighlights?.[0]?.value ||
                        "ASTM & ISO Standard Compliant"}
                    </div>
                  </div>
                  {product.qa_checklist_url && (
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary-hover font-bold text-white uppercase mt-4 text-[11px] h-9"
                    >
                      <a href={product.qa_checklist_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Download QA/QC Checklist (PDF)
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div id="documents">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">Documents</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {documentGrid.map((doc, idx) => {
                  const hasUrl = !!doc.url || !!doc.isAnchor;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex flex-col justify-between rounded-xl border p-4 bg-card transition duration-200",
                        hasUrl
                          ? "border-border hover:border-primary/50"
                          : "border-border/60 opacity-80",
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {doc.tag}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {hasUrl ? "PDF DOCUMENT" : "REQUEST ON DEMAND"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground mb-1 leading-snug">
                          {doc.label}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-normal mb-4">
                          {doc.desc}
                        </p>
                      </div>

                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover transition mt-2 self-start"
                        >
                          Download document <Download className="h-3.5 w-3.5" />
                        </a>
                      ) : doc.isAnchor ? (
                        <button
                          type="button"
                          onClick={() => scrollTo(doc.isAnchor as string)}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover transition mt-2 self-start cursor-pointer"
                        >
                          View guidance below <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQuoteMessage(
                              `Hi, I am interested in ${product.name} and would like to request the ${doc.label}. Please email me the details.`,
                            );
                            scrollTo("quote");
                          }}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover transition mt-2 self-start cursor-pointer"
                        >
                          Request this document <Mail className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Case Studies */}
            <div id="case-studies">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">
                Projects Using {product.name}
              </h2>
              {caseStudies && caseStudies.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {caseStudies.map((cs: any) => (
                    <div
                      key={cs.id}
                      className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[4/3] bg-surface overflow-hidden relative">
                          {cs.hero_image_url ? (
                            <img
                              src={cs.hero_image_url}
                              alt={cs.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="h-full w-full bg-surface" />
                          )}
                          <div className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {cs.country || cs.location || "Reference Site"}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="font-display text-xs font-bold uppercase tracking-wide leading-snug line-clamp-2 mb-1">
                            {cs.title}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                            {cs.summary}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <Link
                          to="/projects/$slug"
                          params={{ slug: cs.slug } as any}
                          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary group-hover:text-primary-hover transition"
                        >
                          View Case Study <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
                  Case studies and reference projects for {product.name} will be published shortly.
                  Contact our technical team for reference projects across Africa.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Add to Project BOQ */}
              <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground leading-tight">
                      Add to Project BOQ
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Submit a quote request</p>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                  Add this product to your BOQ request. Upload drawings, fill in your project
                  details and our technical team will respond with a proposal.
                </p>
                <Button
                  id="add-to-project-boq-btn"
                  className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wider text-[11px] h-10 text-white border-0 shadow-sm"
                  onClick={() => open(product.name, product.id)}
                >
                  <Upload className="h-3.5 w-3.5 mr-2" />
                  Add to Project BOQ
                </Button>
              </div>

              {/* Need help */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="font-display text-base font-bold uppercase text-foreground">
                  Need Help?
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Our technical team is ready to support your project.
                </p>
                <div className="mt-4 space-y-3 text-xs font-medium">
                  <a
                    href="tel:+27710939964"
                    className="flex items-center gap-2.5 text-foreground hover:text-primary transition"
                  >
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    +27 71 093 9964
                  </a>
                  <a
                    href="mailto:sales@geosynthetics.co.za"
                    className="flex items-center gap-2.5 text-foreground hover:text-primary transition"
                  >
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    sales@geosynthetics.co.za
                  </a>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-4 uppercase font-bold tracking-wider text-[11px] h-9"
                >
                  <Link to="/contacts">Contact our team</Link>
                </Button>
              </div>

              {/* Quick downloads */}
              {downloads.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-display text-base font-bold uppercase mb-3 text-foreground">
                    Quick Downloads
                  </h3>
                  <ul className="space-y-1.5">
                    {downloads.map((d) => (
                      <li key={d.label}>
                        <a
                          href={d.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface border border-transparent hover:border-border/30 transition group"
                        >
                          <FileText className="h-4 w-4 text-primary shrink-0 group-hover:scale-105 transition" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition">
                              {d.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{d.size}</div>
                          </div>
                          <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quote form */}
              <QuoteCard
                contextId={product.id}
                contextLabel={product.name}
                initialMessage={quoteMessage}
              />

              {/* Alternative Solutions */}
              {alternatives.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-1.5 text-primary">
                    <ArrowLeftRight className="h-4.5 w-4.5 shrink-0" />
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                      Alternative {product.product_categories?.name || "Solutions"}
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-normal mb-4">
                    Other {product.product_categories?.name?.toLowerCase() || "products"} in this
                    category. See our Product Selection Guide before specifying.
                  </p>
                  <ul className="space-y-2.5">
                    {alternatives.map((alt) => {
                      const altImg = alt.image_url || alt.images?.[0] || null;
                      return (
                        <li key={alt.id}>
                          <Link
                            to="/catalogue/$slug"
                            params={{ slug: alt.slug }}
                            className="flex items-center gap-3 p-2 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-surface/50 transition-all duration-200 group"
                          >
                            <div className="h-11 w-11 shrink-0 rounded-lg bg-surface border border-border flex items-center justify-center text-primary overflow-hidden transition duration-200 group-hover:scale-105">
                              {altImg ? (
                                <img
                                  src={altImg}
                                  alt={alt.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Layers className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold leading-snug text-foreground group-hover:text-primary transition truncate">
                                {alt.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {alt.product_categories?.name || "Containment Solution"}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Selection Guide Link */}
                  {product.product_categories?.selection_guide_url && (
                    <div className="mt-4 pt-3.5 border-t border-border/60">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full bg-background border-border text-foreground hover:bg-surface hover:text-primary font-bold uppercase tracking-wider text-[11px] h-9 transition-all duration-200 shadow-sm"
                      >
                        <a
                          href={product.product_categories.selection_guide_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-1.5 h-3.5 w-3.5 text-primary" />
                          View Product Selection Guide
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* System Components */}
              {systemComponents.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-1.5 text-emerald-800 dark:text-emerald-500">
                    <Puzzle className="h-4.5 w-4.5 shrink-0" />
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                      Complete the {product.product_categories?.name?.replace(/s$/, "") || "Lining"}{" "}
                      System
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-normal mb-4">
                    Components and services typically specified to successfully install this{" "}
                    {product.product_categories?.name?.toLowerCase().replace(/s$/, "") || "liner"}.
                  </p>
                  <ul className="space-y-2.5">
                    {systemComponents.map((sys) => {
                      const sysImg = sys.image_url || sys.images?.[0] || null;
                      return (
                        <li key={sys.id}>
                          <Link
                            to="/catalogue/$slug"
                            params={{ slug: sys.slug }}
                            className="flex items-center gap-3 p-2 rounded-xl border border-border/50 hover:border-emerald-800/40 hover:bg-surface/50 transition-all duration-200 group"
                          >
                            <div className="h-11 w-11 shrink-0 rounded-lg bg-surface border border-border flex items-center justify-center text-emerald-700 dark:text-emerald-400 overflow-hidden transition duration-200 group-hover:scale-105">
                              {sysImg ? (
                                <img
                                  src={sysImg}
                                  alt={sys.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Wrench className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold leading-snug text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-500 transition truncate">
                                {sys.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                {sys.product_categories?.name || "System Component"}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-500 transition shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <BoqCtaBand />
    </>
  );
}

function Strip({
  id,
  title,
  cta,
  items,
}: {
  id: string;
  title: string;
  cta: { label: string; to: string };
  items: StripItem[];
}) {
  return (
    <div id={id}>
      <div className="flex items-end justify-between mb-5">
        <h2 className="font-display text-2xl font-bold uppercase">{title}</h2>
        <Link
          to={cta.to as never}
          className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1"
        >
          {cta.label} <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
          {title} information will appear here once added.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.slice(0, 5).map((it, i) => (
            <div
              key={i}
              className="rounded border border-border bg-card overflow-hidden hover:border-primary transition"
            >
              <div className="aspect-[4/3] bg-surface overflow-hidden">
                {it.image_url ? (
                  <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="p-3">
                <div className="font-display text-xs font-bold uppercase leading-tight">
                  {it.title}
                </div>
                {it.subtitle && (
                  <div className="text-[11px] text-muted-foreground mt-1">{it.subtitle}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
