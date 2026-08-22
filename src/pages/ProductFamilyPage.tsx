import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/products.$category.$family";
import { ChevronRight, Download, FileText, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { splitIntoParagraphs, cn } from "@/lib/utils";
import { QuoteCard } from "@/components/site/QuoteCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

import { mockProductFamilyData as mockData } from "@/mocks/productFamilyMocks";
function mapFamilyData(
  familyData: any,
  category: string,
  family: string,
  dynamicCaseStudies?: any[],
) {
  if (!familyData) return null;

  return {
    title: familyData.label || familyData.title || "",
    heroImage: familyData.heroImage || familyData.heroImageUrl || "",
    subtitle: familyData.subtitle || "",
    stats: familyData.stats || {
      projects: "1 of 5",
      countries: "30+",
      experts: "One scope",
      years: "100%",
    },
    technicalSpecText: Array.isArray(familyData.description)
      ? familyData.description.join("\n\n")
      : familyData.technicalSpecText || "",
    typicalValues: (familyData.technicalHighlights || familyData.typicalValues || []).map(
      (val: any) => ({
        label: val.label || "",
        value: val.value || "",
        unit: val.unit || "",
      }),
    ),
    properties: familyData.propertiesTable ||
      familyData.properties || {
        headers: ["PROPERTIES"],
        rows: [],
      },
    popularCatalogue: (familyData.popularProducts || familyData.popularCatalogue || []).map(
      (item: any) => ({
        name: item.name || "",
        spec: item.spec || item.desc || "",
        image:
          item.image || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
        slug: item.slug || "",
      }),
    ),
    relatedProductGroups:
      familyData.relatedProductGroups && familyData.relatedProductGroups.length > 0
        ? familyData.relatedProductGroups
        : [
            { name: "HDPE Geomembranes", slug: "hdpe-geomembranes" },
            { name: "LLDPE Geomembranes", slug: "lldpe-geomembranes" },
            { name: "PVC Geomembranes", slug: "pvc-geomembranes" },
            { name: "EPDM Geomembranes", slug: "epdm-geomembranes" },
            { name: "PP Geomembranes", slug: "pp-geomembranes" },
          ]
            .filter((item) => item.slug !== family)
            .map((item) => ({
              name: item.name,
              link: `/products/${category}/${item.slug}`,
            })),
    questions: (familyData.faqs || familyData.questions || []).map((item: any) => ({
      q: item.question || item.q || "",
      a: item.answer || item.a || "",
    })),
    installationSpecs: Array.isArray(familyData.installationSpecs)
      ? familyData.installationSpecs.join("\n\n")
      : familyData.installationSpecs || "",
    projects:
      dynamicCaseStudies && dynamicCaseStudies.length > 0
        ? dynamicCaseStudies.map((cs: any) => ({
            name: cs.title || "",
            location: `${cs.location}, ${cs.country}`,
            image:
              cs.hero_image_url ||
              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
            slug: cs.slug || "",
          }))
        : (familyData.projectReferences || familyData.projects || []).map((proj: any) => ({
            name: proj.name || "",
            location: proj.location || "",
            image:
              proj.image ||
              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
            slug: proj.slug || proj.project_slug || "",
          })),
    applications: Array.isArray(familyData.applications)
      ? familyData.applications.map((app: any) => {
          if (typeof app === "string") {
            return {
              label: app,
              slug: app
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
            };
          }
          return { label: app.label || "", slug: app.slug || "" };
        })
      : [
          { label: "Mining (Heap Leach Pads, Tailings Impoundments)", slug: "mining-systems" },
          { label: "Environmental (Landfill Basal Lining, Capping)", slug: "waste-landfills" },
          { label: "Water (Reservoirs, Dams, Canals, Ponds)", slug: "water-containment" },
          {
            label: "Roads & Infrastructure (Subgrade Stabilization)",
            slug: "roads-infrastructure",
          },
        ],
    industries:
      familyData.industries && familyData.industries.length > 0
        ? familyData.industries.map((ind: any) => ({
            label: ind.label || "",
            slug: ind.slug || "",
          }))
        : [
            { label: "Mining", slug: "mining" },
            { label: "Water Management", slug: "water-management" },
            { label: "Construction & Infrastructure", slug: "construction-infrastructure" },
          ],
  };
}

export function ProductFamilyPage() {
  const { category, family, familyData, dynamicCaseStudies } = Route.useLoaderData();

  const data = (
    familyData ? mapFamilyData(familyData, category, family, dynamicCaseStudies) : mockData
  ) as typeof mockData & { heroImage?: string };
  const heroImage = (data as any).heroImage || "";
  const [activeSection, setActiveSection] = useState<string>("description");

  useEffect(() => {
    if (!familyData) {
      console.warn(
        "TODO: Replace `mockData` in ProductFamilyPage with dynamic content via the Site Builder / Database.",
      );
    }
  }, [familyData]);

  useEffect(() => {
    const sectionIds = [
      "description",
      "specifications",
      "faqs",
      "projects",
      "documents",
      "applications",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // offset for header + sticky nav

      let currentSection = "description";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + window.pageYOffset;
          if (scrollPosition >= top - 20) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dynamicFamilyName = family
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .toUpperCase();
  const dynamicCategoryName = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .toUpperCase();

  // Helper for scroll spy / sticky nav active state
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 140; // Approx header + sticky nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background relative">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://geosynthetics.co.za" },
          { name: "Products", url: "https://geosynthetics.co.za/products" },
          { name: dynamicCategoryName, url: `https://geosynthetics.co.za/products/${category}` },
          {
            name: data.title || dynamicFamilyName,
            url: `https://geosynthetics.co.za/products/${category}/${family}`,
          },
        ]}
      />
      {/* Hero Section */}
      <section
        className="bg-surface-dark text-white relative"
        style={
          heroImage
            ? {
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50 z-0"></div>
        <div className="container-page py-16 md:py-24 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Products", to: "/products" },
                { label: dynamicCategoryName, to: "/products/$category", params: { category } },
                { label: dynamicFamilyName },
              ]}
              variant="primary-bold"
            />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
              {data.title}
            </h1>
            <p className="mt-6 text-base text-white/80 leading-relaxed border-l-2 border-primary pl-4">
              {data.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide text-white"
                onClick={() => {
                  document
                    .getElementById("quote")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Get a Quote
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white hover:text-surface-dark uppercase font-bold tracking-wide"
              >
                <Link to="/resources">View Spec Sheet</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-md aspect-video bg-surface-dark rounded overflow-hidden border border-white/10 shadow-2xl">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={data.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-surface-dark via-surface-dark/50 to-transparent"></div>
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="border-t border-white/10 relative z-10 bg-black/20">
          <div className="container-page grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <Link
              to="/$slug"
              params={{ slug: "supply" }}
              className="py-6 px-4 text-center hover:bg-white/5 transition-all duration-200 cursor-pointer block group"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-primary uppercase transition-transform duration-200 group-hover:scale-105">
                Supply
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 font-medium mt-1">
                Direct Sourcing
              </div>
            </Link>
            <Link
              to="/$slug"
              params={{ slug: "logistics" }}
              className="py-6 px-4 text-center hover:bg-white/5 transition-all duration-200 cursor-pointer block group"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-primary uppercase transition-transform duration-200 group-hover:scale-105">
                30+
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 font-medium mt-1">
                Country Delivery
              </div>
            </Link>
            <Link
              to="/$slug"
              params={{ slug: "installation" }}
              className="py-6 px-4 text-center hover:bg-white/5 transition-all duration-200 cursor-pointer block group"
            >
              <div className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-primary uppercase transition-transform duration-200 group-hover:scale-105 leading-none md:leading-normal">
                IAGI-Aligned
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 font-medium mt-1">
                Installation
              </div>
            </Link>
            <Link
              to="/quality-assurance"
              className="py-6 px-4 text-center hover:bg-white/5 transition-all duration-200 cursor-pointer block group"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-primary uppercase transition-transform duration-200 group-hover:scale-105">
                Quality
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/70 font-medium mt-1">
                Assurance
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-[70px] z-40 bg-surface border-b border-border shadow-sm">
        <div className="container-page">
          <ul className="flex items-center overflow-x-auto no-scrollbar gap-8">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "documents", label: "Documents" },
              { id: "applications", label: "Applications & Industries" },
              { id: "projects", label: "Projects" },
              { id: "faqs", label: "FAQs" },
            ].map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={cn(
                    "block py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap",
                    activeSection === link.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-primary hover:border-primary",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-page py-16 grid lg:grid-cols-12 gap-16">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-20">
          {/* Section: Description */}
          <section id="description">
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Technical Specification of {data.title}
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed">
              {splitIntoParagraphs(data.technicalSpecText).map((para, idx) => (
                <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                  {para}
                </p>
              ))}
            </div>

            <h3 className="font-bold text-sm uppercase tracking-widest text-foreground mt-10 mb-6">
              Typical Values for {dynamicCategoryName}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(data.typicalValues || []).map((val: any, idx: number) => (
                <div key={idx} className="bg-surface border border-border p-5 rounded text-center">
                  <div className="text-xs font-bold uppercase text-muted-foreground mb-2">
                    {val.label}
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">
                    {val.value}
                    {val.unit && <span className="text-sm text-primary ml-1">{val.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Properties & Dimensions */}
          <section id="specifications">
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Properties & Dimensions
            </h2>
            <div className="overflow-x-auto bg-surface border border-border rounded">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white uppercase bg-surface-dark font-bold">
                  <tr>
                    {(data.properties?.headers || mockData.properties.headers).map(
                      (h: string, i: number) => (
                        <th key={i} className="px-4 py-4 whitespace-nowrap">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(data.properties?.rows || mockData.properties.rows).map(
                    (row: string[], i: number) => (
                      <tr key={i} className="hover:bg-accent/50 transition-colors">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-4 py-3 ${j === 0 ? "font-bold text-foreground" : "text-muted-foreground whitespace-nowrap"}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link
                to="/resources"
                className="text-primary hover:underline font-bold text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Full Technical Datasheet for {data.title}{" "}
                (PDF)
              </Link>
            </div>
          </section>

          {/* Section: Popular Catalogue Items */}
          <section>
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Popular Catalogue Items
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {(data.popularCatalogue || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="group border border-border bg-surface rounded overflow-hidden flex flex-col hover:border-primary transition-colors"
                >
                  <div className="aspect-square bg-surface-dark overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-sm uppercase tracking-wide text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <span className="text-xs text-primary font-medium">{item.spec}</span>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      {item.slug ? (
                        <Link
                          to="/catalogue/$slug"
                          params={{ slug: item.slug }}
                          className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition flex items-center gap-1"
                        >
                          View Product <ArrowRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Link
                          to="/catalogue"
                          search={{ q: item.name, cats: [], mans: [], sort: "relevant" }}
                          className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition flex items-center gap-1"
                        >
                          View Product <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Related Product Groups */}
          <section>
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Related Product Groups
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {(data.relatedProductGroups || []).map((group: any, idx: number) => (
                <Link
                  key={idx}
                  to={group.link}
                  className="border border-border bg-surface p-4 rounded hover:border-primary hover:bg-accent transition group/card flex items-center justify-between"
                >
                  <span className="font-bold text-sm uppercase tracking-wide text-foreground group-hover/card:text-primary transition">
                    {group.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/card:text-primary transition" />
                </Link>
              ))}
            </div>
          </section>

          {/* Section: FAQs */}
          <section id="faqs">
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Three Questions To Ask Before You Order
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {(data.questions || []).map((faq: any, i: number) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border bg-surface rounded px-2"
                >
                  <AccordionTrigger className="text-left font-bold text-sm uppercase hover:text-primary transition-colors hover:no-underline px-2 py-4 data-[state=open]:text-primary">
                    <div className="flex items-center gap-3">
                      <span className="text-primary text-lg">{i + 1}.</span> {faq.q}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-10 pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Section: Specification for Design */}
          <section>
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Specification For The Design, Installation Of {data.title}
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed bg-surface border border-border p-6 rounded">
              {splitIntoParagraphs(data.installationSpecs).map((para, idx) => (
                <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                  {para}
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Request For Quote Form */}
          <QuoteCard
            contextId={family}
            contextLabel={data.title}
            heading="Request For Quote"
            description={`Need pricing for ${data.title}? Our sales engineers are ready to assist you.`}
          />
        </aside>
      </div>

      {/* Featured Projects Bottom Section */}
      <section id="projects" className="border-t border-border bg-surface/30">
        <div className="container-page py-16">
          <h2 className="font-display text-2xl font-bold uppercase mb-8 flex items-center">
            <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
            Featured Projects Across Africa
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(data.projects || []).map((project: any, idx: number) => {
              const cardContent = (
                <>
                  <img
                    src={project.image}
                    alt={project.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide line-clamp-1">
                      {project.name}
                    </h4>
                    <div className="text-primary text-xs uppercase font-medium mt-1">
                      {project.location}
                    </div>
                  </div>
                </>
              );

              if (project.slug) {
                return (
                  <Link
                    key={idx}
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="group relative aspect-[4/3] rounded overflow-hidden cursor-pointer border border-border block"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={idx}
                  className="group relative aspect-[4/3] rounded overflow-hidden cursor-pointer border border-border"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Resources & Applications */}
      <section id="documents" className="border-t border-border bg-background">
        <div className="container-page py-16 grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              Related Resources
            </h2>
            <div className="space-y-4">
              <Link
                to="/resources"
                className="group flex items-center justify-between border border-border bg-surface rounded p-5 hover:border-primary transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide text-foreground group-hover:text-primary transition">
                      Technical Datasheets
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      TDS, SDS & specifications
                    </div>
                  </div>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
              <Link
                to="/resources"
                className="group flex items-center justify-between border border-border bg-surface rounded p-5 hover:border-primary transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase tracking-wide text-foreground group-hover:text-primary transition">
                      Installation Guidelines
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Step-by-step procedures
                    </div>
                  </div>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            </div>
          </div>

          <div id="applications" className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                Common {dynamicFamilyName} Applications
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                {(data.applications || []).map((app: any, idx: number) => (
                  <li key={idx}>
                    {app.slug ? (
                      <Link
                        to="/$slug"
                        params={{ slug: app.slug }}
                        className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition"
                      >
                        <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                        <span>{app.label}</span>
                      </Link>
                    ) : (
                      <Link
                        to="/applications"
                        className="group flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition"
                      >
                        <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                        <span>{app.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-border">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                Industries Served
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(data.industries || []).map((ind: any, idx: number) => (
                  <Link
                    key={idx}
                    to="/$slug"
                    params={{ slug: ind.slug }}
                    className="group flex flex-col justify-between p-4 border border-border bg-surface rounded hover:border-primary hover:bg-accent transition"
                  >
                    <span className="font-bold text-xs uppercase tracking-wide text-foreground group-hover:text-primary transition">
                      {ind.label}
                    </span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-4 flex items-center gap-1">
                      Explore Solutions <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Section */}
      <section className="bg-background">
        <div className="container-page py-16 max-w-2xl">
          <QuoteCard
            contextLabel={data.title}
            heading="Request a Quote for This Product Family"
            description="Upload your BOQ, drawings, or specifications and our technical team will provide a detailed proposal."
          />
        </div>
      </section>

      {/* Red Banner Bottom CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-2">
              Have a project? Start with us.
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto md:mx-0">
              Get expert engineering support, reliable material supply, and best-in-class
              installation.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-primary uppercase font-bold tracking-wider shrink-0 w-full md:w-auto"
          >
            <Link to="/contacts">Talk To Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
