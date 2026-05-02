import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Package, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const TILES = [
  { icon: Inbox, label: "Quote Requests", desc: "Incoming BOQs and enquiries.", href: "#" },
  { icon: Package, label: "Products", desc: "Manage catalogue & specs.", href: "#" },
  { icon: FileText, label: "Resources", desc: "Datasheets, brochures, case studies.", href: "#" },
  { icon: Users, label: "Users & Roles", desc: "Grant staff/admin access.", href: "#" },
];

function AdminDashboard() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {TILES.map((t) => (
        <div key={t.label} className="rounded border border-border bg-card p-5">
          <t.icon className="h-6 w-6 text-primary" />
          <div className="mt-3 font-display text-base font-bold uppercase">{t.label}</div>
          <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
        </div>
      ))}
    </div>
  );
}
