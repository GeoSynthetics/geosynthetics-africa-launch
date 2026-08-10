import { useState, useEffect } from "react";
import {
  Award,
  ShieldCheck,
  Truck,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Upload,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

const items = [
  { icon: Award, key: "topbar.iagi", defaultLabel: "IAGI Member - One of only 5 in Africa" },
  { icon: ShieldCheck, key: "topbar.bbbee", defaultLabel: "B-BBEE Level 2" },
  { icon: ShieldCheck, key: "topbar.qa", defaultLabel: "QA/QC Certified" },
  { icon: Truck, key: "topbar.logistics", defaultLabel: "Pan-African Logistics" },
];

function PartnerPortalLink() {
  const { isAuthenticated, user, isStaff, signOut } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition whitespace-nowrap"
      >
        <UserIcon className="h-3.5 w-3.5" />
        <span>{t("nav.partnerPortal", "Partner Portal")}</span>
      </Link>
    );
  }

  const label = user?.email?.split("@")[0] ?? t("nav.profile", "Profile");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition whitespace-nowrap outline-none hover:cursor-pointer">
        <UserIcon className="h-3.5 w-3.5" />
        <span className="max-w-[140px] truncate">{label}</span>
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="hover:cursor-pointer">
            <UserIcon className="h-4 w-4 mr-2" />
            {t("nav.profile", "Profile")}
          </Link>
        </DropdownMenuItem>
        {isStaff && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="hover:cursor-pointer">
              <ShieldCheck className="h-4 w-4 mr-2" />
              {t("nav.admin", "Admin")}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => void signOut()} className="hover:cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          {t("nav.signOut", "Sign out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobilePerksSlider() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setFade(true);
      }, 500); // Wait for fade out
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const item = items[index];
  const Icon = item.icon;

  return (
    <div
      className={`md:hidden flex items-center gap-2 opacity-90 transition-all duration-500 min-w-0 ${
        fade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
      }`}
    >
      <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      <span className="truncate">{t(item.key, item.defaultLabel)}</span>
    </div>
  );
}

export function TopBar() {
  const { open } = useQuickQuote();
  const { t } = useTranslation();

  return (
    <div className="bg-surface-dark text-surface-dark-foreground text-xs">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        <div className="hidden md:flex items-center gap-6 overflow-hidden">
          {items.map(({ icon: Icon, key, defaultLabel }) => (
            <div key={key} className="flex items-center gap-2 whitespace-nowrap opacity-90">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span>{t(key, defaultLabel)}</span>
            </div>
          ))}
        </div>

        <MobilePerksSlider />

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="tel:+27710939964"
            className="hidden xl:flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition whitespace-nowrap font-medium text-[11px]"
            title="Call Us"
          >
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span>+27 71 093 9964</span>
          </a>

          <a
            href="mailto:sales@geosynthetics.co.za"
            className="hidden xl:flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition whitespace-nowrap font-medium text-[11px]"
            title="Email Sales"
          >
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>sales@geosynthetics.co.za</span>
          </a>

          <button
            onClick={() => open()}
            className="hidden lg:flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-primary-foreground px-2 py-1 rounded transition whitespace-nowrap font-medium cursor-pointer border-0"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{t("nav.uploadBoq", "Upload Project BOQ")}</span>
          </button>
          <PartnerPortalLink />
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}
