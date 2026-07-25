import { Sun, Moon } from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AdminFloatingThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("fixed left-0 top-1/2 -translate-y-1/2 z-50 select-none group", className)}>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={cn(
                "relative flex items-center gap-3 pl-3.5 pr-4 py-3 rounded-r-2xl border-y border-r transition-all duration-300 ease-out shadow-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "-translate-x-[calc(100%-2.25rem)] hover:translate-x-0 group-hover:translate-x-0 focus-within:translate-x-0 focus:translate-x-0",
                isDark
                  ? "bg-card/95 border-border/80 text-foreground shadow-black/50 hover:bg-muted/80 hover:border-primary/50"
                  : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-400/30 hover:bg-slate-50 hover:border-amber-400/60"
              )}
            >
              {/* Pulsating Indicator Dot (Left) */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isDark ? "bg-primary" : "bg-amber-400"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    isDark ? "bg-primary" : "bg-amber-500"
                  )}
                />
              </span>

              {/* Text Label (Middle) */}
              <span className="text-xs font-bold uppercase tracking-wider font-display whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>

              {/* Theme Icon (Right) */}
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <Sun
                  className={cn(
                    "h-4.5 w-4.5 text-amber-500 transition-all duration-300 absolute",
                    isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  )}
                />
                <Moon
                  className={cn(
                    "h-4.5 w-4.5 text-primary transition-all duration-300 absolute",
                    isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  )}
                />
              </div>
            </button>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            sideOffset={12}
            className="text-xs font-bold uppercase tracking-wider bg-foreground text-background font-display px-3 py-1.5 shadow-md"
          >
            Switch to {isDark ? "Light Mode" : "Dark Mode"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
