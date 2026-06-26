import { APPLICATION_CATEGORIES, INDUSTRIES } from "@/components/site/mega-menu-data";
import { supabase } from "@/integrations/supabase/client";

export interface ProductPageContent {
  slug: string;
  /** Parent product category slug, e.g. "geomembranes". Set when admin links to mega menu.
   *  Used to construct the correct URL: /products/{category}/{slug} */
  category?: string;
  label: string;
  heroImage: string;
  subtitle: string;
  description: string[];
  features: string[];
  technicalHighlights?: { label: string; value: string }[];
  propertiesTable?: {
    headers: string[];
    rows: string[][];
  };
  types?: { name: string; description: string }[];
  benefits?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  installationSpecs?: string[];
  projectReferences?: { name: string; location: string; year: string; image: string; project_slug?: string }[];
  popularProducts: { name: string; spec: string; desc: string; image?: string; slug?: string }[];
  relatedProductGroups?: { name: string; link: string }[];
  applications: { label: string; slug: string; description?: string }[];
  industries: { label: string; slug: string }[];
  seo?: { title: string; description: string; keywords?: string };
}

export const DEFAULT_IMAGES: Record<string, string> = {
  geomembranes: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
  geotextiles: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1920&q=80",
  geogrids: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80",
  geocells: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  gcls: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80",
  "drainage-composites": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  "erosion-control": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  accessories: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
};

// ─── Seed data ───────────────────────────────────────────────────────────────
// This is the canonical default content for all product category pages.
// It is used to seed the Supabase site_config table on first setup.
// After seeding, all content is managed exclusively via the admin Page Templates UI.
export const SEED_CATEGORIES: Record<string, ProductPageContent> = {
  "hdpe-geomembranes": {
    slug: "hdpe-geomembranes",
    category: "geomembranes",
    label: "HDPE Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Engineered materials for critical infrastructure. Learn how our HDPE geomembranes deliver uncompromised performance, reliability, and longevity across global applications.",
    description: [
      "High-Density Polyethylene (HDPE) Geomembranes are highly engineered materials designed to perform critical containment functions in civil, mining, and environmental engineering.",
      "We proudly supply the GSE / Solmax brand, recognised globally as the best-in-class manufacturer. These materials offer exceptional durability, UV resistance, and resistance to harsh environmental conditions.",
      "Whether providing an impermeable barrier for hazardous waste or secure containment for potable water, our HDPE systems are stringently tested to meet and exceed international quality standards like GRI-GM13.",
    ],
    features: [
      "Manufactured to stringent ISO guidelines (GSE/Solmax)",
      "High resistance to UV and chemical degradation",
      "Excellent stress crack resistance and durability",
      "Available in smooth, single-sided, and double-sided textured finishes",
    ],
    technicalHighlights: [
      { label: "Thickness", value: "1mm - 3mm" },
      { label: "Width", value: "7m - 8m" },
      { label: "Roll Length", value: "100m - 200m" },
    ],
    propertiesTable: {
      headers: ["Testing Properties", "Test Method", "Value (Metric)", "Value (Imperial)"],
      rows: [
        ["Thickness", "ASTM D5199", "1.5 mm", "60 mil"],
        ["Density", "ASTM D792", "0.94 g/cc", "0.94 g/cc"],
        ["Tensile Strength at Yield", "ASTM D6693", "22 kN/m", "126 ppi"],
        ["Tensile Strength at Break", "ASTM D6693", "40 kN/m", "228 ppi"],
        ["Elongation at Yield", "ASTM D6693", "12%", "12%"],
        ["Elongation at Break", "ASTM D6693", "700%", "700%"],
        ["Tear Resistance", "ASTM D1004", "187 N", "42 lbs"],
        ["Puncture Resistance", "ASTM D4833", "530 N", "120 lbs"],
        ["Carbon Black Content", "ASTM D1603", "2.0 - 3.0%", "2.0 - 3.0%"],
      ],
    },
    types: [
      { name: "Smooth Geomembranes", description: "Standard high-performance barrier for general containment" },
      { name: "Textured Geomembranes", description: "Single or double-sided textured for increased friction on slopes" },
      { name: "White Geomembranes", description: "UV reflective top layer to lower liner temperature" },
      { name: "Conductive Geomembranes", description: "Spark-testable geomembrane for post-installation leak detection" },
    ],
    benefits: [
      { title: "High Durability", description: "Engineered to withstand harsh environmental conditions and mechanical stress." },
      { title: "Chemical Resistance", description: "Highly resistant to a wide range of chemicals, making it ideal for hazardous waste." },
      { title: "UV Protection", description: "Formulated with carbon black and antioxidants for superior UV resistance." },
      { title: "Cost-Effective", description: "Long lifespan and low maintenance requirements provide excellent ROI." },
    ],
    faqs: [
      { question: "What is the typical lifespan of GSE HD HDPE?", answer: "When properly installed and maintained, GSE HD HDPE geomembranes can last for decades. In exposed applications, they typically last 20-30 years, and when covered, they can exceed 100 years depending on environmental factors." },
      { question: "Can it be installed in cold weather?", answer: "Yes, but installation in extremely cold temperatures requires special care and pre-heating of the liner to ensure proper seaming." },
      { question: "How do you test the seams?", answer: "Seams are tested non-destructively using air pressure (for double track seams) or vacuum box testing (for extrusion welds), and destructively by peeling and shearing samples." },
    ],
    installationSpecs: [
      "Installation should only be performed by certified technicians using calibrated wedge and extrusion welding equipment. Subgrade preparation is critical and must be smooth, firm, and free of sharp objects. Panels should be deployed to minimize the number of seams, especially in corners and sumps. All seams must be tested and documented according to GRI-GM19 specifications. Anchor trenches must be properly excavated and backfilled to secure the liner against wind uplift and thermal contraction.",
    ],
    projectReferences: [
      { name: "Mining Facilities", location: "South Africa", year: "2021", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Waste Management", location: "Kenya", year: "2022", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Water Containment", location: "Ghana", year: "2023", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Power Generation", location: "Nigeria", year: "2020", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    popularProducts: [
      { name: "GSE HDPE Smooth", spec: "1.0mm – 3.0mm", desc: "Standard high-performance barrier for general containment", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-hdpe-smooth" },
      { name: "GSE HDPE Textured", spec: "1.0mm – 3.0mm", desc: "Single-sided textured for increased friction on slopes", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-hdpe-textured" },
      { name: "GSE HDPE Double Textured", spec: "1.0mm – 3.0mm", desc: "Double-sided textured for maximum stability in steep applications", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-hdpe-double-textured" },
      { name: "GSE Conductive", spec: "1.5mm – 2.5mm", desc: "Spark-testable geomembrane for post-installation leak detection", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-conductive" },
    ],
    applications: [
      { label: "Mining Facilities", slug: "mining", description: "Heap leach pads, tailings storage, and process ponds." },
      { label: "Waste Management", slug: "waste", description: "Landfill basal liners and capping systems." },
      { label: "Water Containment", slug: "water", description: "Potable water reservoirs and irrigation dams." },
      { label: "Power Generation", slug: "power", description: "Ash ponds and cooling water reservoirs." },
    ],
    industries: INDUSTRIES.slice(0, 5),
  },

  "lldpe-geomembranes": {
    slug: "lldpe-geomembranes",
    category: "geomembranes",
    label: "LLDPE Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Engineered materials for critical infrastructure. Learn how our LLDPE geomembranes deliver exceptional flexibility and performance.",
    description: [
      "Linear Low-Density Polyethylene (LLDPE) Geomembranes offer increased flexibility and elongation compared to HDPE, making them ideal for applications with differential settlement.",
      "Sourced from premium manufacturers like GSE / Solmax, our LLDPE geomembranes provide excellent biaxial stress/strain properties while maintaining strong chemical and UV resistance.",
    ],
    features: [
      "Superior flexibility and elongation for uneven terrain",
      "Excellent resistance to multi-axial stresses",
      "High resistance to UV and chemical degradation",
      "Available in smooth and textured finishes",
    ],
    popularProducts: [
      { name: "GSE LLDPE Smooth", spec: "1.0mm – 2.0mm", desc: "Flexible barrier for covers and differential settlement", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "GSE LLDPE Textured", spec: "1.0mm – 2.0mm", desc: "Textured surface for enhanced friction on slopes", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "GSE LLDPE White", spec: "1.0mm – 2.0mm", desc: "White surface to reflect heat and lower liner temperature", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "GSE LLDPE Reinforced", spec: "Custom", desc: "Scrim-reinforced for added dimensional stability", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },

  "pvc-geomembranes": {
    slug: "pvc-geomembranes",
    category: "geomembranes",
    label: "PVC Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Highly flexible Polyvinyl Chloride (PVC) lining systems designed for easy installation and excellent conforming capabilities.",
    description: [
      "Polyvinyl Chloride (PVC) Geomembranes are highly flexible and conformable materials, often preferred for applications requiring complex detailing, subgrade accommodation, and ease of seaming.",
      "They offer excellent puncture resistance and are exceptionally easy to weld, making them suitable for a wide variety of civil, decorative, and environmental containment projects.",
      "Supplied from top-tier manufacturers, our PVC geomembranes are formulated to resist UV degradation and provide long-lasting impermeable barriers.",
    ],
    features: [
      "Exceptional flexibility and conforming characteristics",
      "High puncture and tear resistance",
      "Easy and reliable seaming (wedge welding or solvent welding)",
      "Suitable for decorative ponds, tunnels, and structural waterproofing",
    ],
    popularProducts: [
      { name: "Standard PVC Geomembrane", spec: "0.5mm – 2.0mm", desc: "General purpose flexible liner", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "UV Stabilised PVC", spec: "1.0mm – 2.0mm", desc: "Enhanced UV protection for exposed applications", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Fish-Safe PVC", spec: "0.5mm – 1.0mm", desc: "Non-toxic formulation for aquaculture and koi ponds", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Tunnel Waterproofing PVC", spec: "1.5mm – 3.0mm", desc: "Heavy-duty liner for underground structures", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },

  "epdm-geomembranes": {
    slug: "epdm-geomembranes",
    category: "geomembranes",
    label: "EPDM Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Premium Ethylene Propylene Diene Monomer (EPDM) synthetic rubber liners with unmatched elasticity, longevity, and weather resistance.",
    description: [
      "EPDM Geomembranes are highly durable synthetic rubber liners known for their extraordinary elasticity, capable of elongating over 300% to accommodate severe subgrade movement.",
      "They exhibit outstanding resistance to UV radiation, ozone, and extreme temperature fluctuations, ensuring a lifespan that often exceeds other membrane types in exposed conditions.",
      "Environmentally friendly and entirely fish-safe, EPDM is the premium choice for critical water containment, decorative water features, and agricultural applications.",
    ],
    features: [
      "Unmatched elasticity and flexibility (over 300% elongation)",
      "Exceptional resistance to UV, ozone, and weathering",
      "Maintains flexibility in extreme cold and hot temperatures",
      "Eco-friendly, non-toxic, and safe for aquatic life",
    ],
    popularProducts: [
      { name: "Standard EPDM Liner", spec: "1.0mm – 1.5mm", desc: "Premium rubber liner for ponds and reservoirs", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Reinforced EPDM", spec: "1.14mm – 1.52mm", desc: "Scrim-reinforced for enhanced tear resistance", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Potable Water EPDM", spec: "1.0mm", desc: "Certified safe for human drinking water applications", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "EPDM Flashing Tape", spec: "Accessories", desc: "Uncured EPDM for detailing and pipe penetrations", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },

  "pp-geomembranes": {
    slug: "pp-geomembranes",
    category: "geomembranes",
    label: "PP Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Flexible Polypropylene (fPP) geomembranes offering an excellent balance of flexibility, weldability, and chemical resistance.",
    description: [
      "Flexible Polypropylene (fPP) Geomembranes provide a unique combination of high flexibility, dimensional stability, and excellent resistance to a wide range of chemicals.",
      "Unlike PVC, fPP does not contain plasticisers, meaning it will not embrittle over time. It offers superior weldability and requires less maintenance than many traditional liner systems.",
      "Often used in potable water storage, floating covers, and exposed applications, our PP geomembranes deliver exceptional long-term performance.",
    ],
    features: [
      "Excellent flexibility without the use of plasticisers",
      "High chemical resistance and dimensional stability",
      "Superior UV resistance for exposed applications",
      "Outstanding weldability and seam strength",
    ],
    popularProducts: [
      { name: "Smooth fPP Geomembrane", spec: "1.0mm – 2.0mm", desc: "Unreinforced flexible polypropylene liner", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Reinforced fPP (fPP-R)", spec: "1.14mm – 1.52mm", desc: "Scrim-reinforced for high tensile strength", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Potable Water fPP", spec: "1.0mm – 1.5mm", desc: "Certified safe for drinking water containment", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Textured fPP", spec: "1.0mm – 2.0mm", desc: "Textured surface for increased slope stability", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },

  "textured-geomembranes": {
    slug: "textured-geomembranes",
    category: "geomembranes",
    label: "Textured Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Engineered geomembranes with textured surfaces designed to dramatically increase interface friction and stability on steep slopes.",
    description: [
      "Textured Geomembranes are specially manufactured with a roughened surface (either single-sided or double-sided) to provide superior frictional characteristics.",
      "By increasing the interface friction angle between the geomembrane and adjacent materials (such as soils, geotextiles, or GCLs), they prevent slippage and ensure structural stability on steep slopes and embankments.",
      "Available primarily in HDPE and LLDPE formulations, these liners are critical for landfill capping, heap leach pads, and steep reservoir embankments.",
    ],
    features: [
      "Significantly increased interface friction angle",
      "Available in single-sided and double-sided textures",
      "Co-extruded or structured texturing for consistent performance",
      "Ideal for steep slopes, landfill caps, and heap leach pads",
    ],
    popularProducts: [
      { name: "GSE HDPE Double Textured", spec: "1.5mm – 2.5mm", desc: "Maximum friction on both sides for steep slopes", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "GSE HDPE Single Textured", spec: "1.5mm – 2.5mm", desc: "Textured top, smooth bottom for specific designs", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "GSE LLDPE Textured", spec: "1.0mm – 2.0mm", desc: "Combining flexibility with high friction", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Structured Profile Liner", spec: "1.5mm – 2.5mm", desc: "Engineered studded profile for integrated drainage", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },

  "speciality-geomembranes": {
    slug: "speciality-geomembranes",
    category: "geomembranes",
    label: "Speciality Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Advanced, highly engineered liner systems tailored for extreme chemical environments, high temperatures, and specific technical requirements.",
    description: [
      "Speciality Geomembranes encompass a range of highly engineered products designed to solve specific, complex containment challenges that standard liners cannot address.",
      "This includes high-temperature resistant liners for industrial processes, conductive liners for post-installation leak detection, and composite liners with integrated drainage or leak detection layers.",
      "Our technical team works closely with designers to select the exact speciality formulation required to ensure regulatory compliance and structural integrity in extreme environments.",
    ],
    features: [
      "Conductive surfaces for spark testing and leak location",
      "High-temperature formulations for industrial brine and process ponds",
      "White-reflective surfaces for reduced thermal expansion",
      "Custom alloyed and composite geomembrane structures",
    ],
    popularProducts: [
      { name: "GSE Conductive Liner", spec: "1.5mm – 2.5mm", desc: "Electrically conductive bottom layer for leak testing", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "High-Temperature Liner", spec: "1.5mm – 2.0mm", desc: "Formulated for continuous exposure to hot fluids", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "White Surfaced Geomembrane", spec: "1.5mm – 2.0mm", desc: "UV reflective top layer to lower liner temperature", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Chemical Resistant Alloy (CRA)", spec: "1.0mm – 2.0mm", desc: "Extreme resistance to highly aggressive chemicals", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },

  "floating-cover-geomembranes": {
    slug: "floating-cover-geomembranes",
    category: "geomembranes",
    label: "Floating Cover Geomembranes",
    heroImage: DEFAULT_IMAGES["geomembranes"],
    subtitle: "Engineered floating cover systems designed to protect water quality, prevent evaporation, and capture biogas in reservoirs and process ponds.",
    description: [
      "Floating Cover Geomembranes are specialized systems deployed over liquid surfaces to provide an impermeable barrier between the stored fluid and the atmosphere.",
      "They are extensively used to protect potable water from contamination and algae growth, to eliminate evaporation in arid regions, and to capture odours or valuable biogas in wastewater and agricultural facilities.",
      "These systems are typically manufactured from flexible, highly UV-resistant materials like LLDPE, fPP, or CSPE, engineered to withstand continuous flexing and wind uplift forces.",
    ],
    features: [
      "Prevents evaporation and protects water from contamination",
      "Captures and controls odours and valuable biogas",
      "Highly flexible to accommodate changing fluid levels",
      "Exceptional long-term UV and weathering resistance",
    ],
    popularProducts: [
      { name: "Potable Water Floating Cover", spec: "CSPE / fPP", desc: "Certified systems for drinking water reservoirs", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Biogas Collection Cover", spec: "HDPE / LLDPE", desc: "Gas-tight covers for anaerobic digesters", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Evaporation Control Cover", spec: "LLDPE", desc: "Cost-effective solution to eliminate water loss", image: DEFAULT_IMAGES["geomembranes"] },
      { name: "Modular Floating Hexagons", spec: "HDPE", desc: "Bird-ball alternative for modular coverage", image: DEFAULT_IMAGES["geomembranes"] },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5),
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

function generateParentCategoryFallback(slug: string): ProductPageContent {
  const labelMap: Record<string, string> = {
    geomembranes: "Geomembranes",
    geotextiles: "Geotextiles",
    geogrids: "Geogrids",
    geocells: "Geocells",
    gcls: "GCLs",
    "drainage-composites": "Drainage Composites",
    "erosion-control": "Erosion Control",
    accessories: "Accessories",
  };

  const label = labelMap[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const heroImage = DEFAULT_IMAGES[slug] || DEFAULT_IMAGES["geomembranes"];

  const subtitles: Record<string, string> = {
    geomembranes: "Premium impermeable barrier systems engineered for extreme chemical resistance, waterproofing, and secure fluid containment in African projects.",
    geotextiles: "High-durability non-woven, woven, and high-strength filtration fabrics designed to optimize drainage, separation, soil reinforcement, and protection.",
    geogrids: "High-tensile stabilization and soil reinforcement grids engineered to increase structural bearing capacity for roads, pavements, and retaining walls.",
    geocells: "Three-dimensional honeycomb confinement systems engineered for slope erosion protection, channel stabilization, and heavy-duty load support.",
    gcls: "Composite geosynthetic clay liners comprising premium swelling bentonite between robust geotextiles, providing self-sealing hydraulic containment barriers.",
    "drainage-composites": "High-flow geocomposites, geonets, and drainage boards engineered to provide rapid liquid transmission and structural relief.",
    "erosion-control": "Natural and synthetic blankets, turf reinforcement mats, and coir logs engineered for vegetative reinforcement and immediate slope stabilization.",
    accessories: "Professional welding rods, bentonite paste, seaming tape, and specialized installation equipment to guarantee seam integrity and waterproofing.",
  };

  const descriptions: Record<string, string[]> = {
    geomembranes: [
      "Geomembranes are highly engineered, low-permeability synthetic membrane barriers utilized in geotechnical, environmental, and civil engineering projects to secure critical containment systems.",
      "We supply world-leading Solmax / GSE branded liners, recognized globally for superior UV protection, stress crack resistance, and continuous chemical endurance under harsh exposed or buried applications.",
      "Whether sealing hazardous tailing containment in mine works, lining municipal waste dumps, or securing clean drinking water reservoirs, our geomembrane products meet and exceed rigorous GRI-GM13 and GRI-GM17 standards."
    ],
    geotextiles: [
      "Geotextiles are permeable fabrics made of robust synthetic fibers, engineered to perform critical functions of separation, filtration, drainage, reinforcement, and protection within soil and rock structures.",
      "Our extensive selection includes needle-punched non-woven PET/PP geotextiles for superior filtration and cushion protection, along with high-modulus woven geotextiles engineered for high-strength road stabilization.",
      "Sourced to perform flawlessly in civil infrastructure, coastlines, and landfill barrier systems, these fabrics deliver continuous performance under severe mechanical and hydraulic stresses."
    ],
    geogrids: [
      "Geogrids are high-performance polymer structures consisting of open apertures, designed specifically for base stabilization, subgrade reinforcement, and mechanically stabilized earth (MSE) retaining wall construction.",
      "By interlocking with soil, gravel, and aggregate particles, our geogrids distribute heavy wheel loads, reduce asphalt cracking, and prevent differential settlement across problematic soft subgrades.",
      "We offer premium biaxial, uniaxial, and triaxial geogrids designed to optimize performance, decrease project construction costs, and extend infrastructure lifespan across Africa."
    ],
    geocells: [
      "Geocells are robust, three-dimensional cellular confinement systems fabricated from ultrasonically welded HDPE strips, designed to retain soil, sand, or concrete in steep slope and load support applications.",
      "When filled with granular infill materials, the cellular structure restricts lateral movement, creating a highly stiff, monolithic base that dramatically reduces subgrade stress and resists erosion.",
      "These structures are highly effective for slope erosion protection, vegetative channel linings, and subbase reinforcement over extremely soft soils."
    ],
    gcls: [
      "Geosynthetic Clay Liners (GCLs) are high-performance composite barriers featuring a core layer of active sodium bentonite clay needle-punched between two highly durable geotextile layers.",
      "Upon hydration, the bentonite clay swells to form an extremely low-permeability hydraulic barrier. GCLs offer superior self-sealing characteristics, making them highly resistant to installation puncture.",
      "Used extensively as primary or secondary containment linings in landfills, mining heap leach pads, and industrial process ponds, our GCLs guarantee continuous containment reliability."
    ],
    "drainage-composites": [
      "Drainage Composites are highly efficient, pre-fabricated drainage systems consisting of structured plastic cores laminated to protective geotextile filter layers, designed to replace traditional gravel drains.",
      "These composites facilitate high-flow fluid and gas transmission behind retaining walls, beneath landfill liners, and along horizontal foundations, preventing hydraulic pressure build-up.",
      "Lightweight, easy to deploy, and offering superior flow rates compared to natural soils, our drainage composites are specified for demanding civil and environmental applications."
    ],
    "erosion-control": [
      "Erosion Control products provide immediate surface protection and soil stability against heavy rainfall, wind, and run-off while encouraging successful vegetation growth on slopes and embankments.",
      "Our solutions range from 100% natural, biodegradable coir blankets and straw mats for temporary protection, to high-performance, non-degradable Turf Reinforcement Mats (TRMs) for severe high-velocity flow channels.",
      "Specifically engineered to establish sustainable green infrastructure, these systems deliver reliable, environmentally friendly stabilization."
    ],
    accessories: [
      "Geosynthetic installation accessories comprise a specialized selection of raw materials, joint sealants, seaming tapes, and testing equipment necessary to successfully install and verify barrier systems.",
      "From Solmax welding rods that guarantee continuous fusion between geomembrane panels, to swellable bentonite paste for detailing structures, every accessory is specified to prevent system leaks.",
      "Utilizing the correct, certified accessories ensures full compliance with international installation QA/QC guidelines and long-term project success."
    ],
  };

  const defaultTypes: Record<string, { name: string; description: string }[]> = {
    geomembranes: [
      { name: "HDPE Geomembranes", description: "Standard best-in-class barrier for high durability, chemical, and UV resistance." },
      { name: "LLDPE Geomembranes", description: "Highly flexible linear low-density membranes for differential settlement and covers." },
      { name: "PVC Geomembranes", description: "Conformable, puncture-resistant synthetic rubber-like liners ideal for tunnels and ponds." },
      { name: "EPDM Geomembranes", description: "Premium elastomeric rubber liners with unmatched elasticity, weather, and ozone resistance." },
    ],
    geotextiles: [
      { name: "Non-Woven Geotextiles", description: "Needle-punched PET or PP fabrics optimized for filtration, drainage, and liner protection." },
      { name: "Woven Geotextiles", description: "High-modulus slit-film or monofilament fabrics designed for soil separation and subgrade stabilization." },
      { name: "High-Strength Geotextiles", description: "Polyester woven fabrics with extreme tensile capacity up to 1000 kN/m for soil reinforcement." },
      { name: "Geotextile Tubes", description: "Large permeable geo-bags used for industrial sludge dewatering and shoreline erosion protection." },
    ],
    geogrids: [
      { name: "Biaxial Geogrids", description: "PP geogrids with square apertures designed to stabilize roads and load-bearing aggregate bases." },
      { name: "Uniaxial Geogrids", description: "HDPE grids designed with elongated apertures to reinforce retaining walls and steep soil slopes." },
      { name: "Triaxial Geogrids", description: "Advanced triangular structure delivering multi-directional load distribution for maximum stability." },
      { name: "Fiberglass Geogrids", description: "High-temperature resistant grids coated with elastomeric polymer for asphalt overlay reinforcement." },
    ],
    geocells: [
      { name: "Standard Geocells", description: "Welded cellular structures for standard retaining wall and soil confinement tasks." },
      { name: "Textured & Perforated Geocells", description: "Roughened walls and holes for enhanced soil friction and optimal lateral water drainage." },
      { name: "Slope Protection Geocells", description: "UV-stabilized cellular arrays designed to establish stable vegetative green slopes." },
    ],
    gcls: [
      { name: "Standard Needle-Punched GCL", description: "Needle-locked sodium bentonite between non-woven and woven geotextiles." },
      { name: "PE Coated GCL", description: "Composite GCL laminated with a thin polyethylene membrane for enhanced low-permeability safety." },
      { name: "Reinforced GCL", description: "High-shear strength composite specifically engineered for steep slope applications." },
    ],
    "drainage-composites": [
      { name: "Geonets", description: "High-density polyethylene bi-planar or tri-planar nets for heavy-duty gas or water venting." },
      { name: "Geocomposite Drains", description: "Cores wrapped in protective geotextile filter fabrics to provide clean, high-flow water paths." },
      { name: "Dimple Boards", description: "Studded plastic sheets designed for waterproofing and drainage behind structural concrete walls." },
    ],
    "erosion-control": [
      { name: "Erosion Control Blankets (ECBs)", description: "Biodegradable natural mats (coconut coir or straw) for temporary soil protection during seeding." },
      { name: "Turf Reinforcement Mats (TRMs)", description: "Permanent, high-strength 3D synthetic mats that reinforce root structures against severe flows." },
      { name: "Coir Logs", description: "Densely packed coconut fiber logs designed to reduce water velocity along banks and shorelines." },
    ],
    accessories: [
      { name: "Solmax Welding Rods", description: "High-purity HDPE/LLDPE resin rods for continuous hot-air extrusion panel welding." },
      { name: "Bentonite Paste & Powder", description: "Water-swellable sodium bentonite sealants for structural penetrations and detailing." },
      { name: "Fixing J-Pins & Pegs", description: "Heavy-duty steel anchors to secure geotextiles and erosion control blankets to the subgrade." },
    ],
  };

  const defaultPopular: Record<string, { name: string; spec: string; desc: string; image?: string; slug?: string }[]> = {
    geomembranes: [
      { name: "GSE HDPE Smooth", spec: "1.0mm - 3.0mm thickness", desc: "Global gold-standard for lining mining pads and landfills.", image: heroImage },
      { name: "GSE HDPE Textured", spec: "1.0mm - 2.5mm thickness", desc: "Single/double textured for extreme interface friction on slopes.", image: heroImage },
      { name: "GSE EPDM Synthetic Rubber", spec: "1.0mm - 1.5mm thickness", desc: "Exceptional flexibility and durability for drinking water ponds.", image: heroImage },
    ],
    geotextiles: [
      { name: "Needle-Punched Non-Woven PET", spec: "100g - 1200g/m² weight", desc: "Highly permeable cushion protector and filtration fabric.", image: heroImage },
      { name: "High-Strength Woven Polyester", spec: "Up to 1000kN strength", desc: "Extreme tensile stabilization for embankment reinforcements.", image: heroImage },
      { name: "Geotextile Sand Container", spec: "Custom sizing", desc: "Heavy-duty geotextile bag for beach and river bank protection.", image: heroImage },
    ],
    geogrids: [
      { name: "Biaxial PP Geogrid", spec: "20/20 to 40/40 kN strength", desc: "Standard grid for load-bearing road base reinforcement.", image: heroImage },
      { name: "Uniaxial HDPE Geogrid", spec: "50 to 200 kN strength", desc: "Engineered specifically for steep walls and bridge abutments.", image: heroImage },
      { name: "Tensar TriAxial Geogrid", spec: "High structural stiffness", desc: "Triangular apertures providing maximum multi-directional load distribution.", image: heroImage },
    ],
    geocells: [
      { name: "Textured & Perforated Geocell", spec: "75mm - 200mm depth", desc: "Confinement honeycomb with drainage holes and textured walls.", image: heroImage },
      { name: "Standard Slope Protection Geocell", spec: "UV Stabilized HDPE", desc: "Monolithic confinement grid to establish grass slope walls.", image: heroImage },
    ],
    gcls: [
      { name: "Solmax GSE GCL", spec: "4.5kg - 5.5kg bentonite/m²", desc: "Needle-punched geosynthetic clay liner offering self-healing properties.", image: heroImage },
      { name: "PE Laminated GCL", spec: "Laminated PE backing", desc: "Dual hydraulic protection combining active clay with a thin poly membrane.", image: heroImage },
    ],
    "drainage-composites": [
      { name: "Tri-Planar Geocomposite Drain", spec: "High transmissivity", desc: "Tri-planar HDPE geonet with laminated non-woven filter fabrics.", image: heroImage },
      { name: "Prefabricated Strip Drain", spec: "Fast water conveyance", desc: "Engineered composite for rapid subsoil trench drainage.", image: heroImage },
    ],
    "erosion-control": [
      { name: "3D Synthetic Turf Reinforcement Mat", spec: "Permanent TRM matrix", desc: "High-tensile three-dimensional matrix for extreme water flows.", image: heroImage },
      { name: "Biodegradable Coir Matting", spec: "100% natural coconut fibers", desc: "Robust, heavy woven blanket providing immediate surface slope cover.", image: heroImage },
    ],
    accessories: [
      { name: "HDPE Extrusion Welding Rod", spec: "4mm and 5mm diameter", desc: "Certified high-grade welding rod matching Solmax geomembranes.", image: heroImage },
      { name: "Swellable Bentonite Waterstop Paste", spec: "Waterproofing sealant", desc: "Active swelling sealant to eliminate bypass around piping and fittings.", image: heroImage },
    ],
  };

  const defaultFeatures: Record<string, string[]> = {
    geomembranes: [
      "Premium Solmax / GSE globally certified raw materials",
      "Exceptional UV, chemical, ozone, and weather resistance",
      "Fully compliant with GRI-GM13 and GRI-GM17 standards",
      "Available in smooth, textured, white, and conductive profiles",
    ],
    geotextiles: [
      "Engineered high-permeability needle-punched fibers",
      "Superior separation preventing soil mixing under heavy loads",
      "Excellent soil particle filtration with continuous flow",
      "High puncture resistance protecting geomembrane liners",
    ],
    geogrids: [
      "Optimized aperture shapes ensuring strong aggregate interlock",
      "Reduces subbase aggregate thickness requirements by up to 50%",
      "Provides continuous reinforcement over soft, problematic soils",
      "High chemical resistance ensuring decades of buried service life",
    ],
    geocells: [
      "Monolithic ultrasonically welded cellular arrays",
      "Dramatically reduces subgrade vertical pressures under loads",
      "Secures soil and seed against heavy run-off washing",
      "UV stabilized polymer ensuring robust, long-term exposure",
    ],
    gcls: [
      "Natural swelling sodium bentonite core providing self-sealing",
      "Equivalent performance to thick compacted clay layers at lower cost",
      "Robust needle-locked structure securing bentonite from shifting",
      "Simplifies landfill and mining containment layer deployment",
    ],
    "drainage-composites": [
      "High-flow capacity replacing expensive gravel drainage layers",
      "Protective filter layers preventing structural core clogging",
      "Extremely lightweight and fast to deploy relative to soils",
      "Reduces hydro-static pressures behind earth-retaining walls",
    ],
    "erosion-control": [
      "Provides immediate protection against severe soil wash-off",
      "Establishes natural, stable green slopes and channels",
      "Temporary and permanent matrices specified for flow velocity",
      "Non-toxic and 100% safe for wildlife and surrounding soils",
    ],
    accessories: [
      "Certified raw materials matching core geosynthetic systems",
      "Ensures seamless and leak-free panel seaming and closures",
      "Rigorous quality control matching international guidelines",
      "Full range of structural sealants, pins, and seaming devices",
    ],
  };

  const defaultHighlights: Record<string, { label: string; value: string }[]> = {
    geomembranes: [
      { label: "Standards", value: "GRI-GM13 / GRI-GM17" },
      { label: "Types", value: "HDPE, LLDPE, PVC, EPDM, fPP" },
      { label: "Durability", value: "Exposed 25+ yrs, Buried 100+ yrs" },
    ],
    geotextiles: [
      { label: "Weights", value: "100g/m² - 1200g/m²" },
      { label: "Strengths", value: "10 kN/m - 1000 kN/m" },
      { label: "Functions", value: "Filter, Separation, Protection" },
    ],
    geogrids: [
      { label: "Apertures", value: "Biaxial, Uniaxial, Triaxial" },
      { label: "Materials", value: "Polypropylene, Polyester, HDPE" },
      { label: "Applications", value: "Road base, Retaining walls" },
    ],
    geocells: [
      { label: "Depth", value: "75mm - 200mm dimensions" },
      { label: "Weld Spacing", value: "330mm - 712mm standard" },
      { label: "Finish", value: "Textured and perforated walls" },
    ],
    gcls: [
      { label: "Permeability", value: "≤ 5 x 10^-11 m/sec" },
      { label: "Bentonite Mass", value: "≥ 4.5 kg/m² mass" },
      { label: "Shear Strength", value: "Internal needle-punched" },
    ],
    "drainage-composites": [
      { label: "Cores", value: "Bi-planar, Tri-planar geonet" },
      { label: "Filter Fabric", value: "Laminated non-woven fabric" },
      { label: "Conveyance", value: "Water and gas venting" },
    ],
    "erosion-control": [
      { label: "Materials", value: "Coir, Straw, Polypropylene" },
      { label: "Life Expectancy", value: "12 months to Permanent" },
      { label: "Slope Gradients", value: "1:1 and steeper limits" },
    ],
    accessories: [
      { label: "Welding Resins", value: "Solmax matches GSE liners" },
      { label: "Applications", value: "Detailing, sealing, testing" },
      { label: "Quality Checks", value: "Standard ISO compliance" },
    ],
  };

  return {
    slug,
    label,
    heroImage,
    subtitle: subtitles[slug] || `Premium high-performance ${label.toLowerCase()} systems engineered for critical African civil, infrastructure, and environmental containment projects.`,
    description: descriptions[slug] || [
      `Our highly engineered ${label.toLowerCase()} systems are designed to perform critical structural and environmental functions across mining, containment, and infrastructure projects in Africa.`,
      "Sourced from leading global manufacturers, all materials undergo stringent testing to meet and exceed international civil engineering specifications, guaranteeing durability and safety under demanding environmental conditions."
    ],
    features: defaultFeatures[slug] || [
      "Engineered from premium high-density raw polymers",
      "Rigorous quality control and test compliance",
      "Optimized for quick and reliable site installation",
      "Superior long-term durability and structural stability",
    ],
    technicalHighlights: defaultHighlights[slug] || [
      { label: "Quality", value: "ISO & GRI Certified" },
      { label: "Availability", value: "Pan-African shipping" },
    ],
    propertiesTable: {
      headers: ["Key Performance Properties", "Test Standard", "Value (Metric Guidance)"],
      rows: [
        ["Material Grade", "ASTM Standard", "Premium Virgin Polymer"],
        ["UV Stability", "ASTM D4355 / GRI", "Excellent retention"],
        ["Chemical Endurance", "EPA 9090 / ISO", "Highly resistant"],
      ],
    },
    types: defaultTypes[slug] || [],
    benefits: [
      { title: "Pan-African Supply", description: "Rapid logistics, customs clearing, and continuous stock availability across Africa." },
      { title: "Engineered Compliance", description: "Fully certified by ISO and international bodies to satisfy rigorous tender requirements." },
      { title: "Technical Support", description: "Design consultation, custom bill of quantities, and certified field welding support." },
    ],
    faqs: [
      { question: `Are these ${label.toLowerCase()} products certified?`, answer: `Yes, all our primary geosynthetics are manufactured to international standards (such as GRI, ASTM, and ISO) and are fully certified by Solmax/GSE and other world-class bodies.` },
      { question: "Do you supply and ship across Africa?", answer: "Absolutely. We provide complete freight logistics, customs clearance, and material delivery directly to remote mine sites and municipal locations across the African continent." },
      { question: "Can your team assist with engineering designs?", answer: "Yes, our in-house technical department provides professional design support, value engineering, material selection advice, and detailed BOQ estimations." },
    ],
    installationSpecs: [
      `Installation must be conducted by certified technicians in dry, smooth conditions. All subgrades must be prepared to satisfy manufacturer specifications. Anchor trenches and seams must be rigorously locked and verified using standard destructive and non-destructive testing methodologies according to quality QA/QC specifications.`
    ],
    projectReferences: [
      { name: "Environmental Containment", location: "South Africa", year: "2022", image: heroImage },
      { name: "Civil Infrastructure Works", location: "East Africa", year: "2023", image: heroImage },
    ],
    popularProducts: defaultPopular[slug] || [],
    applications: [
      { label: "Mining Systems", slug: "mining-systems", description: "Tailings storage, heap leach pads, and process containment." },
      { label: "Water Containment", slug: "water-containment", description: "Drinking water reservoirs, canals, and agricultural dams." },
      { label: "Waste Landfills", slug: "waste-landfills", description: "Secure landfill base linings and top caps." },
      { label: "Roads & Infrastructure", slug: "roads-infrastructure", description: "Subgrade reinforcement and structural retaining walls." },
    ],
    industries: [
      { label: "Construction & Infrastructure", slug: "construction-infrastructure" },
      { label: "Mining", slug: "mining" },
      { label: "Environmental & Waste", slug: "environmental-waste" },
      { label: "Water Management", slug: "water-management" },
      { label: "Agriculture & Aquaculture", slug: "agriculture-aquaculture" }
    ],
  };
}

/**
 * Fetch product category page content from Supabase.
 * Returns null if no content is configured for the slug — the route will show a 404.
 */
export async function getProductPageContent(
  slug: string,
  _label?: string,
): Promise<ProductPageContent | null> {
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "template_product_categories")
    .maybeSingle();

  if (error) {
    console.error("[getProductPageContent] Supabase error:", error.message);
  }

  if (data?.value) {
    const templates = data.value as Record<string, any>;
    if (templates[slug]) {
      const t = templates[slug];
      return {
        slug: t.slug ?? slug,
        category: t.category,
        label: t.label ?? slug,
        heroImage: t.heroImage ?? DEFAULT_IMAGES["geomembranes"],
        subtitle: t.subtitle ?? "",
        description: t.description ?? [],
        features: t.features ?? [],
        popularProducts: t.popularProducts ?? [],
        relatedProductGroups: t.relatedProductGroups,
        applications: t.applications ?? [],
        industries: t.industries ?? [],
        technicalHighlights: t.technicalHighlights,
        propertiesTable: t.propertiesTable,
        types: t.types,
        benefits: t.benefits,
        faqs: t.faqs,
        installationSpecs: t.installationSpecs,
        projectReferences: t.projectReferences,
        seo: t.seo,
      } as ProductPageContent;
    }
  }

  // Fetch active hierarchy configuration to find matching parent item dynamically
  try {
    const { data: hierarchyData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "hierarchy_products")
      .maybeSingle();

    if (hierarchyData?.value) {
      const hierarchy = hierarchyData.value as any;
      if (hierarchy.items && Array.isArray(hierarchy.items)) {
        const matchedItem = hierarchy.items.find(
          (item: any) => item.slug === slug || item.id === slug
        );
        if (matchedItem) {
          // Use the item ID to resolve the canonical fallback category (e.g. "geomembranes")
          const fallback = generateParentCategoryFallback(matchedItem.id || slug);
          const custom = matchedItem.pageContent || {};
          return {
            ...fallback,
            label: matchedItem.label || fallback.label,
            heroImage: custom.heroImage || fallback.heroImage,
            subtitle: custom.subtitle || fallback.subtitle,
            description: (custom.description && custom.description.length > 0) ? custom.description : fallback.description,
            features: (custom.features && custom.features.length > 0) ? custom.features : fallback.features,
            technicalHighlights: custom.technicalHighlights || fallback.technicalHighlights,
            propertiesTable: custom.propertiesTable || fallback.propertiesTable,
            types: custom.types || fallback.types,
            benefits: custom.benefits || fallback.benefits,
            faqs: custom.faqs || fallback.faqs,
            installationSpecs: custom.installationSpecs || fallback.installationSpecs,
            projectReferences: custom.projectReferences || fallback.projectReferences,
            popularProducts: custom.popularProducts || fallback.popularProducts,
            applications: custom.applications || fallback.applications,
            industries: custom.industries || fallback.industries,
            seo: custom.seo || fallback.seo,
          } as ProductPageContent;
        }
      }
    }
  } catch (err) {
    console.error("[getProductPageContent] Failed to fetch or merge hierarchy customization:", err);
  }

  // Static fallback if hierarchy check failed/skipped but is one of canonical parent category IDs
  const parentCategories = [
    "geomembranes",
    "geotextiles",
    "geogrids",
    "geocells",
    "gcls",
    "drainage-composites",
    "erosion-control",
    "accessories"
  ];

  if (parentCategories.includes(slug)) {
    return generateParentCategoryFallback(slug);
  }

  return null;
}

