import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { megaMenus as defaultMegaMenus, type MegaMenuConfig, type MegaFeatureItem, type MegaProductItem, type MegaQuickAction } from "@/components/site/mega-menu-data";

export const Route = createFileRoute("/admin/site-builder")({
  component: SiteBuilderPage,
});

function SiteBuilderPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
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
      } else if (data && data.value) {
        setConfig(data.value);
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

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading site builder...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Site Builder</h2>
          <p className="text-sm text-muted-foreground">Customize mega menu featured thumbnails and links.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-hover">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          {defaultMegaMenus.map(m => (
            <TabsTrigger 
              key={m.key} 
              value={m.key}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
            >
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {defaultMegaMenus.map(menu => (
          <TabsContent key={menu.key} value={menu.key} className="pt-6">
            <MenuEditor 
              menuKey={menu.key}
              defaultConfig={menu.columns}
              value={config[menu.key] || {}}
              onChange={(newVal) => setConfig({ ...config, [menu.key]: newVal })}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function MenuEditor({ menuKey, defaultConfig, value, onChange }: { 
  menuKey: string, 
  defaultConfig: MegaMenuConfig['columns'], 
  value: any, 
  onChange: (val: any) => void 
}) {
  const featuredItems = value.featured || defaultConfig.featured;

  const updateFeatured = (index: number, field: string, val: string) => {
    const updated = [...featuredItems];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...value, featured: updated });
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded p-6">
        <h3 className="font-display text-lg font-bold uppercase mb-4">Featured Items</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredItems.map((item: any, i: number) => (
            <div key={i} className="space-y-4 border border-border p-4 rounded bg-surface">
              <div className="font-bold text-sm">Item {i + 1}</div>
              
              {defaultConfig.featuredKind === "image" && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Image URL</label>
                    <Input value={item.image || ""} onChange={e => updateFeatured(i, "image", e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Title</label>
                    <Input value={item.title || ""} onChange={e => updateFeatured(i, "title", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Description</label>
                    <Textarea value={item.description || ""} onChange={e => updateFeatured(i, "description", e.target.value)} rows={2} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Link (To)</label>
                    <Input value={item.to || ""} onChange={e => updateFeatured(i, "to", e.target.value)} placeholder="/applications/..." />
                  </div>
                </>
              )}

              {defaultConfig.featuredKind === "product" && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Product Name</label>
                    <Input value={item.label || ""} onChange={e => updateFeatured(i, "label", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Specification</label>
                    <Input value={item.spec || ""} onChange={e => updateFeatured(i, "spec", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Link (To)</label>
                    <Input value={item.to || ""} onChange={e => updateFeatured(i, "to", e.target.value)} placeholder="/products/..." />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
