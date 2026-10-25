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
};

export function canonicalPublicPath(path: string): string {
  return PUBLIC_PATH_REDIRECTS[path] || path;
}
