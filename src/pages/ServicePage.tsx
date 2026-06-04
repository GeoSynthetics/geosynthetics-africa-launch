import { Link } from "@tanstack/react-router";
import { ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Route } from "@/routes/services.$slug";

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

export function ServicePage() {
  const { service, templateData } = Route.useLoaderData();
  
  // Use templateData if available, fallback to basic static content
  const fallbackContent = SERVICE_CONTENT[service.slug] ?? SERVICE_CONTENT.supply;
  
  const title = templateData?.title || service.label;
  const description = templateData?.description || fallbackContent.desc;
  const heroImage = templateData?.heroImage || fallbackContent.image;
  
  // Use `content.features` from DB if available, otherwise use static features
  const features = templateData?.content?.features || fallbackContent.features;

  return (
    <>
      <section
        className="bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.4)), url(${heroImage})`,
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
            <span className="text-primary">{title}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">{title}</h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">
            {description}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Service Capabilities</h2>
            <div className="grid sm:grid-cols-1 gap-4">
              {features.map((feature: string, i: number) => (
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
            
            {/* Render any additional custom sections defined in the CMS */}
            {templateData?.content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="mt-12">
                <h2 className="font-display text-2xl font-bold uppercase mb-4">{section.title}</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            ))}
          </div>
          <aside className="lg:col-span-4">
            <div className="space-y-6 sticky top-32">
              <QuoteCard
                contextLabel={title}
                heading="Request a Service Quote"
                description={`Engage our team for ${title.toLowerCase()} on your next project.`}
              />
              <Button asChild variant="outline" className="w-full uppercase font-bold tracking-wide">
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
