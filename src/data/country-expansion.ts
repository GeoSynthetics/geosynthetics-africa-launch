import type { CountryTemplate } from "@/types/country-template";

/**
 * Country pages added for priority markets without a page in Site Builder.
 * Facts only: ports, freight corridors, main industries and customs blocs.
 * Local offices, crews and projects are not claimed; contact goes to the
 * Cape Town head office. Site Builder pages for the same country replace these.
 */
export const EXPANSION_COUNTRY_TEMPLATES: Record<string, CountryTemplate> = {
  "nigeria-geosynthetics-supplier-installer": {
    country: "Nigeria",
    slug: "nigeria-geosynthetics-supplier-installer",
    flag: "🇳🇬",
    code: "NGA",
    title: "Geosynthetics Supplier & Installer in Nigeria — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Nigeria, serving Lagos, Abuja, Port Harcourt, Kano and project sites nationwide.",
    badge: "West Africa · Nigeria",
    heroImage: "/images/geotextile-product-supply.webp",
    supplyTitle: "Delivery to Nigeria via Lagos",
    supplyDescription:
      "Materials are routed through Lagos (Apapa, Tin Can and Lekki Deep Sea Port) and Onne / Port Harcourt and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Lagos and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes: "Durban or overseas mill → Lagos / Onne by sea → road to site",
    customsInfo:
      "Nigeria is an ECOWAS member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Nigeria",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Nigeria.",
    installationHighlights: [
      {
        title: "Oil & Gas Secondary Containment",
        description:
          "HDPE liners and GCLs for tank farms, produced-water ponds and drilling-waste pits in the Niger Delta.",
      },
      {
        title: "Landfills & Waste Cells",
        description:
          "Composite lining and leachate drainage for engineered landfills serving Lagos, Abuja and other growing cities.",
      },
      {
        title: "Roads & Coastal Infrastructure",
        description:
          "Geotextiles and geogrids for soft-soil road bases, embankments and shoreline protection.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Which ports do you deliver to in Nigeria?",
        answer:
          "Shipments are routed to Lagos (Apapa, Tin Can or Lekki) or Onne / Port Harcourt, depending on the site location, then trucked to site.",
      },
      {
        question: "Do you install in Nigeria or only supply?",
        answer:
          "We supply and can mobilise installation and QA/QC crews for lining projects. Contact us with the project location and quantities for a mobilisation plan.",
      },
    ],
    seo: {
      title: "Geosynthetics Nigeria | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Nigeria. Delivery via Lagos to sites nationwide.",
      keywords:
        "Nigeria geomembrane, HDPE liner Nigeria, geotextile Lagos, geosynthetics Port Harcourt",
    },
  },
  "egypt-geosynthetics-supplier-installer": {
    country: "Egypt",
    slug: "egypt-geosynthetics-supplier-installer",
    flag: "🇪🇬",
    code: "EGY",
    title: "Geosynthetics Supplier & Installer in Egypt — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Egypt, serving Cairo, Alexandria, Port Said, Ain Sokhna and project sites nationwide.",
    badge: "North Africa · Egypt",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    supplyTitle: "Delivery to Egypt via Alexandria",
    supplyDescription:
      "Materials are routed through Alexandria, Port Said and Ain Sokhna and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Cairo and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 2–5 weeks by sea, plus clearance",
    logisticsRoutes:
      "Overseas mill or Durban → Alexandria / Port Said / Ain Sokhna by sea → road to site",
    customsInfo:
      "Egypt is a COMESA member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Egypt",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Egypt.",
    installationHighlights: [
      {
        title: "Canal & Irrigation Lining",
        description:
          "Geomembranes and GCCMs for canal lining and water-saving irrigation infrastructure.",
      },
      {
        title: "Desalination & Brine Ponds",
        description: "Chemical-resistant HDPE lining for brine evaporation and storage ponds.",
      },
      {
        title: "Landfills & Industrial Waste",
        description:
          "Composite liner systems and drainage geocomposites for sanitary and hazardous waste cells.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Can you supply geomembranes for canal lining in Egypt?",
        answer:
          "Yes. We supply HDPE, LLDPE and concrete canvas (GCCM) canal lining systems, with installation and QA/QC options.",
      },
      {
        question: "Which Egyptian ports do you ship to?",
        answer:
          "Alexandria, Port Said or Ain Sokhna, chosen by project location and vessel routing.",
      },
    ],
    seo: {
      title: "Geosynthetics Egypt | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Egypt. Delivery via Alexandria to sites nationwide.",
      keywords: "Egypt geomembrane, HDPE liner Egypt, canal lining Egypt, geosynthetics Cairo",
    },
  },
  "morocco-geosynthetics-supplier-installer": {
    country: "Morocco",
    slug: "morocco-geosynthetics-supplier-installer",
    flag: "🇲🇦",
    code: "MAR",
    title: "Geosynthetics Supplier & Installer in Morocco — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Morocco, serving Casablanca, Rabat, Tangier, Marrakech and project sites nationwide.",
    badge: "North Africa · Morocco",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    supplyTitle: "Delivery to Morocco via Tanger Med",
    supplyDescription:
      "Materials are routed through Tanger Med, Casablanca and Jorf Lasfar and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Casablanca and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 2–4 weeks by sea, plus clearance",
    logisticsRoutes: "Overseas mill → Tanger Med / Casablanca / Jorf Lasfar by sea → road to site",
    customsInfo:
      "Morocco is a AfCFTA state party. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Morocco",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Morocco.",
    installationHighlights: [
      {
        title: "Water Reservoirs & Agriculture",
        description:
          "HDPE-lined irrigation reservoirs and basins for water-stressed agricultural regions.",
      },
      {
        title: "Phosphate & Mining",
        description: "Lining and drainage systems for process water, tailings and stockpile areas.",
      },
      {
        title: "Desalination & Infrastructure",
        description: "Brine pond lining, geotextiles and geogrids for roads, rail and port works.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Do you supply irrigation reservoir liners in Morocco?",
        answer:
          "Yes. HDPE and LLDPE liners for agricultural basins, with welding and testing by our installation crews.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title: "Geosynthetics Morocco | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Morocco. Delivery via Tanger Med to sites nationwide.",
      keywords:
        "Morocco geomembrane, géomembrane Maroc, bassin irrigation Maroc, geosynthetics Casablanca",
    },
  },
  "ethiopia-geosynthetics-supplier-installer": {
    country: "Ethiopia",
    slug: "ethiopia-geosynthetics-supplier-installer",
    flag: "🇪🇹",
    code: "ETH",
    title: "Geosynthetics Supplier & Installer in Ethiopia — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Ethiopia, serving Addis Ababa, Dire Dawa, Hawassa, Bahir Dar and project sites nationwide.",
    badge: "East Africa · Ethiopia",
    heroImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    supplyTitle: "Delivery to Ethiopia via Port of Djibouti",
    supplyDescription:
      "Materials are routed through Port of Djibouti, then the Addis Ababa–Djibouti railway or road corridor and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Addis Ababa and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 4–6 weeks including the Djibouti corridor",
    logisticsRoutes:
      "Overseas mill or Durban → Djibouti by sea → rail / road to Addis Ababa and site",
    customsInfo:
      "Ethiopia is a COMESA member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Ethiopia",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Ethiopia.",
    installationHighlights: [
      {
        title: "Dams, Reservoirs & Irrigation",
        description:
          "Geomembranes and GCLs for water storage, irrigation schemes and canal lining.",
      },
      {
        title: "Roads & Industrial Parks",
        description:
          "Geotextiles and geogrids for road bases, embankments and industrial park platforms.",
      },
      {
        title: "Agriculture & Aquaculture",
        description:
          "Pond liners for aquaculture, floriculture water storage and agro-processing effluent.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How do materials reach Ethiopia?",
        answer:
          "Through the Port of Djibouti, then by rail or road to Addis Ababa and onward to site.",
      },
      {
        question: "Can you plan deliveries around the Djibouti corridor?",
        answer:
          "Yes. We schedule shipments, transit documents and clearance to suit the project programme.",
      },
    ],
    seo: {
      title: "Geosynthetics Ethiopia | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Ethiopia. Delivery via Port of Djibouti to sites nationwide.",
      keywords:
        "Ethiopia geomembrane, HDPE liner Ethiopia, geotextile Addis Ababa, geosynthetics Ethiopia",
    },
  },
  "angola-geosynthetics-supplier-installer": {
    country: "Angola",
    slug: "angola-geosynthetics-supplier-installer",
    flag: "🇦🇴",
    code: "AGO",
    title: "Geosynthetics Supplier & Installer in Angola — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Angola, serving Luanda, Lobito, Benguela, Lubango and project sites nationwide.",
    badge: "Southern Africa · Angola",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Delivery to Angola via Luanda and Lobito",
    supplyDescription:
      "Materials are routed through Luanda and Lobito (Lobito Corridor), or road via Namibia (Oshikango–Santa Clara) and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Luanda and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 1–3 weeks by sea or road, plus clearance",
    logisticsRoutes: "Durban / Walvis Bay → Luanda or Lobito by sea, or road via Namibia → site",
    customsInfo:
      "Angola is a SADC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Angola",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Angola.",
    installationHighlights: [
      {
        title: "Mining & Diamonds",
        description:
          "Tailings, process water and heap leach lining for diamond and mineral operations.",
      },
      {
        title: "Oil & Gas",
        description: "Secondary containment and produced-water pond lining for onshore facilities.",
      },
      {
        title: "Water Supply & Agriculture",
        description:
          "Reservoir liners and irrigation lining for water supply and farming projects.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Do you deliver to Angola by road or sea?",
        answer: "Both: by sea to Luanda or Lobito, or by road through Namibia for southern sites.",
      },
      {
        question: "Is documentation available in Portuguese?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in Portuguese.",
      },
    ],
    seo: {
      title: "Geosynthetics Angola | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Angola. Delivery via Luanda and Lobito to sites nationwide.",
      keywords: "Angola geomembrane, geomembrana Angola, HDPE liner Luanda, geosynthetics Angola",
    },
  },
  "senegal-geosynthetics-supplier-installer": {
    country: "Senegal",
    slug: "senegal-geosynthetics-supplier-installer",
    flag: "🇸🇳",
    code: "SEN",
    title: "Geosynthetics Supplier & Installer in Senegal — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Senegal, serving Dakar, Thiès, Saint-Louis, Kédougou and project sites nationwide.",
    badge: "West Africa · Senegal",
    heroImage: "/images/geotextile-product-supply.webp",
    supplyTitle: "Delivery to Senegal via Port of Dakar",
    supplyDescription:
      "Materials are routed through Port of Dakar and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Dakar and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes:
      "Overseas mill → Dakar by sea → road to site (including the gold belt around Kédougou)",
    customsInfo:
      "Senegal is an ECOWAS member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Senegal",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Senegal.",
    installationHighlights: [
      {
        title: "Gold Mining",
        description: "Heap leach, tailings and process pond lining in the Kédougou gold belt.",
      },
      {
        title: "Phosphates & Mineral Sands",
        description: "Lining and drainage for process water and tailings.",
      },
      {
        title: "Coastal & Water Infrastructure",
        description: "Geotextile sand containers, geotubes and reservoir lining.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Do you supply heap leach liners in Senegal?",
        answer: "Yes. HDPE and LLDPE liners with GCL options, plus installation and QA/QC crews.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title: "Geosynthetics Senegal | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Senegal. Delivery via Port of Dakar to sites nationwide.",
      keywords: "Senegal geomembrane, géomembrane Sénégal, heap leach Senegal, geosynthetics Dakar",
    },
  },
  "cameroon-geosynthetics-supplier-installer": {
    country: "Cameroon",
    slug: "cameroon-geosynthetics-supplier-installer",
    flag: "🇨🇲",
    code: "CMR",
    title: "Geosynthetics Supplier & Installer in Cameroon — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Cameroon, serving Douala, Yaoundé, Kribi, Garoua and project sites nationwide.",
    badge: "Central Africa · Cameroon",
    heroImage: "/images/geotextile-product-supply.webp",
    supplyTitle: "Delivery to Cameroon via Douala and Kribi deep-sea port",
    supplyDescription:
      "Materials are routed through Douala and Kribi deep-sea port and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Douala and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes: "Overseas mill → Douala / Kribi by sea → road to site",
    customsInfo:
      "Cameroon is a CEMAC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Cameroon",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Cameroon.",
    installationHighlights: [
      {
        title: "Roads & Ports",
        description:
          "Geotextiles and geogrids for road bases on soft and lateritic soils, and port platforms.",
      },
      {
        title: "Water & Waste",
        description: "Reservoir lining, landfill cells and effluent ponds.",
      },
      {
        title: "Mining & Industry",
        description: "Containment lining for mining and agro-industrial process water.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Which ports serve Cameroon deliveries?",
        answer: "Douala for most sites, or Kribi deep-sea port where it shortens the route.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title: "Geosynthetics Cameroon | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Cameroon. Delivery via Douala and Kribi deep-sea port to sites nationwide.",
      keywords:
        "Cameroon geomembrane, géomembrane Cameroun, géotextile Douala, geosynthetics Cameroon",
    },
  },
  "uganda-geosynthetics-supplier-installer": {
    country: "Uganda",
    slug: "uganda-geosynthetics-supplier-installer",
    flag: "🇺🇬",
    code: "UGA",
    title: "Geosynthetics Supplier & Installer in Uganda — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Uganda, serving Kampala, Entebbe, Jinja, Hoima and project sites nationwide.",
    badge: "East Africa · Uganda",
    heroImage: "https://images.unsplash.com/photo-1503694978374-8a2fa68f5981?w=1920&q=80",
    supplyTitle: "Delivery to Uganda via Mombasa",
    supplyDescription:
      "Materials are routed through Mombasa (Northern Corridor via Malaba / Busia) or Dar es Salaam (Central Corridor) and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Kampala and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 4–6 weeks including inland transit",
    logisticsRoutes:
      "Overseas mill or Durban → Mombasa or Dar es Salaam → road / rail to Kampala and site",
    customsInfo:
      "Uganda is a EAC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Uganda",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Uganda.",
    installationHighlights: [
      {
        title: "Oil & Gas (Albertine Region)",
        description: "Secondary containment, drilling-waste and produced-water lining.",
      },
      {
        title: "Roads & Infrastructure",
        description: "Geotextiles and geogrids for roads, embankments and slope stabilisation.",
      },
      {
        title: "Water & Agriculture",
        description: "Reservoir and aquaculture pond liners, valley tanks and irrigation lining.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How do you ship to Uganda?",
        answer:
          "Through Mombasa or Dar es Salaam, then inland by road or rail, under EAC transit procedures.",
      },
      {
        question: "Can you support oil and gas containment projects?",
        answer:
          "Yes. We supply HDPE liners and GCLs and provide welding and QA/QC documentation for operator requirements.",
      },
    ],
    seo: {
      title: "Geosynthetics Uganda | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Uganda. Delivery via Mombasa to sites nationwide.",
      keywords: "Uganda geomembrane, HDPE liner Uganda, geotextile Kampala, geosynthetics Uganda",
    },
  },
  "rwanda-geosynthetics-supplier-installer": {
    country: "Rwanda",
    slug: "rwanda-geosynthetics-supplier-installer",
    flag: "🇷🇼",
    code: "RWA",
    title: "Geosynthetics Supplier & Installer in Rwanda — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Rwanda, serving Kigali, Musanze, Huye, Rubavu and project sites nationwide.",
    badge: "East Africa · Rwanda",
    heroImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80",
    supplyTitle: "Delivery to Rwanda via Dar es Salaam",
    supplyDescription:
      "Materials are routed through Dar es Salaam (Central Corridor) or Mombasa (Northern Corridor) and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Kigali and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 4–6 weeks including inland transit",
    logisticsRoutes: "Overseas mill or Durban → Dar es Salaam / Mombasa → road to Kigali and site",
    customsInfo:
      "Rwanda is a EAC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Rwanda",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Rwanda.",
    installationHighlights: [
      {
        title: "Slope & Erosion Control",
        description:
          "Erosion control blankets, geocells and gabions for steep terrain and road cuttings.",
      },
      {
        title: "Roads & Urban Infrastructure",
        description: "Geotextiles, geogrids and drainage for roads and urban development.",
      },
      {
        title: "Water & Agriculture",
        description: "Reservoir liners and irrigation lining for hillside farming schemes.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Which route is used for Rwanda?",
        answer:
          "Usually Dar es Salaam via the Central Corridor, or Mombasa via the Northern Corridor, depending on schedule and cost.",
      },
      {
        question: "Do you supply erosion control for steep slopes?",
        answer: "Yes: erosion control blankets, geocells and gabions, with installation guidance.",
      },
    ],
    seo: {
      title: "Geosynthetics Rwanda | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Rwanda. Delivery via Dar es Salaam to sites nationwide.",
      keywords:
        "Rwanda geosynthetics, erosion control Rwanda, geotextile Kigali, geomembrane Rwanda",
    },
  },
  "malawi-geosynthetics-supplier-installer": {
    country: "Malawi",
    slug: "malawi-geosynthetics-supplier-installer",
    flag: "🇲🇼",
    code: "MWI",
    title: "Geosynthetics Supplier & Installer in Malawi — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Malawi, serving Lilongwe, Blantyre, Mzuzu, Zomba and project sites nationwide.",
    badge: "Southern Africa · Malawi",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    supplyTitle: "Delivery to Malawi by Road from South Africa",
    supplyDescription:
      "Materials are routed through Road from South Africa via Mozambique (Tete) or Zambia, or the ports of Beira / Nacala and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Lilongwe and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 5–8 days by road, plus clearance",
    logisticsRoutes: "Johannesburg → Beitbridge / Tete or Chirundu / Lusaka → Blantyre / Lilongwe",
    customsInfo:
      "Malawi is a SADC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Malawi",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Malawi.",
    installationHighlights: [
      {
        title: "Irrigation & Water Supply",
        description: "Reservoir and canal lining for irrigation schemes and water boards.",
      },
      {
        title: "Roads & Infrastructure",
        description: "Geotextiles, geogrids and gabions for roads, bridges and river protection.",
      },
      {
        title: "Agriculture & Aquaculture",
        description: "Pond liners for fish farming and agro-processing water.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How long does road freight from Johannesburg to Malawi take?",
        answer:
          "Typically 5–8 days including border clearance, depending on the route and destination.",
      },
      {
        question: "Do you supply gabions for river protection in Malawi?",
        answer: "Yes: woven and welded mesh gabions and reno mattresses, with geotextile filters.",
      },
    ],
    seo: {
      title: "Geosynthetics Malawi | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Malawi. Delivered by road from South Africa.",
      keywords: "Malawi geomembrane, HDPE liner Malawi, gabions Malawi, geosynthetics Lilongwe",
    },
  },
  "madagascar-geosynthetics-supplier-installer": {
    country: "Madagascar",
    slug: "madagascar-geosynthetics-supplier-installer",
    flag: "🇲🇬",
    code: "MDG",
    title: "Geosynthetics Supplier & Installer in Madagascar — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Madagascar, serving Antananarivo, Toamasina, Tôlanaro, Mahajanga and project sites nationwide.",
    badge: "Indian Ocean · Madagascar",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Delivery to Madagascar via Toamasina",
    supplyDescription:
      "Materials are routed through Toamasina (main port), Tôlanaro (Ehoala) and Mahajanga and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Antananarivo and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 2–4 weeks by sea, plus clearance",
    logisticsRoutes: "Durban or overseas mill → Toamasina / Ehoala by sea → road to site",
    customsInfo:
      "Madagascar is a SADC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Madagascar",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Madagascar.",
    installationHighlights: [
      {
        title: "Mining (Nickel, Ilmenite, Graphite)",
        description: "Tailings, process water and stockpile lining.",
      },
      {
        title: "Water & Agriculture",
        description: "Reservoir and irrigation lining, aquaculture ponds.",
      },
      {
        title: "Coastal & Infrastructure",
        description: "Geotextiles, sand containers and erosion control for coastal and road works.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Which ports do you use for Madagascar?",
        answer: "Toamasina for most sites, or Ehoala (Tôlanaro) and Mahajanga where closer.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title:
        "Geosynthetics Madagascar | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Madagascar. Delivery via Toamasina to sites nationwide.",
      keywords: "Madagascar geomembrane, géomembrane Madagascar, geosynthetics Toamasina",
    },
  },
  "guinea-geosynthetics-supplier-installer": {
    country: "Guinea",
    slug: "guinea-geosynthetics-supplier-installer",
    flag: "🇬🇳",
    code: "GIN",
    title: "Geosynthetics Supplier & Installer in Guinea — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Guinea, serving Conakry, Kamsar, Boké, Kankan and project sites nationwide.",
    badge: "West Africa · Guinea",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Delivery to Guinea via Conakry and Kamsar",
    supplyDescription:
      "Materials are routed through Conakry and Kamsar and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Conakry and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes: "Overseas mill → Conakry / Kamsar by sea → road to site",
    customsInfo:
      "Guinea is an ECOWAS member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Guinea",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Guinea.",
    installationHighlights: [
      {
        title: "Bauxite & Iron Ore Mining",
        description:
          "Water management, tailings and process pond lining in the Boké region and beyond.",
      },
      {
        title: "Haul Roads & Platforms",
        description:
          "Geotextiles and geogrids for haul roads, rail embankments and port platforms.",
      },
      {
        title: "Gold Mining",
        description: "Heap leach and tailings lining in the Siguiri region.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Do you supply mining containment in Guinea?",
        answer:
          "Yes. HDPE liners, GCLs and drainage geocomposites, with installation and QA/QC options.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title: "Geosynthetics Guinea | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Guinea. Delivery via Conakry and Kamsar to sites nationwide.",
      keywords:
        "Guinea geomembrane, géomembrane Guinée, bauxite mining Guinea, geosynthetics Conakry",
    },
  },
  "burkina-faso-geosynthetics-supplier-installer": {
    country: "Burkina Faso",
    slug: "burkina-faso-geosynthetics-supplier-installer",
    flag: "🇧🇫",
    code: "BFA",
    title: "Geosynthetics Supplier & Installer in Burkina Faso — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Burkina Faso, serving Ouagadougou, Bobo-Dioulasso, Koudougou and project sites nationwide.",
    badge: "West Africa · Burkina Faso",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Delivery to Burkina Faso via Abidjan",
    supplyDescription:
      "Materials are cleared at the Port of Abidjan, then trucked inland on the Abidjan–Ouagadougou corridor and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Ouagadougou and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Cleared at Abidjan, then by road · lead time confirmed at quote",
    logisticsRoutes: "Port of Abidjan → Ferkessédougou → Bobo-Dioulasso → Ouagadougou and site",
    customsInfo:
      "Burkina Faso left ECOWAS on 29 January 2025 and is a member of the Alliance of Sahel States (AES) and UEMOA. Imports move under transit documents through Côte d'Ivoire, and we prepare the commercial invoice, packing list, certificate of origin and mill certificates each border needs.",
    installationTitle: "Lining Installation & Field Services in Burkina Faso",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Burkina Faso.",
    installationHighlights: [
      {
        title: "Gold Mining",
        description: "Heap leach pads, CIL tailings and process pond lining.",
      },
      {
        title: "Water Reservoirs",
        description: "Reservoir and irrigation basin lining in a water-scarce climate.",
      },
      {
        title: "Roads & Infrastructure",
        description: "Geotextiles and geogrids for roads and platforms.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Cleared through the Port of Abidjan",
    hubName: "West Africa Projects",
    address: "Clearing: Port of Abidjan, Côte d'Ivoire",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How are materials delivered to Burkina Faso?",
        answer: "Cleared at the Port of Abidjan, then by road under transit documents to site.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title:
        "Geosynthetics Burkina Faso | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Burkina Faso. Delivery via Abidjan to sites nationwide.",
      keywords:
        "Burkina Faso geomembrane, géomembrane Burkina, heap leach Burkina, geosynthetics Ouagadougou",
    },
  },
  "eswatini-geosynthetics-supplier-installer": {
    country: "Eswatini",
    slug: "eswatini-geosynthetics-supplier-installer",
    flag: "🇸🇿",
    code: "SWZ",
    title: "Geosynthetics Supplier & Installer in Eswatini — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Eswatini, serving Mbabane, Manzini, Matsapha, Big Bend and project sites nationwide.",
    badge: "Southern Africa · Eswatini",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    supplyTitle: "Delivery to Eswatini by Road from South Africa",
    supplyDescription:
      "Materials are routed through Road from South Africa (Oshoek / Ngwenya, Mahamba, Lavumisa) and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Mbabane and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 1–2 days by road",
    logisticsRoutes: "Johannesburg / Durban → Oshoek or Lavumisa → site",
    customsInfo:
      "Eswatini is a SACU member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Eswatini",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Eswatini.",
    installationHighlights: [
      {
        title: "Sugar & Agriculture",
        description: "Irrigation dams, canals and effluent ponds for sugar estates.",
      },
      {
        title: "Water Supply",
        description: "Reservoir and dam lining.",
      },
      {
        title: "Roads & Infrastructure",
        description: "Geotextiles, geogrids and gabions.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How quickly can you deliver to Eswatini?",
        answer: "Usually within 1–2 days by road from Johannesburg or Durban.",
      },
      {
        question: "Are there import duties within SACU?",
        answer:
          "Goods moving between SACU members normally carry no customs duty; VAT and documentation still apply.",
      },
    ],
    seo: {
      title: "Geosynthetics Eswatini | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Eswatini. Delivered by road from South Africa.",
      keywords:
        "Eswatini geomembrane, HDPE liner Eswatini, dam lining Swaziland, geosynthetics Manzini",
    },
  },
  "lesotho-geosynthetics-supplier-installer": {
    country: "Lesotho",
    slug: "lesotho-geosynthetics-supplier-installer",
    flag: "🇱🇸",
    code: "LSO",
    title: "Geosynthetics Supplier & Installer in Lesotho — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Lesotho, serving Maseru, Mohale's Hoek, Leribe, Mokhotlong and project sites nationwide.",
    badge: "Southern Africa · Lesotho",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80",
    supplyTitle: "Delivery to Lesotho by Road from South Africa",
    supplyDescription:
      "Materials are routed through Road from South Africa (Maseru Bridge, Ficksburg, Caledonspoort) and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Maseru and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 1–2 days by road",
    logisticsRoutes: "Johannesburg → Maseru Bridge or Ficksburg → site",
    customsInfo:
      "Lesotho is a SACU member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Lesotho",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Lesotho.",
    installationHighlights: [
      {
        title: "Dams & Water Transfer",
        description:
          "Geosynthetics for dams, tunnels, access roads and erosion control in highland water projects.",
      },
      {
        title: "Roads & Slopes",
        description: "Geotextiles, geogrids, gabions and erosion control for mountain roads.",
      },
      {
        title: "Mining",
        description: "Lining and drainage for diamond mine tailings and process water.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How quickly can you deliver to Lesotho?",
        answer: "Usually within 1–2 days by road from Johannesburg.",
      },
      {
        question: "Do you supply erosion control for mountain roads?",
        answer: "Yes: erosion control blankets, gabions and geocells, with installation guidance.",
      },
    ],
    seo: {
      title: "Geosynthetics Lesotho | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Lesotho. Delivered by road from South Africa.",
      keywords: "Lesotho geosynthetics, gabions Lesotho, geotextile Maseru, geomembrane Lesotho",
    },
  },
  "sierra-leone-geosynthetics-supplier-installer": {
    country: "Sierra Leone",
    slug: "sierra-leone-geosynthetics-supplier-installer",
    flag: "🇸🇱",
    code: "SLE",
    title: "Geosynthetics Supplier & Installer in Sierra Leone — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Sierra Leone, serving Freetown, Bo, Kenema, Makeni and project sites nationwide.",
    badge: "West Africa · Sierra Leone",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Delivery to Sierra Leone via Port of Freetown",
    supplyDescription:
      "Materials are routed through Port of Freetown (Queen Elizabeth II Quay) and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Freetown and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes: "Overseas mill → Freetown by sea → road to site",
    customsInfo:
      "Sierra Leone is an ECOWAS member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Sierra Leone",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Sierra Leone.",
    installationHighlights: [
      {
        title: "Mining (Iron Ore, Rutile, Diamonds)",
        description: "Tailings, water management and process pond lining.",
      },
      {
        title: "Roads & Infrastructure",
        description: "Geotextiles and geogrids for roads on soft and lateritic soils.",
      },
      {
        title: "Water & Sanitation",
        description: "Reservoir and landfill lining.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Do you supply mining containment in Sierra Leone?",
        answer: "Yes. HDPE liners, GCLs and drainage, with installation and QA/QC options.",
      },
      {
        question: "Which port is used?",
        answer: "The Port of Freetown, then road to site.",
      },
    ],
    seo: {
      title:
        "Geosynthetics Sierra Leone | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Sierra Leone. Delivery via Port of Freetown to sites nationwide.",
      keywords: "Sierra Leone geomembrane, HDPE liner Sierra Leone, geosynthetics Freetown",
    },
  },
  "mauritania-geosynthetics-supplier-installer": {
    country: "Mauritania",
    slug: "mauritania-geosynthetics-supplier-installer",
    flag: "🇲🇷",
    code: "MRT",
    title: "Geosynthetics Supplier & Installer in Mauritania — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Mauritania, serving Nouakchott, Nouadhibou, Zouérat and project sites nationwide.",
    badge: "North Africa · Mauritania",
    heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    supplyTitle: "Delivery to Mauritania via Nouakchott and Nouadhibou",
    supplyDescription:
      "Materials are routed through Nouakchott and Nouadhibou and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Nouakchott and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes: "Overseas mill → Nouakchott / Nouadhibou by sea → road to site",
    customsInfo:
      "Mauritania is a AfCFTA state party. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Mauritania",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Mauritania.",
    installationHighlights: [
      {
        title: "Gold & Iron Ore Mining",
        description: "Heap leach, tailings and process water lining in desert conditions.",
      },
      {
        title: "Water Storage",
        description: "Lined reservoirs and evaporation ponds.",
      },
      {
        title: "Desert Roads & Sand Control",
        description: "Geotextiles, geocells and geogrids for roads on sand.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "Do your liners suit desert conditions?",
        answer:
          "HDPE and LLDPE geomembranes are specified with UV and heat resistance; we advise on thickness, texture and cover for desert sites.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title:
        "Geosynthetics Mauritania | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Mauritania. Delivery via Nouakchott and Nouadhibou to sites nationwide.",
      keywords: "Mauritania geomembrane, géomembrane Mauritanie, geosynthetics Nouakchott",
    },
  },
  "gabon-geosynthetics-supplier-installer": {
    country: "Gabon",
    slug: "gabon-geosynthetics-supplier-installer",
    flag: "🇬🇦",
    code: "GAB",
    title: "Geosynthetics Supplier & Installer in Gabon — Liners, Geotextiles & Geogrids",
    description:
      "HDPE geomembranes, GCLs, geotextiles, geogrids and erosion control supplied, installed and tested in Gabon, serving Libreville, Port-Gentil, Franceville, Moanda and project sites nationwide.",
    badge: "Central Africa · Gabon",
    heroImage: "/images/geotextile-product-supply.webp",
    supplyTitle: "Delivery to Gabon via Owendo",
    supplyDescription:
      "Materials are routed through Owendo (Libreville) and Port-Gentil and delivered to site with full shipping and clearance documentation.",
    supplyHighlights: [
      {
        title: "Door-to-site logistics",
        description:
          "Consolidated shipping, clearance and inland delivery to Libreville and project sites.",
      },
      {
        title: "Documentation",
        description:
          "Mill certificates, packing lists and certificates of origin supplied with every shipment.",
      },
    ],
    transitTime: "Typically 3–5 weeks by sea, plus clearance",
    logisticsRoutes:
      "Overseas mill → Owendo / Port-Gentil by sea → road / Trans-Gabon railway to site",
    customsInfo:
      "Gabon is a CEMAC member. Customs documentation, certificates of origin and duty treatment are prepared for each shipment.",
    installationTitle: "Lining Installation & Field Services in Gabon",
    installationDescription:
      "Mobile installation crews for geomembrane welding, GCL placement and geosynthetic installation, mobilised to sites across Gabon.",
    installationHighlights: [
      {
        title: "Manganese Mining",
        description: "Tailings and process water lining around Moanda.",
      },
      {
        title: "Oil & Gas",
        description: "Secondary containment and produced-water lining.",
      },
      {
        title: "Roads & Forestry Infrastructure",
        description: "Geotextiles and geogrids for roads on soft soils.",
      },
    ],
    masterSeamersCount: "Mobile installation crews",
    equipmentMobilization: "Planned per project",
    qaqcTitle: "QA/QC Testing & Handover Documentation",
    qaqcDescription:
      "Trial welds, 100% non-destructive seam testing, destructive seam testing and panel records to the project CQA plan.",
    qaqcHighlights: [
      {
        title: "Seam testing to ASTM D6392",
        description: "Shear and peel testing of seams, with results logged per panel.",
      },
      {
        title: "Handover QA/QC package",
        description:
          "As-built drawings, seam and repair logs and test records handed over at completion.",
      },
    ],
    complianceStandards: ["GRI-GM13", "ASTM D6392", "ASTM D5820", "ASTM D5641"],
    featuredProductIds: [
      "hdpe-smooth-geomembrane-liner-gri-gm13-1-5mm-gse-hd",
      "mirafi-s51-virgin-pp-nonwoven-geotextile-200gsm-3m-x-180m-roll",
      "eb4000-bentonite-geosynthetic-clay-liner-gcl-5-10m-x-40m",
    ],
    featuredProjectSlugs: [],
    officeTitle: "Served from our Cape Town Head Office",
    hubName: "Geosynthetics Africa Head Office",
    address:
      "11 Arum Lily Street, Fisantekraal Industrial, Durbanville, Cape Town, 7550, South Africa",
    phone: "+27 72 343 0868",
    email: "sales@geosyntheticsafrica.com",
    faqs: [
      {
        question: "How are materials delivered inland in Gabon?",
        answer: "By sea to Owendo or Port-Gentil, then by road or the Trans-Gabon railway.",
      },
      {
        question: "Is documentation available in French?",
        answer: "Yes. Quotations, datasheets and QA/QC reports can be provided in French.",
      },
    ],
    seo: {
      title: "Geosynthetics Gabon | HDPE Liners, Geotextiles & Geogrids — Geosynthetics Africa",
      description:
        "Supply, installation and QA/QC of HDPE liners, GCLs, geotextiles and geogrids in Gabon. Delivery via Owendo to sites nationwide.",
      keywords: "Gabon geomembrane, géomembrane Gabon, geosynthetics Libreville",
    },
  },
};

/** Region of each country, for grouping country pages. */
export const COUNTRY_REGIONS: Record<string, string> = {
  "South Africa": "Southern Africa",
  Botswana: "Southern Africa",
  Namibia: "Southern Africa",
  Zimbabwe: "Southern Africa",
  Zambia: "Southern Africa",
  Mozambique: "Southern Africa",
  Malawi: "Southern Africa",
  Angola: "Southern Africa",
  Eswatini: "Southern Africa",
  Lesotho: "Southern Africa",
  Kenya: "East Africa",
  Tanzania: "East Africa",
  Uganda: "East Africa",
  Rwanda: "East Africa",
  Ethiopia: "East Africa",
  Nigeria: "West Africa",
  Ghana: "West Africa",
  "Côte d'Ivoire": "West Africa",
  Senegal: "West Africa",
  Guinea: "West Africa",
  "Burkina Faso": "West Africa",
  Mali: "West Africa",
  "Sierra Leone": "West Africa",
  DRC: "Central Africa",
  "Democratic Republic of Congo": "Central Africa",
  Cameroon: "Central Africa",
  Gabon: "Central Africa",
  Egypt: "North Africa",
  Morocco: "North Africa",
  Mauritania: "North Africa",
  Madagascar: "Indian Ocean",
};

export const REGION_ORDER = [
  "Southern Africa",
  "East Africa",
  "West Africa",
  "Central Africa",
  "North Africa",
  "Indian Ocean",
];

export function regionForCountry(country: string): string {
  return COUNTRY_REGIONS[country] || COUNTRY_REGIONS[country.replace(/\s*\(.*\)$/, "")] || "Other";
}
