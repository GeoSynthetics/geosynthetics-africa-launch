/**
 * Country page profiles: which industries lead in each country, which of our
 * application pages match them, which hub serves the country and the site
 * conditions our crews plan for. Hub statements only repeat what the site
 * already states about stock and crews (South Africa, Zimbabwe, DRC, Tanzania,
 * Mali). Keyed by the country page slug.
 */

export interface CountryIndustry {
  label: string;
  /** Industry page slug under /industries, when one exists */
  industrySlug?: string;
  summary: string;
  /** Application page slugs under /applications */
  applications: string[];
}

export interface CountryProfile {
  industries: CountryIndustry[];
  hub: string;
  conditions: string[];
}

const IND = {
  mining: (summary: string, apps?: string[]): CountryIndustry => ({
    label: "Mining & Minerals Processing",
    industrySlug: "mining-minerals-processing",
    summary,
    applications: apps ?? [
      "tailings-storage-facility-lining",
      "heap-leach-pad-lining",
      "process-water-pollution-control-dam-lining",
      "roads-railways",
    ],
  }),
  water: (summary: string, apps?: string[]): CountryIndustry => ({
    label: "Water Utilities & Irrigation",
    industrySlug: "water-utilities-irrigation",
    summary,
    applications: apps ?? [
      "reservoir-dam-lining",
      "floating-covers-evaporation-control",
      "irrigation-canal-lining",
      "wastewater-treatment-pond-lining",
    ],
  }),
  agri: (summary: string): CountryIndustry => ({
    label: "Agriculture & Aquaculture",
    industrySlug: "agriculture-aquaculture",
    summary,
    applications: [
      "agricultural-aquaculture-pond-lining",
      "irrigation-canal-lining",
      "reservoir-dam-lining",
    ],
  }),
  roads: (summary: string): CountryIndustry => ({
    label: "Roads, Rail & Infrastructure",
    industrySlug: "transport-infrastructure",
    summary,
    applications: [
      "roads-railways",
      "stabilisation-reinforcement",
      "retaining-wall-systems",
      "drainage-filtration-systems-africa",
    ],
  }),
  waste: (summary: string): CountryIndustry => ({
    label: "Waste Management & Landfills",
    industrySlug: "waste-management-landfills",
    summary,
    applications: [
      "landfill-ash-bund-lining",
      "landfill-capping-closure",
      "wastewater-treatment-pond-lining",
    ],
  }),
  coastal: (summary: string): CountryIndustry => ({
    label: "Coastal & River Protection",
    summary,
    applications: [
      "coastal-protection",
      "slope-erosion-protection",
      "sediment-control-silt-curtains-fences",
    ],
  }),
  oilgas: (summary: string): CountryIndustry => ({
    label: "Oil, Gas & Petrochemical",
    industrySlug: "oil-gas-petrochemical",
    summary,
    applications: [
      "landfill-ash-bund-lining",
      "process-water-pollution-control-dam-lining",
      "stabilisation-reinforcement",
    ],
  }),
  energy: (summary: string): CountryIndustry => ({
    label: "Energy & Power Generation",
    industrySlug: "energy-power-generation",
    summary,
    applications: [
      "landfill-ash-bund-lining",
      "stabilisation-reinforcement",
      "process-water-pollution-control-dam-lining",
    ],
  }),
};

const HUB = {
  sa: "Served from our South African stock in Johannesburg and Cape Town, with permanent installation crews in South Africa.",
  sadcRoad:
    "Served by road from our Johannesburg stock, with installation crews mobilised from our South African and Zimbabwean teams.",
  zim: "Served by our Zimbabwe subsidiary and its permanent installation crews, with stock replenished by road from Johannesburg.",
  drc: "Served by our permanent installation crews based in the DRC, with stock trucked from Johannesburg through Zambia.",
  copperbelt:
    "Served by road from our Johannesburg stock, with installation crews mobilised from our DRC and South African teams.",
  east: "Served from our stock in Tanzania, with materials and crews routed through Dar es Salaam or Mombasa.",
  west: "Served from our Bamako stock and permanent Mali installation crews, who also work across West Africa.",
  westPort:
    "Served from our Bamako hub and permanent Mali crews, with container shipments through the nearest West African port.",
  north:
    "Served by our pan-African project desk, with materials shipped container-direct to the nearest port and crews mobilised for each project.",
  central:
    "Served by our pan-African project desk, with materials shipped to Douala, Kribi or Owendo and crews mobilised for each project.",
};

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  "south-africa-geosynthetics-supplier-installer": {
    industries: [
      IND.mining(
        "Gold, platinum, coal and iron ore operations need lined TSFs, pollution control dams and stable haul roads.",
      ),
      IND.water("Municipal reservoirs, potable water covers and wastewater ponds."),
      IND.waste("Landfill cells, capping and leachate ponds to national waste regulations."),
      IND.roads("Road, rail and platform stabilisation over weak and expansive soils."),
    ],
    hub: HUB.sa,
    conditions: [
      "Expansive clays and dolomitic ground in parts of Gauteng that govern subgrade preparation",
      "Highveld summer thunderstorms that set the weather windows for welding",
      "Acid mine drainage that drives liner and pond chemistry checks",
    ],
  },
  "botswana-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Diamond and copper operations need lined process ponds, TSFs and haul roads."),
      IND.water("Water storage and reservoir lining where every cubic metre counts."),
      IND.roads("Road and platform stabilisation over Kalahari sands."),
    ],
    hub: HUB.sadcRoad,
    conditions: [
      "Very high evaporation that makes covers and lined storage pay back quickly",
      "Loose Kalahari sands that need confinement for roads and platforms",
      "Long road hauls from Gaborone to remote mine sites",
    ],
  },
  "zimbabwe-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Gold, platinum and lithium operations need lined TSFs, ponds and haul roads."),
      IND.agri("Irrigation dams, canals and farm ponds."),
      IND.water("Municipal water storage and reservoir lining."),
      IND.coastal("River rehabilitation and erosion control."),
    ],
    hub: HUB.zim,
    conditions: [
      "A November to March rainy season that sets installation windows",
      "Granitic and black clay subgrades that vary site to site",
    ],
  },
  "zambia-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Copperbelt operations need lined TSFs, PCDs, leach pads and haul roads."),
      IND.agri("Irrigation dams, canals and farm water storage."),
      IND.roads("Road and platform stabilisation over lateritic soils."),
    ],
    hub: HUB.copperbelt,
    conditions: [
      "A rainy season from about November to April that sets earthworks and welding windows",
      "Lateritic and soft clay subgrades under heavy haul traffic",
      "Acidic process solutions that drive liner selection",
    ],
  },
  "mozambique-geosynthetics-supplier-contact": {
    industries: [
      IND.mining(
        "Coal, graphite and heavy-mineral sands operations need lined ponds, TSFs and haul roads.",
      ),
      IND.coastal("Coastal and riverbank protection along an exposed coastline."),
      IND.oilgas("Platforms, laydown areas and containment for energy projects."),
      IND.agri("Irrigation and aquaculture ponds."),
    ],
    hub: HUB.sadcRoad,
    conditions: [
      "Tropical cyclones and high summer rainfall that govern ballast and anchorage",
      "Coastal sands and soft ground near the coast",
      "Documentation and site communication in Portuguese",
    ],
  },
  "namibia-geosynthetics-supplier-contact": {
    industries: [
      IND.mining("Uranium, gold and diamond operations need lined ponds, TSFs and leach pads."),
      IND.water("Reservoirs and evaporation control in one of Africa's driest countries."),
      IND.roads("Road and platform stabilisation."),
    ],
    hub: HUB.sadcRoad,
    conditions: [
      "Extreme evaporation that makes floating covers and lined storage worthwhile",
      "High UV and daily temperature swings that govern exposed liner selection",
      "Salt-laden coastal air near Walvis Bay and Lüderitz",
    ],
  },
  "angola-geosynthetics-supplier-installer": {
    industries: [
      IND.oilgas("Containment, platforms and laydown areas for oil and gas projects."),
      IND.mining("Diamond operations need lined ponds and haul roads."),
      IND.roads("Road, port and urban infrastructure."),
    ],
    hub: HUB.north,
    conditions: [
      "A long rainy season in the north and centre",
      "Documentation and site communication in Portuguese",
    ],
  },
  "malawi-geosynthetics-supplier-installer": {
    industries: [
      IND.agri("Irrigation dams, canals and farm ponds."),
      IND.water("Water supply reservoirs and treatment ponds."),
      IND.roads("Road stabilisation and drainage."),
    ],
    hub: HUB.sadcRoad,
    conditions: [
      "A November to April rainy season",
      "Landlocked supply routed by road or through the Beira and Nacala corridors",
    ],
  },
  "eswatini-geosynthetics-supplier-installer": {
    industries: [
      IND.agri("Irrigation dams and canals for sugar and citrus estates."),
      IND.water("Municipal water storage and wastewater ponds."),
      IND.roads("Road stabilisation and retaining walls on hilly terrain."),
    ],
    hub: HUB.sadcRoad,
    conditions: [
      "Steep terrain where slope stability and erosion control matter",
      "Summer rainfall peaks",
    ],
  },
  "lesotho-geosynthetics-supplier-installer": {
    industries: [
      IND.water("Water storage and transfer infrastructure."),
      IND.mining("Diamond operations need lined ponds and TSFs."),
      IND.roads("Mountain roads, retaining walls and slope protection."),
    ],
    hub: HUB.sadcRoad,
    conditions: [
      "High altitude with winter frost and freeze-thaw cycles",
      "Steep slopes where erosion control and reinforced walls are routine",
    ],
  },
  "tanzania-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Gold and copper operations need lined TSFs, leach pads and process ponds."),
      IND.roads("Road, rail and port infrastructure."),
      IND.water("Water storage and treatment ponds."),
      IND.agri("Irrigation and aquaculture ponds."),
    ],
    hub: HUB.east,
    conditions: [
      "Long rains from about March to May and short rains late in the year",
      "Black cotton soils in parts of the interior that need separation and stabilisation",
    ],
  },
  "kenya-geosynthetics-supplier-contact": {
    industries: [
      IND.agri("Horticulture reservoirs, farm water pans and aquaculture ponds."),
      IND.water("County water storage and wastewater ponds."),
      IND.waste("County landfill cells and capping."),
      IND.roads("Road stabilisation over black cotton soil."),
    ],
    hub: HUB.east,
    conditions: [
      "Black cotton soils that swell and shrink and need separation and reinforcement",
      "High UV at altitude that governs exposed liner choice",
      "Two rainy seasons that set installation windows",
    ],
  },
  "ethiopia-geosynthetics-supplier-installer": {
    industries: [
      IND.water("Dams, reservoirs and irrigation schemes."),
      IND.roads("Road and rail infrastructure."),
      IND.agri("Irrigation canals and farm ponds."),
    ],
    hub: HUB.east,
    conditions: [
      "Highland terrain with steep slopes and erosion-prone soils",
      "Supply routed through Djibouti and inland by rail and road",
    ],
  },
  "uganda-geosynthetics-supplier-installer": {
    industries: [
      IND.oilgas("Platforms, laydown areas and containment for oil field development."),
      IND.roads("Road infrastructure and drainage."),
      IND.agri("Irrigation and aquaculture ponds."),
    ],
    hub: HUB.east,
    conditions: [
      "Two rainy seasons and high rainfall around Lake Victoria",
      "Landlocked supply routed through Mombasa or Dar es Salaam",
    ],
  },
  "rwanda-geosynthetics-supplier-installer": {
    industries: [
      IND.roads("Roads, retaining walls and slope stabilisation on steep terrain."),
      IND.water("Water storage and treatment ponds."),
      IND.mining("Tin, tungsten and tantalum operations need ponds and sediment control."),
    ],
    hub: HUB.east,
    conditions: [
      "Steep hillsides where erosion control and reinforced slopes are routine",
      "High rainfall over much of the year",
    ],
  },
  "drc-geosynthetics-supplier-installer": {
    industries: [
      IND.mining(
        "Copper-cobalt operations in Lualaba and Haut-Katanga need TSF, leach pad, PCD and haul road systems.",
      ),
      IND.roads("Haul roads, platforms and crusher walls over lateritic ground."),
      IND.water("Process water, raw water and potable storage."),
    ],
    hub: HUB.drc,
    conditions: [
      "Heavy rainy-season downpours that set earthworks and welding windows",
      "Lateritic subgrades and heavy haul trucks on mine roads",
      "Acidic process solutions that drive liner and leak detection choices",
      "Documentation and site communication in French",
    ],
  },
  "cameroon-geosynthetics-supplier-installer": {
    industries: [
      IND.roads("Road, port and urban infrastructure."),
      IND.agri("Plantation water storage and ponds."),
      IND.mining("Mining and quarry operations."),
    ],
    hub: HUB.central,
    conditions: [
      "Very high rainfall in the coastal south",
      "Documentation and site communication in French or English",
    ],
  },
  "gabon-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Manganese operations need ponds, TSFs and haul roads."),
      IND.oilgas("Containment and platforms for oil operations."),
      IND.roads("Road and rail infrastructure."),
    ],
    hub: HUB.central,
    conditions: [
      "Equatorial rainfall for much of the year",
      "Documentation and site communication in French",
    ],
  },
  "cote-divoire-geosynthetics-supplier-contact": {
    industries: [
      IND.mining("Gold operations need lined leach pads, TSFs and process ponds."),
      IND.roads("Road and port infrastructure around Abidjan and inland."),
      IND.agri("Plantation water storage and ponds."),
      IND.coastal("Lagoon and coastal protection."),
    ],
    hub: HUB.westPort,
    conditions: [
      "Two rainy seasons in the south that set installation windows",
      "Supply through the Port of Abidjan",
      "Documentation and site communication in French",
    ],
  },
  "ghana-geosynthetics-supplier-contact": {
    industries: [
      IND.mining("Gold operations need lined TSFs, leach pads and process ponds."),
      IND.coastal("Coastal erosion protection along the Gulf of Guinea."),
      IND.roads("Road and urban drainage infrastructure."),
    ],
    hub: HUB.westPort,
    conditions: [
      "Coastal erosion on exposed shorelines",
      "High rainfall in the south and west mining belt",
      "Supply through the Port of Tema",
    ],
  },
  "nigeria-geosynthetics-supplier-installer": {
    industries: [
      IND.oilgas("Containment, platforms and remediation for oil and gas."),
      IND.roads("Road, rail and urban drainage infrastructure."),
      IND.waste("Landfill cells and capping for growing cities."),
      IND.coastal("Coastal and riverbank protection."),
    ],
    hub: HUB.westPort,
    conditions: [
      "Soft deltaic soils and high groundwater in the south",
      "Heavy rainfall and flooding in the rainy season",
    ],
  },
  "senegal-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Gold and phosphate operations need ponds, TSFs and leach pads."),
      IND.coastal("Coastal erosion protection along the Atlantic coast."),
      IND.water("Water storage and irrigation in the Senegal River valley."),
    ],
    hub: HUB.westPort,
    conditions: [
      "A short rainy season from about July to October",
      "Coastal erosion on exposed shorelines",
      "Documentation and site communication in French",
    ],
  },
  "guinea-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Bauxite and gold operations need ponds, TSFs, leach pads and haul roads."),
      IND.roads("Haul roads, rail and port infrastructure."),
    ],
    hub: HUB.westPort,
    conditions: [
      "Some of the highest rainfall in West Africa near the coast",
      "Lateritic soils under heavy haulage",
      "Documentation and site communication in French",
    ],
  },
  "burkina-faso-geosynthetics-supplier-installer": {
    industries: [
      IND.mining(
        "Gold operations need lined heap leach pads, CIL tailings facilities and process ponds.",
      ),
      IND.water("Reservoirs and irrigation basins in a water-scarce climate."),
      IND.roads("Roads and platforms."),
    ],
    hub: HUB.west,
    conditions: [
      "A rainy season from about June to September, and Harmattan dust in the dry season",
      "High evaporation that makes lined storage and covers pay back",
      "Documentation and site communication in French",
    ],
  },
  "sierra-leone-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Gold, iron ore and diamond operations need ponds, TSFs and haul roads."),
      IND.roads("Road and port infrastructure."),
    ],
    hub: HUB.westPort,
    conditions: [
      "Very high rainfall from about May to October",
      "Supply through the Port of Freetown",
    ],
  },
  "mali-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Gold and lithium operations need lined heap leach pads, TSFs and process ponds."),
      IND.water("Water storage and irrigation."),
      IND.roads("Haul roads and platforms."),
    ],
    hub: HUB.west,
    conditions: [
      "A rainy season from about June to September that sets installation windows",
      "Harmattan dust and high temperatures that govern welding parameters",
      "Documentation and site communication in French",
    ],
  },
  "egypt-geosynthetics-supplier-installer": {
    industries: [
      IND.water("Canal lining, reservoirs, desalination and wastewater."),
      IND.waste("Landfill cells and capping."),
      IND.roads("Road and urban infrastructure."),
      IND.energy("Platforms and containment for power projects."),
    ],
    hub: HUB.north,
    conditions: [
      "Arid climate with very high evaporation",
      "High UV and temperature for exposed liners",
    ],
  },
  "morocco-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Phosphate operations need ponds and process water containment."),
      IND.water("Dams, reservoirs and irrigation."),
      IND.waste("Landfill cells and capping."),
    ],
    hub: HUB.north,
    conditions: ["Water scarcity that makes lined storage a priority", "Documentation in French"],
  },
  "mauritania-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Iron ore and gold operations need ponds, TSFs and haul roads."),
      IND.water("Water storage and desalination."),
    ],
    hub: HUB.north,
    conditions: [
      "Desert conditions with wind-blown sand and extreme heat",
      "Documentation in French",
    ],
  },
  "madagascar-geosynthetics-supplier-installer": {
    industries: [
      IND.mining("Nickel-cobalt and mineral sands operations need TSFs, ponds and haul roads."),
      IND.coastal("Coastal and riverbank protection."),
      IND.agri("Irrigation and aquaculture ponds."),
    ],
    hub: HUB.north,
    conditions: [
      "Tropical cyclones from about December to March",
      "Supply through Toamasina",
      "Documentation in French",
    ],
  },
};

/** Profile for a country page slug (also matches by country name as a fallback). */
export function countryProfileFor(slug?: string, country?: string): CountryProfile | null {
  if (slug && COUNTRY_PROFILES[slug]) return COUNTRY_PROFILES[slug];
  if (country) {
    const key = country
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/[’']/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const found = Object.keys(COUNTRY_PROFILES).find((k) => k.startsWith(key));
    if (found) return COUNTRY_PROFILES[found];
    if (/congo|drc/i.test(country)) return COUNTRY_PROFILES["drc-geosynthetics-supplier-installer"];
  }
  return null;
}
