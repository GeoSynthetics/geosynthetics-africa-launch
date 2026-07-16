import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface QuoteCardProps {
  /** Used as the folder path in storage: quotes/{contextId}/ */
  contextId?: string;
  /** Shown in the default message placeholder and stored as product_name */
  contextLabel?: string;
  /** Heading of the card. Defaults to "Request a Quote" */
  heading?: string;
  /** Subheading / description text */
  description?: string;
  /** Initial message value */
  initialMessage?: string;
  /** Whether to show file uploader */
  showFileUpload?: boolean;
}

export function QuoteCard({
  contextId,
  contextLabel,
  heading = "Request a Quote",
  description = "Upload your BOQ or drawings and we'll provide a technical proposal.",
  initialMessage,
  showFileUpload = true,
}: QuoteCardProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (initialMessage !== undefined) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const attachment_paths: string[] = [];
      const storagePath = contextId ?? "global";
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `quotes/${storagePath}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
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

      const baseDescription =
        message.trim() || `Quote request${contextLabel ? ` for ${contextLabel}` : ""}`;
      const descriptionWithPaths =
        attachment_paths.length > 1
          ? `${baseDescription}\n\n[attachments]\n${attachment_paths.join("\n")}`
          : baseDescription;

      const basePayload: Record<string, unknown> = {
        contact_name: name.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim() || null,
        company: company.trim() || null,
        project_description: descriptionWithPaths,
        product_name: contextLabel ?? null,
        attachment_paths,
        boq_file_path: attachment_paths[0] ?? null,
        user_id: userId,
        status: "new",
      };

      // Graceful fallback: strip optional columns one-by-one if schema is missing them
      const optionalKeys = [
        "product_name",
        "attachment_paths",
        "boq_file_path",
        "user_id",
        "contact_phone",
      ];
      const payload = { ...basePayload };
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
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setMessage("");
      setFiles([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to submit quote request.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm" id="quote">
      <h3 className="font-display text-base font-bold uppercase text-foreground">{heading}</h3>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <Input
          type="email"
          placeholder="Email address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Textarea
          placeholder={
            contextLabel ? `Message about ${contextLabel}…` : "Tell us about your project…"
          }
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
        />

        {showFileUpload && (
          <>
            {/* File drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition",
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
              )}
            >
              <CloudUpload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div className="mt-2 text-xs">
                <span className="font-medium text-foreground">Drag & drop your BOQ or drawings</span>
                <span className="text-muted-foreground"> or </span>
                <span className="text-primary font-medium underline">click to upload</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-normal">
                PDF, DWG, DOC, XLS, images (Max 20MB each, up to {MAX_FILES} files)
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

            {files.length > 0 && (
              <ul className="space-y-2">
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
          </>
        )}

        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wider text-[11px] h-9 text-white mt-1 border-0"
        >
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Submit & Get Proposal
        </Button>
      </div>
    </div>
  );
}
