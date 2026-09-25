import { PARTNER_LOGOS } from "./mega-menu-data";

export interface PartnerLogo {
  name: string;
  logo: string;
}

export function PartnerStrip({
  variant = "light",
  subtitle = "Global Best-in-Class Materials",
  description = "Integrated into engineered systems",
  logos,
}: {
  variant?: "light" | "dark";
  subtitle?: string;
  description?: string;
  logos?: PartnerLogo[];
}) {
  const dark = variant === "dark";
  const displayLogos = logos && logos.length > 0 ? logos : PARTNER_LOGOS;

  // Dynamically assign grid column classes based on the number of logos to prevent excess white space
  const logoCount = displayLogos.length;
  const gridColsClass =
    logoCount === 1
      ? "grid-cols-1"
      : logoCount === 2
        ? "grid-cols-2"
        : logoCount === 3
          ? "grid-cols-3"
          : logoCount === 4
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8";

  return (
    <section className={dark ? "bg-surface-dark text-surface-dark-foreground" : "bg-background"}>
      <div className="container-page py-12 md:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          <div className="lg:w-1/4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{subtitle}</p>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                dark ? "text-surface-dark-foreground/70" : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
          </div>
          <div className={`lg:w-3/4 grid ${gridColsClass} gap-4 sm:gap-6 lg:gap-8`}>
            {displayLogos.map((p) => (
              <div
                key={p.name}
                className="flex h-16 sm:h-20 lg:h-24 items-center justify-center border border-muted rounded bg-white p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-md hover:border-primary/30 group"
              >
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
