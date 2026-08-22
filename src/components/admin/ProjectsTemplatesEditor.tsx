import { useEffect, useState, useCallback, useMemo } from "react";
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
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  Compass,
  ChevronRight,
  PlusCircle,
  X,
  Layers,
  Search,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProductSelector } from "./ProductSelector";
import { ScrollableTabsHeader } from "./ScrollableTabsHeader";
import { useSlugSync } from "@/hooks/use-slug-sync";
import { ImagePicker } from "./ImagePicker";
import {
  SectionHeading,
  FieldLabel,
  useListEditor,
  ItemCard,
  ItemDeleteButton,
  MicroLabel,
  EmptyState,
  AddItemButton,
} from "./TemplateEditorShared";

// Reusable Sub-components for Form Layouts

interface StatCounter {
  id: string;
  value: string;
  label: string;
}

interface AfricanCountryReach {
  id: string;
  flag: string;
  name: string;
  count: number;
}

interface ProjectsLandingContent {
  title: string;
  description: string;
  heroImage: string;
  stats?: StatCounter[];
  countries?: AfricanCountryReach[];
  seo?: {
    title: string;
    description: string;
    keywords?: string;
  };
}

const defaultLandingContent = (): ProjectsLandingContent => ({
  title: "340+ projects.\n17 countries.\nOne partner.",
  description:
    "Every project listed below was designed, supplied, installed, tested, or certified by Geosynthetics Africa. Filter by industry, application, product, or country to find reference designs that match your scope — or upload your tender pack for comparables.",
  heroImage: "https://images.unsplash.com/photo-1541888087405-eb81f5c6e8e7?w=1920&q=80",
  stats: [
    { id: "stat-1", value: "340+", label: "Projects delivered" },
    { id: "stat-2", value: "17", label: "African countries" },
    { id: "stat-3", value: "28M m²", label: "Geosynthetics installed" },
    { id: "stat-4", value: "20+", label: "Years experience" },
  ],
  countries: [
    { id: "country-1", flag: "🇿🇦", name: "South Africa", count: 218 },
    { id: "country-2", flag: "🇨🇩", name: "DRC", count: 34 },
    { id: "country-3", flag: "🇲🇱", name: "Mali", count: 18 },
    { id: "country-4", flag: "🇿🇲", name: "Zambia", count: 14 },
    { id: "country-5", flag: "🇬🇭", name: "Ghana", count: 11 },
    { id: "country-6", flag: "🇰🇪", name: "Kenya", count: 9 },
    { id: "country-7", flag: "🇹🇿", name: "Tanzania", count: 8 },
    { id: "country-8", flag: "🇿🇼", name: "Zimbabwe", count: 7 },
    { id: "country-9", flag: "🇲🇿", name: "Mozambique", count: 6 },
    { id: "country-10", flag: "🇳🇦", name: "Namibia", count: 6 },
    { id: "country-11", flag: "🇦🇴", name: "Angola", count: 5 },
    { id: "country-12", flag: "🇬🇬", name: "Guinea", count: 4 },
  ],
  seo: {
    title: "Projects — 340+ engineered geosynthetic projects across Africa | Geosynthetics Africa",
    description:
      "Explore our successful geosynthetic installations across Africa. Filter by industry, application, and service type.",
    keywords: "geosynthetics, projects, case studies, africa, geomembrane, installation",
  },
});

export function ProjectsTemplatesEditor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string>("__landing");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("landing");

  const [newTitle, setNewTitle] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(
    null,
  );

  // Search and Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Projects Landing Content states
  const [landingContent, setLandingContent] =
    useState<ProjectsLandingContent>(defaultLandingContent());
  const [editingLanding, setEditingLanding] =
    useState<ProjectsLandingContent>(defaultLandingContent());

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const title = p.title || "";
      const slug = p.slug || "";
      const country = p.country || "";
      const serviceType = p.service_type || "";
      const search = searchQuery.toLowerCase();
      return (
        title.toLowerCase().includes(search) ||
        slug.toLowerCase().includes(search) ||
        country.toLowerCase().includes(search) ||
        serviceType.toLowerCase().includes(search)
      );
    });
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProjects, currentPage]);

  // Synchronize current page when activeId changes (e.g. on load or creation)
  useEffect(() => {
    if (activeId && activeId !== "__landing") {
      const index = filteredProjects.findIndex((p) => p.id === activeId);
      if (index !== -1) {
        const page = Math.floor(index / itemsPerPage) + 1;
        if (page !== currentPage) {
          setCurrentPage(page);
        }
      }
    }
  }, [activeId, filteredProjects, currentPage]);

  // Synchronize edit state when selection or raw data changes
  useEffect(() => {
    if (activeId === "__landing") {
      setEditingLanding({
        ...defaultLandingContent(),
        ...landingContent,
        stats: landingContent?.stats || defaultLandingContent().stats || [],
        countries: landingContent?.countries || defaultLandingContent().countries || [],
        seo: {
          title: landingContent?.seo?.title || defaultLandingContent().seo?.title || "",
          description:
            landingContent?.seo?.description || defaultLandingContent().seo?.description || "",
          keywords: landingContent?.seo?.keywords || defaultLandingContent().seo?.keywords || "",
        },
      });
      setDirty(false);
    }
  }, [activeId, landingContent]);

  // Handle activeTab switching between landing vs normal project tabs
  useEffect(() => {
    if (activeId === "__landing") {
      if (activeTab !== "landing" && activeTab !== "seo" && activeTab !== "stats_reach") {
        setActiveTab("landing");
      }
    } else {
      if (activeTab === "landing" || activeTab === "seo" || activeTab === "stats_reach") {
        setActiveTab("hero");
      }
    }
  }, [activeId]);

  const setLandingField = (key: keyof ProjectsLandingContent, value: any) => {
    setEditingLanding((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const setLandingSeoField = (key: string, value: any) => {
    setEditingLanding((prev) => ({
      ...prev,
      seo: {
        title: prev.seo?.title || defaultLandingContent().seo?.title || "",
        description: prev.seo?.description || defaultLandingContent().seo?.description || "",
        keywords: prev.seo?.keywords || defaultLandingContent().seo?.keywords || "",
        [key]: value,
      },
    }));
    setDirty(true);
  };

  const handleAddStat = () => {
    const newStats = [...(editingLanding.stats || [])];
    newStats.push({
      id: `stat-${Date.now()}`,
      value: "100+",
      label: "New Stat Metric",
    });
    setLandingField("stats", newStats);
  };

  const handleUpdateStat = (index: number, field: string, value: string) => {
    const newStats = [...(editingLanding.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    setLandingField("stats", newStats);
  };

  const handleRemoveStat = (index: number) => {
    const newStats = (editingLanding.stats || []).filter((_, i) => i !== index);
    setLandingField("stats", newStats);
  };

  const handleAddCountry = () => {
    const newCountries = [...(editingLanding.countries || [])];
    newCountries.push({
      id: `country-${Date.now()}`,
      flag: "🌍",
      name: "New Country",
      count: 0,
    });
    setLandingField("countries", newCountries);
  };

  const handleUpdateCountry = (index: number, field: string, value: any) => {
    const newCountries = [...(editingLanding.countries || [])];
    newCountries[index] = { ...newCountries[index], [field]: value };
    setLandingField("countries", newCountries);
  };

  const handleRemoveCountry = (index: number) => {
    const newCountries = (editingLanding.countries || []).filter((_, i) => i !== index);
    setLandingField("countries", newCountries);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      handleDelete(projectToDelete.id, projectToDelete.title);
      setProjectToDelete(null);
    }
  };

  // ─── Load from Supabase ───
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("project_year", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load project templates: " + error.message);
      } else if (data) {
        setProjects(data);
      }

      const { data: landingRow, error: landingError } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "projects_landing_content")
        .maybeSingle();

      if (landingError) {
        console.error("Failed to load projects_landing_content:", landingError);
      } else if (landingRow?.value) {
        setLandingContent(landingRow.value as ProjectsLandingContent);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load projects");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Active project helper
  const active = projects.find((p) => p.id === activeId) || null;

  const updateActive = (updater: (prev: any) => any) => {
    if (!activeId) return;
    setProjects((prev) => prev.map((p) => (p.id === activeId ? updater(p) : p)));
    setDirty(true);
  };

  const setField = (key: string, value: any) => {
    updateActive((prev) => ({ ...prev, [key]: value }));
  };

  const { handleSlugChange, handleSlugBlur } = useSlugSync({
    title: active?.title || "",
    slug: active?.slug || "",
    onSlugChange: (newSlug) => setField("slug", newSlug),
    entityId: activeId,
  });

  // â”€â”€ Add New Project â”€â”€
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
      scale: "10,000 mÂ²",
      status: "published",
      gallery: [],
      logistics_details: {
        tonnage: "100 t",
        route: "1,200 km",
        borders: "2 borders",
        ontime: "100%",
        kpi_demurrage_free: "100%",
        kpi_frontier_delays: "0 Days",
        kpi_sealed_consignments: "12 Trucks",
        kpi_ontime_laydown: "100%",
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

  // ─── Delete Project ───
  const handleDelete = async (id: string, title: string) => {
    // Clear product links first to prevent FK constraint violations
    await supabase.from("case_study_products").delete().eq("case_study_id", id);

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

  // ─── Save Current Project / Landing Page ───
  const handleSave = async () => {
    setSaving(true);

    if (activeId === "__landing") {
      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key: "projects_landing_content", value: editingLanding as any },
          { onConflict: "key" },
        );

      if (error) {
        toast.error("Save failed: " + error.message);
      } else {
        toast.success("Projects landing page settings saved successfully!");
        setLandingContent(editingLanding);
        setDirty(false);
      }
    } else {
      if (!active) {
        setSaving(false);
        return;
      }

      const { error } = await supabase.from("case_studies").upsert(active, { onConflict: "id" });

      if (error) {
        toast.error("Save failed: " + error.message);
      } else {
        // Sync case_study_products relationship
        try {
          // Delete existing product links for this case study
          await supabase.from("case_study_products").delete().eq("case_study_id", active.id);

          // Get product IDs linked in products_used
          const productIds = (active.products_used || [])
            .map((item: any) => item.productId)
            .filter(Boolean);

          if (productIds.length > 0) {
            const links = productIds.map((pId: string) => ({
              case_study_id: active.id,
              product_id: pId,
            }));

            const { error: linkErr } = await supabase.from("case_study_products").insert(links);

            if (linkErr) {
              console.error("Error linking products:", linkErr);
              toast.error("Failed to link products: " + linkErr.message);
            }
          }
        } catch (err) {
          console.error("Exception syncing case study products:", err);
        }

        toast.success(`Project template "${active.title}" saved successfully!`);
        setDirty(false);
        load();
      }
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
            {activeId === "__landing"
              ? "Projects Landing Page"
              : "Project Templates (Case Studies)"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activeId === "__landing"
              ? "Input and manage the hero and SEO details for the /projects landing page."
              : "Input, manage, and structure high-fidelity project templates to populate '/projects/$slug'."}
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
            {saving ? "Savingâ€¦" : "Save Template"}
          </Button>
        </div>
      </div>

      {projects.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-surface/30">
          <Compass className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-bold uppercase mb-2">
            No projects templates found
          </h3>
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
            <Button
              onClick={handleAddNew}
              className="bg-primary text-white border-0 cursor-pointer"
            >
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-0 border border-border rounded-xl overflow-hidden min-h-[780px] bg-card shadow-sm">
          {/* Left Sidebar */}
          <div className="w-64 shrink-0 border-r border-border flex flex-col bg-surface/30">
            <div className="px-2 py-2 border-b border-border shrink-0 space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Main Pages
              </p>
              <button
                onClick={() => {
                  setActiveId("__landing");
                  setActiveTab("landing");
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors cursor-pointer",
                  activeId === "__landing"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-accent text-foreground",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-xs">Projects Landing Page</div>
                  <div className="truncate text-[10px] text-muted-foreground mt-0.5">/projects</div>
                </div>
                {activeId === "__landing" && <ChevronRight className="h-3 w-3 text-primary" />}
              </button>
            </div>

            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Project Templates (
                {filteredProjects.length !== projects.length
                  ? `${filteredProjects.length}/${projects.length}`
                  : projects.length}
                )
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

            {/* Search Box inside sidebar */}
            <div className="px-3 py-1.5 relative border-b border-border shrink-0">
              <Search className="absolute left-5.5 top-3.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-8 text-xs bg-surface"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {paginatedProjects.map((p) => {
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
                        : "hover:bg-accent text-foreground",
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete({ id: p.id, title: p.title });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </button>
                );
              })}
              {filteredProjects.length === 0 && (
                <p className="text-center text-[10px] text-muted-foreground py-4">No results</p>
              )}
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-border flex items-center justify-between bg-surface/50 text-xs shrink-0">
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

          {/* Right Panel - Form Editor */}
          <div className="flex-1 flex flex-col overflow-hidden bg-card">
            {!active && activeId !== "__landing" ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 p-8 text-center">
                <Compass className="h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">Select a project template to edit its fields</p>
              </div>
            ) : activeId === "__landing" ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Active Category Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-surface/30 gap-2">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground leading-tight">
                      Projects Landing Page
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Route:{" "}
                      <code className="bg-surface px-1.5 py-0.5 rounded font-mono text-primary font-bold">
                        /projects
                      </code>
                    </p>
                  </div>
                </div>

                {/* Landing page editing tabs */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ScrollableTabsHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="bg-transparent h-10 gap-0 p-0 border-b-0 rounded-none justify-start flex-nowrap shrink-0 w-max">
                        <TabsTrigger
                          value="landing"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Hero & Details
                        </TabsTrigger>
                        <TabsTrigger
                          value="stats_reach"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Stats & Reach
                        </TabsTrigger>
                        <TabsTrigger
                          value="seo"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          SEO Settings
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </ScrollableTabsHeader>

                  <div className="flex-1 overflow-y-auto p-6">
                    <Tabs value={activeTab} className="h-full">
                      {/* LANDING TAB */}
                      <TabsContent
                        value="landing"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>Hero Details</SectionHeading>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Hero title displayed in bold display font (e.g. 340+ projects. 17 countries.)">
                              Hero Title (H1)
                            </FieldLabel>
                            <Input
                              value={editingLanding.title ?? ""}
                              onChange={(e) => setLandingField("title", e.target.value)}
                              className="text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Descriptive text paragraph displayed below the H1 title">
                              Description
                            </FieldLabel>
                            <Textarea
                              value={editingLanding.description ?? ""}
                              onChange={(e) => setLandingField("description", e.target.value)}
                              className="min-h-[120px] text-sm leading-relaxed"
                            />
                          </div>
                          <div>
                            <ImagePicker
                              label="Hero Background Image"
                              hint="Optional background hero photo URL. Leave empty to use the dark gradient background."
                              value={editingLanding.heroImage ?? ""}
                              onChange={(val) => setLandingField("heroImage", val)}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* STATS & REACH TAB */}
                      <TabsContent
                        value="stats_reach"
                        className="space-y-8 m-0 focus-visible:outline-none"
                      >
                        {/* Section 1: Counter Metrics */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <SectionHeading>Stats Ribbon Counter Metrics</SectionHeading>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddStat}
                              className="h-8 text-xs gap-1.5 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Metric
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(editingLanding.stats || []).map((stat, idx) => (
                              <div
                                key={stat.id || idx}
                                className="border border-border rounded-xl p-4 bg-surface/30 relative space-y-3"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
                                  onClick={() => handleRemoveStat(idx)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>

                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                      Stat Value / Number
                                    </label>
                                    <Input
                                      value={stat.value}
                                      onChange={(e) =>
                                        handleUpdateStat(idx, "value", e.target.value)
                                      }
                                      placeholder="e.g. 340+"
                                      className="text-xs font-mono font-bold"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                      Stat Label
                                    </label>
                                    <Input
                                      value={stat.label}
                                      onChange={(e) =>
                                        handleUpdateStat(idx, "label", e.target.value)
                                      }
                                      placeholder="e.g. Projects delivered"
                                      className="text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {(editingLanding.stats || []).length === 0 && (
                              <p className="text-xs text-muted-foreground italic col-span-2">
                                No stats defined. Click Add Metric.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Section 2: Country Reach Grid */}
                        <div className="border-t border-border pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <SectionHeading>Pan-African Reach Flag Statistics</SectionHeading>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddCountry}
                              className="h-8 text-xs gap-1.5 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Country
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(editingLanding.countries || []).map((c, idx) => (
                              <div
                                key={c.id || idx}
                                className="border border-border rounded-xl p-4 bg-surface/30 relative space-y-3"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
                                  onClick={() => handleRemoveCountry(idx)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>

                                <div className="space-y-2">
                                  <div className="grid grid-cols-4 gap-2">
                                    <div className="col-span-1 space-y-1">
                                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                                        Flag
                                      </label>
                                      <Input
                                        value={c.flag}
                                        onChange={(e) =>
                                          handleUpdateCountry(idx, "flag", e.target.value)
                                        }
                                        placeholder="🇿🇦"
                                        className="text-xs text-center"
                                      />
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                      <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                                        Country Name
                                      </label>
                                      <Input
                                        value={c.name}
                                        onChange={(e) =>
                                          handleUpdateCountry(idx, "name", e.target.value)
                                        }
                                        placeholder="e.g. South Africa"
                                        className="text-xs"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                                      Project Count
                                    </label>
                                    <Input
                                      type="number"
                                      value={c.count}
                                      onChange={(e) =>
                                        handleUpdateCountry(
                                          idx,
                                          "count",
                                          parseInt(e.target.value) || 0,
                                        )
                                      }
                                      placeholder="0"
                                      className="text-xs font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {(editingLanding.countries || []).length === 0 && (
                              <p className="text-xs text-muted-foreground italic col-span-3">
                                No countries defined. Click Add Country.
                              </p>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      {/* SEO TAB */}
                      <TabsContent value="seo" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>SEO Meta Tags</SectionHeading>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Browser tab title and Google search snippet header">
                              Meta Title
                            </FieldLabel>
                            <Input
                              value={editingLanding.seo?.title ?? ""}
                              onChange={(e) => setLandingSeoField("title", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Brief summary shown in Google search results below the title link">
                              Meta Description
                            </FieldLabel>
                            <Textarea
                              value={editingLanding.seo?.description ?? ""}
                              onChange={(e) => setLandingSeoField("description", e.target.value)}
                              className="min-h-[100px] text-sm leading-relaxed"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Comma-separated keywords for legacy search engine signals">
                              SEO Keywords
                            </FieldLabel>
                            <Input
                              value={editingLanding.seo?.keywords ?? ""}
                              onChange={(e) => setLandingSeoField("keywords", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
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
                      Slug:{" "}
                      <code className="bg-surface px-1.5 py-0.5 rounded font-mono text-primary font-bold">
                        /projects/{active.slug}
                      </code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      Service Type:
                    </span>
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
                  <ScrollableTabsHeader>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="bg-transparent h-10 gap-0 p-0 border-b-0 rounded-none justify-start flex-nowrap shrink-0 w-max">
                        <TabsTrigger
                          value="hero"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Identity & Hero
                        </TabsTrigger>
                        <TabsTrigger
                          value="brief"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Brief & Body
                        </TabsTrigger>
                        <TabsTrigger
                          value="products"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Products Used
                        </TabsTrigger>
                        <TabsTrigger
                          value="compliance"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Spec Conformity
                        </TabsTrigger>
                        <TabsTrigger
                          value="testimonial"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Testimonial
                        </TabsTrigger>
                        {active.service_type === "supply_install" && (
                          <>
                            <TabsTrigger
                              value="sequence"
                              className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                            >
                              Installation Sequence
                            </TabsTrigger>
                            <TabsTrigger
                              value="qa"
                              className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                            >
                              QA & QC
                            </TabsTrigger>
                          </>
                        )}
                        <TabsTrigger
                          value="gallery"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider"
                        >
                          Project Gallery
                        </TabsTrigger>
                        <TabsTrigger
                          value="scopedetails"
                          className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-primary"
                        >
                          {active.service_type === "supply_install"
                            ? "Installation Challenge"
                            : "Technical Scope"}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </ScrollableTabsHeader>

                  <div className="flex-1 overflow-y-auto p-6">
                    <Tabs value={activeTab} className="h-full">
                      {/* HERO TAB */}
                      <TabsContent
                        value="hero"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>Hero Section & Page Identity</SectionHeading>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Project title displayed in bold display font">
                              Title
                            </FieldLabel>
                            <Input
                              value={active.title}
                              onChange={(e) => setField("title", e.target.value)}
                              className="text-sm font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="URL-friendly slug (e.g. zimbabwe-river-rehab)">
                              Slug
                            </FieldLabel>
                            <Input
                              value={active.slug}
                              onChange={(e) => handleSlugChange(e.target.value)}
                              onBlur={handleSlugBlur}
                              className="text-sm font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="The brand/operator name for the project">
                              Client Operator
                            </FieldLabel>
                            <Input
                              value={active.client_name || ""}
                              onChange={(e) => setField("client_name", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="District/Region (e.g., Lualaba, Kenieba)">
                              Location/Region
                            </FieldLabel>
                            <Input
                              value={active.location || ""}
                              onChange={(e) => setField("location", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Sovereign state (e.g., South Africa, DRC, Mali)">
                              Country
                            </FieldLabel>
                            <Input
                              value={active.country || ""}
                              onChange={(e) => setField("country", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Year commissioned (e.g., 2024)">
                              Commissioned Year
                            </FieldLabel>
                            <Input
                              type="number"
                              value={active.project_year || ""}
                              onChange={(e) =>
                                setField(
                                  "project_year",
                                  parseInt(e.target.value) || new Date().getFullYear(),
                                )
                              }
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Industrial sector (e.g., Mining, Agriculture, Infrastructure)">
                              Sector
                            </FieldLabel>
                            <Input
                              value={active.sector || ""}
                              onChange={(e) => setField("sector", e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FieldLabel hint="Physical size of layout scope (e.g. 210,000 mÂ²)">
                              Scale
                            </FieldLabel>
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
                            <FieldLabel hint="Status defines if public users can see the project">
                              Publishing Status
                            </FieldLabel>
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
                      <TabsContent
                        value="brief"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
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
                      <TabsContent
                        value="products"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>Catalogue Products Supplied & Deployed</SectionHeading>
                        <ProductsEditor
                          items={active.products_used || []}
                          onChange={(items) => setField("products_used", items)}
                        />
                      </TabsContent>

                      {/* SPEC CONFORMITY TAB */}
                      <TabsContent
                        value="compliance"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>
                          Laboratory Verification & Specification conformity
                        </SectionHeading>
                        <SpecComplianceEditor
                          items={active.spec_compliance || []}
                          onChange={(items) => setField("spec_compliance", items)}
                        />
                      </TabsContent>

                      {/* TESTIMONIAL TAB */}
                      <TabsContent
                        value="testimonial"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>Client Testimonial & Endorsement</SectionHeading>
                        <div className="border border-border rounded-xl p-5 bg-surface/30 space-y-4">
                          <div className="space-y-1.5">
                            <FieldLabel hint="Direct quote endorsement from client engineer">
                              Testimonial Quote
                            </FieldLabel>
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
                              <FieldLabel hint="Name of the person who gave the testimonial">
                                Name
                              </FieldLabel>
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
                              <FieldLabel hint="2-letter initials shown in testimonial circle">
                                Avatar Initials
                              </FieldLabel>
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
                      <TabsContent
                        value="scopedetails"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                          <SectionHeading>Dynamic Service-specific Details</SectionHeading>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded">
                            {active.service_type === "supply_install" &&
                              "Supply & Install Template"}
                            {active.service_type === "supply_only" && "Supply Only Template"}
                            {active.service_type === "services_only" && "Services Only Template"}
                          </span>
                        </div>

                        {/* 1. SUPPLY & INSTALL SPECIFIC FIELDS */}
                        {active.service_type === "supply_install" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <FieldLabel hint="Resources or welders count/crews (e.g. 'REACH (EC 1907/2006)' or '14 Certified')">
                                  Resources
                                </FieldLabel>
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
                                <FieldLabel hint="Standard regulatory compliance (e.g., SANS 1526, GRI GM13)">
                                  CQA Standards
                                </FieldLabel>
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
                                <FieldLabel hint="The specific installation / CQA challenge details">
                                  Installation Challenge Description
                                </FieldLabel>
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
                                <FieldLabel hint="Our approach and sequence methodology to solve it">
                                  Installation Solution / Approach
                                </FieldLabel>
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
                          </div>
                        )}
                        {/* 2. SUPPLY ONLY SPECIFIC FIELDS */}
                        {active.service_type === "supply_only" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="Logistics Tonnage (e.g. '340 t')">
                                  Logistics Tonnage
                                </FieldLabel>
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
                                <FieldLabel hint="Total road distance (e.g., '3,420 km')">
                                  Distance Route
                                </FieldLabel>
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
                                <FieldLabel hint="Borders crossed (e.g. '4 borders')">
                                  Borders Crossed
                                </FieldLabel>
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
                                <FieldLabel hint="On-time delivery index (e.g., '100%')">
                                  On-Time delivery
                                </FieldLabel>
                                <Input
                                  value={active.logistics_details?.ontime || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      ontime: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                            </div>

                            {/* KPI Metrics Row */}
                            <div className="grid grid-cols-4 gap-4 border-t border-border pt-4">
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="KPI: Demurrage Free percentage (e.g., '100%')">
                                  KPI: Demurrage Free
                                </FieldLabel>
                                <Input
                                  value={active.logistics_details?.kpi_demurrage_free || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      kpi_demurrage_free: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="KPI: Frontier delays average (e.g., '0 Days')">
                                  KPI: Frontier Delays
                                </FieldLabel>
                                <Input
                                  value={active.logistics_details?.kpi_frontier_delays || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      kpi_frontier_delays: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="KPI: Sealed consignments count (e.g., '12 Trucks')">
                                  KPI: Sealed Consignments
                                </FieldLabel>
                                <Input
                                  value={active.logistics_details?.kpi_sealed_consignments || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      kpi_sealed_consignments: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold"
                                />
                              </div>
                              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                <FieldLabel hint="KPI: On-Time laydown index (e.g., '100%')">
                                  KPI: On-Time Laydown
                                </FieldLabel>
                                <Input
                                  value={active.logistics_details?.kpi_ontime_laydown || ""}
                                  onChange={(e) =>
                                    setField("logistics_details", {
                                      ...active.logistics_details,
                                      kpi_ontime_laydown: e.target.value,
                                    })
                                  }
                                  className="text-sm font-semibold text-primary"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                              <div className="space-y-1.5 col-span-2">
                                <FieldLabel hint="The logistics and shipping constraints details">
                                  Logistics Challenge Description
                                </FieldLabel>
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
                                <FieldLabel hint="Logistics callout panel heading">
                                  Challenge Callout Heading
                                </FieldLabel>
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
                                <FieldLabel hint="Logistics callout panel details">
                                  Challenge Callout Body
                                </FieldLabel>
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
                                <FieldLabel hint="Programme timeline (e.g., '5 weeks')">
                                  Programme duration
                                </FieldLabel>
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
                                <FieldLabel hint="Tests Streams run (e.g., '6 streams')">
                                  Forensic Streams
                                </FieldLabel>
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
                                <FieldLabel hint="Coupons extracted (e.g. '94 coupons')">
                                  Samples Extracted
                                </FieldLabel>
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
                                <FieldLabel hint="Deliverable Dossier (e.g., 'CQA Report')">
                                  Audit Deliverable
                                </FieldLabel>
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
                                <FieldLabel hint="Audit and review methodology challenges details">
                                  Audit Challenge / Methodology Intro
                                </FieldLabel>
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
                                <FieldLabel hint="Laboratory testing programme details">
                                  Laboratory Testing Description
                                </FieldLabel>
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
                                <FieldLabel hint="Forensic coupon findings registers explanation">
                                  Findings Register Description
                                </FieldLabel>
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
                      {/* INSTALLATION SEQUENCE TAB */}
                      <TabsContent
                        value="sequence"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>Installation Sequence</SectionHeading>
                        <div className="space-y-4">
                          <FieldLabel hint="The 4 steps of the installation sequence shown on the project page">
                            Installation Sequence Steps (Steps 1–4)
                          </FieldLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, stepIdx) => {
                              const step = (active.qa_details?.sequence || [])[stepIdx] || {
                                title: "",
                                description: "",
                              };
                              return (
                                <div
                                  key={stepIdx}
                                  className="p-3 border border-border rounded-lg bg-surface/20 space-y-2"
                                >
                                  <div className="font-display font-bold text-xs uppercase text-primary">
                                    Step {stepIdx + 1}
                                  </div>
                                  <div className="space-y-1">
                                    <MicroLabel>Step Title</MicroLabel>
                                    <Input
                                      value={step.title || ""}
                                      placeholder={`e.g. Step ${stepIdx + 1} Title`}
                                      onChange={(e) => {
                                        const seq = [...(active.qa_details?.sequence || [])];
                                        while (seq.length <= stepIdx)
                                          seq.push({ title: "", description: "" });
                                        seq[stepIdx] = {
                                          ...seq[stepIdx],
                                          title: e.target.value,
                                        };
                                        setField("qa_details", {
                                          ...active.qa_details,
                                          sequence: seq,
                                        });
                                      }}
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <MicroLabel>Step Description</MicroLabel>
                                    <Input
                                      value={step.description || ""}
                                      placeholder={`e.g. Step ${stepIdx + 1} Description`}
                                      onChange={(e) => {
                                        const seq = [...(active.qa_details?.sequence || [])];
                                        while (seq.length <= stepIdx)
                                          seq.push({ title: "", description: "" });
                                        seq[stepIdx] = {
                                          ...seq[stepIdx],
                                          description: e.target.value,
                                        };
                                        setField("qa_details", {
                                          ...active.qa_details,
                                          sequence: seq,
                                        });
                                      }}
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>

                      {/* QA & QC TAB */}
                      <TabsContent value="qa" className="space-y-6 m-0 focus-visible:outline-none">
                        <SectionHeading>QA & QC</SectionHeading>
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
                      </TabsContent>

                      {/* PROJECT GALLERY TAB */}
                      <TabsContent
                        value="gallery"
                        className="space-y-6 m-0 focus-visible:outline-none"
                      >
                        <SectionHeading>Project Gallery</SectionHeading>
                        <div className="space-y-4">
                          <FieldLabel hint="Upload or paste on-site verification photos with captions">
                            Project Photos
                          </FieldLabel>
                          <PhotosEditor
                            photos={active.gallery || []}
                            onChange={(photos) => setField("gallery", photos)}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <DeleteConfirmationDialog
        isOpen={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project Template?"
        description="Are you absolutely sure? This will delete the case study from the database completely. This action cannot be undone."
        itemName={projectToDelete?.title}
        idPrefix="project-template"
      />
    </div>
  );
}

// â”€â”€â”€ Products Used List Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProductsEditor({ items, onChange }: { items: any[]; onChange: (items: any[]) => void }) {
  const { add, updateByKey, remove } = useListEditor(items, onChange, () => ({
    category: "Geomembrane",
    name: "GSEÂ® Smooth HDPE 2.0 mm",
    qty: "20,000 mÂ²",
    origin: "EU (Netherlands)",
  }));

  const excludeIds = items.map((it) => it.productId).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Products list ({items.length})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={add}
          className="h-7 text-xs text-primary gap-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it, idx) => (
          <ItemCard key={idx} className="flex flex-col justify-between">
            <ItemDeleteButton onClick={() => remove(idx)} />
            <div className="space-y-3.5">
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

              {it.productId && (
                <div className="flex gap-2.5 p-2.5 rounded-lg border border-border bg-surface/50 text-[11px] animate-in fade-in duration-200">
                  <div className="h-10 w-10 shrink-0 rounded border border-border bg-card flex items-center justify-center text-primary overflow-hidden">
                    {it.image_url ? (
                      <img
                        src={it.image_url}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Layers className="h-4 w-4 opacity-40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground truncate">{it.name}</div>
                    {it.short_description && (
                      <p className="text-[10px] text-muted-foreground leading-normal mt-0.5 line-clamp-2">
                        {it.short_description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <MicroLabel>Category</MicroLabel>
                    <Input
                      value={it.category || ""}
                      onChange={(e) => updateByKey(idx, "category", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="e.g. Geomembrane"
                    />
                  </div>
                  <div>
                    <MicroLabel>Quantity</MicroLabel>
                    <Input
                      value={it.qty || ""}
                      onChange={(e) => updateByKey(idx, "qty", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="e.g. 240,000 mÂ²"
                    />
                  </div>
                </div>
                <div>
                  <MicroLabel>Product Name (Override)</MicroLabel>
                  <Input
                    value={it.name || ""}
                    onChange={(e) => updateByKey(idx, "name", e.target.value)}
                    className="h-7 text-xs font-semibold"
                    placeholder="e.g. GSEÂ® Smooth HDPE 2.0 mm"
                  />
                </div>
                <div>
                  <MicroLabel>Mill Origin</MicroLabel>
                  <Input
                    value={it.origin || ""}
                    onChange={(e) => updateByKey(idx, "origin", e.target.value)}
                    className="h-7 text-xs"
                    placeholder="e.g. EU (Netherlands) or South Africa"
                  />
                </div>
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      {items.length === 0 && (
        <EmptyState message='No products associated yet. Click "Add Product".' />
      )}
    </div>
  );
}

// â”€â”€â”€ Spec Compliance Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SpecComplianceEditor({
  items,
  onChange,
}: {
  items: any[];
  onChange: (items: any[]) => void;
}) {
  const { add, updateByKey, remove } = useListEditor(items, onChange, () => ({
    property: "Thickness",
    method: "ASTM D5199",
    spec: "2.00 mm",
    delivered: "2.06 mm",
    margin: "+3.0%",
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Specifications comparison matrix ({items.length})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={add}
          className="h-7 text-xs text-primary gap-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add Conformity
        </Button>
      </div>
      <div className="border border-border rounded-xl overflow-hidden bg-surface/10">
        <table className="w-full text-xs">
          <thead className="bg-[#1A1A1A] text-white uppercase font-bold text-[10px]">
            <tr>
              {["Property", "Test Method", "Spec Min", "Delivered", "Margin", ""].map((h) => (
                <th key={h} className="px-3 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium">
            {items.map((it, idx) => (
              <tr key={idx} className="hover:bg-surface/30 transition">
                <td className="p-1 min-w-[120px]">
                  <Input
                    value={it.property || ""}
                    onChange={(e) => updateByKey(idx, "property", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 font-semibold"
                    placeholder="Thickness"
                  />
                </td>
                <td className="p-1 min-w-[100px]">
                  <Input
                    value={it.method || ""}
                    onChange={(e) => updateByKey(idx, "method", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 font-mono text-muted-foreground"
                    placeholder="ASTM D5199"
                  />
                </td>
                <td className="p-1 min-w-[90px]">
                  <Input
                    value={it.spec || ""}
                    onChange={(e) => updateByKey(idx, "spec", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0"
                    placeholder="2.00 mm"
                  />
                </td>
                <td className="p-1 min-w-[90px]">
                  <Input
                    value={it.delivered || ""}
                    onChange={(e) => updateByKey(idx, "delivered", e.target.value)}
                    className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0"
                    placeholder="2.06 mm"
                  />
                </td>
                <td className="p-1 min-w-[90px]">
                  <Input
                    value={it.margin || ""}
                    onChange={(e) => updateByKey(idx, "margin", e.target.value)}
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
        <EmptyState message='No specifications conformity data. Click "Add Conformity".' />
      )}
    </div>
  );
}

// â”€â”€â”€ QA Checklist Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  const remove = (idx: number) => onChange(list.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-2 items-start bg-surface/50 border border-border rounded-lg p-2 relative group"
          >
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
      <AddItemButton onClick={add} label="Add QC Check" />
      {list.length === 0 && <EmptyState message="No checklist items set." />}
    </div>
  );
}

// â”€â”€â”€ Photos / Gallery Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PhotosEditor({ photos, onChange }: { photos: any[]; onChange: (photos: any[]) => void }) {
  const { add, updateByKey, remove } = useListEditor(photos, onChange, () => ({
    url: "",
    caption: "",
  }));

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {photos.map((ph, idx) => (
          <ItemCard key={idx} className="flex flex-col group pt-6">
            <ItemDeleteButton onClick={() => remove(idx)} />
            <div className="space-y-3 flex-grow">
              <ImagePicker
                label="Photo URL"
                value={ph.url || ""}
                onChange={(val) => updateByKey(idx, "url", val)}
                placeholder="https://..."
              />
              <div className="space-y-1">
                <MicroLabel>Caption</MicroLabel>
                <Input
                  value={ph.caption || ""}
                  onChange={(e) => updateByKey(idx, "caption", e.target.value)}
                  className="h-9 text-xs font-semibold"
                  placeholder="e.g. Subgrade compaction acceptance test"
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      <AddItemButton onClick={add} label="Add Work Photo" />
      {photos.length === 0 && <EmptyState message="No photos added." />}
    </div>
  );
}

// â”€â”€â”€ Route Steps Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RouteStepsEditor({ steps, onChange }: { steps: any[]; onChange: (steps: any[]) => void }) {
  const { add, updateByKey, remove } = useListEditor(steps, onChange, () => ({
    stage: "Stage 01",
    name: "Heerenveen Mill",
    desc: "Manufactured on spec and sealed.",
    duration: "D0 - D+3",
  }));

  return (
    <div className="space-y-3">
      {steps.map((st, idx) => (
        <ItemCard key={idx}>
          <ItemDeleteButton onClick={() => remove(idx)} />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <MicroLabel>Stage Tag</MicroLabel>
              <Input
                value={st.stage || ""}
                onChange={(e) => updateByKey(idx, "stage", e.target.value)}
                className="h-7 text-xs font-semibold uppercase text-primary"
                placeholder="e.g. Stage 01"
              />
            </div>
            <div className="col-span-2">
              <MicroLabel>Name/Checkpoint</MicroLabel>
              <Input
                value={st.name || ""}
                onChange={(e) => updateByKey(idx, "name", e.target.value)}
                className="h-7 text-xs font-bold"
                placeholder="e.g. Rotterdam Port or Durban Custom"
              />
            </div>
            <div className="col-span-2">
              <MicroLabel>Description details</MicroLabel>
              <Input
                value={st.desc || ""}
                onChange={(e) => updateByKey(idx, "desc", e.target.value)}
                className="h-7 text-xs"
                placeholder="e.g. Sealed and packed containers logged."
              />
            </div>
            <div>
              <MicroLabel>Duration</MicroLabel>
              <Input
                value={st.duration || ""}
                onChange={(e) => updateByKey(idx, "duration", e.target.value)}
                className="h-7 text-xs font-mono font-bold"
                placeholder="e.g. D+3 - D+24"
              />
            </div>
          </div>
        </ItemCard>
      ))}
      <AddItemButton onClick={add} label="Add Timeline Step" />
      {steps.length === 0 && <EmptyState message="No steps registered." />}
    </div>
  );
}

// â”€â”€â”€ Logistics Documents Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DocumentChecklistEditor({
  docs,
  onChange,
}: {
  docs: any[];
  onChange: (docs: any[]) => void;
}) {
  const { add, updateByKey, remove } = useListEditor(docs, onChange, () => ({
    title: "SADC Certificate",
    desc: "Preferential custom duties Form CO clearance.",
    status: "Issued",
  }));

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {docs.map((doc, idx) => (
          <ItemCard key={idx} className="flex flex-col justify-between group">
            <ItemDeleteButton onClick={() => remove(idx)} />
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <MicroLabel>Document Title</MicroLabel>
                  <Input
                    value={doc.title || ""}
                    onChange={(e) => updateByKey(idx, "title", e.target.value)}
                    className="h-7 text-xs font-bold font-display"
                    placeholder="e.g. SADC Certificate of Origin"
                  />
                </div>
                <div>
                  <MicroLabel>Status</MicroLabel>
                  <Input
                    value={doc.status || ""}
                    onChange={(e) => updateByKey(idx, "status", e.target.value)}
                    className="h-7 text-xs w-20 font-bold text-center text-primary uppercase"
                    placeholder="Issued"
                  />
                </div>
              </div>
              <div>
                <MicroLabel>Summary / Requirements</MicroLabel>
                <Textarea
                  value={doc.desc || ""}
                  onChange={(e) => updateByKey(idx, "desc", e.target.value)}
                  className="min-h-[50px] text-xs resize-none leading-normal"
                  placeholder="e.g. Issued per extrusion batch to secure customs pref rates."
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      <AddItemButton onClick={add} label="Add Document" />
      {docs.length === 0 && <EmptyState message="No documents listed." />}
    </div>
  );
}

// â”€â”€â”€ Forensic Protocol Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ForensicProtocolEditor({
  protocols,
  onChange,
}: {
  protocols: any[];
  onChange: (protocols: any[]) => void;
}) {
  const { add, updateByKey, remove } = useListEditor(protocols, onChange, () => ({
    step: "01",
    name: "Visual Review",
    desc: "Walkover photo mapping log.",
    output: "Defects list log",
  }));

  return (
    <div className="space-y-3">
      {protocols.map((pr, idx) => (
        <ItemCard key={idx}>
          <ItemDeleteButton onClick={() => remove(idx)} />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <MicroLabel>Step Index</MicroLabel>
              <Input
                maxLength={2}
                value={pr.step || ""}
                onChange={(e) => updateByKey(idx, "step", e.target.value)}
                className="h-7 text-xs font-mono font-bold text-center w-16 text-primary"
                placeholder="01"
              />
            </div>
            <div className="col-span-2">
              <MicroLabel>Protocol Stage Name</MicroLabel>
              <Input
                value={pr.name || ""}
                onChange={(e) => updateByKey(idx, "name", e.target.value)}
                className="h-7 text-xs font-bold"
                placeholder="e.g. Visual Embankment Audit"
              />
            </div>
            <div className="col-span-2">
              <MicroLabel>Detailed description</MicroLabel>
              <Input
                value={pr.desc || ""}
                onChange={(e) => updateByKey(idx, "desc", e.target.value)}
                className="h-7 text-xs leading-relaxed"
                placeholder="Detail visual walks, GPS maps check..."
              />
            </div>
            <div>
              <MicroLabel>Deliverable Output</MicroLabel>
              <Input
                value={pr.output || ""}
                onChange={(e) => updateByKey(idx, "output", e.target.value)}
                className="h-7 text-xs font-bold text-primary"
                placeholder="e.g. Visual defects logs"
              />
            </div>
          </div>
        </ItemCard>
      ))}
      <AddItemButton onClick={add} label="Add Protocol Stage" />
      {protocols.length === 0 && <EmptyState message="No protocols established." />}
    </div>
  );
}

// â”€â”€â”€ Forensic Findings Sub-editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FindingsRegisterEditor({
  findings,
  onChange,
}: {
  findings: any[];
  onChange: (findings: any[]) => void;
}) {
  const { add, updateByKey, remove } = useListEditor(findings, onChange, () => ({
    area: "Main Pad",
    title: "UV Degradation Check",
    desc: "Antioxidants Standard OIT exceeds limits.",
    status: "PASS",
  }));

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-4">
        {findings.map((fn, idx) => (
          <ItemCard key={idx} className="flex flex-col justify-between group">
            <ItemDeleteButton onClick={() => remove(idx)} />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <MicroLabel>Physical Area</MicroLabel>
                  <Input
                    value={fn.area || ""}
                    onChange={(e) => updateByKey(idx, "area", e.target.value)}
                    className="h-7 text-xs font-semibold"
                    placeholder="e.g. Embankment Sump"
                  />
                </div>
                <div>
                  <MicroLabel>Status Audit</MicroLabel>
                  <Select
                    value={fn.status || "PASS"}
                    onValueChange={(v) => updateByKey(idx, "status", v)}
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
                <MicroLabel>Audit Title</MicroLabel>
                <Input
                  value={fn.title || ""}
                  onChange={(e) => updateByKey(idx, "title", e.target.value)}
                  className="h-7 text-xs font-bold"
                  placeholder="e.g. UV Aging & Standard OIT"
                />
              </div>
              <div>
                <MicroLabel>Findings Details</MicroLabel>
                <Textarea
                  value={fn.desc || ""}
                  onChange={(e) => updateByKey(idx, "desc", e.target.value)}
                  className="min-h-[60px] text-xs leading-normal resize-none"
                  placeholder="Detail the audit checks results..."
                />
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      <AddItemButton onClick={add} label="Add Forensic Finding" />
      {findings.length === 0 && <EmptyState message="No forensic findings registered." />}
    </div>
  );
}
