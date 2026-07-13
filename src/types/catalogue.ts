// ─── Catalogue Page Site-Builder Content Types ────────────────────────────────
// Stored in Supabase site_config under key: "catalogue_page_content"

export interface CataloguePageContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    bgImage: string;
  };
}

export const DEFAULT_CATALOGUE_PAGE_CONTENT: CataloguePageContent = {
  hero: {
    eyebrow: "Catalogue",
    title: "Engineered Geosynthetic Materials",
    description: "Search and filter our full catalogue of engineered geosynthetic products.",
    bgImage: "https://geosynthetics-africa.vercel.app/api/storage/media-center/Kalanga-road-geocell-slope-stabilisation-geosynthetics-africa_7a7c9eae-ca52-4fb5-901c-a5763210b3ed.webp",
  },
};
