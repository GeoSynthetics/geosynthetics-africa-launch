import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { SectionHeading, FieldLabel } from "./TemplateEditorShared";
import {
  type CataloguePageContent,
  DEFAULT_CATALOGUE_PAGE_CONTENT,
} from "@/types/catalogue";

const SUPABASE_KEY = "catalogue_page_content";

function HeroEditor({
  data,
  onChange,
}: {
  data: CataloguePageContent["hero"];
  onChange: (v: CataloguePageContent["hero"]) => void;
}) {
  const set = <K extends keyof CataloguePageContent["hero"]>(
    key: K,
    val: CataloguePageContent["hero"][K]
  ) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-6">
      <SectionHeading>Hero Section</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Customize the main hero title, eyebrow, description, and background image for the Catalogue page.
      </p>

      <div>
        <FieldLabel>Eyebrow</FieldLabel>
        <Input
          value={data.eyebrow}
          onChange={(e) => set("eyebrow", e.target.value)}
          placeholder="Catalogue"
          className="text-sm"
        />
      </div>

      <div>
        <FieldLabel>Title</FieldLabel>
        <Input
          value={data.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Engineered Geosynthetic Materials"
          className="text-sm"
        />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <Textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Search and filter our full catalogue of engineered geosynthetic products."
          className="text-sm min-h-[72px] resize-none"
        />
      </div>

      <ImagePicker
        label="Hero Background Image"
        hint="Upload/link a high-resolution background image"
        value={data.bgImage}
        onChange={(v) => set("bgImage", v)}
      />
    </div>
  );
}

const TABS = [{ id: "hero", label: "Hero Section" }];

let catalogueContentCache: CataloguePageContent | null = null;

export function CatalogueBuilderTab() {
  const [content, setContent] = useState<CataloguePageContent>(() => {
    return catalogueContentCache ?? DEFAULT_CATALOGUE_PAGE_CONTENT;
  });
  const [loading, setLoading] = useState(!catalogueContentCache);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const load = useCallback(async () => {
    if (!catalogueContentCache) {
      setLoading(true);
    }
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", SUPABASE_KEY)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load catalogue page content: " + error.message);
    } else if (data?.value) {
      const val = data.value as any;
      const merged: CataloguePageContent = {
        hero: { ...DEFAULT_CATALOGUE_PAGE_CONTENT.hero, ...val.hero },
      };
      setContent(merged);
      catalogueContentCache = merged;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_config")
      .upsert(
        { key: SUPABASE_KEY, value: content as unknown as Record<string, unknown> },
        { onConflict: "key" }
      );

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success("Catalogue page content saved successfully!");
      setDirty(false);
      catalogueContentCache = content;
    }
    setSaving(false);
  };

  const update = (patch: Partial<CataloguePageContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      catalogueContentCache = next;
      return next;
    });
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Loading catalogue builder…</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-surface/30">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wide">Catalogue Page Content</span>
          {dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
              <AlertTriangle className="h-2.5 w-2.5" /> Unsaved
            </span>
          )}
          {!dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              <CheckCircle2 className="h-2.5 w-2.5" /> Saved
            </span>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-bold uppercase tracking-wide text-xs h-8 gap-1.5"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          {saving ? "Updating..." : "Save Catalogue Page"}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-4 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="hero" className="p-6 m-0">
            <HeroEditor data={content.hero} onChange={(v) => update({ hero: v })} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
