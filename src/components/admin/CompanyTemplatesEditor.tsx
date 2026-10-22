import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";
import { cn, formatSlugInput } from "@/lib/utils";
import {
  SectionHeading,
  FieldLabel,
  MicroLabel,
  ItemCard,
  ItemDeleteButton,
  AddItemButton,
  StringListEditor,
  TemplatesEditorSkeleton,
  useListEditor,
} from "./TemplateEditorShared";
import { ImagePicker } from "./ImagePicker";
import {
  type CompanyPageTemplate,
  type CompanyPageSection,
  DEFAULT_COMPANY_PAGE_TEMPLATES,
} from "@/types/company-page-template";
import {
  fetchCompanyPageTemplates,
  updateCompanyPageTemplatesCache,
} from "@/hooks/use-company-page-templates";

const SUPABASE_KEY = "template_company_pages";

// ─── Sub-Editors ─────────────────────────────────────────────────────────────

function HeroEditor({
  template,
  onChange,
}: {
  template: CompanyPageTemplate;
  onChange: (patch: Partial<CompanyPageTemplate>) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeading>Hero &amp; Header Presentation</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Configure the top hero banner, badge text, page title, and lead summary.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel hint="Small uppercase tag displayed above the main heading">
            Eyebrow Text
          </FieldLabel>
          <Input
            value={template.eyebrow}
            onChange={(e) => onChange({ eyebrow: e.target.value })}
            placeholder="e.g. Join Our Team"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel hint="Optional pill badge displayed in the hero">
            Hero Badge
          </FieldLabel>
          <Input
            value={template.badge ?? ""}
            onChange={(e) => onChange({ badge: e.target.value })}
            placeholder="e.g. Opportunities Across Africa"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <FieldLabel hint="Primary H1 page heading">
          Page Title
        </FieldLabel>
        <Input
          value={template.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Careers at Geosynthetics Africa"
          className="text-sm font-semibold"
        />
      </div>

      <div>
        <FieldLabel hint="Lead introductory paragraph displayed beneath the heading">
          Hero Description
        </FieldLabel>
        <Textarea
          value={template.heroDescription}
          onChange={(e) => onChange({ heroDescription: e.target.value })}
          placeholder="Enter a compelling overview of this page..."
          className="text-sm min-h-[90px] resize-y"
        />
      </div>

      <div>
        <FieldLabel hint="Background image for hero banner (leave empty for geometric theme mesh)">
          Hero Image
        </FieldLabel>
        <ImagePicker
          value={template.heroImage ?? ""}
          onChange={(url) => onChange({ heroImage: url })}
          folder="company"
          aspectRatio="video"
        />
      </div>
    </div>
  );
}

function SectionsEditor({
  sections,
  onChange,
}: {
  sections: CompanyPageSection[];
  onChange: (sections: CompanyPageSection[]) => void;
}) {
  const { add, remove } = useListEditor<CompanyPageSection>(
    sections,
    onChange,
    () => ({
      id: `section-${Date.now()}`,
      heading: "New Content Section",
      body: "",
      bullets: [],
    }),
  );

  const updateSection = (index: number, patch: Partial<CompanyPageSection>) => {
    const next = [...sections];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Body Content Sections</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Add structured sections with rich body text and bullet highlight points. Reorder sections using up/down arrows.
      </p>

      <div className="space-y-4">
        {sections.map((section, idx) => (
          <ItemCard key={section.id || idx}>
            <ItemDeleteButton onClick={() => remove(idx)} />

            <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Section {idx + 1}
              </span>
              <div className="flex items-center gap-1 mr-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, -1)}
                  title="Move Up"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, 1)}
                  title="Move Down"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <MicroLabel>Section Heading</MicroLabel>
                <Input
                  value={section.heading}
                  onChange={(e) => updateSection(idx, { heading: e.target.value })}
                  placeholder="e.g. Why Build Your Career With Us?"
                  className="text-sm font-medium"
                />
              </div>

              <div>
                <MicroLabel>Body Content / Paragraphs</MicroLabel>
                <Textarea
                  value={section.body}
                  onChange={(e) => updateSection(idx, { body: e.target.value })}
                  placeholder="Enter detailed paragraph text..."
                  className="text-sm min-h-[110px] resize-y"
                />
              </div>

              <div>
                <MicroLabel>Key Highlights / Bullet Points (Optional)</MicroLabel>
                <StringListEditor
                  items={section.bullets || []}
                  onChange={(bullets) => updateSection(idx, { bullets })}
                  placeholder="Add bullet point..."
                  addLabel="Add Bullet Point"
                />
              </div>
            </div>
          </ItemCard>
        ))}

        <AddItemButton onClick={add} label="Add New Content Section" />
      </div>
    </div>
  );
}

function CtaEditor({
  template,
  onChange,
}: {
  template: CompanyPageTemplate;
  onChange: (patch: Partial<CompanyPageTemplate>) => void;
}) {
  const cta = template.cta || {
    heading: "",
    text: "",
    buttonLabel: "",
    buttonLink: "",
  };

  const updateCta = (patch: Partial<typeof cta>) => {
    onChange({ cta: { ...cta, ...patch } });
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Call to Action (CTA) Banner</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Configure an optional call-to-action banner displayed at the bottom of the page before the footer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel hint="Headline for the call to action">
            CTA Heading
          </FieldLabel>
          <Input
            value={cta.heading}
            onChange={(e) => updateCta({ heading: e.target.value })}
            placeholder="e.g. Ready to Make an Impact?"
            className="text-sm"
          />
        </div>
        <div>
          <FieldLabel hint="Button text label">
            Button Label
          </FieldLabel>
          <Input
            value={cta.buttonLabel}
            onChange={(e) => updateCta({ buttonLabel: e.target.value })}
            placeholder="e.g. Contact HR"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <FieldLabel hint="Supporting message for CTA">
          CTA Description
        </FieldLabel>
        <Textarea
          value={cta.text}
          onChange={(e) => updateCta({ text: e.target.value })}
          placeholder="e.g. Submit your CV directly to our operations and human resources desk..."
          className="text-sm min-h-[80px] resize-y"
        />
      </div>

      <div>
        <FieldLabel hint="Destination URL or mailto link (e.g. /contacts or mailto:sales@geosyntheticsafrica.com)">
          Button Link
        </FieldLabel>
        <Input
          value={cta.buttonLink}
          onChange={(e) => updateCta({ buttonLink: e.target.value })}
          placeholder="e.g. /contacts or mailto:sales@geosyntheticsafrica.com"
          className="text-sm"
        />
      </div>
    </div>
  );
}

function SeoEditor({
  template,
  onChange,
}: {
  template: CompanyPageTemplate;
  onChange: (patch: Partial<CompanyPageTemplate>) => void;
}) {
  const seo = template.seo || { title: "", description: "", keywords: "" };

  const updateSeo = (patch: Partial<typeof seo>) => {
    onChange({ seo: { ...seo, ...patch } });
  };

  return (
    <div className="space-y-6">
      <SectionHeading>Search Engine Optimization (SEO)</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Configure the search engine meta title, description, and keywords for this page.
      </p>

      <div>
        <FieldLabel hint="Title tag shown in browser tab and search results">
          Meta Title
        </FieldLabel>
        <Input
          value={seo.title}
          onChange={(e) => updateSeo({ title: e.target.value })}
          placeholder="e.g. Careers — Geosynthetics Africa"
          className="text-sm"
        />
      </div>

      <div>
        <FieldLabel hint="Snippet displayed below search result titles (120-160 chars)">
          Meta Description
        </FieldLabel>
        <Textarea
          value={seo.description}
          onChange={(e) => updateSeo({ description: e.target.value })}
          placeholder="e.g. Explore career opportunities in geotechnical engineering..."
          className="text-sm min-h-[80px] resize-y"
        />
      </div>

      <div>
        <FieldLabel hint="Comma-separated keywords">
          Meta Keywords
        </FieldLabel>
        <Input
          value={seo.keywords}
          onChange={(e) => updateSeo({ keywords: e.target.value })}
          placeholder="e.g. geosynthetics careers, civil engineering jobs Africa"
          className="text-sm"
        />
      </div>
    </div>
  );
}

// ─── Main Editor Component ───────────────────────────────────────────────────

export function CompanyTemplatesEditor() {
  const [allData, setAllData] = useState<Record<string, CompanyPageTemplate>>({});
  const [activeSlug, setActiveSlug] = useState<string>("careers");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [searchQuery, setSearchQuery] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newEyebrow, setNewEyebrow] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);

  // ── Load Templates from Supabase ──
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const merged = await fetchCompanyPageTemplates();
      setAllData(merged);
      const keys = Object.keys(merged);
      if (keys.length > 0) {
        setActiveSlug((prev) => (!prev || !merged[prev] ? keys[0] : prev));
      }
    } catch (err: any) {
      console.error("Error loading company page templates:", err);
      toast.error("Failed to load company templates. Using defaults.");
      setAllData(DEFAULT_COMPANY_PAGE_TEMPLATES);
      setActiveSlug((prev) => (!prev ? Object.keys(DEFAULT_COMPANY_PAGE_TEMPLATES)[0] : prev));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const activeTemplate = allData[activeSlug];

  const updateActiveTemplate = (patch: Partial<CompanyPageTemplate>) => {
    if (!activeSlug || !activeTemplate) return;
    const updated = { ...activeTemplate, ...patch, updatedAt: new Date().toISOString() };
    setAllData((prev) => ({ ...prev, [activeSlug]: updated }));
    setDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: SUPABASE_KEY, value: allData }, { onConflict: "key" });

      if (error) {
        toast.error("Failed to save: " + error.message);
      } else {
        toast.success("Company page templates saved successfully!");
        setDirty(false);
        updateCompanyPageTemplatesCache(allData);
      }
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTemplate = () => {
    const formattedSlug = formatSlugInput(newSlug);
    if (!formattedSlug) {
      toast.error("Please enter a valid URL slug.");
      return;
    }
    if (allData[formattedSlug]) {
      toast.error("A template with this slug already exists.");
      return;
    }

    const title = newTitle.trim() || formattedSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const eyebrow = newEyebrow.trim() || "Company";

    const newTemplate: CompanyPageTemplate = {
      slug: formattedSlug,
      title,
      eyebrow,
      heroDescription: `Welcome to the ${title} page.`,
      sections: [
        {
          id: `section-${Date.now()}`,
          heading: "Overview",
          body: "Provide detailed content here using the admin editor.",
          bullets: [],
        },
      ],
      seo: {
        title: `${title} — Geosynthetics Africa`,
        description: `Official ${title} information from Geosynthetics Africa.`,
        keywords: formattedSlug.replace(/-/g, ", "),
      },
      updatedAt: new Date().toISOString(),
    };

    setAllData((prev) => ({ ...prev, [formattedSlug]: newTemplate }));
    setActiveSlug(formattedSlug);
    setNewSlug("");
    setNewTitle("");
    setNewEyebrow("");
    setShowNewDialog(false);
    setDirty(true);
    toast.success(`Created blank template for "/${formattedSlug}". Click Save to commit.`);
  };

  const handleDeleteTemplate = (slug: string) => {
    setAllData((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    setDirty(true);
    if (activeSlug === slug) {
      const remaining = Object.keys(allData).filter((k) => k !== slug);
      setActiveSlug(remaining[0] || "");
    }
    toast.success(`Deleted template "${slug}". Click Save to persist.`);
  };

  const filteredSlugs = useMemo(() => {
    const slugs = Object.keys(allData);
    if (!searchQuery.trim()) return slugs;
    const q = searchQuery.toLowerCase();
    return slugs.filter(
      (s) => s.toLowerCase().includes(q) || allData[s]?.title.toLowerCase().includes(q),
    );
  }, [allData, searchQuery]);

  if (loading) {
    return <TemplatesEditorSkeleton />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top action bar */}
      <div className="px-6 py-3 border-b border-border bg-card/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Company &amp; Blank Content Page Templates (DB-Backed)
          </span>
          {dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded ml-2">
              <AlertTriangle className="h-2.5 w-2.5" /> Unsaved Changes
            </span>
          )}
          {!dirty && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded ml-2">
              <CheckCircle2 className="h-2.5 w-2.5" /> Saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewDialog(true)}
            className="h-8.5 rounded-lg border-dashed"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Blank Page
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={saving || !dirty}
            className="h-8.5 rounded-lg shadow-sm font-bold uppercase tracking-wide bg-primary hover:bg-primary-hover"
          >
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Main split-pane workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar: template pages selector */}
        <div className="w-80 border-r border-border bg-card/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-8 text-xs h-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSlugs.map((slug) => {
              const tmpl = allData[slug];
              const isSelected = slug === activeSlug;
              return (
                <div
                  key={slug}
                  onClick={() => setActiveSlug(slug)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg text-left transition-all cursor-pointer group",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/50 text-foreground",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">
                      {tmpl?.title || slug}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] truncate",
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      /{slug}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "p-1 rounded hover:bg-black/20",
                        isSelected ? "text-primary-foreground" : "text-muted-foreground",
                      )}
                      title="Preview Page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    {slug !== "careers" &&
                      slug !== "sustainability" &&
                      slug !== "privacy-policy" &&
                      slug !== "terms-and-conditions" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSlugToDelete(slug);
                          }}
                          className={cn(
                            "p-1 rounded hover:bg-black/20 text-destructive",
                            isSelected && "text-white",
                          )}
                          title="Delete Template"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right workspace: content tabs for active template */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {activeTemplate ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header preview row */}
              <div className="px-6 py-3 border-b border-border bg-card/20 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    {activeTemplate.title}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>Slug: /{activeTemplate.slug}</span>
                    <span>·</span>
                    <a
                      href={`/${activeTemplate.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open Live Page <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sub-Editor Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
                  <TabsTrigger
                    value="hero"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-4 text-xs font-semibold uppercase tracking-wide cursor-pointer"
                  >
                    Hero &amp; Header
                  </TabsTrigger>
                  <TabsTrigger
                    value="sections"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-4 text-xs font-semibold uppercase tracking-wide cursor-pointer"
                  >
                    Content Sections ({activeTemplate.sections?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="cta"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-4 text-xs font-semibold uppercase tracking-wide cursor-pointer"
                  >
                    Call to Action
                  </TabsTrigger>
                  <TabsTrigger
                    value="seo"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-4 text-xs font-semibold uppercase tracking-wide cursor-pointer"
                  >
                    SEO &amp; Meta
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
                  <TabsContent value="hero" className="m-0">
                    <HeroEditor
                      template={activeTemplate}
                      onChange={updateActiveTemplate}
                    />
                  </TabsContent>
                  <TabsContent value="sections" className="m-0">
                    <SectionsEditor
                      sections={activeTemplate.sections || []}
                      onChange={(sections) => updateActiveTemplate({ sections })}
                    />
                  </TabsContent>
                  <TabsContent value="cta" className="m-0">
                    <CtaEditor
                      template={activeTemplate}
                      onChange={updateActiveTemplate}
                    />
                  </TabsContent>
                  <TabsContent value="seo" className="m-0">
                    <SeoEditor
                      template={activeTemplate}
                      onChange={updateActiveTemplate}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select or create a page template to begin editing.
            </div>
          )}
        </div>
      </div>

      {/* New Template Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wide">
              Create New Blank Page Template
            </h3>
            <p className="text-xs text-muted-foreground">
              Define the URL route slug and title. You can fill in the sections and save directly to the database.
            </p>

            <div className="space-y-3">
              <div>
                <FieldLabel hint="URL path (e.g. governance, quality-policy)">
                  Page Route Slug
                </FieldLabel>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">/</span>
                  <Input
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="e.g. corporate-governance"
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Page Title</FieldLabel>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Corporate Governance"
                  className="text-sm"
                />
              </div>

              <div>
                <FieldLabel>Eyebrow Tag</FieldLabel>
                <Input
                  value={newEyebrow}
                  onChange={(e) => setNewEyebrow(e.target.value)}
                  placeholder="e.g. Company & Leadership"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewDialog(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateTemplate}
                className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wide text-xs"
              >
                Create Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={Boolean(slugToDelete)}
        itemName={slugToDelete || ""}
        onClose={() => setSlugToDelete(null)}
        onConfirm={() => {
          if (slugToDelete) {
            handleDeleteTemplate(slugToDelete);
            setSlugToDelete(null);
          }
        }}
      />
    </div>
  );
}
