import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  LayoutGrid,
  Image as ImageIcon,
  Compass,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDefaultSections } from "@/lib/hierarchy-utils";
import { IconPicker } from "./IconPicker";
import { ImagePicker } from "./ImagePicker";
import { LinkTargetPicker } from "./LinkTargetPicker";
import { ProductSelector, type ProductData } from "./ProductSelector";
import { QuickActionsEditor } from "./TemplateEditorShared";
import type {
  HierarchySection,
  HierarchyItem,
  HierarchyChild,
  MegaContent,
  QuickAction,
  FeaturedProduct,
  FeaturedImage,
} from "@/types/hierarchy";

type SectionKey = "products" | "applications" | "services" | "industries";

const SECTION_KEYS: SectionKey[] = ["products", "applications", "services", "industries"];

const CONFIG_KEY = (key: SectionKey) => `hierarchy_${key}`;

interface MegaMenuBuilderTabProps {
  initialSections?: Record<SectionKey, HierarchySection | null>;
  onSectionsChange?: (sections: Record<SectionKey, HierarchySection | null>) => void;
}

export function MegaMenuBuilderTab({
  initialSections,
  onSectionsChange,
}: MegaMenuBuilderTabProps = {}) {
  const [activeSection, setActiveSection] = useState<SectionKey>("products");
  const [sections, setSections] = useState<Record<SectionKey, HierarchySection | null>>(() => {
    return (
      initialSections ?? {
        products: null,
        applications: null,
        services: null,
        industries: null,
      }
    );
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(0);
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);

  // Sync sections from parent when it changes
  useEffect(() => {
    if (initialSections) {
      setSections(initialSections);
    }
  }, [initialSections]);

  // Fetch sections & product database
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const needToLoadSections =
          !initialSections || Object.values(initialSections).some((v) => v === null);
        if (needToLoadSections) {
          // Load sections
          const { data: configData, error: configError } = await supabase
            .from("site_config")
            .select("key, value")
            .in("key", SECTION_KEYS.map(CONFIG_KEY));

          if (configError) throw configError;

          const result: Record<SectionKey, HierarchySection | null> = {
            products: null,
            applications: null,
            services: null,
            industries: null,
          };

          const defaults = getDefaultSections();
          SECTION_KEYS.forEach((key) => {
            const row = configData?.find((d) => d.key === CONFIG_KEY(key));
            const val = row?.value as HierarchySection | undefined;
            if (val && Array.isArray(val.items)) {
              result[key] = val;
            } else {
              result[key] = defaults.find((d: any) => d.key === key) || null;
            }
          });

          setSections(result);
          if (onSectionsChange) {
            onSectionsChange(result);
          }
        }

        // Load database products
        const { data: prodData } = await supabase
          .from("products")
          .select(
            "id, name, slug, image_url, short_description, thickness_mm, roll_width_m, roll_length_m, product_categories(slug, name)",
          )
          .order("name");

        if (prodData) {
          const mapped: ProductData[] = prodData.map((d: any) => ({
            ...d,
            product_categories: Array.isArray(d.product_categories)
              ? d.product_categories[0]
              : d.product_categories,
          }));
          setAllProducts(mapped);
        }
      } catch (err: any) {
        toast.error("Failed to load mega menu configs: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentSection = sections[activeSection];

  // Selected primary HierarchyItem
  const activeItem = useMemo(() => {
    if (!currentSection || selectedItemIdx === null) return null;
    return currentSection.items[selectedItemIdx] || null;
  }, [currentSection, selectedItemIdx]);

  // Clean HTML from text
  const stripHtml = (html: string | null | undefined): string => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Truncate specs
  const truncateSpec = (spec: string | null | undefined): string => {
    if (!spec) return "";
    return spec.slice(0, 62);
  };

  // Helper to update current section in state
  const updateSectionState = (updated: HierarchySection, markDirty = true) => {
    const nextSections = {
      ...sections,
      [activeSection]: updated,
    };
    setSections(nextSections);
    if (onSectionsChange) {
      onSectionsChange(nextSections);
    }
    if (markDirty) {
      setDirty(true);
    }
  };

  // Helper to update selected primary item
  const updateActiveItem = (updater: (item: HierarchyItem) => HierarchyItem) => {
    if (!currentSection || selectedItemIdx === null || !activeItem) return;
    const items = [...currentSection.items];
    items[selectedItemIdx] = updater(items[selectedItemIdx]);
    updateSectionState({ ...currentSection, items });
  };

  // Save current active section
  const handleSaveSection = async () => {
    if (!currentSection) return;
    setSaving(true);

    try {
      // Clean quick actions at item level (quick actions are section-level)
      const cleanedItems = currentSection.items.map((item) => {
        const itemCopy = { ...item };
        if (itemCopy.quickActions) {
          delete itemCopy.quickActions;
        }
        if (itemCopy.megaFallback) {
          const fallbackCopy = { ...itemCopy.megaFallback };
          if (fallbackCopy.quickActions) {
            delete fallbackCopy.quickActions;
          }
          itemCopy.megaFallback = fallbackCopy;
        }
        return itemCopy;
      });

      const updatedSection = {
        ...currentSection,
        items: cleanedItems,
      };

      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key: CONFIG_KEY(activeSection), value: updatedSection as any },
          { onConflict: "key" },
        );

      if (error) throw error;
      toast.success(`${currentSection.label} Mega Menu saved successfully.`);
      updateSectionState(updatedSection, false);
      setDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Primary Item Operations ──
  const handleAddPrimaryItem = () => {
    if (!currentSection) return;
    const newItem: HierarchyItem = {
      id: `item-${Date.now()}`,
      slug: `new-item`,
      label: "New Menu Item",
      icon: "Layers",
      to: "/$slug",
      params: { slug: "new-item" },
      children: [],
      megaFallback: {
        secondaryTitle: "New Menu Item",
        secondary: [],
        featuredTitle: "Featured",
        featuredKind: "product",
        featured: [],
      },
    };
    const updated = {
      ...currentSection,
      items: [...currentSection.items, newItem],
    };
    updateSectionState(updated);
    setSelectedItemIdx(updated.items.length - 1);
  };

  const handleDeletePrimaryItem = (idx: number) => {
    if (!currentSection) return;
    const items = currentSection.items.filter((_, i) => i !== idx);
    updateSectionState({ ...currentSection, items });
    setSelectedItemIdx(items.length > 0 ? 0 : null);
  };

  const handleMovePrimaryItem = (idx: number, direction: "up" | "down") => {
    if (!currentSection) return;
    const items = [...currentSection.items];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[idx];
    items[idx] = items[targetIdx];
    items[targetIdx] = temp;

    updateSectionState({ ...currentSection, items });
    setSelectedItemIdx(targetIdx);
  };

  // ── Child / Sub Link Operations (Products only) ──
  const handleAddChildItem = () => {
    if (!activeItem) return;
    const newChild: HierarchyChild = {
      id: `child-${Date.now()}`,
      slug: "new-sub-link",
      label: "New Sub Link",
      to: "/products/$category/$family",
      params: { category: activeItem.slug || activeItem.id, family: "new-sub-link" },
    };
    updateActiveItem((item) => ({
      ...item,
      children: [...item.children, newChild],
    }));
  };

  const handleDeleteChildItem = (childIdx: number) => {
    updateActiveItem((item) => ({
      ...item,
      children: item.children.filter((_, i) => i !== childIdx),
    }));
  };

  const handleMoveChildItem = (childIdx: number, direction: "up" | "down") => {
    if (!activeItem) return;
    const children = [...activeItem.children];
    const targetIdx = direction === "up" ? childIdx - 1 : childIdx + 1;
    if (targetIdx < 0 || targetIdx >= children.length) return;

    const temp = children[childIdx];
    children[childIdx] = children[targetIdx];
    children[targetIdx] = temp;

    updateActiveItem((item) => ({
      ...item,
      children,
    }));
  };

  const handleUpdateChildItem = (childIdx: number, patch: Partial<HierarchyChild>) => {
    updateActiveItem((item) => {
      const children = [...item.children];
      children[childIdx] = { ...children[childIdx], ...patch };
      return { ...item, children };
    });
  };

  if (loading) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
          Loading Mega Menu Architect...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Section Tabs */}
      <div className="bg-surface border-b border-border p-4 shrink-0 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <Tabs
          value={activeSection}
          onValueChange={(v) => {
            setActiveSection(v as SectionKey);
            setSelectedItemIdx(0);
          }}
          className="w-auto"
        >
          <TabsList className="bg-muted p-1 border border-border rounded-xl gap-1">
            {SECTION_KEYS.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:cursor-pointer"
              >
                {sections[key]?.label || key}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          {dirty && !saving && !saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded-lg animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              Unsaved Changes
            </span>
          )}
          <Button
            onClick={handleSaveSection}
            className={cn(
              "font-bold uppercase tracking-widest text-xs h-9 px-5 gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:cursor-pointer",
              saveSuccess
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                : dirty
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
                  : "bg-primary hover:bg-primary-hover text-white shadow-primary/20",
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving
              ? "Saving Changes..."
              : saveSuccess
                ? "Saved!"
                : `Save ${currentSection?.label || activeSection} Menu`}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0">
        {/* LEFT COLUMN: Sidebar list of Primary Items & Section Settings */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border/60 bg-surface/30 flex flex-col shrink-0 p-4 space-y-5 lg:overflow-y-auto">
          {/* Section Fallback Settings (quick actions, fallback layout title) */}
          {currentSection && (
            <Card className="border-border bg-card rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300">
              <CardHeader className="p-3 border-b border-border/40">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> Section Configuration
                </CardTitle>
                <CardDescription className="text-[9px] text-muted-foreground">
                  Global settings for this entire menu column layout
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-1">
                    Primary Column Header
                  </label>
                  <Input
                    value={currentSection.primaryTitle}
                    onChange={(e) =>
                      updateSectionState({
                        ...currentSection,
                        primaryTitle: e.target.value,
                      })
                    }
                    className="text-xs h-8 bg-background border-border hover:border-primary/20"
                    placeholder="Browse categories..."
                  />
                </div>

                <div className="border-t border-border/40 pt-3">
                  <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-2">
                    Section Quick Actions
                  </label>
                  <QuickActionsEditor
                    items={currentSection.fallbackContent?.quickActions || []}
                    onChange={(qaList) =>
                      updateSectionState({
                        ...currentSection,
                        fallbackContent: {
                          ...(currentSection.fallbackContent || {}),
                          quickActions: qaList as QuickAction[],
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Primary Nav List (Column 1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <LayoutGrid className="h-3 w-3 text-primary" /> Primary Navigation
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddPrimaryItem}
                className="h-6 text-[10px] text-primary hover:text-primary-hover font-bold uppercase tracking-wider p-0 gap-1 hover:cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </Button>
            </div>

            <div className="space-y-1.5">
              {currentSection?.items.map((item, idx) => {
                const isSelected = selectedItemIdx === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemIdx(idx)}
                    className={cn(
                      "group flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold cursor-pointer border transition-all duration-300",
                      isSelected
                        ? "bg-primary/10 text-primary border-primary shadow-sm shadow-primary/5 translate-x-1"
                        : "bg-surface/30 text-foreground hover:bg-accent/40 border-border/40 hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-muted-foreground select-none text-[10px] w-4 text-center font-mono">
                        {idx + 1}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovePrimaryItem(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="h-5 w-5 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovePrimaryItem(idx, "down");
                        }}
                        disabled={idx === currentSection.items.length - 1}
                        className="h-5 w-5 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrimaryItem(idx);
                        }}
                        className="h-5 w-5 hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {(!currentSection?.items || currentSection.items.length === 0) && (
                <p className="text-[11px] text-muted-foreground italic text-center py-6 border border-dashed border-border/40 rounded-xl">
                  No items configured.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Column Config Detail Panel */}
        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {activeItem ? (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-foreground">
                    Configure: {activeItem.label}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {activeItem.slug}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    selectedItemIdx !== null && handleDeletePrimaryItem(selectedItemIdx)
                  }
                  className="border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-destructive font-bold uppercase tracking-wider text-[10px] h-8 hover:cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Item
                </Button>
              </div>

              {/* CARD 1: Identity / Route Parameters */}
              <Card className="border-border bg-card rounded-xl hover:border-primary/10 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Compass className="h-4 w-4" /> Identity & Navigation Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Navigation Label
                      </label>
                      <Input
                        value={activeItem.label}
                        onChange={(e) =>
                          updateActiveItem((item) => ({ ...item, label: e.target.value }))
                        }
                        className="text-xs bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                        Menu Icon
                      </label>
                      <IconPicker
                        value={activeItem.icon || ""}
                        onChange={(iconName) =>
                          updateActiveItem((item) => ({ ...item, icon: iconName }))
                        }
                        placeholder="Select menu icon..."
                      />
                    </div>
                  </div>

                  <div>
                    <LinkTargetPicker
                      to={activeItem.to}
                      params={activeItem.params}
                      onChange={(to, params) =>
                        updateActiveItem((item) => {
                          const slug =
                            params?.slug || params?.category || to.split("/").pop() || "";
                          return {
                            ...item,
                            to,
                            params,
                            slug,
                          };
                        })
                      }
                      sectionContext={activeSection}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: Column 2 (Secondary Column content) */}
              <Card className="border-border bg-card rounded-xl hover:border-primary/10 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <LayoutGrid className="h-4 w-4" /> Column 2: Secondary Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {activeSection === "products" ? (
                    // Products Category children links
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                            Sub-links / Child Pages ({activeItem.children.length})
                          </h4>
                          <p className="text-[10px] text-muted-foreground">
                            Display lists of sub-items under this category link
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddChildItem}
                          className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary-hover border-primary/20 hover:cursor-pointer"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Sub-link
                        </Button>
                      </div>

                      <div className="space-y-3.5 max-w-3xl">
                        {activeItem.children.map((child, idx) => (
                          <div
                            key={child.id}
                            className="border border-border bg-surface/50 p-3.5 rounded-xl space-y-3 relative group"
                          >
                            {/* Action Buttons for sub-item */}
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveChildItem(idx, "up")}
                                disabled={idx === 0}
                                className="h-6 w-6 text-muted-foreground hover:bg-accent/40"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveChildItem(idx, "down")}
                                disabled={idx === activeItem.children.length - 1}
                                className="h-6 w-6 text-muted-foreground hover:bg-accent/40"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteChildItem(idx)}
                                className="h-6 w-6 text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-[85%]">
                              <div>
                                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                                  Sub-link Label
                                </label>
                                <Input
                                  value={child.label}
                                  onChange={(e) =>
                                    handleUpdateChildItem(idx, { label: e.target.value })
                                  }
                                  className="text-xs bg-background h-8"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                                  Menu Icon (Optional)
                                </label>
                                <IconPicker
                                  value={child.icon || ""}
                                  onChange={(iconName) =>
                                    handleUpdateChildItem(idx, { icon: iconName })
                                  }
                                  placeholder="Select optional icon..."
                                  className="h-8"
                                />
                              </div>
                            </div>

                            <div className="pt-1">
                              <LinkTargetPicker
                                to={child.to}
                                params={child.params}
                                onChange={(to, params) => {
                                  const slug =
                                    params?.slug || params?.family || to.split("/").pop() || "";
                                  handleUpdateChildItem(idx, {
                                    to,
                                    params,
                                    slug,
                                  });
                                }}
                                sectionContext={activeSection}
                                compact
                              />
                            </div>
                          </div>
                        ))}

                        {activeItem.children.length === 0 && (
                          <p className="text-xs text-muted-foreground italic text-center py-6 border border-dashed border-border/40 rounded-xl">
                            No sub-links configured. Click "+ Add Sub-link" to add one.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Applications, Services, Industries - Top Selling Slider
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                          Top Selling Products Slider (Max 5)
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Select products to display as sliding catalog best-sellers for this
                          category
                        </p>
                      </div>

                      <div className="space-y-2 max-w-md">
                        {(activeItem.megaFallback?.topSellingProductIds || []).map((pId) => {
                          const product = allProducts.find((p) => p.id === pId);
                          return (
                            <div
                              key={pId}
                              className="flex items-center justify-between p-2.5 bg-background border border-border rounded-xl text-xs font-semibold shadow-sm"
                            >
                              <span className="truncate">
                                {product ? product.name : `Product ID: ${pId}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  const oldIds =
                                    activeItem.megaFallback?.topSellingProductIds || [];
                                  updateActiveItem((item) => ({
                                    ...item,
                                    megaFallback: {
                                      ...(item.megaFallback || {}),
                                      topSellingProductIds: oldIds.filter((id) => id !== pId),
                                    },
                                  }));
                                }}
                              >
                                ✕
                              </Button>
                            </div>
                          );
                        })}

                        {(!activeItem.megaFallback?.topSellingProductIds ||
                          activeItem.megaFallback?.topSellingProductIds.length === 0) && (
                          <p className="text-xs text-muted-foreground italic">
                            No top selling products selected.
                          </p>
                        )}
                      </div>

                      {(activeItem.megaFallback?.topSellingProductIds || []).length < 5 && (
                        <div className="max-w-md pt-1">
                          <ProductSelector
                            excludeIds={activeItem.megaFallback?.topSellingProductIds || []}
                            onSelect={(prod) => {
                              const oldIds = activeItem.megaFallback?.topSellingProductIds || [];
                              updateActiveItem((item) => ({
                                ...item,
                                megaFallback: {
                                  ...(item.megaFallback || {}),
                                  topSellingProductIds: [...oldIds, prod.id],
                                },
                              }));
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CARD 3: Column 3 (Featured Column content) */}
              <Card className="border-border bg-card rounded-xl hover:border-primary/10 transition-all duration-300">
                <CardHeader className="p-4 border-b border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:space-y-0">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Zap className="h-4 w-4" /> Column 3: Featured Content
                  </CardTitle>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select
                      value={activeItem.megaFallback?.featuredKind || "product"}
                      onValueChange={(kind: "product" | "image") =>
                        updateActiveItem((item) => ({
                          ...item,
                          megaFallback: {
                            ...(item.megaFallback || {}),
                            featuredKind: kind,
                            featured: [], // reset featured list when swapping kind
                          },
                        }))
                      }
                    >
                      <SelectTrigger className="h-7 text-[10px] w-28 bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="product" className="text-xs">
                          Featured Products
                        </SelectItem>
                        <SelectItem value="image" className="text-xs">
                          Featured Cards
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                      Featured Column Title
                    </label>
                    <Input
                      value={activeItem.megaFallback?.featuredTitle ?? "Featured"}
                      onChange={(e) =>
                        updateActiveItem((item) => ({
                          ...item,
                          megaFallback: {
                            ...(item.megaFallback || {}),
                            featuredTitle: e.target.value,
                          },
                        }))
                      }
                      className="text-xs bg-background h-8 max-w-sm"
                      placeholder="e.g. Featured Products"
                    />
                  </div>

                  {activeItem.megaFallback?.featuredKind === "image" ? (
                    // Featured Image Cards configuration
                    <div className="space-y-4 border-t border-border/40 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                          Featured Image Cards (Max 4)
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={(activeItem.megaFallback?.featured || []).length >= 4}
                          onClick={() => {
                            const oldFeatured = activeItem.megaFallback?.featured || [];
                            updateActiveItem((item) => ({
                              ...item,
                              megaFallback: {
                                ...(item.megaFallback || {}),
                                featured: [
                                  ...oldFeatured,
                                  { title: "", description: "", image: "", to: "/" },
                                ] as any[],
                              },
                            }));
                          }}
                          className="h-7 text-[10px] font-bold uppercase tracking-wider text-primary border-primary/20 hover:cursor-pointer"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Image Card
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {((activeItem.megaFallback?.featured as FeaturedImage[]) || []).map(
                          (card, i) => (
                            <div
                              key={i}
                              className="border border-border bg-surface/50 p-4 rounded-xl space-y-3 relative"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  const oldFeatured = activeItem.megaFallback?.featured || [];
                                  updateActiveItem((item) => ({
                                    ...item,
                                    megaFallback: {
                                      ...(item.megaFallback || {}),
                                      featured: oldFeatured.filter((_, idx) => idx !== i) as any[],
                                    },
                                  }));
                                }}
                              >
                                ✕
                              </Button>

                              <div>
                                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                                  Card Title
                                </label>
                                <Input
                                  value={card.title}
                                  onChange={(e) => {
                                    const list = [
                                      ...(activeItem.megaFallback?.featured || []),
                                    ] as FeaturedImage[];
                                    list[i] = { ...list[i], title: e.target.value };
                                    updateActiveItem((item) => ({
                                      ...item,
                                      megaFallback: {
                                        ...(item.megaFallback || {}),
                                        featured: list,
                                      },
                                    }));
                                  }}
                                  className="text-xs bg-background h-8"
                                  placeholder="E.g. GeoSynthetics Africa member"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                                  Card Description
                                </label>
                                <Textarea
                                  value={card.description}
                                  onChange={(e) => {
                                    const list = [
                                      ...(activeItem.megaFallback?.featured || []),
                                    ] as FeaturedImage[];
                                    list[i] = { ...list[i], description: e.target.value };
                                    updateActiveItem((item) => ({
                                      ...item,
                                      megaFallback: {
                                        ...(item.megaFallback || {}),
                                        featured: list,
                                      },
                                    }));
                                  }}
                                  className="text-xs bg-background min-h-[60px] resize-none"
                                  placeholder="Short promotional subtitle..."
                                />
                              </div>

                              <div>
                                <ImagePicker
                                  label="Card Banner Image"
                                  value={card.image}
                                  onChange={(url) => {
                                    const list = [
                                      ...(activeItem.megaFallback?.featured || []),
                                    ] as FeaturedImage[];
                                    list[i] = { ...list[i], image: url };
                                    updateActiveItem((item) => ({
                                      ...item,
                                      megaFallback: {
                                        ...(item.megaFallback || {}),
                                        featured: list,
                                      },
                                    }));
                                  }}
                                  placeholder="Choose background image..."
                                />
                              </div>

                              <div className="pt-1">
                                <LinkTargetPicker
                                  to={card.to}
                                  params={card.params}
                                  onChange={(to, params) => {
                                    const list = [
                                      ...(activeItem.megaFallback?.featured || []),
                                    ] as FeaturedImage[];
                                    list[i] = { ...list[i], to, params };
                                    updateActiveItem((item) => ({
                                      ...item,
                                      megaFallback: {
                                        ...(item.megaFallback || {}),
                                        featured: list,
                                      },
                                    }));
                                  }}
                                  sectionContext={activeSection}
                                  compact
                                />
                              </div>
                            </div>
                          ),
                        )}

                        {(activeItem.megaFallback?.featured || []).length === 0 && (
                          <p className="text-xs text-muted-foreground italic py-6 border border-dashed border-border/40 rounded-xl col-span-1 md:col-span-2 text-center">
                            No featured cards added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Featured Products configuration
                    <div className="space-y-4 border-t border-border/40 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                          Featured Products (Max 4)
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Pick catalog products to highlights in this item's mega menu panel
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {((activeItem.megaFallback?.featured as FeaturedProduct[]) || [])
                          .slice(0, 4)
                          .map((fProd, i) => (
                            <div
                              key={i}
                              className="border border-border bg-surface/50 p-4 rounded-xl space-y-3 relative"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  const oldFeatured = activeItem.megaFallback?.featured || [];
                                  updateActiveItem((item) => ({
                                    ...item,
                                    megaFallback: {
                                      ...(item.megaFallback || {}),
                                      featured: oldFeatured.filter((_, idx) => idx !== i) as any[],
                                    },
                                  }));
                                }}
                              >
                                ✕
                              </Button>

                              <div className="pt-2">
                                <ProductSelector
                                  onSelect={(prod) => {
                                    const list = [
                                      ...(activeItem.megaFallback?.featured || []),
                                    ] as FeaturedProduct[];
                                    const rawDesc =
                                      prod.short_description || prod.product_categories?.name || "";
                                    const cleanDesc = stripHtml(rawDesc);
                                    const baseSpec = prod.thickness_mm
                                      ? `${prod.thickness_mm}mm`
                                      : cleanDesc;

                                    list[i] = {
                                      label: prod.name,
                                      spec: truncateSpec(baseSpec),
                                      to: "/catalogue/$slug",
                                      params: {
                                        slug: prod.slug,
                                      },
                                      image: prod.image_url || "",
                                    };
                                    updateActiveItem((item) => ({
                                      ...item,
                                      megaFallback: {
                                        ...(item.megaFallback || {}),
                                        featured: list,
                                      },
                                    }));
                                  }}
                                />
                              </div>

                              {fProd.label && (
                                <div className="space-y-3 border-t border-border/40 pt-2.5">
                                  <div>
                                    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                                      Display Title Override
                                    </label>
                                    <Input
                                      value={fProd.label}
                                      onChange={(e) => {
                                        const list = [
                                          ...(activeItem.megaFallback?.featured || []),
                                        ] as FeaturedProduct[];
                                        list[i] = { ...list[i], label: e.target.value };
                                        updateActiveItem((item) => ({
                                          ...item,
                                          megaFallback: {
                                            ...(item.megaFallback || {}),
                                            featured: list,
                                          },
                                        }));
                                      }}
                                      className="text-xs bg-background h-8"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-0.5">
                                      <label className="text-[9px] font-bold uppercase text-muted-foreground">
                                        Display Spec / Preview text (max 62 chars)
                                      </label>
                                      <span className="text-[8px] text-muted-foreground font-mono">
                                        {(fProd.spec || "").length}/62
                                      </span>
                                    </div>
                                    <Textarea
                                      value={fProd.spec}
                                      maxLength={62}
                                      onChange={(e) => {
                                        const list = [
                                          ...(activeItem.megaFallback?.featured || []),
                                        ] as FeaturedProduct[];
                                        list[i] = {
                                          ...list[i],
                                          spec: truncateSpec(e.target.value),
                                        };
                                        updateActiveItem((item) => ({
                                          ...item,
                                          megaFallback: {
                                            ...(item.megaFallback || {}),
                                            featured: list,
                                          },
                                        }));
                                      }}
                                      className="text-xs bg-background min-h-[50px] resize-none"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2.5 p-2 bg-surface/60 rounded-lg border border-border">
                                    {fProd.image && (
                                      <img
                                        src={fProd.image}
                                        className="h-8 w-8 rounded object-cover border border-border shrink-0"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[8px] font-bold uppercase text-primary block">
                                        DB Slug Link
                                      </span>
                                      <span className="text-[9px] text-muted-foreground block truncate">
                                        {fProd.params?.slug
                                          ? `/catalogue/${fProd.params.slug}`
                                          : fProd.to}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                        {(activeItem.megaFallback?.featured || []).length < 4 && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const oldFeatured = activeItem.megaFallback?.featured || [];
                              updateActiveItem((item) => ({
                                ...item,
                                megaFallback: {
                                  ...(item.megaFallback || {}),
                                  featured: [
                                    ...oldFeatured,
                                    { label: "", spec: "", to: "/", image: "" },
                                  ] as any[],
                                },
                              }));
                            }}
                            className="min-h-[100px] border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 rounded-xl hover:cursor-pointer"
                          >
                            + Add Featured Product
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Compass className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium">
                Select a navigation item on the left to configure columns
              </p>
              <p className="text-xs max-w-xs text-center">
                Selecting an item allows you to edit its Identity, Column 2 (Sublinks/Slider), and
                Column 3 (Featured Highlights).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
