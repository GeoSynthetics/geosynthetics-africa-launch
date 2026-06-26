import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type SectionKey = "products" | "applications" | "services" | "industries";

interface LinkTargetPickerProps {
  to: string;
  params?: Record<string, string>;
  onChange: (to: string, params?: Record<string, string>) => void;
  /** Controls which template group is shown first and highlighted */
  sectionContext?: SectionKey;
  /** Compact mode hides the label */
  compact?: boolean;
}

// Well-known static pages in the application
const STATIC_PAGES = [
  { label: "Products", to: "/products", params: undefined },
  { label: "Applications", to: "/applications", params: undefined },
  { label: "Services", to: "/services", params: undefined },
  { label: "Projects", to: "/projects", params: undefined },
  { label: "Quality Assurance", to: "/quality-assurance", params: undefined },
  { label: "Catalogue", to: "/catalogue", params: undefined },
  { label: "Resources", to: "/resources", params: undefined },
  { label: "Contacts", to: "/contacts", params: undefined },
  { label: "About", to: "/about", params: undefined },
] as const;

const TEMPLATE_CONFIG_KEYS: Record<SectionKey, string> = {
  products: "template_product_categories",
  applications: "template_applications",
  services: "template_services",
  industries: "template_industries",
};

interface TemplateEntry {
  slug: string;
  label: string;
  section: SectionKey;
}

// Module-level cache so templates are fetched only once per session
let cachedTemplates: TemplateEntry[] | null = null;

async function loadAllTemplates(): Promise<TemplateEntry[]> {
  if (cachedTemplates) return cachedTemplates;

  const keys = Object.values(TEMPLATE_CONFIG_KEYS);
  const { data } = await supabase.from("site_config").select("key, value").in("key", keys);

  const entries: TemplateEntry[] = [];
  if (data) {
    for (const row of data) {
      const sectionKey = (Object.entries(TEMPLATE_CONFIG_KEYS).find(
        ([, v]) => v === row.key,
      )?.[0] ?? "products") as SectionKey;

      const templates = row.value as Record<string, any> | null;
      if (templates) {
        for (const [slug, tmpl] of Object.entries(templates)) {
          entries.push({
            slug,
            label: (tmpl as any).label || (tmpl as any).title || slug,
            section: sectionKey,
          });
        }
      }
    }
  }

  cachedTemplates = entries;
  return entries;
}

/**
 * Resolves a template selection to the correct route `to` and `params` based on section.
 *
 * Products use `/products/$category/$family`, all other sections use `/$slug`.
 */
function resolveTemplateLink(
  slug: string,
  section: SectionKey,
): { to: string; params: Record<string, string> } {
  if (section === "products") {
    return { to: "/products/$category/$family", params: { category: slug, family: slug } };
  }
  return { to: "/$slug", params: { slug } };
}

/**
 * A reusable picker that lets admins set a link target by either:
 *  1. Typing a URL manually
 *  2. Selecting a known static page
 *  3. Selecting an existing page template
 */
export function LinkTargetPicker({
  to,
  params,
  onChange,
  sectionContext,
  compact,
}: LinkTargetPickerProps) {
  const [templates, setTemplates] = useState<TemplateEntry[]>([]);

  useEffect(() => {
    loadAllTemplates().then(setTemplates);
  }, []);

  const handleSelectTarget = (encodedValue: string) => {
    const [kind, ...rest] = encodedValue.split(":");
    const identifier = rest.join(":");

    if (kind === "page") {
      const page = STATIC_PAGES.find((p) => p.to === identifier);
      if (page) onChange(page.to, undefined);
    } else if (kind === "template") {
      const [section, slug] = identifier.split("/") as [SectionKey, string];
      const resolved = resolveTemplateLink(slug, section);
      onChange(resolved.to, resolved.params);
    }
  };

  // Build a readable display of the current link
  const displayPath = params
    ? Object.entries(params).reduce((path, [key, value]) => path.replace(`$${key}`, value), to)
    : to;

  // Group templates by section, prioritizing the current context
  const sortedSections = Object.keys(TEMPLATE_CONFIG_KEYS) as SectionKey[];
  if (sectionContext) {
    const idx = sortedSections.indexOf(sectionContext);
    if (idx > 0) {
      sortedSections.splice(idx, 1);
      sortedSections.unshift(sectionContext);
    }
  }

  return (
    <div className="space-y-1.5">
      {!compact && (
        <label className="text-xs font-bold uppercase text-muted-foreground block">Link Path</label>
      )}

      <Input
        value={displayPath}
        onChange={(e) => onChange(e.target.value, undefined)}
        placeholder="/path-to-page"
        className="text-sm h-8"
      />

      <Select onValueChange={handleSelectTarget}>
        <SelectTrigger className="w-full text-xs h-7 bg-card border-border/60 hover:border-primary/40">
          <SelectValue placeholder="Or pick a page / template…" />
        </SelectTrigger>
        <SelectContent className="bg-card border border-border max-h-[320px]">
          <SelectGroup>
            <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Static Pages
            </SelectLabel>
            {STATIC_PAGES.map((p) => (
              <SelectItem key={p.to} value={`page:${p.to}`} className="text-xs">
                {p.label}
              </SelectItem>
            ))}
          </SelectGroup>

          {sortedSections.map((sKey) => {
            const sectionTemplates = templates.filter((t) => t.section === sKey);
            if (sectionTemplates.length === 0) return null;
            return (
              <SelectGroup key={sKey}>
                <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-primary capitalize">
                  {sKey} Templates
                </SelectLabel>
                {sectionTemplates.map((t) => (
                  <SelectItem
                    key={`${sKey}-${t.slug}`}
                    value={`template:${sKey}/${t.slug}`}
                    className="text-xs"
                  >
                    {t.label} ({t.slug})
                  </SelectItem>
                ))}
              </SelectGroup>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
