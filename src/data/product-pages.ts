import { APPLICATION_CATEGORIES, INDUSTRIES } from "@/components/site/mega-menu-data";

export interface ProductPageContent {
  slug: string;
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
  projectReferences?: { name: string; location: string; year: string; image: string }[];
  popularProducts: { name: string; spec: string; desc: string; image?: string; slug?: string }[];
  applications: { label: string; slug: string; description?: string }[];
  industries: { label: string; slug: string }[];
}

const DEFAULT_IMAGES: Record<string, string> = {
  geomembranes: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
  geotextiles: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1920&q=80",
  geogrids: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80",
  geocells: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  gcls: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80",
  "drainage-composites": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  "erosion-control": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  accessories: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
};

export function getProductPageContent(slug: string, label: string): ProductPageContent {
  
  if (slug === "hdpe-geomembranes") {
    return {
      slug,
      label: "HDPE Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Engineered materials for critical infrastructure. Learn how our HDPE geomembranes deliver uncompromised performance, reliability, and longevity across global applications.",
      description: [
        "High-Density Polyethylene (HDPE) Geomembranes are highly engineered materials designed to perform critical containment functions in civil, mining, and environmental engineering.",
        "We proudly supply the GSE / Solmax brand, recognised globally as the best-in-class manufacturer. These materials offer exceptional durability, UV resistance, and resistance to harsh environmental conditions.",
        "Whether providing an impermeable barrier for hazardous waste or secure containment for potable water, our HDPE systems are stringently tested to meet and exceed international quality standards like GRI-GM13."
      ],
      features: [
        "Manufactured to stringent ISO guidelines (GSE/Solmax)",
        "High resistance to UV and chemical degradation",
        "Excellent stress crack resistance and durability",
        "Available in smooth, single-sided, and double-sided textured finishes"
      ],
      technicalHighlights: [
        { label: "Thickness", value: "1mm - 3mm" },
        { label: "Width", value: "7m - 8m" },
        { label: "Roll Length", value: "100m - 200m" }
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
          ["Carbon Black Content", "ASTM D1603", "2.0 - 3.0%", "2.0 - 3.0%"]
        ]
      },
      types: [
        { name: "Smooth Geomembranes", description: "Standard high-performance barrier for general containment" },
        { name: "Textured Geomembranes", description: "Single or double-sided textured for increased friction on slopes" },
        { name: "White Geomembranes", description: "UV reflective top layer to lower liner temperature" },
        { name: "Conductive Geomembranes", description: "Spark-testable geomembrane for post-installation leak detection" }
      ],
      benefits: [
        { title: "High Durability", description: "Engineered to withstand harsh environmental conditions and mechanical stress." },
        { title: "Chemical Resistance", description: "Highly resistant to a wide range of chemicals, making it ideal for hazardous waste." },
        { title: "UV Protection", description: "Formulated with carbon black and antioxidants for superior UV resistance." },
        { title: "Cost-Effective", description: "Long lifespan and low maintenance requirements provide excellent ROI." }
      ],
      faqs: [
        { question: "What is the typical lifespan of GSE HD HDPE?", answer: "When properly installed and maintained, GSE HD HDPE geomembranes can last for decades. In exposed applications, they typically last 20-30 years, and when covered, they can exceed 100 years depending on environmental factors." },
        { question: "Can it be installed in cold weather?", answer: "Yes, but installation in extremely cold temperatures requires special care and pre-heating of the liner to ensure proper seaming." },
        { question: "How do you test the seams?", answer: "Seams are tested non-destructively using air pressure (for double track seams) or vacuum box testing (for extrusion welds), and destructively by peeling and shearing samples." }
      ],
      installationSpecs: [
        "Installation should only be performed by certified technicians using calibrated wedge and extrusion welding equipment. Subgrade preparation is critical and must be smooth, firm, and free of sharp objects. Panels should be deployed to minimize the number of seams, especially in corners and sumps. All seams must be tested and documented according to GRI-GM19 specifications. Anchor trenches must be properly excavated and backfilled to secure the liner against wind uplift and thermal contraction."
      ],
      projectReferences: [
        { name: "Mining Facilities", location: "South Africa", year: "2021", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Waste Management", location: "Kenya", year: "2022", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Water Containment", location: "Ghana", year: "2023", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Power Generation", location: "Nigeria", year: "2020", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      popularProducts: [
        { name: "GSE HDPE Smooth", spec: "1.0mm – 3.0mm", desc: "Standard high-performance barrier for general containment", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-hdpe-smooth" },
        { name: "GSE HDPE Textured", spec: "1.0mm – 3.0mm", desc: "Single-sided textured for increased friction on slopes", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-hdpe-textured" },
        { name: "GSE HDPE Double Textured", spec: "1.0mm – 3.0mm", desc: "Double-sided textured for maximum stability in steep applications", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-hdpe-double-textured" },
        { name: "GSE Conductive", spec: "1.5mm – 2.5mm", desc: "Spark-testable geomembrane for post-installation leak detection", image: DEFAULT_IMAGES["geomembranes"], slug: "gse-conductive" }
      ],
      applications: [
        { label: "Mining Facilities", slug: "mining", description: "Heap leach pads, tailings storage, and process ponds." },
        { label: "Waste Management", slug: "waste", description: "Landfill basal liners and capping systems." },
        { label: "Water Containment", slug: "water", description: "Potable water reservoirs and irrigation dams." },
        { label: "Power Generation", slug: "power", description: "Ash ponds and cooling water reservoirs." }
      ],
      industries: INDUSTRIES.slice(0, 5)
    };
  }
  
  if (slug === "lldpe-geomembranes") {
    return {
      slug,
      label: "LLDPE Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Engineered materials for critical infrastructure. Learn how our LLDPE geomembranes deliver exceptional flexibility and performance.",
      description: [
        "Linear Low-Density Polyethylene (LLDPE) Geomembranes offer increased flexibility and elongation compared to HDPE, making them ideal for applications with differential settlement.",
        "Sourced from premium manufacturers like GSE / Solmax, our LLDPE geomembranes provide excellent biaxial stress/strain properties while maintaining strong chemical and UV resistance."
      ],
      features: [
        "Superior flexibility and elongation for uneven terrain",
        "Excellent resistance to multi-axial stresses",
        "High resistance to UV and chemical degradation",
        "Available in smooth and textured finishes"
      ],
      popularProducts: [
        { name: "GSE LLDPE Smooth", spec: "1.0mm – 2.0mm", desc: "Flexible barrier for covers and differential settlement", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "GSE LLDPE Textured", spec: "1.0mm – 2.0mm", desc: "Textured surface for enhanced friction on slopes", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "GSE LLDPE White", spec: "1.0mm – 2.0mm", desc: "White surface to reflect heat and lower liner temperature", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "GSE LLDPE Reinforced", spec: "Custom", desc: "Scrim-reinforced for added dimensional stability", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  if (slug === "pvc-geomembranes") {
    return {
      slug,
      label: "PVC Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Highly flexible Polyvinyl Chloride (PVC) lining systems designed for easy installation and excellent conforming capabilities.",
      description: [
        "Polyvinyl Chloride (PVC) Geomembranes are highly flexible and conformable materials, often preferred for applications requiring complex detailing, subgrade accommodation, and ease of seaming.",
        "They offer excellent puncture resistance and are exceptionally easy to weld, making them suitable for a wide variety of civil, decorative, and environmental containment projects.",
        "Supplied from top-tier manufacturers, our PVC geomembranes are formulated to resist UV degradation and provide long-lasting impermeable barriers."
      ],
      features: [
        "Exceptional flexibility and conforming characteristics",
        "High puncture and tear resistance",
        "Easy and reliable seaming (wedge welding or solvent welding)",
        "Suitable for decorative ponds, tunnels, and structural waterproofing"
      ],
      popularProducts: [
        { name: "Standard PVC Geomembrane", spec: "0.5mm – 2.0mm", desc: "General purpose flexible liner", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "UV Stabilised PVC", spec: "1.0mm – 2.0mm", desc: "Enhanced UV protection for exposed applications", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Fish-Safe PVC", spec: "0.5mm – 1.0mm", desc: "Non-toxic formulation for aquaculture and koi ponds", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Tunnel Waterproofing PVC", spec: "1.5mm – 3.0mm", desc: "Heavy-duty liner for underground structures", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  if (slug === "epdm-geomembranes") {
    return {
      slug,
      label: "EPDM Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Premium Ethylene Propylene Diene Monomer (EPDM) synthetic rubber liners with unmatched elasticity, longevity, and weather resistance.",
      description: [
        "EPDM Geomembranes are highly durable synthetic rubber liners known for their extraordinary elasticity, capable of elongating over 300% to accommodate severe subgrade movement.",
        "They exhibit outstanding resistance to UV radiation, ozone, and extreme temperature fluctuations, ensuring a lifespan that often exceeds other membrane types in exposed conditions.",
        "Environmentally friendly and entirely fish-safe, EPDM is the premium choice for critical water containment, decorative water features, and agricultural applications."
      ],
      features: [
        "Unmatched elasticity and flexibility (over 300% elongation)",
        "Exceptional resistance to UV, ozone, and weathering",
        "Maintains flexibility in extreme cold and hot temperatures",
        "Eco-friendly, non-toxic, and safe for aquatic life"
      ],
      popularProducts: [
        { name: "Standard EPDM Liner", spec: "1.0mm – 1.5mm", desc: "Premium rubber liner for ponds and reservoirs", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Reinforced EPDM", spec: "1.14mm – 1.52mm", desc: "Scrim-reinforced for enhanced tear resistance", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Potable Water EPDM", spec: "1.0mm", desc: "Certified safe for human drinking water applications", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "EPDM Flashing Tape", spec: "Accessories", desc: "Uncured EPDM for detailing and pipe penetrations", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  if (slug === "pp-geomembranes") {
    return {
      slug,
      label: "PP Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Flexible Polypropylene (fPP) geomembranes offering an excellent balance of flexibility, weldability, and chemical resistance.",
      description: [
        "Flexible Polypropylene (fPP) Geomembranes provide a unique combination of high flexibility, dimensional stability, and excellent resistance to a wide range of chemicals.",
        "Unlike PVC, fPP does not contain plasticisers, meaning it will not embrittle over time. It offers superior weldability and requires less maintenance than many traditional liner systems.",
        "Often used in potable water storage, floating covers, and exposed applications, our PP geomembranes deliver exceptional long-term performance."
      ],
      features: [
        "Excellent flexibility without the use of plasticisers",
        "High chemical resistance and dimensional stability",
        "Superior UV resistance for exposed applications",
        "Outstanding weldability and seam strength"
      ],
      popularProducts: [
        { name: "Smooth fPP Geomembrane", spec: "1.0mm – 2.0mm", desc: "Unreinforced flexible polypropylene liner", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Reinforced fPP (fPP-R)", spec: "1.14mm – 1.52mm", desc: "Scrim-reinforced for high tensile strength", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Potable Water fPP", spec: "1.0mm – 1.5mm", desc: "Certified safe for drinking water containment", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Textured fPP", spec: "1.0mm – 2.0mm", desc: "Textured surface for increased slope stability", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  if (slug === "textured-geomembranes") {
    return {
      slug,
      label: "Textured Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Engineered geomembranes with textured surfaces designed to dramatically increase interface friction and stability on steep slopes.",
      description: [
        "Textured Geomembranes are specially manufactured with a roughened surface (either single-sided or double-sided) to provide superior frictional characteristics.",
        "By increasing the interface friction angle between the geomembrane and adjacent materials (such as soils, geotextiles, or GCLs), they prevent slippage and ensure structural stability on steep slopes and embankments.",
        "Available primarily in HDPE and LLDPE formulations, these liners are critical for landfill capping, heap leach pads, and steep reservoir embankments."
      ],
      features: [
        "Significantly increased interface friction angle",
        "Available in single-sided and double-sided textures",
        "Co-extruded or structured texturing for consistent performance",
        "Ideal for steep slopes, landfill caps, and heap leach pads"
      ],
      popularProducts: [
        { name: "GSE HDPE Double Textured", spec: "1.5mm – 2.5mm", desc: "Maximum friction on both sides for steep slopes", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "GSE HDPE Single Textured", spec: "1.5mm – 2.5mm", desc: "Textured top, smooth bottom for specific designs", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "GSE LLDPE Textured", spec: "1.0mm – 2.0mm", desc: "Combining flexibility with high friction", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Structured Profile Liner", spec: "1.5mm – 2.5mm", desc: "Engineered studded profile for integrated drainage", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  if (slug === "speciality-geomembranes") {
    return {
      slug,
      label: "Speciality Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Advanced, highly engineered liner systems tailored for extreme chemical environments, high temperatures, and specific technical requirements.",
      description: [
        "Speciality Geomembranes encompass a range of highly engineered products designed to solve specific, complex containment challenges that standard liners cannot address.",
        "This includes high-temperature resistant liners for industrial processes, conductive liners for post-installation leak detection, and composite liners with integrated drainage or leak detection layers.",
        "Our technical team works closely with designers to select the exact speciality formulation required to ensure regulatory compliance and structural integrity in extreme environments."
      ],
      features: [
        "Conductive surfaces for spark testing and leak location",
        "High-temperature formulations for industrial brine and process ponds",
        "White-reflective surfaces for reduced thermal expansion",
        "Custom alloyed and composite geomembrane structures"
      ],
      popularProducts: [
        { name: "GSE Conductive Liner", spec: "1.5mm – 2.5mm", desc: "Electrically conductive bottom layer for leak testing", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "High-Temperature Liner", spec: "1.5mm – 2.0mm", desc: "Formulated for continuous exposure to hot fluids", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "White Surfaced Geomembrane", spec: "1.5mm – 2.0mm", desc: "UV reflective top layer to lower liner temperature", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Chemical Resistant Alloy (CRA)", spec: "1.0mm – 2.0mm", desc: "Extreme resistance to highly aggressive chemicals", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  if (slug === "floating-cover-geomembranes") {
    return {
      slug,
      label: "Floating Cover Geomembranes",
      heroImage: DEFAULT_IMAGES["geomembranes"],
      subtitle: "Engineered floating cover systems designed to protect water quality, prevent evaporation, and capture biogas in reservoirs and process ponds.",
      description: [
        "Floating Cover Geomembranes are specialized systems deployed over liquid surfaces to provide an impermeable barrier between the stored fluid and the atmosphere.",
        "They are extensively used to protect potable water from contamination and algae growth, to eliminate evaporation in arid regions, and to capture odours or valuable biogas in wastewater and agricultural facilities.",
        "These systems are typically manufactured from flexible, highly UV-resistant materials like LLDPE, fPP, or CSPE, engineered to withstand continuous flexing and wind uplift forces."
      ],
      features: [
        "Prevents evaporation and protects water from contamination",
        "Captures and controls odours and valuable biogas",
        "Highly flexible to accommodate changing fluid levels",
        "Exceptional long-term UV and weathering resistance"
      ],
      popularProducts: [
        { name: "Potable Water Floating Cover", spec: "CSPE / fPP", desc: "Certified systems for drinking water reservoirs", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Biogas Collection Cover", spec: "HDPE / LLDPE", desc: "Gas-tight covers for anaerobic digesters", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Evaporation Control Cover", spec: "LLDPE", desc: "Cost-effective solution to eliminate water loss", image: DEFAULT_IMAGES["geomembranes"] },
        { name: "Modular Floating Hexagons", spec: "HDPE", desc: "Bird-ball alternative for modular coverage", image: DEFAULT_IMAGES["geomembranes"] }
      ],
      applications: APPLICATION_CATEGORIES.slice(0, 5),
      industries: INDUSTRIES.slice(0, 5)
    };
  }

  // Fallback template for other categories
  const parentSlug = slug.split("-").pop() || "geomembranes";
  const heroImage = DEFAULT_IMAGES[slug] || DEFAULT_IMAGES[parentSlug] || DEFAULT_IMAGES["geomembranes"];

  return {
    slug,
    label,
    heroImage,
    subtitle: `Engineered materials for critical infrastructure. Learn how our ${label.toLowerCase()} deliver uncompromised performance, reliability, and longevity across global applications.`,
    description: [
      `${label} are highly engineered materials designed to perform critical functions in civil, mining, and environmental engineering. Sourced from global best-in-class manufacturers, these materials offer exceptional durability and resistance to harsh environmental conditions.`,
      `Whether providing an impermeable barrier, structural reinforcement, or effective drainage, our ${label.toLowerCase()} are stringently tested to meet and exceed international quality standards.`
    ],
    features: [
      "Manufactured to stringent ISO guidelines",
      "High resistance to UV and chemical degradation",
      "Custom specifications available for specialised projects"
    ],
    popularProducts: [
      { name: `Premium ${label}`, spec: "Standard Specs", desc: "High performance system", image: heroImage },
      { name: `Standard ${label}`, spec: "Standard Specs", desc: "Reliable solution", image: heroImage },
      { name: `Textured ${label}`, spec: "Specialised", desc: "High friction surface", image: heroImage },
      { name: `Reinforced ${label}`, spec: "Custom", desc: "Extra strength", image: heroImage },
    ],
    applications: APPLICATION_CATEGORIES.slice(0, 5),
    industries: INDUSTRIES.slice(0, 5)
  };
}
