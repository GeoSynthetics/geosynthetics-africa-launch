export interface IndustryDeliveryGuide {
  summary: string;
  inputs: string[];
  applications: string[];
  quality: string;
}

export const INDUSTRY_DELIVERY_GUIDES: Record<string, IndustryDeliveryGuide> = {
  "mining-minerals-processing": {
    summary:
      "Containment for tailings, leach and process-water facilities, ground stabilisation for haul roads and platforms, and erosion and sediment management for African mines. We supply, fabricate, deliver and install the complete package with our own QA/QC.",
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
      "We keep roll and panel traceability, release foundations, weld and test every barrier seam, and apply separate installation controls for reinforcement, drainage and erosion protection. We work alongside any independent CQA the mine appoints.",
  },
  "water-utilities-irrigation": {
    summary:
      "Lining, cover and drainage systems for reservoirs, dams, canals and water infrastructure across Africa. We supply and install geomembranes, GCLs, protection geotextiles and fabricated details, with full installation records, for new works and rehabilitation.",
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
      "We confirm material approvals, inspect foundations and details, test every seam, close out repairs and release each structure to filling or service. On covers we also check anchorage, drainage and operation.",
  },
  "waste-management-landfills": {
    summary:
      "Composite barriers, leachate drainage, protection layers and engineered caps for African waste and ash facilities. We supply and install the complete barrier and drainage package to the approved cell or closure design.",
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
      "We tie material identification, GCL overlaps and hydration protection, geomembrane seam tests and drainage inspections to the cell layout, and record covering releases, repairs and specified leak-location surveys before each stage is accepted.",
  },
  "transport-infrastructure": {
    summary:
      "Geogrids, separators, interlayers, drainage and reinforced-soil systems for roads, railways and civil infrastructure. We match each product to its function: ground stabilisation, structural reinforcement or asphalt rehabilitation.",
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
      "We confirm grid or fabric grade and performance, then inspect layout, overlaps or connections, fill and compaction, and drainage continuity, with reinforcement records tied to every approved layer.",
  },
  "agriculture-aquaculture": {
    summary:
      "Reservoir, canal and pond lining, floating covers and related water-management materials for African farms and aquaculture projects. We supply and install around your water duty, site access and production programme.",
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
      "We check materials, foundations, liner and penetration details, test every weld and close out repairs, and hand over filling, operating and maintenance guidance for the system we installed.",
  },
  "energy-power-generation": {
    summary:
      "Ash and process-water containment, drainage, sludge dewatering and ground-management materials for African energy infrastructure. We select, supply and install each system for its operating exposure, around your site logistics and construction programme.",
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
      "We apply the right inspections to each system: barrier seam control, drainage continuity, dewatering fabrication and trials, or ground-layer acceptance, and our handover package lists every grade supplied and every task we completed.",
  },
  "oil-gas-petrochemical": {
    summary:
      "Specified secondary containment, process-water lining, drainage and sediment-control systems for African oil, gas and petrochemical projects. We select materials and installation methods for the liquid exposure, facility requirements and approved containment design.",
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
      "We confirm grade-specific chemical compatibility and product documentation, then record foundations, joints, welds, penetrations, tests and repairs through to acceptance and release to operation.",
  },
  "environmental-remediation": {
    summary:
      "Geosynthetic containment and caps, sediment and sludge management, erosion blankets and rehabilitation interfaces for African environmental works. We supply, fabricate and install, with practical installation controls and a documented handover.",
    inputs: [
      "Contaminant or sediment characteristics and the remediation or rehabilitation objectives",
      "Barrier, drainage, dewatering or erosion-control design and site constraints",
      "Feed trials where relevant, monitoring, removal and maintenance requirements",
    ],
    applications: [
      "landfill-capping-closure",
      "sludge-dewatering",
      "sediment-control-silt-curtains-fences",
      "slope-erosion-protection",
    ],
    quality:
      "We link material and fabrication records to every lining, filling, filtration or erosion-control inspection, and set out the monitoring, vegetation establishment and environmental acceptance we deliver in our proposal.",
  },
};
