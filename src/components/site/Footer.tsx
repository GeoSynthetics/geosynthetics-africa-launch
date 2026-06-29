import { useState } from "react";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { usePageSlugs } from "@/hooks/use-page-slugs";
import { useDynamicMegaMenus } from "@/hooks/use-dynamic-menus";
import { useTranslation } from "react-i18next";

const RESOURCES = [
  { label: "Datasheets", to: "/resources" },
  { label: "Installation Guides", to: "/resources" },
  { label: "QA Checklists", to: "/quality-assurance" },
  { label: "Technical Articles", to: "/resources" },
  { label: "Videos", to: "/resources" },
  { label: "FAQs", to: "/resources" },
];

const COMPANY = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/" },
  { label: "News", to: "/resources" },
  { label: "Sustainability", to: "/" },
  { label: "Privacy Policy", to: "/" },
  { label: "Terms & Conditions", to: "/" },
];

const CERTIFICATIONS = [
  "IAGI Member - One of only 5 in Africa",
  "B-BBEE Level 2",
  "Pan-African Logistics",
  "QA/QC Certified",
];

const SOCIAL_LINKS = [
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

type AnyLinkProps = Omit<LinkComponentProps, "to"> & {
  to: string;
  params?: Record<string, string>;
};
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string; params?: Record<string, string> }[];
}) {
  return (
    <div className="min-w-0">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-surface-dark-foreground mb-3">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i.label}>
            <RLink
              to={i.to}
              params={i.params}
              className="text-xs text-surface-dark-foreground/60 hover:text-primary transition-colors"
            >
              {i.label}
            </RLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { resolve } = usePageSlugs();
  const { menus } = useDynamicMegaMenus();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const productMenu = menus.find((m) => m.key === "products");
  const products = productMenu
    ? [
        ...productMenu.columns.primary.slice(0, 6).map((c) => ({
          label: c.label,
          to: c.to,
          params: c.params,
        })),
        { label: "All Products", to: "/products" },
      ]
    : [];

  const applicationMenu = menus.find((m) => m.key === "applications");
  const applications = applicationMenu
    ? [
        ...applicationMenu.columns.primary.slice(0, 6).map((c) => ({
          label: c.label,
          to: c.to,
          params: c.params,
        })),
        { label: "All Applications", to: "/applications" },
      ]
    : [];

  const serviceMenu = menus.find((m) => m.key === "services");
  const services = serviceMenu
    ? serviceMenu.columns.primary.map((s) => ({
        label: s.label,
        to: s.to,
        params: s.params,
      }))
    : [];

  const industryMenu = menus.find((m) => m.key === "industries");
  const industries = industryMenu
    ? industryMenu.columns.primary.map((i) => ({
        label: i.label,
        to: i.to,
        params: i.params,
      }))
    : [];

  // Resolve custom slugs for core page links
  const company = COMPANY.map((item) => {
    let key = "footer.aboutUs";
    if (item.label === "Careers") key = "footer.careers";
    if (item.label === "News") key = "footer.news";
    if (item.label === "Sustainability") key = "footer.sustainability";
    if (item.label === "Privacy Policy") key = "footer.privacyPolicy";
    if (item.label === "Terms & Conditions") key = "footer.termsConditions";
    return {
      label: t(key, item.label),
      to: resolve(item.to),
    };
  });

  const resources = RESOURCES.map((item) => {
    let key = "footer.datasheets";
    if (item.label === "Installation Guides") key = "footer.installationGuides";
    if (item.label === "QA Checklists") key = "footer.qaChecklists";
    if (item.label === "Technical Articles") key = "footer.technicalArticles";
    if (item.label === "Videos") key = "footer.videos";
    if (item.label === "FAQs") key = "footer.faqs";
    return {
      label: t(key, item.label),
      to: resolve(item.to),
    };
  });

  const certificationsMapped = CERTIFICATIONS.map((cert) => {
    let key = "topbar.iagi";
    if (cert === "B-BBEE Level 2") key = "topbar.bbbee";
    if (cert === "Pan-African Logistics") key = "topbar.logistics";
    if (cert === "QA/QC Certified") key = "topbar.qa";
    return t(key, cert);
  });

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      {/* Main footer grid */}
      <div className="w-full px-6 lg:px-10 xl:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-x-6 gap-y-8">
          {/* Brand column — spans 2 cols */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-3 text-xs text-surface-dark-foreground/60 leading-relaxed max-w-[220px]">
              {t(
                "footer.desc",
                "Africa's integrated geosynthetics platform delivering quality products, expert services and technical solutions.",
              )}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-dark-foreground/20 text-surface-dark-foreground/70 hover:bg-primary hover:border-primary hover:text-white transition"
                  aria-label={label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <FooterCol title={t("nav.products", "Products")} items={products} />

          {/* Applications */}
          <FooterCol title={t("nav.applications", "Applications")} items={applications} />

          {/* Industries */}
          <FooterCol title={t("nav.industries", "Industries")} items={industries} />

          {/* Services */}
          <FooterCol title={t("nav.services", "Services")} items={services} />

          {/* Resources */}
          <FooterCol title={t("footer.resources", "Resources")} items={resources} />

          {/* Company */}
          <FooterCol title={t("footer.company", "Company")} items={company} />

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 min-w-0">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-surface-dark-foreground mb-3">
              {t("footer.newsletterTitle", "Newsletter")}
            </h4>
            <p className="text-xs text-surface-dark-foreground/60 leading-relaxed mb-3">
              {t(
                "footer.newsletterDesc",
                "Subscribe to our newsletter for latest updates and insights.",
              )}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.newsletterPlaceholder", "Enter your email")}
                required
                className="w-full rounded bg-surface-dark-foreground/10 border border-surface-dark-foreground/20 px-3 py-2 text-xs text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none focus:border-primary transition"
              />
              <button
                type="submit"
                className="w-full rounded bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition"
              >
                {t("footer.newsletterBtn", "Subscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-dark-foreground/10">
        <div className="w-full px-6 lg:px-10 xl:px-16 flex flex-col-reverse md:flex-row items-center justify-between gap-5 md:gap-3 py-6 md:py-4 text-[11px] text-surface-dark-foreground/50 text-center md:text-left">
          <div className="leading-relaxed">
            {t(
              "footer.copyright",
              "© {{year}} Geosynthetics Africa (Pty) Ltd. All Rights Reserved.",
              { year: new Date().getFullYear() },
            )}{" "}
            <span className="hidden md:inline">|</span>
            <br className="md:hidden" />{" "}
            <a
              className="text-primary-foreground hover:text-primary transition whitespace-nowrap"
              href="https://kavaradigital.online"
              target="_blank"
              rel="noopener noreferrer"
            >
              Site by Kavara Digital
            </a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-y-2 md:gap-y-0">
            {certificationsMapped.map((cert, idx) => (
              <span key={cert} className="flex items-center uppercase tracking-wider text-center">
                {idx > 0 && <span className="mx-2 md:mx-3 text-surface-dark-foreground/30">|</span>}
                <span>{cert}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
