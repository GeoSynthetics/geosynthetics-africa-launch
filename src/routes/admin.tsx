import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Geosynthetics Africa" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: location.href } });
    }
  }, [loading, isAuthenticated, navigate, location.href]);

  if (loading) {
    return (
      <div className="container-page py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
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
    <section className="bg-surface min-h-[70vh]">
      <div className="container-page py-10">
        <header className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary">Admin</div>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight">Control Panel</h1>
        </header>
        <Outlet />
      </div>
    </section>
  );
}
