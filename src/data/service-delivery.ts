/**
 * Service page content. Every service has its own tailored set of sections (tabs),
 * written in Geosynthetics Africa's own voice: we supply, fabricate, install, test and hand over.
 */
export type ServiceSection =
  | { id: string; label: string; title: string; kind: "text"; body: string; bullets?: string[] }
  | {
      id: string;
      label: string;
      title: string;
      kind: "steps";
      intro?: string;
      steps: { title: string; text: string }[];
    }
  | { id: string; label: string; title: string; kind: "list"; intro?: string; items: string[] }
  | {
      id: string;
      label: string;
      title: string;
      kind: "table";
      intro?: string;
      rows: { label: string; value: string }[];
    }
  | { id: string; label: string; title: string; kind: "manufactured-products"; intro?: string }
  | { id: string; label: string; title: string; kind: "manufacturing-process"; intro?: string };

export interface ServiceDeliveryProfile {
  title: string;
  summary: string;
  sections: ServiceSection[];
  why: string;
  applications: string[];
}

const WELD_TESTS = [
  {
    title: "Trial welds",
    text: "Every welder and machine runs a trial weld at the start of each shift and at every change of operator or conditions, and we peel-test it before production welding starts.",
  },
  {
    title: "Non-destructive testing",
    text: "We air-pressure test every double-track fusion seam and vacuum-box test every extrusion weld along its full length.",
  },
  {
    title: "Destructive testing",
    text: "We cut seam samples at the frequency set in our QA/QC plan and test them in peel and shear, on site or through SANAS-accredited laboratories in South Africa.",
  },
  {
    title: "Repairs and retests",
    text: "We mark, repair and retest every defect, and record each repair against the panel layout.",
  },
];

export const SERVICE_DELIVERY_PROFILES: Record<string, ServiceDeliveryProfile> = {
  "geomembrane-liner-installation-africa": {
    title: "Geomembrane Liner Installation Across Africa",
    summary:
      "We supply and install HDPE and other geomembrane liners for tailings, heap leach, water and waste containment, with our own IAGI-member welding crews and a documented QA/QC dossier on every project.",
    sections: [
      {
        id: "scope",
        label: "Scope",
        title: "What We Install",
        kind: "text",
        body: "We supply, deploy, weld and test geomembrane liners and their protection and drainage layers to the approved design. Appoint us for installation only or for an integrated supply-and-installation package; either way our own crews do the work and sign the records.",
        bullets: [
          "Tailings storage facilities and heap leach pads",
          "Process-water, stormwater and pollution-control dams",
          "Reservoirs, canals and irrigation storage",
          "Landfill cells, caps and secondary containment",
        ],
      },
      {
        id: "method",
        label: "Installation Method",
        title: "How We Install",
        kind: "steps",
        steps: [
          {
            title: "Subgrade acceptance",
            text: "We inspect and sign off the subgrade surface, compaction, anchor trenches and drainage interfaces before any panel is deployed.",
          },
          {
            title: "Panel layout and deployment",
            text: "We deploy panels to our approved layout drawing, recording roll number, panel number, position and weather for every panel.",
          },
          {
            title: "Welding",
            text: "We join panels with double-track fusion welds and complete details, penetrations and repairs with extrusion welds, using qualified welders and calibrated machines.",
          },
          {
            title: "Covering release",
            text: "We release each tested area for protection or cover placement only once every seam, repair and detail in it has passed.",
          },
        ],
      },
      {
        id: "testing",
        label: "Seam Testing",
        title: "Our Seam Testing",
        kind: "steps",
        steps: WELD_TESTS,
      },
      {
        id: "records",
        label: "Handover Dossier",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Material certificates and roll references for every roll installed",
          "Subgrade acceptance and covering-release records",
          "Panel, weld, welder and machine traceability",
          "Non-destructive and destructive seam-test results",
          "Repair log, leak-survey results where specified, and as-built panel layout",
        ],
      },
    ],
    why: "One team supplies the membrane, installs it with our own trained welding technicians and signs the QA/QC records. Geosynthetics Africa is an IAGI Installer Member.",
    applications: [
      "tailings-storage-facility-lining",
      "heap-leach-pad-lining",
      "reservoir-dam-lining",
      "landfill-ash-bund-lining",
    ],
  },
  "gcl-installation-contractor-africa": {
    title: "GCL Liner Installation & QA/QC Across Africa",
    summary:
      "We supply, deploy and cover Eurobent® geosynthetic clay liners for mining, landfill and water containment, controlling overlaps, hydration and cover placement to protect the bentonite barrier.",
    sections: [
      {
        id: "scope",
        label: "Scope",
        title: "What We Install",
        kind: "text",
        body: "We supply and install Eurobent® reinforced and HDPE-backed GCLs as stand-alone barriers or beneath HDPE in composite liners, working to the approved design and the manufacturer's installation guidance.",
        bullets: [
          "Composite liners beneath HDPE on TSFs, heap leach pads and landfill cells",
          "Landfill capping and closure",
          "Reservoirs, canals and secondary containment",
        ],
      },
      {
        id: "method",
        label: "Deployment",
        title: "How We Deploy GCL",
        kind: "steps",
        steps: [
          {
            title: "Subgrade preparation",
            text: "We remove rocks, debris and standing water, test compaction and deliver a smooth, firm surface. We never deploy GCL over mud.",
          },
          {
            title: "Controlled deployment",
            text: "We align rolls for consistent overlaps, sequence panels to minimise wrinkles and deploy only as much GCL as we can cover the same day.",
          },
          {
            title: "Overlaps and seaming",
            text: "We hold the minimum overlap on every edge, apply bentonite paste or powder in the overlap zone and seal joints against bentonite loss.",
          },
          {
            title: "Cover placement",
            text: "We place a minimum 300 mm cover layer with low-ground-pressure equipment and complete all repairs before cover goes down.",
          },
        ],
      },
      {
        id: "hydration",
        label: "Hydration Control",
        title: "How We Protect the Bentonite",
        kind: "list",
        items: [
          "We store rolls off the ground, covered and dry",
          "We monitor subgrade moisture for early hydration",
          "We stop deployment in rain and protect exposed panels",
          "We keep hydration logs for every deployed area",
        ],
      },
      {
        id: "records",
        label: "QA/QC Records",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Product certificates and roll references",
          "Subgrade acceptance and daily deployment records",
          "Overlap, detail and repair logs (patches with a minimum 300 mm overlap)",
          "Hydration and weather logs, cover releases and as-built layout",
        ],
      },
    ],
    why: "We treat GCL as an engineered barrier, not ordinary roll placement: overlaps, hydration and cover are controlled and recorded by our own crews.",
    applications: [
      "tailings-storage-facility-lining",
      "landfill-ash-bund-lining",
      "landfill-capping-closure",
      "reservoir-dam-lining",
    ],
  },
  "floating-cover-installation-africa": {
    title: "Floating Cover Fabrication & Installation Across Africa",
    summary:
      "We fabricate and install floating covers for evaporation control, odour management and water protection, with panels, floats, ballast, sumps and anchorage built for each reservoir.",
    sections: [
      {
        id: "functions",
        label: "Cover Functions",
        title: "What Our Covers Do",
        kind: "table",
        rows: [
          { label: "Evaporation control", value: "Cuts water loss from open reservoirs" },
          {
            label: "Water quality",
            value: "Blocks sunlight to stop algae and protects stored water",
          },
          {
            label: "Odour and gas",
            value: "Gas-tight covers that capture emissions where specified",
          },
          {
            label: "Potable storage",
            value: "Covers for drinking-water reservoirs with approved materials",
          },
        ],
      },
      {
        id: "fabrication",
        label: "Fabrication",
        title: "What We Fabricate",
        kind: "list",
        intro: "We shop-weld cover panels in our own facility before mobilisation:",
        items: [
          "Cover panels in rLLDPE, HDPE or the specified membrane, rolled and numbered to the as-built layout",
          "Ballast pockets and weighted troughs that guide rainwater to the sumps",
          "Flotation logs, sumps, hatches and inspection ports",
          "Pipe boots and penetration seals made to each pipe",
        ],
      },
      {
        id: "installation",
        label: "Installation",
        title: "How We Install",
        kind: "steps",
        steps: [
          {
            title: "Site survey",
            text: "We survey the reservoir geometry, operating levels, anchorage and access.",
          },
          { title: "Deployment", text: "We deploy panels to the layout and complete field welds." },
          {
            title: "Anchorage",
            text: "We install perimeter anchorage that holds the cover through the full water-level range.",
          },
          {
            title: "Rainwater system",
            text: "We install and commission the sumps and drainage pumps.",
          },
        ],
      },
      {
        id: "testing",
        label: "Seam Testing",
        title: "Our Seam Testing",
        kind: "steps",
        steps: WELD_TESTS,
      },
    ],
    why: "We fabricate the cover and install it, so the panels, floats, ballast and welds are designed, built and tested by one team.",
    applications: [
      "floating-covers-evaporation-control",
      "reservoir-dam-lining",
      "process-water-pollution-control-dam-lining",
      "wastewater-treatment-pond-lining",
    ],
  },
  "gabion-installation-contractor-africa": {
    title: "Gabion Basket & Mattress Installation Across Africa",
    summary:
      "We supply and install gabion baskets and Reno mattresses for retaining walls, channels and scour protection, including foundations, filter layers, rock fill and final geometry.",
    sections: [
      {
        id: "systems",
        label: "Systems",
        title: "What We Install",
        kind: "table",
        rows: [
          {
            label: "Welded mesh gabions",
            value:
              "50 × 50 mm square welded mesh, Class A galvanised or PVC-coated (SANS 675), made in our own facility",
          },
          { label: "Woven gabions", value: "80 × 100 mm double-twist mesh, Class A galvanised" },
          { label: "Reno mattresses", value: "Channel and scour lining, Class A galvanised" },
        ],
      },
      {
        id: "method",
        label: "Installation Sequence",
        title: "Our Installation Sequence",
        kind: "steps",
        steps: [
          {
            title: "Material check",
            text: "We check mesh, wire and unit sizes against the specification.",
          },
          {
            title: "Foundation",
            text: "We clear, level and compact the foundation and place the specified filter geotextile.",
          },
          {
            title: "Assembly and placement",
            text: "We assemble, lace, brace and align units to the approved arrangement.",
          },
          {
            title: "Rock fill",
            text: "We fill and pack rock in layers, keeping unit shape and face quality.",
          },
          {
            title: "Sign-off",
            text: "We close and lace lids and sign off dimensions and alignment.",
          },
        ],
      },
      {
        id: "records",
        label: "QA/QC Records",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Mesh, wire and coating certificates",
          "Foundation and filter acceptance",
          "Lacing, bracing and rock-fill inspections",
          "Completed geometry and alignment survey",
        ],
      },
    ],
    why: "We manufacture welded mesh gabions and install them, so the basket, filter and rock fill are delivered as one working structure.",
    applications: [
      "retaining-wall-systems",
      "coastal-protection",
      "slope-erosion-protection",
      "irrigation-canal-lining",
    ],
  },
  "geocell-installation-contractor-africa": {
    title: "Geocell Installation Across Africa",
    summary:
      "We supply and install HDPE and woven PP geocells for load support, slope protection and channel lining, controlling expansion, anchorage and infill on every panel.",
    sections: [
      {
        id: "uses",
        label: "Applications",
        title: "Where We Install Geocells",
        kind: "table",
        rows: [
          {
            label: "Load support",
            value: "Haul roads, access platforms and unpaved roads over soft ground",
          },
          {
            label: "Slope protection",
            value: "Vegetated or rock-filled cells on steep embankments",
          },
          { label: "Channels", value: "Concrete or rock-filled channel and spillway lining" },
          { label: "Retaining", value: "Gravity and reinforced geocell walls" },
        ],
      },
      {
        id: "products",
        label: "Cell Types",
        title: "Cells We Supply",
        kind: "table",
        rows: [
          {
            label: "HDPE geocell (GeoStrata™)",
            value: "Textured and perforated, 50 to 200 mm cell depth",
          },
          { label: "Woven PP geocell (PolyCell)", value: "75 to 150 mm cell depth" },
        ],
      },
      {
        id: "method",
        label: "Installation",
        title: "How We Install",
        kind: "steps",
        steps: [
          {
            title: "Foundation",
            text: "We prepare and accept the foundation and lay the separation or filter geotextile.",
          },
          {
            title: "Expansion",
            text: "We expand each panel to its full cell dimensions and connect adjacent panels.",
          },
          {
            title: "Anchorage",
            text: "We install the specified pins, tendons and edge details before infill.",
          },
          {
            title: "Infill",
            text: "We place and compact infill without distorting or damaging the cells.",
          },
        ],
      },
      {
        id: "records",
        label: "QA/QC Records",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Cell product and batch identification",
          "Foundation, expansion and connection inspections",
          "Anchorage, infill and compaction records",
          "Completed coverage and as-built details",
        ],
      },
    ],
    why: "We supply the cells and install them, with expansion, anchorage and infill controlled by our own crews.",
    applications: [
      "stabilisation-reinforcement",
      "slope-erosion-protection",
      "roads-railways",
      "irrigation-canal-lining",
    ],
  },
  "gccm-channel-lining-contractor-africa": {
    title: "GCCM Channel Lining Installation Across Africa",
    summary:
      "We supply and install TILTEX™ geosynthetic cementitious composite mats for channels, spillways and slopes, hydrating and curing them to the manufacturer's method.",
    sections: [
      {
        id: "uses",
        label: "Applications",
        title: "Where We Install GCCM",
        kind: "list",
        items: [
          "TSF emergency spillways and mine water diversion channels",
          "Stormwater drains, roadside ditches and culvert outlets",
          "Irrigation canals and reservoir spillways",
          "Bund lining and slope protection over geomembranes",
        ],
      },
      {
        id: "method",
        label: "Installation & Hydration",
        title: "How We Install",
        kind: "steps",
        steps: [
          {
            title: "Subgrade",
            text: "We audit compaction and grading, inspect every roll and check anchor trench layout.",
          },
          {
            title: "Deployment",
            text: "We deploy along the flow direction and verify overlaps and fastening spacing.",
          },
          {
            title: "Pre-hydration check",
            text: "We check joint integrity and anchor trench backfill, then release the area for hydration.",
          },
          {
            title: "Hydration and curing",
            text: "We apply the specified water volume, monitor curing and complete the final inspection.",
          },
        ],
      },
      {
        id: "records",
        label: "QA/QC Records",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Material grade and batch references",
          "Subgrade, overlap and fastening inspections",
          "Hydration volumes, curing times and weather records",
          "Repairs, as-built layout and service release",
        ],
      },
    ],
    why: "We supply TILTEX™ and install it ourselves, keeping hydration and curing under one team's control.",
    applications: [
      "irrigation-canal-lining",
      "slope-erosion-protection",
      "process-water-pollution-control-dam-lining",
    ],
  },
  "manufacturing-fabrication": {
    title: "Geosynthetics Manufacturing & Custom Fabrication",
    summary:
      "We manufacture and fabricate geosynthetic products in our own Johannesburg facility, from ISO 9001-mill roll goods, with factory QA/QC and test records on every article.",
    sections: [
      {
        id: "products",
        label: "Products We Make",
        title: "Products We Manufacture",
        kind: "manufactured-products",
        intro:
          "Every product below is made in our own facility. Open a product for its raw-material inputs, factory QA/QC and key specifications.",
      },
      {
        id: "inputs",
        label: "Raw Materials",
        title: "ISO-Quality Raw Materials",
        kind: "text",
        body: "We fabricate only from roll goods and wire made in ISO 9001-certified mills: the same globally recognised geomembranes, geotextiles and wire specified on major projects worldwide. Each grade is manufactured and tested to GRI, ASTM or EN ISO requirements, with ASQUAL-certified geotextile grades where the specification calls for them.",
        bullets: [
          "Geomembranes to GRI-GM13 (HDPE) and GRI-GM17 (LLDPE)",
          "Geotextiles tested to EN ISO and ASTM methods for tensile strength, puncture and opening size",
          "Gabion wire to SANS 675, Class A galvanised or PVC-coated",
          "A mill certificate for every roll and coil, held against its batch",
        ],
      },
      {
        id: "qaqc",
        label: "Factory QA/QC",
        title: "Our Factory QA/QC",
        kind: "manufacturing-process",
        intro: "Every article passes the same six controls before it leaves our facility:",
      },
      {
        id: "custom",
        label: "Custom Orders",
        title: "Made to Your Specification",
        kind: "text",
        body: "A non-standard size, heavier fabric, different seam or wire gauge is a production run on our own machines, typically days rather than the eight to twelve weeks an import takes. Send the duty, dimensions and drawings and we return a fabrication specification. Where a tender names filled mass without opening size or seam strength, we flag the gap and propose values.",
      },
    ],
    why: "We make it, we test it and we install it. When a seam is queried on site, the team that made it is the team that answers.",
    applications: [
      "sludge-dewatering",
      "coastal-protection",
      "sediment-control-silt-curtains-fences",
      "floating-covers-evaporation-control",
    ],
  },
  "sand-container-installation": {
    title: "Geosynthetic Sand Container Installation Across Africa",
    summary:
      "We manufacture FlowTex™ sand containers and place them for coastal revetments, groynes, scour aprons and riverbanks, with photographic sign-off on every course.",
    sections: [
      {
        id: "grades",
        label: "Container Grades",
        title: "Container Grades We Make",
        kind: "table",
        rows: [
          {
            label: "NW40 to NW70",
            value: "Nonwoven, 40 to 70 kg, hand-filled for rapid deployment",
          },
          {
            label: "NW70HD or W30",
            value: "70 to 400 kg, bank stabilisation and low-energy flows",
          },
          { label: "NW400", value: "400 kg, sheltered revetments and dune toe" },
          { label: "NW1350 or W45", value: "1,000 to 1,350 kg, revetments and groynes" },
          { label: "NW1800 or W60", value: "1,800 kg, exposed revetments and scour aprons" },
          { label: "NW4000 or W105", value: "4,000 kg, breakwater cores and high-energy armour" },
        ],
      },
      {
        id: "method",
        label: "Placement",
        title: "How We Place Them",
        kind: "steps",
        steps: [
          {
            title: "Base and underliner",
            text: "We excavate to a firm base and lay a shingle-lapped nonwoven underliner with 500 mm overlaps, or 1,000 mm on soft ground.",
          },
          {
            title: "Filling",
            text: "We fill containers to about 80% of capacity and double-seam every closure.",
          },
          {
            title: "Stretcher bond",
            text: "We place courses in stretcher bond, offset half a bag from the course below, compacting after every three containers.",
          },
          {
            title: "Course sign-off",
            text: "We check face alignment against setting-out pegs and photograph every course before placing the next.",
          },
        ],
      },
      {
        id: "records",
        label: "QA/QC Records",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Mill certificates and batch traceability for every container",
          "Seam strength results to EN ISO 10319",
          "Course-by-course photographic sign-off",
          "Final layout survey",
        ],
      },
    ],
    why: "We make the containers and place them, so fabric, seams and placement are controlled by one team, with filling from local sand and no rock haulage.",
    applications: ["coastal-protection", "slope-erosion-protection"],
  },
  "silt-curtain-deployment": {
    title: "Silt Curtain & Turbidity Barrier Deployment Across Africa",
    summary:
      "We fabricate GeoCurtain™ silt curtains and deploy, maintain and recover them for dredging, piling, port and river works, sized to the survey and tidal range.",
    sections: [
      {
        id: "classes",
        label: "Curtain Classes",
        title: "Curtain Classes We Make",
        kind: "table",
        rows: [
          {
            label: "Class 1",
            value: "Calm water: ponds, canals, marinas and sheltered work zones",
          },
          {
            label: "Class 2",
            value: "Mild current and wind: high-strength fabric and heavy-duty tension members",
          },
          {
            label: "Class 3",
            value: "Dredging and marine construction in moderate current, wind and wave",
          },
        ],
      },
      {
        id: "survey",
        label: "Site Survey",
        title: "What We Survey Before We Quote",
        kind: "list",
        items: [
          "Water depth along the full alignment, from a bathymetric survey",
          "Tidal range, so the skirt neither falls short nor grounds",
          "Current velocity and wind fetch, which set the class and anchor capacity",
          "Work-zone geometry and vessel access points",
        ],
      },
      {
        id: "deployment",
        label: "Deployment",
        title: "How We Deploy",
        kind: "steps",
        steps: [
          {
            title: "Anchors first",
            text: "We install anchors sized for current, depth, bed material and wind fetch.",
          },
          {
            title: "Float and connect",
            text: "We float the curtain into position, join it at the connectors and tension it with allowance for tide and wake.",
          },
          {
            title: "Maintain",
            text: "We inspect routinely, reposition around the works and repair fabric, ballast or anchoring in place.",
          },
          {
            title: "Recover",
            text: "We recover the curtain cleanly at completion, with inspection logs and photographs for your compliance file.",
          },
        ],
      },
    ],
    why: "Our own crew sizes, fabricates, deploys, maintains and recovers the curtain.",
    applications: [
      "sediment-control-silt-curtains-fences",
      "coastal-protection",
      "sludge-dewatering",
    ],
  },
  "concrete-lining-protection": {
    title: "Concrete Protection Liner & GCCM Installation Across Africa",
    summary:
      "We install GSE® Studliner® concrete protection liners and TILTEX™ GCCM linings, each with its own preparation, joining and inspection method.",
    sections: [
      {
        id: "systems",
        label: "Systems",
        title: "Two Systems, Two Duties",
        kind: "table",
        rows: [
          {
            label: "GSE® Studliner®",
            value:
              "Studded HDPE cast into concrete for permanent chemical and corrosion protection",
          },
          {
            label: "TILTEX™ GCCM",
            value: "Concrete-impregnated mats for channel lining and erosion control, no formwork",
          },
        ],
      },
      {
        id: "studliner",
        label: "Studliner Installation",
        title: "How We Install Studliner",
        kind: "steps",
        steps: [
          {
            title: "Prefabrication",
            text: "We prefabricate Studliner to size to reduce site cutting and welding.",
          },
          {
            title: "Placement",
            text: "We fix panels to the formwork and work with the concrete team through the pour.",
          },
          { title: "Welding", text: "We extrusion-weld joints, penetrations and terminations." },
          {
            title: "Testing",
            text: "We spark or vacuum test every seam and record it in the QA report.",
          },
        ],
      },
      {
        id: "gccm",
        label: "GCCM Installation",
        title: "How We Install GCCM",
        kind: "steps",
        steps: [
          { title: "Subgrade", text: "We trim and compact the subgrade and cut anchor trenches." },
          { title: "Deployment", text: "We deploy along the flow direction and fasten overlaps." },
          { title: "Hydration", text: "We hydrate and cure to the manufacturer's method." },
        ],
      },
    ],
    why: "We match the lining system to the duty and install both with our own crews and records.",
    applications: [
      "concrete-protection-lining",
      "wastewater-treatment-pond-lining",
      "irrigation-canal-lining",
      "slope-erosion-protection",
    ],
  },
  "bioengineering-revegetation": {
    title: "Erosion Blankets, Bioengineering & Revegetation Across Africa",
    summary:
      "We supply and install SoilLock™ jute, coir and straw and EnviroWool erosion blankets for mine rehabilitation, TSF walls, embankments and riverbanks.",
    sections: [
      {
        id: "blankets",
        label: "Blanket Selection",
        title: "Blankets We Supply",
        kind: "table",
        rows: [
          {
            label: "Jute SoilLock™ 292",
            value: "292 g/m² open weave, 10 × 10 mm aperture, 12 to 24 months",
          },
          {
            label: "Coir SoilLock™ 350 / 450",
            value: "Civil and mining grades for steep, high-runoff slopes and TSFs, 2 to 3 years",
          },
          { label: "Straw SoilLock™ 300", value: "Short-term cover on gentle slopes" },
          { label: "EnviroWool", value: "Wood-wool erosion blanket, 2.45 m × 51.4 m rolls" },
        ],
      },
      {
        id: "method",
        label: "Installation",
        title: "How We Install",
        kind: "steps",
        steps: [
          {
            title: "Surface preparation",
            text: "We trim the slope and place seed and topsoil to specification before the blanket goes down.",
          },
          { title: "Crest anchorage", text: "We cut and backfill crest anchor trenches." },
          {
            title: "Deployment",
            text: "We roll blankets down-slope in full soil contact, with shingle-lapped overlaps.",
          },
          {
            title: "Pinning",
            text: "We pin to the specified pattern so the blanket stays in contact through the rains.",
          },
        ],
      },
      {
        id: "records",
        label: "Handover",
        title: "What We Hand Over",
        kind: "list",
        items: [
          "Blanket type and batch references",
          "Surface preparation, seeding and anchorage inspections",
          "Coverage, overlap and repair records",
          "An inspection and maintenance plan for the establishment period",
        ],
      },
    ],
    why: "We supplied 210,000 m² of Jute SoilLock™ 292 to a single river-rehabilitation programme in Zimbabwe, and we install with our own crews.",
    applications: ["slope-erosion-protection", "coastal-protection", "roads-railways"],
  },
  "delivery-logistics-africa": {
    title: "Geosynthetics Delivery & Cross-Border Logistics Across Africa",
    summary:
      "We deliver geosynthetics to project sites across Africa by road, sea and air, with certificates of origin and customs documents prepared before the consignment leaves.",
    sections: [
      {
        id: "routes",
        label: "Routes",
        title: "How We Reach Your Site",
        kind: "table",
        rows: [
          {
            label: "Southern Africa",
            value: "Road dispatch into Zambia, Botswana, Namibia, Zimbabwe and Mozambique",
          },
          {
            label: "West Africa",
            value: "Sea freight via Tema or Abidjan with bonded inland transfer",
          },
          {
            label: "East & Central Africa",
            value:
              "Sea, inland container depot and road or rail corridors into Tanzania, Zambia and the DRC",
          },
        ],
      },
      {
        id: "documents",
        label: "Documentation",
        title: "Documents We Prepare",
        kind: "list",
        items: [
          "SADC and AfCFTA certificates of origin for qualifying consignments",
          "Commercial invoice, packing list and tariff classification",
          "Mill certificates and product datasheets",
          "French-language documents for West African destinations",
        ],
      },
      {
        id: "packing",
        label: "Packing & Loading",
        title: "How We Pack and Load",
        kind: "list",
        items: [
          "Container fill plans for 20 ft, 40 ft and high-cube loads",
          "Fabricated articles shipped flat and unfilled to save freight volume",
          "Rolls labelled and listed against the packing list",
          "Loads restrained and protected for long road legs",
        ],
      },
    ],
    why: "One contact from enquiry to delivery, with no broker chain between you and your material.",
    applications: [
      "tailings-storage-facility-lining",
      "reservoir-dam-lining",
      "roads-railways",
      "sludge-dewatering",
    ],
  },
};

export function serviceDeliveryFor(slug: string, label: string): ServiceDeliveryProfile {
  return (
    SERVICE_DELIVERY_PROFILES[slug] || {
      title: label,
      summary: `Geosynthetics Africa delivers ${label.toLowerCase()} for projects across Africa, with our own supply, crews and QA/QC records.`,
      sections: [
        {
          id: "scope",
          label: "Scope",
          title: "What We Deliver",
          kind: "text",
          body: "Send us your drawings, specification, quantities, destination and required date, and we will prepare a project-specific proposal.",
        },
      ],
      why: "We supply, fabricate where required, deliver and install, with one team accountable for the records.",
      applications: [],
    }
  );
}
