import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Upload } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

function ContactsPage() {
  const [submitting, setSubmitting] = useState(false);
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                setTimeout(() => {
                  toast.success("Thanks — we'll be in touch within 1 business day.");
                  (e.target as HTMLFormElement).reset();
                  setSubmitting(false);
                }, 500);
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" className="mt-1.5" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Project description</Label>
                <Textarea id="message" rows={5} required className="mt-1.5" />
              </div>
              <div className="rounded border border-dashed border-border bg-surface p-6 text-center">
                <Upload className="h-6 w-6 text-primary mx-auto" />
                <div className="mt-2 text-sm font-semibold">Attach BOQ (PDF, XLS, DWG)</div>
                <div className="text-xs text-muted-foreground">File upload launches with our backend rollout.</div>
              </div>
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
