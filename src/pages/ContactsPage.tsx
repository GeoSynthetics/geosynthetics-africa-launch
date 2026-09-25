import { Link, useLoaderData, useSearch, type LinkComponentProps } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  MapPin,
  Phone,
  Mail,
  Upload,
  FileCheck2,
  Building2,
  User,
  Clock,
  ClipboardCheck,
  ChevronRight,
  CheckCircle2,
  MessageCircle,
  Package,
  AppWindow,
  FileText,
  BookOpen,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DEFAULT_REGIONAL_COVERAGE } from "@/lib/global-data";
import { sendQuoteEmailFn, sendContactEmailFn } from "@/lib/brevo";

type AnyLinkProps = Omit<LinkComponentProps, "to"> & {
  to: string;
  params?: Record<string, string>;
};
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

import {
  type ContactsPageContent,
  type ContactHero,
  type ContactHeadOffice,
  type ContactOfficeService,
  DEFAULT_CONTACTS_PAGE_CONTENT,
} from "@/types/contacts";
import * as LucideIcons from "lucide-react";
import { DrainageMesh, FiberStrand } from "@/components/site/shapes";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";

const getIconComponent = (
  name: string | undefined,
  fallback: React.ComponentType<{ className?: string }> = BookOpen,
): React.ComponentType<{ className?: string }> => {
  if (!name) return fallback;
  return (LucideIcons as any)[name] || fallback;
};

import { mockContactsCaseStudies as CASE_STUDIES } from "@/mocks/contactsMocks";

const RESOURCE_STRIP = [
  { icon: Package, title: "VIEW PRODUCTS", subtitle: "Explore our range", to: "/products" },
  {
    icon: AppWindow,
    title: "VIEW APPLICATIONS",
    subtitle: "Find your solution",
    to: "/applications",
  },
  {
    icon: ClipboardCheck,
    title: "QA & TESTING",
    subtitle: "Quality assurance",
    to: "/quality-assurance",
  },
  {
    icon: FileText,
    title: "VIEW CASE STUDIES",
    subtitle: "Real project success",
    to: "/resources",
  },
  { icon: BookOpen, title: "RESOURCES", subtitle: "Technical library", to: "/resources" },
];

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

// Static constants REGIONAL_LOCATIONS and REGIONAL_DETAILS are replaced by database configuration.

function RegionalMap({
  selectedCountry,
  onSelectCountry,
  locations,
}: {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  locations: any[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((mod) => {
      setL(mod.default);
    });
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-21.0, 24.5],
      zoom: 4.5,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    leafletInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    const pinColor = "rgb(225, 29, 72)";
    const customMarkerHtml = `
      <div style="position: relative; width: 30px; height: 30px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: ${pinColor};
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.2);
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border: 2px solid ${pinColor};
          border-radius: 50%;
          animation: map-pulse 1.8s infinite ease-out;
        "></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${pinColor}" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="
          position: absolute;
          top: -6px;
          left: 3px;
          width: 24px;
          height: 24px;
          filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));
        ">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="#fff"/>
        </svg>
      </div>
    `;

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes map-pulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);

    const customMarkerIcon = L.divIcon({
      html: customMarkerHtml,
      className: "custom-marker-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 20],
      popupAnchor: [0, -15],
    });

    locations.forEach((loc) => {
      if (!loc.coords || loc.coords.length !== 2) return;
      const marker = L.marker(loc.coords, { icon: customMarkerIcon }).addTo(map);

      marker.on("click", () => {
        onSelectCountry(loc.country);
      });
    });

    return () => {
      map.remove();
      document.head.removeChild(styleEl);
    };
  }, [L, locations]);

  useEffect(() => {
    const map = leafletInstanceRef.current;
    if (!map || !L || !selectedCountry) return;

    const loc = locations.find((l) => l.country === selectedCountry);

    if (loc && loc.coords && loc.coords.length === 2) {
      map.setView(loc.coords, 6, { animate: true, duration: 1 });
    }
  }, [selectedCountry, L, locations]);

  if (!L) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground gap-3">
        <MapPin className="h-8 w-8 text-primary animate-pulse" />
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Loading Regional Map...
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="absolute inset-0 h-full w-full" />;
}

export function ContactsPage() {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const loaderData = useLoaderData({ strict: false }) as Record<string, unknown>;

  const locations = (loaderData?.regionalCoverage || DEFAULT_REGIONAL_COVERAGE) as Array<{
    country: string;
  }>;
  const regionalCountries = locations.map((loc: { country: string }) => loc.country);

  const contentData = loaderData?.content || null;
  const content = { ...DEFAULT_CONTACTS_PAGE_CONTENT, ...contentData } as ContactsPageContent;
  const hero = { ...DEFAULT_CONTACTS_PAGE_CONTENT.hero, ...content.hero };
  const headOffice = { ...DEFAULT_CONTACTS_PAGE_CONTENT.headOffice, ...content.headOffice };
  const officeServices = content.officeServices || DEFAULT_CONTACTS_PAGE_CONTENT.officeServices;

  const [selectedCountry, setSelectedCountry] = useState<string>(
    locations[0]?.country || "South Africa",
  );

  // Safely read search params or loader data to pre-select country
  useEffect(() => {
    const initialCountry = (search?.country || loaderData?.country || "") as string;
    if (initialCountry) {
      // Find matching country in regionalCountries (case-insensitive)
      const matched = regionalCountries.find(
        (c: string) => c.toLowerCase() === initialCountry.toLowerCase(),
      );
      if (matched) {
        setSelectedCountry(matched);
      }
    }
  }, [search?.country, loaderData?.country, regionalCountries]);

  return (
    <>
      <LocalBusinessSchema />
      <ContactsHero hero={hero} headOffice={headOffice} />
      <OfficeDetailsAndServices headOffice={headOffice} officeServices={officeServices} />
      <MapAndCoverage
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        locations={locations}
      />
      <FormsBlock headOffice={headOffice} />
      <ResourceStrip />
      <CountrySeoLinks />
    </>
  );
}

function CountrySeoLinks() {
  const links = [
    { name: "South Africa", slug: "gse-hdpe-liner-smooth-geomembrane-supplier-south-africa" },
    { name: "Botswana", slug: "botswana-geomembranes-hdpe-geotextiles-geogrids-supplier" },
    { name: "Tanzania", slug: "tanzania-geosynthetics-supplier-hdpe-liners-geotextiles-geogrids" },
    { name: "Zimbabwe", slug: "zimbabwe-river-rehabilitation-jutesoillock-292-erosion-control" },
    { name: "Zambia", slug: "zambia-hdpe-liners-bidim-geotextiles-geogrids-supplier" },
    {
      name: "Democratic Republic of Congo (DRC)",
      slug: "drc-congo-geosynthetics-bidim-hdpe-geomembranes-supplier",
    },
    { name: "Kenya", slug: "kenya-geosynthetics-supplier-contact" },
    { name: "Côte d'Ivoire", slug: "cote-divoire-geosynthetics-supplier-contact" },
    { name: "Mozambique", slug: "mozambique-geosynthetics-supplier-contact" },
    { name: "Ghana", slug: "ghana-geosynthetics-supplier-contact" },
    { name: "Namibia", slug: "namibia-geosynthetics-supplier-contact" },
  ];

  return (
    <section className="bg-muted/30 border-t border-border py-8">
      <div className="container-page">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground/80 mb-4">
          Pan-African Coverage & Regional Pages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {links.map((link) => (
            <RLink
              key={link.slug}
              to="/$slug"
              params={{ slug: link.slug }}
              className="text-xs text-muted-foreground hover:text-primary transition font-medium flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              Geosynthetics {link.name} &rarr;
            </RLink>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Hero -------------------- */
function ContactsHero({ hero, headOffice }: { hero: ContactHero; headOffice: ContactHeadOffice }) {
  return (
    <section
      className="relative isolate overflow-hidden bg-surface-dark text-surface-dark-foreground"
      style={{ minHeight: "420px" }}
    >
      <DrainageMesh opacity={0.12} color="#ffffff" lineSpacing={40} />
      {/* Full-bleed background image with left-heavy gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${hero.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.70) 40%, rgba(8,8,10,0.20) 72%, rgba(8,8,10,0.05) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative container-page py-10 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Contact Us", to: "/contacts" },
            { label: "Southern Africa" },
            { label: headOffice.company },
          ]}
          variant="contacts"
        />

        {/* Left-side content */}
        <div className="max-w-[58%] md:max-w-[52%]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
            Contact Us
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold uppercase leading-[0.92] tracking-tight whitespace-pre-line">
            {hero.title}
          </h1>
          <p className="mt-3 font-display text-lg md:text-xl uppercase tracking-wide text-surface-dark-foreground/90">
            {hero.subtitle}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-dark-foreground/80">
            {hero.tags.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-primary" />}
                {s}
              </span>
            ))}
          </p>
          <p className="mt-2 text-sm text-surface-dark-foreground/75 max-w-sm">
            {hero.description}
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-xl">
            {hero.badges.map(({ icon: iconName, title, subtitle }) => {
              const Icon = getIconComponent(iconName);
              return (
                <div
                  key={title}
                  className="flex items-center gap-2.5 rounded border border-surface-dark-foreground/15 bg-surface-dark-foreground/8 backdrop-blur-sm p-2.5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-[11px] leading-tight">
                    <div className="font-semibold text-surface-dark-foreground">{title}</div>
                    <div className="text-surface-dark-foreground/65">{subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#boq-form"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-hover transition"
            >
              <Upload className="h-3.5 w-3.5" /> Upload Project BOQ
            </a>
            <a
              href={`tel:${headOffice.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 rounded border border-surface-dark-foreground/30 bg-surface-dark-foreground/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Speak to Technical Team
            </a>
            <a
              href="#quick-contact"
              className="inline-flex items-center gap-2 rounded border border-surface-dark-foreground/30 bg-surface-dark-foreground/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition"
            >
              <Mail className="h-3.5 w-3.5" /> Request Material Supply
            </a>
          </div>
        </div>
      </div>

      {/* Map card */}
      {headOffice.mapEmbedUrl && (
        <div className="hidden lg:block absolute bottom-0 right-6 xl:right-12 w-64 shadow-2xl rounded-t-md overflow-hidden border border-surface-dark-foreground/15">
          <div className="relative h-44">
            <iframe
              title="Head Office map preview"
              src={headOffice.mapEmbedUrl}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="bg-card text-card-foreground px-4 py-3 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <div className="text-xs truncate flex-1">
              <div className="font-display font-bold uppercase tracking-wide truncate">
                {headOffice.company}
              </div>
              <div className="text-muted-foreground truncate">
                {headOffice.contactRole || "Head Office"}
              </div>
            </div>
          </div>
        </div>
      )}
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
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-foreground">{children}</div>
      </div>
    </div>
  );
}

/* -------------------- Office details + Services -------------------- */
function OfficeDetailsAndServices({
  headOffice,
  officeServices,
}: {
  headOffice: ContactHeadOffice;
  officeServices: ContactOfficeService[];
}) {
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
                <div className="text-sm">{headOffice.company}</div>
              </DetailRow>
              <DetailRow icon={MapPin} label="Address">
                <a
                  href="https://maps.app.goo.gl/dWqBYitmU8ziMmDd8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm space-y-0.5 hover:text-primary transition-colors inline-block cursor-pointer"
                  title="Open location in Google Maps"
                >
                  {headOffice.address.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </a>
              </DetailRow>
              <DetailRow icon={Phone} label="Phone">
                <a
                  href={`tel:${headOffice.phone.replace(/\s+/g, "")}`}
                  className="text-sm hover:text-primary"
                >
                  {headOffice.phone}
                </a>
              </DetailRow>
              <DetailRow icon={Mail} label="Email">
                <a
                  href={`mailto:${headOffice.email}`}
                  className="text-sm hover:text-primary break-all"
                >
                  {headOffice.email}
                </a>
              </DetailRow>
              <DetailRow icon={Clock} label="Office Hours">
                <div className="text-sm space-y-0.5">
                  {headOffice.hours.map((h) => (
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
                {headOffice.contactPerson}
              </div>
              <div className="text-xs text-muted-foreground">{headOffice.contactRole}</div>
              <div className="mt-5 space-y-2 text-sm">
                <a
                  href={`tel:${headOffice.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 text-foreground/80 hover:text-primary"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" /> {headOffice.phone}
                </a>
                <a
                  href={`mailto:${headOffice.email}`}
                  className="flex items-center justify-center gap-2 text-foreground/80 hover:text-primary break-all"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" /> {headOffice.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services Available From This Office */}
        <div className="lg:col-span-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
            Services Available From This Office
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {officeServices.map((service, index) => {
              const Icon = getIconComponent(service.icon);
              return (
                <div
                  key={`${service.label}-${index}`}
                  className="rounded border border-border bg-card p-4 flex flex-col items-center text-center hover:border-primary transition"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-xs font-display font-bold uppercase tracking-wide leading-snug">
                    {service.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Map + Regional Coverage -------------------- */
function MapAndCoverage({
  selectedCountry,
  onSelectCountry,
  locations,
}: {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  locations: any[];
}) {
  const activeLoc =
    locations.find((l) => l.country === selectedCountry) ||
    locations[0] ||
    DEFAULT_REGIONAL_COVERAGE[0];
  const activeDetails = activeLoc;

  return (
    <section className="bg-surface">
      <div className="container-page py-14">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
              Regional Coverage & Presence
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Select a country below or click a map pin to explore our offices and logistics routes
              across Africa.
            </p>
          </div>
          <button
            onClick={() => onSelectCountry(locations[0]?.country || "South Africa")}
            className="inline-flex items-center gap-2 rounded border border-primary text-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition cursor-pointer self-start md:self-auto"
          >
            <MapPin className="h-3.5 w-3.5" /> Reset View (HQ)
          </button>
        </div>

        {/* Side-by-Side Map and Coverage Info */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Map wrapper */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="rounded border border-border overflow-hidden bg-card relative flex-1 min-h-[450px] lg:min-h-0">
              <RegionalMap
                selectedCountry={selectedCountry}
                onSelectCountry={onSelectCountry}
                locations={locations}
              />

              {/* Dynamic floating detail card */}
              <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm text-card-foreground rounded border border-border shadow-lg p-3.5 max-w-[260px] text-xs z-[1000] pointer-events-auto transition-all duration-300">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {activeLoc.country} Presence
                </div>
                <div className="font-display font-bold text-sm uppercase mt-0.5 leading-snug">
                  {activeLoc.title}
                </div>
                <div className="mt-1.5 text-muted-foreground">
                  <div>{activeLoc.address}</div>
                </div>
                <div className="mt-2.5 space-y-1 pt-2 border-t border-border/60 text-[11px]">
                  <div className="font-semibold text-foreground leading-snug">
                    {activeLoc.services}
                  </div>
                  <a
                    href={`tel:${(activeLoc.phone || "").replace(/\s+/g, "")}`}
                    className="flex items-center gap-1.5 text-primary hover:underline font-medium mt-1"
                  >
                    <Phone className="h-3 w-3 shrink-0" /> {activeLoc.phone}
                  </a>
                  <a
                    href={`mailto:${activeLoc.email}`}
                    className="flex items-center gap-1.5 text-primary hover:underline font-medium break-all"
                  >
                    <Mail className="h-3 w-3 shrink-0" /> {activeLoc.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Regional coverage dashboard card */}
          <div className="lg:col-span-6">
            <div className="rounded border border-border bg-card p-6 grid md:grid-cols-12 gap-6 h-full min-h-[450px]">
              {/* Left side: Interactive Country Details Dashboard */}
              <div className="md:col-span-7 flex flex-col justify-between bg-surface border border-border rounded p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-3xl animate-bounce-subtle"
                      role="img"
                      aria-label={selectedCountry}
                    >
                      {activeDetails.flag}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-wide leading-none">
                        {selectedCountry}
                      </h3>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">
                        Hub: {activeDetails.code}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {activeDetails.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-border/80 pt-3 text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase text-[10px] block tracking-wide">
                        Transit Time
                      </span>
                      <span className="text-foreground font-medium">{activeDetails.transit}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground uppercase text-[10px] block tracking-wide">
                        Logistics Route
                      </span>
                      <span className="text-foreground font-medium">{activeDetails.routes}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/80">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px] block tracking-wide mb-1.5">
                    Core Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeDetails.capabilities?.map((svc: string) => (
                      <span
                        key={svc}
                        className="text-[10px] bg-card border border-border px-2 py-0.5 rounded font-medium text-foreground/80"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side: Country Selector buttons */}
              <div className="md:col-span-5 flex flex-col justify-between">
                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  <span className="font-semibold text-muted-foreground uppercase text-[10px] block tracking-wide mb-2">
                    Select a Region
                  </span>
                  {locations.map((loc) => {
                    const isSelected = loc.country === selectedCountry;
                    return (
                      <button
                        key={loc.country}
                        onClick={() => onSelectCountry(loc.country)}
                        className={`w-full flex items-center justify-between p-3 rounded border text-left text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground shadow-md scale-[1.02]"
                            : "bg-card border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{loc.flag}</span>
                          <span>{loc.country}</span>
                        </span>
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary-foreground" : "text-primary opacity-60"}`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3">
                  <a
                    href="#boq-form"
                    className="w-full inline-flex items-center justify-center gap-2 rounded border border-primary text-primary px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    Request Regional Quote <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Forms (BOQ + Quick contact) -------------------- */
export function FormsBlock({ headOffice }: { headOffice: ContactHeadOffice }) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [boqSubmitting, setBoqSubmitting] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);

  const loaderData = useLoaderData({ strict: false }) as Record<string, unknown>;
  const caseStudies = (loaderData?.caseStudies || []) as Array<{
    title: string;
    location?: string;
    country?: string;
    summary?: string;
    hero_image_url?: string;
    slug?: string;
  }>;

  // Map database projects if available, otherwise fall back to static CASE_STUDIES
  const projectExperience =
    caseStudies.length > 0
      ? caseStudies.map((cs) => ({
          name: cs.title,
          location:
            cs.location && cs.country
              ? `${cs.location}, ${cs.country}`
              : cs.location || cs.country || "",
          description: cs.summary || "",
          image: cs.hero_image_url || "",
          slug: cs.slug,
        }))
      : CASE_STUDIES;

  // Zod forms initialization
  type BoqValues = z.infer<typeof boqSchema>;
  type QuickValues = z.infer<typeof quickSchema>;

  const boqForm = useForm<BoqValues>({
    resolver: zodResolver(boqSchema),
    defaultValues: {
      name: "",
      company: "",
      email: user?.email ?? "",
      phone: "",
      country: "",
      message: "",
    },
  });

  const quickForm = useForm<QuickValues>({
    resolver: zodResolver(quickSchema),
    defaultValues: {
      name: "",
      email: user?.email ?? "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      if (!boqForm.getValues("email")) {
        boqForm.setValue("email", user.email);
      }
      if (!quickForm.getValues("email")) {
        quickForm.setValue("email", user.email);
      }
    }
  }, [user?.email, boqForm, quickForm]);

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

  const onBoqSubmit = async (values: BoqValues) => {
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
        `${values.message}` +
        (values.country ? `${values.country}` : "") +
        (uploadedPaths.length ? `${uploadedPaths.join("\n")}` : "");

      const { error: insertErr } = await supabase.from("quote_requests").insert({
        contact_name: values.name,
        contact_email: values.email,
        contact_phone: values.phone ?? null,
        company: values.company ?? null,
        project_description: messageWithMeta,
        boq_file_path: uploadedPaths[0] ?? null,
        user_id: user?.id ?? null,
        status: "new",
      });
      if (insertErr) throw insertErr;

      // Trigger Brevo transactional email notifications (non-blocking)
      void sendQuoteEmailFn({
        data: {
          contactName: values.name,
          contactEmail: values.email,
          contactPhone: values.phone ?? undefined,
          company: values.company ?? undefined,
          country: values.country ?? undefined,
          projectDescription: messageWithMeta,
        },
      }).catch((err) => console.warn("[Brevo Email Trigger Error]:", err));

      toast.success("Proposal request submitted — we'll be in touch within 1 business day.");
      boqForm.reset({
        name: "",
        company: "",
        email: user?.email ?? "",
        phone: "",
        country: "",
        message: "",
      });
      setFiles([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setBoqSubmitting(false);
    }
  };

  const onQuickSubmit = async (values: QuickValues) => {
    setQuickSubmitting(true);
    try {
      const { error } = await supabase.from("quote_requests").insert({
        contact_name: values.name,
        contact_email: values.email,
        contact_phone: values.phone ?? null,
        company: null,
        project_description: `${values.message}`,
        boq_file_path: null,
        user_id: user?.id ?? null,
        status: "new",
      });
      if (error) throw error;

      // Trigger Brevo transactional email notifications (non-blocking)
      void sendContactEmailFn({
        data: {
          contactName: values.name,
          contactEmail: values.email,
          contactPhone: values.phone ?? undefined,
          message: `${values.message}`,
        },
      }).catch((err) => console.warn("[Brevo Email Trigger Error]:", err));

      toast.success("Inquiry sent — thank you!");
      quickForm.reset({
        name: "",
        email: user?.email ?? "",
        phone: "",
        message: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setQuickSubmitting(false);
    }
  };

  return (
    <section className="bg-background">
      <div className="container-page py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT: Project Experience */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <h2 className="font-display text-base font-bold uppercase tracking-wide mb-4">
              Project Experience In The Region
            </h2>
            <div className="flex flex-col gap-3">
              {projectExperience.slice(0, 3).map((c) => (
                <article
                  key={c.name}
                  className="flex gap-0 rounded border border-border bg-card overflow-hidden group hover:border-primary/40 transition-colors"
                >
                  <div
                    className="w-28 shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${c.image})` }}
                    role="img"
                    aria-label={c.name}
                  />
                  <div className="p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="font-display text-sm font-bold uppercase leading-tight">
                        {c.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
                        <span className="truncate">{c.location}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        {c.description}
                      </p>
                    </div>
                    {c.slug ? (
                      <Link
                        to="/projects/$slug"
                        params={{ slug: c.slug }}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-primary hover:underline"
                      >
                        View Case Study <ChevronRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <Link
                        to="/resources"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-primary hover:underline"
                      >
                        View Case Study <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: Forms */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* BOQ Upload Form */}
              <div id="boq-form">
                <div className="rounded border border-border bg-card p-5 md:p-6">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-5">
                    Upload Your BOQ / Drawings
                  </h2>
                  <Form {...boqForm}>
                    <form onSubmit={boqForm.handleSubmit(onBoqSubmit)} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={boqForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-0.5 text-muted-foreground">
                                Full Name <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input maxLength={120} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={boqForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Company
                              </FormLabel>
                              <FormControl>
                                <Input maxLength={160} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={boqForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-0.5 text-muted-foreground">
                                Email <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="email" maxLength={255} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={boqForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-0.5 text-muted-foreground">
                                Phone <span className="text-primary">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="tel" maxLength={40} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={boqForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Project Location / Country
                            </FormLabel>
                            <FormControl>
                              <Input maxLength={120} placeholder="Select country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={boqForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Message / Project Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                rows={3}
                                maxLength={2000}
                                placeholder="Tell us about your project..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <label className="block rounded border-2 border-dashed border-border bg-surface p-4 text-center cursor-pointer hover:border-primary transition">
                        <Upload className="h-6 w-6 text-primary mx-auto" />
                        <div className="mt-1.5 text-sm font-semibold">
                          Drag & drop your BOQ or drawings here
                        </div>
                        <div className="text-xs text-primary underline">
                          or click to browse files
                        </div>
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
                        className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide cursor-pointer"
                      >
                        {boqSubmitting ? "Submitting…" : "Submit & Get Proposal"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Quick Contact */}
              <aside id="quick-contact" className="space-y-4">
                <div className="rounded border border-border bg-card p-5 md:p-6">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-4">
                    Quick Contact
                  </h2>
                  <Form {...quickForm}>
                    <form onSubmit={quickForm.handleSubmit(onQuickSubmit)} className="space-y-3">
                      <FormField
                        control={quickForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-0.5 text-muted-foreground">
                              Full Name <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input maxLength={120} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={quickForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-0.5 text-muted-foreground">
                              Email <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="email" maxLength={255} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={quickForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Phone
                            </FormLabel>
                            <FormControl>
                              <Input type="tel" maxLength={40} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={quickForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Message <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                maxLength={2000}
                                placeholder="How can we help?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={quickSubmitting}
                        className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide cursor-pointer"
                      >
                        {quickSubmitting ? "Sending…" : "Send Inquiry"}
                      </Button>
                    </form>
                  </Form>
                </div>

                <div className="rounded bg-surface-dark text-surface-dark-foreground p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-surface-dark-foreground/70">
                    Need Immediate Assistance?
                  </div>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Phone className="h-4 w-4" />
                      </span>
                      <a
                        href={`tel:${headOffice.phone.replace(/\s+/g, "")}`}
                        className="hover:text-primary"
                      >
                        {headOffice.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <a
                        href={`https://wa.me/${headOffice.phone.replace(/\D/g, "")}`}
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
                      <a
                        href={`mailto:${headOffice.email}`}
                        className="hover:text-primary break-all"
                      >
                        {headOffice.email}
                      </a>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
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
