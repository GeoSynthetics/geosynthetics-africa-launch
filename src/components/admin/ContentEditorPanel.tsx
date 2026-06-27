import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import type { HierarchyItem, HierarchyChild, PageContent } from "@/types/hierarchy";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ListEditor,
  FAQEditor,
  PropertiesTableEditor,
  PairsEditor,
  SectionsEditor,
} from "./TemplateEditorShared";
import { IconPicker } from "./IconPicker";
import { ImagePicker } from "./ImagePicker";
import { useSlugSync } from "@/hooks/use-slug-sync";

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateSpec(spec: string | null | undefined): string {
  if (!spec) return "";
  return spec.slice(0, 62);
}

type SectionKey = "products" | "applications" | "services" | "industries";
type EditableNode = HierarchyItem | HierarchyChild;

interface ContentEditorPanelProps {
  node: EditableNode;
  isChild?: boolean;
  sectionKey: SectionKey;
  onSave: (updated: EditableNode) => void;
  saving?: boolean;
}

// Maps a section to the Supabase config key that holds its page templates
const TEMPLATE_KEY: Record<SectionKey, string> = {
  products: "template_product_categories",
  applications: "template_applications",
  services: "template_services",
  industries: "template_industries",
};

// Route path each section uses
function sectionRoute(key: SectionKey, isChild: boolean): string {
  if (key === "products") return isChild ? "/products/$category/$family" : "/products/$category";
  return "/$slug";
}

// Param key each section uses
function sectionParamKey(key: SectionKey): string {
  return key === "products" ? "category" : "slug";
}

// ─── PageTemplatesRedirectCard ────────────────────────────────────────────────
// Reusable "go to page templates" redirect card used in the Page Content tab.

function PageTemplatesRedirectCard({
  title,
  description,
  href,
}: {
  title: string;
  description: React.ReactNode;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-border rounded-xl bg-surface/50 h-[80%] my-auto max-w-md mx-auto space-y-5">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-bold uppercase text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="pt-2 w-full">
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider text-xs py-2 gap-2 shadow-lg shadow-primary/20"
        >
          <a href={href}>Edit in Page Templates →</a>
        </Button>
      </div>
    </div>
  );
}

export function ContentEditorPanel({
  node,
  isChild,
  sectionKey,
  onSave,
  saving,
}: ContentEditorPanelProps) {
  const [data, setData] = useState<EditableNode>(node);

  // Sync state if node changes in parent
  useEffect(() => {
    setData(node);
  }, [node]);

  const { handleSlugChange, handleSlugBlur } = useSlugSync({
    title: data.label,
    slug: data.slug,
    onSlugChange: (newSlug) =>
      setData((p) => {
        const updated: any = {
          ...p,
          slug: newSlug,
        };
        if (p.params) {
          const paramKey = sectionParamKey(sectionKey);
          if (sectionKey === "products" && isChild && p.params.category) {
            updated.params = {
              ...p.params,
              family: newSlug,
            };
          } else {
            updated.params = {
              ...p.params,
              [paramKey]: newSlug,
            };
          }
        }
        return updated;
      }),
    entityId: node.id,
  });

  const [templates, setTemplates] = useState<Record<string, any>>({});
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    async function loadTemplates() {
      setLoadingTemplates(true);
      const { data: dbData } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", TEMPLATE_KEY[sectionKey])
        .maybeSingle();
      if (dbData?.value) {
        setTemplates(dbData.value as Record<string, any>);
      } else {
        setTemplates({});
      }
      setLoadingTemplates(false);
    }
    loadTemplates();
  }, [sectionKey]);

  const handleSelectTemplate = (templateSlug: string) => {
    const t = templates[templateSlug];
    if (!t) return;

    setData((prev) => {
      const updated: any = {
        ...prev,
        label: t.label ?? t.title ?? prev.label,
        slug: templateSlug,
      };

      const route = sectionRoute(sectionKey, !!isChild);
      const paramKey = sectionParamKey(sectionKey);
      updated.to = route;
      updated.params = { ...(prev.params || {}), [paramKey]: templateSlug };
      // Products with children need both category + family params
      if (sectionKey === "products" && isChild && prev.params?.category) {
        updated.params = { category: prev.params.category, family: templateSlug };
      }
      return updated;
    });

    toast.success(`Auto-filled from "${t.label || t.title || templateSlug}" template!`);
  };

  const page: PageContent = (data as any).pageContent ?? {};

  const isProductNode = sectionKey === "products";
  const isNonProductNode = !isProductNode;

  const setPage = (p: Partial<PageContent>) =>
    setData((prev) => ({ ...prev, pageContent: { ...(prev as any).pageContent, ...p } }));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div>
          <h3 className="font-display font-bold uppercase tracking-tight text-lg">{data.label}</h3>
          <p className="text-xs text-muted-foreground">{data.slug}</p>
        </div>
        <Button
          onClick={() => onSave(data)}
          disabled={saving}
          className="bg-primary hover:bg-primary-hover text-white"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Tabs defaultValue="identity" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-6 pt-3 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-1">
          {["identity", "page"]
            .filter((t) => {
              if (t === "page" && isChild && isProductNode) return false;
              return true;
            })
            .map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 text-xs uppercase tracking-wider font-bold capitalize"
              >
                {t === "identity" ? "Identity" : "Page Content"}
              </TabsTrigger>
            ))}
        </TabsList>

        {/* ── Identity ── */}
        <TabsContent value="identity" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
          {isChild && isProductNode && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-2 shadow-sm animate-pulse">
              <span className="text-primary text-base select-none mt-0.5">💡</span>
              <div className="space-y-1">
                <div className="font-bold text-foreground uppercase tracking-wider">
                  Unified Product Content
                </div>
                <div className="text-muted-foreground leading-relaxed">
                  The page template and rich features for <strong>{data.label}</strong> are edited
                  under <strong>Page Templates</strong>.
                  <a
                    href={`/admin/page-templates?slug=${data.slug}`}
                    className="text-primary hover:underline ml-1 font-bold inline-flex items-center gap-0.5"
                  >
                    Edit content →
                  </a>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
              Label
            </label>
            <Input
              value={data.label}
              onChange={(e) => setData((p) => ({ ...p, label: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
              Slug
            </label>
            <Input
              value={data.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              onBlur={handleSlugBlur}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
              Icon
            </label>
            <IconPicker
              value={data.icon ?? ""}
              onChange={(v) => setData((p) => ({ ...p, icon: v }))}
              placeholder="Select icon..."
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
              Link Path
            </label>
            <Input
              value={data.to}
              onChange={(e) => setData((p) => ({ ...p, to: e.target.value }))}
              placeholder="/products/$category"
            />
          </div>

          {/* Autocomplete template page picker */}
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-3.5 space-y-2 mt-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                ⚡ Auto-fill from Page Template
              </label>
              {loadingTemplates && (
                <span className="text-[10px] text-muted-foreground animate-pulse">Loading...</span>
              )}
            </div>

            <Select onValueChange={handleSelectTemplate}>
              <SelectTrigger className="w-full text-xs h-8 bg-card border-primary/20 hover:border-primary/40 focus:ring-1 focus:ring-primary">
                <SelectValue placeholder="Choose a page template..." />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border">
                {Object.keys(templates).length > 0 ? (
                  Object.entries(templates).map(([slug, t]: [string, any]) => (
                    <SelectItem key={slug} value={slug} className="text-xs">
                      {t.label || t.title || slug} ({slug})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-xs text-muted-foreground italic">No templates found</div>
                )}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Selecting a page template will automatically configure the Label, Slug, and Path
              parameters to ensure a perfect 100% matched link.
            </p>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">SEO</h4>
            <Input
              value={page.seo?.title ?? ""}
              onChange={(e) =>
                setPage({
                  seo: {
                    ...page.seo,
                    title: e.target.value,
                    description: page.seo?.description ?? "",
                    keywords: page.seo?.keywords ?? "",
                  },
                })
              }
              placeholder="SEO Title"
            />
            <Textarea
              value={page.seo?.description ?? ""}
              onChange={(e) =>
                setPage({
                  seo: {
                    title: page.seo?.title ?? "",
                    ...page.seo,
                    description: e.target.value,
                    keywords: page.seo?.keywords ?? "",
                  },
                })
              }
              placeholder="SEO Description"
              className="min-h-[60px]"
            />
            <Input
              value={page.seo?.keywords ?? ""}
              onChange={(e) =>
                setPage({
                  seo: {
                    title: page.seo?.title ?? "",
                    description: page.seo?.description ?? "",
                    keywords: e.target.value,
                  },
                })
              }
              placeholder="SEO Keywords (comma separated)"
            />
          </div>
        </TabsContent>

        {/* ── Page Content ── */}
        <TabsContent value="page" className="flex-1 overflow-y-auto p-6 m-0">
          {/* Non-product sections: direct admin to the dedicated Page Templates editors */}
          {isNonProductNode ? (
            <PageTemplatesRedirectCard
              title="Page Templates Editor"
              description={
                <>
                  Rich page content for <strong>{data.label}</strong> is managed in the dedicated{" "}
                  <strong className="capitalize">{sectionKey} Page Templates</strong> builder where
                  you can edit
                  {sectionKey === "applications" && " hero, sub-systems, and SEO."}
                  {sectionKey === "services" && " hero, service features, and SEO."}
                  {sectionKey === "industries" && " hero, challenges, key applications, and SEO."}
                </>
              }
              href="/admin/page-templates"
            />
          ) : isChild && isProductNode ? (
            <PageTemplatesRedirectCard
              title="Page Templates Integration"
              description={
                <>
                  This is a product category/family page. Its content is managed inside the
                  centralized <strong>Page Templates</strong> builder.
                </>
              }
              href={`/admin/page-templates?slug=${data.slug}`}
            />
          ) : (
            <div className="space-y-8">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Hero</h4>
                <ImagePicker
                  label="Hero Image"
                  hint="Full URL or Supabase storage path to the hero image"
                  value={page.heroImage ?? ""}
                  onChange={(v) => setPage({ heroImage: v })}
                  placeholder="Hero image URL"
                />
                <Textarea
                  value={page.subtitle ?? ""}
                  onChange={(e) => setPage({ subtitle: e.target.value })}
                  placeholder="Subtitle / tagline"
                  className="min-h-[80px]"
                />
              </div>

              <ListEditor
                label="Description Paragraphs"
                items={page.description ?? []}
                onChange={(v) => setPage({ description: v })}
                multiline
                placeholder="Paragraph text..."
              />
              <ListEditor
                label="Key Features / Benefits (bullet list)"
                items={page.features ?? []}
                onChange={(v) => setPage({ features: v })}
                placeholder="e.g. High UV resistance"
              />

              <PairsEditor
                label="Technical Highlights (label + value)"
                items={(page.technicalHighlights ?? []) as any[]}
                fields={[
                  { key: "label", label: "Label" },
                  { key: "value", label: "Value" },
                ]}
                onChange={(v) => setPage({ technicalHighlights: v as any })}
              />

              <PropertiesTableEditor
                table={
                  page.propertiesTable ?? {
                    headers: ["Property", "Test Method", "Value"],
                    rows: [],
                  }
                }
                onChange={(v) => setPage({ propertiesTable: v })}
              />

              <PairsEditor
                label="Types"
                items={(page.types ?? []) as any[]}
                fields={[
                  { key: "name", label: "Name" },
                  { key: "description", label: "Description", multiline: true },
                ]}
                onChange={(v) => setPage({ types: v as any })}
              />

              <PairsEditor
                label="Benefits"
                items={(page.benefits ?? []) as any[]}
                fields={[
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", multiline: true },
                ]}
                onChange={(v) => setPage({ benefits: v as any })}
              />

              <FAQEditor faqs={page.faqs ?? []} onChange={(v) => setPage({ faqs: v })} />

              <ListEditor
                label="Installation Specs"
                items={page.installationSpecs ?? []}
                onChange={(v) => setPage({ installationSpecs: v })}
                multiline
                placeholder="Spec details..."
              />

              <PairsEditor
                label="Project References"
                items={(page.projectReferences ?? []) as any[]}
                fields={[
                  { key: "project_slug", label: "Link to Case Study", type: "project" },
                  { key: "name", label: "Project Name" },
                  { key: "location", label: "Location" },
                  { key: "year", label: "Year" },
                  { key: "image", label: "Image URL", type: "image" },
                ]}
                onChange={(v) => setPage({ projectReferences: v as any })}
              />

              <div className="border-t border-border pt-6">
                <PairsEditor
                  label="Popular Products (shown in catalogue preview)"
                  items={(page.popularProducts ?? []) as any[]}
                  fields={[
                    { key: "slug", label: "Select Product", type: "product" },
                    { key: "name", label: "Product Name", placeholder: "e.g. GSE HDPE Smooth" },
                    {
                      key: "spec",
                      label: "Specification Range",
                      placeholder: "e.g. 1.0mm – 3.0mm",
                    },
                    {
                      key: "desc",
                      label: "Short Description",
                      placeholder: "One line description…",
                      multiline: true,
                    },
                    { key: "image", label: "Image URL", placeholder: "https://…", type: "image" },
                  ]}
                  onChange={(v) => setPage({ popularProducts: v as any })}
                  newItem={{ slug: "", name: "", spec: "", desc: "", image: "" } as any}
                />
              </div>

              <div className="border-t border-border pt-6">
                <SectionsEditor
                  sections={page.sections || []}
                  onChange={(v) => setPage({ sections: v })}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
