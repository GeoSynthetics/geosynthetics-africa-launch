import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/components/site/mega-menu-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save, Loader2, ExternalLink, Eye, AlertTriangle, CheckCircle2, ChevronRight,
  Plus, Trash2, Search, ChevronLeft
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";
import { cn, formatSlugInput } from "@/lib/utils";
import { SectionHeading, FieldLabel, StringListEditor, PairsEditor } from "./TemplateEditorShared";
import { ImagePicker } from "./ImagePicker";
import { ProductSelector } from "./ProductSelector";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BulletItem {
  title: string;
  description?: string;
}

export interface CapabilityItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface DownloadItem {
  label: string;
  url: string;
}

export interface ServiceSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface ServiceTemplate {
  title: string;
  description: string;
  heroImage: string;
  badge?: string;
  topSellingProductId?: string;
  topSellingProductIds?: string[];
  
  // Left Column Content
  overviewParagraphs?: string[];
  whyChooseTitle?: string;
  whyChoose?: BulletItem[];
  whatWeDeliverTitle?: string;
  whatWeDeliver?: BulletItem[];
  coverageTitle?: string;
  coverageText?: string;
  coverageBullets?: string[];
  coverageImage?: string;
  coverageCaption?: string;
  
  // Right Column Sidebar Content
  sidebarImage?: string;
  sidebarCaption?: string;
  directModelTitle?: string;
  directModelText?: string;
  directModelItems?: BulletItem[];
  packagingTitle?: string;
  packagingText?: string;
  packagingItems?: string[];
  afcftaTitle?: string;
  afcftaText?: string;
  afcftaItems?: string[];
  playbookTitle?: string;
  playbookItems?: BulletItem[];
  
  // Bottom Stats Row
  statsTitle?: string;
  statsDescription?: string;
  stats?: StatItem[];
  
  // Products & Downloads
  productsTitle?: string;
  products?: string[];
  downloadsTitle?: string;
  downloads?: DownloadItem[];
  
  // Landing Page Specific Fields
  landingTitle?: string;
  landingSubtitle?: string;
  landingHeroImage?: string;
  capabilitiesTitle?: string;
  capabilities?: CapabilityItem[];
  faqs?: { question: string; answer: string }[];
  ctaTitle?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  
  seo: ServiceSeo | null;
  
  // Legacy fields
  content?: {
    features: string[];
    sections: unknown[];
  };
}

type AllServiceTemplates = Record<string, ServiceTemplate>;

const SUPABASE_KEY = "template_services";

// ─── Blank template factory ───────────────────────────────────────────────────

function blankTemplate(): ServiceTemplate {
  return {
    title: "",
    description: "",
    heroImage: "",
    badge: "Services",
    topSellingProductId: "",
    topSellingProductIds: [],
    
    overviewParagraphs: [],
    whyChooseTitle: "Why Choose Geosynthetics Africa?",
    whyChoose: [],
    whatWeDeliverTitle: "What We Deliver — At Speed",
    whatWeDeliver: [],
    coverageTitle: "Pan-African Coverage & Stock Hubs",
    coverageText: "",
    coverageBullets: [],
    coverageImage: "",
    coverageCaption: "",
    
    sidebarImage: "",
    sidebarCaption: "",
    directModelTitle: "Direct Model. Direct Support. No Distributors.",
    directModelText: "",
    directModelItems: [],
    packagingTitle: "Packaging & Transport Optimization",
    packagingText: "",
    packagingItems: [],
    afcftaTitle: "AfCFTA & SADC: Smarter Cross-Border Moves",
    afcftaText: "",
    afcftaItems: [],
    playbookTitle: "Logistics Playbook",
    playbookItems: [],
    
    statsTitle: "Pan-African Delivery and Installation Support",
    statsDescription: "",
    stats: [
      { value: "2+", label: "Export Countries" },
      { value: "19+", label: "Delivery Areas" }
    ],
    
    productsTitle: "Products Supplied",
    products: [],
    downloadsTitle: "Technical Downloads & Guides",
    downloads: [],
    
    landingTitle: "Pan-African Geosynthetics Delivery, Installation & Support",
    landingSubtitle: "Geosynthetics Africa delivers pan-African supply, installation and QA/QC of geosynthetics systems.",
    landingHeroImage: "",
    capabilitiesTitle: "Our Logistics & Installation Capabilities",
    capabilities: [],
    faqs: [],
    ctaTitle: "Let us help you!",
    ctaButtonText: "Contact Us",
    ctaButtonUrl: "/contacts",
    
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    content: { features: [], sections: [] },
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ServicesTemplatesEditor() {
  const [allData, setAllData] = useState<AllServiceTemplates>({});
  const [hierarchyItems, setHierarchyItems] = useState<{ id: string; slug: string; label: string }[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [serviceToDelete, setServiceToDelete] = useState<{ slug: string; label: string } | null>(null);

  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      handleDelete(serviceToDelete.slug);
      setServiceToDelete(null);
    }
  };

  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);

  // DB reference state
  const [allProducts, setAllProducts] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Dynamic list combining the navigation hierarchy items with custom templates from DB
  const categoriesList = useMemo(() => {
    const list = hierarchyItems.map((item) => ({ slug: item.id, label: item.label }));
    
    // Add any template key in allData that is NOT in the hierarchy list
    Object.keys(allData).forEach((slug) => {
      if (slug !== "__landing" && !list.some((item) => item.slug === slug)) {
        list.push({
          slug,
          label: allData[slug]?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        });
      }
    });

    // If hierarchy is empty (e.g. not loaded or default), fallback to static SERVICES
    if (list.length === 0) {
      const fallbackList = SERVICES.map((s) => ({ slug: s.slug, label: s.label }));
      Object.keys(allData).forEach((slug) => {
        if (slug !== "__landing" && !fallbackList.some((item) => item.slug === slug)) {
          fallbackList.push({
            slug,
            label: allData[slug]?.title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
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

  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);

    // Fetch hierarchy first to align the sidebar categories
    const { data: hierarchyRow } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "hierarchy_services")
      .maybeSingle();
    const hierarchy = hierarchyRow?.value as any || {};
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
      toast.error("Failed to load service templates: " + error.message);
    } else {
      const stored = (data?.value ?? {}) as AllServiceTemplates;
      // Pre-seed blank records for any slug not yet in the store
      const seeded: AllServiceTemplates = { ...stored };
      
      // Use hierarchy items for seeding, fallback to static services if empty
      const seedSource = hItems.length > 0
        ? hItems.map(item => ({ slug: item.id, label: item.label }))
        : SERVICES;

      for (const svc of seedSource) {
        if (!seeded[svc.slug]) {
          seeded[svc.slug] = { ...blankTemplate(), title: svc.label };
        } else {
          // Merge default values to prevent crash for templates missing new keys
          seeded[svc.slug] = {
            ...blankTemplate(),
            ...seeded[svc.slug],
            seo: {
              title: seeded[svc.slug].seo?.title || "",
              description: seeded[svc.slug].seo?.description || "",
              keywords: seeded[svc.slug].seo?.keywords || "",
            }
          };
        }
      }

      if (!seeded["__landing"]) {
        seeded["__landing"] = {
          ...blankTemplate(),
          title: "Pan-African Geosynthetics Delivery, Installation & Support",
          description: "Geosynthetics Africa delivers pan-African supply, installation and QA/QC of geosynthetics systems.",
          seo: {
            title: "Services — Geosynthetics Africa",
            description: "Pan-African supply, installation and QA/QC of geosynthetics systems across mining, infrastructure and environmental projects.",
            keywords: "geosynthetics installation, geomembrane welding, SANS 1526, leak detection",
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
    
    if (allData[slug] || hierarchyItems.some(item => item.id === slug)) {
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
    if (slug === "__landing") {
      toast.error("Cannot delete landing page template.");
      return;
    }

    setAllData(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    if (activeSlug === slug) {
      setActiveSlug("__landing");
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
              Services Pages
            </p>
          </div>

          {/* Add new template button at the top */}
          <div className="p-3 border-b border-border space-y-2 shrink-0">
            {showNewSlug ? (
              <div className="space-y-2">
                <Input
                  placeholder="e.g. customized-delivery"
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
                  <div className="truncate font-medium text-xs">Services Landing Page</div>
                  <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                    /services
                  </div>
                </div>
                {activeSlug === "__landing" && <ChevronRight className="h-3 w-3 text-primary" />}
              </button>
            </div>

            {/* Categories Section */}
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Services Categories ({filteredCategories.length !== categoriesList.length ? `${filteredCategories.length}/${categoriesList.length}` : categoriesList.length})
              </p>
              <div className="space-y-0.5">
                {paginatedCategories.map((svc) => {
                  const isActive = svc.slug === activeSlug;
                  const isStatic = svc.slug === "__landing";
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setServiceToDelete({ slug: svc.slug, label: svc.label });
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
            </div>
          </div>

          {/* Pagination footer */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-border flex items-center justify-between bg-surface/50 text-xs shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
              <p className="text-sm font-medium">Select a service from the sidebar to edit</p>
            </div>
          ) : (
            <>
              {/* Panel header bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                    {activeSlug === "__landing" ? "Services Landing Page" : (active.title || activeSlug)}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                      {activeSlug === "__landing" ? "/services" : `/services/${activeSlug}`}
                    </code>
                    {dirty && (
                      <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-8 cursor-pointer">
                    <a href={activeSlug === "__landing" ? "/services" : `/services/${activeSlug}`} target="_blank" rel="noopener noreferrer">
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
                  {activeSlug === "__landing" ? (
                    // Landing page tabs
                    [
                      { id: "hero", label: "Hero" },
                      { id: "capabilities", label: "Capabilities" },
                      { id: "faq_cta", label: "FAQ & CTA" },
                      { id: "seo", label: "SEO" },
                    ].map((t) => (
                      <TabsTrigger
                        key={t.id}
                        value={t.id}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
                      >
                        {t.label}
                      </TabsTrigger>
                    ))
                  ) : (
                    // Child page tabs
                    [
                      { id: "hero", label: "Hero & Stats" },
                      { id: "left_col", label: "Left Column" },
                      { id: "sidebar", label: "Right Sidebar" },
                      { id: "products_downloads", label: "Products & Downloads" },
                      { id: "seo", label: "SEO" },
                    ].map((t) => (
                      <TabsTrigger
                        key={t.id}
                        value={t.id}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
                      >
                        {t.label}
                      </TabsTrigger>
                    ))
                  )}
                </TabsList>

                <div className="flex-1 overflow-y-auto">
                  {/* ──────────────────────────────────────────────────────── */}
                  {/* ── LANDING PAGE TABS ─────────────────────────────────── */}
                  {/* ──────────────────────────────────────────────────────── */}
                  {activeSlug === "__landing" && (
                    <>
                      {/* Hero */}
                      <TabsContent value="hero" className="p-6 space-y-5 m-0">
                        <SectionHeading>Landing Hero Section</SectionHeading>
                        <div>
                          <FieldLabel>Landing Title (H1)</FieldLabel>
                          <Input
                            value={active.landingTitle ?? ""}
                            onChange={(e) => setField("landingTitle", e.target.value)}
                            placeholder="e.g. Pan-African Geosynthetics Delivery, Installation & Support"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <FieldLabel>Landing Subtitle</FieldLabel>
                          <Textarea
                            value={active.landingSubtitle ?? ""}
                            onChange={(e) => setField("landingSubtitle", e.target.value)}
                            placeholder="e.g. Geosynthetics Africa delivers pan-African supply..."
                            className="text-sm min-h-[80px]"
                          />
                        </div>
                        <div>
                          <ImagePicker
                            label="Landing Hero Image"
                            value={active.landingHeroImage ?? ""}
                            onChange={(val) => setField("landingHeroImage", val)}
                          />
                        </div>
                      </TabsContent>

                      {/* Capabilities */}
                      <TabsContent value="capabilities" className="p-6 space-y-5 m-0">
                        <SectionHeading>Our Capabilities Grid</SectionHeading>
                        <div>
                          <FieldLabel>Capabilities Header Title</FieldLabel>
                          <Input
                            value={active.capabilitiesTitle ?? ""}
                            onChange={(e) => setField("capabilitiesTitle", e.target.value)}
                            placeholder="e.g. Our Logistics & Installation Capabilities"
                            className="text-sm"
                          />
                        </div>
                        <PairsEditor
                          label="Capability Cards"
                          hint="List of capabilities. Appears as a grid of cards on /services listing page."
                          items={(active.capabilities ?? []) as any[]}
                          fields={[
                            { key: "icon", label: "Icon Name", placeholder: "e.g. Truck, HardHat, ClipboardCheck", type: "icon" },
                            { key: "title", label: "Capability Title", placeholder: "e.g. HDPE Geomembrane Installation" },
                            { key: "description", label: "Short Paragraph", placeholder: "e.g. Precision installation of HDPE liner...", multiline: true }
                          ]}
                          onChange={(v) => setField("capabilities", v as any[])}
                          newItem={{ icon: "HardHat", title: "", description: "" }}
                        />
                      </TabsContent>

                      {/* FAQ & CTA */}
                      <TabsContent value="faq_cta" className="p-6 space-y-5 m-0">
                        <SectionHeading>Frequently Asked Questions</SectionHeading>
                        <PairsEditor
                          label="Accordion FAQs List"
                          items={(active.faqs ?? []) as any[]}
                          fields={[
                            { key: "question", label: "Question Text" },
                            { key: "answer", label: "Answer Text", multiline: true }
                          ]}
                          onChange={(v) => setField("faqs", v as any[])}
                          newItem={{ question: "", answer: "" }}
                        />

                        <SectionHeading>CTA Banner Box</SectionHeading>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <FieldLabel>CTA Title Text</FieldLabel>
                            <Input
                              value={active.ctaTitle ?? ""}
                              onChange={(e) => setField("ctaTitle", e.target.value)}
                              placeholder="e.g. Let us help you!"
                            />
                          </div>
                          <div>
                            <FieldLabel>CTA Button Text</FieldLabel>
                            <Input
                              value={active.ctaButtonText ?? ""}
                              onChange={(e) => setField("ctaButtonText", e.target.value)}
                              placeholder="Contact Us"
                            />
                          </div>
                          <div>
                            <FieldLabel>CTA Button Redirect Link</FieldLabel>
                            <Input
                              value={active.ctaButtonUrl ?? ""}
                              onChange={(e) => setField("ctaButtonUrl", e.target.value)}
                              placeholder="/contacts"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </>
                  )}

                  {/* ──────────────────────────────────────────────────────── */}
                  {/* ── CHILD PAGE TABS ───────────────────────────────────── */}
                  {/* ──────────────────────────────────────────────────────── */}
                  {activeSlug !== "__landing" && (
                    <>
                      {/* Hero & Stats */}
                      <TabsContent value="hero" className="p-6 space-y-5 m-0">
                        <SectionHeading>Hero Section</SectionHeading>
                        <div className="grid md:grid-cols-2 gap-4">
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
                            <FieldLabel hint="E.g. Supplier of Geosynthetic Materials">Category Badge Text</FieldLabel>
                            <Input
                              value={active.badge ?? ""}
                              onChange={(e) => setField("badge", e.target.value)}
                              placeholder="e.g. Supplier of Geosynthetic Materials"
                              className="text-sm font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <ImagePicker
                            label="Hero Background Image"
                            value={active.heroImage ?? ""}
                            onChange={(val) => setField("heroImage", val)}
                          />
                        </div>
                        <div>
                          <FieldLabel>Hero Subtitle / Description</FieldLabel>
                          <Textarea
                            value={active.description ?? ""}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder="Enter short hero summary..."
                            className="text-sm min-h-[80px]"
                          />
                        </div>

                        <SectionHeading>Bottom Stats / Metrics Bar</SectionHeading>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel>Stats Header Title</FieldLabel>
                            <Input
                              value={active.statsTitle ?? ""}
                              onChange={(e) => setField("statsTitle", e.target.value)}
                              placeholder="e.g. Pan-African Delivery And Logistics Support"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <FieldLabel>Stats Short Description</FieldLabel>
                            <Input
                              value={active.statsDescription ?? ""}
                              onChange={(e) => setField("statsDescription", e.target.value)}
                              placeholder="Mirafi and GSE are registered trademarks..."
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <PairsEditor
                          label="Metrics Counters"
                          items={(active.stats ?? []) as any[]}
                          fields={[
                            { key: "value", label: "Metric Value", placeholder: "e.g. 19+" },
                            { key: "label", label: "Metric Label", placeholder: "e.g. Delivery Areas" }
                          ]}
                          onChange={(v) => setField("stats", v as any[])}
                          newItem={{ value: "", label: "" }}
                        />
                      </TabsContent>

                      {/* Left Column Content */}
                      <TabsContent value="left_col" className="p-6 space-y-6 m-0">
                        <SectionHeading>Main Description Paragraphs</SectionHeading>
                        <StringListEditor
                          label="Overview Text Paragraphs"
                          items={active.overviewParagraphs ?? []}
                          onChange={(v) => setField("overviewParagraphs", v)}
                          multiline
                        />

                        <div className="border-t border-border pt-6">
                          <SectionHeading>Why Choose Section</SectionHeading>
                          <div className="mb-4">
                            <FieldLabel>Why Choose Heading</FieldLabel>
                            <Input
                              value={active.whyChooseTitle ?? ""}
                              onChange={(e) => setField("whyChooseTitle", e.target.value)}
                              placeholder="Why Choose Geosynthetics Africa?"
                              className="text-sm font-bold"
                            />
                          </div>
                          <PairsEditor
                            label="Why Choose Bullet Points"
                            items={(active.whyChoose ?? []) as any[]}
                            fields={[
                              { key: "title", label: "Bullet Title (bold text)", placeholder: "e.g. Direct-to-Customer Pricing" },
                              { key: "description", label: "Bullet Detail Text", placeholder: "e.g. No distributors, no hidden agents.", multiline: true }
                            ]}
                            onChange={(v) => setField("whyChoose", v as any[])}
                            newItem={{ title: "", description: "" }}
                          />
                        </div>

                        <div className="border-t border-border pt-6">
                          <SectionHeading>What We Deliver Section</SectionHeading>
                          <div className="mb-4">
                            <FieldLabel>What We Deliver Heading</FieldLabel>
                            <Input
                              value={active.whatWeDeliverTitle ?? ""}
                              onChange={(e) => setField("whatWeDeliverTitle", e.target.value)}
                              placeholder="What We Deliver — At Speed"
                              className="text-sm font-bold"
                            />
                          </div>
                          <PairsEditor
                            label="What We Deliver Grid Items"
                            items={(active.whatWeDeliver ?? []) as any[]}
                            fields={[
                              { key: "title", label: "Item Name", placeholder: "e.g. GSE HDPE Liners" },
                              { key: "description", label: "Specifications Description", placeholder: "e.g. GM-13 compliant smooth & textured liners.", multiline: true }
                            ]}
                            onChange={(v) => setField("whatWeDeliver", v as any[])}
                            newItem={{ title: "", description: "" }}
                          />
                        </div>

                        <div className="border-t border-border pt-6 space-y-4">
                          <SectionHeading>Pan-African Coverage & Stock Hubs Section</SectionHeading>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <FieldLabel>Coverage Section Title</FieldLabel>
                              <Input
                                value={active.coverageTitle ?? ""}
                                onChange={(e) => setField("coverageTitle", e.target.value)}
                                placeholder="Pan-African Coverage & Stock Hubs"
                              />
                            </div>
                            <div>
                              <FieldLabel>Coverage Description Text</FieldLabel>
                              <Input
                                value={active.coverageText ?? ""}
                                onChange={(e) => setField("coverageText", e.target.value)}
                                placeholder="From South Africa into SADC, ECOWAS..."
                              />
                            </div>
                          </div>
                          <StringListEditor
                            label="Coverage Stock Hub Bullets"
                            items={active.coverageBullets ?? []}
                            onChange={(v) => setField("coverageBullets", v)}
                            placeholder="e.g. Southern Africa: Road-ready dispatch"
                          />
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <ImagePicker
                                label="Coverage Section Image"
                                value={active.coverageImage ?? ""}
                                onChange={(val) => setField("coverageImage", val)}
                              />
                            </div>
                            <div>
                              <FieldLabel>Image Caption</FieldLabel>
                              <Input
                                value={active.coverageCaption ?? ""}
                                onChange={(e) => setField("coverageCaption", e.target.value)}
                                placeholder="e.g. Geosynthetics Africa stock dispatch"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Right Column Sidebar Content */}
                      <TabsContent value="sidebar" className="p-6 space-y-6 m-0">
                        <SectionHeading>Top Sidebar Image</SectionHeading>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <ImagePicker
                              label="Sidebar Image"
                              value={active.sidebarImage ?? ""}
                              onChange={(val) => setField("sidebarImage", val)}
                            />
                          </div>
                          <div>
                            <FieldLabel>Sidebar Image Caption</FieldLabel>
                            <Input
                              value={active.sidebarCaption ?? ""}
                              onChange={(e) => setField("sidebarCaption", e.target.value)}
                              placeholder="Consignment transport on-site"
                            />
                          </div>
                        </div>

                        <div className="border-t border-border pt-6">
                          <SectionHeading>Direct Model Box</SectionHeading>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <FieldLabel>Direct Model Heading</FieldLabel>
                              <Input
                                value={active.directModelTitle ?? ""}
                                onChange={(e) => setField("directModelTitle", e.target.value)}
                                placeholder="Direct Model. Direct Support."
                              />
                            </div>
                            <div>
                              <FieldLabel>Direct Model Description Text</FieldLabel>
                              <Input
                                value={active.directModelText ?? ""}
                                onChange={(e) => setField("directModelText", e.target.value)}
                                placeholder="We keep it simple: one team, one price."
                              />
                            </div>
                          </div>
                          <PairsEditor
                            label="Direct Model Points"
                            items={(active.directModelItems ?? []) as any[]}
                            fields={[
                              { key: "title", label: "Point Name", placeholder: "e.g. One Team" },
                              { key: "description", label: "Description detail", placeholder: "e.g. Sales, logistics, and technical support." }
                            ]}
                            onChange={(v) => setField("directModelItems", v as any[])}
                            newItem={{ title: "", description: "" }}
                          />
                        </div>

                        <div className="border-t border-border pt-6">
                          <SectionHeading>Packaging & Transport Optimization</SectionHeading>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <FieldLabel>Section Title</FieldLabel>
                              <Input
                                value={active.packagingTitle ?? ""}
                                onChange={(e) => setField("packagingTitle", e.target.value)}
                                placeholder="Packaging & Transport Optimization"
                              />
                            </div>
                            <div>
                              <FieldLabel>Description Text</FieldLabel>
                              <Input
                                value={active.packagingText ?? ""}
                                onChange={(e) => setField("packagingText", e.target.value)}
                                placeholder="We tailor packaging to the journey:"
                              />
                            </div>
                          </div>
                          <StringListEditor
                            label="Optimization Bullets"
                            items={active.packagingItems ?? []}
                            onChange={(v) => setField("packagingItems", v)}
                            placeholder="e.g. Container fill plans (20' / 40' / HC)"
                          />
                        </div>

                        <div className="border-t border-border pt-6">
                          <SectionHeading>AfCFTA & SADC Moves</SectionHeading>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <FieldLabel>Section Title</FieldLabel>
                              <Input
                                value={active.afcftaTitle ?? ""}
                                onChange={(e) => setField("afcftaTitle", e.target.value)}
                                placeholder="AfCFTA & SADC Moves"
                              />
                            </div>
                            <div>
                              <FieldLabel>Description Text</FieldLabel>
                              <Input
                                value={active.afcftaText ?? ""}
                                onChange={(e) => setField("afcftaText", e.target.value)}
                                placeholder="We issue certificates of origin..."
                              />
                            </div>
                          </div>
                          <StringListEditor
                            label="Cross-Border Bullets"
                            items={active.afcftaItems ?? []}
                            onChange={(v) => setField("afcftaItems", v)}
                            placeholder="e.g. HS-code aligned invoices"
                          />
                        </div>

                        <div className="border-t border-border pt-6">
                          <SectionHeading>Logistics Playbook</SectionHeading>
                          <div className="mb-4">
                            <FieldLabel>Playbook Title</FieldLabel>
                            <Input
                              value={active.playbookTitle ?? ""}
                              onChange={(e) => setField("playbookTitle", e.target.value)}
                              placeholder="Logistics Playbook"
                              className="text-sm font-bold"
                            />
                          </div>
                          <PairsEditor
                            label="Playbook Rows"
                            items={(active.playbookItems ?? []) as any[]}
                            fields={[
                              { key: "title", label: "Mode (e.g. Road, Rail/ICD, Sea)", placeholder: "e.g. Road" },
                              { key: "description", label: "Details", placeholder: "e.g. Dedicated vehicles with border files pre-cleared." }
                            ]}
                            onChange={(v) => setField("playbookItems", v as any[])}
                            newItem={{ title: "", description: "" }}
                          />
                        </div>
                      </TabsContent>

                      {/* Products & Downloads */}
                      <TabsContent value="products_downloads" className="p-6 space-y-6 m-0">
                        <div>
                          <FieldLabel>Products Title</FieldLabel>
                          <Input
                            value={active.productsTitle ?? ""}
                            onChange={(e) => setField("productsTitle", e.target.value)}
                            placeholder="e.g. Products Supplied"
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

                        <div className="border-t border-border pt-6 space-y-3">
                          <FieldLabel hint="Select up to 5 top-selling products for this service to display as a slider in the mega menu">
                            Top Selling Products (Max 5)
                          </FieldLabel>
                          
                          <div className="space-y-2 max-w-md">
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
                        </div>

                        <div className="border-t border-border pt-6">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <FieldLabel>Downloads Title</FieldLabel>
                              <Input
                                value={active.downloadsTitle ?? ""}
                                onChange={(e) => setField("downloadsTitle", e.target.value)}
                                placeholder="e.g. Technical Downloads"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <PairsEditor
                            label="Downloadable Specifications (PDF)"
                            items={(active.downloads ?? []) as any[]}
                            fields={[
                              { key: "label", label: "Document Name", placeholder: "e.g. logistics specsheet" },
                              { key: "url", label: "File URL Path", placeholder: "e.g. /resources/docs/logistics.pdf" }
                            ]}
                            onChange={(v) => setField("downloads", v as any[])}
                            newItem={{ label: "", url: "" }}
                          />
                        </div>
                      </TabsContent>
                    </>
                  )}

                  {/* Meta Tags / SEO (Shared) */}
                  <TabsContent value="seo" className="p-6 space-y-5 m-0">
                    <SectionHeading>SEO / Meta Tags</SectionHeading>
                    <p className="text-xs text-muted-foreground mb-4">
                      Configure the search engine optimization tags for this page.
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
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <CheckCircle2 className="h-4 w-4" />
          All changes saved to Supabase
        </div>
      )}
      <DeleteConfirmationDialog
        isOpen={!!serviceToDelete}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Service Template?"
        description="This will remove the template for this custom service. You still need to click Save All to persist."
        itemName={serviceToDelete?.label}
        idPrefix="service-template"
      />
    </>
  );
}
