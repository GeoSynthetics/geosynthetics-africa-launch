import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronDown } from "lucide-react";
import type { ServiceSection } from "@/data/service-delivery";
import { MANUFACTURED_PRODUCTS, MANUFACTURING_PROCESS } from "@/data/manufactured-products";

function SectionShell({
  section,
  first,
  children,
}: {
  section: ServiceSection;
  first: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={section.id}
      className={"scroll-mt-36" + (first ? "" : " border-t border-border pt-10")}
    >
      <h2 className="font-display text-2xl font-bold uppercase">{section.title}</h2>
      {children}
    </section>
  );
}

function Intro({ text }: { text?: string }) {
  return text ? <p className="mt-4 text-muted-foreground leading-relaxed">{text}</p> : null;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="mt-6 grid md:grid-cols-2 gap-4">
      {steps.map((step, index) => (
        <li key={step.title} className="border border-border rounded-xl p-5 bg-surface/30">
          <span className="text-primary font-display text-2xl font-bold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 font-bold text-sm">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="mt-5 divide-y divide-border border border-border rounded-xl overflow-hidden">
      {rows.map((row) => (
        <div key={row.label} className="grid sm:grid-cols-3 gap-1 sm:gap-4 p-4 bg-surface/20">
          <dt className="text-sm font-bold">{row.label}</dt>
          <dd className="sm:col-span-2 text-sm text-muted-foreground leading-relaxed">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ManufacturedProducts() {
  return (
    <div className="mt-6 space-y-3">
      {MANUFACTURED_PRODUCTS.map((product) => (
        <details
          key={product.slug}
          id={"made-" + product.slug}
          className="group border border-border rounded-xl bg-surface/20 open:bg-surface/40"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 min-h-[56px]">
            <span>
              <span className="block font-bold text-sm sm:text-base">{product.name}</span>
              <span className="mt-1 block text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {product.summary}
              </span>
            </span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="grid gap-5 border-t border-border p-5 md:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-primary">
                Raw-material inputs
              </h3>
              <CheckList items={product.inputs} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-primary">
                Our factory QA/QC
              </h3>
              <CheckList items={product.qaqc} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-primary">
                Key specifications
              </h3>
              <dl className="mt-5 space-y-3">
                {product.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-xs font-bold">{spec.label}</dt>
                    <dd className="text-sm text-muted-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {product.link && (
                <a href={product.link} className="mt-4 inline-block text-sm font-bold text-primary">
                  View product and datasheet →
                </a>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

export function ServiceSectionBlock({
  section,
  first,
}: {
  section: ServiceSection;
  first: boolean;
}) {
  switch (section.kind) {
    case "text":
      return (
        <SectionShell section={section} first={first}>
          <p className="mt-5 text-muted-foreground leading-relaxed">{section.body}</p>
          {section.bullets && <CheckList items={section.bullets} />}
        </SectionShell>
      );
    case "steps":
      return (
        <SectionShell section={section} first={first}>
          <Intro text={section.intro} />
          <Steps steps={section.steps} />
        </SectionShell>
      );
    case "list":
      return (
        <SectionShell section={section} first={first}>
          <Intro text={section.intro} />
          <CheckList items={section.items} />
        </SectionShell>
      );
    case "table":
      return (
        <SectionShell section={section} first={first}>
          <Intro text={section.intro} />
          <SpecTable rows={section.rows} />
        </SectionShell>
      );
    case "manufactured-products":
      return (
        <SectionShell section={section} first={first}>
          <Intro text={section.intro} />
          <ManufacturedProducts />
        </SectionShell>
      );
    case "manufacturing-process":
      return (
        <SectionShell section={section} first={first}>
          <Intro text={section.intro} />
          <Steps steps={MANUFACTURING_PROCESS.map((p) => ({ title: p.title, text: p.text }))} />
          <Link
            to="/quality-assurance"
            className="mt-6 inline-flex gap-2 items-center text-primary text-sm font-bold"
          >
            Review our quality process →
          </Link>
        </SectionShell>
      );
  }
}
