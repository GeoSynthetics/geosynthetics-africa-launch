import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRIES } from "@/components/site/mega-menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Loader2,
  ExternalLink,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  Search,
  ChevronLeft,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";
import { cn, formatSlugInput } from "@/lib/utils";
import { getDefaultSections } from "@/lib/hierarchy-utils";
import {
  SectionHeading,
  FieldLabel,
  StringListEditor,
  TemplatesEditorSkeleton,
} from "./TemplateEditorShared";
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
    applications: any[];
    sections: unknown[];
  };
  topSellingProductId?: string;
  topSellingProductIds?: string[];
  caseStudies?: string[];
  keyProducts?: string[];
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
    caseStudies: [],
    keyProducts: [],
    seo: null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IndustriesTemplatesEditor() {
  const [allData, setAllData] = useState<AllIndustryTemplates>({});
  const [hierarchyItems, setHierarchyItems] = useState<
    { id: string; slug: string; label: string }[]
  >([]);
  const [rawHierarchy, setRawHierarchy] = useState<any>(null);
  const [hierarchyDirty, setHierarchyDirty] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [industryToDelete, setIndustryToDelete] = useState<{ slug: string; label: string } | null>(
    null,
  );

  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleConfirmDelete = () => {
    if (industryToDelete) {
      handleDelete(industryToDelete.slug);
      setIndustryToDelete(null);
    }
  };

  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);
  const [allProducts, setAllProducts] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [allCaseStudies, setAllCaseStudies] = useState<
    { id: string; title: string; slug: string }[]
  >([]);

  // Load products from DB
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("id, name, slug").order("name");
      if (data) setAllProducts(data);
    }
    fetchProducts();
  }, []);

  // Load case studies from DB
  useEffect(() => {
    async function fetchCaseStudies() {
      const { data } = await supabase.from("case_studies").select("id, title, slug").order("title");
      if (data) setAllCaseStudies(data);
    }
    fetchCaseStudies();
  }, []);

  // Dynamic list combining static mega-menu industries with custom ones from DB
  // Dynamic list combining the navigation hierarchy items with custom templates from DB
  const categoriesList = useMemo(() => {
    const list = hierarchyItems.map((item) => ({ slug: item.id, label: item.label }));

    // Add any template key in allData that is NOT in the hierarchy list
    Object.keys(allData).forEach((slug) => {
      if (slug !== "__landing" && !list.some((item) => item.slug === slug)) {
        list.push({
          slug,
          label:
            allData[slug]?.title ||
            slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
        });
      }
    });

    // If hierarchy is empty (e.g. not loaded or default), fallback to static INDUSTRIES
    if (list.length === 0) {
      const fallbackList = INDUSTRIES.map((i) => ({ slug: i.slug, label: i.label }));
      Object.keys(allData).forEach((slug) => {
        if (slug !== "__landing" && !fallbackList.some((item) => item.slug === slug)) {
          fallbackList.push({
            slug,
            label:
              allData[slug]?.title ||
              slug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" "),
          });
        }
      });
      return fallbackList;
    }

    return list;
  }, [allData, hierarchyItems]);

  const filteredCategories = useMemo(() => {
    return categoriesList.filter((cat) => {
      const search = searchQuery.toLowerCase();
      return cat.label.toLowerCase().includes(search) || cat.slug.toLowerCase().includes(search);
    });
  }, [categoriesList, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    return filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredCategories, currentPage]);

  // Synchronize current page when activeSlug changes
  useEffect(() => {
    if (activeSlug && activeSlug !== "__landing") {
      const index = filteredCategories.findIndex((c) => c.slug === activeSlug);
      if (index !== -1) {
        const page = Math.floor(index / itemsPerPage) + 1;
        if (page !== currentPage) {
          setCurrentPage(page);
        }
      }
    }
  }, [activeSlug, filteredCategories, currentPage]);

  // ── Load from Supabase ──
  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);

    // Fetch hierarchy first to align the sidebar categories
    const { data: hierarchyRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "hierarchy_industries")
      .maybeSingle();

    const defaults = getDefaultSections();
    const defaultIndustries = defaults.find((d) => d.key === "industries")!;
    const hierarchy = (hierarchyRow?.value as any)?.items
      ? (hierarchyRow?.value as any)
      : defaultIndustries;
    setRawHierarchy(hierarchy);
    const hItems = (hierarchy.items || []).map((item: any) => ({
      id: item.id,
      slug: item.slug || item.id,
      label: item.label,
    }));
    setHierarchyItems(hItems);

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

      // Use hierarchy items for seeding, fallback to static industries if empty
      const seedSource =
        hItems.length > 0
          ? hItems.map((item: any) => ({ slug: item.id, label: item.label }))
          : INDUSTRIES;

      for (const ind of seedSource) {
        if (!seeded[ind.slug]) {
          seeded[ind.slug] = { ...blankTemplate(), title: ind.label };
        } else {
          seeded[ind.slug] = {
            ...blankTemplate(),
            ...seeded[ind.slug],
          };
        }
      }
      setAllData(seeded);
      if (!activeSlug) {
        const defaultSlug = seedSource[0]?.slug ?? "";
        setActiveSlug(defaultSlug);
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
    const slug = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    if (allData[slug] || hierarchyItems.some((item) => item.id === slug)) {
      toast.error("A template with that slug already exists.");
      return;
    }

    const label = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    setAllData((prev) => ({
      ...prev,
      [slug]: { ...blankTemplate(), title: label },
    }));
    setActiveSlug(slug);
    setNewSlug("");
    setShowNewSlug(false);
    setDirty(true);
    toast.success(`Created template for "${slug}". Edit and save.`);
  };

  const handleDelete = (slug: string) => {
    if (slug === "__landing") {
      toast.error("Cannot delete landing page template.");
      return;
    }

    setAllData((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    if (rawHierarchy) {
      const updatedItems = (rawHierarchy.items || []).filter(
        (item: any) => item.id !== slug && item.slug !== slug,
      );
      const updatedHierarchy = { ...rawHierarchy, items: updatedItems };
      setRawHierarchy(updatedHierarchy);
      setHierarchyItems(
        updatedItems.map((item: any) => ({
          id: item.id,
          slug: item.slug || item.id,
          label: item.label,
        })),
      );
      setHierarchyDirty(true);
    }

    if (activeSlug === slug) {
      const nextActive = categoriesList.find((c) => c.slug !== slug)?.slug ?? "";
      setActiveSlug(nextActive);
    }
    setDirty(true);
    toast.success(`Deleted template "${slug}". Save to persist changes.`);
  };

  // ── Save to Supabase ──
  const handleSave = async () => {
    setSaving(true);

    const { error: templateError } = await supabase
      .from("site_config")
      .upsert({ key: SUPABASE_KEY, value: allData as any }, { onConflict: "key" });

    let hierarchyError = null;
    if (hierarchyDirty && rawHierarchy) {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: "hierarchy_industries", value: rawHierarchy }, { onConflict: "key" });
      hierarchyError = error;
    }

    if (templateError || hierarchyError) {
      toast.error(
        "Save failed: " +
          (templateError?.message || "") +
          (hierarchyError ? " | Hierarchy: " + hierarchyError.message : ""),
      );
    } else {
      toast.success("Industry templates and navigation saved successfully!");
      setDirty(false);
      setHierarchyDirty(false);
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

  const setApplications = (applications: any[]) =>
    updateActive((prev) => ({
      ...prev,
      content: { ...prev.content, applications },
    }));

  if (loading) {
    return <TemplatesEditorSkeleton />;
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
              Industries (
              {filteredCategories.length !== categoriesList.length
                ? `${filteredCategories.length}/${categoriesList.length}`
                : categoriesList.length}
              )
            </p>
          </div>

          {/* Add new template button at the top */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            {showNewSlug ? (
              <div className="space-y-2">
                <Input
                  placeholder="e.g. defense-aerospace"
                  value={newSlug}
                  onChange={(e) => setNewSlug(formatSlugInput(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNew();
                    if (e.key === "Escape") setShowNewSlug(false);
                  }}
                  className="text-xs h-8"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={handleAddNew}
                    className="flex-1 h-7 text-xs bg-primary hover:bg-primary-hover text-white border-0 cursor-pointer"
                  >
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowNewSlug(false);
                      setNewSlug("");
                    }}
                    className="h-7 text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewSlug(true)}
                className="w-full h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> New Template
              </Button>
            )}
          </div>

          {/* Search Box inside sidebar */}
          <div className="px-3 py-1.5 relative border-b border-border shrink-0">
            <Search className="absolute left-5.5 top-3.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-8 text-xs bg-surface"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {paginatedCategories.map((ind) => {
              const isActive = ind.slug === activeSlug;
              const isStatic = ind.slug === "__landing";
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
            {filteredCategories.length === 0 && (
              <p className="text-center text-[10px] text-muted-foreground py-4">No results</p>
            )}
          </div>

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-border flex items-center justify-between bg-surface/50 text-xs shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                <ChevronLeft className="h-3 w-3 mr-1" /> Prev
              </Button>
              <span className="text-muted-foreground font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Next <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
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
                      /{activeSlug}
                    </code>
                    {dirty && (
                      <span className="text-[10px] text-amber-500 font-bold">
                        ● Unsaved Changes
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <a href={`/${activeSlug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" /> Preview
                    </a>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !dirty}
                    className="bg-primary hover:bg-primary-hover text-white font-bold text-xs h-8 gap-1.5"
                  >
                    {saving ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3" />
                    )}
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
                    { id: "case-studies", label: "Case Studies" },
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
                    {(() => {
                      const rawApps = active.content?.applications ?? [];
                      const normalizedApps = rawApps.map((app: any) => {
                        if (typeof app === "string") {
                          return { heading: app, description: "", link: "" };
                        }
                        return {
                          heading: app.heading || app.title || "",
                          description: app.description || "",
                          link: app.link || app.to || "",
                        };
                      });

                      const updateApp = (
                        index: number,
                        patch: Partial<{ heading: string; description: string; link: string }>,
                      ) => {
                        const next = normalizedApps.map((app, idx) => {
                          if (idx === index) return { ...app, ...patch };
                          return app;
                        });
                        setApplications(next);
                      };

                      const addApp = () => {
                        setApplications([
                          ...normalizedApps,
                          { heading: "", description: "", link: "" },
                        ]);
                      };

                      const removeApp = (index: number) => {
                        setApplications(normalizedApps.filter((_, idx) => idx !== index));
                      };

                      return (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <SectionHeading>Key Applications</SectionHeading>
                              <p className="text-xs text-muted-foreground">
                                Configure structured key applications for this industry (heading,
                                description, and link path).
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={addApp}
                              className="gap-1 text-xs shrink-0 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Application
                            </Button>
                          </div>

                          <div className="space-y-4 max-w-2xl">
                            {normalizedApps.map((app, idx) => (
                              <div
                                key={idx}
                                className="border border-border rounded-lg p-4 bg-background space-y-3 relative group"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeApp(idx)}
                                  className="absolute top-2 right-2 h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid sm:grid-cols-2 gap-3">
                                  <div>
                                    <FieldLabel>Heading</FieldLabel>
                                    <Input
                                      value={app.heading}
                                      onChange={(e) => updateApp(idx, { heading: e.target.value })}
                                      placeholder="e.g. Heap Leach Pad Lining"
                                      className="text-xs h-8"
                                    />
                                  </div>
                                  <div>
                                    <FieldLabel>Link Path (optional)</FieldLabel>
                                    <Input
                                      value={app.link}
                                      onChange={(e) => updateApp(idx, { link: e.target.value })}
                                      placeholder="e.g. /applications/mining-systems"
                                      className="text-xs h-8"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <FieldLabel>Description</FieldLabel>
                                  <Textarea
                                    value={app.description}
                                    onChange={(e) =>
                                      updateApp(idx, { description: e.target.value })
                                    }
                                    placeholder="Provide a detailed description of this key application..."
                                    className="text-xs min-h-[60px] resize-none"
                                  />
                                </div>
                              </div>
                            ))}

                            {normalizedApps.length === 0 && (
                              <p className="text-xs text-muted-foreground italic py-4">
                                No key applications configured.
                              </p>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </TabsContent>

                  {/* ── CASE STUDIES ── */}
                  <TabsContent value="case-studies" className="p-6 space-y-5 m-0">
                    <SectionHeading>Featured Case Studies (Nominated)</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Select and order specific case studies to feature on this industry page. If
                      none are selected, the system will fall back to automatically matching by
                      sector.
                    </p>

                    <div className="space-y-2 max-w-md mb-4">
                      {(active.caseStudies ?? []).map((csId) => {
                        const csData = allCaseStudies.find((c) => c.id === csId);
                        return (
                          <div
                            key={csId}
                            className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg text-xs font-semibold shadow-sm"
                          >
                            <span>{csData ? csData.title : `Case Study ID: ${csId}`}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() =>
                                setField(
                                  "caseStudies",
                                  (active.caseStudies ?? []).filter((id) => id !== csId),
                                )
                              }
                            >
                              ✕
                            </Button>
                          </div>
                        );
                      })}

                      {(!active.caseStudies || active.caseStudies.length === 0) && (
                        <p className="text-xs text-muted-foreground italic">
                          No specific case studies nominated (falling back to auto-matching by
                          sector).
                        </p>
                      )}
                    </div>

                    <div className="max-w-md pt-2">
                      <FieldLabel>Nominate a Case Study</FieldLabel>
                      <select
                        className="w-full text-xs border border-border bg-background rounded-lg p-2 h-9 text-foreground cursor-pointer focus:ring-1 focus:ring-primary focus:border-primary"
                        value=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const currentIds = active.caseStudies ?? [];
                            if (!currentIds.includes(val)) {
                              setField("caseStudies", [...currentIds, val]);
                            }
                          }
                        }}
                      >
                        <option value="" disabled>
                          -- Select a case study to nominate --
                        </option>
                        {allCaseStudies
                          .filter((cs) => !(active.caseStudies ?? []).includes(cs.id))
                          .map((cs) => (
                            <option key={cs.id} value={cs.id}>
                              {cs.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </TabsContent>

                  {/* ── PRODUCTS ── */}
                  <TabsContent value="products" className="p-6 space-y-6 m-0">
                    <div>
                      <SectionHeading>Mega Menu Top Selling Products (Max 5)</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Select up to 5 top-selling products for this industry to show as a slider in
                        the mega menu dropdown.
                      </p>

                      <div className="space-y-2 max-w-md mb-4">
                        {(active.topSellingProductIds ?? []).map((pId) => {
                          const pData = allProducts.find((p) => p.id === pId);
                          return (
                            <div
                              key={pId}
                              className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg text-xs font-semibold shadow-sm"
                            >
                              <span>{pData ? pData.name : `Product ID: ${pId}`}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                                onClick={() =>
                                  setField(
                                    "topSellingProductIds",
                                    (active.topSellingProductIds ?? []).filter((id) => id !== pId),
                                  )
                                }
                              >
                                ✕
                              </Button>
                            </div>
                          );
                        })}

                        {(!active.topSellingProductIds ||
                          active.topSellingProductIds.length === 0) &&
                          !active.topSellingProductId && (
                            <p className="text-xs text-muted-foreground italic">
                              No top selling products selected.
                            </p>
                          )}

                        {(!active.topSellingProductIds ||
                          active.topSellingProductIds.length === 0) &&
                          active.topSellingProductId && (
                            <div className="flex items-center justify-between p-2.5 bg-background border border-amber-500/30 rounded-lg text-xs font-semibold shadow-sm">
                              <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                {allProducts.find((p) => p.id === active.topSellingProductId)
                                  ?.name || `Product ID: ${active.topSellingProductId}`}{" "}
                                (Legacy Single)
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
                              ...(active.topSellingProductId ? [active.topSellingProductId] : []),
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
                    </div>

                    <div className="border-t border-border pt-6 mt-6">
                      <SectionHeading>Industry Page Featured Products (3 to 5)</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Nominate 3 to 5 products to display as a featured products block on the
                        industry detail page.
                      </p>

                      <div className="space-y-2 max-w-md mb-4">
                        {(active.keyProducts ?? []).map((pId) => {
                          const pData = allProducts.find((p) => p.id === pId);
                          return (
                            <div
                              key={pId}
                              className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg text-xs font-semibold shadow-sm"
                            >
                              <span>{pData ? pData.name : `Product ID: ${pId}`}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:bg-destructive/10 cursor-pointer"
                                onClick={() =>
                                  setField(
                                    "keyProducts",
                                    (active.keyProducts ?? []).filter((id) => id !== pId),
                                  )
                                }
                              >
                                ✕
                              </Button>
                            </div>
                          );
                        })}

                        {(!active.keyProducts || active.keyProducts.length === 0) && (
                          <p className="text-xs text-muted-foreground italic">
                            No featured products selected.
                          </p>
                        )}
                      </div>

                      {(!active.keyProducts || active.keyProducts.length < 5) && (
                        <div className="max-w-md pt-2">
                          <ProductSelector
                            excludeIds={active.keyProducts ?? []}
                            onSelect={(prod) => {
                              let currentIds = active.keyProducts ?? [];
                              setField("keyProducts", [...currentIds, prod.id]);
                            }}
                          />
                        </div>
                      )}
                    </div>
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
                      <FieldLabel hint="Recommended: 150–160 characters">
                        Meta Description
                      </FieldLabel>
                      <Textarea
                        value={active.seo?.description ?? ""}
                        onChange={(e) => setSeo({ description: e.target.value })}
                        placeholder="Engineered geosynthetic solutions for mining operations across Africa…"
                        className="text-sm min-h-[96px] resize-none"
                      />
                    </div>
                    <div>
                      <FieldLabel hint="Comma-separated list of search keywords">
                        Meta Keywords
                      </FieldLabel>
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
