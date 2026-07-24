import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, User, Building2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/site/AuthLayout";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

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
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/" });
  }, [loading, isAuthenticated, navigate]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSubmitting(true);
    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: values.fullName,
          company: values.company || null,
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
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Create Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save quotes, track BOQs, and access gated technical resources.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-medium">Full name</FormLabel>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <FormControl>
                    <Input placeholder="John Doe" className="h-11 pl-10" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-medium">
                  Company <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </FormLabel>
                <div className="relative mt-1.5">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <FormControl>
                    <Input placeholder="Acme Construction Ltd." className="h-11 pl-10" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-medium">Email address</FormLabel>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      className="h-11 pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="h-11 pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Minimum 8 characters.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 bg-primary hover:bg-primary-hover hover:cursor-pointer uppercase font-bold tracking-wide transition-transform active:scale-[0.98]"
          >
            {submitting ? (
              "Creating…"
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground tracking-wider">or</span>
        </div>
      </div>

      {/* Footer link */}
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline inline-flex items-center gap-1 transition-colors"
        >
          Sign in
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </AuthLayout>
  );
}
