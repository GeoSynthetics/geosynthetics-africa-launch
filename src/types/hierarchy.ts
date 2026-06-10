// ─── Unified Hierarchy Schema ──────────────────────────────────────────────
// A single source of truth for all nav + page content.
// Stored in site_config under: "hierarchy_products", "hierarchy_applications",
//   "hierarchy_services", "hierarchy_industries"
//
// Structure:
//   HierarchySection   → top-level (e.g. Products, Applications)
//     HierarchyItem    → primary nav item / category (e.g. Geomembranes)
//       HierarchyChild → sub-item / family (e.g. HDPE Geomembranes)

export interface FeaturedProduct {
  label: string;
  spec: string;
  to: string;
  params?: Record<string, string>;
  image?: string;
}

export interface FeaturedImage {
  title: string;
  description: string;
  to: string;
  params?: Record<string, string>;
  image: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  to: string;
  params?: Record<string, string>;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PropertyRow {
  cells: string[];
}

export interface PropertiesTable {
  headers: string[];
  rows: string[][];
}

export interface ProjectReference {
  name: string;
  location: string;
  year: string;
  image: string;
}

export interface TechnicalHighlight {
  label: string;
  value: string;
}

/** Page content that applies to both Categories and Families */
export interface PageContent {
  heroImage?: string;
  subtitle?: string;
  description?: string[];
  features?: string[];
  technicalHighlights?: TechnicalHighlight[];
  propertiesTable?: PropertiesTable;
  types?: { name: string; description: string }[];
  benefits?: { title: string; description: string }[];
  faqs?: FAQ[];
  installationSpecs?: string[];
  projectReferences?: ProjectReference[];
  popularProducts?: { name: string; spec: string; desc: string; image?: string }[];
  applications?: { label: string; slug: string; description?: string }[];
  industries?: { label: string; slug: string }[];
  stats?: { projects: string; countries: string; experts: string; years: string };
  seo?: { title: string; description: string; keywords?: string };
  sections?: { title: string; body: string }[];
}

/** Mega menu hover content for a specific item */
export interface MegaContent {
  secondaryTitle?: string;
  secondary?: { label: string; to: string; params?: Record<string, string> }[];
  featuredTitle?: string;
  featuredKind?: "product" | "image";
  featured?: FeaturedProduct[] | FeaturedImage[];
  quickActionsTitle?: string;
  quickActions?: QuickAction[];
  topSellingProductId?: string;
  topSellingProductIds?: string[];
}

/** A child/family item (e.g. HDPE Geomembranes under Geomembranes) */
export interface HierarchyChild {
  id: string;          // unique id, e.g. "hdpe-geomembranes"
  slug: string;        // URL slug
  label: string;
  icon?: string;
  to: string;          // route path pattern e.g. "/products/$category/$family"
  params?: Record<string, string>;
  pageContent?: PageContent;
  megaContent?: MegaContent;
}

/** A top-level primary nav item (e.g. Geomembranes, Mining Systems) */
export interface HierarchyItem {
  id: string;
  slug: string;
  label: string;
  icon?: string;
  to: string;          // route path pattern
  params?: Record<string, string>;
  children: HierarchyChild[];
  pageContent?: PageContent;
  /** Fallback mega-menu content when no child is hovered */
  megaFallback?: MegaContent;
  /** Quick actions for ALL children of this item */
  quickActions?: QuickAction[];
}

/** The root section stored in site_config */
export interface HierarchySection {
  key: "products" | "applications" | "services" | "industries";
  label: string;
  to: string;
  primaryTitle: string;
  items: HierarchyItem[];
  /** Section-level fallback mega-menu content (shown when nothing is hovered) */
  fallbackContent?: MegaContent;
}
