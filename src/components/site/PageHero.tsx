import { type ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  image = "https://images.unsplash.com/photo-1563391017873-6e6beab67fed?w=1920&q=80",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="relative bg-surface-dark text-surface-dark-foreground"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(10,10,12,0.85), rgba(10,10,12,0.55)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-page py-20 md:py-28">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">{eyebrow}</p>
          )}
          <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base md:text-lg text-surface-dark-foreground/85 max-w-2xl">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
