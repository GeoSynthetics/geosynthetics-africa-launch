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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

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
}

const empty: Partial<Product> = {
  name: "",
  slug: "",
  sku: "",
  short_description: "",
  manufacturer_id: null,
  category_id: null,
  is_active: true,
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
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [products, manufacturers, categories] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, slug, sku, short_description, manufacturer_id, category_id, is_active, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("manufacturers").select("id, name").order("name"),
      supabase.from("product_categories").select("id, name").order("name"),
    ]);
    if (products.error) toast.error(products.error.message);
    setRows((products.data ?? []) as Product[]);
    setMans((manufacturers.data ?? []) as Manufacturer[]);
    setCats((categories.data ?? []) as ProductCategory[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.slug.toLowerCase().includes(needle) ||
        (r.sku ?? "").toLowerCase().includes(needle),
    );
  }, [rows, q]);

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
    const payload = {
      name: editing.name.trim(),
      slug: (editing.slug?.trim() || slugify(editing.name)).slice(0, 160),
      sku: editing.sku?.trim() || null,
      short_description: editing.short_description?.trim() || null,
      manufacturer_id: editing.manufacturer_id || null,
      category_id: editing.category_id || null,
      is_active: editing.is_active ?? true,
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
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filtered.length} of {rows.length}</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> New product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editing.id ? "Edit product" : "New product"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="p-name">Name</Label>
                  <Input
                    id="p-name"
                    value={editing.name ?? ""}
                    onChange={(e) =>
                      setEditing((s) => ({
                        ...s,
                        name: e.target.value,
                        slug: s.id ? s.slug : slugify(e.target.value),
                      }))
                    }
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="p-slug">Slug</Label>
                    <Input
                      id="p-slug"
                      value={editing.slug ?? ""}
                      onChange={(e) => setEditing((s) => ({ ...s, slug: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="p-sku">SKU</Label>
                    <Input
                      id="p-sku"
                      value={editing.sku ?? ""}
                      onChange={(e) => setEditing((s) => ({ ...s, sku: e.target.value }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Manufacturer</Label>
                    <Select
                      value={editing.manufacturer_id ?? "none"}
                      onValueChange={(v) =>
                        setEditing((s) => ({ ...s, manufacturer_id: v === "none" ? null : v }))
                      }
                    >
                      <SelectTrigger className="mt-1.5">
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
                    <Label>Category</Label>
                    <Select
                      value={editing.category_id ?? "none"}
                      onValueChange={(v) =>
                        setEditing((s) => ({ ...s, category_id: v === "none" ? null : v }))
                      }
                    >
                      <SelectTrigger className="mt-1.5">
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
                <div className="flex items-center gap-3">
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
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No products yet.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm">{p.sku ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    {mans.find((m) => m.id === p.manufacturer_id)?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {cats.find((c) => c.id === p.category_id)?.name ?? "—"}
                  </TableCell>
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
      </div>
    </div>
  );
}
