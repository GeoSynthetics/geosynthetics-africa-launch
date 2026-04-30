import { Link } from "@tanstack/react-router";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { PRODUCT_CATEGORIES, APPLICATION_CATEGORIES, SERVICES } from "./mega-menu-data";

const RESOURCES = [
  { label: "Datasheets", to: "/resources" },
  { label: "Installation Guides", to: "/resources" },
  { label: "Technical Articles", to: "/resources" },
  { label: "Case Studies", to: "/resources" },
  { label: "Videos", to: "/resources" },
  { label: "FAQ", to: "/resources" },
];

const QA = [
  { label: "Standards", to: "/quality-assurance" },
  { label: "Testing Methods", to: "/quality-assurance" },
  { label: "QA/QC Process", to: "/quality-assurance" },
  { label: "Documentation", to: "/quality-assurance" },
  { label: "Certificates", to: "/quality-assurance" },
];

const CONTACTS = [
  { label: "South Africa", to: "/contacts" },
  { label: "Ghana", to: "/contacts" },
  { label: "Tanzania", to: "/contacts" },
  { label: "Zimbabwe", to: "/contacts" },
  { label: "Quick Contact", to: "/contacts" },
];

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-surface-dark-foreground mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link
              to={i.to}
              className="text-sm text-surface-dark-foreground/70 hover:text-primary transition"
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
  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-sm text-surface-dark-foreground/70 max-w-xs">
              Africa's Integrated Geosynthetics Execution Platform.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Linkedin, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-dark-foreground/20 text-surface-dark-foreground hover:bg-primary hover:border-primary transition"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Products" items={PRODUCT_CATEGORIES.map((c) => ({ label: c.label, to: `/products/${c.slug}` }))} />
          <FooterCol title="Applications" items={APPLICATION_CATEGORIES.map((c) => ({ label: c.label, to: `/applications/${c.slug}` }))} />
          <FooterCol title="Services" items={SERVICES.map((s) => ({ label: s.label, to: "/services" }))} />
          <FooterCol title="Quality Assurance" items={QA} />
          <FooterCol title="Resources" items={RESOURCES} />
          <FooterCol title="Contacts" items={CONTACTS} />
        </div>
      </div>
      <div className="border-t border-surface-dark-foreground/10">
        <div className="container-page flex flex-col md:flex-row items-center justify-between gap-4 py-5 text-xs text-surface-dark-foreground/60">
          <div>© 2026 Geosynthetics Africa (Pty) Ltd. All Rights Reserved.</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 uppercase tracking-wider">
            <span>IAGI Member</span>
            <span>·</span>
            <span>B-BBEE Level 2</span>
            <span>·</span>
            <span>Pan-African Logistics</span>
            <span>·</span>
            <span>QA/QC Certified</span>
            <span>·</span>
            <Link to="/contacts" className="hover:text-primary">Privacy Policy</Link>
            <span>·</span>
            <Link to="/contacts" className="hover:text-primary">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
