import type { ServiceSection } from "@/data/service-delivery";
import type { ProductSystem } from "@/data/product-systems";

/**
 * Product-family "what we build and how" panels. Each family page gets content about
 * that exact product: the structures it builds, its key grades and specifications
 * (from the published datasheet tables) and what we supply, make and install.
 * Families without an entry fall back to their category panel.
 */
type Row = { label: string; value: string };

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

const INSTALL = {
  liner: { label: "Geomembrane installation", slug: "geomembrane-liner-installation-africa" },
  gcl: { label: "GCL installation", slug: "gcl-installation-contractor-africa" },
  cover: { label: "Floating cover installation", slug: "floating-cover-installation-africa" },
  geocell: { label: "Geocell installation", slug: "geocell-installation-contractor-africa" },
  gabion: { label: "Gabion installation", slug: "gabion-installation-contractor-africa" },
  gccm: { label: "GCCM channel lining", slug: "gccm-channel-lining-contractor-africa" },
  erosion: { label: "Erosion control & revegetation", slug: "bioengineering-revegetation" },
  sand: { label: "Sand container installation", slug: "sand-container-installation" },
  curtain: { label: "Silt curtain deployment", slug: "silt-curtain-deployment" },
  concrete: { label: "Concrete protection", slug: "concrete-lining-protection" },
  logistics: { label: "Delivery & logistics", slug: "delivery-logistics-africa" },
};

function family(opts: {
  intro: string;
  industries: { label: string; slug: string }[];
  builds: Row[];
  specsTitle: string;
  specs: Row[];
  doList: string[];
  install?: { label: string; slug: string };
  manufactured?: { label: string; anchor: string }[];
  extra?: ServiceSection[];
}): ProductSystem {
  return {
    intro: opts.intro,
    industries: opts.industries,
    install: opts.install,
    manufactured: opts.manufactured,
    tabs: [
      {
        id: "builds",
        label: "What It Builds",
        title: "What We Build With It",
        kind: "table",
        rows: opts.builds,
      },
      {
        id: "specs",
        label: "Key Specifications",
        title: opts.specsTitle,
        kind: "table",
        rows: opts.specs,
      },
      {
        id: "what-we-do",
        label: "What We Do",
        title: "What We Do",
        kind: "list",
        items: opts.doList,
      },
      ...(opts.extra || []),
    ],
  };
}

const WELD_TESTING: ServiceSection = {
  id: "testing",
  label: "Welding & Testing",
  title: "How We Test Every Seam",
  kind: "steps",
  steps: [
    {
      title: "Trial welds",
      text: "Every welder and machine runs a peel-tested trial weld each shift and at every change of operator or conditions.",
    },
    { title: "Air-pressure testing", text: "Every double-track fusion seam, to ASTM D5820." },
    { title: "Vacuum-box testing", text: "Every extrusion weld, patch and detail, to ASTM D5641." },
    {
      title: "Destructive testing",
      text: "Seam samples at set intervals, peel and shear to ASTM D6392.",
    },
  ],
};

export const FAMILY_SYSTEMS: Record<string, ProductSystem> = {
  // ── Geomembranes ────────────────────────────────────────────────────────────
  "hdpe-geomembranes": family({
    intro:
      "We supply smooth and textured HDPE geomembranes and weld them into TSF, PCD, heap leach, landfill and water containment liners with our own IAGI-member crews.",
    industries: [IND.mining, IND.waste, IND.water, IND.energy, IND.oil],
    install: INSTALL.liner,
    manufactured: [
      { label: "Drop-in liners", anchor: "made-drop-in-liners" },
      { label: "Pipe boots", anchor: "made-pipe-boots" },
      { label: "Panels, sumps & corners", anchor: "made-liner-details" },
    ],
    builds: [
      {
        label: "Tailings storage facilities",
        value: "Basin and wall liners, textured on slopes, over GCL and cushion",
      },
      { label: "Pollution control dams", value: "Single or double liners with leak detection" },
      { label: "Heap leach pads", value: "Primary barrier under overliner and collection pipes" },
      { label: "Landfill cells", value: "Composite basal liners with GCL" },
      { label: "Reservoirs & canals", value: "Exposed or covered water containment" },
    ],
    specsTitle: "HDPE Key Specifications (1.0 mm grade)",
    specs: [
      { label: "Standard", value: "GRI-GM13, smooth or textured" },
      { label: "Density", value: "≥ 0.940 g/cm³ (ASTM D792)" },
      { label: "Tensile strength at break / yield", value: "27 / 15 kN/m (ASTM D6693)" },
      { label: "Puncture resistance", value: "320 N (ASTM D4833)" },
      { label: "Stress crack resistance", value: "≥ 500 hr (ASTM D5397)" },
      { label: "Roll width", value: "7 m" },
    ],
    doList: [
      "We supply GSE® HDPE manufactured by Solmax, with a mill certificate for every roll",
      "We fabricate pipe boots, sumps, corners and drop-in liners in our own facility",
      "We deploy and weld with our own crews and test every seam",
      "We hand over panel and weld logs, test results and as-built drawings",
    ],
    extra: [WELD_TESTING],
  }),
  "lldpe-geomembrane-liners": family({
    intro:
      "We supply GRI-GM17 LLDPE geomembranes for caps, covers and liners that must follow settlement, and install them with our own welding crews.",
    industries: [IND.waste, IND.mining, IND.water, IND.env],
    install: INSTALL.liner,
    builds: [
      {
        label: "Landfill caps & closures",
        value: "Flexible barrier that follows waste settlement",
      },
      { label: "Heap leach pads", value: "Barrier on uneven or settling foundations" },
      { label: "Ponds & secondary containment", value: "Where flexibility around details matters" },
      { label: "Exposed liners", value: "Published UV performance for exposed service" },
    ],
    specsTitle: "LLDPE Key Specifications",
    specs: [
      { label: "Standard", value: "GRI-GM17, 0.5 to 2.5 mm" },
      { label: "Grades", value: "GeoLine LL1000 (1.0 mm) and LL1500 (1.5 mm)" },
      { label: "Elongation at break", value: "900% (DIN EN ISO 527-3)" },
      { label: "Puncture resistance", value: "2,350 N / 3,500 N (DIN EN ISO 12236)" },
      { label: "UV performance", value: "HP-OIT retention ≥ 35% after 1,600 h (GRI GM11)" },
    ],
    doList: [
      "We supply LLDPE with roll-by-roll mill certificates",
      "We weld with qualified crews and test every seam",
      "We fabricate boots and details in our own facility",
    ],
    extra: [WELD_TESTING],
  }),
  "floating-cover-geomembranes": family({
    intro:
      "We supply FC45 and FC60 scrim-reinforced LLDPE and fabricate it into floating covers for water recovery ponds, potable reservoirs, effluent dams and digesters.",
    industries: [IND.water, IND.mining, IND.agri, IND.waste],
    install: INSTALL.cover,
    manufactured: [{ label: "Floating covers", anchor: "made-floating-covers" }],
    builds: [
      { label: "TSF water recovery ponds", value: "Evaporation and water-loss control" },
      { label: "Potable reservoirs", value: "NSF/ANSI 61 certified covers" },
      { label: "Effluent dams & digesters", value: "Odour and gas control" },
    ],
    specsTitle: "rLLDPE Key Specifications",
    specs: [
      { label: "Grades", value: "FC45 (1.14 mm) and FC60 (1.52 mm)" },
      { label: "Outdoor service life", value: "20 years (FC45), 30 years (FC60)" },
      { label: "Grab tensile at break", value: "1,557 N / 1,602 N (ASTM D7004)" },
      { label: "Puncture resistance", value: "556 N / 600 N (ASTM D4833)" },
      { label: "Potable water", value: "NSF/ANSI 61 certified" },
      { label: "Standard", value: "GRI GM25" },
    ],
    doList: [
      "We fabricate cover panels, ballast pockets, sumps and hatches in our own facility",
      "We deploy, anchor and weld covers on site",
      "We commission rainwater removal and hand over operating guidance",
    ],
  }),
  "pvc-geomembranes": family({
    intro:
      "We supply locally manufactured, polyester-reinforced PVC liners for farm dams, irrigation reservoirs, aquaculture ponds and industrial water, and install them on site.",
    industries: [IND.agri, IND.water],
    install: INSTALL.liner,
    builds: [
      { label: "Farm dams & irrigation reservoirs", value: "Fast, flexible lining" },
      { label: "Aquaculture ponds", value: "Easy detailing at inlets and outlets" },
      { label: "Potable storage", value: "R-PVC720P potable-approved grade" },
    ],
    specsTitle: "PVC Key Specifications",
    specs: [
      { label: "Grades", value: "R-PVC550, R-PVC700, R-PVC720P (550 to 800 g/m²)" },
      { label: "Reinforcement", value: "Polyester scrim, UV-stabilised" },
      { label: "Tensile strength", value: "1,000 to 1,600 N/50 mm" },
      { label: "Temperature range", value: "−30 °C to 60 °C" },
      { label: "Seaming", value: "Hot-air welded" },
    ],
    doList: [
      "We supply prefabricated or roll PVC to your dam size",
      "We hot-air weld and test seams on site",
      "We detail inlets, outlets and anchor trenches",
    ],
  }),
  "fpp-geomembrane-liners": family({
    intro:
      "We supply non-reinforced fPP geomembranes for caps and ponds that must stretch with differential settlement, and weld them on site.",
    industries: [IND.waste, IND.water, IND.env],
    install: INSTALL.liner,
    builds: [
      { label: "Capping systems", value: "Follows differential settlement" },
      { label: "Pond linings", value: "Flexible lining over uneven ground" },
    ],
    specsTitle: "fPP Key Specifications",
    specs: [
      { label: "Grades", value: "fPP075 (0.75 mm) and fPP1000 (1.0 mm)" },
      { label: "Elongation at break", value: "700% (DIN EN ISO 527-3)" },
      { label: "Puncture resistance", value: "750 N / 1,000 N (DIN EN ISO 12236)" },
      { label: "Carbon black", value: "3.0%" },
    ],
    doList: ["We supply fPP with mill certificates", "We weld and test every seam"],
    extra: [WELD_TESTING],
  }),
  "rfpp-geomembrane-liners": family({
    intro:
      "We supply scrim-reinforced, NSF/ANSI 61 certified rFPP for exposed liners and covers that must hold their shape under wind uplift and load.",
    industries: [IND.water, IND.agri],
    install: INSTALL.liner,
    builds: [
      { label: "Potable water liners & covers", value: "No plasticisers to leach" },
      { label: "Exposed reservoirs", value: "Dimensionally stable under wind uplift" },
    ],
    specsTitle: "rFPP Key Specifications",
    specs: [
      { label: "Grades", value: "RFPP36 (0.91 mm) and RFPP45 (1.14 mm)" },
      { label: "Construction", value: "9 × 9 1000D PET scrim" },
      { label: "Grab tensile at break", value: "1,001 N / 1,334 N (ASTM D7004)" },
      { label: "Puncture resistance", value: "423 N / 467 N (ASTM D4833)" },
      { label: "Potable water", value: "NSF/ANSI 61 certified" },
    ],
    doList: ["We supply rFPP and fabricate panels to size", "We weld and test seams on site"],
  }),
  "epdm-geomembranes": family({
    intro:
      "We supply EPDM rubber liners for exposed dams, reservoirs, ponds and steel tanks, where 465% elongation absorbs thermal movement in African sun.",
    industries: [IND.water, IND.agri],
    install: INSTALL.liner,
    builds: [
      { label: "Exposed dams & reservoirs", value: "No wrinkling or cracking in sun" },
      { label: "Ponds & water features", value: "Very flexible around details" },
      { label: "Steel tank lining", value: "Potable-approved lining" },
    ],
    specsTitle: "EPDM Key Specifications",
    specs: [
      { label: "Thickness", value: "1.14 mm (45-mil) and 1.52 mm (60-mil)" },
      { label: "Ultimate elongation", value: "465% (ASTM D412)" },
      { label: "Tensile strength", value: "11.0 MPa (ASTM D412)" },
      { label: "UV weathering", value: "No cracks at 41,580 kJ/m² (ASTM G155)" },
      { label: "Standards", value: "ASTM D4637 Type I, NSF/ANSI 61" },
      { label: "Rolls", value: "Up to 9.15 m × 30.49 m" },
    ],
    doList: ["We supply EPDM in wide panels", "We join and detail on site"],
  }),
  "textured-geomembranes": family({
    intro:
      "We supply EVA geomembrane liners for concrete drinking-water reservoirs, firewater tanks, process tanks and tunnels, and install them with termination profiles.",
    industries: [IND.water, IND.mining],
    install: INSTALL.liner,
    builds: [
      { label: "Concrete potable reservoirs", value: "Relining leaking concrete storage" },
      { label: "Firewater & process tanks", value: "Enclosed tank lining" },
      { label: "Thickener tanks & tunnels", value: "Flexible lining over concrete" },
    ],
    specsTitle: "EVA Key Specifications",
    specs: [
      { label: "Grades", value: "EVA15 (1.5 mm) and EVA20 (2.0 mm)" },
      { label: "Elongation at break", value: "700% (ASTM D6693)" },
      { label: "Strength at break", value: "13 MPa (ASTM D6693)" },
      { label: "Rolls", value: "3.0 m wide, 150 m long" },
    ],
    doList: [
      "We supply EVA and fix it to concrete with termination profiles",
      "We weld and test every seam",
    ],
  }),
  "cspe-geomembranes-for-potable-water-floating-covers": family({
    intro:
      "We supply polyester-reinforced CSPE geomembranes in CS60 and CS90 grades, NSF/ANSI 61 certified, and fabricate them into potable-water floating covers, reservoir liners and drop-in tank liners.",
    industries: [IND.water, IND.mining, IND.agri],
    install: INSTALL.cover,
    manufactured: [
      { label: "Floating covers", anchor: "made-floating-covers" },
      { label: "Drop-in liners", anchor: "made-drop-in-liners" },
    ],
    builds: [
      { label: "Potable water floating covers", value: "Covers for drinking-water reservoirs" },
      { label: "Reservoir & pond liners", value: "Exposed liners with long weathering life" },
      {
        label: "Drop-in tank liners & baffle curtains",
        value: "Prefabricated to tank and basin size",
      },
      { label: "Desalination cell liners", value: "Chemically resistant containment" },
    ],
    specsTitle: "CSPE Key Specifications (typical)",
    specs: [
      { label: "Grades", value: "CS60: 60 mil (1.52 mm), 3-ply · CS90: 90 mil (2.28 mm), 5-ply" },
      { label: "Reinforcement", value: "Polyester scrim, 10 × 10, 1000 denier" },
      { label: "Grab breaking strength", value: "CS60 1,556 N · CS90 2,668 N (ASTM D751)" },
      { label: "Tongue tear", value: "CS60 444 N · CS90 689 N (ASTM D751)" },
      { label: "Puncture resistance", value: "CS60 1,334 N · CS90 2,224 N (FTMS 101B 2031)" },
      { label: "Potable water", value: "NSF/ANSI 61 certified" },
    ],
    doList: [
      "We supply CS60 and CS90 with batch certificates",
      "We fabricate covers, liners and baffle curtains to size in our own facility",
      "We install and test on site",
    ],
  }),
  "bituminous-liners": family({
    intro:
      "We supply and install DamSeal, a bitumen-impregnated geotextile that forms a continuous waterproof membrane moulded to your dam on site.",
    industries: [IND.water, IND.agri],
    builds: [
      { label: "Leaking earth dams", value: "Sealed in place, moulded to shape" },
      { label: "Oxidation ponds & canals", value: "Continuous waterproof membrane" },
    ],
    specsTitle: "DamSeal Key Specifications",
    specs: [
      { label: "Grades", value: "DamSeal 150 and DamSeal 200 (150 and 200 g/m² nonwoven PP)" },
      { label: "Tensile strength", value: "12 / 16 kN/m (EN ISO 10319)" },
      { label: "CBR puncture", value: "1.75 / 2.35 kN (EN ISO 12236)" },
    ],
    doList: ["We supply the geotextile and bitumen system", "We form the membrane on site"],
  }),
  "gse-polylock-t": family({
    intro:
      "We supply GSE® PolyLock-T profiles, cast into concrete and welded to the liner for a watertight mechanical termination.",
    industries: [IND.mining, IND.water, IND.waste],
    install: INSTALL.liner,
    builds: [
      { label: "Spillways & inlet structures", value: "Liner to concrete terminations" },
      { label: "Sumps & pump stations", value: "Watertight concrete connections" },
    ],
    specsTitle: "PolyLock-T Key Specifications",
    specs: [
      { label: "Resin", value: "HDPE, black, ≥ 0.94 g/cm³" },
      { label: "Length", value: "5 m standard" },
      { label: "Width × height", value: "148 mm × 22 mm" },
      { label: "Anchors", value: "3 parallel T-anchors" },
    ],
    doList: [
      "We supply the profile for casting in",
      "We extrusion-weld the liner to it and vacuum test the weld",
    ],
  }),

  // ── GCL ─────────────────────────────────────────────────────────────────────
  "reinforced-sodium-bentonite-geosynthetic-clay-liners": family({
    intro:
      "We supply Eurobent® needle-punched sodium bentonite GCL and install it under HDPE or on its own, controlling overlaps, hydration and cover.",
    industries: [IND.mining, IND.waste, IND.water],
    install: INSTALL.gcl,
    builds: [
      { label: "Composite TSF & heap leach liners", value: "Self-sealing layer under HDPE" },
      { label: "Landfill basal liners & caps", value: "Composite and cap barrier" },
      { label: "Reservoirs & canals", value: "Low-permeability lining" },
    ],
    specsTitle: "Eurobent® GCL Key Specifications",
    specs: [
      { label: "Bentonite", value: "Granular sodium bentonite, ≥ 75% montmorillonite" },
      { label: "Grades", value: "3,500 to 6,000 g/m² net bentonite (e.g. EB 3500, EB 4000)" },
      { label: "Permeability", value: "≤ 5.0 × 10⁻¹¹ m/s (ASTM D5887)" },
      { label: "Tensile strength MD", value: "≥ 10.4 kN/m (EN ISO 10319)" },
    ],
    doList: [
      "We supply Eurobent® with roll and batch certificates",
      "We deploy only what we can cover the same day",
      "We hold overlaps, add bentonite and place 300 mm cover",
    ],
  }),
  "hdpe-coated-bentonite-geosynthetic-clay-liners": family({
    intro:
      "We supply Eurobent® GCL CS, a bentonite liner with an HDPE coating that gives a dual barrier in one layer.",
    industries: [IND.oil, IND.waste, IND.mining],
    install: INSTALL.gcl,
    builds: [
      { label: "Bunds & secondary containment", value: "Dual barrier around tanks" },
      { label: "Landfill & tunnel waterproofing", value: "Coated barrier with fast cover" },
    ],
    specsTitle: "Eurobent® GCL CS Key Specifications",
    specs: [
      { label: "Construction", value: "100 g/m² PP woven carrier, 200 g/m² PP nonwoven cover" },
      { label: "PE membrane", value: "0.2 mm" },
      { label: "Net bentonite", value: "5,000 g/m²" },
      { label: "Watertightness", value: "Pass (EN 1928)" },
    ],
    doList: [
      "We supply and install the coated GCL",
      "We seal overlaps and details to the manufacturer's method",
    ],
  }),

  // ── Geotextiles ─────────────────────────────────────────────────────────────
  "polypropylene-non-woven-geotextiles": family({
    intro:
      "We supply MIRAFI® continuous-filament nonwoven geotextiles from Solmax for separation, filtration and liner protection, and make sand containers and socks from nonwoven fabric.",
    industries: [IND.mining, IND.waste, IND.transport, IND.water],
    manufactured: [
      { label: "Sand containers", anchor: "made-sand-containers" },
      { label: "Filter socks", anchor: "made-filter-socks" },
    ],
    builds: [
      { label: "Liner cushion", value: "Under every geomembrane on TSFs, dams and landfills" },
      { label: "Drainage filters", value: "Around subsoil drains and gabion walls" },
      { label: "Road separation", value: "Between subgrade and aggregate" },
    ],
    specsTitle: "MIRAFI® Nonwoven Key Specifications",
    specs: [
      {
        label: "MIRAFI® S (separation & filtration)",
        value: "90 to 385 g/m², CBR 0.7 to 4.5 kN, O90 85 to 135 µm",
      },
      { label: "MIRAFI® F (protection)", value: "400 to 800 g/m², CBR 4.6 to 7.0 kN" },
      { label: "Test methods", value: "EN ISO 9864, 10319, 12236, 12956, 11058" },
    ],
    doList: [
      "We supply MIRAFI® rolls with mill certificates",
      "We install cushion layers under every liner we weld",
      "We fabricate sand containers and filter socks from nonwoven fabric",
    ],
  }),
  "polypropylene-woven-geotextiles": family({
    intro:
      "We supply PolyTape™ WG high-flow woven geotextiles for separation, filtration and reinforcement under roads, haul roads, rail and platforms.",
    industries: [IND.transport, IND.mining, IND.oil],
    manufactured: [
      { label: "Dewatering tubes", anchor: "made-dewatering-tubes" },
      { label: "Silt fence", anchor: "made-silt-fence" },
    ],
    builds: [
      { label: "Haul roads & platforms", value: "Separation under aggregate" },
      { label: "Rail formations & embankments", value: "Separation and reinforcement" },
      { label: "Dewatering tubes", value: "Woven fabric for the tubes we make" },
    ],
    specsTitle: "PolyTape™ WG Key Specifications",
    specs: [
      { label: "Grades", value: "WG 30 HF and WG 45 HF" },
      { label: "Tensile strength MD/CMD", value: "30 / 30 and 45 / 45 kN/m (EN ISO 10319)" },
      { label: "Opening size O90", value: "300 µm and 600 µm (EN ISO 12956)" },
      { label: "Functions", value: "Filtration, separation, reinforcement" },
    ],
    doList: ["We supply PolyTape™ rolls", "We make dewatering tubes and silt fence from woven PP"],
  }),
  "pp-polytape-silt-fence": family({
    intro:
      "We make and supply PolyTape™ WG30 silt fence, a UV-stabilised woven PP fence selvedged on all edges, and install it around earthworks.",
    industries: [IND.transport, IND.mining, IND.env],
    manufactured: [{ label: "Silt fence", anchor: "made-silt-fence" }],
    builds: [
      { label: "Construction sites & haul roads", value: "Sediment kept on site" },
      { label: "Stockpiles & watercourses", value: "Runoff barrier at the toe" },
    ],
    specsTitle: "Silt Fence Key Specifications",
    specs: [
      { label: "Widths", value: "500, 600 and 700 mm in 100 m rolls" },
      { label: "Tensile strength", value: "30 / 30 kN/m (EN ISO 10319)" },
      { label: "Opening size O90", value: "300 µm (EN ISO 12956)" },
      { label: "Static puncture", value: "3,200 N (EN ISO 12236)" },
    ],
    doList: ["We supply fence and posts", "We trench the toe and install the fence"],
  }),
  "pp-root-barrier": family({
    intro:
      "We supply PolyTape™ RB340 root barrier, tested to CEN/TS 14416, to redirect tree roots away from paving, services and foundations.",
    industries: [IND.transport],
    builds: [
      { label: "Roads, paving & kerbs", value: "Roots kept out of the pavement" },
      { label: "Services & foundations", value: "Pipes and footings protected" },
    ],
    specsTitle: "Root Barrier Key Specifications",
    specs: [
      { label: "Root penetration", value: "Certified pass, CEN/TS 14416" },
      { label: "Service life", value: "100+ years buried (TÜV Austria)" },
      { label: "Mass", value: "340 g/m²" },
      { label: "Static puncture", value: "3,250 N (EN ISO 12236)" },
    ],
    doList: ["We supply RB340 in 1.0 m rolls", "We advise trench depth and joint overlaps"],
  }),
  "pp-weedblock-ground-cover": family({
    intro:
      "We supply PP WeedBlock (GC100) woven ground cover for chemical-free weed control under solar arrays, nurseries, farms and landscaping.",
    industries: [IND.agri, IND.energy],
    builds: [
      { label: "Solar farms", value: "Weed control between arrays" },
      { label: "Nurseries & farms", value: "Clean, permeable ground cover" },
    ],
    specsTitle: "WeedBlock Key Specifications",
    specs: [
      { label: "Material", value: "100% virgin woven PP tape" },
      { label: "Tensile strength", value: "18 / 16 kN/m (ISO 13934-1)" },
      { label: "Water permeability", value: "900 l/min/m²" },
      { label: "UV stabilisation", value: "700 kLy" },
    ],
    doList: ["We supply rolls and pins", "We deliver to farms and solar sites across Africa"],
  }),

  // ── Geogrids & interlayers ──────────────────────────────────────────────────
  "biaxial-geogrids": family({
    intro:
      "We supply Tensar® SS, MIRAGRID® GX biaxial and TechGrid TGB geogrids to reinforce roads, platforms and foundations in two directions.",
    industries: [IND.transport, IND.mining, IND.energy],
    builds: [
      { label: "Roads & working platforms", value: "Two-direction reinforcement" },
      { label: "Foundations", value: "Load spread over weak ground" },
    ],
    specsTitle: "Biaxial Geogrid Range",
    specs: [
      { label: "Tensar® SS / TGSG", value: "Punched & drawn PP, 20 to 40 kN/m" },
      { label: "MIRAGRID® GX biaxial", value: "Knitted coated PET, GX 20/20 to 80/80" },
      { label: "TechGrid TGB", value: "Knitted coated PET, 20 to 200 kN/m" },
    ],
    doList: [
      "We select the grid from the design loading",
      "We supply and check orientation, overlaps and cover on site",
    ],
  }),
  "triaxial-geogrids": family({
    intro:
      "We supply Tensar® TriAx® TX geogrids and build stabilised haul roads, rail formations and platforms with them.",
    industries: [IND.mining, IND.transport, IND.energy, IND.oil],
    install: INSTALL.geocell,
    builds: [
      { label: "Mine haul roads", value: "Thinner aggregate, less rutting" },
      { label: "Rail track beds", value: "Ballast and sub-ballast stabilisation" },
      { label: "Platforms & laydown areas", value: "Stable working surfaces over weak ground" },
    ],
    specsTitle: "Tensar® TriAx® Key Specifications",
    specs: [
      { label: "Grades", value: "TX150 and TX160" },
      { label: "Radial secant stiffness @ 0.5%", value: "360 / 390 kN/m (EOTA TR41)" },
      { label: "Junction efficiency", value: "100%" },
      { label: "Structure", value: "Punched & stretched PP, 80 mm hexagonal pitch" },
    ],
    doList: ["We supply TriAx® from stock", "We install and check grid laps, cover and compaction"],
  }),
  "multi-axial-geogrids": family({
    intro:
      "We supply Tensar® InterAx® NX, Tensar's highest-performing stabilisation geogrid, for heavily trafficked roads and platforms.",
    industries: [IND.mining, IND.transport, IND.energy],
    builds: [
      { label: "Heavy-haul roads", value: "Highest-performing aggregate stabilisation" },
      { label: "Container yards & platforms", value: "Long design life under heavy loads" },
    ],
    specsTitle: "Tensar® InterAx® Key Specifications",
    specs: [
      { label: "Grades", value: "NX750 and NX850" },
      { label: "Radial secant stiffness @ 2%", value: "190 / 270 kN/m (EOTA TR041)" },
      { label: "Rolls", value: "3.8 m × 50 m" },
      { label: "Design life", value: "120 years (BBA 23/7063)" },
    ],
    doList: ["We supply InterAx® NX", "We install with laps, cover and compaction checks"],
  }),
  "uniaxial-geogrids": family({
    intro:
      "We supply Tensar® RE and UX and MIRAGRID® GX uniaxial geogrids, and build MSE walls, crusher walls, steep slopes and bridge abutments with them.",
    industries: [IND.mining, IND.transport],
    install: INSTALL.gabion,
    builds: [
      { label: "Crusher & ROM walls", value: "MSE walls carrying heavy plant loads" },
      { label: "Retaining walls & bridge abutments", value: "Reinforced fill tied to the facing" },
      { label: "Steep slopes & embankments", value: "Reinforced slopes over soft ground" },
    ],
    specsTitle: "Uniaxial Geogrid Range",
    specs: [
      { label: "Tensar® RE", value: "HDPE, RE510 to RE580, 42 to 137 kN/m" },
      { label: "Tensar® UX", value: "HDPE, UX1100 to UX1800, 58 to 210 kN/m" },
      { label: "MIRAGRID® GX", value: "Knitted coated PET, GX 35/20 to 200/30, 35 to 200 kN/m" },
    ],
    doList: [
      "We match the grade to the approved reinforcement schedule",
      "We check grid direction, length and elevation at every lift",
    ],
  }),
  "composite-geogrids": family({
    intro:
      "We supply MIRAGRID® PEC and TechGrid TGC-B reinforcement geocomposites that reinforce, separate and filter in one layer.",
    industries: [IND.transport, IND.mining],
    builds: [
      { label: "Embankments over soft ground", value: "Basal reinforcement" },
      { label: "Load transfer platforms", value: "Reinforcement with built-in separation" },
    ],
    specsTitle: "Composite Geogrid Range",
    specs: [
      { label: "MIRAGRID® PEC uniaxial", value: "PEC 40 to PEC 230, 40 to 230 kN/m" },
      { label: "MIRAGRID® PEC biaxial", value: "PEC 40/40 to 95/95" },
      { label: "TechGrid TGC-B", value: "55/55 to 210/210 kN/m" },
    ],
    doList: ["We supply to the design strength", "We support placement and overlap checks"],
  }),
  "strip-bonded-geogrids": family({
    intro:
      "We supply TechLink strip-bonded geogrids, high-tenacity polyester strips bonded into a grid, for high-strength reinforced soil.",
    industries: [IND.transport, IND.mining],
    builds: [
      { label: "High walls & abutments", value: "High-strength reinforced soil" },
      { label: "Basal reinforcement", value: "Embankments over very soft ground" },
    ],
    specsTitle: "TechLink Grades",
    specs: [
      { label: "Grades", value: "TL 100 to TL 600" },
      { label: "Ultimate tensile strength", value: "100 to 600 kN/m" },
      { label: "Long-term design strength", value: "66 to 406 kN/m depending on fill" },
    ],
    doList: ["We supply to the approved schedule", "We support lift-by-lift placement checks"],
  }),
  "polymeric-geostrips": family({
    intro: "We supply TechStrap polymeric geostrips for MSE walls and reinforced soil structures.",
    industries: [IND.transport, IND.mining],
    builds: [
      { label: "MSE walls & bridge abutments", value: "Strip reinforcement tied to facing panels" },
      { label: "Crusher walls", value: "Reinforced walls under heavy plant" },
    ],
    specsTitle: "TechStrap Grades",
    specs: [
      { label: "Grades", value: "TechStrap 30 to 135" },
      { label: "Ultimate tensile strength", value: "30 to 135 kN (ISO 10319 / ASTM D6637)" },
    ],
    doList: ["We supply strips cut to length", "We support connection and lift checks"],
  }),
  "glass-asphalt-geogrid": family({
    intro:
      "We supply Glass Fibre Geogrid (GFG), polymer-coated fibreglass grids that reinforce asphalt layers on roads, highways and airfields.",
    industries: [IND.transport],
    builds: [
      { label: "Road & highway overlays", value: "Delays reflective cracking" },
      { label: "Airfield pavements", value: "Asphalt reinforcement" },
    ],
    specsTitle: "GFG Key Specifications",
    specs: [
      { label: "Grades", value: "GFG 50/50 and GFG 100/100" },
      { label: "Tensile strength (min)", value: "50 × 50 and 100 × 100 kN/m (ASTM D6637)" },
      { label: "Elongation at ultimate", value: "2.0 ± 1%" },
      { label: "Young's modulus", value: "81 GPa" },
    ],
    doList: ["We supply GFG rolls", "We advise tack coat and laying on the prepared surface"],
  }),
  "asphalt-interlayer-composite": family({
    intro:
      "We supply fibreglass grid bonded to a nonwoven carrier, laid between old and new asphalt to stop reflective cracks and seal the layerworks.",
    industries: [IND.transport],
    builds: [{ label: "Asphalt overlays", value: "Crack arrest and waterproofing in one layer" }],
    specsTitle: "Interlayer Composite Key Specifications",
    specs: [
      { label: "Grades", value: "AIC B50 and AIC B100" },
      { label: "Tensile strength", value: "55 × 55 and 115 × 115 kN/m" },
      { label: "Young's modulus", value: "81 GPa" },
    ],
    doList: ["We supply the composite", "We advise bitumen tack and laying"],
  }),
  "paving-fabrics": family({
    intro:
      "We supply needle-punched paving fabric that soaks up bitumen to form a waterproof, stress-absorbing membrane interlayer (SAMI) under new asphalt.",
    industries: [IND.transport],
    builds: [{ label: "Road resurfacing", value: "Waterproof SAMI under the overlay" }],
    specsTitle: "Paving Fabric Key Specifications",
    specs: [
      { label: "Mass", value: "140 g/m² virgin PP" },
      { label: "Grab tensile", value: "450 N (ASTM D4632)" },
      { label: "Asphalt retention", value: "1.0 ℓ/m²" },
      { label: "Melting point", value: "150 °C" },
    ],
    doList: ["We supply paving fabric rolls", "We advise bitumen rate and placement"],
  }),

  // ── Erosion control & geocells ──────────────────────────────────────────────
  "jute-soil-erosion-saver-control-blanket": family({
    intro:
      "We supply and install Jute SoilLock™ 292, a 100% natural woven jute blanket for slopes, embankments, channels and rehabilitation.",
    industries: [IND.env, IND.mining, IND.transport, IND.water],
    install: INSTALL.erosion,
    builds: [
      { label: "River rehabilitation", value: "210,000 m² supplied to one programme in Zimbabwe" },
      { label: "Slopes & embankments", value: "Protection while grass establishes" },
      { label: "Channel banks", value: "Open weave lets vegetation through" },
    ],
    specsTitle: "Jute SoilLock™ 292 Key Specifications",
    specs: [
      { label: "Material", value: "100% natural jute, plain open weave" },
      { label: "Weight", value: "292 g/m²" },
      { label: "Aperture", value: "10 × 10 mm (nominal)" },
      { label: "Rolls", value: "1.22 m × 100 m (jumbo) or 50 m" },
      { label: "Life", value: "12 to 24 months" },
    ],
    doList: ["We supply from stock", "We seed, anchor, lay and pin on site"],
  }),
  "coir-fibre-soil-blankets": family({
    intro:
      "We supply and install Coir SoilLock™ in 350 g/m² civil and 450 g/m² mining grades for steep, high-runoff slopes and TSF walls.",
    industries: [IND.mining, IND.env, IND.transport],
    install: INSTALL.erosion,
    builds: [
      { label: "TSF outer walls", value: "Coir SoilLock™ 450 mining grade" },
      { label: "Steep road and rail cuttings", value: "Coir SoilLock™ 350 civil grade" },
      { label: "Rehabilitated dumps", value: "2 to 3 years of protection" },
    ],
    specsTitle: "Coir SoilLock™ Key Specifications",
    specs: [
      { label: "Grades", value: "350 (civil) and 450 (mining) g/m²" },
      { label: "Thickness", value: "5 to 6 mm and 6 to 7 mm" },
      { label: "Rolls", value: "2.4 m × 50 m (120 m²)" },
      { label: "Tensile strength MD", value: "3.14 / 3.25 kN/m (ASTM D4595)" },
      { label: "Life", value: "2 to 3 years" },
    ],
    doList: ["We supply both grades from one source", "We seed, anchor, lay and pin on site"],
  }),
  "straw-cellulose-erosion-blanket": family({
    intro:
      "We supply and install Straw SoilLock™ 300, a Type 1D straw blanket for short-term cover on gentle slopes.",
    industries: [IND.transport, IND.env],
    install: INSTALL.erosion,
    builds: [{ label: "Gentle slopes & verges", value: "Short-term cover while seed takes" }],
    specsTitle: "Straw SoilLock™ 300 Key Specifications",
    specs: [
      { label: "Weight", value: "300 g/m²" },
      { label: "Construction", value: "Straw sewn between two photodegradable PP nets" },
      { label: "Rolls", value: "2.4 m × 50 m" },
    ],
    doList: ["We supply from stock", "We lay and pin over seeded topsoil"],
  }),
  "envirowool-soil-erosion-blankets": family({
    intro:
      "We supply and install EnviroWool SoilLock™ 440, a Type 3B wood-wool blanket for erosion control and vegetation establishment.",
    industries: [IND.transport, IND.env, IND.mining],
    install: INSTALL.erosion,
    builds: [{ label: "Slopes & channels", value: "Wood-wool cover for establishment" }],
    specsTitle: "EnviroWool SoilLock™ 440 Key Specifications",
    specs: [
      { label: "Weight", value: "440 g/m² (ASTM D6475)" },
      { label: "Classification", value: "ECTC Type 3B" },
      { label: "Rolls", value: "2.45 m × 51.4 m" },
    ],
    doList: ["We supply rolls", "We lay and pin over seeded topsoil"],
  }),
  "geostrata-hdpe-geocells": family({
    intro:
      "We supply and install GeoStrata™ virgin HDPE geocells for load support, slope protection, retaining walls and channel lining.",
    industries: [IND.mining, IND.transport, IND.water],
    install: INSTALL.geocell,
    builds: [
      { label: "Haul & unpaved roads", value: "Aggregate confinement for load support" },
      { label: "Steep slopes", value: "Vegetated or rock-filled cells" },
      { label: "Channels", value: "Concrete-filled cell lining" },
    ],
    specsTitle: "GeoStrata™ Key Specifications",
    specs: [
      { label: "Material", value: "100% virgin HDPE" },
      { label: "Weld spacing", value: "330 mm (HD330) and 356 mm (HD356)" },
      { label: "Panel", value: "3 m × 11 m expanded (33 m²)" },
    ],
    doList: ["We supply panels and anchors", "We expand, anchor and infill with our own crews"],
  }),
  "polycell-polypropylene-geocells": family({
    intro:
      "We supply and install PolyCell UV-stabilised woven PP geocells for concrete channel lining, rural roads and slope protection.",
    industries: [IND.water, IND.agri, IND.transport],
    install: INSTALL.geocell,
    builds: [
      { label: "Concrete channels & canals", value: "Cells filled with concrete" },
      { label: "Rural roads", value: "Low-cost load support" },
      { label: "Liner protection", value: "Over geomembranes on slopes" },
    ],
    specsTitle: "PolyCell Key Specifications",
    specs: [
      { label: "Material", value: "UV-stabilised laminated woven PP" },
      { label: "Tensile strength", value: "26 kN/m (SANS 10221)" },
      { label: "Seam strength", value: "4 kN/m" },
      { label: "Cell size", value: "200 × 200 mm" },
    ],
    doList: ["We supply PolyCell", "We install and fill with our own crews"],
  }),

  // ── Pipes & drainage ────────────────────────────────────────────────────────
  "subsoil-drainage-pipes": family({
    intro:
      "We supply GeoPipe slotted double-wall HDPE drainage pipes and make drilled and slotted HDPE pipe for underdrains and collectors.",
    industries: [IND.mining, IND.transport, IND.waste, IND.agri],
    manufactured: [{ label: "Drilled & slotted HDPE pipe", anchor: "made-drainage-pipes" }],
    builds: [
      { label: "TSF underdrains & collectors", value: "Slotted collectors under the liner" },
      { label: "Road formations & French drains", value: "Subsoil drainage" },
      { label: "Farms & sports fields", value: "Field drainage" },
    ],
    specsTitle: "GeoPipe Key Specifications",
    specs: [
      { label: "GeoPipe", value: "75 to 160 mm OD; SANS 613" },
      { label: "GeoPipe HD", value: "200 to 315 mm OD; SN8 base pipe (ISO 9969)" },
      { label: "Slots", value: "1.3 to 2.0 mm; 270° or 360°" },
    ],
    doList: [
      "We supply pipe and fittings",
      "We drill or slot HDPE pipe to the specified open area",
    ],
  }),
  "structured-wall-pipes": family({
    intro:
      "We supply GeoStruct™ HDPE structured wall pipes for gravity sewers, stormwater and culverts.",
    industries: [IND.transport, IND.mining, IND.water],
    builds: [
      { label: "Culverts", value: "Road and haul road crossings" },
      { label: "Stormwater & sewers", value: "Large-diameter gravity drainage" },
    ],
    specsTitle: "GeoStruct™ Key Specifications",
    specs: [
      { label: "Diameter", value: "DN 300 to 1,500 mm" },
      { label: "Ring stiffness", value: "4 kN/m² (ISO 9969)" },
      { label: "Length", value: "6 m" },
    ],
    doList: ["We supply pipe to site", "We plan delivery for large diameters"],
  }),
  "prefabricated-vertical-drains-pvds": family({
    intro:
      "We supply GeoDrain PVDs, band drains installed into soft ground to shorten consolidation under embankments and platforms.",
    industries: [IND.transport, IND.mining],
    manufactured: [{ label: "PVDs", anchor: "made-pvds" }],
    builds: [
      { label: "Embankments on soft clay", value: "Faster consolidation" },
      { label: "Port & industrial platforms", value: "Ground improvement under surcharge" },
    ],
    specsTitle: "GeoDrain PVD Key Specifications",
    specs: [
      { label: "Grade", value: "GD-3070C / 3070F" },
      { label: "Core / filter", value: "PP core, PET filter" },
      { label: "Width × thickness", value: "100 mm × 3.0 mm" },
      { label: "Discharge capacity", value: "100 × 10⁻⁶ m³/s (ASTM D4716)" },
    ],
    doList: ["We supply PVDs on reels", "We support installation planning and traceability"],
  }),
  "netlon-strip-drains": family({
    intro:
      "We supply Netlon strip drains, HDPE geonet cores in a nonwoven filter sleeve, for roadside and subsoil drainage.",
    industries: [IND.transport],
    builds: [{ label: "Road edge & subsoil drains", value: "COTO-compliant strip drains" }],
    specsTitle: "Netlon Strip Drain Key Specifications",
    specs: [
      { label: "Core thickness", value: "4.5 mm" },
      { label: "In-plane flow @ 20 kPa", value: "1.40 / 0.80 l/s/m (EN ISO 12958)" },
      { label: "Filter tensile", value: "10 / 10 kN/m" },
    ],
    doList: ["We supply strip drain rolls", "We deliver along road projects"],
  }),
  "dimpled-drainage-boards": family({
    intro:
      "We supply GeoDrain dimpled drainage boards and geocomposites for basements, retaining walls, foundations and green roofs.",
    industries: [IND.transport],
    builds: [
      { label: "Retaining walls & basements", value: "Drainage behind the wall" },
      { label: "Podiums & green roofs", value: "Drainage under planting" },
    ],
    specsTitle: "GeoDrain Range",
    specs: [
      { label: "DS 8-600", value: "Bare HDPE, 8 mm dimple, 250 kN/m²" },
      { label: "GEO 8-250", value: "Geocomposite, 8 mm, 250 kN/m²" },
      { label: "GEO 10-400", value: "Geocomposite, 10 mm, 400 kN/m²" },
    ],
    doList: ["We supply sheets and rolls", "We advise laps and outlet details"],
  }),
  "leak-detection-drainage-sheets": family({
    intro:
      "We supply and install GeoDrain LD leak detection sheets as the drainage layer in landfill, dam and TSF lining systems.",
    industries: [IND.waste, IND.mining, IND.oil],
    install: INSTALL.liner,
    builds: [
      { label: "Double-lined PCDs", value: "Leak detection between liners" },
      { label: "Landfill cells", value: "Leak detection under the primary liner" },
      { label: "TSFs", value: "Drainage under the geomembrane" },
    ],
    specsTitle: "GeoDrain LD Range",
    specs: [
      { label: "LD 420", value: "700 kN/m², standard cells" },
      { label: "LD 500", value: "1,000 kN/m², intermediate loads" },
      { label: "LD 700", value: "1,300 kN/m², deep cells and high loads" },
    ],
    doList: ["We supply LD sheets", "We install them within our liner systems"],
  }),
  "cable-ducting-pipes": family({
    intro:
      "We supply GeoDuct double-wall corrugated HDPE ducting for buried fibre, telecoms and LV/MV power cables.",
    industries: [IND.energy, IND.transport],
    builds: [
      { label: "Fibre & telecoms routes", value: "Buried cable protection" },
      { label: "Solar & power sites", value: "LV/MV cable routes" },
    ],
    specsTitle: "GeoDuct Key Specifications",
    specs: [
      { label: "Sizes", value: "50 to 315 mm OD" },
      { label: "Formats", value: "50 m coils and 6 m lengths" },
      { label: "Colour", value: "Black; red for telecoms on request" },
    ],
    doList: ["We supply ducting and couplings", "We deliver to site across Africa"],
  }),

  // ── Gabions ─────────────────────────────────────────────────────────────────
  "square-weld-mesh-gabion-baskets": family({
    intro:
      "We make Class A galvanised square welded mesh gabions in our own facility and build retaining, crusher and feature walls with them.",
    industries: [IND.mining, IND.transport, IND.water],
    install: INSTALL.gabion,
    manufactured: [{ label: "Welded mesh gabions", anchor: "made-gabions" }],
    builds: [
      { label: "Crusher & retaining walls", value: "Rock-filled gravity walls" },
      { label: "Feature & boundary walls", value: "Architectural square-mesh walls" },
    ],
    specsTitle: "Weldmesh Gabion Key Specifications",
    specs: [
      { label: "Apertures", value: "50 × 50, 50 × 100 and 75 × 75 mm" },
      { label: "Wire", value: "3.00 to 3.15 mm, Class A galvanised" },
      { label: "Supply", value: "Baskets, panels or rolls, flat-packed" },
    ],
    doList: ["We make the baskets", "We assemble, fill and close them with our own crews"],
  }),
  "galvanised-woven-gabion-baskets": family({
    intro:
      "We supply Class A galvanised and PVC-coated woven gabion baskets and build retaining walls, river works and mine walls with them.",
    industries: [IND.mining, IND.transport, IND.water, IND.env],
    install: INSTALL.gabion,
    builds: [
      { label: "Retaining & mine walls", value: "Flexible gravity walls" },
      { label: "River training", value: "Bank and weir protection" },
    ],
    specsTitle: "Woven Gabion Key Specifications",
    specs: [
      { label: "Mesh", value: "80 × 100 mm hexagonal double-twist" },
      { label: "Wire", value: "2.7 mm, Class A galvanised (SANS 675)" },
      { label: "PVC option", value: "0.5 mm grey PVC" },
    ],
    doList: ["We supply baskets and lacing wire", "We assemble, fill and close them on site"],
  }),
  "river-reno-matresses": family({
    intro:
      "We supply and install Reno mattresses for riverbed scour protection, bank revetments and channel lining.",
    industries: [IND.water, IND.mining, IND.transport, IND.env],
    install: INSTALL.gabion,
    builds: [
      { label: "Channels & spillways", value: "Mattress lining" },
      { label: "Riverbeds & banks", value: "Scour protection and revetments" },
    ],
    specsTitle: "Reno Mattress Key Specifications",
    specs: [
      { label: "Standard", value: "60 × 80 mm mesh, 2.2 mm wire" },
      { label: "Heavy duty", value: "80 × 100 mm mesh, 2.7 mm wire" },
      { label: "Coating", value: "Class A galvanised (SANS 1580), PVC option" },
    ],
    doList: ["We supply mattresses", "We place, fill and lace them on site"],
  }),

  // ── Dewatering ──────────────────────────────────────────────────────────────
  "geotube-dewatering-systems": family({
    intro:
      "We supply and install GEOTUBE® dewatering systems by Solmax for high-volume dewatering of tailings, dredge spoil and sludge.",
    industries: [IND.mining, IND.water, IND.waste, IND.env],
    builds: [
      { label: "Tailings & dredge dewatering", value: "Large-format containment" },
      { label: "Pond desludging", value: "Volume reduction before disposal" },
    ],
    specsTitle: "GEOTUBE® Key Specifications",
    specs: [
      { label: "Grades", value: "GT500 and GT1000M" },
      { label: "Tensile strength MD", value: "78.8 / 175.0 kN/m (ASTM D4595)" },
      { label: "Factory seam strength", value: "70.0 / 88.0 kN/m (ASTM D4884)" },
      { label: "AOS", value: "0.43 / 0.60 mm (ASTM D4751)" },
    ],
    doList: ["We run feed trials", "We build the pad, fill and manage the tubes"],
  }),
  "flowtex-dewatering-tubes-bags": family({
    intro:
      "We manufacture FlowTex™ dewatering bags and tubes in South Africa and run desludging and dewatering on site.",
    industries: [IND.mining, IND.water, IND.waste, IND.env],
    manufactured: [
      { label: "Dewatering tubes", anchor: "made-dewatering-tubes" },
      { label: "Dewatering bags", anchor: "made-dewatering-bags" },
    ],
    builds: [
      { label: "Pond & dam desludging", value: "Returned to service" },
      { label: "Wash-plant & borehole slurry", value: "On-site dewatering" },
      { label: "Construction runoff", value: "Bags at sumps and excavations" },
    ],
    specsTitle: "FlowTex™ Key Specifications",
    specs: [
      { label: "Grades", value: "HF WG30, WG45 and WG60" },
      { label: "Fabric", value: "Slit-film woven PP, UV-stabilised" },
      { label: "Tensile strength", value: "30, 45 and 60 kN/m biaxial" },
      { label: "Ports", value: "Reinforced infill ports" },
    ],
    doList: ["We make bags and tubes to size", "We fill, monitor and manage filtrate on site"],
  }),
  "geo-curtain-silt-turbidity-curtains": family({
    intro:
      "We make GeoCurtain™ silt curtains in three classes and deploy, maintain and recover them on marine, river and mine water works.",
    industries: [IND.mining, IND.env, IND.oil, IND.water],
    install: INSTALL.curtain,
    builds: [
      { label: "TSF pools & return water dams", value: "Sediment containment during desludging" },
      { label: "Dredging & port works", value: "Turbidity barriers" },
      { label: "River crossings", value: "Bridge and causeway works" },
    ],
    specsTitle: "GeoCurtain™ Classes",
    specs: [
      { label: "Class 1", value: "400 g/m² float chamber, skirt to 2 m" },
      { label: "Class 2", value: "610 g/m², skirt to 8 m" },
      { label: "Class 3", value: "900 g/m², skirt to 20 m" },
      { label: "Skirt", value: "260 g/m² geotextile, galvanised ballast chain" },
    ],
    doList: ["We size to your survey and tidal range", "We deploy, maintain and recover"],
  }),

  // ── Permeable paving ────────────────────────────────────────────────────────
  "bera-gravel-fix": family({
    intro:
      "We supply BERA Gravel Fix® Pro grids with factory-attached DuPont™ Typar® geotextile for stable gravel driveways, parking and paths.",
    industries: [IND.agri, IND.energy],
    builds: [{ label: "Gravel driveways & parking", value: "No ruts, no loose gravel" }],
    specsTitle: "Gravel Fix® Pro Key Specifications",
    specs: [
      { label: "Sheet", value: "1,176 × 764 × 32 mm (0.9 m²)" },
      { label: "Cells", value: "Hexagonal, 42 mm" },
      { label: "Gravel fill", value: "About 50 l/m²" },
    ],
    doList: ["We supply from stock for quick despatch", "We deliver across Africa"],
  }),
  "bera-stable-fix": family({
    intro:
      "We supply BERA® Stable Fix Eco interlocking grids for gravel or grass driveways, parking, access routes and equestrian yards.",
    industries: [IND.agri, IND.transport],
    builds: [{ label: "Access routes & yards", value: "Connected cellular paving" }],
    specsTitle: "Stable Fix Eco Key Specifications",
    specs: [
      { label: "Grid", value: "500 × 500 × 40 mm" },
      { label: "Compressive strength (empty)", value: "Up to 250 to 500 t/m²" },
    ],
    doList: ["We supply from stock", "We deliver across Africa"],
  }),
  "bera-grass-fix": family({
    intro:
      "We supply BERA® Grass Fix Eco+ recycled HDPE pavers for green parking, grass driveways and emergency access.",
    industries: [IND.agri, IND.transport],
    builds: [{ label: "Green parking & fire access", value: "Grass reinforced against traffic" }],
    specsTitle: "Grass Fix Eco+ Key Specifications",
    specs: [
      { label: "Material", value: "100% recycled HDPE, green or grey" },
      { label: "Sheet", value: "55 × 38 × 3.1 cm (0.21 m²)" },
      { label: "Standards", value: "REACH, ISO 9001, ISO 14001, EPD" },
    ],
    doList: ["We supply from stock", "We deliver across Africa"],
  }),
  "bera-eco-edge": family({
    intro: "We supply BERA® Eco Edge flexible recycled edging for neat lawn, bed and path borders.",
    industries: [IND.agri],
    builds: [{ label: "Lawns, beds & paths", value: "Clean flexible edges" }],
    specsTitle: "Eco Edge Key Specifications",
    specs: [
      { label: "Roll", value: "10 m, 140 mm high" },
      { label: "Pin spacing", value: "500 mm" },
    ],
    doList: ["We supply edging and pins", "We include it in landscape packages"],
  }),

  // ── Sand containers ─────────────────────────────────────────────────────────
  "geotextile-sand-bags": family({
    intro:
      "We manufacture FlowTex™ GSC NW nonwoven sand containers and place them for revetments, dune protection and scour defence.",
    industries: [IND.env, IND.water, IND.oil],
    install: INSTALL.sand,
    manufactured: [{ label: "Sand containers", anchor: "made-sand-containers" }],
    builds: [
      { label: "Coastal revetments", value: "Stretcher-bond walls" },
      { label: "Dune toes & riverbanks", value: "Lighter, hand-filled grades" },
      { label: "Flood response", value: "40 kg units" },
    ],
    specsTitle: "FlowTex™ GSC NW Grades",
    specs: [
      { label: "NW40 / NW70", value: "40 / 70 kg, 200 g/m² fabric" },
      { label: "NW400", value: "400 kg, 800 g/m²" },
      { label: "NW1350 / NW1800", value: "1,350 / 1,800 kg, 800 g/m²" },
      { label: "Range", value: "Seven grades up to 4,000 kg" },
    ],
    doList: ["We make every container", "We fill and place them with photographic sign-off"],
  }),
  "woven-geotextile-sand-bags": family({
    intro:
      "We manufacture FlowTex™ GSC W woven sand containers for groynes, scour aprons and structural river works.",
    industries: [IND.env, IND.oil, IND.water],
    install: INSTALL.sand,
    manufactured: [{ label: "Sand containers", anchor: "made-sand-containers" }],
    builds: [
      { label: "Groynes & scour aprons", value: "High-strength woven units" },
      { label: "Structural revetments", value: "Heavy-duty armour" },
    ],
    specsTitle: "FlowTex™ GSC W Grades",
    specs: [
      { label: "W30", value: "400 kg, 145 g/m²" },
      { label: "W45", value: "1,000 kg, 210 g/m²" },
      { label: "W60", value: "1,800 kg, 280 g/m²" },
      { label: "W105", value: "4,000 kg, 500 g/m²" },
    ],
    doList: ["We make every container", "We fill and place them with photographic sign-off"],
  }),

  // ── Waterproofing & concrete protection ─────────────────────────────────────
  "damp-proof-membrane-dpm-construction-plastic-sheeting-250-375-500-micron": family({
    intro:
      "We supply SABS-approved DPM and construction sheeting to SANS 952 for slabs, foundations, basements and civil works.",
    industries: [IND.transport],
    builds: [{ label: "Slabs & foundations", value: "Damp-proofing under concrete" }],
    specsTitle: "DPM Key Specifications",
    specs: [
      { label: "Grades", value: "250, 375 and 500 micron" },
      { label: "Standard", value: "SANS 952" },
      { label: "Material", value: "LDPE" },
    ],
    doList: ["We supply from stock", "We deliver to site"],
  }),
  "concrete-curing-hessian-jute": family({
    intro:
      "We supply CureLock™ jute hessian and cure slabs, columns, bridges and precast elements with trained crews.",
    industries: [IND.transport],
    builds: [{ label: "Slabs, bridges & precast", value: "Moist curing of fresh concrete" }],
    specsTitle: "CureLock™ Key Specifications",
    specs: [
      { label: "Grades", value: "Type I 213 g/m² and Type II 270 g/m²" },
      { label: "Material", value: "100% natural jute, plain weave" },
    ],
    doList: ["We supply hessian", "We install and keep curing records"],
  }),
  "flexible-concrete-liner-system-for-africa-tiltex-gccm": family({
    intro:
      "We supply and install TILTEX™ GCCM, concrete in a roll: unrolled, anchored and hydrated in place for channels, spillways and slopes.",
    industries: [IND.mining, IND.water, IND.transport],
    install: INSTALL.gccm,
    builds: [
      { label: "TSF spillways & diversion channels", value: "Concrete lining with no formwork" },
      { label: "Stormwater drains & culvert outlets", value: "Erosion-proof lining" },
      { label: "Slope protection over liners", value: "Hard armour on geomembranes" },
    ],
    specsTitle: "TILTEX™ Key Specifications",
    specs: [
      { label: "Grades", value: "TILTEX 7P (7 mm) and 9P (9 mm)" },
      { label: "Mass", value: "7,600 / 9,600 g/m²" },
      { label: "Tensile strength", value: "20 / 20 kN/m (EN ISO 10319)" },
      { label: "Set", value: "Starts within 90 minutes; full strength at 28 days" },
    ],
    doList: ["We supply TILTEX™", "We deploy, fasten, hydrate and cure on site"],
  }),
  "studded-hdpe-concrete-liners-cpl": family({
    intro:
      "We supply and install GSE® Studliner®, studded HDPE cast into concrete to protect sewers, manholes, tanks and industrial containment.",
    industries: [IND.oil, IND.water, IND.mining],
    install: INSTALL.concrete,
    builds: [
      { label: "Sewers & manholes", value: "Protection from corrosive gases" },
      { label: "Tanks & sumps", value: "Chemical containment lining" },
    ],
    specsTitle: "Studliner® Key Specifications",
    specs: [
      { label: "Thickness", value: "2, 3, 4 and 5 mm" },
      { label: "Density", value: "0.94 g/cm³" },
      { label: "Stud pull-out strength", value: "> 670 kPa" },
      { label: "Elongation at break", value: "500%" },
    ],
    doList: ["We prefabricate Studliner® to size", "We weld and spark or vacuum test every seam"],
  }),
};
