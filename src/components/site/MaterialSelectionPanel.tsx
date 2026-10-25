import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { materialGuideFor } from "@/data/material-selection";
import { useQuickQuote } from "@/hooks/use-quick-quote";

export function MaterialSelectionPanel({
  category,
  productName,
}: {
  category?: string;
  productName: string;
}) {
  const guide = materialGuideFor(category);
  const { open } = useQuickQuote();
  if (!guide) return null;
  return (
    <section
      id="selection-quality"
      className="scroll-mt-36 rounded-xl border border-border bg-surface/40 p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
        <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> Technical Selection & Project
        Delivery
      </div>
      <h2 className="mt-3 font-display text-2xl font-bold uppercase">Specifying {productName}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Geosynthetics Africa supplies {productName} for African projects, with technical review,
        delivery and agreed fabrication or installation services coordinated around your
        specification.
      </p>
      <h3 className="mt-6 font-bold text-sm">Information our technical team reviews</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground list-disc pl-5">
        {guide.inputs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="font-bold text-sm">Installation controls</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.installation}</p>
        </div>
        <div>
          <h3 className="font-bold text-sm">QA/QC & handover records</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.quality}</p>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Your proposal identifies the supplied grade, quantities, destination, availability, agreed
        site scope, inspections and handover records. Product-specific acceptance criteria follow
        the approved specification and current supplied-grade documentation.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <Button onClick={() => open(productName)}>Request a Technical Proposal</Button>
        <Link
          to="/technical-centre"
          hash={guide.slug}
          className="inline-flex gap-2 items-center text-sm font-bold text-primary"
        >
          Selection guidance <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
