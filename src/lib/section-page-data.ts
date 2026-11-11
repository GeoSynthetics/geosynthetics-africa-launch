import { supabase } from "@/integrations/supabase/client";
import type { Hierarchies, SectionKey } from "@/lib/section-paths";

export type SectionPageConfig = { templates: Record<string, any>; hierarchy: any };

/** One shared read for the selected section, matching its menu prefetch. */
export async function fetchSectionPageConfig(section: SectionKey): Promise<SectionPageConfig> {
  const { data, error } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", [`template_${section}`, `hierarchy_${section}`]);
  if (error) throw error;
  return {
    templates:
      (data?.find((row) => row.key === `template_${section}`)?.value as Record<string, any>) || {},
    hierarchy: data?.find((row) => row.key === `hierarchy_${section}`)?.value || {},
  };
}

/** Use the same content for canonical redirects, rather than querying it again. */
export function sectionConfigHierarchies(
  section: SectionKey,
  config: SectionPageConfig,
): Hierarchies {
  const result: Hierarchies = {
    applications: [],
    services: [],
    industries: [],
    templates: {
      applications: new Set(),
      services: new Set(),
      industries: new Set(),
    },
  };
  result[section] = Array.isArray(config.hierarchy?.items) ? config.hierarchy.items : [];
  result.templates[section] = new Set(
    Object.keys(config.templates).filter((key) => key !== "__landing"),
  );
  return result;
}
