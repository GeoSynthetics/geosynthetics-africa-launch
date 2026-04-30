import { createFileRoute } from "@tanstack/react-router";
import { FileText, BookOpen, Video, FileCheck, HelpCircle, Download } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Geosynthetics Africa" },
      { name: "description", content: "Datasheets, installation guides, technical articles, case studies, videos and FAQs." },
      { property: "og:title", content: "Resources — Geosynthetics Africa" },
    ],
  }),
  component: ResourcesPage,
});

const CATEGORIES = [
  { icon: FileText, title: "Datasheets", desc: "Technical specifications for every product." },
  { icon: BookOpen, title: "Installation Guides", desc: "Step-by-step installation procedures." },
  { icon: FileCheck, title: "Case Studies", desc: "Project success stories from across Africa." },
  { icon: Download, title: "Brochures", desc: "Service overviews and capability statements." },
  { icon: Video, title: "Videos", desc: "Installation methods and on-site footage." },
  { icon: HelpCircle, title: "FAQ", desc: "Common questions, answered by our experts." },
];

const FAQ = [
  { q: "How long do HDPE geomembranes last?", a: "Properly installed HDPE liners deliver 50+ year service life under typical containment conditions." },
  { q: "Do you supply outside South Africa?", a: "Yes — Pan-African logistics with regional offices in Ghana, Tanzania and Zimbabwe." },
  { q: "Can you handle BOQ-based bulk supply?", a: "Yes. Upload your BOQ and we'll respond with a complete system quote." },
  { q: "Do you provide third-party testing?", a: "All projects include in-house QA/QC; independent third-party testing is available on request." },
];

function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Technical Library"
        description="Datasheets, installation guides, case studies and engineering references."
      />
      <section className="bg-background">
        <div className="container-page py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="rounded border border-border bg-card p-6 hover:border-primary transition">
              <c.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold uppercase">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-surface">
        <div className="container-page py-16 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-card rounded border border-border">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="px-5">
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <BoqCtaBand />
    </>
  );
}
