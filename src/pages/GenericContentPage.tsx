import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  type CompanyPageTemplate,
  DEFAULT_COMPANY_PAGE_TEMPLATES,
} from "@/types/company-page-template";
import { useCompanyPageTemplate } from "@/hooks/use-company-page-templates";

interface GenericContentPageProps {
  slug: string;
  initialTemplate?: CompanyPageTemplate | null;
}

export function GenericContentPage({ slug, initialTemplate }: GenericContentPageProps) {
  const { template: loadedTemplate } = useCompanyPageTemplate(slug, initialTemplate);
  const template = loadedTemplate || initialTemplate || DEFAULT_COMPANY_PAGE_TEMPLATES[slug];

  if (!template) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold uppercase">Page Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested page content has not been published yet.
        </p>
        <Link to="/" className="mt-6 inline-block text-primary text-sm font-semibold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Company", to: "/about" },
    { label: template.title },
  ];

  return (
    <>
      <PageHero
        eyebrow={template.eyebrow}
        title={template.title}
        description={template.heroDescription}
        image={template.heroImage}
        showMesh={true}
      >
        {template.badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/20 text-xs font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" /> {template.badge}
          </span>
        )}
      </PageHero>

      {/* Breadcrumb banner */}
      <div className="bg-surface border-b border-border py-3">
        <div className="container-page">
          <Breadcrumbs items={breadcrumbs} variant="tiny" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-background py-16 md:py-24">
        <div className="container-page max-w-4xl mx-auto space-y-16">
          {template.sections && template.sections.length > 0 ? (
            template.sections.map((section, idx) => (
              <section
                key={section.id || idx}
                className="scroll-mt-24 space-y-6 pb-12 border-b border-border/60 last:border-0 last:pb-0"
              >
                {section.heading && (
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-foreground">
                      {section.heading}
                    </h2>
                    {section.subtitle && (
                      <p className="text-sm font-medium text-primary uppercase tracking-wide">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                )}

                {section.body && (
                  <div className="text-muted-foreground leading-relaxed text-base space-y-4 font-normal">
                    {section.body.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-3 p-3.5 rounded-lg border border-border/80 bg-card hover:border-primary/40 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Content is being drafted for this section.</p>
            </div>
          )}

          {/* Optional Call to Action */}
          {template.cta && template.cta.heading && (
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-card p-8 md:p-10 shadow-lg text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 max-w-xl relative z-10">
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                  {template.cta.heading}
                </h3>
                {template.cta.text && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.cta.text}
                  </p>
                )}
              </div>

              {template.cta.buttonLabel && template.cta.buttonLink && (
                <div className="shrink-0 relative z-10">
                  {template.cta.buttonLink.startsWith("mailto:") ? (
                    <a
                      href={template.cta.buttonLink}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Mail className="h-4 w-4" /> {template.cta.buttonLabel}
                    </a>
                  ) : (
                    <Link
                      to={template.cta.buttonLink}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:scale-[1.02]"
                    >
                      {template.cta.buttonLabel} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
