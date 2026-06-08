import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/components/site/mega-menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save, Loader2, ExternalLink, Eye, AlertTriangle, CheckCircle2, ChevronRight,
  Plus, Trash2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SectionHeading, FieldLabel, StringListEditor } from "./TemplateEditorShared";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceSeo {
  title: string;
  description: string;
  keywords: string;
}

interface ServiceTemplate {
  title: string;
  description: string;
  heroImage: string;
  content: {
    features: string[];
    sections: unknown[];
  };
  seo: ServiceSeo | null;
}

type AllServiceTemplates = Record<string, ServiceTemplate>;

const SUPABASE_KEY = "template_services";

// ─── Blank template factory ───────────────────────────────────────────────────

function blankTemplate(): ServiceTemplate {
  return {
    title: "",
    description: "",
    heroImage: "",
    content: { features: [], sections: [] },
    seo: null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ServicesTemplatesEditor() {
  const [allData, setAllData] = useState<AllServiceTemplates>({});
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);

  // Dynamic list combining static mega-menu services with custom ones from DB
  const categoriesList = useMemo(() => {
    const list = SERVICES.map((s) => ({ slug: s.slug, label: s.label }));
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
      toast.error("Failed to load service templates: " + error.message);
    } else {
      const stored = (data?.value ?? {}) as AllServiceTemplates;
      // Pre-seed blank records for any slug not yet in the store
      const seeded: AllServiceTemplates = { ...stored };
      for (const svc of SERVICES) {
        if (!seeded[svc.slug]) {
          seeded[svc.slug] = { ...blankTemplate(), title: svc.label };
        }
      }
      setAllData(seeded);
      if (!activeSlug) {
        setActiveSlug(SERVICES[0]?.slug ?? "");
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
    
    if (allData[slug] || SERVICES.some(s => s.slug === slug)) {
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
    if (SERVICES.some(s => s.slug === slug)) {
      toast.error("Cannot delete static mega-menu service.");
      return;
    }

    setAllData(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    if (activeSlug === slug) {
      setActiveSlug(SERVICES[0]?.slug ?? "");
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
      toast.success("Service templates saved successfully!");
      setDirty(false);
    }
    setSaving(false);
  };

  // ── Active template helpers ──
  const active = activeSlug ? allData[activeSlug] : null;

  const updateActive = (updater: (prev: ServiceTemplate) => ServiceTemplate) => {
    if (!activeSlug) return;
    setAllData((prev) => ({
      ...prev,
      [activeSlug]: updater(prev[activeSlug] ?? blankTemplate()),
    }));
    setDirty(true);
  };

  const setField = <K extends keyof ServiceTemplate>(key: K, value: ServiceTemplate[K]) =>
    updateActive((prev) => ({ ...prev, [key]: value }));

  const setSeo = (patch: Partial<ServiceSeo>) =>
    updateActive((prev) => ({
      ...prev,
      seo: {
        title: prev.seo?.title ?? "",
        description: prev.seo?.description ?? "",
        keywords: prev.seo?.keywords ?? "",
        ...patch,
      },
    }));

  const setFeatures = (features: string[]) =>
    updateActive((prev) => ({
      ...prev,
      content: { ...prev.content, features },
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading service templates…</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Service Page Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit page templates for each service. Changes save to Supabase.
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
              Services ({categoriesList.length})
            </p>
          </div>

          {/* Add new template button at the top */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            {showNewSlug ? (
              <div className="space-y-2">
                <Input
                  placeholder="e.g. customized-delivery"
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value)}
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
            {categoriesList.map((svc) => {
              const isActive = svc.slug === activeSlug;
              const isStatic = SERVICES.some((s) => s.slug === svc.slug);
              return (
                <button
                  key={svc.slug}
                  onClick={() => {
                    setActiveSlug(svc.slug);
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
                    <div className="truncate font-medium text-xs">{svc.label}</div>
                    <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                      {svc.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-1 shrink-0">
                    {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
                    {!isStatic && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Template "{svc.slug}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the template for this custom service. You still need to click Save All to persist.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90 text-white border-0 cursor-pointer"
                              onClick={() => handleDelete(svc.slug)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
              <p className="text-sm font-medium">Select a service from the sidebar to edit</p>
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
                      /services/{activeSlug}
                    </code>
                    {dirty && (
                      <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <a href={`/services/${activeSlug}`} target="_blank" rel="noopener noreferrer">
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
                    { id: "content", label: "Content" },
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
                        placeholder="e.g. Supply"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Full URL to the hero background image">
                        Hero Image URL
                      </FieldLabel>
                      <Input
                        value={active.heroImage ?? ""}
                        onChange={(e) => setField("heroImage", e.target.value)}
                        placeholder="https://images.unsplash.com/…"
                        className="text-sm font-mono"
                      />
                      {active.heroImage && (
                        <img
                          src={active.heroImage}
                          alt="Hero preview"
                          className="mt-2 h-24 w-full object-cover rounded border border-border"
                        />
                      )}
                    </div>
                    <div>
                      <FieldLabel hint="Short paragraph shown below the title in the hero">
                        Description
                      </FieldLabel>
                      <Textarea
                        value={active.description ?? ""}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Comprehensive supply solutions for geosynthetic projects across Africa…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                  </TabsContent>

                  {/* ── CONTENT ── */}
                  <TabsContent value="content" className="p-6 space-y-5 m-0">
                    <SectionHeading>Content — Service Features</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      These appear as capability cards in the service features section.
                      Each entry is a short label describing a feature or capability (e.g. "Fast lead times").
                    </p>
                    <StringListEditor
                      label="Service Features"
                      hint="Each item is shown as a capability card on the service page"
                      items={active.content?.features ?? []}
                      onChange={setFeatures}
                      placeholder="e.g. Certified product range"
                    />
                  </TabsContent>

                  {/* ── SEO ── */}
                  <TabsContent value="seo" className="p-6 space-y-5 m-0">
                    <SectionHeading>SEO / Meta Tags</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Configure the search engine optimization tags for this service page.
                    </p>
                    <div>
                      <FieldLabel hint="Recommended: 50–60 characters">Meta Title</FieldLabel>
                      <Input
                        value={active.seo?.title ?? ""}
                        onChange={(e) => setSeo({ title: e.target.value })}
                        placeholder="e.g. Supply Services | Geosynthetics Africa"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Recommended: 150–160 characters">Meta Description</FieldLabel>
                      <Textarea
                        value={active.seo?.description ?? ""}
                        onChange={(e) => setSeo({ description: e.target.value })}
                        placeholder="Premium geosynthetic supply services across Africa…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Comma-separated list of search keywords">Meta Keywords</FieldLabel>
                      <Input
                        value={active.seo?.keywords ?? ""}
                        onChange={(e) => setSeo({ keywords: e.target.value })}
                        placeholder="e.g. geosynthetics supply, liner supply africa"
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
    </>
  );
}
