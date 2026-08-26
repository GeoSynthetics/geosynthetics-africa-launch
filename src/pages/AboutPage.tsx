import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { MapPin, Phone, Clock, Package } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { GeoGrid, HexCell, DrainageMesh, FiberStrand } from "@/components/site/shapes";
import { useAboutContent } from "@/hooks/use-about-content";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function DynamicCardIcon({ iconName, className }: { iconName: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.ShieldCheck;
  return <IconComponent className={className} />;
}

export function AboutPage() {
  const content = useAboutContent();
  const { hero, accountability, execution, partners, faqs, trademark, contact } = content;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
      />

      {/* One System. One Accountability Section */}
      <section className="relative isolate overflow-hidden bg-background">
        <GeoGrid opacity={0.07} color="var(--primary)" gridSize={8} />
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary">
              {accountability.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {accountability.description}
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accountability.cards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="rounded border border-border bg-card p-8 hover:border-primary transition group flex flex-col justify-start"
              >
                <DynamicCardIcon iconName={card.icon} className="h-10 w-10 text-primary mb-6 shrink-0" />
                <h3 className="font-display text-xl font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pan-African Execution & Philosophy Section */}
      <section className="relative isolate overflow-hidden bg-surface-dark text-surface-dark-foreground">
        <FiberStrand opacity={0.1} color="#ffffff" clusterCount={12} />
        <div className="container-page py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {execution.capabilities.map((cap, idx) => (
              <div key={cap.id || idx}>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">
                  {cap.title}
                </h2>
                <p className="mt-3 text-base text-surface-dark-foreground/80 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
          <div className="relative rounded overflow-hidden aspect-video lg:aspect-square">
            <img
              src={execution.philosophyImage}
              alt={execution.philosophyTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="font-display text-2xl font-bold uppercase text-white mb-2">
                {execution.philosophyTitle}
              </div>
              <p className="text-sm text-white/80 font-semibold uppercase tracking-widest">
                {execution.philosophySubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Supply Partners Section */}
      <section className="relative isolate overflow-hidden bg-background">
        <HexCell count={10} opacity={0.2} color="var(--primary)" spread="wide" />
        <div className="container-page py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
              {partners.title}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {partners.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.partnerNames.map((partner) => (
              <div
                key={partner}
                className="font-display text-3xl font-bold uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="relative isolate overflow-hidden bg-surface py-16 border-t border-border">
        <DrainageMesh opacity={0.06} color="var(--foreground)" lineSpacing={50} />
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold uppercase text-center mb-10">
            {faqs.title}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.items.map((faq, i) => (
              <div key={faq.id || i} className="bg-card border border-border p-6 rounded">
                <h4 className="font-bold text-base mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trademark Banner */}
      <div className="bg-background py-16 border-t border-border">
        <div className="container-page grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase text-primary max-w-sm">
              {trademark.title}
            </h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-foreground block mb-2">
                Trademark Notice
              </span>
              {trademark.trademarkNotice}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-surface-dark text-surface-dark-foreground relative py-16 md:py-24 overflow-hidden border-t border-border/10">
        <div
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `url(${contact.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container-page relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 pr-0 lg:pr-10">
            <div>
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white">
                {contact.title}
              </h2>
              <p className="mt-4 text-surface-dark-foreground/70">
                {contact.subtitle}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white mb-2">
                    {contact.headOfficeTitle}
                  </h4>
                  <a
                    href="https://maps.app.goo.gl/dWqBYitmU8ziMmDd8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-surface-dark-foreground/80 leading-relaxed whitespace-pre-line hover:text-primary transition-colors inline-block cursor-pointer"
                    title="Open location in Google Maps"
                  >
                    {contact.headOfficeAddress}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white mb-2">
                    {contact.contactTitle}
                  </h4>
                  <p className="text-sm text-surface-dark-foreground/80 leading-relaxed whitespace-pre-line">
                    {contact.contactDetails}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white mb-2">
                    {contact.operatingHoursTitle}
                  </h4>
                  <p className="text-sm text-surface-dark-foreground/80 leading-relaxed whitespace-pre-line">
                    {contact.operatingHoursDetails}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Location Map Container */}
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl p-6 md:p-8 flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                    {contact.mapHeading || contact.formHeading || "Store & Office Location"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {contact.mapDescription || contact.formDescription || "Visit our primary head office and logistics hub in Johannesburg."}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative w-full h-[320px] md:h-[360px] rounded-lg overflow-hidden border border-border bg-muted">
              {contact.mapEmbedUrl ? (
                <iframe
                  title="Store location map"
                  src={contact.mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-muted/50">
                  <MapPin className="h-10 w-10 mb-2 text-primary/60" />
                  <p className="text-sm font-semibold">Store Location Map</p>
                  <p className="text-xs mt-1 max-w-xs">{contact.headOfficeAddress}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Explore our full line of geosynthetic products and technical specifications.
              </p>
              <Button
                asChild
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs uppercase tracking-wide px-6 py-2.5 shadow-md transition shrink-0"
              >
                <Link to={contact.catalogButtonUrl || "/catalogue"}>
                  <Package className="mr-2 h-4 w-4" />
                  {contact.catalogButtonText || "View Catalog Products"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PartnerStrip />
    </>
  );
}
