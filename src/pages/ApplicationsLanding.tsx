import { useMemo } from "react";
import { Link, useLoaderData } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";

export function ApplicationsLanding() {
  const { templates, hierarchy } = useLoaderData({ from: "/applications/" }) as {
    templates: Record<string, any>;
    hierarchy: any;
  };

  const landing = templates?.["__landing"] || {};
  const heroTitle = landing.title || "Engineered Systems for Every Application";
  const heroDescription = landing.description || "From tailings storage to road stabilisation — full-system solutions, designed and certified for African operating conditions.";
  const heroImage = landing.heroImage || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80";

  const applicationsItems = useMemo(() => {
    if (hierarchy?.items && hierarchy.items.length > 0) {
      return hierarchy.items;
    }
    // Fallback if hierarchy is missing or empty
    return APPLICATION_CATEGORIES.map((c) => ({
      id: c.slug,
      slug: c.slug,
      label: c.label,
      icon: c.icon || "Layers",
    }));
  }, [hierarchy]);

  const categoryDetails = (slug: string, fallbackLabel: string) => {
    const t = templates?.[slug] || {};
    return {
      title: t.title || fallbackLabel,
      description: t.description || `Engineered geosynthetic systems and installation solutions for ${fallbackLabel.toLowerCase()} across Africa.`,
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
        eyebrow="Applications"
        title={heroTitle}
        description={heroDescription}
        image={heroImage}
      />
      <section className="bg-background border-b border-border">
        <div className="container-page py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicationsItems.map((c: any) => {
              const details = categoryDetails(c.slug || c.id, c.label);
              return (
                <Link
                  key={c.slug || c.id}
                  to="/$slug"
                  params={{ slug: c.slug || c.id }}
                  className="group relative rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-xl" />
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                      {resolveIcon(c.icon || "Layers")}
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-wide text-foreground">
                      {details.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {details.description}
                    </p>
                  </div>
                  <div className="mt-6 text-primary text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 group-hover:text-primary-hover transition-colors">
                    Explore System <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
