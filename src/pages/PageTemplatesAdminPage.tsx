import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { SEED_CATEGORIES, type ProductPageContent } from "@/data/product-pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ExternalLink,
  Database,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  Copy,
  Search,
  ChevronLeft,
} from "lucide-react";
import { ProjectsTemplatesEditor } from "@/components/admin/ProjectsTemplatesEditor";
import { QATemplatesEditor } from "@/components/admin/QATemplatesEditor";
import { ApplicationsTemplatesEditor } from "@/components/admin/ApplicationsTemplatesEditor";
import { ServicesTemplatesEditor } from "@/components/admin/ServicesTemplatesEditor";
import { IndustriesTemplatesEditor } from "@/components/admin/IndustriesTemplatesEditor";
import { CountriesTemplatesEditor } from "@/components/admin/CountriesTemplatesEditor";
import {
  SectionHeading,
  FieldLabel,
  StringListEditor,
  PairsEditor,
  PropertiesTableEditor,
  TemplatesEditorSkeleton,
} from "@/components/admin/TemplateEditorShared";
import { toast } from "sonner";
import { cn, formatSlugInput } from "@/lib/utils";
import { getDefaultSections } from "@/lib/hierarchy-utils";
import type { HierarchySection, HierarchyChild } from "@/types/hierarchy";

const SUPABASE_KEY = "template_product_categories";

// ─── Shared sub-editor components are imported from TemplateEditorShared.tsx ──
// SectionHeading, FieldLabel, StringListEditor, PairsEditor, PropertiesTableEditor

// ─── Main Page Component ──────────────────────────────────────────────────────

export function PageTemplatesAdminPage() {
  const [editorType, setEditorType] = useState<
    | "products"
    | "projects"
    | "quality-assurance"
    | "applications"
    | "services"
    | "industries"
    | "countries"
  >("products");
  const [allData, setAllData] = useState<Record<string, ProductPageContent>>({});
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);

  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleConfirmDelete = () => {
    if (slugToDelete) {
      handleDelete(slugToDelete);
      setSlugToDelete(null);
    }
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);

  // ── Megamenu Integration States ──
  const [hierarchyProducts, setHierarchyProducts] = useState<HierarchySection | null>(null);
  const [hierarchyDirty, setHierarchyDirty] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [linkingMenu, setLinkingMenu] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [dupSlug, setDupSlug] = useState("");

  const handleDuplicate = () => {
    if (!activeSlug || !active) return;
    const cleanSlug = dupSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    if (!cleanSlug) {
      toast.error("Please enter a valid slug.");
      return;
    }
    if (allData[cleanSlug]) {
      toast.error("A template with that slug already exists.");
      return;
    }

    const duplicated: ProductPageContent = {
      ...active,
      slug: cleanSlug,
      label: `${active.label} (Copy)`,
      category: active.category,
    };

    setAllData((prev) => ({
      ...prev,
      [cleanSlug]: duplicated,
    }));
    setActiveSlug(cleanSlug);
    setDupSlug("");
    setDuplicateDialogOpen(false);
    setDirty(true);
    toast.success(`Duplicated successfully as "${duplicated.label}". Click Save to commit.`);
  };

  // Helper to remove dynamic page templates from all parent categories in hierarchy
  const cleanHierarchy = (h: HierarchySection, slug: string): HierarchySection => {
    return {
      ...h,
      items: h.items.map((item) => ({
        ...item,
        children: (item.children || []).filter((c) => c.id !== slug && c.slug !== slug),
      })),
    };
  };

  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);

    // Load page templates and hierarchy products in parallel
    const [templatesRes, hierarchyRes] = await Promise.all([
      supabase.from("site_config").select("value").eq("key", SUPABASE_KEY).maybeSingle(),
      supabase.from("site_config").select("value").eq("key", "hierarchy_products").maybeSingle(),
    ]);

    const { data, error } = templatesRes;
    const { data: hierarchyData, error: hierarchyError } = hierarchyRes;

    if (error) {
      toast.error("Failed to load templates: " + error.message);
    } else {
      const templates = (data?.value as Record<string, ProductPageContent>) || {};
      if (!templates["__landing"]) {
        templates["__landing"] = {
          slug: "__landing",
          label: "Products Landing Page",
          heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
          subtitle:
            "Browse our full catalogue of geosynthetic products — sourced from global best-in-class manufacturers and specified to fit your engineered system.",
          description: [],
          features: [],
          popularProducts: [],
          seo: {
            title: "Products — Geosynthetics Africa",
            description:
              "Browse 200+ geosynthetic products: HDPE Geomembranes, Geotextiles, Geogrids, Geocells, GCLs, Drainage Composites and more.",
            keywords: "geosynthetics, geomembranes, geotextiles, geogrids, geocells, gcl",
          },
        } as any;
      }
      setAllData(templates);

      // Auto-select slug from URL search param if present and exists in loaded templates
      const urlParams = new URLSearchParams(window.location.search);
      const querySlug = urlParams.get("slug");
      if (querySlug && templates[querySlug]) {
        setActiveSlug(querySlug);
      } else {
        setActiveSlug(templates["__landing"] ? "__landing" : Object.keys(templates)[0] || "");
      }
    }

    if (hierarchyError) {
      console.error("Failed to load mega menu configuration:", hierarchyError);
    } else {
      const defaults = getDefaultSections();
      const defaultProducts = defaults.find((d) => d.key === "products") || null;
      setHierarchyProducts((hierarchyData?.value as HierarchySection) ?? defaultProducts);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Seed defaults ──
  const handleSeedDefaults = async () => {
    setSeeding(true);
    const seeded = { ...SEED_CATEGORIES } as Record<string, any>;
    if (!seeded["__landing"]) {
      seeded["__landing"] = {
        slug: "__landing",
        label: "Products Landing Page",
        heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80",
        subtitle:
          "Browse our full catalogue of geosynthetic products — sourced from global best-in-class manufacturers and specified to fit your engineered system.",
        description: [],
        features: [],
        popularProducts: [],
        seo: {
          title: "Products — Geosynthetics Africa",
          description:
            "Browse 200+ geosynthetic products: HDPE Geomembranes, Geotextiles, Geogrids, Geocells, GCLs, Drainage Composites and more.",
          keywords: "geosynthetics, geomembranes, geotextiles, geogrids, geocells, gcl",
        },
      };
    }
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: SUPABASE_KEY, value: seeded }, { onConflict: "key" });
    if (error) {
      toast.error("Seed failed: " + error.message);
    } else {
      toast.success("All default category templates seeded to Supabase!");
      setAllData(seeded);
    }
    setSeeding(false);
  };

  // ── Save current state to Supabase ──
  const handleSave = async () => {
    setSaving(true);

    // Save templates
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: SUPABASE_KEY, value: allData as any }, { onConflict: "key" });

    if (error) {
      toast.error("Save failed: " + error.message);
      setSaving(false);
      return;
    }

    // Save hierarchy config if loaded and dirty
    if (hierarchyProducts && hierarchyDirty) {
      const { error: hierarchyError } = await supabase
        .from("site_config")
        .upsert(
          { key: "hierarchy_products", value: hierarchyProducts as any },
          { onConflict: "key" },
        );

      if (hierarchyError) {
        toast.error(
          "Warning: Templates saved, but failed to update mega menu: " + hierarchyError.message,
        );
      } else {
        setHierarchyDirty(false);
      }
    }

    toast.success("Templates saved successfully!");
    setDirty(false);
    setSaving(false);
  };

  // ── Active category helpers ──
  const active = activeSlug ? allData[activeSlug] : null;

  const updateActive = (updater: (prev: ProductPageContent) => ProductPageContent) => {
    if (!activeSlug) return;
    setAllData((prev) => ({
      ...prev,
      [activeSlug]: updater(prev[activeSlug]),
    }));
    setDirty(true);
  };

  const set = <K extends keyof ProductPageContent>(key: K, value: ProductPageContent[K]) =>
    updateActive((prev) => ({ ...prev, [key]: value }));

  // ── Add new category ──
  const handleAddNew = () => {
    if (!newSlug.trim()) return;
    const slug = newSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    if (allData[slug]) {
      toast.error("A template with that slug already exists.");
      return;
    }
    const parentCategories = [
      "geomembranes",
      "geotextiles",
      "geogrids",
      "geocells",
      "gcls",
      "drainage-composites",
      "erosion-control",
      "accessories",
    ];
    if (parentCategories.includes(slug)) {
      toast.error(
        `"${slug}" is a protected parent category landing page. Please customize it in the Site Builder under Page Content, or create subpage templates (e.g., hdpe-geomembranes) here.`,
      );
      return;
    }
    const blank: ProductPageContent = {
      slug,
      label: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      heroImage: "",
      subtitle: "",
      description: [],
      features: [],
      popularProducts: [],
      relatedProductGroups: [],
      applications: [],
      industries: [],
      technicalHighlights: [],
      propertiesTable: { headers: ["Property", "Test Method", "Value"], rows: [] },
      types: [],
      benefits: [],
      faqs: [],
      installationSpecs: [],
      projectReferences: [],
    };
    setAllData((prev) => ({ ...prev, [slug]: blank }));
    setActiveSlug(slug);
    setNewSlug("");
    setShowNewSlug(false);
    setDirty(true);
    toast.success(`Created "${slug}" — fill in the content and click Save.`);
  };

  // ── Delete category ──
  const handleDelete = (slug: string) => {
    setAllData((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    // Referential Deletion Cleanup: Remove from mega menu config as well
    if (hierarchyProducts) {
      const updatedHierarchy = cleanHierarchy(hierarchyProducts, slug);
      setHierarchyProducts(updatedHierarchy);
      setHierarchyDirty(true);
    }

    if (activeSlug === slug) setActiveSlug("");
    setDirty(true);
  };

  // ── Megamenu Integration Handlers ──
  const getLinkageStatus = useCallback(() => {
    if (!activeSlug || !hierarchyProducts)
      return { linked: false, parentName: null, parentId: null, parentSlug: null, type: null };

    for (const item of hierarchyProducts.items) {
      if (item.children && Array.isArray(item.children)) {
        const foundChild = item.children.find((c) => c.slug === activeSlug || c.id === activeSlug);
        if (foundChild) {
          return {
            linked: true,
            parentName: item.label,
            parentId: item.id,
            parentSlug: item.slug,
            type: "child" as const,
          };
        }
      }
      if (item.slug === activeSlug || item.id === activeSlug) {
        return {
          linked: true,
          parentName: null,
          parentId: item.id,
          parentSlug: item.slug,
          type: "item" as const,
        };
      }
    }
    return { linked: false, parentName: null, parentId: null, parentSlug: null, type: null };
  }, [activeSlug, hierarchyProducts]);

  const linkage = getLinkageStatus();
  // Use the category stored on the template itself (written when admin links to menu).
  // Falls back to the linkage parentSlug if the stored data hasn't been re-saved yet.
  const categorySlug = active?.category || linkage.parentSlug || null;

  const handleLinkToMenu = async () => {
    if (!activeSlug || !selectedParentId || !hierarchyProducts) return;
    setLinkingMenu(true);
    try {
      let updatedHierarchy = cleanHierarchy(hierarchyProducts, activeSlug);

      const parentIdx = updatedHierarchy.items.findIndex((item) => item.id === selectedParentId);
      if (parentIdx === -1) {
        toast.error("Parent category not found.");
        setLinkingMenu(false);
        return;
      }

      const parentItem = updatedHierarchy.items[parentIdx];
      const newChild: HierarchyChild = {
        id: activeSlug,
        slug: activeSlug,
        label:
          active?.label ||
          activeSlug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
        to: "/products/$category/$family",
        params: {
          category: parentItem.slug,
          family: activeSlug,
        },
      };

      const newItems = [...updatedHierarchy.items];
      newItems[parentIdx] = {
        ...parentItem,
        children: [...(parentItem.children || []), newChild],
      };

      updatedHierarchy = {
        ...updatedHierarchy,
        items: newItems,
      };

      // Save hierarchy
      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key: "hierarchy_products", value: updatedHierarchy as any },
          { onConflict: "key" },
        );

      if (error) {
        toast.error("Failed to link to mega menu: " + error.message);
        return;
      }

      // Write the category slug back into the template data so it becomes the source of truth
      const updatedTemplate = { ...allData[activeSlug], category: parentItem.slug };
      const updatedAllData = { ...allData, [activeSlug]: updatedTemplate };
      const { error: templateError } = await supabase
        .from("site_config")
        .upsert({ key: SUPABASE_KEY, value: updatedAllData as any }, { onConflict: "key" });

      if (templateError) {
        toast.error(
          "Linked to menu, but failed to save category on template: " + templateError.message,
        );
      } else {
        toast.success(
          `Successfully linked "${active?.label || activeSlug}" under "${parentItem.label}"!`,
        );
        setAllData(updatedAllData);
        setHierarchyProducts(updatedHierarchy);
        setDirty(false);
        setLinkDialogOpen(false);
      }
    } catch (e: any) {
      toast.error("Error linking to mega menu: " + e.message);
    } finally {
      setLinkingMenu(false);
    }
  };

  const handleUnlink = async () => {
    if (!activeSlug || !hierarchyProducts) return;
    setLinkingMenu(true);
    try {
      const updatedHierarchy = cleanHierarchy(hierarchyProducts, activeSlug);
      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key: "hierarchy_products", value: updatedHierarchy as any },
          { onConflict: "key" },
        );

      if (error) {
        toast.error("Failed to unlink: " + error.message);
      } else {
        toast.success(`Successfully unlinked "${active?.label || activeSlug}" from navigation!`);
        setHierarchyProducts(updatedHierarchy);
      }
    } catch (e: any) {
      toast.error("Error unlinking: " + e.message);
    } finally {
      setLinkingMenu(false);
    }
  };

  const slugList = Object.keys(allData).filter((s) => s !== "__landing");
  const isEmpty = slugList.length === 0;

  // Filtered list based on search query
  const filteredSlugs = useMemo(() => {
    return slugList.filter((slug) => {
      const cat = allData[slug];
      const label = cat?.label || slug;
      return (
        label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [slugList, allData, searchQuery]);

  const totalPages = Math.ceil(filteredSlugs.length / itemsPerPage);
  const paginatedSlugs = useMemo(() => {
    return filteredSlugs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredSlugs, currentPage]);

  // Synchronize current page when activeSlug changes (e.g. from linking menu or navigation)
  useEffect(() => {
    if (activeSlug) {
      const index = filteredSlugs.indexOf(activeSlug);
      if (index !== -1) {
        const page = Math.floor(index / itemsPerPage) + 1;
        if (page !== currentPage) {
          setCurrentPage(page);
        }
      }
    }
  }, [activeSlug, filteredSlugs, currentPage]);

  // ─── Tab definitions ──────────────────────────────────────────────────────
  const TABS = [
    { id: "hero", label: "Hero" },
    { id: "description", label: "Description" },
    { id: "highlights", label: "Highlights" },
    { id: "table", label: "Properties Table" },
    { id: "types", label: "Types" },
    { id: "benefits", label: "Benefits" },
    { id: "faqs", label: "FAQs" },
    { id: "installation", label: "Installation" },
    { id: "products", label: "Products" },
    { id: "projects", label: "Projects" },
    { id: "apps", label: "Applications" },
    { id: "industries", label: "Industries" },
    { id: "related", label: "Related Groups" },
    { id: "seo", label: "SEO" },
  ];

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return <TemplatesEditorSkeleton />;
  }

  return (
    <div className="flex flex-col">
      {/* ── Sub-Editor Selection Tabs ── */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setEditorType("products")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "products"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Product Templates
        </button>
        <button
          onClick={() => setEditorType("projects")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "projects"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Project Templates
        </button>
        <button
          onClick={() => setEditorType("quality-assurance")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "quality-assurance"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Q & A Templates
        </button>
        <button
          onClick={() => setEditorType("applications")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Application Templates
        </button>
        <button
          onClick={() => setEditorType("services")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "services"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Service Templates
        </button>
        <button
          onClick={() => setEditorType("industries")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "industries"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Industry Templates
        </button>
        <button
          onClick={() => setEditorType("countries")}
          className={cn(
            "pb-3 px-6 text-sm font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer",
            editorType === "countries"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Country Templates
        </button>
      </div>

      {editorType === "projects" ? (
        <ProjectsTemplatesEditor />
      ) : editorType === "quality-assurance" ? (
        <QATemplatesEditor />
      ) : editorType === "applications" ? (
        <ApplicationsTemplatesEditor />
      ) : editorType === "services" ? (
        <ServicesTemplatesEditor />
      ) : editorType === "industries" ? (
        <IndustriesTemplatesEditor />
      ) : editorType === "countries" ? (
        <CountriesTemplatesEditor />
      ) : (
        <>
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                Product Page Templates
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Edit the page templates for product family sub-pages. Changes save to Supabase
                instantly.
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
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving…" : "Save All"}
              </Button>
            </div>
          </div>

          {/* ── Empty State / Seed CTA ── */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-surface/30">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-bold uppercase mb-2">
                No page templates yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Seed the default page templates for all 8 built-in geomembrane sub-pages with one
                click. You can edit or delete any of them after seeding.
              </p>
              <Button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider gap-2"
              >
                {seeding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                {seeding ? "Seeding…" : "Seed All Default Templates"}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                This will populate HDPE, LLDPE, PVC, EPDM, PP, Textured, Speciality & Floating Cover
                categories.
              </p>
            </div>
          )}

          {/* ── Main Split Layout ── */}
          {!isEmpty && (
            <div className="flex gap-0 border border-border rounded-xl overflow-hidden min-h-[780px] bg-card">
              {/* Left sidebar */}
              <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface/30">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Sub-Page Templates (
                    {filteredSlugs.length !== slugList.length
                      ? `${filteredSlugs.length}/${slugList.length}`
                      : slugList.length}
                    )
                  </p>
                </div>

                {/* Add new template button at the top */}
                <div className="p-3 border-b border-border space-y-2 shrink-0">
                  {showNewSlug ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="e.g. hdpe-geomembranes"
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
                          className="flex-1 h-7 text-xs bg-primary hover:bg-primary-hover"
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
                          className="h-7 text-xs"
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
                      className="w-full h-8 text-xs gap-1.5"
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
                        <div className="truncate font-medium text-xs">Products Landing Page</div>
                        <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                          /products
                        </div>
                      </div>
                      {activeSlug === "__landing" && (
                        <ChevronRight className="h-3 w-3 text-primary" />
                      )}
                    </button>
                  </div>

                  {/* Sub-Page Templates Section */}
                  <div className="space-y-1">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Sub-Page Templates (
                      {filteredSlugs.length !== slugList.length
                        ? `${filteredSlugs.length}/${slugList.length}`
                        : slugList.length}
                      )
                    </p>
                    <div className="space-y-0.5">
                      {paginatedSlugs.map((slug) => {
                        const cat = allData[slug];
                        const isActive = slug === activeSlug;
                        return (
                          <button
                            key={slug}
                            onClick={() => {
                              setActiveSlug(slug);
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
                              <div className="truncate font-medium text-xs">
                                {cat?.label || slug}
                              </div>
                              <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                                {slug}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-1 shrink-0">
                              {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
                              {!isActive && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSlugToDelete(slug);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      {filteredSlugs.length === 0 && (
                        <p className="text-center text-[10px] text-muted-foreground py-4">
                          No results
                        </p>
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
                    <p className="text-sm font-medium">
                      Select a template from the sidebar to edit its content
                    </p>
                    <p className="text-xs max-w-xs">
                      Each template maps to a sub-page at{" "}
                      <code className="bg-surface px-1 rounded">/products/[category]/[family]</code>
                      . All sections here become the live content on that sub-page.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Category header bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30">
                      <div>
                        <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                          {activeSlug === "__landing"
                            ? "Products Landing Page"
                            : active.label || activeSlug}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          {activeSlug === "__landing" ? (
                            <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                              /products
                            </code>
                          ) : categorySlug ? (
                            <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                              /products/{categorySlug}/{activeSlug}
                            </code>
                          ) : (
                            <span className="text-[10px] bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded text-amber-500 font-medium">
                              ⚠ Link to a category to set the URL
                            </span>
                          )}

                          {/* Mega Menu Linkage Status Badge & Action */}
                          {activeSlug !== "__landing" &&
                            (linkage.linked ? (
                              <div className="flex items-center gap-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active in Navigation{" "}
                                  {linkage.parentName ? `(under ${linkage.parentName})` : ""}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleUnlink}
                                  disabled={linkingMenu}
                                  className="h-5 px-1.5 text-[10px] font-semibold text-destructive hover:bg-destructive/10 uppercase tracking-wider"
                                >
                                  Unlink
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  Unlinked (Hidden from Nav Menu)
                                </span>

                                <Dialog
                                  open={linkDialogOpen}
                                  onOpenChange={(open) => {
                                    setLinkDialogOpen(open);
                                    if (open && !selectedParentId && hierarchyProducts?.items?.[0])
                                      setSelectedParentId(hierarchyProducts.items[0].id);
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-5 px-1.5 text-[10px] font-bold text-primary border-primary/30 hover:border-primary/60 hover:bg-primary/5 uppercase tracking-wider gap-0.5"
                                    >
                                      ⚡ Link to Menu
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[400px] bg-card border border-border">
                                    <DialogHeader>
                                      <DialogTitle className="font-display uppercase text-base tracking-tight">
                                        Link Page to Mega Menu
                                      </DialogTitle>
                                      <DialogDescription className="text-xs text-muted-foreground mt-1">
                                        Select the parent category in the Products Mega Menu where
                                        you want to place{" "}
                                        <strong>{active?.label || activeSlug}</strong>.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                                        Parent Category
                                      </label>
                                      {hierarchyProducts?.items ? (
                                        <Select
                                          value={selectedParentId}
                                          onValueChange={setSelectedParentId}
                                        >
                                          <SelectTrigger className="w-full text-sm">
                                            <SelectValue placeholder="Select parent category..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {hierarchyProducts.items.map((item) => (
                                              <SelectItem
                                                key={item.id}
                                                value={item.id}
                                                className="text-sm"
                                              >
                                                {item.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <p className="text-xs text-muted-foreground italic">
                                          Loading parent categories...
                                        </p>
                                      )}
                                    </div>
                                    <DialogFooter className="gap-2 sm:gap-0">
                                      <Button
                                        variant="ghost"
                                        onClick={() => setLinkDialogOpen(false)}
                                        className="text-xs uppercase font-bold"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleLinkToMenu}
                                        disabled={!selectedParentId || linkingMenu}
                                        className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider text-xs px-4"
                                      >
                                        {linkingMenu ? "Linking..." : "Confirm Link"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            ))}

                          {dirty && (
                            <span className="text-[10px] text-amber-500 font-bold">
                              ● Unsaved Changes
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeSlug === "__landing" ? (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                          >
                            <Link to="/products" target="_blank">
                              <ExternalLink className="h-3 w-3" /> Preview
                            </Link>
                          </Button>
                        ) : categorySlug ? (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                          >
                            <Link
                              to="/products/$category/$family"
                              params={{ category: categorySlug, family: activeSlug } as any}
                              target="_blank"
                            >
                              <ExternalLink className="h-3 w-3" /> Preview
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="gap-1.5 text-xs h-8 opacity-40"
                            title="Link this template to a menu category first"
                          >
                            <ExternalLink className="h-3 w-3" /> Preview
                          </Button>
                        )}

                        {activeSlug !== "__landing" && (
                          <Dialog
                            open={duplicateDialogOpen}
                            onOpenChange={(open) => {
                              setDuplicateDialogOpen(open);
                              if (open) setDupSlug(`${activeSlug}-copy`);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs h-8 uppercase font-bold tracking-wider cursor-pointer"
                              >
                                <Copy className="h-3 w-3" /> Duplicate
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px] bg-card border border-border">
                              <DialogHeader>
                                <DialogTitle className="font-display uppercase text-base tracking-tight">
                                  Duplicate Template
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-1">
                                  Enter the new URL-friendly slug for the duplicated template of{" "}
                                  <strong>{active.label || activeSlug}</strong>.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                                  New Slug
                                </label>
                                <Input
                                  value={dupSlug}
                                  onChange={(e) => setDupSlug(formatSlugInput(e.target.value))}
                                  placeholder="e.g. lldpe-geomembranes-premium"
                                  className="text-sm font-mono h-9"
                                />
                              </div>
                              <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                  variant="ghost"
                                  onClick={() => setDuplicateDialogOpen(false)}
                                  className="text-xs uppercase font-bold cursor-pointer"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleDuplicate}
                                  disabled={!dupSlug.trim()}
                                  className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider text-xs px-4 cursor-pointer"
                                >
                                  Confirm Duplicate
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
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

                    {/* Section tabs */}
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="flex-1 flex flex-col overflow-hidden"
                    >
                      <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
                        {TABS.filter(
                          (t) => !(activeSlug === "__landing" && t.id !== "hero" && t.id !== "seo"),
                        ).map((t) => (
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
                            <FieldLabel>
                              {activeSlug === "__landing" ? "Hero Title" : "Page Title (H1)"}
                            </FieldLabel>
                            <Input
                              value={active.label ?? ""}
                              onChange={(e) => set("label", e.target.value)}
                              placeholder={
                                activeSlug === "__landing"
                                  ? "e.g. Engineered Materials for Every Application"
                                  : "e.g. HDPE Geomembranes"
                              }
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <ImagePicker
                              label="Hero Background Image"
                              hint="Full URL or Supabase storage path to the hero background image"
                              value={active.heroImage ?? ""}
                              onChange={(val) => set("heroImage", val)}
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          <div>
                            <FieldLabel hint="Short paragraph shown below the title in the hero">
                              {activeSlug === "__landing"
                                ? "Hero Subtitle / Description"
                                : "Subtitle / Tagline"}
                            </FieldLabel>
                            <Textarea
                              value={active.subtitle ?? ""}
                              onChange={(e) => set("subtitle", e.target.value)}
                              placeholder={
                                activeSlug === "__landing"
                                  ? "Browse our full catalogue of geosynthetic products..."
                                  : "Engineered materials for critical infrastructure…"
                              }
                              className="text-sm min-h-[96px] resize-none"
                            />
                          </div>
                        </TabsContent>

                        {/* ── DESCRIPTION ── */}
                        <TabsContent value="description" className="p-6 m-0">
                          <SectionHeading>Description Paragraphs</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            These paragraphs appear in the "Technical Description" section of the
                            page. Each entry is one paragraph.
                          </p>
                          <StringListEditor
                            label="Paragraphs"
                            items={active.description ?? []}
                            onChange={(v) => set("description", v)}
                            multiline
                            placeholder="Describe the product in detail…"
                          />
                          <div className="mt-8 border-t border-border pt-6">
                            <SectionHeading>Key Features / Benefits Bullets</SectionHeading>
                            <p className="text-xs text-muted-foreground mb-4">
                              Short bullet-point benefits that appear in the "Benefits of Choosing
                              Our Products" checklist.
                            </p>
                            <StringListEditor
                              label="Feature bullets"
                              items={active.features ?? []}
                              onChange={(v) => set("features", v)}
                              placeholder="e.g. High resistance to UV and chemical degradation"
                            />
                          </div>
                        </TabsContent>

                        {/* ── HIGHLIGHTS ── */}
                        <TabsContent value="highlights" className="p-6 m-0">
                          <SectionHeading>Technical Highlights</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            These appear as badge-style callouts in the hero section (e.g.
                            "Thickness: 1mm – 3mm").
                          </p>
                          <PairsEditor
                            label="Highlight badges"
                            items={(active.technicalHighlights ?? []) as any}
                            fields={[
                              { key: "label", label: "Label", placeholder: "e.g. Thickness" },
                              { key: "value", label: "Value", placeholder: "e.g. 1mm – 3mm" },
                            ]}
                            onChange={(v) => set("technicalHighlights", v as any)}
                            newItem={{ label: "", value: "" } as any}
                          />
                        </TabsContent>

                        {/* ── PROPERTIES TABLE ── */}
                        <TabsContent value="table" className="p-6 m-0">
                          <SectionHeading>Properties & Specifications Table</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Add columns and rows to build the technical data table. The first column
                            is typically the property name.
                          </p>
                          <PropertiesTableEditor
                            table={
                              active.propertiesTable ?? {
                                headers: [
                                  "Property",
                                  "Test Method",
                                  "Value (Metric)",
                                  "Value (Imperial)",
                                ],
                                rows: [],
                              }
                            }
                            onChange={(v) => set("propertiesTable", v)}
                          />
                        </TabsContent>

                        {/* ── TYPES ── */}
                        <TabsContent value="types" className="p-6 m-0">
                          <SectionHeading>Types of {active.label || "this product"}</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Cards shown in the "Types" section. Each card has a name and a short
                            description.
                          </p>
                          <PairsEditor
                            label="Product types"
                            items={(active.types ?? []) as any}
                            fields={[
                              {
                                key: "name",
                                label: "Type Name",
                                placeholder: "e.g. Smooth Geomembrane",
                              },
                              {
                                key: "description",
                                label: "Description",
                                placeholder: "Short description of this type…",
                                multiline: true,
                              },
                            ]}
                            onChange={(v) => set("types", v as any)}
                            newItem={{ name: "", description: "" } as any}
                          />
                        </TabsContent>

                        {/* ── BENEFITS ── */}
                        <TabsContent value="benefits" className="p-6 m-0">
                          <SectionHeading>Benefits</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Benefit cards shown in the "Benefits of using [product]" section.
                          </p>
                          <PairsEditor
                            label="Benefits"
                            items={(active.benefits ?? []) as any}
                            fields={[
                              {
                                key: "title",
                                label: "Benefit Title",
                                placeholder: "e.g. High Durability",
                              },
                              {
                                key: "description",
                                label: "Description",
                                placeholder: "Explain why this is a benefit…",
                                multiline: true,
                              },
                            ]}
                            onChange={(v) => set("benefits", v as any)}
                            newItem={{ title: "", description: "" } as any}
                          />
                        </TabsContent>

                        {/* ── FAQs ── */}
                        <TabsContent value="faqs" className="p-6 m-0">
                          <SectionHeading>Frequently Asked Questions</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            These appear in the FAQ accordion section on the page. Write clear,
                            helpful answers.
                          </p>
                          <PairsEditor
                            label="FAQs"
                            items={(active.faqs ?? []) as any}
                            fields={[
                              {
                                key: "question",
                                label: "Question",
                                placeholder: "e.g. What is the typical lifespan?",
                              },
                              {
                                key: "answer",
                                label: "Answer",
                                placeholder: "Provide a thorough, helpful answer…",
                                multiline: true,
                              },
                            ]}
                            onChange={(v) => set("faqs", v as any)}
                            newItem={{ question: "", answer: "" } as any}
                          />
                        </TabsContent>

                        {/* ── INSTALLATION ── */}
                        <TabsContent value="installation" className="p-6 m-0">
                          <SectionHeading>Installation Specifications</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Detailed installation guidance shown in a highlighted block on the page.
                            Each entry is one paragraph.
                          </p>
                          <StringListEditor
                            label="Installation spec paragraphs"
                            items={active.installationSpecs ?? []}
                            onChange={(v) => set("installationSpecs", v)}
                            multiline
                            placeholder="Describe installation requirements in detail…"
                          />
                        </TabsContent>

                        {/* ── PRODUCTS ── */}
                        <TabsContent value="products" className="p-6 m-0">
                          <SectionHeading>Popular Products in Catalogue</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            These cards appear in the "Popular Products" section linking to the
                            catalogue. Include up to 6 for best layout.
                          </p>
                          <PairsEditor
                            label="Popular products"
                            items={(active.popularProducts ?? []) as any}
                            fields={[
                              { key: "slug", label: "Select Product", type: "product" },
                              {
                                key: "name",
                                label: "Product Name",
                                placeholder: "e.g. GSE HDPE Smooth",
                              },
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
                              {
                                key: "image",
                                label: "Image URL",
                                placeholder: "https://…",
                                type: "image",
                              },
                            ]}
                            onChange={(v) => set("popularProducts", v as any)}
                            newItem={{ slug: "", name: "", spec: "", desc: "", image: "" } as any}
                          />
                        </TabsContent>

                        {/* ── PROJECTS ── */}
                        <TabsContent value="projects" className="p-6 m-0">
                          <SectionHeading>Featured Projects Across Africa</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Project reference cards shown in the "Projects" gallery section.
                          </p>
                          <PairsEditor
                            label="Project references"
                            items={(active.projectReferences ?? []) as any}
                            fields={[
                              { key: "project_slug", label: "Link to Case Study", type: "project" },
                              {
                                key: "name",
                                label: "Project Name",
                                placeholder: "e.g. Mining Tailings Dam",
                              },
                              {
                                key: "location",
                                label: "Location / Country",
                                placeholder: "e.g. South Africa",
                              },
                              { key: "year", label: "Year Completed", placeholder: "e.g. 2023" },
                              {
                                key: "image",
                                label: "Image URL",
                                placeholder: "https://…",
                                type: "image",
                              },
                            ]}
                            onChange={(v) => set("projectReferences", v as any)}
                            newItem={
                              {
                                project_slug: "",
                                name: "",
                                location: "",
                                year: "",
                                image: "",
                              } as any
                            }
                          />
                        </TabsContent>

                        {/* ── APPLICATIONS ── */}
                        <TabsContent value="apps" className="p-6 m-0">
                          <SectionHeading>Applications & Engineering Use Cases</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Application cards shown in the "Common Applications" section. The slug
                            links to{" "}
                            <code className="bg-surface px-1 rounded">/applications/[slug]</code>.
                          </p>
                          <PairsEditor
                            label="Applications"
                            items={(active.applications ?? []) as any}
                            fields={[
                              {
                                key: "label",
                                label: "Application Name",
                                placeholder: "e.g. Mining Facilities",
                              },
                              {
                                key: "slug",
                                label: "Application Slug",
                                placeholder: "e.g. mining",
                              },
                              {
                                key: "description",
                                label: "Short Description",
                                placeholder: "How this product is used here…",
                                multiline: true,
                              },
                            ]}
                            onChange={(v) => set("applications", v as any)}
                            newItem={{ label: "", slug: "", description: "" } as any}
                          />
                        </TabsContent>

                        {/* ── INDUSTRIES ── */}
                        <TabsContent value="industries" className="p-6 m-0">
                          <SectionHeading>Industries That Use This Product</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Industry icons shown in the "Industries" grid. The slug links to{" "}
                            <code className="bg-surface px-1 rounded">/applications/[slug]</code>.
                          </p>
                          <PairsEditor
                            label="Industries"
                            items={(active.industries ?? []) as any}
                            fields={[
                              { key: "label", label: "Industry Name", placeholder: "e.g. Mining" },
                              { key: "slug", label: "Industry Slug", placeholder: "e.g. mining" },
                            ]}
                            onChange={(v) => set("industries", v as any)}
                            newItem={{ label: "", slug: "" } as any}
                          />
                        </TabsContent>

                        {/* ── RELATED PRODUCT GROUPS ── */}
                        <TabsContent value="related" className="p-6 m-0">
                          <SectionHeading>Related Product Groups</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Links shown in the "Related Product Groups" section on the sub-family
                            page. Each entry needs a display name and the full path (e.g.{" "}
                            <code className="bg-surface px-1 rounded">
                              /products/geomembranes/lldpe-geomembranes
                            </code>
                            ).
                          </p>
                          <PairsEditor
                            label="Related product groups"
                            items={((active as any).relatedProductGroups ?? []) as any}
                            fields={[
                              {
                                key: "name",
                                label: "Group Name",
                                placeholder: "e.g. LLDPE Geomembranes",
                              },
                              {
                                key: "link",
                                label: "Link Path",
                                placeholder: "e.g. /products/geomembranes/lldpe-geomembranes",
                              },
                            ]}
                            onChange={(v) => set("relatedProductGroups" as any, v as any)}
                            newItem={{ name: "", link: "" } as any}
                          />
                        </TabsContent>

                        {/* ── SEO ── */}
                        <TabsContent value="seo" className="p-6 space-y-5 m-0">
                          <SectionHeading>SEO / Meta Tags</SectionHeading>
                          <p className="text-xs text-muted-foreground mb-4">
                            Configure the search engine optimization tags for this product family
                            sub-page.
                          </p>
                          <div>
                            <FieldLabel hint="The title displayed in browser tabs and search engine results. Recommended: 50-60 characters.">
                              Meta Title
                            </FieldLabel>
                            <Input
                              value={active.seo?.title ?? ""}
                              onChange={(e) =>
                                set("seo", {
                                  title: e.target.value,
                                  description: active.seo?.description ?? "",
                                  keywords: active.seo?.keywords ?? "",
                                })
                              }
                              placeholder="e.g. HDPE Geomembrane Liners | Geosynthetics Africa"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <FieldLabel hint="A brief summary of the page content shown in search results. Recommended: 150-160 characters.">
                              Meta Description
                            </FieldLabel>
                            <Textarea
                              value={active.seo?.description ?? ""}
                              onChange={(e) =>
                                set("seo", {
                                  title: active.seo?.title ?? "",
                                  description: e.target.value,
                                  keywords: active.seo?.keywords ?? "",
                                })
                              }
                              placeholder="e.g. Africa's benchmark liner for permanent containment. GRI-GM13 certified HDPE geomembrane systems in smooth and textured profiles..."
                              className="text-sm min-h-[96px] resize-none"
                            />
                          </div>
                          <div>
                            <FieldLabel hint="Comma-separated list of search keywords.">
                              Meta Keywords
                            </FieldLabel>
                            <Input
                              value={active.seo?.keywords ?? ""}
                              onChange={(e) =>
                                set("seo", {
                                  title: active.seo?.title ?? "",
                                  description: active.seo?.description ?? "",
                                  keywords: e.target.value,
                                })
                              }
                              placeholder="e.g. hdpe geomembrane, landfill liner, tailings dam, pond liner"
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
          )}

          {/* Success tip */}
          {!isEmpty && !dirty && (
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All changes saved to Supabase
            </div>
          )}
        </>
      )}
      <DeleteConfirmationDialog
        isOpen={!!slugToDelete}
        onOpenChange={(open) => !open && setSlugToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product Template?"
        description="This will remove the template for this sub-page. The page will show a 404 until re-created. You still need to click Save All."
        itemName={slugToDelete || undefined}
        idPrefix="product-template"
      />
    </div>
  );
}
