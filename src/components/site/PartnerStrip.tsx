import { PARTNERS } from "./mega-menu-data";

export function PartnerStrip({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <section className={dark ? "bg-surface-dark text-surface-dark-foreground" : "bg-background"}>
      <div className="container-page py-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="lg:w-1/4">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Global Best-in-Class Materials
            </p>
            <p className={`mt-1 text-sm ${dark ? "text-surface-dark-foreground/70" : "text-muted-foreground"}`}>
              Integrated into engineered systems
            </p>
          </div>
          <div className="lg:w-3/4 grid grid-cols-4 md:grid-cols-8 gap-x-6 gap-y-4">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className={`flex h-12 items-center justify-center rounded border ${
                  dark ? "border-surface-dark-foreground/15 bg-surface-dark-foreground/5" : "border-border bg-surface"
                }`}
              >
                <span className="font-display text-sm font-bold tracking-wider">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
