export interface RegionItem {
  country: string;
  flag: string;
  code: string;
  hub: string;
  coords: [number, number];
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  services: string;
  transit: string;
  routes: string;
  description: string;
  capabilities: string[];
  contactPerson?: string;
  isWestAfrica?: boolean;
}

export const MAMADOU_COULIBALY_CONTACT = {
  name: "Mamadou Coulibaly",
  title: "Regional Director — West Africa",
  country: "Côte d'Ivoire",
  hub: "West Africa Hub (Abidjan)",
  email: "civ@geosynthetics.co.za",
  fallbackEmail: "mamadou.coulibaly@geosynthetics.co.za",
  phone: "+27 78 1355 926",
  address: "Zone 4C, Rue des Carrossiers, Abidjan, Côte d'Ivoire",
};

export const SOUTH_AFRICA_CONTACT = {
  name: "Sales Desk & Technical Operations",
  country: "South Africa",
  hub: "Johannesburg HQ",
  email: "sales@geosynthetics.co.za",
  generalMailbox: "info@geosynthetics.co.za",
  phone: "+27 78 1355 926",
  address: "7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, 2191",
};

export const DEFAULT_REGIONAL_COVERAGE: RegionItem[] = [
  {
    country: "South Africa",
    flag: "🇿🇦",
    code: "RSA",
    hub: "Johannesburg (HQ)",
    coords: [-26.2041, 28.0473],
    title: "Johannesburg Head Office",
    subtitle: "Southern Africa Regional Hub",
    address: "7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, 2191",
    phone: "+27 78 1355 926",
    email: "sales@geosynthetics.co.za",
    services: "Full Supply, Installation & QA/QC Hub",
    transit: "Same day / Next day dispatch",
    routes: "Direct distribution across all 9 provinces.",
    description:
      "Our primary manufacturing, warehousing, and QA/QC hub. We manage large-scale manufacturing, custom lining fabrication, and coordinate all cross-border engineering teams.",
    capabilities: [
      "Material Supply",
      "HDPE Liner Installation",
      "QA/QC Testing",
      "Technical Support",
    ],
  },
  {
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    code: "CIV",
    hub: "West Africa Hub",
    coords: [5.36, -4.0083],
    title: "Abidjan Hub",
    subtitle: "West Africa Office",
    address: "Zone 4C, Rue des Carrossiers, Abidjan",
    phone: "+27 78 1355 926",
    email: "civ@geosynthetics.co.za",
    contactPerson: "Mamadou Coulibaly",
    isWestAfrica: true,
    services: "Port Infrastructure & Shoreline Erosion Supply",
    transit: "16 - 20 Days (Sea Freight)",
    routes: "Port of Durban → Port of Abidjan → Yamoussoukro",
    description:
      "Headed by Mamadou Coulibaly. Supporting West African gold mining, agricultural water storage, and coastal protection projects. Custom logistics clearing via Port of Abidjan.",
    capabilities: ["Material Supply", "Logistics & Export", "QA/QC Support"],
  },
  {
    country: "Ghana",
    flag: "🇬🇭",
    code: "GHA",
    hub: "West Africa Mining Hub",
    coords: [5.6037, -0.187],
    title: "West Africa Regional Hub",
    subtitle: "Accra Office",
    address: "14 Spintex Road, Accra",
    phone: "+27 78 1355 926",
    email: "ghana@geosynthetics.co.za",
    isWestAfrica: true,
    services: "West Africa Mining Supply & Certified Installation",
    transit: "14 - 18 Days (Sea Freight)",
    routes: "Port of Durban / Cape Town → Port of Tema → Accra / Tarkwa",
    description:
      "Headed by our West African regional team, serving gold mining and environmental containment projects across Ghana, Mali, and Burkina Faso.",
    capabilities: [
      "Material Supply",
      "HDPE Liner Installation",
      "QA/QC Testing",
      "Logistics & Export",
    ],
  },
  {
    country: "Botswana",
    flag: "🇧🇼",
    code: "BWA",
    hub: "Gaborone Logistics Hub",
    coords: [-24.6282, 25.9231],
    title: "Botswana Logistics Hub",
    subtitle: "Gaborone Distribution Center",
    address: "Plot 22017, Gaborone West Industrial, Gaborone",
    phone: "+27 78 1355 926",
    email: "botswana@geosynthetics.co.za",
    services: "Material Supply & Cross-Border Logistics",
    transit: "2 - 3 Days (Road Freight)",
    routes: "Johannesburg → Pioneer Gate / Tlokweng → Gaborone",
    description:
      "Supporting major diamond, copper, and iron ore mining operations. We handle advance customs clearances (SAD500) to ensure seamless material deliveries via Tlokweng/Pioneer Gate.",
    capabilities: [
      "Material Supply",
      "Cross-Border Logistics",
      "HDPE Liner Installation",
      "On-site QA/QC",
    ],
  },
  {
    country: "Namibia",
    flag: "🇳🇦",
    code: "NAM",
    hub: "Windhoek Hub",
    coords: [-22.5609, 17.0658],
    title: "Namibia Logistics Hub",
    subtitle: "Windhoek Distribution Center",
    address: "12 Edison Street, Southern Industrial Area, Windhoek",
    phone: "+27 78 1355 926",
    email: "namibia@geosynthetics.co.za",
    services: "Material Supply & QA/QC Support",
    transit: "3 - 4 Days (Road Freight)",
    routes: "Johannesburg → Trans-Kalahari Corridor → Windhoek",
    description:
      "Key supply route for uranium mines, marine civil works, and water conservation reservoirs. Logistics managed via the Trans-Kalahari Corridor.",
    capabilities: ["Material Supply", "Logistics & Customs", "QA/QC Testing"],
  },
  {
    country: "Zimbabwe",
    flag: "🇿🇼",
    code: "ZWE",
    hub: "Harare Hub",
    coords: [-17.8252, 31.0335],
    title: "Zimbabwe Operations Hub",
    subtitle: "Harare Office",
    address: "55 Coventry Road, Workington, Harare",
    phone: "+27 78 1355 926",
    email: "zimbabwe@geosynthetics.co.za",
    services: "Lining Installation & Technical Support",
    transit: "3 - 5 Days (Road Freight)",
    routes: "Johannesburg → Beitbridge → Harare / Bulawayo",
    description:
      "Serving agriculture, gold mining, and waste water treatment facilities. Full logistics support through Beitbridge border clearance with pre-scanned digital customs packs.",
    capabilities: ["Material Supply", "HDPE Liner Installation", "Technical Support"],
  },
  {
    country: "Mozambique",
    flag: "🇲🇿",
    code: "MOZ",
    hub: "Maputo Hub",
    coords: [-25.9692, 32.5732],
    title: "Mozambique Regional Hub",
    subtitle: "Maputo Office",
    address: "Avenida de Moçambique, Bairro do Jardim, Maputo",
    phone: "+27 78 1355 926",
    email: "mozambique@geosynthetics.co.za",
    services: "Coastal Works Supply & Installation QA/QC",
    transit: "2 - 3 Days (Road Freight)",
    routes: "Johannesburg → Lebombo / Ressano Garcia → Maputo",
    description:
      "Critical support for port infrastructure, coal mining, and coastal containment barriers. Specialized GCL and geotextile supply for erosion control.",
    capabilities: ["Material Supply", "Logistics & Export", "QA/QC Support"],
  },
  {
    country: "Zambia",
    flag: "🇿🇲",
    code: "ZMB",
    hub: "Lusaka Hub",
    coords: [-15.3875, 28.3228],
    title: "Zambia & DRC Hub",
    subtitle: "Lusaka Office",
    address: "Stand 10432, Katanga Road, Industrial Area, Lusaka",
    phone: "+27 78 1355 926",
    email: "zambia@geosynthetics.co.za",
    services: "Mining TSF Lining & Cross-Border Cleared Supply",
    transit: "4 - 6 Days (Road Freight)",
    routes: "Johannesburg → Martins Drift (Botswana) → Kazungula / Chirundu → Lusaka",
    description:
      "Serving the Copperbelt mining sector and large-scale agricultural projects. Coordinates cross-border transit towards DRC (Kolwezi) with full COMESA documentation.",
    capabilities: ["Material Supply", "HDPE Liner Installation", "Logistics & Export"],
  },
  {
    country: "Democratic Republic of Congo (DRC)",
    flag: "🇨🇩",
    code: "COD",
    hub: "Kolwezi / Lubumbashi Hub",
    coords: [-10.7222, 25.4678],
    title: "Kolwezi Office",
    subtitle: "Central Africa Mining Hub",
    address: "Avenue de la Métallurgie, Zone Industrielle, Kolwezi",
    phone: "+27 78 1355 926",
    email: "drc@geosynthetics.co.za",
    services: "Mining TSF Lining & Heavy Confinement Supply",
    transit: "5 - 7 Days (Road Freight)",
    routes: "Johannesburg → Zambia (transit) → Kasumbalesa → Kolwezi / Lubumbashi",
    description:
      "Supporting major cobalt and copper mining operations in the Katanga Province. We handle complex customs clearances at Kasumbalesa and coordinate local installation crews.",
    capabilities: ["Material Supply", "HDPE Liner Installation", "Cross-Border Logistics"],
  },
  {
    country: "Tanzania",
    flag: "🇹🇿",
    code: "TZA",
    hub: "East Africa Regional Hub",
    coords: [-6.7924, 39.2083],
    title: "Tanzania Operations",
    subtitle: "East Africa Hub",
    address: "Plot 45, Mandela Road, Industrial Area, Dar es Salaam",
    phone: "+27 78 1355 926",
    email: "tanzania@geosynthetics.co.za",
    services: "Material Supply & Technical Supervision",
    transit: "6 - 8 Days (Road Freight / Sea)",
    routes: "Durban / JHB → Zimbabwe / Zambia (transit) → Tunduma → Dar es Salaam",
    description:
      "Serving gold mining, infrastructure, and agricultural developments. Coordination of customs clearance via Dar es Salaam port and Tunduma border post.",
    capabilities: ["Material Supply", "HDPE Liner Installation", "Technical Support"],
  },
  {
    country: "Kenya",
    flag: "🇰🇪",
    code: "KEN",
    hub: "Nairobi Office",
    coords: [-1.2921, 36.8219],
    title: "Nairobi Office",
    subtitle: "East Africa Hub",
    address: "Mombasa Road, Syokimau, Nairobi",
    phone: "+27 78 1355 926",
    email: "kenya@geosynthetics.co.za",
    services: "Agricultural & Municipal Water Containment Supply",
    transit: "7 - 9 Days (Sea / Road)",
    routes: "Port of Durban → Port of Mombasa → Nairobi",
    description:
      "Serving East African agriculture, water containment, and infrastructure projects. Stock management and technical specifications support.",
    capabilities: ["Material Supply", "Design Support", "Logistics & Customs"],
  },
];

/**
 * Checks whether a given country name or code is in West Africa.
 */
export function isWestAfricanRegion(regionOrCountry: string): boolean {
  if (!regionOrCountry) return false;
  const normalized = regionOrCountry.toLowerCase().trim();
  const westAfricanKeywords = [
    "côte d'ivoire",
    "cote d'ivoire",
    "ivory coast",
    "ghana",
    "mali",
    "burkina faso",
    "burkina",
    "senegal",
    "guinea",
    "nigeria",
    "liberia",
    "sierra leone",
    "togo",
    "benin",
    "niger",
    "mauritania",
    "west africa",
    "west-africa",
    "civ",
    "gha",
  ];
  return westAfricanKeywords.some((keyword) => normalized.includes(keyword));
}

/**
 * Checks whether a given country name or code is South Africa.
 */
export function isSouthAfricanRegion(regionOrCountry: string): boolean {
  if (!regionOrCountry) return false;
  const normalized = regionOrCountry.toLowerCase().trim();
  return (
    normalized.includes("south africa") ||
    normalized === "rsa" ||
    normalized === "za" ||
    normalized === "zaf"
  );
}

/**
 * Resolves email destination and contact information based on region.
 */
export function resolveRegionalRouting(regionOrCountry: string): {
  targetEmail: string;
  targetName: string;
  targetRole: string;
  isWestAfrica: boolean;
  isSouthAfrica: boolean;
} {
  if (isWestAfricanRegion(regionOrCountry)) {
    return {
      targetEmail: MAMADOU_COULIBALY_CONTACT.email,
      targetName: MAMADOU_COULIBALY_CONTACT.name,
      targetRole: "Regional Director — West Africa (Ivory Coast)",
      isWestAfrica: true,
      isSouthAfrica: false,
    };
  }

  if (isSouthAfricanRegion(regionOrCountry)) {
    return {
      targetEmail: SOUTH_AFRICA_CONTACT.email,
      targetName: "South Africa Sales Desk",
      targetRole: "Johannesburg HQ",
      isWestAfrica: false,
      isSouthAfrica: true,
    };
  }

  // Find matching hub from DEFAULT_REGIONAL_COVERAGE or default to South Africa sales
  const found = DEFAULT_REGIONAL_COVERAGE.find(
    (r) =>
      r.country.toLowerCase() === regionOrCountry.toLowerCase() ||
      r.code.toLowerCase() === regionOrCountry.toLowerCase(),
  );

  return {
    targetEmail: found?.email || SOUTH_AFRICA_CONTACT.email,
    targetName: found ? `${found.country} Regional Desk` : "Pan-African Desk",
    targetRole: found?.hub || "Johannesburg HQ",
    isWestAfrica: false,
    isSouthAfrica: false,
  };
}
