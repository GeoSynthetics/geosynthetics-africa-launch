import { useEffect, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/projects.$slug";
import {
  ChevronRight,
  MapPin,
  Download,
  ShieldCheck,
  CheckCircle,
  Scale,
  Calendar,
  Briefcase,
  Shield,
  Layers,
  Award,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import heroInstallationFallback from "@/assets/hero-installation.png";

/** True when a CMS value holds real content (not empty, not a "—" placeholder). */
function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return true;
  const text = String(value).trim();
  return (
    text.length > 0 &&
    !["—", "–", "-", "n/a", "na", "tbc", "null", "undefined"].includes(text.toLowerCase())
  );
}

/** Returns the value when it holds real content, otherwise undefined. */
function valueOrNothing<T>(value: T): T | undefined {
  return hasValue(value) ? value : undefined;
}

type Metric = { label: string; value: unknown; accent?: boolean };

/** Hero metrics strip: renders only the metrics that have real values. */
function MetricsStrip({ metrics }: { metrics: Metric[] }) {
  const shown = metrics.filter((m) => hasValue(m.value));
  if (shown.length === 0) return null;
  const cols: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
  };
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-0 border-t border-b border-white/10 mt-6 bg-black/10 backdrop-blur-sm",
        cols[Math.min(shown.length, 5)],
      )}
    >
      {shown.map((m, idx) => (
        <div
          key={m.label}
          className={cn("p-4 flex flex-col", idx < shown.length - 1 && "border-r border-white/5")}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">
            {m.label}
          </span>
          <span
            className={cn(
              "font-display font-extrabold text-sm uppercase",
              m.accent ? "text-primary" : "text-white",
            )}
          >
            {String(m.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProjectDetailPage() {
  const { project } = Route.useLoaderData() || {};
  const serviceType: string = ["supply_only", "services_only", "supply_install"].includes(
    project.service_type,
  )
    ? project.service_type
    : "supply_install";
  const logistics = project.logistics_details || {};
  const service = project.service_details || {};
  const qa = project.qa_details || {};
  const productsUsed: any[] = Array.isArray(project.products_used) ? project.products_used : [];
  const specRows: any[] = (
    Array.isArray(project.spec_compliance) ? project.spec_compliance : []
  ).filter((row: any) => row && (hasValue(row.property) || hasValue(row.delivered)));
  const kpis: Metric[] = [
    { label: "Demurrage Free", value: logistics.kpi_demurrage_free, accent: true },
    { label: "Frontier Delays", value: logistics.kpi_frontier_delays },
    { label: "Sealed Consignments", value: logistics.kpi_sealed_consignments },
    { label: "On-Time laydown", value: logistics.kpi_ontime_laydown, accent: true },
  ].filter((k) => hasValue(k.value));
  const galleryPhotos: any[] = [...(project.gallery || []), ...(qa.photos || [])].filter(
    (photo: any) => photo && hasValue(photo.url),
  );

  // Which optional sections have real content for this project
  const show = {
    logistics:
      hasValue(logistics.challenge_description) ||
      hasValue(logistics.challenge_callout_title) ||
      hasValue(logistics.challenge_callout_body),
    route: hasValue(logistics.route_steps),
    documents: hasValue(logistics.documents),
    products: productsUsed.length > 0,
    compliance: specRows.length > 0,
    kpis: kpis.length > 0,
    independence: hasValue(service.independence_statement),
    methodology: hasValue(service.challenge_description) || hasValue(service.forensic_protocol),
    tests: hasValue(service.testing_description) || productsUsed.length > 0,
    findings: hasValue(service.findings_description) || hasValue(service.findings),
    deliverables: hasValue(service.deliverable),
    installation: hasValue(qa.challenge_description) || hasValue(qa.challenge_approach),
    sequence: hasValue(qa.sequence),
    qapack: hasValue(qa.checklist),
    testimonial: hasValue(project.testimonial?.quote),
  };
  const [activeAnchor, setActiveAnchor] = useState("brief");
  const [headerH, setHeaderH] = useState(96);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    const productIds = project?.products_used?.map((p: any) => p.productId).filter(Boolean);

    if (productIds && productIds.length > 0) {
      async function fetchProducts() {
        try {
          const { data, error } = await supabase
            .from("products_public")
            .select("id, name, slug, image_url, short_description, product_categories(slug, name)")
            .in("id", productIds);

          if (!error && data) {
            const mapped = data.map((d: any) => ({
              ...d,
              product_categories: Array.isArray(d.product_categories)
                ? d.product_categories[0]
                : d.product_categories,
            }));
            setDbProducts(mapped);
          }
        } catch (e) {
          console.error("Error fetching db products for case study:", e);
        }
      }
      fetchProducts();
    } else {
      setDbProducts([]);
    }
  }, [project?.products_used]);

  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height;
      if (h) setHeaderH(Math.round(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Sticky subnav anchors: only sections that actually render for this project
  const anchors = useMemo(() => {
    const all =
      serviceType === "supply_only"
        ? [
            { id: "brief", label: "Brief", when: true },
            { id: "logistics", label: "Logistics Challenge", when: show.logistics },
            { id: "route", label: "Route & Journey", when: show.route },
            { id: "products", label: "Products Supplied", when: show.products },
            { id: "documents", label: "Document Chain", when: show.documents },
            { id: "compliance", label: "Spec Compliance", when: show.compliance },
            { id: "kpis", label: "Delivery KPIs", when: show.kpis },
            { id: "testimonial", label: "Client", when: show.testimonial },
          ]
        : serviceType === "services_only"
          ? [
              { id: "brief", label: "Brief", when: true },
              { id: "independence", label: "Independence", when: show.independence },
              { id: "methodology", label: "Methodology", when: show.methodology },
              { id: "tests", label: "Test Programme", when: show.tests },
              { id: "findings", label: "Findings", when: show.findings },
              { id: "compliance", label: "Results Table", when: show.compliance },
              { id: "deliverables", label: "Deliverables", when: show.deliverables },
              { id: "testimonial", label: "Client", when: show.testimonial },
            ]
          : [
              { id: "brief", label: "Brief", when: true },
              { id: "installation", label: "Installation Challenge", when: show.installation },
              { id: "sequence", label: "Installation Sequence", when: show.sequence },
              { id: "qapack", label: "QA & Testing", when: show.qapack },
              { id: "products", label: "Products Used", when: show.products },
              { id: "compliance", label: "Spec Compliance", when: show.compliance },
              { id: "testimonial", label: "Client", when: show.testimonial },
            ];
    return all.filter((a) => a.when).map(({ id, label }) => ({ id, label }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, serviceType]);

  // Set active section on scroll
  useEffect(() => {
    const handler = () => {
      const threshold = headerH + 80;
      let current = anchors[0]?.id || "brief";

      for (const anchor of anchors) {
        const el = document.getElementById(anchor.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) {
          current = anchor.id;
        } else {
          break;
        }
      }
      setActiveAnchor(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [headerH, anchors]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - (headerH + 50);
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const heroImg = valueOrNothing(project.hero_image_url) || heroInstallationFallback;

  // Headline: the project title, plus the delivered scale when it is not already in the title
  const scale = valueOrNothing(project.scale);
  const headline =
    scale && !String(project.title || "").includes(String(scale))
      ? `${project.title} — ${scale}`
      : project.title;
  const locationLine = [valueOrNothing(project.location), valueOrNothing(project.country)]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {/* ========================================== */}
      {/* ============ TECHNICAL HEROES ============ */}
      {/* ========================================== */}

      {/* 1. SUPPLY ONLY MAP HERO */}
      {serviceType === "supply_only" && (
        <section className="relative bg-gradient-to-br from-[#1C1917] via-[#2F1B0F] to-[#121111] text-white pt-10 pb-12 overflow-hidden border-b border-[#2A2A2A]">
          {/* Stylized Africa silhouette */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-15 pointer-events-none text-primary">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#ffffff"
                  d="M201.56 19.495l-87.79 9.131-73.745 94.814v52.676l56.186 61.805 64.615-13.344 49.164 9.832-10.535 37.926 33.711 61.103-16.855 42.842 39.79 116.225 53.62-8.768 49.164-55.484 4.213-38.629 31.605-23.879-6.322-69.531 83.594-106.994-51.989 7.263-79.363-138.359-125.016-8.428-14.046-30.2zm252.346 319.8l-14.402 20.86-13.408.496c-11.849 24.321-12.598 38.019-13.907 66.547l17.383 4.471 21.852-52.147 2.482-40.226z"
                ></path>
              </g>
            </svg>
          </div>

          <div className="container-page relative z-10">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Projects", to: "/projects" },
                { label: "Supply Case Study" },
              ]}
              variant="tiny"
            />

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-black/60 border border-primary text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                Supply Only
              </span>
              {hasValue(project.sector) && (
                <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {project.sector}
                </span>
              )}
              {hasValue(logistics.borders) && (
                <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  Cross-Border
                </span>
              )}
              {hasValue(project.country) && (
                <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {project.country}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight max-w-4xl text-white mb-6">
              {headline}
            </h1>
            {hasValue(project.summary) && (
              <p className="max-w-3xl text-sm md:text-base text-white/80 leading-relaxed mb-8">
                {project.summary}
              </p>
            )}

            <MetricsStrip
              metrics={[
                { label: "Scope", value: "Supply Only" },
                { label: "Logistics Tonnage", value: logistics.tonnage },
                { label: "Distance Route", value: logistics.route },
                { label: "Borders Crossed", value: logistics.borders },
                { label: "On-Time Delivery", value: logistics.ontime, accent: true },
              ]}
            />
          </div>
        </section>
      )}

      {/* 2. SERVICES ONLY TECH HERO */}
      {serviceType === "services_only" && (
        <section className="relative bg-gradient-to-br from-[#0B0B0C] via-[#1A1A1F] to-[#121111] text-white pt-10 pb-12 overflow-hidden border-b border-[#2A2A2A]">
          {/* Tech CAD Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[280px] h-[340px] opacity-20 pointer-events-none text-primary hidden md:block">
            <svg
              viewBox="0 0 320 400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-full h-full"
            >
              <rect x="60" y="20" width="200" height="20" strokeWidth="2" />
              <rect x="80" y="40" width="160" height="240" strokeWidth="2" />
              <rect x="100" y="280" width="120" height="60" strokeWidth="2" />
              <line x1="160" y1="40" x2="160" y2="120" strokeWidth="3" />
              <line x1="160" y1="200" x2="160" y2="280" strokeWidth="3" />
              <rect x="130" y="120" width="60" height="80" fill="currentColor" fillOpacity="0.15" />
              <line x1="60" y1="350" x2="260" y2="350" strokeWidth="1" />
            </svg>
          </div>

          <div className="container-page relative z-10">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Projects", to: "/projects" },
                { label: "Services Case Study" },
              ]}
              variant="tiny"
            />

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-black/60 border border-white text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                Services Only
              </span>
              {hasValue(project.sector) && (
                <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {project.sector}
                </span>
              )}
              {hasValue(project.country) && (
                <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {project.country}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight max-w-4xl text-white mb-6">
              {headline}
            </h1>
            {hasValue(project.summary) && (
              <p className="max-w-3xl text-sm md:text-base text-white/80 leading-relaxed mb-8">
                {project.summary}
              </p>
            )}

            <MetricsStrip
              metrics={[
                { label: "Scope", value: "Services Only" },
                { label: "Programme Duration", value: service.duration },
                { label: "Test Streams", value: service.tests },
                { label: "Samples Extracted", value: service.samples },
                { label: "Deliverable", value: service.deliverable, accent: true },
              ]}
            />
          </div>
        </section>
      )}

      {/* 3. SUPPLY & INSTALL PHOTO HERO (Default) */}
      {serviceType === "supply_install" && (
        <section className="relative bg-surface-dark text-surface-dark-foreground min-h-[500px] flex items-end pt-20 overflow-hidden">
          {/* Background image under black gradient fade */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          <div className="container-page relative z-10 pb-12 w-full">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Projects", to: "/projects" },
                { label: "Install Case Study" },
              ]}
              variant="tiny"
            />

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                Supply &amp; Install
              </span>
              {hasValue(project.sector) && (
                <span className="bg-black/45 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {project.sector}
                </span>
              )}
              {locationLine && (
                <span className="bg-black/45 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {locationLine}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight max-w-4xl text-white mb-6">
              {headline}
            </h1>
            {hasValue(project.summary) && (
              <p className="max-w-3xl text-sm md:text-base text-white/80 leading-relaxed mb-8">
                {project.summary}
              </p>
            )}

            <MetricsStrip
              metrics={[
                { label: "Scope", value: "Supply & Install" },
                { label: "Area Lined", value: project.scale },
                { label: "Resources", value: qa.welders },
                { label: "CQA Standards", value: qa.compliance },
                { label: "Completed", value: project.project_year, accent: true },
              ]}
            />
          </div>
        </section>
      )}

      {/* ============ IN-PAGE STICKY SUB-NAVIGATION ============ */}
      <nav
        className="sticky z-20 bg-background border-b border-border shadow-sm"
        style={{ top: `${headerH}px` }}
      >
        <div className="container-page flex items-center overflow-x-auto h-12 no-scrollbar gap-1">
          {anchors.map((a) => (
            <button
              key={a.id}
              onClick={() => scrollToSection(a.id)}
              className={cn(
                "h-full text-xs md:text-sm font-bold uppercase tracking-wide whitespace-nowrap px-4 border-b-2 transition-colors cursor-pointer",
                activeAnchor === a.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ========================================== */}
      {/* ============ CONTENT GRIDS ============ */}
      {/* ========================================== */}
      <main className="bg-background">
        <div className="container-page py-12 grid lg:grid-cols-12 gap-10">
          {/* LEFT CONTENT COLUMN */}
          <article className="lg:col-span-8 space-y-14">
            {/* BRIEF (Shared across all templates) */}
            <section id="brief" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold uppercase mb-4 text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                Case Study Brief
              </h2>
              <div className="text-base leading-relaxed text-muted-foreground font-medium border-l-2 border-primary/25 pl-4 mb-6 whitespace-pre-line">
                {project.body}
              </div>

              {/* Install Hero Photo Strip / Gallery */}
              {galleryPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
                  {galleryPhotos.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-[4/3] relative rounded overflow-hidden group border border-border"
                    >
                      <img
                        src={p.url}
                        alt={p.caption || project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2 opacity-90">
                        <span className="text-[8.5px] font-bold uppercase tracking-wide text-white leading-tight">
                          {p.caption}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ============================================== */}
            {/* ============ LAYOUT 1: SUPPLY ONLY ============ */}
            {/* ============================================== */}
            {serviceType === "supply_only" && (
              <>
                {/* Logistics Challenge */}
                {show.logistics && (
                  <section id="logistics" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      The Logistics Challenge
                    </h2>
                    {hasValue(logistics.challenge_description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {logistics.challenge_description}
                      </p>
                    )}
                    {(hasValue(logistics.challenge_callout_title) ||
                      hasValue(logistics.challenge_callout_body)) && (
                      <div className="bg-[#FAFAF8] border-l-4 border-primary p-6 rounded-r">
                        {hasValue(logistics.challenge_callout_title) && (
                          <div className="font-display font-bold text-xs uppercase text-foreground mb-2">
                            {logistics.challenge_callout_title}
                          </div>
                        )}
                        {hasValue(logistics.challenge_callout_body) && (
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {logistics.challenge_callout_body}
                          </p>
                        )}
                      </div>
                    )}
                  </section>
                )}

                {/* Logistics Route Flow */}
                {show.route && (
                  <section id="route" className="scroll-mt-28 space-y-5">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      Logistics Route &amp; Transit
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      How this consignment moved from order to site, stage by stage.
                    </p>

                    <div className="bg-foreground text-background p-6 md:p-8 rounded-lg relative overflow-hidden border border-[#2A2A2A]">
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />
                      <h3 className="font-display text-white text-base font-bold uppercase mb-8 flex items-center gap-2">
                        <Compass className="h-5 w-5 text-primary" />
                        Route Timeline
                      </h3>

                      <div className="relative border-l border-primary/45 ml-4 pl-6 space-y-8">
                        {logistics.route_steps.map((step: any, idx: number) => (
                          <div key={idx} className="relative group">
                            {/* Timeline Dot */}
                            <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-primary rounded-full border border-foreground flex items-center justify-center text-[8px] font-black text-white shadow-md">
                              {idx + 1}
                            </span>

                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                                {step.stage}
                              </span>
                              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                {step.duration}
                              </span>
                            </div>
                            <h4 className="font-display text-white font-extrabold text-sm uppercase">
                              {step.name}
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed mt-1">
                              {step.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Document Chain */}
                {show.documents && (
                  <section id="documents" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      Logistics Document Chain
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Documents prepared and tracked for this consignment.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {logistics.documents.map((doc: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-surface border border-border rounded-lg p-4 flex items-start gap-4"
                        >
                          <span className="font-display font-black text-xl text-primary mt-0.5">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-display text-xs font-extrabold uppercase text-foreground">
                                {doc.title}
                              </h4>
                              {hasValue(doc.status) && (
                                <span className="bg-primary/10 text-primary text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded ml-auto">
                                  {doc.status}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {doc.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ============================================== */}
            {/* ============ LAYOUT 2: SERVICES ONLY ============ */}
            {/* ============================================== */}
            {serviceType === "services_only" && (
              <>
                {/* Independence Panel */}
                {show.independence && (
                  <section id="independence" className="scroll-mt-28">
                    <div className="bg-[#0B0B0C] border-l-4 border-primary p-6 md:p-8 rounded-r relative overflow-hidden text-white border border-[#2A2A2A]">
                      <div className="absolute top-4 right-4 text-primary opacity-25">
                        <Shield className="h-10 w-10" />
                      </div>
                      <h3 className="font-display font-extrabold text-sm uppercase text-primary tracking-wider mb-2">
                        Technical Independence Statement
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed max-w-2xl whitespace-pre-line">
                        {service.independence_statement}
                      </p>
                    </div>
                  </section>
                )}

                {/* Forensic Audit Methodology */}
                {show.methodology && (
                  <section id="methodology" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      Forensic Methodology Protocol
                    </h2>
                    {hasValue(service.challenge_description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {service.challenge_description}
                      </p>
                    )}

                    {hasValue(service.forensic_protocol) && (
                      <div className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-card shadow-sm">
                        {service.forensic_protocol.map((step: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between group hover:bg-surface/30 transition"
                          >
                            <div className="flex items-start gap-4">
                              <span className="font-display font-black text-3xl text-primary leading-none mt-0.5">
                                {step.step}
                              </span>
                              <div>
                                <h4 className="font-display text-xs font-extrabold uppercase text-foreground">
                                  {step.name}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mt-1">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                            <div className="border-l-2 border-primary pl-3 md:w-48 text-[11px] shrink-0 mt-3 md:mt-0 text-muted-foreground">
                              <span className="font-bold text-[10px] uppercase block text-foreground mb-0.5">
                                Deliverable Output
                              </span>
                              {step.output}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Test Programme stream cards */}
                {show.tests && (
                  <section id="tests" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      Laboratory Testing Programme
                    </h2>
                    {hasValue(service.testing_description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {service.testing_description}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {productsUsed.map((test: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-32 gap-3"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                          <div>
                            <span className="text-[10px] font-bold text-muted-foreground font-mono">
                              {test.category}
                            </span>
                            <h4 className="font-display text-sm font-extrabold uppercase text-foreground mt-1 mb-2 leading-tight">
                              {test.name}
                            </h4>
                          </div>
                          {(hasValue(test.qty) || hasValue(test.origin)) && (
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary border-t border-border/60 pt-2 flex items-center justify-between">
                              <span>{hasValue(test.qty) ? `Verified: ${test.qty}` : ""}</span>
                              <span className="text-muted-foreground font-mono">{test.origin}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Findings Register */}
                {show.findings && (
                  <section id="findings" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      Forensic Findings Register
                    </h2>
                    {hasValue(service.findings_description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {service.findings_description}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-3 gap-3">
                      {(service.findings || []).map((find: any, idx: number) => (
                        <div
                          key={idx}
                          className={cn(
                            "bg-card border rounded-lg p-5 flex flex-col justify-between min-h-40",
                            find.status === "PASS"
                              ? "border-l-4 border-l-emerald-600 border-border"
                              : find.status === "ATTENTION"
                                ? "border-l-4 border-l-amber-500 border-border"
                                : "border-l-4 border-l-red-600 border-border",
                          )}
                        >
                          <div>
                            <div className="flex justify-between items-baseline mb-2">
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {find.area}
                              </span>
                              <span
                                className={cn(
                                  "text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white",
                                  find.status === "PASS"
                                    ? "bg-emerald-600"
                                    : find.status === "ATTENTION"
                                      ? "bg-amber-500"
                                      : "bg-red-600",
                                )}
                              >
                                {find.status}
                              </span>
                            </div>
                            <h4 className="font-display text-xs font-bold uppercase tracking-wide text-foreground mb-2 leading-tight">
                              {find.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {find.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ============================================== */}
            {/* ============ LAYOUT 3: SUPPLY & INSTALL ============ */}
            {/* ============================================== */}
            {serviceType === "supply_install" && (
              <>
                {/* Installation Challenge */}
                {show.installation && (
                  <section id="installation" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      The Installation Challenge
                    </h2>
                    {hasValue(qa.challenge_description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {qa.challenge_description}
                      </p>
                    )}
                    {hasValue(qa.challenge_approach) && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {qa.challenge_approach}
                      </p>
                    )}
                  </section>
                )}

                {/* Installation sequence (only when steps are entered in the admin) */}
                {show.sequence && (
                  <section id="sequence" className="scroll-mt-28 space-y-4">
                    <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full" />
                      Installation Sequence
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {qa.sequence.map((step: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-surface rounded-xl border border-border p-4 hover:border-primary transition group text-center"
                        >
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 font-display font-black">
                            {idx + 1}
                          </div>
                          <h4 className="font-display text-xs font-extrabold uppercase text-foreground mb-1">
                            {step.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground leading-normal">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* CQA QA Pack */}
                {show.qapack && (
                  <section id="qapack" className="scroll-mt-28">
                    <div className="bg-foreground text-background p-6 md:p-8 rounded-lg relative overflow-hidden border border-[#2A2A2A]">
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />
                      <div className="absolute top-4 right-4 text-primary opacity-25">
                        <Award className="h-10 w-10" />
                      </div>

                      <h3 className="font-display text-white text-base font-bold uppercase mb-4 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Field Quality Assurance (QA/QC) Checklist
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed max-w-xl mb-6">
                        Quality checks recorded on this installation.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {qa.checklist.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 bg-black/20 p-3 rounded">
                            <CheckCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-xs text-white/90 leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Products Supplied / Used list */}
            {(serviceType === "supply_only" || serviceType === "supply_install") &&
              show.products && (
                <section id="products" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    {serviceType === "supply_only"
                      ? "Products Supplied"
                      : "Products Used in Project"}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {serviceType === "supply_only"
                      ? "Products supplied for this project."
                      : "Products supplied and installed on this project."}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {productsUsed.map((p: any, idx: number) => {
                      const dbProd = p.productId
                        ? dbProducts.find((db) => db.id === p.productId)
                        : null;

                      if (dbProd) {
                        return (
                          <Link
                            key={idx}
                            to="/catalogue/$slug"
                            params={{ slug: dbProd.slug }}
                            className="group flex gap-4 border border-border rounded-xl p-4 bg-surface hover:border-primary transition"
                          >
                            <div className="h-16 w-16 shrink-0 rounded bg-surface-dark overflow-hidden relative flex items-center justify-center text-primary border border-border group-hover:scale-102 transition duration-200">
                              {dbProd.image_url ? (
                                <img
                                  src={dbProd.image_url}
                                  alt={dbProd.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Layers className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                                {p.category || dbProd.product_categories?.name}
                              </span>
                              <h4 className="font-display text-xs font-extrabold uppercase text-foreground group-hover:text-primary transition leading-tight mt-0.5 truncate">
                                {dbProd.name}
                              </h4>
                              {hasValue(p.qty) && (
                                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                  Quantity: {p.qty}
                                </div>
                              )}
                              {dbProd.short_description && (
                                <p className="text-[10px] text-muted-foreground/80 line-clamp-2 mt-1 font-medium leading-normal">
                                  {dbProd.short_description}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary self-center shrink-0" />
                          </Link>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          to="/catalogue"
                          search={{ q: p.name, cats: [], mans: [], sort: "newest" }}
                          className="group flex gap-4 border border-border rounded-xl p-4 bg-surface hover:border-primary transition"
                        >
                          <div className="h-16 w-16 shrink-0 rounded bg-surface-dark overflow-hidden relative flex items-center justify-center text-primary border border-border group-hover:scale-102 transition duration-200">
                            <Layers className="h-6 w-6" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                              {p.category}
                            </span>
                            <h4 className="font-display text-xs font-extrabold uppercase text-foreground group-hover:text-primary transition leading-tight mt-0.5">
                              {p.name}
                            </h4>
                            {hasValue(p.qty) && (
                              <div className="text-[10px] text-muted-foreground font-mono mt-1">
                                Quantity: {p.qty}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary self-center shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

            {/* Spec Compliance table */}
            {show.compliance && (
              <section id="compliance" className="scroll-mt-28 space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Specification Conformity &amp; Lab Verification
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Key properties compared with the project specification.
                </p>

                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full text-xs">
                    <thead className="bg-[#1A1A1A] text-white font-bold uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Property</th>
                        <th className="px-4 py-3 text-left">Test Method</th>
                        <th className="px-4 py-3 text-left">Specification Minimum</th>
                        <th className="px-4 py-3 text-left">Delivered Value (Average)</th>
                        <th className="px-4 py-3 text-right">Margin Above Spec</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {specRows.map((spec: any, idx: number) => (
                        <tr key={idx} className="hover:bg-surface/50 transition">
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {spec.property}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">
                            {spec.method}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{spec.spec}</td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {spec.delivered}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 text-right font-extrabold",
                              String(spec.margin ?? "").includes("+") || spec.margin === "PASS"
                                ? "text-emerald-600"
                                : "text-amber-500",
                            )}
                          >
                            {spec.margin}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Delivery KPIs (for supply_only) — only the KPIs entered in the admin */}
            {serviceType === "supply_only" && show.kpis && (
              <section id="kpis" className="scroll-mt-28 space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Logistics Performance KPIs
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-[#FAFAF8] border border-border rounded p-4 text-center"
                    >
                      <div
                        className={cn(
                          "font-display text-2xl font-black mb-1",
                          kpi.accent ? "text-primary" : "text-foreground",
                        )}
                      >
                        {String(kpi.value)}
                      </div>
                      <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services Deliverables box (for services_only) */}
            {serviceType === "services_only" && show.deliverables && (
              <section id="deliverables" className="scroll-mt-28">
                <div className="bg-surface rounded-xl border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                  <div className="h-20 w-16 bg-primary text-white flex items-center justify-center rounded shadow-md shrink-0">
                    <Download className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-foreground leading-tight mb-2">
                      Deliverable: {service.deliverable}
                    </h3>
                    {hasValue(service.deliverable_description) && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                        {service.deliverable_description}
                      </p>
                    )}
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary hover:bg-primary-hover text-[10px] font-bold uppercase tracking-wider h-8"
                    >
                      <Link to="/contacts">
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Request a Sample Report
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* Testimonial block */}
            {show.testimonial && (
              <section id="testimonial" className="scroll-mt-28">
                {project.testimonial && (
                  <div className="bg-[#FAFAF8] border-l-4 border-primary p-6 md:p-10 rounded-r shadow-sm">
                    <blockquote className="font-display font-bold text-lg md:text-xl text-foreground leading-normal mb-6 relative">
                      <span className="text-primary font-serif text-5xl leading-none absolute -left-4 -top-6 select-none opacity-20">
                        “
                      </span>
                      {project.testimonial.quote}
                    </blockquote>
                    <div className="flex items-center gap-4 border-t border-border/60 pt-4">
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-black">
                        {project.testimonial.avatar ||
                          String(project.testimonial.name || "")
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w: string) => w[0]?.toUpperCase())
                            .join("") ||
                          "GA"}
                      </div>
                      <div>
                        <div className="font-display text-xs font-extrabold uppercase text-foreground leading-none">
                          {project.testimonial.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1 leading-none">
                          {[project.testimonial.role, project.testimonial.company]
                            .filter((v: unknown) => hasValue(v))
                            .join(" · ")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </article>

          {/* RIGHT SIDEBAR COLUMN */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Project Quick Facts Details */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border pb-3 mb-4">
                Project Information
              </h3>
              <dl className="space-y-4 text-xs font-semibold">
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground mb-1">Client</dt>
                  <dd className="text-foreground text-sm uppercase font-display font-black">
                    {valueOrNothing(project.client_name) || "Confidential Client"}
                  </dd>
                </div>
                {locationLine && (
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground mb-1">Location</dt>
                    <dd className="text-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      {locationLine}
                    </dd>
                  </div>
                )}
                {hasValue(project.project_year) && (
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground mb-1">Year</dt>
                    <dd className="text-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      {project.project_year}
                    </dd>
                  </div>
                )}
                {hasValue(project.sector) && (
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground mb-1">Sector</dt>
                    <dd className="text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-primary shrink-0" />
                      {project.sector}
                    </dd>
                  </div>
                )}
                {scale && (
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground mb-1">
                      Delivered Scale
                    </dt>
                    <dd className="text-foreground flex items-center gap-1.5 font-mono">
                      <Scale className="h-4 w-4 text-primary shrink-0" />
                      {scale}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* FEATURED PRODUCTS SIDEBAR CARD */}
            {dbProducts.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-[#FF3B30] border-b border-border pb-3 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-[#FF3B30] rounded-full inline-block" />
                  Featured
                </h3>
                <div className="space-y-4">
                  {dbProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      to="/catalogue/$slug"
                      params={{ slug: prod.slug }}
                      className="group flex gap-3 text-xs focus:outline-none"
                    >
                      <div className="h-12 w-12 shrink-0 rounded border border-border bg-card overflow-hidden relative flex items-center justify-center text-primary group-hover:border-primary transition-colors duration-200">
                        {prod.image_url ? (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Layers className="h-5 w-5 opacity-40" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-display font-bold uppercase text-foreground leading-tight group-hover:text-primary transition-colors duration-200 truncate">
                          {prod.name}
                        </h4>
                        {prod.short_description && (
                          <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2 mt-0.5 font-medium">
                            {prod.short_description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Services Capability box (depending on type) */}
            <div className="bg-foreground text-background rounded-xl p-5 border border-[#2A2A2A]">
              <h3 className="font-display text-white text-xs font-extrabold uppercase tracking-widest border-b border-white/10 pb-3 mb-4">
                Our Service Capabilities
              </h3>
              <div className="space-y-2">
                {serviceType === "supply_install" ? (
                  <>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Turn-key lining
                      supply &amp; install
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Meets SANS 1526 wedge
                      welding
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Certified IAGI
                      welders and supervisors
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> On-site QA
                      destructive tensiometer checks
                    </div>
                  </>
                ) : serviceType === "supply_only" ? (
                  <>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> SADC Certificate of
                      Origin issuance
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Multimodal sea and
                      road freight tracking
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Pre-shipment
                      condition SGS audits
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Frontier customs
                      clearance agents
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Independent
                      third-party forensic audits
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Standard and HP OIT
                      antioxidant profiling
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> ASTM D7007 spark leak
                      location surveys
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Regulator-compliant
                      technical dossiers
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* High Contrast Sidebar CTA */}
            <div
              id="quote-req"
              className="bg-primary text-white rounded-xl p-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <h3 className="font-display text-lg font-black uppercase mb-2">
                Need Similar Delivery?
              </h3>
              <p className="text-xs text-white/90 leading-relaxed mb-6">
                Consult with our civil engineers to specify, source, or inspect your geosynthetic
                composite systems.
              </p>

              <div className="space-y-2">
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-white hover:bg-white/95 text-foreground text-xs font-bold uppercase tracking-wider h-10 border-0"
                >
                  <Link to="/contacts">Discuss Your Scope</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent border-white text-white hover:bg-white/5 hover:text-white text-xs font-bold uppercase tracking-wider h-10"
                >
                  <Link to="/contacts">Request Project Documents</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Existing GSA Lead BOQ & Partner Bands */}
      <BoqCtaBand />
      <PartnerStrip />
    </>
  );
}
