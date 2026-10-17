/**
 * Canonical definitions and reconciliation utilities for Geosynthetics Africa Product Families.
 * Synchronizes the 11 Product Families displayed in the public Mega Menu ("Browse Products")
 * with Admin Product Management, the Public Catalogue, and Product Category pages.
 */

export interface ProductFamilyDefinition {
  id: string;
  slug: string;
  label: string;
  legacySlugs: string[];
  childSlugs: string[];
  searchKeywords?: Record<string, string>;
}

export const PRODUCT_FAMILIES: ProductFamilyDefinition[] = [
  {
    id: "geomembranes",
    slug: "geomembrane-liners",
    label: "Geomembrane Liners",
    legacySlugs: ["geomembranes", "geomembrane-liners"],
    childSlugs: [
      "hdpe-geomembranes",
      "floating-cover-geomembranes",
      "pvc-geomembranes",
      "epdm-geomembranes",
      "textured-geomembranes",
      "bituminous-liners",
      "gse-polylock-t",
      "lldpe-geomembrane-liners",
      "lldpe-geomembranes",
      "rfpp-geomembrane-liners",
      "fpp-geomembrane-liners",
      "speciality-geomembranes",
      "cspe-geomembranes-for-potable-water-floating-covers",
      "pp-geomembranes",
    ],
    searchKeywords: {
      "hdpe-geomembranes": "HDPE",
      "lldpe-geomembranes": "LLDPE",
      "lldpe-geomembrane-liners": "LLDPE",
      "pvc-geomembranes": "PVC",
      "epdm-geomembranes": "EPDM",
      "pp-geomembranes": "PP Geomembrane",
      "textured-geomembranes": "EVA",
      "speciality-geomembranes": "CSPE",
      "floating-cover-geomembranes": "Floating Cover",
      "bituminous-liners": "Bituminous",
      "gse-polylock-t": "PolyLock",
      "rfpp-geomembrane-liners": "rFPP",
      "fpp-geomembrane-liners": "fPP",
      "cspe-geomembranes-for-potable-water-floating-covers": "CSPE",
    },
  },
  {
    id: "tester-category",
    slug: "geosynthetic-clay-liners-gcl",
    label: "Geosynthetic Clay Liners (GCL)",
    legacySlugs: ["gcls", "tester-category", "geosynthetic-clay-liners", "geosynthetic-clay-liners-gcl"],
    childSlugs: [
      "reinforced-sodium-bentonite-geosynthetic-clay-liners",
      "hdpe-coated-bentonite-geosynthetic-clay-liners",
      "standard-gcls",
      "pe-coated-gcls",
      "reinforced-gcls",
    ],
    searchKeywords: {
      "reinforced-sodium-bentonite-geosynthetic-clay-liners": "GCL",
      "hdpe-coated-bentonite-geosynthetic-clay-liners": "GCL",
      "standard-gcls": "GCL",
      "pe-coated-gcls": "GCL",
      "reinforced-gcls": "GCL",
    },
  },
  {
    id: "geotextiles",
    slug: "geotextile-fabrics",
    label: "Geotextile Fabrics",
    legacySlugs: ["geotextiles", "geotextile-fabrics"],
    childSlugs: [
      "polypropylene-non-woven-geotextiles",
      "polypropylene-woven-geotextiles",
      "pp-polytape-silt-fence",
      "pp-root-barrier",
      "pp-weedblock-ground-cover",
      "non-woven-geotextiles",
      "woven-geotextiles",
      "high-strength-geotextiles",
      "filtration-geotextiles",
    ],
    searchKeywords: {
      "pp-root-barrier": "Root Barrier",
      "pp-polytape-silt-fence": "Silt Fence",
      "pp-weedblock-ground-cover": "Ground Cover",
      "polypropylene-woven-geotextiles": "Woven",
      "polypropylene-non-woven-geotextiles": "Nonwoven",
      "non-woven-geotextiles": "Nonwoven",
      "woven-geotextiles": "Woven",
      "high-strength-geotextiles": "High-Strength",
    },
  },
  {
    id: "reinforcement-geogrids",
    slug: "geogrids-interlayers",
    label: "Geogrids & Interlayers",
    legacySlugs: ["geogrids", "reinforcement-geogrids", "geogrids-interlayers"],
    childSlugs: [
      "biaxial-geogrids",
      "triaxial-geogrids",
      "multi-axial-geogrids",
      "uniaxial-geogrids",
      "composite-geogrids",
      "strip-bonded-geogrids",
      "polymeric-geostrips",
      "glass-asphalt-geogrid",
      "asphalt-interlayer-composite",
      "paving-fabrics",
      "fiberglass-geogrids",
    ],
    searchKeywords: {
      "biaxial-geogrids": "Biaxial",
      "triaxial-geogrids": "Triaxial",
      "uniaxial-geogrids": "Uniaxial",
      "composite-geogrids": "Composite",
      "multi-axial-geogrids": "InterAx",
      "glass-asphalt-geogrid": "Asphalt",
      "paving-fabrics": "Paving",
    },
  },
  {
    id: "erosion-control",
    slug: "erosion-control-geocells",
    label: "Erosion Control & Geocells",
    legacySlugs: ["erosion-control", "erosion-control-geocells"],
    childSlugs: [
      "jute-soil-erosion-saver-control-blanket",
      "erosion-control-blankets",
      "coir-fibre-soil-blankets",
      "turf-reinforcement-mats",
      "straw-cellulose-erosion-blanket",
      "coir-logs",
      "envirowool-soil-erosion-blankets",
      "envirowool-erosion-blankets",
      "geostrata-hdpe-geocells",
      "hdpe-geocells",
      "polycell-polypropylene-geocells",
      "polypropylene-geocells",
    ],
    searchKeywords: {
      "geostrata-hdpe-geocells": "Geocell",
      "polycell-polypropylene-geocells": "Geocell",
      "coir-fibre-soil-blankets": "Coir",
      "envirowool-soil-erosion-blankets": "EnviroWool",
      "straw-cellulose-erosion-blanket": "Straw",
      "jute-soil-erosion-saver-control-blanket": "Jute",
    },
  },
  {
    id: "drainage-composites",
    slug: "pipes-drainage-ducting",
    label: "Pipes, Drainage & Ducting",
    legacySlugs: ["drainage-composites", "pipes-drainage-ducting"],
    childSlugs: [
      "leak-detection-drainage-sheets",
      "geonets",
      "subsoil-drainage-pipes",
      "geocomposite-drains",
      "cable-ducting-pipes",
      "structured-wall-pipes",
      "dimpled-drainage-boards",
      "drainage-boards",
      "netlon-strip-drains",
      "prefabricated-vertical-drains-pvds",
    ],
    searchKeywords: {
      "cable-ducting-pipes": "Duct",
      "subsoil-drainage-pipes": "Subsoil",
      "structured-wall-pipes": "Structured",
      "dimpled-drainage-boards": "Dimpled",
      "leak-detection-drainage-sheets": "Leak",
    },
  },
  {
    id: "accessories",
    slug: "gabion-baskets",
    label: "Gabion Baskets",
    legacySlugs: ["gabion-baskets"],
    childSlugs: [
      "square-weld-mesh-gabion-baskets",
      "river-reno-matresses",
      "galvanised-woven-gabion-baskets",
    ],
    searchKeywords: {
      "galvanised-woven-gabion-baskets": "Gabion",
      "square-weld-mesh-gabion-baskets": "Weldmesh",
      "river-reno-matresses": "Reno",
    },
  },
  {
    id: "geocells",
    slug: "permeable-paving-systems",
    label: "Permeable Paving Systems",
    legacySlugs: ["geocells", "permeable-paving-systems"],
    childSlugs: ["bera-gravel-fix", "bera-stable-fix", "bera-grass-fix"],
    searchKeywords: {
      "bera-grass-fix": "Grass Fix",
      "bera-gravel-fix": "Gravel Fix",
      "bera-stable-fix": "Stable Fix",
    },
  },
  {
    id: "sediment-control",
    slug: "dewatering-systems",
    label: "Dewatering Systems",
    legacySlugs: ["dewatering-systems", "sediment-control"],
    childSlugs: [
      "geotube-dewatering-systems",
      "geotextile-tubes",
      "flowtex-dewatering-tubes-bags",
      "geo-curtain-silt-turbidity-curtains",
      "silt-curtains",
    ],
    searchKeywords: {
      "geotube-dewatering-systems": "Geotube",
      "flowtex-dewatering-tubes-bags": "FlowTex",
      "geo-curtain-silt-turbidity-curtains": "Silt Curtain",
    },
  },
  {
    id: "geotextile-containers",
    slug: "geosynthetic-sand-containers",
    label: "Geosynthetic Sand Containers",
    legacySlugs: ["geotextile-containers", "geosynthetic-sand-containers"],
    childSlugs: ["geotextile-sand-bags", "woven-geotextile-sand-bags"],
    searchKeywords: {
      "geotextile-sand-bags": "Sand",
      "woven-geotextile-sand-bags": "Sand",
    },
  },
  {
    id: "geosynthetic-concrete-mats-gccm",
    slug: "waterproofing-concrete-protection",
    label: "Waterproofing & Concrete Protection",
    legacySlugs: [
      "damp-proofing",
      "geosynthetic-concrete-mats-gccm",
      "waterproofing-concrete-protection",
    ],
    childSlugs: [
      "damp-proof-membrane-dpm-construction-plastic-sheeting-250-375-500-micron",
      "dpc-damp-proof-membranes-construction-plastic-sheeting-",
      "concrete-curing-hessian-jute",
      "flexible-concrete-liner-system-for-africa-tiltex-gccm",
      "tiltex-concrete-gccm-liner",
      "studded-hdpe-concrete-liners-cpl",
    ],
    searchKeywords: {
      "dpc-damp-proof-membranes-construction-plastic-sheeting-": "DPC",
      "damp-proof-membrane-dpm-construction-plastic-sheeting-250-375-500-micron": "DPC",
      "concrete-curing-hessian-jute": "CureLock",
      "tiltex-concrete-gccm-liner": "Tiltex",
      "flexible-concrete-liner-system-for-africa-tiltex-gccm": "Tiltex",
    },
  },
];

export interface ReconciledCategory {
  id: string; // Database category UUID or fallback ID
  name: string; // Display label matching product families (e.g. "Waterproofing & Concrete Protection")
  slug: string; // Canonical slug (e.g. "waterproofing-concrete-protection")
  familyId: string;
  childSlugs: string[];
  dbCategoryIds: string[];
}

/**
 * Finds a ProductFamilyDefinition by slug, ID, legacy slug, label, or child slug.
 */
export function findProductFamily(
  identifier: string | null | undefined,
): ProductFamilyDefinition | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();

  return PRODUCT_FAMILIES.find((fam) => {
    if (fam.slug.toLowerCase() === clean) return true;
    if (fam.id.toLowerCase() === clean) return true;
    if (fam.label.toLowerCase() === clean) return true;
    if (fam.legacySlugs.some((s) => s.toLowerCase() === clean)) return true;
    if (fam.childSlugs.some((c) => c.toLowerCase() === clean)) return true;
    return false;
  });
}

/**
 * Resolves the catalogue search and filter parameters for any category or sub-family slug.
 */
export function getCatalogueFiltersForSlug(slug: string): { q: string; catSlug: string } {
  if (!slug) return { q: "", catSlug: "" };
  const clean = slug.trim().toLowerCase();

  const family = findProductFamily(clean);
  if (!family) {
    return { q: "", catSlug: "" };
  }

  // If the slug is one of the parent family slugs or legacy slugs
  if (
    family.slug.toLowerCase() === clean ||
    family.id.toLowerCase() === clean ||
    family.legacySlugs.some((s) => s.toLowerCase() === clean)
  ) {
    return { q: "", catSlug: family.slug };
  }

  // If the slug is a child sub-family slug, lookup specific keyword or return family filter
  const keyword = family.searchKeywords?.[clean] || "";
  return { q: keyword, catSlug: family.slug };
}

/**
 * Reconciles raw database categories with hierarchy products into 11 canonical product family options.
 */
export function reconcileCategoriesWithFamilies(
  dbCategories: Array<{ id: string; name: string; slug?: string | null }>,
  hierarchyItems?: Array<{ id: string; label: string; slug?: string }>,
): ReconciledCategory[] {
  return PRODUCT_FAMILIES.map((family) => {
    // Collect all matching DB categories
    const matchedDbCats = dbCategories.filter((dbCat) => {
      const cSlug = (dbCat.slug || "").toLowerCase();
      const cName = (dbCat.name || "").toLowerCase();

      return (
        cSlug === family.slug.toLowerCase() ||
        family.legacySlugs.some((s) => s.toLowerCase() === cSlug) ||
        cName === family.label.toLowerCase() ||
        (family.slug === "permeable-paving-systems" && cSlug === "geocells") ||
        (family.slug === "waterproofing-concrete-protection" && (cSlug === "damp-proofing" || cName.includes("damp"))) ||
        (family.slug === "geosynthetic-sand-containers" && (cSlug === "accessories" || cSlug === "geotextile-containers")) ||
        (family.slug === "geosynthetic-clay-liners-gcl" && (cSlug === "gcls" || cName.includes("gcl"))) ||
        (family.slug === "pipes-drainage-ducting" && (cSlug === "drainage-composites" || cName.includes("drainage"))) ||
        (family.slug === "geogrids-interlayers" && (cSlug === "geogrids" || cName.includes("geogrid"))) ||
        (family.slug === "erosion-control-geocells" && (cSlug === "erosion-control" || cName.includes("erosion"))) ||
        (family.slug === "geomembrane-liners" && (cSlug === "geomembranes" || cName.includes("geomembrane"))) ||
        (family.slug === "geotextile-fabrics" && (cSlug === "geotextiles" || cName.includes("geotextile"))) ||
        (family.slug === "gabion-baskets" && (cSlug === "gabion-baskets" || cName.includes("gabion"))) ||
        (family.slug === "dewatering-systems" && (cSlug === "dewatering-systems" || cName.includes("dewatering")))
      );
    });

    const primaryDbCat = matchedDbCats[0];
    const dbCategoryIds = matchedDbCats.map((c) => c.id);

    // Look for custom label in hierarchy if present
    const hItem = hierarchyItems?.find(
      (h) => h.slug === family.slug || h.id === family.id || h.slug === family.id,
    );

    return {
      id: primaryDbCat ? primaryDbCat.id : family.id,
      name: hItem?.label || family.label,
      slug: family.slug,
      familyId: family.id,
      childSlugs: family.childSlugs,
      dbCategoryIds,
    };
  });
}
