import { FLOATING_COVERS_HERO, FLOATING_COVERS_TEMPLATE } from "@/data/floating-covers-application";
/** Canonical application directory. Existing addresses remain unchanged. */
// CMS template IDs predate the public application URLs. Keep them as lookup aliases.
export const LEGACY_APPLICATION_TEMPLATE_IDS: Record<string, string> = {
  "tailings-storage-facility-lining": "tailings-storage-facilities-tsfs",
  "heap-leach-pad-lining": "tailings-storage-facilities-tsfs-copy",
  "reservoir-dam-lining": "heap-leach-pad-lining-copy-9",
  "irrigation-canal-lining": "heap-leach-pad-lining-copy-8",
  "landfill-ash-bund-lining": "heap-leach-pad-lining-copy-7",
  "stabilisation-reinforcement": "heap-leach-pad-lining-copy-6",
  "slope-erosion-protection": "heap-leach-pad-lining-copy-5",
  "retaining-wall-systems": "heap-leach-pad-lining-copy-4",
  "drainage-filtration-systems-africa": "heap-leach-pad-lining-copy-3",
  "coastal-protection": "heap-leach-pad-lining-copy-2",
  "roads-railways": "heap-leach-pad-lining-copy-1",
  "sludge-dewatering": "dewatering",
  "mse-retaining-wall-geogrids": "mse-retaining-wall-geogrids",
};

export const APPLICATION_GROUPS = [
  {
    id: "mining-containment",
    label: "Mining & Industrial Containment",
  },
  {
    id: "water-storage",
    label: "Water Storage & Conveyance",
  },
  {
    id: "waste-environment",
    label: "Waste & Environmental Protection",
  },
  {
    id: "ground-transport",
    label: "Ground Engineering & Transport",
  },
  {
    id: "drainage-coastal",
    label: "Drainage, Erosion & Coastal Works",
  },
];

const existingApplications = [
  {
    slug: "tailings-storage-facility-lining",
    label: "Tailings Storage Facility (TSF) Lining",
    group: "mining-containment",
    summary: "HDPE barrier systems for new tailings cells, raises, expansions and remediation.",
    uses: [
      "TSF cells",
      "tailings dam raises",
      "double liners",
      "leak detection",
      "AMD containment",
    ],
    icon: "Mountain",
  },
  {
    slug: "heap-leach-pad-lining",
    label: "Heap Leach Pad Lining",
    group: "mining-containment",
    summary: "Containment, liner protection and solution collection beneath ore stacks.",
    uses: ["Gold leach pads", "copper leach pads", "valley-fill pads", "phased extensions"],
    icon: "Layers",
  },
  {
    slug: "reservoir-dam-lining",
    label: "Reservoir & Dam Lining",
    group: "water-storage",
    summary: "Geomembrane lining for new water storage and reservoir rehabilitation.",
    uses: [
      "Bulk-water reservoirs",
      "irrigation dams",
      "farm dams",
      "approved potable-water liners",
      "tank liners",
    ],
    icon: "Waves",
  },
  {
    slug: "irrigation-canal-lining",
    label: "Irrigation Canal & Channel Lining",
    group: "water-storage",
    summary: "Seepage-control and channel-protection systems for irrigation and water transfer.",
    uses: ["Irrigation schemes", "water-transfer canals", "canal rehabilitation", "lined channels"],
    icon: "Droplets",
  },
  {
    slug: "landfill-ash-bund-lining",
    label: "Landfill, Ash & Secondary Containment Lining",
    group: "waste-environment",
    summary: "Barrier, protection and collection systems for waste cells, ash residues and bunds.",
    uses: ["Landfill basal liners", "ash facilities", "leachate ponds", "fuel and chemical bunds"],
    icon: "Shield",
  },
  {
    slug: "stabilisation-reinforcement",
    label: "Ground Stabilisation & Soil Reinforcement",
    group: "ground-transport",
    summary:
      "Geogrids, separators and confinement systems for platforms, haul roads and earthworks.",
    uses: ["Working platforms", "haul roads", "logistics yards", "gravel parking", "grass paving"],
    icon: "Grid3X3",
  },
  {
    slug: "slope-erosion-protection",
    label: "Slope & Erosion Protection",
    group: "drainage-coastal",
    summary:
      "Vegetated blankets, geocells and specified hard armour for exposed slopes and channels.",
    uses: [
      "Mine rehabilitation",
      "embankments",
      "pipeline corridors",
      "channel banks",
      "mine closure",
    ],
    icon: "Sprout",
  },
  {
    slug: "retaining-wall-systems",
    label: "Retaining Wall Systems",
    group: "ground-transport",
    summary:
      "Reinforcement, facing interfaces, backfill and drainage for engineered retaining structures.",
    uses: [
      "Development walls",
      "road cut-and-fill walls",
      "industrial platforms",
      "drainage behind walls",
    ],
    icon: "Layers",
  },
  {
    slug: "mse-retaining-wall-geogrids",
    label: "MSE Walls, Crusher Walls & Reinforced Slopes",
    group: "ground-transport",
    summary: "Long-term geogrid reinforcement for demanding mining and infrastructure structures.",
    uses: ["Crusher walls", "ROM infrastructure", "bridge approaches", "reinforced steep slopes"],
    icon: "Mountain",
  },
  {
    slug: "drainage-filtration-systems-africa",
    label: "Subsoil Drainage & Geotextile Filtration",
    group: "drainage-coastal",
    summary:
      "Filter fabrics, drainage composites and collector pipes selected for flow, soil and loading.",
    uses: [
      "French drains",
      "retaining-wall drainage",
      "liner leak detection",
      "landfill drainage",
      "filters",
    ],
    icon: "Droplets",
  },
  {
    slug: "coastal-protection",
    label: "Coastal & Riverbank Protection",
    group: "drainage-coastal",
    summary: "Geotextile sand containers and geosynthetic interfaces for designed shoreline works.",
    uses: [
      "Coastal sand containers",
      "riverbanks",
      "dune protection",
      "scour interfaces",
      "emergency erosion works",
    ],
    icon: "Waves",
  },
  {
    slug: "roads-railways",
    label: "Road & Railway Geosynthetics",
    group: "ground-transport",
    summary:
      "Foundation stabilisation, separation, rail interfaces and asphalt rehabilitation interlayers.",
    uses: [
      "Road foundations",
      "rail formations",
      "ballast interfaces",
      "asphalt grids",
      "paving fabrics",
    ],
    icon: "Route",
  },
  {
    slug: "sludge-dewatering",
    label: "Sludge & Sediment Dewatering",
    group: "waste-environment",
    summary: "Slit-film, monofilament and composite bags and tubes matched to the feed and site.",
    uses: [
      "Mine sludge",
      "dredged sediment",
      "municipal sludge",
      "industrial residues",
      "dewatering trials",
    ],
    icon: "Filter",
  },
];
const newApplications = [
  {
    slug: "process-water-pollution-control-dam-lining",
    label: "Process Water & Pollution Control Dam Lining",
    group: "mining-containment",
    icon: "Droplets",
    hero: "https://www.geosyntheticsafrica.com/api/storage/media-center/Reservour-Dam-Lining-by-Geosynthetics-Africa-South-Africa-HDPE-Specialists-IAGI-Member_dee00702-a8f3-4ddb-abb1-918dbeca9282.webp",
    summary:
      "Lining for process ponds, return-water dams and pollution-control storage at African mines and industrial sites.",
    uses: [
      "Process-water ponds",
      "Pollution control dams (PCDs)",
      "Return-water dams",
      "Plant sumps and lined channels",
    ],
    what: "Process-water and pollution-control facilities store liquids whose chemistry, temperature and operating level can differ substantially from clean water. Geosynthetics Africa supplies and installs geomembranes, protection geotextiles and specified drainage or leak-detection layers for these containment duties across Africa.",
    selection:
      "We review process chemistry, operating head, temperature, foundation conditions and the approved liner section, then schedule the barrier, protection and collection materials.",
    installation:
      "We deliver the material, deploy panels, complete fusion and extrusion welding, pipe boots, sumps and anchors, and tie in to operating facilities in phases.",
    quality:
      "Our lining QC records roll and panel identity, trial welds, applicable air-channel testing (ASTM D5820), vacuum testing (ASTM D5641), destructive peel/shear tests (ASTM D6392), repair close-out and penetration checks to the project plan.",
    why: "Combine process-containment material supply with installation and documented seam control through one partner, with freight and site mobilisation planned around the plant construction or shutdown programme.",
    components: [
      [
        "Specified chemical-containment geomembrane",
        "The polymer, thickness, surface finish and seams are selected for the stored liquid, temperature and liner loading.",
      ],
      [
        "Protection and drainage interfaces",
        "We use the specified cushioning, underdrainage and any leak-detection layers with defined collection points.",
      ],
      [
        "Penetrations and terminations",
        "We detail pipe boots, sumps, anchors and concrete connections for liquid tightness and expected movement.",
      ],
    ],
    design: [
      "We review representative liquid chemistry, temperature and exposure duration with the material specification.",
      "We assess foundation settlement, groundwater uplift, hydraulic head and interface stability.",
      "We detail sumps, pipe penetrations, monitoring points and tie-ins to existing containment.",
    ],
    install: [
      "We accept the formation, drains and protection layers before deployment; isolate operating interfaces under the site work plan.",
      "We deploy and join panels to the approved layout, recording welding settings, trial seams and detail welds.",
      "Test, repair and retest, then release covering or filling and compile as-built panel and penetration records.",
    ],
    checks: [
      [
        "Liquid and material compatibility",
        "We confirm the exact membrane and ancillary materials against approved chemical-exposure requirements.",
      ],
      [
        "Seams, sumps and connections",
        "We record applicable weld tests and inspect pipe boots, anchors and structural terminations.",
      ],
      [
        "Filling or covering release",
        "We close repairs and complete the specified leak survey or other acceptance checks before commissioning.",
      ],
    ],
  },
  {
    slug: "wastewater-treatment-pond-lining",
    label: "Wastewater & Treatment Pond Lining",
    group: "waste-environment",
    icon: "Droplets",
    hero: "https://www.geosyntheticsafrica.com/api/storage/media-center/Reservour-Dam-Lining-by-Geosynthetics-Africa-South-Africa-HDPE-Specialists-IAGI-Member_dee00702-a8f3-4ddb-abb1-918dbeca9282.webp",
    summary:
      "Geomembrane systems for wastewater lagoons, treatment ponds and industrial effluent storage.",
    uses: [
      "Wastewater lagoons",
      "Effluent balancing ponds",
      "Treatment and polishing ponds",
      "Sludge-storage containment",
    ],
    what: "Wastewater ponds need a containment barrier that suits the effluent, treatment process and maintenance regime. Geosynthetics Africa supplies and installs lining systems for municipal, industrial and agricultural wastewater facilities across Africa, with protection and connection details built around the approved process design.",
    selection:
      "We review effluent chemistry, operating temperature, aeration or mixing equipment, water levels, foundation and access to select the specified liner and protection package.",
    installation:
      "We accept the earthworks, place and weld panels, and complete inlet and outlet details and protection around equipment supports and maintenance areas.",
    quality:
      "Our records cover material identity, formation acceptance, trial welding, applicable seam tests, repairs, equipment-interface inspections and our release for filling. We test HDPE seams to the specified ASTM methods and CQA plan.",
    why: "We supply the membrane and protection and install them as one package, with every treatment-process interface detailed and an installation dossier at handover.",
    components: [
      [
        "Effluent-compatible geomembrane",
        "We select the exact liner for chemical and thermal exposure, jointing and operating conditions.",
      ],
      [
        "Formation and protection system",
        "Prepared earthworks, cushioning and any uplift relief support the lining and limit installation damage.",
      ],
      [
        "Treatment-process interfaces",
        "We terminate and protect the liner at every inlet, outlet, equipment base and access point.",
      ],
    ],
    design: [
      "Characterise effluent, temperature, operating cycles and cleaning chemicals before choosing the lining.",
      "We assess groundwater, gas uplift, settlement and the effects of mixers or aeration equipment.",
      "We detail equipment supports, penetrations, access and the staged commissioning and maintenance plan.",
    ],
    install: [
      "We prepare and accept the basin, penetrations and protection layers before deploying material.",
      "We join the selected membrane using its approved procedure and inspect equipment and pipe interfaces.",
      "We complete seam tests, repairs and specified acceptance checks before controlled filling and handover.",
    ],
    checks: [
      [
        "Effluent and product submittals",
        "We check the specified material and exposure documentation before procurement.",
      ],
      [
        "Joint and interface inspection",
        "We document trial welds, applicable seam testing, repairs and equipment-area protection.",
      ],
      [
        "Commissioning records",
        "We record filling releases and the specified retention or integrity tests, with as-built details.",
      ],
    ],
  },
  {
    slug: "agricultural-aquaculture-pond-lining",
    label: "Agricultural & Aquaculture Pond Lining",
    group: "water-storage",
    icon: "Sprout",
    hero: "https://www.geosyntheticsafrica.com/api/storage/media-center/Reservour-Dam-Lining-by-Geosynthetics-Africa-South-Africa-HDPE-Specialists-IAGI-Member_dee00702-a8f3-4ddb-abb1-918dbeca9282.webp",
    summary:
      "Pond lining for farm-water storage, fish production, irrigation and agricultural process duties.",
    uses: [
      "Aquaculture ponds",
      "Farm-water ponds",
      "Irrigation storage",
      "Agricultural process-water ponds",
    ],
    what: "Lined ponds help manage water retention and the separation of stored water from the supporting soil. Geosynthetics Africa supplies geomembranes and installation packages for farm-water storage and aquaculture projects across Africa. Material choice accounts for the water use, stock or crop sensitivity, maintenance and site conditions.",
    selection:
      "We review pond geometry, foundation, water chemistry, intended aquaculture or agricultural use and required product approvals before we select the liner and protection materials.",
    installation:
      "We plan panel sizes, anchors, inlet and outlet connections and the welding or manufacturer-specific joining method for the selected membrane.",
    quality:
      "Our checks cover material identity, prepared formation, protection, joint integrity, repairs and terminations. Water-contact or aquaculture suitability is checked for the exact product rather than inferred from the polymer alone.",
    why: "Access a defined material and installation package for your pond layout, with delivery planning for rural sites and documented completion before the pond is placed in service.",
    components: [
      [
        "Selected pond liner",
        "We specify the membrane for water use, exposure, cleaning and the required product suitability documentation.",
      ],
      [
        "Cushioning and supporting formation",
        "We prepare the basin and select protection against protrusions, settlement and maintenance damage.",
      ],
      [
        "Anchors and water-control details",
        "We detail inlets, outlets, harvest or drain points and edge restraint to the pond design.",
      ],
    ],
    design: [
      "We define water use, chemistry, exposure and any food-production or aquaculture product requirements.",
      "We review basin soils, animal or equipment access, groundwater and empty/full cycles.",
      "We detail pond drainage, cleaning access, overflow and all edge and pipe connections.",
    ],
    install: [
      "We prepare the pond and accept the formation, protection and pipe details.",
      "We deploy and join the selected liner to its approved method, keeping work clean and protected.",
      "We inspect and test applicable joints, complete repairs and release the pond for staged filling.",
    ],
    checks: [
      [
        "Product suitability and identity",
        "We confirm the specified water-use documentation and record roll or panel references.",
      ],
      [
        "Joint and penetration checks",
        "We inspect the chosen jointing method, pipe connections, anchorages and repairs.",
      ],
      [
        "Pond acceptance",
        "We record specified integrity or retention checks and provide installation and care information.",
      ],
    ],
  },
  {
    slug: "floating-covers-evaporation-control",
    label: "Floating Covers & Evaporation Control",
    group: "water-storage",
    icon: "Waves",
    hero: FLOATING_COVERS_HERO,
    summary:
      "Floating covers fabricated in our own facility and installed by our own crews, in FC45/FC60 rLLDPE, CSPE and rFPP, all NSF/ANSI 61 certified.",
    uses: [
      "Reservoir floating covers",
      "Industrial water covers",
      "Agricultural storage covers",
      "Cover repair and replacement",
    ],
    what: "A floating membrane cover is a separate engineered system above stored liquid. It can support evaporation or contamination-control objectives when its material, flotation, ballast, drainage and anchorage suit the reservoir and operating conditions. Geosynthetics Africa supplies, fabricates and installs floating covers for African water-storage projects.",
    selection:
      "We review stored liquid, basin geometry, operating levels, wind, rainfall, access and cover objectives before selecting the specified membrane and fabrication details.",
    installation:
      "We fabricate and join panels, fit flotation and ballast, install anchors and access details, and deploy to a planned filling sequence.",
    quality:
      "Our controls record membrane and panel identity, fabrication and field-joint checks, repairs, attachment and drainage inspections, and operational checks through the full water-level range.",
    why: "We fabricate the cover for your reservoir's operating details, then deliver, install and document it with one team.",
    components: [
      [
        "Cover membrane and joined panels",
        "We specify UV exposure, chemical compatibility, flexibility and joint performance for the intended duty.",
      ],
      [
        "Flotation, ballast and rainwater management",
        "Configure the cover profile and surface-water collection for the design's operating conditions.",
      ],
      [
        "Anchorage and access details",
        "We detail edge restraints, penetrations, safe access and inspection or maintenance provisions.",
      ],
    ],
    design: [
      "We set measurable cover objectives and assess wind, rainfall and the full operating water-level range.",
      "We select membrane, joints, flotation and ballast from the approved cover design and stored-liquid chemistry.",
      "We install stormwater removal and inspection access and hand over safe operating procedures.",
    ],
    install: [
      "We survey and prepare the reservoir interfaces, anchorage and deployment areas.",
      "Fabricate or join panels, install the specified attachments and deploy using the approved sequence.",
      "We inspect drainage, movement and connections at set water levels, close out repairs and hand over operating records.",
    ],
    checks: [
      [
        "Fabrication and joint quality",
        "We record material identity, panel dimensions and the specified seam inspection and testing.",
      ],
      [
        "Anchors, attachments and drainage",
        "We inspect connections, flotation or ballast and rainwater collection before operation.",
      ],
      [
        "Operational acceptance",
        "We complete movement, drainage and water-level checks and provide the maintenance information.",
      ],
    ],
  },
  {
    slug: "landfill-capping-closure",
    label: "Landfill Capping & Closure Systems",
    group: "waste-environment",
    icon: "Shield",
    hero: "",
    summary:
      "Barrier, gas-management, drainage and protection layers for landfill closure and waste-cover works.",
    uses: [
      "Landfill final covers",
      "Interim engineered caps",
      "Waste-facility rehabilitation",
      "Cap drainage and gas interfaces",
    ],
    what: "Landfill capping manages infiltration and the interfaces between waste, gas, drainage and the final cover surface. Geosynthetics Africa supplies and installs specified geomembranes, GCLs, geotextiles and drainage products for closure and rehabilitation works across Africa. The cap arrangement follows the approved facility design and anticipated settlement.",
    selection:
      "We schedule the cap materials around infiltration objectives, gas management, differential settlement, slope stability and cover soil.",
    installation:
      "We sequence barrier deployment, joints, gas and drainage interfaces, protection and cover placement so each layer remains accessible for inspection.",
    quality:
      "Our records cover material identity, layer acceptance, GCL overlaps where used, applicable geomembrane seam testing, repairs, drainage continuity and covering releases.",
    why: "We supply and install the closure layers as one package, with installation and traceability organised around the cap sequence and handover.",
    components: [
      [
        "Specified cap barrier",
        "Geomembrane or GCL layers limit infiltration within the approved cover configuration and strain assumptions.",
      ],
      [
        "Gas and drainage interfaces",
        "We separate gas management and water drainage functions with defined connections and outlets.",
      ],
      [
        "Protection and final surface",
        "Cushioning, cover soil and erosion protection support the barrier and the required surface finish.",
      ],
    ],
    design: [
      "We review waste settlement, gas conditions, cap geometry and approved infiltration objectives.",
      "We assess interface stability, barrier strain, gas pressure and drainage under the intended cover load.",
      "We detail penetrations, gas wells, drainage outlets, erosion protection and post-closure inspection access.",
    ],
    install: [
      "We accept the prepared cap profile and complete the specified gas-management interfaces.",
      "We place and join barrier layers, inspect transitions and release each stage before protection and drainage installation.",
      "We place cover soils using controlled routes, inspect outlets and erosion protection and compile layer records.",
    ],
    checks: [
      [
        "Cap materials and traceability",
        "We verify each barrier, drainage, filter and protection product against approved submittals.",
      ],
      [
        "Layer and joint acceptance",
        "We record overlaps, applicable weld tests, penetrations and repaired areas before covering.",
      ],
      [
        "Drainage and closure records",
        "We inspect outlets and final protection and provide layer maps, tests and as-built details.",
      ],
    ],
  },
  {
    slug: "concrete-protection-lining",
    label: "Concrete Protection & Tank Lining",
    group: "mining-containment",
    icon: "Shield",
    hero: "",
    summary:
      "Anchored thermoplastic liners and fabricated details for concrete tanks, channels and chemical-exposure areas.",
    uses: [
      "Concrete process tanks",
      "Wastewater concrete protection",
      "Chemical-exposure channels",
      "Tank penetrations and lining details",
    ],
    what: "Concrete protection liners isolate the concrete surface from specified aggressive liquids or gases. Geosynthetics Africa supplies, prefabricates, welds and installs anchored thermoplastic linings for tanks, channels and process structures across Africa. The selected system must suit both chemical exposure and the concrete construction method.",
    selection:
      "We review liquid or gas exposure, temperature, structural details, liner anchorage and concrete placement or rehabilitation requirements before confirming materials.",
    installation:
      "We install panels, embedment or approved fixings, welded joints, pipe penetrations and terminations in step with the concrete programme.",
    quality:
      "Our inspection records address panel identity, fixing or anchor details, weld preparation, applicable seam or spark testing, repairs and the close-out of penetrations and terminations.",
    why: "We supply, prefabricate and weld the thermoplastic lining, with inspection releases set with the concrete team before construction.",
    components: [
      [
        "Concrete protection liner",
        "We select the specified anchored thermoplastic sheet for exposure, thickness and concrete-construction compatibility.",
      ],
      [
        "Welded panel and fabrication details",
        "We prefabricate corner pieces, joints, transitions and pipe boots to keep the lining continuous.",
      ],
      [
        "Anchorage and terminations",
        "Embedment, fixing and sealing details must follow the approved structural and lining design.",
      ],
    ],
    design: [
      "We assess chemical exposure, temperature, pressure or vacuum and the intended cleaning regime.",
      "We plan liner anchorage, concrete placement, corners, joints and thermal movement.",
      "We specify the applicable weld, spark or integrity-testing procedure for the actual liner and details.",
    ],
    install: [
      "Approve shop details and inspect supports, formwork or concrete surfaces before lining installation.",
      "We position panels and prefabricated pieces, fix or embed them and weld the specified joints.",
      "We inspect and test applicable seams and details, repair defects and hand over traceable installation records.",
    ],
    checks: [
      [
        "Panel and anchor inspection",
        "We confirm material grade, panel condition and the specified embedment or fixing arrangement.",
      ],
      [
        "We weld and integrity testing",
        "We record weld checks and any specified spark or other integrity tests appropriate to the system.",
      ],
      [
        "Tank and penetration close-out",
        "We inspect joints, pipe details and terminations and compile the required acceptance records.",
      ],
    ],
  },
  {
    slug: "soft-ground-consolidation-vertical-drains",
    label: "Soft Ground Consolidation & Vertical Drains",
    group: "ground-transport",
    icon: "Layers",
    hero: "",
    summary:
      "Prefabricated vertical drains and drainage interfaces for engineered consolidation of compressible ground.",
    uses: [
      "PVD and wick-drain works",
      "Embankments on soft soil",
      "Platform and reclamation ground improvement",
      "Drainage blankets and outlet interfaces",
    ],
    what: "Prefabricated vertical drains shorten the drainage path in compressible soils as part of an engineered consolidation programme. Geosynthetics Africa supplies PVD and associated filter and drainage materials, with the installation and ground-improvement scope defined for the project. Surcharge, vacuum or other loading and instrumentation remain integrated with the geotechnical design.",
    selection:
      "We review the ground investigation, drain schedule, installation depth, soil and flow conditions and the specified filter and core performance before procurement.",
    installation:
      "We supply the drains and plan installation: grid set-out, mandrel compatibility, anchorage, achieved depths and connection to the drainage blanket.",
    quality:
      "Our records identify drain batches and installed locations, depths, splices, refusals and departures from the schedule. We work with the project's geotechnical engineer on instrumentation and settlement acceptance.",
    why: "We supply PVDs with traceability tied to the approved ground-improvement schedule and support installation and surface-drainage interfaces.",
    components: [
      [
        "Prefabricated vertical drain",
        "The drainage core and filter jacket are selected for soil retention, discharge capacity and installation conditions.",
      ],
      [
        "Installation and anchorage interfaces",
        "Drain dimensions, mandrel, anchor and splice details must suit the approved method and ground profile.",
      ],
      [
        "Drainage blanket and outlets",
        "Horizontal drainage conveys expelled water from the drains to the designed collection or discharge points.",
      ],
    ],
    design: [
      "Characterise compressible strata, consolidation behaviour and the required settlement or stability objectives.",
      "We specify drain spacing, depth, filter properties and discharge performance under the relevant confinement and deformation.",
      "We plan the loading sequence, drainage blanket, instrumentation and acceptance criteria for progression.",
    ],
    install: [
      "We set out the drain grid and verify product, mandrel and anchorage details before installation.",
      "We install to the approved depth and method, recording location, penetration, splice and refusal information.",
      "We complete drainage interfaces and hand over installation records for the project's loading and monitoring programme.",
    ],
    checks: [
      [
        "Drain product conformance",
        "We check filter and core data, dimensions and batch identification against the specification.",
      ],
      [
        "Installation logs",
        "We record drain locations, depths, splices and deviations for review against the schedule.",
      ],
      [
        "Drainage and monitoring interfaces",
        "We inspect connections and supply installation records to the geotechnical monitoring team.",
      ],
    ],
  },
  {
    slug: "green-roof-podium-drainage",
    label: "Green Roof & Podium Drainage",
    group: "drainage-coastal",
    icon: "Sprout",
    hero: "https://www.geosyntheticsafrica.com/api/storage/media-center/GeoDrain_Dimpled_Drainage_Sheets_for_Civil_and_Green_roofs_Geosynthetics_Africa_5523038b-fdb4-4640-adcf-c064650b227a.webp",
    summary:
      "Filter, protection and drainage layers for landscaped roofs, podiums, planters and buried structures.",
    uses: [
      "Green-roof drainage",
      "Podium landscaping",
      "Planter drainage",
      "Protection and drainage above waterproofing",
    ],
    what: "Green roofs and landscaped podiums need drainage and filter layers that manage water without losing the growing medium or damaging the underlying waterproofing. Geosynthetics Africa supplies geotextiles, drainage cores and specified protection and root-management materials for these assemblies. We work to the roof designer's waterproofing, loading and outlet details.",
    selection:
      "We match filter, drainage and protection layers to growing medium, imposed loads, gradients and outlet details, checking the exact product's water-flow and structural data.",
    installation:
      "We place the layers in step with the waterproofing team, including protection, core joins, filter laps, planters and drain inspection points.",
    quality:
      "Our checks cover product identity, protection of accepted waterproofing, core orientation, filter continuity, outlet connections and inspection before growing medium or paving covers the system.",
    why: "We supply the filter, protection and drainage layers together, selected and delivered around the waterproofing and landscaping sequence.",
    components: [
      [
        "Protection above waterproofing",
        "We use the specified cushioning or protection layer without compromising the accepted roof-waterproofing system.",
      ],
      [
        "Drainage or retention core",
        "We select flow capacity and any required water-storage function under the landscaped assembly's design loads.",
      ],
      [
        "Filter and growing-medium interface",
        "The filter retains the growing medium while allowing drainage, with continuous laps and accessible outlets.",
      ],
    ],
    design: [
      "We confirm roof falls, waterproofing compatibility, growing medium and saturated permanent and imposed loads.",
      "We select filter retention and drainage capacity at the actual gradient and confining load.",
      "We detail root-management requirements, inspection chambers, outlets, perimeter edges and maintenance access.",
    ],
    install: [
      "Obtain acceptance of waterproofing and install the specified protection before other geosynthetics.",
      "We place cores and filters in their designed orientation with continuous drainage routes and protected outlets.",
      "We inspect joins, edges and inspection points before adding growing medium, paving or other cover.",
    ],
    checks: [
      [
        "Assembly and product approval",
        "We verify protection, filter and drainage products against the roof or podium design.",
      ],
      [
        "Drainage continuity",
        "We inspect core joins, filters, outlet openings and inspection-chamber interfaces.",
      ],
      [
        "Pre-cover release",
        "We record waterproofing interfaces and drainage checks before the assembly is concealed.",
      ],
    ],
  },
  {
    slug: "sediment-control-silt-curtains-fences",
    label: "Sediment Control: Silt Curtains & Silt Fences",
    group: "waste-environment",
    icon: "Filter",
    hero: "",
    summary:
      "Fabricated barriers for construction runoff and suspended-sediment control in suitable waters.",
    uses: [
      "Standard and heavy-duty silt fences",
      "Class 1–3 silt curtains",
      "Dredging sediment management",
      "Construction-site runoff interception",
    ],
    what: "Silt fences and silt curtains address different sediment pathways. Fences intercept sediment-laden surface runoff on land, while floating curtains manage suspended sediment during suitable in-water construction or dredging. Geosynthetics Africa selects, fabricates, supplies and installs both across Africa.",
    selection:
      "We review the catchment, soil or sediment, expected runoff or water conditions and installation constraints before selecting the fence fabric or complete curtain arrangement.",
    installation:
      "We supply selvedged fence fabric, supports and toe embedment, or fabricate curtain sections with flotation, ballast, connectors and moorings, and deliver and deploy them on site.",
    quality:
      "Our checks cover fabric and batch identity, fabrication dimensions and seams, fence support and toe details, or curtain connections and moorings. Maintenance and turbidity checks follow the environmental plan.",
    why: "Access standard and heavy-duty fence fabrics and project-specific curtain fabrication through one partner, with practical selection and installation interfaces rather than a barrier class alone.",
    components: [
      [
        "Silt-fence fabric and supports",
        "We match fabric opening and flow properties, support spacing and toe embedment to the runoff and soil conditions.",
      ],
      [
        "Floating silt-curtain assembly",
        "Configure skirt, flotation, ballast and load-bearing connections for the designed water depth and conditions.",
      ],
      [
        "Maintenance and environmental interfaces",
        "We provide access for sediment removal, inspection, repair and the required runoff or water-quality monitoring.",
      ],
    ],
    design: [
      "We separate land-based runoff control from in-water sediment control and define the environmental objectives.",
      "For fences, assess soil, catchment, flow concentration, support and embedment; for curtains, assess depth, current, waves, tides and moorings.",
      "We define inspection, sediment removal, storm response, turbidity monitoring and the limits of operation.",
    ],
    install: [
      "We prepare supports and toe trenches or the curtain deployment and anchor positions under the approved plan.",
      "We install continuous fence runs with the specified returns and embedment, or assemble and deploy the curtain and mooring system.",
      "We inspect after installation and significant weather or flows, maintain the barrier and remove accumulated sediment or damaged components as required.",
    ],
    checks: [
      [
        "Fabrication and material identity",
        "We verify fabric grade, dimensions, seams and identified batches or sections.",
      ],
      [
        "Fence or curtain installation checks",
        "We record support and embedment details or flotation, ballast, connections and anchor placement.",
      ],
      [
        "Operational inspection",
        "We document damage, sediment build-up, repairs and specified monitoring or maintenance actions.",
      ],
    ],
  },
  {
    slug: "stormwater-attenuation-storage-lining",
    label: "Stormwater Attenuation & Storage Lining",
    group: "water-storage",
    icon: "Droplets",
    hero: "https://www.geosyntheticsafrica.com/api/storage/media-center/Reservour-Dam-Lining-by-Geosynthetics-Africa-South-Africa-HDPE-Specialists-IAGI-Member_dee00702-a8f3-4ddb-abb1-918dbeca9282.webp",
    summary:
      "Geomembranes and protective layers for designed stormwater storage and attenuation facilities.",
    uses: [
      "Lined attenuation ponds",
      "Stormwater reuse storage",
      "Lined attenuation structures",
      "Overflow and outlet containment details",
    ],
    what: "Stormwater attenuation systems store runoff and release or reuse it through a designed water-management arrangement. Where the design requires a sealed system, Geosynthetics Africa supplies and installs geomembranes, protection and drainage interfaces for ponds and storage structures across Africa. Infiltration systems have a different function and should not receive an impermeable barrier unless the design calls for it.",
    selection:
      "We review storage geometry, water quality, loading, foundation, groundwater and inlet or outlet details before we select the liner and protection materials.",
    installation:
      "We install protection, panels, joints, pipe boots and connections at every basin and storage-structure interface, in step with the attenuation and outlet works.",
    quality:
      "Our records cover formation acceptance, material identity, applicable seam tests, repairs, pipe connections and pre-cover checks, with the specified retention or integrity testing at commissioning.",
    why: "We supply and install the lining and inspect every interface before the attenuation structures are covered.",
    components: [
      [
        "Specified storage geomembrane",
        "We provide the designed impermeable barrier where attenuation or reuse requires water retention.",
      ],
      [
        "Protection and support",
        "We select cushioning for earthworks or structural storage components and the expected construction and service loads.",
      ],
      [
        "Inlets, outlets and access interfaces",
        "We detail pipe connections, overflow routes, cleanouts and access points within the complete stormwater design.",
      ],
    ],
    design: [
      "We confirm attenuation, reuse or infiltration objectives and the required operating water levels and release strategy.",
      "We assess foundation, groundwater uplift, structural contact pressures and protection needs.",
      "We detail inlet, outlet, overflow, cleaning and access interfaces and specify the commissioning checks.",
    ],
    install: [
      "We accept the formation or supporting storage assembly and its specified protection.",
      "We deploy and join the barrier, completing pipe boots and structural interfaces to the approved details.",
      "Inspect, test and repair, then obtain covering or filling release and provide as-built records.",
    ],
    checks: [
      [
        "System and material verification",
        "We confirm the design requires a sealed barrier and verify the exact liner and protection products.",
      ],
      [
        "Seam and connection checks",
        "We document applicable joint tests, penetrations, overflow interfaces and repaired areas.",
      ],
      [
        "Pre-cover and commissioning records",
        "We complete the integrity or retention checks and hand over the evidence.",
      ],
    ],
  },
];

export const APPLICATION_DIRECTORY = [
  ...existingApplications,
  ...newApplications.map(({ slug, label, group, summary, uses, icon }) => ({
    slug,
    label,
    group,
    summary,
    uses,
    icon,
  })),
];

export function findApplication(slug: string) {
  return APPLICATION_DIRECTORY.find((entry) => entry.slug === slug);
}

const APPLICATION_SEO: Record<string, { title: string; description: string }> = {
  "process-water-pollution-control-dam-lining": {
    title: "Process Water & PCD Lining Africa | HDPE Installers",
    description:
      "Process-water, return-water and pollution-control dam lining across Africa. HDPE supply, installation, seam testing and documented QA/QC. Send your BOQ.",
  },
  "wastewater-treatment-pond-lining": {
    title: "Wastewater Pond Lining Africa | Supply & Installation",
    description:
      "Wastewater lagoon and treatment-pond lining across Africa. Geomembrane supply, protection, installation and QA/QC by Geosynthetics Africa. Request a quote.",
  },
  "agricultural-aquaculture-pond-lining": {
    title: "Farm & Aquaculture Pond Lining Africa | Geomembranes",
    description:
      "Farm, irrigation and aquaculture pond lining across Africa. Product selection, geomembrane supply, installation and QA/QC. Send your layout for a proposal.",
  },
  "floating-covers-evaporation-control": {
    title: "Floating Covers Africa | Reservoir Evaporation Control",
    description:
      "Floating membrane covers for African reservoirs and water storage. Material selection, fabrication, delivery and installation support. Discuss your cover scope.",
  },
  "landfill-capping-closure": {
    title: "Landfill Capping Africa | Closure & Drainage Systems",
    description:
      "Landfill capping and closure systems across Africa. Geomembranes, GCLs, filters, drainage and installation QA/QC. Send your cover sections and quantities.",
  },
  "concrete-protection-lining": {
    title: "Concrete Protection Lining Africa | Tanks & Channels",
    description:
      "Concrete protection and tank lining across Africa. Anchored thermoplastic liners, fabricated details, welding and QA/QC. Send your drawings and exposure data.",
  },
  "soft-ground-consolidation-vertical-drains": {
    title: "Vertical Drains Africa | PVD & Soft Ground Consolidation",
    description:
      "Prefabricated vertical drains and drainage interfaces for soft-ground consolidation across Africa. Material supply and defined installation support. Send a BOQ.",
  },
  "green-roof-podium-drainage": {
    title: "Green Roof & Podium Drainage Africa | Geosynthetics",
    description:
      "Green-roof and podium drainage across Africa. Filter geotextiles, drainage cores and protection materials, with technical selection and delivery support.",
  },
  "sediment-control-silt-curtains-fences": {
    title: "Silt Curtains & Silt Fences Africa | Sediment Control",
    description:
      "Standard and heavy-duty silt fences, plus Class 1–3 silt curtains for African projects. Fabrication, supply and deployment support. Request technical selection.",
  },
  "stormwater-attenuation-storage-lining": {
    title: "Stormwater Storage Lining Africa | Geomembrane Systems",
    description:
      "Stormwater attenuation and storage lining across Africa. Geomembranes, protection layers, installation and documented QA/QC. Send your drawings and BOQ.",
  },
};

const GENERATED_APPLICATION_TEMPLATES: Record<string, any> = Object.fromEntries(
  newApplications.map((app) => [
    app.slug,
    {
      title: app.label,
      description:
        app.summary +
        " Geosynthetics Africa selects, supplies, delivers and installs, with documented QA/QC, across Africa. Send your drawings and quantities for a proposal.",
      heroImage: app.hero,
      overviewParagraphs: [
        app.what,
        app.selection,
        "Appoint us for material supply or an integrated package. We fabricate where required, deliver across borders and install with our own crews, with inspection stages and handover records set before mobilisation.",
        "Send your project location, drawings, quantities, operating conditions and required date. Our technical team will review the specification and prepare a proposal covering material, installation and QA/QC.",
      ],
      keyBenefits: [
        "Application-specific material selection",
        "Supply and delivery across Africa",
        "Installation and inspection by our own crews",
        "Material traceability and documented handover",
      ],
      suitableFor: app.uses.map((label) => ({ icon: app.icon, label })),
      assistancePhone: "+27 72 343 0868",
      assistanceEmail: "sales@geosyntheticsafrica.com",
      heroHighlights: [
        { icon: "Layers", label: "Material Supply" },
        { icon: "Truck", label: "African Delivery" },
        { icon: "HardHat", label: "Installation Scope" },
        { icon: "ClipboardCheck", label: "Documented QA/QC" },
      ],
      componentsTitle: app.label + " — Key System Components",
      componentsCallouts: app.components.map(([label, description], i) => ({
        number: String(i + 1),
        label,
        description,
      })),
      designTitle: "Selecting Your " + app.label + " System",
      designParagraphs: app.design,
      installationTitle: "Installation & Project Delivery",
      installationParagraphs: app.install,
      qaTitle: "Our " + app.label + " QA/QC",
      qaItems: [
        {
          icon: "FileCheck",
          title: "Approved Scope & Inspection Plan",
          description:
            "We confirm drawings, product submittals, acceptance criteria and hold points before our installation work starts.",
        },
        ...app.checks.map(([title, description]) => ({
          icon: "ClipboardCheck",
          title,
          description,
        })),
        {
          icon: "FileText",
          title: "Documented Handover",
          description:
            "We compile material certificates, installation inspections, test results, repairs and as-built information for your project team.",
        },
      ],
      deliveryProfile: {
        selection: app.selection,
        installation: app.installation,
        quality: app.quality,
        why: app.why,
      },
      downloadsTitle: "Technical Resources & Product Documentation",
      downloads: [
        {
          label: "Browse technical resources and request project-specific product data",
          url: "/resources",
        },
      ],
      seo: {
        ...APPLICATION_SEO[app.slug],
        keywords:
          app.label.toLowerCase() + ", geosynthetics Africa, supply and installation Africa",
      },
    },
  ]),
);

/** Applications with dedicated content replace their generated template fields. */
export const DEFAULT_APPLICATION_TEMPLATES: Record<string, any> = {
  ...GENERATED_APPLICATION_TEMPLATES,
  "floating-covers-evaporation-control": {
    ...GENERATED_APPLICATION_TEMPLATES["floating-covers-evaporation-control"],
    ...FLOATING_COVERS_TEMPLATE,
  },
};
