import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { PRODUCT_CATEGORIES, APPLICATION_CATEGORIES, SERVICES } from "./mega-menu-data";

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

const CERTIFICATIONS = ["IAGI Member - One of only 5 in Africa", "B-BBEE Level 2", "Pan-African Logistics", "QA/QC Certified"];

const SOCIAL_LINKS = [
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="min-w-0">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-surface-dark-foreground mb-3">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              to={i.to}
              className="text-xs text-surface-dark-foreground/60 hover:text-primary transition-colors"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  // Trim categories to match Figma list length
  const products = [
    ...PRODUCT_CATEGORIES.slice(0, 6).map((c) => ({ label: c.label, to: `/products/${c.slug}` })),
    { label: "All Products", to: "/products" },
  ];

  const applications = [
    ...APPLICATION_CATEGORIES.slice(0, 6).map((c) => ({ label: c.label, to: `/applications/${c.slug}` })),
    { label: "All Applications", to: "/applications" },
  ];

  const services = SERVICES.map((s) => ({ label: s.label, to: `/services/${s.slug}` }));

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      {/* Main footer grid */}
      <div className="w-full px-6 lg:px-10 xl:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8">

          {/* Brand column — spans 2 cols */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-3 text-xs text-surface-dark-foreground/60 leading-relaxed max-w-[220px]">
              Africa's integrated geosynthetics platform delivering quality products, expert services
              and technical solutions.
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
          <FooterCol title="Products" items={products} />

          {/* Applications */}
          <FooterCol title="Applications" items={applications} />

          {/* Services */}
          <FooterCol title="Services" items={services} />

          {/* Resources */}
          <FooterCol title="Resources" items={RESOURCES} />

          {/* Company */}
          <FooterCol title="Company" items={COMPANY} />

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 min-w-0">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-surface-dark-foreground mb-3">
              Newsletter
            </h4>
            <p className="text-xs text-surface-dark-foreground/60 leading-relaxed mb-3">
              Subscribe to our newsletter for latest updates and insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded bg-surface-dark-foreground/10 border border-surface-dark-foreground/20 px-3 py-2 text-xs text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none focus:border-primary transition"
              />
              <button
                type="submit"
                className="w-full rounded bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-dark-foreground/10">
        <div className="w-full px-6 lg:px-10 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-3 py-4 text-[11px] text-surface-dark-foreground/50">
          <div>© {new Date().getFullYear()} Geosynthetics Africa (Pty) Ltd. All Rights Reserved. | <a className="text-primary-foreground hover:text-primary transition" href="https://kavaradigital.online" target="_blank" rel="noopener noreferrer">Site by Kavara Digital</a> </div>
          <div className="flex flex-wrap items-center gap-0">
            {CERTIFICATIONS.map((cert, idx) => (
              <span key={cert} className="flex items-center uppercase tracking-wider">
                {idx > 0 && <span className="mx-3 text-surface-dark-foreground/30">|</span>}
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
