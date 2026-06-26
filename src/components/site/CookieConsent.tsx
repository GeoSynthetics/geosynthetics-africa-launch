import { useState, useEffect } from "react";
import { Cookie, X, Shield, BarChart2, Tag, Lock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Keep track of the temporary toggles in the settings dialog
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // 1. Check for modern granular cookie preferences
    const storedPrefs = localStorage.getItem("gsa-cookie-preferences");
    if (storedPrefs) {
      try {
        const parsed = JSON.parse(storedPrefs) as CookiePreferences;
        setPreferences(parsed);
        setTempPreferences(parsed);
        setIsVisible(false);
        return;
      } catch (e) {
        console.error("Failed to parse cookie preferences, resetting", e);
      }
    }

    // 2. Check for 3-hour dismissal
    const dismissedAt = localStorage.getItem("gsa-cookie-dismissed-at");
    if (dismissedAt) {
      const timestamp = parseInt(dismissedAt, 10);
      if (!isNaN(timestamp)) {
        const threeHoursInMs = 3 * 60 * 60 * 1000;
        if (Date.now() - timestamp < threeHoursInMs) {
          setIsVisible(false);
          return;
        }
      }
    }

    // 3. Backward Compatibility: Migrate legacy binary cookie consent
    const legacyConsent = localStorage.getItem("gsa-cookie-consent");
    if (legacyConsent) {
      let migratedPrefs: CookiePreferences;
      if (legacyConsent === "accepted") {
        migratedPrefs = { necessary: true, analytics: true, marketing: true };
      } else {
        migratedPrefs = { necessary: true, analytics: false, marketing: false };
      }

      localStorage.setItem("gsa-cookie-preferences", JSON.stringify(migratedPrefs));
      setPreferences(migratedPrefs);
      setTempPreferences(migratedPrefs);
      setIsVisible(false);

      // Dispatch event to inform loaders
      window.dispatchEvent(new Event("gsa-cookie-preferences-changed"));
      return;
    }

    // 4. If new visitor and not recently dismissed, delay banner presentation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for global triggers to open the cookie settings dialog
  useEffect(() => {
    const handleOpenTrigger = () => {
      const storedPrefs = localStorage.getItem("gsa-cookie-preferences");
      if (storedPrefs) {
        try {
          const parsed = JSON.parse(storedPrefs) as CookiePreferences;
          setPreferences(parsed);
          setTempPreferences(parsed);
        } catch (e) {
          console.error("Failed to parse cookie preferences", e);
        }
      }
      setIsPreferencesOpen(true);
    };

    window.addEventListener("gsa-open-cookie-preferences", handleOpenTrigger);
    return () => {
      window.removeEventListener("gsa-open-cookie-preferences", handleOpenTrigger);
    };
  }, [preferences]);

  const savePreferences = (newPrefs: CookiePreferences) => {
    localStorage.setItem("gsa-cookie-preferences", JSON.stringify(newPrefs));
    localStorage.removeItem("gsa-cookie-dismissed-at"); // Clear temporary dismissal since choice is made
    setPreferences(newPrefs);
    setTempPreferences(newPrefs);
    setIsVisible(false);
    setIsPreferencesOpen(false);

    // Dispatch event so TrackingLoader and other listeners instantly pick up the state
    window.dispatchEvent(new Event("gsa-cookie-preferences-changed"));
  };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    savePreferences(allAccepted);
    toast.success("All cookies have been accepted.", {
      description: "Thank you for supporting our digital performance optimization.",
      duration: 3500,
    });
  };

  const handleDeclineAll = () => {
    const allDeclined = { necessary: true, analytics: false, marketing: false };
    savePreferences(allDeclined);
    toast.info("Optional cookies declined.", {
      description: "Only necessary functional cookies will be loaded.",
      duration: 3500,
    });
  };

  const handleDismiss = () => {
    const now = Date.now();
    localStorage.setItem("gsa-cookie-dismissed-at", now.toString());
    setIsVisible(false);
    toast.info("Cookie notice dismissed.", {
      description: "We won't show this notification again for the next 3 hours.",
      duration: 3500,
    });
  };

  const handleOpenCustomize = () => {
    setTempPreferences({ ...preferences });
    setIsPreferencesOpen(true);
  };

  const handleSaveCustom = () => {
    savePreferences(tempPreferences);
    toast.success("Custom cookie preferences saved.", {
      description: `Analytics: ${tempPreferences.analytics ? "ON" : "OFF"} · Marketing: ${tempPreferences.marketing ? "ON" : "OFF"}`,
      duration: 3500,
    });
  };

  // Hide the entire component if not visible AND the settings dialog is closed
  if (!isVisible && !isPreferencesOpen) return null;

  return (
    <>
      {/* 1. Global Bottom Sticky Cookie Banner */}
      {isVisible && !isPreferencesOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:pb-6 animate-in slide-in-from-bottom duration-500">
          <div className="container mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-xl border border-border bg-background/95 backdrop-blur-md p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8">
              {/* Soft subtle primary brand red/orange gradient glow in the corners */}
              <div className="absolute -left-12 -top-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              {/* Banner Left: Details */}
              <div className="flex items-start gap-4 flex-1 pr-8 md:pr-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Cookie className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    Cookie Preferences Notice
                  </h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-4xl">
                    {t("cookies.message", "We use cookies to improve your experience on our website.")}
                  </p>
                </div>
              </div>

              {/* Banner Right: Controls */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCustomize}
                  className="text-xs uppercase font-bold tracking-wider h-9 px-4 border-border hover:bg-accent text-muted-foreground w-1/3 md:w-auto hover:cursor-pointer transition-all duration-300"
                >
                  <Settings className="h-3.5 w-3.5 mr-1.5" />
                  {t("cookies.settings", "Settings")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeclineAll}
                  className="text-xs uppercase font-bold tracking-wider h-9 px-4 border-border hover:bg-accent text-muted-foreground w-1/3 md:w-auto hover:cursor-pointer transition-all duration-300"
                >
                  {t("cookies.decline", "Decline")}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs uppercase font-bold tracking-wider h-9 px-5 bg-primary hover:bg-primary-hover text-white w-1/3 md:w-auto hover:cursor-pointer transition-all duration-300"
                >
                  {t("cookies.accept", "Accept All")}
                </Button>

                {/* Direct Close Icon (Dismisses the notification for the next 3 hours) */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 md:relative md:top-auto md:right-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-accent transition hover:cursor-pointer shrink-0"
                  title="Dismiss for 3 hours"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Premium Detailed Settings Dialog */}
      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="max-w-xl border-border bg-background/98 backdrop-blur-md shadow-2xl p-6 rounded-xl animate-in zoom-in-95 duration-200">
          {/* Subtle decoration glow inside the preferences dialog */}
          <div className="absolute -left-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="space-y-1.5">
            <DialogTitle className="font-display text-lg font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Cookie Preferences Manager
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              We respect your privacy rights. You can adjust your consent options below for
              different types of cookies and tracking technologies.
            </DialogDescription>
          </DialogHeader>

          {/* Core Categories list */}
          <div className="space-y-4 py-4 my-2 border-y border-border max-h-[350px] overflow-y-auto pr-1">
            {/* Category: Necessary */}
            <div className="p-3.5 rounded-lg border border-border bg-surface/10 hover:bg-surface/20 transition-all duration-200 flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground border border-border">
                <Lock className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-foreground">
                    Necessary Cookies
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/75 bg-muted px-2 py-0.5 rounded border border-border">
                      Required
                    </span>
                    <Switch checked={true} disabled={true} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Required for core platform activities, secure logins, routing sessions, and
                  keeping track of your visual preferences. They cannot be turned off.
                </p>
              </div>
            </div>

            {/* Category: Analytics */}
            <div className="p-3.5 rounded-lg border border-border bg-surface/10 hover:bg-surface/20 transition-all duration-200 flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20">
                <BarChart2 className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-foreground">
                    Analytical Trackers
                  </span>
                  <Switch
                    checked={tempPreferences.analytics}
                    onCheckedChange={(checked) =>
                      setTempPreferences((prev) => ({ ...prev, analytics: checked }))
                    }
                    className="hover:cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Helps us understand visitor metrics, bounce rates, referral sources, and platform
                  usage using anonymized Google Analytics & Tag Manager.
                </p>
              </div>
            </div>

            {/* Category: Marketing */}
            <div className="p-3.5 rounded-lg border border-border bg-surface/10 hover:bg-surface/20 transition-all duration-200 flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20">
                <Tag className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-foreground">
                    Marketing Pixels
                  </span>
                  <Switch
                    checked={tempPreferences.marketing}
                    onCheckedChange={(checked) =>
                      setTempPreferences((prev) => ({ ...prev, marketing: checked }))
                    }
                    className="hover:cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Supports campaign performance metrics, custom audience mapping, and displaying
                  tailored information aligned with your interests on social media networks.
                </p>
              </div>
            </div>
          </div>

          {/* Dialog Footer Actions */}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeclineAll}
              className="text-xs uppercase font-bold tracking-wider h-10 border-border hover:bg-accent text-muted-foreground hover:cursor-pointer transition-all duration-300"
            >
              Reject Optional
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveCustom}
                className="text-xs uppercase font-bold tracking-wider h-10 border-border hover:bg-accent text-foreground hover:cursor-pointer transition-all duration-300 flex-1 sm:flex-none"
              >
                Save Preferences
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAcceptAll}
                className="text-xs uppercase font-bold tracking-wider h-10 bg-primary hover:bg-primary-hover text-white hover:cursor-pointer transition-all duration-300 flex-1 sm:flex-none"
              >
                Accept All
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
