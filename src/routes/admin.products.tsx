import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Pencil, Trash2, Search, Upload, Copy, X, Star, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { SeoAnalyzer } from "@/components/admin/SeoAnalyzer";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductsAdmin,
});

interface Manufacturer {
  id: string;
  name: string;
}
interface ProductCategory {
  id: string;
  name: string;
}
interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
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
}

const empty: Partial<Product> = {
  name: "",
  slug: "",
  sku: "",
  short_description: "",
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
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ProductsAdmin() {
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

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const compressImage = async (
    file: File,
    maxDim = 1600,
    quality = 0.82,
  ): Promise<{ blob: Blob; ext: string; contentType: string }> => {
    // Skip compression for SVG / GIF (animation) — upload as-is
    if (file.type === "image/svg+xml" || file.type === "image/gif") {
      const ext = file.name.split(".").pop() || (file.type === "image/svg+xml" ? "svg" : "gif");
      return { blob: file, ext, contentType: file.type };
    }
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) {
      const ext = file.name.split(".").pop() || "jpg";
      return { blob: file, ext, contentType: file.type };
    }
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      const ext = file.name.split(".").pop() || "jpg";
      return { blob: file, ext, contentType: file.type };
    }
    // White background for transparent PNGs converted to JPEG-like webp
    if (file.type === "image/png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/webp",
        quality,
      ),
    );
    // Fall back to original if compression somehow made it bigger
    if (blob.size >= file.size) {
      const ext = file.name.split(".").pop() || "jpg";
      return { blob: file, ext, contentType: file.type };
    }
    return { blob, ext: "webp", contentType: "image/webp" };
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
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
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
    let query = supabase
      .from("products")
      .select("id, name, slug, sku, short_description, manufacturer_id, category_id, is_active, created_at, price, sale_price, stock_quantity, weight_kg, length_cm, width_cm, height_cm, image_url, images, meta_title, meta_description, seo_keywords", { count: "exact" });

    if (q.trim()) {
      const qs = q.trim();
      query = query.or(`name.ilike.%${qs}%,slug.ilike.%${qs}%,sku.ilike.%${qs}%`);
    }

    if (showMissingSeo) {
      query = query.or(`meta_title.is.null,meta_title.eq."",meta_description.is.null,meta_description.eq."",seo_keywords.is.null,seo_keywords.eq.""`);
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
      mans.length === 0 ? supabase.from("manufacturers").select("id, name").order("name") : Promise.resolve({ data: mans }),
      cats.length === 0 ? supabase.from("product_categories").select("id, name").order("name") : Promise.resolve({ data: cats }),
    ]);

    if (products.error) toast.error(products.error.message);
    setRows((products.data ?? []) as Product[]);
    setTotal(products.count ?? 0);
    
    if (mans.length === 0 && manufacturers.data) setMans(manufacturers.data as Manufacturer[]);
    if (cats.length === 0 && categories.data) setCats(categories.data as ProductCategory[]);
    
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

  const SortableHead = ({ field, children, className = "" }: { field: string; children: React.ReactNode; className?: string }) => (
    <TableHead className={`cursor-pointer select-none hover:bg-muted/50 transition-colors ${className}`} onClick={() => toggleSort(field)}>
      <div className={`flex items-center gap-1 ${className.includes('text-right') ? 'justify-end' : ''}`}>
        {children}
        {sortField === field ? (
          sortAsc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
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
    setEditing(p);
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
    toast.success(editing.id ? "Product updated" : "Product created");
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
          <Label htmlFor="filter-missing-seo" className="text-sm cursor-pointer whitespace-nowrap">Missing SEO</Label>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total: {total}</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> New product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <DialogHeader>
                <DialogTitle>{editing.id ? "Edit product" : "New product"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="p-name">Name</Label>
                  <Textarea
                    id="p-name"
                    rows={2}
                    cols={70}
                    wrap="soft"
                    value={editing.name ?? ""}
                    onChange={(e) =>
                      setEditing((s) => ({
                        ...s,
                        name: e.target.value,
                        slug: s.id ? s.slug : slugify(e.target.value),
                      }))
                    }
                    className="mt-1.5 w-full break-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <Label htmlFor="p-slug">Slug</Label>
                    <Textarea
                      id="p-slug"
                      rows={2}
                      wrap="soft"
                      value={editing.slug ?? ""}
                      onChange={(e) => setEditing((s) => ({ ...s, slug: e.target.value }))}
                      className="mt-1.5 w-full break-all"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor="p-sku">SKU</Label>
                    <Input
                      id="p-sku"
                      value={editing.sku ?? ""}
                      onChange={(e) => setEditing((s) => ({ ...s, sku: e.target.value }))}
                      className="mt-1.5 w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <Label>Manufacturer</Label>
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
                  <div className="min-w-0">
                    <Label>Category</Label>
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
                </div>
                <div>
                  <Label htmlFor="p-desc">Short description</Label>
                  <Textarea
                    id="p-desc"
                    rows={3}
                    value={editing.short_description ?? ""}
                    onChange={(e) =>
                      setEditing((s) => ({ ...s, short_description: e.target.value }))
                    }
                    className="mt-1.5"
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-3 text-muted-foreground">Pricing & Stock</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="min-w-0">
                      <Label htmlFor="p-price">Price (ZAR)</Label>
                      <Input id="p-price" type="number" step="0.01" min="0" value={editing.price ?? ""} onChange={(e) => setEditing((s) => ({ ...s, price: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="p-sale">Sale price</Label>
                      <Input id="p-sale" type="number" step="0.01" min="0" value={editing.sale_price ?? ""} onChange={(e) => setEditing((s) => ({ ...s, sale_price: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="p-stock">Stock qty</Label>
                      <Input id="p-stock" type="number" step="1" min="0" value={editing.stock_quantity ?? ""} onChange={(e) => setEditing((s) => ({ ...s, stock_quantity: e.target.value === "" ? null : parseInt(e.target.value) }))} className="mt-1.5" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-3 text-muted-foreground">Logistics</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="min-w-0">
                      <Label htmlFor="p-weight">Weight (kg)</Label>
                      <Input id="p-weight" type="number" step="0.01" min="0" value={editing.weight_kg ?? ""} onChange={(e) => setEditing((s) => ({ ...s, weight_kg: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="p-len">Length (cm)</Label>
                      <Input id="p-len" type="number" step="0.01" min="0" value={editing.length_cm ?? ""} onChange={(e) => setEditing((s) => ({ ...s, length_cm: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="p-wid">Width (cm)</Label>
                      <Input id="p-wid" type="number" step="0.01" min="0" value={editing.width_cm ?? ""} onChange={(e) => setEditing((s) => ({ ...s, width_cm: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1.5" />
                    </div>
                    <div className="min-w-0">
                      <Label htmlFor="p-hei">Height (cm)</Label>
                      <Input id="p-hei" type="number" step="0.01" min="0" value={editing.height_cm ?? ""} onChange={(e) => setEditing((s) => ({ ...s, height_cm: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1.5" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Images</h4>
                    <label className="inline-flex items-center gap-2 text-sm cursor-pointer rounded border border-border px-3 py-1.5 hover:bg-muted">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? "Uploading…" : "Upload images"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => { void handleUpload(e.target.files); e.currentTarget.value = ""; }}
                      />
                    </label>
                  </div>

                  {(editing.images?.length ?? 0) > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {editing.images!.map((url) => {
                        const isPrimary = editing.image_url === url;
                        return (
                          <div key={url} className={`relative group rounded border-2 overflow-hidden ${isPrimary ? "border-primary" : "border-border"}`}>
                            <img src={url} alt="" className="h-24 w-full object-cover" />
                            {isPrimary && (
                              <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-semibold">PRIMARY</span>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {!isPrimary && (
                                <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => setPrimaryImage(url)} title="Set as primary">
                                  <Star className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button type="button" size="icon" variant="secondary" className="h-7 w-7" onClick={() => void copyUrl(url)} title="Copy URL">
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => removeImage(url)} title="Remove">
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Label htmlFor="p-img" className="text-xs text-muted-foreground">Or paste an external image URL</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input id="p-img" type="url" placeholder="https://…" value={editing.image_url ?? ""} onChange={(e) => setEditing((s) => ({ ...s, image_url: e.target.value }))} />
                    {editing.image_url && (
                      <Button type="button" variant="outline" size="icon" onClick={() => void copyUrl(editing.image_url!)} title="Copy URL">
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>


                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-1 text-muted-foreground">SEO</h4>
                  <p className="text-xs text-muted-foreground mb-3">Optimised for search — separate from the technical product title.</p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="p-meta-title">Meta title</Label>
                      <Textarea
                        id="p-meta-title"
                        rows={2}
                        wrap="soft"
                        value={editing.meta_title ?? ""}
                        maxLength={70}
                        placeholder="e.g. Biaxial Reinforcement Geogrids for Roads | Tensar NX Series"
                        onChange={(e) => setEditing((s) => ({ ...s, meta_title: e.target.value }))}
                        className="mt-1.5 w-full break-words"
                      />
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className={(editing.meta_title ?? "").length > 60 ? "text-amber-600" : "text-muted-foreground"}>
                          {(editing.meta_title ?? "").length}/70 — recommended ≤ 60
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="p-seo-kw">SEO keywords / phrase</Label>
                      <Textarea
                        id="p-seo-kw"
                        rows={2}
                        wrap="soft"
                        value={editing.seo_keywords ?? ""}
                        placeholder="e.g. Tensar Geogrids Africa, biaxial geogrid, road stabilization"
                        onChange={(e) => setEditing((s) => ({ ...s, seo_keywords: e.target.value }))}
                        className="mt-1.5 w-full break-words"
                      />
                      <div className="text-[11px] text-muted-foreground mt-1">Comma-separated phrases.</div>
                    </div>
                    <div>
                      <Label htmlFor="p-meta-desc">Meta description</Label>
                      <Textarea
                        id="p-meta-desc"
                        rows={3}
                        maxLength={200}
                        value={editing.meta_description ?? ""}
                        placeholder="Short, compelling summary shown in search results."
                        onChange={(e) => setEditing((s) => ({ ...s, meta_description: e.target.value }))}
                        className="mt-1.5"
                      />
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className={(editing.meta_description ?? "").length > 160 ? "text-amber-600" : "text-muted-foreground"}>
                          {(editing.meta_description ?? "").length}/200 — recommended ≤ 160
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
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

                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <Switch
                    id="p-active"
                    checked={editing.is_active ?? true}
                    onCheckedChange={(v) => setEditing((s) => ({ ...s, is_active: v }))}
                  />
                  <Label htmlFor="p-active">Active (visible in catalogue)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void save()} disabled={saving} className="bg-primary hover:bg-primary/90">
                  {saving ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <SortableHead field="name">Name</SortableHead>
              <SortableHead field="sku">SKU</SortableHead>
              <SortableHead field="category_id">Category</SortableHead>
              <SortableHead field="price" className="text-right">Price</SortableHead>
              <SortableHead field="stock_quantity" className="text-right">Stock</SortableHead>
              <SortableHead field="is_active">Active</SortableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
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
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-10 w-10 rounded border border-border object-cover" loading="lazy" />
                    ) : (
                      <div className="h-10 w-10 rounded border border-border bg-muted" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {mans.find((m) => m.id === p.manufacturer_id)?.name ?? p.slug}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.sku ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {cats.find((c) => c.id === p.category_id)?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {p.sale_price != null ? (
                      <span><span className="text-muted-foreground line-through mr-1">R{p.price?.toFixed(2)}</span>R{p.sale_price.toFixed(2)}</span>
                    ) : p.price != null ? `R${p.price.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">{p.stock_quantity ?? "—"}</TableCell>
                  <TableCell>
                    <Switch checked={p.is_active} onCheckedChange={() => void toggleActive(p)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => void remove(p.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/10 gap-4">
          <div className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * pageSize + 1, total || 0)} to {Math.min(page * pageSize, total)} of {total} products
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Per page:</span>
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
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                Prev
              </Button>
              <span className="text-xs text-muted-foreground px-2">Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</span>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / pageSize)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
