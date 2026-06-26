import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CloudUpload, FileText, X, Loader2 } from "lucide-react";

const ALLOWED_TYPES = [
  ".pdf",
  ".dwg",
  ".dxf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".zip",
  ".png",
  ".jpg",
  ".jpeg",
];
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_FILES = 8;

const COUNTRIES = [
  "South Africa",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Zimbabwe",
  "Namibia",
  "Botswana",
  "Mozambique",
  "Zambia",
  "Tanzania",
  "Uganda",
  "Angola",
  "DR Congo",
  "Rwanda",
  "Ethiopia",
  "Egypt",
  "United Kingdom",
  "United States",
  "Other",
];

export function QuickQuoteModal() {
  const { isOpen, close, productName, productId } = useQuickQuote();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setCountry("");
    setMessage("");
    setFiles([]);
  };

  const handleClose = () => {
    resetForm();
    close();
  };

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);
    const accepted: File[] = [];
    for (const f of list) {
      const ext = "." + (f.name.split(".").pop() ?? "").toLowerCase();
      if (!ALLOWED_TYPES.includes(ext)) {
        toast.error(`${f.name}: unsupported file type.`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name}: exceeds 20MB limit.`);
        continue;
      }
      accepted.push(f);
    }
    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      if (merged.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files per request.`);
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Name, email, and phone number are required.");
      return;
    }
    setSubmitting(true);
    try {
      const attachment_paths: string[] = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `quotes/${productId ?? "global"}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("boq-uploads")
          .upload(path, file, { contentType: file.type || undefined });
        if (upErr) {
          console.warn("Attachment upload failed:", upErr.message);
          toast.warning(`Could not upload ${file.name} — continuing.`);
        } else {
          attachment_paths.push(path);
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id ?? null;

      const baseDescription = message.trim() || `Quote request via global BOQ uploader`;
      const descriptionWithPaths =
        attachment_paths.length > 1
          ? `${baseDescription}\n\n[attachments]\n${attachment_paths.join("\n")}`
          : baseDescription;

      const basePayload: Record<string, unknown> = {
        contact_name: name.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        company: company.trim() || null,
        country: country || null,
        project_description: descriptionWithPaths,
        product_id: productId || null,
        product_name: productName || null,
        attachment_paths,
        boq_file_path: attachment_paths[0] ?? null,
        user_id: userId,
        status: "new",
        source: "quick_quote_modal",
      };

      const optionalKeys = [
        "product_id",
        "product_name",
        "attachment_paths",
        "boq_file_path",
        "user_id",
        "source",
        "country",
      ];
      let payload = { ...basePayload };
      let lastError: { message: string } | null = null;
      for (let attempt = 0; attempt < optionalKeys.length + 1; attempt += 1) {
        const { error } = await supabase.from("quote_requests").insert(payload);
        if (!error) {
          lastError = null;
          break;
        }
        lastError = error;
        const match =
          /column ['"]?(\w+)['"]? .* (does not exist|not found)/i.exec(error.message) ??
          /Could not find the ['"]?(\w+)['"]? column/i.exec(error.message);
        const missing = match?.[1];
        if (missing && missing in payload) {
          delete (payload as Record<string, unknown>)[missing];
          continue;
        }
        break;
      }
      if (lastError) throw new Error(lastError.message);

      toast.success("Quote request submitted. We'll be in touch shortly.");
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to submit quote request.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto overflow-x-hidden p-6 rounded-2xl md:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            ADD TO PROJECT BOQ
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-normal mt-1.5">
            Submit your project details and files. Our technical sales team will review your
            requirements and provide a customised proposal.
          </DialogDescription>
        </DialogHeader>

        {productName && (
          <div className="flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 mt-1 min-w-0">
            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Product
              </span>
              <p className="text-sm font-semibold text-foreground truncate leading-snug">
                {productName}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Full Name <span className="text-primary">*</span>
              </label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Company
              </label>
              <Input
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-11 rounded-xl border border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Email <span className="text-primary">*</span>
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Phone <span className="text-primary">*</span>
              </label>
              <Input
                type="tel"
                placeholder="Contact number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-xl border border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              Project Location / Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-11 transition shadow-sm"
            >
              <option value="" disabled>
                Select country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              Message / Project Description
            </label>
            <Textarea
              placeholder="Tell us about your project..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl border border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary resize-none shadow-sm"
            />
          </div>

          {/* File Drag and Drop */}
          <div className="space-y-1">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition duration-200",
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/60 bg-slate-50 dark:bg-slate-900/50",
              )}
            >
              <CloudUpload className="h-8 w-8 mx-auto text-primary" />
              <div className="mt-2 text-xs">
                <span className="font-semibold text-foreground">
                  Drag & drop your BOQ or drawings here
                </span>
                <span className="text-muted-foreground"> or </span>
                <span className="text-primary font-semibold underline">click to browse files</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-normal">
                PDF, DWG, DOC, XLS (Max 20MB)
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept={ALLOWED_TYPES.join(",")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {files.length > 0 && (
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-foreground">{f.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {(f.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-muted-foreground hover:text-destructive transition p-1"
                    aria-label={`Remove ${f.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover text-white uppercase font-display font-extrabold tracking-wider text-sm h-11 rounded-xl mt-2 transition duration-200 border-0"
          >
            {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            SUBMIT & GET PROPOSAL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
