import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign In — Geosynthetics Africa" },
      { name: "description", content: "Sign in to access your contractor or customer account." },
    ],
  }),
  component: LoginPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: search.redirect ?? "/" });
    }
  }, [loading, isAuthenticated, navigate, search.redirect]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in.");
    navigate({ to: search.redirect ?? "/" });
  };

  return (
    <section className="bg-surface min-h-[70vh] flex items-center">
      <div className="container-page max-w-md w-full py-16">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Sign In</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access your contractor or customer account.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded border border-border bg-card p-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            No account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
