import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox, Package, FileText, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const TILES = [
  {
    icon: Inbox,
    label: "Quote Requests",
    desc: "Incoming BOQs and enquiries.",
    to: "/admin/quotes" as const,
    table: "quote_requests" as const,
  },
  {
    icon: Package,
    label: "Products",
    desc: "Manage catalogue & specs.",
    to: "/admin/products" as const,
    table: "products" as const,
  },
  {
    icon: FileText,
    label: "Resources",
    desc: "Datasheets, brochures, case studies.",
    to: "/admin/resources" as const,
    table: "resources" as const,
  },
  {
    icon: Users,
    label: "Users & Roles",
    desc: "Grant staff/admin access.",
    to: "/admin/users" as const,
    table: "profiles" as const,
  },
];

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        TILES.map(async (t) => {
          const { count, error } = await supabase
            .from(t.table)
            .select("*", { count: "exact", head: true });
          return [t.table, error ? null : count ?? 0] as const;
        }),
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {TILES.map((t) => {
        const c = counts[t.table];
        return (
          <Link
            key={t.label}
            to={t.to}
            className="group rounded border border-border bg-card p-5 hover:border-primary hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between">
              <t.icon className="h-6 w-6 text-primary" />
              {c === undefined ? (
                <Skeleton className="h-6 w-10" />
              ) : (
                <span className="font-display text-2xl font-bold">{c ?? "—"}</span>
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
