import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Loader2, BarChart2, Tag, ShieldAlert } from "lucide-react";

// Module-level in-memory cache to keep data across route transitions / remounts
let trackingConfigCache: { googleAnalyticsId?: string; googleTagManagerId?: string } | null = null;

export function TrackingBuilderTab() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(() => trackingConfigCache?.googleAnalyticsId || "");
  const [googleTagManagerId, setGoogleTagManagerId] = useState(() => trackingConfigCache?.googleTagManagerId || "");
  const [loading, setLoading] = useState(!trackingConfigCache);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTrackingConfig() {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "tracking_config")
          .maybeSingle();

        if (error) throw error;

        if (data && data.value) {
          const config = data.value as { googleAnalyticsId?: string; googleTagManagerId?: string };
          setGoogleAnalyticsId(config.googleAnalyticsId || "");
          setGoogleTagManagerId(config.googleTagManagerId || "");
          trackingConfigCache = config;
        }
      } catch (err: any) {
        toast.error("Failed to load tracking config: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTrackingConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const configValue = {
        googleAnalyticsId: googleAnalyticsId.trim(),
        googleTagManagerId: googleTagManagerId.trim(),
      };

      const { error } = await supabase
        .from("site_config")
        .upsert(
          { key: "tracking_config", value: configValue },
          { onConflict: "key" }
        );

      if (error) throw error;
      trackingConfigCache = configValue; // Update the cache
      toast.success("Tracking configuration saved successfully.");
    } catch (err: any) {
      toast.error("Failed to save tracking config: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-3">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading tracking settings…
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
          Tracking & Cookies Integration
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your Google Analytics and Google Tag Manager credentials. These tracking platforms will be loaded dynamically in compliance with visitors' selected cookie preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Google Analytics Card */}
          <Card className="relative overflow-hidden border border-border/80 bg-background/50 backdrop-blur-sm shadow-md hover:border-primary/20 transition-all duration-300 group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300" />
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <BarChart2 className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold uppercase tracking-wider font-display">
                  Google Analytics 4
                </CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Connect your GA4 account to measure user engagement, traffic trends, and conversion metrics on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ga-id" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  GA4 Measurement ID
                </Label>
                <Input
                  id="ga-id"
                  placeholder="e.g. G-XXXXXXXXXX"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="bg-background/80 border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono text-sm"
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Found in your GA4 Admin panel under <span className="font-semibold text-foreground">Data Streams</span> &gt; <span className="font-semibold text-foreground">Web Stream Details</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Google Tag Manager Card */}
          <Card className="relative overflow-hidden border border-border/80 bg-background/50 backdrop-blur-sm shadow-md hover:border-primary/20 transition-all duration-300 group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300" />
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Tag className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold uppercase tracking-wider font-display">
                  Google Tag Manager
                </CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Inject a container to load tag deployments, custom tracking codes, and pixel management without changing code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gtm-id" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  GTM Container ID
                </Label>
                <Input
                  id="gtm-id"
                  placeholder="e.g. GTM-XXXXXXX"
                  value={googleTagManagerId}
                  onChange={(e) => setGoogleTagManagerId(e.target.value)}
                  className="bg-background/80 border-border focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono text-sm"
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Found at the top of your Google Tag Manager dashboard, starting with <span className="font-semibold text-foreground">GTM-</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consent Best Practices Alert */}
        <Card className="border border-primary/25 bg-primary/5 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
          <CardContent className="p-4 flex gap-3.5 items-start">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                Privacy Consent Compliance Note
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By default, this site enforces strict GDPR and POPIA standards. These tracking scripts will **only** load if a visitor explicitly enables <span className="font-semibold text-foreground">"Analytical Trackers"</span> in the cookie consent preference panel. If left blank, no integration scripts will be generated.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary-hover text-white px-6 uppercase tracking-wider text-xs font-bold h-10 transition-all duration-300"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Tracking Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
