import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers, Search } from "lucide-react";
import { resolveIcon } from "@/components/icons/resolve-icon";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { APPLICATION_DIRECTORY, APPLICATION_GROUPS } from "@/data/application-directory";

export function ApplicationsLanding({
  data,
}: {
  data: { templates: Record<string, any>; hierarchy: any };
}) {
  const { templates } = data;
  const landing = templates?.__landing || {};
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return APPLICATION_DIRECTORY.filter((app) => {
      const text = [app.label, app.summary, ...app.uses].join(" ").toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [search]);

  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Geosynthetic Applications Across Africa"
        description="Find the right system for your project: containment, water storage, ground engineering, drainage, erosion protection and sediment management. Geosynthetics Africa connects technical selection, material supply, fabrication, cross-border delivery, installation and documented QA/QC."
        image={landing.heroImage}
      />
      <section className="container-page py-12 md:py-16">
        <div className="max-w-3xl mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase">
            Find Your Application
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Start with the work you need to deliver. Each application explains the system, relevant
            materials, our African delivery scope, installation controls and QA/QC, with a direct
            route to request a proposal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {APPLICATION_GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="border border-border rounded-full px-4 py-2 text-xs font-bold hover:border-primary hover:text-primary transition"
            >
              {group.label}
            </a>
          ))}
        </div>
        <label htmlFor="application-search" className="block font-semibold text-sm mb-2">
          Search by application or project need
        </label>
        <div className="relative max-w-2xl mb-12">
          <Search
            className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="application-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Try TSF, wastewater, geocell, silt fence or vertical drain"
            className="w-full rounded-lg border border-border bg-card py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
            {filtered.length} of {APPLICATION_DIRECTORY.length} applications
          </p>
        </div>
        <div className="space-y-16">
          {APPLICATION_GROUPS.map((group) => {
            const apps = filtered.filter((app) => app.group === group.id);
            if (!apps.length) return null;
            return (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl font-bold uppercase border-l-4 border-primary pl-4 mb-6">
                  {group.label}
                </h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {apps.map((app) => {
                    const Icon = resolveIcon(app.icon, Layers) || Layers;
                    return (
                      <Link
                        key={app.slug}
                        to="/applications/$category"
                        params={{ category: app.slug }}
                        className="group border border-border rounded-xl bg-card p-6 hover:border-primary hover:shadow-lg transition flex flex-col"
                      >
                        <Icon className="h-7 w-7 text-primary mb-4" aria-hidden="true" />
                        <h3 className="font-display text-lg font-bold uppercase leading-tight group-hover:text-primary">
                          {app.label}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                          {app.summary}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-4 border-t border-border pt-3">
                          {app.uses.join(" · ")}
                        </p>
                        <span className="mt-auto pt-5 text-xs font-bold uppercase text-primary inline-flex items-center gap-2">
                          Explore Our Solution <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {!filtered.length && (
            <p className="text-muted-foreground">
              No exact match. Try a broader term, or{" "}
              <Link to="/contacts" className="text-primary underline">
                send your scope to our technical team
              </Link>
              .
            </p>
          )}
        </div>
        <div className="mt-14 rounded-xl border border-border bg-surface p-8">
          <h2 className="font-display text-2xl font-bold uppercase">
            Not Sure Which System You Need?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            Send your drawings, BOQ, site location, operating conditions and required date. We will
            review the material and delivery requirements and prepare a proposal for your scope.
          </p>
          <Link
            to="/contacts"
            className="mt-5 inline-flex items-center gap-2 text-primary font-bold"
          >
            Discuss Your Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
