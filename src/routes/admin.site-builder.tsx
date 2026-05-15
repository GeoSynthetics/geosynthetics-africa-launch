import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { megaMenus as defaultMegaMenus, type MegaMenuConfig, type MegaLink, type MegaFeatureItem, type MegaProductItem, type MegaQuickAction } from "@/components/site/mega-menu-data";
import { Trash2, Plus, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/site-builder")({
  component: SiteBuilderPage,
});

function SiteBuilderPage() {
  const [config, setConfig] = useState<MegaMenuConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "mega_menu")
        .maybeSingle();

      if (error) {
        toast.error("Failed to load config: " + error.message);
      } else if (data && data.value && Array.isArray(data.value)) {
        setConfig(data.value as MegaMenuConfig[]);
      } else {
        setConfig(defaultMegaMenus);
      }
      setLoading(false);
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: "mega_menu", value: config }, { onConflict: "key" });

    if (error) {
      toast.error("Failed to save config: " + error.message);
    } else {
      toast.success("Site configuration saved successfully.");
    }
    setSaving(false);
  };

  const updateMenu = (index: number, newMenu: MegaMenuConfig) => {
    const newConfig = [...config];
    newConfig[index] = newMenu;
    setConfig(newConfig);
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading site builder...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Site Builder</h2>
          <p className="text-sm text-muted-foreground">Full visual editor for the Mega Menu.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-hover text-primary-foreground">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue={config[0]?.key} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 overflow-x-auto overflow-y-hidden">
          {config.map(m => (
            <TabsTrigger
              key={m.key}
              value={m.key}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent whitespace-nowrap px-4 pb-2 pt-2 hover:cursor-pointer"
            >
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {config.map((menu, idx) => (
          <TabsContent key={menu.key} value={menu.key} className="pt-6">
            <MenuTab menu={menu} updateMenu={(m) => updateMenu(idx, m)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function MenuTab({ menu, updateMenu }: { menu: MegaMenuConfig, updateMenu: (m: MegaMenuConfig) => void }) {
  return (
    <Tabs defaultValue="defaults" className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64 flex-shrink-0">
        <TabsList className="flex flex-col h-auto bg-transparent items-stretch space-y-1 p-0">
          <TabsTrigger value="defaults" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2 text-left hover:cursor-pointer">
            System - Default Menu
          </TabsTrigger>
          <TabsTrigger value="primary" className="justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-2 text-left hover:cursor-pointer">
            Primary Menus & Sub-Menus
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 min-w-0">
        <TabsContent value="defaults" className="m-0 border border-border bg-card rounded p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-4">Fallback Content</h3>
          <p className="text-sm text-muted-foreground mb-6">This content shows when no specific primary link is hovered.</p>
          <ContentEditor
            content={menu.columns}
            onChange={(c) => updateMenu({ ...menu, columns: { ...menu.columns, ...c } })}
            hideSecondary={false}
          />
        </TabsContent>

        <TabsContent value="primary" className="m-0 border border-border bg-card rounded p-0 shadow-sm overflow-hidden">
          <PrimaryLinksEditor
            items={menu.columns.primary}
            onChange={(items) => updateMenu({ ...menu, columns: { ...menu.columns, primary: items } })}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function PrimaryLinksEditor({ items, onChange }: { items: MegaLink[], onChange: (items: MegaLink[]) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = items[activeIdx];

  const updateActive = (newItem: MegaLink) => {
    const updated = [...items];
    updated[activeIdx] = newItem;
    onChange(updated);
  };

  const addItem = () => {
    const newItem: MegaLink = {
      label: "New Category", to: "/", content: {
        secondaryTitle: "Links", secondary: [], featuredTitle: "Featured", featuredKind: "product", featured: [], quickActionsTitle: "Quick Actions", quickActions: []
      }
    };
    onChange([...items, newItem]);
    setActiveIdx(items.length);
  };

  const removeItem = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    onChange(updated);
    if (activeIdx >= updated.length) setActiveIdx(Math.max(0, updated.length - 1));
  };

  if (!items || items.length === 0) {
    return <div className="p-6"><Button onClick={addItem}>Add Category</Button></div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[600px]">
      <div className="w-full md:w-64 border-r border-border bg-surface/50 flex flex-col">
        <div className="p-4 border-b border-border font-bold uppercase tracking-wider text-xs flex justify-between items-center text-muted-foreground">
          Categories
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between group ${activeIdx === idx ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent text-foreground'}`}
            >
              <span className="truncate">{item.label}</span>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/20" onClick={(e) => { e.stopPropagation(); removeItem(idx); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Label</label>
              <Input value={activeItem.label} onChange={e => updateActive({ ...activeItem, label: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Link To</label>
              <Input value={activeItem.to} onChange={e => updateActive({ ...activeItem, to: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Icon (Lucide)</label>
              <Input value={activeItem.icon || ""} onChange={e => updateActive({ ...activeItem, icon: e.target.value })} />
            </div>
            {/* Can add params editor here if needed */}
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="font-display text-lg font-bold uppercase mb-4 text-primary">Hover Content (Sub-Menu)</h4>
            <ContentEditor
              content={activeItem.content || {
                secondaryTitle: "Links", secondary: [], featuredTitle: "Featured", featuredKind: "product", featured: [], quickActionsTitle: "Quick Actions", quickActions: []
              }}
              onChange={(c) => updateActive({ ...activeItem, content: { ...(activeItem.content as any), ...c } })}
              hideSecondary={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ content, onChange, hideSecondary = false }: { content: any, onChange: (c: any) => void, hideSecondary?: boolean }) {
  return (
    <div className="space-y-8">
      {!hideSecondary && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Secondary Column Title</label>
            <Input value={content.secondaryTitle || ""} onChange={e => onChange({ secondaryTitle: e.target.value })} className="max-w-[200px]" />
          </div>
          <SimpleLinkListEditor
            items={content.secondary || []}
            onChange={(s) => onChange({ secondary: s })}
          />
        </div>
      )}

      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Featured Title</label>
          <Input value={content.featuredTitle || ""} onChange={e => onChange({ featuredTitle: e.target.value })} className="max-w-[200px]" />

          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap ml-4">Featured Kind</label>
          <Select value={content.featuredKind || "product"} onValueChange={(val) => onChange({ featuredKind: val })}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Products (List)</SelectItem>
              <SelectItem value="image">Images (Cards)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FeaturedEditor
          kind={content.featuredKind || "product"}
          items={content.featured || []}
          onChange={(f) => onChange({ featured: f })}
        />
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Quick Actions Title</label>
          <Input value={content.quickActionsTitle || ""} onChange={e => onChange({ quickActionsTitle: e.target.value })} className="max-w-[200px]" />
        </div>
        <QuickActionEditor
          items={content.quickActions || []}
          onChange={(qa) => onChange({ quickActions: qa })}
        />
      </div>
    </div>
  );
}

function SimpleLinkListEditor({ items, onChange }: { items: MegaLink[], onChange: (items: MegaLink[]) => void }) {
  const add = () => onChange([...items, { label: "New Link", to: "/" }]);
  const update = (idx: number, field: string, val: string) => {
    const up = [...items];
    up[idx] = { ...up[idx], [field]: val };
    onChange(up);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2 border border-border rounded p-4 bg-surface/50">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input placeholder="Label" value={item.label} onChange={e => update(i, "label", e.target.value)} className="w-1/3" />
          <Input placeholder="/path" value={item.to} onChange={e => update(i, "to", e.target.value)} className="flex-1" />
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20" onClick={() => remove(i)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="mt-2 text-xs uppercase font-bold tracking-wider">
        <Plus className="h-3 w-3 mr-2" /> Add Link
      </Button>
    </div>
  );
}

function FeaturedEditor({ kind, items, onChange }: { kind: "product" | "image", items: any[], onChange: (items: any[]) => void }) {
  const add = () => {
    if (kind === "product") onChange([...items, { label: "New Product", spec: "Spec", to: "/" }]);
    else onChange([...items, { title: "New Feature", description: "Desc", image: "https://...", to: "/" }]);
  };
  const update = (idx: number, field: string, val: string) => {
    const up = [...items];
    up[idx] = { ...up[idx], [field]: val };
    onChange(up);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="border border-border p-4 rounded bg-surface relative group">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 bg-background/80 transition-opacity z-10" onClick={() => remove(i)}>
            <Trash2 className="h-4 w-4" />
          </Button>

          {kind === "product" ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Product Label</label>
                <Input value={item.label || ""} onChange={e => update(i, "label", e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Spec / Subtitle</label>
                <Input value={item.spec || ""} onChange={e => update(i, "spec", e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Link (To)</label>
                <Input value={item.to || ""} onChange={e => update(i, "to", e.target.value)} className="h-8 text-sm" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Image URL</label>
                <Input value={item.image || ""} onChange={e => update(i, "image", e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Title</label>
                <Input value={item.title || ""} onChange={e => update(i, "title", e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                <Textarea value={item.description || ""} onChange={e => update(i, "description", e.target.value)} rows={2} className="text-sm resize-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Link (To)</label>
                <Input value={item.to || ""} onChange={e => update(i, "to", e.target.value)} className="h-8 text-sm" />
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="border border-dashed border-border rounded flex items-center justify-center min-h-[150px] bg-surface/50 hover:bg-surface transition-colors">
        <Button variant="ghost" onClick={add} className="font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Featured Item
        </Button>
      </div>
    </div>
  );
}

function QuickActionEditor({ items, onChange }: { items: MegaQuickAction[], onChange: (items: MegaQuickAction[]) => void }) {
  const add = () => onChange([...items, { title: "New Action", description: "Desc", icon: "BookOpen", to: "/" }]);
  const update = (idx: number, field: string, val: string) => {
    const up = [...items];
    up[idx] = { ...up[idx], [field]: val };
    onChange(up);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="border border-border p-4 rounded bg-surface relative group flex flex-col gap-3">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 bg-background/80 transition-opacity z-10" onClick={() => remove(i)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Title</label>
            <Input value={item.title || ""} onChange={e => update(i, "title", e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
            <Input value={item.description || ""} onChange={e => update(i, "description", e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Icon</label>
              <Input value={item.icon || ""} onChange={e => update(i, "icon", e.target.value)} className="h-8 text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Link To</label>
              <Input value={item.to || ""} onChange={e => update(i, "to", e.target.value)} className="h-8 text-sm" />
            </div>
          </div>
        </div>
      ))}
      <div className="border border-dashed border-border rounded flex items-center justify-center min-h-[100px] bg-surface/50 hover:bg-surface transition-colors">
        <Button variant="ghost" onClick={add} className="font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Quick Action
        </Button>
      </div>
    </div>
  );
}
