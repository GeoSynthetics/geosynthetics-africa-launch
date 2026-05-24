import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
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
  CloudUpload,
  X,
  Loader2,
  Sun,
  Wrench,
  Sparkles,
  Droplets,
  ArrowLeftRight,
  Puzzle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductSchema } from "@/components/seo/ProductSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Route } from "@/routes/catalogue.$slug";

interface KeyFeature { label: string; icon?: string }
interface SpecRow { property: string; test_method?: string; unit?: string; typical_value?: string }
interface StripItem { title: string; subtitle?: string; image_url?: string }

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
  const { product, alternatives, systemComponents } = Route.useLoaderData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
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
  const features = (product.key_features && product.key_features.length > 0)
    ? product.key_features
    : DEFAULT_FEATURES;

  const downloads = useMemo(() => ([
    { label: "Datasheet", url: product.datasheet_url, size: "PDF" },
    { label: "Installation Guide", url: product.installation_guide_url, size: "PDF" },
    { label: "QA/QC Checklist", url: product.qa_checklist_url, size: "PDF" },
    { label: "Chemical Resistance Guide", url: product.chemical_resistance_url, size: "PDF" },
  ].filter((d) => d.url)), [product]);

  const ataGlance = [
    { icon: Package, label: "Material", value: product.material },
    { icon: Layers, label: "Structure", value: product.structure },
    { icon: Palette, label: "Colour", value: product.colour },
    { icon: ShieldCheck, label: "Standard", value: product.standard },
    { icon: Ruler, label: "Roll Width", value: product.roll_width },
    { icon: Scroll, label: "Roll Length", value: product.roll_length },
  ].filter((r) => r.value);

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
        description={product.meta_description || product.short_description || `${product.name} — engineered geosynthetic product by Geosynthetics Africa.`}
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
            ? [{
                name: product.product_categories.name,
                url: `https://geosynthetics.co.za/products/${product.product_categories.slug || product.product_categories.name.toLowerCase().replace(/\s+/g, "-")}`,
              }]
            : []),
          { name: product.name, url: `https://geosynthetics.co.za/catalogue/${product.slug}` },
        ]}
      />

      {/* Breadcrumb + Hero with product image as background (landscape, left-dark fade) */}
      <section
        className="relative bg-surface-dark text-surface-dark-foreground overflow-hidden"
      >
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
          <nav className="text-xs uppercase tracking-wider text-surface-dark-foreground/70 flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/catalogue" search={{ q: "", cats: [], mans: [], sort: "newest" }} className="hover:text-primary">Catalogue</Link>
            {product.product_categories?.name && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="hover:text-primary">{product.product_categories.name}</span>
              </>
            )}
            {product.manufacturers?.name && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="hover:text-primary">{product.manufacturers.name}</span>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{product.name}</span>
          </nav>

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
                const Icon = (f.icon && FEATURE_ICONS[f.icon as keyof typeof FEATURE_ICONS]) || CheckCircle2;
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
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide"
              >
                <Link to="/contacts">
                  Upload Project BOQ
                  <Upload className="ml-2 h-4 w-4" />
                </Link>
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
          tabsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none",
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
                  {(product.long_description ?? product.short_description ?? "").split(/\n\n+/).map((para: string, i: number) => (
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
                            <td className="px-4 py-3 text-muted-foreground">{s.test_method ?? "—"}</td>
                            <td className="px-4 py-3 text-muted-foreground">{s.unit ?? "—"}</td>
                            <td className="px-4 py-3">{s.typical_value ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Note: The above values are typical and not intended for specification purposes. Please refer to the product datasheet for full details.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">Technical specifications will be published shortly. Request the datasheet for full property values.</p>
              )}
            </div>

            {/* Applications */}
            <Strip
              id="applications"
              title="Typical Applications"
              cta={{ label: "View all applications", to: "/applications" }}
              items={product.applications ?? []}
            />

            {/* Systems */}
            <Strip
              id="systems"
              title="Compatible Systems"
              cta={{ label: "View all systems", to: "/services" }}
              items={product.compatible_systems ?? []}
            />

            {/* Installation placeholder */}
            <div id="installation">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">Installation</h2>
              <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
                Installation guides and method statements available on request. Download our installation guide above or speak to our technical team.
              </div>
            </div>

            {/* QA & Testing placeholder */}
            <div id="qa">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">QA & Testing</h2>
              <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
                All products are supplied with mill test certificates and conform to ASTM / ISO standards.
              </div>
            </div>

            {/* Documents */}
            <div id="documents">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">Documents</h2>
              {downloads.length === 0 ? (
                <div className="rounded border border-border bg-card p-6 text-sm text-muted-foreground">
                  Documents will appear here once uploaded by the supplier.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {downloads.map((d) => (
                    <a
                      key={d.label}
                      href={d.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded border border-border bg-card p-4 hover:border-primary transition"
                    >
                      <div className="h-10 w-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold">{d.label}</div>
                        <div className="text-xs text-muted-foreground">{d.size}</div>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Case Studies placeholder */}
            <div id="case-studies">
              <h2 className="font-display text-2xl font-bold uppercase mb-5">
                Projects Using {product.name}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded border border-border bg-card overflow-hidden">
                    <div className="aspect-[4/3] bg-surface" />
                    <div className="p-4">
                      <div className="font-display text-sm font-bold uppercase">Case Study {i}</div>
                      <div className="text-xs text-muted-foreground mt-1">South Africa</div>
                      <Link to="/resources" className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                        View case study <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Need help */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="font-display text-base font-bold uppercase text-foreground">Need Help?</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Our technical team is ready to support your project.
                </p>
                <div className="mt-4 space-y-3 text-xs font-medium">
                  <a href="tel:+27117940974" className="flex items-center gap-2.5 text-foreground hover:text-primary transition">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    +27 11 794 0974
                  </a>
                  <a href="mailto:sales@geosynthetics.co.za" className="flex items-center gap-2.5 text-foreground hover:text-primary transition">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    sales@geosynthetics.co.za
                  </a>
                </div>
                <Button asChild variant="outline" className="w-full mt-4 uppercase font-bold tracking-wider text-[11px] h-9">
                  <Link to="/contacts">Contact our team</Link>
                </Button>
              </div>

              {/* Quick downloads */}
              {downloads.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-display text-base font-bold uppercase mb-3 text-foreground">Quick Downloads</h3>
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
                            <div className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition">{d.label}</div>
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
              <QuoteCard productId={product.id} productName={product.name} />

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
                    Other {product.product_categories?.name?.toLowerCase() || "products"} in this category. See our Product Selection Guide before specifying.
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
                                <img src={altImg} alt={alt.name} className="h-full w-full object-cover" />
                              ) : (
                                <Layers className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold leading-snug text-foreground group-hover:text-primary transition truncate">{alt.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{alt.product_categories?.name || "Containment Solution"}</div>
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
                        <a href={product.product_categories.selection_guide_url} target="_blank" rel="noopener noreferrer">
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
                      Complete the {product.product_categories?.name?.replace(/s$/, "") || "Lining"} System
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-normal mb-4">
                    Components and services typically specified to successfully install this {product.product_categories?.name?.toLowerCase().replace(/s$/, "") || "liner"}.
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
                                <img src={sysImg} alt={sys.name} className="h-full w-full object-cover" />
                              ) : (
                                <Wrench className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold leading-snug text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-500 transition truncate">{sys.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{sys.product_categories?.name || "System Component"}</div>
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

function Strip({ id, title, cta, items }: { id: string; title: string; cta: { label: string; to: string }; items: StripItem[] }) {
  return (
    <div id={id}>
      <div className="flex items-end justify-between mb-5">
        <h2 className="font-display text-2xl font-bold uppercase">{title}</h2>
        <Link to={cta.to as never} className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1">
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
            <div key={i} className="rounded border border-border bg-card overflow-hidden hover:border-primary transition">
              <div className="aspect-[4/3] bg-surface overflow-hidden">
                {it.image_url ? (
                  <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="p-3">
                <div className="font-display text-xs font-bold uppercase leading-tight">{it.title}</div>
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

const ALLOWED_TYPES = [".pdf", ".dwg", ".dxf", ".doc", ".docx", ".xls", ".xlsx", ".csv", ".zip", ".png", ".jpg", ".jpeg"];
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_FILES = 8;

function QuoteCard({ productId, productName }: { productId: string; productName: string }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);
    const accepted: File[] = [];
    for (const f of list) {
      const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
      if (!ALLOWED_TYPES.includes(ext)) {
        toast.error(`${f.name}: unsupported file type.`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name}: exceeds 20MB limit.`);
        continue;
      }
      accepted.push(f);
    }
    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      if (merged.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files per request.`);
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const attachment_paths: string[] = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `quotes/${productId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("boq-uploads")
          .upload(path, file, { contentType: file.type || undefined });
        if (upErr) {
          console.warn("Attachment upload failed:", upErr.message);
          toast.warning(`Could not upload ${file.name} — continuing.`);
        } else {
          attachment_paths.push(path);
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id ?? null;

      const baseDescription = message.trim() || `Quote request for ${productName}`;
      const descriptionWithPaths = attachment_paths.length > 1
        ? `${baseDescription}\n\n[attachments]\n${attachment_paths.join("\n")}`
        : baseDescription;

      const basePayload: Record<string, unknown> = {
        contact_name: name.trim(),
        contact_email: email.trim(),
        company: company.trim() || null,
        project_description: descriptionWithPaths,
        product_id: productId,
        product_name: productName,
        attachment_paths,
        boq_file_path: attachment_paths[0] ?? null,
        user_id: userId,
        status: "new",
      };

      const optionalKeys = ["product_id", "product_name", "attachment_paths", "boq_file_path", "user_id"];
      let payload = { ...basePayload };
      let lastError: { message: string } | null = null;
      for (let attempt = 0; attempt < optionalKeys.length + 1; attempt += 1) {
        const { error } = await supabase.from("quote_requests").insert(payload);
        if (!error) {
          lastError = null;
          break;
        }
        lastError = error;
        const match = /column ['"]?(\w+)['"]? .* (does not exist|not found)/i.exec(error.message)
          ?? /Could not find the ['"]?(\w+)['"]? column/i.exec(error.message);
        const missing = match?.[1];
        if (missing && missing in payload) {
          delete (payload as Record<string, unknown>)[missing];
          continue;
        }
        break;
      }
      if (lastError) throw new Error(lastError.message);

      toast.success("Quote request submitted. We'll be in touch shortly.");
      setName(""); setCompany(""); setEmail(""); setMessage(""); setFiles([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to submit quote request.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-display text-base font-bold uppercase text-foreground" id="quote">Request a Quote</h3>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
        Upload your BOQ or drawings and we'll provide a technical proposal.
      </p>

      <div className="mt-4 space-y-3">
        <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Textarea
          placeholder={`Message (optional) — re: ${productName}`}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition",
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
          )}
        >
          <CloudUpload className="h-8 w-8 mx-auto text-muted-foreground" />
          <div className="mt-2 text-xs">
            <span className="font-medium text-foreground">Drag & drop files here</span>
            <span className="text-muted-foreground"> or </span>
            <span className="text-primary font-medium underline">click to browse</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 leading-normal">
            PDF, DWG, DOC, XLS, images (Max 20MB each, up to {MAX_FILES} files)
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept={ALLOWED_TYPES.join(",")}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-foreground">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-muted-foreground hover:text-destructive transition p-1"
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wider text-[11px] h-9 text-white mt-1 border-0"
        >
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Submit & Get Proposal
        </Button>
      </div>
    </div>
  );
}
