/**
 * The layered system we build for each application, listed top to bottom,
 * with the catalogue product family for each layer and the industries we build it for.
 */
export interface SystemLayer {
  name: string;
  role: string;
  product?: { label: string; href: string };
  kind: "load" | "barrier" | "protection" | "drainage" | "reinforcement" | "ground" | "cover";
}

export interface ApplicationSystem {
  title: string;
  layers: SystemLayer[];
  industries: { label: string; slug: string }[];
}

const L = {
  hdpe: { label: "HDPE geomembranes", href: "/products/geomembrane-liners/hdpe-geomembranes" },
  lldpe: {
    label: "LLDPE geomembranes",
    href: "/products/geomembrane-liners/lldpe-geomembrane-liners",
  },
  rlldpe: {
    label: "rLLDPE floating cover membranes",
    href: "/products/geomembrane-liners/floating-cover-geomembranes",
  },
  gcl: {
    label: "Eurobent® GCL",
    href: "/products/geosynthetic-clay-liners/reinforced-sodium-bentonite-geosynthetic-clay-liners",
  },
  nonwoven: {
    label: "MIRAFI® nonwoven geotextiles",
    href: "/products/geotextile-fabrics/polypropylene-non-woven-geotextiles",
  },
  woven: {
    label: "PolyTape™ woven geotextiles",
    href: "/products/geotextile-fabrics/polypropylene-woven-geotextiles",
  },
  leak: {
    label: "Leak detection drainage sheets",
    href: "/products/pipes-drainage-ducting/leak-detection-drainage-sheets",
  },
  pipe: {
    label: "Subsoil drainage pipes",
    href: "/products/pipes-drainage-ducting/subsoil-drainage-pipes",
  },
  triax: { label: "Tensar® TriAx® geogrids", href: "/products/Geogrids/triaxial-geogrids" },
  uniaxial: {
    label: "Uniaxial geogrids",
    href: "/products/geogrids-interlayers/uniaxial-geogrids",
  },
  geocell: {
    label: "GeoStrata™ HDPE geocells",
    href: "/products/erosion-control-geocells/geostrata-hdpe-geocells",
  },
  coir: {
    label: "Coir SoilLock™ blankets",
    href: "/products/erosion-control-geocells/coir-fibre-soil-blankets",
  },
  gccm: {
    label: "TILTEX™ GCCM",
    href: "/products/waterproofing-concrete-protection/flexible-concrete-liner-system-for-africa-tiltex-gccm",
  },
  gabion: {
    label: "Welded mesh gabions",
    href: "/products/gabion-baskets/square-weld-mesh-gabion-baskets",
  },
  sand: {
    label: "FlowTex™ sand containers",
    href: "/products/geosynthetic-sand-containers/geotextile-sand-bags",
  },
  pvd: {
    label: "Prefabricated vertical drains",
    href: "/products/pipes-drainage-ducting/prefabricated-vertical-drains-pvds",
  },
  studliner: {
    label: "GSE® Studliner®",
    href: "/products/waterproofing-concrete-protection/studded-hdpe-concrete-liners-cpl",
  },
  dimpled: {
    label: "Dimpled drainage sheets",
    href: "/products/pipes-drainage-ducting/dimpled-drainage-boards",
  },
  tubes: {
    label: "FlowTex™ dewatering tubes",
    href: "/products/dewatering-systems/flowtex-dewatering-tubes-bags",
  },
  curtain: {
    label: "GeoCurtain™ silt curtains",
    href: "/products/dewatering-systems/geo-curtain-silt-turbidity-curtains",
  },
  glass: { label: "Glass fibre asphalt grids", href: "/products/Geogrids/glass-asphalt-geogrid" },
};

const I = {
  mining: { label: "Mining", slug: "mining-minerals-processing" },
  water: { label: "Water & Irrigation", slug: "water-utilities-irrigation" },
  waste: { label: "Waste & Landfills", slug: "waste-management-landfills" },
  transport: { label: "Roads & Rail", slug: "transport-infrastructure" },
  agri: { label: "Agriculture & Aquaculture", slug: "agriculture-aquaculture" },
  energy: { label: "Energy & Power", slug: "energy-power-generation" },
  oil: { label: "Oil, Gas & Petrochemical", slug: "oil-gas-petrochemical" },
  env: { label: "Environmental & Remediation", slug: "environmental-remediation" },
};

const subgrade: SystemLayer = {
  name: "Prepared subgrade",
  role: "Compacted, smooth and accepted by us before any layer goes down",
  kind: "ground",
};

export const APPLICATION_SYSTEMS: Record<string, ApplicationSystem> = {
  "tailings-storage-facility-lining": {
    title: "The TSF Liner System We Build",
    industries: [I.mining],
    layers: [
      { name: "Tailings", role: "Deposited slurry and supernatant pool", kind: "load" },
      {
        name: "Primary barrier",
        role: "HDPE geomembrane, smooth or textured, every seam welded and tested",
        product: L.hdpe,
        kind: "barrier",
      },
      {
        name: "Secondary barrier",
        role: "GCL beneath the HDPE as a self-sealing backup, where specified",
        product: L.gcl,
        kind: "barrier",
      },
      {
        name: "Leak detection & underdrainage",
        role: "Drainage composite and slotted pipes to monitor and collect",
        product: L.leak,
        kind: "drainage",
      },
      {
        name: "Cushion",
        role: "Nonwoven geotextile protecting the liner from puncture",
        product: L.nonwoven,
        kind: "protection",
      },
      subgrade,
    ],
  },
  "heap-leach-pad-lining": {
    title: "The Heap Leach Pad System We Build",
    industries: [I.mining],
    layers: [
      { name: "Ore heap", role: "Stacked ore under irrigation", kind: "load" },
      {
        name: "Overliner & solution collection",
        role: "Drainage gravel with perforated collection pipes",
        product: L.pipe,
        kind: "drainage",
      },
      {
        name: "Cushion",
        role: "Nonwoven geotextile protecting the barrier from the overliner",
        product: L.nonwoven,
        kind: "protection",
      },
      {
        name: "Barrier",
        role: "HDPE or LLDPE geomembrane, welded and tested",
        product: L.hdpe,
        kind: "barrier",
      },
      {
        name: "Low-permeability layer",
        role: "GCL or compacted soil liner under the geomembrane",
        product: L.gcl,
        kind: "barrier",
      },
      subgrade,
    ],
  },
  "process-water-pollution-control-dam-lining": {
    title: "The PCD & Process Water Dam System We Build",
    industries: [I.mining, I.energy, I.oil],
    layers: [
      { name: "Stored water", role: "Process, return or contaminated stormwater", kind: "load" },
      {
        name: "Primary liner",
        role: "HDPE geomembrane with factory-made pipe boots",
        product: L.hdpe,
        kind: "barrier",
      },
      {
        name: "Leak detection layer",
        role: "Drainage composite between liners, draining to a monitored sump",
        product: L.leak,
        kind: "drainage",
      },
      {
        name: "Secondary liner",
        role: "HDPE or GCL, depending on the design class",
        product: L.gcl,
        kind: "barrier",
      },
      { name: "Cushion", role: "Nonwoven geotextile", product: L.nonwoven, kind: "protection" },
      subgrade,
    ],
  },
  "reservoir-dam-lining": {
    title: "The Reservoir Lining System We Build",
    industries: [I.water, I.agri, I.mining],
    layers: [
      {
        name: "Floating cover (optional)",
        role: "rLLDPE cover against evaporation and algae",
        product: L.rlldpe,
        kind: "cover",
      },
      { name: "Stored water", role: "Raw, irrigation or potable water", kind: "load" },
      {
        name: "Liner",
        role: "HDPE or flexible geomembrane, anchored in perimeter trenches",
        product: L.hdpe,
        kind: "barrier",
      },
      {
        name: "Protection",
        role: "Nonwoven geotextile over stones and roots",
        product: L.nonwoven,
        kind: "protection",
      },
      {
        name: "Underdrainage",
        role: "Drains that relieve groundwater and gas under the liner",
        product: L.pipe,
        kind: "drainage",
      },
      subgrade,
    ],
  },
  "irrigation-canal-lining": {
    title: "The Canal Lining System We Build",
    industries: [I.water, I.agri, I.mining],
    layers: [
      { name: "Flowing water", role: "Irrigation or stormwater flow", kind: "load" },
      {
        name: "Armour",
        role: "TILTEX™ GCCM or geocell-confined concrete against erosion",
        product: L.gccm,
        kind: "cover",
      },
      {
        name: "Seepage barrier",
        role: "HDPE geomembrane where seepage must stop",
        product: L.hdpe,
        kind: "barrier",
      },
      { name: "Protection", role: "Nonwoven geotextile", product: L.nonwoven, kind: "protection" },
      { name: "Trimmed channel", role: "Shaped and compacted canal profile", kind: "ground" },
    ],
  },
  "landfill-ash-bund-lining": {
    title: "The Landfill Basal Liner System We Build",
    industries: [I.waste, I.energy, I.oil],
    layers: [
      { name: "Waste or ash", role: "Placed in cells over the drainage layer", kind: "load" },
      {
        name: "Leachate drainage",
        role: "Gravel or composite drainage with collector pipes",
        product: L.pipe,
        kind: "drainage",
      },
      {
        name: "Cushion",
        role: "Heavy nonwoven geotextile protecting the liner",
        product: L.nonwoven,
        kind: "protection",
      },
      {
        name: "Geomembrane",
        role: "HDPE, welded and tested cell by cell",
        product: L.hdpe,
        kind: "barrier",
      },
      { name: "GCL", role: "Composite barrier under the HDPE", product: L.gcl, kind: "barrier" },
      subgrade,
    ],
  },
  "landfill-capping-closure": {
    title: "The Landfill Cap We Build",
    industries: [I.waste, I.mining, I.env],
    layers: [
      {
        name: "Vegetated cover",
        role: "Topsoil protected by erosion blankets until grass takes",
        product: L.coir,
        kind: "cover",
      },
      { name: "Cover soil", role: "Protects the barrier from roots and weather", kind: "load" },
      {
        name: "Drainage layer",
        role: "Drainage composite shedding infiltration",
        product: L.leak,
        kind: "drainage",
      },
      {
        name: "Barrier",
        role: "LLDPE geomembrane or GCL that tolerates settlement",
        product: L.lldpe,
        kind: "barrier",
      },
      {
        name: "Gas layer & regulating layer",
        role: "Venting gas and smoothing the waste surface",
        kind: "ground",
      },
    ],
  },
  "stabilisation-reinforcement": {
    title: "The Stabilised Road & Platform We Build",
    industries: [I.mining, I.transport, I.energy, I.oil],
    layers: [
      { name: "Traffic", role: "Haul trucks, cranes or site vehicles", kind: "load" },
      { name: "Aggregate base", role: "Thinner layer thanks to stabilisation", kind: "load" },
      {
        name: "Stabilisation",
        role: "Tensar® TriAx® geogrid or HDPE geocell confining the aggregate",
        product: L.triax,
        kind: "reinforcement",
      },
      {
        name: "Separation",
        role: "Woven geotextile keeping fines out of the base",
        product: L.woven,
        kind: "protection",
      },
      { name: "Weak subgrade", role: "Soft or variable natural ground", kind: "ground" },
    ],
  },
  "slope-erosion-protection": {
    title: "The Slope Protection System We Build",
    industries: [I.mining, I.transport, I.env, I.water],
    layers: [
      { name: "Vegetation", role: "Grass established through the blanket", kind: "cover" },
      {
        name: "Erosion blanket",
        role: "Coir, jute or straw SoilLock™ pinned in full soil contact",
        product: L.coir,
        kind: "protection",
      },
      {
        name: "Geocells (steep or high-flow areas)",
        role: "Confined topsoil, rock or concrete",
        product: L.geocell,
        kind: "reinforcement",
      },
      {
        name: "Seeded topsoil",
        role: "Seed and topsoil placed before the blanket",
        kind: "ground",
      },
      { name: "Trimmed slope", role: "With crest anchor trench", kind: "ground" },
    ],
  },
  "retaining-wall-systems": {
    title: "The Retaining Wall Systems We Build",
    industries: [I.mining, I.transport],
    layers: [
      {
        name: "Gabion wall",
        role: "Welded mesh gabions we manufacture, rock-filled",
        product: L.gabion,
        kind: "load",
      },
      {
        name: "Reinforced fill (MSE)",
        role: "Uniaxial geogrid layers tied to the facing",
        product: L.uniaxial,
        kind: "reinforcement",
      },
      {
        name: "Filter",
        role: "Nonwoven geotextile behind the facing",
        product: L.nonwoven,
        kind: "protection",
      },
      {
        name: "Drainage",
        role: "Drains relieving water pressure behind the wall",
        product: L.pipe,
        kind: "drainage",
      },
      { name: "Foundation", role: "Levelled and compacted", kind: "ground" },
    ],
  },
  "mse-retaining-wall-geogrids": {
    title: "The MSE Wall We Build",
    industries: [I.mining, I.transport],
    layers: [
      { name: "Facing", role: "Blocks, panels, gabions or wrap-around", kind: "load" },
      {
        name: "Reinforcement",
        role: "Tensar® uniaxial geogrids or geostrips at design spacing",
        product: L.uniaxial,
        kind: "reinforcement",
      },
      { name: "Reinforced fill", role: "Compacted granular fill, lift by lift", kind: "load" },
      {
        name: "Drainage & filter",
        role: "Drains and geotextile filter",
        product: L.nonwoven,
        kind: "drainage",
      },
      { name: "Foundation", role: "Accepted before the first lift", kind: "ground" },
    ],
  },
  "drainage-filtration-systems-africa": {
    title: "The Drainage System We Build",
    industries: [I.mining, I.transport, I.waste],
    layers: [
      { name: "Backfill", role: "Soil or fill around the drain", kind: "load" },
      {
        name: "Filter",
        role: "Nonwoven geotextile holding back fines",
        product: L.nonwoven,
        kind: "protection",
      },
      {
        name: "Drainage medium",
        role: "Aggregate or drainage composite",
        product: L.dimpled,
        kind: "drainage",
      },
      {
        name: "Collector pipe",
        role: "Slotted pipe to the outlet",
        product: L.pipe,
        kind: "drainage",
      },
      { name: "Trench base", role: "Graded to fall", kind: "ground" },
    ],
  },
  "coastal-protection": {
    title: "The Coastal Revetment We Build",
    industries: [I.env, I.oil, I.water],
    layers: [
      { name: "Wave attack", role: "Waves, currents and scour", kind: "load" },
      {
        name: "Armour",
        role: "Sand containers we manufacture, in stretcher bond",
        product: L.sand,
        kind: "cover",
      },
      {
        name: "Toe protection",
        role: "Containers or gabions against undermining",
        product: L.gabion,
        kind: "reinforcement",
      },
      {
        name: "Filter underliner",
        role: "Shingle-lapped nonwoven geotextile",
        product: L.nonwoven,
        kind: "protection",
      },
      { name: "Shaped bank", role: "Excavated to firm base", kind: "ground" },
    ],
  },
  "roads-railways": {
    title: "The Road & Rail Build-Up We Supply",
    industries: [I.transport, I.mining],
    layers: [
      {
        name: "Asphalt overlay",
        role: "Glass fibre grid against reflective cracking",
        product: L.glass,
        kind: "cover",
      },
      {
        name: "Base & sub-base",
        role: "Stabilised with Tensar® geogrids",
        product: L.triax,
        kind: "reinforcement",
      },
      { name: "Separation", role: "Woven geotextile", product: L.woven, kind: "protection" },
      {
        name: "Side drains",
        role: "Subsoil drains along the formation",
        product: L.pipe,
        kind: "drainage",
      },
      { name: "Subgrade", role: "Natural or improved ground", kind: "ground" },
    ],
  },
  "sludge-dewatering": {
    title: "The Dewatering Set-Up We Build",
    industries: [I.mining, I.water, I.waste, I.env, I.energy],
    layers: [
      {
        name: "Dewatering tubes",
        role: "FlowTex™ tubes we fabricate, filled in controlled cycles",
        product: L.tubes,
        kind: "load",
      },
      { name: "Drainage layer", role: "Aggregate carrying filtrate away", kind: "drainage" },
      {
        name: "Lined pad",
        role: "HDPE geomembrane capturing filtrate",
        product: L.hdpe,
        kind: "barrier",
      },
      { name: "Protection", role: "Nonwoven geotextile", product: L.nonwoven, kind: "protection" },
      subgrade,
    ],
  },
  "floating-covers-evaporation-control": {
    title: "The Floating Cover System We Build",
    industries: [I.water, I.agri, I.mining],
    layers: [
      {
        name: "Cover membrane",
        role: "FC45/FC60 rLLDPE, CSPE or rFPP panels fabricated in our facility",
        product: L.rlldpe,
        kind: "cover",
      },
      {
        name: "Floats & ballast",
        role: "Flotation logs and weighted troughs guiding rainwater to sumps",
        kind: "drainage",
      },
      { name: "Stored water", role: "Protected from evaporation and sunlight", kind: "load" },
      {
        name: "Reservoir liner",
        role: "HDPE or existing lining, anchored with the cover",
        product: L.hdpe,
        kind: "barrier",
      },
    ],
  },
  "wastewater-treatment-pond-lining": {
    title: "The Wastewater Pond System We Build",
    industries: [I.water, I.agri],
    layers: [
      { name: "Effluent", role: "Treatment pond contents", kind: "load" },
      {
        name: "UV-resistant liner",
        role: "HDPE geomembrane, exposed edges included",
        product: L.hdpe,
        kind: "barrier",
      },
      { name: "Protection", role: "Nonwoven geotextile", product: L.nonwoven, kind: "protection" },
      {
        name: "Underdrainage",
        role: "Gas and groundwater relief",
        product: L.pipe,
        kind: "drainage",
      },
      subgrade,
    ],
  },
  "agricultural-aquaculture-pond-lining": {
    title: "The Farm & Aquaculture Pond System We Build",
    industries: [I.agri],
    layers: [
      { name: "Water", role: "Irrigation storage or stocked pond", kind: "load" },
      {
        name: "Liner",
        role: "HDPE or LLDPE, anchored at the crest",
        product: L.hdpe,
        kind: "barrier",
      },
      { name: "Protection", role: "Nonwoven geotextile", product: L.nonwoven, kind: "protection" },
      subgrade,
    ],
  },
  "concrete-protection-lining": {
    title: "The Concrete Protection System We Build",
    industries: [I.oil, I.water, I.mining],
    layers: [
      { name: "Aggressive liquid or gas", role: "Sewage, acids or process liquids", kind: "load" },
      {
        name: "Studded HDPE liner",
        role: "GSE® Studliner® cast in, every seam spark or vacuum tested",
        product: L.studliner,
        kind: "barrier",
      },
      { name: "Concrete structure", role: "Tank, sump, manhole or channel", kind: "ground" },
    ],
  },
  "soft-ground-consolidation-vertical-drains": {
    title: "The Soft-Ground System We Build",
    industries: [I.transport, I.mining],
    layers: [
      { name: "Embankment or surcharge", role: "Load that drives consolidation", kind: "load" },
      {
        name: "Basal reinforcement",
        role: "Uniaxial or composite geogrid",
        product: L.uniaxial,
        kind: "reinforcement",
      },
      {
        name: "Drainage blanket",
        role: "Sand layer collecting water from the drains",
        kind: "drainage",
      },
      {
        name: "Vertical drains",
        role: "PVDs on a grid through the soft clay",
        product: L.pvd,
        kind: "drainage",
      },
      { name: "Soft clay", role: "Consolidating under load", kind: "ground" },
    ],
  },
  "green-roof-podium-drainage": {
    title: "The Green Roof Build-Up We Supply",
    industries: [I.transport],
    layers: [
      { name: "Planting & growing medium", role: "Landscaping", kind: "cover" },
      {
        name: "Filter",
        role: "Nonwoven geotextile keeping fines out of the drain",
        product: L.nonwoven,
        kind: "protection",
      },
      {
        name: "Drainage",
        role: "Dimpled drainage sheet to outlets",
        product: L.dimpled,
        kind: "drainage",
      },
      {
        name: "Protection & root barrier",
        role: "Protecting the waterproofing",
        kind: "protection",
      },
      { name: "Waterproofing & slab", role: "By the roofing system", kind: "ground" },
    ],
  },
  "sediment-control-silt-curtains-fences": {
    title: "The Sediment Control We Build",
    industries: [I.mining, I.env, I.oil, I.transport],
    layers: [
      { name: "Work zone", role: "Dredging, piling or earthworks", kind: "load" },
      {
        name: "Silt curtain (in water)",
        role: "GeoCurtain™ Class 1 to 3, anchored to the survey",
        product: L.curtain,
        kind: "cover",
      },
      {
        name: "Silt fence (on land)",
        role: "PolyTape™ fence with buried toe",
        product: L.woven,
        kind: "protection",
      },
      {
        name: "Protected receiving water",
        role: "Rivers, dams, intakes and habitats",
        kind: "ground",
      },
    ],
  },
  "stormwater-attenuation-storage-lining": {
    title: "The Attenuation Pond System We Build",
    industries: [I.water, I.oil, I.transport],
    layers: [
      { name: "Stormwater", role: "Held and released at a controlled rate", kind: "load" },
      { name: "Liner", role: "HDPE geomembrane or GCL", product: L.hdpe, kind: "barrier" },
      {
        name: "Slope protection",
        role: "Geocells where flows scour",
        product: L.geocell,
        kind: "reinforcement",
      },
      { name: "Protection", role: "Nonwoven geotextile", product: L.nonwoven, kind: "protection" },
      subgrade,
    ],
  },
};
