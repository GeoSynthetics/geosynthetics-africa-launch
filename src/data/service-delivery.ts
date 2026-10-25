export interface ServiceDeliveryProfile {
  title: string;
  summary: string;
  scope: string;
  inputs: string[];
  controls: string[];
  records: string[];
  why: string;
  applications: string[];
}

export const SERVICE_DELIVERY_PROFILES: Record<string, ServiceDeliveryProfile> = {
  "geomembrane-liner-installation-africa": {
    title: "Geomembrane Liner Installation Across Africa",
    summary:
      "HDPE and other specified geomembrane installation for mining, water and waste containment. Geosynthetics Africa coordinates material supply, panel deployment, welding, installation QC and documented handover around your approved design.",
    scope:
      "Choose installation services or an integrated material supply and installation package. We review the liner configuration, construction sequence, access and inspection requirements before agreeing the site scope. The appointed designer's barrier design and the project's CQA responsibilities remain clearly identified.",
    inputs: [
      "Site location, liner area, drawings and construction programme",
      "Polymer, grade, thickness, surface finish and protection requirements",
      "Foundation acceptance criteria, anchorage, sumps and penetration details",
      "Inspection plan, seam-test requirements and handover deliverables",
    ],
    controls: [
      "Accept foundations and drainage interfaces before deploying panels.",
      "Record roll and panel identities, layout and weather conditions.",
      "Qualify welding with trial seams and control fusion and extrusion work to the approved method.",
      "Complete the specified seam tests, repairs, retests and covering releases.",
    ],
    records: [
      "Material submittals, roll references and foundation hold-point records",
      "Panel, weld, welder and equipment traceability",
      "Applicable non-destructive and destructive seam-test results",
      "Repair close-out, specified leak surveys and as-built handover dossier",
    ],
    why: "Connect the supplied membrane, installation crews and seam-control records in one coordinated scope, with Group IAGI Installer Membership and trained welding technicians supporting the installation capability.",
    applications: [
      "tailings-storage-facility-lining",
      "heap-leach-pad-lining",
      "reservoir-dam-lining",
      "landfill-ash-bund-lining",
    ],
  },
  "gcl-installation-contractor-africa": {
    title: "GCL Liner Installation & QA/QC Across Africa",
    summary:
      "Eurobent geosynthetic clay liner supply, deployment and installation controls for engineered containment and waterproofing. We coordinate foundations, overlaps, terminations, protection and covering records for the agreed project scope.",
    scope:
      "A GCL installation is coordinated with the complete barrier design. We review the grade, liquid compatibility, slope and confinement requirements, roll layout and cover sequence before mobilisation. The applicable manufacturer guidance and approved drawings govern overlap and detail work.",
    inputs: [
      "Approved GCL grade, coating and compatibility requirements",
      "Foundation, slope, anchorage, overlap and penetration details",
      "Hydration protection, cover layers and construction sequence",
      "Roll quantities, handling access and inspection hold points",
    ],
    controls: [
      "Store and handle rolls to protect the material from damage and premature hydration.",
      "Accept the receiving foundation and deploy panels to the agreed layout.",
      "Inspect the specified overlaps, bentonite additions, penetrations and repairs.",
      "Protect the deployed GCL and complete the approved cover and confinement sequence.",
    ],
    records: [
      "Product submittals and roll or batch references",
      "Foundation and panel-deployment inspections",
      "Overlap, detail and repair records",
      "Exposure conditions, covering releases and as-built information",
    ],
    why: "Coordinate the GCL supply with the practical overlap, hydration-protection and covering controls that determine installation quality, rather than treating bentonite liner deployment as ordinary roll placement.",
    applications: [
      "tailings-storage-facility-lining",
      "landfill-ash-bund-lining",
      "landfill-capping-closure",
      "reservoir-dam-lining",
    ],
  },
  "floating-cover-installation-africa": {
    title: "Floating Cover Fabrication & Installation Across Africa",
    summary:
      "Project-specific membrane covers for water and process storage. Geosynthetics Africa coordinates material selection, fabrication, floats, ballast, rainwater management, anchorage and installation around the specified operating duty.",
    scope:
      "The cover configuration depends on liquid chemistry, water-level movement, geometry, wind, access and the required cover function. Potable-water approvals, any gas-management duty, design life and warranty terms are confirmed for the selected material and complete system; they are not universal cover properties.",
    inputs: [
      "Storage geometry, operating levels and liquid chemistry",
      "Cover function, exposure, applicable approvals and design requirements",
      "Floats, ballast, sumps, rainwater removal and access details",
      "Perimeter anchorage, penetrations, installation and operating procedures",
    ],
    controls: [
      "Review material and fabrication details against the approved cover configuration.",
      "Inspect fabricated panels, welded details, floats and ballast components.",
      "Coordinate deployment, anchorage and penetrations with safe access and the operating facility.",
      "Inspect the completed arrangement and the specified rainwater, access and operating functions.",
    ],
    records: [
      "Approved cover material and component references",
      "Fabrication, weld qualification and applicable seam-test records",
      "Anchorage, sump, float, ballast and penetration inspections",
      "Repairs, as-built layout, operating guidance and agreed warranty documentation",
    ],
    why: "Bring fabricated cover components and site installation into the same delivery plan, with inspection records connected to the actual cover geometry and operating conditions.",
    applications: [
      "floating-covers-evaporation-control",
      "reservoir-dam-lining",
      "process-water-pollution-control-dam-lining",
      "wastewater-treatment-pond-lining",
    ],
  },
  "gabion-installation-contractor-africa": {
    title: "Gabion Basket & Mattress Installation Across Africa",
    summary:
      "Assembly and installation of specified gabion baskets and mattresses for retaining, channel and scour-protection works. Our scope coordinates units, foundations, filter layers, connections, rock fill and final geometry.",
    scope:
      "We review the approved structure, mesh and coating, rock source, filter arrangement and site access before agreeing the supply and installation package. Welded and woven systems have different assembly details; the supplied system and its approved installation method govern the work.",
    inputs: [
      "Retaining or hydraulic design, structure geometry and foundation details",
      "Mesh type, wire and coating specification, unit sizes and connections",
      "Rock grading, durability and appearance requirements",
      "Filter layers, drainage, access and construction sequence",
    ],
    controls: [
      "Accept foundations and complete the specified filter and drainage interfaces.",
      "Assemble, position, connect and brace units to the approved arrangement.",
      "Place and pack suitable rock while maintaining unit shape and facing quality.",
      "Close lids, inspect connections and verify completed dimensions and alignment.",
    ],
    records: [
      "Supplied mesh, coating and unit references",
      "Foundation, filter and drainage acceptance",
      "Connections, bracing, rock-fill and packing inspections",
      "Completed geometry, repairs and handover information",
    ],
    why: "Coordinate the basket system with the filter, rock and construction details that make it a functioning engineered structure, with fabrication and installation responsibilities defined at quotation.",
    applications: [
      "retaining-wall-systems",
      "coastal-protection",
      "slope-erosion-protection",
      "irrigation-canal-lining",
    ],
  },
  "geocell-installation-contractor-africa": {
    title: "Geocell Installation Across Africa",
    summary:
      "HDPE and woven geocell supply and installation for designed confinement, load-support and erosion-protection systems. We coordinate the selected cell, foundation, expansion, anchorage and infill with the project requirements.",
    scope:
      "Geocell selection and any pavement or aggregate optimisation depend on the ground, loading, geometry, infill and accepted design method. We agree the installation scope against the approved cell layout and construction details; material savings are assessed for the project rather than promised as a standard percentage.",
    inputs: [
      "Application, ground conditions, geometry and loading or hydraulic design",
      "Specified cell type, depth, connections and deployment dimensions",
      "Separation or filter layers, anchorage and edge details",
      "Infill grading, placement, compaction and construction access",
    ],
    controls: [
      "Prepare and accept the foundation and underlying filter or separator.",
      "Expand cells to the specified dimensions and complete connections and restraints.",
      "Install the approved anchorage and transitions before placing infill.",
      "Control infill placement and compaction without damaging or distorting the cells.",
    ],
    records: [
      "Cell product and batch identification",
      "Foundation, expansion and connection inspections",
      "Anchorage, infill and compaction records",
      "Completed coverage, repairs and as-built details",
    ],
    why: "Connect geocell supply with controlled expansion, anchorage and infill placement, keeping the construction method aligned with the intended ground or erosion-control function.",
    applications: [
      "stabilisation-reinforcement",
      "slope-erosion-protection",
      "roads-railways",
      "irrigation-canal-lining",
    ],
  },
  "gccm-channel-lining-contractor-africa": {
    title: "GCCM Channel Lining Installation Across Africa",
    summary:
      "Tiltex cementitious composite mat installation for specified channel and erosion-protection works. Geosynthetics Africa coordinates substrate preparation, deployment, joints, anchorage, hydration and inspection to the approved lining method.",
    scope:
      "Channel geometry, flow, foundation conditions and the specified GCCM grade establish the installation requirements. The lining is coordinated with inlet, outlet, edge and transition details. Hydration, curing and release to service follow the current manufacturer guidance and approved project method.",
    inputs: [
      "Channel geometry, hydraulic duty, foundation and drainage details",
      "Specified GCCM grade and exposure or durability requirements",
      "Joint, anchorage, termination and transition details",
      "Water supply, weather, access and construction sequence",
    ],
    controls: [
      "Prepare the channel and remove defects that could prevent proper lining support.",
      "Deploy to the approved orientation and form the specified joints and anchorage.",
      "Hydrate and protect the installed material in accordance with the approved method.",
      "Inspect transitions and completed lining before the required curing and service-release stages.",
    ],
    records: [
      "Material grade and batch references",
      "Foundation and joint inspections",
      "Hydration, curing and exposure records",
      "Repairs, completed layout and service-release documentation",
    ],
    why: "Coordinate material supply with the substrate, joint and hydration controls needed for GCCM work, keeping these inspections distinct from thermoplastic geomembrane welding tests.",
    applications: [
      "irrigation-canal-lining",
      "slope-erosion-protection",
      "process-water-pollution-control-dam-lining",
    ],
  },
  "manufacturing-fabrication": {
    title: "Geosynthetics Manufacturing & Custom Fabrication",
    summary:
      "In-house manufacture and fabrication of sewn geotextile, welded geomembrane and welded mesh systems for African projects. Specify dewatering bags and tubes, sand containers, sediment barriers, liner panels, floating covers and custom details.",
    scope:
      "Production starts with the duty, dimensions, material requirements and approved fabrication details. We coordinate fabric or membrane selection, cutting, joining, closures, ports, handling features and inspection records for the ordered article. Raw-material manufacture and article fabrication are identified separately in the technical submission.",
    inputs: [
      "Application, operating duty, drawings, quantities and dimensions",
      "Required fabric, membrane or mesh properties and exposure conditions",
      "Seams, welds, closures, ports and any lifting or handling provisions",
      "Inspection requirements, packaging, delivery and acceptance criteria",
    ],
    controls: [
      "Approve materials and fabrication details before releasing production.",
      "Maintain material identification through cutting, stitching, welding and assembly.",
      "Inspect dimensions, seams, welds, closures and project-specific fittings.",
      "Complete the specified tests, repairs, packing and dispatch identification.",
    ],
    records: [
      "Material and production-batch traceability",
      "Dimensional, sewing, welding and assembly inspections",
      "Specified seam tests and separately verified lifting-system evidence",
      "Inspection release, repairs, packing list and product identification",
    ],
    why: "Work directly with the team defining and producing the fabricated article, with material selection, joining details and delivery requirements coordinated before production rather than left to site improvisation.",
    applications: [
      "sludge-dewatering",
      "coastal-protection",
      "sediment-control-silt-curtains-fences",
      "floating-covers-evaporation-control",
    ],
  },
  "sand-container-installation": {
    title: "Geosynthetic Sand Container Installation Across Africa",
    summary:
      "Supply, fabrication and placement support for woven, nonwoven and composite geotextile sand containers. We coordinate filling, handling and placement with the engineered coastal, riverbank or scour-protection layout.",
    scope:
      "The design establishes container geometry, fabric and seam requirements, fill, foundation, filters and stability under the intended exposure. We agree the fabricated article and site scope against those requirements, including any separately specified handling or lifting arrangement.",
    inputs: [
      "Coastal or hydraulic design, geometry, exposure and site access",
      "Fabric, seam, closure and container-dimension requirements",
      "Sand properties, fill procedure and filling equipment",
      "Foundation, filter, handling and placement details",
    ],
    controls: [
      "Accept the foundation and specified filter layers before placement.",
      "Inspect the container, filling ports, seams and approved handling provisions.",
      "Fill and close the article to the approved procedure while monitoring its shape and condition.",
      "Place to the engineered layout and inspect damage, interfaces and completed geometry.",
    ],
    records: [
      "Fabric and fabrication references",
      "Seam, dimensional and closure inspections",
      "Fill and separately specified lifting or handling records",
      "Placement, repairs and final layout documentation",
    ],
    why: "Connect container fabrication to the practical filling and placement method, with seam inspections and handling provisions reviewed for the actual article and site conditions.",
    applications: ["coastal-protection", "slope-erosion-protection"],
  },
  "silt-curtain-deployment": {
    title: "Silt Curtain & Turbidity Barrier Deployment Across Africa",
    summary:
      "Fabricated silt curtains and deployment support for suitable dredging, bridge, port and construction works. We review current, depth, water-level movement, anchorage and operating access before defining the barrier and site scope.",
    scope:
      "A curtain is one part of the project's sediment-management plan. Configuration, flotation, skirt, ballast, joints, anchors and maintenance access are selected for the actual water conditions. A curtain does not guarantee a fixed turbidity reduction or suit every current, wave or debris environment.",
    inputs: [
      "Water depth, current, tide or water-level range and wave exposure",
      "Sediment characteristics, work method, debris and navigation constraints",
      "Curtain alignment, skirt, flotation, ballast, anchorage and joint details",
      "Deployment access, monitoring, maintenance and removal requirements",
    ],
    controls: [
      "Review the barrier layout and conditions before deployment.",
      "Inspect fabricated sections, floats, ballast, connections and anchorage components.",
      "Deploy and connect sections using the agreed access and anchoring method.",
      "Inspect condition, maintain the barrier and coordinate monitoring and removal with the project team.",
    ],
    records: [
      "Fabrication and component identification",
      "Joint, skirt, flotation and ballast inspections",
      "Anchor and deployment layout records",
      "Inspection, maintenance, repairs and removal handover information",
    ],
    why: "Bring fabrication and deployment into one practical plan, with the barrier geometry and anchorage reviewed against the site rather than selected by class designation alone.",
    applications: [
      "sediment-control-silt-curtains-fences",
      "coastal-protection",
      "sludge-dewatering",
    ],
  },
  "concrete-lining-protection": {
    title: "Concrete Protection Liner & GCCM Installation Across Africa",
    summary:
      "Installation of specified thermoplastic concrete protective liners and cementitious composite linings. We distinguish chemical and corrosion protection from channel erosion control, with the appropriate preparation, joining and inspection procedure for each system.",
    scope:
      "GSE Studliner concrete protective liner work is coordinated with anchorage, concrete placement, welds and penetrations. Tiltex GCCM work follows its own foundation, joint, hydration and curing controls. The project duty determines the material and inspection method; the two systems are not interchangeable.",
    inputs: [
      "Structure or channel geometry, substrate and operating duty",
      "Chemical and temperature exposure or hydraulic erosion design",
      "Liner grade, anchorage, joints, penetrations and termination details",
      "Specified welding or hydration procedure, tests and acceptance records",
    ],
    controls: [
      "Approve the substrate, anchor and transition details for the selected lining system.",
      "Install thermoplastic liner and complete qualified welds and accessible detail work where applicable.",
      "Deploy and hydrate GCCM using the approved joint, anchorage and curing method where applicable.",
      "Inspect the relevant lining, close out repairs and release it to the specified service sequence.",
    ],
    records: [
      "Material, batch and component references",
      "Substrate, anchor, joint and penetration inspections",
      "Applicable weld and continuity tests or GCCM hydration and curing records",
      "Repair close-out and system-specific as-built handover information",
    ],
    why: "Coordinate material and installation requirements with the actual protection duty, maintaining a clear distinction between thermoplastic corrosion barriers and cementitious erosion-control linings.",
    applications: [
      "concrete-protection-lining",
      "wastewater-treatment-pond-lining",
      "irrigation-canal-lining",
      "slope-erosion-protection",
    ],
  },
  "bioengineering-revegetation": {
    title: "Erosion Blankets, Bioengineering & Revegetation Across Africa",
    summary:
      "Supply and installation of specified natural-fibre erosion blankets and revegetation interfaces for mine rehabilitation, slopes, embankments and channel banks. SoilLock jute, coir, straw and wood-wool systems are matched to the intended establishment duty.",
    scope:
      "Blanket selection depends on slope and runoff conditions, required service duration, soil preparation and the vegetation programme. We coordinate the geosynthetic installation scope with the appointed environmental or rehabilitation team's seed, soil, watering and maintenance requirements.",
    inputs: [
      "Slope geometry, soil condition, runoff and any hydraulic design",
      "Specified blanket type, durability and vegetation objectives",
      "Soil preparation, seed or planting, anchorage and termination details",
      "Watering, inspection, maintenance and establishment responsibilities",
    ],
    controls: [
      "Prepare the soil surface and complete the specified seed or planting stage.",
      "Deploy blankets in contact with the ground to the approved orientation and overlaps.",
      "Complete crest trenches, pins, joints and edge details using the specified arrangement.",
      "Inspect after installation and coordinate the agreed vegetation-establishment and maintenance programme.",
    ],
    records: [
      "Blanket type, material and batch references",
      "Surface preparation, seed or planting and anchorage inspections",
      "Coverage, overlap, damage and repair records",
      "Handover of inspection and maintenance responsibilities",
    ],
    why: "Coordinate blanket supply and deployment with the soil, vegetation and anchorage interfaces that support rehabilitation, with establishment responsibilities clearly identified before site work.",
    applications: ["slope-erosion-protection", "coastal-protection", "roads-railways"],
  },
  "delivery-logistics-africa": {
    title: "Geosynthetics Delivery & Cross-Border Logistics Across Africa",
    summary:
      "Material scheduling, packing and freight coordination for African geosynthetics projects. We plan road, ocean or agreed multimodal delivery around the product, destination, site access and construction programme.",
    scope:
      "We define the dispatch origin, delivery term, transport route, unloading responsibilities and required documents in the proposal. Stock, lead time, port entry, customs arrangements and crew mobilisation are confirmed for the actual consignment. Country coverage does not mean every grade is stocked in every destination.",
    inputs: [
      "Product grades, dimensions, roll or article quantities and required date",
      "Site destination, nearest port or town and access or unloading constraints",
      "Agreed delivery term and division of freight and import responsibilities",
      "Packing, identification, documentation and any special handling requirements",
    ],
    controls: [
      "Coordinate the material schedule and confirmed availability with the construction programme.",
      "Plan packing, loading and restraints to protect the supplied goods.",
      "Prepare consignment references and coordinate documents with the appointed freight and clearing parties.",
      "Track the agreed shipment milestones and confirm delivery and receipt information.",
    ],
    records: [
      "Product and roll or article identification linked to the packing list",
      "Dispatch, loading and consignment records",
      "Agreed freight and customs-support documentation",
      "Delivery receipt, discrepancy records and project handover references",
    ],
    why: "Keep procurement, roll schedules and freight planning connected, with one team coordinating material and delivery information for a clearly defined African project destination.",
    applications: [
      "tailings-storage-facility-lining",
      "reservoir-dam-lining",
      "roads-railways",
      "sludge-dewatering",
    ],
  },
};

export function serviceDeliveryFor(slug: string, label: string): ServiceDeliveryProfile {
  return (
    SERVICE_DELIVERY_PROFILES[slug] || {
      title: label,
      summary: `Geosynthetics Africa coordinates ${label.toLowerCase()} for African projects, with material, delivery, installation and inspection responsibilities defined for the agreed scope.`,
      scope:
        "Send your drawings, specification, quantities, destination and required date. Our team will review the duty, clarify responsibilities and prepare a project-specific proposal.",
      inputs: [
        "Application, project location and programme",
        "Drawings, quantities and material specification",
        "Site access and agreed delivery or installation scope",
        "Inspection requirements and handover records",
      ],
      controls: [
        "Review the agreed drawings and scope before procurement or mobilisation.",
        "Identify materials and coordinate the approved installation or delivery sequence.",
        "Complete the relevant inspections and close out deviations and repairs.",
        "Compile the agreed records for project handover.",
      ],
      records: [
        "Approved material and scope references",
        "Relevant delivery and installation inspections",
        "Applicable test and repair records",
        "Agreed handover documentation",
      ],
      why: "Coordinate technical selection, supply, fabrication where applicable, delivery and agreed site work with defined inspection and handover responsibilities.",
      applications: [],
    }
  );
}
