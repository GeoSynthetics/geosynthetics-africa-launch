import { productImage } from "@/lib/product-imagery";
import { prepareResourceLinks } from "@/lib/resource-links";
import { Link } from "@tanstack/react-router";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteCard } from "@/components/site/QuoteCard";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { serviceDeliveryFor } from "@/data/service-delivery";
import { ServiceSectionBlock } from "@/components/site/ServiceSectionBlock";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";
import { BUSINESS } from "@/lib/business-info";
import { SITE_URL } from "@/lib/site-url";
import { useQuickQuote } from "@/hooks/use-quick-quote";

export function ServicePage({ data }: { data: any }) {
  const { service, templateData, linkedProducts = [] } = data;
  const profile = serviceDeliveryFor(service.slug, templateData?.title || service.label);
  const { open } = useQuickQuote();
  const candidateImage = productImage(templateData?.heroImage);
  const image =
    candidateImage && !candidateImage.includes("images.unsplash.com") ? candidateImage : "";
  const downloads = prepareResourceLinks(
    (templateData?.downloads || []).filter(
      (item: any) =>
        item.url &&
        /^(https?:\/\/|\/resources(?:\/|$)|\/api\/storage\/)/.test(item.url) &&
        !item.url.includes("/object/sign/"),
    ),
  );
  const related = profile.applications
    .map((slug) => APPLICATION_DIRECTORY.find((app) => app.slug === slug))
    .filter(Boolean);
  const sections = [
    ...profile.sections.map((section) => ({ id: section.id, label: section.label })),
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
          {profile.sections.map((section, index) => (
            <ServiceSectionBlock key={section.id} section={section} first={index === 0} />
          ))}
          <section className="border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">
              Why Choose Geosynthetics Africa
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">{profile.why}</p>
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
          {/manufactur|fabrication/i.test(service.slug) && (
            <section className="border-t border-border pt-10 space-y-4">
              <h2 className="font-display text-2xl font-bold uppercase">
                Fabrication inspection checklist
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We set material traceability, dimensions, seam and weld acceptance criteria,
                handling provisions and release records before production, and issue test results
                and certificates against every article we make.
              </p>
              <a
                className="inline-block font-semibold text-primary"
                href="/technical/fabrication-inspection-checklist.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                View and print the fabrication inspection checklist →
              </a>
              <p className="text-xs text-muted-foreground">
                Planning reference; not a completed inspection record or test certificate.
              </p>
            </section>
          )}
          <section id="service-resources" className="scroll-mt-36 border-t border-border pt-10">
            <h2 className="font-display text-2xl font-bold uppercase">
              Technical Resources & Project Submittals
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Download our published resources, or ask us for the current material data, fabrication
              details, installation method and QA/QC plan for your project.
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
              Send us the destination, drawings, quantities and required date, and we will return a
              proposal covering material, delivery and installation.
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
            description="Upload your BOQ or drawings and tell us what you need: supply, manufacturing, delivery or installation."
          />
        </aside>
      </div>
      <PartnerStrip />
      <BoqCtaBand />
    </>
  );
}
