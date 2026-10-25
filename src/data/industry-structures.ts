import type { ServiceSection } from "@/data/service-delivery";

/**
 * Industry pages: the geosynthetic structures Geosynthetics Africa supplies and builds
 * in each industry, the catalogue products that go into each structure, and
 * industry-specific sections (tabs).
 */
export interface ProductLink {
  label: string;
  href: string;
}

export interface IndustryStructure {
  name: string;
  what: string;
  products: ProductLink[];
  service?: ProductLink;
  application?: string;
}

export interface IndustryProfile {
  headline: string;
  summary: string;
  structuresTitle: string;
  structures: IndustryStructure[];
  sections: ServiceSection[];
}

const P = {
  hdpe: { label: "HDPE geomembranes", href: "/products/geomembrane-liners/hdpe-geomembranes" },
  lldpe: {
    label: "LLDPE geomembranes",
    href: "/products/geomembrane-liners/lldpe-geomembrane-liners",
  },
  rlldpe: {
    label: "rLLDPE floating cover membranes",
    href: "/products/geomembrane-liners/floating-cover-geomembranes",
  },
  pvc: { label: "PVC geomembranes", href: "/products/geomembrane-liners/pvc-geomembranes" },
  epdm: { label: "EPDM geomembranes", href: "/products/geomembrane-liners/epdm-geomembranes" },
  eva: { label: "EVA geomembranes", href: "/products/geomembrane-liners/textured-geomembranes" },
  polylock: {
    label: "GSE® PolyLock-T termination profile",
    href: "/products/geomembrane-liners/gse-polylock-t",
  },
  gcl: {
    label: "Eurobent® reinforced GCL",
    href: "/products/geosynthetic-clay-liners/reinforced-sodium-bentonite-geosynthetic-clay-liners",
  },
  gclHdpe: {
    label: "Eurobent® HDPE-backed GCL",
    href: "/products/geosynthetic-clay-liners/hdpe-coated-bentonite-geosynthetic-clay-liners",
  },
  nonwoven: {
    label: "MIRAFI® nonwoven geotextiles",
    href: "/products/geotextile-fabrics/polypropylene-non-woven-geotextiles",
  },
  woven: {
    label: "PolyTape™ woven geotextiles",
    href: "/products/geotextile-fabrics/polypropylene-woven-geotextiles",
  },
  siltFence: {
    label: "PolyTape™ silt fence",
    href: "/products/pp-polytape-silt-fence/pp-polytape-silt-fence",
  },
  rootBarrier: {
    label: "PolyTape™ root barrier",
    href: "/products/pp-root-barrier/pp-root-barrier",
  },
  weedBlock: {
    label: "WeedBlock™ ground cover",
    href: "/products/pp-weedblock-ground-cover/pp-weedblock-ground-cover",
  },
  biaxial: { label: "Biaxial geogrids", href: "/products/Geogrids/biaxial-geogrids" },
  triax: { label: "Tensar® TriAx® geogrids", href: "/products/Geogrids/triaxial-geogrids" },
  interax: { label: "Tensar® InterAx® geogrids", href: "/products/Geogrids/multi-axial-geogrids" },
  uniaxial: {
    label: "Uniaxial geogrids",
    href: "/products/geogrids-interlayers/uniaxial-geogrids",
  },
  composite: {
    label: "Composite geogrids",
    href: "/products/geogrids-interlayers/composite-geogrids",
  },
  geostrips: {
    label: "TechStrap polymeric geostrips",
    href: "/products/geogrids-interlayers/polymeric-geostrips",
  },
  glassGrid: {
    label: "Glass fibre asphalt grids",
    href: "/products/Geogrids/glass-asphalt-geogrid",
  },
  pavingFabric: {
    label: "Paving fabric (SAMI)",
    href: "/products/geogrids-interlayers/paving-fabrics",
  },
  geocell: {
    label: "GeoStrata™ HDPE geocells",
    href: "/products/erosion-control-geocells/geostrata-hdpe-geocells",
  },
  polycell: {
    label: "PolyCell woven PP geocells",
    href: "/products/erosion-control-geocells/polycell-polypropylene-geocells",
  },
  coir: {
    label: "Coir SoilLock™ erosion blankets",
    href: "/products/erosion-control-geocells/coir-fibre-soil-blankets",
  },
  jute: {
    label: "Jute SoilLock™ erosion blankets",
    href: "/products/erosion-control-geocells/jute-soil-erosion-saver-control-blanket",
  },
  straw: {
    label: "Straw SoilLock™ erosion blankets",
    href: "/products/erosion-control-geocells/straw-cellulose-erosion-blanket",
  },
  woodWool: {
    label: "EnviroWool erosion blankets",
    href: "/products/erosion-control-geocells/envirowool-soil-erosion-blankets",
  },
  gabionWelded: {
    label: "Welded mesh gabions",
    href: "/products/gabion-baskets/square-weld-mesh-gabion-baskets",
  },
  gabionWoven: {
    label: "Woven gabion baskets",
    href: "/products/gabion-baskets/galvanised-woven-gabion-baskets",
  },
  reno: { label: "Reno mattresses", href: "/products/gabion-baskets/river-reno-matresses" },
  flowtexTubes: {
    label: "FlowTex™ dewatering tubes and bags",
    href: "/products/dewatering-systems/flowtex-dewatering-tubes-bags",
  },
  geotube: {
    label: "GEOTUBE® dewatering tubes",
    href: "/products/dewatering-systems/geotube-dewatering-systems",
  },
  siltCurtain: {
    label: "GeoCurtain™ silt curtains",
    href: "/products/dewatering-systems/geo-curtain-silt-turbidity-curtains",
  },
  sandNw: {
    label: "FlowTex™ nonwoven sand containers",
    href: "/products/geosynthetic-sand-containers/geotextile-sand-bags",
  },
  sandW: {
    label: "FlowTex™ woven sand containers",
    href: "/products/geosynthetic-sand-containers/woven-geotextile-sand-bags",
  },
  leakDetect: {
    label: "Leak detection drainage sheets",
    href: "/products/pipes-drainage-ducting/leak-detection-drainage-sheets",
  },
  subsoil: {
    label: "Subsoil drainage pipes",
    href: "/products/pipes-drainage-ducting/subsoil-drainage-pipes",
  },
  structured: {
    label: "Structured wall pipes",
    href: "/products/pipes-drainage-ducting/structured-wall-pipes",
  },
  duct: {
    label: "Cable ducting pipes",
    href: "/products/pipes-drainage-ducting/cable-ducting-pipes",
  },
  dimpled: {
    label: "Dimpled drainage sheets",
    href: "/products/pipes-drainage-ducting/dimpled-drainage-boards",
  },
  stripDrain: {
    label: "Netlon strip drains",
    href: "/products/pipes-drainage-ducting/netlon-strip-drains",
  },
  pvd: {
    label: "Prefabricated vertical drains",
    href: "/products/pipes-drainage-ducting/prefabricated-vertical-drains-pvds",
  },
  gccm: {
    label: "TILTEX™ GCCM concrete cloth",
    href: "/products/waterproofing-concrete-protection/flexible-concrete-liner-system-for-africa-tiltex-gccm",
  },
  studliner: {
    label: "GSE® Studliner® concrete protection liner",
    href: "/products/waterproofing-concrete-protection/studded-hdpe-concrete-liners-cpl",
  },
  dpm: {
    label: "DPM and polyethylene sheeting",
    href: "/products/waterproofing-concrete-protection/damp-proof-membrane-dpm-construction-plastic-sheeting-250-375-500-micron",
  },
  hessian: {
    label: "CureLock™ curing hessian",
    href: "/products/waterproofing-concrete-protection/concrete-curing-hessian-jute",
  },
  beraGravel: {
    label: "BERA® Gravel Fix permeable pavers",
    href: "/products/permeable-paving-systems/bera-gravel-fix",
  },
  beraGrass: {
    label: "BERA® Grass Fix grass pavers",
    href: "/products/permeable-paving-systems/bera-grass-fix",
  },
  beraStable: {
    label: "BERA® Stable Fix ground grids",
    href: "/products/permeable-paving-systems/bera-stable-fix",
  },
} satisfies Record<string, ProductLink>;

const S = (slug: string, label: string): ProductLink => ({ label, href: "/services/" + slug });

export const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {
  "mining-minerals-processing": {
    headline: "Geosynthetic Structures We Build for Mines",
    summary:
      "We supply, manufacture and install the geosynthetic structures a mine runs on: tailings storage facilities, pollution-control and process-water dams, heap leach pads, haul roads, crusher walls, channels and rehabilitated slopes, with our own crews and QA/QC across Africa.",
    structuresTitle: "What We Build on Mine Sites",
    structures: [
      {
        name: "Tailings Storage Facilities (TSFs)",
        what: "We line TSF basins and walls with HDPE geomembrane over GCL and cushion geotextile, install underdrains and leak detection, and weld and test every seam to the approved design.",
        products: [P.hdpe, P.gcl, P.nonwoven, P.leakDetect, P.subsoil],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "tailings-storage-facility-lining",
      },
      {
        name: "Pollution Control Dams (PCDs)",
        what: "We line PCDs and stormwater dams with single or double HDPE liners, leak detection layers and protection geotextiles, and fabricate the pipe boots and penetrations in our own facility.",
        products: [P.hdpe, P.leakDetect, P.nonwoven, P.gcl, P.polylock],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "process-water-pollution-control-dam-lining",
      },
      {
        name: "Process Water & Return Water Dams",
        what: "We line process and return water dams for plant water recovery, and install floating covers where evaporation or water quality must be controlled.",
        products: [P.hdpe, P.lldpe, P.rlldpe, P.nonwoven],
        service: S("floating-cover-installation-africa", "Floating covers"),
        application: "process-water-pollution-control-dam-lining",
      },
      {
        name: "Heap Leach Pads",
        what: "We install the barrier, cushion and solution-collection layers for heap leach pads, sequencing panels, sumps and phase tie-ins around the pad construction programme.",
        products: [P.hdpe, P.lldpe, P.gcl, P.nonwoven, P.subsoil],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "heap-leach-pad-lining",
      },
      {
        name: "Desludging & Dewatering",
        what: "We desludge ponds and dams with dewatering tubes we fabricate ourselves, managing filling, filtrate and cake on site, then reline the cleared structure where required.",
        products: [P.flowtexTubes, P.geotube, P.hdpe, P.woven],
        service: S("manufacturing-fabrication", "Manufacturing & fabrication"),
        application: "sludge-dewatering",
      },
      {
        name: "Erosion Control on TSF Walls",
        what: "We protect TSF outer walls and rehabilitated slopes with Coir SoilLock™ 450 mining-grade blankets, geocells and seeding, pinned to resist high runoff while vegetation establishes.",
        products: [P.coir, P.jute, P.geocell, P.woodWool],
        service: S("bioengineering-revegetation", "Erosion control & revegetation"),
        application: "slope-erosion-protection",
      },
      {
        name: "Geocell-Stabilised Haul Roads",
        what: "We build haul roads, access roads and platforms over weak ground with geocell confinement and Tensar® geogrid stabilisation, cutting aggregate thickness and rutting under heavy mine traffic.",
        products: [P.geocell, P.triax, P.interax, P.biaxial, P.woven],
        service: S("geocell-installation-contractor-africa", "Geocell installation"),
        application: "stabilisation-reinforcement",
      },
      {
        name: "Crusher Walls & Retaining Walls",
        what: "We build crusher walls, ROM pad walls and bridge approaches as gabion walls from our own welded mesh baskets, or as MSE walls reinforced with Tensar® uniaxial geogrids and geostrips.",
        products: [P.gabionWelded, P.gabionWoven, P.uniaxial, P.geostrips, P.nonwoven],
        service: S("gabion-installation-contractor-africa", "Gabion installation"),
        application: "retaining-wall-systems",
      },
      {
        name: "Water Channels & Spillways",
        what: "We line stormwater diversion channels, TSF spillways and penstock outfalls with TILTEX™ GCCM, Reno mattresses or geocell-confined concrete.",
        products: [P.gccm, P.reno, P.geocell, P.hdpe],
        service: S("gccm-channel-lining-contractor-africa", "GCCM channel lining"),
        application: "irrigation-canal-lining",
      },
      {
        name: "Silt Curtains on Mine Water",
        what: "We deploy silt curtains in TSF pools, return water dams, channels and river crossings to contain suspended sediment during dredging, desludging and construction.",
        products: [P.siltCurtain, P.siltFence],
        service: S("silt-curtain-deployment", "Silt curtain deployment"),
        application: "sediment-control-silt-curtains-fences",
      },
    ],
    sections: [
      {
        id: "mine-delivery",
        label: "Remote Mine Delivery",
        title: "How We Deliver on Remote Mines",
        kind: "steps",
        steps: [
          {
            title: "Stock and manufacturing",
            text: "We dispatch geomembranes, geotextiles and geogrids from regional stock and fabricate tubes, boots and gabions in our own Johannesburg facility.",
          },
          {
            title: "Cross-border logistics",
            text: "We prepare certificates of origin and customs documents before dispatch and route freight by road, sea or corridor to the mine gate.",
          },
          {
            title: "Crew mobilisation",
            text: "We mobilise our own welding crews and equipment to the mine and work to its site safety and induction requirements.",
          },
          {
            title: "Handover for the engineer of record",
            text: "We hand over a QA/QC dossier the engineer of record can review: certificates, panel and weld logs, test results, repairs and as-builts.",
          },
        ],
      },
      {
        id: "mine-proof",
        label: "Scale",
        title: "Built at Mine Scale",
        kind: "table",
        rows: [
          {
            label: "TSF lining",
            value: "1.2 million m² lithium-mine TSF lining reference in Mali",
          },
          { label: "Installed", value: "More than 15 million m² installed across the Group" },
          { label: "Reach", value: "Materials supplied to over 30 countries" },
        ],
      },
    ],
  },
  "water-utilities-irrigation": {
    headline: "Geosynthetic Structures We Build for Water",
    summary:
      "We supply and install the linings, covers and drainage that hold and move water: reservoirs, dams, canals, treatment ponds and storage, for utilities, municipalities and irrigation schemes across Africa.",
    structuresTitle: "What We Build for Water Infrastructure",
    structures: [
      {
        name: "Reservoirs & Dams",
        what: "We line new reservoirs and reline leaking dams with HDPE, LLDPE, PVC or EPDM, with protection geotextiles, anchor trenches and factory-made pipe boots.",
        products: [P.hdpe, P.lldpe, P.pvc, P.epdm, P.nonwoven],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "reservoir-dam-lining",
      },
      {
        name: "Potable Water Storage & Concrete Tanks",
        what: "We line concrete reservoirs and tanks with EVA and approved potable-grade membranes, fixed with termination profiles and welded on site.",
        products: [P.eva, P.hdpe, P.polylock],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "reservoir-dam-lining",
      },
      {
        name: "Floating Covers",
        what: "We fabricate and install floating covers that cut evaporation, block algae and protect stored water.",
        products: [P.rlldpe, P.hdpe],
        service: S("floating-cover-installation-africa", "Floating covers"),
        application: "floating-covers-evaporation-control",
      },
      {
        name: "Canals & Irrigation Channels",
        what: "We line canals with geomembrane, TILTEX™ GCCM or geocell-confined concrete, working in isolated sections to keep water flowing.",
        products: [P.hdpe, P.gccm, P.geocell, P.reno],
        service: S("gccm-channel-lining-contractor-africa", "GCCM channel lining"),
        application: "irrigation-canal-lining",
      },
      {
        name: "Wastewater Treatment Ponds",
        what: "We desludge ageing ponds with our own dewatering tubes, remove failed liners and reline with UV-resistant HDPE over protection geotextile.",
        products: [P.hdpe, P.flowtexTubes, P.nonwoven],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "wastewater-treatment-pond-lining",
      },
      {
        name: "Stormwater Attenuation",
        what: "We line attenuation ponds and storage, and install drainage and filtration layers to the outlet works.",
        products: [P.hdpe, P.gcl, P.geocell, P.subsoil, P.nonwoven],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "stormwater-attenuation-storage-lining",
      },
      {
        name: "Riverbanks & Outfalls",
        what: "We protect riverbanks, weirs and outfalls with gabions, Reno mattresses, sand containers and erosion blankets.",
        products: [P.gabionWelded, P.reno, P.sandNw, P.jute],
        service: S("gabion-installation-contractor-africa", "Gabion installation"),
        application: "coastal-protection",
      },
    ],
    sections: [
      {
        id: "water-quality",
        label: "Water Quality",
        title: "Built for Stored Water",
        kind: "list",
        items: [
          "We confirm drinking-water approval for the exact membrane we supply on potable storage",
          "We schedule relining around outage windows so supply keeps running",
          "We test every seam before a reservoir is released for filling",
          "We hand over filling, operating and maintenance guidance with the dossier",
        ],
      },
    ],
  },
  "waste-management-landfills": {
    headline: "Geosynthetic Structures We Build for Waste",
    summary:
      "We supply and install landfill basal liners, leachate systems, caps and ash containment, with layer-by-layer QA/QC records for every cell.",
    structuresTitle: "What We Build for Landfills & Ash Facilities",
    structures: [
      {
        name: "Landfill Cells (Basal Liners)",
        what: "We install composite liners of GCL and HDPE with cushion geotextiles and leak detection layers, cell by cell.",
        products: [P.hdpe, P.gcl, P.nonwoven, P.leakDetect],
        service: S("gcl-installation-contractor-africa", "GCL installation"),
        application: "landfill-ash-bund-lining",
      },
      {
        name: "Leachate Collection",
        what: "We install leachate drainage layers, collector pipes and filter geotextiles, and line leachate ponds.",
        products: [P.subsoil, P.leakDetect, P.nonwoven, P.hdpe],
        application: "drainage-filtration-systems-africa",
      },
      {
        name: "Landfill Capping & Closure",
        what: "We build engineered caps of LLDPE or GCL barrier, drainage composite and erosion-protected cover soil.",
        products: [P.lldpe, P.gcl, P.leakDetect, P.coir, P.geocell],
        service: S("gcl-installation-contractor-africa", "GCL installation"),
        application: "landfill-capping-closure",
      },
      {
        name: "Ash Dams & Bunds",
        what: "We line ash dams and secondary containment bunds and protect their slopes from erosion.",
        products: [P.hdpe, P.gcl, P.coir, P.geocell],
        application: "landfill-ash-bund-lining",
      },
      {
        name: "Sludge Dewatering",
        what: "We dewater sludge and leachate solids in tubes we fabricate, reducing volume before disposal.",
        products: [P.flowtexTubes, P.geotube],
        service: S("manufacturing-fabrication", "Manufacturing & fabrication"),
        application: "sludge-dewatering",
      },
    ],
    sections: [
      {
        id: "cell-qaqc",
        label: "Cell QA/QC",
        title: "Layer-by-Layer Evidence",
        kind: "steps",
        steps: [
          {
            title: "Subgrade release",
            text: "We accept and record each cell subgrade before deployment.",
          },
          {
            title: "GCL overlaps",
            text: "We check overlaps and hydration protection on every GCL panel.",
          },
          { title: "Seam testing", text: "We test every geomembrane seam and log every repair." },
          {
            title: "Covering release",
            text: "We release each layer for cover only once it has passed, with leak-location surveys where specified.",
          },
        ],
      },
    ],
  },
  "transport-infrastructure": {
    headline: "Geosynthetic Structures We Build for Roads & Rail",
    summary:
      "We supply and install the geogrids, geotextiles, interlayers, drainage and reinforced-soil systems that make roads, railways and civil platforms last longer on African ground.",
    structuresTitle: "What We Build for Transport & Civil Works",
    structures: [
      {
        name: "Stabilised Road & Rail Foundations",
        what: "We stabilise subgrade and sub-ballast with Tensar® TriAx® and InterAx® geogrids and separation geotextiles, reducing layer thickness and rutting.",
        products: [P.triax, P.interax, P.biaxial, P.woven, P.nonwoven],
        application: "roads-railways",
      },
      {
        name: "Reinforced Embankments & Soft Ground",
        what: "We build embankments over soft ground with basal reinforcement and PVDs that speed up consolidation.",
        products: [P.uniaxial, P.composite, P.pvd, P.woven],
        application: "soft-ground-consolidation-vertical-drains",
      },
      {
        name: "MSE Walls & Bridge Approaches",
        what: "We supply and build MSE walls and reinforced slopes with Tensar® uniaxial geogrids and polymeric geostrips.",
        products: [P.uniaxial, P.geostrips, P.nonwoven],
        application: "mse-retaining-wall-geogrids",
      },
      {
        name: "Gabion Walls & Culvert Protection",
        what: "We build gabion retaining walls, culvert headwalls and scour protection from our own welded mesh baskets and Reno mattresses.",
        products: [P.gabionWelded, P.gabionWoven, P.reno],
        service: S("gabion-installation-contractor-africa", "Gabion installation"),
        application: "retaining-wall-systems",
      },
      {
        name: "Asphalt Rehabilitation",
        what: "We supply glass fibre grids and paving fabrics that slow reflective cracking in asphalt overlays.",
        products: [P.glassGrid, P.pavingFabric],
        application: "roads-railways",
      },
      {
        name: "Road Drainage & Ducting",
        what: "We install subsoil drains, strip drains and cable ducts along road and rail corridors.",
        products: [P.subsoil, P.stripDrain, P.duct, P.structured],
        application: "drainage-filtration-systems-africa",
      },
      {
        name: "Slopes, Cuttings & Channels",
        what: "We protect cuttings, embankments and side drains with geocells, erosion blankets and TILTEX™ GCCM.",
        products: [P.geocell, P.coir, P.jute, P.gccm],
        application: "slope-erosion-protection",
      },
    ],
    sections: [
      {
        id: "function",
        label: "Right Product, Right Function",
        title: "Function First",
        kind: "table",
        rows: [
          {
            label: "Stabilisation",
            value: "Tensar® TriAx® and InterAx® geogrids confining aggregate",
          },
          {
            label: "Reinforcement",
            value: "Uniaxial geogrids and geostrips carrying tensile load in walls and slopes",
          },
          { label: "Separation & filtration", value: "Woven and nonwoven geotextiles" },
          { label: "Asphalt rehabilitation", value: "Glass fibre grids and paving fabrics" },
        ],
      },
    ],
  },
  "agriculture-aquaculture": {
    headline: "Geosynthetic Structures We Build for Farms",
    summary:
      "We supply and install farm dams, irrigation reservoirs, aquaculture ponds, canals, covers and ground stabilisation for African agriculture.",
    structuresTitle: "What We Build for Agriculture & Aquaculture",
    structures: [
      {
        name: "Farm Dams & Irrigation Reservoirs",
        what: "We line farm dams and irrigation storage with HDPE, LLDPE or PVC, sized to your pumping and irrigation programme.",
        products: [P.hdpe, P.lldpe, P.pvc, P.nonwoven],
        service: S("geomembrane-liner-installation-africa", "Geomembrane installation"),
        application: "agricultural-aquaculture-pond-lining",
      },
      {
        name: "Aquaculture Ponds",
        what: "We line fish and shrimp ponds with fish-safe membranes and detail inlets, outlets and harvest points.",
        products: [P.hdpe, P.lldpe, P.epdm],
        application: "agricultural-aquaculture-pond-lining",
      },
      {
        name: "Canals & Furrows",
        what: "We line irrigation canals with geomembrane or TILTEX™ GCCM to stop seepage losses.",
        products: [P.hdpe, P.gccm],
        application: "irrigation-canal-lining",
      },
      {
        name: "Evaporation Covers",
        what: "We fabricate and install floating covers that keep irrigation water in the dam.",
        products: [P.rlldpe],
        service: S("floating-cover-installation-africa", "Floating covers"),
        application: "floating-covers-evaporation-control",
      },
      {
        name: "Farm Roads, Yards & Ground Cover",
        what: "We stabilise farm roads and yards with geogrids and BERA® pavers, and supply weed-control ground cover.",
        products: [P.biaxial, P.beraGravel, P.beraGrass, P.weedBlock],
        application: "stabilisation-reinforcement",
      },
    ],
    sections: [],
  },
  "energy-power-generation": {
    headline: "Geosynthetic Structures We Build for Energy",
    summary:
      "We supply and install ash containment, process-water dams, dewatering, access roads and site drainage for power stations, solar and energy projects across Africa.",
    structuresTitle: "What We Build for Power & Energy",
    structures: [
      {
        name: "Ash Dams & Disposal Facilities",
        what: "We line ash disposal facilities and return-water dams and protect their walls from erosion.",
        products: [P.hdpe, P.gcl, P.coir, P.geocell],
        application: "landfill-ash-bund-lining",
      },
      {
        name: "Process Water & Cooling Water Dams",
        what: "We line process and cooling-water dams and install leak detection.",
        products: [P.hdpe, P.leakDetect, P.nonwoven],
        application: "process-water-pollution-control-dam-lining",
      },
      {
        name: "Sludge Dewatering",
        what: "We dewater pond sludge in tubes we fabricate, so ponds return to service.",
        products: [P.flowtexTubes, P.geotube],
        application: "sludge-dewatering",
      },
      {
        name: "Solar Farm Roads & Ground Cover",
        what: "We stabilise solar farm access roads with geogrids and geocells, and supply ground cover between arrays.",
        products: [P.triax, P.geocell, P.weedBlock, P.beraGravel],
        application: "stabilisation-reinforcement",
      },
      {
        name: "Site Drainage & Cable Ducts",
        what: "We install subsoil drainage and cable ducting across energy sites.",
        products: [P.subsoil, P.duct, P.structured],
        application: "drainage-filtration-systems-africa",
      },
    ],
    sections: [],
  },
  "oil-gas-petrochemical": {
    headline: "Geosynthetic Structures We Build for Oil, Gas & Fuel",
    summary:
      "We supply and install secondary containment, fuel-depot bunds, process-water lining, concrete protection and sediment control for oil, gas and petrochemical facilities.",
    structuresTitle: "What We Build for Oil, Gas & Petrochemical Sites",
    structures: [
      {
        name: "Tank Farm Bunds & Secondary Containment",
        what: "We line bunds and secondary containment with chemically compatible geomembranes or GCL, detailed around tanks and pipework.",
        products: [P.hdpe, P.gclHdpe, P.gcl, P.nonwoven],
        application: "landfill-ash-bund-lining",
      },
      {
        name: "Stormwater & Process Water Ponds",
        what: "We line stormwater attenuation and process-water ponds at depots and plants, with geocell and GCL where specified.",
        products: [P.hdpe, P.gcl, P.geocell],
        application: "stormwater-attenuation-storage-lining",
      },
      {
        name: "Concrete Protection",
        what: "We install GSE® Studliner® in sumps, separators and channels to protect concrete from aggressive liquids.",
        products: [P.studliner],
        service: S("concrete-lining-protection", "Concrete protection"),
        application: "concrete-protection-lining",
      },
      {
        name: "Marine Works Sediment Control",
        what: "We deploy silt curtains and place sand containers for jetty, pipeline and port works.",
        products: [P.siltCurtain, P.sandW, P.sandNw],
        service: S("silt-curtain-deployment", "Silt curtain deployment"),
        application: "sediment-control-silt-curtains-fences",
      },
      {
        name: "Access Roads & Laydown Areas",
        what: "We stabilise access roads, pipe yards and laydown areas with geogrids and geocells.",
        products: [P.triax, P.geocell, P.woven],
        application: "stabilisation-reinforcement",
      },
    ],
    sections: [],
  },
  "environmental-remediation": {
    headline: "Geosynthetic Structures We Build for Remediation",
    summary:
      "We supply and install caps, containment, dewatering, sediment control and rehabilitation systems for contaminated land, rivers, coastlines and mine closure.",
    structuresTitle: "What We Build for Environmental Works",
    structures: [
      {
        name: "Containment Caps & Cut-offs",
        what: "We cap contaminated land and closed facilities with geomembrane, GCL and drainage layers.",
        products: [P.lldpe, P.gcl, P.leakDetect, P.nonwoven],
        application: "landfill-capping-closure",
      },
      {
        name: "Dredging & Sludge Dewatering",
        what: "We dewater dredged sediment and sludge in tubes we fabricate and contain the work with silt curtains.",
        products: [P.flowtexTubes, P.geotube, P.siltCurtain],
        application: "sludge-dewatering",
      },
      {
        name: "River Rehabilitation",
        what: "We stabilise riverbanks with erosion blankets, gabions and sand containers. We supplied 210,000 m² of Jute SoilLock™ 292 to a single river-rehabilitation programme in Zimbabwe.",
        products: [P.jute, P.coir, P.gabionWelded, P.reno, P.sandNw],
        service: S("bioengineering-revegetation", "Erosion control & revegetation"),
        application: "slope-erosion-protection",
      },
      {
        name: "Coastal Protection",
        what: "We build sand-container revetments, groynes and scour aprons from containers we manufacture.",
        products: [P.sandNw, P.sandW, P.nonwoven],
        service: S("sand-container-installation", "Sand container installation"),
        application: "coastal-protection",
      },
      {
        name: "Mine Closure & Land Rehabilitation",
        what: "We rehabilitate slopes and dumps with coir, jute, straw and wood-wool blankets and geocells.",
        products: [P.coir, P.jute, P.straw, P.woodWool, P.geocell],
        service: S("bioengineering-revegetation", "Erosion control & revegetation"),
        application: "slope-erosion-protection",
      },
      {
        name: "Construction Sediment Control",
        what: "We install silt fences and silt curtains that keep sediment on site and out of watercourses.",
        products: [P.siltFence, P.siltCurtain],
        application: "sediment-control-silt-curtains-fences",
      },
    ],
    sections: [],
  },
};

/** Every distinct catalogue product used across an industry's structures. */
export function industryProducts(profile: IndustryProfile): ProductLink[] {
  const seen = new Map<string, ProductLink>();
  for (const structure of profile.structures) {
    for (const product of structure.products) seen.set(product.href, product);
  }
  return [...seen.values()];
}
