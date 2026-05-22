import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface TrackingConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
}

export function TrackingLoader() {
  const [config, setConfig] = useState<TrackingConfig | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  // 1. Load tracking configuration from Supabase on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "tracking_config")
          .maybeSingle();

        if (error) throw error;

        if (data && data.value) {
          setConfig(data.value as TrackingConfig);
        }
      } catch (err) {
        console.error("Error loading tracking credentials:", err);
      }
    }

    loadConfig();
  }, []);

  // 2. Load cookie preferences from localStorage and listen to updates
  useEffect(() => {
    function loadPreferences() {
      try {
        const stored = localStorage.getItem("gsa-cookie-preferences");
        if (stored) {
          setPreferences(JSON.parse(stored) as CookiePreferences);
        } else {
          setPreferences(null);
        }
      } catch (err) {
        console.error("Error parsing cookie preferences:", err);
        setPreferences(null);
      }
    }

    // Initial load
    loadPreferences();

    // Listen to changes dispatched by the CookieConsent component
    window.addEventListener("gsa-cookie-preferences-changed", loadPreferences);

    return () => {
      window.removeEventListener("gsa-cookie-preferences-changed", loadPreferences);
    };
  }, []);

  // 3. Inject scripts based on config and analytics consent
  useEffect(() => {
    if (!config || !preferences) return;

    // Check if user has consented to analytics trackers
    if (!preferences.analytics) {
      return;
    }

    const { googleAnalyticsId, googleTagManagerId } = config;

    // A. Inject Google Analytics (gtag.js)
    if (googleAnalyticsId && googleAnalyticsId.trim() !== "") {
      const gaId = googleAnalyticsId.trim();
      const scriptId = "gsa-google-analytics";
      
      if (!document.getElementById(scriptId)) {
        // Create GA external script
        const scriptEl = document.createElement("script");
        scriptEl.id = scriptId;
        scriptEl.async = true;
        scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(scriptEl);

        // Create GA inline config script
        const inlineScriptEl = document.createElement("script");
        inlineScriptEl.id = `${scriptId}-init`;
        inlineScriptEl.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScriptEl);
      }
    }

    // B. Inject Google Tag Manager (gtm.js)
    if (googleTagManagerId && googleTagManagerId.trim() !== "") {
      const gtmId = googleTagManagerId.trim();
      const scriptId = "gsa-google-tagmanager";
      const noscriptId = "gsa-google-tagmanager-noscript";

      // 1. Inject GTM script in document.head
      if (!document.getElementById(scriptId)) {
        const inlineScriptEl = document.createElement("script");
        inlineScriptEl.id = scriptId;
        inlineScriptEl.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(inlineScriptEl);
      }

      // 2. Inject GTM fallback <noscript> iframe in document.body
      if (!document.getElementById(noscriptId)) {
        const noscriptEl = document.createElement("noscript");
        noscriptEl.id = noscriptId;
        noscriptEl.innerHTML = `
          <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
        `;
        document.body.appendChild(noscriptEl);
      }
    }
  }, [config, preferences]);

  // Non-rendering helper component
  return null;
}
