import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { HelpCircle } from "lucide-react";
import { RESOURCE_CATEGORIES, VIDEO_HOST_RE } from "@/lib/resource-categories";

export const Route = createFileRoute("/resources/")(
  {
    head: () => ({
      meta: [
        { title: "Resources — Geosynthetics Africa" },
        { name: "description", content: "Datasheets, installation guides, technical articles, case studies, videos and FAQs." },
        { property: "og:title", content: "Resources — Geosynthetics Africa" },
      ],
    }),
    component: ResourcesIndexPage,
  },
);

const FAQ = [
  { q: "How long do HDPE geomembranes last?", a: "Properly installed HDPE liners deliver 50+ year service life under typical containment conditions." },
  { q: "Do you supply outside South Africa?", a: "Yes — Pan-African logistics with regional offices in Ghana, Tanzania and Zimbabwe." },
  { q: "Can you handle BOQ-based bulk supply?", a: "Yes. Upload your BOQ and we'll respond with a complete system quote." },
  { q: "Do you provide third-party testing?", a: "All projects include in-house QA/QC; independent third-party testing is available on request." },
];

function ResourcesIndexPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("resources")
        .select("type, external_url, status, is_public")
        .eq("status", "published")
        .limit(1000);
      const next: Record<string, number> = {};
      for (const cat of RESOURCE_CATEGORIES) next[cat.slug] = 0;
      for (const r of (data ?? []) as Array<{ type: string; external_url: string | null }>) {
        for (const cat of RESOURCE_CATEGORIES) {
          if (cat.videoOnly) {
            if (r.external_url && VIDEO_HOST_RE.test(r.external_url)) next[cat.slug]++;
          } else if (cat.types.includes(r.type)) {
            next[cat.slug]++;
          }
        }
      }
      setCounts(next);
    })();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Technical Library"
        description="Datasheets, installation guides, case studies and engineering references."
      />
      <section className="bg-background">
        <div className="container-page py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCE_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/resources/$category"
              params={{ category: c.slug }}
              className="group rounded border border-border bg-card p-6 hover:border-primary transition flex flex-col"
            >
              <div className="flex items-start justify-between">
                <c.icon className="h-7 w-7 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
                  {counts[c.slug] ?? 0} {counts[c.slug] === 1 ? "item" : "items"}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold uppercase group-hover:text-primary transition">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
          <div className="rounded border border-border bg-card p-6">
            <HelpCircle className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-display text-lg font-bold uppercase">FAQ</h3>
            <p className="mt-2 text-sm text-muted-foreground">Common questions, answered by our experts.</p>
          </div>
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
