import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus, Trash2, Save, Loader2, Compass, ShieldCheck, HelpCircle, Award, Image as ImageIcon,
  MapPin, Calendar, FileText, CheckCircle2, ChevronRight, Scale, Briefcase, PlusCircle, X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductSelector, type ProductData } from "./ProductSelector";
import { ImagePicker } from "./ImagePicker";

// Reusable Sub-components for Form Layouts
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
      <span className="w-1.5 h-3 bg-primary rounded-full inline-block" />
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

export function ProjectsTemplatesEditor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const [newTitle, setNewTitle] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);

  // ── Load from Supabase ──
  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("project_year", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load project templates: " + error.message);
    } else if (data) {
      setProjects(data);
      if (data.length > 0 && !activeId) {
        setActiveId(data[0].id);
      }
    }
    setLoading(false);
  }, [activeId]);

  useEffect(() => {
    load();
  }, [load]);

  // Active project helper
  const active = projects.find((p) => p.id === activeId) || null;

  const updateActive = (updater: (prev: any) => any) => {
    if (!activeId) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === activeId ? updater(p) : p))
    );
    setDirty(true);
  };

  const setField = (key: string, value: any) => {
    updateActive((prev) => ({ ...prev, [key]: value }));
  };

  // ── Add New Project ──
  const handleAddNew = () => {
    if (!newTitle.trim()) return;
    const slug = newTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const blankProject = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      slug,
      client_name: "Confidential Client",
      location: "Gauteng",
      country: "South Africa",
      sector: "Mining",
      project_year: new Date().getFullYear(),
      summary: "Short descriptive project summary.",
      body: "Full case study brief details.",
      hero_image_url: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1200&q=80",
      service_type: "supply_install",
      scale: "10,000 m²",
      status: "published",
      gallery: [],
      logistics_details: {
        tonnage: "100 t",
        route: "1,200 km",
        borders: "2 borders",
        ontime: "100%",
        route_steps: [],
        documents: [],
      },
      qa_details: {
        welders: "5 Certified",
        compliance: "SANS 1526",
        checklist: [],
        photos: [],
      },
      service_details: {
        duration: "4 weeks",
        tests: "3 streams",
        samples: "15 coupons",
        deliverable: "CQA Report",
        independence_statement: "Technical independence statement details...",
        forensic_protocol: [],
        findings: [],
      },
      products_used: [],
      spec_compliance: [],
      testimonial: {
        quote: "Highly recommended professional team.",
        name: "John Doe",
        role: "Project Manager",
        company: "Mining Corp",
        avatar: "JD",
      },
    };

    setProjects((prev) => [blankProject, ...prev]);
    setActiveId(blankProject.id);
    setNewTitle("");
    setShowNewDialog(false);
    setDirty(true);
    toast.success(`Project "${blankProject.title}" template created. Edit it and click Save.`);
  };

  // ── Delete Project ──
  const handleDelete = async (id: string, title: string) => {
    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete project: " + error.message);
    } else {
      toast.success(`Deleted project template "${title}"`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeId === id) {
        setActiveId("");
      }
      load();
    }
  };

  // ── Save Current Project ──
  const handleSave = async () => {
    if (!active) return;
    setSaving(true);

    const { error } = await supabase
      .from("case_studies")
      .upsert(active, { onConflict: "id" });

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success(`Project template "${active.title}" saved successfully!`);
      setDirty(false);
      load();
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            Project Templates (Case Studies)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Input, manage, and structure high-fidelity project templates to populate `/projects/$slug`.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {dirty && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded">
              <PlusCircle className="h-3 w-3" />
              Unsaved changes
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !dirty || !activeId}
            className="bg-primary hover:bg-primary-hover text-white font-bold uppercase tracking-wide gap-2 cursor-pointer border-0"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Template"}
          </Button>
        </div>
      </div>

      {projects.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-surface/30">
          <Compass className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-bold uppercase mb-2">No projects templates found</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Click the button below to add your first case study template.
          </p>
          <div className="flex gap-2 max-w-sm w-full px-4">
            <Input
              placeholder="e.g. Zimbabwe River Rehab"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-sm"
            />
            <Button onClick={handleAddNew} className="bg-primary text-white border-0 cursor-pointer">
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-0 border border-border rounded-xl overflow-hidden min-h-[780px] bg-card shadow-sm">
          {/* Left Sidebar */}
          <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface/30">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Project Templates ({projects.length})
              </p>
            </div>

            {/* Add new project button at the top */}
            <div className="p-3 border-b border-border space-y-2 shrink-0">
              {showNewDialog ? (
                <div className="space-y-2">
                  <Input
                    placeholder="e.g. Zimbabwe River Rehab"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNew();
                      if (e.key === "Escape") setShowNewDialog(false);
                    }}
                    className="text-xs h-8"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleAddNew}
                      className="flex-1 h-7 text-xs bg-primary hover:bg-primary-hover text-white border-0 cursor-pointer"
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowNewDialog(false);
                        setNewTitle("");
                      }}
                      className="h-7 text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewDialog(true)}
                  className="w-full h-8 text-xs gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> New Project
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {projects.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveId(p.id);
                      setActiveTab("hero");
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-xs uppercase font-display tracking-tight">
                        {p.title}
                      </div>
                      <div className="truncate text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <span className="capitalize">{p.service_type.replace("_", " ")}</span>
                        <span>·</span>
                        <span>{p.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-1 shrink-0">
                      {isActive && <ChevronRight className="h-3 w-3 text-primary" />}
                      {!isActive && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Template "{p.title}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you absolutely sure? This will delete the case study from the database completely. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(p.id, p.title)}
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
          </div>

          {/* Right Panel - Form Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {!active ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 p-8 text-center">
                <Compass className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">Select a project template to edit its fields</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Active Category Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30 gap-2">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground leading-tight">
                      {active.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Slug: <code className="bg-surface px-1.5 py-0.5 rounded font-mono text-primary font-bold">/projects/{active.slug}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">Service Type:</span>
                    <Select
                      value={active.service_type}
                      onValueChange={(v) => setField("service_type", v)}
                    >
                      <SelectTrigger className="w-40 h-8 text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supply_install">Supply & Install</SelectItem>
                        <SelectItem value="supply_only">Supply Only</SelectItem>
                        <SelectItem value="services_only">Services Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subpage editing tabs */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-6 border-b border-border bg-surface/10 shrink-0">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="bg-transparent h-10 gap-0 p-0 border-b-0 rounded-none justify-start overflow-x-auto max-w-full no-scrollbar">
                        <TabsTrigger
                          value="hero"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Identity & Hero
                        </TabsTrigger>
                        <TabsTrigger
                          value="brief"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Brief & Body
                        </TabsTrigger>
                        <TabsTrigger
                          value="products"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Products Used
                        </TabsTrigger>
                        <TabsTrigger
                          value="compliance"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Spec Conformity
                        </TabsTrigger>
                        <TabsTrigger
                          value="testimonial"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Testimonial
                        </TabsTrigger>
                        <TabsTrigger
                          value="scopedetails"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-primary"
                        >
                          Technical Scope
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <Tabs value={activeTab} className="h-full">
                      {/* HERO TAB */}
                      <TabsContent value="hero" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>Hero Section & Page Identity</SectionHeading>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Project title displayed in bold display font">Title</FieldLabel>
                            <Input
                              value={active.title}
                              onChange={(e) => setField("title", e.target.value)}
                              className="text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="URL-friendly slug (e.g. zimbabwe-river-rehab)">Slug</FieldLabel>
                            <Input
                              value={active.slug}
                              onChange={(e) => setField("slug", e.target.value)}
                              className="text-sm font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="The brand/operator name for the project">Client Operator</FieldLabel>
                            <Input
                              value={active.client_name || ""}
                              onChange={(e) => setField("client_name", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="District/Region (e.g., Lualaba, Kenieba)">Location/Region</FieldLabel>
                            <Input
                              value={active.location || ""}
                              onChange={(e) => setField("location", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Sovereign state (e.g., South Africa, DRC, Mali)">Country</FieldLabel>
                            <Input
                              value={active.country || ""}
                              onChange={(e) => setField("country", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Year commissioned (e.g., 2024)">Commissioned Year</FieldLabel>
                            <Input
                              type="number"
                              value={active.project_year || ""}
                              onChange={(e) => setField("project_year", parseInt(e.target.value) || new Date().getFullYear())}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Industrial sector (e.g., Mining, Agriculture, Infrastructure)">Sector</FieldLabel>
                            <Input
                              value={active.sector || ""}
                              onChange={(e) => setField("sector", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Physical size of layout scope (e.g. 210,000 m²)">Scale</FieldLabel>
                            <Input
                              value={active.scale || ""}
                              onChange={(e) => setField("scale", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <ImagePicker
                              label="Hero Image"
                              hint="Full-resolution background hero photo URL (Unsplash or Supabase bucket path)"
                              value={active.hero_image_url || ""}
                              onChange={(val) => setField("hero_image_url", val)}
                              placeholder="https://images.unsplash.com/photo-..."
                            />
                          </div>
                          <div className="col-span-2 space-y-1.5">
                            <FieldLabel hint="Status defines if public users can see the project">Publishing Status</FieldLabel>
                            <Select
                              value={active.status || "draft"}
                              onValueChange={(v) => setField("status", v)}
                            >
                              <SelectTrigger className="w-40 text-xs font-bold uppercase">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>

                      {/* BRIEF & BODY TAB */}
                      <TabsContent value="brief" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>Case Study Narrative</SectionHeading>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Compelling, 2-3 sentence overview shown in bold text at the top and lists.">
                              Introductory Summary
                            </FieldLabel>
                            <Textarea
                              value={active.summary || ""}
                              onChange={(e) => setField("summary", e.target.value)}
                              className="min-h-[100px] text-sm leading-relaxed"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Detailed full narrative of the project brief, site prep, and client challenges. Supports multiple paragraphs.">
                              Detailed Case Study Narrative / Brief Body
                            </FieldLabel>
                            <Textarea
                              value={active.body || ""}
                              onChange={(e) => setField("body", e.target.value)}
                              className="min-h-[280px] text-sm leading-relaxed"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* PRODUCTS USED TAB */}
                      <TabsContent value="products" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>Catalogue Products Supplied & Deployed</SectionHeading>
                        <ProductsEditor
                          items={active.products_used || []}
                          onChange={(items) => setField("products_used", items)}
                        />
                      </TabsContent>

                      {/* SPEC CONFORMITY TAB */}
                      <TabsContent value="compliance" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>Laboratory Verification & Specification conformity</SectionHeading>
                        <SpecComplianceEditor
                          items={active.spec_compliance || []}
                          onChange={(items) => setField("spec_compliance", items)}
                        />
                      </TabsContent>

                      {/* TESTIMONIAL TAB */}
                      <TabsContent value="testimonial" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>Client Testimonial & Endorsement</SectionHeading>
                        <div className="border border-border rounded-xl p-5 bg-surface/30 space-y-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Direct quote endorsement from client engineer">Testimonial Quote</FieldLabel>
                            <Textarea
                              value={active.testimonial?.quote || ""}
                              onChange={(e) =>
                                setField("testimonial", {
                                  ...active.testimonial,
                                  quote: e.target.value,
                                })
                              }
                              className="min-h-[100px] text-sm leading-relaxed italic"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <FieldLabel hint="Name of the person who gave the testimonial">Name</FieldLabel>
                              <Input
                                value={active.testimonial?.name || ""}
                                onChange={(e) =>
                                  setField("testimonial", {
                                    ...active.testimonial,
                                    name: e.target.value,
                                  })
                                }
                                className="text-sm font-semibold"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <FieldLabel hint="Their job role/title">Role</FieldLabel>
                              <Input
                                value={active.testimonial?.role || ""}
                                onChange={(e) =>
                                  setField("testimonial", {
                                    ...active.testimonial,
                                    role: e.target.value,
                                  })
                                }
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <FieldLabel hint="Company/Mine name">Company</FieldLabel>
                              <Input
                                value={active.testimonial?.company || ""}
                                onChange={(e) =>
                                  setField("testimonial", {
                                    ...active.testimonial,
                                    company: e.target.value,
                                  })
                                }
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <FieldLabel hint="2-letter initials shown in testimonial circle">Avatar Initials</FieldLabel>
                              <Input
                                maxLength={2}
                                value={active.testimonial?.avatar || ""}
                                onChange={(e) =>
                                  setField("testimonial", {
                                    ...active.testimonial,
                                    avatar: e.target.value.toUpperCase(),
                                  })
                                }
                                className="text-sm w-20 font-bold text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* TECHNICAL SCOPE TAB */}
                      <TabsContent value="scopedetails" className="space-y-6 m-0 focus-visible:outline-none">
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                          <SectionHeading>
                            Dynamic Service-specific Details
                          </SectionHeading>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                            {active.service_type === "supply_install" && "Supply & Install Template"}
                            {active.service_type === "supply_only" && "Supply Only Template"}
                            {active.service_type === "services_only" && "Services Only Template"}
                          </span>
                        </div>

                        {/* 1. SUPPLY & INSTALL SPECIFIC FIELDS */}
                        {active.service_type === "supply_install" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <FieldLabel hint="Welders count/crews (e.g. '14 Certified')">Field Welders</FieldLabel>
                                <Input
                                  value={active.qa_details?.welders || ""}
                                  onChange={(e) =>
                                    setField("qa_details", {
                                      ...active.qa_details,
                                      welders: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <FieldLabel hint="Standard regulatory compliance (e.g., SANS 1526, GRI GM13)">CQA Standards</FieldLabel>
                                <Input
                                  value={active.qa_details?.compliance || ""}
                                  onChange={(e) =>
                                    setField("qa_details", {
                                      ...active.qa_details,
                                      compliance: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                              <div className="space-y-1.5 col-span-2">
                                <FieldLabel hint="The specific installation / CQA challenge details">Installation Challenge Description</FieldLabel>
                                <Textarea
                                  value={active.qa_details?.challenge_description || ""}
                                  onChange={(e) =>
                                    setField("qa_details", {
                                      ...active.qa_details,
                                      challenge_description: e.target.value,
                                    })
                                  }
                                  className="min-h-[80px] text-xs leading-relaxed"
                                  placeholder="Describe the technical lining installation challenges..."
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2">
                                <FieldLabel hint="Our approach and sequence methodology to solve it">Installation Solution / Approach</FieldLabel>
                                <Textarea
                                  value={active.qa_details?.challenge_approach || ""}
                                  onChange={(e) =>
                                    setField("qa_details", {
                                      ...active.qa_details,
                                      challenge_approach: e.target.value,
                                    })
                                  }
                                  className="min-h-[80px] text-xs leading-relaxed"
                                  placeholder="Describe the clay subgrade, GCL, HDPE, geocomposite sequence approach..."
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <FieldLabel hint="Detailed QA/QC SANS checklist logs (visual check, destructive tests, trial welds etc.)">
                                Field Quality Control Checklist
                              </FieldLabel>
                              <ChecklistEditor
                                list={active.qa_details?.checklist || []}
                                onChange={(checklist) =>
                                  setField("qa_details", {
                                    ...active.qa_details,
                                    checklist,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-4">
                              <FieldLabel hint="Upload or paste on-site verification photos with captions">
                                Installation Work Photos
                              </FieldLabel>
                              <PhotosEditor
                                photos={active.qa_details?.photos || []}
                                onChange={(photos) =>
                                  setField("qa_details", {
                                    ...active.qa_details,
                                    photos,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        {/* 2. SUPPLY ONLY SPECIFIC FIELDS */}
                        {active.service_type === "supply_only" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Logistics Tonnage (e.g. '340 t')">Logistics Tonnage</FieldLabel>
                                <Input
                                  value={active.logistics_details?.tonnage || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      tonnage: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Total road distance (e.g., '3,420 km')">Distance Route</FieldLabel>
                                <Input
                                  value={active.logistics_details?.route || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      route: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Borders crossed (e.g. '4 borders')">Borders Crossed</FieldLabel>
                                <Input
                                  value={active.logistics_details?.borders || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      borders: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="On-time delivery index (e.g., '100%')">On-Time delivery</FieldLabel>
                                <Input
                                  value={active.logistics_details?.ontime || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      ontime: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold text-primary"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                              <div className="space-y-1.5 col-span-2">
                                <FieldLabel hint="The logistics and shipping constraints details">Logistics Challenge Description</FieldLabel>
                                <Textarea
                                  value={active.logistics_details?.challenge_description || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      challenge_description: e.target.value,
                                    })
                                  }
                                  className="min-h-[80px] text-xs leading-relaxed"
                                  placeholder="Describe the custom clearances, road transit, border checkpoints..."
                                />
                              </div>
                              <div className="space-y-1.5">
                                <FieldLabel hint="Logistics callout panel heading">Challenge Callout Heading</FieldLabel>
                                <Input
                                  value={active.logistics_details?.challenge_callout_title || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      challenge_callout_title: e.target.value,
                                    })
                                  }
                                  className="text-xs font-semibold"
                                  placeholder="e.g. Zero-Tolerance Documentation Control"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <FieldLabel hint="Logistics callout panel details">Challenge Callout Body</FieldLabel>
                                <Textarea
                                  value={active.logistics_details?.challenge_callout_body || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      challenge_callout_body: e.target.value,
                                    })
                                  }
                                  className="min-h-[60px] text-xs leading-relaxed"
                                  placeholder="Material checks, certificates of origin, spelling validation..."
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <FieldLabel hint="Timelines container-by-container route tracker from source mill directly onto laydown">
                                Multimodal Cross-Border Route Timeline Steps
                              </FieldLabel>
                              <RouteStepsEditor
                                steps={active.logistics_details?.route_steps || []}
                                onChange={(route_steps) =>
                                  setField("logistics_details", {
                                    ...active.logistics_details,
                                    route_steps,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-4">
                              <FieldLabel hint="Complete documentation package checklist issued for rapid border pre-clearance">
                                Logistics Document Chain Checklist
                              </FieldLabel>
                              <DocumentChecklistEditor
                                docs={active.logistics_details?.documents || []}
                                onChange={(documents) =>
                                  setField("logistics_details", {
                                    ...active.logistics_details,
                                    documents,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        {/* 3. SERVICES ONLY SPECIFIC FIELDS */}
                        {active.service_type === "services_only" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Programme timeline (e.g., '5 weeks')">Programme duration</FieldLabel>
                                <Input
                                  value={active.service_details?.duration || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      duration: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Tests Streams run (e.g., '6 streams')">Forensic Streams</FieldLabel>
                                <Input
                                  value={active.service_details?.tests || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      tests: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Coupons extracted (e.g. '94 coupons')">Samples Extracted</FieldLabel>
                                <Input
                                  value={active.service_details?.samples || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      samples: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Deliverable Dossier (e.g., 'CQA Report')">Audit Deliverable</FieldLabel>
                                <Input
                                  value={active.service_details?.deliverable || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      deliverable: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold text-primary"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                              <div className="space-y-1.5 col-span-3">
                                <FieldLabel hint="Audit and review methodology challenges details">Audit Challenge / Methodology Intro</FieldLabel>
                                <Textarea
                                  value={active.service_details?.challenge_description || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      challenge_description: e.target.value,
                                    })
                                  }
                                  className="min-h-[80px] text-xs leading-relaxed"
                                  placeholder="Describe the SANS and voluntary GISTM guidelines reviewed..."
                                />
                              </div>
                              <div className="space-y-1.5 col-span-3 md:col-span-1.5">
                                <FieldLabel hint="Laboratory testing programme details">Laboratory Testing Description</FieldLabel>
                                <Textarea
                                  value={active.service_details?.testing_description || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      testing_description: e.target.value,
                                    })
                                  }
                                  className="min-h-[80px] text-xs leading-relaxed"
                                  placeholder="Antioxidant levels, thickness degradation, stress cracking..."
                                />
                              </div>
                              <div className="space-y-1.5 col-span-3 md:col-span-1.5">
                                <FieldLabel hint="Forensic coupon findings registers explanation">Findings Register Description</FieldLabel>
                                <Textarea
                                  value={active.service_details?.findings_description || ""}
                                  onChange={(e) =>
                                    setField("service_details", {
                                      ...active.service_details,
                                      findings_description: e.target.value,
                                    })
                                  }
                                  className="min-h-[80px] text-xs leading-relaxed"
                                  placeholder="Visual checks and testing coupons yielded registered findings..."
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <FieldLabel hint="Clinical technical independence details verifying third-party evaluation and no supply conflict of interest">
                                Technical Independence Statement
                              </FieldLabel>
                              <Textarea
                                value={active.service_details?.independence_statement || ""}
                                onChange={(e) =>
                                  setField("service_details", {
                                    ...active.service_details,
                                    independence_statement: e.target.value,
                                  })
                                }
                                className="min-h-[80px] text-xs leading-relaxed"
                              />
                            </div>

                            <div className="space-y-4">
                              <FieldLabel hint="Stages of visual checking and ISO laboratory testing protocols">
                                Forensic Methodology Protocol Stages
                              </FieldLabel>
                              <ForensicProtocolEditor
                                protocols={active.service_details?.forensic_protocol || []}
                                onChange={(forensic_protocol) =>
                                  setField("service_details", {
                                    ...active.service_details,
                                    forensic_protocol,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-4">
                              <FieldLabel hint="Forensic coupon findings registers detailing thickness, UV standard OIT and pinhole detection results">
                                Forensic Findings Register
                              </FieldLabel>
                              <FindingsRegisterEditor
                                findings={active.service_details?.findings || []}
                                onChange={(findings) =>
                                  setField("service_details", {
                                    ...active.service_details,
                                    findings,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Products Used List Sub-editor ──────────────────────────────────────────
function ProductsEditor({
  items,
  onChange,
}: {
  items: any[];
  onChange: (items: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...items,
      { category: "Geomembrane", name: "GSE® Smooth HDPE 2.0 mm", qty: "20,000 m²", origin: "EU (Netherlands)" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const excludeIds = items.map((it) => it.productId).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Products list ({items.length})
        </span>
        <Button variant="ghost" size="sm" onClick={add} className="h-7 text-xs text-primary gap-1 cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="border border-border rounded-xl p-4 bg-surface/40 space-y-3 relative group flex flex-col justify-between"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer z-10"
              onClick={() => remove(idx)}
            >

            </Button>

            <div className="space-y-3.5">
              {/* Product Selector Dropdown from Database */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold uppercase text-primary block">
                    Link Database Product
                  </label>
                  {it.productId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4.5 w-4.5 text-destructive hover:bg-destructive/10 rounded cursor-pointer"
                      onClick={() => {
                        const next = [...items];
                        delete next[idx].productId;
                        delete next[idx].productSlug;
                        delete next[idx].image_url;
                        delete next[idx].short_description;
                        onChange(next);
                        toast.info("Database product link removed.");
                      }}
                      title="Clear product link"
                    >
                      <X className="h-3 w-3" strokeWidth={3} />
                    </Button>
                  )}
                </div>
                <ProductSelector
                  excludeIds={excludeIds}
                  onSelect={(prod) => {
                    const next = [...items];
                    next[idx] = {
                      ...next[idx],
                      productId: prod.id,
                      productSlug: prod.slug,
                      name: prod.name,
                      category: prod.product_categories?.name || next[idx].category || "",
                      image_url: prod.image_url,
                      short_description: prod.short_description,
                    };
                    onChange(next);
                  }}
                />
              </div>

              {/* Linked Product Preview Box */}
              {it.productId && (
                <div className="flex gap-2.5 p-2.5 rounded-lg border border-border bg-surface/50 text-[11px] animate-in fade-in duration-200">
                  <div className="h-10 w-10 shrink-0 rounded border border-border bg-card flex items-center justify-center text-primary overflow-hidden">
                    {it.image_url ? (
                      <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />
                    ) : (
                      <Layers className="h-4 w-4 opacity-40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground truncate">
                      {it.name}
                    </div>
                    {it.short_description && (
                      <p className="text-[10px] text-muted-foreground leading-normal mt-0.5 line-clamp-2">
                        {it.short_description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Standard Inputs */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                      Category
                    </label>
                    <Input
                      value={it.category || ""}
                      onChange={(e) => update(idx, "category", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="e.g. Geomembrane"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                      Quantity
                    </label>
                    <Input
                      value={it.qty || ""}
                      onChange={(e) => update(idx, "qty", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="e.g. 240,000 m²"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Product Name (Override)
                  </label>
                  <Input
                    value={it.name || ""}
                    onChange={(e) => update(idx, "name", e.target.value)}
                    className="h-7 text-xs font-semibold"
                    placeholder="e.g. GSE® Smooth HDPE 2.0 mm"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Mill Origin
                  </label>
                  <Input
                    value={it.origin || ""}
                    onChange={(e) => update(idx, "origin", e.target.value)}
                    className="h-7 text-xs"
                    placeholder="e.g. EU (Netherlands) or South Africa"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground italic text-center py-6">
          No products associated yet. Click "Add Product".
        </p>
      )}
    </div>
  );
}

// ─── Spec Compliance Sub-editor ─────────────────────────────────────────────
function SpecComplianceEditor({
  items,
  onChange,
}: {
  items: any[];
  onChange: (items: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...items,
      { property: "Thickness", method: "ASTM D5199", spec: "2.00 mm", delivered: "2.06 mm", margin: "+3.0%" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Specifications comparison matrix ({items.length})
        </span>
        <Button variant="ghost" size="sm" onClick={add} className="h-7 text-xs text-primary gap-1 cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Add Conformity
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-surface/10">
        <table className="w-full text-xs">
          <thead className="bg-[#1A1A1A] text-white uppercase font-bold text-[10px]">
            <tr>
              <th className="px-3 py-2 text-left">Property</th>
              <th className="px-3 py-2 text-left">Test Method</th>
              <th className="px-3 py-2 text-left">Spec Min</th>
              <th className="px-3 py-2 text-left">Delivered</th>
              <th className="px-3 py-2 text-left">Margin</th>
              <th className="px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium">
            {items.map((it, idx) => (
              <tr key={idx} className="hover:bg-surface/30 transition">
                <td className="p-1 min-w-[120px]">
                  <Input
                    value={it.property || ""}
                    onChange={(e) => update(idx, "property", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 font-semibold"
                    placeholder="Thickness"
                  />
                </td>
                <td className="p-1 min-w-[100px]">
                  <Input
                    value={it.method || ""}
                    onChange={(e) => update(idx, "method", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 font-mono text-muted-foreground"
                    placeholder="ASTM D5199"
                  />
                </td>
                <td className="p-1 min-w-[90px]">
                  <Input
                    value={it.spec || ""}
                    onChange={(e) => update(idx, "spec", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0"
                    placeholder="2.00 mm"
                  />
                </td>
                <td className="p-1 min-w-[90px]">
                  <Input
                    value={it.delivered || ""}
                    onChange={(e) => update(idx, "delivered", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0"
                    placeholder="2.06 mm"
                  />
                </td>
                <td className="p-1 min-w-[90px]">
                  <Input
                    value={it.margin || ""}
                    onChange={(e) => update(idx, "margin", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 font-bold text-emerald-600"
                    placeholder="+3.0% or PASS"
                  />
                </td>
                <td className="p-1 text-center shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => remove(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground italic text-center py-6">
          No specifications conformity data. Click "Add Conformity".
        </p>
      )}
    </div>
  );
}

// ─── QA Checklist Sub-editor ──────────────────────────────────────────────
function ChecklistEditor({
  list,
  onChange,
}: {
  list: string[];
  onChange: (list: string[]) => void;
}) {
  const add = () => onChange([...list, "New signed CQA item checklist description..."]);
  const update = (idx: number, val: string) => {
    const next = [...list];
    next[idx] = val;
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(list.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {list.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start bg-surface/50 border border-border rounded-lg p-2 relative group">
            <Input
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              className="text-xs border-0 bg-transparent focus-visible:ring-0 flex-1 leading-normal py-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs gap-1 cursor-pointer">
        <Plus className="h-3 w-3" /> Add QC Check
      </Button>
      {list.length === 0 && (
        <p className="text-xs text-muted-foreground italic pl-1">No checklist items set.</p>
      )}
    </div>
  );
}

// ─── Photos / Gallery Sub-editor ─────────────────────────────────────────────
function PhotosEditor({
  photos,
  onChange,
}: {
  photos: any[];
  onChange: (photos: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...photos,
      { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80", caption: "Photo caption description" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...photos];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {photos.map((ph, idx) => (
          <div key={idx} className="border border-border rounded-xl p-3 bg-surface/40 relative space-y-2 flex flex-col group">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            {ph.url && (
              <div className="aspect-[4/3] rounded overflow-hidden bg-cover bg-center border border-border" style={{ backgroundImage: `url(${ph.url})` }} />
            )}

            <div className="space-y-2 flex-grow">
              <div>
                <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Photo URL</label>
                <Input
                  value={ph.url || ""}
                  onChange={(e) => update(idx, "url", e.target.value)}
                  className="h-7 text-xs font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Caption</label>
                <Input
                  value={ph.caption || ""}
                  onChange={(e) => update(idx, "caption", e.target.value)}
                  className="h-7 text-xs font-semibold"
                  placeholder="e.g. Subgrade compaction acceptance test"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs gap-1.5 cursor-pointer">
        <Plus className="h-3.5 w-3.5" /> Add Work Photo
      </Button>
      {photos.length === 0 && (
        <p className="text-xs text-muted-foreground italic pl-1">No photos added.</p>
      )}
    </div>
  );
}

// ─── Route Steps Sub-editor ─────────────────────────────────────────────────
function RouteStepsEditor({
  steps,
  onChange,
}: {
  steps: any[];
  onChange: (steps: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...steps,
      { stage: "Stage 01", name: "Heerenveen Mill", desc: "Manufactured on spec and sealed.", duration: "D0 - D+3" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...steps];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(steps.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {steps.map((st, idx) => (
          <div key={idx} className="border border-border rounded-xl p-4 bg-surface/30 relative space-y-3">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Stage Tag</label>
                <Input
                  value={st.stage || ""}
                  onChange={(e) => update(idx, "stage", e.target.value)}
                  className="h-7 text-xs font-semibold uppercase text-primary"
                  placeholder="e.g. Stage 01"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Name/Checkpoint</label>
                <Input
                  value={st.name || ""}
                  onChange={(e) => update(idx, "name", e.target.value)}
                  className="h-7 text-xs font-bold"
                  placeholder="e.g. Rotterdam Port or Durban Custom"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Description details</label>
                <Input
                  value={st.desc || ""}
                  onChange={(e) => update(idx, "desc", e.target.value)}
                  className="h-7 text-xs"
                  placeholder="e.g. Sealed and packed containers logged."
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Duration</label>
                <Input
                  value={st.duration || ""}
                  onChange={(e) => update(idx, "duration", e.target.value)}
                  className="h-7 text-xs font-mono font-bold"
                  placeholder="e.g. D+3 - D+24"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs gap-1.5 cursor-pointer">
        <Plus className="h-3.5 w-3.5" /> Add Timeline Step
      </Button>
      {steps.length === 0 && (
        <p className="text-xs text-muted-foreground italic pl-1">No steps registered.</p>
      )}
    </div>
  );
}

// ─── Logistics Documents Sub-editor ──────────────────────────────────────────
function DocumentChecklistEditor({
  docs,
  onChange,
}: {
  docs: any[];
  onChange: (docs: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...docs,
      { title: "SADC Certificate", desc: "Preferential custom duties Form CO clearance.", status: "Issued" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...docs];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(docs.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {docs.map((doc, idx) => (
          <div key={idx} className="border border-border rounded-xl p-4 bg-surface/30 relative space-y-3 flex flex-col justify-between group">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Document Title</label>
                  <Input
                    value={doc.title || ""}
                    onChange={(e) => update(idx, "title", e.target.value)}
                    className="h-7 text-xs font-bold font-display"
                    placeholder="e.g. SADC Certificate of Origin"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Status</label>
                  <Input
                    value={doc.status || ""}
                    onChange={(e) => update(idx, "status", e.target.value)}
                    className="h-7 text-xs w-20 font-bold text-center text-primary uppercase"
                    placeholder="Issued"
                  />
                </div>
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Summary / Requirements</label>
                <Textarea
                  value={doc.desc || ""}
                  onChange={(e) => update(idx, "desc", e.target.value)}
                  className="min-h-[50px] text-xs resize-none leading-normal"
                  placeholder="e.g. Issued per extrusion batch to secure customs pref rates."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs gap-1.5 cursor-pointer">
        <Plus className="h-3.5 w-3.5" /> Add Document
      </Button>
      {docs.length === 0 && (
        <p className="text-xs text-muted-foreground italic pl-1">No documents listed.</p>
      )}
    </div>
  );
}

// ─── Forensic Protocol Sub-editor ───────────────────────────────────────────
function ForensicProtocolEditor({
  protocols,
  onChange,
}: {
  protocols: any[];
  onChange: (protocols: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...protocols,
      { step: "01", name: "Visual Review", desc: "Walkover photo mapping log.", output: "Defects list log" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...protocols];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(protocols.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {protocols.map((pr, idx) => (
          <div key={idx} className="border border-border rounded-xl p-4 bg-surface/30 relative space-y-3">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Step Index</label>
                <Input
                  maxLength={2}
                  value={pr.step || ""}
                  onChange={(e) => update(idx, "step", e.target.value)}
                  className="h-7 text-xs font-mono font-bold text-center w-16 text-primary"
                  placeholder="01"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Protocol Stage Name</label>
                <Input
                  value={pr.name || ""}
                  onChange={(e) => update(idx, "name", e.target.value)}
                  className="h-7 text-xs font-bold"
                  placeholder="e.g. Visual Embankment Audit"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Detailed description</label>
                <Input
                  value={pr.desc || ""}
                  onChange={(e) => update(idx, "desc", e.target.value)}
                  className="h-7 text-xs leading-relaxed"
                  placeholder="Detail visual walks, GPS maps check..."
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-muted-foreground block mb-0.5">Deliverable Output</label>
                <Input
                  value={pr.output || ""}
                  onChange={(e) => update(idx, "output", e.target.value)}
                  className="h-7 text-xs font-bold text-primary"
                  placeholder="e.g. Visual defects logs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs gap-1.5 cursor-pointer">
        <Plus className="h-3.5 w-3.5" /> Add Protocol Stage
      </Button>
      {protocols.length === 0 && (
        <p className="text-xs text-muted-foreground italic pl-1">No protocols established.</p>
      )}
    </div>
  );
}

// ─── Forensic Findings Sub-editor ───────────────────────────────────────────
function FindingsRegisterEditor({
  findings,
  onChange,
}: {
  findings: any[];
  onChange: (findings: any[]) => void;
}) {
  const add = () =>
    onChange([
      ...findings,
      { area: "Main Pad", title: "UV Degradation Check", desc: "Antioxidants Standard OIT exceeds limits.", status: "PASS" },
    ]);
  const update = (idx: number, key: string, val: string) => {
    const next = [...findings];
    next[idx] = { ...next[idx], [key]: val };
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(findings.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {findings.map((fn, idx) => (
          <div key={idx} className="border border-border rounded-xl p-4 bg-surface/30 relative space-y-3 flex flex-col justify-between group">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => remove(idx)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Physical Area</label>
                  <Input
                    value={fn.area || ""}
                    onChange={(e) => update(idx, "area", e.target.value)}
                    className="h-7 text-xs font-semibold"
                    placeholder="e.g. Embankment Sump"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Status Audit</label>
                  <Select
                    value={fn.status || "PASS"}
                    onValueChange={(v) => update(idx, "status", v)}
                  >
                    <SelectTrigger className="h-7 text-[10px] font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PASS">PASS (Green)</SelectItem>
                      <SelectItem value="ATTENTION">ATTENTION (Orange)</SelectItem>
                      <SelectItem value="ACTION">ACTION (Red)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Audit Title</label>
                <Input
                  value={fn.title || ""}
                  onChange={(e) => update(idx, "title", e.target.value)}
                  className="h-7 text-xs font-bold"
                  placeholder="e.g. UV Aging & Standard OIT"
                />
              </div>

              <div>
                <label className="text-[8px] font-bold uppercase text-muted-foreground block mb-0.5">Findings Details</label>
                <Textarea
                  value={fn.desc || ""}
                  onChange={(e) => update(idx, "desc", e.target.value)}
                  className="min-h-[60px] text-xs leading-normal resize-none"
                  placeholder="Detail the audit checks results..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="h-8 text-xs gap-1.5 cursor-pointer">
        <Plus className="h-3.5 w-3.5" /> Add Forensic Finding
      </Button>
      {findings.length === 0 && (
        <p className="text-xs text-muted-foreground italic pl-1">No forensic findings registered.</p>
      )}
    </div>
  );
}
