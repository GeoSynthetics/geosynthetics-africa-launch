import { Link } from "@tanstack/react-router";
import africaLogo from "@/assets/africa.svg";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "dark" ? "text-foreground" : "text-surface-dark-foreground";
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Geosynthetics Africa home">
      <img
        src={africaLogo}
        alt=""
        aria-hidden="true"
        className="h-9 w-9"
        style={{ filter: "brightness(0) saturate(100%) invert(24%) sepia(89%) saturate(3402%) hue-rotate(346deg) brightness(95%) contrast(95%)" }}
      />
      <div className="leading-none">
        <div className={`font-display text-lg font-bold tracking-wide ${textColor}`}>
          GEOSYNTHETICS
        </div>
        <div className="font-display text-sm font-bold tracking-[0.2em] text-primary">AFRICA</div>
      </div>
    </Link>
  );
}
