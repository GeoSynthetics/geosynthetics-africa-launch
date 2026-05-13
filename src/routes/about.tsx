import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { ShieldCheck, Truck, Cog, CheckCircle2, MapPin, Phone, Mail, Clock } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const { data } = await supabase.from("site_config").select("value").eq("key", "seo_pages").maybeSingle();
    const seoMap = (data?.value as Record<string, any>) || {};
    return { seo: seoMap["/about"] || null };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.title || "About Us — Geosynthetics Africa";
    const desc = seo?.description || "Africa's Only Integrated Geosynthetics Execution Partner.";
    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ];
    if (seo?.keywords) {
      meta.push({ name: "keywords", content: seo.keywords });
    }
    return { meta };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Africa's Only Integrated Geosynthetics Execution Partner"
        description="Geosynthetics Africa is Africa’s only integrated geosynthetic systems execution partner – delivering spec-compliant products, pan-African logistics, and QA/QC-certified installation as one accountable system."
        image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80"
      />

      <section className="bg-background">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary">
              One System. One Accountability.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We exist to eliminate the failure risk created by fragmented delivery models, where material supply, logistics, installation, and quality assurance are separated. We integrate the full geosynthetics lifecycle.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded border border-border bg-card p-8 hover:border-primary transition group">
              <ShieldCheck className="h-10 w-10 text-primary mb-6" />
              <h3 className="font-display text-xl font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                Specification-Controlled Supply
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Geosynthetics Africa controls the integrity of every system from the first input - the material itself. We do not offer alternatives or substitutions. Every product supplied is fully aligned to engineer specifications, manufactured to international standards (GRI, ASTM), and traceable to source.
              </p>
            </div>
            
            <div className="rounded border border-border bg-card p-8 hover:border-primary transition group">
              <Truck className="h-10 w-10 text-primary mb-6" />
              <h3 className="font-display text-xl font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                Integrated Logistics & Execution
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We integrate logistics directly into project execution - ensuring materials, equipment, and installation teams arrive aligned and on schedule. We operate across complex African environments, including remote mining operations and cross-border logistics. We don’t just deliver materials - we deliver execution readiness.
              </p>
            </div>
            
            <div className="rounded border border-border bg-card p-8 hover:border-primary transition group">
              <Cog className="h-10 w-10 text-primary mb-6" />
              <h3 className="font-display text-xl font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                QA/QC-Controlled Installation
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Installation is where most geosynthetic systems fail - not because of materials, but because of execution. We eliminate this risk through controlled installation governed by qualified teams, defined welding procedures, continuous quality control, and independent testing. We don’t install to complete scope - we install to certify performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-dark text-surface-dark-foreground">
        <div className="container-page py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">
                Pan-African Execution Capability
              </h2>
              <p className="mt-3 text-base text-surface-dark-foreground/80 leading-relaxed">
                Operating across the African continent – with proven delivery in Southern, West, East and Central Africa – including remote mining operations and cross-border logistics environments.
              </p>
            </div>
            
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">
                Trusted Where Failure Is Not an Option
              </h2>
              <p className="mt-3 text-base text-surface-dark-foreground/80 leading-relaxed">
                Geosynthetics Africa is one of only five IAGI Installer Members in Africa, trusted by engineers, EPC contractors and asset owners to deliver systems exactly as designed – from specification through to installation sign-off.
              </p>
            </div>
            
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">
                Geosynthetics Africa
              </h2>
              <p className="mt-3 text-base text-surface-dark-foreground/80 leading-relaxed">
                One system and accountable. 100+ proven tracks on QA/QC certified installation delivered for leading mines across Africa.
              </p>
            </div>
          </div>
          <div className="relative rounded overflow-hidden aspect-video lg:aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80" 
              alt="Installation team" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="font-display text-2xl font-bold uppercase text-white mb-2">Our Execution Philosophy</div>
              <p className="text-sm text-white/80 font-semibold uppercase tracking-widest">We do not participate in fragmented delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Our Global Supply Partners</h2>
            <p className="mt-4 text-muted-foreground">
              We are proud to have partnered with globally renowned providers of sustainable and innovative geosynthetics. Our 10+ global partnerships across different product ranges allows us to meet specifications, offer quick delivery turnaround across Africa, and supply exact specs rather than alternatives on projects.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {["Solmax", "Tensar", "Thrace", "Eurobent", "Tiltex"].map(partner => (
              <div key={partner} className="font-display text-3xl font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-surface py-16 border-t border-border">
         <div className="container-page">
            <h2 className="font-display text-2xl font-bold uppercase text-center mb-10">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "Is Geosynthetics Africa an IAGI-Certified Installer?",
                  a: "Geosynthetics Africa is an IAGI Installer Member, ensuring every project meets global geomembrane welding and QA/QC standards. Our teams are factory-trained and certified, guaranteeing professional, leak-free installations that comply with GRI-GM13 and ASTM standards."
                },
                {
                  q: "Where does Geosynthetics Africa operate?",
                  a: "Geosynthetics Africa operates across the continent, with proven delivery in Southern, West, East and Central Africa – including remote mining operations and cross-border logistics environments."
                },
                {
                  q: "What does a '360-Degree Solution' mean?",
                  a: "It means we integrate the full lifecycle of a geosynthetics project: from specification-controlled supply, through to pan-African logistics, and finally QA/QC-certified installation. One partner, full accountability."
                },
                {
                  q: "How is Geosynthetics Africa different from other suppliers?",
                  a: "Geosynthetics Africa is not a reseller — we execute engineered specifications. We do not participate in fragmented delivery models where supply, logistics, and installation are separated."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded">
                  <h4 className="font-bold text-base mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

      <div className="bg-background py-16 border-t border-border">
        <div className="container-page grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase text-primary max-w-sm">
              Your 360° Partner in Lining, Reinforcement & Erosion Control
            </h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-foreground block mb-2">Trademark Notice</span>
              Mirafi® and GSE® are registered trademarks of Solmax. Tensar® is a registered trademark of Tensar International Corporation, a division of CMC. Eurobent® is a registered trademark of Eurobent Sp. z o.o. Geosynthetics Africa (Pty) Ltd supplies these products under authorization and does not claim ownership of any of the above trademarks.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-surface-dark text-surface-dark-foreground relative py-16 md:py-24 overflow-hidden border-t border-border/10">
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="container-page relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10 pr-0 lg:pr-10">
            <div>
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-white">Let's Start a Conversation</h2>
              <p className="mt-4 text-surface-dark-foreground/70">Reach out to our experts to discuss your specific project requirements.</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white mb-2">Head Office</h4>
                  <p className="text-sm text-surface-dark-foreground/80 leading-relaxed">
                    7 Tamar Avenue, Lea Glen<br/>
                    Randburg, Johannesburg, 2191<br/>
                    South Africa
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white mb-2">Contact</h4>
                  <p className="text-sm text-surface-dark-foreground/80 leading-relaxed">
                    E: info@geosynthetics.co.za<br/>
                    Sales: +27 78 1355 926<br/>
                    Admin: +27 11 083 8384
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-white mb-2">Operating Hours</h4>
                  <p className="text-sm text-surface-dark-foreground/80 leading-relaxed">
                    Monday – Friday: 08:00 AM – 17:00 PM<br/>
                    Weekends: Closed on Saturday & Sunday
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded p-6 md:p-8 border border-border shadow-2xl relative z-10">
             <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Name</label>
                    <input className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                    <input className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition" placeholder="john@example.com" type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Company (Optional)</label>
                    <input className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition" placeholder="Company Ltd" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
                    <input className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition" placeholder="+27 00 000 0000" type="tel" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Project</label>
                  <input className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition" placeholder="Project name or location" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Your Message</label>
                  <textarea rows={4} className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm focus:border-primary focus:outline-none transition" placeholder="Tell us about your requirements..."></textarea>
                </div>
                <button type="button" className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wide py-3.5 rounded hover:bg-primary-hover transition mt-2">
                  Submit Request
                </button>
             </form>
          </div>
        </div>
      </section>

      <PartnerStrip />
    </>
  );
}
