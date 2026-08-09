import { useRef, useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { CookieConsent } from "@/components/site/CookieConsent";
import { TrackingLoader } from "@/components/site/TrackingLoader";
import { QuickQuoteProvider } from "@/hooks/use-quick-quote";
import { QuickQuoteModal } from "@/components/site/QuickQuoteModal";
import "@/lib/i18n";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { fetchDynamicMenus } from "@/hooks/use-dynamic-menus";
import { fetchFooterContent } from "@/hooks/use-footer-content";

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight">
          {t("common.notFound")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("common.notFoundDesc")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-hover transition"
          >
            {t("common.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  loader: async () => {
    const [megaMenu, footerContent] = await Promise.all([
      fetchDynamicMenus(),
      fetchFooterContent(),
    ]);
    return { megaMenu, footerContent };
  },
  head: () => {
    const isClient = typeof window !== "undefined";
    const hostname = isClient ? window.location.hostname.toLowerCase() : "";
    const isProductionHost =
      hostname === "geosynthetics.co.za" || hostname === "www.geosynthetics.co.za";

    // On non-production domains, explicitly tell search engine crawlers not to index
    const robotsContent = isClient && !isProductionHost ? "noindex, nofollow" : "index, follow";
    const pathname = isClient ? window.location.pathname : "";
    const canonicalUrl = `https://geosynthetics.co.za${pathname === "/" ? "" : pathname}`;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: robotsContent },
        { title: "Geosynthetics Africa" },
        { name: "description", content: "Africa's Integrated Geosynthetics Execution Platform." },
        { property: "og:title", content: "Geosynthetics Africa" },
        {
          property: "og:description",
          content: "Africa's Integrated Geosynthetics Execution Platform.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Geosynthetics Africa" },
        {
          name: "twitter:description",
          content: "Africa's Integrated Geosynthetics Execution Platform.",
        },
        {
          property: "og:image",
          content:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/4a931b85-67d6-4d84-8611-c5fe69e8ab12",
        },
        {
          name: "twitter:image",
          content:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/4a931b85-67d6-4d84-8611-c5fe69e8ab12",
        },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "canonical", href: canonicalUrl },
        { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const currentLang = i18n.language || "en";
  return (
    <html lang={currentLang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthRedirectHandler() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      wasAuthenticatedRef.current = true;
    } else if (wasAuthenticatedRef.current) {
      wasAuthenticatedRef.current = false;
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, loading, navigate]);

  return null;
}

function RootComponent() {
  return (
    <AuthProvider>
      <QuickQuoteProvider>
        <AuthRedirectHandler />
        <OrganizationSchema />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <div
            onClick={() => toast.dismiss()}
            className="toast-backdrop fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9990] opacity-0 pointer-events-none transition-all duration-500 cursor-pointer"
          />
          <Toaster />
          <ScrollToTop />
          <CookieConsent />
          <TrackingLoader />
          <QuickQuoteModal />
        </div>
      </QuickQuoteProvider>
    </AuthProvider>
  );
}
