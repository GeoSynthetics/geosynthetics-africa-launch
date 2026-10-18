/**
 * Built-in QA/QC checklists and standards per product family.
 *
 * Used on product pages when the family has no QA content saved in Site Builder.
 * Grouped by how each product type is installed and tested; based on the
 * published GRI, ASTM, ISO and EN standards named in each entry. Site Builder
 * entries for a family always take precedence over these defaults.
 */
export interface QaContent {
  checklist: { title: string; description: string }[];
  standards: string[];
}

const PROFILES: Record<string, QaContent> = {
  thermo_gm: {
    checklist: [
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade signed off before deployment: smooth, compacted, free of stones, roots and protrusions, and no standing water or desiccation cracks.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll numbers and manufacturer QC certificates checked against GRI-GM13 (HDPE) or GRI-GM17 (LLDPE); conformance samples taken where the CQA plan requires.",
      },
      {
        title: "Trial Welds",
        description:
          "Trial seams made and peel/shear tested at the start of each shift, for each welder and machine, and whenever conditions change.",
      },
      {
        title: "Non-Destructive Seam Testing",
        description:
          "100% of seams tested: air-pressure testing of double-wedge welds (ASTM D5820) and vacuum-box testing of extrusion welds, patches and repairs (ASTM D5641).",
      },
      {
        title: "Destructive Seam Testing",
        description:
          "Seam samples cut at intervals set by the CQA plan (GRI-GM14) and tested in shear and peel to ASTM D6392 against GRI-GM19 values.",
      },
      {
        title: "Leak Location Survey",
        description:
          "Electrical leak location survey (ASTM D7007 for covered liners, ASTM D7002/D7703 for exposed liners) where specified, before handover.",
      },
      {
        title: "Panel Layout & Repairs Record",
        description:
          "As-built panel layout, seam log and repair log kept and signed off, with every repair vacuum-tested.",
      },
    ],
    standards: [
      "GRI-GM13 (HDPE) / GRI-GM17 (LLDPE) material specification",
      "GRI-GM19 seam strength requirements",
      "ASTM D6392 seam strength testing",
      "ASTM D5820 air channel / ASTM D5641 vacuum box testing",
      "ASTM D7007 electrical leak location (where specified)",
      "Manufacturer QC certificates per roll",
    ],
  },
  floating_cover: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Roll numbers and manufacturer QC certificates checked against GRI-GM13 (HDPE) or GRI-GM17 (LLDPE); conformance samples taken where the CQA plan requires.",
      },
      {
        title: "Trial Welds",
        description:
          "Trial seams made and peel/shear tested at the start of each shift, for each welder and machine, and whenever conditions change.",
      },
      {
        title: "Non-Destructive Seam Testing",
        description:
          "100% of seams tested: air-pressure testing of double-wedge welds (ASTM D5820) and vacuum-box testing of extrusion welds, patches and repairs (ASTM D5641).",
      },
      {
        title: "Destructive Seam Testing",
        description:
          "Seam samples cut at intervals set by the CQA plan (GRI-GM14) and tested in shear and peel to ASTM D6392 against GRI-GM19 values.",
      },
      {
        title: "Cover System Check",
        description:
          "Ballast, float and sump layout, rainwater removal and perimeter anchorage installed to the approved cover design.",
      },
      {
        title: "Potable Water Approval",
        description:
          "Where the cover is in contact with drinking water, material approval for potable water use confirmed before installation.",
      },
    ],
    standards: [
      "GRI-GM13 / GRI-GM17 material specification",
      "GRI-GM19 seam strength requirements",
      "ASTM D6392 seam strength testing",
      "ASTM D5820 / ASTM D5641 non-destructive testing",
      "Potable water approval (where applicable)",
    ],
  },
  concrete_liner: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Formwork Fixing",
        description:
          "Sheets fixed to formwork with anchor studs facing the concrete, joints aligned and no studs bent or damaged before the pour.",
      },
      {
        title: "Concrete Placement",
        description:
          "Concrete placed and vibrated so studs are fully embedded without displacing or tearing the liner.",
      },
      {
        title: "Joint Welding",
        description:
          "Joints between sheets and at construction joints closed with extrusion-welded strips after stripping the formwork.",
      },
      {
        title: "Weld Testing",
        description:
          "100% of welds tested by vacuum box (ASTM D5641) or spark testing, with repairs re-tested.",
      },
    ],
    standards: [
      "Manufacturer QC certificates per roll",
      "Extrusion welds to manufacturer's installation guide",
      "ASTM D5641 vacuum box testing",
      "Spark (holiday) testing where specified",
    ],
  },
  pvc: {
    checklist: [
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade signed off before deployment: smooth, compacted, free of stones, roots and protrusions, and no standing water or desiccation cracks.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll certificates checked against ASTM D7176 (PVC geomembranes) and the project specification.",
      },
      {
        title: "Trial Seams",
        description:
          "Trial seams (hot wedge, hot air or solvent, as specified) made and tested each shift before production seaming.",
      },
      {
        title: "Non-Destructive Seam Testing",
        description:
          "100% of seams tested by air channel, air lance or vacuum box as appropriate to the seam type (ASTM D4437).",
      },
      {
        title: "Destructive Seam Testing",
        description:
          "Seam samples tested in shear and peel (ASTM D6392) at the frequency in the CQA plan.",
      },
      {
        title: "Cover & Protection",
        description:
          "Liner covered or protected promptly where specified; no traffic directly on the liner.",
      },
    ],
    standards: [
      "ASTM D7176 PVC geomembrane specification",
      "ASTM D4437 non-destructive seam testing",
      "ASTM D6392 seam strength testing",
      "Manufacturer QC certificates per roll",
    ],
  },
  epdm: {
    checklist: [
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade signed off before deployment: smooth, compacted, free of stones, roots and protrusions, and no standing water or desiccation cracks.",
      },
      {
        title: "Material Conformance",
        description:
          "Sheet certificates checked against GRI-GM21 (EPDM) and the project specification.",
      },
      {
        title: "Seam Preparation",
        description:
          "Seam areas cleaned and primed; seam tape or splice applied to the manufacturer's procedure and rolled down.",
      },
      {
        title: "Seam Inspection",
        description:
          "100% of seams probed and visually inspected; vacuum box testing where accessible (ASTM D4437).",
      },
      {
        title: "Penetrations & Details",
        description:
          "Pipe boots, corners and anchor trench details completed with factory or field-fabricated details to the manufacturer's guide.",
      },
    ],
    standards: [
      "GRI-GM21 EPDM geomembrane specification",
      "ASTM D4437 non-destructive seam testing",
      "Manufacturer installation guide",
      "Manufacturer QC certificates per roll",
    ],
  },
  fpp: {
    checklist: [
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade signed off before deployment: smooth, compacted, free of stones, roots and protrusions, and no standing water or desiccation cracks.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll certificates checked against GRI-GM18 (fPP / fPP-R) and the project specification.",
      },
      {
        title: "Trial Welds",
        description: "Trial seams made and tested each shift for each welder and machine.",
      },
      {
        title: "Non-Destructive Seam Testing",
        description:
          "100% of seams tested by air channel (ASTM D5820), air lance or vacuum box (ASTM D4437).",
      },
      {
        title: "Destructive Seam Testing",
        description:
          "Seam samples tested in shear and peel (ASTM D6392) at the frequency in the CQA plan.",
      },
    ],
    standards: [
      "GRI-GM18 fPP / fPP-R geomembrane specification",
      "ASTM D5820 / ASTM D4437 non-destructive testing",
      "ASTM D6392 seam strength testing",
      "Manufacturer QC certificates per roll",
    ],
  },
  cspe: {
    checklist: [
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade signed off before deployment: smooth, compacted, free of stones, roots and protrusions, and no standing water or desiccation cracks.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll certificates checked against the project specification and potable water approval where required.",
      },
      {
        title: "Trial Seams",
        description: "Trial seams made and tested each shift before production seaming.",
      },
      {
        title: "Non-Destructive Seam Testing",
        description: "100% of seams tested by air lance or vacuum box (ASTM D4437).",
      },
      {
        title: "Destructive Seam Testing",
        description:
          "Seam samples tested in shear and peel (ASTM D6392) at the frequency in the CQA plan.",
      },
    ],
    standards: [
      "ASTM D4437 non-destructive seam testing",
      "ASTM D6392 seam strength testing",
      "Manufacturer QC certificates per roll",
      "Potable water approval (where applicable)",
    ],
  },
  bgm: {
    checklist: [
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade signed off before deployment: smooth, compacted, free of stones, roots and protrusions, and no standing water or desiccation cracks.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll certificates checked against the manufacturer's specification and the project specification.",
      },
      {
        title: "Overlap & Torch Welding",
        description:
          "Overlaps set to the manufacturer's minimum and torch-welded with continuous bitumen bleed-out along the seam edge.",
      },
      {
        title: "Seam Inspection",
        description:
          "100% of seams inspected visually and probed; ultrasonic or vacuum testing where specified.",
      },
      {
        title: "Destructive Seam Testing",
        description:
          "Seam samples tested for tensile shear strength to ASTM D7056 at the frequency in the CQA plan.",
      },
    ],
    standards: [
      "ASTM D7056 bituminous geomembrane seam shear strength",
      "Manufacturer installation guide",
      "Manufacturer QC certificates per roll",
    ],
  },
  gcl: {
    checklist: [
      {
        title: "Storage & Handling",
        description:
          "Rolls stored and handled to ASTM D5888: off the ground, fully covered and kept dry; any rolls hydrated before installation rejected or replaced.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll certificates checked against GRI-GCL3: bentonite mass per area, swell index, fluid loss, peel strength and permeability.",
      },
      {
        title: "Subgrade Acceptance",
        description:
          "Subgrade smooth, firm and free of stones and standing water before placing the GCL.",
      },
      {
        title: "Placement & Overlaps",
        description:
          "GCL placed to ASTM D6102 with the correct side up, panel overlaps and supplementary bentonite at overlaps to the manufacturer's requirement.",
      },
      {
        title: "Cover Placement",
        description:
          "Covered with the overlying geomembrane or soil the same day; no equipment directly on the GCL; damaged areas patched with an oversized overlapping piece.",
      },
    ],
    standards: [
      "GRI-GCL3 GCL specification",
      "ASTM D5888 storage and handling",
      "ASTM D6102 installation guide",
      "Manufacturer QC certificates per roll",
    ],
  },
  geotextile: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Rolls identified, stored and handled to ASTM D4873: wrapped, off the ground and protected from UV until installation.",
      },
      {
        title: "Material Conformance",
        description:
          "Roll labels and certificates checked against the specified class (e.g. AASHTO M288) and properties: mass, tensile strength (ISO 10319 / ASTM D4632), CBR puncture (ISO 12236) and opening size.",
      },
      {
        title: "Subgrade Preparation",
        description:
          "Surface cleared of sharp objects and graded so the geotextile lies flat without folds or bridging.",
      },
      {
        title: "Placement & Overlaps",
        description:
          "Overlaps or sewn seams to the specified minimum; geotextile anchored against wind and placed in the direction of fill placement.",
      },
      {
        title: "Cover & Damage Check",
        description:
          "Covered within the UV exposure limit stated by the manufacturer; tears or holes patched with an overlapping piece before covering.",
      },
    ],
    standards: [
      "ASTM D4873 identification, storage and handling",
      "ASTM D4759 conformance to manufacturer specification",
      "ISO 10319 / ASTM D4632 tensile strength",
      "ISO 12236 CBR puncture resistance",
      "AASHTO M288 (where specified)",
    ],
  },
  silt_fence: {
    checklist: [
      {
        title: "Material Conformance",
        description: "Fabric checked against ASTM D6461 and the project specification.",
      },
      {
        title: "Alignment",
        description: "Fence installed along the contour, with ends turned upslope.",
      },
      {
        title: "Trenching & Posts",
        description:
          "Bottom of the fabric entrenched and backfilled, posts driven at the spacing in the design, installed to ASTM D6462.",
      },
      {
        title: "Inspection & Maintenance",
        description:
          "Inspected after each rainfall event; sediment removed before it reaches half the fence height; damaged sections replaced.",
      },
    ],
    standards: ["ASTM D6461 silt fence materials", "ASTM D6462 silt fence installation"],
  },
  root_barrier: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Trench & Depth",
        description:
          "Barrier installed to the design depth with the top edge left above finished ground level.",
      },
      {
        title: "Joints",
        description: "Joints overlapped and sealed or welded to the manufacturer's guide.",
      },
      {
        title: "Root Resistance Evidence",
        description:
          "Root-resistance test evidence (e.g. FLL or EN 13948) provided for the specified product where root resistance is claimed.",
      },
    ],
    standards: [
      "Manufacturer installation guide",
      "Root-resistance test certificate (FLL or EN 13948) where applicable",
    ],
  },
  weedblock: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Ground Preparation",
        description: "Area cleared of existing weeds and levelled before laying.",
      },
      {
        title: "Overlaps & Pinning",
        description: "Overlaps and pin spacing to the manufacturer's guide; edges secured.",
      },
      {
        title: "Cover",
        description:
          "Covered with mulch, gravel or other finish where UV exposure is not intended.",
      },
    ],
    standards: ["Manufacturer installation guide", "Manufacturer QC certificates per roll"],
  },
  geogrid_base: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Rolls identified to ISO 10320, stored flat and protected from UV until installation.",
      },
      {
        title: "Material Conformance",
        description:
          "Certificates checked against the specified properties: tensile strength (ISO 10319 / ASTM D6637), junction efficiency and aperture size.",
      },
      {
        title: "Subgrade Preparation",
        description:
          "Subgrade graded and proof-rolled; soft spots treated as directed by the engineer.",
      },
      {
        title: "Placement & Overlaps",
        description:
          "Geogrid laid flat and tensioned by hand, overlaps to the design (typically increasing on soft subgrades), and pinned where needed.",
      },
      {
        title: "Fill Placement",
        description:
          "Aggregate end-tipped and spread ahead of equipment; no tracked plant directly on the geogrid; minimum fill thickness before trafficking.",
      },
    ],
    standards: [
      "ISO 10319 / ASTM D6637 tensile strength",
      "ISO 10320 identification on site",
      "Manufacturer QC certificates per roll",
    ],
  },
  geogrid_soil: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Rolls identified to ISO 10320, stored flat and protected from UV until installation.",
      },
      {
        title: "Material Conformance",
        description:
          "Certificates checked against the design: ultimate tensile strength (ISO 10319 / ASTM D6637) and long-term design strength including creep (ISO 13431 / ASTM D5262).",
      },
      {
        title: "Orientation & Length",
        description:
          "Primary strength direction laid perpendicular to the wall face; reinforcement lengths and vertical spacing checked against the design drawings.",
      },
      {
        title: "Tensioning & Connection",
        description:
          "Reinforcement pulled taut before fill; facing connections made to the system's tested detail.",
      },
      {
        title: "Fill & Compaction",
        description:
          "Fill material and compaction checked against the specification; lightweight compaction plant within the zone near the face.",
      },
    ],
    standards: [
      "ISO 10319 / ASTM D6637 tensile strength",
      "ISO 13431 / ASTM D5262 creep testing",
      "FHWA-NHI-10-024 MSE wall design and construction (where applicable)",
      "Manufacturer QC certificates per roll",
    ],
  },
  asphalt_interlayer: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Surface Preparation",
        description:
          "Existing surface cleaned, cracks sealed and potholes repaired; surface dry before laying.",
      },
      {
        title: "Tack Coat",
        description:
          "Bitumen tack coat applied at the rate set for the product (ASTM D6140 asphalt retention for paving fabrics) and evenly spread.",
      },
      {
        title: "Placement",
        description:
          "Interlayer laid without wrinkles; overlaps and transverse joints to the manufacturer's guide; folds cut and lapped.",
      },
      {
        title: "Overlay",
        description:
          "Asphalt overlay placed at the specified minimum thickness and temperature; no sharp turning of plant on the interlayer.",
      },
    ],
    standards: [
      "ASTM D6140 asphalt retention (paving fabrics)",
      "ISO 10319 tensile strength (grids)",
      "Manufacturer installation guide",
    ],
  },
  recp: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Product category checked against the design (e.g. ECTC classification); tensile strength (ASTM D6818) and performance data (ASTM D6459 slopes / ASTM D6460 channels).",
      },
      {
        title: "Seedbed Preparation",
        description:
          "Slope graded smooth, topsoiled and seeded before installing the blanket; clods and stones removed.",
      },
      {
        title: "Anchor Trench & Stapling",
        description:
          "Top anchor trench, overlaps (upslope over downslope) and staple pattern to the manufacturer's guide.",
      },
      {
        title: "Contact & Inspection",
        description:
          "Blanket in full contact with the soil; inspected after rainfall and repaired where undermined.",
      },
    ],
    standards: [
      "ASTM D6818 tensile properties",
      "ASTM D6459 slope erosion performance",
      "ASTM D6460 channel erosion performance",
      "Erosion Control Technology Council (ECTC) specifications",
    ],
  },
  geocell: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Certificates checked for cell depth, wall thickness and seam peel strength (ISO 13426-1).",
      },
      {
        title: "Expansion & Anchoring",
        description:
          "Sections fully expanded to the specified cell size and anchored at the top of slope and at the pin spacing in the design.",
      },
      {
        title: "Section Connections",
        description: "Adjacent sections stapled or connected to the manufacturer's detail.",
      },
      {
        title: "Infill",
        description:
          "Infill (soil, aggregate or concrete) placed from the top of slope down and slightly overfilled before compaction.",
      },
    ],
    standards: [
      "ISO 13426-1 strength of geocell junctions",
      "Manufacturer installation guide",
      "Manufacturer QC certificates per roll",
    ],
  },
  drain_geocomposite: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Certificates checked for transmissivity (ASTM D4716 / ISO 12958) at the design load and, for composites, ply adhesion.",
      },
      {
        title: "Orientation",
        description:
          "Laid with the flow direction downslope and the correct side facing the soil or geomembrane.",
      },
      {
        title: "Overlaps & Ties",
        description:
          "Core panels overlapped or butted and tied at the spacing in the manufacturer's guide; geotextile flaps overlapped or sewn.",
      },
      {
        title: "Cover",
        description:
          "Covered promptly with the specified material, avoiding damage to the underlying geomembrane.",
      },
    ],
    standards: [
      "ASTM D4716 / ISO 12958 in-plane flow capacity",
      "Manufacturer installation guide",
      "Manufacturer QC certificates per roll",
    ],
  },
  dimpled: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Orientation",
        description:
          "Dimples placed against the structure or soil as specified; filter fabric facing the backfill.",
      },
      {
        title: "Laps & Fixing",
        description:
          "Vertical and horizontal laps and fixing points to the manufacturer's guide; top edge closed with a finishing strip.",
      },
      {
        title: "Drainage Outlet",
        description: "Base connected to the drainage pipe or outlet; falls checked.",
      },
      {
        title: "Backfill",
        description: "Backfill placed in layers without tearing the fabric or crushing the board.",
      },
    ],
    standards: ["ISO 12958 in-plane flow capacity", "Manufacturer installation guide"],
  },
  pvd: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Certificates checked for discharge capacity (ASTM D4716) and filter properties against the design; guidance per ASTM D6917.",
      },
      {
        title: "Working Platform",
        description: "Drainage blanket or working platform placed before installation.",
      },
      {
        title: "Installation Records",
        description:
          "Each drain logged: location, depth, verticality and any obstructions; spacing checked against the design grid.",
      },
      {
        title: "Splices & Cut-off",
        description:
          "Splices made to the manufacturer's detail; drains cut off above the drainage blanket.",
      },
    ],
    standards: [
      "ASTM D6917 guide for PVDs",
      "ASTM D4716 discharge capacity",
      "Manufacturer QC certificates per roll",
    ],
  },
  strip_drain: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Certificates checked for discharge capacity (ASTM D4716) and filter fabric properties.",
      },
      {
        title: "Placement",
        description:
          "Drains laid to line and level in the trench or against the structure as designed.",
      },
      {
        title: "Outlet Connections",
        description:
          "Strip drains connected to collector pipes or outlets with the manufacturer's fittings.",
      },
      {
        title: "Backfill",
        description: "Backfilled with the specified material without displacing the drain.",
      },
    ],
    standards: ["ASTM D4716 discharge capacity", "Manufacturer installation guide"],
  },
  subsoil_pipe: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Pipe certificates checked for diameter, ring stiffness and perforation pattern against the specification.",
      },
      {
        title: "Trench & Bedding",
        description:
          "Trench excavated to line and grade; bedding and filter material placed as designed (geotextile wrap or sock where specified).",
      },
      {
        title: "Laying & Joints",
        description:
          "Pipe laid to the design fall with couplers fitted; perforations oriented as specified.",
      },
      {
        title: "Backfill & Flushing",
        description:
          "Backfilled with the specified drainage aggregate; outlets and rodding points installed and the line flushed or CCTV-inspected where required.",
      },
    ],
    standards: [
      "Manufacturer pipe specification and certificates",
      "Project drainage specification",
    ],
  },
  structured_pipe: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Pipe certificates checked for ring stiffness class (e.g. SN4/SN8) to EN 13476 / ISO 21138.",
      },
      {
        title: "Bedding & Haunching",
        description:
          "Trench, bedding and haunching material compacted as designed; installation practice per ASTM D2321 or the local equivalent.",
      },
      {
        title: "Jointing",
        description:
          "Seals fitted and joints fully engaged; joint water or air testing where specified.",
      },
      {
        title: "Deflection Check",
        description:
          "Post-installation deflection checked by mandrel or CCTV against the specification limit.",
      },
    ],
    standards: [
      "EN 13476 / ISO 21138 structured-wall pipe specification",
      "ASTM D2321 flexible pipe installation",
      "Manufacturer QC certificates",
    ],
  },
  duct: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Material Conformance",
        description:
          "Duct certificates checked for diameter, wall thickness and impact strength against the specification.",
      },
      {
        title: "Trench & Bedding",
        description:
          "Trench depth, bedding and cover depth checked against the design and the service owner's requirements.",
      },
      {
        title: "Joints & Draw Wire",
        description: "Couplers fitted and sealed; draw wire installed; duct ends capped.",
      },
      {
        title: "Proving",
        description:
          "Ducts proved with a mandrel or test rod after backfilling; warning tape placed above the duct.",
      },
    ],
    standards: [
      "Manufacturer duct specification and certificates",
      "Service owner / utility installation requirements",
    ],
  },
  gabion_woven: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Mesh, wire diameter and coating checked against EN 10223-3 or ASTM A975, with zinc / Zn-Al coating mass certificates (EN 10244-2) and polymer coating where specified.",
      },
      {
        title: "Foundation",
        description:
          "Foundation levelled and compacted; geotextile filter placed behind and under units where designed.",
      },
      {
        title: "Assembly & Lacing",
        description:
          "Units assembled square, diaphragms fixed, and adjacent units laced or ring-fastened along all edges to the specified pattern.",
      },
      {
        title: "Stone Fill & Bracing",
        description:
          "Hard, durable stone of the specified size placed in layers, with internal bracing wires at each third of height; facing stones hand-packed.",
      },
      {
        title: "Lid Closure",
        description: "Units slightly overfilled and lids laced tightly to all edges.",
      },
    ],
    standards: [
      "EN 10223-3 / ASTM A975 double-twisted mesh gabions",
      "EN 10244-2 metallic coatings on steel wire",
      "Manufacturer installation guide",
    ],
  },
  gabion_welded: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Welded mesh, wire diameter and coating checked against ASTM A974 or EN 10223-8, with coating mass certificates (EN 10244-2).",
      },
      {
        title: "Foundation",
        description:
          "Foundation levelled and compacted; geotextile filter placed behind and under units where designed.",
      },
      {
        title: "Assembly & Fastening",
        description:
          "Panels joined with spiral binders or rings at the specified spacing; units set square and level.",
      },
      {
        title: "Stone Fill & Bracing",
        description:
          "Hard, durable stone of the specified size placed in layers, with internal bracing wires at each third of height; facing stones hand-packed.",
      },
      {
        title: "Lid Closure",
        description: "Units slightly overfilled and lids laced tightly to all edges.",
      },
    ],
    standards: [
      "ASTM A974 / EN 10223-8 welded mesh gabions",
      "EN 10244-2 metallic coatings on steel wire",
      "Manufacturer installation guide",
    ],
  },
  bera: {
    checklist: [
      {
        title: "Sub-base Design",
        description:
          "Sub-base type and thickness confirmed for the traffic load class, and permeability checked so the system drains as designed.",
      },
      {
        title: "Sub-base Compaction",
        description:
          "Sub-base compacted and levelled to the falls and tolerance in the BERA installation guide.",
      },
      {
        title: "Panel Placement",
        description:
          "Panels laid with the geotextile backing down and connected with the integrated click joints; expansion gaps left at edges.",
      },
      {
        title: "Infill",
        description:
          "Panels filled with the specified infill (gravel grading, or soil and seed for grass systems) and topped up after settlement.",
      },
      {
        title: "Handover",
        description:
          "Load class and use confirmed with the client; maintenance instructions provided.",
      },
    ],
    standards: [
      "BERA installation guide for the specific system",
      "CIRIA C753 SuDS Manual (permeable surfaces)",
      "Manufacturer product certificates",
    ],
  },
  edging: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      { title: "Line & Level", description: "Edging set to the line and level on the drawings." },
      {
        title: "Fixing",
        description: "Pegs installed at the spacing in the manufacturer's guide; joints connected.",
      },
      { title: "Backfill", description: "Edging backfilled and compacted on both sides." },
    ],
    standards: ["Manufacturer installation guide"],
  },
  geotube: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Fabric certificates checked for tensile strength, seam strength (ASTM D4884) and opening size; dewatering performance confirmed by a hanging bag (ASTM D7701) or GDT test (ASTM D7880) with the actual sludge and polymer.",
      },
      {
        title: "Laydown Area",
        description:
          "Area levelled and lined with a drainage layer and, where required, a geomembrane to collect filtrate.",
      },
      {
        title: "Filling",
        description:
          "Fill ports connected; fill height monitored against the manufacturer's maximum; flocculant dose controlled.",
      },
      {
        title: "Filtrate Monitoring",
        description:
          "Filtrate clarity and solids monitored; tubes inspected for seam or fabric distress during filling.",
      },
    ],
    standards: [
      "ASTM D7880 geotextile dewatering test (GDT)",
      "ASTM D7701 hanging bag test",
      "ASTM D4884 seam strength",
      "Manufacturer filling guide",
    ],
  },
  silt_curtain: {
    checklist: [
      {
        title: "Delivery & Storage",
        description:
          "Materials checked against the delivery note and conformance certificates, stored off the ground, covered from UV and kept clear of sharp objects and fuel.",
      },
      {
        title: "Configuration",
        description:
          "Curtain type, depth and alignment checked against the design for water depth, current and wave conditions.",
      },
      {
        title: "Anchoring",
        description: "Anchors and mooring lines placed as designed; ballast chain hangs freely.",
      },
      {
        title: "Inspection",
        description:
          "Inspected daily during works for gaps, damage and anchor drag; turbidity monitored outside the curtain where required.",
      },
    ],
    standards: ["Manufacturer deployment guide", "Project environmental management plan"],
  },
  sandbag: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Fabric certificates checked for tensile strength, UV resistance (ASTM D4355) and seam strength (ASTM D4884).",
      },
      {
        title: "Filling",
        description:
          "Bags filled to the specified fill ratio with the specified material and closed as designed.",
      },
      {
        title: "Placement",
        description:
          "Bags placed in the designed pattern with staggered joints and correct orientation; geotextile filter beneath where designed.",
      },
      {
        title: "Inspection",
        description:
          "Units inspected for damage or displacement after storms and replaced where needed.",
      },
    ],
    standards: [
      "ASTM D4884 seam strength",
      "ASTM D4355 UV resistance",
      "Manufacturer installation guide",
    ],
  },
  dpm: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Film thickness (micron) and grade checked against the specification; vapour retarder performance to ASTM E1745 where specified.",
      },
      { title: "Substrate", description: "Blinding or sand bed level and free of sharp stones." },
      {
        title: "Laps & Sealing",
        description:
          "Laps of the specified width, sealed with compatible tape; penetrations sealed; installed to ASTM E1643 where specified.",
      },
      {
        title: "Protection",
        description:
          "Punctures repaired before reinforcement or concrete is placed; no traffic directly on the film.",
      },
    ],
    standards: [
      "ASTM E1745 vapour retarder specification (where specified)",
      "ASTM E1643 vapour retarder installation (where specified)",
      "Manufacturer product data",
    ],
  },
  hessian: {
    checklist: [
      {
        title: "Material",
        description:
          "Hessian free of contaminants that could stain or harm the concrete (ASTM C171 sheet curing materials).",
      },
      {
        title: "Placement",
        description:
          "Placed as soon as the surface will not be marked, with laps and edges weighted.",
      },
      { title: "Moisture", description: "Kept continuously wet for the specified curing period." },
    ],
    standards: ["ASTM C171 sheet materials for curing concrete", "Project concrete specification"],
  },
  gccm: {
    checklist: [
      {
        title: "Material Conformance",
        description:
          "Certificates checked against ASTM D8364 for the specified GCCM type and properties.",
      },
      {
        title: "Subgrade",
        description: "Subgrade shaped and compacted; vegetation and sharp objects removed.",
      },
      {
        title: "Placement & Joints",
        description:
          "Rolls placed with the specified overlaps and fixed by screws, staples or sealant to the manufacturer's guide.",
      },
      {
        title: "Hydration",
        description:
          "Fully hydrated with the specified water quantity; curing time observed before loading or water flow.",
      },
      {
        title: "Anchoring",
        description: "Anchor trench and edge terminations completed as designed.",
      },
    ],
    standards: ["ASTM D8364 GCCM material specification", "Manufacturer installation guide"],
  },
};

/** Product family slug (or id) → QA profile */
export const FAMILY_QA_PROFILE: Record<string, string> = {
  "hdpe-geomembranes": "thermo_gm",
  "textured-geomembranes": "thermo_gm",
  "lldpe-geomembrane-liners": "thermo_gm",
  "floating-cover-geomembranes": "floating_cover",
  "gse-polylock-t": "concrete_liner",
  "gse-studliner": "concrete_liner",
  "studded-hdpe-concrete-liners-cpl": "concrete_liner",
  "pvc-geomembranes": "pvc",
  "epdm-geomembranes": "epdm",
  "fpp-geomembrane-liners": "fpp",
  "rfpp-geomembrane-liners": "fpp",
  "pp-geomembranes-copy": "fpp",
  "bituminous-liners": "bgm",
  "speciality-geomembranes": "cspe",
  "cspe-geomembranes-for-potable-water-floating-covers": "cspe",
  "reinforced-sodium-bentonite-geosynthetic-clay-liners": "gcl",
  "hdpe-coated-bentonite-geosynthetic-clay-liners": "gcl",
  "polypropylene-non-woven-geotextiles": "geotextile",
  "polypropylene-woven-geotextiles": "geotextile",
  "pp-polytape-silt-fence": "silt_fence",
  "pp-root-barrier": "root_barrier",
  "pp-weedblock-ground-cover": "weedblock",
  "biaxial-geogrids": "geogrid_base",
  "triaxial-geogrids": "geogrid_base",
  "multi-axial-geogrids": "geogrid_base",
  "composite-geogrids": "geogrid_base",
  "uniaxial-geogrids": "geogrid_soil",
  "strip-bonded-geogrids": "geogrid_soil",
  "polymeric-geostrips": "geogrid_soil",
  "glass-asphalt-geogrid": "asphalt_interlayer",
  "asphalt-interlayer-composite": "asphalt_interlayer",
  "paving-fabrics": "asphalt_interlayer",
  "jute-soil-erosion-saver-control-blanket": "recp",
  "coir-fibre-soil-blankets": "recp",
  "straw-cellulose-erosion-blanket": "recp",
  "envirowool-soil-erosion-blankets": "recp",
  "geostrata-hdpe-geocells": "geocell",
  "polycell-polypropylene-geocells": "geocell",
  "leak-detection-drainage-sheets": "drain_geocomposite",
  "dimpled-drainage-boards": "dimpled",
  "prefabricated-vertical-drains-pvds": "pvd",
  "netlon-strip-drains": "strip_drain",
  "subsoil-drainage-pipes": "subsoil_pipe",
  "structured-wall-pipes": "structured_pipe",
  "cable-ducting-pipes": "duct",
  "galvanised-woven-gabion-baskets": "gabion_woven",
  "river-reno-matresses": "gabion_woven",
  "square-weld-mesh-gabion-baskets": "gabion_welded",
  "bera-gravel-fix": "bera",
  "bera-stable-fix": "bera",
  "bera-grass-fix": "bera",
  "bera-eco-edge": "edging",
  "geotube-dewatering-systems": "geotube",
  "flowtex-dewatering-tubes-bags": "geotube",
  "geo-curtain-silt-turbidity-curtains": "silt_curtain",
  "geotextile-sand-bags": "sandbag",
  "woven-geotextile-sand-bags": "sandbag",
  "dpc-damp-proof-membranes-construction-plastic-sheeting-": "dpm",
  "damp-proof-membrane-dpm-construction-plastic-sheeting-250-375-500-micron": "dpm",
  "concrete-curing-hessian-jute": "hessian",
  "tiltex-concrete-gccm-liner": "gccm",
  "flexible-concrete-liner-system-for-africa-tiltex-gccm": "gccm",
};

/** Default QA content for a product family, or null when none is defined. */
export function defaultQaForFamily(...keys: (string | null | undefined)[]): QaContent | null {
  for (const key of keys) {
    const profile = key ? FAMILY_QA_PROFILE[key] : undefined;
    if (profile && PROFILES[profile]) return PROFILES[profile];
  }
  return null;
}
