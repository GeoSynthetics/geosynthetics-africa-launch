import { useMemo } from "react";
import { Link, useLoaderData } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";

export function IndustriesLanding() {
  const { templates, hierarchy } = useLoaderData({ from: "/industries/" }) as {
    templates: Record<string, any>;
    hierarchy: any;
  };

  const landing = templates?.["__landing"] || {};
  const heroTitle = landing.title || "High-Performance Geosynthetic Solutions for African Industries";
  const heroDescription = landing.description || "Tailored containment, stabilisation, and erosion control systems engineered for the environmental and operational demands of Africa's key industrial sectors.";
  const heroImage = landing.heroImage || "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80";

  const industriesItems = useMemo(() => {
    if (hierarchy?.items && hierarchy.items.length > 0) {
      return hierarchy.items;
    }
    // Fallback in case hierarchy is missing
    return Object.entries(templates || {})
      .filter(([key]) => key !== "__landing")
      .map(([slug, data]: [string, any]) => ({
        id: slug,
        slug,
        label: data.title || slug,
        icon: "Building2",
        to: "/industries/$slug",
        params: { slug },
      }));
  }, [hierarchy, templates]);

  const industryDetails = (id: string, fallbackLabel: string) => {
    const t = templates?.[id] || {};
    return {
      title: t.title || fallbackLabel,
      description: t.description || "Engineered geosynthetic containment, reinforcement, and drainage solutions for African projects.",
    };
  };

  const resolveIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    if (IconComp) return <IconComp className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />;
    return <Icons.CheckCircle2 className="h-6 w-6 text-primary" />;
  };

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={heroTitle}
        description={heroDescription}
        image={heroImage}
      />
      <section className="bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industriesItems.map((s: any) => {
              const details = industryDetails(s.id || s.slug, s.label);
              return (
                <Link
                  key={s.id || s.slug}
                  to={s.to as any}
                  params={s.params}
                  className="group relative rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-xl" />
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                      {resolveIcon(s.icon || "Building2")}
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-foreground">
                      {details.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {details.description}
                    </p>
                  </div>
                  <div className="mt-6 text-primary text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 group-hover:text-primary-hover transition-colors">
                    Explore Industry <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
