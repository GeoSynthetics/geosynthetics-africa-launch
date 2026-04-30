import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Phone, FileText, ArrowRight, CircleCheck, Award, ShieldCheck, Truck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { APPLICATION_CATEGORIES, SERVICES } from "@/components/site/mega-menu-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Geosynthetics Africa — Africa's Integrated Geosynthetics Execution Platform" },
      { name: "description", content: "Designed. Supplied. Installed. Tested. Certified. Complete engineered geosynthetic systems delivered across Africa with global best-in-class materials." },
      { property: "og:title", content: "Geosynthetics Africa" },
      { property: "og:description", content: "Africa's Integrated Geosynthetics Execution Platform — one partner, full accountability." },
    ],
  }),
  component: HomePage,
});

const APPLICATION_IMAGES: Record<string, string> = {
  "mining-systems": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&q=80",
  "water-containment": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  "waste-landfills": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "roads-infrastructure": "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=600&q=80",
  "erosion-control": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  "drainage-systems": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
};

const HOMEPAGE_APPS = APPLICATION_CATEGORIES.slice(0, 6);

const STEPS = [
  { num: 1, title: "Design", desc: "We design the right system for your application.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
  { num: 2, title: "Supply", desc: "We source the best materials — brand agnostic.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { num: 3, title: "Install", desc: "Certified installation by experienced specialists.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80" },
  { num: 4, title: "Test", desc: "On-site testing to international standards.", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80" },
  { num: 5, title: "Certify", desc: "Documentation, traceability and certification.", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
];

const STATS = [
  { value: "20+", label: "Years", sub: "Industry Experience" },
  { value: "1000+", label: "Projects", sub: "Completed Across Africa" },
  { value: "50+", label: "Countries", sub: "Materials Supplied" },
  { value: "200+", label: "Products", sub: "In Our Catalogue" },
];

const OFFICES = [
  { country: "South Africa", role: "HQ" },
  { country: "Ghana", role: "Regional Office" },
  { country: "Tanzania", role: "Regional Office" },
  { country: "Zimbabwe", role: "Regional Office" },
];

const CASES = [
  { tag: "Reservoir Lining", title: "Danielskuil Reservoir Lining", country: "South Africa", spec: "HDPE Lining System", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" },
  { tag: "TSF Lining", title: "TSF Lining System", country: "Ghana", spec: "HDPE + Geotextile Protection", img: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80" },
  { tag: "Floating Cover", title: "Floating Cover System", country: "Zimbabwe", spec: "15,000 m² Installed", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(8,8,10,0.85) 0%, rgba(8,8,10,0.55) 50%, rgba(8,8,10,0.2) 100%), url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] tracking-tight">
              Africa's Integrated{" "}
              <span className="text-primary block md:inline">Geosynthetics</span>{" "}
              Execution Platform
            </h1>
            <p className="mt-6 text-lg md:text-xl font-display uppercase tracking-wide text-surface-dark-foreground/90">
              Designed. Supplied. Installed. Tested. Certified.
              <br />One Partner. Full Accountability.
            </p>
            <p className="mt-4 text-sm md:text-base text-surface-dark-foreground/75 max-w-xl">
              Complete engineered systems for containment, drainage, reinforcement and protection — delivered across Africa with global best-in-class materials and certified execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
                <Link to="/contacts">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Project BOQ
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-surface-dark-foreground/40 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/contacts">Request Material Supply</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-surface-dark-foreground/40 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/contacts">
                  <Phone className="mr-2 h-4 w-4" />
                  Speak to Technical Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-background">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          {[
            { icon: Award, label: "IAGI Member", sub: "One of only 5 in Africa" },
            { icon: ShieldCheck, label: "B-BBEE Level 2", sub: "Proudly South African" },
            { icon: Globe, label: "Pan-African Logistics", sub: "Supply to all African countries" },
            { icon: ShieldCheck, label: "QA/QC Certified", sub: "Tested. Assured. Certified." },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wide">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.sub}</div>
              </div>
            </div>
          ))}
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
                    <ArrowRight className="hidden md:block absolute -right-2 top-[35%] h-4 w-4 text-primary" />
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
              Engineered Systems for Every Application
            </h2>
            <Link to="/applications" className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-2 hover:gap-3 transition-all">
              View All Applications <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOMEPAGE_APPS.map((app) => (
              <Link
                key={app.slug}
                to="/applications/$category"
                params={{ category: app.slug }}
                className="group relative aspect-[3/4] overflow-hidden rounded"
              >
                <img
                  src={APPLICATION_IMAGES[app.slug] ?? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"}
                  alt={app.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-surface-dark-foreground">
                  <div className="font-display text-base font-bold uppercase leading-tight">{app.label}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider opacity-80">View System →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partner strip */}
      <PartnerStrip />

      {/* Services + dark verification panel */}
      <section className="bg-background">
        <div className="container-page py-16 md:py-20 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
                Our Services
              </h2>
              <Link to="/services" className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-2">
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SERVICES.slice(0, 6).map((s) => (
                <Link key={s.slug} to="/services" className="group rounded border border-border bg-background p-5 hover:border-primary transition">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <CircleCheck className="h-5 w-5" />
                  </div>
                  <div className="mt-3 font-display text-sm font-bold uppercase">{s.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Engineered support, end-to-end.</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div
              className="relative h-full rounded overflow-hidden bg-surface-dark text-surface-dark-foreground p-8"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(10,10,12,0.92), rgba(10,10,12,0.7)), url(https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight">
                No System Leaves Site Unverified.
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Weld Integrity Testing (Vacuum & Air Pressure)",
                  "Material Compliance (GRI/ASTM Standards)",
                  "Material Testing (OIT, Peel, Shear)",
                  "Full Traceability & Documentation",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CircleCheck className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
                <Link to="/quality-assurance">View QA/QC Process <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Pan-African */}
      <section className="bg-surface-dark text-surface-dark-foreground">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl md:text-5xl font-bold text-surface-dark-foreground">{s.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-primary">{s.label}</div>
                <div className="text-xs text-surface-dark-foreground/70">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Pan-African Presence</h3>
            <p className="mt-1 text-sm text-surface-dark-foreground/70">One partner. Africa-wide execution.</p>
            <ul className="mt-5 space-y-2">
              {OFFICES.map((o) => (
                <li key={o.country} className="flex items-center justify-between border-b border-surface-dark-foreground/10 pb-2 text-sm">
                  <span className="font-medium">{o.country}</span>
                  <span className="text-xs uppercase tracking-wider text-surface-dark-foreground/60">{o.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 flex items-center justify-center">
            <svg viewBox="0 0 200 240" className="w-44 h-auto opacity-90" aria-hidden="true">
              <path
                d="M100 10c-12 8-22 6-30 18-8 10 0 22-6 32-6 10-18 12-16 26 2 12 14 16 22 24 4 4 4 14 10 18 6 4 14-2 22 0 8 2 14 14 22 12 12-2 18-14 22-26 4-12-4-20 2-30 4-8 12-14 8-26-4-12-16-12-22-22-6-10-12-22-22-26-4-2-8 0-12 0z"
                fill="rgba(255,255,255,0.08)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
              {[
                { cx: 80, cy: 200 },
                { cx: 60, cy: 110 },
                { cx: 130, cy: 130 },
                { cx: 110, cy: 175 },
              ].map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="var(--primary)" />
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Case studies + catalogue teaser */}
      <section className="bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
              Proven on Projects Across Africa
            </h2>
            <Link to="/resources" className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-2">
              View All Case Studies <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-4 gap-5">
            {CASES.map((c) => (
              <article key={c.title} className="group rounded overflow-hidden border border-border bg-card lg:col-span-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">{c.tag}</span>
                </div>
                <div className="p-4">
                  <div className="font-display text-base font-bold uppercase">{c.title}</div>
                  <div className="mt-2 text-xs text-muted-foreground">📍 {c.country}</div>
                  <div className="text-xs text-muted-foreground">⚙ {c.spec}</div>
                </div>
              </article>
            ))}
            <div className="rounded bg-surface-dark text-surface-dark-foreground p-6 lg:col-span-1 flex flex-col">
              <h3 className="font-display text-lg font-bold uppercase">Explore Our Catalogue</h3>
              <p className="mt-2 text-sm text-surface-dark-foreground/75">
                Search, filter and explore over 200 engineered materials for every application.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded bg-surface-dark-foreground/10 px-3 py-2 text-xs">
                <FileText className="h-4 w-4 opacity-60" />
                <span className="opacity-60">Search products, applications, standards…</span>
              </div>
              <Button asChild className="mt-auto pt-4 bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
                <Link to="/catalogue">View Full Catalogue <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BoqCtaBand />
    </>
  );
}
