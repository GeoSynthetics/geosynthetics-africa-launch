/**
 * Products Geosynthetics Africa manufactures and fabricates in-house.
 * Each entry lists the raw-material inputs (ISO 9001-mill roll goods and wire),
 * the factory QA/QC applied to that product and its key specifications.
 * Keep specifications in line with the published catalogue and datasheets.
 */
export interface ManufacturedProduct {
  slug: string;
  name: string;
  summary: string;
  inputs: string[];
  qaqc: string[];
  specs: { label: string; value: string }[];
  link?: string;
}

export const MANUFACTURING_INPUTS_STATEMENT =
  "We fabricate only from roll goods and wire made in ISO 9001-certified mills: the same globally recognised geomembranes, geotextiles and wire specified on major projects worldwide. Each grade is manufactured and tested to GRI, ASTM or EN ISO requirements, with ASQUAL-certified geotextile grades where the specification calls for them, and every roll arrives with its mill certificate.";

export const MANUFACTURING_PROCESS: { title: string; text: string }[] = [
  {
    title: "Incoming material check",
    text: "We check every roll and coil against the order and its mill certificate, and record the roll or batch number before it enters production.",
  },
  {
    title: "Cut to drawing",
    text: "We cut panels to the approved drawing and check dimensions before joining, keeping the roll identity marked on every piece.",
  },
  {
    title: "Qualified joining",
    text: "We sew with UV-stabilised yarn on double-seam closures, and qualify every welder with a trial weld at the start of each shift and at every change of operator or conditions.",
  },
  {
    title: "In-process testing",
    text: "We test seams and welds on the finished article: seam strength on sewn work; air-pressure, vacuum-box and spark testing on welded work; peel and shear samples at set intervals.",
  },
  {
    title: "Final inspection and release",
    text: "We inspect dimensions, closures, ports and fittings, close out any repairs and sign the release before packing.",
  },
  {
    title: "Labelled dispatch",
    text: "We label every article with its product, size and batch, and issue the mill certificates, test results and packing list with the delivery.",
  },
];

const GEOTEXTILE_INPUT =
  "Polypropylene geotextile roll goods from ISO 9001-certified mills, UV-stabilised, with ASQUAL-certified grades where specified";
const GEOMEMBRANE_INPUT =
  "HDPE and LLDPE geomembrane from ISO 9001-certified mills, manufactured to GRI-GM13 (HDPE) and GRI-GM17 (LLDPE)";
const WELD_QAQC = [
  "Trial weld at the start of each shift and at every operator or condition change",
  "Fusion seams air-pressure tested to ASTM D5820; extrusion welds vacuum-box tested to ASTM D5641",
  "Destructive peel and shear samples tested to ASTM D6392",
  "Panel and weld log with roll numbers, issued with the article",
];

export const MANUFACTURED_PRODUCTS: ManufacturedProduct[] = [
  {
    slug: "sand-containers",
    name: "Geosynthetic Sand Containers (FlowTex™)",
    summary: "Nonwoven and woven containers for revetments, groynes, scour aprons and dune toes.",
    inputs: [
      "Needle-punched nonwoven PP (NW40 to NW4000) or woven PP (W30 to W105) roll goods",
      GEOTEXTILE_INPUT,
      "Tensile strength to EN ISO 10319 and opening size to EN ISO 12956 on the mill certificate",
    ],
    qaqc: [
      "Roll and batch identified at cutting and carried onto every container",
      "Double-seam closure in UV-stabilised yarn",
      "Seam strength verified to EN ISO 10319",
      "Dimensional check and batch label on every unit",
    ],
    specs: [
      { label: "Nonwoven tensile", value: "16 to 80 kN/m" },
      { label: "Nonwoven O90", value: "110 to 70 µm" },
      { label: "Woven tensile", value: "30 to 105 kN/m" },
      { label: "Filled mass", value: "40 to 4,000 kg" },
    ],
    link: "/products/geosynthetic-sand-containers",
  },
  {
    slug: "dewatering-tubes",
    name: "Dewatering Tubes (FlowTex™)",
    summary:
      "Large-format tubes for sludge, tailings and dredge dewatering, made to project dimensions.",
    inputs: [
      "High-strength woven PP monofilament and slit-film fabrics",
      GEOTEXTILE_INPUT,
      "Fabric opening size matched to the solids grading",
    ],
    qaqc: [
      "Fabric grade checked against the solids grading before cutting",
      "Sewn seams and closures inspected along their full length",
      "Fill ports positioned and checked against the site pumping layout",
      "Circumference, length and port positions recorded at release",
    ],
    specs: [
      { label: "Size", value: "Made to project circumference and length" },
      { label: "Ports", value: "Set to the site pumping arrangement" },
      { label: "Fabric", value: "Monofilament or slit-film woven PP" },
    ],
    link: "/products/dewatering-systems",
  },
  {
    slug: "dewatering-bags",
    name: "Dewatering Bags (FlowTex™)",
    summary: "Compact bags for pump discharge, sump and small-volume sludge dewatering.",
    inputs: ["Woven PP monofilament or slit-film fabric, or nonwoven PP", GEOTEXTILE_INPUT],
    qaqc: [
      "Fabric matched to the solids grading",
      "Double-seam closures and inlet sleeve inspected",
      "Dimensional check and batch label on every bag",
    ],
    specs: [
      { label: "Fabric", value: "Monofilament, slit-film or nonwoven PP" },
      { label: "Inlet", value: "Sleeve sized to the discharge hose" },
    ],
    link: "/products/dewatering-systems",
  },
  {
    slug: "silt-fence",
    name: "Reinforced Silt Fence (PolyTape™)",
    summary: "Sediment barriers for construction sites, haul roads and stockpiles.",
    inputs: ["UV-stabilised woven PP slit-film fabric", GEOTEXTILE_INPUT],
    qaqc: [
      "Panel height and length checked to the order",
      "Post pockets or fixings checked for spacing",
      "Roll label with grade, length and batch",
    ],
    specs: [
      { label: "Fabric", value: "UV-stabilised woven PP (PolyTape™ 30)" },
      { label: "Made to", value: "Required height, panel length and post spacing" },
    ],
    link: "/products/pp-polytape-silt-fence/pp-polytape-silt-fence",
  },
  {
    slug: "filter-socks",
    name: "Drainage Filter Socks",
    summary: "Geotextile socks that keep fines out of subsoil and slotted drainage pipes.",
    inputs: ["Nonwoven PP geotextile or knitted filter fabric", GEOTEXTILE_INPUT],
    qaqc: [
      "Sock diameter checked against the pipe outside diameter",
      "Opening size confirmed against the surrounding soil grading",
      "Seam inspected along the full length",
    ],
    specs: [
      { label: "Sized to", value: "Pipe outside diameter" },
      { label: "Filter", value: "Opening size matched to soil grading" },
    ],
  },
  {
    slug: "pvds",
    name: "Prefabricated Vertical Drains (PVDs)",
    summary:
      "Wick drains that accelerate consolidation of soft ground under embankments and platforms.",
    inputs: [
      "Polypropylene drainage core with a nonwoven geotextile filter jacket",
      "Core and filter from ISO 9001-certified mills, with discharge capacity tested to ASTM D4716",
    ],
    qaqc: [
      "Core and filter checked against the specified discharge capacity and filter opening size",
      "Jacket seal inspected along the strip",
      "Reel length and batch labelled",
    ],
    specs: [
      { label: "Supplied", value: "On reels for mandrel installation" },
      { label: "Filter", value: "Nonwoven geotextile jacket" },
    ],
    link: "/products/pipes-drainage-ducting/prefabricated-vertical-drains-pvds",
  },
  {
    slug: "fin-drains",
    name: "Fin Drains & Drainage Composites",
    summary:
      "Geotextile-wrapped drainage cores for retaining walls, slabs, landfills and sports fields.",
    inputs: [
      "HDPE or PP drainage core with a nonwoven PP filter wrap",
      "Core and filter from ISO 9001-certified mills, with in-plane flow tested to ASTM D4716",
    ],
    qaqc: [
      "Height and length checked to the order",
      "Filter wrap bonded or sealed along the full length",
      "Roll label with product, size and batch",
    ],
    specs: [
      { label: "Made to", value: "Required height" },
      { label: "Filter", value: "Nonwoven PP wrap" },
    ],
  },
  {
    slug: "drop-in-liners",
    name: "Drop-In Liners",
    summary:
      "Prefabricated geomembrane liners for tanks, ponds and pits, folded for direct placement.",
    inputs: [GEOMEMBRANE_INPUT],
    qaqc: [...WELD_QAQC, "Folded to a placement plan and labelled"],
    specs: [
      { label: "Material", value: "HDPE or LLDPE geomembrane" },
      { label: "Made to", value: "Tank, pond or pit dimensions" },
    ],
  },
  {
    slug: "floating-covers",
    name: "Floating Covers",
    summary: "Shop-welded cover panels for evaporation, odour and water-quality control.",
    inputs: ["Scrim-reinforced LLDPE (rLLDPE) or HDPE geomembrane from ISO 9001-certified mills"],
    qaqc: [
      ...WELD_QAQC,
      "Ballast pockets, sumps and hatches fabricated in and inspected",
      "Panels rolled and numbered to the as-built layout drawing",
    ],
    specs: [
      { label: "Material", value: "rLLDPE (e.g. FC45 at 1.14 mm) or HDPE" },
      { label: "Fabricated in", value: "Ballast pockets, sumps, hatches" },
    ],
    link: "/products/geomembrane-liners/floating-cover-geomembranes",
  },
  {
    slug: "pipe-boots",
    name: "Pipe Boots & Penetration Seals",
    summary: "Factory-made boots that seal liners around pipes and structures.",
    inputs: [GEOMEMBRANE_INPUT],
    qaqc: [
      "Made to the actual pipe diameter, wall angle and liner thickness",
      "Extrusion welds vacuum-box or spark tested",
      "Boot labelled with pipe size and location reference",
    ],
    specs: [
      { label: "Made to", value: "Pipe diameter, wall angle, liner thickness" },
      { label: "Material", value: "HDPE or LLDPE to match the liner" },
    ],
  },
  {
    slug: "liner-details",
    name: "Prefabricated Panels, Sumps & Corners",
    summary: "HDPE and LLDPE detail work welded to drawing before mobilisation.",
    inputs: [GEOMEMBRANE_INPUT],
    qaqc: WELD_QAQC,
    specs: [
      { label: "Made to", value: "Approved detail drawings" },
      { label: "Material", value: "HDPE or LLDPE geomembrane" },
    ],
  },
  {
    slug: "drainage-pipes",
    name: "Drilled & Slotted HDPE Drainage Pipes",
    summary: "PE100 HDPE pipe perforated for subsoil, leachate and heap-leach drainage.",
    inputs: ["PE100 HDPE pipe from ISO 9001-certified manufacturers"],
    qaqc: [
      "Hole or slot size, pattern and spacing checked against the specified open area",
      "Pipe length and diameter checked",
      "Pipe marked with size, class and batch",
    ],
    specs: [
      { label: "Material", value: "PE100 HDPE" },
      { label: "Perforation", value: "Drilled or slotted to the specified open area" },
    ],
    link: "/products/pipes-drainage-ducting/subsoil-drainage-pipes",
  },
  {
    slug: "gabions",
    name: "Welded Mesh Gabions & Mattresses",
    summary:
      "Welded mesh baskets and mattresses for retaining walls, channels and erosion protection.",
    inputs: ["Class A galvanised or PVC-coated steel wire to SANS 675"],
    qaqc: [
      "Wire diameter and coating class checked against the mill certificate",
      "Mesh aperture and panel dimensions checked",
      "Supplied flat-packed with lacing wire, stiffeners and diaphragms",
    ],
    specs: [
      { label: "Mesh", value: "50 × 50 mm square welded mesh" },
      { label: "Wire", value: "Class A galvanised or PVC-coated, SANS 675" },
    ],
    link: "/products/gabion-baskets/square-weld-mesh-gabion-baskets",
  },
];
