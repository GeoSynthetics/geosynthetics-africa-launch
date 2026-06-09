import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { APPLICATION_CATEGORIES } from "@/components/site/mega-menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { SectionHeading, FieldLabel, StringListEditor, PairsEditor } from "./TemplateEditorShared";
import { ImagePicker } from "./ImagePicker";
import { ProductSelector } from "./ProductSelector";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HighlightItem {
  icon: string;
  label: string;
}

export interface SuitableForItem {
  icon: string;
  label: string;
}

export interface CalloutItem {
  number: string;
  label: string;
  description: string;
}

export interface QaItem {
  icon: string;
  title: string;
  description: string;
}

export interface DownloadItem {
  label: string;
  url: string;
}

export interface ApplicationSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface ApplicationTemplate {
  title: string;
  description: string;
  heroImage: string;
  quoteLink?: string;
  downloadGuideLabel?: string;
  downloadGuideUrl?: string;
  heroHighlights?: HighlightItem[];
  
  // Overview Tab
  overviewParagraphs?: string[];
  keyBenefits?: string[];
  suitableFor?: SuitableForItem[];
  assistancePhone?: string;
  assistanceEmail?: string;
  featuredCaseStudySlug?: string;
  
  // System Components Tab
  componentsTitle?: string;
  componentsImage?: string;
  componentsDrawingLink?: string;
  componentsCallouts?: CalloutItem[];
  
  // Design & Installation Tabs
  designTitle?: string;
  designParagraphs?: string[];
  installationTitle?: string;
  installationParagraphs?: string[];
  
  // QA & Testing Tab
  qaTitle?: string;
  qaItems?: QaItem[];
  
  // Products & Downloads
  productsTitle?: string;
  products?: string[];
  downloadsTitle?: string;
  downloads?: DownloadItem[];
  
  // SEO
  seo: ApplicationSeo | null;
  
  // Legacy fields
  content?: {
    subsystems: string[];
    sections: unknown[];
  };
}

export type AllApplicationTemplates = Record<string, ApplicationTemplate>;

const SUPABASE_KEY = "template_applications";

// List of common Lucide icons that make sense in this technical context
const COMMON_ICONS = [
  "Droplets",
  "Wind",
  "Shield",
  "Leaf",
  "Pickaxe",
  "Construction",
  "Wrench",
  "Layers",
  "Gauge",
  "HardHat",
  "Settings",
  "ClipboardCheck",
  "Activity",
  "FileText",
  "CheckCircle2",
  "Sprout",
  "Trash2",
  "Waves",
  "Grid3x3",
  "Grid2x2",
  "Hexagon",
  "Mountain",
  "Truck",
  "Ship",
  "LifeBuoy",
  "Zap",
  "Building2",
];

// ─── Blank template factory ───────────────────────────────────────────────────

function blankTemplate(): ApplicationTemplate {
  return {
    title: "",
    description: "",
    heroImage: "",
    quoteLink: "#quote",
    downloadGuideLabel: "Download System Guide",
    downloadGuideUrl: "",
    heroHighlights: [
      { icon: "Shield", label: "Premium Protection" },
      { icon: "CheckCircle2", label: "Certified Installers" },
    ],
    overviewParagraphs: [],
    keyBenefits: [],
    suitableFor: [],
    assistancePhone: "+27 11 794 0974",
    assistanceEmail: "sales@geosynthetics.co.za",
    featuredCaseStudySlug: "",
    componentsTitle: "Typical System Components",
    componentsImage: "",
    componentsDrawingLink: "",
    componentsCallouts: [],
    designTitle: "Design Considerations",
    designParagraphs: [],
    installationTitle: "Installation Guidelines",
    installationParagraphs: [],
    qaTitle: "QA & Testing",
    qaItems: [],
    productsTitle: "Products Used in this Application",
    products: [],
    downloadsTitle: "Technical Downloads",
    downloads: [],
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    content: { subsystems: [], sections: [] },
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

  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);

  // DB reference state
  const [allProducts, setAllProducts] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [caseStudies, setCaseStudies] = useState<{ id: string; title: string; slug: string }[]>([]);

  // Dynamic list combining static mega-menu application categories with custom ones from DB
  const categoriesList = useMemo(() => {
    const list = APPLICATION_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }));
    Object.keys(allData).forEach((slug) => {
      if (slug !== "__landing" && !list.some((item) => item.slug === slug)) {
        list.push({
          slug,
          label: allData[slug]?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        });
      }
    });
    return list;
  }, [allData]);

  // Load products and case studies for autocomplete selects
  useEffect(() => {
    async function fetchDbData() {
      const { data: prods } = await supabase
        .from("products")
        .select("id, name, slug")
        .order("name");
      if (prods) setAllProducts(prods);

      const { data: cases } = await supabase
        .from("case_studies")
        .select("id, title, slug")
        .eq("status", "published")
        .order("title");
      if (cases) setCaseStudies(cases);
    }
    fetchDbData();
  }, []);

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
        } else {
          // Merge default values to prevent crash for templates missing new keys
          seeded[cat.slug] = {
            ...blankTemplate(),
            ...seeded[cat.slug],
            seo: {
              ...blankTemplate().seo,
              ...(seeded[cat.slug].seo || {}),
            }
          };
        }
      }
      if (!seeded["__landing"]) {
        seeded["__landing"] = {
          ...blankTemplate(),
          title: "Engineered Systems for Every Application",
          description: "From tailings storage to road stabilisation — full-system solutions, designed and certified for African operating conditions.",
          heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
          seo: {
            title: "Applications — Geosynthetics Africa",
            description: "Engineered geosynthetic systems for mining, water containment, waste, roads, erosion control and more.",
            keywords: "geosynthetics, applications, mining, water containment, waste landfills, roads, erosion control, drainage, agriculture",
          }
        };
      } else {
        seeded["__landing"] = {
          ...blankTemplate(),
          ...seeded["__landing"],
        };
      }
      setAllData(seeded);
      if (!activeSlug) {
        setActiveSlug("__landing");
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
    
    if (allData[slug] || APPLICATION_CATEGORIES.some(c => c.slug === slug)) {
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
    if (APPLICATION_CATEGORIES.some(c => c.slug === slug)) {
      toast.error("Cannot delete static mega-menu category.");
      return;
    }

    setAllData(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    if (activeSlug === slug) {
      setActiveSlug(APPLICATION_CATEGORIES[0]?.slug ?? "");
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
            className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wide gap-2 border-0 cursor-pointer"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      {/* ── Main Split Layout ── */}
      <div className="flex gap-0 border border-border rounded-xl overflow-hidden min-h-[820px] bg-card">
        {/* Left sidebar */}
        <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface/30">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Application Categories ({categoriesList.length})
            </p>
          </div>

          {/* Add new template button at the top */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            {showNewSlug ? (
              <div className="space-y-2">
                <Input
                  placeholder="e.g. mining-systems"
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

          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Main Pages Section */}
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Main Pages
              </p>
              <button
                onClick={() => {
                  setActiveSlug("__landing");
                  setActiveTab("hero");
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors cursor-pointer",
                  activeSlug === "__landing"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-accent text-foreground",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-xs">Applications Landing Page</div>
                  <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                    /applications
                  </div>
                </div>
                {activeSlug === "__landing" && <ChevronRight className="h-3 w-3 text-primary" />}
              </button>
            </div>

            {/* Categories Section */}
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Application Categories ({categoriesList.length})
              </p>
              <div className="space-y-0.5">
                {categoriesList.map((cat) => {
                  const isActive = cat.slug === activeSlug;
                  const isStatic = APPLICATION_CATEGORIES.some((c) => c.slug === cat.slug);
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setActiveSlug(cat.slug);
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
                        <div className="truncate font-medium text-xs">{cat.label}</div>
                        <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                          {cat.slug}
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
                                <AlertDialogTitle>Delete Template "{cat.slug}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the template for this custom application category. You still need to click Save All to persist.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90 text-white border-0 cursor-pointer"
                                  onClick={() => handleDelete(cat.slug)}
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
                    {activeSlug === "__landing" ? "Applications Landing Page" : (active.title || activeSlug)}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                      {activeSlug === "__landing" ? "/applications" : `/applications/${activeSlug}`}
                    </code>
                    {dirty && (
                      <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8 cursor-pointer">
                    <a href={activeSlug === "__landing" ? "/applications" : `/applications/${activeSlug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" /> Preview
                    </a>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="bg-primary hover:bg-primary-hover text-white font-bold text-xs h-8 gap-1.5 border-0 cursor-pointer"
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
                    { id: "overview", label: "Overview" },
                    { id: "components", label: "System Components" },
                    { id: "design_install", label: "Design & Installation" },
                    { id: "qa", label: "QA & Testing" },
                    { id: "products_downloads", label: "Products & Downloads" },
                    { id: "seo", label: "SEO" },
                  ]
                    .filter((t) => !(activeSlug === "__landing" && t.id !== "hero" && t.id !== "seo"))
                    .map((t) => (
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
                      <ImagePicker
                        label="Hero Background Image"
                        hint="Full URL or Supabase storage path to the hero background image"
                        value={active.heroImage ?? ""}
                        onChange={(val) => setField("heroImage", val)}
                        placeholder="https://images.unsplash.com/…"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Short paragraph shown below the title in the hero">
                        Hero Subtitle / Description
                      </FieldLabel>
                      <Textarea
                        value={active.description ?? ""}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Engineered geosynthetic solutions for…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>

                    {activeSlug !== "__landing" && (
                      <>
                        <div className="grid md:grid-cols-3 gap-4 border-t border-border pt-4">
                          <div>
                            <FieldLabel>Quote Button Anchor Link</FieldLabel>
                            <Input
                              value={active.quoteLink ?? ""}
                              onChange={(e) => setField("quoteLink", e.target.value)}
                              placeholder="e.g. #quote"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <FieldLabel>Guide Button Label</FieldLabel>
                            <Input
                              value={active.downloadGuideLabel ?? ""}
                              onChange={(e) => setField("downloadGuideLabel", e.target.value)}
                              placeholder="e.g. Download System Guide"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <FieldLabel>Guide File URL</FieldLabel>
                            <Input
                              value={active.downloadGuideUrl ?? ""}
                              onChange={(e) => setField("downloadGuideUrl", e.target.value)}
                              placeholder="e.g. /resources/docs/guide.pdf"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <PairsEditor
                            label="Hero Quick Action Highlights (Max 4)"
                            hint="A row of icons and quick points highlighted in the hero section"
                            items={(active.heroHighlights ?? []) as any[]}
                            fields={[
                              {
                                key: "icon",
                                label: "Icon Name",
                                placeholder: "e.g. Shield, Droplets, Wind, Leaf"
                              },
                              {
                                key: "label",
                                label: "Highlight Text",
                                placeholder: "e.g. Evaporation Minimisation"
                              }
                            ]}
                            onChange={(v) => setField("heroHighlights", v as any[])}
                            newItem={{ icon: "Shield", label: "" }}
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* ── OVERVIEW ── */}
                  <TabsContent value="overview" className="p-6 space-y-6 m-0">
                    <SectionHeading>Overview Tab</SectionHeading>
                    <StringListEditor
                      label="Main Content Paragraphs"
                      hint="Detailed descriptive text of the application. Renders as major paragraph blocks."
                      items={active.overviewParagraphs ?? []}
                      onChange={(v) => setField("overviewParagraphs", v)}
                      multiline
                      placeholder="Enter description paragraph..."
                    />

                    <div className="border-t border-border pt-6 grid md:grid-cols-2 gap-6">
                      <StringListEditor
                        label="Key Benefits List"
                        hint="List of key advantages shown with checkmarks in the sidebar (e.g. Evaporation reduction up to 95%)."
                        items={active.keyBenefits ?? []}
                        onChange={(v) => setField("keyBenefits", v)}
                        placeholder="e.g. Long service life & low maintenance"
                      />

                      <PairsEditor
                        label="Suitable For (Sidebar Grid)"
                        hint="Icon grid in the sidebar showing where this system is suitable (e.g. Water Reservoirs, process water)."
                        items={(active.suitableFor ?? []) as any[]}
                        fields={[
                          {
                            key: "icon",
                            label: "Icon (e.g. Droplets, Layers, Trash2, Sprout)",
                            placeholder: "Icon name"
                          },
                          {
                            key: "label",
                            label: "Sub-Application Name",
                            placeholder: "e.g. Wastewater Lagoons"
                          }
                        ]}
                        onChange={(v) => setField("suitableFor", v as any[])}
                        newItem={{ icon: "Droplets", label: "" }}
                      />
                    </div>

                    <div className="border-t border-border pt-6 grid md:grid-cols-3 gap-4">
                      <div>
                        <FieldLabel>Assistance Phone Number</FieldLabel>
                        <Input
                          value={active.assistancePhone ?? ""}
                          onChange={(e) => setField("assistancePhone", e.target.value)}
                          placeholder="+27 11 794 0974"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <FieldLabel>Assistance Email Address</FieldLabel>
                        <Input
                          value={active.assistanceEmail ?? ""}
                          onChange={(e) => setField("assistanceEmail", e.target.value)}
                          placeholder="sales@geosynthetics.co.za"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <FieldLabel hint="Select a published case study to feature in the sidebar">
                          Featured Case Study
                        </FieldLabel>
                        <Select
                          value={active.featuredCaseStudySlug ?? "none_selected"}
                          onValueChange={(val) => setField("featuredCaseStudySlug", val === "none_selected" ? "" : val)}
                        >
                          <SelectTrigger className="w-full text-xs h-8 bg-surface">
                            <SelectValue placeholder="Select featured case study..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border border-border">
                            <SelectItem value="none_selected" className="text-xs">
                              None Selected (Auto-filter)
                            </SelectItem>
                            {caseStudies.map((cs) => (
                              <SelectItem key={cs.id} value={cs.slug} className="text-xs">
                                {cs.title} ({cs.slug})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── SYSTEM COMPONENTS ── */}
                  <TabsContent value="components" className="p-6 space-y-6 m-0">
                    <SectionHeading>System Components</SectionHeading>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Section Heading</FieldLabel>
                        <Input
                          value={active.componentsTitle ?? ""}
                          onChange={(e) => setField("componentsTitle", e.target.value)}
                          placeholder="e.g. Typical Floating Cover System"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <FieldLabel hint="Anchor link or PDF document for detailed drawings">
                          Detailed Drawing Download Link
                        </FieldLabel>
                        <Input
                          value={active.componentsDrawingLink ?? ""}
                          onChange={(e) => setField("componentsDrawingLink", e.target.value)}
                          placeholder="e.g. /resources/docs/drawing.pdf"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <ImagePicker
                        label="Components Schematic / 3D Drawing Image"
                        hint="Upload or select the image representing the typical layout schematic"
                        value={active.componentsImage ?? ""}
                        onChange={(val) => setField("componentsImage", val)}
                        placeholder="https://images.unsplash.com/…"
                      />
                    </div>

                    <div className="border-t border-border pt-4">
                      <PairsEditor
                        label="Schematic Callouts / Parts List (1 to 6)"
                        hint="Define the parts/layers corresponding to the numbers on the schematic drawing."
                        items={(active.componentsCallouts ?? []) as any[]}
                        fields={[
                          { key: "number", label: "Callout Number / Tag", placeholder: "e.g. 1" },
                          { key: "label", label: "Part Label", placeholder: "e.g. HDPE Top Cover" },
                          { key: "description", label: "Short Technical Spec", placeholder: "e.g. UV stabilised HDPE geomembrane", multiline: true }
                        ]}
                        onChange={(v) => setField("componentsCallouts", v as any[])}
                        newItem={{ number: "1", label: "", description: "" }}
                      />
                    </div>
                  </TabsContent>

                  {/* ── DESIGN & INSTALLATION ── */}
                  <TabsContent value="design_install" className="p-6 space-y-6 m-0">
                    <div>
                      <SectionHeading>Design Considerations</SectionHeading>
                      <div className="mb-4">
                        <FieldLabel>Design Section Title</FieldLabel>
                        <Input
                          value={active.designTitle ?? ""}
                          onChange={(e) => setField("designTitle", e.target.value)}
                          placeholder="e.g. Design Considerations"
                          className="text-sm"
                        />
                      </div>
                      <StringListEditor
                        label="Design Description Paragraphs"
                        items={active.designParagraphs ?? []}
                        onChange={(v) => setField("designParagraphs", v)}
                        multiline
                        placeholder="Enter design guidelines details..."
                      />
                    </div>

                    <div className="border-t border-border pt-6">
                      <SectionHeading>Installation Guidelines</SectionHeading>
                      <div className="mb-4">
                        <FieldLabel>Installation Section Title</FieldLabel>
                        <Input
                          value={active.installationTitle ?? ""}
                          onChange={(e) => setField("installationTitle", e.target.value)}
                          placeholder="e.g. Installation Guidelines"
                          className="text-sm"
                        />
                      </div>
                      <StringListEditor
                        label="Installation Description Paragraphs"
                        items={active.installationParagraphs ?? []}
                        onChange={(v) => setField("installationParagraphs", v)}
                        multiline
                        placeholder="Enter site preparation, welding and QC guidelines..."
                      />
                    </div>
                  </TabsContent>

                  {/* ── QA & TESTING ── */}
                  <TabsContent value="qa" className="p-6 space-y-6 m-0">
                    <SectionHeading>QA & Testing</SectionHeading>
                    <div className="mb-4">
                      <FieldLabel>QA Section Title</FieldLabel>
                      <Input
                        value={active.qaTitle ?? ""}
                        onChange={(e) => setField("qaTitle", e.target.value)}
                        placeholder="e.g. QA & Testing for Floating Covers"
                        className="text-sm"
                      />
                    </div>

                    <PairsEditor
                      label="Quality Assurance Procedures List"
                      hint="A grid of quality checklist cards (e.g. Material Testing, Seam testing, etc.)."
                      items={(active.qaItems ?? []) as any[]}
                      fields={[
                        { key: "icon", label: "Icon Name", placeholder: "e.g. ClipboardCheck, Gauge, Wrench" },
                        { key: "title", label: "Procedure Name", placeholder: "e.g. Seam Testing" },
                        { key: "description", label: "Description / Specs", placeholder: "e.g. Extrusion & welding quality checks", multiline: true }
                      ]}
                      onChange={(v) => setField("qaItems", v as any[])}
                      newItem={{ icon: "ClipboardCheck", title: "", description: "" }}
                    />
                  </TabsContent>

                  {/* ── PRODUCTS & DOWNLOADS ── */}
                  <TabsContent value="products_downloads" className="p-6 space-y-6 m-0">
                    <div>
                      <SectionHeading>Products Used in this Application</SectionHeading>
                      <div className="mb-4">
                        <FieldLabel>Products Title</FieldLabel>
                        <Input
                          value={active.productsTitle ?? ""}
                          onChange={(e) => setField("productsTitle", e.target.value)}
                          placeholder="e.g. Products Used in this Application"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-3">
                        <FieldLabel hint="Search and add real product family items from the catalog database">
                          Products Linked
                        </FieldLabel>
                        <div className="grid md:grid-cols-2 gap-2">
                          {(active.products ?? []).map((pId) => {
                            const pData = allProducts.find(p => p.id === pId);
                            return (
                              <div key={pId} className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg text-xs font-semibold shadow-sm">
                                <span>{pData ? pData.name : `Product ID: ${pId}`}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                                  onClick={() => setField("products", (active.products ?? []).filter(id => id !== pId))}
                                >
                                  ✕
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-2">
                          <ProductSelector
                            excludeIds={active.products}
                            onSelect={(prod) => setField("products", [...(active.products ?? []), prod.id])}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <SectionHeading>Downloads Section</SectionHeading>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <FieldLabel>Downloads Header Title</FieldLabel>
                          <Input
                            value={active.downloadsTitle ?? ""}
                            onChange={(e) => setField("downloadsTitle", e.target.value)}
                            placeholder="e.g. Technical Downloads & System Specs"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <PairsEditor
                        label="Downloadable PDF Specifications & Brochures"
                        items={(active.downloads ?? []) as any[]}
                        fields={[
                          { key: "label", label: "Document Name", placeholder: "e.g. GSE Smooth HDPE Datasheet" },
                          { key: "url", label: "File URL Path", placeholder: "e.g. /resources/docs/gse-hdpe.pdf" }
                        ]}
                        onChange={(v) => setField("downloads", v as any[])}
                        newItem={{ label: "", url: "" }}
                      />
                    </div>
                  </TabsContent>

                  {/* ── SEO ── */}
                  <TabsContent value="seo" className="p-6 space-y-5 m-0">
                    <SectionHeading>SEO / Meta Tags</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Configure search engine optimization tags for this application category page.
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
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <CheckCircle2 className="h-4 w-4" />
          All changes saved to Supabase
        </div>
      )}
    </>
  );
}
