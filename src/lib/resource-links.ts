export interface ResourceLink {
  label: string;
  url: string;
}

export const isPdfResource = (url: string) => /\.pdf(?:[?#]|$)/i.test(url);

/** Resource hubs are navigation, not individual downloadable documents. */
export function prepareResourceLinks(items: ResourceLink[]): ResourceLink[] {
  const seen = new Set<string>();
  return items
    .filter((item) => {
      if (!item.url?.trim()) return false;
      const key = item.url
        .trim()
        .replace(/^https?:\/\/(?:www\.)?geosyntheticsafrica\.com/i, "")
        .replace(/\/$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => {
      const path = item.url
        .replace(/^https?:\/\/(?:www\.)?geosyntheticsafrica\.com/i, "")
        .split(/[?#]/)[0]
        .replace(/\/$/, "");
      const hubNames: Record<string, string> = {
        "/resources": "Technical resource library",
        "/resources/datasheets": "Published product datasheets",
        "/resources/installation-guides": "Installation guides and manuals",
        "/resources/case-studies": "Project case studies",
        "/resources/brochures": "Product and service brochures",
        "/quality-assurance": "Quality assurance and inspection procedures",
      };
      return { ...item, label: hubNames[path] || item.label };
    });
}
