import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/projects.index";
import { MapPin, ChevronRight, Grid, List, ArrowUpDown, ArrowRight } from "lucide-react";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

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

interface ProductUsed {
  name: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  summary: string;
  service_type: string;
  scale?: string;
  hero_image_url: string;
  sector?: string;
  project_year?: number;
  created_at: string;
  products_used?: ProductUsed[];
}

export function ProjectsPage() {
  const { caseStudies = [], landingContent } = (Route.useLoaderData() || {}) as {
    caseStudies: CaseStudy[];
    landingContent: any;
  };

  const landing = landingContent || {};
  const heroTitle = landing.title || "340+ projects.\n17 countries.\nOne partner.";
  const heroDescription =
    landing.description ||
    "Every project listed below was designed, supplied, installed, tested, or certified by Geosynthetics Africa. Filter by industry, application, product, or country to find reference designs that match your scope — or upload your tender pack for comparables.";
  const heroImage = landing.heroImage || "";

  // --- Display States ---
  const [sortOption, setSortOption] = useState("recent"); // 'recent', 'scale', 'featured', 'country'
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // --- Apply Sort ---
  const filteredCaseStudies = useMemo(() => {
    const result = [...caseStudies];

    // Sorting
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
      return (
        (b.project_year || 0) - (a.project_year || 0) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return result;
  }, [caseStudies, sortOption]);

  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section
        className={cn(
          "relative text-white pt-10 pb-12 overflow-hidden border-b border-[#2A2A2A]",
          heroImage
            ? "bg-surface-dark"
            : "bg-gradient-to-br from-[#0B0B0C] via-[#161515] to-[#121111]",
        )}
        style={
          heroImage
            ? {
                backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.9), rgba(10,10,12,0.55)), url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Decorative elements */}
        {!heroImage && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(228,30,43,0.06),_transparent_65%)] pointer-events-none filter blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </>
        )}

        <div className="container-page relative z-10">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Projects" }]} variant="tiny" />
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-primary" />
            Project Portfolio
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.95] tracking-tight text-white mb-6 whitespace-pre-line">
            {heroTitle}
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-white/80 leading-relaxed font-normal mb-10">
            {heroDescription}
          </p>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-b border-white/10 mt-6 bg-black/10 backdrop-blur-sm">
            <div className="p-6 border-r border-b md:border-b-0 border-white/5 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                340<span className="text-primary">+</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                Projects delivered
              </div>
            </div>
            <div className="p-6 border-r border-b md:border-b-0 border-white/5 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                17
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                African countries
              </div>
            </div>
            <div className="p-6 border-r border-white/5 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                28<span className="text-primary">M</span> m²
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                Geosynthetics installed
              </div>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="font-display font-black text-3xl md:text-4xl text-white leading-none mb-1">
                20<span className="text-primary">+</span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                Years experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LIVE COUNTS, VIEW MODE & SORTING ============ */}
      <div className="container-page py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
        <div className="font-display font-extrabold text-lg text-foreground">
          Showing{" "}
          <span className="text-primary font-black">{filteredCaseStudies.length} projects</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {/* View Mode Switcher */}
          <div className="flex border border-border rounded overflow-hidden h-8">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 flex items-center justify-center border-r border-border text-muted-foreground",
                viewMode === "grid" && "bg-foreground text-background",
              )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-2.5 flex items-center justify-center text-muted-foreground",
                viewMode === "list" && "bg-foreground text-background",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Option Select */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-semibold uppercase">Sort by</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-border rounded px-2.5 py-1 text-xs font-bold bg-white cursor-pointer h-8"
            >
              <option value="recent">Most recent</option>
              <option value="scale">Largest scale</option>
              <option value="featured">Featured</option>
              <option value="country">Country (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============ PROJECTS GRID ============ */}
      <section className="bg-background">
        <div className="container-page pb-20">
          {viewMode === "list" ? (
            <div className="space-y-3">
              {filteredCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  to="/projects/$slug"
                  params={{ slug: cs.slug }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border hover:border-foreground bg-card rounded transition"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded mr-3">
                      {cs.service_type === "supply_install"
                        ? "Supply & Install"
                        : cs.service_type === "supply_only"
                          ? "Supply Only"
                          : "Services Only"}
                    </span>
                    <span className="font-display text-sm font-bold uppercase text-foreground">
                      {cs.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-3">
                      📍 {cs.location}, {cs.country}
                    </span>
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
              {filteredCaseStudies.map((cs, idx) => {
                // Different visual placeholder gradients for each tile
                const bgGradients = [
                  "from-[#422006] to-[#1c1917]",
                  "from-[#1F2937] to-[#0F172A]",
                  "from-[#14532D] to-[#052E16]",
                  "from-[#1E3A8A] to-[#1E1B4B]",
                  "from-[#7C2D12] to-[#422006]",
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
                    <div
                      className="aspect-[16/10] relative overflow-hidden bg-cover bg-center"
                      style={{ backgroundImage: `url(${cs.hero_image_url})` }}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br opacity-80 mix-blend-multiply",
                          bgGradient,
                        )}
                      />

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
                      {cs.products_used &&
                        Array.isArray(cs.products_used) &&
                        cs.products_used.length > 0 && (
                          <div className="border-t border-border/60 pt-4 flex flex-wrap gap-1">
                            {cs.products_used.slice(0, 3).map((p, pIdx) => (
                              <span
                                key={pIdx}
                                className="bg-surface border border-border/40 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-muted-foreground"
                              >
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
              <h3 className="font-display text-lg font-bold uppercase mb-1">
                No reference projects found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                We couldn't find any case studies.
              </p>
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
              Our footprints.
              <br />
              <span className="text-primary">Every territory.</span>
            </h2>
            <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-md">
              From the deep mining zones of the West African Gold belt to infrastructure expansions
              in East Africa, our materials supply, customs operations, and certified field teams
              cross the continent.
            </p>
            <Link
              to="/contacts"
              className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1.5"
            >
              Talk to cross-border logistics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[1px] bg-white/10 p-[1px] rounded border border-white/5 overflow-hidden">
              {AFRICAN_COUNTRIES.map((c, i) => (
                <div
                  key={i}
                  className="bg-foreground p-4 hover:bg-white/5 transition flex flex-col justify-between group h-24"
                >
                  <div className="text-2xl">{c.flag}</div>
                  <div className="mt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-white group-hover:text-primary transition">
                      {c.name}
                    </div>
                    <div className="text-[9px] text-primary font-extrabold mt-0.5">
                      {c.count} projects
                    </div>
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
