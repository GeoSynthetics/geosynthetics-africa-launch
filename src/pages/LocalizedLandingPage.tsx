import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import {
  LOCALIZED_PAGES,
  UI,
  localizedPath,
  type LocalizedPage,
} from "@/i18n/localized-pages";

const HERO_IMAGE = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80";

type AnyLink = React.ComponentType<{ to: string; className?: string; children: React.ReactNode }>;
const RLink = Link as unknown as AnyLink;

export function LocalizedLandingPage({ page }: { page: LocalizedPage }) {
  const ui = UI[page.lang];
  const { open } = useQuickQuote();
  const isHome = page.slug === "";
  const samePages = LOCALIZED_PAGES.filter((p) => p.lang === page.lang && p.slug !== "");
  const groups = [...new Set(samePages.map((p) => p.group))];
  const related = samePages.filter((p) => p.group === page.group && p.slug !== page.slug);

  return (
    <div lang={page.lang}>
      <PageHero eyebrow={page.eyebrow} title={page.heading} description={page.intro} image={HERO_IMAGE}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            onClick={() => open()}
            className="bg-primary hover:bg-primary-hover text-white font-bold uppercase"
          >
            {ui.quote}
          </Button>
          <Button asChild variant="outline" className="font-bold uppercase bg-transparent text-white border-white/40">
            <a href="mailto:sales@geosyntheticsafrica.com">{ui.contact}</a>
          </Button>
        </div>
      </PageHero>

      <section className="bg-background">
        <div className="container-page py-14 md:py-20 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            {page.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide">{s.heading}</h2>
                {s.body && <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>}
                {s.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {page.faqs.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide">{ui.faqs}</h2>
                <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
                  {page.faqs.map((f) => (
                    <details key={f.q} className="group p-5">
                      <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">
                        {f.q}
                        <span className="text-primary group-open:rotate-45 transition">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold uppercase">{ui.ctaTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ui.ctaBody}</p>
              <Button
                onClick={() => open()}
                className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-bold uppercase"
              >
                {ui.quote}
              </Button>
              <a
                href="mailto:sales@geosyntheticsafrica.com"
                className="mt-3 block text-center text-sm font-semibold text-primary"
              >
                sales@geosyntheticsafrica.com
              </a>
              <a href="tel:+27723430868" className="mt-1 block text-center text-sm text-muted-foreground">
                +27 72 343 0868
              </a>
            </div>

            {!isHome && (
              <RLink
                to={page.enPath}
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-semibold hover:border-primary/50"
              >
                <Globe className="h-4 w-4 text-primary" /> {ui.english}
                <ArrowRight className="h-4 w-4 ml-auto text-primary" />
              </RLink>
            )}

            {!isHome && related.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-sm font-bold uppercase text-muted-foreground">
                  {ui[page.group] || page.group}
                </h3>
                <ul className="mt-3 space-y-2">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <RLink to={localizedPath(p)} className="text-sm hover:text-primary">
                        {p.heading}
                      </RLink>
                    </li>
                  ))}
                </ul>
                <RLink
                  to={`/${page.lang}`}
                  className="mt-4 inline-block text-xs font-bold uppercase text-primary"
                >
                  {ui.groupHome} &rarr;
                </RLink>
              </div>
            )}
          </aside>
        </div>
      </section>

      {isHome && (
        <section className="bg-muted/30 border-t border-border">
          <div className="container-page py-14 space-y-10">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide">{ui.allPages}</h2>
            {groups.map((g) => (
              <div key={g}>
                <h3 className="font-display text-lg font-bold uppercase text-primary">{ui[g] || g}</h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {samePages
                    .filter((p) => p.group === g)
                    .map((p) => (
                      <RLink
                        key={p.slug}
                        to={localizedPath(p)}
                        className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold hover:border-primary/50"
                      >
                        {p.heading}
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </RLink>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
