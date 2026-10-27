/**
 * Dedicated content for the Floating Covers & Evaporation Control application
 * page. Merged over the generic application template in application-directory.
 *
 * Material facts mirror the product family pages (family-systems.ts and the
 * CSPE template entry): FC45/FC60 rLLDPE, CSPE CS60/CS90 and rFPP, all
 * NSF/ANSI 61 certified. FC60 carries a 30-year warranty: 20 years full plus
 * 10 years pro-rata.
 */

const FC_PAGE = "/products/geomembrane-liners/floating-cover-geomembranes";
const CSPE_PAGE =
  "/products/geomembrane-liners/cspe-geomembranes-for-potable-water-floating-covers";
const RFPP_PAGE = "/products/geomembrane-liners/rfpp-geomembrane-liners";

export const FLOATING_COVERS_HERO =
  "/api/storage/media-center/Floating-Covers-South-Africa-Geosynthetics-Africa_5536bff0-c2ff-45e1-b671-e9a6bc317abd.webp";

export const FLOATING_COVERS_FAQS = [
  {
    question: "What does a floating cover do?",
    answer:
      "It sits on the water surface and rises and falls with the level. It cuts evaporation losses, keeps out sunlight so algae cannot grow, keeps out dust, birds and windblown debris, and on effluent ponds and digesters it contains odour and gas.",
  },
  {
    question: "Which cover material should I choose?",
    answer:
      "FC45 and FC60 scrim-reinforced LLDPE suit most process water, return water, effluent, farm and potable covers. CSPE (CS60 or CS90) is chosen where a water utility wants the longest exposed weathering record. rFPP suits exposed covers and liners that must hold their shape under wind uplift. We recommend the grade against your reservoir size, water quality, wind exposure and design life.",
  },
  {
    question: "Are your covers approved for drinking water?",
    answer:
      "Yes. FC45, FC60, CSPE and rFPP are all certified to NSF/ANSI 61 for drinking water system components. We supply the certificates with the roll and batch documents for every cover.",
  },
  {
    question: "What warranty comes with the cover?",
    answer:
      "FC60 carries a 30-year warranty: 20 years full plus 10 years pro-rata. FC45 has a 20-year outdoor service life, and CSPE carries a 30-year mill weathering warranty for approved applications. We confirm in writing before you order which warranty applies to your application.",
  },
  {
    question: "How is rainwater removed from the cover?",
    answer:
      "Float lines and ballast lines shape the cover into troughs that lead rainwater to sumps. The sumps are pumped off, so the water stays clean and the cover is not loaded by ponded rain. We size the sumps and pumps for the site rainfall.",
  },
  {
    question: "Can you cover an existing reservoir that is in service?",
    answer:
      "Often, yes. Because we fabricate the cover in large panels in our own facility, site work is mostly deployment, panel joins and the perimeter anchorage. We plan the water levels and sequence with your operations team so the reservoir stays in use for as long as possible.",
  },
];

export const FLOATING_COVERS_TEMPLATE = {
  title: "Floating Covers & Evaporation Control",
  description:
    "Floating covers for reservoirs, process ponds and effluent dams, fabricated in our own facility and installed by our own crews. FC45 and FC60 rLLDPE, CSPE and rFPP, all NSF/ANSI 61 certified for drinking water. Manufacturing, supply and QA/QC-controlled installation under one contract, across Africa.",
  heroImage: FLOATING_COVERS_HERO,
  heroHighlights: [
    { icon: "Factory", label: "Fabricated In-House" },
    { icon: "ShieldCheck", label: "NSF/ANSI 61 Materials" },
    { icon: "HardHat", label: "Our Own Crews" },
    { icon: "ClipboardCheck", label: "QA/QC Dossier" },
  ],
  overviewParagraphs: [
    "A floating cover sits on the stored water and rises and falls with it. It cuts evaporation losses from open reservoirs and ponds, blocks the sunlight that drives algae growth, keeps out dust, birds and windblown debris, and on effluent ponds and digesters it contains odour and gas. In hot, dry climates the water it saves is often the main reason the cover pays back.",
    "We manufacture, supply and install the complete cover under one contract. Our engineers lay out the cover from your reservoir geometry and operating levels, we fabricate it in large panels in our own facility, and our own crews deploy, join, anchor and test it on site. You deal with one team from the drawing to the signed handover dossier.",
    "We build covers in three material families: FC45 and FC60 scrim-reinforced LLDPE, CSPE in CS60 and CS90 grades, and rFPP. All are certified to NSF/ANSI 61 for drinking water. FC60 carries a 30-year warranty (20 years full plus 10 years pro-rata).",
    "Send the reservoir drawings or dimensions, the operating water levels, what is stored and the site location. We will come back with a cover layout, material recommendation and a single price for fabrication, supply, installation and QA/QC.",
  ],
  keyBenefits: [
    "Cuts evaporation losses from stored water",
    "Blocks sunlight, so algae cannot grow",
    "Keeps out dust, birds and debris",
    "Contains odour and gas on effluent ponds",
    "NSF/ANSI 61 materials for drinking water",
    "FC60: 30-year warranty (20 full + 10 pro-rata)",
  ],
  suitableFor: [
    { icon: "Droplets", label: "Potable water reservoirs" },
    { icon: "Pickaxe", label: "TSF return-water & process ponds" },
    { icon: "Factory", label: "Effluent dams & digesters" },
    { icon: "Sprout", label: "Irrigation & farm storage dams" },
    { icon: "Waves", label: "Raw-water & fire-water reservoirs" },
    { icon: "Wrench", label: "Cover repair & replacement" },
  ],
  materialOptions: {
    title: "Cover Materials We Fabricate",
    intro:
      "Every grade below is fabricated into covers in our own facility and installed by our own crews. We recommend the grade for your water, wind exposure and design life.",
    headers: ["", "FC45 rLLDPE", "FC60 rLLDPE", "CSPE CS60 / CS90", "rFPP"],
    rows: [
      ["Thickness", "1.14 mm", "1.52 mm", "1.52 mm / 2.28 mm", "0.91 mm / 1.14 mm"],
      [
        "Reinforcement",
        "Polyester scrim",
        "Polyester scrim",
        "Polyester scrim (CS90: two plies)",
        "9 × 9 1000D polyester scrim",
      ],
      [
        "Exposed life / warranty",
        "20-year outdoor service life",
        "30-year warranty (20 full + 10 pro-rata)",
        "30-year weathering warranty (approved applications)",
        "Confirmed per project",
      ],
      ["Drinking water", "NSF/ANSI 61", "NSF/ANSI 61", "NSF/ANSI 61", "NSF/ANSI 61"],
      ["Colours", "Black, tan", "Black, tan", "Black, tan, white", "Confirmed at quote"],
      [
        "Typical use",
        "Process, return-water, farm and effluent covers",
        "Long-life potable and process covers",
        "Municipal potable reservoirs, large covers",
        "Exposed covers and liners under wind uplift",
      ],
    ],
    links: [
      { label: "FC45 & FC60 specifications", href: FC_PAGE },
      { label: "CSPE CS60 & CS90 specifications", href: CSPE_PAGE },
      { label: "rFPP specifications", href: RFPP_PAGE },
    ],
  },
  componentsTitle: "Floating Cover System Components",
  componentsCallouts: [
    {
      number: "1",
      label: "Factory-fabricated cover membrane",
      description:
        "FC45, FC60, CSPE or rFPP panels welded into large sections in our facility, accordion-folded and rolled for transport, so field seams are limited to panel joins and details.",
    },
    {
      number: "2",
      label: "Float and ballast lines",
      description:
        "Float lines and ballast lines in welded sleeves shape the cover into troughs, keep it taut in wind and let it follow the water level.",
    },
    {
      number: "3",
      label: "Rainwater sumps and pumps",
      description:
        "The troughs lead rainwater to sumps that are pumped off, so rain does not pond on the cover or mix with the stored water.",
    },
    {
      number: "4",
      label: "Perimeter anchorage",
      description:
        "The cover is fixed to a concrete anchor beam or anchor trench with batten strips and sealed so it stays watertight and secure in wind.",
    },
    {
      number: "5",
      label: "Hatches, vents and penetrations",
      description:
        "Inspection hatches, vents, pipe boots and walkways fabricated into the cover for safe access and maintenance.",
    },
    {
      number: "6",
      label: "Gas collection (effluent and digesters)",
      description:
        "On anaerobic ponds and digesters the cover is sealed and fitted with gas vents or collection points to contain odour and capture gas.",
    },
  ],
  designTitle: "Designing Your Floating Cover",
  designParagraphs: [
    "We start from the reservoir geometry and the full range of operating water levels. The cover has to fit the reservoir when it is full and when it is drawn down, so we size the slack, the float and ballast pattern and the sump positions for both.",
    "Wind and rainfall set the float and ballast layout and the sump and pump capacity. We use the site's design wind and rainfall to keep the cover stable and to remove rain before it loads the membrane.",
    "The stored liquid sets the material. Drinking water needs NSF/ANSI 61 materials. Process water, effluent and gas-producing ponds need chemical resistance and a sealed perimeter. We recommend FC45, FC60, CSPE or rFPP against your water, exposure and design life, and state the warranty that applies in writing.",
    "Access is designed in from the start: inspection hatches, walkways, vents, inlet and outlet penetrations and any gas collection are fabricated into the panels rather than cut in on site.",
  ],
  installationTitle: "Fabrication & Installation",
  installationParagraphs: [
    "Fabrication: we weld the cover into large panels in our own facility to the approved layout, with float and ballast sleeves, sumps, hatches and penetrations built in. Factory seams are tested before the panels leave the facility, and every panel is labelled to the layout drawing.",
    "Site preparation: our crews survey the reservoir, prepare or build the perimeter anchor beam or trench, and set out deployment points before the panels arrive.",
    "Deployment: panels are pulled across the reservoir in the planned sequence, joined in the field, fitted with floats and ballast and anchored at the perimeter. Field seams are trial-welded at the start of every shift and tested along their full length.",
    "Commissioning: we check the cover's movement and drainage through the operating water-level range, commission the rainwater pumps, close out any repairs and hand over the operating and maintenance guide.",
  ],
  qaTitle: "Floating Cover QA/QC",
  qaItems: [
    {
      icon: "FileCheck",
      title: "Approved Layout & Inspection Plan",
      description:
        "We agree the cover layout, material submittals, acceptance criteria and hold points before fabrication starts.",
    },
    {
      icon: "Factory",
      title: "Factory Fabrication Records",
      description:
        "Roll and panel identity, NSF/ANSI 61 and mill certificates, and factory seam test results for every panel.",
    },
    {
      icon: "ClipboardCheck",
      title: "Field Seam Testing",
      description:
        "Trial welds every shift, non-destructive testing of every field seam along its full length, and destructive samples to the project CQA plan.",
    },
    {
      icon: "Anchor",
      title: "Anchorage, Floats & Sumps",
      description:
        "We inspect the perimeter anchorage, float and ballast lines, sumps and penetrations before the cover goes into service.",
    },
    {
      icon: "Waves",
      title: "Operational Acceptance",
      description:
        "Movement, drainage and pump checks through the operating water-level range, with repairs closed out.",
    },
    {
      icon: "FileText",
      title: "Handover Dossier",
      description:
        "As-built layout, certificates traceable to the supplied rolls, seam and repair logs, test results and a cover inspection and maintenance guide.",
    },
  ],
  deliveryProfile: {
    selection:
      "We lay out the cover from your reservoir geometry, operating levels, wind, rainfall and stored liquid, then recommend FC45, FC60, CSPE or rFPP and state the warranty that applies.",
    installation:
      "We fabricate the cover in our own facility, then our crews build the anchorage, deploy and join the panels, fit floats, ballast and sumps, and commission the cover.",
    quality:
      "Factory and field seam testing, certificates traceable to the supplied rolls, anchorage and drainage inspections, and operational checks through the full water-level range.",
    why: "Manufacturing, supply and QA/QC-controlled installation under one contract, with one team accountable from the factory to the signed handover.",
  },
  faqs: FLOATING_COVERS_FAQS,
  downloadsTitle: "Technical Resources & Product Documentation",
  downloads: [
    { label: "FC45 & FC60 floating cover geomembranes", url: FC_PAGE },
    { label: "CSPE CS60 & CS90 potable water geomembranes", url: CSPE_PAGE },
    { label: "Floating cover installation service", url: "/floating-cover-installation-africa" },
  ],
  seo: {
    title: "Floating Covers Africa | Reservoir & Evaporation Control Covers",
    description:
      "Floating covers fabricated in our own facility and installed by our own crews: FC45 & FC60 rLLDPE, CSPE and rFPP, NSF/ANSI 61 certified. Potable reservoirs, process ponds and effluent dams across Africa.",
    keywords:
      "floating cover, floating covers Africa, reservoir cover, evaporation control cover, potable water floating cover, rLLDPE floating cover, CSPE floating cover, NSF 61 floating cover, process pond cover, effluent pond cover",
  },
};
