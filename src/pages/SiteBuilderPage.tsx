import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import type { HierarchySection, HierarchyItem, HierarchyChild } from "@/types/hierarchy";
import { getDefaultSections } from "@/lib/hierarchy-utils";
import { HierarchyTree } from "@/components/admin/HierarchyTree";
import { ContentEditorPanel } from "@/components/admin/ContentEditorPanel";
import { HomepageBuilderTab } from "@/components/admin/HomepageBuilderTab";
import { MegaMenuBuilderTab } from "@/components/admin/MegaMenuBuilderTab";
import { RegionalCoverageBuilderTab } from "@/components/admin/RegionalCoverageBuilderTab";
import { ContactsBuilderTab } from "@/components/admin/ContactsBuilderTab";
import { FooterBuilderTab } from "@/components/admin/FooterBuilderTab";
import { CatalogueBuilderTab } from "@/components/admin/CatalogueBuilderTab";
import { AboutBuilderTab } from "@/components/admin/AboutBuilderTab";

type SectionKey = "products" | "applications" | "services" | "industries";
type TopLevelTab =
  "homepage" | "megamenu" | "regional" | "about" | "contacts" | "footer" | "catalogue" | SectionKey;

type SelectedNode =
  { type: "item"; itemIdx: number } | { type: "child"; itemIdx: number; childIdx: number };

const SECTION_KEYS: SectionKey[] = ["products", "applications", "services", "industries"];
const CONFIG_KEY = (k: SectionKey) => `hierarchy_${k}`;

export function SiteBuilderPage() {
  const [sections, setSections] = useState<Record<SectionKey, HierarchySection | null>>({
    products: null,
    applications: null,
    services: null,
    industries: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<TopLevelTab>("homepage");
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 2);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const observer = new ResizeObserver(() => {
      checkScroll();
    });
    observer.observe(el);

    const tabList = el.querySelector("[role='tablist']");
    if (tabList) {
      observer.observe(tabList);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleScroll = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Load from Supabase; fall back to hardcoded defaults
  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from("site_config").select("key, value");
        if (error) {
          toast.error("Failed to load config: " + error.message);
          return;
        }
        const defaults = getDefaultSections();
        const result: Record<SectionKey, HierarchySection> = {} as any;
        for (const key of SECTION_KEYS) {
          const row = data?.find((d) => d.key === CONFIG_KEY(key));
          const val = row?.value as HierarchySection | undefined;
          if (val && Array.isArray(val.items)) {
            result[key] = val;
          } else {
            result[key] = defaults.find((d) => d.key === key)!;
          }
        }
        setSections(result);
      } catch (err: any) {
        toast.error("Failed to load config: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const isHierarchySection = (key: TopLevelTab): key is SectionKey =>
    SECTION_KEYS.includes(key as SectionKey);

  const updateSection = async (key: SectionKey, updated: HierarchySection) => {
    setSections((prev) => {
      const next = { ...prev, [key]: updated };
      return next;
    });
    setSelected(null); // clear selection when tree changes

    // Automatically save section structure changes to database
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: CONFIG_KEY(key), value: updated as any }, { onConflict: "key" });
      if (error) {
        toast.error("Failed to save updated structure: " + error.message);
      } else {
        toast.success("Structure updated and saved.");
      }
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    }
  };

  const updateSelectedNode = async (updatedNode: HierarchyItem | HierarchyChild) => {
    if (!selected || !isHierarchySection(activeSection)) return;
    const section = sections[activeSection];
    if (!section) return;
    const newItems = [...section.items];
    if (selected.type === "item") {
      newItems[selected.itemIdx] = updatedNode as HierarchyItem;
    } else {
      newItems[selected.itemIdx] = {
        ...newItems[selected.itemIdx],
        children: newItems[selected.itemIdx].children.map((c, j) =>
          j === selected.childIdx ? (updatedNode as HierarchyChild) : c,
        ),
      };
    }
    const updatedSection = { ...section, items: newItems };

    // Update local state
    setSections((prev) => {
      const next = { ...prev, [activeSection]: updatedSection };
      return next;
    });

    // Save entire updated section to database immediately
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key: CONFIG_KEY(activeSection), value: updatedSection as any },
          { onConflict: "key" },
        );
      if (error) {
        toast.error("Failed to save changes: " + error.message);
      } else {
        toast.success("Item changes saved successfully.");
      }
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentSection = isHierarchySection(activeSection) ? sections[activeSection] : null;
  const selectedNode =
    selected && currentSection
      ? selected.type === "item"
        ? currentSection.items[selected.itemIdx]
        : currentSection.items[selected.itemIdx]?.children[selected.childIdx]
      : null;

  if (loading) {
    return (
      <div className="h-full flex flex-col animate-pulse">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Tabs list */}
        <div className="px-6 pt-3 pb-2 bg-transparent border-b border-border flex gap-4 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>

        {/* Main content grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Tree sidebar */}
          <div className="w-72 border-r border-border flex flex-col bg-surface/30 shrink-0 p-4 space-y-4">
            <Skeleton className="h-4 w-36" />
            <div className="space-y-3 pt-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-44" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Editor */}
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Site Builder</h2>
          <p className="text-sm text-muted-foreground">
            Manage navigation hierarchy, homepage content, and page sections from one place.
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <Tabs
        value={activeSection}
        onValueChange={(v) => {
          setActiveSection(v as TopLevelTab);
          setSelected(null);
        }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="relative border-b border-border bg-background shrink-0">
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              onClick={() => handleScroll(-200)}
              className="absolute left-0 top-0 bottom-0 z-10 px-3 flex items-center bg-gradient-to-r from-background via-background/95 to-transparent text-muted-foreground hover:text-foreground transition-all duration-200"
              title="Scroll Left"
              type="button"
            >
              <ChevronLeft className="h-5 w-5 bg-background/80 rounded-full border border-border/50 shadow-sm p-0.5" />
            </button>
          )}

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              onClick={() => handleScroll(200)}
              className="absolute right-0 top-0 bottom-0 z-10 px-3 flex items-center bg-gradient-to-l from-background via-background/95 to-transparent text-muted-foreground hover:text-foreground transition-all duration-200"
              title="Scroll Right"
              type="button"
            >
              <ChevronRight className="h-5 w-5 bg-background/80 rounded-full border border-border/50 shadow-sm p-0.5" />
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            data-testid="site-builder-scroll-container"
            className="overflow-x-auto scrollbar-none scroll-smooth flex justify-start w-full"
          >
            <TabsList className="px-6 pt-3 pb-0 bg-transparent border-b-0 rounded-none justify-start h-auto gap-0 shrink-0 flex flex-nowrap w-max min-w-full">
              {/* Homepage tab — always first */}
              <TabsTrigger
                value="homepage"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                Homepage
              </TabsTrigger>
              <TabsTrigger
                value="megamenu"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                Mega Menu
              </TabsTrigger>
              <TabsTrigger
                value="regional"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                Regional Coverage
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                About Page
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                Contact Page
              </TabsTrigger>
              <TabsTrigger
                value="footer"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                Footer
              </TabsTrigger>
              <TabsTrigger
                value="catalogue"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
              >
                Catalogue Page
              </TabsTrigger>
              {SECTION_KEYS.map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 capitalize font-semibold text-sm hover:cursor-pointer whitespace-nowrap"
                >
                  {sections[key]?.label ?? key}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Homepage tab content */}
        <TabsContent value="homepage" className="flex-1 overflow-hidden m-0">
          <HomepageBuilderTab />
        </TabsContent>

        {/* Mega Menu tab content */}
        <TabsContent value="megamenu" className="flex-1 overflow-hidden m-0">
          <MegaMenuBuilderTab
            initialSections={sections}
            onSectionsChange={(updatedSections) => {
              setSections(updatedSections);
            }}
          />
        </TabsContent>

        {/* Regional Coverage tab content */}
        <TabsContent value="regional" className="flex-1 overflow-hidden m-0">
          <RegionalCoverageBuilderTab />
        </TabsContent>

        {/* About Page tab content */}
        <TabsContent value="about" className="flex-1 overflow-hidden m-0">
          <AboutBuilderTab />
        </TabsContent>

        {/* Contact Page tab content */}
        <TabsContent value="contacts" className="flex-1 overflow-hidden m-0">
          <ContactsBuilderTab />
        </TabsContent>

        {/* Footer tab content */}
        <TabsContent value="footer" className="flex-1 overflow-hidden m-0">
          <FooterBuilderTab />
        </TabsContent>

        {/* Catalogue Page tab content */}
        <TabsContent value="catalogue" className="flex-1 overflow-hidden m-0">
          <CatalogueBuilderTab />
        </TabsContent>

        {/* Navigation hierarchy tabs */}
        {SECTION_KEYS.map((key) => (
          <TabsContent key={key} value={key} className="flex-1 overflow-hidden m-0">
            <div className="flex h-full">
              {/* LEFT: Tree */}
              <div className="w-72 border-r border-border flex flex-col bg-surface/30 shrink-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Drag to reorder · Click to edit
                  </p>
                </div>
                {sections[key] && (
                  <HierarchyTree
                    section={sections[key]!}
                    sectionKey={key}
                    onChange={(updated) => updateSection(key, updated)}
                    onSelect={(node) => setSelected(node)}
                    selected={
                      isHierarchySection(activeSection) && activeSection === key ? selected : null
                    }
                  />
                )}
              </div>

              {/* RIGHT: Editor */}
              <div className="flex-1 overflow-hidden">
                {selectedNode && isHierarchySection(activeSection) && activeSection === key ? (
                  <ContentEditorPanel
                    key={`${selected?.type}-${selected?.type === "item" ? selected.itemIdx : `${selected?.itemIdx}-${(selected as any).childIdx}`}`}
                    node={selectedNode}
                    isChild={selected?.type === "child"}
                    sectionKey={key}
                    onSave={updateSelectedNode}
                    saving={saving}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="text-4xl">←</div>
                    <p className="text-sm font-medium">Select an item from the tree to edit it</p>
                    <p className="text-xs max-w-xs text-center">
                      Click any category or sub-item on the left to edit its page content, SEO, and
                      mega menu appearance simultaneously.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
