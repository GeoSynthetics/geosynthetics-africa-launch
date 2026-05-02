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
import { Download, Mail, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
  message: string;
  boq_file_path: string | null;
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

function QuotesAdmin() {
  const [rows, setRows] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("all");

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("quote_requests")
      .select("id, created_at, contact_name, contact_email, contact_phone, company, message, boq_file_path, status")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
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

  const downloadBoq = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("boq-uploads")
      .createSignedUrl(path, 60 * 5);
    if (error || !data) {
      toast.error(error?.message ?? "Could not generate link");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
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
        <div className="ml-auto text-xs text-muted-foreground">{rows.length} result(s)</div>
      </div>

      <div className="rounded border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>BOQ</TableHead>
              <TableHead>Status</TableHead>
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
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                  No quote requests yet.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((r) => (
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
                  <TableCell className="max-w-md">
                    <p className="text-xs text-muted-foreground line-clamp-3">{r.message}</p>
                  </TableCell>
                  <TableCell>
                    {r.boq_file_path ? (
                      <Button size="sm" variant="outline" onClick={() => void downloadBoq(r.boq_file_path!)}>
                        <Download className="h-3.5 w-3.5" /> BOQ
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
