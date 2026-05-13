import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SeoAnalyzer } from "@/components/admin/SeoAnalyzer";

export const Route = createFileRoute("/admin/pages-seo")({
  head: () => ({
    meta: [{ title: "Pages SEO — Admin Dashboard" }],
  }),
  component: PagesSeoAdmin,
});

const CORE_PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/products", label: "Products" },
  { path: "/applications", label: "Applications" },
  { path: "/services", label: "Services" },
  { path: "/resources", label: "Resources" },
  { path: "/quality-assurance", label: "Quality Assurance" },
  { path: "/contacts", label: "Contact Us" },
];

function PagesSeoAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // pageSeo maps page paths to their SEO objects
  const [pageSeo, setPageSeo] = useState<Record<string, { title: string; description: string; keywords: string }>>({});
  const [selectedPath, setSelectedPath] = useState<string>(CORE_PAGES[0].path);

  useEffect(() => {
    supabase
      .from("site_config")
      .select("value")
      .eq("key", "seo_pages")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching seo_pages:", error);
          toast.error("Failed to load SEO config.");
        }
        if (data?.value) {
          setPageSeo(data.value as any);
        } else {
          // initialize empty
          const init: Record<string, any> = {};
          CORE_PAGES.forEach(p => init[p.path] = { title: "", description: "", keywords: "" });
          setPageSeo(init);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_config").upsert(
        {
          key: "seo_pages",
          value: pageSeo,
          updated_at: new Date().toISOString()
        },
        { onConflict: "key" }
      );
      if (error) throw error;
      toast.success("Page SEO metadata saved successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save SEO config.");
    } finally {
      setSaving(false);
    }
  };

  const currentData = pageSeo[selectedPath] || { title: "", description: "", keywords: "" };
  const currentLabel = CORE_PAGES.find(p => p.path === selectedPath)?.label || "";

  if (loading) {
    return <div className="text-sm text-muted-foreground p-8">Loading SEO data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">Core Pages SEO</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage meta titles, descriptions, and keywords for static pages.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Page List */}
        <div className="lg:col-span-3">
          <div className="rounded border border-border bg-card overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Select Page</div>
            </div>
            <ul className="divide-y divide-border">
              {CORE_PAGES.map((page) => (
                <li key={page.path}>
                  <button
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      selectedPath === page.path 
                        ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" 
                        : "hover:bg-muted text-foreground"
                    }`}
                    onClick={() => setSelectedPath(page.path)}
                  >
                    <div className="truncate">{page.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">{page.path}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Editor & Analyzer */}
        <div className="lg:col-span-9 space-y-6">
          <div className="rounded border border-border bg-card p-5 md:p-6 space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide mb-1">
                Editing SEO for: {currentLabel}
              </h3>
              <p className="text-xs text-muted-foreground font-mono bg-muted/50 inline-block px-2 py-1 rounded">
                Route: {selectedPath}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input
                  id="seo-title"
                  placeholder={`${currentLabel} — Geosynthetics Africa`}
                  value={currentData.title}
                  onChange={(e) => setPageSeo({ ...pageSeo, [selectedPath]: { ...currentData, title: e.target.value } })}
                />
                <p className="text-xs text-muted-foreground">Aim for 40-60 characters. Recommended format: Page Name — Brand Name.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Focus Keywords</Label>
                <Input
                  id="seo-keywords"
                  placeholder="e.g. geosynthetics, hdpe liner, installation"
                  value={currentData.keywords}
                  onChange={(e) => setPageSeo({ ...pageSeo, [selectedPath]: { ...currentData, keywords: e.target.value } })}
                />
                <p className="text-xs text-muted-foreground">Comma-separated. The first keyword is treated as the primary focus keyword.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-desc">Meta Description</Label>
                <Textarea
                  id="seo-desc"
                  rows={4}
                  placeholder="Summarize the page content for search engines..."
                  value={currentData.description}
                  onChange={(e) => setPageSeo({ ...pageSeo, [selectedPath]: { ...currentData, description: e.target.value } })}
                />
                <p className="text-xs text-muted-foreground">Aim for 120-160 characters. Include your focus keyword.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" /> Live SEO Analysis
            </h3>
            <SeoAnalyzer
              input={{
                type: "page",
                name: currentLabel,
                slug: selectedPath === "/" ? "" : selectedPath.substring(1),
                metaTitle: currentData.title,
                metaDescription: currentData.description,
                keywords: currentData.keywords,
                shortDescription: currentData.description, // Use meta desc as short desc for pages
                siteHost: "geosynthetics.co.za"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
