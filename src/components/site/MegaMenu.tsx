import { useState } from "react";
import { Link, type LinkComponentProps } from "@tanstack/react-router";

type AnyLinkProps = Omit<LinkComponentProps, "to"> & { to: string; params?: Record<string, string> };
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

function closeMenus() {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
import {
  ChevronRight, BookOpen, Download, FileText, MessageCircle, PencilRuler, FileCheck, Upload,
  Layers, Grid3x3, Grid2x2, Hexagon, Sheet, Waves, Mountain, Wrench,
  Pickaxe, Droplets, Trash2, Construction, Sprout,
  Truck, HardHat, ClipboardCheck, Ship, LifeBuoy, Building2, Zap,
} from "lucide-react";
import { megaMenus, PARTNER_LOGOS, type MegaMenuConfig, type MegaProductItem, type MegaFeatureItem } from "./mega-menu-data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Download, FileText, MessageCircle, PencilRuler, FileCheck, Upload,
  Layers, Grid3x3, Grid2x2, Hexagon, Sheet, Waves, Mountain, Wrench,
  Pickaxe, Droplets, Trash2, Construction, Sprout,
  Truck, HardHat, ClipboardCheck, Ship, LifeBuoy, Building2, Zap,
};

function MegaPanel({ config }: { config: MegaMenuConfig }) {
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
                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                      isActive ? "bg-accent text-primary" : "text-foreground hover:bg-accent hover:text-primary"
                    }`}
                  >
                    {Icon && <Icon className={`h-4 w-4 transition ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />}
                    <span className="font-medium flex-1">{item.label}</span>
                    <ChevronRight className={`h-4 w-4 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
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
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition"
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
            {displayData.featuredTitle}
          </h4>
          {displayData.featuredKind === "product" ? (
            <ul className="space-y-2">
              {(displayData.featured as MegaProductItem[]).map((p) => (
                <li key={p.label}>
                  <RLink
                    to={p.to}
                    params={p.params}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition group"
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded bg-surface-dark" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.spec}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </RLink>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {(displayData.featured as MegaFeatureItem[]).map((f) => (
                <li key={f.title}>
                  <RLink to={f.to} params={f.params} onClick={closeMenus} className="flex gap-3 group">
                    <img
                      src={f.image}
                      alt=""
                      className="h-16 w-20 flex-shrink-0 rounded object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition">
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
              return (
                <li key={qa.title}>
                  <RLink
                    to={qa.to}
                    params={qa.params}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary hover:bg-accent transition group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{qa.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{qa.description}</div>
                    </div>
                  </RLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Partner strip */}
      <div className="border-t border-border bg-surface px-8 py-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground">
            Global Best-in-Class Materials
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {PARTNER_LOGOS.map((p) => (
              <span
                key={p.name}
                className="flex items-center justify-center h-6"
              >
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition"
                />
              </span>
            ))}
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
