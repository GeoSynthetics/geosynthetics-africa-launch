import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox, Package, FileText, Users, LayoutList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type CountableTile = {
  icon: React.ElementType;
  label: string;
  desc: string;
  to: "/admin/quotes" | "/admin/products" | "/admin/resources" | "/admin/users";
  table: "quote_requests" | "products" | "resources" | "profiles";
  countKey: string;
};

type StaticTile = {
  icon: React.ElementType;
  label: string;
  desc: string;
  to: "/admin/page-templates";
  staticBadge: string;
};

type Tile = CountableTile | StaticTile;

const TILES: Tile[] = [
  {
    icon: Inbox,
    label: "Quote Requests",
    desc: "Incoming BOQs and enquiries.",
    to: "/admin/quotes",
    table: "quote_requests",
    countKey: "quote_requests",
  },
  {
    icon: Package,
    label: "Products",
    desc: "Manage catalogue & specs.",
    to: "/admin/products",
    table: "products",
    countKey: "products",
  },
  {
    icon: FileText,
    label: "Resources",
    desc: "Datasheets, brochures, case studies.",
    to: "/admin/resources",
    table: "resources",
    countKey: "resources",
  },
  {
    icon: LayoutList,
    label: "Page Templates",
    desc: "Edit product category sub-page content.",
    to: "/admin/page-templates",
    staticBadge: "CMS",
  },
  {
    icon: Users,
    label: "Users & Roles",
    desc: "Grant staff/admin access.",
    to: "/admin/users",
    table: "profiles",
    countKey: "profiles",
  },
];

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const countableTiles = TILES.filter((t): t is CountableTile => "table" in t);
      const entries = await Promise.all(
        countableTiles.map(async (t) => {
          const { count, error } = await supabase
            .from(t.table)
            .select("*", { count: "exact", head: true });
          return [t.countKey, error ? null : (count ?? 0)] as const;
        }),
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TILES.map((t) => {
        const isStatic = "staticBadge" in t;
        const count = isStatic ? null : counts[(t as CountableTile).countKey];

        return (
          <Link
            key={t.label}
            to={t.to}
            className="group rounded border border-border bg-card p-5 hover:border-primary hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <t.icon className="h-6 w-6 text-primary" />
              {isStatic ? (
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {(t as StaticTile).staticBadge}
                </span>
              ) : count === undefined ? (
                <Skeleton className="h-6 w-10" />
              ) : (
                <span className="font-display text-2xl font-bold">{count ?? "—"}</span>
              )}
            </div>
            <div className="mt-3 font-display text-base font-bold uppercase group-hover:text-primary transition-colors">
              {t.label}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
          </Link>
        );
      })}
    </div>
  );
}
