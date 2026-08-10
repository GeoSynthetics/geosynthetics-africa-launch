import { useState } from "react";
import {
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
  Music2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { usePageSlugs } from "@/hooks/use-page-slugs";
import { useDynamicMegaMenus } from "@/hooks/use-dynamic-menus";
import { useFooterContent } from "@/hooks/use-footer-content";
import { useTranslation } from "react-i18next";
import { type FooterSocialLink, DEFAULT_FOOTER_CONTENT } from "@/types/footer";

const PLATFORM_ICONS: Record<
  FooterSocialLink["platform"],
  React.ComponentType<{ className?: string }>
> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  whatsapp: MessageCircle,
  tiktok: Music2,
};

const PLATFORM_LABELS: Record<FooterSocialLink["platform"], string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "X / Twitter",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

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
  const footerContent = useFooterContent();

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

  const columns = footerContent.columns || DEFAULT_FOOTER_CONTENT.columns || [];

  const dynamicCols = columns.map((col) => {
    let items: { label: string; to: string; params?: Record<string, string> }[] = [];
    if (col.type === "custom") {
      items = (col.links || []).map((link) => {
        let key = `footer.${link.label.toLowerCase()}`;
        if (link.label === "About Us") key = "footer.aboutUs";
        if (link.label === "Careers") key = "footer.careers";
        if (link.label === "News") key = "footer.news";
        if (link.label === "Sustainability") key = "footer.sustainability";
        if (link.label === "Privacy Policy") key = "footer.privacyPolicy";
        if (link.label === "Terms & Conditions") key = "footer.termsConditions";
        if (link.label === "Datasheets") key = "footer.datasheets";
        if (link.label === "Installation Guides") key = "footer.installationGuides";
        if (link.label === "QA Checklists") key = "footer.qaChecklists";
        if (link.label === "Technical Articles") key = "footer.technicalArticles";
        if (link.label === "Videos") key = "footer.videos";
        if (link.label === "FAQs") key = "footer.faqs";

        return {
          label: t(key, link.label),
          to: resolve(link.to),
          params: link.params,
        };
      });
    } else if (col.type === "products") {
      items = products;
    } else if (col.type === "applications") {
      items = applications;
    } else if (col.type === "services") {
      items = services;
    } else if (col.type === "industries") {
      items = industries;
    }
    return {
      title: col.title,
      type: col.type,
      items,
    };
  });

  const getTranslatedTitle = (title: string, type: string) => {
    if (type === "products") {
      return title === "Products" ? t("nav.products", title) : title;
    }
    if (type === "applications") {
      return title === "Applications" ? t("nav.applications", title) : title;
    }
    if (type === "services") {
      return title === "Services" ? t("nav.services", title) : title;
    }
    if (type === "industries") {
      return title === "Industries" ? t("nav.industries", title) : title;
    }
    if (type === "custom") {
      if (title === "Resources") return t("footer.resources", title);
      if (title === "Company") return t("footer.company", title);
      return t(`footer.colTitle.${title.toLowerCase()}`, title);
    }
    return title;
  };

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      {/* Main footer grid */}
      <div className="w-full px-6 lg:px-10 xl:px-16 py-10">
        <div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[repeat(var(--cols-count),_minmax(0,_1fr))] gap-x-6 gap-y-8"
          style={
            {
              "--cols-count": 2 + columns.length + 1,
            } as React.CSSProperties
          }
        >
          {/* Brand column — spans 2 cols */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-3 text-xs text-surface-dark-foreground/60 leading-relaxed max-w-[240px]">
              {footerContent.brandDescription}
            </p>

            {/* Address & Quick Contact Info */}
            <div className="mt-4 space-y-2 text-xs text-surface-dark-foreground/75 max-w-[260px]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {footerContent.address || "7 Tamar Avenue, Lea Glen, Randburg, Johannesburg, South Africa"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a
                  href="tel:+27710939964"
                  className="hover:text-primary transition-colors font-medium"
                >
                  +27 71 093 9964
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a
                  href="mailto:sales@geosynthetics.co.za"
                  className="hover:text-primary transition-colors font-medium"
                >
                  sales@geosynthetics.co.za
                </a>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {footerContent.socialLinks.map((link) => {
                const Icon = PLATFORM_ICONS[link.platform] ?? Linkedin;
                const label = PLATFORM_LABELS[link.platform] ?? link.platform;
                return (
                  <a
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-dark-foreground/20 text-surface-dark-foreground/70 hover:bg-primary hover:border-primary hover:text-white transition"
                    aria-label={label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Columns */}
          {dynamicCols.map((col, idx) => (
            <FooterCol
              key={`${col.title}-${idx}`}
              title={getTranslatedTitle(col.title, col.type)}
              items={col.items}
            />
          ))}

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
            {footerContent.copyrightText.replace("{{year}}", String(new Date().getFullYear()))}{" "}
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
            {footerContent.certifications.map((cert, idx) => (
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
