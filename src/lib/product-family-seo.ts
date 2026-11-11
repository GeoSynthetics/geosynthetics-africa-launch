/** Specific fallbacks for families whose CMS SEO fields were left empty. */
const FAMILY_SEO: Record<string, { title: string; description: string }> = {
  "floating-cover-geomembranes": {
    title: "Reinforced Floating Cover Membranes | Supply & Installation Africa",
    description:
      "Reinforced floating-cover membranes for reservoirs, process ponds and evaporation control. Material selection, fabrication and installation across Africa.",
  },
  "pvc-geomembranes": {
    title: "PVC Geomembrane Liners for Dams & Ponds | Africa",
    description:
      "Flexible PVC geomembrane liners for dams, ponds, canals and containment. Review product specifications and request supply or installation across Africa.",
  },
  "pp-polytape-silt-fence": {
    title: "PolyTape Woven Silt Fence | Sediment Control Africa",
    description:
      "PolyTape woven polypropylene silt fence for construction, roads and mining sediment control. Selvedged edges, roll sizes and technical specifications.",
  },
};
const LEGACY_TITLES: Record<string, string> = {
  "Dimpled Drainage Boards South Africa | GeoDrain":
    "GeoDrain Dimpled Drainage Boards & Geocomposites | Africa",
  "Nonwoven Geotextiles South Africa | MIRAFI S, F, P & AR":
    "MIRAFI Nonwoven Geotextiles | S, F, P & AR Supply Africa",
};

export function productFamilySeo(family: string, label: string, category: string, data: any) {
  const configuredTitle = data?.seo?.title?.trim();
  const configuredDescription = data?.seo?.description?.trim();
  const fallback = FAMILY_SEO[family];
  return {
    title:
      LEGACY_TITLES[configuredTitle] ||
      configuredTitle ||
      fallback?.title ||
      `${label} | ${category} — Geosynthetics Africa`,
    description:
      configuredDescription &&
      !/^Explore our premium .+, fully specified for African projects\.?$/i.test(
        configuredDescription,
      )
        ? configuredDescription
        : fallback?.description ||
          `${label} for African projects. Review applications, product specifications and available grades. Request material supply, delivery and technical support.`,
  };
}
