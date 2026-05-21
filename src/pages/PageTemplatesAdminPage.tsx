import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SEED_CATEGORIES, type ProductPageContent } from "@/data/product-pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus, Trash2, Save, Loader2, ExternalLink, Database,
  AlertTriangle, CheckCircle2, ChevronRight, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getDefaultSections } from "@/lib/hierarchy-utils";
import type { HierarchySection, HierarchyChild } from "@/types/hierarchy";

const SUPABASE_KEY = "template_product_categories";

// ─── Small reusable sub-editors ──────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
      <span className="w-1 h-3 bg-primary rounded-full inline-block" />
      {children}
    </h3>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1">
      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {children}
      </label>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}

function StringListEditor({
  label,
  hint,
  items,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const add = () => onChange([...items, ""]);
  const update = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint={hint}>{label}</FieldLabel>
        <Button variant="ghost" size="sm" onClick={add}
          className="h-6 text-xs text-primary hover:text-primary gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <Textarea value={item} onChange={e => update(i, e.target.value)}
                placeholder={placeholder} className="text-sm min-h-[72px] flex-1 resize-none" />
            ) : (
              <Input value={item} onChange={e => update(i, e.target.value)}
                placeholder={placeholder} className="text-sm flex-1" />
            )}
            <Button variant="ghost" size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
              onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">No items yet — click Add.</p>
        )}
      </div>
    </div>
  );
}

function PairsEditor<T extends Record<string, string>>({
  label,
  hint,
  items,
  fields,
  onChange,
  newItem,
}: {
  label: string;
  hint?: string;
  items: T[];
  fields: { key: string; label: string; multiline?: boolean; placeholder?: string }[];
  onChange: (v: T[]) => void;
  newItem: T;
}) {
  const add = () => onChange([...items, { ...newItem }]);
  const update = (i: number, key: string, val: string) => {
    const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint={hint}>{label}</FieldLabel>
        <Button variant="ghost" size="sm" onClick={add}
          className="h-6 text-xs text-primary hover:text-primary gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i}
            className="border border-border rounded-md p-3 bg-surface/40 space-y-2 relative">
            <Button variant="ghost" size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
              onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
            <div className={cn("grid gap-2", fields.length >= 3 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-" + fields.length)}>
              {fields.map(f => (
                <div key={f.key} className={f.multiline ? "col-span-full" : ""}>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <Textarea value={(item as any)[f.key] ?? ""} className="text-sm min-h-[60px] resize-none"
                      placeholder={f.placeholder}
                      onChange={e => update(i, f.key, e.target.value)} />
                  ) : (
                    <Input value={(item as any)[f.key] ?? ""} className="text-sm"
                      placeholder={f.placeholder}
                      onChange={e => update(i, f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">No items yet — click Add.</p>
        )}
      </div>
    </div>
  );
}

function PropertiesTableEditor({
  table,
  onChange,
}: {
  table: { headers: string[]; rows: string[][] };
  onChange: (t: { headers: string[]; rows: string[][] }) => void;
}) {
  const { headers, rows } = table;
  const addRow = () => onChange({ headers, rows: [...rows, Array(headers.length).fill("")] });
  const addCol = () => onChange({ headers: [...headers, "New Column"], rows: rows.map(r => [...r, ""]) });
  const removeRow = (i: number) => onChange({ headers, rows: rows.filter((_, idx) => idx !== i) });
  const removeCol = (j: number) => onChange({
    headers: headers.filter((_, idx) => idx !== j),
    rows: rows.map(r => r.filter((_, idx) => idx !== j)),
  });
  const updateHeader = (j: number, val: string) => {
    const h = [...headers]; h[j] = val; onChange({ headers: h, rows });
  };
  const updateCell = (i: number, j: number, val: string) => {
    const r = rows.map((row, ri) =>
      ri === i ? row.map((cell, ci) => (ci === j ? val : cell)) : row,
    );
    onChange({ headers, rows: r });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel hint="Columns and rows of technical data displayed in the Properties section">
          Properties & Specifications Table
        </FieldLabel>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={addCol} className="h-6 text-xs gap-1">
            <Plus className="h-3 w-3" /> Column
          </Button>
          <Button variant="outline" size="sm" onClick={addRow} className="h-6 text-xs gap-1">
            <Plus className="h-3 w-3" /> Row
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto border border-border rounded-md">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-dark/90">
              {headers.map((h, j) => (
                <th key={j} className="p-1.5 border-r border-border/50 last:border-r-0 min-w-[120px]">
                  <div className="flex items-center gap-1">
                    <Input value={h} onChange={e => updateHeader(j, e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent font-bold p-0 text-white focus-visible:ring-0" />
                    <Button variant="ghost" size="icon"
                      className="h-5 w-5 text-destructive/70 hover:text-destructive shrink-0"
                      onClick={() => removeCol(j)}>
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-surface/50 group">
                {row.map((cell, j) => (
                  <td key={j} className="p-1 border-r border-border/30 last:border-r-0">
                    <Input value={cell} onChange={e => updateCell(i, j, e.target.value)}
                      className="h-6 text-xs border-0 bg-transparent p-0 focus-visible:ring-0" />
                  </td>
                ))}
                <td className="p-1 w-6">
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive/70 opacity-0 group-hover:opacity-100"
                    onClick={() => removeRow(i)}>
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-xs text-muted-foreground italic p-3">
            No rows yet — click "+ Row" to add data.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export function PageTemplatesAdminPage() {
  const [allData, setAllData] = useState<Record<string, ProductPageContent>>({});
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [newSlug, setNewSlug] = useState("");
  const [showNewSlug, setShowNewSlug] = useState(false);

  // ── Megamenu Integration States ──
  const [hierarchyProducts, setHierarchyProducts] = useState<HierarchySection | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [linkingMenu, setLinkingMenu] = useState(false);

  // Helper to remove dynamic page templates from all parent categories in hierarchy
  const cleanHierarchy = (h: HierarchySection, slug: string): HierarchySection => {
    return {
      ...h,
      items: h.items.map(item => ({
        ...item,
        children: (item.children || []).filter(c => c.id !== slug && c.slug !== slug)
      }))
    };
  };

  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);
    
    // Load page templates
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    // Load hierarchy products
    const { data: hierarchyData, error: hierarchyError } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "hierarchy_products")
      .maybeSingle();

    if (error) {
      toast.error("Failed to load templates: " + error.message);
    } else if (data?.value) {
      const templates = data.value as Record<string, ProductPageContent>;
      setAllData(templates);
      
      // Auto-select slug from URL search param if present and exists in loaded templates
      const urlParams = new URLSearchParams(window.location.search);
      const querySlug = urlParams.get("slug");
      if (querySlug && templates[querySlug]) {
        setActiveSlug(querySlug);
      } else {
        const keys = Object.keys(templates);
        if (keys.length > 0) {
          setActiveSlug(keys[0]);
        }
      }
    }

    if (hierarchyError) {
      console.error("Failed to load mega menu configuration:", hierarchyError);
    } else {
      const defaults = getDefaultSections();
      const defaultProducts = defaults.find(d => d.key === "products") || null;
      setHierarchyProducts((hierarchyData?.value as HierarchySection) ?? defaultProducts);
    }

    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Seed defaults ──
  const handleSeedDefaults = async () => {
    setSeeding(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: SUPABASE_KEY, value: SEED_CATEGORIES as any }, { onConflict: "key" });
    if (error) {
      toast.error("Seed failed: " + error.message);
    } else {
      toast.success("All default category templates seeded to Supabase!");
      setAllData(SEED_CATEGORIES as any);
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

    // Save hierarchy config if loaded
    if (hierarchyProducts) {
      const { error: hierarchyError } = await supabase
        .from("site_config")
        .upsert({ key: "hierarchy_products", value: hierarchyProducts as any }, { onConflict: "key" });
        
      if (hierarchyError) {
        toast.error("Warning: Templates saved, but failed to update mega menu: " + hierarchyError.message);
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
    setAllData(prev => ({
      ...prev,
      [activeSlug]: updater(prev[activeSlug]),
    }));
    setDirty(true);
  };

  const set = <K extends keyof ProductPageContent>(key: K, value: ProductPageContent[K]) =>
    updateActive(prev => ({ ...prev, [key]: value }));

  // ── Add new category ──
  const handleAddNew = () => {
    if (!newSlug.trim()) return;
    const slug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (allData[slug]) { toast.error("A template with that slug already exists."); return; }
    const parentCategories = [
      "geomembranes",
      "geotextiles",
      "geogrids",
      "geocells",
      "gcls",
      "drainage-composites",
      "erosion-control",
      "accessories"
    ];
    if (parentCategories.includes(slug)) {
      toast.error(`"${slug}" is a protected parent category landing page. Please customize it in the Site Builder under Page Content, or create subpage templates (e.g., hdpe-geomembranes) here.`);
      return;
    }
    const blank: ProductPageContent = {
      slug,
      label: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      heroImage: "",
      subtitle: "",
      description: [],
      features: [],
      popularProducts: [],
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
    setAllData(prev => ({ ...prev, [slug]: blank }));
    setActiveSlug(slug);
    setNewSlug("");
    setShowNewSlug(false);
    setDirty(true);
    toast.success(`Created "${slug}" — fill in the content and click Save.`);
  };

  // ── Delete category ──
  const handleDelete = (slug: string) => {
    setAllData(prev => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });

    // Referential Deletion Cleanup: Remove from mega menu config as well
    if (hierarchyProducts) {
      const updatedHierarchy = cleanHierarchy(hierarchyProducts, slug);
      setHierarchyProducts(updatedHierarchy);
    }

    if (activeSlug === slug) setActiveSlug("");
    setDirty(true);
  };

  // ── Megamenu Integration Handlers ──
  const getLinkageStatus = useCallback(() => {
    if (!activeSlug || !hierarchyProducts) return { linked: false, parentName: null, parentId: null, parentSlug: null, type: null };
    
    for (const item of hierarchyProducts.items) {
      if (item.children && Array.isArray(item.children)) {
        const foundChild = item.children.find(c => c.slug === activeSlug || c.id === activeSlug);
        if (foundChild) {
          return { linked: true, parentName: item.label, parentId: item.id, parentSlug: item.slug, type: "child" as const };
        }
      }
      if (item.slug === activeSlug || item.id === activeSlug) {
        return { linked: true, parentName: null, parentId: item.id, parentSlug: item.slug, type: "item" as const };
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
      
      const parentIdx = updatedHierarchy.items.findIndex(item => item.id === selectedParentId);
      if (parentIdx === -1) {
        toast.error("Parent category not found.");
        setLinkingMenu(false);
        return;
      }
      
      const parentItem = updatedHierarchy.items[parentIdx];
      const newChild: HierarchyChild = {
        id: activeSlug,
        slug: activeSlug,
        label: active?.label || activeSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        to: "/products/$category/$family",
        params: {
          category: parentItem.slug,
          family: activeSlug
        }
      };
      
      const newItems = [...updatedHierarchy.items];
      newItems[parentIdx] = {
        ...parentItem,
        children: [...(parentItem.children || []), newChild]
      };
      
      updatedHierarchy = {
        ...updatedHierarchy,
        items: newItems
      };
      
      // Save hierarchy
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: "hierarchy_products", value: updatedHierarchy as any }, { onConflict: "key" });
        
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
        toast.error("Linked to menu, but failed to save category on template: " + templateError.message);
      } else {
        toast.success(`Successfully linked "${active?.label || activeSlug}" under "${parentItem.label}"!`);
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
        .upsert({ key: "hierarchy_products", value: updatedHierarchy as any }, { onConflict: "key" });
        
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

  const slugList = Object.keys(allData);
  const isEmpty = slugList.length === 0;

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
  ];

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading page templates…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Product Page Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit the page templates for product family sub-pages. Changes save to Supabase instantly.
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

      {/* ── Empty State / Seed CTA ── */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-surface/30">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-bold uppercase mb-2">No page templates yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Seed the default page templates for all 8 built-in geomembrane sub-pages with one click.
            You can edit or delete any of them after seeding.
          </p>
          <Button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wider gap-2"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            {seeding ? "Seeding…" : "Seed All Default Templates"}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            This will populate HDPE, LLDPE, PVC, EPDM, PP, Textured, Speciality & Floating Cover categories.
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
                Sub-Page Templates ({slugList.length})
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {slugList.map(slug => {
                const cat = allData[slug];
                const isActive = slug === activeSlug;
                return (
                  <button
                    key={slug}
                    onClick={() => { setActiveSlug(slug); setActiveTab("hero"); }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent text-foreground",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-xs">{cat?.label || slug}</div>
                      <div className="truncate text-[10px] text-muted-foreground mt-0.5">{slug}</div>
                    </div>
                    <div className="flex items-center gap-1 ml-1 shrink-0">
                      {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
                      {!isActive && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10"
                              onClick={e => e.stopPropagation()}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Template "{slug}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the template for this sub-page. The page will show a 404 until re-created. You still need to click Save All.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(slug)}
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

            {/* Add new + seed buttons */}
            <div className="p-3 border-t border-border space-y-2">
              {showNewSlug ? (
                <div className="space-y-2">
                  <Input
                    placeholder="e.g. hdpe-geomembranes"
                    value={newSlug}
                    onChange={e => setNewSlug(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddNew(); if (e.key === "Escape") setShowNewSlug(false); }}
                    className="text-xs h-8"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleAddNew}
                      className="flex-1 h-7 text-xs bg-primary hover:bg-primary-hover">
                      Create
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setShowNewSlug(false); setNewSlug(""); }}
                      className="h-7 text-xs">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowNewSlug(true)}
                  className="w-full h-8 text-xs gap-1.5">
                  <Plus className="h-3 w-3" /> New Template
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSeedDefaults}
                disabled={seeding}
                className="w-full h-7 text-xs text-muted-foreground gap-1.5">
                {seeding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Database className="h-3 w-3" />}
                {seeding ? "Seeding…" : "Re-seed Defaults"}
              </Button>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!active ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 p-8 text-center">
                <Eye className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">Select a template from the sidebar to edit its content</p>
                <p className="text-xs max-w-xs">
                  Each template maps to a sub-page at <code className="bg-surface px-1 rounded">/products/[category]/[family]</code>.
                  All sections here become the live content on that sub-page.
                </p>
              </div>
            ) : (
              <>
                {/* Category header bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                      {active.label || activeSlug}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {categorySlug ? (
                        <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground">
                          /products/{categorySlug}/{activeSlug}
                        </code>
                      ) : (
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded text-amber-500 font-medium">
                          ⚠ Link to a category to set the URL
                        </span>
                      )}
                      
                      {/* Mega Menu Linkage Status Badge & Action */}
                      {linkage.linked ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active in Navigation {linkage.parentName ? `(under ${linkage.parentName})` : ""}
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
                          
                          <Dialog open={linkDialogOpen} onOpenChange={(open) => { setLinkDialogOpen(open); if(open && !selectedParentId && hierarchyProducts?.items?.[0]) setSelectedParentId(hierarchyProducts.items[0].id); }}>
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
                                <DialogTitle className="font-display uppercase text-base tracking-tight">Link Page to Mega Menu</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-1">
                                  Select the parent category in the Products Mega Menu where you want to place <strong>{active?.label || activeSlug}</strong>.
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
                                      {hierarchyProducts.items.map(item => (
                                        <SelectItem key={item.id} value={item.id} className="text-sm">
                                          {item.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">Loading parent categories...</p>
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
                      )}

                      {dirty && (
                        <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {categorySlug ? (
                      <Button asChild variant="outline" size="sm"
                        className="gap-1.5 text-xs h-8">
                        <Link to="/products/$category/$family" params={{ category: categorySlug, family: activeSlug }}
                          target="_blank">
                          <ExternalLink className="h-3 w-3" /> Preview
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled
                        className="gap-1.5 text-xs h-8 opacity-40"
                        title="Link this template to a menu category first">
                        <ExternalLink className="h-3 w-3" /> Preview
                      </Button>
                    )}
                    <Button onClick={handleSave} disabled={saving || !dirty}
                      className="bg-primary hover:bg-primary-hover text-white font-bold text-xs h-8 gap-1.5">
                      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                      {saving ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </div>

                {/* Section tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}
                  className="flex-1 flex flex-col overflow-hidden">
                  <TabsList
                    className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap"
                  >
                    {TABS.map(t => (
                      <TabsTrigger key={t.id} value={t.id}
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
                        <Input value={active.label ?? ""}
                          onChange={e => set("label", e.target.value)}
                          placeholder="e.g. HDPE Geomembranes"
                          className="text-sm" />
                      </div>
                      <div>
                        <FieldLabel hint="Full URL to the hero background image">Hero Background Image URL</FieldLabel>
                        <Input value={active.heroImage ?? ""}
                          onChange={e => set("heroImage", e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="text-sm font-mono" />
                        {active.heroImage && (
                          <img src={active.heroImage} alt="Hero preview"
                            className="mt-2 h-24 w-full object-cover rounded border border-border" />
                        )}
                      </div>
                      <div>
                        <FieldLabel hint="Short paragraph shown below the title in the hero">Subtitle / Tagline</FieldLabel>
                        <Textarea value={active.subtitle ?? ""}
                          onChange={e => set("subtitle", e.target.value)}
                          placeholder="Engineered materials for critical infrastructure…"
                          className="text-sm min-h-[96px] resize-none" />
                      </div>
                    </TabsContent>

                    {/* ── DESCRIPTION ── */}
                    <TabsContent value="description" className="p-6 m-0">
                      <SectionHeading>Description Paragraphs</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        These paragraphs appear in the "Technical Description" section of the page. Each entry is one paragraph.
                      </p>
                      <StringListEditor
                        label="Paragraphs"
                        items={active.description ?? []}
                        onChange={v => set("description", v)}
                        multiline
                        placeholder="Describe the product in detail…"
                      />
                      <div className="mt-8 border-t border-border pt-6">
                        <SectionHeading>Key Features / Benefits Bullets</SectionHeading>
                        <p className="text-xs text-muted-foreground mb-4">
                          Short bullet-point benefits that appear in the "Benefits of Choosing Our Products" checklist.
                        </p>
                        <StringListEditor
                          label="Feature bullets"
                          items={active.features ?? []}
                          onChange={v => set("features", v)}
                          placeholder="e.g. High resistance to UV and chemical degradation"
                        />
                      </div>
                    </TabsContent>

                    {/* ── HIGHLIGHTS ── */}
                    <TabsContent value="highlights" className="p-6 m-0">
                      <SectionHeading>Technical Highlights</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        These appear as badge-style callouts in the hero section (e.g. "Thickness: 1mm – 3mm").
                      </p>
                      <PairsEditor
                        label="Highlight badges"
                        items={(active.technicalHighlights ?? []) as any}
                        fields={[
                          { key: "label", label: "Label", placeholder: "e.g. Thickness" },
                          { key: "value", label: "Value", placeholder: "e.g. 1mm – 3mm" },
                        ]}
                        onChange={v => set("technicalHighlights", v as any)}
                        newItem={{ label: "", value: "" } as any}
                      />
                    </TabsContent>

                    {/* ── PROPERTIES TABLE ── */}
                    <TabsContent value="table" className="p-6 m-0">
                      <SectionHeading>Properties & Specifications Table</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Add columns and rows to build the technical data table. The first column is typically the property name.
                      </p>
                      <PropertiesTableEditor
                        table={active.propertiesTable ?? { headers: ["Property", "Test Method", "Value (Metric)", "Value (Imperial)"], rows: [] }}
                        onChange={v => set("propertiesTable", v)}
                      />
                    </TabsContent>

                    {/* ── TYPES ── */}
                    <TabsContent value="types" className="p-6 m-0">
                      <SectionHeading>Types of {active.label || "this product"}</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Cards shown in the "Types" section. Each card has a name and a short description.
                      </p>
                      <PairsEditor
                        label="Product types"
                        items={(active.types ?? []) as any}
                        fields={[
                          { key: "name", label: "Type Name", placeholder: "e.g. Smooth Geomembrane" },
                          { key: "description", label: "Description", placeholder: "Short description of this type…", multiline: true },
                        ]}
                        onChange={v => set("types", v as any)}
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
                          { key: "title", label: "Benefit Title", placeholder: "e.g. High Durability" },
                          { key: "description", label: "Description", placeholder: "Explain why this is a benefit…", multiline: true },
                        ]}
                        onChange={v => set("benefits", v as any)}
                        newItem={{ title: "", description: "" } as any}
                      />
                    </TabsContent>

                    {/* ── FAQs ── */}
                    <TabsContent value="faqs" className="p-6 m-0">
                      <SectionHeading>Frequently Asked Questions</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        These appear in the FAQ accordion section on the page. Write clear, helpful answers.
                      </p>
                      <PairsEditor
                        label="FAQs"
                        items={(active.faqs ?? []) as any}
                        fields={[
                          { key: "question", label: "Question", placeholder: "e.g. What is the typical lifespan?" },
                          { key: "answer", label: "Answer", placeholder: "Provide a thorough, helpful answer…", multiline: true },
                        ]}
                        onChange={v => set("faqs", v as any)}
                        newItem={{ question: "", answer: "" } as any}
                      />
                    </TabsContent>

                    {/* ── INSTALLATION ── */}
                    <TabsContent value="installation" className="p-6 m-0">
                      <SectionHeading>Installation Specifications</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Detailed installation guidance shown in a highlighted block on the page. Each entry is one paragraph.
                      </p>
                      <StringListEditor
                        label="Installation spec paragraphs"
                        items={active.installationSpecs ?? []}
                        onChange={v => set("installationSpecs", v)}
                        multiline
                        placeholder="Describe installation requirements in detail…"
                      />
                    </TabsContent>

                    {/* ── PRODUCTS ── */}
                    <TabsContent value="products" className="p-6 m-0">
                      <SectionHeading>Popular Products in Catalogue</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        These cards appear in the "Popular Products" section linking to the catalogue.
                        Include up to 6 for best layout.
                      </p>
                      <PairsEditor
                        label="Popular products"
                        items={(active.popularProducts ?? []) as any}
                        fields={[
                          { key: "name", label: "Product Name", placeholder: "e.g. GSE HDPE Smooth" },
                          { key: "spec", label: "Specification Range", placeholder: "e.g. 1.0mm – 3.0mm" },
                          { key: "desc", label: "Short Description", placeholder: "One line description…", multiline: true },
                          { key: "image", label: "Image URL", placeholder: "https://…" },
                          { key: "slug", label: "Catalogue Slug (optional)", placeholder: "e.g. gse-hdpe-smooth" },
                        ]}
                        onChange={v => set("popularProducts", v as any)}
                        newItem={{ name: "", spec: "", desc: "", image: "", slug: "" } as any}
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
                          { key: "name", label: "Project Name", placeholder: "e.g. Mining Tailings Dam" },
                          { key: "location", label: "Location / Country", placeholder: "e.g. South Africa" },
                          { key: "year", label: "Year Completed", placeholder: "e.g. 2023" },
                          { key: "image", label: "Image URL", placeholder: "https://…" },
                        ]}
                        onChange={v => set("projectReferences", v as any)}
                        newItem={{ name: "", location: "", year: "", image: "" } as any}
                      />
                    </TabsContent>

                    {/* ── APPLICATIONS ── */}
                    <TabsContent value="apps" className="p-6 m-0">
                      <SectionHeading>Applications & Engineering Use Cases</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Application cards shown in the "Common Applications" section. The slug links to <code className="bg-surface px-1 rounded">/applications/[slug]</code>.
                      </p>
                      <PairsEditor
                        label="Applications"
                        items={(active.applications ?? []) as any}
                        fields={[
                          { key: "label", label: "Application Name", placeholder: "e.g. Mining Facilities" },
                          { key: "slug", label: "Application Slug", placeholder: "e.g. mining" },
                          { key: "description", label: "Short Description", placeholder: "How this product is used here…", multiline: true },
                        ]}
                        onChange={v => set("applications", v as any)}
                        newItem={{ label: "", slug: "", description: "" } as any}
                      />
                    </TabsContent>

                    {/* ── INDUSTRIES ── */}
                    <TabsContent value="industries" className="p-6 m-0">
                      <SectionHeading>Industries That Use This Product</SectionHeading>
                      <p className="text-xs text-muted-foreground mb-4">
                        Industry icons shown in the "Industries" grid. The slug links to <code className="bg-surface px-1 rounded">/applications/[slug]</code>.
                      </p>
                      <PairsEditor
                        label="Industries"
                        items={(active.industries ?? []) as any}
                        fields={[
                          { key: "label", label: "Industry Name", placeholder: "e.g. Mining" },
                          { key: "slug", label: "Industry Slug", placeholder: "e.g. mining" },
                        ]}
                        onChange={v => set("industries", v as any)}
                        newItem={{ label: "", slug: "" } as any}
                      />
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
    </div>
  );
}
