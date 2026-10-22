import { forwardRef, type ComponentType } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { STATIC_ICONS } from "./static-icons";

/**
 * Turns an icon name chosen in the admin (e.g. "ShieldCheck", "LucideTruck",
 * "Building2Icon") into an icon component.
 *
 * Icons the site already uses are bundled (see static-icons.ts) and render on
 * the server. Any other Lucide icon is fetched on its own when a page needs it,
 * so visitors no longer download all ~1,900 icons up front.
 */

const KNOWN = new Set<string>(iconNames);
const lazyCache = new Map<string, LucideIcon>();

/** "LucideShieldCheck" / "ShieldCheckIcon" -> "ShieldCheck" */
export function baseIconName(name: string): string {
  return name
    .trim()
    .replace(/^Lucide(?=[A-Z])/, "")
    .replace(/(?<=.)Icon$/, "");
}

/** "CheckCircle2" -> "check-circle-2", "Grid3X3" -> "grid-3-x-3", "Grid3x3" -> "grid-3x3" */
export function kebabIconName(base: string): string | undefined {
  const candidates = [
    base
      .replace(/([a-z])([A-Z0-9])/g, "$1-$2")
      .replace(/([0-9])([A-Z])/g, "$1-$2")
      .toLowerCase(),
    base.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  ];
  return candidates.find((c) => KNOWN.has(c));
}

function lazyIcon(kebab: string): LucideIcon {
  let Icon = lazyCache.get(kebab);
  if (!Icon) {
    Icon = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
      <DynamicIcon {...(props as object)} ref={ref} name={kebab as never} />
    )) as unknown as LucideIcon;
    Icon.displayName = `LazyIcon(${kebab})`;
    lazyCache.set(kebab, Icon);
  }
  return Icon;
}

export function resolveIcon<F extends ComponentType<any>>(
  name: string | null | undefined,
  fallback: F,
): F | LucideIcon {
  if (!name || typeof name !== "string") return fallback;
  const base = baseIconName(name);
  const bundled = STATIC_ICONS[base];
  if (bundled) return bundled;
  const kebab = kebabIconName(base);
  return kebab ? lazyIcon(kebab) : fallback;
}
