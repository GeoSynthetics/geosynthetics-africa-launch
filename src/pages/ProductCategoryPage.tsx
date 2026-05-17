import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/products.$category";
import { ArrowRight, ChevronRight, Download, CheckCircle2, Factory, ShieldCheck, DraftingCompass, Eye, FileText, BookOpen, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getProductPageContent } from "@/data/product-pages";

export function ProductCategoryPage() {
  const { category } = Route.useLoaderData();
  const content = getProductPageContent(category.slug, category.label);

  const heroImage = content.heroImage;

  return (
    <>
      <section
        className="bg-surface-dark text-surface-dark-foreground relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.95), rgba(10,10,12,0.7)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-page py-16 md:py-24 relative z-10 flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <nav className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-2 mb-6">
              <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/products" className="hover:text-white transition-colors">Geomembranes</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{content.label}</span>
            </nav>
            <h1 className="mt-2 font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white">
              {content.label}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-surface-dark-foreground/80 leading-relaxed border-l-2 border-primary pl-4">
              {content.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide text-white">
                <Link to="/contacts">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-surface-dark uppercase font-bold tracking-wide flex items-center gap-2">
                <Link to="/resources">
                  <Download className="h-4 w-4" /> Download Data Sheet
                </Link>
              </Button>
            </div>
            {content.technicalHighlights && (
              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                {content.technicalHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">{highlight.label}</span>
                    <span className="text-white font-medium text-sm mt-1">{highlight.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="hidden md:block w-1/3">
             <div className="aspect-square bg-surface/10 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm p-4">
                <div className="w-full h-full border border-white/20 rounded relative" style={{
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.8
                }}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-surface-dark/80"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-bold uppercase mb-4 text-foreground flex items-center gap-3">
                <span className="text-primary">|</span> This is a comprehensive description of the {content.label}
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed">
                {content.description.map((paragraph, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-4" : ""}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div>
               <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                 <span className="text-primary">|</span> Common Applications and Engineering Use Cases
               </h2>
               <div className="grid sm:grid-cols-2 gap-4">
                 {content.applications.map((app, i) => (
                   <div key={i} className="border border-border p-5 rounded hover:border-primary/50 transition bg-surface">
                     <h3 className="font-bold text-sm uppercase tracking-wide mb-2">{app.label}</h3>
                     <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                       {app.description || `Ideal for ${app.label.toLowerCase()} environments where long-term durability and resistance to harsh elements is critical.`}
                     </p>
                     <Link to="/applications/$category" params={{ category: app.slug }} className="text-xs font-bold text-primary hover:underline uppercase flex items-center gap-1">
                       Read More <ChevronRight className="h-3 w-3" />
                     </Link>
                   </div>
                 ))}
               </div>
            </div>

            {/* Properties Table */}
            {content.propertiesTable && (
              <div>
                <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                  <span className="text-primary">|</span> Properties & Specifications
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border border-border">
                    <thead className="text-xs text-white uppercase bg-surface-dark font-bold">
                      <tr>
                        {content.propertiesTable.headers.map((h, i) => (
                          <th key={i} className="px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {content.propertiesTable.rows.map((row, i) => (
                        <tr key={i} className="bg-background border-b border-border hover:bg-surface/50">
                          {row.map((cell, j) => (
                            <td key={j} className={cn("px-4 py-3", j === 0 ? "font-medium text-foreground" : "text-muted-foreground")}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Types */}
            {content.types && (
              <div>
                 <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                   <span className="text-primary">|</span> Types of {content.label}
                 </h2>
                 <div className="grid sm:grid-cols-2 gap-4">
                   {content.types.map((type, i) => (
                     <div key={i} className="p-5 border border-border rounded relative group overflow-hidden bg-surface">
                       <div className="absolute top-0 left-0 w-1 h-full bg-primary transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                       <h3 className="font-bold text-sm uppercase tracking-wide mb-2 pl-2 group-hover:pl-4 transition-all">{type.name}</h3>
                       <p className="text-sm text-muted-foreground pl-2 group-hover:pl-4 transition-all">{type.description}</p>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {/* Benefits */}
            {content.benefits && (
              <div>
                 <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                   <span className="text-primary">|</span> Benefits of using {content.label}
                 </h2>
                 <div className="grid sm:grid-cols-2 gap-4">
                   {content.benefits.map((benefit, i) => (
                     <div key={i} className="flex gap-4 p-5 bg-surface border border-border rounded">
                       <div className="w-1 h-10 bg-primary shrink-0 rounded-full"></div>
                       <div>
                         <h3 className="font-bold text-sm uppercase mb-1">{benefit.title}</h3>
                         <p className="text-sm text-muted-foreground">{benefit.description}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {/* FAQs */}
            {content.faqs && (
              <div>
                <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                   <span className="text-primary">|</span> Frequently Asked Questions about {content.label}
                 </h2>
                 <Accordion type="single" collapsible className="w-full">
                   {content.faqs.map((faq, i) => (
                     <AccordionItem key={i} value={`item-${i}`} className="border-border">
                       <AccordionTrigger className="text-left font-bold text-sm uppercase hover:text-primary transition-colors hover:no-underline px-4 bg-surface/50 data-[state=open]:bg-primary/10 data-[state=open]:text-primary rounded-t mt-2">
                         {faq.question}
                       </AccordionTrigger>
                       <AccordionContent className="text-muted-foreground px-4 pt-4 pb-6 leading-relaxed">
                         {faq.answer}
                       </AccordionContent>
                     </AccordionItem>
                   ))}
                 </Accordion>
              </div>
            )}

            {/* Installation Specs */}
            {content.installationSpecs && (
              <div>
                 <h2 className="font-display text-xl font-bold uppercase mb-4 text-foreground flex items-center gap-3">
                   <span className="text-primary">|</span> Specifications for Installing {content.label}
                 </h2>
                 <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground bg-surface p-6 rounded border-l-4 border-primary">
                   {content.installationSpecs.map((spec, i) => (
                     <p key={i} className={i > 0 ? "mt-4" : ""}>{spec}</p>
                   ))}
                 </div>
              </div>
            )}

            {/* General Benefits */}
            <div>
               <h2 className="font-display text-xl font-bold uppercase mb-4 text-foreground flex items-center gap-3">
                 <span className="text-primary">|</span> Benefits of Choosing Our Products
               </h2>
               <ul className="grid sm:grid-cols-2 gap-3">
                 {content.features.map((feature, i) => (
                   <li key={i} className="flex items-start gap-3 p-3 bg-surface rounded">
                     <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                     <span className="text-sm font-medium">{feature}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Projects */}
            {content.projectReferences && (
              <div>
                 <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                   <span className="text-primary">|</span> Projects with {content.label} Across Africa
                 </h2>
                 <div className="grid sm:grid-cols-2 gap-4">
                   {content.projectReferences.map((project, i) => (
                     <div key={i} className="group relative h-40 rounded overflow-hidden cursor-pointer">
                       <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 right-4">
                         <h3 className="text-white font-bold text-sm uppercase tracking-wide">{project.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                           <span className="text-primary text-xs uppercase font-medium">{project.location}</span>
                           <span className="text-white/50 text-xs">|</span>
                           <span className="text-white/70 text-xs">{project.year}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="mt-4">
                   <Link to="/projects" className="text-sm text-primary hover:underline font-bold uppercase tracking-wider flex items-center gap-1">
                     View All Projects <ArrowRight className="h-4 w-4" />
                   </Link>
                 </div>
              </div>
            )}

            {/* BOQ Upload Form */}
            <div>
               <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                 <span className="text-primary">|</span> BOQ Upload to Specific Sales
               </h2>
               <div className="bg-surface p-6 rounded border border-border">
                 <p className="text-sm text-muted-foreground mb-6">
                   Upload your Bill of Quantities (BOQ) for a tailored quotation. Our sales team will review your requirements and provide a competitive pricing schedule.
                 </p>
                 <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs font-bold uppercase tracking-wide text-foreground">Full Name <span className="text-primary">*</span></label>
                       <input type="text" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter your full name" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-bold uppercase tracking-wide text-foreground">Company <span className="text-primary">*</span></label>
                       <input type="text" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Company Name" />
                     </div>
                   </div>
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs font-bold uppercase tracking-wide text-foreground">Email Address <span className="text-primary">*</span></label>
                       <input type="email" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="name@company.com" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-bold uppercase tracking-wide text-foreground">Phone Number</label>
                       <input type="tel" className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="+27 12 345 6789" />
                     </div>
                   </div>
                   <div className="space-y-1 pt-2">
                     <label className="text-xs font-bold uppercase tracking-wide text-foreground">Upload BOQ Document (PDF, Excel) <span className="text-primary">*</span></label>
                     <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition bg-background cursor-pointer">
                       <Download className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                       <span className="text-sm text-muted-foreground block">Click to upload or drag and drop</span>
                     </div>
                   </div>
                   <Button type="submit" className="w-full bg-primary hover:bg-primary-hover font-bold uppercase tracking-wider mt-4">
                     Submit BOQ for Review
                   </Button>
                 </form>
               </div>
            </div>

            {/* Bottom FAQs duplicate from screenshot layout */}
            {content.faqs && (
              <div>
                <h2 className="font-display text-xl font-bold uppercase mb-6 text-foreground flex items-center gap-3">
                   <span className="text-primary">|</span> Explore More Questions about {content.label}
                 </h2>
                 <Accordion type="single" collapsible className="w-full">
                   {content.faqs.slice().reverse().map((faq, i) => (
                     <AccordionItem key={i} value={`more-item-${i}`} className="border-border">
                       <AccordionTrigger className="text-left font-bold text-sm uppercase hover:text-primary transition-colors hover:no-underline px-4 bg-surface/50 data-[state=open]:bg-primary/10 data-[state=open]:text-primary rounded-t mt-2">
                         {faq.question}
                       </AccordionTrigger>
                       <AccordionContent className="text-muted-foreground px-4 pt-4 pb-6 leading-relaxed">
                         {faq.answer}
                       </AccordionContent>
                     </AccordionItem>
                   ))}
                 </Accordion>
              </div>
            )}

          </div>
          
          {/* Sidebar Area */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Get a Quote Card */}
              <div className="rounded bg-surface-dark text-white p-8">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-2">Get a Quote</h3>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                  Start your project with the right materials. Contact our sales team for competitive pricing and availability across Africa.
                </p>
                <Button asChild className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide text-white">
                  <Link to="/contacts">Request a Quote Now</Link>
                </Button>
              </div>

              {/* Quick Links */}
              <div className="rounded border border-border bg-surface p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-3">Quick Links</h3>
                <ul className="space-y-1">
                  <li>
                    <Link to="/catalogue" search={{ q: category.label, cats: [], mans: [], sort: "newest" }} className="flex items-center justify-between p-2 rounded hover:bg-accent hover:text-primary transition text-sm font-medium">
                      Catalogue Products <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources" className="flex items-center justify-between p-2 rounded hover:bg-accent hover:text-primary transition text-sm font-medium">
                      Technical Specifications <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources" className="flex items-center justify-between p-2 rounded hover:bg-accent hover:text-primary transition text-sm font-medium">
                      Installation Guides <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects" className="flex items-center justify-between p-2 rounded hover:bg-accent hover:text-primary transition text-sm font-medium">
                      Case Studies <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/contacts" className="flex items-center justify-between p-2 rounded hover:bg-accent hover:text-primary transition text-sm font-medium">
                      BOQ Upload <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Our Capabilities */}
              <div className="rounded border border-border bg-surface p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-3">Our Capabilities</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <Factory className="h-4 w-4 text-primary" /> Manufacturing Excellence
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Quality Assurance
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <DraftingCompass className="h-4 w-4 text-primary" /> Project Design Support
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium">
                    <Eye className="h-4 w-4 text-primary" /> Site Audits & Inspections
                  </li>
                </ul>
              </div>

              {/* Stats Box */}
              <div className="rounded bg-surface-dark text-white p-6 grid grid-cols-2 gap-4 divide-x divide-white/10 text-center">
                <div className="px-2">
                  <div className="text-3xl font-display font-bold text-primary mb-1">900<span className="text-lg">+</span></div>
                  <div className="text-xs uppercase tracking-widest text-white/70 font-medium">Projects</div>
                </div>
                <div className="px-2">
                  <div className="text-3xl font-display font-bold text-primary mb-1">15<span className="text-lg">+</span></div>
                  <div className="text-xs uppercase tracking-widest text-white/70 font-medium">Countries</div>
                </div>
                <div className="px-2 pt-4 border-t border-white/10 mt-2">
                  <div className="text-3xl font-display font-bold text-primary mb-1">30<span className="text-lg">+</span></div>
                  <div className="text-xs uppercase tracking-widest text-white/70 font-medium">Experts</div>
                </div>
                <div className="px-2 pt-4 border-t border-white/10 mt-2">
                  <div className="text-3xl font-display font-bold text-primary mb-1">20<span className="text-lg">+</span></div>
                  <div className="text-xs uppercase tracking-widest text-white/70 font-medium">Years</div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </section>

      {/* Red Banner Bottom CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-2">Have a project? Partner with us.</h2>
            <p className="text-white/90 text-lg max-w-2xl">
              Get expert engineering support, reliable material supply, and best-in-class installation for your next geosynthetic containment project.
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary uppercase font-bold tracking-wider shrink-0">
            <Link to="/contacts">Talk To Us Today</Link>
          </Button>
        </div>
      </section>

      <PartnerStrip />
    </>
  );
}

