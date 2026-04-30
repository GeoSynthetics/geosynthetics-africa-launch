import { Award, ShieldCheck, Globe, Truck, ChevronDown } from "lucide-react";

const items = [
  { icon: Award, label: "IAGI Member", sub: "One of only 5 in Africa" },
  { icon: ShieldCheck, label: "B-BBEE Level 2", sub: "Proudly South African" },
  { icon: ShieldCheck, label: "QA/QC Certified", sub: "Tested. Assured. Certified." },
  { icon: Truck, label: "Pan-African Logistics", sub: "Supply to all African countries" },
];

export function TopBar() {
  return (
    <div className="bg-surface-dark text-surface-dark-foreground text-xs">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        <div className="hidden md:flex items-center gap-6 overflow-hidden">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 whitespace-nowrap opacity-90">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="md:hidden flex items-center gap-2 opacity-90">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span>Pan-African Geosynthetics Platform</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 opacity-90 hover:opacity-100 transition"
          aria-label="Language selector"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>EN</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
