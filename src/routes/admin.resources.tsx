import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Search, Upload, ExternalLink, Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResourcesAdmin,
});

type ResourceType = "tds" | "sds" | "brochure" | "case_study" | "manual" | "other";
type ResourceStatus = "draft" | "published" | "archived";

interface Resource {
  id: string;
  slug: string;
  title: string;
  type: ResourceType;
  description: string | null;
  file_path: string | null;
  external_url: string | null;
  is_public: boolean;
  status: ResourceStatus;
  created_at: string;
}

const TYPE_LABELS: Record<ResourceType, string> = {
  tds: "TDS — Datasheet",
  sds: "SDS — Safety Datasheet",
  manual: "Installation Guide / Manual",
  case_study: "Case Study",
  brochure: "Brochure",
  other: "Video / Other (use External URL)",
};
const TYPES: ResourceType[] = ["tds", "sds", "manual", "case_study", "brochure", "other"];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || `r-${Date.now()}`;

const empty: Partial<Resource> = {
  title: "",
  type: "tds",
  description: "",
  file_path: null,
  external_url: null,
  is_public: true,
  status: "published",
};

function ResourcesAdmin() {
  const [rows, setRows] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Resource>>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("id, slug, title, type, description, file_path, external_url, is_public, status, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows((data ?? []) as unknown as Resource[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      q.trim()
        ? rows.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
        : rows,
    [rows, q],
  );

  const openNew = () => {
    setEditing(empty);
    setFile(null);
    setOpen(true);
  };
  const openEdit = (r: Resource) => {
    setEditing(r);
    setFile(null);
    setOpen(true);
  };

  const save = async () => {
    if (!editing.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      let filePath = editing.file_path ?? null;
      if (file) {
        const ts = Date.now();
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${editing.type}/${ts}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("technical-docs")
          .upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (upErr) throw upErr;
        filePath = path;
      }
      const payload = {
        title: editing.title.trim(),
        slug: editing.slug?.trim() || slugify(editing.title),
        type: editing.type ?? "other",
        description: editing.description?.trim() || null,
        file_path: filePath,
        external_url: editing.external_url?.trim() || null,
        is_public: editing.is_public ?? true,
        status: editing.status ?? "published",
      };
      const res = editing.id
        ? await supabase.from("resources").update(payload).eq("id", editing.id)
        : await supabase.from("resources").insert(payload);
      if (res.error) throw res.error;
      toast.success(editing.id ? "Resource updated" : "Resource created");
      setOpen(false);
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: Resource) => {
    if (!confirm("Delete this resource?")) return;
    if (r.file_path) {
      await supabase.storage.from("technical-docs").remove([r.file_path]);
    }
    const { error } = await supabase.from("resources").delete().eq("id", r.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    setRows((rs) => rs.filter((x) => x.id !== r.id));
  };

  const preview = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("technical-docs")
      .createSignedUrl(path, 60 * 5);
    if (error || !data) {
      toast.error(error?.message ?? "Cannot preview");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        <div className="ml-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> New resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editing.id ? "Edit resource" : "New resource"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="r-title">Title</Label>
                  <Input
                    id="r-title"
                    value={editing.title ?? ""}
                    onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={editing.type ?? "other"}
                    onValueChange={(v) => setEditing((s) => ({ ...s, type: v as ResourceType }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="r-file">File (PDF, etc.)</Label>
                  <Input
                    id="r-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="mt-1.5"
                  />
                  {editing.file_path && !file && (
                    <p className="mt-1 text-xs text-muted-foreground">Current: {editing.file_path}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="r-url">External URL (optional)</Label>
                  <Input
                    id="r-url"
                    placeholder="https://…"
                    value={editing.external_url ?? ""}
                    onChange={(e) => setEditing((s) => ({ ...s, external_url: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="r-public"
                      checked={editing.is_public ?? true}
                      onCheckedChange={(v) => setEditing((s) => ({ ...s, is_public: v }))}
                    />
                    <Label htmlFor="r-public">Public (no login required)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="r-pub"
                      checked={(editing.status ?? "published") === "published"}
                      onCheckedChange={(v) => setEditing((s) => ({ ...s, status: v ? "published" : "draft" }))}
                    />
                    <Label htmlFor="r-pub">Published</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void save()} disabled={saving} className="bg-primary hover:bg-primary/90">
                  {saving ? "Saving…" : editing.file_path || file ? "Save" : (
                    <>
                      <Upload className="h-4 w-4" /> Save
                    </>
                  )}
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
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Gated</TableHead>
              <TableHead>Published</TableHead>
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
                  No resources yet.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold">{r.title}</TableCell>
                  <TableCell className="text-xs uppercase tracking-wide text-muted-foreground">
                    {r.type}
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.file_path ? (
                      <Button size="sm" variant="link" className="h-auto p-0" onClick={() => void preview(r.file_path!)}>
                        File
                      </Button>
                    ) : r.external_url ? (
                      <a
                        href={r.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Link <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{r.is_public ? "Public" : "Gated"}</TableCell>
                  <TableCell>{r.status === "published" ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Open in new tab"
                      disabled={!r.file_path && !r.external_url}
                      onClick={() => {
                        if (r.file_path) void preview(r.file_path);
                        else if (r.external_url) window.open(r.external_url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => void remove(r)}
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
