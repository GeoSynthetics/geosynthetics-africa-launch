import { useEffect, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/quality-assurance.$slug";
import {
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Microscope,
  BadgeCheck,
  Wrench,
  Award,
  CheckCircle,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Info,
  List,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShieldCheck,
  FileCheck,
  Microscope,
  BadgeCheck,
  Wrench,
  Award,
};

type ContentSection = {
  type: "text" | "checklist" | "numbered" | "callout" | "table";
  heading?: string;
  body?: string;
  items?: string[] | Array<{ title: string; desc: string }>;
  headers?: string[];
  rows?: string[][];
};

export function QADetailPage() {
  const { qaDocument: doc } = Route.useLoaderData();
  const [activeAnchor, setActiveAnchor] = useState("overview");
  const [headerH, setHeaderH] = useState(96);

  useEffect(() => {
    const measure = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height;
      if (h) setHeaderH(Math.round(h));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const contentSections: ContentSection[] = useMemo(() => {
    try {
      return Array.isArray(doc.content_sections) ? doc.content_sections : [];
    } catch {
      return [];
    }
  }, [doc.content_sections]);

  const stats: Array<{ label: string; value: string }> = useMemo(() => {
    try {
      return Array.isArray(doc.stats) ? doc.stats : [];
    } catch {
      return [];
    }
  }, [doc.stats]);

  const industries: string[] = useMemo(() => {
    try {
      return Array.isArray(doc.industries_served) ? doc.industries_served : [];
    } catch {
      return [];
    }
  }, [doc.industries_served]);

  const keyPillars: Array<{ icon: string; title: string; desc: string }> = useMemo(() => {
    try {
      return Array.isArray(doc.key_pillars) ? doc.key_pillars : [];
    } catch {
      return [];
    }
  }, [doc.key_pillars]);

  const ANCHORS = [
    { id: "overview", label: "Overview" },
    ...(contentSections.length > 0 ? [{ id: "qa-framework", label: "QA Framework" }] : []),
    ...(industries.length > 0 ? [{ id: "industries", label: "Industries" }] : []),
    ...(stats.length > 0 ? [{ id: "performance", label: "Performance" }] : []),
    { id: "contact", label: "Get Documentation" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - (headerH + 50);
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handler = () => {
      const threshold = headerH + 80;
      let current = ANCHORS[0]?.id || "overview";
      for (const anchor of ANCHORS) {
        const el = document.getElementById(anchor.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) {
          current = anchor.id;
        } else break;
      }
      setActiveAnchor(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [headerH, ANCHORS]);

  const heroImg = doc.hero_image_url || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80";

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[420px] flex items-end overflow-hidden bg-[#0B0B0C]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        <div className="container-page relative z-10 pb-10 pt-20">
          {/* Breadcrumb */}
          <nav className="text-[10px] font-bold uppercase tracking-widest text-white/55 flex items-center gap-2 mb-5">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <Link to="/quality-assurance" className="hover:text-primary transition-colors">Quality Assurance</Link>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <span className="text-primary truncate max-w-[200px]">{doc.category_name}</span>
          </nav>

          {doc.eyebrow && (
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-primary" />
              {doc.eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.97] tracking-tight max-w-4xl text-white mb-4">
            {doc.hero_title || doc.category_name}
          </h1>
          {doc.hero_body && (
            <p className="max-w-2xl text-sm md:text-base text-white/75 leading-relaxed mb-6">
              {doc.hero_body}
            </p>
          )}

          {/* Key Pillars strip */}
          {keyPillars.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {keyPillars.map((pillar) => {
                const IconComp = ICON_MAP[pillar.icon] || FileCheck;
                return (
                  <div key={pillar.title} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded px-2.5 py-1.5">
                    <IconComp className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">{pillar.title}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-primary hover:bg-primary/90 uppercase font-bold tracking-wide"
            >
              {doc.cta_label || "Request QA Documentation"}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 uppercase font-bold tracking-wide"
            >
              <Link to="/quality-assurance">← All QA Programmes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ STICKY SUBNAV ============ */}
      <nav 
        className="sticky z-20 bg-background border-b border-border shadow-sm"
        style={{ top: `${headerH}px` }}
      >
        <div className="container-page flex items-center overflow-x-auto h-12 no-scrollbar gap-1">
          <div className="font-display text-xs md:text-sm font-extrabold uppercase tracking-wider text-primary border-r border-border pr-4 shrink-0">
            QA Navigator ↓
          </div>
          {ANCHORS.map((a) => (
            <button
              key={a.id}
              onClick={() => scrollTo(a.id)}
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
          <button
            onClick={() => scrollTo("contact")}
            className="ml-auto h-8 px-4 bg-primary text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 rounded hover:bg-primary/95 transition-colors cursor-pointer"
          >
            ↓ Get QA Docs
          </button>
        </div>
      </nav>

      {/* ============ MAIN CONTENT ============ */}
      <main className="bg-background">
        <div className="container-page py-12 grid lg:grid-cols-12 gap-10">
          {/* Left: Main Content */}
          <article className="lg:col-span-8 space-y-14">

            {/* Overview section */}
            <section id="overview" className="scroll-mt-28">
              <h2 className="font-display text-2xl font-bold uppercase mb-4 text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                Overview
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground font-medium border-l-2 border-primary/25 pl-4">
                {doc.short_description}
              </p>

              {/* Key Pillars detailed cards */}
              {keyPillars.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  {keyPillars.map((pillar) => {
                    const IconComp = ICON_MAP[pillar.icon] || FileCheck;
                    return (
                      <div key={pillar.title} className="border border-border bg-card rounded-lg p-4 flex items-start gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-display text-xs font-extrabold uppercase text-foreground mb-1">{pillar.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* QA Framework sections — dynamic from DB */}
            {contentSections.length > 0 && (
              <section id="qa-framework" className="scroll-mt-28 space-y-10">
                <h2 className="font-display text-2xl font-bold uppercase mb-4 text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  QA Framework
                </h2>

                {contentSections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    {section.type === "text" && (
                      <>
                        {section.heading && (
                          <h3 className="font-display text-lg font-bold uppercase text-foreground flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            {section.heading}
                          </h3>
                        )}
                        {section.body && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
                        )}
                      </>
                    )}

                    {section.type === "checklist" && (
                      <>
                        {section.heading && (
                          <h3 className="font-display text-lg font-bold uppercase text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {section.heading}
                          </h3>
                        )}
                        <div className="bg-card border border-border rounded-lg p-5 space-y-2.5">
                          {(section.items as string[]).map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-sm text-foreground leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {section.type === "numbered" && (
                      <>
                        {section.heading && (
                          <h3 className="font-display text-lg font-bold uppercase text-foreground flex items-center gap-2">
                            <List className="h-4 w-4 text-primary" />
                            {section.heading}
                          </h3>
                        )}
                        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-card shadow-sm">
                          {(section.items as Array<{ title: string; desc: string }>).map((item, i) => (
                            <div key={i} className="p-5 flex items-start gap-5 group hover:bg-surface/30 transition">
                              <span className="font-display font-black text-3xl text-primary leading-none shrink-0 mt-0.5">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div>
                                <h4 className="font-display text-sm font-extrabold uppercase text-foreground mb-1">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {section.type === "callout" && (
                      <div className="bg-[#0B0B0C] border-l-4 border-primary p-6 rounded-r border border-[#2A2A2A] relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-primary opacity-20">
                          <Info className="h-8 w-8" />
                        </div>
                        {section.heading && (
                          <h4 className="font-display font-extrabold text-sm uppercase text-primary tracking-wider mb-2">
                            {section.heading}
                          </h4>
                        )}
                        {section.body && (
                          <p className="text-xs text-white/80 leading-relaxed max-w-2xl">{section.body}</p>
                        )}
                      </div>
                    )}

                    {section.type === "table" && section.headers && section.rows && (
                      <>
                        {section.heading && (
                          <h3 className="font-display text-lg font-bold uppercase text-foreground">{section.heading}</h3>
                        )}
                        <div className="overflow-x-auto rounded-xl border border-border bg-card">
                          <table className="w-full text-xs">
                            <thead className="bg-[#1A1A1A] text-white font-bold uppercase">
                              <tr>
                                {section.headers.map((h, j) => (
                                  <th key={j} className="px-4 py-3 text-left">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {section.rows.map((row, i) => (
                                <tr key={i} className="hover:bg-surface/50 transition">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-3 text-muted-foreground">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Industries */}
            {industries.length > 0 && (
              <section id="industries" className="scroll-mt-28 space-y-4">
                <h2 className="font-display text-2xl font-bold uppercase text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Industries Served
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These QA standards and procedures have been successfully applied across the following industries:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {industries.map((industry) => (
                    <span
                      key={industry}
                      className="border border-border bg-surface rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Stats card */}
            {stats.length > 0 && (
              <div id="performance" className="scroll-mt-28 bg-foreground text-background rounded-lg border border-[#2A2A2A] overflow-hidden p-6">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  QA Performance Metrics
                </h3>
                <div className="divide-y divide-white/10">
                  {stats.map((s) => (
                    <div key={s.label} className="py-3 flex items-baseline justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-white/60 leading-tight">{s.label}</span>
                      <span className="font-display font-black text-lg text-primary shrink-0">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div id="contact" className="scroll-mt-28 border border-border bg-card rounded-lg p-6">
              <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center text-primary mb-4">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-foreground mb-2">
                Request QA Documentation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Get the full QA dossier, method statements, test certificates, and as-built documentation for your project.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 uppercase font-bold tracking-wide text-xs">
                <Link to="/contacts">{doc.cta_label || "Request QA Documentation"}</Link>
              </Button>
            </div>

            {/* Key pillars summary */}
            {keyPillars.length > 0 && (
              <div className="border border-border bg-surface/30 rounded-lg p-6">
                <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-4">
                  What We Cover
                </h3>
                <div className="space-y-3">
                  {keyPillars.map((pillar) => {
                    const IconComp = ICON_MAP[pillar.icon] || FileCheck;
                    return (
                      <div key={pillar.title} className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <IconComp className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{pillar.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Back nav */}
            <div className="border border-border rounded-lg p-4">
              <Link
                to="/quality-assurance"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                All QA Programmes
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* ============ STATS BAND ============ */}
      {stats.length > 0 && (
        <section className="bg-foreground text-background border-t border-[#2A2A2A]">
          <div className="container-page py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/10">
              {stats.map((s) => (
                <div key={s.label} className="bg-foreground p-6 hover:bg-white/5 transition">
                  <div className="font-display font-black text-3xl text-primary leading-none mb-1">{s.value}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wide text-white/60 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BoqCtaBand />
    </>
  );
}
