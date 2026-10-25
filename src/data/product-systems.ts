import type { ServiceSection } from "@/data/service-delivery";

/**
 * Product category "system" content, shown as tabs on every category and family page.
 * Written in our own voice: what each product builds, how to choose it, what we
 * supply / manufacture / install, and how we test it.
 */
export interface ProductSystem {
  intro: string;
  industries: { label: string; slug: string }[];
  manufactured?: { label: string; anchor: string }[];
  install?: { label: string; slug: string };
  tabs: ServiceSection[];
}

const IND = {
  mining: { label: "Mining", slug: "mining-minerals-processing" },
  water: { label: "Water & Irrigation", slug: "water-utilities-irrigation" },
  waste: { label: "Waste & Landfills", slug: "waste-management-landfills" },
  transport: { label: "Roads & Rail", slug: "transport-infrastructure" },
  agri: { label: "Agriculture & Aquaculture", slug: "agriculture-aquaculture" },
  energy: { label: "Energy & Power", slug: "energy-power-generation" },
  oil: { label: "Oil, Gas & Petrochemical", slug: "oil-gas-petrochemical" },
  env: { label: "Environmental & Remediation", slug: "environmental-remediation" },
};

const WELD_STEPS = [
  {
    title: "Trial welds",
    text: "Every welder and machine runs a peel-tested trial weld at the start of each shift and at every change of operator or conditions.",
  },
  {
    title: "Air-pressure testing",
    text: "We pressure test every double-track fusion seam to ASTM D5820.",
  },
  {
    title: "Vacuum-box testing",
    text: "We vacuum test every extrusion weld, patch and detail to ASTM D5641.",
  },
  {
    title: "Destructive testing",
    text: "We cut seam samples at set intervals and test them in peel and shear to ASTM D6392.",
  },
];

export const PRODUCT_SYSTEMS: Record<string, ProductSystem> = {
  "geomembrane-liners": {
    intro:
      "We supply GRI-GM13 HDPE and the full range of flexible geomembranes, fabricate boots, panels and drop-in liners in our own facility, and install them with our IAGI-member welding crews.",
    industries: [IND.mining, IND.water, IND.waste, IND.agri, IND.energy, IND.oil],
    manufactured: [
      { label: "Drop-in liners", anchor: "made-drop-in-liners" },
      { label: "Floating covers", anchor: "made-floating-covers" },
      { label: "Pipe boots", anchor: "made-pipe-boots" },
      { label: "Panels, sumps & corners", anchor: "made-liner-details" },
    ],
    install: { label: "Geomembrane installation", slug: "geomembrane-liner-installation-africa" },
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build With Geomembranes",
        kind: "table",
        rows: [
          {
            label: "Tailings storage facilities",
            value: "HDPE basin and wall liners over GCL, with leak detection",
          },
          {
            label: "Pollution control & process water dams",
            value: "Single or double HDPE liners with leak detection",
          },
          {
            label: "Heap leach pads",
            value: "HDPE or LLDPE barrier under protection and collection layers",
          },
          { label: "Reservoirs, dams & canals", value: "HDPE, LLDPE, PVC or EPDM, new or relined" },
          { label: "Landfill cells & caps", value: "HDPE basal liners, LLDPE caps" },
          { label: "Floating covers", value: "rLLDPE or HDPE covers fabricated in our facility" },
          { label: "Concrete tanks", value: "EVA liners fixed with termination profiles" },
        ],
      },
      {
        id: "grades",
        label: "Grades & Selection",
        title: "Choosing the Right Membrane",
        kind: "table",
        rows: [
          {
            label: "HDPE",
            value:
              "GRI-GM13, smooth or textured, 1.0 to 3.0 mm. Best chemical resistance; first choice for mining and waste containment",
          },
          {
            label: "LLDPE",
            value: "More flexible than HDPE; suits caps, settlement and uneven ground",
          },
          {
            label: "rLLDPE",
            value: "Scrim-reinforced (e.g. FC45 at 1.14 mm) for exposed floating covers",
          },
          {
            label: "PVC & EPDM",
            value: "Flexible, easy to detail; farm dams, ponds and landscape water",
          },
          { label: "EVA", value: "1.5 mm flexible liner for concrete reservoirs and tanks" },
          {
            label: "Bituminous (BGM)",
            value: "Robust, puncture-resistant barrier for dams and canals",
          },
        ],
      },
      {
        id: "what-we-do",
        label: "Supply, Make & Install",
        title: "What We Do",
        kind: "list",
        items: [
          "We supply GSE® liners manufactured by Solmax and other globally recognised grades, with mill certificates for every roll",
          "We fabricate drop-in liners, floating cover panels, pipe boots, sumps and corners in our own facility",
          "We install with our own welding crews; Geosynthetics Africa is an IAGI Installer Member",
          "We hand over a QA/QC dossier with panel and weld logs, test results and as-builts",
        ],
      },
      {
        id: "testing",
        label: "Welding & Testing",
        title: "How We Test Every Seam",
        kind: "steps",
        steps: WELD_STEPS,
      },
    ],
  },
  "geosynthetic-clay-liners-gcl": {
    intro:
      "We supply Eurobent® reinforced and HDPE-backed GCLs and install them as stand-alone barriers or under HDPE in composite liners, controlling overlaps, hydration and cover.",
    industries: [IND.mining, IND.waste, IND.water, IND.oil],
    install: { label: "GCL installation", slug: "gcl-installation-contractor-africa" },
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build With GCL",
        kind: "table",
        rows: [
          {
            label: "Composite TSF & heap leach liners",
            value: "GCL under HDPE as a self-sealing secondary barrier",
          },
          { label: "Landfill basal liners", value: "GCL and HDPE composite liners, cell by cell" },
          { label: "Landfill caps", value: "GCL barrier under drainage and cover soil" },
          {
            label: "Bunds & secondary containment",
            value: "HDPE-backed GCL around tanks and pipework",
          },
          {
            label: "Reservoirs & canals",
            value: "Low-permeability lining that tolerates settlement",
          },
        ],
      },
      {
        id: "grades",
        label: "Grades & Selection",
        title: "Choosing a GCL",
        kind: "table",
        rows: [
          {
            label: "Reinforced sodium bentonite",
            value: "Needle-punched, 3,500 to 6,000 g/m² bentonite; slopes and composite liners",
          },
          {
            label: "HDPE-backed (coated)",
            value: "Bentonite with an HDPE coating for lower permeability and faster cover",
          },
          {
            label: "With HDPE or instead of it",
            value:
              "GCL under HDPE adds a self-sealing backup; HDPE stays the primary barrier for aggressive chemistry",
          },
        ],
      },
      {
        id: "install",
        label: "Installation Controls",
        title: "How We Install GCL",
        kind: "steps",
        steps: [
          { title: "Subgrade", text: "Firm, smooth and dry; we never deploy GCL over mud." },
          { title: "Same-day cover", text: "We deploy only what we can cover the same day." },
          {
            title: "Overlaps",
            text: "We hold minimum overlaps and add bentonite in the overlap zone.",
          },
          {
            title: "Cover",
            text: "We place a minimum 300 mm cover with low-ground-pressure equipment.",
          },
        ],
      },
    ],
  },
  "geotextile-fabrics": {
    intro:
      "We supply MIRAFI® nonwoven and PolyTape™ woven geotextiles from ISO 9001-certified mills, and make sand containers, dewatering tubes, filter socks and silt fence from them in our own facility.",
    industries: [IND.mining, IND.transport, IND.waste, IND.water, IND.env],
    manufactured: [
      { label: "Sand containers", anchor: "made-sand-containers" },
      { label: "Dewatering tubes", anchor: "made-dewatering-tubes" },
      { label: "Filter socks", anchor: "made-filter-socks" },
      { label: "Silt fence", anchor: "made-silt-fence" },
    ],
    tabs: [
      {
        id: "functions",
        label: "Functions",
        title: "What Geotextiles Do",
        kind: "table",
        rows: [
          { label: "Separation", value: "Keeps road and platform aggregate out of soft subgrade" },
          { label: "Filtration", value: "Lets water through drains while holding back soil" },
          { label: "Protection", value: "Cushions geomembranes from stones and puncture" },
          {
            label: "Reinforcement",
            value: "High-strength wovens add tensile strength over soft ground",
          },
        ],
      },
      {
        id: "grades",
        label: "Grades & Selection",
        title: "Woven or Nonwoven",
        kind: "table",
        rows: [
          {
            label: "MIRAFI® nonwoven (e.g. S51, 200 g/m²)",
            value: "Filtration, drainage and liner protection; heavier grades for cushioning",
          },
          {
            label: "PolyTape™ woven (e.g. WG30HF, 30 kN/m)",
            value: "Separation and stabilisation under roads and platforms",
          },
          {
            label: "Silt fence, root barrier & ground cover",
            value: "UV-stabilised PolyTape™ and WeedBlock™ fabrics",
          },
        ],
      },
      {
        id: "builds",
        label: "Structures It Builds",
        title: "Where We Use Geotextiles",
        kind: "list",
        items: [
          "Cushion under every geomembrane we install on TSFs, dams and landfills",
          "Separation under haul roads, rail formations and laydown areas",
          "Filters around subsoil drains, gabion walls and coastal revetments",
          "Fabric for the sand containers and dewatering tubes we manufacture",
        ],
      },
    ],
  },
  "geogrids-interlayers": {
    intro:
      "We supply Tensar® TriAx® and InterAx® stabilisation geogrids, uniaxial reinforcement grids, geostrips and asphalt interlayers, and build stabilised roads and reinforced walls with them.",
    industries: [IND.transport, IND.mining, IND.energy, IND.oil],
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build With Geogrids",
        kind: "table",
        rows: [
          {
            label: "Haul roads & access roads",
            value: "Stabilised with Tensar® TriAx® or InterAx®, thinner aggregate layers",
          },
          {
            label: "Platforms & laydown areas",
            value: "Stabilised working platforms over weak ground",
          },
          {
            label: "MSE walls & crusher walls",
            value: "Reinforced with uniaxial geogrids or geostrips",
          },
          {
            label: "Embankments over soft ground",
            value: "Basal reinforcement with uniaxial or composite grids",
          },
          {
            label: "Asphalt overlays",
            value: "Glass fibre grids and paving fabrics against reflective cracking",
          },
        ],
      },
      {
        id: "grades",
        label: "Grades & Selection",
        title: "Choosing by Function",
        kind: "table",
        rows: [
          {
            label: "Stabilisation",
            value: "Tensar® TriAx® (e.g. TX160) and InterAx® confine aggregate",
          },
          { label: "Two-way reinforcement", value: "Biaxial and composite geogrids" },
          {
            label: "One-way reinforcement",
            value:
              "Uniaxial geogrids (e.g. Tensar® RE520, MIRAGRID® GX 80/30) and TechStrap geostrips for walls and slopes",
          },
          { label: "Asphalt", value: "Glass fibre grids (e.g. 100/100) and paving fabric (SAMI)" },
        ],
      },
      {
        id: "install",
        label: "Installation Checks",
        title: "What We Check on Site",
        kind: "list",
        items: [
          "Grid grade and orientation against the design",
          "Overlaps and connections to the facing",
          "Fill placement without tracking directly on the grid",
          "Layer elevations and compaction records",
        ],
      },
    ],
  },
  "erosion-control-geocells": {
    intro:
      "We supply and install SoilLock™ jute, coir and straw blankets, EnviroWool and HDPE and woven PP geocells for slopes, TSF walls, channels and load support.",
    industries: [IND.mining, IND.transport, IND.env, IND.water],
    install: { label: "Erosion control & revegetation", slug: "bioengineering-revegetation" },
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build",
        kind: "table",
        rows: [
          { label: "TSF outer walls", value: "Coir SoilLock™ 450 mining grade, pinned and seeded" },
          {
            label: "Rehabilitated slopes & dumps",
            value: "Coir, jute, straw or wood-wool blankets with seeding",
          },
          {
            label: "Riverbanks",
            value: "Jute and coir blankets, with gabions or sand containers at the toe",
          },
          { label: "Steep embankments & channels", value: "Vegetated or concrete-filled geocells" },
          {
            label: "Haul roads & platforms",
            value: "Aggregate-filled HDPE geocells for load support",
          },
        ],
      },
      {
        id: "grades",
        label: "Blanket Selection",
        title: "Choosing a Blanket",
        kind: "table",
        rows: [
          {
            label: "Jute SoilLock™ 292",
            value: "292 g/m², 10 × 10 mm open weave, 12 to 24 months",
          },
          {
            label: "Coir SoilLock™ 350 / 450",
            value: "Civil and mining grades for steep, high-runoff slopes and TSFs, 2 to 3 years",
          },
          { label: "Straw SoilLock™ 300", value: "300 g/m² short-term cover on gentle slopes" },
          { label: "EnviroWool", value: "Wood-wool blanket, 2.45 m × 51.4 m rolls" },
          {
            label: "Geocells",
            value: "GeoStrata™ HDPE (50 to 200 mm) or PolyCell woven PP (75 to 150 mm)",
          },
        ],
      },
      {
        id: "install",
        label: "Installation",
        title: "How We Install",
        kind: "steps",
        steps: [
          {
            title: "Prepare and seed",
            text: "We trim the slope and place seed and topsoil before the blanket goes down.",
          },
          { title: "Anchor the crest", text: "We cut and backfill crest anchor trenches." },
          {
            title: "Deploy and overlap",
            text: "We roll down-slope in full soil contact with shingle-lapped overlaps.",
          },
          {
            title: "Pin",
            text: "We pin to the specified pattern so the blanket holds through the rains.",
          },
        ],
      },
    ],
  },
  "pipes-drainage-ducting": {
    intro:
      "We supply and install drainage pipes, drainage composites, strip drains, PVDs and cable ducts, and make drilled and slotted HDPE pipe, fin drains and filter socks in our own facility.",
    industries: [IND.mining, IND.transport, IND.waste, IND.energy],
    manufactured: [
      { label: "Drilled & slotted HDPE pipe", anchor: "made-drainage-pipes" },
      { label: "Fin drains", anchor: "made-fin-drains" },
      { label: "PVDs", anchor: "made-pvds" },
      { label: "Filter socks", anchor: "made-filter-socks" },
    ],
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build",
        kind: "table",
        rows: [
          {
            label: "TSF underdrains & leak detection",
            value: "Slotted HDPE pipe and drainage composites under the liner",
          },
          { label: "Landfill leachate collection", value: "Collector pipes and drainage layers" },
          {
            label: "Soft-ground consolidation",
            value: "PVDs installed on a grid under embankments",
          },
          {
            label: "Retaining wall & slab drainage",
            value: "Fin drains and dimpled drainage sheets",
          },
          {
            label: "Cable and services routes",
            value: "HDPE cable ducting along roads, rail and energy sites",
          },
        ],
      },
      {
        id: "grades",
        label: "Range",
        title: "Our Drainage & Ducting Range",
        kind: "table",
        rows: [
          { label: "Subsoil drainage pipes", value: "e.g. GeoPipe DN110 and GeoPipe HD 250 mm" },
          { label: "Cable ducting", value: "GeoDuct HDPE, 50 to 315 mm" },
          { label: "Leak detection sheets", value: "e.g. GeoDrain LD 500 cuspated core" },
          { label: "Structured wall pipes", value: "Culverts and stormwater" },
          {
            label: "Strip drains, PVDs & dimpled sheets",
            value: "Retaining walls, soft ground and basements",
          },
        ],
      },
    ],
  },
  "gabion-baskets": {
    intro:
      "We manufacture welded mesh gabions in our own facility, supply woven gabions and Reno mattresses, and build gabion walls, crusher walls and channel protection with our own crews.",
    industries: [IND.mining, IND.transport, IND.water, IND.env],
    manufactured: [{ label: "Welded mesh gabions", anchor: "made-gabions" }],
    install: { label: "Gabion installation", slug: "gabion-installation-contractor-africa" },
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build With Gabions",
        kind: "table",
        rows: [
          { label: "Crusher & ROM pad walls", value: "Gravity gabion walls at mine crushers" },
          { label: "Retaining walls", value: "Road, rail and site retaining walls" },
          { label: "Channels & spillways", value: "Reno mattress linings" },
          { label: "Riverbanks, weirs & culverts", value: "Scour and outlet protection" },
          { label: "Architectural walls", value: "Square welded mesh feature walls" },
        ],
      },
      {
        id: "grades",
        label: "Types",
        title: "Choosing a Gabion",
        kind: "table",
        rows: [
          {
            label: "Welded mesh (made by us)",
            value: "50 × 50 mm square mesh, Class A galvanised or PVC-coated, SANS 675",
          },
          {
            label: "Woven double-twist",
            value: "80 × 100 mm mesh, Class A galvanised; tolerates settlement",
          },
          {
            label: "Reno mattresses",
            value: "60 × 80 mm mesh, 2.7 mm wire, for channel and scour lining",
          },
        ],
      },
      {
        id: "install",
        label: "Installation",
        title: "Our Installation Sequence",
        kind: "steps",
        steps: [
          {
            title: "Foundation & filter",
            text: "We level, compact and lay the filter geotextile.",
          },
          { title: "Assemble & brace", text: "We lace, brace and align units to the drawing." },
          { title: "Fill", text: "We fill and pack rock in layers to keep face and shape." },
          { title: "Close & sign off", text: "We lace lids and survey line and level." },
        ],
      },
    ],
  },
  "permeable-paving-systems": {
    intro:
      "We supply BERA® gravel, grass and ground stabilisation grids and edging for driveways, parking, paths and yards.",
    industries: [IND.agri, IND.energy, IND.transport],
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What BERA® Builds",
        kind: "table",
        rows: [
          { label: "Gravel driveways & parking", value: "BERA® Gravel Fix holds gravel in place" },
          {
            label: "Grass parking & access lanes",
            value: "BERA® Grass Fix protects grass roots under traffic",
          },
          {
            label: "Yards, paths & stable areas",
            value: "BERA® Stable Fix interlocking ground grids",
          },
          { label: "Lawn and bed edges", value: "BERA® Eco Edge flexible edging" },
        ],
      },
      {
        id: "why",
        label: "Why Permeable",
        title: "Why Permeable Paving",
        kind: "list",
        items: [
          "Rain soaks in instead of running off",
          "No ruts or loose gravel",
          "Faster to lay than concrete",
          "Grids backed by published EPD declarations",
        ],
      },
    ],
  },
  "dewatering-systems": {
    intro:
      "We manufacture FlowTex™ dewatering tubes and bags, supply GEOTUBE® systems and GeoCurtain™ silt curtains, and run desludging and dewatering on site.",
    industries: [IND.mining, IND.water, IND.waste, IND.env, IND.energy],
    manufactured: [
      { label: "Dewatering tubes", anchor: "made-dewatering-tubes" },
      { label: "Dewatering bags", anchor: "made-dewatering-bags" },
    ],
    install: { label: "Silt curtain deployment", slug: "silt-curtain-deployment" },
    tabs: [
      {
        id: "builds",
        label: "What It Does",
        title: "Where We Dewater",
        kind: "table",
        rows: [
          {
            label: "Pond & dam desludging",
            value: "Mine, wastewater and process ponds returned to service",
          },
          { label: "Tailings & dredge spoil", value: "Volume reduction before disposal" },
          { label: "Pump discharge", value: "Dewatering bags at sumps and excavations" },
          {
            label: "Sediment containment",
            value: "Silt curtains around dredging and in-water works",
          },
        ],
      },
      {
        id: "grades",
        label: "Range",
        title: "Our Dewatering Range",
        kind: "table",
        rows: [
          {
            label: "FlowTex™ tubes (made by us)",
            value: "Made to project size, ports set to your pumping layout",
          },
          { label: "FlowTex™ HF bags", value: "Pump discharge and small volumes" },
          { label: "GEOTUBE®", value: "e.g. GT500 (1 m × 1 m) and large-format tubes" },
          {
            label: "GeoCurtain™ silt curtains",
            value: "Class 1, 2 and 3 for calm water to marine works",
          },
        ],
      },
      {
        id: "process",
        label: "How We Dewater",
        title: "Our Dewatering Process",
        kind: "steps",
        steps: [
          {
            title: "Feed trial",
            text: "We test the sludge and select the fabric and conditioning.",
          },
          { title: "Lay-down pad", text: "We build a lined pad with filtrate collection." },
          {
            title: "Controlled filling",
            text: "We fill to the tube's limits and track drainage cycles.",
          },
          {
            title: "Cake & filtrate",
            text: "We check filtrate clarity and cake dryness against targets.",
          },
        ],
      },
    ],
  },
  "geosynthetic-sand-containers": {
    intro:
      "We manufacture FlowTex™ nonwoven and woven sand containers in our own facility and place them for revetments, groynes, scour aprons and riverbanks.",
    industries: [IND.env, IND.water, IND.oil],
    manufactured: [{ label: "Sand containers", anchor: "made-sand-containers" }],
    install: { label: "Sand container installation", slug: "sand-container-installation" },
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build",
        kind: "table",
        rows: [
          { label: "Coastal revetments", value: "Stretcher-bond container walls" },
          { label: "Groynes & breakwater cores", value: "4,000 kg high-energy containers" },
          { label: "Scour aprons", value: "Around piers, outfalls and pipelines" },
          { label: "Riverbanks & dune toes", value: "Lighter grades, hand-filled on site" },
        ],
      },
      {
        id: "grades",
        label: "Grades",
        title: "Container Grades",
        kind: "table",
        rows: [
          { label: "Nonwoven NW40 to NW4000", value: "16 to 80 kN/m, O90 110 to 70 µm" },
          { label: "Woven W30 to W105", value: "30 to 105 kN/m, 400 to 4,000 kg" },
          { label: "Filled mass", value: "40 to 4,000 kg" },
        ],
      },
    ],
  },
  "waterproofing-concrete-protection": {
    intro:
      "We supply and install GSE® Studliner® concrete protection liners and TILTEX™ GCCM, and supply DPM sheeting and CureLock™ curing hessian.",
    industries: [IND.oil, IND.water, IND.mining, IND.transport],
    install: { label: "Concrete protection installation", slug: "concrete-lining-protection" },
    tabs: [
      {
        id: "builds",
        label: "Structures It Builds",
        title: "What We Build",
        kind: "table",
        rows: [
          {
            label: "Sumps, manholes & separators",
            value: "Studliner® cast in for chemical protection",
          },
          { label: "Channels & spillways", value: "TILTEX™ GCCM concrete cloth, no formwork" },
          { label: "Slabs & foundations", value: "DPM under concrete" },
          { label: "Fresh concrete", value: "CureLock™ hessian curing" },
        ],
      },
      {
        id: "grades",
        label: "Range",
        title: "Our Range",
        kind: "table",
        rows: [
          { label: "GSE® Studliner®", value: "Studded HDPE, 1,200+ anchor studs per m²" },
          { label: "TILTEX™ GCCM", value: "7 to 12 mm concrete cloth, hydrated in place" },
          { label: "DPM sheeting", value: "250, 375 and 500 micron" },
          { label: "CureLock™ hessian", value: "Jute curing hessian" },
        ],
      },
    ],
  },
};
