export type MegaLink = { label: string; to: string };
export type MegaProductItem = { label: string; spec: string; to: string };
export type MegaFeatureItem = { title: string; description: string; to: string; image: string };
export type MegaQuickAction = { title: string; description: string; to: string; icon: string };

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
  { slug: "geomembranes", label: "Geomembranes" },
  { slug: "geotextiles", label: "Geotextiles" },
  { slug: "geogrids", label: "Geogrids" },
  { slug: "geocells", label: "Geocells" },
  { slug: "gcls", label: "GCLs" },
  { slug: "drainage-composites", label: "Drainage Composites" },
  { slug: "erosion-control", label: "Erosion Control" },
  { slug: "accessories", label: "Accessories" },
];

export const APPLICATION_CATEGORIES = [
  { slug: "mining-systems", label: "Mining Systems" },
  { slug: "water-containment", label: "Water Containment" },
  { slug: "waste-landfills", label: "Waste & Landfills" },
  { slug: "roads-infrastructure", label: "Roads & Infrastructure" },
  { slug: "erosion-control", label: "Erosion Control" },
  { slug: "drainage-systems", label: "Drainage Systems" },
  { slug: "agriculture-aquaculture", label: "Agriculture & Aquaculture" },
];

export const SERVICES = [
  { slug: "supply", label: "Supply" },
  { slug: "installation", label: "Installation" },
  { slug: "qa-qc", label: "QA / QC & Testing" },
  { slug: "design-support", label: "Design Support" },
  { slug: "logistics", label: "Logistics & Customs" },
  { slug: "after-sales", label: "After Sales Support" },
];

export const megaMenus: MegaMenuConfig[] = [
  {
    key: "products",
    label: "Products",
    to: "/products",
    columns: {
      primaryTitle: "Browse Products",
      primary: PRODUCT_CATEGORIES.map((c) => ({ label: c.label, to: `/products/${c.slug}` })),
      secondaryTitle: "Geomembranes",
      secondary: [
        { label: "HDPE Geomembranes", to: "/products/geomembranes" },
        { label: "LLDPE Geomembranes", to: "/products/geomembranes" },
        { label: "PVC Geomembranes", to: "/products/geomembranes" },
        { label: "EPDM Geomembranes", to: "/products/geomembranes" },
        { label: "PP Geomembranes", to: "/products/geomembranes" },
        { label: "Textured Geomembranes", to: "/products/geomembranes" },
        { label: "Speciality Geomembranes", to: "/products/geomembranes" },
        { label: "Floating Cover Geomembranes", to: "/products/geomembranes" },
        { label: "All Geomembranes", to: "/products/geomembranes" },
      ],
      featuredTitle: "Popular Products",
      featuredKind: "product",
      featured: [
        { label: "HDPE Smooth Geomembrane", spec: "0.5mm – 3.0mm", to: "/products/geomembranes" },
        { label: "HDPE Textured Geomembrane", spec: "0.5mm – 3.0mm", to: "/products/geomembranes" },
        { label: "LLDPE Geomembrane", spec: "0.5mm – 2.0mm", to: "/products/geomembranes" },
        { label: "PVC Geomembrane", spec: "0.5mm – 2.0mm", to: "/products/geomembranes" },
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
      primary: APPLICATION_CATEGORIES.map((c) => ({ label: c.label, to: `/applications/${c.slug}` })),
      secondaryTitle: "Mining Systems",
      secondary: [
        { label: "Tailings Storage Facilities (TSF)", to: "/applications/mining-systems" },
        { label: "Heap Leach Pads", to: "/applications/mining-systems" },
        { label: "Process Ponds & Tanks", to: "/applications/mining-systems" },
        { label: "Water Management", to: "/applications/mining-systems" },
        { label: "ROM Pads", to: "/applications/mining-systems" },
        { label: "Heap Leach Pads (Lining)", to: "/applications/mining-systems" },
      ],
      featuredTitle: "Featured Applications",
      featuredKind: "image",
      featured: [
        {
          title: "TSF Lining System",
          description: "Complete containment with HDPE geomembranes, GCLs & leak detection.",
          to: "/applications/mining-systems",
          image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
        },
        {
          title: "Heap Leach Pad",
          description: "Engineered lining for chemical containment and leak protection.",
          to: "/applications/mining-systems",
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
        },
        {
          title: "Process Ponds",
          description: "Reliable, cost-effective lining systems for process water.",
          to: "/applications/water-containment",
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
      primary: SERVICES.map((s) => ({ label: s.label, to: `/services` })),
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
