export type NavTarget = {
  to: string;
  params?: Record<string, string>;
};

export type MegaLink = NavTarget & { 
  label: string; 
  icon?: string;
  content?: {
    secondaryTitle: string;
    secondary: MegaLink[];
    featuredTitle: string;
    featured: MegaFeatureItem[] | MegaProductItem[];
    featuredKind: "image" | "product";
    quickActionsTitle: string;
    quickActions: MegaQuickAction[];
  };
};
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

function generateProductContent(categorySlug: string, categoryLabel: string) {
  const quickActions = [
    { title: `All ${categoryLabel}`, description: `Explore all ${categoryLabel}`, to: "/catalogue", icon: "Layers" },
    { title: "Download Data Sheets", description: "Technical documents", to: "/resources", icon: "Download" },
    { title: "Installation Guides", description: "Step-by-step guides", to: "/resources", icon: "FileText" },
    { title: "Speak to Expert", description: "Get technical advice", to: "/contacts", icon: "MessageCircle" },
  ] as MegaQuickAction[];

  switch (categorySlug) {
    case "geomembranes":
      return {
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
        featuredKind: "product" as const,
        featured: [
          { label: "HDPE Smooth Geomembrane", spec: "0.5mm – 3.0mm", ...productLink("geomembranes") },
          { label: "HDPE Textured Geomembrane", spec: "0.5mm – 3.0mm", ...productLink("geomembranes") },
          { label: "LLDPE Geomembrane", spec: "0.5mm – 2.0mm", ...productLink("geomembranes") },
          { label: "PVC Geomembrane", spec: "0.5mm – 2.0mm", ...productLink("geomembranes") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "geotextiles":
      return {
        secondaryTitle: "Geotextiles",
        secondary: [
          { label: "Non-Woven Geotextiles", ...productLink("geotextiles") },
          { label: "Woven Geotextiles", ...productLink("geotextiles") },
          { label: "High-Strength Geotextiles", ...productLink("geotextiles") },
          { label: "Geotextile Tubes", ...productLink("geotextiles") },
          { label: "Paving Fabrics", ...productLink("geotextiles") },
          { label: "Filtration Geotextiles", ...productLink("geotextiles") },
          { label: "All Geotextiles", ...productLink("geotextiles") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "Non-Woven PET Geotextile", spec: "100g – 1200g/m²", ...productLink("geotextiles") },
          { label: "Woven PP Geotextile", spec: "15kN – 100kN", ...productLink("geotextiles") },
          { label: "High-Strength Woven PET", spec: "100kN – 1000kN", ...productLink("geotextiles") },
          { label: "Geotextile Sand Containers", spec: "Custom Sizes", ...productLink("geotextiles") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "geogrids":
      return {
        secondaryTitle: "Geogrids",
        secondary: [
          { label: "Biaxial Geogrids", ...productLink("geogrids") },
          { label: "Uniaxial Geogrids", ...productLink("geogrids") },
          { label: "Triaxial Geogrids", ...productLink("geogrids") },
          { label: "Fiberglass Geogrids", ...productLink("geogrids") },
          { label: "Polyester Geogrids", ...productLink("geogrids") },
          { label: "Geogrid Composites", ...productLink("geogrids") },
          { label: "All Geogrids", ...productLink("geogrids") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "Extruded Biaxial PP Geogrid", spec: "20kN – 40kN", ...productLink("geogrids") },
          { label: "Uniaxial HDPE Geogrid", spec: "50kN – 200kN", ...productLink("geogrids") },
          { label: "Asphalt Reinforcement Fiberglass", spec: "50kN – 100kN", ...productLink("geogrids") },
          { label: "Geogrid-Geotextile Composite", spec: "High Performance", ...productLink("geogrids") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "geocells":
      return {
        secondaryTitle: "Geocells",
        secondary: [
          { label: "Standard Geocells", ...productLink("geocells") },
          { label: "Textured Geocells", ...productLink("geocells") },
          { label: "Perforated Geocells", ...productLink("geocells") },
          { label: "High-Density Geocells", ...productLink("geocells") },
          { label: "Slope Protection Geocells", ...productLink("geocells") },
          { label: "All Geocells", ...productLink("geocells") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "HDPE Textured & Perforated Geocell", spec: "75mm – 200mm", ...productLink("geocells") },
          { label: "Heavy Duty Load Support Geocell", spec: "High Density", ...productLink("geocells") },
          { label: "Slope Protection Geocell System", spec: "UV Stabilized", ...productLink("geocells") },
          { label: "Channel Protection Geocell", spec: "Flow Resistant", ...productLink("geocells") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "gcls":
      return {
        secondaryTitle: "GCLs",
        secondary: [
          { label: "Standard GCLs", ...productLink("gcls") },
          { label: "PE Coated GCLs", ...productLink("gcls") },
          { label: "Reinforced GCLs", ...productLink("gcls") },
          { label: "Unreinforced GCLs", ...productLink("gcls") },
          { label: "Bentonite Powder/Granules", ...productLink("gcls") },
          { label: "All GCLs", ...productLink("gcls") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "Reinforced Needle-Punched GCL", spec: "4.5kg – 5.5kg/m²", ...productLink("gcls") },
          { label: "PE Laminated GCL", spec: "Extra Protection", ...productLink("gcls") },
          { label: "Double Non-Woven GCL", spec: "High Filtration", ...productLink("gcls") },
          { label: "High Swell Sodium Bentonite", spec: "Premium Grade", ...productLink("gcls") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "drainage-composites":
      return {
        secondaryTitle: "Drainage Composites",
        secondary: [
          { label: "Geonets", ...productLink("drainage-composites") },
          { label: "Geocomposite Drains", ...productLink("drainage-composites") },
          { label: "Strip Drains", ...productLink("drainage-composites") },
          { label: "Prefabricated Vertical Drains", ...productLink("drainage-composites") },
          { label: "Drainage Boards", ...productLink("drainage-composites") },
          { label: "All Drainage Composites", ...productLink("drainage-composites") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "Tri-Planar Geocomposite Drain", spec: "High Transmissivity", ...productLink("drainage-composites") },
          { label: "Bi-Planar Geonet Composite", spec: "5mm – 8mm", ...productLink("drainage-composites") },
          { label: "Prefabricated Vertical Drain (PVD)", spec: "Soil Consolidation", ...productLink("drainage-composites") },
          { label: "Dimple Drainage Board", spec: "Wall Drainage", ...productLink("drainage-composites") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "erosion-control":
      return {
        secondaryTitle: "Erosion Control",
        secondary: [
          { label: "Erosion Control Blankets", ...productLink("erosion-control") },
          { label: "Turf Reinforcement Mats", ...productLink("erosion-control") },
          { label: "Coir Logs", ...productLink("erosion-control") },
          { label: "Silt Fences", ...productLink("erosion-control") },
          { label: "Gabions & Mattresses", ...productLink("erosion-control") },
          { label: "All Erosion Control", ...productLink("erosion-control") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "3D Turf Reinforcement Mat", spec: "Heavy Duty", ...productLink("erosion-control") },
          { label: "Biodegradable Coir Blanket", spec: "100% Natural", ...productLink("erosion-control") },
          { label: "Woven Silt Fence", spec: "Premium Grade", ...productLink("erosion-control") },
          { label: "Woven Gabion Baskets", spec: "Zinc/PVC Coated", ...productLink("erosion-control") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "accessories":
      return {
        secondaryTitle: "Accessories",
        secondary: [
          { label: "Welding Rods", ...productLink("accessories") },
          { label: "Bentonite Paste", ...productLink("accessories") },
          { label: "Fixing Pins & Pegs", ...productLink("accessories") },
          { label: "Seaming Tapes", ...productLink("accessories") },
          { label: "Extrusion Welders", ...productLink("accessories") },
          { label: "Testing Equipment", ...productLink("accessories") },
          { label: "All Accessories", ...productLink("accessories") },
        ],
        featuredTitle: "Popular Products",
        featuredKind: "product" as const,
        featured: [
          { label: "HDPE/LLDPE Welding Rods", spec: "4mm – 5mm", ...productLink("accessories") },
          { label: "Sodium Bentonite Paste", spec: "Waterproofing", ...productLink("accessories") },
          { label: "Steel J-Pins & Fixing Pegs", spec: "Corrosion Resistant", ...productLink("accessories") },
          { label: "Geotextile Joining Tape", spec: "High Tack", ...productLink("accessories") },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    default:
      return {
        secondaryTitle: categoryLabel,
        secondary: [
          { label: `Premium ${categoryLabel}`, ...productLink(categorySlug) },
          { label: `Standard ${categoryLabel}`, ...productLink(categorySlug) },
          { label: `Custom ${categoryLabel}`, ...productLink(categorySlug) },
          { label: `All ${categoryLabel}`, ...productLink(categorySlug) },
        ],
        featuredTitle: `Popular ${categoryLabel}`,
        featuredKind: "product" as const,
        featured: [
          { label: `Top ${categoryLabel} A`, spec: "High Performance", ...productLink(categorySlug) },
          { label: `Top ${categoryLabel} B`, spec: "Durable & Reliable", ...productLink(categorySlug) },
          { label: `Top ${categoryLabel} C`, spec: "Cost Effective", ...productLink(categorySlug) },
        ] as MegaProductItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };
  }
}

function generateApplicationContent(categorySlug: string, categoryLabel: string) {
  const quickActions = [
    { title: "Application Guides", description: "Solutions by application", to: "/resources", icon: "BookOpen" },
    { title: "Design Support", description: "Get engineering assistance", to: "/services", icon: "PencilRuler" },
    { title: "Case Studies", description: "View completed projects", to: "/resources", icon: "FileCheck" },
    { title: "Brochures", description: "Download brochures", to: "/resources", icon: "Download" },
  ] as MegaQuickAction[];

  switch (categorySlug) {
    case "mining-systems":
      return {
        secondaryTitle: "Mining Systems",
        secondary: [
          { label: "Tailings Storage Facilities (TSF)", ...applicationLink("mining-systems") },
          { label: "Heap Leach Pads", ...applicationLink("mining-systems") },
          { label: "Process Ponds & Tanks", ...applicationLink("mining-systems") },
          { label: "ROM Pads", ...applicationLink("mining-systems") },
        ],
        featuredTitle: "Featured Applications",
        featuredKind: "image" as const,
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
        ] as MegaFeatureItem[],
        quickActionsTitle: "Application Support",
        quickActions,
      };

    case "water-containment":
      return {
        secondaryTitle: "Water Containment",
        secondary: [
          { label: "Reservoirs & Dams", ...applicationLink("water-containment") },
          { label: "Canals & Channels", ...applicationLink("water-containment") },
          { label: "Stormwater Attenuation", ...applicationLink("water-containment") },
          { label: "Potable Water Storage", ...applicationLink("water-containment") },
        ],
        featuredTitle: "Featured Applications",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Process Ponds",
            description: "Reliable, cost-effective lining systems for process water.",
            ...applicationLink("water-containment"),
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
          },
          {
            title: "Reservoir Lining",
            description: "High-performance geomembranes for secure water storage.",
            ...applicationLink("water-containment"),
            image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Application Support",
        quickActions,
      };

    case "waste-landfills":
      return {
        secondaryTitle: "Waste & Landfills",
        secondary: [
          { label: "Landfill Basal Lining", ...applicationLink("waste-landfills") },
          { label: "Landfill Capping Systems", ...applicationLink("waste-landfills") },
          { label: "Leachate Ponds", ...applicationLink("waste-landfills") },
          { label: "Secondary Containment", ...applicationLink("waste-landfills") },
        ],
        featuredTitle: "Featured Applications",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Secure Landfill Lining",
            description: "Multi-layered barrier systems for environmental protection.",
            ...applicationLink("waste-landfills"),
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
          },
          {
            title: "Landfill Capping",
            description: "Engineered closures for municipal and hazardous waste.",
            ...applicationLink("waste-landfills"),
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Application Support",
        quickActions,
      };

    case "roads-infrastructure":
      return {
        secondaryTitle: "Roads & Infrastructure",
        secondary: [
          { label: "Pavement Optimization", ...applicationLink("roads-infrastructure") },
          { label: "Subgrade Stabilization", ...applicationLink("roads-infrastructure") },
          { label: "Retaining Walls", ...applicationLink("roads-infrastructure") },
          { label: "Railway Trackbeds", ...applicationLink("roads-infrastructure") },
        ],
        featuredTitle: "Featured Applications",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Road Reinforcement",
            description: "Geogrids and geotextiles for increased pavement lifespan.",
            ...applicationLink("roads-infrastructure"),
            image: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=400&q=80",
          },
          {
            title: "MSE Walls",
            description: "Mechanically Stabilized Earth walls for steep slopes.",
            ...applicationLink("roads-infrastructure"),
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Application Support",
        quickActions,
      };

    default:
      return {
        secondaryTitle: categoryLabel,
        secondary: [
          { label: `View All ${categoryLabel}`, ...applicationLink(categorySlug) },
          { label: `Projects in ${categoryLabel}`, to: "/projects" },
          { label: `Technical Specs`, to: "/resources" },
          { label: `Installation Methods`, ...applicationLink(categorySlug) },
        ],
        featuredTitle: `Featured in ${categoryLabel}`,
        featuredKind: "image" as const,
        featured: [
          {
            title: `${categoryLabel} Systems`,
            description: `Explore our advanced geosynthetic solutions for ${categoryLabel.toLowerCase()}.`,
            ...applicationLink(categorySlug),
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          },
          {
            title: "Latest Case Study",
            description: `See how our products perform in real-world ${categoryLabel.toLowerCase()} applications.`,
            to: "/projects",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Application Support",
        quickActions,
      };
  }
}

function generateServiceContent(categorySlug: string, categoryLabel: string) {
  const quickActions = [
    { title: "Upload Project BOQ", description: "Submit your requirements", to: "/contacts", icon: "Upload" },
    { title: "Speak to an Expert", description: "Talk to specialists", to: "/contacts", icon: "MessageCircle" },
    { title: "Service Brochure", description: "Download overview", to: "/resources", icon: "Download" },
    { title: "Request a Quote", description: "Get a customised quote", to: "/contacts", icon: "FileText" },
  ] as MegaQuickAction[];

  switch (categorySlug) {
    case "supply":
      return {
        secondaryTitle: "Supply Services",
        secondary: [
          { label: "Global Sourcing", ...serviceLink("supply") },
          { label: "Local Expertise", ...serviceLink("supply") },
          { label: "Best-in-Class Brands", ...serviceLink("supply") },
          { label: "Quality Assurance", to: "/quality-assurance" },
          { label: "Material Availability", ...serviceLink("supply") },
        ],
        featuredTitle: "Supply Highlights",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Global Sourcing",
            description: "Access to global manufacturers and best-in-class materials.",
            ...serviceLink("supply"),
            image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
          },
          {
            title: "Pan-African Logistics",
            description: "Efficient delivery networks across the continent.",
            ...serviceLink("logistics"),
            image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "installation":
      return {
        secondaryTitle: "Installation",
        secondary: [
          { label: "Certified Teams", ...serviceLink("installation") },
          { label: "Site Preparation", ...serviceLink("installation") },
          { label: "Geomembrane Welding", ...serviceLink("installation") },
          { label: "Testing & Commissioning", ...serviceLink("qa-qc") },
        ],
        featuredTitle: "Installation Highlights",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Expert Installation",
            description: "Certified installation teams with proven methodologies.",
            ...serviceLink("installation"),
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          },
          {
            title: "Specialized Equipment",
            description: "State-of-the-art welding and deployment tools.",
            ...serviceLink("installation"),
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "qa-qc":
      return {
        secondaryTitle: "QA / QC & Testing",
        secondary: [
          { label: "On-Site Testing", ...serviceLink("qa-qc") },
          { label: "Destructive Testing", ...serviceLink("qa-qc") },
          { label: "Non-Destructive Testing", ...serviceLink("qa-qc") },
          { label: "Documentation", to: "/resources" },
        ],
        featuredTitle: "Quality Highlights",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Quality & Testing",
            description: "On-site testing and documentation to international standards.",
            to: "/quality-assurance",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
          },
          {
            title: "Certified Technicians",
            description: "Experienced QA/QC personnel for rigorous verification.",
            to: "/quality-assurance",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    case "design-support":
      return {
        secondaryTitle: "Design Support",
        secondary: [
          { label: "Engineering Consultation", ...serviceLink("design-support") },
          { label: "Material Selection", ...serviceLink("design-support") },
          { label: "CAD Detailing", ...serviceLink("design-support") },
          { label: "BOQ Optimization", ...serviceLink("design-support") },
        ],
        featuredTitle: "Design Highlights",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Design Services",
            description: "Technical assistance for complex geosynthetic structures.",
            ...serviceLink("design-support"),
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
          },
          {
            title: "Value Engineering",
            description: "Optimizing material use for cost-effective performance.",
            ...serviceLink("design-support"),
            image: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };

    default:
      return {
        secondaryTitle: categoryLabel,
        secondary: [
          { label: `About ${categoryLabel}`, ...serviceLink(categorySlug) },
          { label: `Our Approach to ${categoryLabel}`, ...serviceLink(categorySlug) },
          { label: `Quality & Standards`, to: "/quality-assurance" },
          { label: `Contact our ${categoryLabel} Team`, to: "/contacts" },
        ],
        featuredTitle: `${categoryLabel} Highlights`,
        featuredKind: "image" as const,
        featured: [
          {
            title: `Expert ${categoryLabel}`,
            description: `We offer industry-leading ${categoryLabel.toLowerCase()} services tailored to your project.`,
            ...serviceLink(categorySlug),
            image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
          },
          {
            title: "Proven Methodologies",
            description: `Our team uses certified and tested approaches for optimal results.`,
            to: "/quality-assurance",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Quick Actions",
        quickActions,
      };
  }
}

function generateIndustryContent(categorySlug: string, categoryLabel: string) {
  const quickActions = [
    { title: "Case Studies", description: "Projects by industry", to: "/resources", icon: "FileCheck" },
    { title: "Speak to Expert", description: "Get industry advice", to: "/contacts", icon: "MessageCircle" },
    { title: "Technical Articles", description: "Industry insights", to: "/resources", icon: "BookOpen" },
    { title: "Design Support", description: "Engineering assistance", to: "/services", icon: "PencilRuler" },
  ] as MegaQuickAction[];

  switch (categorySlug) {
    case "mining":
      return {
        secondaryTitle: "Mining Systems",
        secondary: [
          { label: "Heap Leach Pads", ...industryLink("mining") },
          { label: "Tailings Storage", ...industryLink("mining") },
          { label: "Process Ponds", ...industryLink("mining") },
          { label: "Mine Capping", ...industryLink("mining") },
        ],
        featuredTitle: "Mining Solutions",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Mining Solutions",
            description: "Engineered systems for heap leach pads and TSFs.",
            ...industryLink("mining"),
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
          },
          {
            title: "Tailings Management",
            description: "Secure containment for mining byproducts.",
            ...industryLink("mining"),
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Industry Support",
        quickActions,
      };

    case "construction-infrastructure":
      return {
        secondaryTitle: "Construction & Infrastructure",
        secondary: [
          { label: "Roads & Highways", ...industryLink("construction-infrastructure") },
          { label: "Retaining Walls", ...industryLink("construction-infrastructure") },
          { label: "Railways", ...industryLink("construction-infrastructure") },
          { label: "Embankments", ...industryLink("construction-infrastructure") },
        ],
        featuredTitle: "Infrastructure Solutions",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Infrastructure",
            description: "Reinforcement and stabilization for critical infrastructure.",
            ...industryLink("construction-infrastructure"),
            image: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=400&q=80",
          },
          {
            title: "Soil Stabilization",
            description: "Improving bearing capacity for roads and pavements.",
            ...industryLink("construction-infrastructure"),
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Industry Support",
        quickActions,
      };

    case "environmental-waste":
      return {
        secondaryTitle: "Environmental & Waste",
        secondary: [
          { label: "Landfill Lining", ...industryLink("environmental-waste") },
          { label: "Landfill Capping", ...industryLink("environmental-waste") },
          { label: "Secondary Containment", ...industryLink("environmental-waste") },
          { label: "Remediation", ...industryLink("environmental-waste") },
        ],
        featuredTitle: "Environmental Solutions",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Waste Management",
            description: "Secure lining systems for environmental protection.",
            ...industryLink("environmental-waste"),
            image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
          },
          {
            title: "Capping Systems",
            description: "Effective closure systems for municipal solid waste.",
            ...industryLink("environmental-waste"),
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Industry Support",
        quickActions,
      };

    case "water-management":
      return {
        secondaryTitle: "Water Management",
        secondary: [
          { label: "Reservoirs & Dams", ...industryLink("water-management") },
          { label: "Canals & Channels", ...industryLink("water-management") },
          { label: "Stormwater Attenuation", ...industryLink("water-management") },
          { label: "Potable Water Storage", ...industryLink("water-management") },
        ],
        featuredTitle: "Water Solutions",
        featuredKind: "image" as const,
        featured: [
          {
            title: "Dam Lining Systems",
            description: "Waterproof lining for critical water infrastructure.",
            ...industryLink("water-management"),
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
          },
          {
            title: "Canal Conveyance",
            description: "Reducing seepage in irrigation and water transfer.",
            ...industryLink("water-management"),
            image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Industry Support",
        quickActions,
      };

    default:
      return {
        secondaryTitle: categoryLabel,
        secondary: [
          { label: `${categoryLabel} Overview`, ...industryLink(categorySlug) },
          { label: `Solutions for ${categoryLabel}`, ...industryLink(categorySlug) },
          { label: `Key Projects`, to: "/projects" },
          { label: `Industry Standards`, to: "/quality-assurance" },
        ],
        featuredTitle: `${categoryLabel} Solutions`,
        featuredKind: "image" as const,
        featured: [
          {
            title: `Advanced ${categoryLabel} Systems`,
            description: `Engineered geosynthetics for modern ${categoryLabel.toLowerCase()} requirements.`,
            ...industryLink(categorySlug),
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
          },
          {
            title: "Project Showcase",
            description: `View our successful deployments in the ${categoryLabel.toLowerCase()} sector.`,
            to: "/projects",
            image: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=400&q=80",
          },
        ] as MegaFeatureItem[],
        quickActionsTitle: "Industry Support",
        quickActions,
      };
  }
}

export const megaMenus: MegaMenuConfig[] = [
  {
    key: "products",
    label: "Products",
    to: "/products",
    columns: {
      primaryTitle: "Browse Products",
      primary: PRODUCT_CATEGORIES.map((c) => ({ 
        label: c.label, 
        icon: c.icon, 
        ...productLink(c.slug),
        content: generateProductContent(c.slug, c.label)
      })),
      ...generateProductContent(PRODUCT_CATEGORIES[0].slug, PRODUCT_CATEGORIES[0].label),
    },
  },
  {
    key: "applications",
    label: "Applications",
    to: "/applications",
    columns: {
      primaryTitle: "Application Categories",
      primary: APPLICATION_CATEGORIES.map((c) => ({ 
        label: c.label, 
        icon: c.icon, 
        ...applicationLink(c.slug),
        content: generateApplicationContent(c.slug, c.label)
      })),
      ...generateApplicationContent(APPLICATION_CATEGORIES[0].slug, APPLICATION_CATEGORIES[0].label),
    },
  },
  {
    key: "services",
    label: "Services",
    to: "/services",
    columns: {
      primaryTitle: "Our Services",
      primary: SERVICES.map((s) => ({ 
        label: s.label, 
        icon: s.icon, 
        ...serviceLink(s.slug),
        content: generateServiceContent(s.slug, s.label)
      })),
      ...generateServiceContent(SERVICES[0].slug, SERVICES[0].label),
    },
  },
  {
    key: "industries",
    label: "Industries",
    to: "/industries",
    columns: {
      primaryTitle: "Industries We Serve",
      primary: INDUSTRIES.map((c) => ({ 
        label: c.label, 
        icon: c.icon, 
        ...industryLink(c.slug),
        content: generateIndustryContent(c.slug, c.label)
      })),
      ...generateIndustryContent(INDUSTRIES[0].slug, INDUSTRIES[0].label),
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
