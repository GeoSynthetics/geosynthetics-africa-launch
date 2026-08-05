// Mock Data Structure representing GSE HD HDPE GEOMEMBRANES
export const mockProductFamilyData = {
  title: "GSE HD HDPE GEOMEMBRANES",
  subtitle:
    "GSE HD is a smooth, high quality, high density polyethylene (HDPE) geomembrane produced from specially formulated, virgin polyethylene resin. This polyethylene resin is designed specifically for flexible geomembrane applications.",
  stats: {
    projects: "1 of 5",
    countries: "30+",
    experts: "One scope",
    years: "100%",
  },
  technicalSpecText:
    "GSE HD is a smooth, high quality, high density polyethylene (HDPE) geomembrane produced from specially formulated, virgin polyethylene resin. This polyethylene resin is designed specifically for flexible geomembrane applications. It contains approximately 97.5% polyethylene, 2.5% carbon black and trace amounts of antioxidants and heat stabilizers; no other additives, fillers or extenders are used. GSE HD has outstanding chemical resistance, mechanical properties, environmental stress crack resistance, dimensional stability and thermal aging characteristics. GSE HD has excellent resistance to UV radiation and is suitable for exposed conditions. These product specifications meet or exceed GRI-GM13.",
  typicalValues: [
    { label: "Thickness", value: "1.0 - 2.5", unit: "mm" },
    { label: "Density", value: "0.940", unit: "g/cm³" },
    { label: "Tensile Strength", value: "29 - 72", unit: "kN/m" },
    { label: "Puncture Resistance", value: "350 - 800", unit: "N" },
  ],
  properties: {
    headers: ["PROPERTIES", "1.0 mm", "1.5 mm", "2.0 mm", "2.5 mm"],
    rows: [
      ["Thickness (Minimum Average)", "1.00 mm", "1.50 mm", "2.00 mm", "2.50 mm"],
      ["Density (Minimum)", "0.940 g/cc", "0.940 g/cc", "0.940 g/cc", "0.940 g/cc"],
      ["Tensile Strength at Yield", "15 kN/m", "22 kN/m", "29 kN/m", "37 kN/m"],
      ["Tensile Strength at Break", "27 kN/m", "40 kN/m", "53 kN/m", "67 kN/m"],
      ["Elongation at Yield", "12%", "12%", "12%", "12%"],
      ["Elongation at Break", "700%", "700%", "700%", "700%"],
      ["Tear Resistance", "125 N", "187 N", "249 N", "311 N"],
      ["Puncture Resistance", "352 N", "530 N", "703 N", "881 N"],
      ["Carbon Black Content", "2.0 - 3.0 %", "2.0 - 3.0 %", "2.0 - 3.0 %", "2.0 - 3.0 %"],
    ],
  },
  popularCatalogue: [
    {
      name: "GSE HD Smooth Black",
      spec: "1.5mm, GRI GM13",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    },
    {
      name: "GSE HD Smooth White",
      spec: "1.5mm, GRI GM13",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&q=80",
    },
    {
      name: "GSE HD Smooth Green",
      spec: "2.0mm, GRI GM13",
      image: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=200&q=80",
    },
  ],
  relatedProductGroups: [
    { name: "Smooth LLDPE Geomembranes", link: "/products/geomembranes/lldpe-geomembranes" },
    { name: "Textured HDPE Geomembranes", link: "/products/geomembranes/textured-geomembranes" },
    {
      name: "Textured LLDPE Geomembranes",
      link: "/products/geomembranes/textured-lldpe-geomembranes",
    },
  ],
  questions: [
    {
      q: "Is it exposed?",
      a: "Different types of Geomembranes perform very differently under UV exposure. HDPE and EPDM have excellent UV resistance while PVC requires burial.",
    },
    {
      q: "What is subgrade condition?",
      a: "The condition of the subgrade can dictate the thickness of the liner needed. Very rocky or uneven subgrades require thicker, more puncture-resistant liners like 2.0mm HDPE.",
    },
    {
      q: "Chemical composition of liquid?",
      a: "The chemical compatibility between the stored liquid and the geomembrane material is critical. HDPE offers the broadest chemical resistance for harsh industrial applications.",
    },
  ],
  installationSpecs:
    "Quality assurance during the design and installation of GSE HD HDPE Geomembrane is critical to the success of the containment system. The surface to be lined should be smooth, free of sharp objects, and properly compacted. All panels must be deployed with adequate overlap and welded using dual-track thermal fusion for long seams, and extrusion welding for patches and details. Non-destructive testing (air pressure for dual-track, vacuum box for extrusion) must be performed on 100% of the seams. Destructive peel and shear testing must be conducted at regular intervals per project specifications.",
  projects: [
    {
      name: "Tailings Dam Facility",
      location: "Rustenburg, South Africa",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
    },
    {
      name: "Municipal Landfill",
      location: "Nairobi, Kenya",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    },
    {
      name: "Gold Mine Heap Leach",
      location: "Tarkwa, Ghana",
      image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
    },
    {
      name: "Raw Water Reservoir",
      location: "Windhoek, Namibia",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
    },
  ],
  industries: [
    { label: "Mining", slug: "mining" },
    { label: "Water Management", slug: "water-management" },
    { label: "Construction & Infrastructure", slug: "construction-infrastructure" },
  ],
  applications: [
    "Mining (Heap Leach Pads, Tailings Impoundments)",
    "Environmental (Landfill Basal Lining, Capping)",
    "Water (Reservoirs, Dams, Canals, Ponds)",
    "Agriculture (Irrigation Ponds, Aquaculture)",
    "Energy (Brine Ponds, Evaporation Ponds)",
  ],
};
