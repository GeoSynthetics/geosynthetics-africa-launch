import { Link } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, FileText, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { Route } from "@/routes/industries.$slug";

export function IndustryPage() {
  const { industry, templateData } = Route.useLoaderData();
  
  const title = templateData?.title || industry.label;
  const description = templateData?.description || `High-performance geosynthetic solutions for the ${industry.label.toLowerCase()} sector.`;
  const heroImage = templateData?.heroImage || "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80";
  
  const challenges = templateData?.content?.challenges || [
    "Strict environmental regulations and compliance",
    "Extreme operating conditions and remote locations",
    "Demand for rapid deployment and cost efficiency"
  ];
  
  const applications = templateData?.content?.applications || [
    "Containment Systems",
    "Erosion Protection",
    "Structural Reinforcement"
  ];

  return (
    <>
      <section
        className="bg-surface-dark text-surface-dark-foreground"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.4)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-20">
          <nav className="text-xs uppercase tracking-wider text-surface-dark-foreground/70 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-surface-dark-foreground/70 uppercase">Industries</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{title}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">{title}</h1>
          <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80">
            {description}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Industry Challenges Solved</h2>
            <div className="space-y-4">
              {challenges.map((challenge: string, i: number) => (
                <div key={i} className="rounded border border-border bg-card p-6 flex items-start gap-4">
                  <Factory className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-display text-lg font-bold">{challenge}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl font-bold uppercase mt-12 mb-6">Key Applications in {title}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {applications.map((app: string, i: number) => (
                <div key={i} className="border-l-2 border-primary pl-4 py-2">
                  <div className="font-bold uppercase text-foreground">{app}</div>
                </div>
              ))}
            </div>
            
            {/* Render any additional custom sections defined in the CMS */}
            {templateData?.content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="mt-12">
                <h2 className="font-display text-2xl font-bold uppercase mb-4">{section.title}</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            ))}
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded bg-surface-dark text-surface-dark-foreground p-6 sticky top-32">
              <h3 className="font-display text-lg font-bold uppercase">Sector Expertise</h3>
              <p className="mt-2 text-sm text-surface-dark-foreground/75">
                Our engineers understand the specific demands of the {title.toLowerCase()} industry.
              </p>
              <Button asChild className="mt-5 w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
                <Link to="/contacts"><MessageCircle className="h-4 w-4 mr-2" />Discuss Your Project</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full bg-transparent border-surface-dark-foreground/30 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide">
                <Link to="/resources"><FileText className="h-4 w-4 mr-2" />Industry Case Studies</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
