import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function AuthenticatingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-auth-fade-in">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <div className="text-center space-y-1">
        <p className="font-display text-lg font-bold uppercase tracking-tight">
          Signing you in
        </p>
        <p className="text-sm text-muted-foreground">
          Loading your dashboard…
        </p>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const { isAuthenticated, loading, rolesLoaded, isStaff } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle already-authenticated users arriving on /login directly
  useEffect(() => {
    if (!loading && isAuthenticated && rolesLoaded && !submitting) {
      const destination = search.redirect || (isStaff ? "/admin" : "/catalogue");
      void navigate({ to: destination });
    }
  }, [loading, isAuthenticated, rolesLoaded, isStaff, search.redirect, navigate, submitting]);

  const onSubmit = async (values: z.infer<typeof credentialsSchema>) => {
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setSubmitting(false);
      toast.error(error.message);
      return;
    }

    toast.success("Signed in successfully.");

    // Resolve user roles immediately to determine destination
    let userIsStaff = false;
    if (data.user) {
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const roles = rolesData?.map((r) => r.role) || [];
      userIsStaff = roles.includes("staff") || roles.includes("admin");
    }

    const destination = search.redirect || (userIsStaff ? "/admin" : "/catalogue");
    await navigate({ to: destination });
  };

  const showAuthenticatingOverlay = submitting || (!loading && isAuthenticated);

  return (
    <AuthLayout>
      {showAuthenticatingOverlay ? (
        <AuthenticatingOverlay />
      ) : (
        <>
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Sign In</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your contractor or customer account.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-11 pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-primary hover:bg-primary-hover hover:cursor-pointer uppercase font-bold tracking-wide transition-transform active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
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
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Create one
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}

