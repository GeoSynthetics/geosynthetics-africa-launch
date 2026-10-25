import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteCard } from "@/components/site/QuoteCard";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { serviceDeliveryFor } from "@/data/service-delivery";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";
import { BUSINESS } from "@/lib/business-info";
import { SITE_URL } from "@/lib/site-url";
import { useQuickQuote } from "@/hooks/use-quick-quote";

export function ServicePage({ data }: { data: any }) {
  const { service, templateData, linkedProducts = [] } = data;
  const profile = serviceDeliveryFor(service.slug, templateData?.title || service.label);
  const { open } = useQuickQuote();
  const image =
    templateData?.heroImage && !templateData.heroImage.includes("images.unsplash.com")
      ? templateData.heroImage
      : "";
  const downloads = (templateData?.downloads || []).filter(
    (item: any) =>
      item.url &&
      /^(https?:\/\/|\/resources(?:\/|$)|\/api\/storage\/)/.test(item.url) &&
      !item.url.includes("/object/sign/"),
  );
  const related = profile.applications
    .map((slug) => APPLICATION_DIRECTORY.find((app) => app.slug === slug))
    .filter(Boolean);
  const sections = [
    { id: "service-overview", label: "Overview" },
    { id: "service-inputs", label: "Technical Inputs" },
    { id: "service-installation", label: "Delivery & Installation" },
    { id: "service-quality", label: "QA/QC & Handover" },
    { id: "service-resources", label: "Resources" },
    { id: "quote", label: "Project Enquiry" },
  ];
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Services", url: SITE_URL + "/services" },
          { name: profile.title, url: SITE_URL + "/services/" + service.slug },
        ]}
      />
      <ServiceSchema
        name={profile.title}
        description={profile.summary}
        path={"/services/" + service.slug}
        serviceType={service.label}
        image={image}
      />
      <section
        className="relative bg-surface-dark text-white"
        style={
          image
            ? {
                backgroundImage:
                  "linear-gradient(to right,rgba(15,15,18,.94),rgba(15,15,18,.65)),url(" +
                  image +
                  ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="container-page py-16 md:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Services", to: "/services" },
              { label: profile.title },
            ]}
            variant="primary-bold"
          />
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">
            Geosynthetics Africa · African Project Delivery
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight">
            {profile.title}
          </h1>
          <p className="mt-5 max-w-3xl text-white/85 leading-relaxed border-l-2 border-primary pl-4">
            {profile.summary}
          </p>
          <Button className="mt-7" onClick={() => open(profile.title)}>
            Request a Project Proposal
          </Button>
        </div>
      </section>
      <nav
        aria-label="Service page sections"
        className="sticky top-[72px] z-30 border-b border-border bg-background/95 backdrop-blur-sm"
      >
        <div className="container-page flex gap-7 overflow-x-auto py-4 text-xs uppercase font-bold whitespace-nowrap">
          {sections.map((item) => (
            <a key={item.id} href={"#" + item.id} className="hover:text-primary">
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="container-page py-14 md:py-16 grid lg:grid-cols-12 gap-10 xl:gap-16">
        <div className="lg:col-span-8 space-y-14">
          <section id="service-overview" className="scroll-mt-36">
            <h2 className="font-display text-2xl font-bold uppercase">Our Service Scope</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{profile.scope}</p>
          </section>
          <section id="service-inputs" className="scroll-mt-36 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">
              What We Review Before Quoting
            </h2>
            <ul className="mt-5 space-y-3">
              {profile.inputs.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section id="service-installation" className="scroll-mt-36 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">How We Deliver the Work</h2>
            <ol className="mt-6 grid md:grid-cols-2 gap-5">
              {profile.controls.map((item, index) => (
                <li key={item} className="border border-border rounded-xl p-6 bg-surface/30">
                  <span className="text-primary font-display text-2xl font-bold">0{index + 1}</span>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </section>
          <section id="service-quality" className="scroll-mt-36 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">
              Our QA/QC & Handover Records
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We define inspection responsibilities, applicable tests, acceptance criteria and hold
              points before the relevant work begins. Installer QC is coordinated with the appointed
              engineer and independent CQA team where engaged.
            </p>
            <ul className="mt-5 space-y-3">
              {profile.records.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <FileText className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/quality-assurance"
              className="mt-6 inline-flex gap-2 items-center text-primary text-sm font-bold"
            >
              Review our quality process <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
          <section className="border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">
              Why Choose Geosynthetics Africa
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{profile.why}</p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                {
                  title: "African experience",
                  text: "More than 15 million m² installed and materials supplied to over 30 countries across the Group's delivery footprint.",
                },
                {
                  title: "Coordinated delivery",
                  text: "Material selection, fabrication where required, freight and agreed site responsibilities connected from enquiry to handover.",
                },
                {
                  title: "Reviewable quality",
                  text: "Material identification, relevant inspections, applicable tests and repair close-out compiled for your project team.",
                },
              ].map((item) => (
                <div key={item.title} className="border border-border rounded-lg p-5">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
          {linkedProducts.length > 0 && (
            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold uppercase">
                Relevant Catalogue Products
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {linkedProducts.map((product: any) => (
                  <Link
                    key={product.id || product.slug}
                    to="/catalogue/$slug"
                    params={{ slug: product.slug }}
                    className="border border-border rounded-lg p-5 hover:border-primary"
                  >
                    <h3 className="font-bold text-sm">{product.name}</h3>
                    <span className="mt-3 inline-block text-xs font-bold text-primary">
                      Review product & specification →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {related.length > 0 && (
            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold uppercase">Related Applications</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {related.map(
                  (app) =>
                    app && (
                      <Link
                        key={app.slug}
                        to="/applications/$category"
                        params={{ category: app.slug }}
                        className="border border-border p-5 rounded-lg hover:border-primary"
                      >
                        <h3 className="font-bold text-sm">{app.label}</h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {app.summary}
                        </p>
                      </Link>
                    ),
                )}
              </div>
            </section>
          )}
          <section id="service-resources" className="scroll-mt-36 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">
              Technical Resources & Project Submittals
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Review published resources or request the current material data, fabrication details,
              installation method and inspection plan relevant to your scope.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {downloads.map((item: any, index: number) => (
                <a
                  key={item.url + "-" + index}
                  href={item.url}
                  className="border border-border rounded-lg p-5 hover:border-primary"
                >
                  <span className="font-bold text-sm">{item.label}</span>
                  <span className="block mt-2 text-xs text-muted-foreground">
                    {/\.pdf(?:$|[?#])/i.test(item.url)
                      ? "View PDF document"
                      : "View technical resource"}
                  </span>
                </a>
              ))}
              <Link
                to="/resources"
                className="border border-border rounded-lg p-5 text-sm font-bold text-primary"
              >
                Browse published resources →
              </Link>
              <Link
                to="/technical-centre"
                className="border border-border rounded-lg p-5 text-sm font-bold text-primary"
              >
                Material selection guidance →
              </Link>
            </div>
          </section>
        </div>
        <aside className="lg:col-span-4 space-y-7">
          <div className="rounded-xl border border-border bg-surface/40 p-6">
            <h2 className="font-display text-xl font-bold uppercase">Discuss Your Project</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Send the destination, drawings, quantities and required date. We will review the scope
              and clarify the material, delivery and site requirements.
            </p>
            <a
              href={"tel:" + BUSINESS.telephone.replace(/[^+\d]/g, "")}
              className="mt-5 flex items-center gap-2 text-sm font-bold"
            >
              <Phone className="h-4 w-4 text-primary" />
              +27 72 343 0868
            </a>
            <a
              href={"mailto:" + BUSINESS.email}
              className="mt-3 flex items-center gap-2 text-sm break-all"
            >
              <Mail className="h-4 w-4 text-primary shrink-0" />
              {BUSINESS.email}
            </a>
          </div>
          <QuoteCard
            contextId={service.slug}
            contextLabel={profile.title}
            heading="Request a Project Proposal"
            description="Upload your BOQ or drawings and define the supply, delivery, fabrication or installation scope you need."
          />
        </aside>
      </div>
      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
