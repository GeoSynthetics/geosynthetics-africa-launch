import { Link, useLoaderData } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
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
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const HERO_IMG =
  "/src/assets/contact-page-hero.png";

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

const REGIONAL_LOCATIONS = [
  {
    country: "South Africa",
    title: "Johannesburg Head Office",
    subtitle: "Southern Africa Regional Hub",
    coords: [-26.2041, 28.0473] as [number, number],
    address: "7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, 2191",
    phone: "+27 78 1355 926",
    email: "sales@geosynthetics.co.za",
    services: "Full Supply, Installation & QA/QC Hub",
  },
  {
    country: "Botswana",
    title: "Botswana Logistics Hub",
    subtitle: "Gaborone Distribution Center",
    coords: [-24.6282, 25.9231] as [number, number],
    address: "Plot 22017, Gaborone West Industrial, Gaborone",
    phone: "+27 78 1355 926",
    email: "botswana@geosynthetics.co.za",
    services: "Material Supply & Cross-Border Logistics",
  },
  {
    country: "Namibia",
    title: "Namibia Logistics Hub",
    subtitle: "Windhoek Distribution Center",
    coords: [-22.5609, 17.0658] as [number, number],
    address: "12 Edison Street, Southern Industrial Area, Windhoek",
    phone: "+27 78 1355 926",
    email: "namibia@geosynthetics.co.za",
    services: "Material Supply & QA/QC Support",
  },
  {
    country: "Zimbabwe",
    title: "Zimbabwe Operations Hub",
    subtitle: "Harare Office",
    coords: [-17.8252, 31.0335] as [number, number],
    address: "55 Coventry Road, Workington, Harare",
    phone: "+27 78 1355 926",
    email: "zimbabwe@geosynthetics.co.za",
    services: "Lining Installation & Technical Support",
  },
  {
    country: "Mozambique",
    title: "Mozambique Regional Hub",
    subtitle: "Maputo Office",
    coords: [-25.9692, 32.5732] as [number, number],
    address: "Avenida de Moçambique, Bairro do Jardim, Maputo",
    phone: "+27 78 1355 926",
    email: "mozambique@geosynthetics.co.za",
    services: "Coastal Works Supply & Installation QA/QC",
  },
  {
    country: "Zambia",
    title: "Zambia & DRC Hub",
    subtitle: "Lusaka Office",
    coords: [-15.3875, 28.3228] as [number, number],
    address: "Stand 10432, Katanga Road, Industrial Area, Lusaka",
    phone: "+27 78 1355 926",
    email: "zambia@geosynthetics.co.za",
    services: "Mining TSF Lining & Cross-Border Cleared Supply",
  },
];

const REGIONAL_DETAILS = {
  "South Africa": {
    flag: "🇿🇦",
    code: "RSA",
    hub: "Johannesburg (HQ)",
    transit: "Same day / Next day dispatch",
    description: "Our primary manufacturing, warehousing, and QA/QC hub. We manage large-scale manufacturing, custom lining fabrication, and coordinate all cross-border engineering teams.",
    routes: "Direct distribution across all 9 provinces.",
    stats: "500K+ m² installed · ISO 9001 QA/QC",
    services: ["Material Supply", "HDPE Liner Installation", "QA/QC Testing", "Technical Support"]
  },
  "Botswana": {
    flag: "🇧🇼",
    code: "BWA",
    hub: "Gaborone Logistics Hub",
    transit: "2 - 3 Days (Road Freight)",
    description: "Supporting major diamond, copper, and iron ore mining operations. We handle advance customs clearances (SAD500) to ensure seamless material deliveries via Tlokweng/Pioneer Gate.",
    routes: "Johannesburg → Pioneer Gate / Tlokweng → Gaborone",
    stats: "Ikongwe Iron Ore & Lucara Diamond projects",
    services: ["Material Supply", "Cross-Border Logistics", "HDPE Liner Installation", "On-site QA/QC"]
  },
  "Namibia": {
    flag: "🇳🇦",
    code: "NAM",
    hub: "Windhoek Hub",
    transit: "3 - 4 Days (Road Freight)",
    description: "Key supply route for uranium mines, marine civil works, and water conservation reservoirs. Logistics managed via the Trans-Kalahari Corridor.",
    routes: "Johannesburg → Trans-Kalahari Corridor → Windhoek",
    stats: "Husab Uranium & Swakopmund water projects",
    services: ["Material Supply", "Logistics & Customs", "QA/QC Testing"]
  },
  "Zimbabwe": {
    flag: "🇿🇼",
    code: "ZWE",
    hub: "Harare Hub",
    transit: "3 - 5 Days (Road Freight)",
    description: "Serving agriculture, gold mining, and waste water treatment facilities. Full logistics support through Beitbridge border clearance with pre-scanned digital customs packs.",
    routes: "Johannesburg → Beitbridge → Harare / Bulawayo",
    stats: "Great Dyke platinum and agricultural reservoirs",
    services: ["Material Supply", "HDPE Liner Installation", "Technical Support"]
  },
  "Mozambique": {
    flag: "🇲🇿",
    code: "MOZ",
    hub: "Maputo Hub",
    transit: "2 - 3 Days (Road Freight)",
    description: "Critical support for port infrastructure, coal mining, and coastal containment barriers. Specialized GCL (Geosynthetic Clay Liner) and geotextile supply for erosion control.",
    routes: "Johannesburg → Lebombo / Ressano Garcia → Maputo",
    stats: "Nacala Corridor and Maputo Port projects",
    services: ["Material Supply", "Logistics & Export", "QA/QC Support"]
  },
  "Zambia": {
    flag: "🇿🇲",
    code: "ZMB",
    hub: "Lusaka Hub",
    transit: "4 - 6 Days (Road Freight)",
    description: "Serving the Copperbelt mining sector and large-scale agricultural projects. Coordinates cross-border transit towards DRC (Kolwezi) with full COMESA documentation.",
    routes: "Johannesburg → Martins Drift (Botswana) → Kazungula / Chirundu → Lusaka",
    stats: "Copperbelt TSF lining & Kazungula bridge routes",
    services: ["Material Supply", "HDPE Liner Installation", "Logistics & Export"]
  }
};

function RegionalMap({
  selectedCountry,
  onSelectCountry,
}: {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
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
      .custom-leaflet-popup .leaflet-popup-content-wrapper {
        background: oklch(1 0 0);
        color: oklch(0.18 0.01 260);
        border: 1px solid oklch(0.91 0.005 260);
        border-radius: 6px;
        padding: 4px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      .custom-leaflet-popup .leaflet-popup-tip {
        background: oklch(1 0 0);
        border: 1px solid oklch(0.91 0.005 260);
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

    REGIONAL_LOCATIONS.forEach((loc) => {
      const marker = L.marker(loc.coords, { icon: customMarkerIcon }).addTo(map);

      const popupContent = `
        <div style="font-family: sans-serif; width: 220px; text-transform: none;">
          <div style="font-size: 11px; font-weight: bold; color: ${pinColor}; text-transform: uppercase; letter-spacing: 0.05em;">${loc.country}</div>
          <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin-top: 2px; line-height: 1.2;">${loc.title}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 1px; font-style: italic;">${loc.subtitle}</div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 8px 0;" />
          <div style="font-size: 11px; line-height: 1.4; color: #374151;">
            <strong>Services:</strong> ${loc.services}<br/>
            <strong>Address:</strong> ${loc.address}<br/>
            <strong>Phone:</strong> <a href="tel:${loc.phone.replace(/\s+/g, "")}" style="color: ${pinColor}; text-decoration: none; font-weight: bold;">${loc.phone}</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "custom-leaflet-popup",
        closeButton: false,
      });

      marker.on("click", () => {
        onSelectCountry(loc.country);
      });

      markersRef.current[loc.country] = marker;
    });

    return () => {
      map.remove();
      document.head.removeChild(styleEl);
    };
  }, [L]);

  useEffect(() => {
    const map = leafletInstanceRef.current;
    if (!map || !L || !selectedCountry) return;

    const loc = REGIONAL_LOCATIONS.find((l) => l.country === selectedCountry);
    const marker = markersRef.current[selectedCountry];

    if (loc && marker) {
      map.setView(loc.coords, 6, { animate: true, duration: 1 });
      marker.openPopup();
    }
  }, [selectedCountry, L]);

  if (!L) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground gap-3">
        <MapPin className="h-8 w-8 text-primary animate-pulse" />
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loading Regional Map...</div>
      </div>
    );
  }

  return <div ref={mapRef} className="absolute inset-0 h-full w-full" />;
}

export function ContactsPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("South Africa");

  return (
    <>
      <ContactsHero />
      <OfficeAndMap selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
      <ServicesAndCoverage selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
      <FormsBlock />
      <ResourceStrip />
    </>
  );
}

/* -------------------- Hero -------------------- */
function ContactsHero() {
  return (
    <section
      className="relative overflow-hidden bg-surface-dark text-surface-dark-foreground"
      style={{ minHeight: "420px" }}
    >
      {/* Full-bleed background image with left-heavy gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      {/* Gradient overlay ΓÇö strong on the left, fades out right so building shows clearly */}
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
            { label: "Johannesburg Head Office" },
          ]}
          variant="contacts"
        />

        {/* Left-side content ΓÇö constrained to ~55% so building photo shows on right */}
        <div className="max-w-[58%] md:max-w-[52%]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
            Contact Us
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold uppercase leading-[0.92] tracking-tight">
            Johannesburg
            <br />
            Head Office
          </h1>
          <p className="mt-3 font-display text-lg md:text-xl uppercase tracking-wide text-surface-dark-foreground/90">
            Southern Africa Regional Hub
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-dark-foreground/80">
            {["Supply", "Installation", "QA/QC", "Logistics"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-primary" />}
                {s}
              </span>
            ))}
          </p>
          <p className="mt-2 text-sm text-surface-dark-foreground/75 max-w-sm">
            Proudly serving Southern Africa and cross-border projects.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-xl">
            {HERO_BADGES.map(({ icon: Icon, title, subtitle }) => (
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
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#boq-form"
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-hover transition"
            >
              <Upload className="h-3.5 w-3.5" /> Upload Project BOQ
            </a>
            <a
              href={`tel:${HEAD_OFFICE.phone.replace(/\s+/g, "")}`}
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

      {/* Map card ΓÇö absolute, bottom-right, overlapping the building. Hidden on mobile. */}
      <div className="hidden lg:block absolute bottom-0 right-6 xl:right-12 w-64 shadow-2xl rounded-t-md overflow-hidden border border-surface-dark-foreground/15">
        <div className="relative h-44">
          <iframe
            title="Johannesburg Head Office map preview"
            src={MAP_EMBED}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="bg-card text-card-foreground px-4 py-3 flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <div className="text-xs">
            <div className="font-display font-bold uppercase tracking-wide">Johannesburg</div>
            <div className="text-muted-foreground">Head Office</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Office details + Map -------------------- */
function OfficeAndMap({
  selectedCountry,
  onSelectCountry,
}: {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}) {
  const activeLoc = REGIONAL_LOCATIONS.find((l) => l.country === selectedCountry) || REGIONAL_LOCATIONS[0];

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
          <div className="rounded border border-border overflow-hidden bg-card relative">
            <div className="relative h-[390px] w-full">
              <RegionalMap selectedCountry={selectedCountry} onSelectCountry={onSelectCountry} />
              
              {/* Dynamic floating detail card */}
              <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm text-card-foreground rounded border border-border shadow-lg p-3.5 max-w-[260px] text-xs z-[1000] pointer-events-auto transition-all duration-300">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{activeLoc.country} Presence</div>
                <div className="font-display font-bold text-sm uppercase mt-0.5 leading-snug">{activeLoc.title}</div>
                <div className="mt-1.5 text-muted-foreground">
                  <div>{activeLoc.address}</div>
                </div>
                <div className="mt-2.5 space-y-1 pt-2 border-t border-border/60 text-[11px]">
                  <div className="font-semibold text-foreground leading-snug">{activeLoc.services}</div>
                  <a href={`tel:${activeLoc.phone.replace(/\s+/g, "")}`} className="flex items-center gap-1.5 text-primary hover:underline font-medium mt-1">
                    <Phone className="h-3 w-3 shrink-0" /> {activeLoc.phone}
                  </a>
                  <a href={`mailto:${activeLoc.email}`} className="flex items-center gap-1.5 text-primary hover:underline font-medium break-all">
                    <Mail className="h-3 w-3 shrink-0" /> {activeLoc.email}
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

function ServicesAndCoverage({
  selectedCountry,
  onSelectCountry,
}: {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}) {
  const activeDetails = REGIONAL_DETAILS[selectedCountry as keyof typeof REGIONAL_DETAILS] || REGIONAL_DETAILS["South Africa"];

  return (
    <section className="bg-surface">
      <div className="container-page py-14 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
            Services Available From This Office
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

        <div className="lg:col-span-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide mb-5">
            Regional Coverage
          </h2>
          <div className="rounded border border-border bg-card p-6 grid md:grid-cols-12 gap-6 min-h-[340px]">
            {/* Left side: Interactive Country Details Dashboard */}
            <div className="md:col-span-7 flex flex-col justify-between bg-surface border border-border rounded p-5">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-bounce-subtle" role="img" aria-label={selectedCountry}>
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
                  {activeDetails.services.map((svc) => (
                    <span key={svc} className="text-[10px] bg-card border border-border px-2 py-0.5 rounded font-medium text-foreground/80">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Country Selector buttons */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="font-semibold text-muted-foreground uppercase text-[10px] block tracking-wide mb-2">
                  Select a Region
                </span>
                {REGIONAL_COVERAGE.map((c) => {
                  const isSelected = c === selectedCountry;
                  const details = REGIONAL_DETAILS[c as keyof typeof REGIONAL_DETAILS] || REGIONAL_DETAILS["South Africa"];
                  return (
                    <button
                      key={c}
                      onClick={() => onSelectCountry(c)}
                      className={`w-full flex items-center justify-between p-3 rounded border text-left text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground shadow-md scale-[1.02]"
                          : "bg-card border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{details.flag}</span>
                        <span>{c}</span>
                      </span>
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary-foreground" : "text-primary opacity-60"}`} />
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

  const { caseStudies = [] } = useLoaderData({ from: "/contacts" }) as { caseStudies?: any[] } || {};

  // Map database projects if available, otherwise fall back to static CASE_STUDIES
  const projectExperience = caseStudies.length > 0
    ? caseStudies.map((cs) => ({
        name: cs.title,
        location: cs.location && cs.country ? `${cs.location}, ${cs.country}` : (cs.location || cs.country || ""),
        description: cs.summary || "",
        image: cs.hero_image_url || "",
        slug: cs.slug,
      }))
    : CASE_STUDIES;

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
        project_description: messageWithMeta,
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
        project_description: `[quick contact]\n${parsed.data.message}`,
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
    <section className="bg-background">
      <div className="container-page py-12">
        {/* 3-column layout: Case Studies | BOQ Form | Quick Contact */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT: Project Experience / Case Studies ΓÇö compact horizontal cards */}
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
                  {/* Thumbnail */}
                  <div
                    className="w-28 shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${c.image})` }}
                    role="img"
                    aria-label={c.name}
                  />
                  {/* Content */}
                  <div className="p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="font-display text-sm font-bold uppercase leading-tight">{c.name}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 text-primary shrink-0" />
                        <span className="truncate">{c.location}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">{c.description}</p>
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

          {/* RIGHT: 2-column sub-grid ΓÇö BOQ Form + Quick Contact side-by-side */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="grid lg:grid-cols-2 gap-6 items-start">

              {/* RIGHT-LEFT: BOQ Upload Form */}
              <div id="boq-form">
                <div className="rounded border border-border bg-card p-5 md:p-6">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-5">
                    Upload Your BOQ / Drawings
                  </h2>
                  <form onSubmit={onBoqSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field id="name" label="Full Name" required>
                        <Input id="name" name="name" required maxLength={120} />
                      </Field>
                      <Field id="company" label="Company">
                        <Input id="company" name="company" maxLength={160} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                        rows={3}
                        required
                        maxLength={2000}
                        placeholder="Tell us about your project..."
                      />
                    </Field>

                    <label className="block rounded border-2 border-dashed border-border bg-surface p-4 text-center cursor-pointer hover:border-primary transition">
                      <Upload className="h-6 w-6 text-primary mx-auto" />
                      <div className="mt-1.5 text-sm font-semibold">
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

              {/* RIGHT-RIGHT: Quick Contact + Immediate Assistance */}
              <aside id="quick-contact" className="space-y-4">
                <div className="rounded border border-border bg-card p-5 md:p-6">
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-4">
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
          </div>

        </div>
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
