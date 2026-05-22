import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Inbox,
  Package,
  FileText,
  Users,
  LayoutTemplate,
  Search,
  LayoutList,
  Image,
  ChevronLeft,
  ChevronRight,
  Menu,
  Shield,
  Cookie,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { to: "/admin" as const, label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/quotes" as const, label: "Quote Requests", icon: Inbox, exact: false },
  { to: "/admin/products" as const, label: "Products", icon: Package, exact: false },
  { to: "/admin/resources" as const, label: "Resources", icon: FileText, exact: false },
  { to: "/admin/site-builder" as const, label: "Site Builder", icon: LayoutTemplate, exact: false },
  { to: "/admin/page-templates" as const, label: "Page Templates", icon: LayoutList, exact: false },
  { to: "/admin/media-center" as const, label: "Media Center", icon: Image, exact: false },
  { to: "/admin/pages-seo" as const, label: "Pages SEO", icon: Search, exact: false },
  { to: "/admin/tracking" as const, label: "Tracking & Cookies", icon: Cookie, exact: false },
  { to: "/admin/users" as const, label: "Users & Roles", icon: Users, exact: false },
];

export function AdminNav() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gsa-admin-sidebar-collapsed");
      return stored === "true";
    }
    return false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("gsa-admin-sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Automatically close mobile menu on path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Navigation Header Bar */}
      <div className="lg:hidden w-full flex items-center justify-between p-4 bg-card/85 backdrop-blur-md border border-border/50 rounded-2xl shadow-sm mb-6 select-none">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-primary leading-none">Admin</div>
            <h1 className="font-display text-base font-bold uppercase tracking-tight text-foreground leading-tight mt-0.5">Control Panel</h1>
          </div>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border/50 hover:bg-muted/50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-6 bg-card border-r border-border/50 flex flex-col h-full">
            <SheetHeader className="mb-6 flex flex-row items-center gap-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block leading-none">Admin</span>
                <SheetTitle className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground mt-0.5">Control Panel</SheetTitle>
              </div>
            </SheetHeader>

            <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
              {ITEMS.map((it) => {
                const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className={cn(
                      "relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group/item",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <it.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover/item:scale-105", active ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground")} />
                    <span className="uppercase font-display tracking-wider text-xs font-bold">
                      {it.label}
                    </span>
                    {active && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Collapsible Sticky Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 sticky top-6 bg-card/85 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg transition-all duration-300 ease-in-out select-none overflow-hidden p-4 h-[calc(100vh-8rem)] min-h-[600px]",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className={cn("flex items-center gap-3 px-2 py-3 border-b border-border/50 mb-6 shrink-0", isCollapsed ? "justify-center" : "")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none">Admin</span>
              <span className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground leading-tight mt-0.5">Control Panel</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
            {ITEMS.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              
              const content = (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group/item",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    isCollapsed ? "justify-center" : ""
                  )}
                >
                  <it.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover/item:scale-105", active ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground")} />
                  {!isCollapsed && (
                    <span className="truncate uppercase font-display tracking-wider text-xs font-bold animate-in fade-in duration-200">
                      {it.label}
                    </span>
                  )}
                  {active && !isCollapsed && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r" />
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={it.to}>
                    <TooltipTrigger asChild>
                      {content}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12} className="font-bold text-xs uppercase bg-foreground text-background">
                      {it.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return content;
            })}
          </nav>
        </TooltipProvider>

        {/* Toggle Button at Bottom */}
        <div className="mt-auto pt-4 border-t border-border/50 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center gap-3.5 px-3.5 py-3 w-full rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer",
              isCollapsed ? "justify-center" : ""
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="uppercase font-display tracking-wider text-xs font-bold animate-in fade-in duration-200">Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
