import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/AdminNav";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { AdminFloatingThemeToggle } from "@/components/admin/AdminFloatingThemeToggle";

function AdminLayoutSkeleton() {
  return (
    <section className="bg-surface min-h-[70vh] animate-pulse">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {/* Nav Skeleton (Desktop) */}
          <aside className="hidden lg:flex flex-col shrink-0 w-64 bg-card/85 border border-border/50 rounded-2xl p-4 h-[calc(100vh-8rem)] min-h-[600px] space-y-6">
            <div className="flex items-center gap-3 px-2 py-3 border-b border-border/50 pb-4">
              <Skeleton className="h-10 w-10 rounded-xl bg-primary/20" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-12 bg-primary/20" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 group/item">
                  <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-3.5 group/item">
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </aside>

          {/* Mobile Nav Skeleton */}
          <div className="lg:hidden w-full flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg bg-primary/20" />
              <div className="space-y-1">
                <Skeleton className="h-2 w-8 bg-primary/20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 w-full min-w-0 bg-card border border-border/50 rounded-2xl p-4 md:p-6 lg:p-8 min-h-[600px] shadow-sm space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="border-t border-border/50 pt-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full rounded-xl border border-border/50 animate-pulse" />
                <Skeleton className="h-32 w-full rounded-xl border border-border/50 animate-pulse" />
                <Skeleton className="h-32 w-full rounded-xl border border-border/50 animate-pulse" />
              </div>
              <div className="space-y-3 pt-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id);

    const roles = rolesData?.map((r) => r.role) || [];
    const isStaff = roles.includes("staff") || roles.includes("admin");

    if (!isStaff) {
      throw redirect({
        to: "/",
      });
    }
  },
  head: () => ({
    meta: [{ title: "Admin — Geosynthetics Africa" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: AdminLayoutSkeleton,
  pendingMs: 0,
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, rolesLoaded, isAuthenticated, isStaff } = useAuth();

  if (loading || !rolesLoaded) {
    return <AdminLayoutSkeleton />;
  }

  if (!isAuthenticated) return null;

  if (!isStaff) {
    return (
      <section className="container-page py-20 text-center max-w-md">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-display text-2xl font-bold uppercase">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn't have staff or admin privileges.
        </p>
        <Button asChild className="mt-6 bg-primary hover:bg-primary-hover">
          <Link to="/">Back to Home</Link>
        </Button>
      </section>
    );
  }

  return (
    <AdminThemeProvider>
      <section className="bg-surface min-h-[70vh] relative">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
            <AdminNav />
            <div className="flex-1 w-full min-w-0 bg-card border border-border/50 rounded-2xl p-4 md:p-6 lg:p-8 min-h-[600px] shadow-sm">
              <Outlet />
            </div>
          </div>
        </div>
        <AdminFloatingThemeToggle />
      </section>
    </AdminThemeProvider>
  );
}
