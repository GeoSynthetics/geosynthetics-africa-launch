import { Sun, Moon } from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AdminFloatingThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("fixed bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none", className)}>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={cn(
                "relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-200 ease-out shadow-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:scale-105 active:scale-95 backdrop-blur-md",
                isDark
                  ? "bg-card/90 border-border/80 text-foreground shadow-black/40 hover:bg-muted/90 hover:border-primary/50"
                  : "bg-white/90 border-slate-200 text-slate-800 shadow-slate-300/40 hover:bg-slate-50 hover:border-amber-400/60"
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
              <span className="text-xs font-bold uppercase tracking-wider font-display whitespace-nowrap">
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>

              {/* Theme Icon (Right) */}
              <div className="relative flex h-4.5 w-4.5 shrink-0 items-center justify-center">
                <Sun
                  className={cn(
                    "h-4 w-4 text-amber-500 transition-all duration-300 absolute",
                    isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  )}
                />
                <Moon
                  className={cn(
                    "h-4 w-4 text-primary transition-all duration-300 absolute",
                    isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  )}
                />
              </div>
            </button>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            sideOffset={10}
            className="text-xs font-bold uppercase tracking-wider bg-foreground text-background font-display px-3 py-1.5 shadow-md"
          >
            Switch to {isDark ? "Light Mode" : "Dark Mode"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
