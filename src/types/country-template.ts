// ─── Country & Regional Page Template Types ─────────────────────────
// Stored in Supabase site_config under key: "template_countries"

export interface BulletHighlight {
  title: string;
  description: string;
}

export interface LocalFaqItem {
  question: string;
  answer: string;
}

export interface CountryTemplateSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface CountryTemplate {
  /** Country display name (e.g., "South Africa", "Botswana") */
  country: string;

  /** Primary URL slug key matching COUNTRY_SEO_MAP or custom slug */
  slug: string;

  /** Flag emoji (e.g., 🇿🇦, 🇧🇼) */
  flag: string;

  /** Country ISO/short code (e.g., "RSA", "BWA") */
  code: string;

  // ── Hero Section ──
  title: string;
  description: string;
  badge?: string;
  heroImage: string;

  // ── Material Supply & Logistics ──
  supplyTitle?: string;
  supplyDescription?: string;
  supplyHighlights?: BulletHighlight[];
  transitTime?: string;
  logisticsRoutes?: string;
  customsInfo?: string;
  supplyImage?: string;
  supplyCardTitle?: string;
  supplyCardDescription?: string;

  // ── Field Installation & Welding ──
  installationTitle?: string;
  installationDescription?: string;
  installationHighlights?: BulletHighlight[];
  masterSeamersCount?: string;
  equipmentMobilization?: string;
  installationImage?: string;
  installationCardTitle?: string;
  installationCardDescription?: string;

  // ── QA/QC Testing & Standards ──
  qaqcTitle?: string;
  qaqcDescription?: string;
  qaqcHighlights?: BulletHighlight[];
  complianceStandards?: string[];

  // ── Featured Products & Projects ──
  featuredProductIds?: string[];
  featuredProjectSlugs?: string[];

  // ── Regional Office Hub & Contact ──
  officeTitle?: string;
  hubName?: string;
  address?: string;
  phone?: string;
  email?: string;
  coords?: [number, number];

  // ── FAQs & SEO ──
  faqs?: LocalFaqItem[];
  seo: CountryTemplateSeo;
}

export const DEFAULT_COUNTRY_TEMPLATES: Record<string, CountryTemplate> = {
  "gse-hdpe-liner-smooth-geomembrane-supplier-south-africa": {
    country: "South Africa",
    slug: "gse-hdpe-liner-smooth-geomembrane-supplier-south-africa",
    flag: "🇿🇦",
    code: "RSA",
    title: "GSE HDPE Liner & Smooth Geomembrane Supplier South Africa",
    description:
      "Geosynthetics Africa is a leading supplier and IAGI-certified installer of GSE HDPE liners, smooth/textured geomembranes, and GCL systems across South Africa. Managed directly from our Johannesburg headquarters.",
    badge: "Pan-African Supply & QA/QC Hub — South Africa",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Manufacturing, Warehousing & Rapid Dispatch across RSA",
    supplyDescription:
      "Our main distribution and fabrication center in Johannesburg maintains extensive stockpiles of high-density polyethylene (HDPE) liners, Bidim non-woven geotextiles, and drainage geocomposites. We ensure container-direct delivery to all nine provinces.",
    supplyHighlights: [
      {
        title: "Same-Day & Next-Day Dispatch",
        description: "Direct inventory access for quick turnaround on mining, municipal, and agricultural containment projects.",
      },
      {
        title: "Resin-to-Roll Quality Assurance",
        description: "Full Manufacturer Quality Control (MQC) documentation certified to SANS 1526 and ASTM standards.",
      },
      {
        title: "Custom Roll Cutting & Fabrication",
        description: "Tailored roll sizes and pre-fabricated panels to reduce on-site waste and speed up deployment.",
      },
    ],
    transitTime: "Same Day / Next Day Dispatch",
    logisticsRoutes: "Direct distribution across Gauteng, Mpumalanga, Limpopo, North West, Free State, and Coastal Ports.",
    customsInfo: "Local South African SANS compliance clearance with seamless export clearance into SADC corridors.",
    installationTitle: "IAGI-Certified Field Lining & Welding Crews",
    installationDescription:
      "Our accredited installation teams utilize state-of-the-art dual-track hot wedge welders and extrusion guns. We execute rigorous seam testing on every square meter installed.",
    installationHighlights: [
      {
        title: "Certified Master Seamers",
        description: "Qualified technicians with extensive field experience on TSF, heap leach, and municipal landfill projects.",
      },
      {
        title: "Comprehensive Seam Layout Plans",
        description: "Pre-installation design and post-handover as-built layout drawings for full engineering verification.",
      },
    ],
    masterSeamersCount: "12 Certified Crews",
    equipmentMobilization: "24-48 Hours Nationwide",
    qaqcTitle: "Rigorous Third-Party & On-Site QA/QC Protocols",
    qaqcDescription:
      "We operate dedicated field testing rigs conducting non-destructive air pressure and vacuum box testing, as well as destructive tensiometer peel and shear tests.",
    qaqcHighlights: [
      {
        title: "100% Non-Destructive Seam Inspection",
        description: "Every dual-wedge track seam is pressure-tested at 200–250 kPa in strict accordance with GRI-GM19.",
      },
      {
        title: "Destructive Tensiometer Testing",
        description: "Field tensiometer tests verify seam strength exceeds parent sheet tensile properties before final sign-off.",
      },
    ],
    complianceStandards: ["SANS 1526", "GRI-GM13", "GRI-GM19", "ASTM D6392", "IAGI CQC"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile", "gcl-bentonite-liner"],
    featuredProjectSlugs: [],
    officeTitle: "Johannesburg Head Office & Technical Center",
    hubName: "Johannesburg HQ",
    address: "7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, 2191, South Africa",
    phone: "+27 71 093 9964",
    email: "sales@geosynthetics.co.za",
    coords: [-26.2041, 28.0473],
    faqs: [
      {
        question: "What roll widths are available for South African supply?",
        answer: "We supply standard 5.8m and 7.0m roll widths to optimize freight logistics and minimize field seaming.",
      },
      {
        question: "Do you supply both Smooth and Textured HDPE geomembranes?",
        answer: "Yes, we stock both single-sided and double-sided textured HDPE geomembranes for steep slope stability applications.",
      },
    ],
    seo: {
      title: "GSE HDPE Liner & Smooth Geomembrane Supplier South Africa | Geosynthetics Africa",
      description:
        "Geosynthetics Africa is a leading supplier and IAGI-certified installer of GSE HDPE liners and smooth geomembranes in South Africa. Contact our Johannesburg head office.",
      keywords: "GSE HDPE Liner, smooth geomembrane supplier, South Africa geomembrane, geosynthetics installation South Africa",
    },
  },
  "botswana-geomembranes-hdpe-geotextiles-geogrids-supplier": {
    country: "Botswana",
    slug: "botswana-geomembranes-hdpe-geotextiles-geogrids-supplier",
    flag: "🇧🇼",
    code: "BWA",
    title: "Botswana Geomembranes, HDPE, Geotextiles & Geogrids Supplier",
    description:
      "Leading supplier of HDPE geomembranes, Bidim geotextiles, and geogrids for mining, water conservation, and infrastructure projects across Botswana.",
    badge: "Botswana Logistics & Mining Supply Corridor",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    supplyTitle: "Dedicated Freight & Customs Clearance to Gaborone, Jwaneng & Orapa",
    supplyDescription:
      "We streamline cross-border logistics from Johannesburg to Gaborone, Francistown, and remote mine sites, handling SAD500 customs documentation and border tax clearances.",
    supplyHighlights: [
      {
        title: "2-3 Day Cross-Border Lead Times",
        description: "Scheduled road freight via Tlokweng and Pioneer Gate border posts.",
      },
      {
        title: "SADC Duty Exemptions",
        description: "SADC Certificate of Origin processing to minimize import tariffs for local contractors.",
      },
    ],
    transitTime: "2 - 3 Days (Road Freight)",
    logisticsRoutes: "Johannesburg → Pioneer Gate / Tlokweng → Gaborone / Jwaneng / Francistown",
    customsInfo: "Complete SAD500 documentation, SADC Certificate of Origin, and BURS compliance.",
    installationTitle: "Mining & Containment Installation Services in Botswana",
    installationDescription:
      "Deploying experienced installation teams for Tailings Storage Facilities (TSF), raw water reservoirs, and solar evaporation ponds.",
    installationHighlights: [
      {
        title: "Tailings & Leach Pad Specialist Crews",
        description: "Experienced in high-UV, high-temperature environmental conditions common in the Kalahari.",
      },
    ],
    masterSeamersCount: "6 Mobile Field Teams",
    equipmentMobilization: "48 Hours to Gaborone / Jwaneng",
    qaqcTitle: "Full QA/QC Documentation & Certification",
    qaqcDescription:
      "Rigorous quality control matching international mining house standards (Debswana, Lucara, Khoemacau).",
    qaqcHighlights: [
      {
        title: "On-Site Tensiometer & Air Testing",
        description: "Complete daily seam logs and destructive test certificate handovers.",
      },
    ],
    complianceStandards: ["BURS Clearance", "GRI-GM13", "ASTM D6392", "SANS 1526"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Gaborone Distribution & Logistics Hub",
    hubName: "Gaborone Logistics Hub",
    address: "Plot 22017, Gaborone West Industrial, Gaborone, Botswana",
    phone: "+27 71 093 9964",
    email: "botswana@geosynthetics.co.za",
    coords: [-24.6282, 25.9231],
    faqs: [
      {
        question: "How are border clearances handled for Botswana mining sites?",
        answer: "Our logistics team manages all SAD500 entries, SADC certificates, and BURS clearances prior to dispatch.",
      },
    ],
    seo: {
      title: "Botswana Geomembranes, HDPE, Geotextiles & Geogrids Supplier | Geosynthetics Africa",
      description:
        "Leading supplier of HDPE geomembranes, geotextiles, and geogrids for mining and infrastructure projects in Botswana. Reliable cross-border logistics to Gaborone.",
      keywords: "Botswana geomembranes, HDPE supplier Botswana, geotextiles Gaborone, geogrids Botswana",
    },
  },
  "tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids": {
    country: "Tanzania",
    slug: "tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids",
    flag: "🇹🇿",
    code: "TZA",
    title: "Tanzania Geosynthetics Supplier — HDPE Liners, Geotextiles & Geogrids",
    description:
      "High-quality HDPE liners, geotextiles, and geogrids for mining TSF, gold processing, and water containment projects in Tanzania. East Africa operations hub.",
    badge: "East Africa Hub — Tanzania",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Port of Dar es Salaam & Central Corridor Freight Hub",
    supplyDescription:
      "Direct container shipments to Dar es Salaam port with overland transit to Lake Victoria goldfields (Mwanza, Kahama, Geita).",
    supplyHighlights: [
      {
        title: "Port Clearance & Escort Logistics",
        description: "Handling TRA (Tanzania Revenue Authority) customs clearing and container trucking.",
      },
    ],
    transitTime: "5 - 7 Days (Port/Road Freight)",
    logisticsRoutes: "Dar es Salaam Port → Central Corridor → Mwanza / Kahama / Shinyanga",
    customsInfo: "TRA clearance, TBS compliance, and East African Community tariff processing.",
    installationTitle: "Mining TSF & Water Reservoir Installation in Tanzania",
    installationDescription:
      "Mobile welding units equipped with dual-track hot wedge technology for heavy mining containment.",
    installationHighlights: [
      {
        title: "East Africa Mobile Installation Units",
        description: "Rapid deployment across Lake Victoria gold belt and agricultural irrigation sites.",
      },
    ],
    masterSeamersCount: "8 Field Crews",
    equipmentMobilization: "72 Hours in East Africa",
    qaqcTitle: "Independent Quality Testing & Certification",
    qaqcDescription:
      "Destructive tensiometer and non-destructive spark/air testing matching TBS and international standards.",
    qaqcHighlights: [
      {
        title: "Comprehensive Field Test Logs",
        description: "Full compliance verification for gold leach pads and water reservoirs.",
      },
    ],
    complianceStandards: ["TBS Compliant", "GRI-GM13", "ASTM D6392"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Dar es Salaam Regional Office",
    hubName: "Dar es Salaam Hub",
    address: "Kurasini Industrial Area, Dar es Salaam, Tanzania",
    phone: "+27 71 093 9964",
    email: "tanzania@geosynthetics.co.za",
    coords: [-6.7924, 39.2083],
    faqs: [
      {
        question: "Do you supply geosynthetics to mining sites in Mwanza and Geita?",
        answer: "Yes, we regularly deliver containerized materials directly to mine laydowns across the Lake Victoria region.",
      },
    ],
    seo: {
      title: "Tanzania Geosynthetics Supplier — HDPE Liners, Geotextiles, Geogrids | Geosynthetics Africa",
      description:
        "High-quality HDPE liners, geotextiles, and geogrids for mining TSF and water containment projects in Tanzania. East Africa operations hub.",
      keywords: "Tanzania geosynthetics, HDPE liners Tanzania, geotextiles Dar es Salaam, geogrids Tanzania",
    },
  },
  "zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control": {
    country: "Zimbabwe",
    slug: "zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control",
    flag: "🇿🇼",
    code: "ZWE",
    title: "Zimbabwe River Rehabilitation & JuteSoilLock 292 Erosion Control",
    description:
      "Specialized supplier of JuteSoilLock 292, erosion control blankets, HDPE geomembranes, and riverbank stabilization solutions in Zimbabwe.",
    badge: "Zimbabwe Infrastructure & Rehabilitation",
    heroImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    supplyTitle: "Beitbridge Corridor Logistics to Harare & Bulawayo",
    supplyDescription:
      "Efficient road freight via Beitbridge border post with full ZIMRA tax and customs clearance support.",
    supplyHighlights: [
      {
        title: "Fast Cross-Border Dispatch",
        description: "2-4 day transit time from Johannesburg warehouse directly to project sites.",
      },
    ],
    transitTime: "2 - 4 Days (Road Freight)",
    logisticsRoutes: "Johannesburg → Beitbridge → Bulawayo / Harare / Mutare",
    customsInfo: "ZIMRA clearance, CD1 forms, and SADC preferential trade certificates.",
    installationTitle: "Erosion Control & Riverbank Rehabilitation Field Support",
    installationDescription:
      "Expert installation supervision for bio-engineering, jute matting, and geomembrane canal lining.",
    installationHighlights: [
      {
        title: "Bio-Engineering & Jute Mat Deployment",
        description: "Sustainable slope protection and river channel rehabilitation.",
      },
    ],
    masterSeamersCount: "4 Specialized Crews",
    equipmentMobilization: "48 Hours to Harare",
    qaqcTitle: "Erosion Control & Liner Testing Standards",
    qaqcDescription:
      "Field quality assurance verifying tensile integrity, anchoring security, and seam quality.",
    qaqcHighlights: [
      {
        title: "Site Anchor Trench & Seam Inspections",
        description: "Strict quality control for river channels and dam liners.",
      },
    ],
    complianceStandards: ["ZIMRA Clearance", "ASTM D4595", "GRI-GM13"],
    featuredProductIds: ["bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Harare Operations Hub",
    hubName: "Harare Hub",
    address: "Msasa Industrial Area, Harare, Zimbabwe",
    phone: "+27 71 093 9964",
    email: "zimbabwe@geosynthetics.co.za",
    coords: [-17.8252, 31.0335],
    faqs: [
      {
        question: "What is JuteSoilLock 292 used for in Zimbabwe?",
        answer: "It is an eco-friendly biodegradable natural fiber matrix designed for slope erosion control and river channel stabilization.",
      },
    ],
    seo: {
      title: "Zimbabwe River Rehabilitation & JuteSoilLock 292 Erosion Control | Geosynthetics Africa",
      description:
        "Erosion control, river rehabilitation, and JuteSoilLock 292 supply and installation in Zimbabwe. Technical support and logistics cleared to Harare.",
      keywords: "Zimbabwe river rehabilitation, JuteSoilLock 292, erosion control Zimbabwe, Harare geosynthetics",
    },
  },
  "zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier": {
    country: "Zambia",
    slug: "zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier",
    flag: "🇿🇲",
    code: "ZMB",
    title: "Zambia HDPE Liners, Bidim Geotextiles & Geogrids Supplier",
    description:
      "Premium HDPE liners, Bidim geotextiles, and geogrids supplier in Zambia. Specializing in Copperbelt mining TSF lining and agricultural reservoirs.",
    badge: "Copperbelt Mining & Agricultural Supply Hub",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    supplyTitle: "Chirundu & Kazungula Corridor Freight to Copperbelt",
    supplyDescription:
      "Streamlined transport to Lusaka, Ndola, Kitwe, and Solwezi via Kazungula Bridge or Chirundu border posts.",
    supplyHighlights: [
      {
        title: "Copperbelt Mine Direct Delivery",
        description: "Scheduled container and flatbed truck deliveries to major copper and cobalt mines.",
      },
    ],
    transitTime: "3 - 5 Days (Road Freight)",
    logisticsRoutes: "Johannesburg → Kazungula / Chirundu → Lusaka → Ndola / Kitwe / Solwezi",
    customsInfo: "ZRA clearing, ASYCUDA documentation, and SADC tariff preference processing.",
    installationTitle: "Mining TSF & Heap Leach Pad Lining in Zambia",
    installationDescription:
      "Extensive experience installing primary and secondary geomembrane containment systems across the Copperbelt.",
    installationHighlights: [
      {
        title: "Copper Mining Containment Crews",
        description: "Specialized in acidic solution containment and large-area tailings dam lining.",
      },
    ],
    masterSeamersCount: "6 Field Installation Crews",
    equipmentMobilization: "48 Hours to Kitwe",
    qaqcTitle: "Comprehensive QA/QC Field Testing Logs",
    qaqcDescription:
      "Continuous seam quality monitoring, vacuum box testing, and daily tensiometer coupon testing.",
    qaqcHighlights: [
      {
        title: "ZRA & Mining House Compliance Reports",
        description: "Documented QA/QC packages handed over upon project completion.",
      },
    ],
    complianceStandards: ["ZRA Cleared", "GRI-GM13", "ASTM D6392"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Kitwe / Lusaka Regional Logistics Hub",
    hubName: "Kitwe Logistics Hub",
    address: "Heavy Industrial Area, Kitwe, Copperbelt, Zambia",
    phone: "+27 71 093 9964",
    email: "zambia@geosynthetics.co.za",
    coords: [-12.8024, 28.2132],
    faqs: [
      {
        question: "How long does road transport take from Johannesburg to Solwezi?",
        answer: "Typical transit times range between 4 to 6 days including border clearances at Kazungula.",
      },
    ],
    seo: {
      title: "Zambia HDPE Liners, Bidim Geotextiles & Geogrids Supplier | Geosynthetics Africa",
      description:
        "Premium HDPE liners, Bidim geotextiles, and geogrids supplier in Zambia. Specializing in mining TSF lining and agricultural reservoirs.",
      keywords: "Zambia HDPE liners, Bidim geotextiles Zambia, geogrids Lusaka, mining lining Zambia",
    },
  },
  "drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier": {
    country: "Democratic Republic of Congo (DRC)",
    slug: "drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier",
    flag: "🇨🇩",
    code: "COD",
    title: "DRC Congo Geosynthetics — Bidim HDPE Geomembranes Supplier",
    description:
      "Bidim geotextiles and HDPE geomembranes supplier in the Democratic Republic of Congo (DRC) for mining and heavy confinement projects in Lualaba and Haut-Katanga.",
    badge: "DRC Mining Corridor Hub — Kolwezi & Lubumbashi",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Kasumbalesa Border Corridor to Lubumbashi & Kolwezi",
    supplyDescription:
      "Dedicated heavy-haul logistics handling customs bond clearances into Katanga and Lualaba provinces.",
    supplyHighlights: [
      {
        title: "Heavy Confinement Materials Stocking",
        description: "Thick 1.5mm and 2.0mm HDPE geomembranes engineered for heavy copper/cobalt mining.",
      },
    ],
    transitTime: "5 - 8 Days (Road Freight)",
    logisticsRoutes: "Johannesburg → Kasumbalesa → Lubumbashi → Likasi → Kolwezi",
    customsInfo: "DGDA customs clearance, OCC inspection certificates, and transit bond management.",
    installationTitle: "High-Confinement Geomembrane Installation in DRC",
    installationDescription:
      "Trained technicians operating under strict mining safety standards in remote Congo mining sites.",
    installationHighlights: [
      {
        title: "Kolwezi & Lubumbashi Field Operations",
        description: "Equipped for large-scale TSF lining and acid containment ponds.",
      },
    ],
    masterSeamersCount: "6 Field Crews",
    equipmentMobilization: "72 Hours in Katanga",
    qaqcTitle: "OCC & Mining House QA/QC Verification",
    qaqcDescription:
      "Independent QA testing logging every weld, spark test, and destructive coupon test on site.",
    qaqcHighlights: [
      {
        title: "Complete Quality Assurance Dossier",
        description: "Handover reports detailing seam numbers, weather conditions, and test results.",
      },
    ],
    complianceStandards: ["DGDA / OCC Compliant", "GRI-GM13", "ASTM D6392"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Kolwezi / Lubumbashi Operations Center",
    hubName: "Kolwezi Hub",
    address: "Route de Likasi, Lubumbashi / Kolwezi, Lualaba, DRC",
    phone: "+27 71 093 9964",
    email: "drc@geosynthetics.co.za",
    coords: [-11.6609, 27.4794],
    faqs: [
      {
        question: "Do you supply 2.0mm HDPE geomembrane for DRC copper mines?",
        answer: "Yes, 1.5mm and 2.0mm heavy HDPE geomembranes are standard stock items for DRC mining projects.",
      },
    ],
    seo: {
      title: "DRC Congo Geosynthetics — Bidim HDPE Geomembranes Supplier | Geosynthetics Africa",
      description:
        "Bidim geotextiles and HDPE geomembranes supplier in the Democratic Republic of Congo (DRC) for mining and heavy confinement projects.",
      keywords: "DRC geosynthetics, Bidim Congo, HDPE geomembranes DRC, Kolwezi mining lining",
    },
  },
  "kenya-geosynthetics-supplier-contact": {
    country: "Kenya",
    slug: "kenya-geosynthetics-supplier-contact",
    flag: "🇰🇪",
    code: "KEN",
    title: "Kenya Geosynthetics Supplier — Contact & Technical Support",
    description:
      "Contact Geosynthetics Africa for premium agricultural, municipal, and civil infrastructure geosynthetic supply and lining installations in Kenya.",
    badge: "East Africa Logistics Hub — Kenya",
    heroImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80",
    supplyTitle: "Port of Mombasa Shipping & Container Logistics to Nairobi",
    supplyDescription:
      "Direct ocean freight to Mombasa port with rapid customs clearance and transport to Nairobi, Rift Valley, and Kisumu.",
    supplyHighlights: [
      {
        title: "Agricultural Water Reservoir Supply",
        description: "UV-stabilized geomembranes tailored for horticulture and irrigation dams.",
      },
    ],
    transitTime: "5 - 7 Days (Port/Road Freight)",
    logisticsRoutes: "Mombasa Port → SGR / Freight Corridor → Nairobi → Naivasha / Eldoret",
    customsInfo: "KRA customs clearing, KEBS quality compliance certification, and EAC tariff processing.",
    installationTitle: "Water Containment & Infrastructure Lining in Kenya",
    installationDescription:
      "IAGI-certified field installation for flower farm dams, municipal landfills, and road stabilization.",
    installationHighlights: [
      {
        title: "Agricultural & Municipal Installation Crews",
        description: "Rapid deployment across Naivasha, Nakuru, and Mount Kenya farming regions.",
      },
    ],
    masterSeamersCount: "4 Mobile Field Teams",
    equipmentMobilization: "48 Hours in Kenya",
    qaqcTitle: "KEBS & International QA/QC Standards",
    qaqcDescription:
      "On-site seam testing and material inspection ensuring long-term UV resistance and zero-leak performance.",
    qaqcHighlights: [
      {
        title: "Zero-Leakage Seam Inspection",
        description: "Spark testing and vacuum box verification for water storage integrity.",
      },
    ],
    complianceStandards: ["KEBS Compliant", "KRA Clearance", "GRI-GM13"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Nairobi Regional Hub",
    hubName: "Nairobi Hub",
    address: "Mombasa Road, Industrial Area, Nairobi, Kenya",
    phone: "+27 71 093 9964",
    email: "kenya@geosynthetics.co.za",
    coords: [-1.2921, 36.8219],
    faqs: [
      {
        question: "Which geomembranes are best suited for Naivasha agricultural dams?",
        answer: "Our 1.0mm and 1.5mm high-density polyethylene (HDPE) liners provide excellent UV resistance and zero seepage for irrigation reservoirs.",
      },
    ],
    seo: {
      title: "Kenya Geosynthetics Supplier — Contact & Technical Support | Geosynthetics Africa",
      description:
        "Contact Geosynthetics Africa for premium agricultural and municipal water containment supply and lining installations in Kenya.",
      keywords: "Kenya geosynthetics, geomembrane supplier Kenya, Nairobi lining installations, water containment Kenya",
    },
  },
  "cote-divoire-geosynthetics-supplier-contact": {
    country: "Côte d'Ivoire",
    slug: "cote-divoire-geosynthetics-supplier-contact",
    flag: "🇨🇮",
    code: "CIV",
    title: "Côte d'Ivoire Geosynthetics Supplier — West Africa Hub",
    description:
      "Contact our West Africa hub in Abidjan for geosynthetics supply, coastal erosion control, gold mine lining, and port infrastructure projects in Côte d'Ivoire.",
    badge: "West Africa Hub — Abidjan",
    heroImage: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1920&q=80",
    supplyTitle: "Port of Abidjan Shipping & West African Distribution",
    supplyDescription:
      "Direct shipments via Autonomous Port of Abidjan serving mining projects in Yamoussoukro, Korhogo, and coastal civil works.",
    supplyHighlights: [
      {
        title: "Coastal Erosion & Port Infrastructure Supply",
        description: "Heavy geotextile containers and geogrids engineered for marine and port applications.",
      },
    ],
    transitTime: "7 - 10 Days (Sea Freight / Local Logistics)",
    logisticsRoutes: "Port of Abidjan → Highway Corridor → Yamoussoukro / Korhogo / San-Pédro",
    customsInfo: "Douanes Ivoiriennes clearing, CODINORM certification, and ECOWAS trade documentation.",
    installationTitle: "Gold Mining TSF & Coastal Protection Installation",
    installationDescription:
      "Bilingual installation engineers providing specialized geomembrane welding and coastal geotextile placement.",
    installationHighlights: [
      {
        title: "Bilingual Technical Field Teams",
        description: "Fluent in French and English for seamless coordination on international engineering projects.",
      },
    ],
    masterSeamersCount: "4 Installation Crews",
    equipmentMobilization: "72 Hours in Ivory Coast",
    qaqcTitle: "CODINORM & International Quality Assurance",
    qaqcDescription:
      "Comprehensive field QA testing verifying seam shear and peel strength under West African climate conditions.",
    qaqcHighlights: [
      {
        title: "Seam Quality & Hydrostatic Pressure Testing",
        description: "Full compliance documentation for West African gold mine operators.",
      },
    ],
    complianceStandards: ["CODINORM Compliant", "ECOWAS Trade", "GRI-GM13"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Abidjan Regional Hub",
    hubName: "Abidjan Hub",
    address: "Zone Industrielle de Yopougon, Abidjan, Côte d'Ivoire",
    phone: "+27 71 093 9964",
    email: "civ@geosynthetics.co.za",
    coords: [5.36, -4.0083],
    faqs: [
      {
        question: "Do your technical teams speak French?",
        answer: "Oui, our West African field installation engineers and project managers are fully bilingual.",
      },
    ],
    seo: {
      title: "Côte d'Ivoire Geosynthetics Supplier — Contact & Supply | Geosynthetics Africa",
      description:
        "Contact our West Africa hub in Abidjan for geosynthetics supply, coastal erosion control, and port infrastructure projects in Côte d'Ivoire.",
      keywords: "Côte d'Ivoire geosynthetics, Abidjan geomembrane supplier, coastal erosion Côte d'Ivoire",
    },
  },
  "mozambique-geosynthetics-supplier-contact": {
    country: "Mozambique",
    slug: "mozambique-geosynthetics-supplier-contact",
    flag: "🇲🇿",
    code: "MOZ",
    title: "Mozambique Geosynthetics Supplier — Maputo Regional Office",
    description:
      "Contact our Maputo regional hub for coastal works supply, geosynthetic clay liners (GCL), heavy HDPE geomembranes, and installation QA/QC across Mozambique.",
    badge: "Mozambique Regional Hub — Maputo",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    supplyTitle: "Ressano Garcia Corridor Freight & Port Logistics",
    supplyDescription:
      "Direct road freight from Johannesburg via Ressano Garcia border or shipping into Maputo / Beira ports serving Tete mining and Nacala projects.",
    supplyHighlights: [
      {
        title: "2-3 Day Fast Transport to Maputo",
        description: "Direct highway transport from our main distribution warehouse to Southern Mozambique.",
      },
    ],
    transitTime: "2 - 4 Days (Road/Port Logistics)",
    logisticsRoutes: "Johannesburg → Ressano Garcia → Maputo / Beira / Tete / Pemba",
    customsInfo: "Alfândegas de Moçambique customs clearing, DU document processing, and SADC certificates.",
    installationTitle: "LNG, Mining & Coastal Lining Installation in Mozambique",
    installationDescription:
      "Extensive experience installing GCLs, geomembranes, and geogrids for marine protection, coal tailings, and LNG projects.",
    installationHighlights: [
      {
        title: "Bilingual Portuguese/English Field Crews",
        description: "Specialized in coastal erosion protection and heavy lining systems.",
      },
    ],
    masterSeamersCount: "5 Field Installation Crews",
    equipmentMobilization: "48 Hours to Maputo",
    qaqcTitle: "Alfândegas & International Standard QA/QC",
    qaqcDescription:
      "Field tensiometer and air pressure testing with full Portuguese/English test certificates.",
    qaqcHighlights: [
      {
        title: "Hydrostatic & Vacuum Seam Testing",
        description: "Zero-leakage assurance certified for chemical and saline environments.",
      },
    ],
    complianceStandards: ["Alfândegas Compliant", "SADC Preference", "GRI-GM13"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "gcl-bentonite-liner"],
    featuredProjectSlugs: [],
    officeTitle: "Maputo Regional Hub",
    hubName: "Maputo Hub",
    address: "Avenida 24 de Julho, Maputo, Mozambique",
    phone: "+27 71 093 9964",
    email: "mozambique@geosynthetics.co.za",
    coords: [-25.9692, 32.5732],
    faqs: [
      {
        question: "How fast can material be delivered to Maputo?",
        answer: "Standard road freight from our Johannesburg hub arrives in Maputo within 2 to 3 days post border clearance.",
      },
    ],
    seo: {
      title: "Mozambique Geosynthetics Supplier — Maputo Regional Office | Geosynthetics Africa",
      description:
        "Contact our Maputo regional hub for coastal works supply, geosynthetic clay liners (GCL), and geomembrane installation QA/QC in Mozambique.",
      keywords: "Mozambique geosynthetics, Maputo geomembrane, GCL Mozambique, coastal works Mozambique",
    },
  },
  "ghana-geosynthetics-supplier-contact": {
    country: "Ghana",
    slug: "ghana-geosynthetics-supplier-contact",
    flag: "🇬🇭",
    code: "GHA",
    title: "Ghana Geosynthetics Supplier — West Africa Mining Hub",
    description:
      "Contact Geosynthetics Africa in Accra for West African gold mining TSF lining projects, geotextile supply, and IAGI-certified geomembrane installations.",
    badge: "West Africa Mining Hub — Ghana",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Port of Tema Shipping & Container Logistics to Tarkwa",
    supplyDescription:
      "Direct container shipments to Tema port serving major gold mines in Tarkwa, Obuasi, Kumasi, and Ahafo regions.",
    supplyHighlights: [
      {
        title: "Gold Mine Heap Leach & TSF Liners",
        description: "High chemical-resistance HDPE geomembranes designed for cyanide leach containment.",
      },
    ],
    transitTime: "7 - 10 Days (Sea Freight / Local Trucking)",
    logisticsRoutes: "Tema Port → Accra / Kumasi Highway → Tarkwa / Obuasi / Ahafo",
    customsInfo: "GRA customs clearance, GSA (Ghana Standards Authority) inspection, and ICUMS processing.",
    installationTitle: "Gold Mining TSF & Tailings Lining in Ghana",
    installationDescription:
      "Master seamer teams experienced in large-scale gold mining tailings facility lining and capping.",
    installationHighlights: [
      {
        title: "Tarkwa & Obuasi Field Installation",
        description: "IAGI-certified wedge welding crews for gold mining tailings storage facilities.",
      },
    ],
    masterSeamersCount: "6 Field Installation Crews",
    equipmentMobilization: "72 Hours in Ghana",
    qaqcTitle: "GRA & International Mining House QA/QC",
    qaqcDescription:
      "Full daily seam logs, destructive coupon test records, and as-built seaming map handovers.",
    qaqcHighlights: [
      {
        title: "Cyanide Leach Seam Verification",
        description: "100% air-pressure and tensiometer testing prior to chemical loading.",
      },
    ],
    complianceStandards: ["GRA / GSA Compliant", "ICUMS Cleared", "GRI-GM13"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Accra / Tarkwa Regional Hub",
    hubName: "Accra Hub",
    address: "Spintex Road, Accra / Tarkwa Mining District, Ghana",
    phone: "+27 71 093 9964",
    email: "ghana@geosynthetics.co.za",
    coords: [5.6037, -0.187],
    faqs: [
      {
        question: "Do you supply cyanide-resistant HDPE liners for gold leaching in Ghana?",
        answer: "Yes, our high-density polyethylene geomembranes are formulated for extreme chemical resistance against cyanide and acid solutions.",
      },
    ],
    seo: {
      title: "Ghana Geosynthetics Supplier — West Africa Mining Hub | Geosynthetics Africa",
      description:
        "Contact Geosynthetics Africa in Accra for West African gold mining TSF lining projects, geosynthetics supply, and IAGI-certified installations.",
      keywords: "Ghana geosynthetics, Accra geomembrane supplier, gold mining TSF Ghana, geosynthetics West Africa",
    },
  },
  "namibia-geosynthetics-supplier-contact": {
    country: "Namibia",
    slug: "namibia-geosynthetics-supplier-contact",
    flag: "🇳🇦",
    code: "NAM",
    title: "Namibia Geosynthetics Supplier — Windhoek Logistics Hub",
    description:
      "Contact our Windhoek office for uranium mining lining, water conservation reservoirs, geotextiles, and geosynthetics supply across Namibia.",
    badge: "Trans-Kalahari Logistics Hub — Namibia",
    heroImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    supplyTitle: "Trans-Kalahari Corridor Logistics to Windhoek & Walvis Bay",
    supplyDescription:
      "Express road transport from Johannesburg via Trans-Kalahari Corridor or sea freight into Walvis Bay port.",
    supplyHighlights: [
      {
        title: "Express 3-4 Day Corridor Freight",
        description: "Direct transport to Windhoek, Swakopmund, Walvis Bay, and southern mining hubs.",
      },
    ],
    transitTime: "3 - 4 Days (Road Freight)",
    logisticsRoutes: "Johannesburg → Trans-Kalahari Corridor → Windhoek → Walvis Bay / Swakopmund",
    customsInfo: "NamRA customs clearance, SADC certificate processing, and SACU duty-free status.",
    installationTitle: "Uranium Mining & Water Conservation Lining in Namibia",
    installationDescription:
      "High-UV resistant geomembrane installation for desert water reservoirs, uranium processing, and municipal works.",
    installationHighlights: [
      {
        title: "High-UV Desert Installation Specialist Crews",
        description: "Equipped to handle extreme thermal expansion/contraction in desert environments.",
      },
    ],
    masterSeamersCount: "5 Field Installation Crews",
    equipmentMobilization: "48 Hours to Windhoek",
    qaqcTitle: "NamRA & SACU Standard QA/QC Protocols",
    qaqcDescription:
      "Independent testing logging ambient temperature during welding, dual-wedge pressure, and coupon destructive tests.",
    qaqcHighlights: [
      {
        title: "Thermal Expansion Seaming Verification",
        description: "Custom layout planning to prevent thermal stress wrinkling under Namibian sun.",
      },
    ],
    complianceStandards: ["NamRA Compliant", "SACU Duty-Free", "GRI-GM13"],
    featuredProductIds: ["hdpe-smooth-geomembrane", "bidim-geotextile"],
    featuredProjectSlugs: [],
    officeTitle: "Windhoek Distribution Center",
    hubName: "Windhoek Hub",
    address: "12 Edison Street, Southern Industrial Area, Windhoek, Namibia",
    phone: "+27 71 093 9964",
    email: "namibia@geosynthetics.co.za",
    coords: [-22.5609, 17.0658],
    faqs: [
      {
        question: "How do you manage extreme Namibian desert heat during geomembrane installation?",
        answer: "We adjust welding speeds, pre-heat temperatures, and perform panel laydown in early morning hours to manage thermal contraction.",
      },
    ],
    seo: {
      title: "Namibia Geosynthetics Supplier — Windhoek Logistics Hub | Geosynthetics Africa",
      description:
        "Contact our Windhoek office for uranium mining lining, water conservation reservoirs, and geosynthetics supply across Namibia.",
      keywords: "Namibia geosynthetics, Windhoek geomembrane supplier, uranium mining lining Namibia",
    },
  },
};
