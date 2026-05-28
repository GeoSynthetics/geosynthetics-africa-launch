import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/projects";
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  Grid, 
  Map, 
  List, 
  X, 
  ArrowUpDown, 
  FolderDown, 
  Globe, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";

// GSA African reach country data (as perJames' Continent Band mockup)
const AFRICAN_COUNTRIES = [
  { flag: "🇿🇦", name: "South Africa", count: 218 },
  { flag: "🇨🇩", name: "DRC", count: 34 },
  { flag: "🇲🇱", name: "Mali", count: 18 },
  { flag: "🇿🇲", name: "Zambia", count: 14 },
  { flag: "🇬🇭", name: "Ghana", count: 11 },
  { flag: "🇰🇪", name: "Kenya", count: 9 },
  { flag: "🇹🇿", name: "Tanzania", count: 8 },
  { flag: "🇿🇼", name: "Zimbabwe", count: 7 },
  { flag: "🇲🇿", name: "Mozambique", count: 6 },
  { flag: "🇳🇦", name: "Namibia", count: 6 },
  { flag: "🇦🇴", name: "Angola", count: 5 },
  { flag: "🇬🇬", name: "Guinea", count: 4 },
];

export function ProjectsPage() {
  const { caseStudies = [] } = Route.useLoaderData() || {};

  // --- Search & Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all"); // 'all', 'supply_install', 'supply_only', 'services_only'
  
  // Secondary Dropdown Filters
  const [industryFilter, setIndustryFilter] = useState("all");
  const [appFilter, setAppFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [scaleFilter, setScaleFilter] = useState("all");

  const [sortOption, setSortOption] = useState("recent"); // 'recent', 'scale', 'featured', 'country'
  const [viewMode, setViewMode] = useState<"grid" | "map" | "list">("grid");

  // --- Dynamic Option Extraction from Loaded Database Records ---
  const dynamicFacets = useMemo(() => {
    const industries = new Set<string>();
    const applications = new Set<string>();
    const products = new Set<string>();
    const countries = new Set<string>();
    const years = new Set<number>();

    caseStudies.forEach((cs: any) => {
      if (cs.sector) industries.add(cs.sector);
      if (cs.summary) {
        // Simple extraction of app matching common sectors
        if (cs.summary.toLowerCase().includes("tsf")) applications.add("TSF");
        if (cs.summary.toLowerCase().includes("liner")) applications.add("Liner");
        if (cs.summary.toLowerCase().includes("review")) applications.add("Review");
      }
      if (cs.products_used && Array.isArray(cs.products_used)) {
        cs.products_used.forEach((p: any) => {
          if (p.name) {
            if (p.name.includes("HDPE")) products.add("HDPE Geomembrane");
            else if (p.name.includes("Typar")) products.add("Typar Geotextile");
            else if (p.name.includes("bentomat") || p.name.toLowerCase().includes("gcl")) products.add("GCL Clay Liner");
            else products.add(p.name);
          }
        });
      }
      if (cs.country) countries.add(cs.country);
      if (cs.project_year) years.add(cs.project_year);
    });

    return {
      industries: Array.from(industries),
      applications: Array.from(applications),
      products: Array.from(products),
      countries: Array.from(countries),
      years: Array.from(years).sort((a, b) => b - a),
    };
  }, [caseStudies]);

  // --- Apply Filters and Sort ---
  const filteredCaseStudies = useMemo(() => {
    let result = [...caseStudies];

    // 1. Service Type Filter (All projects, Supply & Install, Supply only, Services only)
    if (serviceTypeFilter !== "all") {
      result = result.filter(cs => cs.service_type === serviceTypeFilter);
    }

    // 2. Text Search (title, summary, location, country, tags)
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(cs => 
        (cs.title && cs.title.toLowerCase().includes(q)) ||
        (cs.summary && cs.summary.toLowerCase().includes(q)) ||
        (cs.location && cs.location.toLowerCase().includes(q)) ||
        (cs.country && cs.country.toLowerCase().includes(q)) ||
        (cs.sector && cs.sector.toLowerCase().includes(q))
      );
    }

    // 3. Secondary Facets
    if (industryFilter !== "all") {
      result = result.filter(cs => cs.sector === industryFilter);
    }
    if (appFilter !== "all") {
      result = result.filter(cs => cs.summary && cs.summary.toLowerCase().includes(appFilter.toLowerCase()));
    }
    if (productFilter !== "all") {
      result = result.filter(cs => {
        if (!cs.products_used || !Array.isArray(cs.products_used)) return false;
        return cs.products_used.some((p: any) => 
          p.name && (p.name.toLowerCase().includes(productFilter.toLowerCase()) || 
          (productFilter === "HDPE Geomembrane" && p.name.includes("HDPE")) ||
          (productFilter === "Typar Geotextile" && p.name.includes("Typar")) ||
          (productFilter === "GCL Clay Liner" && p.name.toLowerCase().includes("gcl")))
        );
      });
    }
    if (countryFilter !== "all") {
      result = result.filter(cs => cs.country === countryFilter);
    }
    if (yearFilter !== "all") {
      result = result.filter(cs => cs.project_year === parseInt(yearFilter));
    }
    if (scaleFilter !== "all") {
      result = result.filter(cs => {
        if (!cs.scale) return false;
        const cleanScale = cs.scale.replace(/[^0-9]/g, "");
        const num = parseInt(cleanScale) || 0;
        if (scaleFilter === "large") return num >= 100000;
        if (scaleFilter === "medium") return num >= 10000 && num < 100000;
        return num < 10000;
      });
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortOption === "scale") {
        const getNum = (str: string) => parseInt((str || "").replace(/[^0-9]/g, "")) || 0;
        return getNum(b.scale) - getNum(a.scale);
      }
      if (sortOption === "country") {
        return (a.country || "").localeCompare(b.country || "");
      }
      if (sortOption === "featured") {
        // Custom feature flags, fall back to recent
        return (b.project_year || 0) - (a.project_year || 0);
      }
      // 'recent' sorting
      return (b.project_year || 0) - (a.project_year || 0) || 
             new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [
    caseStudies,
    searchTerm,
    serviceTypeFilter,
    industryFilter,
    appFilter,
    productFilter,
    countryFilter,
    yearFilter,
    scaleFilter,
    sortOption
  ]);

  // Count helper for Primary Filter Buttons
  const counts = useMemo(() => {
    return {
      all: caseStudies.length,
      supply_install: caseStudies.filter((cs: any) => cs.service_type === "supply_install").length,
      supply_only: caseStudies.filter((cs: any) => cs.service_type === "supply_only").length,
      services_only: caseStudies.filter((cs: any) => cs.service_type === "services_only").length,
    };
  }, [caseStudies]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setServiceTypeFilter("all");
    setIndustryFilter("all");
    setAppFilter("all");
    setProductFilter("all");
    setCountryFilter("all");
    setYearFilter("all");
    setScaleFilter("all");
  };

  const hasActiveFilters = 
    searchTerm !== "" ||
    serviceTypeFilter !== "all" ||
    industryFilter !== "all" ||
    appFilter !== "all" ||
    productFilter !== "all" ||
    countryFilter !== "all" ||
    yearFilter !== "all" ||
    scaleFilter !== "all";

  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section className="relative bg-gradient-to-br from-[#0B0B0C] via-[#161515] to-[#121111] text-white pt-10 pb-12 overflow-hidden border-b border-[#2A2A2A]">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(228,30,43,0.06),_transparent_65%)] pointer-events-none filter blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container-page relative z-10">
          <nav className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <span className="text-primary">Projects</span>
          </nav>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-primary" />
            Project Portfolio
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.95] tracking-tight text-white mb-6">
            340+ projects.<br />
            17 countries.<br />
            <span className="text-primary">One partner.</span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-white/80 leading-relaxed font-normal mb-10">
            Every project listed below was designed, supplied, installed, tested, or certified by Geosynthetics Africa. 
            Filter by industry, application, product, or country to find reference designs that match your scope — or upload your tender pack for comparables.
          </p>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-b border-white/10 mt-6 bg-black/10 backdrop-blur-sm">
            <div className="p-6 border-r border-b md:border-b-0 border-white/5 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                340<span className="text-primary">+</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">Projects delivered</div>
            </div>
            <div className="p-6 border-r border-b md:border-b-0 border-white/5 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                17
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">African countries</div>
            </div>
            <div className="p-6 border-r border-white/5 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                28<span className="text-primary">M</span> m²
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">Geosynthetics installed</div>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                20<span className="text-primary">+</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">Years experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRIMARY STICKY FILTER BAR ============ */}
      <div className="sticky top-[72px] md:top-[96px] z-20 bg-background border-b-2 border-foreground py-4 shadow-sm">
        <div className="container-page flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="font-display text-[10px] font-bold uppercase tracking-wider text-primary border-r border-border pr-3 hidden sm:block">
              Filter by service ↓
            </div>
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setServiceTypeFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border",
                  serviceTypeFilter === "all"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-surface text-muted-foreground border-border hover:bg-surface-dark"
                )}
              >
                All Projects <span className="text-[9px] opacity-70 ml-1">({counts.all})</span>
              </button>
              <button
                onClick={() => setServiceTypeFilter("supply_install")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border",
                  serviceTypeFilter === "supply_install"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-muted-foreground border-border hover:bg-surface-dark"
                )}
              >
                Supply &amp; Install <span className="text-[9px] opacity-70 ml-1">({counts.supply_install})</span>
              </button>
              <button
                onClick={() => setServiceTypeFilter("supply_only")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border",
                  serviceTypeFilter === "supply_only"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-surface text-muted-foreground border-border hover:bg-surface-dark"
                )}
              >
                Supply Only <span className="text-[9px] opacity-70 ml-1">({counts.supply_only})</span>
              </button>
              <button
                onClick={() => setServiceTypeFilter("services_only")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border",
                  serviceTypeFilter === "services_only"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-surface text-muted-foreground border-border hover:bg-surface-dark"
                )}
              >
                Services Only <span className="text-[9px] opacity-70 ml-1">({counts.services_only})</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex border border-border rounded overflow-hidden h-9">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("px-2.5 flex items-center justify-center border-r border-border text-muted-foreground", viewMode === "grid" && "bg-foreground text-background")}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={cn("px-2.5 flex items-center justify-center border-r border-border text-muted-foreground", viewMode === "map" && "bg-foreground text-background")}
              >
                <Map className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn("px-2.5 flex items-center justify-center text-muted-foreground", viewMode === "list" && "bg-foreground text-background")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex items-center flex-1 lg:flex-none">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-surface border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full lg:w-48 h-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============ SECONDARY DROPDOWN FILTERS ============ */}
      <div className="bg-[#F7F7F7] border-b border-border py-3">
        <div className="container-page flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] uppercase text-muted-foreground">Industry</span>
            <select
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
              className="bg-white border border-border rounded px-2 py-1 text-xs font-semibold cursor-pointer h-7"
            >
              <option value="all">All industries</option>
              {dynamicFacets.industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] uppercase text-muted-foreground">Application</span>
            <select
              value={appFilter}
              onChange={e => setAppFilter(e.target.value)}
              className="bg-white border border-border rounded px-2 py-1 text-xs font-semibold cursor-pointer h-7"
            >
              <option value="all">All applications</option>
              {dynamicFacets.applications.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] uppercase text-muted-foreground">Product</span>
            <select
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              className="bg-white border border-border rounded px-2 py-1 text-xs font-semibold cursor-pointer h-7"
            >
              <option value="all">All products</option>
              {dynamicFacets.products.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] uppercase text-muted-foreground">Country</span>
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="bg-white border border-border rounded px-2 py-1 text-xs font-semibold cursor-pointer h-7"
            >
              <option value="all">All countries</option>
              {dynamicFacets.countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] uppercase text-muted-foreground">Year</span>
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="bg-white border border-border rounded px-2 py-1 text-xs font-semibold cursor-pointer h-7"
            >
              <option value="all">All years</option>
              {dynamicFacets.years.map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] uppercase text-muted-foreground">Scale</span>
            <select
              value={scaleFilter}
              onChange={e => setScaleFilter(e.target.value)}
              className="bg-white border border-border rounded px-2 py-1 text-xs font-semibold cursor-pointer h-7"
            >
              <option value="all">Any size</option>
              <option value="large">Large (&gt;100k m²)</option>
              <option value="medium">Medium (10k - 100k m²)</option>
              <option value="small">Small (&lt;10k m²)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="font-bold uppercase tracking-wider text-primary hover:underline text-[10px] ml-auto flex items-center gap-1 cursor-pointer border-0 bg-transparent"
            >
              Clear filters <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* ============ LIVE COUNTS & ACTIVE FILTER CHIPS ============ */}
      <div className="container-page py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="font-display font-extrabold text-lg text-foreground">
            Showing <span className="text-primary font-black">{filteredCaseStudies.length} projects</span> of {caseStudies.length} total
          </div>
          
          <div className="flex flex-wrap gap-1.5 items-center">
            {serviceTypeFilter !== "all" && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded flex items-center gap-1.5">
                Service: {serviceTypeFilter.replace("_", " ")}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setServiceTypeFilter("all")} />
              </span>
            )}
            {industryFilter !== "all" && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded flex items-center gap-1.5">
                Industry: {industryFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setIndustryFilter("all")} />
              </span>
            )}
            {appFilter !== "all" && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded flex items-center gap-1.5">
                App: {appFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setAppFilter("all")} />
              </span>
            )}
            {productFilter !== "all" && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded flex items-center gap-1.5">
                Product: {productFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setProductFilter("all")} />
              </span>
            )}
            {countryFilter !== "all" && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded flex items-center gap-1.5">
                Country: {countryFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setCountryFilter("all")} />
              </span>
            )}
            {yearFilter !== "all" && (
              <span className="bg-foreground text-background text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded flex items-center gap-1.5">
                Year: {yearFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setYearFilter("all")} />
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-semibold uppercase">Sort by</span>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border border-border rounded px-2.5 py-1 text-xs font-bold bg-white cursor-pointer h-8"
          >
            <option value="recent">Most recent</option>
            <option value="scale">Largest scale</option>
            <option value="featured">Featured</option>
            <option value="country">Country (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ============ PROJECTS GRID ============ */}
      <section className="bg-background">
        <div className="container-page pb-20">
          {viewMode === "map" ? (
            <div className="border border-border rounded-xl p-20 text-center bg-surface/30 min-h-[400px] flex flex-col items-center justify-center">
              <Globe className="h-10 w-10 text-primary mb-3 animate-pulse" />
              <h3 className="font-display text-lg font-bold uppercase mb-1">Pan-African Project Map</h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-4">
                Interactive spatial map of all 340+ projects currently loading. Select grid view to explore list tiles.
              </p>
              <Button size="sm" onClick={() => setViewMode("grid")}>Switch to Grid View</Button>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-3">
              {filteredCaseStudies.map((cs: any) => (
                <Link
                  key={cs.id}
                  to="/projects/$slug"
                  params={{ slug: cs.slug }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border hover:border-foreground bg-card rounded transition"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded mr-3">
                      {cs.service_type === "supply_install" ? "Supply & Install" : cs.service_type === "supply_only" ? "Supply Only" : "Services Only"}
                    </span>
                    <span className="font-display text-sm font-bold uppercase text-foreground">{cs.title}</span>
                    <span className="text-xs text-muted-foreground ml-3">📍 {cs.location}, {cs.country}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs mt-2 sm:mt-0 font-medium">
                    <span className="text-muted-foreground">{cs.scale || "—"}</span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      View <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaseStudies.map((cs: any, idx: number) => {
                // Different visual placeholder gradients for each tile
                const bgGradients = [
                  "from-[#422006] to-[#1c1917]",
                  "from-[#1F2937] to-[#0F172A]",
                  "from-[#14532D] to-[#052E16]",
                  "from-[#1E3A8A] to-[#1E1B4B]",
                  "from-[#7C2D12] to-[#422006]"
                ];
                const bgGradient = bgGradients[idx % bgGradients.length];

                return (
                  <Link
                    key={cs.id}
                    to="/projects/$slug"
                    params={{ slug: cs.slug }}
                    className="group flex flex-col rounded border border-border bg-card overflow-hidden hover:border-foreground transition duration-200"
                  >
                    {/* Visual Photo Area */}
                    <div className="aspect-[16/10] relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${cs.hero_image_url})` }}>
                      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 mix-blend-multiply", bgGradient)} />
                      
                      {/* Service Type Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        {cs.service_type === "supply_install" ? (
                          <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                            Supply &amp; Install
                          </span>
                        ) : cs.service_type === "supply_only" ? (
                          <span className="bg-black border border-primary text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                            Supply Only
                          </span>
                        ) : (
                          <span className="bg-black border border-white text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                            Services Only
                          </span>
                        )}
                      </div>

                      {/* Scale Badge */}
                      {cs.scale && (
                        <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-white/10">
                          {cs.scale}
                        </div>
                      )}

                      {/* Accent highlight on hover */}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
                          {cs.sector || "Sector"} · {cs.project_year || "2024"}
                        </div>
                        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-150 leading-tight mb-2">
                          {cs.title}
                        </h3>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                          <MapPin className="h-3 w-3 text-primary shrink-0" />
                          {cs.location}, {cs.country}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                          {cs.summary}
                        </p>
                      </div>

                      {/* Products Used Tags */}
                      {cs.products_used && Array.isArray(cs.products_used) && cs.products_used.length > 0 && (
                        <div className="border-t border-border/60 pt-4 flex flex-wrap gap-1">
                          {cs.products_used.slice(0, 3).map((p: any, pIdx: number) => (
                            <span key={pIdx} className="bg-surface border border-border/40 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-muted-foreground">
                              {p.name.length > 18 ? p.name.substring(0, 18) + "…" : p.name}
                            </span>
                          ))}
                          {cs.products_used.length > 3 && (
                            <span className="text-[9px] font-bold text-primary self-center ml-1">
                              +{cs.products_used.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {filteredCaseStudies.length === 0 && (
            <div className="text-center py-20 border border-dashed border-border rounded-xl bg-surface/20">
              <Search className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold uppercase mb-1">No reference projects found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                We couldn't find any case studies matching your selected filters. Try broadening your criteria or reset filters.
              </p>
              <Button size="sm" onClick={clearAllFilters}>Reset All Filters</Button>
            </div>
          )}
        </div>
      </section>

      {/* ============ CONTINENT BAND (GSA Pan-African Reach) ============ */}
      <section className="bg-foreground text-background py-16 border-t border-[#2A2A2A]">
        <div className="container-page grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-primary" />
              Pan-African Reach
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold uppercase leading-none text-white mb-4">
              Our footprints.<br />
              <span className="text-primary">Every territory.</span>
            </h2>
            <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-md">
              From the deep mining zones of the West African Gold belt to infrastructure expansions in East Africa, our materials supply, customs operations, and certified field teams cross the continent.
            </p>
            <Link to="/contacts" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1.5">
              Talk to cross-border logistics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[1px] bg-white/10 p-[1px] rounded border border-white/5 overflow-hidden">
              {AFRICAN_COUNTRIES.map((c, i) => (
                <div key={i} className="bg-foreground p-4 hover:bg-white/5 transition flex flex-col justify-between group h-24">
                  <div className="text-2xl">{c.flag}</div>
                  <div className="mt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-white group-hover:text-primary transition">{c.name}</div>
                    <div className="text-[9px] text-primary font-extrabold mt-0.5">{c.count} projects</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Existing GSA Lead BOQ & Partner Bands */}
      <BoqCtaBand />
      <PartnerStrip />
    </>
  );
}
