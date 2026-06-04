import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, ExternalLink, Eye, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SectionHeading, FieldLabel, StringListEditor } from "./TemplateEditorShared";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApplicationSeo {
  title: string;
  description: string;
  keywords: string;
}

interface ApplicationTemplate {
  title: string;
  description: string;
  heroImage: string;
  content: {
    subsystems: string[];
    sections: unknown[];
  };
  seo: ApplicationSeo | null;
}

type AllApplicationTemplates = Record<string, ApplicationTemplate>;

const SUPABASE_KEY = "template_applications";

// ─── Blank template factory ───────────────────────────────────────────────────

function blankTemplate(): ApplicationTemplate {
  return {
    title: "",
    description: "",
    heroImage: "",
    content: { subsystems: [], sections: [] },
    seo: null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ApplicationsTemplatesEditor() {
  const [allData, setAllData] = useState<AllApplicationTemplates>({});
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load application templates: " + error.message);
    } else {
      const stored = (data?.value ?? {}) as AllApplicationTemplates;
      // Pre-seed blank records for any slug not yet in the store
      const seeded: AllApplicationTemplates = { ...stored };
      for (const cat of APPLICATION_CATEGORIES) {
        if (!seeded[cat.slug]) {
          seeded[cat.slug] = { ...blankTemplate(), title: cat.label };
        }
      }
      setAllData(seeded);
      if (!activeSlug) {
        setActiveSlug(APPLICATION_CATEGORIES[0]?.slug ?? "");
      }
    }
    setLoading(false);
  }, [activeSlug]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save to Supabase ──
  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: SUPABASE_KEY, value: allData as any }, { onConflict: "key" });

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Application templates saved successfully!");
      setDirty(false);
    }
    setSaving(false);
  };

  // ── Active template helpers ──
  const active = activeSlug ? allData[activeSlug] : null;

  const updateActive = (updater: (prev: ApplicationTemplate) => ApplicationTemplate) => {
    if (!activeSlug) return;
    setAllData((prev) => ({
      ...prev,
      [activeSlug]: updater(prev[activeSlug] ?? blankTemplate()),
    }));
    setDirty(true);
  };

  const setField = <K extends keyof ApplicationTemplate>(
    key: K,
    value: ApplicationTemplate[K],
  ) => updateActive((prev) => ({ ...prev, [key]: value }));

  const setSeo = (patch: Partial<ApplicationSeo>) =>
    updateActive((prev) => ({
      ...prev,
      seo: {
        title: prev.seo?.title ?? "",
        description: prev.seo?.description ?? "",
        keywords: prev.seo?.keywords ?? "",
        ...patch,
      },
    }));

  const setSubsystems = (subsystems: string[]) =>
    updateActive((prev) => ({
      ...prev,
      content: { ...prev.content, subsystems },
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading application templates…</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Application Page Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit page templates for each application category. Changes save to Supabase.
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
              Application Categories ({APPLICATION_CATEGORIES.length})
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {APPLICATION_CATEGORIES.map((cat) => {
              const isActive = cat.slug === activeSlug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setActiveSlug(cat.slug);
                    setActiveTab("hero");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-accent text-foreground",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-xs">{cat.label}</div>
                    <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                      {cat.slug}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-primary shrink-0 ml-1" />}
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
              <p className="text-sm font-medium">Select an application from the sidebar to edit</p>
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
                      /applications/{activeSlug}
                    </code>
                    {dirty && (
                      <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <a href={`/applications/${activeSlug}`} target="_blank" rel="noopener noreferrer">
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
                        placeholder="e.g. Mining Systems"
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
                        placeholder="Engineered geosynthetic solutions for…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                  </TabsContent>

                  {/* ── CONTENT ── */}
                  <TabsContent value="content" className="p-6 space-y-5 m-0">
                    <SectionHeading>Content — Sub-systems</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      These appear as cards in the application sub-systems section on the page.
                      Each entry is a short label (e.g. "Liner Systems").
                    </p>
                    <StringListEditor
                      label="Sub-systems"
                      hint="Each item appears as a card on the application category page"
                      items={active.content?.subsystems ?? []}
                      onChange={setSubsystems}
                      placeholder="e.g. Liner Systems"
                    />
                  </TabsContent>

                  {/* ── SEO ── */}
                  <TabsContent value="seo" className="p-6 space-y-5 m-0">
                    <SectionHeading>SEO / Meta Tags</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Configure the search engine optimization tags for this application category page.
                    </p>
                    <div>
                      <FieldLabel hint="Recommended: 50–60 characters">Meta Title</FieldLabel>
                      <Input
                        value={active.seo?.title ?? ""}
                        onChange={(e) => setSeo({ title: e.target.value })}
                        placeholder="e.g. Mining Systems | Geosynthetics Africa"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Recommended: 150–160 characters">Meta Description</FieldLabel>
                      <Textarea
                        value={active.seo?.description ?? ""}
                        onChange={(e) => setSeo({ description: e.target.value })}
                        placeholder="Premium geosynthetic solutions for mining applications across Africa…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Comma-separated list of search keywords">Meta Keywords</FieldLabel>
                      <Input
                        value={active.seo?.keywords ?? ""}
                        onChange={(e) => setSeo({ keywords: e.target.value })}
                        placeholder="e.g. mining geosynthetics, tailings dam liner, heap leach pad"
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
