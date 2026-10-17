import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { alternatesFor, langFromPath, LANG_LABELS } from "@/i18n/localized-pages";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";
import { CookieConsent } from "@/components/site/CookieConsent";
import { TrackingLoader } from "@/components/site/TrackingLoader";
import { QuickQuoteProvider } from "@/hooks/use-quick-quote";
import { QuickQuoteModal } from "@/components/site/QuickQuoteModal";
import "@/lib/i18n";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { fetchDynamicMenus } from "@/hooks/use-dynamic-menus";
import { fetchFooterContent } from "@/hooks/use-footer-content";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

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
  head: ({ matches }) => {
    // The deepest match is the page being viewed; its pathname (without query
    // string) becomes the canonical URL on the live domain.
    const pathname = matches[matches.length - 1]?.pathname ?? "/";
    const canonicalUrl = absoluteUrl(pathname);
    // hreflang: link every language version of this page to the others
    const alternates = alternatesFor(pathname);
    const hreflangLinks = alternates.length
      ? [
          ...alternates.map((a) => ({
            rel: "alternate",
            hrefLang: LANG_LABELS[a.lang].hreflang,
            href: absoluteUrl(a.path),
          })),
          {
            rel: "alternate",
            hrefLang: "x-default",
            href: absoluteUrl(alternates.find((a) => a.lang === "en")!.path),
          },
        ]
      : [];
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index, follow" },
        { title: "Geosynthetics Africa" },
        { name: "description", content: "Africa's Integrated Geosynthetics Execution Platform." },
        { property: "og:title", content: "Geosynthetics Africa" },
        {
          property: "og:description",
          content: "Africa's Integrated Geosynthetics Execution Platform.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:site_name", content: "Geosynthetics Africa" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Geosynthetics Africa" },
        {
          name: "twitter:description",
          content: "Africa's Integrated Geosynthetics Execution Platform.",
        },
        { property: "og:image", content: OG_IMAGE_URL },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:image", content: OG_IMAGE_URL },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
        ...hreflangLinks,
        { rel: "stylesheet", href: appCss },
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
  // The page language follows the URL: /fr/... is French, /pt/... Portuguese
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const currentLang = langFromPath(pathname);
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

function RootComponent() {
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  // Menus and labels follow the language of the page being viewed
  useEffect(() => {
    const lang = langFromPath(pathname);
    if ((i18n.language || "en").split("-")[0] !== lang) void i18n.changeLanguage(lang);
  }, [pathname]);

  return (
    <AuthProvider>
      <QuickQuoteProvider>
        <OrganizationSchema />
        <WebSiteSchema />
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
