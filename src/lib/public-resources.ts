import { supabase } from "@/integrations/supabase/client";
import {
  RESOURCE_CATEGORIES,
  VIDEO_HOST_RE,
  type ResourceCategory,
} from "@/lib/resource-categories";

export interface PublicResource {
  id: string;
  slug: string;
  title: string;
  type: string;
  description: string | null;
  file_path: string | null;
  external_url: string | null;
  is_public: boolean;
  created_at: string;
}

const RESOURCE_FIELDS =
  "id, slug, title, type, description, file_path, external_url, is_public, created_at";

export function resourceMatchesCategory(row: PublicResource, category: ResourceCategory): boolean {
  return category.videoOnly
    ? !!row.external_url && VIDEO_HOST_RE.test(row.external_url)
    : category.types.includes(row.type);
}

/** Public catalogue metadata only; the existing RLS policies still control access. */
export async function fetchPublishedResources(): Promise<PublicResource[]> {
  const { data, error } = await supabase
    .from("resources")
    .select(RESOURCE_FIELDS)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as PublicResource[];
}

export async function fetchPublishedResource(slug: string): Promise<PublicResource | null> {
  const { data, error } = await supabase
    .from("resources")
    .select(RESOURCE_FIELDS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data as PublicResource | null;
}

export function resourceCategoryFor(row: PublicResource): ResourceCategory | undefined {
  // Video URLs have one canonical detail page, even if their type also matches another category.
  return (
    RESOURCE_CATEGORIES.find((cat) => cat.videoOnly && resourceMatchesCategory(row, cat)) ??
    RESOURCE_CATEGORIES.find((cat) => resourceMatchesCategory(row, cat))
  );
}

export function resourceDownloadPath(slug: string): string {
  return `/api/resources/${encodeURIComponent(slug)}/download`;
}
