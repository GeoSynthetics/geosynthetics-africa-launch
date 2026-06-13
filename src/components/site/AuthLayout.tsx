import { type ReactNode } from "react";
import { Shield, Award, CheckCircle } from "lucide-react";
import authHero from "@/assets/auth-hero.png";

interface AuthLayoutProps {
  /** Content rendered inside the right-hand form panel */
  children: ReactNode;
}

const TRUST_BADGES = [
  { icon: Shield, label: "IAGI Member" },
  { icon: Award, label: "B-BBEE Level 2" },
  { icon: CheckCircle, label: "GA/QC Certified" },
] as const;

/**
 * Split-panel auth layout shared by login and signup pages.
 * - Left: full-height hero image with dark overlay, logo & trust badges.
 * - Right: form content passed via children.
 * - Responsive: image panel hidden on mobile; form takes full width.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className="flex min-h-[80vh]">
      {/* ─── Image panel (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Hero image */}
        <img
          src={authHero}
          alt="Geosynthetic membrane installation on a large-scale African construction site"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.6) 50%, rgba(10,10,12,0.35) 100%)",
          }}
        />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full"></div>
      </div>

      {/* ─── Form panel ─── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background">
        {/* Top accent bar */}
        <div className="h-1 bg-primary lg:hidden" />

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md animate-auth-fade-in">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
