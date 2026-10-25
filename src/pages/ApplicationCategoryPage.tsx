import { prepareResourceLinks, isPdfResource } from "@/lib/resource-links";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  HelpCircleIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { resolveIcon } from "@/components/icons/resolve-icon";
import { Button } from "@/components/ui/button";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { BoqCtaBand } from "@/components/site/BoqCtaBand";
import { QuoteCard } from "@/components/site/QuoteCard";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { DrainageMesh } from "@/components/site/shapes";
import { APPLICATION_DIRECTORY, findApplication } from "@/data/application-directory";

// Helper to render Lucide icons dynamically by string name
function IconRenderer({ name, className }: { name: string; className?: string }) {
  const IconComponent = resolveIcon(name, HelpCircleIcon);
  if (!IconComponent) {
    return <HelpCircleIcon className={className} />;
  }
  return <IconComponent className={className} />;
}

const applicationDeliveryProfiles = [
  {
    match: /tailings|\btsf\b/i,
    selection:
      "We align HDPE geomembranes, protection geotextiles, GCLs and drainage layers with your TSF drawings, tailings chemistry and construction sequence.",
    installation:
      "Our lining crews coordinate accepted work fronts, panel deployment, daily trial welds, fusion and extrusion welding, anchorages and repairs.",
    quality:
      "Our installation QC links roll and panel numbers to welders, weld logs and test results. Air-channel testing to ASTM D5820, vacuum testing to ASTM D5641 and destructive peel/shear testing to ASTM D6392 are applied as specified for the seams. Repairs are mapped and retested before handover.",
    why: "Bring liner supply, large-area installation and installation QA/QC into one coordinated package. Our 1.2 million m² lithium-mine TSF lining reference in Mali demonstrates delivery at project scale.",
  },
  {
    match: /heap leach/i,
    selection:
      "We coordinate the geomembrane, protection and solution-collection material schedule around leach chemistry, ore loading and the pad construction phases.",
    installation:
      "Our lining teams plan panel runs, sumps, perimeter anchors and phase tie-ins, then deploy and weld the barrier before protection and collection layers are placed.",
    quality:
      "We document roll and panel identity, trial welds, applicable air-channel and vacuum tests, destructive peel/shear samples, repairs and covering releases. Collection interfaces and penetrations are inspected before burial.",
    why: "Source the barrier, protection and collection interfaces through one delivery team, with cross-border logistics and installation records coordinated around your mine programme.",
  },
  {
    match: /reservoir|dam lining/i,
    selection:
      "We review water use, reservoir geometry, substrate and penetration details to select the specified geomembrane and protection system, including product-specific drinking-water documentation where required.",
    installation:
      "We coordinate basin preparation interfaces, liner deployment, welded or manufacturer-specified joints, pipe boots, structural terminations and the agreed filling sequence.",
    quality:
      "Our checks cover product identity, formation release, protection placement, joint tests appropriate to the membrane, repair close-out and penetration inspection. Panel maps and installation records form the handover package.",
    why: "Work with a supplier and installer that connects the membrane to the practical details of your reservoir, from protection and pipe interfaces to documented completion.",
  },
  {
    match: /irrigation|canal/i,
    selection:
      "We match the specified geomembrane, concrete blanket or geocell-supported system to channel geometry, seepage-control objectives and the hydraulic design.",
    installation:
      "We plan material lengths and deployment around isolated work fronts, then install the selected lining with its own joint, anchorage, infill or hydration requirements.",
    quality:
      "Our inspection plan follows the actual system: membrane weld checks, concrete-blanket joints and hydration, or geocell expansion, anchorage and infill. We document transitions, outlets and completion before return to service.",
    why: "Procure the right lining and its installation support together, with delivery and work-front planning suited to African irrigation and water-transfer projects.",
  },
  {
    match: /landfill|ash|bund/i,
    selection:
      "We build the material schedule around your approved basal liner, capping or secondary-containment section, including geomembranes, GCLs, protection, filters and collection layers.",
    installation:
      "We sequence GCL placement, geomembrane deployment and welding, terminations and drainage interfaces so each barrier layer can be inspected before it is covered.",
    quality:
      "Our records cover material traceability, GCL overlaps and confinement, trial welds, applicable seam tests, repairs, drainage checks and covering hold points. We coordinate our installer QC records with the appointed CQA team.",
    why: "Coordinate the barrier package and its installation through one partner, with clear material traceability and layer-by-layer evidence for project acceptance.",
  },
  {
    match: /\bmse\b|reinforced slopes/i,
    selection:
      "We translate the approved reinforcement schedule into exact geogrid grades, lengths and quantities, with the facing connections, filters and drainage specified for the structure.",
    installation:
      "We coordinate reinforcement deliveries and site checks by lift, including grid direction, length, elevation, facing connection and backfill placement.",
    quality:
      "Our inspection records track reinforcement grade and layer placement before burial, with connection checks, facing surveys, drainage inspections and the specified fill and compaction results.",
    why: "Get grade-specific reinforcement supply and practical construction coordination for demanding crusher walls, bridge approaches and reinforced-soil structures.",
  },
  {
    match: /retaining/i,
    selection:
      "We coordinate reinforcement geogrids, facing interfaces, filtration and drainage against the approved wall system, geometry and backfill specification.",
    installation:
      "Our agreed site scope follows the wall sequence: foundation release, facing, reinforcement connections, controlled fill lifts and drainage completion.",
    quality:
      "We document material identity, grid orientation and length, layer elevations, connection checks, face alignment and drainage continuity, alongside specified backfill and compaction records.",
    why: "Connect reinforcement procurement to the construction details that matter, with one team coordinating materials, delivery and the defined installation checks.",
  },
  {
    match: /stabilisation|stabilization/i,
    selection:
      "We distinguish aggregate stabilisation, separation, confinement and tensile reinforcement, then match the geogrid, geotextile, geocell or paving grid to your approved build-up.",
    installation:
      "We coordinate roll layout, overlaps, grid direction, initial aggregate cover and construction access with the earthworks team and the selected product requirements.",
    quality:
      "Our checks cover exact product grade, formation acceptance, overlaps and orientation, damage before covering, fill placement and the specified layer and compaction records.",
    why: "Choose from stabilisation, separation and confinement materials through one supplier, with practical support that keeps product selection connected to site conditions and placement.",
  },
  {
    match: /erosion|slope/i,
    selection:
      "We match natural-fibre blankets, geocells and specified hard-armour linings to soil, slope geometry, runoff and the required vegetation or surface finish.",
    installation:
      "We coordinate preparation, crest and toe details, anchorage, overlaps, infill and any product-specific hydration with the drainage and rehabilitation programme.",
    quality:
      "Our inspections record product grade, surface preparation, soil contact, fixing patterns, geocell infill or concrete-blanket joint controls, and the agreed establishment and handover checks.",
    why: "Combine erosion-control product choice with installation planning for the actual slope, including drainage interfaces and the work needed to support establishment.",
  },
  {
    match: /drainage|filtration/i,
    selection:
      "We coordinate filter geotextiles, drainage cores and collector pipes using soil-retention criteria, design flow, gradients, loading and outlet requirements.",
    installation:
      "We support continuous filter and drainage paths, core joins, pipe bedding and gradients, with pre-cover inspection of connections, cleanouts and outlets.",
    quality:
      "Our checks record product and roll identity, filtration and drainage submittals, overlaps, core orientation, pipe levels, outlet locations and protection before backfilling.",
    why: "Source the filter, drainage and collection materials as a coordinated package, with technical selection and delivery linked to the complete flow path.",
  },
  {
    match: /coastal/i,
    selection:
      "We review the shoreline or river design, foundation, filter requirements and specified container or gabion arrangement, then coordinate fabric, seams, fill and handling details.",
    installation:
      "We coordinate fabrication, delivery and the agreed filling or placement scope, including foundation filters, container patterns, toe protection and specified gabion connections.",
    quality:
      "Our controls cover fabric and unit identity, dimensions, specified seam checks, filter continuity, filling and handling. Where gabions are included, we inspect basket and coating specifications, connections and rock fill against the approved details.",
    why: "Access woven, nonwoven and multilayer sand-container fabrication, filters and specified gabion materials through one partner, with practical delivery and placement support across Africa.",
  },
  {
    match: /roads|railways/i,
    selection:
      "We match foundation grids, separation and filtration fabrics, drainage and asphalt interlayers to their specific roles within your road or railway sections.",
    installation:
      "We coordinate staged delivery and placement around earthworks, aggregate or ballast operations and paving, with product-specific layout, cover and bonding requirements.",
    quality:
      "Our records cover product grades, prepared surfaces, laps and orientation, placement damage, initial cover and specified compaction or asphalt-interlayer bonding checks.",
    why: "Procure foundation, drainage and rehabilitation geosynthetics through one partner, with support that connects product selection to the transport structure and construction sequence.",
  },
  {
    match: /sludge|dewatering/i,
    selection:
      "We review representative feed data and trials to select slit-film, monofilament or composite dewatering bags and tubes, with dimensions, ports and seam requirements matched to the duty.",
    installation:
      "We coordinate fabrication and delivery with the pad, filtrate collection and filling plan, and provide the agreed support for controlled filling and drainage cycles.",
    quality:
      "Our controls cover fabric and unit identity, fabrication dimensions, specified seam checks, trial results and filling limits. Filtrate and cake checks follow the agreed project targets and sampling plan.",
    why: "Combine fabric selection and in-house fabrication with delivery and installation support, rather than procuring a bag without the feed, filling and filtrate context.",
  },
];

export function ApplicationCategoryPage({ data }: { data: any }) {
  const loaderData = data;
  const {
    category,
    templateData,
    caseStudies = [],
    linkedProducts = [],
    featuredCaseStudy = null,
  } = loaderData;

  // ─── Visual Fields Fallbacks & Mapping ──────────────────────────────────────
  const title = templateData?.title || category.label;
  const description =
    templateData?.description ||
    "Complete engineered system — design, supply, install, test and certify.";
  const heroImage = templateData?.heroImage || "";

  const downloadGuideLabel = templateData?.downloadGuideLabel || "Download System Guide";
  const downloadGuideUrl = templateData?.downloadGuideUrl || "";

  const heroHighlights = templateData?.heroHighlights || [
    { icon: "Shield", label: "Premium Protection" },
    { icon: "CheckCircle2", label: "Certified Installers" },
  ];

  const overviewParagraphs =
    templateData?.overviewParagraphs && templateData.overviewParagraphs.length > 0
      ? templateData.overviewParagraphs
      : [description];

  const keyBenefits = templateData?.keyBenefits || [
    "High performance containment barrier",
    "Optimized logistics & deployment",
    "Standardized QA / QC protocols",
  ];

  const suitableFor =
    templateData?.suitableFor && templateData.suitableFor.length > 0
      ? templateData.suitableFor
      : (templateData?.content?.subsystems || ["Lining Systems", "Leak Detection", "Drainage"]).map(
          (s: string) => ({
            icon: "Droplets",
            label: s,
          }),
        );

  const assistancePhone = "+27 72 343 0868";
  const assistanceEmail = "sales@geosyntheticsafrica.com";
  const isTsf = /tailings|tsf/i.test(category.slug || title);
  const applicationTopic = title.replace(/\s+Across Africa$/i, "").toLowerCase();
  const assistanceMessage = isTsf
    ? "Speak to a TSF lining engineer"
    : `Discuss your ${applicationTopic} project with our technical team.`;

  const componentsTitle = templateData?.componentsTitle || "Typical System Components";
  const componentsImage = templateData?.componentsImage || "";
  const componentsDrawingLink = templateData?.componentsDrawingLink || "";
  const componentsCallouts = templateData?.componentsCallouts || [];

  const designTitle = templateData?.designTitle || "Design Considerations";
  const designParagraphs = templateData?.designParagraphs || [];

  const installationTitle = templateData?.installationTitle || "Installation Guidelines";
  const installationParagraphs = templateData?.installationParagraphs || [];

  const qaTitle = templateData?.qaTitle || "QA & Testing";
  const qaItems = templateData?.qaItems || [];

  const productsTitle = templateData?.productsTitle || "Products Used in this Application";
  const downloadsTitle = templateData?.downloadsTitle || "Technical Downloads";
  const downloads = prepareResourceLinks(templateData?.downloads || []);
  const deliveryProfile = templateData?.deliveryProfile ||
    applicationDeliveryProfiles.find((profile) =>
      profile.match.test(`${category.label || ""} ${title}`),
    ) || {
      selection:
        "We review drawings, operating conditions and the material schedule before confirming products and delivery scope.",
      installation:
        "We agree installation responsibilities, work sequence and inspection stages with your project team before site work starts.",
      quality:
        "Our records connect material identity, installation inspections, applicable tests and repair close-out to the agreed handover scope.",
      why: "Coordinate technical selection, supply, African project delivery and the defined installation package through one accountable partner.",
    };
  const directoryEntry = findApplication(category.slug);
  const relatedApplications = directoryEntry
    ? APPLICATION_DIRECTORY.filter(
        (entry) => entry.group === directoryEntry.group && entry.slug !== category.slug,
      ).slice(0, 4)
    : [];

  // ─── Scroll Spy Navigation ──────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const sectionIds = [
      "overview",
      "delivery",
      "components",
      "design",
      "installation",
      "qa",
      "products",
      "projects",
      "downloads",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160; // offset for header + sticky nav

      let currentSection = "overview";
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
      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section
        className="relative isolate overflow-hidden bg-surface-dark text-white"
        style={{
          backgroundImage: heroImage
            ? `linear-gradient(to right, rgba(15,15,18,0.9), rgba(15,15,18,0.55)), url(${heroImage})`
            : "linear-gradient(to right, #0f0f12, #26343b)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <DrainageMesh opacity={0.12} color="#ffffff" lineSpacing={40} />
        <div className="container-page py-16 md:py-24 relative z-10">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Applications", to: "/applications" },
              { label: title },
            ]}
            variant="primary-bold"
          />

          <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 leading-relaxed pl-4 border-l-2 border-primary">
            {description}
          </p>

          {/* Highlights */}
          {heroHighlights.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-white/10 pt-6">
              {heroHighlights.map((hl: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <IconRenderer name={hl.icon} className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-white/95 leading-tight">
                    {hl.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide text-white border-0 cursor-pointer"
              onClick={() => {
                document
                  .getElementById("quote")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Request A Quote
            </Button>
            {downloadGuideUrl && (
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white hover:text-surface-dark uppercase font-bold tracking-wide cursor-pointer"
              >
                <a href={downloadGuideUrl} target="_blank" rel="noopener noreferrer">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  {downloadGuideLabel}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Sticky Tab Navigation ─────────────────────────────────────────────── */}
      <div className="sticky top-[70px] z-40 bg-surface border-b border-border shadow-sm">
        <div className="container-page">
          <ul className="flex items-center overflow-x-auto no-scrollbar gap-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "delivery", label: "Our Delivery & Why Choose Us" },
              {
                id: "components",
                label: "System Components",
                show: !!componentsImage || componentsCallouts.length > 0,
              },
              { id: "design", label: "Design Considerations", show: designParagraphs.length > 0 },
              {
                id: "installation",
                label: "Installation Guidelines",
                show: installationParagraphs.length > 0,
              },
              { id: "qa", label: "QA & Testing", show: qaItems.length > 0 },
              { id: "products", label: "Products Used", show: linkedProducts.length > 0 },
              { id: "projects", label: "Case Studies", show: caseStudies.length > 0 },
              { id: "downloads", label: "Downloads", show: downloads.length > 0 },
            ].map((link) => {
              if (link.show === false) return null;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className={cn(
                      "block py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap",
                      activeSection === link.id
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-primary hover:border-primary",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ─── Main Content Split Layout ─────────────────────────────────────────── */}
      <div className="container-page py-16 grid lg:grid-cols-12 gap-16">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-20">
          {/* Section: Overview */}
          <section id="overview" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              System Overview
            </h2>
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4">
              {overviewParagraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          <section id="delivery" className="border-t border-border pt-16 scroll-mt-32">
            <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
              How Geosynthetics Africa Delivers Across Africa
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Choose material supply or an integrated supply, delivery, installation and QA/QC
              scope. We coordinate the package around your site, specification and construction
              programme.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { title: "Technical Selection & Scope", text: deliveryProfile.selection },
                {
                  title: "Supply & Cross-Border Delivery",
                  text: "We coordinate material schedules, packing, freight, customs documentation and delivery routes to your African project site. Availability, shipment sequencing and mobilisation are confirmed in your proposal.",
                },
                { title: "Installation & Site Controls", text: deliveryProfile.installation },
                { title: "Our QA/QC & Handover", text: deliveryProfile.quality },
              ].map((stage) => (
                <div key={stage.title} className="border border-border rounded-lg bg-card p-6">
                  <h3 className="font-bold text-sm uppercase mb-3">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stage.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 border-l-4 border-primary bg-surface p-6 rounded-r-lg">
              <h3 className="font-display text-xl font-bold uppercase mb-4">
                Why Choose Geosynthetics Africa
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{deliveryProfile.why}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">African project experience.</strong> More than
                  15 million m² installed and materials supplied to over 30 countries across the
                  Group's delivery footprint.
                </li>
                <li>
                  <strong className="text-foreground">One coordinated project scope.</strong>{" "}
                  Technical selection, supply, fabrication where required, logistics and agreed
                  installation responsibilities brought together from enquiry to handover.
                </li>
                <li>
                  <strong className="text-foreground">Quality you can review.</strong> Defined
                  inspection stages, material traceability and application-specific records, with
                  our installer QC coordinated with independent CQA where appointed.
                </li>
                <li>
                  <strong className="text-foreground">Specialist installation capability.</strong>{" "}
                  The Group is an IAGI Installer Member. Geomembrane work is supported by trained
                  welding technicians, trial welds and documented seam-control procedures.
                </li>
              </ul>
              <a
                href="#quote"
                onClick={(e) => scrollToSection(e, "quote")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                Discuss your project scope <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </section>

          {/* Section: System Components */}
          {(componentsImage || componentsCallouts.length > 0) && (
            <section id="components" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {componentsTitle}
              </h2>
              <div
                className={cn(
                  "grid gap-8 items-start",
                  componentsImage ? "lg:grid-cols-12" : "grid-cols-1",
                )}
              >
                {(componentsImage || componentsDrawingLink) && (
                  <div className="lg:col-span-7 space-y-4">
                    {componentsImage && (
                      <div className="border border-border rounded-xl p-4 bg-surface/30">
                        <img
                          src={componentsImage}
                          alt={componentsTitle}
                          className="w-full h-auto rounded-lg object-contain bg-white mx-auto"
                        />
                      </div>
                    )}
                    {componentsDrawingLink && (
                      <Button
                        asChild
                        variant="outline"
                        className="uppercase font-bold tracking-wider text-xs cursor-pointer"
                      >
                        <a href={componentsDrawingLink} target="_blank" rel="noopener noreferrer">
                          View Detailed Drawing <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
                <div className={cn("space-y-3", componentsImage && "lg:col-span-5")}>
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Key System Components
                  </h3>
                  <div className="space-y-4">
                    {componentsCallouts.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="h-6 w-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {item.number}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-tight text-foreground leading-tight">
                            {item.label}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section: Design Considerations */}
          {designParagraphs.length > 0 && (
            <section id="design" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {designTitle}
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4">
                {designParagraphs.map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Section: Installation Guidelines */}
          {installationParagraphs.length > 0 && (
            <section id="installation" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {installationTitle}
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed space-y-4">
                {installationParagraphs.map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* Section: QA & Testing */}
          {qaItems.length > 0 && (
            <section id="qa" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {qaTitle}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {qaItems.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-border bg-card p-5 rounded-lg hover:border-primary transition"
                  >
                    <IconRenderer name={item.icon} className="h-6 w-6 text-primary mb-3" />
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Products Used */}
          {linkedProducts.length > 0 && (
            <section id="products" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {productsTitle}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {linkedProducts.map((prod: any, idx: number) => (
                  <Link
                    key={idx}
                    to="/catalogue/$slug"
                    params={{
                      slug: prod.slug,
                    }}
                    className="group border border-border bg-card rounded-lg overflow-hidden flex flex-col hover:border-primary transition"
                  >
                    <div className="aspect-square bg-surface-dark overflow-hidden relative">
                      <img
                        src={
                          prod.image_url ||
                          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80"
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wide text-foreground group-hover:text-primary transition line-clamp-2 mb-1">
                          {prod.name}
                        </h4>
                        <span className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                          {prod.thickness_mm
                            ? `${prod.thickness_mm}mm thickness`
                            : prod.short_description || ""}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition mt-4 inline-flex items-center gap-1">
                        View Product <ArrowRightIcon className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Section: Case Studies */}
          {caseStudies.length > 0 && (
            <section id="projects" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                Featured Case Studies
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {caseStudies.slice(0, 4).map((cs: any, idx: number) => (
                  <Link
                    key={idx}
                    to="/projects/$slug"
                    params={{ slug: cs.slug }}
                    className="group flex flex-col rounded border border-border bg-card overflow-hidden hover:border-foreground transition duration-200"
                  >
                    <div
                      className="aspect-[16/10] relative overflow-hidden bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${cs.hero_image_url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border-0">
                          {cs.service_type === "supply_install"
                            ? "Supply & Install"
                            : cs.service_type === "supply_only"
                              ? "Supply Only"
                              : "Services Only"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between font-sans">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
                          {cs.project_year || "2024"}
                        </div>
                        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-150 leading-tight mb-2">
                          {cs.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {cs.summary}
                        </p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary mt-4 flex items-center gap-1">
                        View Case Study <ChevronRightIcon className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedApplications.length > 0 && (
            <section className="border-t border-border pt-16">
              <h2 className="font-display text-2xl font-bold uppercase mb-6">
                Related Applications
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedApplications.map((app) => (
                  <Link
                    key={app.slug}
                    to="/applications/$category"
                    params={{ category: app.slug }}
                    className="border border-border rounded-lg p-5 hover:border-primary transition"
                  >
                    <h3 className="text-sm font-bold text-primary">{app.label}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {app.summary}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                to="/applications"
                className="mt-5 inline-flex text-sm font-bold text-primary hover:underline"
              >
                View all applications
              </Link>
            </section>
          )}

          {/* Section: Downloads */}
          {downloads.length > 0 && (
            <section id="downloads" className="border-t border-border pt-16 scroll-mt-32">
              <h2 className="font-display text-2xl font-bold uppercase mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-4 block"></span>
                {downloadsTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {downloads.map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border border-border bg-surface rounded-lg p-5 hover:border-primary transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-white transition shrink-0">
                        <FileTextIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-wide text-foreground group-hover:text-primary transition">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                          {/\.pdf(?:[?#]|$)/i.test(item.url)
                            ? "Technical document (PDF)"
                            : "Technical resources & product documentation"}
                        </div>
                      </div>
                    </div>
                    <DownloadIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column - Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="space-y-6 sticky top-[160px]">
            {/* Sidebar element: Key Benefits */}
            {keyBenefits.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                  <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {keyBenefits.map((kb: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                    >
                      <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{kb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sidebar element: Suitable For */}
            {suitableFor.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                  <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
                  Suitable For
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {suitableFor.map((sf: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-surface/50 hover:border-primary/50 transition text-center min-h-[90px] shadow-sm"
                    >
                      <IconRenderer name={sf.icon} className="h-5 w-5 text-primary mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-foreground">
                        {sf.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar element: Need Assistance */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center">
                <span className="w-1 h-3 bg-primary rounded-full mr-2"></span>
                Contact
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{assistanceMessage}</p>
              <div className="space-y-3 pt-1 border-t border-border/60">
                {assistancePhone && (
                  <a
                    href={`tel:${assistancePhone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-2.5 text-xs font-semibold text-foreground hover:text-primary transition"
                  >
                    <PhoneIcon className="h-4 w-4 text-primary shrink-0" />
                    <span>{assistancePhone}</span>
                  </a>
                )}
                {assistanceEmail && (
                  <a
                    href={`mailto:${assistanceEmail}`}
                    className="flex items-center gap-2.5 text-xs font-semibold text-foreground hover:text-primary transition truncate"
                  >
                    <MailIcon className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{assistanceEmail}</span>
                  </a>
                )}
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold uppercase tracking-wider h-9 mt-2 cursor-pointer"
              >
                <a
                  href="#quote"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Contact Our Team <ChevronRightIcon className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            {/* Sidebar element: Featured Case Study */}
            {featuredCaseStudy && (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div
                  className="aspect-[16/10] relative overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${featuredCaseStudy.hero_image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                      {featuredCaseStudy.project_year || "FEATURED CASE STUDY"}
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-tight text-white mt-0.5">
                      {featuredCaseStudy.title}
                      {featuredCaseStudy.project_year ? ` (${featuredCaseStudy.project_year})` : ""}
                    </h4>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 bg-card justify-between">
                  <div className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                    {featuredCaseStudy.summary}
                  </div>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: featuredCaseStudy.slug }}
                    className="text-xs font-bold uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    View Case Study <ChevronRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Quote Form box */}
            <div className="scroll-mt-32">
              <QuoteCard
                contextLabel={title}
                heading="Request a Project Proposal"
                description="Send your drawings, quantities, project location and required date. Our technical team will review your scope and prepare a proposal."
              />
            </div>
          </div>
        </aside>
      </div>

      <PartnerStrip />
      <BoqCtaBand />
    </div>
  );
}
