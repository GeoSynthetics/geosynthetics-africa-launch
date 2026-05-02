import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsersAdmin,
});

const ALL_ROLES: AppRole[] = ["admin", "staff", "contractor", "customer", "viewer"];

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  created_at: string | null;
}

interface UserRoleRow {
  user_id: string;
  role: AppRole;
}

const ROLE_STYLE: Record<AppRole, string> = {
  admin: "bg-destructive/15 text-destructive border-destructive/30",
  staff: "bg-primary/15 text-primary border-primary/30",
  contractor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  customer: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  viewer: "bg-muted text-muted-foreground border-border",
};

function UsersAdmin() {
  const { isAdmin, user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [p, r] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, company, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (p.error) toast.error(p.error.message);
    if (r.error) toast.error(r.error.message);
    setProfiles((p.data ?? []) as Profile[]);
    setRoles((r.data ?? []) as UserRoleRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const rolesByUser = useMemo(() => {
    const m = new Map<string, AppRole[]>();
    for (const row of roles) {
      const arr = m.get(row.user_id) ?? [];
      arr.push(row.role);
      m.set(row.user_id, arr);
    }
    return m;
  }, [roles]);

  const filtered = useMemo(() => {
    if (!q.trim()) return profiles;
    const n = q.toLowerCase();
    return profiles.filter(
      (p) =>
        (p.email ?? "").toLowerCase().includes(n) ||
        (p.full_name ?? "").toLowerCase().includes(n) ||
        (p.company ?? "").toLowerCase().includes(n),
    );
  }, [profiles, q]);

  const grant = async (userId: string, role: AppRole) => {
    setBusy(`${userId}:${role}:add`);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRoles((r) => [...r, { user_id: userId, role }]);
    toast.success(`Granted ${role}`);
  };

  const revoke = async (userId: string, role: AppRole) => {
    if (userId === currentUser?.id && role === "admin") {
      if (!confirm("Remove your OWN admin role? You may lose access.")) return;
    }
    setBusy(`${userId}:${role}:rm`);
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRoles((r) => r.filter((x) => !(x.user_id === userId && x.role === role)));
    toast.success(`Removed ${role}`);
  };

  if (!isAdmin) {
    return (
      <div className="rounded border border-border bg-card p-8 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          Only administrators can manage user roles.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, company"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} of {profiles.length} users
        </div>
      </div>

      <div className="rounded border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Grant role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              filtered.map((p) => {
                const userRoles = rolesByUser.get(p.id) ?? [];
                const remaining = ALL_ROLES.filter((r) => !userRoles.includes(r));
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-semibold">{p.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{p.email ?? p.id}</div>
                    </TableCell>
                    <TableCell className="text-sm">{p.company ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userRoles.length === 0 && (
                          <span className="text-xs text-muted-foreground">No roles</span>
                        )}
                        {userRoles.map((r) => (
                          <Badge key={r} variant="outline" className={`gap-1 ${ROLE_STYLE[r]}`}>
                            {r}
                            <button
                              type="button"
                              onClick={() => void revoke(p.id, r)}
                              disabled={busy === `${p.id}:${r}:rm`}
                              className="ml-0.5 rounded-full hover:bg-background/40"
                              aria-label={`Remove ${r}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {remaining.map((r) => (
                          <Button
                            key={r}
                            size="sm"
                            variant="outline"
                            disabled={busy === `${p.id}:${r}:add`}
                            onClick={() => void grant(p.id, r)}
                            className="h-6 px-2 text-xs"
                          >
                            + {r}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Note: Only signed-up users with profile records appear here. Users authenticate via the signup page; granting them a role takes effect immediately on their next page load.
      </p>
    </div>
  );
}
