import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_COMPANY_PAGE_TEMPLATES,
  type CompanyPageTemplate,
} from "@/types/company-page-template";

const SUPABASE_KEY = "template_company_pages";

let _cache: Record<string, CompanyPageTemplate> | null = null;
let _fetchPromise: Promise<Record<string, CompanyPageTemplate>> | null = null;
const _listeners = new Set<() => void>();

export function mergeCompanyTemplatesWithDefaults(
  remote: Record<string, Partial<CompanyPageTemplate>>,
): Record<string, CompanyPageTemplate> {
  const merged: Record<string, CompanyPageTemplate> = { ...DEFAULT_COMPANY_PAGE_TEMPLATES };

  for (const [key, val] of Object.entries(remote)) {
    if (!val) continue;
    const base = merged[key] || DEFAULT_COMPANY_PAGE_TEMPLATES[val.slug || key] || {};
    merged[key] = {
      ...base,
      ...val,
      sections: val.sections !== undefined ? val.sections : base.sections || [],
      seo: {
        ...(base.seo || { title: "", description: "", keywords: "" }),
        ...(val.seo || {}),
      },
    } as CompanyPageTemplate;
  }

  return merged;
}

export async function fetchCompanyPageTemplates(): Promise<Record<string, CompanyPageTemplate>> {
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
        console.error("Failed to load company page templates:", error.message);
        if (!isServer) _cache = DEFAULT_COMPANY_PAGE_TEMPLATES;
        return DEFAULT_COMPANY_PAGE_TEMPLATES;
      }

      let parsed: Record<string, any> = {};
      if (data?.value) {
        parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
      }

      const merged =
        parsed && typeof parsed === "object" && Object.keys(parsed).length > 0
          ? mergeCompanyTemplatesWithDefaults(parsed)
          : DEFAULT_COMPANY_PAGE_TEMPLATES;

      if (!isServer) {
        _cache = merged;
      }
      return merged;
    } catch (err) {
      console.error("Error fetching company page templates:", err);
      if (!isServer) _cache = DEFAULT_COMPANY_PAGE_TEMPLATES;
      return DEFAULT_COMPANY_PAGE_TEMPLATES;
    }
  })();

  if (!isServer) {
    _fetchPromise = fetchPromise;
  }

  return fetchPromise;
}

export function invalidateCompanyPageTemplatesCache() {
  _cache = null;
  _fetchPromise = null;
  _listeners.forEach((fn) => fn());
}

export function updateCompanyPageTemplatesCache(data: Record<string, CompanyPageTemplate>) {
  _cache = data;
  _fetchPromise = null;
  _listeners.forEach((fn) => fn());
}

export function useCompanyPageTemplate(
  slug: string,
  initialTemplate?: CompanyPageTemplate | null,
): { template: CompanyPageTemplate | null; loading: boolean } {
  const [template, setTemplate] = useState<CompanyPageTemplate | null>(
    initialTemplate || DEFAULT_COMPANY_PAGE_TEMPLATES[slug] || null,
  );
  const [loading, setLoading] = useState(!template);

  useEffect(() => {
    let isMounted = true;

    fetchCompanyPageTemplates().then((map) => {
      if (isMounted) {
        const found =
          map[slug] ||
          Object.values(map).find((t) => t.slug === slug) ||
          DEFAULT_COMPANY_PAGE_TEMPLATES[slug] ||
          null;
        if (found) setTemplate(found);
        setLoading(false);
      }
    });

    const listener = () => {
      if (isMounted && _cache) {
        const found =
          _cache[slug] ||
          Object.values(_cache).find((t) => t.slug === slug) ||
          null;
        if (found) setTemplate(found);
      }
    };
    _listeners.add(listener);

    return () => {
      isMounted = false;
      _listeners.delete(listener);
    };
  }, [slug]);

  return { template: template || initialTemplate || null, loading };
}
