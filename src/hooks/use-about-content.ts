import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ABOUT_PAGE_CONTENT, type AboutPageContent } from "@/types/about";

const SUPABASE_KEY = "about_page_content";

let _cache: AboutPageContent | null = null;
let _fetchPromise: Promise<AboutPageContent> | null = null;

const _listeners = new Set<() => void>();

function mergeWithDefaults(partial: Partial<AboutPageContent>): AboutPageContent {
  return {
    hero: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.hero,
      ...(partial.hero || {}),
    },
    accountability: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.accountability,
      ...(partial.accountability || {}),
      cards: partial.accountability?.cards ?? DEFAULT_ABOUT_PAGE_CONTENT.accountability.cards,
    },
    execution: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.execution,
      ...(partial.execution || {}),
      capabilities:
        partial.execution?.capabilities ?? DEFAULT_ABOUT_PAGE_CONTENT.execution.capabilities,
    },
    partners: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.partners,
      ...(partial.partners || {}),
      partnerNames:
        partial.partners?.partnerNames ?? DEFAULT_ABOUT_PAGE_CONTENT.partners.partnerNames,
    },
    faqs: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.faqs,
      ...(partial.faqs || {}),
      items: partial.faqs?.items ?? DEFAULT_ABOUT_PAGE_CONTENT.faqs.items,
    },
    trademark: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.trademark,
      ...(partial.trademark || {}),
    },
    contact: {
      ...DEFAULT_ABOUT_PAGE_CONTENT.contact,
      ...(partial.contact || {}),
    },
  };
}

export function fetchAboutContent(): Promise<AboutPageContent> {
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
        console.error("Failed to load about content:", error.message);
        if (!isServer) {
          _cache = DEFAULT_ABOUT_PAGE_CONTENT;
        }
        return DEFAULT_ABOUT_PAGE_CONTENT;
      }

      const value = data?.value as Partial<AboutPageContent> | null;
      const merged = value ? mergeWithDefaults(value) : DEFAULT_ABOUT_PAGE_CONTENT;
      if (!isServer) {
        _cache = merged;
      }
      return merged;
    } catch (err) {
      console.error("Error fetching about content:", err);
      if (!isServer) {
        _cache = DEFAULT_ABOUT_PAGE_CONTENT;
      }
      return DEFAULT_ABOUT_PAGE_CONTENT;
    }
  })();

  if (!isServer) {
    _fetchPromise = fetchPromise;
  }

  return fetchPromise;
}

export function invalidateAboutCache() {
  _cache = null;
  _fetchPromise = null;
}

export function updateAboutCache(content: AboutPageContent) {
  _cache = content;
  _fetchPromise = null;
  _listeners.forEach((fn) => fn());
}

export function useAboutContent(): AboutPageContent {
  const [content, setContent] = useState<AboutPageContent>(_cache ?? DEFAULT_ABOUT_PAGE_CONTENT);

  useEffect(() => {
    let isMounted = true;

    fetchAboutContent().then((loaded) => {
      if (isMounted) {
        setContent(loaded);
      }
    });

    const listener = () => {
      if (isMounted && _cache) {
        setContent(_cache);
      }
    };
    _listeners.add(listener);

    return () => {
      isMounted = false;
      _listeners.delete(listener);
    };
  }, []);

  return content;
}
