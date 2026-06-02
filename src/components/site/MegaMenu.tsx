import { useState } from "react";
import { Link, type LinkComponentProps } from "@tanstack/react-router";

type AnyLinkProps = Omit<LinkComponentProps, "to" | "params"> & { to: string; params?: Record<string, string> };
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

function closeMenus() {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
import { useQuickQuote } from "@/hooks/use-quick-quote";
import {
  ChevronRight, BookOpen, Download, FileText, MessageCircle, PencilRuler, FileCheck, Upload,
  Layers, Grid3x3, Grid2x2, Hexagon, Sheet, Waves, Mountain, Wrench,
  Pickaxe, Droplets, Trash2, Construction, Sprout,
  Truck, HardHat, ClipboardCheck, Ship, LifeBuoy, Building2, Zap,
  Package, Globe, ShieldCheck,
} from "lucide-react";
import { megaMenus, type MegaMenuConfig, type MegaProductItem, type MegaFeatureItem } from "./mega-menu-data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Download, FileText, MessageCircle, PencilRuler, FileCheck, Upload,
  Layers, Grid3x3, Grid2x2, Hexagon, Sheet, Waves, Mountain, Wrench,
  Pickaxe, Droplets, Trash2, Construction, Sprout,
  Truck, HardHat, ClipboardCheck, Ship, LifeBuoy, Building2, Zap,
};

function MegaPanel({ config }: { config: MegaMenuConfig }) {
  const { open } = useQuickQuote();
  const { columns } = config;
  const [activeItem, setActiveItem] = useState(columns.primary[0]);

  const displayData = {
    secondaryTitle: activeItem?.content?.secondaryTitle || columns.secondaryTitle,
    secondary: activeItem?.content?.secondary || columns.secondary,
    featuredTitle: activeItem?.content?.featuredTitle || columns.featuredTitle,
    featuredKind: activeItem?.content?.featuredKind || columns.featuredKind,
    featured: activeItem?.content?.featured || columns.featured,
    quickActionsTitle: activeItem?.content?.quickActionsTitle || columns.quickActionsTitle,
    quickActions: activeItem?.content?.quickActions || columns.quickActions,
  };

  return (
    <div className="w-screen max-w-[1280px] bg-popover text-popover-foreground border-t border-border shadow-2xl">
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Primary list */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {columns.primaryTitle}
          </h4>
          <ul className="space-y-1">
            {columns.primary.map((item) => {
              const Icon = item.icon ? ICONS[item.icon] : undefined;
              const isActive = activeItem?.label === item.label;
              return (
                <li key={item.label} onMouseEnter={() => setActiveItem(item)}>
                  <RLink
                    to={item.to}
                    params={item.params}
                    onClick={closeMenus}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 ${isActive ? "bg-accent text-primary translate-x-1.5" : "text-foreground hover:bg-accent hover:text-primary hover:translate-x-1.5"
                      }`}
                  >
                    {Icon && <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"}`} />}
                    <span className="font-medium flex-1 transition-colors duration-300">{item.label}</span>
                    <ChevronRight className={`h-4 w-4 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                  </RLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Secondary list */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {displayData.secondaryTitle}
          </h4>
          <ul className="space-y-1">
            {displayData.secondary.map((item) => (
              <li key={item.label}>
                <RLink
                  to={item.to}
                  params={item.params}
                  onClick={closeMenus}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-300 hover:translate-x-1.5"
                >
                  {item.label}
                </RLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {activeItem?.label ? `Featured ${activeItem.label}` : displayData.featuredTitle}
          </h4>
          {displayData.featuredKind === "product" ? (
            <ul className="space-y-2">
              {(displayData.featured as MegaProductItem[]).map((p) => (
                <li key={p.label}>
                  <RLink
                    to={p.to}
                    params={p.params}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-all duration-300 group hover:translate-x-1.5"
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.label} className="h-12 w-12 flex-shrink-0 rounded object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="h-12 w-12 flex-shrink-0 rounded bg-surface flex items-center justify-center border border-border">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate transition-colors duration-300 group-hover:text-primary">{p.label}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{p.spec}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                  </RLink>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {(displayData.featured as MegaFeatureItem[]).map((f) => (
                <li key={f.title}>
                  <RLink to={f.to} params={f.params} onClick={closeMenus} className="flex gap-3 group transition-all duration-300 hover:translate-x-1.5">
                    <img
                      src={f.image}
                      alt=""
                      className="h-16 w-20 flex-shrink-0 rounded object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {f.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{f.description}</div>
                    </div>
                  </RLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {displayData.quickActionsTitle}
          </h4>
          <ul className="space-y-2">
            {displayData.quickActions.map((qa) => {
              const Icon = ICONS[qa.icon] ?? BookOpen;
              const isUploadBOQ = qa.title === "Upload Project BOQ";

              const actionContent = (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{qa.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{qa.description}</div>
                  </div>
                </>
              );

              if (isUploadBOQ) {
                return (
                  <li key={qa.title}>
                    <button
                      onClick={() => {
                        closeMenus();
                        open();
                      }}
                      className="w-full flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary hover:bg-accent bg-transparent transition-all duration-300 group cursor-pointer border-0 hover:translate-x-1.5"
                    >
                      {actionContent}
                    </button>
                  </li>
                );
              }

              return (
                <li key={qa.title}>
                  <RLink
                    to={qa.to}
                    params={qa.params}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary hover:bg-accent transition-all duration-300 group hover:translate-x-1.5"
                  >
                    {actionContent}
                  </RLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Delivery Model Strip */}
      <div className="border-t border-border bg-[#F9F9F6] dark:bg-[#1E1E1C] px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Block */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              How We Deliver
            </span>
            <div className="hidden lg:block h-6 w-px bg-border/80" />
          </div>

          {/* Steps Block */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-2 md:gap-x-4 lg:gap-x-6 text-xs md:text-sm text-foreground/90 font-semibold">
            {/* Step 1: Supply */}
            <RLink
              to="/services/$slug"
              params={{ slug: "supply" }}
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover/step:border-primary group-hover/step:bg-accent/10 transition-all duration-300">
                <Package className="h-4 w-4 text-primary transition-colors duration-300" />
              </div>
              <span>Supply</span>
            </RLink>

            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />

            {/* Step 2: Delivery */}
            <RLink
              to="/services/$slug"
              params={{ slug: "logistics" }}
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover/step:border-primary group-hover/step:bg-accent/10 transition-all duration-300">
                <Globe className="h-4 w-4 text-primary transition-colors duration-300" />
              </div>
              <span>30+ country delivery</span>
            </RLink>

            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />

            {/* Step 3: Installation */}
            <RLink
              to="/services/$slug"
              params={{ slug: "installation" }}
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover/step:border-primary group-hover/step:bg-accent/10 transition-all duration-300">
                <Wrench className="h-4 w-4 text-primary transition-colors duration-300" />
              </div>
              <span>IAGI-aligned installation</span>
            </RLink>

            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />

            {/* Step 4: Quality Control */}
            <RLink
              to="/quality-assurance"
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm group-hover/step:bg-primary-hover group-hover/step:scale-105 transition-all duration-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold text-primary">Quality assurance</span>
            </RLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MegaMenuPanels() {
  return megaMenus.map((m) => <MegaPanel key={m.key} config={m} />);
}

export { megaMenus };
export { MegaPanel };
