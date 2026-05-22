import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Phone, FileText, ArrowRight, CircleCheck, Award, ShieldCheck, Truck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { APPLICATION_CATEGORIES, SERVICES } from "@/components/site/mega-menu-data";
import heroInstallation from "@/assets/hero-installation.png";
import africaMap from "@/assets/africa.svg";

import { supabase } from "@/integrations/supabase/client";
import { type HomepageContent, DEFAULT_HOMEPAGE_CONTENT } from "@/types/homepage";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [seoRes, hpRes] = await Promise.all([
      supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle(),
      supabase.from("site_config").select("value").eq("key", "homepage_content").maybeSingle(),
    ]);

    const seoMap = (seoRes.data?.value as Record<string, any>) || {};
    return {
      seo: seoMap["/"] || null,
      hp: hpRes.data?.value || null,
    };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "Geosynthetics Africa — Africa's Integrated Geosynthetics Execution Platform";
    const desc = seo?.description || "Designed. Supplied. Installed. Tested. Certified. Complete engineered geosynthetic systems delivered across Africa with global best-in-class materials.";
    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ];
    if (seo?.keywords) {
      meta.push({ name: "keywords", content: seo.keywords });
    }
    return { meta };
  },
  component: HomePage,
});

const STEPS = [
  { num: 1, title: "Design", desc: "We design the right system for your application.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
  { num: 2, title: "Supply", desc: "We source the best materials — brand agnostic.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { num: 3, title: "Install", desc: "Certified installation by experienced specialists.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80" },
  { num: 4, title: "Test", desc: "On-site testing to international standards.", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80" },
  { num: 5, title: "Certify", desc: "Documentation, traceability and certification.", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
];

function HomePage() {
  const loaderData = Route.useLoaderData();
  
  // Cast content safely, merging with defaults
  const content = { ...DEFAULT_HOMEPAGE_CONTENT, ...loaderData?.hp } as HomepageContent;

  const hero = { ...DEFAULT_HOMEPAGE_CONTENT.hero, ...content.hero };
  const trustBadges = content.trustBadges || DEFAULT_HOMEPAGE_CONTENT.trustBadges;
  const engineeredSystems = { ...DEFAULT_HOMEPAGE_CONTENT.engineeredSystems, ...content.engineeredSystems };
  const partners = { ...DEFAULT_HOMEPAGE_CONTENT.partners, ...content.partners };
  const services = { ...DEFAULT_HOMEPAGE_CONTENT.services, ...content.services };
  const presence = { ...DEFAULT_HOMEPAGE_CONTENT.presence, ...content.presence };
  const projects = { ...DEFAULT_HOMEPAGE_CONTENT.projects, ...content.projects };
  const boqBanner = { ...DEFAULT_HOMEPAGE_CONTENT.boqBanner, ...content.boqBanner };

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.55) 50%, rgba(8,8,10,0.2) 100%), url(${hero.bgImage || heroInstallation})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] tracking-tight">
              {hero.headlinePrefix}{" "}
              <span className="text-primary block md:inline">{hero.headlineAccent}</span>{" "}
              {hero.headlineSuffix}
            </h1>
            <p className="mt-6 text-lg md:text-xl font-display uppercase tracking-wide text-surface-dark-foreground/90">
              {hero.tagline}
            </p>
            <p className="mt-4 text-sm md:text-base text-surface-dark-foreground/75 max-w-xl">
              {hero.subtext}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {hero.btn1Text && (
                <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
                  <Link to={hero.btn1Url as any}>
                    <Upload className="mr-2 h-4 w-4" />
                    {hero.btn1Text}
                  </Link>
                </Button>
              )}
              {hero.btn2Text && (
                <Button asChild size="lg" variant="outline" className="bg-transparent border-surface-dark-foreground/40 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                  <Link to={hero.btn2Url as any}>{hero.btn2Text}</Link>
                </Button>
              )}
              {hero.btn3Text && (
                <Button asChild size="lg" variant="outline" className="bg-transparent border-surface-dark-foreground/40 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                  <Link to={hero.btn3Url as any}>
                    <Phone className="mr-2 h-4 w-4" />
                    {hero.btn3Text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-background">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          {trustBadges.map((c, idx) => {
            const defaultIcons = [Award, ShieldCheck, Globe, ShieldCheck];
            const FallbackIcon = defaultIcons[idx % defaultIcons.length];
            return (
              <div key={c.text + idx} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border overflow-hidden shrink-0">
                  {c.icon ? (
                    <img src={c.icon} alt="" className="h-6 w-6 object-contain" />
                  ) : (
                    <FallbackIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wide">
                    {c.text.split(" / ")[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.text.split(" / ")[1] || ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* GSA Difference + 5 step process */}
      <section className="bg-background">
        <div className="container-page py-16 md:py-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">The GSA Difference</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold uppercase leading-tight">
              One System.<br />One Partner.<br />One Accountability.
            </h2>
            <div className="mt-4 h-1 w-16 bg-primary" />
            <p className="mt-5 text-sm text-muted-foreground">
              Unlike product suppliers or installation contractors, we take full responsibility for system performance — from design through to certification.
            </p>
            <Link to="/services" className="mt-6 inline-flex items-center text-sm font-bold uppercase tracking-wider text-primary hover:gap-3 gap-2 transition-all">
              Learn more about GSA <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {STEPS.map((s, i) => (
                <div key={s.num} className="relative">
                  <div className="aspect-[3/4] overflow-hidden rounded">
                    <img src={s.img} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{s.num}</span>
                    <span className="font-display text-sm font-bold uppercase tracking-wide">{s.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-4 top-[35%] h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engineered systems */}
      <section className="bg-surface">
        <div className="container-page py-16 md:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
              {engineeredSystems.sectionTitle}
            </h2>
            <Link to={engineeredSystems.ctaUrl as any} className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-2 hover:gap-3 transition-all">
              {engineeredSystems.ctaText} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {engineeredSystems.cards.map((card) => (
              <Link
                key={card.id}
                to={card.linkUrl as any}
                className="group relative aspect-[3/4] overflow-hidden rounded"
              >
                <img
                  src={card.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-surface-dark-foreground">
                  <div className="font-display text-base font-bold uppercase leading-tight">{card.title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider opacity-80">View System →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner strip */}
      <PartnerStrip
        subtitle={partners.subtitle}
        description={partners.description}
        logos={partners.logos}
      />

      {/* Services + dark verification panel */}
      <section className="bg-background">
        <div className="container-page py-16 md:py-20 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
                {services.sectionTitle}
              </h2>
              <Link to={services.ctaUrl as any} className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-2">
                {services.ctaText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.cards.map((s, idx) => {
                return (
                  <Link key={s.id || idx} to="/services" className="group rounded border border-border bg-background p-5 hover:border-primary transition">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                      {s.icon ? (
                        <img src={s.icon} alt="" className="h-5 w-5 object-contain" />
                      ) : (
                        <CircleCheck className="h-5 w-5" />
                      )}
                    </div>
                    <div className="mt-3 font-display text-sm font-bold uppercase">{s.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div
              className="relative h-full rounded overflow-hidden bg-surface-dark text-surface-dark-foreground p-8"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.92), rgba(10,10,12,0.7)), url(${services.qualityBgImage || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight">
                {services.qualityBoxTitle}
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {services.qualityChecklist.map((b, idx) => (
                  <li key={b + idx} className="flex items-start gap-2">
                    <CircleCheck className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
                <Link to={services.qualityCtaUrl as any}>
                  {services.qualityCtaText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Pan-African */}
      <section className="bg-surface-dark text-surface-dark-foreground">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            {presence.stats.map((s, idx) => (
              <div key={s.id || idx}>
                <div className="font-display text-4xl md:text-5xl font-bold text-surface-dark-foreground">{s.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-primary">{s.label.split(" ")[0]}</div>
                <div className="text-xs text-surface-dark-foreground/70">{s.label.split(" ").slice(1).join(" ")}</div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{presence.presenceTitle}</h3>
            <p className="mt-1 text-sm text-surface-dark-foreground/70">{presence.presenceSubtitle}</p>
            <ul className="mt-5 space-y-2">
              {presence.offices.map((o, idx) => (
                <li key={o.id || idx} className="flex items-center justify-between border-b border-surface-dark-foreground/10 pb-2 text-sm">
                  <span className="font-medium">{o.name}</span>
                  <span className="text-xs uppercase tracking-wider text-surface-dark-foreground/60">{o.type}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 flex flex-col items-center justify-center gap-4">
            <div className="relative w-56">
              <img src={presence.mapAsset || africaMap} alt="" aria-hidden="true" className="w-full h-auto opacity-90" />
              <svg
                viewBox="0 0 512 512"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
              >
                {/* Active country markers (approx. centroids on the 512x512 silhouette) */}
                {[
                  { name: "South Africa", cx: 285, cy: 448 },
                  { name: "Ghana", cx: 190, cy: 228 },
                  { name: "Tanzania", cx: 345, cy: 315 },
                  { name: "Zimbabwe", cx: 310, cy: 388 },
                ].map((m) => {
                  const isActive = presence.offices.some(
                    (office) => office.name.toLowerCase() === m.name.toLowerCase()
                  );
                  if (!isActive) return null;
                  return (
                    <g key={m.name}>
                      {/* Outer pulse ring */}
                      <circle cx={m.cx} cy={m.cy} r="14" fill="var(--primary)" opacity="0.4">
                        <animate attributeName="r" values="14;34;14" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                      {/* Static halo */}
                      <circle cx={m.cx} cy={m.cy} r="18" fill="var(--primary)" opacity="0.2" />
                      {/* Solid center dot with white stroke for contrast */}
                      <circle cx={m.cx} cy={m.cy} r="9" fill="var(--primary)" stroke="white" strokeWidth="2.5" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-surface-dark-foreground/70">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Active Regions
            </div>
          </div>
        </div>
      </section>

      {/* Case studies + catalogue teaser */}
      <section className="bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
              {projects.sectionTitle}
            </h2>
            <Link to={projects.ctaUrl as any} className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-2">
              {projects.ctaText} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-4 gap-5">
            {projects.cards.map((c, idx) => (
              <article key={c.id || idx} className="group rounded overflow-hidden border border-border bg-card lg:col-span-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">{c.tag}</span>
                </div>
                <div className="p-4">
                  <div className="font-display text-base font-bold uppercase">{c.title}</div>
                  <div className="mt-2 text-xs text-muted-foreground">📍 {c.location}</div>
                  <div className="text-xs text-muted-foreground">⚙ {c.systemDetails}</div>
                </div>
              </article>
            ))}
            <div className="rounded bg-surface-dark text-surface-dark-foreground p-6 lg:col-span-1 flex flex-col">
              <h3 className="font-display text-lg font-bold uppercase">{projects.catalogueBoxHeading}</h3>
              <p className="mt-2 text-sm text-surface-dark-foreground/75">
                {projects.catalogueBoxContent}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded bg-surface-dark-foreground/10 px-3 py-2 text-xs">
                <FileText className="h-4 w-4 opacity-60" />
                <span className="opacity-60">{projects.catalogueSearchPlaceholder}</span>
              </div>
              <Button asChild className="mt-auto pt-4 bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
                <Link to={projects.catalogueCtaUrl as any} search={{ q: "", cats: [], mans: [], sort: "newest" } as any}>
                  {projects.catalogueCtaText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BoqCtaBand data={boqBanner} />
    </>
  );
}
