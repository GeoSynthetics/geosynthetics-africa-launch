// ─── Homepage Site-Builder Content Types ──────────────────────────────────────
// Stored in Supabase site_config under key: "homepage_content"

export interface TrustBadge {
  icon: string;   // image URL
  text: string;   // e.g. "GAI MEMBER / One of only 5 in Africa"
}

export interface ApplicationCard {
  id: string;
  title: string;   // e.g. "MINING SYSTEMS"
  image: string;   // background image URL
  linkUrl: string; // e.g. "/applications/mining-systems"
}

export interface PartnerLogo {
  name: string;
  logo: string;    // image URL
}

export interface ServiceCard {
  id: string;
  icon: string;    // image/icon URL
  title: string;
  description: string;
}

export interface StatCounter {
  id: string;
  value: string;   // e.g. "20+", "1000+"
  label: string;   // e.g. "Years Industry Experience"
}

export interface OfficeLocation {
  id: string;
  name: string;   // e.g. "South Africa"
  type: string;   // e.g. "HQ", "REGIONAL OFFICE"
  linkUrl?: string; // e.g. "https://geosynthetics.co.za/..."
}

export interface ProjectCard {
  id: string;
  image: string;
  tag: string;         // e.g. "RESERVOIR LINING"
  title: string;
  location: string;    // e.g. "South Africa"
  systemDetails: string; // e.g. "HDPE Lining System"
}

export interface HeroSection {
  headlinePrefix: string;     // e.g. "Africa's Integrated"
  headlineAccent: string;     // e.g. "Geosynthetics"
  headlineSuffix: string;     // e.g. "Execution Platform"
  tagline: string;            // e.g. "Designed. Supplied. Installed. Tested. Certified."
  subtext: string;            // e.g. "Complete engineered systems for containment..."
  bgImage: string;            // image URL or blank
  btn1Text: string;           // Primary button text
  btn1Url: string;            // Primary button url
  btn2Text: string;           // Secondary button text
  btn2Url: string;            // Secondary button url
  btn3Text: string;           // Third button text
  btn3Url: string;            // Third button url
}

export interface GsaStep {
  num: number;
  title: string;
  desc: string;
  img: string; // image URL
}

export interface GsaDifference {
  subtitle: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  steps: GsaStep[];
}

export interface HomepageContent {
  // § 1 & 2 – Hero Section
  hero: HeroSection;

  // GSA Difference Section
  gsaDifference: GsaDifference;

  // § 3 – Trust Bar
  trustBadges: TrustBadge[];

  // § 4 – Engineered Systems / App Cards
  engineeredSystems: {
    sectionTitle: string;
    ctaText: string;
    ctaUrl: string;
    cards: ApplicationCard[];
  };

  // § 5 – Partner Logos
  partners: {
    subtitle: string;
    description: string;
    logos: PartnerLogo[];
  };

  // § 6 – Services
  services: {
    sectionTitle: string;
    ctaText: string;
    ctaUrl: string;
    cards: ServiceCard[];
    qualityBoxTitle: string;
    qualityChecklist: string[];
    qualityCtaText: string;
    qualityCtaUrl: string;
    qualityBgImage: string;
  };

  // § 7 – Stats & Pan-African Presence
  presence: {
    stats: StatCounter[];
    presenceTitle: string;
    presenceSubtitle: string;
    offices: OfficeLocation[];
    mapAsset: string; // image URL
  };

  // § 8 – Case Studies / Projects
  projects: {
    sectionTitle: string;
    ctaText: string;
    ctaUrl: string;
    cards: ProjectCard[];
    catalogueBoxHeading: string;
    catalogueBoxContent: string;
    catalogueSearchPlaceholder: string;
    catalogueCtaText: string;
    catalogueCtaUrl: string;
  };

  // § 9 – BOQ CTA Banner
  boqBanner: {
    title: string;
    subtitle: string;
    paragraph: string;
    btn1Text: string;
    btn1Url: string;
    btn2Text: string;
    btn2Url: string;
  };
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    headlinePrefix: "Africa's Integrated",
    headlineAccent: "Geosynthetics",
    headlineSuffix: "Execution Platform",
    tagline: "Designed. Supplied. Installed. Tested. Certified.",
    subtext: "Complete engineered systems for containment, drainage, reinforcement and protection — delivered across Africa with global best-in-class materials and certified execution.",
    bgImage: "",
    btn1Text: "Upload Project BOQ",
    btn1Url: "/contacts",
    btn2Text: "Request Material Supply",
    btn2Url: "/contacts",
    btn3Text: "Speak to Technical Team",
    btn3Url: "/contacts",
  },
  gsaDifference: {
    subtitle: "The GSA Difference",
    title: "One System.\nOne Partner.\nOne Accountability.",
    description: "Unlike product suppliers or installation contractors, we take full responsibility for system performance — from design through to certification.",
    ctaText: "Learn more about GSA",
    ctaUrl: "/services",
    steps: [
      { num: 1, title: "Design", desc: "We design the right system for your application.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { num: 2, title: "Supply", desc: "We source the best materials — brand agnostic.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
      { num: 3, title: "Install", desc: "Certified installation by experienced specialists.", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80" },
      { num: 4, title: "Test", desc: "On-site testing to international standards.", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80" },
      { num: 5, title: "Certify", desc: "Documentation, traceability and certification.", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
    ],
  },
  trustBadges: [
    { icon: "", text: "IAGI MEMBER / One of only 5 in Africa" },
    { icon: "", text: "B-BBEE Level 2 / Proudly South African" },
    { icon: "", text: "Pan-African Logistics / Supply to all African countries" },
    { icon: "", text: "QA/QC Certified / Tested. Assured. Certified." },
  ],
  engineeredSystems: {
    sectionTitle: "ENGINEERED SYSTEMS FOR EVERY APPLICATION",
    ctaText: "VIEW ALL APPLICATIONS →",
    ctaUrl: "/applications",
    cards: [
      { id: "mining", title: "MINING SYSTEMS", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&q=80", linkUrl: "/applications/mining-systems" },
      { id: "water", title: "WATER CONTAINMENT", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", linkUrl: "/applications/water-containment" },
      { id: "waste", title: "WASTE & LANDFILLS", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", linkUrl: "/applications/waste-landfills" },
      { id: "roads", title: "ROADS & INFRASTRUCTURE", image: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=600&q=80", linkUrl: "/applications/roads-infrastructure" },
      { id: "erosion", title: "EROSION CONTROL", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", linkUrl: "/applications/erosion-control" },
      { id: "drainage", title: "DRAINAGE SYSTEMS", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80", linkUrl: "/applications/drainage-systems" },
    ],
  },
  partners: {
    subtitle: "GLOBAL BEST-IN-CLASS MATERIALS",
    description: "Integrated into our engineered systems",
    logos: [],
  },
  services: {
    sectionTitle: "OUR SERVICES",
    ctaText: "VIEW ALL SERVICES →",
    ctaUrl: "/services",
    cards: [
      { id: "supply", icon: "", title: "SUPPLY", description: "Material supply across Africa" },
      { id: "installation", icon: "", title: "INSTALLATION", description: "Certified field installation" },
      { id: "qa-qc", icon: "", title: "QA / QC TESTING", description: "International standards QA/QC" },
      { id: "design", icon: "", title: "DESIGN SUPPORT", description: "Engineered support, end-to-end" },
      { id: "logistics", icon: "", title: "LOGISTICS & CUSTOMS", description: "Pan-African logistics management" },
      { id: "aftercare", icon: "", title: "AFTERCARE SUPPORT", description: "Post-installation technical support" },
    ],
    qualityBoxTitle: "NO SYSTEM LEAVES SITE UNVERIFIED.",
    qualityChecklist: [
      "Weld Integrity Testing (Vacuum & Air Pressure)",
      "Material Compliance (GRI/ASTM Standards)",
      "Material Testing (OIT, Peel, Shear)",
      "Full Traceability & Documentation",
    ],
    qualityCtaText: "VIEW QA/QC PROCESS →",
    qualityCtaUrl: "/quality-assurance",
    qualityBgImage: "",
  },
  presence: {
    stats: [
      { id: "years", value: "20+", label: "Years Industry Experience" },
      { id: "projects", value: "1000+", label: "Projects Completed Across Africa" },
      { id: "countries", value: "50+", label: "Countries Materials Supplied" },
      { id: "products", value: "200+", label: "Products In Our Catalogue" },
    ],
    presenceTitle: "PAN-AFRICAN PRESENCE",
    presenceSubtitle: "One partner. Africa-wide execution.",
    offices: [
      { id: "za", name: "South Africa", type: "HQ", linkUrl: "https://geosynthetics.co.za/gse-hdpe-liner-smooth-geomembrane-supplier-south-africa/" },
      { id: "gh", name: "Ghana", type: "WEST AFRICA MINING HUB", linkUrl: "https://geosynthetics.co.za/" },
      { id: "tz", name: "Tanzania", type: "EAST AFRICA REGIONAL HUB", linkUrl: "https://geosynthetics.co.za/tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids/" },
      { id: "zw", name: "Zimbabwe", type: "REGIONAL OFFICE", linkUrl: "https://geosynthetics.co.za/zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control/" },
      { id: "zm", name: "Zambia", type: "", linkUrl: "https://geosynthetics.co.za/zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier/" },
      { id: "cgo", name: "Democratic Republic of Congo (DRC)", type: "", linkUrl: "https://geosynthetics.co.za/drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier/" },
      { id: "ke", name: "Kenya", type: "", linkUrl: "https://geosynthetics.co.za/contact/" },
      { id: "ci", name: "Côte d'Ivoire", type: "", linkUrl: "https://geosynthetics.co.za/contact/" },
      { id: "mz", name: "Mozambique", type: "", linkUrl: "https://geosynthetics.co.za/contact/" },
      { id: "na", name: "Namibia", type: "", linkUrl: "https://geosynthetics.co.za/contact/" },
      { id: "bw", name: "Botswana", type: "", linkUrl: "https://geosynthetics.co.za/botswana-geomembranes-hdpe-geotextiles-geogrids-supplier/" },
    ],
    mapAsset: "",
  },
  projects: {
    sectionTitle: "PROVEN ON PROJECTS ACROSS AFRICA",
    ctaText: "VIEW ALL CASE STUDIES →",
    ctaUrl: "/resources",
    cards: [
      { id: "brandvlei", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", tag: "RESERVOIR LINING", title: "BRANDVLEI RESERVOIR LINING", location: "South Africa", systemDetails: "HDPE Lining System" },
      { id: "tsf", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80", tag: "TSF LINING SYSTEM", title: "TSF LINING SYSTEM", location: "Ghana", systemDetails: "HDPE + Geotextile Protection" },
      { id: "floating", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", tag: "FLOATING COVER", title: "FLOATING COVER SYSTEM", location: "Zimbabwe", systemDetails: "15,000 m² Installed" },
    ],
    catalogueBoxHeading: "EXPLORE OUR CATALOGUE",
    catalogueBoxContent: "Search, filter and explore over 200 engineered materials for every application.",
    catalogueSearchPlaceholder: "Search products, applications, standards…",
    catalogueCtaText: "VIEW FULL CATALOGUE →",
    catalogueCtaUrl: "/catalogue",
  },
  boqBanner: {
    title: "SUBMIT YOUR BOQ.",
    subtitle: "GET A QUOTE – NOT JUST A PRICE.",
    paragraph: "Upload your BOQ or speak to our technical team for expert recommendations and support.",
    btn1Text: "UPLOAD PROJECT BOQ",
    btn1Url: "/contacts",
    btn2Text: "QUICK CONTACT",
    btn2Url: "/contacts",
  },
};
