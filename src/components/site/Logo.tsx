import { Link } from "@tanstack/react-router";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "dark" ? "text-foreground" : "text-surface-dark-foreground";
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Geosynthetics Africa home">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path
          d="M18 2c-1 4-5 5-7 9-2 3 0 6-1 9-1 4-4 5-3 9 1 3 5 4 8 5 1 0 1-2 3-2s2 2 3 2c4-1 7-3 8-7 1-3-1-5 0-8 1-4 3-6 2-9-1-4-5-4-7-7-2-2-4-4-6-1z"
          fill="var(--primary)"
        />
      </svg>
      <div className="leading-none">
        <div className={`font-display text-lg font-bold tracking-wide ${textColor}`}>
          GEOSYNTHETICS
        </div>
        <div className="font-display text-sm font-bold tracking-[0.2em] text-primary">AFRICA</div>
      </div>
    </Link>
  );
}
