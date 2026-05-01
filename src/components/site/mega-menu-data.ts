export type NavTarget = {
  to: string;
  params?: Record<string, string>;
};

export type MegaLink = NavTarget & { label: string; icon?: string };
export type MegaProductItem = NavTarget & { label: string; spec: string };
export type MegaFeatureItem = NavTarget & { title: string; description: string; image: string };
export type MegaQuickAction = NavTarget & { title: string; description: string; icon: string };

export type MegaMenuConfig = {
  key: "products" | "applications" | "services";
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

export const PARTNERS = [
  "GSE",
  "Tensar",
  "Eurobent",
  "Tiltex",
  "Bera",
  "Flowtex",
  "Polytape",
  "SoilLock",
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

const productLink = (slug: string): NavTarget => ({
  to: "/products/$category",
  params: { category: slug },
});

const applicationLink = (slug: string): NavTarget => ({
  to: "/applications/$category",
  params: { category: slug },
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
      primary: SERVICES.map((s) => ({ label: s.label, to: "/services", icon: s.icon })),
      secondaryTitle: "Supply Services",
      secondary: [
        { label: "Global Sourcing", to: "/services" },
        { label: "Local Expertise", to: "/services" },
        { label: "Best-in-Class Brands", to: "/services" },
        { label: "Quality Assurance", to: "/quality-assurance" },
        { label: "Material Availability", to: "/services" },
        { label: "Project Consultation", to: "/services" },
        { label: "Technical Documentation", to: "/resources" },
      ],
      featuredTitle: "Service Highlights",
      featuredKind: "image",
      featured: [
        {
          title: "Global Sourcing",
          description: "Access to global manufacturers and best-in-class materials.",
          to: "/services",
          image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
        },
        {
          title: "Expert Installation",
          description: "Certified installation teams with proven methodologies.",
          to: "/services",
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
];

export const SIMPLE_NAV: MegaLink[] = [
  { label: "Quality Assurance", to: "/quality-assurance" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "Resources", to: "/resources" },
  { label: "Contacts", to: "/contacts" },
];
