import { findProductFamily } from "@/lib/product-families";
import { APPLICATION_DIRECTORY } from "@/data/application-directory";

export interface MaterialSelectionGuide {
  slug: string;
  title: string;
  description: string;
  functions: string[];
  inputs: string[];
  installation: string;
  quality: string;
  applications: string[];
}

/** Qualitative selection guidance. Grade values and acceptance criteria belong to the approved specification. */
export const MATERIAL_SELECTION_GUIDES: MaterialSelectionGuide[] = [
  {
    slug: "geomembrane-liners",
    title: "Geomembrane Liners",
    description:
      "HDPE, LLDPE and other specified polymeric barriers for water, tailings, leach solutions and waste containment, with protection layers, anchorage and welded details coordinated as a system.",
    functions: ["Containment", "Seepage control", "Liner rehabilitation"],
    inputs: [
      "Liquid chemistry, temperature, exposure and required material approvals",
      "Lining geometry, hydraulic head, foundation movement and interface shear requirements",
      "Approved polymer, grade, thickness, surface finish and protection arrangement",
    ],
    installation:
      "Agree foundation acceptance, panel deployment, anchorage and penetration details before installation. Welding procedures, trial seams, weather controls and covering releases follow the approved method and inspection plan.",
    quality:
      "Review roll identification and material certificates, panel and seam records, applicable non-destructive tests, destructive seam tests, repair close-out and as-built information. Electrical leak location is included where specified and suitable for the liner configuration.",
    applications: [
      "tailings-storage-facility-lining",
      "heap-leach-pad-lining",
      "reservoir-dam-lining",
      "wastewater-treatment-pond-lining",
    ],
  },
  {
    slug: "geosynthetic-clay-liners-gcl",
    title: "Geosynthetic Clay Liners (GCL)",
    description:
      "Bentonite-based hydraulic barriers for engineered composite liners and selected waterproofing applications. Reinforcement, coating, confinement and liquid compatibility are specified for the duty.",
    functions: ["Hydraulic barrier", "Composite liners", "Engineered caps"],
    inputs: [
      "Liquid chemistry, hydration conditions and hydraulic performance requirements",
      "Slope geometry, confinement and internal and interface shear requirements",
      "GCL grade, coating, overlap, penetration and cover details",
    ],
    installation:
      "Protect rolls from premature hydration. Deploy against accepted foundations, maintain the specified overlaps, complete bentonite and termination details, and place the required cover within the approved construction sequence.",
    quality:
      "Retain batch references and product submittals, foundation acceptance, panel and overlap inspections, damage and repair records, exposure conditions and covering releases.",
    applications: [
      "landfill-ash-bund-lining",
      "landfill-capping-closure",
      "tailings-storage-facility-lining",
      "reservoir-dam-lining",
    ],
  },
  {
    slug: "geotextile-fabrics",
    title: "Geotextile Fabrics",
    description:
      "Woven and nonwoven fabrics for separation, soil filtration, liner protection and specified reinforcement duties. Selection starts with the required function and soil interaction, rather than fabric mass alone.",
    functions: ["Separation", "Filtration", "Protection", "Specified reinforcement"],
    inputs: [
      "Required function, soil grading, hydraulic gradient and drainage conditions",
      "Opening size, water flow and relevant retention and clogging requirements",
      "Installation survivability, puncture or tensile demands, exposure and overlaps",
    ],
    installation:
      "Prepare the receiving surface, deploy without damaging or contaminating the fabric, maintain the specified overlaps or sewn seams, and control aggregate placement, cover thickness and construction traffic.",
    quality:
      "Check the supplied grade and roll references against the specified mechanical and hydraulic properties. Record placement, overlaps, seams, damage repairs and cover acceptance.",
    applications: [
      "drainage-filtration-systems-africa",
      "roads-railways",
      "tailings-storage-facility-lining",
      "coastal-protection",
    ],
  },
  {
    slug: "geogrids-interlayers",
    title: "Geogrids & Interlayers",
    description:
      "Stabilisation grids, soil-reinforcement geogrids and asphalt interlayers serve different engineering functions. Specify the system for the ground, aggregate, loading and design method.",
    functions: ["Granular layer stabilisation", "Soil reinforcement", "Asphalt rehabilitation"],
    inputs: [
      "Subgrade condition, traffic or structural loading and the design objective",
      "Aggregate grading and layer arrangement, or reinforcement length and design life",
      "Relevant interaction, stiffness, long-term design strength or asphalt interlayer requirements",
    ],
    installation:
      "Confirm grid orientation, overlaps and facing connections where applicable. Control fill grading, placement and compaction; asphalt interlayers need a compatible prepared surface, bond treatment and paving sequence.",
    quality:
      "Verify the grid grade and specified performance data. Keep records of layer locations, overlaps or connections, fill acceptance, compaction and departures from the approved layout.",
    applications: [
      "stabilisation-reinforcement",
      "retaining-wall-systems",
      "mse-retaining-wall-geogrids",
      "roads-railways",
    ],
  },
  {
    slug: "erosion-control-geocells",
    title: "Erosion Control & Geocells",
    description:
      "Geocells, natural-fibre blankets and specified erosion-protection systems for exposed slopes, channels and rehabilitation works. Hydraulic duty, anchorage, infill and vegetation requirements govern selection.",
    functions: ["Surface erosion protection", "Cellular confinement", "Revegetation support"],
    inputs: [
      "Slope geometry, soil condition, runoff and any channel hydraulic design",
      "Required service duration, vegetation establishment and environmental conditions",
      "Cell or blanket grade, infill, anchorage and termination details",
    ],
    installation:
      "Prepare the slope or channel, complete anchor and crest details, deploy to the approved layout and secure contact with the underlying ground. Place infill, seed and vegetation treatment in the specified sequence.",
    quality:
      "Document product and batch references, prepared surfaces, anchorage, coverage and overlaps, infill and vegetation measures. Confirm any maintenance and establishment requirements at handover.",
    applications: [
      "slope-erosion-protection",
      "stabilisation-reinforcement",
      "irrigation-canal-lining",
      "coastal-protection",
    ],
  },
  {
    slug: "pipes-drainage-ducting",
    title: "Pipes, Drainage & Ducting",
    description:
      "Collector pipes, drainage composites, filter interfaces and protective ducting for civil and environmental works. Conveyance, drainage and cable protection each require their own selection criteria.",
    functions: ["Subsoil drainage", "Leak collection", "Drainage composites", "Cable protection"],
    inputs: [
      "Required flow or cable arrangement, routing, outlet levels and access",
      "Burial depth, structural loading, soil grading and surrounding filter design",
      "Diameter, stiffness, slot or perforation arrangement, joint and core performance",
    ],
    installation:
      "Set out line and level, prepare bedding or supporting surfaces, protect filter continuity and complete joints and outlets. Control backfill and compaction; inspect duct routes and access points before closing trenches.",
    quality:
      "Verify product identification and geometry, slot or core configuration, filter details, joint inspections and the specified flow or continuity checks. Record buried routes, levels and outlets for handover.",
    applications: [
      "drainage-filtration-systems-africa",
      "green-roof-podium-drainage",
      "landfill-ash-bund-lining",
      "roads-railways",
    ],
  },
  {
    slug: "gabion-baskets",
    title: "Gabion Baskets & Mattresses",
    description:
      "Wire-mesh baskets and mattresses for designed retaining, channel and scour-protection structures, coordinated with foundations, rock fill, connections and filter layers.",
    functions: ["Retaining structures", "Channel protection", "Scour protection"],
    inputs: [
      "Structure geometry, foundation conditions and hydraulic or retaining design",
      "Specified mesh type, aperture, wire diameter, coating and corrosion exposure",
      "Rock grading, filter arrangement, connections and construction access",
    ],
    installation:
      "Prepare foundations and filters, assemble and brace the specified units, connect adjacent baskets and place suitable rock with controlled facing and internal packing. Complete lids and connections before the next construction stage.",
    quality:
      "Inspect unit dimensions and supplied mesh and coating data. Record foundation acceptance, filters, connections, bracing, rock quality, packing and final geometry.",
    applications: [
      "retaining-wall-systems",
      "coastal-protection",
      "slope-erosion-protection",
      "irrigation-canal-lining",
    ],
  },
  {
    slug: "permeable-paving-systems",
    title: "Permeable Paving Systems",
    description:
      "Cellular and geosynthetic interfaces for specified grass, gravel and permeable surfaced areas. The complete pavement and drainage design determines traffic capacity and water management.",
    functions: ["Gravel retention", "Grass paving", "Permeable surfaced areas"],
    inputs: [
      "Vehicle loads, turning movements, frequency and surface use",
      "Subgrade condition, pavement build-up, infiltration and discharge design",
      "Cell or paving grade, edge restraint, infill and maintenance arrangement",
    ],
    installation:
      "Prepare the designed pavement layers and drainage interfaces, install edge restraints and cellular units, and complete the specified infill or vegetation. Release traffic only after the required construction and establishment stages.",
    quality:
      "Confirm the supplied grade, subgrade and layer acceptance, joint and edge details, infill and drainage continuity. Handover includes the specified maintenance and traffic-use conditions.",
    applications: [
      "stabilisation-reinforcement",
      "roads-railways",
      "stormwater-attenuation-storage-lining",
    ],
  },
  {
    slug: "dewatering-systems",
    title: "Dewatering Bags & Tubes",
    description:
      "Slit-film, monofilament and composite geotextile containment articles for sludge and sediment dewatering. Fabric retention, drainage, seam capacity and filling behaviour must be matched to the feed.",
    functions: ["Sludge dewatering", "Dredged sediment management", "Solids retention"],
    inputs: [
      "Feed solids, particle distribution, chemistry and the required filtrate quality",
      "Trial results, flocculation programme, pumping duty and filling arrangement",
      "Available footprint, contained drainage platform, article geometry and removal plan",
    ],
    installation:
      "Prepare the contained platform and filtrate collection, inspect fabricated units and connections, and agree the filling procedure. Monitor filling, drainage and deformation; handling or lifting requires the specified arrangement and approval.",
    quality:
      "Define feed sampling and dewatering trials, fabric and fabrication records, seam inspections and filling records. Lifting components require the specified ratings and supporting evidence; a dewatering article is not automatically a lifting bag.",
    applications: [
      "sludge-dewatering",
      "wastewater-treatment-pond-lining",
      "sediment-control-silt-curtains-fences",
    ],
  },
  {
    slug: "geosynthetic-sand-containers",
    title: "Geosynthetic Sand Containers",
    description:
      "Fabricated woven, nonwoven and composite sand containers for engineered coastal and river works. Fabric, seams, fill, abrasion exposure and placement method form one designed containment system.",
    functions: ["Shoreline protection", "Riverbank protection", "Scour interfaces"],
    inputs: [
      "Wave or current conditions, exposure, design geometry and foundation or filter details",
      "Sand properties, required fill volume and the approved placement method",
      "Fabric mechanical and hydraulic properties, seam performance and handling provisions",
    ],
    installation:
      "Prepare the designed foundation and filter, fill to the approved procedure and inspect closures and handling details. Position containers to the engineered layout, controlling abrasion, damage and interfaces with adjacent units.",
    quality:
      "Retain fabric identification, fabrication and seam inspection records, dimensions and filling checks. Verify any specified lifting system separately and record placement, damage repairs and the completed layout.",
    applications: [
      "coastal-protection",
      "slope-erosion-protection",
      "sediment-control-silt-curtains-fences",
    ],
  },
  {
    slug: "waterproofing-concrete-protection",
    title: "Waterproofing & Concrete Protection",
    description:
      "Anchored thermoplastic concrete protection, welded details and specified waterproofing interfaces for tanks, channels and buried structures. Corrosion protection and erosion-control linings are separate system duties.",
    functions: ["Concrete corrosion protection", "Tank lining", "Waterproofing interfaces"],
    inputs: [
      "Substrate, chemical and temperature exposure, liquid head and service conditions",
      "Anchor or fixing design, joints, terminations, penetrations and access details",
      "Specified liner grade, welding or joining method and continuity test requirements",
    ],
    installation:
      "Coordinate liner anchorage and concrete placement or substrate preparation with the structural works. Complete welds, terminations and penetrations using the approved procedure, with access for the required inspections.",
    quality:
      "Review product and batch records, anchor and joint details, weld qualification and inspection records, applicable continuity tests and repairs. Keep concrete protective liner tests distinct from GCCM hydration and curing inspections.",
    applications: [
      "concrete-protection-lining",
      "wastewater-treatment-pond-lining",
      "irrigation-canal-lining",
      "green-roof-podium-drainage",
    ],
  },
];

export function materialGuideFor(slug?: string): MaterialSelectionGuide | undefined {
  const family = findProductFamily(slug);
  return MATERIAL_SELECTION_GUIDES.find((guide) => guide.slug === (family?.slug || slug));
}

const APPLICATION_ALIASES: Record<string, string> = {
  "mining-systems": "tailings-storage-facility-lining",
  "water-containment": "reservoir-dam-lining",
  "waste-landfills": "landfill-ash-bund-lining",
  "roads-infrastructure": "roads-railways",
  "erosion-control": "slope-erosion-protection",
  "drainage-systems": "drainage-filtration-systems-africa",
  "agriculture-aquaculture": "agricultural-aquaculture-pond-lining",
};

export function applicationPath(slug?: string, label?: string): string {
  const requested = (slug || "").replace(/^\/applications\//, "").replace(/\/$/, "");
  const canonical = APPLICATION_ALIASES[requested] || requested;
  const found =
    APPLICATION_DIRECTORY.find((app) => app.slug === canonical) ||
    APPLICATION_DIRECTORY.find((app) => app.label.toLowerCase() === label?.toLowerCase());
  return found ? `/applications/${found.slug}` : "/applications";
}
