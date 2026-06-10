import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Copy,
  X,
  Star,
  Loader2,
  ArrowUp,
  ArrowDown,
  Layers,
  ArrowLeftRight,
  Puzzle,
  FileText,
  ShieldCheck,
  Sun,
  Wrench,
  Sparkles,
  Droplets,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/lib/image-utils";
import { slugify } from "@/lib/utils";
import { SeoAnalyzer } from "@/components/admin/SeoAnalyzer";
import { ProductSelector } from "@/components/admin/ProductSelector";
import { useSlugSync } from "@/hooks/use-slug-sync";

interface Manufacturer {
  id: string;
  name: string;
}
interface ProductCategory {
  id: string;
  name: string;
}

interface KeyFeature {
  label: string;
  icon?: string;
}

interface SpecRow {
  property: string;
  test_method?: string;
  unit?: string;
  typical_value?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  long_description: string | null;
  manufacturer_id: string | null;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  weight_kg: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  image_url: string | null;
  images: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  seo_keywords: string | null;
  family_slug: string | null;
  alternative_ids: string[] | null;
  system_component_ids: string[] | null;
  material: string | null;
  structure: string | null;
  colour: string | null;
  standard: string | null;
  roll_width: string | null;
  roll_length: string | null;
  datasheet_url: string | null;
  installation_guide_url: string | null;
  qa_checklist_url: string | null;
  chemical_resistance_url: string | null;
  key_features: KeyFeature[] | null;
  specifications: SpecRow[] | null;
}

const empty: Partial<Product> = {
  name: "",
  slug: "",
  sku: "",
  short_description: "",
  long_description: "",
  manufacturer_id: null,
  category_id: null,
  is_active: true,
  price: null,
  sale_price: null,
  stock_quantity: null,
  weight_kg: null,
  length_cm: null,
  width_cm: null,
  height_cm: null,
  image_url: "",
  images: [],
  meta_title: "",
  meta_description: "",
  seo_keywords: "",
  family_slug: null,
  alternative_ids: [],
  system_component_ids: [],
  material: "",
  structure: "",
  colour: "",
  standard: "",
  roll_width: "",
  roll_length: "",
  datasheet_url: "",
  installation_guide_url: "",
  qa_checklist_url: "",
  chemical_resistance_url: "",
  key_features: [],
  specifications: [],
};

const FEATURE_ICONS_LIST = [
  { value: "filter", label: "Filtration (Droplets)" },
  { value: "durable", label: "Durability (Shield)" },
  { value: "uv", label: "UV Resistant (Sun)" },
  { value: "install", label: "Installation (Wrench)" },
  { value: "cost", label: "Cost-Effective (Sparkles)" },
  { value: "check", label: "Verified (Check Circle)" },
];


export function ProductsAdminPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [mans, setMans] = useState<Manufacturer[]>([]);
  const [cats, setCats] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [showMissingSeo, setShowMissingSeo] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [total, setTotal] = useState(0);

  const [families, setFamilies] = useState<{ slug: string; label: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { handleSlugChange, handleSlugBlur } = useSlugSync({
    title: editing.name || "",
    slug: editing.slug || "",
    onSlugChange: (newSlug) => setEditing((s) => ({ ...s, slug: newSlug })),
    entityId: editing.id,
  });

  const [allProductsLookup, setAllProductsLookup] = useState<
    Record<string, { name: string; image_url?: string | null }>
  >({});

  useEffect(() => {
    if (!open) return;
    async function fetchLookup() {
      const { data } = await supabase
        .from("products")
        .select("id, name, image_url");
      if (data) {
        const lookup: Record<string, { name: string; image_url?: string | null }> = {};
        data.forEach((p) => {
          lookup[p.id] = { name: p.name, image_url: p.image_url };
        });
        setAllProductsLookup(lookup);
      }
    }
    void fetchLookup();
  }, [open]);

  // Alternative relations
  const addAlternative = (id: string) => {
    const current = editing.alternative_ids ?? [];
    if (current.length >= 5) {
      toast.error("You can select a maximum of 5 alternative products");
      return;
    }
    if (current.includes(id)) {
      return;
    }
    setEditing((s) => ({
      ...s,
      alternative_ids: [...current, id],
    }));
  };

  const removeAlternative = (id: string) => {
    setEditing((s) => ({
      ...s,
      alternative_ids: (s.alternative_ids ?? []).filter((x) => x !== id),
    }));
  };

  // System Components / Accessories relations
  const addSystemComponent = (id: string) => {
    const current = editing.system_component_ids ?? [];
    if (current.includes(id)) {
      return;
    }
    setEditing((s) => ({
      ...s,
      system_component_ids: [...current, id],
    }));
  };

  const removeSystemComponent = (id: string) => {
    setEditing((s) => ({
      ...s,
      system_component_ids: (s.system_component_ids ?? []).filter((x) => x !== id),
    }));
  };

  // Key Features (Highlights)
  const addKeyFeature = () => {
    const current = editing.key_features ?? [];
    if (current.length >= 5) {
      toast.error("Maximum 5 key features allowed");
      return;
    }
    setEditing((s) => ({
      ...s,
      key_features: [...current, { label: "", icon: "check" }],
    }));
  };

  const updateKeyFeature = (index: number, field: keyof KeyFeature, value: string) => {
    setEditing((s) => {
      const next = [...(s.key_features ?? [])];
      next[index] = { ...next[index], [field]: value };
      return { ...s, key_features: next };
    });
  };

  const removeKeyFeature = (index: number) => {
    setEditing((s) => ({
      ...s,
      key_features: (s.key_features ?? []).filter((_, i) => i !== index),
    }));
  };

  // Specifications typical table
  const addSpecRow = () => {
    const current = editing.specifications ?? [];
    setEditing((s) => ({
      ...s,
      specifications: [...current, { property: "", test_method: "", unit: "", typical_value: "" }],
    }));
  };

  const updateSpecRow = (index: number, field: keyof SpecRow, value: string) => {
    setEditing((s) => {
      const next = [...(s.specifications ?? [])];
      next[index] = { ...next[index], [field]: value };
      return { ...s, specifications: next };
    });
  };

  const removeSpecRow = (index: number) => {
    setEditing((s) => ({
      ...s,
      specifications: (s.specifications ?? []).filter((_, i) => i !== index),
    }));
  };



  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`${file.name} is over 25MB`);
        continue;
      }
      const { blob, ext, contentType } = await compressImage(file);
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType,
      });

      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const proxyUrl = `${origin}/api/storage/product-images/${path}`;
      uploaded.push(proxyUrl);
    }
    if (uploaded.length) {
      setEditing((s) => {
        const existing = s.images ?? [];
        const next = [...existing, ...uploaded];
        return { ...s, images: next, image_url: s.image_url || next[0] };
      });
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    setEditing((s) => {
      const next = (s.images ?? []).filter((u) => u !== url);
      return { ...s, images: next, image_url: s.image_url === url ? (next[0] ?? "") : s.image_url };
    });
  };

  const setPrimaryImage = (url: string) => {
    setEditing((s) => ({ ...s, image_url: url }));
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const load = async () => {
    setLoading(true);
    let query = supabase.from("products").select(
      "id, name, slug, sku, short_description, long_description, manufacturer_id, category_id, is_active, created_at, price, sale_price, stock_quantity, weight_kg, length_cm, width_cm, height_cm, image_url, images, meta_title, meta_description, seo_keywords, family_slug, alternative_ids, system_component_ids, material, structure, colour, standard, roll_width, roll_length, datasheet_url, installation_guide_url, qa_checklist_url, chemical_resistance_url, key_features, specifications",
      { count: "exact" },
    );

    if (q.trim()) {
      const qs = q.trim();
      query = query.or(`name.ilike.%${qs}%,slug.ilike.%${qs}%,sku.ilike.%${qs}%`);
    }

    if (showMissingSeo) {
      query = query.or(
        `meta_title.is.null,meta_title.eq."",meta_description.is.null,meta_description.eq."",seo_keywords.is.null,seo_keywords.eq.""`,
      );
    }

    query = query.order(sortField, { ascending: sortAsc });
    if (sortField !== "id") {
      query = query.order("id", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const [products, manufacturers, categories] = await Promise.all([
      query,
      mans.length === 0
        ? supabase.from("manufacturers").select("id, name").order("name")
        : Promise.resolve({ data: mans }),
      cats.length === 0
        ? supabase.from("product_categories").select("id, name").order("name")
        : Promise.resolve({ data: cats }),
    ]);

    if (products.error) toast.error(products.error.message);
    setRows((products.data ?? []) as Product[]);
    setTotal(products.count ?? 0);

    if (mans.length === 0 && manufacturers.data) setMans(manufacturers.data as Manufacturer[]);
    if (cats.length === 0 && categories.data) setCats(categories.data as ProductCategory[]);

    // Fetch product families templates
    const { data: templateData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "template_product_categories")
      .maybeSingle();
    if (templateData?.value) {
      const templates = templateData.value as Record<string, any>;
      const fams = Object.keys(templates).map((slug) => ({
        slug,
        label: templates[slug].label || slug,
      }));
      setFamilies(fams);
    }

    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
  }, [q, showMissingSeo, sortField, sortAsc, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, pageSize, sortField, sortAsc, q, showMissingSeo]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const SortableHead = ({
    field,
    children,
    className = "",
  }: {
    field: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <TableHead
      className={`cursor-pointer select-none hover:bg-muted/50 transition-colors ${className}`}
      onClick={() => toggleSort(field)}
    >
      <div className={`flex items-center gap-1 ${className.includes("text-right") ? "justify-end" : ""}`}>
        {children}
        {sortField === field ? (
          sortAsc ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <div className="w-3" />
        )}
      </div>
    </TableHead>
  );

  const openNew = () => {
    setEditing(empty);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    // Fill out initial default objects if arrays are null or not present
    setEditing({
      ...empty,
      ...p,
      alternative_ids: p.alternative_ids ?? [],
      system_component_ids: p.system_component_ids ?? [],
      key_features: p.key_features ?? [],
      specifications: p.specifications ?? [],
    });
    setOpen(true);
  };

  const save = async () => {
    if (!editing.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    const toNum = (v: unknown) => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : parseFloat(String(v));
      return isNaN(n) ? null : n;
    };

    const payload = {
      name: editing.name.trim(),
      slug: (editing.slug?.trim() || slugify(editing.name)).slice(0, 160),
      sku: editing.sku?.trim() || null,
      short_description: editing.short_description?.trim() || null,
      long_description: editing.long_description?.trim() || null,
      manufacturer_id: editing.manufacturer_id || null,
      category_id: editing.category_id || null,
      is_active: editing.is_active ?? true,
      price: toNum(editing.price),
      sale_price: toNum(editing.sale_price),
      stock_quantity: toNum(editing.stock_quantity),
      weight_kg: toNum(editing.weight_kg),
      length_cm: toNum(editing.length_cm),
      width_cm: toNum(editing.width_cm),
      height_cm: toNum(editing.height_cm),
      image_url: editing.image_url?.trim() || (editing.images?.[0] ?? null),
      images: editing.images ?? [],
      meta_title: editing.meta_title?.trim() || null,
      meta_description: editing.meta_description?.trim() || null,
      seo_keywords: editing.seo_keywords?.trim() || null,
      family_slug: editing.family_slug || null,
      alternative_ids: editing.alternative_ids ?? [],
      system_component_ids: editing.system_component_ids ?? [],
      material: editing.material?.trim() || null,
      structure: editing.structure?.trim() || null,
      colour: editing.colour?.trim() || null,
      standard: editing.standard?.trim() || null,
      roll_width: editing.roll_width?.trim() || null,
      roll_length: editing.roll_length?.trim() || null,
      datasheet_url: editing.datasheet_url?.trim() || null,
      installation_guide_url: editing.installation_guide_url?.trim() || null,
      qa_checklist_url: editing.qa_checklist_url?.trim() || null,
      chemical_resistance_url: editing.chemical_resistance_url?.trim() || null,
      key_features: editing.key_features ?? [],
      specifications: editing.specifications ?? [],
    };

    setSaving(true);
    const res = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);

    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success(editing.id ? "Product updated successfully" : "Product created successfully");
    setOpen(false);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const toggleActive = async (p: Product) => {
    const next = !p.is_active;
    setRows((r) => r.map((x) => (x.id === p.id ? { ...x, is_active: next } : x)));
    const { error } = await supabase.from("products").update({ is_active: next }).eq("id", p.id);
    if (error) {
      toast.error(error.message);
      void load();
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, slug, SKU"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="filter-missing-seo"
            checked={showMissingSeo}
            onCheckedChange={setShowMissingSeo}
          />
          <Label htmlFor="filter-missing-seo" className="text-sm cursor-pointer whitespace-nowrap">
            Missing SEO
          </Label>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total: {total}</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide text-xs">
                <Plus className="h-4 w-4 mr-1.5" /> New product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-card border border-border shadow-xl rounded-xl">
              <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
                <DialogTitle className="font-display font-bold uppercase tracking-tight text-lg">
                  {editing.id ? "✏️ Edit Product Details" : "✨ Create New Product"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                <Tabs defaultValue="general" className="w-full space-y-4">
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-1 bg-muted p-1 rounded-lg shrink-0">
                    <TabsTrigger value="general" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">General</TabsTrigger>
                    <TabsTrigger value="pricing" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">Pricing & Gallery</TabsTrigger>
                    <TabsTrigger value="glance" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">At a Glance</TabsTrigger>
                    <TabsTrigger value="highlights" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">Highlights</TabsTrigger>
                    <TabsTrigger value="specs" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">Specs Table</TabsTrigger>
                    <TabsTrigger value="relations" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">Relations</TabsTrigger>
                    <TabsTrigger value="seo" className="text-[10px] uppercase font-bold tracking-wider py-1.5 px-1.5">Docs & SEO</TabsTrigger>
                  </TabsList>

                  {/* 1. GENERAL TAB */}
                  <TabsContent value="general" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="p-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</Label>
                        <Input
                          id="p-name"
                          value={editing.name ?? ""}
                          onChange={(e) =>
                            setEditing((s) => ({
                              ...s,
                              name: e.target.value,
                            }))
                          }
                          className="mt-1.5 w-full font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="p-slug" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL Slug</Label>
                          <Input
                            id="p-slug"
                            value={editing.slug ?? ""}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            onBlur={handleSlugBlur}
                            className="mt-1.5 w-full text-xs font-mono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="p-sku" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product SKU</Label>
                          <Input
                            id="p-sku"
                            value={editing.sku ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, sku: e.target.value }))}
                            className="mt-1.5 w-full"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Manufacturer</Label>
                          <Select
                            value={editing.manufacturer_id ?? "none"}
                            onValueChange={(v) =>
                              setEditing((s) => ({ ...s, manufacturer_id: v === "none" ? null : v }))
                            }
                          >
                            <SelectTrigger className="mt-1.5 w-full">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">— None —</SelectItem>
                              {mans.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Category</Label>
                          <Select
                            value={editing.category_id ?? "none"}
                            onValueChange={(v) =>
                              setEditing((s) => ({ ...s, category_id: v === "none" ? null : v }))
                            }
                          >
                            <SelectTrigger className="mt-1.5 w-full">
                              <SelectValue placeholder="Select…" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">— None —</SelectItem>
                              {cats.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Family (Template Link)</Label>
                          <Select
                            value={editing.family_slug ?? "none"}
                            onValueChange={(v) =>
                              setEditing((s) => ({ ...s, family_slug: v === "none" ? null : v }))
                            }
                          >
                            <SelectTrigger className="mt-1.5 w-full bg-primary/5 border-primary/20 text-primary font-semibold">
                              <SelectValue placeholder="Select Family…" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">— None —</SelectItem>
                              {families.map((f) => (
                                <SelectItem key={f.slug} value={f.slug}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] text-muted-foreground/80 mt-1 leading-tight">
                            Linking a family automatically populates default applications, QA/QC checklists, and method statements.
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="p-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</Label>
                        <Textarea
                          id="p-desc"
                          rows={2}
                          value={editing.short_description ?? ""}
                          onChange={(e) => setEditing((s) => ({ ...s, short_description: e.target.value }))}
                          placeholder="Quick summarizing statement displayed on catalogue grids and header."
                          className="mt-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="p-long-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Long Description</Label>
                        <Textarea
                          id="p-long-desc"
                          rows={4}
                          value={editing.long_description ?? ""}
                          onChange={(e) => setEditing((s) => ({ ...s, long_description: e.target.value }))}
                          placeholder="Full detailed specifications and descriptive text shown in the Overview tab. Separate paragraphs with double enter (empty lines)."
                          className="mt-1.5 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <Switch
                          id="p-active"
                          checked={editing.is_active ?? true}
                          onCheckedChange={(v) => setEditing((s) => ({ ...s, is_active: v }))}
                        />
                        <Label htmlFor="p-active" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active & Visible in Catalogue</Label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 2. PRICING & GALLERY TAB */}
                  <TabsContent value="pricing" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-2 mb-3">Pricing & Logistics</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="p-price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Base Price (ZAR)</Label>
                            <Input
                              id="p-price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={editing.price ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  price: e.target.value === "" ? null : parseFloat(e.target.value),
                                }))
                              }
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-sale" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sale Price (ZAR)</Label>
                            <Input
                              id="p-sale"
                              type="number"
                              step="0.01"
                              min="0"
                              value={editing.sale_price ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  sale_price: e.target.value === "" ? null : parseFloat(e.target.value),
                                }))
                              }
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-stock" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stock Quantity</Label>
                            <Input
                              id="p-stock"
                              type="number"
                              step="1"
                              min="0"
                              value={editing.stock_quantity ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  stock_quantity: e.target.value === "" ? null : parseInt(e.target.value),
                                }))
                              }
                              className="mt-1.5"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div>
                            <Label htmlFor="p-weight" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weight (kg)</Label>
                            <Input
                              id="p-weight"
                              type="number"
                              step="0.01"
                              value={editing.weight_kg ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  weight_kg: e.target.value === "" ? null : parseFloat(e.target.value),
                                }))
                              }
                              className="mt-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-len" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Length (cm)</Label>
                            <Input
                              id="p-len"
                              type="number"
                              value={editing.length_cm ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  length_cm: e.target.value === "" ? null : parseFloat(e.target.value),
                                }))
                              }
                              className="mt-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-wid" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Width (cm)</Label>
                            <Input
                              id="p-wid"
                              type="number"
                              value={editing.width_cm ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  width_cm: e.target.value === "" ? null : parseFloat(e.target.value),
                                }))
                              }
                              className="mt-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-hei" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Height (cm)</Label>
                            <Input
                              id="p-hei"
                              type="number"
                              value={editing.height_cm ?? ""}
                              onChange={(e) =>
                                setEditing((s) => ({
                                  ...s,
                                  height_cm: e.target.value === "" ? null : parseFloat(e.target.value),
                                }))
                              }
                              className="mt-1.5 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border/60 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Media Gallery</h4>
                            <p className="text-[10px] text-muted-foreground">Upload multiple high-res product pictures. Max size 25MB each.</p>
                          </div>
                          <label className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer rounded-lg border border-border px-3 py-2 bg-surface hover:bg-muted text-foreground transition-all duration-200 shadow-sm">
                            {uploading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5 text-primary" />
                            )}
                            {uploading ? "Uploading…" : "Add Images"}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              disabled={uploading}
                              onChange={(e) => {
                                void handleUpload(e.target.files);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>
                        </div>

                        {(editing.images?.length ?? 0) > 0 && (
                          <div className="grid grid-cols-5 gap-3 mb-4">
                            {editing.images!.map((url) => {
                              const isPrimary = editing.image_url === url;
                              return (
                                <div
                                  key={url}
                                  className={`relative group rounded-xl border-2 overflow-hidden shadow-sm transition-all duration-200 ${
                                    isPrimary ? "border-primary scale-[1.02]" : "border-border/60"
                                  }`}
                                >
                                  <img src={url} alt="" className="h-24 w-full object-cover" />
                                  {isPrimary && (
                                    <span className="absolute top-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-sm">
                                      Primary
                                    </span>
                                  )}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    {!isPrimary && (
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="h-6 w-6 rounded-md"
                                        onClick={() => setPrimaryImage(url)}
                                        title="Set as primary"
                                      >
                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                      </Button>
                                    )}
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="secondary"
                                      className="h-6 w-6 rounded-md"
                                      onClick={() => void copyUrl(url)}
                                      title="Copy URL"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="destructive"
                                      className="h-6 w-6 rounded-md"
                                      onClick={() => removeImage(url)}
                                      title="Remove"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <Label htmlFor="p-img" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Or paste external image URL</Label>
                        <div className="flex gap-2 mt-1.5">
                          <Input
                            id="p-img"
                            type="url"
                            placeholder="https://…"
                            value={editing.image_url ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, image_url: e.target.value }))}
                            className="text-xs"
                          />
                          {editing.image_url && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-lg"
                              onClick={() => void copyUrl(editing.image_url!)}
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 3. AT A GLANCE TAB */}
                  <TabsContent value="glance" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-2 mb-3">
                          At a Glance Attributes (Sidebar Specification Box)
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-4">
                          These fields are loaded instantly into the product sidebar box under "At a Glance" descriptors.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="p-material" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Material / Polymer</Label>
                          <Input
                            id="p-material"
                            value={editing.material ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, material: e.target.value }))}
                            placeholder="e.g. Polypropylene (PP) or HDPE"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="p-structure" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Structure / Design</Label>
                          <Input
                            id="p-structure"
                            value={editing.structure ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, structure: e.target.value }))}
                            placeholder="e.g. Honeycomb cells or Needle-punched"
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="p-colour" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Colour Availability</Label>
                          <Input
                            id="p-colour"
                            value={editing.colour ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, colour: e.target.value }))}
                            placeholder="e.g. White, Grey, Black"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="p-standard" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Manufacturing Standard</Label>
                          <Input
                            id="p-standard"
                            value={editing.standard ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, standard: e.target.value }))}
                            placeholder="e.g. ISO 9001, CE, GRI-GM13"
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="p-rwidth" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roll Width / Format Size</Label>
                          <Input
                            id="p-rwidth"
                            value={editing.roll_width ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, roll_width: e.target.value }))}
                            placeholder="e.g. 1.176 m (sheet) or 5.8 m"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="p-rlength" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roll Length / Formats</Label>
                          <Input
                            id="p-rlength"
                            value={editing.roll_length ?? ""}
                            onChange={(e) => setEditing((s) => ({ ...s, roll_length: e.target.value }))}
                            placeholder="e.g. 0.764 m or 100 m"
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 4. KEY FEATURES (HIGHLIGHTS) TAB */}
                  <TabsContent value="highlights" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Key Performance Highlights</h4>
                          <p className="text-[10px] text-muted-foreground">
                            Specify up to 5 icons & descriptive highlights displayed prominently in the hero background card.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addKeyFeature}
                          disabled={(editing.key_features ?? []).length >= 5}
                          className="h-8 text-xs font-bold uppercase bg-surface text-primary border-primary/20 hover:bg-primary/5"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Highlight
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(editing.key_features ?? []).map((feat, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface/50 shadow-sm relative group"
                          >
                            <span className="text-xs font-bold text-muted-foreground w-6">#{index + 1}</span>

                            <div className="flex-1 min-w-0">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Highlight Label</Label>
                              <Input
                                value={feat.label}
                                onChange={(e) => updateKeyFeature(index, "label", e.target.value)}
                                placeholder="e.g. UV & Frost Resistant or 180 L/M²·S Drainage"
                                className="mt-1 font-medium"
                              />
                            </div>

                            <div className="w-56 shrink-0">
                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Icon Class</Label>
                              <Select
                                value={feat.icon ?? "check"}
                                onValueChange={(v) => updateKeyFeature(index, "icon", v)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FEATURE_ICONS_LIST.map((ic) => (
                                    <SelectItem key={ic.value} value={ic.value}>
                                      {ic.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeKeyFeature(index)}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-lg mt-5"
                              title="Delete Highlight"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        {(editing.key_features ?? []).length === 0 && (
                          <div className="text-center py-10 border border-dashed border-border rounded-xl bg-surface/20">
                            <span className="text-xs text-muted-foreground italic">
                              No overrides defined. This product will inherit highlights from its linked Product Family template.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* 5. TYPICAL PROPERTIES TABLE TAB */}
                  <TabsContent value="specs" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Typical Properties Table</h4>
                          <p className="text-[10px] text-muted-foreground">
                            Build an interactive product-specific specification table showing exact laboratory testing values.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSpecRow}
                          className="h-8 text-xs font-bold uppercase bg-surface text-primary border-primary/20 hover:bg-primary/5"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add Row
                        </Button>
                      </div>

                      <div className="overflow-x-auto border border-border rounded-xl shadow-sm">
                        <Table className="text-xs">
                          <TableHeader className="bg-surface-dark/95 dark:bg-surface-dark">
                            <TableRow className="border-0">
                              <TableHead className="w-10 text-white"></TableHead>
                              <TableHead className="font-bold text-white uppercase tracking-wider">Property</TableHead>
                              <TableHead className="font-bold text-white uppercase tracking-wider">Test Method</TableHead>
                              <TableHead className="font-bold text-white uppercase tracking-wider">Unit</TableHead>
                              <TableHead className="font-bold text-white uppercase tracking-wider">Typical Value</TableHead>
                              <TableHead className="w-10 text-white"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="bg-card">
                            {(editing.specifications ?? []).map((row, index) => (
                              <TableRow key={index} className="hover:bg-muted/10">
                                <TableCell className="text-center font-bold text-muted-foreground">#{index + 1}</TableCell>
                                <TableCell>
                                  <Input
                                    value={row.property}
                                    onChange={(e) => updateSpecRow(index, "property", e.target.value)}
                                    placeholder="e.g. Vertical strength — empty"
                                    className="h-8 text-xs border-transparent hover:border-border focus:border-primary transition"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={row.test_method ?? ""}
                                    onChange={(e) => updateSpecRow(index, "test_method", e.target.value)}
                                    placeholder="e.g. ISO 10319"
                                    className="h-8 text-xs border-transparent hover:border-border focus:border-primary transition"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={row.unit ?? ""}
                                    onChange={(e) => updateSpecRow(index, "unit", e.target.value)}
                                    placeholder="e.g. t/m² or kN/m"
                                    className="h-8 text-xs border-transparent hover:border-border focus:border-primary transition"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={row.typical_value ?? ""}
                                    onChange={(e) => updateSpecRow(index, "typical_value", e.target.value)}
                                    placeholder="e.g. >450 or 120"
                                    className="h-8 text-xs border-transparent hover:border-border focus:border-primary transition"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSpecRow(index)}
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {(editing.specifications ?? []).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-xs text-muted-foreground italic">
                                  No properties specified. Inherits from linked Product Family template properties table automatically.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 6. RELATIONS TAB */}
                  <TabsContent value="relations" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      {/* ALTERNATIVES */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-2 mb-3 flex items-center gap-1.5">
                          <ArrowLeftRight className="h-4 w-4" /> Alternative Solutions (Max 5)
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-3">
                          Flag alternative solutions on the details page. If empty, defaults to automatic category products.
                        </p>

                        {(editing.alternative_ids ?? []).length > 0 && (
                          <div className="space-y-2 mb-3">
                            {(editing.alternative_ids ?? []).map((id) => {
                              const item = allProductsLookup[id];
                              return (
                                <div
                                  key={id}
                                  className="flex items-center justify-between p-2 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-colors shadow-sm"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {item?.image_url ? (
                                      <img
                                        src={item.image_url}
                                        alt=""
                                        className="h-9 w-9 rounded-lg border border-border object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="h-9 w-9 rounded-lg border border-border bg-muted shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                                        No img
                                      </div>
                                    )}
                                    <span className="text-xs font-semibold truncate">{item?.name ?? "Loading product..."}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg"
                                    onClick={() => removeAlternative(id)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {(editing.alternative_ids ?? []).length < 5 ? (
                          <ProductSelector
                            onSelect={(prod) => addAlternative(prod.id)}
                            excludeIds={[editing.id, ...(editing.alternative_ids ?? [])].filter(Boolean) as string[]}
                          />
                        ) : (
                          <div className="text-[10px] text-center py-2 px-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md font-medium">
                            Max 5 alternative products reached.
                          </div>
                        )}
                      </div>

                      {/* ACCESSORIES & SYSTEM COMPONENTS */}
                      <div className="border-t border-border/60 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-500 border-b border-border/60 pb-2 mb-3 flex items-center gap-1.5">
                          <Puzzle className="h-4 w-4" /> System Accessories & Components
                        </h4>
                        <p className="text-[10px] text-muted-foreground mb-3">
                          Dynamically link necessary accessories, anchor pins, or installation tools that construct this complete system.
                        </p>

                        {(editing.system_component_ids ?? []).length > 0 && (
                          <div className="space-y-2 mb-3">
                            {(editing.system_component_ids ?? []).map((id) => {
                              const item = allProductsLookup[id];
                              return (
                                <div
                                  key={id}
                                  className="flex items-center justify-between p-2 rounded-xl border border-emerald-800/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors shadow-sm"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {item?.image_url ? (
                                      <img
                                        src={item.image_url}
                                        alt=""
                                        className="h-9 w-9 rounded-lg border border-emerald-800/10 object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="h-9 w-9 rounded-lg border border-emerald-800/10 bg-muted shrink-0 flex items-center justify-center text-[10px] text-muted-foreground">
                                        No img
                                      </div>
                                    )}
                                    <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 truncate">
                                      {item?.name ?? "Loading accessory..."}
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 rounded-lg"
                                    onClick={() => removeSystemComponent(id)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <ProductSelector
                          onSelect={(prod) => addSystemComponent(prod.id)}
                          excludeIds={[editing.id, ...(editing.system_component_ids ?? [])].filter(Boolean) as string[]}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* 7. DOCUMENTS & SEO TAB */}
                  <TabsContent value="seo" className="space-y-4 outline-none">
                    <div className="space-y-4">
                      {/* PDF DOCUMENTS */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-2 mb-3 flex items-center gap-1.5">
                          <FileText className="h-4 w-4" /> PDF Specifications Documents
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="p-doc-tds" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Data Sheet (TDS)</Label>
                            <Input
                              id="p-doc-tds"
                              type="url"
                              placeholder="https://… datasheet path"
                              value={editing.datasheet_url ?? ""}
                              onChange={(e) => setEditing((s) => ({ ...s, datasheet_url: e.target.value }))}
                              className="mt-1.5 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-doc-install" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Installation Guide / Statement</Label>
                            <Input
                              id="p-doc-install"
                              type="url"
                              placeholder="https://… installation guide path"
                              value={editing.installation_guide_url ?? ""}
                              onChange={(e) => setEditing((s) => ({ ...s, installation_guide_url: e.target.value }))}
                              className="mt-1.5 text-xs font-mono"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor="p-doc-qa" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">QA/QC Site Checklist PDF</Label>
                            <Input
                              id="p-doc-qa"
                              type="url"
                              placeholder="https://… QA/QC log path"
                              value={editing.qa_checklist_url ?? ""}
                              onChange={(e) => setEditing((s) => ({ ...s, qa_checklist_url: e.target.value }))}
                              className="mt-1.5 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-doc-chem" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chemical Resistance / Accessories Guide</Label>
                            <Input
                              id="p-doc-chem"
                              type="url"
                              placeholder="https://… compatibility chart path"
                              value={editing.chemical_resistance_url ?? ""}
                              onChange={(e) => setEditing((s) => ({ ...s, chemical_resistance_url: e.target.value }))}
                              className="mt-1.5 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SEO */}
                      <div className="border-t border-border/60 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Search Engine Optimization (SEO)</h4>
                        <p className="text-[10px] text-muted-foreground mb-3">Optimize how this item displays on Google search results.</p>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="p-meta-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Title</Label>
                            <Input
                              id="p-meta-title"
                              value={editing.meta_title ?? ""}
                              maxLength={70}
                              placeholder="Recommended: ≤ 60 chars"
                              onChange={(e) => setEditing((s) => ({ ...s, meta_title: e.target.value }))}
                              className="mt-1.5 text-xs font-medium"
                            />
                            <div className="text-[10px] text-muted-foreground mt-1">
                              {(editing.meta_title ?? "").length}/70 chars
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="p-seo-kw" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO Focus Keywords</Label>
                            <Input
                              id="p-seo-kw"
                              value={editing.seo_keywords ?? ""}
                              placeholder="Comma-separated keywords"
                              onChange={(e) => setEditing((s) => ({ ...s, seo_keywords: e.target.value }))}
                              className="mt-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="p-meta-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description</Label>
                            <Textarea
                              id="p-meta-desc"
                              rows={2}
                              maxLength={200}
                              value={editing.meta_description ?? ""}
                              placeholder="Short compelling summary showing in SERPs. Recommended: ≤ 160 chars"
                              onChange={(e) => setEditing((s) => ({ ...s, meta_description: e.target.value }))}
                              className="mt-1.5 text-xs"
                            />
                            <div className="text-[10px] text-muted-foreground mt-1">
                              {(editing.meta_description ?? "").length}/200 chars
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-2">
                          <SeoAnalyzer
                            input={{
                              name: editing.name,
                              slug: editing.slug,
                              metaTitle: editing.meta_title,
                              metaDescription: editing.meta_description,
                              keywords: editing.seo_keywords,
                              shortDescription: editing.short_description,
                              imageUrl: editing.image_url || editing.images?.[0],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="px-6 py-4 border-t border-border shrink-0 bg-muted/20">
                <Button variant="outline" onClick={() => setOpen(false)} className="text-xs font-bold uppercase tracking-wider">
                  Cancel
                </Button>
                <Button onClick={() => void save()} disabled={saving} className="bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider px-6">
                  {saving ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <SortableHead field="name" className="text-xs font-bold uppercase tracking-wider">Name</SortableHead>
              <SortableHead field="sku" className="text-xs font-bold uppercase tracking-wider">SKU</SortableHead>
              <SortableHead field="category_id" className="text-xs font-bold uppercase tracking-wider">Category</SortableHead>
              <SortableHead field="price" className="text-right text-xs font-bold uppercase tracking-wider">Price</SortableHead>
              <SortableHead field="stock_quantity" className="text-right text-xs font-bold uppercase tracking-wider">Stock</SortableHead>
              <SortableHead field="is_active" className="text-xs font-bold uppercase tracking-wider">Active</SortableHead>
              <TableHead className="w-32 text-right text-xs font-bold uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/5 transition-colors duration-150">
                  <TableCell>
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt=""
                        className="h-10 w-10 rounded-lg border border-border object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg border border-border bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {mans.find((m) => m.id === p.manufacturer_id)?.name ?? p.slug}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-muted-foreground">{p.sku ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cats.find((c) => c.id === p.category_id)?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums text-foreground">
                    {p.sale_price != null ? (
                      <span>
                        <span className="text-muted-foreground/60 line-through mr-1 text-xs">
                          R{p.price?.toFixed(2)}
                        </span>
                        R{p.sale_price.toFixed(2)}
                      </span>
                    ) : p.price != null ? (
                      `R${p.price.toFixed(2)}`
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                    {p.stock_quantity ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Switch checked={p.is_active} onCheckedChange={() => void toggleActive(p)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => void remove(p.id)}
                      className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Showing {Math.min((page - 1) * pageSize + 1, total || 0)} to {Math.min(page * pageSize, total)} of{" "}
            {total} products
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Per page:</span>
              <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="w-[70px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-bold uppercase tracking-wider"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-bold uppercase tracking-wider"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
