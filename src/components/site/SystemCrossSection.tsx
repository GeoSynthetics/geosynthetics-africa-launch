import { ChevronRight } from "lucide-react";
import type { ApplicationSystem, SystemLayer } from "@/data/application-systems";

const KIND_STYLE: Record<SystemLayer["kind"], { band: string; tag: string }> = {
  load: { band: "bg-muted", tag: "Load" },
  cover: { band: "bg-emerald-700/80", tag: "Cover" },
  barrier: { band: "bg-primary", tag: "Barrier" },
  protection: { band: "bg-sky-700/80", tag: "Protection" },
  drainage: { band: "bg-blue-500/70", tag: "Drainage" },
  reinforcement: { band: "bg-amber-600/85", tag: "Reinforcement" },
  ground: { band: "bg-stone-600/70", tag: "Ground" },
};

export function SystemCrossSection({ system }: { system: ApplicationSystem }) {
  return (
    <section id="system" className="border-t border-border pt-16 scroll-mt-32">
      <h2 className="font-display text-2xl font-bold uppercase mb-3 flex items-center">
        <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
        {system.title}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Layer by layer, top to bottom. We supply every layer marked with a product and install the
        system with our own crews.
      </p>
      <ol className="overflow-hidden rounded-xl border border-border">
        {system.layers.map((layer, index) => {
          const style = KIND_STYLE[layer.kind];
          return (
            <li
              key={layer.name}
              className={
                "grid grid-cols-[10px_1fr] sm:grid-cols-[14px_1fr] bg-card" +
                (index > 0 ? " border-t border-border" : "")
              }
            >
              <span className={style.band} aria-hidden="true" />
              <div className="p-4 sm:flex sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm">{layer.name}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {style.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{layer.role}</p>
                </div>
                {layer.product && (
                  <a
                    href={layer.product.href}
                    className="mt-3 sm:mt-0 inline-flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline min-h-[32px]"
                  >
                    {layer.product.label} <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {system.industries.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
            We build it for
          </span>
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
      )}
    </section>
  );
}
