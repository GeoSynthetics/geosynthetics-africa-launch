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
  Eye,
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";
import { cn, formatSlugInput } from "@/lib/utils";
import {
  SectionHeading,
  FieldLabel,
  TemplatesEditorSkeleton,
} from "./TemplateEditorShared";
import { ImagePicker } from "./ImagePicker";
import { ProductSelector, type ProductData } from "./ProductSelector";
import {
  type CountryTemplate,
  DEFAULT_COUNTRY_TEMPLATES,
} from "@/types/country-template";

const SUPABASE_KEY = "template_countries";

export function CountriesTemplatesEditor() {
  const [allData, setAllData] = useState<Record<string, CountryTemplate>>({});
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newSlug, setNewSlug] = useState("");
  const [newCountryName, setNewCountryName] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [slugToDelete, setSlugToDelete] = useState<string | null>(null);

  // ── Load Templates from Supabase ──
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", SUPABASE_KEY)
        .maybeSingle();

      if (error) throw error;

      let merged: Record<string, CountryTemplate> = { ...DEFAULT_COUNTRY_TEMPLATES };
      if (data?.value && typeof data.value === "object") {
        merged = { ...DEFAULT_COUNTRY_TEMPLATES, ...(data.value as Record<string, CountryTemplate>) };
      }

      setAllData(merged);
      const keys = Object.keys(merged);
      if (keys.length > 0 && (!activeSlug || !merged[activeSlug])) {
        setActiveSlug(keys[0]);
      }
    } catch (err: any) {
      console.error("Error loading country templates:", err);
      toast.error("Failed to load country templates. Using defaults.");
      setAllData(DEFAULT_COUNTRY_TEMPLATES);
      setActiveSlug(Object.keys(DEFAULT_COUNTRY_TEMPLATES)[0]);
    } finally {
      setLoading(false);
      setDirty(false);
    }
  }, [activeSlug]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // ── Active Country Object ──
  const currentItem = useMemo(() => {
    if (!activeSlug || !allData[activeSlug]) return null;
    return allData[activeSlug];
  }, [activeSlug, allData]);

  const updateCurrentField = (field: keyof CountryTemplate, value: any) => {
    if (!activeSlug) return;
    setAllData((prev) => ({
      ...prev,
      [activeSlug]: {
        ...prev[activeSlug],
        [field]: value,
      },
    }));
    setDirty(true);
  };

  const updateSeoField = (field: string, value: string) => {
    if (!activeSlug || !currentItem) return;
    updateCurrentField("seo", {
      ...currentItem.seo,
      [field]: value,
    });
  };

  // ── Save Templates to Supabase ──
  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ key: SUPABASE_KEY, value: allData as any }, { onConflict: "key" });

      if (error) throw error;

      toast.success("Country templates saved successfully!");
      setDirty(false);
    } catch (err: any) {
      console.error("Error saving country templates:", err);
      toast.error(err.message || "Failed to save country templates.");
    } finally {
      setSaving(false);
    }
  };

  // ── Add New Country Template ──
  const handleCreateNew = () => {
    if (!newSlug || !newCountryName) {
      toast.error("Please enter both country name and slug.");
      return;
    }
    const formattedSlug = formatSlugInput(newSlug);
    if (allData[formattedSlug]) {
      toast.error("A template with this slug already exists.");
      return;
    }

    const newTemplate: CountryTemplate = {
      country: newCountryName,
      slug: formattedSlug,
      flag: "🌍",
      code: formattedSlug.substring(0, 3).toUpperCase(),
      title: `${newCountryName} Geosynthetics Supplier — Material Supply & Contracting`,
      description: `High-quality HDPE geomembranes, geotextiles, and engineering services in ${newCountryName}.`,
      badge: `Pan-African Regional Hub — ${newCountryName}`,
      heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
      supplyTitle: `Material Supply & Freight Logistics to ${newCountryName}`,
      supplyDescription: `Direct containerized and road freight logistics serving mining and infrastructure in ${newCountryName}.`,
      supplyHighlights: [
        { title: "Direct Logistics", description: "Containerized shipping and road freight delivery." },
      ],
      installationTitle: "Certified Installation & Field Welding Services",
      installationDescription: "IAGI-certified field crews operating dual-track wedge welders.",
      installationHighlights: [
        { title: "Master Seamers", description: "Trained field welding technicians." },
      ],
      qaqcTitle: "Quality Assurance & Compliance Testing",
      qaqcDescription: "Non-destructive vacuum box/air testing and destructive tensiometer verification.",
      qaqcHighlights: [
        { title: "Seam Testing", description: "Comprehensive QA documentation provided upon sign-off." },
      ],
      seo: {
        title: `${newCountryName} Geosynthetics Supplier | Geosynthetics Africa`,
        description: `Geosynthetics Africa supply and installation operations in ${newCountryName}.`,
        keywords: `${newCountryName} geosynthetics, geomembrane ${newCountryName}`,
      },
    };

    setAllData((prev) => ({ ...prev, [formattedSlug]: newTemplate }));
    setActiveSlug(formattedSlug);
    setNewSlug("");
    setNewCountryName("");
    setShowNewDialog(false);
    setDirty(true);
    toast.success(`Created template for ${newCountryName}`);
  };

  // ── Delete Country Template ──
  const handleDelete = (slug: string) => {
    const updated = { ...allData };
    delete updated[slug];
    setAllData(updated);
    const keys = Object.keys(updated);
    setActiveSlug(keys.length > 0 ? keys[0] : "");
    setDirty(true);
    toast.success("Country template deleted.");
  };

  // ── Search & Filter ──
  const countryKeys = useMemo(() => Object.keys(allData), [allData]);
  const filteredKeys = useMemo(() => {
    if (!searchQuery.trim()) return countryKeys;
    const q = searchQuery.toLowerCase();
    return countryKeys.filter((k) => {
      const item = allData[k];
      return (
        k.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q)
      );
    });
  }, [countryKeys, searchQuery, allData]);

  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage) || 1;
  const paginatedKeys = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredKeys.slice(start, start + itemsPerPage);
  }, [filteredKeys, currentPage]);

  if (loading) return <TemplatesEditorSkeleton />;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Pan-African Country & Regional Templates
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage regional content, supply logistics, installation standards, QA/QC, and featured products per country.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 animate-pulse">
              Unsaved Changes
            </span>
          )}
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5 font-bold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Country Templates
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Selector & Right Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Country Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 text-xs"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNewDialog(true)}
              className="shrink-0 gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Country
            </Button>
          </div>

          {/* Country List Cards */}
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {paginatedKeys.map((slug) => {
              const item = allData[slug];
              const isActive = slug === activeSlug;
              return (
                <div
                  key={slug}
                  onClick={() => setActiveSlug(slug)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border text-left cursor-pointer transition-all",
                    isActive
                      ? "bg-primary/10 border-primary shadow-xs"
                      : "bg-card hover:border-primary/50 border-border"
                  )}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag || "🌍"}</span>
                      <h4 className="text-sm font-semibold truncate text-foreground">
                        {item.country}
                      </h4>
                      <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        {item.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-mono">
                      /{slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlugToDelete(slug);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <ChevronRight
                      className={cn("h-4 w-4 text-muted-foreground transition", isActive && "text-primary")}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t text-xs">
              <span className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Template Editor Form */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-5 space-y-6">
          {!currentItem ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <Globe className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-sm">No country template selected</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Select a country from the left sidebar to edit its template parameters.
              </p>
            </div>
          ) : (
            <>
              {/* Header Title & Preview Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentItem.flag}</span>
                    <h3 className="text-xl font-bold text-foreground">{currentItem.country}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">
                      {currentItem.code}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Slug: /{currentItem.slug}
                  </p>
                </div>
                <a
                  href={`/${currentItem.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-md self-start"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Live Page
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Form Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 gap-1">
                  <TabsTrigger value="hero" className="text-xs py-1.5">
                    Hero & General
                  </TabsTrigger>
                  <TabsTrigger value="supply" className="text-xs py-1.5">
                    Supply & Freight
                  </TabsTrigger>
                  <TabsTrigger value="installation" className="text-xs py-1.5">
                    Installation
                  </TabsTrigger>
                  <TabsTrigger value="qaqc" className="text-xs py-1.5">
                    QA/QC
                  </TabsTrigger>
                  <TabsTrigger value="hub" className="text-xs py-1.5">
                    Hub & Contact
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs py-1.5">
                    SEO & FAQs
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: HERO & GENERAL */}
                <TabsContent value="hero" className="space-y-4 pt-4">
                  <SectionHeading>Hero Banner Configuration</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Country Display Name</FieldLabel>
                      <Input
                        value={currentItem.country || ""}
                        onChange={(e) => updateCurrentField("country", e.target.value)}
                      />
                    </div>
                    <div>
                      <FieldLabel>Flag Emoji & Code</FieldLabel>
                      <div className="flex gap-2">
                        <Input
                          className="w-20"
                          value={currentItem.flag || ""}
                          onChange={(e) => updateCurrentField("flag", e.target.value)}
                          placeholder="🇿🇦"
                        />
                        <Input
                          className="flex-1"
                          value={currentItem.code || ""}
                          onChange={(e) => updateCurrentField("code", e.target.value)}
                          placeholder="RSA"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Badge Label</FieldLabel>
                    <Input
                      value={currentItem.badge || ""}
                      onChange={(e) => updateCurrentField("badge", e.target.value)}
                      placeholder="e.g. Pan-African Supply Hub — South Africa"
                    />
                  </div>

                  <div>
                    <FieldLabel>Hero Title</FieldLabel>
                    <Input
                      value={currentItem.title || ""}
                      onChange={(e) => updateCurrentField("title", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Hero Subtitle / Description</FieldLabel>
                    <Textarea
                      rows={3}
                      value={currentItem.description || ""}
                      onChange={(e) => updateCurrentField("description", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Hero Background Image</FieldLabel>
                    <ImagePicker
                      value={currentItem.heroImage || ""}
                      onChange={(url) => updateCurrentField("heroImage", url)}
                      placeholder="Image URL..."
                    />
                  </div>
                </TabsContent>

                {/* TAB 2: SUPPLY & FREIGHT */}
                <TabsContent value="supply" className="space-y-4 pt-4">
                  <SectionHeading>Material Supply & Cross-Border Freight</SectionHeading>
                  <div>
                    <FieldLabel>Supply Section Title</FieldLabel>
                    <Input
                      value={currentItem.supplyTitle || ""}
                      onChange={(e) => updateCurrentField("supplyTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Supply Section Overview</FieldLabel>
                    <Textarea
                      rows={3}
                      value={currentItem.supplyDescription || ""}
                      onChange={(e) => updateCurrentField("supplyDescription", e.target.value)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Estimated Freight Transit Time</FieldLabel>
                      <Input
                        value={currentItem.transitTime || ""}
                        onChange={(e) => updateCurrentField("transitTime", e.target.value)}
                        placeholder="e.g. 2-3 Days Road Freight"
                      />
                    </div>
                    <div>
                      <FieldLabel>Logistics Routes & Corridors</FieldLabel>
                      <Input
                        value={currentItem.logisticsRoutes || ""}
                        onChange={(e) => updateCurrentField("logisticsRoutes", e.target.value)}
                        placeholder="e.g. JHB → Pioneer Gate → Gaborone"
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Customs Clearance & Tariff Compliance</FieldLabel>
                    <Input
                      value={currentItem.customsInfo || ""}
                      onChange={(e) => updateCurrentField("customsInfo", e.target.value)}
                      placeholder="e.g. SAD500 clearance, SADC Certificate of Origin"
                    />
                  </div>
                </TabsContent>

                {/* TAB 3: FIELD INSTALLATION */}
                <TabsContent value="installation" className="space-y-4 pt-4">
                  <SectionHeading>Field Installation & Welding Services</SectionHeading>
                  <div>
                    <FieldLabel>Installation Section Title</FieldLabel>
                    <Input
                      value={currentItem.installationTitle || ""}
                      onChange={(e) => updateCurrentField("installationTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Installation Overview</FieldLabel>
                    <Textarea
                      rows={3}
                      value={currentItem.installationDescription || ""}
                      onChange={(e) => updateCurrentField("installationDescription", e.target.value)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Certified Master Seamers Count / Crew Capacity</FieldLabel>
                      <Input
                        value={currentItem.masterSeamersCount || ""}
                        onChange={(e) => updateCurrentField("masterSeamersCount", e.target.value)}
                        placeholder="e.g. 12 Certified Field Crews"
                      />
                    </div>
                    <div>
                      <FieldLabel>Equipment Mobilization Lead Time</FieldLabel>
                      <Input
                        value={currentItem.equipmentMobilization || ""}
                        onChange={(e) => updateCurrentField("equipmentMobilization", e.target.value)}
                        placeholder="e.g. 24-48 Hours Nationwide"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 4: QA/QC TESTING */}
                <TabsContent value="qaqc" className="space-y-4 pt-4">
                  <SectionHeading>QA/QC Testing & Standards</SectionHeading>
                  <div>
                    <FieldLabel>QA/QC Section Title</FieldLabel>
                    <Input
                      value={currentItem.qaqcTitle || ""}
                      onChange={(e) => updateCurrentField("qaqcTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>QA/QC Protocol Description</FieldLabel>
                    <Textarea
                      rows={3}
                      value={currentItem.qaqcDescription || ""}
                      onChange={(e) => updateCurrentField("qaqcDescription", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Compliance & Testing Standards (comma-separated)</FieldLabel>
                    <Input
                      value={(currentItem.complianceStandards || []).join(", ")}
                      onChange={(e) =>
                        updateCurrentField(
                          "complianceStandards",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="SANS 1526, GRI-GM13, ASTM D6392"
                    />
                  </div>
                  <div>
                    <FieldLabel>Featured Products Selector</FieldLabel>
                    <ProductSelector
                      onSelect={(prod: ProductData) => {
                        const current = currentItem.featuredProductIds || [];
                        if (!current.includes(prod.id)) {
                          updateCurrentField("featuredProductIds", [...current, prod.id]);
                        }
                      }}
                      excludeIds={currentItem.featuredProductIds || []}
                    />
                  </div>
                </TabsContent>

                {/* TAB 5: REGIONAL HUB & CONTACT */}
                <TabsContent value="hub" className="space-y-4 pt-4">
                  <SectionHeading>Regional Office & Logistics Hub</SectionHeading>
                  <div>
                    <FieldLabel>Hub / Office Title</FieldLabel>
                    <Input
                      value={currentItem.officeTitle || ""}
                      onChange={(e) => updateCurrentField("officeTitle", e.target.value)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Hub Short Name</FieldLabel>
                      <Input
                        value={currentItem.hubName || ""}
                        onChange={(e) => updateCurrentField("hubName", e.target.value)}
                        placeholder="e.g. Johannesburg HQ"
                      />
                    </div>
                    <div>
                      <FieldLabel>Contact Phone</FieldLabel>
                      <Input
                        value={currentItem.phone || ""}
                        onChange={(e) => updateCurrentField("phone", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Physical Address</FieldLabel>
                    <Input
                      value={currentItem.address || ""}
                      onChange={(e) => updateCurrentField("address", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Email</FieldLabel>
                    <Input
                      value={currentItem.email || ""}
                      onChange={(e) => updateCurrentField("email", e.target.value)}
                    />
                  </div>
                </TabsContent>

                {/* TAB 6: SEO & FAQS */}
                <TabsContent value="seo" className="space-y-4 pt-4">
                  <SectionHeading>SEO Meta Tags</SectionHeading>
                  <div>
                    <FieldLabel>Meta Page Title</FieldLabel>
                    <Input
                      value={currentItem.seo?.title || ""}
                      onChange={(e) => updateSeoField("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Meta Description</FieldLabel>
                    <Textarea
                      rows={2}
                      value={currentItem.seo?.description || ""}
                      onChange={(e) => updateSeoField("description", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Meta Keywords</FieldLabel>
                    <Input
                      value={currentItem.seo?.keywords || ""}
                      onChange={(e) => updateSeoField("keywords", e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        idPrefix="country-del"
        isOpen={!!slugToDelete}
        onOpenChange={(open) => {
          if (!open) setSlugToDelete(null);
        }}
        onConfirm={() => {
          if (slugToDelete) handleDelete(slugToDelete);
          setSlugToDelete(null);
        }}
        title="Delete Country Template"
        description="Are you sure you want to delete this country template? This action will remove custom template overrides for this country."
      />

      {/* Add New Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">Add New Country Template</h3>
            <div>
              <FieldLabel>Country Name</FieldLabel>
              <Input
                value={newCountryName}
                onChange={(e) => setNewCountryName(e.target.value)}
                placeholder="e.g. Angola"
              />
            </div>
            <div>
              <FieldLabel>URL Slug</FieldLabel>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="e.g. angola-geosynthetics-supplier-contact"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateNew} className="font-bold">
                Create Country Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
