import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  params?: Record<string, string>;
  search?: any;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "default" | "primary-bold" | "tiny" | "contacts";
  className?: string;
}

export function Breadcrumbs({ items, variant = "default", className }: BreadcrumbsProps) {
  const containerClasses = cn(
    "flex flex-wrap items-center gap-2",
    {
      "text-xs uppercase tracking-wider text-surface-dark-foreground/70": variant === "default",
      "text-xs uppercase tracking-widest text-primary font-bold mb-6": variant === "primary-bold",
      "text-[10px] font-bold uppercase tracking-widest text-white/50 mb-6": variant === "tiny",
      "text-xs text-surface-dark-foreground/70 mb-5 gap-1.5": variant === "contacts",
    },
    className,
  );

  const linkClasses = cn("transition-colors", {
    "hover:text-primary": variant === "default" || variant === "contacts" || variant === "tiny",
    "hover:text-white": variant === "primary-bold",
  });

  const chevronClasses = cn("h-3 w-3 shrink-0", {
    "text-surface-dark-foreground/50": variant === "default",
    "text-white/50": variant === "primary-bold",
    "text-white/30": variant === "tiny",
    "text-surface-dark-foreground/50 h-3 w-3": variant === "contacts",
  });

  const currentItemClasses = cn({
    "text-primary": variant === "default" || variant === "tiny",
    "text-white": variant === "primary-bold",
    "text-surface-dark-foreground": variant === "contacts",
  });

  return (
    <nav className={containerClasses} aria-label="breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <Fragment key={idx}>
            {idx > 0 && <ChevronRight className={chevronClasses} />}
            {isLast || !item.to ? (
              <span className={isLast ? currentItemClasses : linkClasses}>{item.label}</span>
            ) : (
              <Link
                to={item.to as any}
                params={item.params}
                search={item.search}
                className={linkClasses}
              >
                {item.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
