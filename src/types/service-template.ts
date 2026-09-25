export interface BulletItem {
  title: string;
  description?: string;
}

export interface CapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface DownloadItem {
  label: string;
  url: string;
}

export interface ServiceSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface ServiceTemplate {
  title: string;
  description: string;
  heroImage: string;
  badge?: string;
  topSellingProductId?: string;
  topSellingProductIds?: string[];

  // Left Column Content
  overviewParagraphs?: string[];
  whyChooseTitle?: string;
  whyChoose?: BulletItem[];
  whatWeDeliverTitle?: string;
  whatWeDeliver?: BulletItem[];
  coverageTitle?: string;
  coverageText?: string;
  coverageBullets?: string[];
  coverageImage?: string;
  coverageCaption?: string;

  // Right Column Sidebar Content
  sidebarImage?: string;
  sidebarCaption?: string;
  directModelTitle?: string;
  directModelText?: string;
  directModelItems?: BulletItem[];
  packagingTitle?: string;
  packagingText?: string;
  packagingItems?: string[];
  afcftaTitle?: string;
  afcftaText?: string;
  afcftaItems?: string[];
  playbookTitle?: string;
  playbookItems?: BulletItem[];

  // Bottom Stats Row
  statsTitle?: string;
  statsDescription?: string;
  stats?: StatItem[];

  // Products & Downloads
  productsTitle?: string;
  products?: string[];
  downloadsTitle?: string;
  downloads?: DownloadItem[];

  // Landing Page Specific Fields
  landingTitle?: string;
  landingSubtitle?: string;
  landingHeroImage?: string;
  capabilitiesTitle?: string;
  capabilities?: CapabilityItem[];
  faqs?: { question: string; answer: string }[];
  ctaTitle?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;

  seo: ServiceSeo | null;

  // Legacy fields
  content?: {
    features: string[];
    sections: unknown[];
  };
}

export const DEFAULT_SERVICES_TEMPLATES: Record<string, ServiceTemplate> = {
  supply: {
    title: "Pan-African Geosynthetic Material Supply",
    description:
      "Direct-from-manufacturer supply of premium GSE HDPE/LLDPE liners, Bidim non-woven geotextiles, GCLs, geogrids, and drainage composites with resin-to-roll traceability across Africa.",
    badge: "Direct Supply & Sourcing",
    heroImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1920&q=80",
    topSellingProductId: "gse-hdpe-smooth",
    topSellingProductIds: ["gse-hdpe-smooth", "bidim-geotextile", "bentofix-gcl"],

    overviewParagraphs: [
      "Geosynthetics Africa manages container-direct and bulk depot material supply for mining infrastructure, municipal water containment, and civil engineering projects throughout sub-Saharan Africa. We source directly from tier-one international manufacturers, eliminating distributor markups and providing engineers with guaranteed mill certification.",
      "Every roll dispatched is tracked by raw resin lot and manufacturing batch, ensuring compliance with SANS 1526, GRI-GM13, and ASTM standards. Whether supplying 1.5mm HDPE geomembrane for a remote Copperbelt tailings dam or heavy needle-punched geotextiles for port infrastructure, our direct supply model secures project timelines and technical integrity.",
    ],

    whyChooseTitle: "Why Choose Direct Material Supply?",
    whyChoose: [
      {
        title: "Direct Manufacturer Sourcing",
        description:
          "Zero middleman or broker markups. Direct plant-to-project procurement at guaranteed factory pricing.",
      },
      {
        title: "SANS 1526 & GRI-GM13 Certified",
        description:
          "Full resin-to-roll testing certificates (MTRs) provided before container dispatch and vessel departure.",
      },
      {
        title: "Large Inventory & Stock Hubs",
        description:
          "Strategic warehousing in Johannesburg, Durban, and regional partner yards for emergency site dispatch.",
      },
      {
        title: "Single-Point Procurement",
        description:
          "Liner, geotextile, GCL, welding rods, and extrusion tools bundled under a single consolidated purchase order.",
      },
    ],

    whatWeDeliverTitle: "What We Deliver — Factory to Site",
    whatWeDeliver: [
      {
        title: "Mill Test Reports (MTRs) & Quality Certs",
        description:
          "Independent laboratory test data for tensile strength, tear resistance, carbon black dispersion, and puncture.",
      },
      {
        title: "Container Stuffing & Loading Blueprints",
        description:
          "Precision-engineered loading plans to protect roll cores and maximize 20ft and 40ft container capacities.",
      },
      {
        title: "Custom Roll Dimension Slitting",
        description:
          "Tailored roll widths and lengths engineered to reduce site overlap waste and minimize transverse welding.",
      },
      {
        title: "Customs-Ready Trade Documentation",
        description:
          "Registered exporter SADC Certificates of Origin and AfCFTA compliance papers to minimize import duties.",
      },
    ],

    coverageTitle: "Pan-African Supply Network & Warehousing",
    coverageText:
      "Our main central distribution yards in South Africa maintain over 50,000 m² of certified geosynthetics ready for immediate mobilization. We operate proven transport corridors servicing 30+ African nations across SADC, EAC, and ECOWAS regions.",
    coverageBullets: [
      "Strategic stockpiles of HDPE smooth/textured liners (1.0mm to 2.5mm)",
      "Continuous filament and staple-fibre non-woven geotextiles in all standard grades",
      "SADC Certificates of Origin issued to eliminate or reduce regional cross-border customs tariffs",
    ],
    coverageImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    coverageCaption:
      "High-density container loading and staging at our regional distribution yard.",

    sidebarImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=800&q=80",
    sidebarCaption: "Container-direct procurement with full batch mill test certification.",
    directModelTitle: "Direct Factory Pricing. No Distributor Markups.",
    directModelText:
      "By purchasing directly through Geosynthetics Africa, contractors and asset owners deal straight with technical procurement specialists.",
    directModelItems: [
      {
        title: "Transparent Costing",
        description:
          "Exact ex-factory rates with transparent freight and customs forwarding costs.",
      },
      {
        title: "Direct Technical Submittals",
        description:
          "Immediate engineering data sheets, test methods, and warranty certificates for consultant sign-off.",
      },
    ],

    packagingTitle: "Heavy-Duty Cross-Border Packaging",
    packagingText:
      "All export rolls undergo reinforced protective packaging to withstand multi-modal transport and prolonged UV exposure on remote African mine sites:",
    packagingItems: [
      "Reinforced heavy-gauge end caps preventing core compression during rough road transit",
      "Multi-layer UV-resistant wrapping for open seaport staging and outdoor laydown yards",
      "High-tensile lifting slings pre-fitted for rapid crane and forklift site offloading",
    ],

    afcftaTitle: "AfCFTA & SADC Duty Optimization",
    afcftaText:
      "We structure commercial documentation to take full advantage of preferential African trade agreements:",
    afcftaItems: [
      "SADC Registered Exporter status reducing cross-border import duties to 0% in eligible member states",
      "Harmonized HS Code classification preventing clearing delays at border posts",
      "Dedicated clearing agents pre-processing customs manifests at major African transit ports",
    ],

    playbookTitle: "Procurement & Delivery Playbook",
    playbookItems: [
      {
        title: "1. Specification Review",
        description:
          "Review of engineering drawings, panel dimensions, and chemical compatibility.",
      },
      {
        title: "2. Factory QA Verification",
        description:
          "Pre-dispatch QA/QC inspection and roll test validation against GRI-GM13 standards.",
      },
      {
        title: "3. Freight & Route Execution",
        description:
          "Direct sea vessel booking or dedicated road flatbed dispatch directly to site coordinates.",
      },
    ],

    statsTitle: "Material Supply Capacity",
    statsDescription:
      "Demonstrated pan-African supply track record across complex mining and civil infrastructure projects.",
    stats: [
      { value: "30+", label: "African Countries Supplied" },
      { value: "100%", label: "MTR Roll Traceability" },
      { value: "50,000+ m²", label: "Stock Depot Capacity" },
      { value: "0%", label: "Intermediary Markup" },
    ],

    productsTitle: "Core Supplied Geosynthetics",
    products: ["gse-hdpe-smooth", "bidim-geotextile", "bentofix-gcl"],
    downloadsTitle: "Procurement & Technical Guides",
    downloads: [
      { label: "Material Supply Capability Statement", url: "/resources" },
      { label: "HDPE Geomembrane Specification Guide (GRI-GM13)", url: "/resources" },
    ],

    seo: {
      title: "Pan-African Geosynthetic Material Supply | Geosynthetics Africa",
      description:
        "Direct-from-manufacturer supply of premium GSE HDPE liners, Bidim geotextiles, and GCL systems across Africa. SANS 1526 & GRI-GM13 certified.",
      keywords:
        "geosynthetics supply Africa, HDPE liner supplier, geotextile distributor, GCL supplier, mining containment supply",
    },
  },

  logistics: {
    title: "30+ Country Delivery & Customs Clearance",
    description:
      "Comprehensive pan-African freight forwarding, road flatbeds, ocean transit, and bonded customs clearance delivering heavy geosynthetic rolls directly to remote African mine sites and infrastructure projects.",
    badge: "Pan-African Cross-Border Logistics",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    topSellingProductId: "gse-hdpe-smooth",
    topSellingProductIds: ["gse-hdpe-smooth", "bidim-geotextile"],

    overviewParagraphs: [
      "Delivering multi-tonne geosynthetic rolls into remote African terrain demands specialized transport logistics, robust customs handling, and heavy-haul road management. Geosynthetics Africa orchestrates seamless end-to-end transport across 30+ African nations, navigating border posts, sea terminals, and off-road mining corridors with zero customs delay.",
      "We manage every stage of the logistics chain: container ocean booking into major African seaports (Durban, Beira, Dar es Salaam, Walvis Bay, Tema, Abidjan), bonded staging, SADC Certificate of Origin issuance, and dedicated road flatbed convoys equipped with certified lifting rigging for remote on-site discharge.",
    ],

    whyChooseTitle: "Why Choose Our Pan-African Logistics?",
    whyChoose: [
      {
        title: "Zero-Delay Border Clearances",
        description:
          "Pre-lodged customs manifests and electronic border filings at Beitbridge, Chirundu, Kasumbalesa, and Malaba.",
      },
      {
        title: "Dedicated Heavy-Haul Fleet",
        description:
          "Tri-axle flatbeds, step-decks, and 4x4 crane trucks equipped for remote African gravel corridors and mine haul roads.",
      },
      {
        title: "SADC & AfCFTA Duty Exemptions",
        description:
          "Registered exporter documentation maximizing preferential tariff concessions across SADC and COMESA states.",
      },
      {
        title: "Full Cargo Transit Insurance",
        description:
          "Comprehensive marine and inland transit cover protecting materials from factory gate to site laydown.",
      },
    ],

    whatWeDeliverTitle: "What We Deliver — Reliable African Freight",
    whatWeDeliver: [
      {
        title: "Pre-Alert Customs Documentation",
        description:
          "Verified commercial invoices, packing lists, bill of ladings, and EUR.1 / SADC certificates prior to vehicle dispatch.",
      },
      {
        title: "Real-Time GPS Fleet Tracking",
        description:
          "Continuous satellite tracking of all truck convoys from dispatch terminal through to border crossing and site gates.",
      },
      {
        title: "Specialized Roll Offloading Gear",
        description:
          "Certified spreader bars, core pipes, and lifting slings provided to ensure zero roll damage during unloader discharge.",
      },
      {
        title: "Proof of Delivery & Receiving Inspection",
        description:
          "Signed receiving logs and roll condition reports verifying undamaged arrival for EPC contractor handover.",
      },
    ],

    coverageTitle: "30+ Country Cross-Border Delivery Reach",
    coverageText:
      "We have active freight corridors operating continuously between Southern, Central, Eastern, and Western Africa. Our logistics teams handle multi-border transit formalities, escort permits for abnormal loads, and rough-terrain mine site deliveries.",
    coverageBullets: [
      "Southern Africa: South Africa, Botswana, Namibia, Zimbabwe, Zambia, Mozambique, Angola, Lesotho, Eswatini",
      "East & Central Africa: Tanzania, Kenya, Uganda, DRC (Katanga & Kivu), Rwanda, Burundi",
      "West Africa: Ghana, Côte d'Ivoire, Guinea, Mali, Burkina Faso, Senegal, Nigeria",
    ],
    coverageImage: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80",
    coverageCaption: "Flatbed freight convoy traversing cross-border mining corridors.",

    sidebarImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    sidebarCaption: "30+ African country reach with dedicated border clearing agents.",
    directModelTitle: "Direct Freight Desk. Direct Accountability.",
    directModelText:
      "Your project manager communicates directly with our dedicated cross-border logistics directors. No multi-tier freight brokers.",
    directModelItems: [
      {
        title: "Single Freight Desk Contact",
        description:
          "Direct daily updates and GPS milestone reports from our logistics coordinators.",
      },
      {
        title: "Guaranteed Delivery Windows",
        description:
          "Pre-planned transit schedules coordinated with your site earthworks and installation timetable.",
      },
    ],

    packagingTitle: "Container Stuffing & Transit Protection",
    packagingText:
      "Heavy geomembrane rolls (up to 1.8 tonnes each) require meticulous loading and securing to prevent shift and core failure during long haulage:",
    packagingItems: [
      "Optimized 20ft & 40ft High-Cube container stuffing drawings minimizing roll deflection",
      "High-friction dunnage and heavy-duty polyester lashing straps exceeding export transport safety standards",
      "Weatherproof shrink hoods shielding rolls against tropical rain, coastal humidity, and desert heat",
    ],

    afcftaTitle: "Trade Protocols & Border Optimization",
    afcftaText:
      "Cross-border shipments are engineered to move through customs without demurrage or storage penalties:",
    afcftaItems: [
      "SADC Certificate of Origin issued under preferential trade protocols",
      "Single Administrative Document (SAD 500) customs declaration pre-clearance",
      "Bonded transit warehousing in Durban, Johannesburg, and regional transit hubs",
    ],

    playbookTitle: "Logistics Corridor Playbook",
    playbookItems: [
      {
        title: "1. Ocean Vessel & Port Staging",
        description:
          "Direct discharge at primary regional ocean gateways (Durban, Beira, Dar es Salaam, Walvis Bay).",
      },
      {
        title: "2. Border Post Pre-Clearance",
        description:
          "Pre-lodged customs entries clearing Beitbridge, Chirundu, or Kasumbalesa prior to truck arrival.",
      },
      {
        title: "3. Site Laydown Delivery",
        description:
          "Coordinated site delivery with verified heavy-lift rigging and roll inspection sign-off.",
      },
    ],

    statsTitle: "Logistics & Freight Track Record",
    statsDescription:
      "Proven cross-border logistics delivering on-schedule performance across challenging African destinations.",
    stats: [
      { value: "30+", label: "African Countries Reached" },
      { value: "1,200+", label: "Cross-Border Convoys" },
      { value: "0", label: "Customs Demurrage Penalties" },
      { value: "100%", label: "Cargo Insured" },
    ],

    productsTitle: "Frequently Shipped Systems",
    products: ["gse-hdpe-smooth", "bidim-geotextile", "bentofix-gcl"],
    downloadsTitle: "Logistics Resources & Port Guides",
    downloads: [
      { label: "Pan-African Logistics & Route Capabilities", url: "/resources" },
      { label: "Roll Handling & Site Storage Guidelines", url: "/resources" },
    ],

    seo: {
      title: "30+ Country Geosynthetics Delivery & Customs | Geosynthetics Africa",
      description:
        "Pan-African cross-border freight forwarding, road flatbeds, and customs clearing delivering geosynthetics to remote mine sites and civil projects in 30+ African countries.",
      keywords:
        "cross-border logistics Africa, geosynthetics transport, SADC certificate of origin, HDPE roll shipping, African freight forwarding",
    },
  },

  installation: {
    title: "IAGI-Aligned Installation & Field Seaming",
    description:
      "Certified field installation, dual-track wedge welding, extrusion welding, and comprehensive QA/QC testing aligned with International Association of Geosynthetic Installers (IAGI) standards across Africa.",
    badge: "IAGI-Certified Field Lining Operations",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    topSellingProductId: "gse-hdpe-smooth",
    topSellingProductIds: ["gse-hdpe-smooth", "bidim-geotextile"],

    overviewParagraphs: [
      "Geosynthetics Africa is one of only 5 IAGI (International Association of Geosynthetic Installers) Installer Members across the entire African continent. We deploy factory-trained, certified welding technicians and Master Seamers capable of executing complex containment lining in the most demanding site environments.",
      "From gold and copper mining tailings storage facilities (TSF) to hazardous landfill caps and municipal potable water reservoirs, our field installation teams follow rigorous Construction Quality Control (CQC) protocols. Every linear metre of welded seam is subjected to non-destructive testing—including continuous dual-track air pressure channels, vacuum box testing, and spark testing—backed by calibrated field tensiometer peel and shear validation.",
    ],

    whyChooseTitle: "Why Choose IAGI-Aligned Installation?",
    whyChoose: [
      {
        title: "1 of Only 5 IAGI Members in Africa",
        description:
          "Internationally recognized certification guaranteeing adherence to global geosynthetic welding and QA/QC best practices.",
      },
      {
        title: "Automated Dual-Track Hot Wedge Welding",
        description:
          "State-of-the-art wedge welding seamers featuring automated temperature, speed, and nip roller pressure control.",
      },
      {
        title: "100% Non-Destructive Weld Verification",
        description:
          "Continuous air channel pressure testing (ASTM D5820), vacuum box testing (ASTM D5641), and high-voltage spark testing.",
      },
      {
        title: "Certified Master Seamers & CQC Inspectors",
        description:
          "Experienced site supervisors overseeing deployment layout, trial weld calibrations, and anchor trench backfilling.",
      },
    ],

    whatWeDeliverTitle: "What We Deliver — On-Site Excellence",
    whatWeDeliver: [
      {
        title: "Daily Trial Weld Calibration Logs",
        description:
          "Mandatory start-of-shift and post-break shear and peel tensiometer tests verifying seam strength (ASTM D6392).",
      },
      {
        title: "As-Built Panel Deployment Layout Plans",
        description:
          "Complete CAD-mapped panel layout drawings recording roll numbers, seam numbers, repair patches, and technician IDs.",
      },
      {
        title: "Non-Destructive Air & Vacuum Test Logs",
        description:
          "Full digital logs documenting test pressures, holding durations, pass/fail status, and technician sign-offs.",
      },
      {
        title: "Comprehensive CQC Handover Dossier",
        description:
          "Bound and digital quality handover package with material certificates, weld logs, and installation warranties.",
      },
    ],

    coverageTitle: "Pan-African Installation Deployment",
    coverageText:
      "Our self-sufficient mobile installation teams deploy with containerized field workshops, power generation, automated seamers, extrusion guns, and calibrated tensiometers across remote African mine sites.",
    coverageBullets: [
      "Rapid crew mobilization to Southern, Central, Eastern, and Western African project sites",
      "Self-contained container workshops with backup welding heads, spare parts, and calibration rigs",
      "Full compliance with international mine health, safety, and environmental (SHE) regulations",
    ],
    coverageImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    coverageCaption:
      "IAGI-certified welding technicians conducting dual-track wedge welding on a mining TSF dam.",

    sidebarImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    sidebarCaption: "One of only 5 IAGI Installer Members in Africa.",
    directModelTitle: "Certified Installation Teams. Full Accountability.",
    directModelText:
      "We do not subcontract lining to untrained local labor. Our dedicated certified crew executes and signs off on every weld.",
    directModelItems: [
      {
        title: "IAGI Certified Technicians",
        description:
          "Certified Quality Control (CQC) inspectors and Master Seamers on site full-time.",
      },
      {
        title: "Turnkey Installation Warranties",
        description:
          "Comprehensive workmanship and liner installation warranties matching engineering requirements.",
      },
    ],

    packagingTitle: "Site Rig & Tooling Infrastructure",
    packagingText:
      "Our field deployment packages are equipped with top-tier international welding and testing equipment:",
    packagingItems: [
      "Leister & Demtech automated dual-track hot wedge seamers with digital telemetry",
      "High-output hand extrusion welding guns for pipe boots, penetrations, and sump details",
      "Digital tensiometers calibrated annually for immediate site destructive peel and shear validation",
    ],

    afcftaTitle: "Workforce Mobility & SHE Standards",
    afcftaText:
      "We manage international technician deployment protocols and site safety integration:",
    afcftaItems: [
      "Valid cross-border work permits, mine inductions, and occupational health medicals",
      "Job Safety Analysis (JSA) and Risk Assessment protocols for high-slope containment lining",
      "Local labor skills transfer and auxiliary crew training programs",
    ],

    playbookTitle: "Installation & Seaming Playbook",
    playbookItems: [
      {
        title: "1. Subgrade & Trench Inspection",
        description:
          "Verifying subgrade smoothness, compaction, and anchor trench geometry before liner payout.",
      },
      {
        title: "2. Trial Seam & Calibration",
        description:
          "Passing destructive peel and shear tests on trial weld coupons prior to main seam welding.",
      },
      {
        title: "3. Non-Destructive Testing & Sign-Off",
        description:
          "100% air-channel pressure testing and vacuum box verification with final CQC dossier handover.",
      },
    ],

    statsTitle: "Installation Track Record",
    statsDescription:
      "Decades of certified geomembrane lining across mining, hazardous waste, and water reservoirs.",
    stats: [
      { value: "1 of 5", label: "IAGI Members in Africa" },
      { value: "10M+ m²", label: "Geomembrane Installed" },
      { value: "100%", label: "Non-Destructive Tested" },
      { value: "0", label: "Liner Failures" },
    ],

    productsTitle: "Frequently Installed Products",
    products: ["gse-hdpe-smooth", "gse-hdpe-textured", "bidim-geotextile"],
    downloadsTitle: "Installation Guides & Standards",
    downloads: [
      { label: "Geomembrane Installation Quality Plan (IAGI CQC)", url: "/resources" },
      { label: "HDPE Field Welding & Testing Standard (SANS 1526)", url: "/resources" },
    ],

    seo: {
      title: "IAGI-Aligned Geosynthetics Installation & Seaming | Geosynthetics Africa",
      description:
        "IAGI-certified geomembrane welding, dual-track wedge seaming, extrusion welding, and CQC QA/QC testing across Africa. One of only 5 IAGI members in Africa.",
      keywords:
        "IAGI installer Africa, geomembrane installation, HDPE liner welding, wedge welding, air channel testing, CQC quality control",
    },
  },

  "qa-qc": {
    title: "QA / QC & CQC Testing Services",
    description:
      "Comprehensive Quality Assurance and Construction Quality Control (CQC) for geosynthetics installations, including non-destructive seam testing, destructive tensiometer validation, and certified documentation dossiers.",
    badge: "Documented Quality Assurance",
    heroImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80",
    topSellingProductId: "gse-hdpe-smooth",
    topSellingProductIds: ["gse-hdpe-smooth", "bidim-geotextile"],

    overviewParagraphs: [
      "Quality assurance is the foundation of Geosynthetics Africa's containment philosophy. No containment system leaves site unverified. We enforce strict multi-tier quality control adhering to SANS 1526, GRI-GM13, GRI-GM19, ASTM D6392, and IAGI CQC guidelines.",
      "Our quality control teams conduct continuous field inspections, independent weld tensiometer testing, air channel pressure verification, vacuum box leak detection, and electrical leak location (spark testing), delivering an unassailable digital verification dossier for asset owners and regulatory compliance.",
    ],

    whyChooseTitle: "Why Quality Assurance Matters",
    whyChoose: [
      {
        title: "Zero-Leak Handover Commitment",
        description:
          "100% non-destructive testing of all factory and field seams before project commissioning.",
      },
      {
        title: "Calibrated Field Testing Rigs",
        description:
          "Digital tensiometers calibrated in certified laboratories for immediate on-site verification.",
      },
      {
        title: "Complete Traceability Dossier",
        description:
          "Resin batch numbers, roll tickets, welding technician IDs, and test logs compiled into a single handover file.",
      },
      {
        title: "Third-Party CQA Alignment",
        description:
          "Seamless collaboration with independent consulting engineers and CQA inspectors on site.",
      },
    ],

    whatWeDeliverTitle: "Our QA/QC Deliverables",
    whatWeDeliver: [
      {
        title: "Daily CQC Inspection Logs",
        description:
          "Detailed daily site reports tracking weather conditions, ambient temperatures, and seamed areas.",
      },
      {
        title: "Destructive Shear & Peel Test Certs",
        description:
          "Lab and field test certificates verifying film-tear bond (FTB) failure modes per ASTM D6392.",
      },
      {
        title: "Air Channel Pressure Decay Charts",
        description: "Timed pressure hold logs proving seam airtightness per ASTM D5820 standards.",
      },
      {
        title: "Signed Project Handover Certificate",
        description:
          "Final certification package backed by comprehensive manufacturer and installation warranties.",
      },
    ],

    coverageTitle: "Pan-African QA/QC Inspection Coverage",
    coverageText:
      "We provide third-party verification and on-site CQC supervision for projects throughout Africa, ensuring international compliance on municipal and mining infrastructure.",
    coverageBullets: [
      "On-site mobile laboratory testing units for remote mining sites",
      "Audit services for existing geomembrane liners and rehabilitation projects",
      "Direct alignment with Department of Water and Sanitation (DWS) and regional environmental regulations",
    ],
    coverageImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    coverageCaption:
      "Field CQC technician conducting tensiometer peel testing on geomembrane seam coupon.",

    sidebarImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    sidebarCaption: "Documented QA/QC: No system leaves site unverified.",
    directModelTitle: "Independent & Transparent Quality Verification",
    directModelText:
      "All QA/QC test data is logged digitally in real time and shared directly with the client's engineering team.",
    directModelItems: [
      {
        title: "Daily Digital Submittals",
        description: "Transparent test results shared daily with client site engineers.",
      },
      {
        title: "Regulatory Compliance",
        description:
          "Documentation structured to meet environmental permit and licensing requirements.",
      },
    ],

    packagingTitle: "Precision QA/QC Testing Equipment",
    packagingText:
      "Our testing equipment is maintained and calibrated to international metrology standards:",
    packagingItems: [
      "Digital tensiometers with calibrated load cells for destructive peel and shear testing",
      "Transparent polycarbonate vacuum boxes with calibrated vacuum gauges for extrusion weld verification",
      "High-voltage spark testing equipment for pipe penetrations and extrusion seams",
    ],

    afcftaTitle: "International Testing Standards",
    afcftaText: "All testing protocols are aligned with recognized international standards bodies:",
    afcftaItems: [
      "ASTM D6392 (Integrity of Non-reinforced Geomembrane Seams)",
      "ASTM D5820 (Pressurized Air Channel Evaluation)",
      "SANS 1526 / SANS 10409 (South African National Standards for Geomembranes)",
    ],

    playbookTitle: "QA/QC Inspection Protocol",
    playbookItems: [
      {
        title: "1. Material Receiving QA",
        description:
          "Verification of MTRs, roll tags, and absence of transport damage upon arrival.",
      },
      {
        title: "2. In-Process Seam Verification",
        description:
          "Dual-track air testing and vacuum box inspections executed continuously behind seaming crews.",
      },
      {
        title: "3. Final Handover Dossier",
        description:
          "Compilation of as-built seaming plans, test records, and warranty certificates.",
      },
    ],

    statsTitle: "Quality Assurance Performance",
    statsDescription:
      "Uncompromising quality standards proven across hundreds of critical containment projects.",
    stats: [
      { value: "100%", label: "Seam Verification" },
      { value: "ASTM / SANS", label: "Standard Compliance" },
      { value: "Zero", label: "Unverified Seams" },
      { value: "100%", label: "Handover Dossiers" },
    ],

    productsTitle: "Tested Geosynthetic Systems",
    products: ["gse-hdpe-smooth", "gse-hdpe-textured", "bidim-geotextile"],
    downloadsTitle: "QA/QC Documentation & Guidelines",
    downloads: [
      { label: "Sample CQC Verification Handover Dossier", url: "/resources" },
      { label: "Geomembrane Testing Standards Overview", url: "/resources" },
    ],

    seo: {
      title: "QA / QC & CQC Testing Services | Geosynthetics Africa",
      description:
        "Comprehensive QA/QC and CQC testing for geosynthetics. Air channel pressure testing, vacuum box inspection, tensiometer peel & shear testing.",
      keywords:
        "geosynthetics QA QC, CQC quality control, geomembrane testing, tensiometer peel test, air channel pressure test",
    },
  },

  "design-support": {
    title: "Engineering & Design Support",
    description:
      "Technical engineering support, specification optimization, chemical compatibility analysis, and panel layout design for geosynthetic containment and civil engineering applications.",
    badge: "Technical Engineering Support",
    heroImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    topSellingProductId: "gse-hdpe-smooth",
    topSellingProductIds: ["gse-hdpe-smooth", "bidim-geotextile", "bentofix-gcl"],

    overviewParagraphs: [
      "Selecting the correct geosynthetic polymer, thickness, and interface friction characteristics is essential for long-term project success. Geosynthetics Africa provides consulting engineers, EPC contractors, and asset owners with dedicated design assistance from conceptual design through tender specification.",
      "Our technical team provides slope stability friction angle calculations, transmissivity flow assessments, chemical resistance compatibility reviews, anchor trench dimensioning, and panel layout optimization to minimize site seams and lower total installed costs.",
    ],

    whyChooseTitle: "Why Engage Our Engineering Support?",
    whyChoose: [
      {
        title: "Specification Optimization",
        description: "Ensure designs match performance criteria without costly over-specification.",
      },
      {
        title: "Chemical Compatibility Analysis",
        description:
          "Polymer evaluation against specific mining leachates, hydrocarbons, and acidic tailings liquors.",
      },
      {
        title: "Panel Layout Engineering",
        description:
          "Optimized roll length design to reduce transverse seams and eliminate site wastage.",
      },
      {
        title: "Regulatory Compliance Assistance",
        description:
          "Alignment with SANS, GRI, DWS, and international environmental containment guidelines.",
      },
    ],

    whatWeDeliverTitle: "Engineering Deliverables",
    whatWeDeliver: [
      {
        title: "Material Technical Data Sheets (TDS)",
        description:
          "Comprehensive engineering properties, physical specifications, and test methods.",
      },
      {
        title: "Anchor Trench Calculations",
        description:
          "Pullout resistance and anchor trench sizing for steep slope geomembrane stability.",
      },
      {
        title: "CAD Panel Deployment Drawings",
        description:
          "Detailed seaming drawings with roll orientations and penetration detail drawings.",
      },
      {
        title: "CQA Specification Submittals",
        description:
          "Complete Construction Quality Assurance (CQA) specification clauses ready for tender documents.",
      },
    ],

    coverageTitle: "Pan-African Technical Assistance",
    coverageText:
      "We support engineering consultancies and mining houses across Africa with localized technical data and site visits.",
    coverageBullets: [
      "Direct technical liaison with consulting civil and geotechnical engineers",
      "Guidance on high-UV African climatic exposure and thermal expansion design",
      "Site-specific subgrade preparation specifications",
    ],
    coverageImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=800&q=80",
    coverageCaption: "Geotechnical engineering and design layout planning.",

    sidebarImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=800&q=80",
    sidebarCaption: "Engineering design assistance from specification to execution.",
    directModelTitle: "Direct Engineering Collaboration",
    directModelText: "Collaborate directly with experienced geosynthetics technical specialists.",
    directModelItems: [
      {
        title: "Tender Review Support",
        description:
          "Assistance with BoQ line items, specification review, and alternative system evaluations.",
      },
      {
        title: "Fast Turnaround Submittals",
        description: "Rapid technical submittal packs provided for engineer approval.",
      },
    ],

    packagingTitle: "Design Tools & Calculation Methodologies",
    packagingText: "We utilize proven geotechnical design methodologies and standards:",
    packagingItems: [
      "GRI Standard Guides and Test Methods (GRI-GM13, GM17, GM19, GT12)",
      "Interface shear friction evaluations for multi-layered liner and geotextile systems",
      "Hydraulic transmissivity and flow rate calculations for geocomposite drainage layers",
    ],

    afcftaTitle: "Regional Engineering Codes",
    afcftaText: "Designs structured to meet regional African and international civil standards:",
    afcftaItems: [
      "South African National Standards (SANS 1526, SANS 10409)",
      "Global Industry Standard on Tailings Management (GISTM) containment alignment",
      "Department of Water and Sanitation (DWS) South Africa barrier design norms",
    ],

    playbookTitle: "Design Support Process",
    playbookItems: [
      {
        title: "1. Parameter Assessment",
        description: "Evaluation of containment liquid chemistry, slope angles, and UV exposure.",
      },
      {
        title: "2. System Configuration",
        description:
          "Selection of geomembrane polymer (HDPE/LLDPE), cushion geotextile, and GCL barrier.",
      },
      {
        title: "3. Detail Drawings & Spec Sign-Off",
        description:
          "Delivery of pipe penetration details, anchor trench dimensions, and CQA specs.",
      },
    ],

    statsTitle: "Design Support Highlights",
    statsDescription:
      "Decades of combined engineering experience supporting major African infrastructure.",
    stats: [
      { value: "500+", label: "Projects Engineered" },
      { value: "GRI / SANS", label: "Standardized Designs" },
      { value: "100%", label: "Technical Compliance" },
      { value: "24h", label: "Submittal Response" },
    ],

    productsTitle: "Specified Systems",
    products: ["gse-hdpe-smooth", "gse-hdpe-textured", "bentofix-gcl"],
    downloadsTitle: "Design Resources & CAD Details",
    downloads: [
      { label: "Standard Geomembrane Anchor Trench & Boot CAD Details", url: "/resources" },
      { label: "Geosynthetics Design Guide for Mining Applications", url: "/resources" },
    ],

    seo: {
      title: "Geosynthetic Engineering & Design Support | Geosynthetics Africa",
      description:
        "Technical design assistance, specification optimization, chemical compatibility analysis, and panel layout design for geosynthetic containment projects in Africa.",
      keywords:
        "geosynthetic design, HDPE liner specification, anchor trench design, slope stability geomembrane, CQA specifications",
    },
  },

  "after-sales": {
    title: "After Sales Support & Maintenance",
    description:
      "Comprehensive warranty management, liner integrity audits, site repair services, and maintenance training to ensure long-term containment performance.",
    badge: "Long-Term Project Support",
    heroImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80",
    topSellingProductId: "gse-hdpe-smooth",
    topSellingProductIds: ["gse-hdpe-smooth", "bidim-geotextile"],

    overviewParagraphs: [
      "Our commitment extends well beyond final installation sign-off. Geosynthetics Africa provides ongoing after-sales support, preventative maintenance guidance, annual liner condition assessments, and rapid-response repair crews for operating mining facilities and water reservoirs.",
      "We supply asset owners with maintenance toolkits, extrusion welding kits, repair patches, and technician training to handle minor operational punctures, backed by our technical team for complex expansion and tie-in projects.",
    ],

    whyChooseTitle: "Why Choose Our After-Sales Support?",
    whyChoose: [
      {
        title: "Manufacturer & Workmanship Warranties",
        description: "Clear, enforceable warranty documentation protecting your capital asset.",
      },
      {
        title: "Rapid Site Repair Mobilization",
        description:
          "Fast deployment of certified welders for operational liner repairs and new pipe tie-ins.",
      },
      {
        title: "Maintenance Training for Site Staff",
        description:
          "Practical on-site training on liner inspection, damage prevention, and emergency patching.",
      },
      {
        title: "Expansion & Tie-In Support",
        description: "Seamless connection of new liner phases to existing containment cells.",
      },
    ],

    whatWeDeliverTitle: "After-Sales Deliverables",
    whatWeDeliver: [
      {
        title: "Project Handover Certification Pack",
        description:
          "Complete archive of as-built drawings, material mill certificates, and warranty documents.",
      },
      {
        title: "Maintenance & Care Guidelines",
        description:
          "Best practices for vehicle operation, vegetation control, and water level management over liners.",
      },
      {
        title: "Emergency Repair Kits & Rods",
        description:
          "Hand extrusion welders, welding rod coils, and pre-cut HDPE patch material for on-site maintenance.",
      },
      {
        title: "Annual Liner Condition Audits",
        description:
          "Visual and spark testing inspection reports assessing UV wear, anchor trench integrity, and seams.",
      },
    ],

    coverageTitle: "Pan-African After-Sales Reach",
    coverageText:
      "We maintain ongoing support relationships with mining operations and utilities across the continent.",
    coverageBullets: [
      "Direct technical helpline for asset managers and environmental officers",
      "Spare parts inventory for extrusion guns and wedge welding equipment",
      "Tie-in expertise for multi-phase tailings storage facility raises",
    ],
    coverageImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    coverageCaption: "Ongoing asset support and technical maintenance.",

    sidebarImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    sidebarCaption: "Long-term partnership: Warranties, maintenance, and site training.",
    directModelTitle: "Direct After-Sales Hotline",
    directModelText:
      "Direct access to our senior technical team for warranty queries, spare parts, and site repairs.",
    directModelItems: [
      {
        title: "Direct Account Manager",
        description: "A single dedicated contact for your facility's long-term containment needs.",
      },
      {
        title: "Spare Parts Supply",
        description:
          "Extrusion rod, welding shoes, and patch material dispatched from local depots.",
      },
    ],

    packagingTitle: "Maintenance & Repair Toolkits",
    packagingText: "We provide comprehensive on-site maintenance equipment:",
    packagingItems: [
      "Portable hand extrusion welders suitable for 220V site generators",
      "Pre-packaged HDPE/LLDPE welding rod coils matching installed liner resin specs",
      "Surface grinding tools and scraping accessories for proper patch adhesion",
    ],

    afcftaTitle: "Long-Term Warranty Frameworks",
    afcftaText: "Transparent warranty structures tailored to African operating conditions:",
    afcftaItems: [
      "Manufacturer material longevity warranties against premature UV and chemical degradation",
      "Workmanship warranty against seam separation and installation defects",
      "Comprehensive transferrable warranty certificates upon project handover",
    ],

    playbookTitle: "Maintenance & Support Protocol",
    playbookItems: [
      {
        title: "1. Handover Pack Archiving",
        description:
          "Secure storage of digital as-built records for future facility expansion reference.",
      },
      {
        title: "2. Site Maintenance Training",
        description:
          "Empowering local operational teams with liner protection and emergency repair skills.",
      },
      {
        title: "3. Expansion Tie-Ins",
        description:
          "Engineered preparation and welding of new phase liners to existing anchor trenches.",
      },
    ],

    statsTitle: "After-Sales Track Record",
    statsDescription:
      "Ensuring zero containment downtime across long-term mining and water assets.",
    stats: [
      { value: "100%", label: "Warranty Backing" },
      { value: "24h", label: "Support Response" },
      { value: "10+", label: "Years Facility Life" },
      { value: "Zero", label: "Unresolved Claims" },
    ],

    productsTitle: "Maintenance & Accessory Systems",
    products: ["gse-hdpe-smooth", "bidim-geotextile"],
    downloadsTitle: "Maintenance Downloads",
    downloads: [
      { label: "Geomembrane Liner Care & Maintenance Manual", url: "/resources" },
      { label: "Emergency Liner Repair Guide", url: "/resources" },
    ],

    seo: {
      title: "After-Sales Support & Maintenance | Geosynthetics Africa",
      description:
        "Long-term after-sales support, warranty management, liner integrity audits, maintenance training, and repair services across Africa.",
      keywords:
        "geomembrane maintenance, liner repair Africa, extrusion welding repair, geosynthetics warranty, tailings dam liner inspection",
    },
  },

  __landing: {
    title: "Pan-African Geosynthetics Delivery, Installation & Support",
    description:
      "Geosynthetics Africa delivers integrated pan-African supply, cross-border logistics, IAGI-certified installation, and documented QA/QC for geosynthetics systems.",
    badge: "Integrated Services",
    heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
    landingTitle: "One Partner. Full Accountability.",
    landingSubtitle:
      "From factory supply through cross-border logistics and IAGI-certified field installation, our integrated services ensure system performance — not just material delivery.",
    landingHeroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
    capabilitiesTitle: "Our Logistics & Installation Capabilities",
    capabilities: [
      {
        icon: "Package",
        title: "Container-Direct Supply",
        description:
          "Direct plant-to-project supply of certified GSE geomembranes, Bidim geotextiles, and GCLs at factory pricing.",
      },
      {
        icon: "Globe",
        title: "30+ Country Cross-Border Delivery",
        description:
          "Dedicated heavy-haul flatbed freight and bonded customs clearance reaching remote mine sites across SADC and beyond.",
      },
      {
        icon: "Wrench",
        title: "IAGI-Aligned Field Seaming",
        description:
          "1 of only 5 IAGI Installer Members in Africa. Dual-track wedge welding, extrusion welding, and certified Master Seamers.",
      },
      {
        icon: "ShieldCheck",
        title: "Documented QA/QC Testing",
        description:
          "100% non-destructive air channel pressure testing, vacuum box verification, and tensiometer destructive test logs.",
      },
    ],
    faqs: [
      {
        question: "Does Geosynthetics Africa supply and install across multiple African countries?",
        answer:
          "Yes. We operate across 30+ African nations with proven cross-border logistics corridors, bonded clearing, and mobile IAGI-certified installation teams.",
      },
      {
        question: "Are your installation technicians certified?",
        answer:
          "Yes. Geosynthetics Africa is one of only 5 IAGI Installer Members in Africa. Our field crews include certified Master Seamers and CQC quality inspectors.",
      },
      {
        question: "How do you handle cross-border customs and import duties?",
        answer:
          "We provide SADC Certificates of Origin under preferential trade protocols, HS code alignment, and pre-alert customs processing to eliminate border delays.",
      },
      {
        question: "What quality assurance documentation is provided upon handover?",
        answer:
          "Every installation includes a complete CQC handover dossier: daily trial weld logs, continuous air channel pressure test records, vacuum box test logs, as-built panel layout plans, and material mill test certificates.",
      },
    ],
    ctaTitle: "Need a custom supply, installation, or logistics package for your project?",
    ctaButtonText: "Speak to Our Technical Team",
    ctaButtonUrl: "/contacts",
    seo: {
      title: "Services — Geosynthetics Africa",
      description:
        "Pan-African supply, 30+ country delivery, IAGI-certified installation, and QA/QC of geosynthetics systems across mining, infrastructure, and environmental projects.",
      keywords:
        "geosynthetics services Africa, geomembrane installation, HDPE liner supply, SADC cross-border logistics, IAGI installer Africa",
    },
  },
};
