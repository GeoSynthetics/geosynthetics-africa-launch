import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, FileCheck2, Layers, ClipboardList } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { MATERIAL_SELECTION_GUIDES } from "@/data/material-selection";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";
import { useQuickQuote } from "@/hooks/use-quick-quote";

export function TechnicalCentrePage() {
  const [search, setSearch] = useState("");
  const { open } = useQuickQuote();
  const guides = useMemo(() => {
    const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return MATERIAL_SELECTION_GUIDES.filter((guide) => {
      const text = [guide.title, guide.description, ...guide.functions, ...guide.inputs]
        .join(" ")
        .toLowerCase();
      return words.every((word) => text.includes(word));
    });
  }, [search]);
  return (
    <>
      <PageHero
        eyebrow="Select. Specify. Install. Verify."
        title="Geosynthetics Technical Centre"
        description="Practical geosynthetics guidance for African project teams. Compare material functions, prepare a technical enquiry and understand the installation and QA/QC records to request from Geosynthetics Africa."
      />
      <section className="container-page py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Start with the application",
              text: "Find the containment, ground engineering, drainage or erosion-protection system for your project.",
              to: "/applications",
              icon: Layers,
            },
            {
              title: "Review the quality process",
              text: "Understand material traceability, installation inspections, test records and handover responsibilities.",
              to: "/quality-assurance",
              icon: FileCheck2,
            },
            {
              title: "Find technical documents",
              text: "Browse published resources and request the current supplied-grade datasheet or installation guidance.",
              to: "/resources",
              icon: ClipboardList,
            },
          ].map(({ title, text, to, icon: Icon }) => (
            <Link
              key={to}
              to={to as any}
              className="rounded-xl border border-border p-6 hover:border-primary transition"
            >
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="font-display text-xl font-bold uppercase mt-4">{title}</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{text}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-bold">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-14 max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase">Material Selection Guides</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Different materials solve different problems. Use these guides to prepare the inputs for
            a project-specific review, then confirm the supplied grade, performance requirements and
            installation method against the approved design.
          </p>
          <label htmlFor="technical-guide-search" className="block mt-6 mb-2 text-sm font-bold">
            Search materials, functions or project inputs
          </label>
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="technical-guide-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try filtration, chemical exposure, geogrids or dewatering"
              className="w-full border border-border rounded-lg py-3 pl-12 pr-4 bg-card"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
            {guides.length} of {MATERIAL_SELECTION_GUIDES.length} material guides
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {guides.map((guide) => (
            <article
              key={guide.slug}
              id={guide.slug}
              className="scroll-mt-28 border border-border rounded-xl overflow-hidden"
            >
              <div className="bg-surface/50 p-6 md:p-8">
                <div className="flex flex-wrap gap-2">
                  {guide.functions.map((f) => (
                    <span key={f} className="text-xs border border-border rounded-full px-3 py-1">
                      {f}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-2xl font-bold uppercase mt-4">{guide.title}</h2>
                <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
              </div>
              <div className="p-6 md:p-8 grid lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold text-sm">Selection inputs</h3>
                  <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {guide.inputs.map((input) => (
                      <li key={input}>{input}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Installation & site controls</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {guide.installation}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-sm">QA/QC & handover</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {guide.quality}
                  </p>
                </div>
              </div>
              <div className="px-6 md:px-8 pb-8">
                <h3 className="font-bold text-sm">Related applications</h3>
                <div className="flex flex-wrap gap-x-5 gap-y-3 mt-3">
                  {guide.applications.map((slug) => {
                    const app = APPLICATION_DIRECTORY.find((a) => a.slug === slug);
                    return app ? (
                      <Link
                        key={slug}
                        to="/applications/$category"
                        params={{ category: slug }}
                        className="text-sm text-primary underline underline-offset-4"
                      >
                        {app.label}
                      </Link>
                    ) : null;
                  })}
                </div>
                <div className="flex flex-wrap gap-5 items-center mt-6">
                  <Button onClick={() => open(guide.title)}>Discuss {guide.title}</Button>
                  <Link
                    to="/products/$category"
                    params={{ category: guide.slug }}
                    className="text-sm text-primary font-bold"
                  >
                    Explore the material range →
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {!guides.length && (
            <p className="text-muted-foreground">
              No exact match. Try a broader function or send your specification to our technical
              team.
            </p>
          )}
        </div>
        <section className="mt-14 bg-surface rounded-xl border border-border p-6 md:p-10">
          <h2 className="font-display text-3xl font-bold uppercase">
            Prepare Your Technical Enquiry
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            A useful proposal starts with the application and site conditions. Send what you have;
            tell us which items are still awaiting design confirmation.
          </p>
          <ol className="grid md:grid-cols-2 gap-5 mt-6 list-decimal pl-5 text-sm leading-relaxed">
            <li>
              <strong>Project and destination.</strong> Country, nearest town or port, access
              constraints, programme and delivery date.
            </li>
            <li>
              <strong>Design and quantities.</strong> Drawings, BOQ, material grade, dimensions and
              applicable specifications.
            </li>
            <li>
              <strong>Operating conditions.</strong> Chemistry, temperatures, loading, soils, water
              conditions and exposure where relevant.
            </li>
            <li>
              <strong>Scope and acceptance.</strong> Supply, fabrication, freight, installation,
              testing, hold points and handover records required.
            </li>
          </ol>
          <div className="mt-7 flex flex-wrap gap-5 items-center">
            <Button onClick={() => open("Technical specification review")}>
              Upload BOQ or Drawings
            </Button>
            <Link to="/projects" className="text-sm font-bold text-primary">
              Review African project experience →
            </Link>
          </div>
        </section>
      </section>
    </>
  );
}
