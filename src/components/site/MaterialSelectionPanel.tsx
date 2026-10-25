import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, Factory, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { materialGuideFor } from "@/data/material-selection";
import { PRODUCT_SYSTEMS } from "@/data/product-systems";
import { ServiceSectionBlock } from "@/components/site/ServiceSectionBlock";
import { useQuickQuote } from "@/hooks/use-quick-quote";

export function MaterialSelectionPanel({
  category,
  productName,
}: {
  category?: string;
  productName: string;
}) {
  const guide = materialGuideFor(category);
  const system = guide ? PRODUCT_SYSTEMS[guide.slug] : undefined;
  const { open } = useQuickQuote();
  const [active, setActive] = useState(0);
  if (!guide) return null;

  if (!system) {
    return (
      <section
        id="selection-quality"
        className="scroll-mt-36 rounded-xl border border-border bg-surface/40 p-6 md:p-8"
      >
        <h2 className="font-display text-2xl font-bold uppercase">Specifying {productName}</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground list-disc pl-5">
          {guide.inputs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Button className="mt-6" onClick={() => open(productName)}>
          Request a Technical Proposal
        </Button>
      </section>
    );
  }

  const tab = system.tabs[Math.min(active, system.tabs.length - 1)];
  return (
    <section
      id="selection-quality"
      className="scroll-mt-36 rounded-xl border border-border bg-surface/40 p-5 md:p-8"
    >
      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
        <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> {guide.title}: what we build and
        how
      </div>
      <p className="mt-3 text-sm md:text-base leading-relaxed text-foreground">{system.intro}</p>

      <div
        role="tablist"
        aria-label={guide.title + " details"}
        className="mt-6 -mx-1 flex gap-2 overflow-x-auto pb-2"
      >
        {system.tabs.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={
              "shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide min-h-[40px] transition " +
              (index === active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary hover:text-primary")
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-2">
        <ServiceSectionBlock section={tab} first />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {system.manufactured && system.manufactured.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
              <Factory className="h-4 w-4 text-primary" aria-hidden="true" /> Made in our own
              facility
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {system.manufactured.map((item) => (
                <a
                  key={item.anchor}
                  href={"/services/manufacturing-fabrication#" + item.anchor}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
            <HardHat className="h-4 w-4 text-primary" aria-hidden="true" /> Industries we build for
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {system.industries.map((industry) => (
              <a
                key={industry.slug}
                href={"/industries/" + industry.slug}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
              >
                {industry.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <Button onClick={() => open(productName)}>Request a Technical Proposal</Button>
        {system.install && (
          <a
            href={"/services/" + system.install.slug}
            className="inline-flex gap-2 items-center text-sm font-bold text-primary"
          >
            {system.install.label} <ArrowRight className="h-4 w-4" />
          </a>
        )}
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
