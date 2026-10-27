export const PUBLIC_PATH_REDIRECTS: Record<string, string> = {
  "/products/concrete-mats-gccm": "/products/waterproofing-concrete-protection",
  "/products/geotextile-dewatering-systems": "/products/dewatering-systems",
  "/projects/private-residence-driveway-garden-path-redesign-motorbike-accessible-suds-surface":
    "/projects/bera-gravel-fix-stabilisation-residential-cycle-path-and-driveway",
  "/projects/ten-7m-20m-dewatering-tubes-zero-flocculants-large-scale-sludge-dewatering-in-durban":
    "/projects/sludge-dewatering-in-durban-ten-7-m-20-m-tubes",
  "/projects/zimbabwe-presidential-river-rehabilitation-210-000-m-of-spec-compliant-jutesoillock-292":
    "/projects/river-rehabilitation-210-000-m-of-spec-compliant-jutesoillock-292",
  "/applications/drainage-filtration": "/applications/drainage-filtration-systems-africa",
  // Legacy product links still stored in some CMS "Related products" lists
  "/products/geomembranes": "/products/geomembrane-liners",
  "/products/geomembranes/hdpe-geomembranes": "/products/geomembrane-liners/hdpe-geomembranes",
  "/products/geomembranes/lldpe-geomembranes": "/products/geomembrane-liners/lldpe-geomembrane-liners",
  "/products/geomembranes/pvc-geomembranes": "/products/geomembrane-liners/pvc-geomembranes",
  "/products/geomembranes/epdm-geomembranes": "/products/geomembrane-liners/epdm-geomembranes",
  "/products/geomembranes/pp-geomembranes": "/products/geomembrane-liners/fpp-geomembrane-liners",
  "/products/geomembranes/textured-geomembranes": "/products/geomembrane-liners/hdpe-geomembranes",
  "/products/geomembranes/speciality-geomembranes": "/products/geomembrane-liners",
  "/products/geotextiles": "/products/geotextile-fabrics",
  "/products/geotextiles/non-woven-geotextiles": "/products/geotextile-fabrics/polypropylene-non-woven-geotextiles",
  "/products/geotextiles/woven-geotextiles": "/products/geotextile-fabrics/polypropylene-woven-geotextiles",
  "/products/geotextiles/high-strength-geotextiles": "/products/geotextile-fabrics",
  "/products/geotextiles/geotextile-tubes": "/products/dewatering-systems/geotube-dewatering-systems",
  "/products/geotextiles/paving-fabrics": "/products/geogrids-interlayers/paving-fabrics",
  "/products/geotextiles/filtration-geotextiles": "/products/geotextile-fabrics/polypropylene-non-woven-geotextiles",
};

export function canonicalPublicPath(path: string): string {
  return PUBLIC_PATH_REDIRECTS[path] || path;
}

/** Industry slugs used by older CMS templates, mapped to the live industry pages. */
export const LEGACY_INDUSTRY_SLUGS: Record<string, string> = {
  "construction-infrastructure": "transport-infrastructure",
  "mining": "mining-minerals-processing",
  "environmental-waste": "waste-management-landfills",
  "water-management": "water-utilities-irrigation",
};

export function canonicalIndustrySlug(slug: string): string {
  return LEGACY_INDUSTRY_SLUGS[slug] || slug;
}
