import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { SERVICES } from "@/components/site/mega-menu-data";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const staticSvc = SERVICES.find((s) => s.slug === params.slug);
    const label = staticSvc?.label ?? params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      meta: [
        { title: `${label} — Geosynthetics Africa` },
        { name: "description", content: `Professional ${label.toLowerCase()} services by Geosynthetics Africa.` },
        { property: "og:title", content: `${label} — Geosynthetics Africa` },
      ],
    };
  },
  loader: ({ params }) => {
    const staticSvc = SERVICES.find((s) => s.slug === params.slug);
    const label = staticSvc?.label ?? params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { service: { slug: params.slug, label, icon: staticSvc?.icon || "CheckCircle" } };
  },
  component: ServicePage,
  errorComponent: ({ error }) => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-2xl font-bold uppercase">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase">Service not found</h1>
      <p className="mt-2 text-muted-foreground">That service isn't defined.</p>
      <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
        <Link to="/services">Back to Services</Link>
      </Button>
    </div>
  ),
});

const SERVICE_CONTENT: Record<string, { desc: string; features: string[]; image: string }> = {
  supply: {
    desc: "Global sourcing, local expertise, and best-in-class brands. We supply spec-compliant materials with full traceability.",
    features: ["Specification-controlled material selection", "Direct sourcing from global manufacturers", "Complete documentation and material certificates"],
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1920&q=80",
  },
  installation: {
    desc: "Certified installation teams deploying proven methodologies. Installation is where most systems fail – we eliminate this risk.",
    features: ["IAGI Certified Installer teams", "GRI-GM13 and ASTM compliant procedures", "Specialized deployment in remote environments"],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
  },
  "qa-qc": {
    desc: "In-house and third-party testing to international standards. No system leaves site unverified.",
    features: ["Continuous in-process quality control", "Air pressure, vacuum, and destructive testing", "Comprehensive handover certification packages"],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80",
  },
  "design-support": {
    desc: "Technical design assistance and value engineering to ensure system performance and cost-efficiency.",
    features: ["Application-specific material recommendations", "Value engineering for cost optimization", "System performance modeling"],
    image: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
  },
  logistics: {
    desc: "Pan-African logistics, customs clearance, and certificates of origin. We deliver readiness.",
    features: ["Cross-border transport management", "Customs clearance and import documentation", "Site delivery coordination for remote locations"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
  },
  "after-sales": {
    desc: "Long-term support, monitoring, and warranty management. We stand by our execution.",
    features: ["Post-installation system monitoring", "Maintenance guidelines and support", "Comprehensive warranty management"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
  },
};

function ServicePage() {
  const { service } = Route.useLoaderData();
  const content = SERVICE_CONTENT[service.slug] ?? SERVICE_CONTENT.supply;

  return (
    <>
      <section
        className="bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.4)), url(${content.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-20">
          <nav className="text-xs uppercase tracking-wider text-surface-dark-foreground/70 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/services" className="hover:text-primary">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{service.label}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">{service.label}</h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">
            {content.desc}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Service Capabilities</h2>
            <div className="grid sm:grid-cols-1 gap-4">
              {content.features.map((feature, i) => (
                <div key={i} className="rounded border border-border bg-card p-6 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-display text-lg font-bold uppercase">{feature}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Executed to Geosynthetics Africa's strict quality and performance standards.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded bg-surface-dark text-surface-dark-foreground p-6 sticky top-32">
              <h3 className="font-display text-lg font-bold uppercase">Ready to Execute?</h3>
              <p className="mt-2 text-sm text-surface-dark-foreground/75">
                Engage our team for {service.label.toLowerCase()} on your next project.
              </p>
              <Button asChild className="mt-5 w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
                <Link to="/contacts"><MessageCircle className="h-4 w-4 mr-2" />Request Quote</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/resources"><FileText className="h-4 w-4 mr-2" />View Case Studies</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
