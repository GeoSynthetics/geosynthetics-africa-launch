import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_COUNTRY_TEMPLATES,
  type CountryTemplate,
} from "@/types/country-template";

const SUPABASE_KEY = "template_countries";

let _cache: Record<string, CountryTemplate> | null = null;
let _fetchPromise: Promise<Record<string, CountryTemplate>> | null = null;
const _listeners = new Set<() => void>();

export function mergeCountryTemplatesWithDefaults(
  remote: Record<string, Partial<CountryTemplate>>,
): Record<string, CountryTemplate> {
  const merged: Record<string, CountryTemplate> = { ...DEFAULT_COUNTRY_TEMPLATES };

  for (const [key, val] of Object.entries(remote)) {
    if (!val) continue;
    const base = merged[key] || DEFAULT_COUNTRY_TEMPLATES[val.slug || key] || {};
    merged[key] = {
      ...base,
      ...val,
      featuredProductIds:
        val.featuredProductIds !== undefined
          ? val.featuredProductIds
          : base.featuredProductIds || [],
      faqs: val.faqs !== undefined ? val.faqs : base.faqs || [],
      seo: {
        ...(base.seo || { title: "", description: "", keywords: "" }),
        ...(val.seo || {}),
      },
    } as CountryTemplate;
  }

  return merged;
}

export async function fetchCountryTemplates(): Promise<Record<string, CountryTemplate>> {
  const isServer = typeof window === "undefined";
  if (!isServer && _cache) return _cache;
  if (!isServer && _fetchPromise) return _fetchPromise;

  const fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", SUPABASE_KEY)
        .maybeSingle();

      if (error) {
        console.error("Failed to load country templates:", error.message);
        if (!isServer) _cache = DEFAULT_COUNTRY_TEMPLATES;
        return DEFAULT_COUNTRY_TEMPLATES;
      }

      let parsed: Record<string, any> = {};
      if (data?.value) {
        parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      }

      const merged =
        parsed && typeof parsed === "object"
          ? mergeCountryTemplatesWithDefaults(parsed)
          : DEFAULT_COUNTRY_TEMPLATES;

      if (!isServer) {
        _cache = merged;
      }
      return merged;
    } catch (err) {
      console.error("Error fetching country templates:", err);
      if (!isServer) _cache = DEFAULT_COUNTRY_TEMPLATES;
      return DEFAULT_COUNTRY_TEMPLATES;
    }
  })();

  if (!isServer) {
    _fetchPromise = fetchPromise;
  }

  return fetchPromise;
}

export function invalidateCountryTemplatesCache() {
  _cache = null;
  _fetchPromise = null;
  _listeners.forEach((fn) => fn());
}

export function updateCountryTemplatesCache(data: Record<string, CountryTemplate>) {
  _cache = data;
  _fetchPromise = null;
  _listeners.forEach((fn) => fn());
}

export function useCountryTemplate(
  initialTemplate?: CountryTemplate | null,
  slug?: string,
): CountryTemplate | null {
  const [template, setTemplate] = useState<CountryTemplate | null>(
    initialTemplate || null,
  );

  useEffect(() => {
    let isMounted = true;

    const findTemplateInMap = (map: Record<string, CountryTemplate>) => {
      const targetSlug = slug || initialTemplate?.slug;
      if (!targetSlug) return null;
      if (map[targetSlug]) return map[targetSlug];
      return (
        Object.values(map).find(
          (t) =>
            t.slug === targetSlug ||
            (initialTemplate?.country &&
              t.country.toLowerCase() === initialTemplate.country.toLowerCase()),
        ) || null
      );
    };

    fetchCountryTemplates().then((map) => {
      if (isMounted) {
        const found = findTemplateInMap(map);
        if (found) setTemplate(found);
      }
    });

    const listener = () => {
      if (isMounted && _cache) {
        const found = findTemplateInMap(_cache);
        if (found) setTemplate(found);
      }
    };
    _listeners.add(listener);

    return () => {
      isMounted = false;
      _listeners.delete(listener);
    };
  }, [slug, initialTemplate?.slug, initialTemplate?.country]);

  return template || initialTemplate || null;
}
