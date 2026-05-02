import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import { MapPin, Phone, Mail, Upload, FileCheck2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Geosynthetics Africa" },
      { name: "description", content: "Speak to our technical team or upload your project BOQ. Regional offices in South Africa, Ghana, Tanzania and Zimbabwe." },
      { property: "og:title", content: "Contacts — Geosynthetics Africa" },
    ],
  }),
  component: ContactsPage,
});

const OFFICES = [
  { country: "South Africa", role: "Head Office", phone: "+27 (0) 11 000 0000", email: "info@geosynthetics.co.za" },
  { country: "Ghana", role: "Regional Office", phone: "+233 00 000 0000", email: "ghana@geosynthetics.co.za" },
  { country: "Tanzania", role: "Regional Office", phone: "+255 00 000 0000", email: "tz@geosynthetics.co.za" },
  { country: "Zimbabwe", role: "Regional Office", phone: "+263 00 000 0000", email: "zw@geosynthetics.co.za" },
];

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXT = [".pdf", ".xls", ".xlsx", ".csv", ".dwg", ".dxf", ".zip"];

const formSchema = z.object({
  name: z.string().trim().min(2, "Full name required").max(120),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Tell us a bit more about your project").max(2000),
});

function ContactsPage() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return setFile(null);
    if (f.size > MAX_FILE_BYTES) {
      toast.error("File too large (max 20 MB).");
      e.target.value = "";
      return;
    }
    const lower = f.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      toast.error(`Allowed types: ${ALLOWED_EXT.join(", ")}`);
      e.target.value = "";
      return;
    }
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = formSchema.safeParse({
      name: fd.get("name"),
      company: fd.get("company") || undefined,
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setSubmitting(true);
    try {
      let boqPath: string | null = null;

      if (file) {
        const ts = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const ownerKey = user?.id ?? "anonymous";
        boqPath = `${ownerKey}/${ts}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("boq-uploads")
          .upload(boqPath, file, { upsert: false, contentType: file.type || undefined });
        if (upErr) throw upErr;
      }

      const { error: insertErr } = await supabase.from("quote_requests").insert({
        contact_name: parsed.data.name,
        contact_email: parsed.data.email,
        contact_phone: parsed.data.phone ?? null,
        company: parsed.data.company ?? null,
        message: parsed.data.message,
        boq_file_path: boqPath,
        user_id: user?.id ?? null,
        status: "new",
      });
      if (insertErr) throw insertErr;

      toast.success("Thanks — we'll be in touch within 1 business day.");
      (e.target as HTMLFormElement).reset();
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not submit. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contacts"
        title="Speak to the Technical Team"
        description="Upload your project BOQ or send us a message — we typically respond within 1 business day."
      />
      <section className="bg-background">
        <div className="container-page py-16 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Project Enquiry</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required maxLength={120} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" maxLength={160} className="mt-1.5" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required maxLength={255} defaultValue={user?.email ?? ""} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" maxLength={40} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Project description</Label>
                <Textarea id="message" name="message" rows={5} required maxLength={2000} className="mt-1.5" />
              </div>

              <label className="block rounded border border-dashed border-border bg-surface p-6 text-center cursor-pointer hover:border-primary transition">
                {file ? (
                  <>
                    <FileCheck2 className="h-6 w-6 text-primary mx-auto" />
                    <div className="mt-2 text-sm font-semibold">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB — click to change</div>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-primary mx-auto" />
                    <div className="mt-2 text-sm font-semibold">Attach BOQ (PDF, XLS, DWG, ZIP)</div>
                    <div className="text-xs text-muted-foreground">Max 20 MB. Optional.</div>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  className="sr-only"
                  accept={ALLOWED_EXT.join(",")}
                  onChange={onFileChange}
                />
              </label>

              <Button type="submit" size="lg" disabled={submitting} className="bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
                {submitting ? "Sending…" : "Send Enquiry"}
              </Button>
            </form>
          </div>
          <aside className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">Regional Offices</h2>
            <div className="space-y-4">
              {OFFICES.map((o) => (
                <div key={o.country} className="rounded border border-border bg-card p-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div className="font-display text-base font-bold uppercase">{o.country}</div>
                    <span className="text-xs text-muted-foreground ml-auto">{o.role}</span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <a href={`tel:${o.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Phone className="h-3.5 w-3.5" /> {o.phone}
                    </a>
                    <a href={`mailto:${o.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Mail className="h-3.5 w-3.5" /> {o.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
