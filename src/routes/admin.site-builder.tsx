import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import type { HierarchySection, HierarchyItem, HierarchyChild } from "@/types/hierarchy";
import { getDefaultSections } from "@/lib/hierarchy-utils";
import { HierarchyTree } from "@/components/admin/HierarchyTree";
import { ContentEditorPanel } from "@/components/admin/ContentEditorPanel";
import { HomepageBuilderTab } from "@/components/admin/HomepageBuilderTab";

export const Route = createFileRoute("/admin/site-builder")({
  component: SiteBuilderPage,
});

type SectionKey = "products" | "applications" | "services" | "industries";
type TopLevelTab = "homepage" | SectionKey;

type SelectedNode =
  | { type: "item"; itemIdx: number }
  | { type: "child"; itemIdx: number; childIdx: number };

const SECTION_KEYS: SectionKey[] = ["products", "applications", "services", "industries"];
const CONFIG_KEY = (k: SectionKey) => `hierarchy_${k}`;

function SiteBuilderPage() {
  const [sections, setSections] = useState<Record<SectionKey, HierarchySection | null>>({
    products: null, applications: null, services: null, industries: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<TopLevelTab>("homepage");
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  // Load from Supabase; fall back to hardcoded defaults
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("site_config").select("key, value");
      const defaults = getDefaultSections();
      const result: Record<SectionKey, HierarchySection> = {} as any;
      for (const key of SECTION_KEYS) {
        const row = data?.find(d => d.key === CONFIG_KEY(key));
        result[key] = (row?.value as HierarchySection) ?? defaults.find(d => d.key === key)!;
      }
      setSections(result);
      if (error) toast.error("Failed to load config: " + error.message);
      setLoading(false);
    }
    load();
  }, []);

  const saveSection = useCallback(async (key: SectionKey) => {
    const section = sections[key];
    if (!section) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: CONFIG_KEY(key), value: section as any }, { onConflict: "key" });
    if (error) toast.error("Save failed: " + error.message);
    else toast.success(`${section.label} saved.`);
    setSaving(false);
  }, [sections]);

  const isHierarchySection = (key: TopLevelTab): key is SectionKey =>
    SECTION_KEYS.includes(key as SectionKey);

  const updateSection = (key: SectionKey, updated: HierarchySection) => {
    setSections(prev => ({ ...prev, [key]: updated }));
    setSelected(null); // clear selection when tree changes
  };

  const updateSelectedNode = (updatedNode: HierarchyItem | HierarchyChild) => {
    if (!selected || !isHierarchySection(activeSection)) return;
    const section = sections[activeSection];
    if (!section) return;
    let newItems = [...section.items];
    if (selected.type === "item") {
      newItems[selected.itemIdx] = updatedNode as HierarchyItem;
    } else {
      newItems[selected.itemIdx] = {
        ...newItems[selected.itemIdx],
        children: newItems[selected.itemIdx].children.map((c, j) =>
          j === selected.childIdx ? (updatedNode as HierarchyChild) : c
        ),
      };
    }
    setSections(prev => ({ ...prev, [activeSection]: { ...section, items: newItems } }));
    toast.success("Item updated. Don't forget to Save the section.");
  };

  const currentSection = isHierarchySection(activeSection) ? sections[activeSection] : null;
  const selectedNode = selected && currentSection
    ? selected.type === "item"
      ? currentSection.items[selected.itemIdx]
      : currentSection.items[selected.itemIdx]?.children[selected.childIdx]
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-3">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading site builder…
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Site Builder</h2>
          <p className="text-sm text-muted-foreground">Manage navigation hierarchy, homepage content, and page sections from one place.</p>
        </div>
        {activeSection !== "homepage" && (
          <Button
            onClick={() => saveSection(activeSection as SectionKey)}
            disabled={saving}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save {currentSection?.label}
          </Button>
        )}
      </div>

      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={v => { setActiveSection(v as TopLevelTab); setSelected(null); }} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-6 pt-3 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto gap-0 shrink-0">
          {/* Homepage tab — always first */}
          <TabsTrigger
            value="homepage"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 font-semibold text-sm hover:cursor-pointer"
          >
            Homepage
          </TabsTrigger>
          {SECTION_KEYS.map(key => (
            <TabsTrigger
              key={key}
              value={key}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-3 px-5 capitalize font-semibold text-sm hover:cursor-pointer"
            >
              {sections[key]?.label ?? key}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Homepage tab content */}
        <TabsContent value="homepage" className="flex-1 overflow-hidden m-0">
          <HomepageBuilderTab />
        </TabsContent>

        {/* Navigation hierarchy tabs */}
        {SECTION_KEYS.map(key => (
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
                    onChange={updated => updateSection(key, updated)}
                    onSelect={node => setSelected(node)}
                    selected={isHierarchySection(activeSection) && activeSection === key ? selected : null}
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
                    onSave={updateSelectedNode}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="text-4xl">←</div>
                    <p className="text-sm font-medium">Select an item from the tree to edit it</p>
                    <p className="text-xs max-w-xs text-center">
                      Click any category or sub-item on the left to edit its page content, SEO, and mega menu appearance simultaneously.
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
