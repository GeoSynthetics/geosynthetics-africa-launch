import { Link } from "@tanstack/react-router";
import { Truck, HardHat, ClipboardCheck, PencilRuler, Boxes, Headphones } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { PartnerStrip } from "@/components/site/PartnerStrip";

const SERVICES = [
  { icon: Truck, title: "Supply", desc: "Global sourcing. Local expertise. Best-in-class brands." },
  { icon: HardHat, title: "Installation", desc: "Certified installation teams. Proven methodologies." },
  { icon: ClipboardCheck, title: "QA / QC & Testing", desc: "In-house and third-party testing to international standards." },
  { icon: PencilRuler, title: "Design Support", desc: "Technical design assistance and value engineering." },
  { icon: Boxes, title: "Logistics & Customs", desc: "Pan-African logistics, customs clearance & Certificates of Origin." },
  { icon: Headphones, title: "After Sales Support", desc: "Long-term support, monitoring and warranty management." },
];

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="One Partner. Full Accountability."
        description="From design through certification, our integrated services ensure system performance — not just material delivery."
      >
        <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide">
          <Link to="/contacts">Speak to Technical Team</Link>
        </Button>
      </PageHero>
      <section className="bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded border border-border bg-card p-6 hover:border-primary transition">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-accent text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
