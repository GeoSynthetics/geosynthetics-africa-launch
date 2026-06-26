import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely splits a string, array of strings, or undefined value by double newlines,
 * trims each resulting paragraph, filters empty ones, and returns a clean array of paragraphs.
 */
export function splitIntoParagraphs(text: string | string[] | undefined | null): string[] {
  if (!text) return [];
  const items = Array.isArray(text) ? text : [text];
  return items
    .flatMap((item) => (item || "").split(/\r?\n\r?\n/))
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Safely converts a string to a clean URL-friendly slug.
 */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formats a slug in real-time as the user types, preserving trailing hyphens
 * but lowercasing, converting spaces to hyphens, and removing other invalid characters.
 */
export function formatSlugInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-");
}
