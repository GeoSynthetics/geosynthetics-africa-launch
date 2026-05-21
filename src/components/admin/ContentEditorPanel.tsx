import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import type { HierarchyItem, HierarchyChild, PageContent, MegaContent } from "@/types/hierarchy";
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
  ListEditor, FAQEditor, PropertiesTableEditor, PairsEditor, QuickActionsEditor,
} from "./FieldEditors";
import { ProductSelector } from "./ProductSelector";

type EditableNode = HierarchyItem | HierarchyChild;

interface ContentEditorPanelProps {
  node: EditableNode;
  isChild?: boolean;
  onSave: (updated: EditableNode) => void;
}

export function ContentEditorPanel({ node, isChild, onSave }: ContentEditorPanelProps) {
  const [data, setData] = useState<EditableNode>(node);

  // Sync state if node changes in parent
  useEffect(() => {
    setData(node);
  }, [node]);

  const [templates, setTemplates] = useState<Record<string, any>>({});
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    async function loadTemplates() {
      setLoadingTemplates(true);
      const { data: dbData } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "template_product_categories")
        .maybeSingle();
      if (dbData?.value) {
        setTemplates(dbData.value as Record<string, any>);
      }
      setLoadingTemplates(false);
    }
    loadTemplates();
  }, []);

  const handleSelectTemplate = (templateSlug: string) => {
    const t = templates[templateSlug];
    if (!t) return;
    
    setData(prev => {
      const updated: any = {
        ...prev,
        label: t.label ?? prev.label,
        slug: templateSlug,
      };
      
      if (isChild) {
        updated.to = "/products/$category/$family";
        updated.params = {
          ...(prev.params || {}),
          family: templateSlug
        };
      } else {
        updated.to = "/products/$category";
        updated.params = {
          ...(prev.params || {}),
          category: templateSlug
        };
      }
      
      return updated;
    });
    
    toast.success(`Auto-filled details from "${t.label || templateSlug}" page template!`);
  };

  const page: PageContent = (data as any).pageContent ?? {};
  const mega: MegaContent = (data as any).megaFallback ?? (data as HierarchyChild).megaContent ?? {};

  const isProductNode = data.to?.includes("/products") || data.to?.includes("products");

  const setPage = (p: Partial<PageContent>) =>
    setData(prev => ({ ...prev, pageContent: { ...(prev as any).pageContent, ...p } }));

  const setMega = (m: Partial<MegaContent>) => {
    if (isChild) {
      setData(prev => ({ ...prev, megaContent: { ...(prev as HierarchyChild).megaContent, ...m } }));
    } else {
      setData(prev => ({ ...prev, megaFallback: { ...(prev as HierarchyItem).megaFallback, ...m } }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div>
          <h3 className="font-display font-bold uppercase tracking-tight text-lg">{data.label}</h3>
          <p className="text-xs text-muted-foreground">{data.slug}</p>
        </div>
        <Button onClick={() => onSave(data)} className="bg-primary hover:bg-primary-hover text-white">
          <Save className="h-4 w-4 mr-2" /> Save
        </Button>
      </div>

      <Tabs defaultValue="identity" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-6 pt-3 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-1">
          {["identity", "page", "mega"]
            .filter(t => {
              if (t === "mega" && isChild) return false;
              if (t === "page" && isChild && isProductNode) return false;
              return true;
            })
            .map(t => (
              <TabsTrigger key={t} value={t}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 text-xs uppercase tracking-wider font-bold capitalize">
                {t === "identity" ? "Identity" : t === "page" ? "Page Content" : "Mega Menu"}
              </TabsTrigger>
            ))}
        </TabsList>

        {/* ── Identity ── */}
        <TabsContent value="identity" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
          {isChild && isProductNode && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 text-xs flex items-start gap-2.5 mb-2 shadow-sm animate-pulse">
              <span className="text-primary text-base select-none mt-0.5">💡</span>
              <div className="space-y-1">
                <div className="font-bold text-foreground uppercase tracking-wider">Unified Product Content</div>
                <div className="text-muted-foreground leading-relaxed">
                  The page template and rich features for <strong>{data.label}</strong> are edited under <strong>Page Templates</strong>.
                  <a href={`/admin/page-templates?slug=${data.slug}`} className="text-primary hover:underline ml-1 font-bold inline-flex items-center gap-0.5">
                    Edit content →
                  </a>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Label</label>
            <Input value={data.label} onChange={e => setData(p => ({ ...p, label: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Slug</label>
            <Input value={data.slug} onChange={e => setData(p => ({ ...p, slug: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Icon (Lucide name)</label>
            <Input value={data.icon ?? ""} onChange={e => setData(p => ({ ...p, icon: e.target.value }))} placeholder="e.g. Layers" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Link Path</label>
            <Input value={data.to} onChange={e => setData(p => ({ ...p, to: e.target.value }))} placeholder="/products/$category" />
          </div>
          
          {/* Autocomplete template page picker */}
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-3.5 space-y-2 mt-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                ⚡ Auto-fill from Page Template
              </label>
              {loadingTemplates && <span className="text-[10px] text-muted-foreground animate-pulse">Loading...</span>}
            </div>
            
            <Select onValueChange={handleSelectTemplate}>
              <SelectTrigger className="w-full text-xs h-8 bg-card border-primary/20 hover:border-primary/40 focus:ring-1 focus:ring-primary">
                <SelectValue placeholder="Choose a page template..." />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border">
                {Object.keys(templates).length > 0 ? (
                  Object.entries(templates).map(([slug, t]: [string, any]) => (
                    <SelectItem key={slug} value={slug} className="text-xs">
                      {t.label || slug} ({slug})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-xs text-muted-foreground italic">No templates found</div>
                )}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Selecting a page template will automatically configure the Label, Slug, and Path parameters to ensure a perfect 100% matched link.
            </p>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase text-muted-foreground">SEO</h4>
            <Input value={page.seo?.title ?? ""} onChange={e => setPage({ seo: { ...page.seo, title: e.target.value, description: page.seo?.description ?? "" } })} placeholder="SEO Title" />
            <Textarea value={page.seo?.description ?? ""} onChange={e => setPage({ seo: { title: page.seo?.title ?? "", ...page.seo, description: e.target.value } })} placeholder="SEO Description" className="min-h-[60px]" />
          </div>
        </TabsContent>

        {/* ── Page Content ── */}
        <TabsContent value="page" className="flex-1 overflow-y-auto p-6 m-0">
          {isChild && isProductNode ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-border rounded-xl bg-surface/50 h-[80%] my-auto max-w-md mx-auto space-y-5">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold uppercase text-foreground">Page Templates Integration</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This is a product category/family page. To maintain consistent layouts and rich components (FAQs, specs table, typical values), its content is managed inside the centralized <strong>Page Templates</strong> builder.
                </p>
              </div>
              <div className="pt-2 w-full">
                <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider text-xs py-2 gap-2 shadow-lg shadow-primary/20">
                  <a href={`/admin/page-templates?slug=${data.slug}`}>
                    Edit in Page Templates →
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Hero</h4>
                <Input value={page.heroImage ?? ""} onChange={e => setPage({ heroImage: e.target.value })} placeholder="Hero image URL" />
                <Textarea value={page.subtitle ?? ""} onChange={e => setPage({ subtitle: e.target.value })} placeholder="Subtitle / tagline" className="min-h-[80px]" />
              </div>

              <ListEditor label="Description Paragraphs" items={page.description ?? []} onChange={v => setPage({ description: v })} multiline placeholder="Paragraph text..." />
              <ListEditor label="Key Features / Benefits (bullet list)" items={page.features ?? []} onChange={v => setPage({ features: v })} placeholder="e.g. High UV resistance" />

              <PairsEditor
                label="Technical Highlights (label + value)"
                items={(page.technicalHighlights ?? []) as any[]}
                fields={[{ key: "label", label: "Label" }, { key: "value", label: "Value" }]}
                onChange={v => setPage({ technicalHighlights: v as any })}
              />

              <PropertiesTableEditor
                table={page.propertiesTable ?? { headers: ["Property", "Test Method", "Value"], rows: [] }}
                onChange={v => setPage({ propertiesTable: v })}
              />

              <PairsEditor
                label="Types"
                items={(page.types ?? []) as any[]}
                fields={[{ key: "name", label: "Name" }, { key: "description", label: "Description", multiline: true }]}
                onChange={v => setPage({ types: v as any })}
              />

              <PairsEditor
                label="Benefits"
                items={(page.benefits ?? []) as any[]}
                fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                onChange={v => setPage({ benefits: v as any })}
              />

              <FAQEditor faqs={page.faqs ?? []} onChange={v => setPage({ faqs: v })} />

              <ListEditor label="Installation Specs" items={page.installationSpecs ?? []} onChange={v => setPage({ installationSpecs: v })} multiline placeholder="Spec details..." />

              <PairsEditor
                label="Project References"
                items={(page.projectReferences ?? []) as any[]}
                fields={[
                  { key: "name", label: "Project Name" },
                  { key: "location", label: "Location" },
                  { key: "year", label: "Year" },
                  { key: "image", label: "Image URL" },
                ]}
                onChange={v => setPage({ projectReferences: v as any })}
              />
            </div>
          )}
        </TabsContent>

        {/* ── Mega Menu ── */}
        <TabsContent value="mega" className="flex-1 overflow-y-auto p-6 space-y-8 m-0">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Secondary Column</h4>
            <Input
              value={mega.secondaryTitle ?? ""}
              onChange={e => setMega({ secondaryTitle: e.target.value })}
              placeholder="Column heading, e.g. 'Geomembranes'"
            />
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Links</label>
              {(mega.secondary ?? []).map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={link.label}
                    onChange={e => {
                      const s = [...(mega.secondary ?? [])];
                      s[i] = { ...s[i], label: e.target.value };
                      setMega({ secondary: s });
                    }}
                    placeholder="Label"
                    className="text-sm w-1/3"
                  />
                  <Input
                    value={link.to}
                    onChange={e => {
                      const s = [...(mega.secondary ?? [])];
                      s[i] = { ...s[i], to: e.target.value };
                      setMega({ secondary: s });
                    }}
                    placeholder="/path"
                    className="text-sm flex-1"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                    onClick={() => setMega({ secondary: (mega.secondary ?? []).filter((_, idx) => idx !== i) })}>
                    ✕
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="text-xs"
                onClick={() => setMega({ secondary: [...(mega.secondary ?? []), { label: "", to: "/" }] })}>
                + Add Link
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="text-xs font-bold uppercase text-primary tracking-wider mb-3">Featured Products (up to 4)</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {(mega.featured ?? []).slice(0, 4).map((item: any, i) => (
                <div key={i} className="border border-border rounded p-3 bg-surface/50 space-y-2 relative">
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-destructive"
                    onClick={() => setMega({ featured: (mega.featured ?? []).filter((_, idx) => idx !== i) as any })}>
                    ✕
                  </Button>
                  <ProductSelector onSelect={(prod: any) => {
                    const f = [...(mega.featured ?? [])] as any[];
                    f[i] = {
                      label: prod.name,
                      spec: prod.thickness_mm
                        ? `${prod.thickness_mm}mm`
                        : (prod.short_description ?? prod.product_categories?.name ?? ""),
                      // Navigate to the individual catalogue product
                      to: "/catalogue/$slug",
                      params: {
                        slug: prod.slug,
                      },
                      image: prod.image_url ?? "",
                    };
                    setMega({ featured: f as any, featuredKind: "product" });
                  }} />
                  {item.label && (
                    <div className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                      {item.image && <img src={item.image} className="h-10 w-10 rounded object-cover" />}
                      <div>
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground">{item.spec}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(mega.featured ?? []).length < 4 && (
                <Button variant="outline" className="min-h-[80px] border-dashed text-muted-foreground"
                  onClick={() => setMega({ featured: [...(mega.featured ?? []), { label: "", spec: "", to: "/", image: "" }] as any, featuredKind: "product" })}>
                  + Add Featured Item
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="text-xs font-bold uppercase text-primary tracking-wider mb-3">Quick Actions</h4>
            <QuickActionsEditor
              items={(mega.quickActions ?? []) as any}
              onChange={v => setMega({ quickActions: v as any })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
