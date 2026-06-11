import { useEffect, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/projects.$slug";
import { 
  ChevronRight, 
  MapPin, 
  Download, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  Scale, 
  Calendar, 
  Briefcase, 
  Sparkles,
  ArrowRight,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  TrendingUp,
  Map,
  Compass,
  ArrowLeftRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export function ProjectDetailPage() {
  const { project } = Route.useLoaderData() || {};
  const [activeAnchor, setActiveAnchor] = useState("brief");
  const [headerH, setHeaderH] = useState(96);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    const productIds = project?.products_used
      ?.map((p: any) => p.productId)
      .filter(Boolean);

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

  // Sticky subnav anchors depending on layout type
  const anchors = useMemo(() => {
    if (project.service_type === "supply_only") {
      return [
        { id: "brief", label: "Brief" },
        { id: "logistics", label: "Logistics Challenge" },
        { id: "route", label: "Route & Journey" },
        { id: "products", label: "Products Supplied" },
        { id: "documents", label: "Document Chain" },
        { id: "compliance", label: "Spec Compliance" },
        { id: "kpis", label: "Delivery KPIs" },
        { id: "testimonial", label: "Client" }
      ];
    }
    if (project.service_type === "services_only") {
      return [
        { id: "brief", label: "Brief" },
        { id: "independence", label: "Independence" },
        { id: "methodology", label: "Methodology" },
        { id: "tests", label: "Test Programme" },
        { id: "findings", label: "Findings" },
        { id: "results", label: "Results Table" },
        { id: "deliverables", label: "Deliverables" },
        { id: "testimonial", label: "Client" }
      ];
    }
    // Default: supply_install
    return [
      { id: "brief", label: "Brief" },
      { id: "installation", label: "Installation Challenge" },
      { id: "sequence", label: "Installation Sequence" },
      { id: "qapack", label: "QA & Testing" },
      { id: "products", label: "Products Used" },
      { id: "compliance", label: "Spec Compliance" },
      { id: "testimonial", label: "Client" }
    ];
  }, [project.service_type]);

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

  const heroImg = project.hero_image_url || "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80";

  return (
    <>
      {/* ========================================== */}
      {/* ============ TECHNICAL HEROES ============ */}
      {/* ========================================== */}

      {/* 1. SUPPLY ONLY MAP HERO */}
      {project.service_type === "supply_only" && (
        <section className="relative bg-gradient-to-br from-[#1C1917] via-[#2F1B0F] to-[#121111] text-white pt-10 pb-12 overflow-hidden border-b border-[#2A2A2A]">
          {/* Stylized Africa silhouette */}
          <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-15 pointer-events-none text-primary">
            <svg viewBox="0 0 320 380" fill="currentColor" className="w-full h-full">
              <path d="M145 15c-25 5-50 20-65 40-20 25-30 55-25 85 5 20 20 40 35 50 10 10 15 20 10 35-5 15-10 35 0 50 10 15 30 20 50 25 15 5 25 10 30 25 5 15 15 20 30 20 15 0 25-10 30-25 5-25 0-50-10-70-10-25-20-50-15-75 5-25 20-45 15-75-5-30-30-55-60-65-15-5-30-5-25-20z"/>
            </svg>
          </div>
          
          <div className="container-page relative z-10">
            <nav className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-primary">Supply Case Study</span>
            </nav>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-black/60 border border-primary text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">Supply Only</span>
              <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">{project.sector}</span>
              <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">Cross-Border</span>
              <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">{project.country}</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight max-w-4xl text-white mb-6">
              {project.scale || "340 t"} liner, <span className="text-primary">{project.logistics_details?.route || "3,420 km"} route, 4 borders</span> — delivered on time.
            </h1>
            <p className="max-w-3xl text-sm md:text-base text-white/80 leading-relaxed mb-8">
              {project.summary}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-0 border-t border-b border-white/10 mt-6 bg-black/10 backdrop-blur-sm">
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Scope</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">Supply Only</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Logistics Tonnage</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.logistics_details?.tonnage || "340 t"}</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Distance Route</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.logistics_details?.route || "3,420 km"}</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Borders Crossed</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.logistics_details?.borders || "4 Borders"}</span>
              </div>
              <div className="p-4 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">On-Time delivery</span>
                <span className="font-display font-extrabold text-sm text-primary">{project.logistics_details?.ontime || "100%"}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. SERVICES ONLY TECH HERO */}
      {project.service_type === "services_only" && (
        <section className="relative bg-gradient-to-br from-[#0B0B0C] via-[#1A1A1F] to-[#121111] text-white pt-10 pb-12 overflow-hidden border-b border-[#2A2A2A]">
          {/* Tech CAD Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[280px] h-[340px] opacity-20 pointer-events-none text-primary hidden md:block">
            <svg viewBox="0 0 320 400" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
              <rect x="60" y="20" width="200" height="20" strokeWidth="2"/>
              <rect x="80" y="40" width="160" height="240" strokeWidth="2"/>
              <rect x="100" y="280" width="120" height="60" strokeWidth="2"/>
              <line x1="160" y1="40" x2="160" y2="120" strokeWidth="3"/>
              <line x1="160" y1="200" x2="160" y2="280" strokeWidth="3"/>
              <rect x="130" y="120" width="60" height="80" fill="currentColor" fillOpacity="0.15"/>
              <line x1="60" y1="350" x2="260" y2="350" strokeWidth="1"/>
            </svg>
          </div>

          <div className="container-page relative z-10">
            <nav className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-primary">Services Case Study</span>
            </nav>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-black/60 border border-white text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">Services Only</span>
              <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">Forensic Audit</span>
              <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">GISTM Aligned</span>
              <span className="bg-black/30 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">{project.country}</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight max-w-4xl text-white mb-6">
              Independent integrity review of an <span className="text-primary">operational gold TSF</span> liner.
            </h1>
            <p className="max-w-3xl text-sm md:text-base text-white/80 leading-relaxed mb-8">
              {project.summary}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-0 border-t border-b border-white/10 mt-6 bg-black/10 backdrop-blur-sm">
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Scope</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">Services Only</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Programme duration</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.service_details?.duration || "5 Weeks"}</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Forensic Streams</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.service_details?.tests || "6 Streams"}</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Samples Extracted</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.service_details?.samples || "94 Coupons"}</span>
              </div>
              <div className="p-4 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Audit Deliverable</span>
                <span className="font-display font-extrabold text-sm text-primary">{project.service_details?.deliverable || "CQA Report"}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. SUPPLY & INSTALL PHOTO HERO (Default) */}
      {project.service_type === "supply_install" && (
        <section className="relative bg-surface-dark text-surface-dark-foreground min-h-[500px] flex items-end pt-20 overflow-hidden">
          {/* Background image under black gradient fade */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          <div className="container-page relative z-10 pb-12 w-full">
            <nav className="text-[10px] font-bold uppercase tracking-widest text-white/55 flex items-center gap-2 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-primary">Install Case Study</span>
            </nav>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">Supply &amp; Install</span>
              <span className="bg-black/45 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">{project.sector}</span>
              <span className="bg-black/45 border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">{project.location}, {project.country}</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tight max-w-4xl text-white mb-6">
              {project.title} — {project.scale} Composite lining.
            </h1>
            <p className="max-w-3xl text-sm md:text-base text-white/80 leading-relaxed mb-8">
              {project.summary}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-0 border-t border-b border-white/10 mt-6 bg-black/10 backdrop-blur-sm">
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Scope</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">Supply &amp; Install</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Area Lined</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.scale}</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Field Welders</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.qa_details?.welders || "14 Certified"}</span>
              </div>
              <div className="p-4 border-r border-white/5 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">CQA Standards</span>
                <span className="font-display font-extrabold text-sm text-white uppercase">{project.qa_details?.compliance || "SANS 1526"}</span>
              </div>
              <div className="p-4 flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 mb-1">Project Status</span>
                <span className="font-display font-extrabold text-sm text-primary">COMMISSIONED</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ IN-PAGE STICKY SUB-NAVIGATION ============ */}
      <nav 
        className="sticky z-20 bg-background border-b border-border shadow-sm"
        style={{ top: `${headerH}px` }}
      >
        <div className="container-page flex items-center overflow-x-auto h-12 no-scrollbar gap-1">
          <div className="font-display text-xs md:text-sm font-extrabold uppercase tracking-wider text-primary border-r border-border pr-4 shrink-0">
            Case Study Navigation ↓
          </div>
          {anchors.map(a => (
            <button
              key={a.id}
              onClick={() => scrollToSection(a.id)}
              className={cn(
                "h-full text-xs md:text-sm font-bold uppercase tracking-wide whitespace-nowrap px-4 border-b-2 transition-colors cursor-pointer",
                activeAnchor === a.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {a.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("quote-req")}
            className="ml-auto h-8 px-4 bg-primary text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 rounded hover:bg-primary/95 transition-colors cursor-pointer"
          >
            ↓ Request Delivery Pack
          </button>
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
              <div className="text-base leading-relaxed text-muted-foreground font-medium border-l-2 border-primary/25 pl-4 mb-6">
                {project.body}
              </div>

              {/* Install Hero Photo Strip */}
              {project.service_type === "supply_install" && project.qa_details?.photos && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
                  {project.qa_details.photos.map((p: any, idx: number) => (
                    <div key={idx} className="aspect-[4/3] relative rounded overflow-hidden group border border-border">
                      <img src={p.url} alt={p.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2 opacity-90">
                        <span className="text-[8.5px] font-bold uppercase tracking-wide text-white leading-tight">{p.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ============================================== */}
            {/* ============ LAYOUT 1: SUPPLY ONLY ============ */}
            {/* ============================================== */}
            {project.service_type === "supply_only" && (
              <>
                {/* Logistics Challenge */}
                <section id="logistics" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    The Logistics Challenge
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.logistics_details?.challenge_description || "Kolwezi is approximately 3,420 km by road from the Port of Durban, crossing four sovereign customs regimes — South Africa, Botswana, Zambia, and into the Democratic Republic of the Congo. demurrages are common, and mismatched documentation packages represent significant hold windows."}
                  </p>
                  <div className="bg-[#FAFAF8] border-l-4 border-primary p-6 rounded-r">
                    <div className="font-display font-bold text-xs uppercase text-foreground mb-2">
                      {project.logistics_details?.challenge_callout_title || "Zero-Tolerance Documentation Control"}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.logistics_details?.challenge_callout_body || "Material transits cross border checkpoints with daily checks. A single spelling discrepancy on SADC Certificates of Origin or SGS pre-shipment inspections can trigger multi-week detentions. The client specified a logistics provider with pre-clearance capabilities."}
                    </p>
                  </div>
                </section>

                {/* Logistics Route Flow */}
                <section id="route" className="scroll-mt-28 space-y-5">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Logistics Route &amp; Transit
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Below is the forensic, 41-day multimodal supply chain path tracked container-by-container from Rotterdam through SADC checkpoints directly onto laydown.
                  </p>

                  <div className="bg-foreground text-background p-6 md:p-8 rounded-lg relative overflow-hidden border border-[#2A2A2A]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />
                    <h3 className="font-display text-white text-base font-bold uppercase mb-8 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" />
                      Multimodal Cross-Border Route Timeline
                    </h3>
                    
                    <div className="relative border-l border-primary/45 ml-4 pl-6 space-y-8">
                      {project.logistics_details?.route_steps?.map((step: any, idx: number) => (
                        <div key={idx} className="relative group">
                          {/* Timeline Dot */}
                          <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-primary rounded-full border border-foreground flex items-center justify-center text-[8px] font-black text-white shadow-md">
                            {idx + 1}
                          </span>
                          
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase text-primary tracking-wider">{step.stage}</span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{step.duration}</span>
                          </div>
                          <h4 className="font-display text-white font-extrabold text-sm uppercase">{step.name}</h4>
                          <p className="text-xs text-white/70 leading-relaxed mt-1">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Document Chain */}
                <section id="documents" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Logistics Document Chain
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Prior to truck dispatch, every single consignment is loaded against a full digital documentation pack ensuring rapid clearance at frontier posts.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.logistics_details?.documents?.map((doc: any, idx: number) => (
                      <div key={idx} className="bg-surface border border-border rounded-lg p-4 flex items-start gap-4">
                        <span className="font-display font-black text-xl text-primary mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-display text-xs font-extrabold uppercase text-foreground">{doc.title}</h4>
                            <span className="bg-primary/10 text-primary text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded ml-auto">
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{doc.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ============================================== */}
            {/* ============ LAYOUT 2: SERVICES ONLY ============ */}
            {/* ============================================== */}
            {project.service_type === "services_only" && (
              <>
                {/* Independence Panel */}
                <section id="independence" className="scroll-mt-28">
                  <div className="bg-[#0B0B0C] border-l-4 border-primary p-6 md:p-8 rounded-r relative overflow-hidden text-white border border-[#2A2A2A]">
                    <div className="absolute top-4 right-4 text-primary opacity-25">
                      <Shield className="h-10 w-10" />
                    </div>
                    <h3 className="font-display font-extrabold text-sm uppercase text-primary tracking-wider mb-2">Technical Independence Statement</h3>
                    <p className="text-xs text-white/80 leading-relaxed max-w-2xl">
                      {project.service_details?.independence_statement}
                    </p>
                  </div>
                </section>

                {/* Forensic Audit Methodology */}
                <section id="methodology" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Forensic Methodology Protocol
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.service_details?.challenge_description || "To comply with SANS and voluntary GISTM guidelines, GSA engineers executed a five-stage forensic examination of the in-service geomembrane composite."}
                  </p>

                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-card shadow-sm">
                    {project.service_details?.forensic_protocol?.map((step: any, idx: number) => (
                      <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between group hover:bg-surface/30 transition">
                        <div className="flex items-start gap-4">
                          <span className="font-display font-black text-3xl text-primary leading-none mt-0.5">{step.step}</span>
                          <div>
                            <h4 className="font-display text-xs font-extrabold uppercase text-foreground">{step.name}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl mt-1">{step.desc}</p>
                          </div>
                        </div>
                        <div className="border-l-2 border-primary pl-3 md:w-48 text-[11px] shrink-0 mt-3 md:mt-0 text-muted-foreground">
                          <span className="font-bold text-[10px] uppercase block text-foreground mb-0.5">Deliverable Output</span>
                          {step.output}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Test Programme stream cards */}
                <section id="tests" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Laboratory Testing Programme
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.service_details?.testing_description || "Our laboratory matrix focused on chemical antioxidant levels, thickness degradation, and environmental stress cracking resistance under high pressures."}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.products_used?.map((test: any, idx: number) => (
                      <div key={idx} className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-40">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground font-mono">{test.category}</span>
                          <h4 className="font-display text-sm font-extrabold uppercase text-foreground mt-1 mb-2 leading-tight">{test.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Conducted in GSA accredited laboratory against SANS 1526 regulations.
                          </p>
                        </div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary border-t border-border/60 pt-2 flex items-center justify-between">
                          <span>Verified: {test.qty}</span>
                          <span className="text-muted-foreground font-mono">{test.origin}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Findings Register */}
                <section id="findings" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Forensic Findings Register
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.service_details?.findings_description || "Visual checks and testing coupons yielded three discrete findings which were registered in the environmental plan."}
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {project.service_details?.findings?.map((find: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "bg-card border rounded-lg p-5 flex flex-col justify-between h-48",
                          find.status === "PASS" ? "border-l-4 border-l-emerald-600 border-border" :
                          find.status === "ATTENTION" ? "border-l-4 border-l-amber-500 border-border" :
                          "border-l-4 border-l-red-600 border-border"
                        )}
                      >
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{find.area}</span>
                            <span 
                              className={cn(
                                "text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white",
                                find.status === "PASS" ? "bg-emerald-600" :
                                find.status === "ATTENTION" ? "bg-amber-500" :
                                "bg-red-600"
                              )}
                            >
                              {find.status}
                            </span>
                          </div>
                          <h4 className="font-display text-xs font-bold uppercase tracking-wide text-foreground mb-2 leading-tight">{find.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{find.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ============================================== */}
            {/* ============ LAYOUT 3: SUPPLY & INSTALL ============ */}
            {/* ============================================== */}
            {project.service_type === "supply_install" && (
              <>
                {/* Installation Challenge */}
                <section id="installation" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    The Installation Challenge
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.qa_details?.challenge_description || "Taiings storage facilities are exposed to complex mechanical loading, high chemical pH acidity, and thermal swelling forces. Double-liner composite system installation requires highly accurate wedge-welding and extensive field CQA logs."}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.qa_details?.challenge_approach || "Our team managed the complete sequence — clearing clay subgrade, deploying geosynthetic clay liners (GCL) to prevent leakage, installing smooth and textured HDPE geomembranes, and laying drainage geocomposites to manage hydrostatic heads."}
                  </p>
                </section>

                {/* Photo Strip sequence */}
                <section id="sequence" className="scroll-mt-28 space-y-4">
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Installation Sequence Sequence
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface rounded-xl border border-border p-4 hover:border-primary transition group text-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 font-display font-black">1</div>
                      <h4 className="font-display text-xs font-extrabold uppercase text-foreground mb-1">Subgrade Accept</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">Clay base compaction and clearance check.</p>
                    </div>
                    <div className="bg-surface rounded-xl border border-border p-4 hover:border-primary transition group text-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 font-display font-black">2</div>
                      <h4 className="font-display text-xs font-extrabold uppercase text-foreground mb-1">GCL Deploy</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">Bentonite sealing layer rolled out on subgrade.</p>
                    </div>
                    <div className="bg-surface rounded-xl border border-border p-4 hover:border-primary transition group text-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 font-display font-black">3</div>
                      <h4 className="font-display text-xs font-extrabold uppercase text-foreground mb-1">Wedge Welding</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">Dual-track fusion welds with thermal wedges.</p>
                    </div>
                    <div className="bg-surface rounded-xl border border-border p-4 hover:border-primary transition group text-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3 font-display font-black">4</div>
                      <h4 className="font-display text-xs font-extrabold uppercase text-foreground mb-1">Air Pressure Test</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">Double seam channels locked and pressure tested.</p>
                    </div>
                  </div>
                </section>

                {/* CQA QA Pack */}
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
                      Every panel deployed by our certified field crews is signed off against standard SANS testing checklists. Full results are delivered in the QA dossier.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.qa_details?.checklist?.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-black/20 p-3 rounded">
                          <CheckCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs text-white/90 leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Products Used list */}
              </>
            )}

            {/* Products Supplied / Used list */}
            {(project.service_type === "supply_only" || project.service_type === "supply_install") && (
              <section id="products" className="scroll-mt-28 space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  {project.service_type === "supply_only" ? "Products Supplied" : "Products Used in Project"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.service_type === "supply_only" 
                    ? "The following certified products were supplied from our European partner mills and delivered directly to SADC laydown."
                    : "The following certified products were supplied from our European partner mills and deployed by GSA crews on site."}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {project.products_used?.map((p: any, idx: number) => {
                    const dbProd = p.productId ? dbProducts.find((db) => db.id === p.productId) : null;
                    
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
                              <img src={dbProd.image_url} alt={dbProd.name} className="h-full w-full object-cover" />
                            ) : (
                              <Layers className="h-6 w-6" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{p.category || dbProd.product_categories?.name}</span>
                            <h4 className="font-display text-xs font-extrabold uppercase text-foreground group-hover:text-primary transition leading-tight mt-0.5 truncate">{dbProd.name}</h4>
                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Quantity: {p.qty}</div>
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
                          <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{p.category}</span>
                          <h4 className="font-display text-xs font-extrabold uppercase text-foreground group-hover:text-primary transition leading-tight mt-0.5">{p.name}</h4>
                          <div className="text-[10px] text-muted-foreground font-mono mt-1">Quantity: {p.qty}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary self-center shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Spec Compliance table */}
            <section id="compliance" className="scroll-mt-28 space-y-4">
              <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                Specification Conformity &amp; Lab Verification
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before material clearance or report signing, coupons were sampled and verified in GSA laboratories. Typical SANS and ASTM comparison margins are detailed below.
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
                    {project.spec_compliance?.map((spec: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface/50 transition">
                        <td className="px-4 py-3 font-semibold text-foreground">{spec.property}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono">{spec.method}</td>
                        <td className="px-4 py-3 text-muted-foreground">{spec.spec}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{spec.delivered}</td>
                        <td className={cn("px-4 py-3 text-right font-extrabold", spec.margin.includes("+") || spec.margin === "PASS" ? "text-emerald-600" : "text-amber-500")}>
                          {spec.margin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Delivery KPIs (for supply_only) */}
            {project.service_type === "supply_only" && (
              <section id="kpis" className="scroll-mt-28 space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Logistics Performance KPIs
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-[#FAFAF8] border border-border rounded p-4 text-center">
                    <div className="font-display text-2xl font-black text-primary mb-1">100%</div>
                    <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Demurrage Free</div>
                  </div>
                  <div className="bg-[#FAFAF8] border border-border rounded p-4 text-center">
                    <div className="font-display text-2xl font-black text-foreground mb-1">0 Days</div>
                    <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Frontier Delays</div>
                  </div>
                  <div className="bg-[#FAFAF8] border border-border rounded p-4 text-center">
                    <div className="font-display text-2xl font-black text-foreground mb-1">12 Trucks</div>
                    <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Sealed Consignments</div>
                  </div>
                  <div className="bg-[#FAFAF8] border border-border rounded p-4 text-center">
                    <div className="font-display text-2xl font-black text-primary mb-1">100%</div>
                    <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">On-Time laydown</div>
                  </div>
                </div>
              </section>
            )}

            {/* Services Deliverables box (for services_only) */}
            {project.service_type === "services_only" && (
              <section id="deliverables" className="scroll-mt-28">
                <div className="bg-surface rounded-xl border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                  <div className="h-20 w-16 bg-primary text-white flex items-center justify-center font-display font-black text-xl rounded shadow-md shrink-0">
                    CQA
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-foreground leading-tight mb-2">Regulator-Ready Environmental Report</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      At handover, GSA issued a 118-page, independent CQA dossier mapping all coupon coordinates, laboratory MARV test sheets, and electrical spark locations. This report satisfies local West African environmental audits and aligns with global tailings codes.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary-hover text-[10px] font-bold uppercase tracking-wider h-8">
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Request Sample CQA Report
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Testimonial block */}
            <section id="testimonial" className="scroll-mt-28">
              {project.testimonial && (
                <div className="bg-[#FAFAF8] border-l-4 border-primary p-6 md:p-10 rounded-r shadow-sm">
                  <blockquote className="font-display font-bold text-lg md:text-xl text-foreground leading-normal mb-6 relative">
                    <span className="text-primary font-serif text-5xl leading-none absolute -left-4 -top-6 select-none opacity-20">“</span>
                    {project.testimonial.quote}
                  </blockquote>
                  <div className="flex items-center gap-4 border-t border-border/60 pt-4">
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-black">
                      {project.testimonial.avatar || "CS"}
                    </div>
                    <div>
                      <div className="font-display text-xs font-extrabold uppercase text-foreground leading-none">{project.testimonial.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 leading-none">
                        {project.testimonial.role} · <strong className="text-foreground">{project.testimonial.company}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

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
                  <dt className="text-[10px] uppercase text-muted-foreground mb-1">Client Operator</dt>
                  <dd className="text-foreground text-sm uppercase font-display font-black">{project.client_name || "Confidential Operator"}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground mb-1">Reference Location</dt>
                  <dd className="text-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {project.location}, {project.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground mb-1">Commissioned Year</dt>
                  <dd className="text-foreground flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    {project.project_year}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground mb-1">Industrial Sector</dt>
                  <dd className="text-foreground flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                    {project.sector}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground mb-1">Delivered Scale</dt>
                  <dd className="text-foreground flex items-center gap-1.5 font-mono">
                    <Scale className="h-4 w-4 text-primary shrink-0" />
                    {project.scale}
                  </dd>
                </div>
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
                          <img src={prod.image_url} alt={prod.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
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
                Service Capabilities
              </h3>
              <div className="space-y-2">
                {project.service_type === "supply_install" ? (
                  <>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Turn-key lining supply &amp; install
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> SANS 1526 approved wedge welding
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Certified IAGI welders and supervisors
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> On-site QA destructive tensiometer checks
                    </div>
                  </>
                ) : project.service_type === "supply_only" ? (
                  <>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> SADC Certificate of Origin issuance
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Multimodal sea and road freight tracking
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Pre-shipment condition SGS audits
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Frontier customs clearance agents
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Independent third-party forensic audits
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Standard and HP OIT antioxidant profiling
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 border-b border-white/5 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> ASTM D7007 spark leak location surveys
                    </div>
                    <div className="flex items-center gap-2 py-1.5 text-xs text-white/80 last:border-0">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Regulator-compliant technical dossiers
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* High Contrast Sidebar CTA */}
            <div id="quote-req" className="bg-primary text-white rounded-xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <h3 className="font-display text-lg font-black uppercase mb-2">Need Similar Delivery?</h3>
              <p className="text-xs text-white/90 leading-relaxed mb-6">
                Consult with our civil engineers to specify, source, or inspect your geosynthetic composite systems.
              </p>
              
              <div className="space-y-2">
                <Button asChild size="sm" className="w-full bg-white hover:bg-white/95 text-foreground text-xs font-bold uppercase tracking-wider h-10 border-0">
                  <Link to="/contacts">Discuss Your Scope</Link>
                </Button>
                <button
                  onClick={() => {
                    alert("Delivery pack downloaded. In a live system, this sends SADC/COMESA paperwork to the client's email.");
                  }}
                  className="w-full bg-transparent border border-white text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider h-10 rounded transition cursor-pointer"
                >
                  Download Delivery Pack
                </button>
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
