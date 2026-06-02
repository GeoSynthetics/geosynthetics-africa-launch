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
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

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
    ? embedMatch[1]
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const messageText = embedMatch ? rawMessage.slice(0, embedMatch.index).trim() : rawMessage;
  const fromColumn =
    r.attachment_paths && r.attachment_paths.length > 0
      ? r.attachment_paths
      : r.boq_file_path
        ? [r.boq_file_path]
        : [];
  return { paths: Array.from(new Set([...fromColumn, ...embeddedPaths])), messageText };
}

const PAGE_SIZES = [10, 25, 50, 100];

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function QuotesAdminPage() {
  const [rows, setRows] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [quoteToDelete, setQuoteToDelete] = useState<QuoteRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [updatingBulkStatus, setUpdatingBulkStatus] = useState(false);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const toggleSelectAll = () => {
    if (pagedRows.every((r) => selectedIds.has(r.id))) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pagedRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pagedRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteQuote = async () => {
    if (!quoteToDelete) return;
    setDeleting(true);
    try {
      const { paths } = getAttachments(quoteToDelete);

      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage.from("boq-uploads").remove(paths);
        if (storageError) {
          console.error("Error deleting attachments:", storageError);
        }
      }

      const { error: dbError, count } = await supabase
        .from("quote_requests")
        .delete({ count: "exact" })
        .eq("id", quoteToDelete.id);

      if (dbError) {
        toast.error(dbError.message);
      } else if (count === 0) {
        toast.error("Delete failed: you may not have permission to delete this record.");
      } else {
        toast.success("Quote request deleted successfully");
        setRows((r) => r.filter((x) => x.id !== quoteToDelete.id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(quoteToDelete.id);
          return next;
        });
        if (selectedId === quoteToDelete.id) {
          setSelectedId(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete quote request");
    } finally {
      setDeleting(false);
      setQuoteToDelete(null);
    }
  };

  const bulkDeleteQuotes = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    try {
      const selectedQuotes = rows.filter((r) => selectedIds.has(r.id));
      const allPaths: string[] = [];
      selectedQuotes.forEach((quote) => {
        const { paths } = getAttachments(quote);
        allPaths.push(...paths);
      });

      if (allPaths.length > 0) {
        const { error: storageError } = await supabase.storage.from("boq-uploads").remove(allPaths);
        if (storageError) {
          console.error("Error deleting bulk attachments:", storageError);
        }
      }

      const idsArray = Array.from(selectedIds);
      const { error: dbError, count } = await supabase
        .from("quote_requests")
        .delete({ count: "exact" })
        .in("id", idsArray);

      if (dbError) {
        toast.error(dbError.message);
      } else if (count === 0) {
        toast.error("Bulk delete failed: you may not have permission to delete these records.");
      } else {
        toast.success(`Successfully deleted ${count} quote request(s)`);
        setRows((r) => r.filter((x) => !selectedIds.has(x.id)));
        setSelectedIds(new Set());
        if (selectedId && selectedIds.has(selectedId)) {
          setSelectedId(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to perform bulk deletion");
    } finally {
      setIsBulkDeleting(false);
      setIsBulkDeleteConfirmOpen(false);
    }
  };

  const handleBulkStatusUpdate = async (status: Status) => {
    if (selectedIds.size === 0) return;
    setUpdatingBulkStatus(true);
    const idsArray = Array.from(selectedIds);
    const prev = rows;

    setRows((r) => r.map((x) => (selectedIds.has(x.id) ? { ...x, status } : x)));

    try {
      const { error } = await supabase.from("quote_requests").update({ status }).in("id", idsArray);

      if (error) {
        setRows(prev);
        toast.error(error.message);
      } else {
        toast.success(`Successfully updated status for ${idsArray.length} items`);
        setSelectedIds(new Set());
      }
    } catch (err) {
      console.error(err);
      setRows(prev);
      toast.error("Failed to update status");
    } finally {
      setUpdatingBulkStatus(false);
    }
  };

  const load = async () => {
    setLoading(true);
    // Try the rich select first, fall back to the legacy minimal one
    // when the optional product/attachments columns aren't yet present.
    const richSelect =
      "id, created_at, contact_name, contact_email, contact_phone, company, project_description, product_name, product_id, boq_file_path, attachment_paths, status";
    let q = supabase
      .from("quote_requests")
      .select(richSelect)
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data: richData, error } = await q;
    let data = richData;
    if (error) {
      // Retry with only the columns guaranteed to exist
      let q2 = supabase
        .from("quote_requests")
        .select(
          "id, created_at, contact_name, contact_email, contact_phone, company, project_description, boq_file_path, status",
        )
        .order("created_at", { ascending: false })
        .limit(200);
      if (filter !== "all") q2 = q2.eq("status", filter);
      const fallback = await q2;
      if (fallback.error) toast.error(fallback.error.message);
      data = (fallback.data ?? []) as never;
    }
    setRows((data ?? []) as QuoteRequest[]);
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

  // Reset selectedIds when filter, page, or page size changes
  useEffect(() => {
    setSelectedIds(new Set());
  }, [filter, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCsv = () => {
    if (pagedRows.length === 0) {
      toast.info("Nothing to export");
      return;
    }
    const headers = [
      "Received",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Product",
      "Message",
      "Attachments",
      "Status",
    ];
    const lines = [headers.map(csvEscape).join(",")];
    for (const r of pagedRows) {
      const { paths, messageText } = getAttachments(r);
      lines.push(
        [
          new Date(r.created_at).toISOString(),
          r.contact_name,
          r.contact_email,
          r.contact_phone ?? "",
          r.company ?? "",
          r.product_name ?? "",
          messageText,
          paths.join(" | "),
          r.status,
        ]
          .map(csvEscape)
          .join(","),
      );
    }
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `quote-requests-${filter}-p${currentPage}-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={loading || rows.length === 0}
        >
          <FileDown className="h-4 w-4" /> Export CSV
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">{rows.length} result(s)</div>
      </div>

      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-accent/30 border border-border p-2 px-3 rounded text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="text-muted-foreground">
            <strong className="text-foreground">{selectedIds.size}</strong> selected
          </span>
          <div className="h-4 w-px bg-border mx-1" />
          <span className="text-muted-foreground">Update status to:</span>
          <Select
            disabled={updatingBulkStatus}
            onValueChange={(v) => void handleBulkStatusUpdate(v as Status)}
          >
            <SelectTrigger className="w-36 h-8 text-xs bg-background">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-xs font-bold"
            disabled={isBulkDeleting}
            onClick={() => setIsBulkDeleteConfirmOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete Selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs ml-auto"
            onClick={() => setSelectedIds(new Set())}
          >
            Cancel Selection
          </Button>
        </div>
      )}

      <div className="rounded border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] px-4">
                <Checkbox
                  checked={pagedRows.length > 0 && pagedRows.every((r) => selectedIds.has(r.id))}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
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
                  <TableCell colSpan={9}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                  No quote requests yet.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pagedRows.map((r) => {
                const { paths: attachments, messageText } = getAttachments(r);
                return (
                  <TableRow key={r.id} className={selectedIds.has(r.id) ? "bg-accent/40" : ""}>
                    <TableCell className="px-4">
                      <Checkbox
                        checked={selectedIds.has(r.id)}
                        onCheckedChange={() => toggleSelectOne(r.id)}
                        aria-label={`Select quote from ${r.contact_name}`}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                      <br />
                      {new Date(r.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{r.contact_name}</div>
                      <a
                        href={`mailto:${r.contact_email}`}
                        className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" /> {r.contact_email}
                      </a>
                      {r.contact_phone && (
                        <div>
                          <a
                            href={`tel:${r.contact_phone}`}
                            className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                          >
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
                      <Select
                        value={r.status}
                        onValueChange={(v) => void updateStatus(r.id, v as Status)}
                      >
                        <SelectTrigger
                          className={`w-36 h-8 text-xs border ${STATUS_STYLE[r.status]}`}
                        >
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
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedId(r.id)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setQuoteToDelete(r)}>
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
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
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} of{" "}
              {rows.length}
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
          {selected &&
            (() => {
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
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                          Contact
                        </div>
                        <div className="font-semibold">{selected.contact_name}</div>
                        <a
                          href={`mailto:${selected.contact_email}`}
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="h-3 w-3" /> {selected.contact_email}
                        </a>
                        {selected.contact_phone && (
                          <a
                            href={`tel:${selected.contact_phone}`}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="h-3 w-3" /> {selected.contact_phone}
                          </a>
                        )}
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                          Company
                        </div>
                        <div>{selected.company ?? "—"}</div>
                      </div>
                    </section>

                    {selected.product_name && (
                      <section>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                          Product
                        </div>
                        <div className="font-medium">{selected.product_name}</div>
                      </section>
                    )}

                    <section>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Message
                      </div>
                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {messageText || "—"}
                      </p>
                    </section>

                    <section>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Attachments
                      </div>
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
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        Status
                      </div>
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

      <AlertDialog open={!!quoteToDelete} onOpenChange={(open) => !open && setQuoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this quote request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quote request for{" "}
              <strong className="text-foreground">{quoteToDelete?.contact_name}</strong>
              {quoteToDelete &&
                getAttachments(quoteToDelete).paths.length > 0 &&
                " and all its attached files"}{" "}
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void deleteQuote();
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isBulkDeleteConfirmOpen}
        onOpenChange={(open) => !open && setIsBulkDeleteConfirmOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete these quote requests?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong className="text-foreground">{selectedIds.size}</strong> selected quote
              requests and all their attached files from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isBulkDeleting}
              onClick={(e) => {
                e.preventDefault();
                void bulkDeleteQuotes();
              }}
            >
              {isBulkDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
