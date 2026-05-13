export type NavTarget = {
  to: string;
  params?: Record<string, string>;
};

export type MegaLink = NavTarget & { label: string; icon?: string };
export type MegaProductItem = NavTarget & { label: string; spec: string };
export type MegaFeatureItem = NavTarget & { title: string; description: string; image: string };
export type MegaQuickAction = NavTarget & { title: string; description: string; icon: string };

export type MegaMenuConfig = {
  key: "products" | "applications" | "services" | "industries";
  label: string;
  to: string;
  columns: {
    primaryTitle: string;
    primary: MegaLink[];
    secondaryTitle: string;
    secondary: MegaLink[];
    featuredTitle: string;
    featured: MegaFeatureItem[] | MegaProductItem[];
    featuredKind: "image" | "product";
    quickActionsTitle: string;
    quickActions: MegaQuickAction[];
  };
};

import logo1 from "@/assets/brand-logos/Logo Brand 1.png";
import logo2 from "@/assets/brand-logos/Logo Brand 2.png";
import logo3 from "@/assets/brand-logos/Logo Brand 3.png";
import logo4 from "@/assets/brand-logos/Logo Brand 4.png";
import logo5 from "@/assets/brand-logos/Logo Brand 5.png";
import logo6 from "@/assets/brand-logos/Logo Brand 6.png";
import logo7 from "@/assets/brand-logos/Logo Brand 7.png";
import logo8 from "@/assets/brand-logos/Logo Brand 8.png";

export const PARTNER_LOGOS = [
  { name: "GSE", logo: logo1 },
  { name: "Tensar", logo: logo2 },
  { name: "Eurobent", logo: logo3 },
  { name: "Tiltex", logo: logo4 },
  { name: "Bera", logo: logo5 },
  { name: "Flowtex", logo: logo6 },
  { name: "Polytape", logo: logo7 },
  { name: "SoilLock", logo: logo8 },
];

export const PRODUCT_CATEGORIES = [
  { slug: "geomembranes", label: "Geomembranes", icon: "Layers" },
  { slug: "geotextiles", label: "Geotextiles", icon: "Grid3x3" },
  { slug: "geogrids", label: "Geogrids", icon: "Grid2x2" },
  { slug: "geocells", label: "Geocells", icon: "Hexagon" },
  { slug: "gcls", label: "GCLs", icon: "Sheet" },
  { slug: "drainage-composites", label: "Drainage Composites", icon: "Waves" },
  { slug: "erosion-control", label: "Erosion Control", icon: "Mountain" },
  { slug: "accessories", label: "Accessories", icon: "Wrench" },
];

export const APPLICATION_CATEGORIES = [
  { slug: "mining-systems", label: "Mining Systems", icon: "Pickaxe" },
  { slug: "water-containment", label: "Water Containment", icon: "Droplets" },
  { slug: "waste-landfills", label: "Waste & Landfills", icon: "Trash2" },
  { slug: "roads-infrastructure", label: "Roads & Infrastructure", icon: "Construction" },
  { slug: "erosion-control", label: "Erosion Control", icon: "Mountain" },
  { slug: "drainage-systems", label: "Drainage Systems", icon: "Waves" },
  { slug: "agriculture-aquaculture", label: "Agriculture & Aquaculture", icon: "Sprout" },
];

export const SERVICES = [
  { slug: "supply", label: "Supply", icon: "Truck" },
  { slug: "installation", label: "Installation", icon: "HardHat" },
  { slug: "qa-qc", label: "QA / QC & Testing", icon: "ClipboardCheck" },
  { slug: "design-support", label: "Design Support", icon: "PencilRuler" },
  { slug: "logistics", label: "Logistics & Customs", icon: "Ship" },
  { slug: "after-sales", label: "After Sales Support", icon: "LifeBuoy" },
];

export const INDUSTRIES = [
  { slug: "construction-infrastructure", label: "Construction & Infrastructure", icon: "Building2" },
  { slug: "mining", label: "Mining", icon: "Pickaxe" },
  { slug: "environmental-waste", label: "Environmental & Waste", icon: "Trash2" },
  { slug: "water-management", label: "Water Management", icon: "Droplets" },
  { slug: "agriculture-aquaculture", label: "Agriculture & Aquaculture", icon: "Sprout" },
  { slug: "energy", label: "Energy", icon: "Zap" },
];


const productLink = (slug: string): NavTarget => ({
  to: "/products/$category",
  params: { category: slug },
});

const applicationLink = (slug: string): NavTarget => ({
  to: "/applications/$category",
  params: { category: slug },
});

const serviceLink = (slug: string): NavTarget => ({
  to: "/services/$slug",
  params: { slug },
});

const industryLink = (slug: string): NavTarget => ({
  to: "/industries/$slug",
  params: { slug },
});

export const megaMenus: MegaMenuConfig[] = [
  {
    key: "products",
    label: "Products",
    to: "/products",
    columns: {
      primaryTitle: "Browse Products",
      primary: PRODUCT_CATEGORIES.map((c) => ({ label: c.label, icon: c.icon, ...productLink(c.slug) })),
      secondaryTitle: "Geomembranes",
      secondary: [
        { label: "HDPE Geomembranes", ...productLink("geomembranes") },
        { label: "LLDPE Geomembranes", ...productLink("geomembranes") },
        { label: "PVC Geomembranes", ...productLink("geomembranes") },
        { label: "EPDM Geomembranes", ...productLink("geomembranes") },
        { label: "PP Geomembranes", ...productLink("geomembranes") },
        { label: "Textured Geomembranes", ...productLink("geomembranes") },
        { label: "Speciality Geomembranes", ...productLink("geomembranes") },
        { label: "Floating Cover Geomembranes", ...productLink("geomembranes") },
        { label: "All Geomembranes", ...productLink("geomembranes") },
      ],
      featuredTitle: "Popular Products",
      featuredKind: "product",
      featured: [
        { label: "HDPE Smooth Geomembrane", spec: "0.5mm – 3.0mm", ...productLink("geomembranes") },
        { label: "HDPE Textured Geomembrane", spec: "0.5mm – 3.0mm", ...productLink("geomembranes") },
        { label: "LLDPE Geomembrane", spec: "0.5mm – 2.0mm", ...productLink("geomembranes") },
        { label: "PVC Geomembrane", spec: "0.5mm – 2.0mm", ...productLink("geomembranes") },
      ] as MegaProductItem[],
      quickActionsTitle: "Quick Actions",
      quickActions: [
        { title: "View Full Catalogue", description: "Explore 200+ products", to: "/catalogue", icon: "BookOpen" },
        { title: "Download Data Sheets", description: "Technical documents", to: "/resources", icon: "Download" },
        { title: "Installation Guides", description: "Step-by-step guides", to: "/resources", icon: "FileText" },
        { title: "Speak to Expert", description: "Get technical advice", to: "/contacts", icon: "MessageCircle" },
      ],
    },
  },
  {
    key: "applications",
    label: "Applications",
    to: "/applications",
    columns: {
      primaryTitle: "Application Categories",
      primary: APPLICATION_CATEGORIES.map((c) => ({ label: c.label, icon: c.icon, ...applicationLink(c.slug) })),
      secondaryTitle: "Mining Systems",
      secondary: [
        { label: "Tailings Storage Facilities (TSF)", ...applicationLink("mining-systems") },
        { label: "Heap Leach Pads", ...applicationLink("mining-systems") },
        { label: "Process Ponds & Tanks", ...applicationLink("mining-systems") },
        { label: "Water Management", ...applicationLink("water-containment") },
        { label: "ROM Pads", ...applicationLink("mining-systems") },
        { label: "Heap Leach Pads (Lining)", ...applicationLink("mining-systems") },
      ],
      featuredTitle: "Featured Applications",
      featuredKind: "image",
      featured: [
        {
          title: "TSF Lining System",
          description: "Complete containment with HDPE geomembranes, GCLs & leak detection.",
          ...applicationLink("mining-systems"),
          image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
        },
        {
          title: "Heap Leach Pad",
          description: "Engineered lining for chemical containment and leak protection.",
          ...applicationLink("mining-systems"),
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
        },
        {
          title: "Process Ponds",
          description: "Reliable, cost-effective lining systems for process water.",
          ...applicationLink("water-containment"),
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
        },
      ] as MegaFeatureItem[],
      quickActionsTitle: "Application Support",
      quickActions: [
        { title: "Application Guides", description: "Solutions by application", to: "/resources", icon: "BookOpen" },
        { title: "Design Support", description: "Get engineering assistance", to: "/services", icon: "PencilRuler" },
        { title: "Case Studies", description: "View completed projects", to: "/resources", icon: "FileCheck" },
        { title: "Brochures", description: "Download brochures", to: "/resources", icon: "Download" },
      ],
    },
  },
  {
    key: "services",
    label: "Services",
    to: "/services",
    columns: {
      primaryTitle: "Our Services",
      primary: SERVICES.map((s) => ({ label: s.label, icon: s.icon, ...serviceLink(s.slug) })),
      secondaryTitle: "Supply Services",
      secondary: [
        { label: "Global Sourcing", ...serviceLink("supply") },
        { label: "Local Expertise", ...serviceLink("supply") },
        { label: "Best-in-Class Brands", ...serviceLink("supply") },
        { label: "Quality Assurance", to: "/quality-assurance" },
        { label: "Material Availability", ...serviceLink("supply") },
        { label: "Project Consultation", ...serviceLink("design-support") },
        { label: "Technical Documentation", to: "/resources" },
      ],
      featuredTitle: "Service Highlights",
      featuredKind: "image",
      featured: [
        {
          title: "Global Sourcing",
          description: "Access to global manufacturers and best-in-class materials.",
          ...serviceLink("supply"),
          image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
        },
        {
          title: "Expert Installation",
          description: "Certified installation teams with proven methodologies.",
          ...serviceLink("installation"),
          image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
        },
        {
          title: "Quality & Testing",
          description: "On-site testing and documentation to international standards.",
          to: "/quality-assurance",
          image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
        },
      ] as MegaFeatureItem[],
      quickActionsTitle: "Quick Actions",
      quickActions: [
        { title: "Upload Project BOQ", description: "Submit your requirements", to: "/contacts", icon: "Upload" },
        { title: "Speak to an Expert", description: "Talk to specialists", to: "/contacts", icon: "MessageCircle" },
        { title: "Service Brochure", description: "Download overview", to: "/resources", icon: "Download" },
        { title: "Request a Quote", description: "Get a customised quote", to: "/contacts", icon: "FileText" },
      ],
    },
  },
  {
    key: "industries",
    label: "Industries",
    to: "/industries",
    columns: {
      primaryTitle: "Industries We Serve",
      primary: INDUSTRIES.map((c) => ({ label: c.label, icon: c.icon, ...industryLink(c.slug) })),
      secondaryTitle: "Construction & Infrastructure",
      secondary: [
        { label: "Roads & Highways", ...industryLink("construction-infrastructure") },
        { label: "Railways", ...industryLink("construction-infrastructure") },
        { label: "Retaining Walls", ...industryLink("construction-infrastructure") },
        { label: "Ports & Aviation", ...industryLink("construction-infrastructure") },
        { label: "Commercial Development", ...industryLink("construction-infrastructure") },
      ],
      featuredTitle: "Industry Solutions",
      featuredKind: "image",
      featured: [
        {
          title: "Mining Solutions",
          description: "Engineered systems for heap leach pads and TSFs.",
          ...industryLink("mining"),
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
        },
        {
          title: "Infrastructure",
          description: "Reinforcement and stabilization for critical infrastructure.",
          ...industryLink("construction-infrastructure"),
          image: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=400&q=80",
        },
        {
          title: "Waste Management",
          description: "Secure lining systems for environmental protection.",
          ...industryLink("environmental-waste"),
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
        },
      ] as MegaFeatureItem[],
      quickActionsTitle: "Industry Support",
      quickActions: [
        { title: "Case Studies", description: "Projects by industry", to: "/resources", icon: "FileCheck" },
        { title: "Speak to Expert", description: "Get industry advice", to: "/contacts", icon: "MessageCircle" },
        { title: "Technical Articles", description: "Industry insights", to: "/resources", icon: "BookOpen" },
        { title: "Design Support", description: "Engineering assistance", to: "/services", icon: "PencilRuler" },
      ],
    },
  },
];

export const SIMPLE_NAV: MegaLink[] = [
  { label: "Projects", to: "/projects" },
  { label: "Quality Assurance", to: "/quality-assurance" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Resources", to: "/resources" },
  { label: "Contacts", to: "/contacts" },
];
