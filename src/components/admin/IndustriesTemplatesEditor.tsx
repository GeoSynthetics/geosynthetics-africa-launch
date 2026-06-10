import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRIES } from "@/components/site/mega-menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save, Loader2, ExternalLink, Eye, AlertTriangle, CheckCircle2, ChevronRight,
  Plus, Trash2
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";
import { cn, formatSlugInput } from "@/lib/utils";
import { SectionHeading, FieldLabel, StringListEditor } from "./TemplateEditorShared";
import { ImagePicker } from "./ImagePicker";
import { ProductSelector } from "./ProductSelector";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndustrySeo {
  title: string;
  description: string;
  keywords: string;
}

interface IndustryTemplate {
  title: string;
  description: string;
  heroImage: string;
  content: {
    challenges: string[];
    applications: string[];
    sections: unknown[];
  };
  topSellingProductId?: string;
  topSellingProductIds?: string[];
  seo: IndustrySeo | null;
}

type AllIndustryTemplates = Record<string, IndustryTemplate>;

const SUPABASE_KEY = "template_industries";

// ─── Blank template factory ───────────────────────────────────────────────────

function blankTemplate(): IndustryTemplate {
  return {
    title: "",
    description: "",
    heroImage: "",
    content: { challenges: [], applications: [], sections: [] },
    topSellingProductId: "",
    topSellingProductIds: [],
    seo: null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IndustriesTemplatesEditor() {
  const [allData, setAllData] = useState<AllIndustryTemplates>({});
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [industryToDelete, setIndustryToDelete] = useState<{ slug: string; label: string } | null>(null);

  const handleConfirmDelete = () => {
    if (industryToDelete) {
      handleDelete(industryToDelete.slug);
      setIndustryToDelete(null);
    }
  };

  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);
  const [allProducts, setAllProducts] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Load products from DB
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug")
        .order("name");
      if (data) setAllProducts(data);
    }
    fetchProducts();
  }, []);

  // Dynamic list combining static mega-menu industries with custom ones from DB
  const categoriesList = useMemo(() => {
    const list = INDUSTRIES.map((i) => ({ slug: i.slug, label: i.label }));
    Object.keys(allData).forEach((slug) => {
      if (!list.some((item) => item.slug === slug)) {
        list.push({
          slug,
          label: allData[slug]?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        });
      }
    });
    return list;
  }, [allData]);

  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load industry templates: " + error.message);
    } else {
      const stored = (data?.value ?? {}) as AllIndustryTemplates;
      // Pre-seed blank records for any slug not yet in the store
      const seeded: AllIndustryTemplates = { ...stored };
      for (const ind of INDUSTRIES) {
        if (!seeded[ind.slug]) {
          seeded[ind.slug] = { ...blankTemplate(), title: ind.label };
        }
      }
      setAllData(seeded);
      if (!activeSlug) {
        setActiveSlug(INDUSTRIES[0]?.slug ?? "");
      }
    }
    setLoading(false);
  }, [activeSlug]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNew = () => {
    if (!newSlug.trim()) return;
    const slug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    
    if (allData[slug] || INDUSTRIES.some(i => i.slug === slug)) {
      toast.error("A template with that slug already exists.");
      return;
    }

    const label = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    
    setAllData(prev => ({
      ...prev,
      [slug]: { ...blankTemplate(), title: label }
    }));
    setActiveSlug(slug);
    setNewSlug("");
    setShowNewSlug(false);
    setDirty(true);
    toast.success(`Created template for "${slug}". Edit and save.`);
  };

  const handleDelete = (slug: string) => {
    if (INDUSTRIES.some(i => i.slug === slug)) {
      toast.error("Cannot delete static mega-menu industry.");
      return;
    }

    setAllData(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    if (activeSlug === slug) {
      setActiveSlug(INDUSTRIES[0]?.slug ?? "");
    }
    setDirty(true);
    toast.success(`Deleted template "${slug}". Save to persist changes.`);
  };

  // ── Save to Supabase ──
  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: SUPABASE_KEY, value: allData as any }, { onConflict: "key" });

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Industry templates saved successfully!");
      setDirty(false);
    }
    setSaving(false);
  };

  // ── Active template helpers ──
  const active = activeSlug ? allData[activeSlug] : null;

  const updateActive = (updater: (prev: IndustryTemplate) => IndustryTemplate) => {
    if (!activeSlug) return;
    setAllData((prev) => ({
      ...prev,
      [activeSlug]: updater(prev[activeSlug] ?? blankTemplate()),
    }));
    setDirty(true);
  };

  const setField = <K extends keyof IndustryTemplate>(key: K, value: IndustryTemplate[K]) =>
    updateActive((prev) => ({ ...prev, [key]: value }));

  const setSeo = (patch: Partial<IndustrySeo>) =>
    updateActive((prev) => ({
      ...prev,
      seo: {
        title: prev.seo?.title ?? "",
        description: prev.seo?.description ?? "",
        keywords: prev.seo?.keywords ?? "",
        ...patch,
      },
    }));

  const setChallenges = (challenges: string[]) =>
    updateActive((prev) => ({
      ...prev,
      content: { ...prev.content, challenges },
    }));

  const setApplications = (applications: string[]) =>
    updateActive((prev) => ({
      ...prev,
      content: { ...prev.content, applications },
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading industry templates…</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Industry Page Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit page templates for each industry. Changes save to Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {dirty && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded">
              <AlertTriangle className="h-3 w-3" />
              Unsaved changes
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wide gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      {/* ── Main Split Layout ── */}
      <div className="flex gap-0 border border-border rounded-xl overflow-hidden min-h-[780px] bg-card">
        {/* Left sidebar */}
        <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface/30">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Industries ({categoriesList.length})
            </p>
          </div>

          {/* Add new template button at the top */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            {showNewSlug ? (
              <div className="space-y-2">
                <Input
                  placeholder="e.g. defense-aerospace"
                  value={newSlug}
                  onChange={e => setNewSlug(formatSlugInput(e.target.value))}
                  onKeyDown={e => { if (e.key === "Enter") handleAddNew(); if (e.key === "Escape") setShowNewSlug(false); }}
                  className="text-xs h-8"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button size="sm" onClick={handleAddNew}
                    className="flex-1 h-7 text-xs bg-primary hover:bg-primary-hover text-white border-0 cursor-pointer">
                    Create
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setShowNewSlug(false); setNewSlug(""); }}
                    className="h-7 text-xs cursor-pointer">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowNewSlug(true)}
                className="w-full h-8 text-xs gap-1.5 cursor-pointer">
                <Plus className="h-3 w-3" /> New Template
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {categoriesList.map((ind) => {
              const isActive = ind.slug === activeSlug;
              const isStatic = INDUSTRIES.some((i) => i.slug === ind.slug);
              return (
                <button
                  key={ind.slug}
                  onClick={() => {
                    setActiveSlug(ind.slug);
                    setActiveTab("hero");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-accent text-foreground",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-xs">{ind.label}</div>
                    <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                      {ind.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-1 shrink-0">
                    {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
                    {!isStatic && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIndustryToDelete({ slug: ind.slug, label: ind.label });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!active ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 p-8 text-center">
              <Eye className="h-10 w-10 opacity-30" />
              <p className="text-sm font-medium">Select an industry from the sidebar to edit</p>
            </div>
          ) : (
            <>
              {/* Panel header bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                    {active.title || activeSlug}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                      /industries/{activeSlug}
                    </code>
                    {dirty && (
                      <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <a href={`/industries/${activeSlug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" /> Preview
                    </a>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="bg-primary hover:bg-primary-hover text-white font-bold text-xs h-8 gap-1.5"
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    {saving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
                  {[
                    { id: "hero", label: "Hero" },
                    { id: "challenges", label: "Challenges" },
                    { id: "applications", label: "Applications" },
                    { id: "products", label: "Products" },
                    { id: "seo", label: "SEO" },
                  ].map((t) => (
                    <TabsTrigger
                      key={t.id}
                      value={t.id}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                  {/* ── HERO ── */}
                  <TabsContent value="hero" className="p-6 space-y-5 m-0">
                    <SectionHeading>Hero Section</SectionHeading>
                    <div>
                      <FieldLabel>Page Title (H1)</FieldLabel>
                      <Input
                        value={active.title ?? ""}
                        onChange={(e) => setField("title", e.target.value)}
                        placeholder="e.g. Mining"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <ImagePicker
                        label="Hero Image"
                        hint="Full URL or Supabase storage path to the hero background image"
                        value={active.heroImage ?? ""}
                        onChange={(val) => setField("heroImage", val)}
                        placeholder="https://images.unsplash.com/…"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Short paragraph shown below the title in the hero">
                        Description
                      </FieldLabel>
                      <Textarea
                        value={active.description ?? ""}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Geosynthetics solutions for the mining industry across Africa…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                  </TabsContent>

                  {/* ── CHALLENGES ── */}
                  <TabsContent value="challenges" className="p-6 space-y-5 m-0">
                    <SectionHeading>Industry Challenges</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      These appear as challenge cards on the industry page, highlighting the key
                      problems Geosynthetics Africa helps solve in this industry.
                    </p>
                    <StringListEditor
                      label="Challenges"
                      hint="Each item is shown as a challenge card on the industry page"
                      items={active.content?.challenges ?? []}
                      onChange={setChallenges}
                      placeholder="e.g. Tailings storage and containment requirements"
                    />
                  </TabsContent>

                  {/* ── APPLICATIONS ── */}
                  <TabsContent value="applications" className="p-6 space-y-5 m-0">
                    <SectionHeading>Key Applications</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      These appear in the key applications grid section, showing how geosynthetics
                      are used in this industry.
                    </p>
                    <StringListEditor
                      label="Key Applications"
                      hint="Each item is shown in the applications grid on the industry page"
                      items={active.content?.applications ?? []}
                      onChange={setApplications}
                      placeholder="e.g. Heap Leach Pad Lining"
                    />
                  </TabsContent>

                  {/* ── PRODUCTS ── */}
                  <TabsContent value="products" className="p-6 space-y-5 m-0">
                    <SectionHeading>Top Selling Products (Max 5)</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Select up to 5 top-selling products for this industry to show as a slider in the mega menu.
                    </p>
                    
                    <div className="space-y-2 max-w-md mb-4">
                      {(active.topSellingProductIds ?? []).map((pId) => {
                        const pData = allProducts.find(p => p.id === pId);
                        return (
                          <div key={pId} className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg text-xs font-semibold shadow-sm">
                            <span>{pData ? pData.name : `Product ID: ${pId}`}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() => setField("topSellingProductIds", (active.topSellingProductIds ?? []).filter(id => id !== pId))}
                            >
                              ✕
                            </Button>
                          </div>
                        );
                      })}
                      
                      {(!active.topSellingProductIds || active.topSellingProductIds.length === 0) && !active.topSellingProductId && (
                        <p className="text-xs text-muted-foreground italic">No top selling products selected.</p>
                      )}

                      {/* Show legacy single product if present but no array exists */}
                      {(!active.topSellingProductIds || active.topSellingProductIds.length === 0) && active.topSellingProductId && (
                        <div className="flex items-center justify-between p-2.5 bg-background border border-amber-500/30 rounded-lg text-xs font-semibold shadow-sm">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {allProducts.find(p => p.id === active.topSellingProductId)?.name || `Product ID: ${active.topSellingProductId}`} (Legacy Single)
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => setField("topSellingProductId", "")}
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>

                    {(!active.topSellingProductIds || active.topSellingProductIds.length < 5) && (
                      <div className="max-w-md pt-2">
                        <ProductSelector
                          excludeIds={[
                            ...(active.topSellingProductIds ?? []),
                            ...(active.topSellingProductId ? [active.topSellingProductId] : [])
                          ]}
                          onSelect={(prod) => {
                            let currentIds = [...(active.topSellingProductIds ?? [])];
                            if (active.topSellingProductId && currentIds.length === 0) {
                              currentIds.push(active.topSellingProductId);
                            }
                            setField("topSellingProductIds", [...currentIds, prod.id]);
                            if (active.topSellingProductId) {
                              setField("topSellingProductId", "");
                            }
                          }}
                        />
                      </div>
                    )}
                  </TabsContent>

                  {/* ── SEO ── */}
                  <TabsContent value="seo" className="p-6 space-y-5 m-0">
                    <SectionHeading>SEO / Meta Tags</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Configure the search engine optimization tags for this industry page.
                    </p>
                    <div>
                      <FieldLabel hint="Recommended: 50–60 characters">Meta Title</FieldLabel>
                      <Input
                        value={active.seo?.title ?? ""}
                        onChange={(e) => setSeo({ title: e.target.value })}
                        placeholder="e.g. Mining Industry Solutions | Geosynthetics Africa"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Recommended: 150–160 characters">Meta Description</FieldLabel>
                      <Textarea
                        value={active.seo?.description ?? ""}
                        onChange={(e) => setSeo({ description: e.target.value })}
                        placeholder="Engineered geosynthetic solutions for mining operations across Africa…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Comma-separated list of search keywords">Meta Keywords</FieldLabel>
                      <Input
                        value={active.seo?.keywords ?? ""}
                        onChange={(e) => setSeo({ keywords: e.target.value })}
                        placeholder="e.g. mining geosynthetics, tailings dam, heap leach africa"
                        className="text-sm"
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Success indicator */}
      {!dirty && Object.keys(allData).length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          All changes saved to Supabase
        </div>
      )}
      <DeleteConfirmationDialog
        isOpen={!!industryToDelete}
        onOpenChange={(open) => !open && setIndustryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Industry Template?"
        description="This will remove the template for this custom industry. You still need to click Save All to persist."
        itemName={industryToDelete?.label}
        idPrefix="industry-template"
      />
    </>
  );
}
