import { useState, useEffect } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_FOOTER_CONTENT, type FooterContent } from "@/types/footer";

const SUPABASE_KEY = "footer_content";

let _cache: FooterContent | null = null;
let _fetchPromise: Promise<FooterContent> | null = null;

// Subscriber set to notify consuming components of live updates after admin save
const _listeners = new Set<() => void>();

/** Merges partial DB data with defaults to ensure every field is populated */
function mergeWithDefaults(partial: Partial<FooterContent>): FooterContent {
  return {
    brandDescription: partial.brandDescription ?? DEFAULT_FOOTER_CONTENT.brandDescription,
    address: partial.address ?? DEFAULT_FOOTER_CONTENT.address,
    socialLinks: partial.socialLinks ?? DEFAULT_FOOTER_CONTENT.socialLinks,
    certifications: partial.certifications ?? DEFAULT_FOOTER_CONTENT.certifications,
    copyrightText: partial.copyrightText ?? DEFAULT_FOOTER_CONTENT.copyrightText,
    columns: partial.columns ?? DEFAULT_FOOTER_CONTENT.columns,
  };
}

export function fetchFooterContent(): Promise<FooterContent> {
  const isServer = typeof window === "undefined";
  if (!isServer && _cache) return Promise.resolve(_cache);
  if (!isServer && _fetchPromise) return _fetchPromise;

  const fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", SUPABASE_KEY)
        .maybeSingle();

      if (error) {
        console.error("Failed to load footer content:", error.message);
        if (!isServer) {
          _cache = DEFAULT_FOOTER_CONTENT;
        }
        return DEFAULT_FOOTER_CONTENT;
      }

      const value = data?.value as Partial<FooterContent> | null;
      const merged = value ? mergeWithDefaults(value) : DEFAULT_FOOTER_CONTENT;
      if (!isServer) {
        _cache = merged;
      }
      return merged;
    } catch (err) {
      console.error("Error fetching footer content:", err);
      if (!isServer) {
        _cache = DEFAULT_FOOTER_CONTENT;
      }
      return DEFAULT_FOOTER_CONTENT;
    }
  })();

  if (!isServer) {
    _fetchPromise = fetchPromise;
  }

  return fetchPromise;
}

export function invalidateFooterCache() {
  _cache = null;
  _fetchPromise = null;
}

/**
 * Pushes fresh content into the module cache and notifies all
 * mounted `useFooterContent` consumers so they re-render immediately.
 */
export function updateFooterCache(content: FooterContent) {
  _cache = content;
  _fetchPromise = null;
  _listeners.forEach((fn) => fn());
}

export function useFooterContent(): FooterContent {
  const rootData = useLoaderData({ from: "__root__" }) as
    | { footerContent: FooterContent }
    | undefined;

  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    _listeners.add(listener);
    return () => {
      _listeners.delete(listener);
    };
  }, []);

  // Prefer live cache (set after admin save) over stale root loader data
  return _cache ?? rootData?.footerContent ?? DEFAULT_FOOTER_CONTENT;
}
