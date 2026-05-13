import { Link } from "@tanstack/react-router";
import { ShieldCheck, FileCheck, Microscope, BadgeCheck, ClipboardList, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";

export function QAPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality Assurance"
        title="No System Leaves Site Unverified."
        description="Every Geosynthetics Africa system is tested, documented and certified to international standards — GRI, ASTM and ISO."
        image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80"
      >
        <Button asChild size="lg" className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
          <Link to="/contacts">Request QA/QC Documentation</Link>
        </Button>
      </PageHero>
      <section className="bg-background">
        <div className="container-page py-16 md:py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, t: "Standards", d: "GRI, ASTM, ISO and SANS standards applied across every project." },
            { icon: Microscope, t: "Testing Methods", d: "OIT, peel, shear, vacuum box and air pressure testing." },
            { icon: ClipboardList, t: "QA/QC Process", d: "Inspection at every stage — material, weld, install, sign-off." },
            { icon: FileCheck, t: "Documentation", d: "Full traceability — material certs, weld logs, test reports." },
            { icon: BadgeCheck, t: "Certificates", d: "Project handover with complete certification package." },
            { icon: Wrench, t: "Equipment", d: "Calibrated welding and testing equipment, fully maintained." },
          ].map((c) => (
            <div key={c.t} className="rounded border border-border bg-card p-6">
              <c.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>
      <BoqCtaBand />
    </>
  );
}
