export interface IndustryDeliveryGuide {
  summary: string;
  inputs: string[];
  applications: string[];
  quality: string;
}

export const INDUSTRY_DELIVERY_GUIDES: Record<string, IndustryDeliveryGuide> = {
  "mining-minerals-processing": {
    summary:
      "Containment for tailings, leach and process-water facilities, ground stabilisation for haul roads and platforms, and erosion and sediment management for African mines. Geosynthetics Africa connects the material package with fabrication, site delivery and agreed installation QA/QC.",
    inputs: [
      "Tailings or process-liquid chemistry, temperatures and operating conditions",
      "Barrier design, foundations, liner protection, drainage and construction sequence",
      "Haul-road loading, rehabilitation interfaces and the mine's inspection and handover plan",
    ],
    applications: [
      "tailings-storage-facility-lining",
      "heap-leach-pad-lining",
      "process-water-pollution-control-dam-lining",
      "stabilisation-reinforcement",
    ],
    quality:
      "Coordinate roll and panel traceability, foundation releases, welding and seam tests for barriers, with separate installation controls for reinforcement, drainage and erosion protection. Inspection responsibilities and independent CQA interfaces are established for the mining package.",
  },
  "water-utilities-irrigation": {
    summary:
      "Lining, cover and drainage systems for reservoirs, dams, canals and water infrastructure across Africa. We coordinate specified geomembranes, GCLs, protective geotextiles, fabricated details and installation records for new works and rehabilitation.",
    inputs: [
      "Water duty, operating levels, chemistry and any potable-water approval requirements",
      "Storage or canal geometry, foundations, structures, penetrations and liner protection",
      "Outage programme, access, filling sequence and inspection or commissioning requirements",
    ],
    applications: [
      "reservoir-dam-lining",
      "irrigation-canal-lining",
      "floating-covers-evaporation-control",
      "wastewater-treatment-pond-lining",
    ],
    quality:
      "Confirm the supplied material and relevant approvals, foundation and detail inspections, applicable seam tests, repairs and the approved release to filling or service. Cover systems also need their own anchorage, drainage and operating checks.",
  },
  "waste-management-landfills": {
    summary:
      "Composite barriers, leachate drainage, protection layers and engineered caps for African waste and ash facilities. Geosynthetics Africa coordinates the material and installation package against the approved cell or closure design.",
    inputs: [
      "Waste and leachate characteristics, temperature and the approved barrier specification",
      "Cell geometry, foundations, protection layers, leachate drainage and collection details",
      "Phased construction, covering restrictions, closure interfaces and the project CQA plan",
    ],
    applications: [
      "landfill-ash-bund-lining",
      "landfill-capping-closure",
      "drainage-filtration-systems-africa",
      "sludge-dewatering",
    ],
    quality:
      "Keep material identification, GCL overlap and hydration protection, geomembrane seam tests and drainage inspections connected to the cell layout. Record covering releases, repairs and the specified leak-location work before accepting each construction stage.",
  },
  "transport-infrastructure": {
    summary:
      "Geogrids, separators, interlayers, drainage and reinforced-soil systems for roads, railways and civil infrastructure. We distinguish ground stabilisation, structural reinforcement and asphalt rehabilitation so the supplied material matches its intended engineering function.",
    inputs: [
      "Subgrade, traffic or structural loading, geometry and the accepted design method",
      "Aggregate, pavement and drainage arrangement or reinforced-soil connection details",
      "Construction traffic, compaction requirements, programme and acceptance records",
    ],
    applications: [
      "roads-railways",
      "stabilisation-reinforcement",
      "retaining-wall-systems",
      "soft-ground-consolidation-vertical-drains",
    ],
    quality:
      "Confirm the relevant grid or fabric performance and grade, then inspect layout, overlaps or connections, fill and compaction, and drainage continuity. Reinforcement records must remain tied to the approved layer locations and construction details.",
  },
  "agriculture-aquaculture": {
    summary:
      "Reservoir, canal and pond lining, floating covers and related water-management materials for African farms and aquaculture projects. Supply and installation are coordinated around the water duty, operating conditions, site access and required production programme.",
    inputs: [
      "Water quality, pond or reservoir duty and any aquaculture or potable-water requirements",
      "Geometry, ground conditions, inlet and outlet details and the specified liner grade",
      "Storage, pumping, maintenance access, installation and filling programme",
    ],
    applications: [
      "agricultural-aquaculture-pond-lining",
      "reservoir-dam-lining",
      "irrigation-canal-lining",
      "floating-covers-evaporation-control",
    ],
    quality:
      "Check supplied materials, foundations, liner and penetration details, applicable weld tests and repairs. Handover identifies the agreed filling, operating and maintenance requirements for the selected system.",
  },
  "energy-power-generation": {
    summary:
      "Ash and process-water containment, drainage, sludge dewatering and ground-management materials for African energy infrastructure. We coordinate the selected geosynthetic system with operating exposure, site logistics and the construction programme.",
    inputs: [
      "Ash, process-liquid or sludge characteristics and operating temperatures",
      "Containment, drainage, access-road or surface-management design and interfaces",
      "Facility operating constraints, staged delivery and inspection requirements",
    ],
    applications: [
      "landfill-ash-bund-lining",
      "process-water-pollution-control-dam-lining",
      "sludge-dewatering",
      "stabilisation-reinforcement",
    ],
    quality:
      "Use the applicable material and installation inspections for each system: barrier seam control, drainage continuity, dewatering fabrication and trials, or ground-layer acceptance. The handover package identifies the supplied grades and work undertaken.",
  },
  "oil-gas-petrochemical": {
    summary:
      "Specified secondary containment, process-water lining, drainage and sediment-control systems for African oil, gas and petrochemical projects. Material selection and installation methods are coordinated with the liquid exposure, facility requirements and approved containment design.",
    inputs: [
      "Liquid composition, concentration, temperature, exposure and compatibility evidence",
      "Containment geometry, structures, foundations, anchorage and penetration details",
      "Facility safety and access requirements, construction sequence and inspection plan",
    ],
    applications: [
      "landfill-ash-bund-lining",
      "process-water-pollution-control-dam-lining",
      "concrete-protection-lining",
      "sediment-control-silt-curtains-fences",
    ],
    quality:
      "Confirm grade-specific compatibility and supplied product documentation, then record the relevant foundations, joints, welds, penetrations, tests and repairs. The approved design and project inspection plan determine acceptance and release to operation.",
  },
  "environmental-remediation": {
    summary:
      "Geosynthetic containment and caps, sediment and sludge management, erosion blankets and rehabilitation interfaces for African environmental works. We connect the specified materials and fabricated articles with practical installation controls and documented handover.",
    inputs: [
      "Contaminant or sediment characteristics and the remediation or rehabilitation objectives",
      "Barrier, drainage, dewatering or erosion-control design and site constraints",
      "Feed trials where relevant, monitoring responsibilities, removal and maintenance requirements",
    ],
    applications: [
      "landfill-capping-closure",
      "sludge-dewatering",
      "sediment-control-silt-curtains-fences",
      "slope-erosion-protection",
    ],
    quality:
      "Coordinate material and fabrication records with the relevant lining, filling, filtration or erosion-control inspections. Monitoring, waste handling, vegetation establishment and any environmental acceptance responsibilities are identified with the project team.",
  },
};
