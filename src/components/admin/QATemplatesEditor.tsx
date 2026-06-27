import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePicker } from "./ImagePicker";
import { IconPicker } from "./IconPicker";
import { Textarea } from "@/components/ui/textarea";
import {
  FieldLabel,
  TagsInput,
  useListEditor,
  ItemCard,
  ItemDeleteButton,
  MicroLabel,
  EmptyState,
  ListEditorHeader,
  SectionHeading,
  StringListEditor,
  PairsEditor,
  TemplatesEditorSkeleton,
} from "./TemplateEditorShared";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import {
  Plus,
  Trash2,
  Search,
  Save,
  Loader2,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn, slugify } from "@/lib/utils";
import { ContentSectionsEditor, type ContentSection } from "./QAContentSectionsEditor";
import { useSlugSync } from "@/hooks/use-slug-sync";

// ─── Types ────────────────────────────────────────────────────────────────────

type QAStatus = "published" | "draft" | "archived";

type Stat = { label: string; value: string };
type Pillar = { icon: string; title: string; desc: string };

interface QADocument {
  id: string;
  slug: string;
  category_name: string;
  short_description: string | null;
  hero_image_url: string | null;
  eyebrow: string | null;
  hero_title: string | null;
  hero_body: string | null;
  content_sections: ContentSection[];
  stats: Stat[];
  industries_served: string[];
  key_pillars: Pillar[];
  cta_label: string | null;
  sort_order: number;
  status: QAStatus;
  created_at: string;
}

interface QALandingContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroChecklist: string[];
  heroStats: { value: string; label: string }[];
  frameworkTitle: string;
  frameworkEyebrow: string;
  pillars: Pillar[];
  iagiTitle: string;
  iagiDescription: string;
  iagiStats: { value: string; label: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const defaultLandingContent = (): QALandingContent => ({
  heroTitle: "No System Leaves\nSite Unverified.",
  heroSubtitle:
    "Geosynthetics Africa delivers documented quality assurance and QA/QC for geosynthetics installation across Africa, aligned with IAGI best practice and manufacturer requirements.",
  heroImage: "",
  heroChecklist: [
    "Material Verification — every product verified before installation",
    "Installation Procedures — IAGI-certified methods on every project",
    "On-Site Quality Control — field inspections throughout installation",
    "Documentation & Compliance — full traceability and handover dossier",
  ],
  heroStats: [
    { value: "340+", label: "Projects QA'd" },
    { value: "17", label: "African Countries" },
    { value: "100%", label: "Welds Tested" },
    { value: "IAGI", label: "International Standard" },
  ],
  frameworkTitle:
    "Manufacturer-Aligned Quality Assurance\nfor Geosynthetics Installations Across Africa",
  frameworkEyebrow: "Our QA/QC Framework",
  pillars: [
    {
      icon: "ShieldCheck",
      title: "Material Verification",
      desc: "We verify every product against manufacturer specifications before installation. Mill certificates, batch numbers, and certificates of conformance are cross-referenced.",
    },
    {
      icon: "Wrench",
      title: "Installation Procedures",
      desc: "Our team follows IAGI-certified installation procedures for every project — from subgrade preparation through final sign-off.",
    },
    {
      icon: "Microscope",
      title: "On-Site Quality Control",
      desc: "We conduct field inspections, pressure tests, and performance checks at every stage of installation.",
    },
    {
      icon: "FileCheck",
      title: "Documentation & Compliance",
      desc: "All installations are backed by full QA documentation, traceability records, and project handover certification packages.",
    },
    {
      icon: "BadgeCheck",
      title: "Certificates",
      desc: "Project handover includes a complete certification package — weld logs, test results, as-built plans, and material certificates.",
    },
    {
      icon: "Award",
      title: "IAGI Standards",
      desc: "As IAGI members (one of only 5 in Africa), our installation practices align with globally recognised international standards.",
    },
  ],
  iagiTitle: "International Standards.\nAfrican Execution.",
  iagiDescription:
    "Geosynthetics Africa is a recognised IAGI Installer Member, adhering to international best-practice standards for geosynthetic installation quality assurance and project execution across Africa's mining, water, and civil infrastructure sectors.",
  iagiStats: [
    { value: "17", label: "African Countries Covered" },
    { value: "100%", label: "QA/QC Performed On All Installations" },
    { value: "340+", label: "Projects Delivered" },
    { value: "One of 5", label: "IAGI Members in Africa" },
  ],
  seo: {
    title: "Quality Assurance — Geosynthetics Africa",
    description:
      "QA/QC standards, testing methods, documentation and certificates. No system leaves site unverified. IAGI-aligned installer serving Africa.",
    keywords:
      "quality assurance, qa/qc, geosynthetics installation, iagi, geomembrane, testing, certification",
  },
});

const makeEmpty = (): Partial<QADocument> => ({
  slug: "",
  category_name: "",
  short_description: "",
  hero_image_url: "",
  eyebrow: "IAGI-Aligned",
  hero_title: "",
  hero_body: "",
  content_sections: [],
  stats: [],
  industries_served: [],
  key_pillars: [],
  cta_label: "Request QA Documentation",
  sort_order: 0,
  status: "published",
});

// ─── Reusable editor sub-components ──────────────────────────────────────────

function PillarsEditor({
  pillars,
  onChange,
}: {
  pillars: Pillar[];
  onChange: (v: Pillar[]) => void;
}) {
  const { add, update, remove } = useListEditor(
    pillars,
    onChange,
    () => ({ icon: "ShieldCheck", title: "", desc: "" }) as Pillar,
  );

  return (
    <div className="space-y-3">
      <ListEditorHeader
        label="Key Pillars"
        hint="Icon cards shown in the page. Keep to 6 pillars max."
        onAdd={add}
        addLabel="Add Pillar"
      />
      {pillars.map((pillar, i) => (
        <ItemCard key={i}>
          <ItemDeleteButton onClick={() => remove(i)} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <MicroLabel>Icon</MicroLabel>
              <IconPicker
                value={pillar.icon}
                onChange={(v) => update(i, "icon", v)}
                placeholder="Select icon..."
                className="h-8 text-xs"
              />
            </div>
            <div>
              <MicroLabel>Title</MicroLabel>
              <Input
                value={pillar.title}
                onChange={(e) => update(i, "title", e.target.value)}
                className="h-8 text-xs"
                placeholder="e.g. Material Verification"
              />
            </div>
          </div>
          <div>
            <MicroLabel>Description</MicroLabel>
            <Textarea
              value={pillar.desc}
              onChange={(e) => update(i, "desc", e.target.value)}
              className="text-xs min-h-[50px] resize-none"
              placeholder="Short description for this pillar..."
            />
          </div>
        </ItemCard>
      ))}
      {pillars.length === 0 && <EmptyState message="No pillars yet — click Add Pillar." />}
    </div>
  );
}

function StatsEditor({ stats, onChange }: { stats: Stat[]; onChange: (v: Stat[]) => void }) {
  const { add, update, remove } = useListEditor(
    stats,
    onChange,
    () => ({ label: "", value: "" }) as Stat,
  );

  return (
    <div className="space-y-2">
      <ListEditorHeader
        label="Stats / Metrics"
        hint="Shown in the sidebar stats card and the bottom stats band."
        onAdd={add}
        addLabel="Add Stat"
      />
      {stats.map((stat, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Input
            value={stat.value}
            onChange={(e) => update(i, "value", e.target.value)}
            className="text-sm h-8"
            placeholder="e.g. 100%"
          />
          <Input
            value={stat.label}
            onChange={(e) => update(i, "label", e.target.value)}
            className="text-sm h-8"
            placeholder="e.g. Welds Tested"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => remove(i)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      {stats.length === 0 && <EmptyState message="No stats yet — click Add Stat." />}
    </div>
  );
}

export function QATemplatesEditor() {
  const [rows, setRows] = useState<QADocument[]>([]);
  const [landingContent, setLandingContent] =
    useState<Partial<QALandingContent>>(defaultLandingContent());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string>("__landing");
  const [editingDoc, setEditingDoc] = useState<Partial<QADocument>>(makeEmpty());
  const [editingLanding, setEditingLanding] =
    useState<Partial<QALandingContent>>(defaultLandingContent());
  const [activeTab, setActiveTab] = useState("hero");
  const [qaToDelete, setQaToDelete] = useState<QADocument | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: docData, error: docError } = await supabase
        .from("qa_documents")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(200);
      if (docError) throw docError;
      setRows((docData ?? []) as unknown as QADocument[]);

      const { data: landingRow, error: landingError } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "qa_landing_content")
        .maybeSingle();
      if (landingError) throw landingError;
      if (landingRow?.value) {
        setLandingContent(landingRow.value as Partial<QALandingContent>);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Synchronize edit state when selection or raw data changes
  useEffect(() => {
    if (activeSlug === "__landing") {
      setEditingLanding({
        ...defaultLandingContent(),
        ...landingContent,
        seo: {
          ...defaultLandingContent().seo,
          ...(landingContent?.seo || {}),
        },
      });
      setDirty(false);
    } else if (activeSlug === "__new") {
      setEditingDoc(makeEmpty());
      setDirty(false);
    } else {
      const found = rows.find((r) => r.slug === activeSlug);
      if (found) {
        setEditingDoc({ ...found });
        setDirty(false);
      }
    }
  }, [activeSlug, rows, landingContent]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => r.category_name.toLowerCase().includes(term));
  }, [rows, q]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filtered, currentPage]);

  // Synchronize current page when activeSlug changes
  useEffect(() => {
    if (activeSlug && activeSlug !== "__landing" && activeSlug !== "__new") {
      const index = filtered.findIndex((r) => r.slug === activeSlug);
      if (index !== -1) {
        const page = Math.floor(index / itemsPerPage) + 1;
        if (page !== currentPage) {
          setCurrentPage(page);
        }
      }
    }
  }, [activeSlug, filtered, currentPage]);

  const handleConfirmDelete = async () => {
    if (qaToDelete) {
      const { error } = await supabase.from("qa_documents").delete().eq("id", qaToDelete.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Deleted");
      setRows((rs) => rs.filter((x) => x.id !== qaToDelete.id));
      if (activeSlug === qaToDelete.slug) {
        setActiveSlug("__landing");
      }
      setQaToDelete(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeSlug === "__landing") {
        const { error } = await supabase
          .from("site_config")
          .upsert(
            { key: "qa_landing_content", value: editingLanding as any },
            { onConflict: "key" },
          );
        if (error) throw error;
        toast.success("QA Landing Page content saved!");
        setLandingContent(editingLanding);
        setDirty(false);
      } else {
        const doc = editingDoc;
        if (!doc.category_name?.trim()) {
          toast.error("Category name is required");
          setSaving(false);
          return;
        }
        const payload = {
          slug: doc.slug?.trim() || slugify(doc.category_name!),
          category_name: doc.category_name!.trim(),
          short_description: doc.short_description?.trim() || null,
          hero_image_url: doc.hero_image_url?.trim() || null,
          eyebrow: doc.eyebrow?.trim() || null,
          hero_title: doc.hero_title?.trim() || null,
          hero_body: doc.hero_body?.trim() || null,
          content_sections: doc.content_sections || [],
          stats: doc.stats || [],
          industries_served: doc.industries_served || [],
          key_pillars: doc.key_pillars || [],
          cta_label: doc.cta_label?.trim() || "Request QA Documentation",
          sort_order: doc.sort_order ?? 0,
          status: doc.status ?? "published",
        };

        const res = doc.id
          ? await supabase.from("qa_documents").update(payload).eq("id", doc.id)
          : await supabase.from("qa_documents").insert(payload);

        if (res.error) throw res.error;
        toast.success(doc.id ? "QA document updated" : "QA document created");
        setDirty(false);
        await load();

        if (activeSlug === "__new") {
          setActiveSlug(payload.slug);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const setLandingField = <K extends keyof QALandingContent>(
    key: K,
    value: QALandingContent[K],
  ) => {
    setEditingLanding((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const setLandingSeo = (patch: Partial<QALandingContent["seo"]>) => {
    setEditingLanding((prev) => ({
      ...prev,
      seo: {
        title: prev.seo?.title ?? "",
        description: prev.seo?.description ?? "",
        keywords: prev.seo?.keywords ?? "",
        ...patch,
      },
    }));
    setDirty(true);
  };

  const setDocField = <K extends keyof QADocument>(key: K, value: QADocument[K]) => {
    setEditingDoc((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const { handleSlugChange, handleSlugBlur } = useSlugSync({
    title: editingDoc.category_name || "",
    slug: editingDoc.slug || "",
    onSlugChange: (newSlug) => setDocField("slug", newSlug),
    entityId: editingDoc.id,
  });

  const STATUS_COLORS: Record<QAStatus, string> = {
    published: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20",
    draft: "bg-amber-500/15 text-amber-600 border border-amber-500/20",
    archived: "bg-muted text-muted-foreground border border-border",
  };

  if (loading) {
    return <TemplatesEditorSkeleton />;
  }

  const isLanding = activeSlug === "__landing";
  const isNew = activeSlug === "__new";
  const activeLabel = isLanding
    ? "QA Landing Page"
    : isNew
      ? "New QA Document"
      : editingDoc.category_name || activeSlug;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Quality Assurance Templates
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Quality Assurance pages shown on `/quality-assurance` and dynamic subpage child
            templates.
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
            className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide gap-2 border-0 cursor-pointer"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex gap-0 border border-border rounded-xl overflow-hidden min-h-[820px] bg-card">
        {/* Left sidebar */}
        <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface/30">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              QA Pages
            </p>
          </div>

          <div className="p-3 border-b border-border shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveSlug("__new");
                setActiveTab("basic");
              }}
              className="w-full h-8 text-xs gap-1.5 cursor-pointer"
              disabled={activeSlug === "__new"}
            >
              <Plus className="h-3 w-3" /> New QA Document
            </Button>
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
                  isLanding
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-accent text-foreground",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-xs">QA Landing Page</div>
                  <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                    /quality-assurance
                  </div>
                </div>
                {isLanding && <ChevronRight className="h-3 w-3 text-primary" />}
              </button>
            </div>

            {/* Subpages Section */}
            <div className="space-y-1">
              <div className="px-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sub-pages (
                  {filtered.length !== rows.length
                    ? `${filtered.length}/${rows.length}`
                    : rows.length}
                  )
                </p>
              </div>

              {/* Search Box inside sidebar */}
              <div className="px-2 py-1 relative">
                <Search className="absolute left-4 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Filter..."
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-7 h-7 text-xs"
                />
              </div>

              <div className="space-y-0.5 pt-1">
                {paginated.map((doc) => {
                  const isActive = doc.slug === activeSlug;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setActiveSlug(doc.slug);
                        setActiveTab("basic");
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-accent text-foreground",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-xs">{doc.category_name}</div>
                        <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                          {doc.slug}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-1 shrink-0">
                        {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQaToDelete(doc);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-[10px] text-muted-foreground py-4">No results</p>
                )}
              </div>

              {/* Pagination footer */}
              {totalPages > 1 && (
                <div className="p-3 border-t border-border flex items-center justify-between bg-surface/50 text-xs shrink-0 rounded-lg mt-2">
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
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-card">
          {/* Panel header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                {activeLabel}
              </h3>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <code className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted-foreground font-mono">
                  {isLanding
                    ? "/quality-assurance"
                    : isNew
                      ? "not saved yet"
                      : `/quality-assurance/${activeSlug}`}
                </code>
                {!isLanding && !isNew && (
                  <span
                    className={cn(
                      "text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.2 rounded",
                      STATUS_COLORS[editingDoc.status || "published"],
                    )}
                  >
                    {editingDoc.status}
                  </span>
                )}
                {dirty && (
                  <span className="text-[10px] text-amber-500 font-bold">● Unsaved Changes</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isNew && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 cursor-pointer"
                >
                  <a
                    href={isLanding ? "/quality-assurance" : `/quality-assurance/${activeSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" /> Preview
                  </a>
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || !dirty}
                className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-8 gap-1.5 border-0 cursor-pointer"
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

          {/* Panel Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="px-6 pt-2 pb-0 bg-transparent border-b border-border rounded-none justify-start h-auto shrink-0 gap-0 overflow-x-auto flex-nowrap">
              {isLanding
                ? // Landing page tabs
                  [
                    { id: "hero", label: "Hero & Checklist" },
                    { id: "pillars", label: "Framework & Pillars" },
                    { id: "iagi", label: "IAGI Section" },
                    { id: "seo", label: "SEO" },
                  ].map((t) => (
                    <TabsTrigger
                      key={t.id}
                      value={t.id}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))
                : // Detail page tabs
                  [
                    { id: "basic", label: "Basic Info" },
                    { id: "hero", label: "Hero" },
                    { id: "pillars", label: "Pillars & Stats" },
                    { id: "content", label: "Content Sections" },
                    { id: "industries", label: "Industries" },
                  ].map((t) => (
                    <TabsTrigger
                      key={t.id}
                      value={t.id}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent pb-2 px-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors hover:cursor-pointer"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              {/* ──────────────────────────────────────────────────────── */}
              {/* ── LANDING PAGE TABS ─────────────────────────────────── */}
              {/* ──────────────────────────────────────────────────────── */}
              {isLanding && (
                <>
                  <TabsContent value="hero" className="space-y-5 m-0 outline-none">
                    <SectionHeading>Hero Details</SectionHeading>
                    <div>
                      <FieldLabel>Hero Title (H1)</FieldLabel>
                      <Textarea
                        value={editingLanding.heroTitle ?? ""}
                        onChange={(e) => setLandingField("heroTitle", e.target.value)}
                        placeholder="e.g. No System Leaves Site Unverified."
                        rows={2}
                      />
                    </div>
                    <div>
                      <FieldLabel>Hero Subtitle</FieldLabel>
                      <Textarea
                        value={editingLanding.heroSubtitle ?? ""}
                        onChange={(e) => setLandingField("heroSubtitle", e.target.value)}
                        placeholder="Supporting subtitle text..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <ImagePicker
                        label="Hero Background Image"
                        value={editingLanding.heroImage ?? ""}
                        onChange={(val) => setLandingField("heroImage", val)}
                      />
                    </div>
                    <div className="border-t border-border pt-4">
                      <StringListEditor
                        label="Hero Checklist Items"
                        hint="Checklist points shown in the hero section"
                        items={editingLanding.heroChecklist || []}
                        onChange={(v) => setLandingField("heroChecklist", v)}
                        placeholder="e.g. Material Verification — every product verified"
                      />
                    </div>
                    <div className="border-t border-border pt-4">
                      <PairsEditor
                        label="Hero Stats"
                        hint="Stats cards displayed next to the hero checklist. Max 4 items."
                        items={editingLanding.heroStats || []}
                        fields={[
                          { key: "value", label: "Stat Value", placeholder: "e.g. 100%" },
                          { key: "label", label: "Stat Label", placeholder: "e.g. Welds Tested" },
                        ]}
                        onChange={(v) => setLandingField("heroStats", v as any)}
                        newItem={{ value: "", label: "" }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pillars" className="space-y-5 m-0 outline-none">
                    <SectionHeading>Framework Heading</SectionHeading>
                    <div>
                      <FieldLabel>Framework Section Title</FieldLabel>
                      <Input
                        value={editingLanding.frameworkTitle ?? ""}
                        onChange={(e) => setLandingField("frameworkTitle", e.target.value)}
                        placeholder="e.g. Manufacturer-Aligned Quality Assurance..."
                      />
                    </div>
                    <div>
                      <FieldLabel>Framework Eyebrow</FieldLabel>
                      <Input
                        value={editingLanding.frameworkEyebrow ?? ""}
                        onChange={(e) => setLandingField("frameworkEyebrow", e.target.value)}
                        placeholder="e.g. Our QA/QC Framework"
                      />
                    </div>
                    <div className="border-t border-border pt-4">
                      <PillarsEditor
                        pillars={editingLanding.pillars || []}
                        onChange={(v) => setLandingField("pillars", v)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="iagi" className="space-y-5 m-0 outline-none">
                    <SectionHeading>IAGI Accreditation Block</SectionHeading>
                    <div>
                      <FieldLabel>IAGI Title</FieldLabel>
                      <Input
                        value={editingLanding.iagiTitle ?? ""}
                        onChange={(e) => setLandingField("iagiTitle", e.target.value)}
                        placeholder="e.g. International Standards. African Execution."
                      />
                    </div>
                    <div>
                      <FieldLabel>IAGI Section Description</FieldLabel>
                      <Textarea
                        value={editingLanding.iagiDescription ?? ""}
                        onChange={(e) => setLandingField("iagiDescription", e.target.value)}
                        placeholder="Description of membership and compliance..."
                        rows={4}
                      />
                    </div>
                    <div className="border-t border-border pt-4">
                      <PairsEditor
                        label="IAGI Section Stats"
                        hint="Stats grid shown inside the black IAGI section band. Max 4 items."
                        items={editingLanding.iagiStats || []}
                        fields={[
                          { key: "value", label: "Stat Value", placeholder: "e.g. One of 5" },
                          {
                            key: "label",
                            label: "Stat Label",
                            placeholder: "e.g. IAGI Members in Africa",
                          },
                        ]}
                        onChange={(v) => setLandingField("iagiStats", v as any)}
                        newItem={{ value: "", label: "" }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-5 m-0 outline-none">
                    <SectionHeading>SEO Configuration</SectionHeading>
                    <div>
                      <FieldLabel>SEO Title</FieldLabel>
                      <Input
                        value={editingLanding.seo?.title ?? ""}
                        onChange={(e) => setLandingSeo({ title: e.target.value })}
                        placeholder="SEO meta title..."
                      />
                    </div>
                    <div>
                      <FieldLabel>SEO Meta Description</FieldLabel>
                      <Textarea
                        value={editingLanding.seo?.description ?? ""}
                        onChange={(e) => setLandingSeo({ description: e.target.value })}
                        placeholder="SEO meta description..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <FieldLabel>SEO Keywords</FieldLabel>
                      <Input
                        value={editingLanding.seo?.keywords ?? ""}
                        onChange={(e) => setLandingSeo({ keywords: e.target.value })}
                        placeholder="Comma-separated keywords..."
                      />
                    </div>
                  </TabsContent>
                </>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* ── DETAIL PAGE TABS ──────────────────────────────────── */}
              {/* ──────────────────────────────────────────────────────── */}
              {!isLanding && (
                <>
                  <TabsContent value="basic" className="space-y-4 m-0 outline-none">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel hint="Shown as the card title on the listing page">
                          Category Name *
                        </FieldLabel>
                        <Input
                          value={editingDoc.category_name ?? ""}
                          onChange={(e) => setDocField("category_name", e.target.value)}
                          placeholder="e.g. GSE® / Solmax Quality Assurance"
                        />
                      </div>
                      <div>
                        <FieldLabel hint="URL-safe slug for the child detail page /quality-assurance/{slug}">
                          Slug
                        </FieldLabel>
                        <Input
                          value={editingDoc.slug ?? ""}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          onBlur={handleSlugBlur}
                          placeholder="auto-generated from name"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel hint="Shown on the listing card and as the page meta description">
                        Short Description
                      </FieldLabel>
                      <Textarea
                        value={editingDoc.short_description ?? ""}
                        onChange={(e) => setDocField("short_description", e.target.value)}
                        rows={3}
                        placeholder="Brief summary shown on the listing card..."
                        className="resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel hint="Button text on the listing card and detail page">
                          CTA Label
                        </FieldLabel>
                        <Input
                          value={editingDoc.cta_label ?? ""}
                          onChange={(e) => setDocField("cta_label", e.target.value)}
                          placeholder="e.g. View GSE® QA Documentation"
                        />
                      </div>
                      <div>
                        <FieldLabel hint="Controls display order on the listing page (lower = first)">
                          Sort Order
                        </FieldLabel>
                        <Input
                          type="number"
                          value={String(editingDoc.sort_order ?? 0)}
                          onChange={(e) =>
                            setDocField("sort_order", parseInt(e.target.value, 10) || 0)
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Status
                        </Label>
                        <Select
                          value={editingDoc.status ?? "published"}
                          onValueChange={(v) => setDocField("status", v as QAStatus)}
                        >
                          <SelectTrigger className="mt-1.5 w-36 font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published" className="font-semibold text-xs">
                              Published
                            </SelectItem>
                            <SelectItem value="draft" className="font-semibold text-xs">
                              Draft
                            </SelectItem>
                            <SelectItem value="archived" className="font-semibold text-xs">
                              Archived
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hero" className="space-y-4 m-0 outline-none">
                    <div>
                      <ImagePicker
                        label="Hero Image"
                        hint="Background image shown in the hero section"
                        value={editingDoc.hero_image_url ?? ""}
                        onChange={(val) => setDocField("hero_image_url", val)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel hint='Small text above the title — e.g. "IAGI-Aligned" or "GRI-GM13 Certified"'>
                          Eyebrow Text
                        </FieldLabel>
                        <Input
                          value={editingDoc.eyebrow ?? ""}
                          onChange={(e) => setDocField("eyebrow", e.target.value)}
                          placeholder="e.g. IAGI-Aligned"
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel hint="Large heading in the hero. Defaults to category name if blank.">
                        Hero Title
                      </FieldLabel>
                      <Input
                        value={editingDoc.hero_title ?? ""}
                        onChange={(e) => setDocField("hero_title", e.target.value)}
                        placeholder="e.g. GSE® / Solmax Geomembrane Quality Assurance"
                      />
                    </div>

                    <div>
                      <FieldLabel hint="Subtitle paragraph below the hero heading">
                        Hero Body
                      </FieldLabel>
                      <Textarea
                        value={editingDoc.hero_body ?? ""}
                        onChange={(e) => setDocField("hero_body", e.target.value)}
                        rows={3}
                        placeholder="Supporting paragraph shown in the hero section..."
                        className="resize-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="pillars" className="space-y-6 m-0 outline-none">
                    <PillarsEditor
                      pillars={editingDoc.key_pillars || []}
                      onChange={(v) => setDocField("key_pillars", v)}
                    />
                    <div className="border-t border-border pt-4">
                      <StatsEditor
                        stats={editingDoc.stats || []}
                        onChange={(v) => setDocField("stats", v)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="m-0 outline-none">
                    <ContentSectionsEditor
                      sections={editingDoc.content_sections || []}
                      onChange={(v) => setDocField("content_sections", v)}
                    />
                  </TabsContent>

                  <TabsContent value="industries" className="m-0 outline-none">
                    <TagsInput
                      label="Industries Served"
                      hint='Type each industry and press Enter or click Add. E.g. "Mining & Minerals", "Water & Sanitation"'
                      tags={editingDoc.industries_served || []}
                      onChange={(v) => setDocField("industries_served", v)}
                      placeholder="e.g. Mining & Minerals"
                    />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={!!qaToDelete}
        onOpenChange={(open) => !open && setQaToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete QA Document?"
        description="This will permanently remove this QA document and its child detail page will return a 404."
        itemName={qaToDelete?.category_name}
        idPrefix="qa-document"
      />
    </div>
  );
}
