import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Inbox, Package, FileText, Users, LayoutTemplate, Search } from "lucide-react";

const ITEMS = [
  { to: "/admin" as const, label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/quotes" as const, label: "Quote Requests", icon: Inbox, exact: false },
  { to: "/admin/products" as const, label: "Products", icon: Package, exact: false },
  { to: "/admin/resources" as const, label: "Resources", icon: FileText, exact: false },
  { to: "/admin/site-builder" as const, label: "Site Builder", icon: LayoutTemplate, exact: false },
  { to: "/admin/pages-seo" as const, label: "Pages SEO", icon: Search, exact: false },
  { to: "/admin/users" as const, label: "Users & Roles", icon: Users, exact: false },
];

export function AdminNav() {
  const { pathname } = useLocation();
  return (
    <nav className="mb-8 flex flex-wrap gap-1 border-b border-border">
      {ITEMS.map((it) => {
        const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors -mb-px",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
