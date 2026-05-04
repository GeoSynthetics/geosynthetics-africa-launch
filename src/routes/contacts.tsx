import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Upload,
  FileCheck2,
  Building2,
  User,
  Clock,
  Target,
  ShieldCheck,
  Truck,
  Layers,
  HardHat,
  Waves,
  ClipboardCheck,
  Wrench,
  ChevronRight,
  CheckCircle2,
  MessageCircle,
  Package,
  AppWindow,
  FileText,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";
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
      { title: "Contact — Johannesburg Head Office | Geosynthetics Africa" },
      {
        name: "description",
        content:
          "Geosynthetics Africa Johannesburg Head Office — Southern Africa regional hub for supply, installation, QA/QC and logistics. Upload your BOQ or speak to the technical team.",
      },
      { property: "og:title", content: "Contact — Johannesburg Head Office | Geosynthetics Africa" },
      {
        property: "og:description",
        content:
          "Speak to the technical team or upload your project BOQ. Proudly serving Southern Africa and cross-border projects.",
      },
    ],
  }),
  component: ContactsPage,
});

const HERO_IMG =
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80&auto=format&fit=crop";

const HEAD_OFFICE = {
  company: "Geosynthetics Africa (Pty) Ltd",
  address: ["7 Tamar Avenue, Lea Glen", "Randburg, Johannesburg, 2191", "South Africa"],
  contactPerson: "James Chabata",
  contactRole: "Sales Admin Manager",
  phone: "+27 78 1355 926",
  email: "sales@geosynthetics.co.za",
  hours: ["Mon - Fri: 08:00 - 17:00", "Saturday: Closed", "Sunday: Closed"],
};

const HERO_BADGES = [
  { icon: Target, title: "Expert Technical", subtitle: "Support" },
  { icon: ShieldCheck, title: "Quality Products", subtitle: "& Services" },
  { icon: Truck, title: "Reliable Regional", subtitle: "Logistics" },
];

const OFFICE_SERVICES = [
  { icon: Layers, label: "Material Supply" },
  { icon: HardHat, label: "HDPE Liner Installation" },
  { icon: Waves, label: "Floating Cover Installation" },
  { icon: ClipboardCheck, label: "QA/QC Testing" },
  { icon: Truck, label: "Logistics & Export" },
  { icon: Wrench, label: "Technical Support" },
];

const REGIONAL_COVERAGE = ["South Africa", "Botswana", "Namibia", "Zimbabwe", "Mozambique", "Zambia"];

const CASE_STUDIES = [
  {
    name: "Danielskuil Reservoir",
    location: "North West, South Africa",
    description: "2.0mm HDPE liner with QA testing and installation.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Samancor PCD Lining",
    location: "Northern Cape, South Africa",
    description: "HDPE liner installation for PCD facility.",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Sekhukhune Works",
    location: "Limpopo, South Africa",
    description: "HDPE liner and geotextile installation.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80&auto=format&fit=crop",
  },
];

const RESOURCE_STRIP = [
  { icon: Package, title: "VIEW PRODUCTS", subtitle: "Explore our range", to: "/products" },
  { icon: AppWindow, title: "VIEW APPLICATIONS", subtitle: "Find your solution", to: "/applications" },
  { icon: ClipboardCheck, title: "QA & TESTING", subtitle: "Quality assurance", to: "/quality-assurance" },
  { icon: FileText, title: "VIEW CASE STUDIES", subtitle: "Real project success", to: "/resources" },
  { icon: BookOpen, title: "RESOURCES", subtitle: "Technical library", to: "/resources" },
];

const MAP_EMBED =
  "https://www.google.com/maps?q=7+Tamar+Avenue,+Lea+Glen,+Randburg,+Johannesburg&output=embed";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=7+Tamar+Avenue+Lea+Glen+Randburg+Johannesburg";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXT = [".pdf", ".xls", ".xlsx", ".csv", ".dwg", ".dxf", ".doc", ".docx", ".zip"];

const boqSchema = z.object({
  name: z.string().trim().min(2, "Full name required").max(120),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  country: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Tell us a bit more about your project").max(2000),
});

const quickSchema = z.object({
  name: z.string().trim().min(2, "Full name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(5, "How can we help?").max(2000),
});

function ContactsPage() {
  return (
    <>
      <ContactsHero />
      <OfficeAndMap />
      <ServicesAndCoverage />
      <FormsBlock />
      <ResourceStrip />
    </>
  );
}

/* -------------------- Hero -------------------- */
function ContactsHero() {
  return (
    <section
      className="relative bg-surface-dark text-surface-dark-foreground"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.55) 55%, rgba(10,10,12,0.25) 100%), url(${HERO_IMG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-page py-10 md:py-14">
        {/* Breadcrumbs */}
        <nav className="text-xs text-surface-dark-foreground/70 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/contacts" className="hover:text-primary">Contact Us</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="hover:text-primary">Southern Africa</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-surface-dark-foreground">Johannesburg Head Office</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
              Contact Us
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold uppercase leading-[0.95] tracking-tight">
              Johannesburg
              <br />
              Head Office
            </h1>
            <p className="mt-4 font-display text-xl md:text-2xl uppercase tracking-wide text-surface-dark-foreground/90">
              Southern Africa Regional Hub
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-dark-foreground/85">
              {["Supply", "Installation", "QA/QC", "Logistics"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-primary" />}
                  {s}
                </span>
              ))}
            </p>
            <p className="mt-3 text-base text-surface-dark-foreground/80 max-w-xl">
              Proudly serving Southern Africa and cross-border projects.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-2xl">
              {HERO_BADGES.map(({ icon: Icon, title, subtitle }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded border border-surface-dark-foreground/15 bg-surface-dark-foreground/5 backdrop-blur-sm p-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="text-xs leading-tight">
                    <div className="font-semibold text-surface-dark-foreground">{title}</div>
                    <div className="text-surface-dark-foreground/70">{subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#boq-form"
                className="inline-flex items-center gap-2 rounded bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-hover transition"
              >
                <Upload className="h-4 w-4" /> Upload Project BOQ
              </a>
              <a
                href={`tel:${HEAD_OFFICE.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded border border-surface-dark-foreground/30 bg-surface-dark-foreground/5 px-5 py-3 text-sm font-bold uppercase tracking-wide text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition"
              >
                <MessageCircle className="h-4 w-4" /> Speak to Technical Team
              </a>
              <a
                href="#quick-contact"
                className="inline-flex items-center gap-2 rounded border border-surface-dark-foreground/30 bg-surface-dark-foreground/5 px-5 py-3 text-sm font-bold uppercase tracking-wide text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition"
              >
                <Mail className="h-4 w-4" /> Request Material Supply
              </a>
            </div>
          </div>

          {/* Inline map card */}
          <div className="lg:col-span-4 lg:mt-20">
            <div className="rounded-md overflow-hidden border border-surface-dark-foreground/10 shadow-2xl bg-card">
              <div className="relative h-56">
                <iframe
                  title="Johannesburg Head Office map preview"
                  src={MAP_EMBED}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-card text-card-foreground p-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="text-sm">
                  <div className="font-display font-bold uppercase tracking-wide">Johannesburg</div>
                  <div className="text-muted-foreground text-xs">Head Office</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Office details + Map -------------------- */
function OfficeAndMap() {
  return (
    <section className="bg-background">
      <div className="container-page py-14 grid lg:grid-cols-12 gap-8">
        {/* Office details */}
        <div className="lg:col-span-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
            Office Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-0 rounded border border-border bg-card overflow-hidden">
            <div className="p-5 space-y-5 sm:border-r border-border">
              <DetailRow icon={Building2} label="Company">
                <div className="text-sm">{HEAD_OFFICE.company}</div>
              </DetailRow>
              <DetailRow icon={MapPin} label="Address">
                <div className="text-sm space-y-0.5">
                  {HEAD_OFFICE.address.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </DetailRow>
              <DetailRow icon={Phone} label="Phone">
                <a href={`tel:${HEAD_OFFICE.phone.replace(/\s+/g, "")}`} className="text-sm hover:text-primary">
                  {HEAD_OFFICE.phone}
                </a>
              </DetailRow>
              <DetailRow icon={Mail} label="Email">
                <a href={`mailto:${HEAD_OFFICE.email}`} className="text-sm hover:text-primary break-all">
                  {HEAD_OFFICE.email}
                </a>
              </DetailRow>
              <DetailRow icon={Clock} label="Office Hours">
                <div className="text-sm space-y-0.5">
                  {HEAD_OFFICE.hours.map((h) => (
                    <div key={h}>{h}</div>
                  ))}
                </div>
              </DetailRow>
            </div>

            <div className="bg-surface p-5 flex flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <User className="h-5 w-5" />
              </span>
              <div className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Contact Person
              </div>
              <div className="mt-1 font-display text-lg font-bold uppercase">
                {HEAD_OFFICE.contactPerson}
              </div>
              <div className="text-xs text-muted-foreground">{HEAD_OFFICE.contactRole}</div>
              <div className="mt-5 space-y-2 text-sm">
                <a
                  href={`tel:${HEAD_OFFICE.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 text-foreground/80 hover:text-primary"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" /> {HEAD_OFFICE.phone}
                </a>
                <a
                  href={`mailto:${HEAD_OFFICE.email}`}
                  className="flex items-center justify-center gap-2 text-foreground/80 hover:text-primary break-all"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" /> {HEAD_OFFICE.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">Find Us</h2>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 rounded border border-primary text-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition"
            >
              <MapPin className="h-3.5 w-3.5" /> View All African Offices
            </Link>
          </div>
          <div className="rounded border border-border overflow-hidden bg-card">
            <div className="relative h-[360px]">
              <iframe
                title="Geosynthetics Africa Johannesburg Head Office"
                src={MAP_EMBED}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-4 left-4 bg-card text-card-foreground rounded shadow-lg p-3 max-w-[260px] text-xs">
                <div className="font-display font-bold text-sm uppercase">Geosynthetics Africa</div>
                <div className="mt-1 text-muted-foreground space-y-0.5">
                  {HEAD_OFFICE.address.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-primary hover:underline font-semibold"
                >
                  View larger map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-foreground">{children}</div>
      </div>
    </div>
  );
}

/* -------------------- Services + Regional coverage -------------------- */
function ServicesAndCoverage() {
  return (
    <section className="bg-surface">
      <div className="container-page py-14 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
            Services Available From This Office
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {OFFICE_SERVICES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="rounded border border-border bg-card p-4 flex flex-col items-center text-center hover:border-primary transition"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 text-xs font-display font-bold uppercase tracking-wide leading-snug">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
            Regional Coverage
          </h2>
          <div className="rounded border border-border bg-card p-5 grid grid-cols-2 gap-x-4 gap-y-3 items-center">
            <div className="flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-24 w-24 opacity-30" />
            </div>
            <ul className="space-y-2">
              {REGIONAL_COVERAGE.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="col-span-2 mt-2">
              <Link
                to="/contacts"
                className="inline-flex items-center gap-2 rounded border border-primary text-primary px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition"
              >
                View All Regions <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Project Experience -------------------- */
function ProjectExperience() {
  return (
    <section className="bg-background">
      <div className="container-page py-14">
        <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-6">
          Project Experience In The Region
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {CASE_STUDIES.map((c) => (
            <article
              key={c.name}
              className="rounded border border-border bg-card overflow-hidden flex flex-col group"
            >
              <div
                className="h-44 bg-cover bg-center"
                style={{ backgroundImage: `url(${c.image})` }}
                role="img"
                aria-label={c.name}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-display text-base font-bold uppercase">{c.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 text-primary" /> {c.location}
                </div>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{c.description}</p>
                <Link
                  to="/resources"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary hover:underline"
                >
                  View Case Study <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Forms (BOQ + Quick contact) -------------------- */
function FormsBlock() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [boqSubmitting, setBoqSubmitting] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;
    const valid: File[] = [];
    for (const f of incoming) {
      if (f.size > MAX_FILE_BYTES) {
        toast.error(`${f.name} is too large (max 20 MB).`);
        continue;
      }
      const lower = f.name.toLowerCase();
      if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
        toast.error(`${f.name}: allowed types ${ALLOWED_EXT.join(", ")}`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const onBoqSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = boqSchema.safeParse({
      name: fd.get("name"),
      company: fd.get("company") || undefined,
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      country: fd.get("country") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBoqSubmitting(true);
    try {
      const ownerKey = user?.id ?? "anonymous";
      const uploadedPaths: string[] = [];
      for (const f of files) {
        const ts = Date.now();
        const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${ownerKey}/${ts}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("boq-uploads")
          .upload(path, f, { upsert: false, contentType: f.type || undefined });
        if (upErr) throw upErr;
        uploadedPaths.push(path);
      }

      const messageWithMeta =
        `${parsed.data.message}` +
        (parsed.data.country ? `\n\n[country] ${parsed.data.country}` : "") +
        (uploadedPaths.length ? `\n\n[attachments]\n${uploadedPaths.join("\n")}` : "");

      const { error: insertErr } = await supabase.from("quote_requests").insert({
        contact_name: parsed.data.name,
        contact_email: parsed.data.email,
        contact_phone: parsed.data.phone ?? null,
        company: parsed.data.company ?? null,
        message: messageWithMeta,
        boq_file_path: uploadedPaths[0] ?? null,
        user_id: user?.id ?? null,
        status: "new",
      });
      if (insertErr) throw insertErr;

      toast.success("Proposal request submitted — we'll be in touch within 1 business day.");
      (e.target as HTMLFormElement).reset();
      setFiles([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setBoqSubmitting(false);
    }
  };

  const onQuickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = quickSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setQuickSubmitting(true);
    try {
      const { error } = await supabase.from("quote_requests").insert({
        contact_name: parsed.data.name,
        contact_email: parsed.data.email,
        contact_phone: parsed.data.phone ?? null,
        company: null,
        message: `[quick contact]\n${parsed.data.message}`,
        boq_file_path: null,
        user_id: user?.id ?? null,
        status: "new",
      });
      if (error) throw error;
      toast.success("Inquiry sent — thank you!");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setQuickSubmitting(false);
    }
  };

  return (
    <section className="bg-surface">
      <div className="container-page py-14 grid lg:grid-cols-12 gap-8">
        {/* Project Experience — left column on desktop */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-6">
            Project Experience In The Region
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {CASE_STUDIES.map((c) => (
              <article
                key={c.name}
                className="rounded border border-border bg-card overflow-hidden flex flex-col group"
              >
                <div
                  className="h-44 bg-cover bg-center"
                  style={{ backgroundImage: `url(${c.image})` }}
                  role="img"
                  aria-label={c.name}
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-display text-base font-bold uppercase">{c.name}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" /> {c.location}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{c.description}</p>
                  <Link
                    to="/resources"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary hover:underline"
                  >
                    View Case Study <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Forms — right column on desktop */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
        {/* BOQ */}
        <div id="boq-form">
          <div className="rounded border border-border bg-card p-6 md:p-8">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
              Upload Your BOQ / Drawings
            </h2>
            <form onSubmit={onBoqSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field id="name" label="Full Name" required>
                  <Input id="name" name="name" required maxLength={120} />
                </Field>
                <Field id="company" label="Company">
                  <Input id="company" name="company" maxLength={160} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field id="email" label="Email" required>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    defaultValue={user?.email ?? ""}
                  />
                </Field>
                <Field id="phone" label="Phone" required>
                  <Input id="phone" name="phone" type="tel" required maxLength={40} />
                </Field>
              </div>
              <Field id="country" label="Project Location / Country">
                <Input id="country" name="country" maxLength={120} placeholder="Select country" />
              </Field>
              <Field id="message" label="Message / Project Description">
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  maxLength={2000}
                  placeholder="Tell us about your project..."
                />
              </Field>

              <label className="block rounded border-2 border-dashed border-border bg-surface p-6 text-center cursor-pointer hover:border-primary transition">
                <Upload className="h-8 w-8 text-primary mx-auto" />
                <div className="mt-2 text-sm font-semibold">
                  Drag & drop your BOQ or drawings here
                </div>
                <div className="text-xs text-primary underline">or click to browse files</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  PDF, DWG, DOC, XLS (Max 20MB)
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="sr-only"
                  accept={ALLOWED_EXT.join(",")}
                  onChange={onFileChange}
                />
              </label>

              {files.length > 0 && (
                <ul className="space-y-1.5">
                  {files.map((f, idx) => (
                    <li
                      key={`${f.name}-${idx}`}
                      className="flex items-center justify-between rounded border border-border bg-surface px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <FileCheck2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{f.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {(f.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={boqSubmitting}
                className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide"
              >
                {boqSubmitting ? "Submitting…" : "Submit & Get Proposal"}
              </Button>
            </form>
          </div>
        </div>

        {/* Quick contact + assistance */}
        <aside id="quick-contact" className="space-y-6">
          <div className="rounded border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
              Quick Contact
            </h2>
            <form onSubmit={onQuickSubmit} className="space-y-3">
              <Field id="q-name" label="Full Name" required>
                <Input id="q-name" name="name" required maxLength={120} />
              </Field>
              <Field id="q-email" label="Email" required>
                <Input
                  id="q-email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  defaultValue={user?.email ?? ""}
                />
              </Field>
              <Field id="q-phone" label="Phone">
                <Input id="q-phone" name="phone" type="tel" maxLength={40} />
              </Field>
              <Field id="q-message" label="Message">
                <Textarea
                  id="q-message"
                  name="message"
                  rows={4}
                  required
                  maxLength={2000}
                  placeholder="How can we help?"
                />
              </Field>
              <Button
                type="submit"
                disabled={quickSubmitting}
                className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide"
              >
                {quickSubmitting ? "Sending…" : "Send Inquiry"}
              </Button>
            </form>
          </div>

          <div className="rounded bg-surface-dark text-surface-dark-foreground p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-surface-dark-foreground/70">
              Need Immediate Assistance?
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-4 w-4" />
                </span>
                <a
                  href={`tel:${HEAD_OFFICE.phone.replace(/\s+/g, "")}`}
                  className="hover:text-primary"
                >
                  {HEAD_OFFICE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <a
                  href={`https://wa.me/${HEAD_OFFICE.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <a href={`mailto:${HEAD_OFFICE.email}`} className="hover:text-primary break-all">
                  {HEAD_OFFICE.email}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/* -------------------- Resource strip -------------------- */
function ResourceStrip() {
  return (
    <section className="bg-background border-t border-border">
      <div className="container-page py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {RESOURCE_STRIP.map(({ icon: Icon, title, subtitle, to }) => (
            <Link
              key={title}
              to={to}
              className="group flex items-center gap-3 rounded border border-border bg-card p-4 hover:border-primary transition"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-xs">
                <div className="font-display font-bold uppercase tracking-wide">{title}</div>
                <div className="text-muted-foreground">{subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
