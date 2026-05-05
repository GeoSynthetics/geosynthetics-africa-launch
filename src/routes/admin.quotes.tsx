import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Download, Eye, FileDown, Mail, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/quotes")({
  head: () => ({
    meta: [
      { title: "Quote Requests — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuotesAdmin,
});

type Status = "new" | "in_review" | "quoted" | "won" | "lost" | "archived";

interface QuoteRequest {
  id: string;
  created_at: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  company: string | null;
  message: string | null;
  project_description: string | null;
  product_name: string | null;
  product_id: string | null;
  boq_file_path: string | null;
  attachment_paths: string[] | null;
  status: Status;
}

const STATUSES: Status[] = ["new", "in_review", "quoted", "won", "lost", "archived"];

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  in_review: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
  quoted: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400",
  won: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  lost: "bg-destructive/15 text-destructive border-destructive/30",
  archived: "bg-muted text-muted-foreground border-border",
};

function getAttachments(r: QuoteRequest): { paths: string[]; messageText: string } {
  const rawMessage = r.project_description ?? r.message ?? "";
  const embedMatch = rawMessage.match(/\n\n\[attachments\]\n([\s\S]+)$/);
  const embeddedPaths = embedMatch
    ? embedMatch[1].split("\n").map((s) => s.trim()).filter(Boolean)
    : [];
  const messageText = embedMatch ? rawMessage.slice(0, embedMatch.index).trim() : rawMessage;
  const fromColumn = (r.attachment_paths && r.attachment_paths.length > 0)
    ? r.attachment_paths
    : (r.boq_file_path ? [r.boq_file_path] : []);
  return { paths: Array.from(new Set([...fromColumn, ...embeddedPaths])), messageText };
}

const PAGE_SIZES = [10, 25, 50, 100];

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function QuotesAdmin() {
  const [rows, setRows] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const load = async () => {
    setLoading(true);
    // Try the rich select first, fall back to the legacy minimal one
    // when the optional product/attachments columns aren't yet present.
    const richSelect = "id, created_at, contact_name, contact_email, contact_phone, company, message, project_description, product_name, product_id, boq_file_path, attachment_paths, status";
    let q = supabase
      .from("quote_requests")
      .select(richSelect)
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    let { data, error } = await q;
    if (error) {
      // Retry with only the columns guaranteed to exist
      let q2 = supabase
        .from("quote_requests")
        .select("id, created_at, contact_name, contact_email, contact_phone, company, project_description, boq_file_path, status")
        .order("created_at", { ascending: false })
        .limit(200);
      if (filter !== "all") q2 = q2.eq("status", filter);
      const fallback = await q2;
      if (fallback.error) toast.error(fallback.error.message);
      data = (fallback.data ?? []) as never;
    }
    setRows(((data ?? []) as QuoteRequest[]));
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (id: string, status: Status) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) {
      setRows(prev);
      toast.error(error.message);
    } else {
      toast.success("Status updated");
    }
  };

  const getSignedUrl = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("boq-uploads")
      .createSignedUrl(path, 60 * 5);
    if (error || !data) {
      toast.error(error?.message ?? "Could not generate link");
      return null;
    }
    return data.signedUrl;
  };

  const downloadBoq = async (path: string) => {
    const url = await getSignedUrl(path);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // Reset to first page when filter or page size changes
  useEffect(() => {
    setPage(1);
  }, [filter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as Status | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">{rows.length} result(s)</div>
      </div>

      <div className="rounded border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  No quote requests yet.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pagedRows.map((r) => {
                const rawMessage = r.project_description ?? r.message ?? "";
                // Parse trailing "[attachments]" block from description as a fallback
                // for projects whose schema doesn't yet have attachment_paths.
                const embedMatch = rawMessage.match(/\n\n\[attachments\]\n([\s\S]+)$/);
                const embeddedPaths = embedMatch
                  ? embedMatch[1].split("\n").map((s) => s.trim()).filter(Boolean)
                  : [];
                const messageText = embedMatch ? rawMessage.slice(0, embedMatch.index).trim() : rawMessage;
                const fromColumn = (r.attachment_paths && r.attachment_paths.length > 0)
                  ? r.attachment_paths
                  : (r.boq_file_path ? [r.boq_file_path] : []);
                const attachments = Array.from(new Set([...fromColumn, ...embeddedPaths]));
                return (
                <TableRow key={r.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString()}
                    <br />
                    {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{r.contact_name}</div>
                    <a href={`mailto:${r.contact_email}`} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {r.contact_email}
                    </a>
                    {r.contact_phone && (
                      <div>
                        <a href={`tel:${r.contact_phone}`} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {r.contact_phone}
                        </a>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{r.company ?? "—"}</TableCell>
                  <TableCell className="text-xs max-w-[180px]">
                    {r.product_name ? (
                      <span className="font-medium line-clamp-2">{r.product_name}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-xs text-muted-foreground line-clamp-3">{messageText}</p>
                  </TableCell>
                  <TableCell>
                    {attachments.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {attachments.map((p, idx) => {
                          const fileName = p.split("/").pop() ?? `File ${idx + 1}`;
                          return (
                            <Button
                              key={p}
                              size="sm"
                              variant="outline"
                              className="h-7 justify-start text-[11px] font-normal"
                              onClick={() => void downloadBoq(p)}
                              title={fileName}
                            >
                              <Download className="h-3 w-3 mr-1.5 shrink-0" />
                              <span className="truncate max-w-[160px]">{fileName}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select value={r.status} onValueChange={(v) => void updateStatus(r.id, v as Status)}>
                      <SelectTrigger className={`w-36 h-8 text-xs border ${STATUS_STYLE[r.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            <Badge variant="outline" className={STATUS_STYLE[s]}>
                              {s.replace("_", " ")}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedId(r.id)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {!loading && rows.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} of {rows.length}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (() => {
            const { paths, messageText } = getAttachments(selected);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Quote Request Details</DialogTitle>
                  <DialogDescription>
                    Received {new Date(selected.created_at).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 text-sm">
                  <section className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Contact</div>
                      <div className="font-semibold">{selected.contact_name}</div>
                      <a href={`mailto:${selected.contact_email}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" /> {selected.contact_email}
                      </a>
                      {selected.contact_phone && (
                        <a href={`tel:${selected.contact_phone}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {selected.contact_phone}
                        </a>
                      )}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Company</div>
                      <div>{selected.company ?? "—"}</div>
                    </div>
                  </section>

                  {selected.product_name && (
                    <section>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Product</div>
                      <div className="font-medium">{selected.product_name}</div>
                    </section>
                  )}

                  <section>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</div>
                    <p className="whitespace-pre-wrap text-muted-foreground">{messageText || "—"}</p>
                  </section>

                  <section>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Attachments</div>
                    {paths.length === 0 ? (
                      <span className="text-xs text-muted-foreground">No attachments</span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {paths.map((p, idx) => {
                          const fileName = p.split("/").pop() ?? `File ${idx + 1}`;
                          return (
                            <Button
                              key={p}
                              size="sm"
                              variant="outline"
                              className="h-9 justify-start"
                              onClick={() => void downloadBoq(p)}
                              title={fileName}
                            >
                              <Download className="h-4 w-4 mr-2 shrink-0" />
                              <span className="truncate">{fileName}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Status</div>
                    <Select
                      value={selected.status}
                      onValueChange={(v) => void updateStatus(selected.id, v as Status)}
                    >
                      <SelectTrigger className={`w-48 border ${STATUS_STYLE[selected.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            <Badge variant="outline" className={STATUS_STYLE[s]}>
                              {s.replace("_", " ")}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </section>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
