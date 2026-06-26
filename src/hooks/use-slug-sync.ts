import { useState, useEffect } from "react";
import { slugify, formatSlugInput } from "@/lib/utils";

interface UseSlugSyncProps {
  title: string;
  slug: string;
  onSlugChange: (newSlug: string) => void;
  entityId?: string;
}

/**
 * Custom React hook to sync and format a slug field from a title/label field.
 * Handles auto-syncing, manual overrides, real-time typing formatting, and blur cleanup.
 */
export function useSlugSync({ title, slug, onSlugChange, entityId }: UseSlugSyncProps) {
  const [isManual, setIsManual] = useState(false);

  // When switching entities or loading a new record, determine if slug was manual
  useEffect(() => {
    if (slug && title) {
      setIsManual(slug !== slugify(title));
    } else {
      setIsManual(false);
    }
  }, [entityId]);

  // Sync slug with title/label changes if not in manual mode
  useEffect(() => {
    if (!isManual) {
      const generated = slugify(title);
      if (generated !== slug) {
        onSlugChange(generated);
      }
    }
  }, [title, isManual, slug, onSlugChange]);

  const handleSlugChange = (val: string) => {
    const formatted = formatSlugInput(val);
    if (!formatted) {
      setIsManual(false);
    } else {
      setIsManual(true);
    }
    onSlugChange(formatted);
  };

  const handleSlugBlur = () => {
    onSlugChange(slugify(slug));
  };

  return {
    isManual,
    setIsManual,
    handleSlugChange,
    handleSlugBlur,
  };
}
