import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Inbox, Package, FileText, Users } from "lucide-react";

const ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/quotes", label: "Quote Requests", icon: Inbox },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/resources", label: "Resources", icon: FileText },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
] as const;

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
