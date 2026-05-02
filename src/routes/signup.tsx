import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Geosynthetics Africa" },
      { name: "description", content: "Create a contractor or customer account." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name required").max(120),
  company: z.string().trim().max(160).optional(),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/" });
  }, [loading, isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, company, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: parsed.data.fullName,
          company: parsed.data.company ?? null,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. Check your email to confirm.");
    navigate({ to: "/login" });
  };

  return (
    <section className="bg-surface min-h-[70vh] flex items-center">
      <div className="container-page max-w-md w-full py-16">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save quotes, track BOQs, and access gated technical resources.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded border border-border bg-card p-6">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="company">Company (optional)</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" required />
            <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters.</p>
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary-hover uppercase font-bold tracking-wide">
            {submitting ? "Creating…" : "Create Account"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
