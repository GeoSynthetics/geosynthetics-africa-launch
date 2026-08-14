import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Link,
  type LinkComponentProps,
  useLocation,
  useNavigate,
  useRouter,
  useMatches,
} from "@tanstack/react-router";
import { useDynamicMegaMenus } from "@/hooks/use-dynamic-menus";
import { Menu, Upload } from "lucide-react";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { Logo } from "./Logo";
import { TopBar } from "./TopBar";
import { MegaPanel, megaMenus } from "./MegaMenu";
import { SIMPLE_NAV } from "./mega-menu-data";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

type AnyLinkProps = Omit<LinkComponentProps, "to"> & {
  to: string;
  params?: Record<string, string>;
};
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

const MEGAMENU_CLOSE_DELAY = 150000; // milliseconds delay before closing the mega menu

function DesktopNav({ menus, isLoading }: { menus: typeof megaMenus; isLoading: boolean }) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const isInside = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = location.pathname;
  const matches = useMatches();
  const slugMatch = matches.find((m) => m.routeId === "/$slug");
  const slugLoaderData = slugMatch?.loaderData as any;

  const isActiveRoute = (to: string) => {
    if (to === "/") {
      return pathname === "/";
    }
    const directMatch = pathname === to || pathname.startsWith(to + "/");
    if (directMatch) return true;

    if (slugLoaderData) {
      if (slugLoaderData.type === "application" && to === "/applications") {
        return true;
      }
      if (slugLoaderData.type === "service" && to === "/services") {
        return true;
      }
      if (slugLoaderData.type === "industry" && to === "/industries") {
        return true;
      }
      if (slugLoaderData.type === "core" && slugLoaderData.originalPath === to) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setValue("");
  }, [location.pathname]);

  const handleValueChange = (val: string) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (val !== "") {
      isInside.current = true;
      setValue(val);
    } else {
      // Schedule the close timeout but verify cursor position when it runs
      timeoutRef.current = window.setTimeout(() => {
        if (!isInside.current) {
          setValue("");
        }
      }, MEGAMENU_CLOSE_DELAY);
    }
  };

  const handleMouseEnter = () => {
    isInside.current = true;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    isInside.current = false;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    // Close the mega menu if the user's cursor has been outside for the configured delay
    timeoutRef.current = window.setTimeout(() => {
      if (!isInside.current) {
        setValue("");
      }
    }, MEGAMENU_CLOSE_DELAY);
  };

  useEffect(() => {
    const handleOutsideClick = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      const insideViewportWrapper = target.closest('[data-megamenu-viewport-wrapper="true"]');
      const insideMegaPanel = target.closest('[data-megamenu-panel="true"]');
      const insideHeader = target.closest("header") && !insideViewportWrapper;

      // Close if click is outside both the visible header bar and the visible white panel
      if (value && !insideHeader && !insideMegaPanel) {
        setValue("");
        isInside.current = false;
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    const handleScroll = () => {
      if (value) {
        setValue("");
        isInside.current = false;
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && value) {
        setValue("");
        isInside.current = false;
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const insideViewportWrapper = target.closest('[data-megamenu-viewport-wrapper="true"]');
      const insideMegaPanel = target.closest('[data-megamenu-panel="true"]');
      const insideHeader = target.closest("header") && !insideViewportWrapper;

      if (value && !insideHeader && !insideMegaPanel) {
        setValue("");
        isInside.current = false;
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    // capture:true fires before Radix can handle the event
    window.addEventListener("pointerdown", handleOutsideClick, true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("pointerdown", handleOutsideClick, true);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocusIn);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="hidden xl:flex self-stretch flex-1 justify-center items-stretch !max-w-none min-w-0"
    >
      <NavigationMenu
        value={value}
        onValueChange={handleValueChange}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("a")) {
            setValue("");
            isInside.current = false;
            if (timeoutRef.current) {
              window.clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        }}
        className="!max-w-none min-w-0 h-full flex items-stretch"
      >
        <NavigationMenuList className="gap-0 h-full flex items-stretch">
          {menus.map((m) => {
            const active = isActiveRoute(m.to);
            return (
              <NavigationMenuItem key={m.key} value={m.key} className="h-full flex items-stretch">
                <NavigationMenuTrigger
                  onMouseEnter={() => {
                    router.preloadRoute({ to: m.to }).catch((err) => {
                      console.warn("Failed to prefetch route:", m.to, err);
                    });
                  }}
                  onClick={(e) => {
                    if (value === m.key) {
                      e.preventDefault();
                      navigate({ to: m.to });
                    }
                  }}
                  className={`bg-transparent px-2 2xl:px-3 h-full flex items-center whitespace-nowrap text-sm font-semibold uppercase tracking-wide transition border-b-2 rounded-none hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent ${
                    active
                      ? "text-primary border-primary"
                      : "text-foreground border-transparent hover:text-primary data-[state=open]:text-primary"
                  }`}
                >
                  {t(`nav.${m.key}`, m.label)}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[1280px] max-w-[calc(100vw-2rem)] p-0 border-0 bg-transparent shadow-none">
                  <MegaPanel config={m} isLoading={isLoading} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
          {SIMPLE_NAV.map((item) => {
            const active = isActiveRoute(item.to);
            const getSimpleNavKey = (label: string) => {
              if (label === "Projects") return "nav.projects";
              if (label === "Quality Assurance") return "nav.qualityAssurance";
              if (label === "Catalogue") return "nav.catalogue";
              if (label === "Resources") return "nav.resources";
              if (label === "Blog") return "nav.blog";
              if (label === "Contacts") return "nav.contacts";
              return label;
            };
            return (
              <NavigationMenuItem key={item.to} className="h-full flex items-stretch">
                <NavigationMenuLink asChild>
                  <RLink
                    to={item.to}
                    params={item.params}
                    className={`inline-flex h-full items-center justify-center whitespace-nowrap px-2 2xl:px-3 text-sm font-semibold uppercase tracking-wide transition border-b-2 rounded-none hover:text-primary ${
                      active ? "text-primary border-primary" : "text-foreground border-transparent"
                    }`}
                  >
                    {t(getSimpleNavKey(item.label), item.label)}
                  </RLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function MobileNav({ menus, isLoading }: { menus: typeof megaMenus; isLoading: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { open: openQuickQuote } = useQuickQuote();
  const location = useLocation();
  const matches = useMatches();
  const pathname = location.pathname;

  const slugMatch = matches.find((m) => m.routeId === "/$slug");
  const slugLoaderData = slugMatch?.loaderData as any;

  const isActiveRoute = (to: string) => {
    if (to === "/") {
      return pathname === "/";
    }
    const directMatch = pathname === to || pathname.startsWith(to + "/");
    if (directMatch) return true;

    if (slugLoaderData) {
      if (slugLoaderData.type === "application" && to === "/applications") {
        return true;
      }
      if (slugLoaderData.type === "service" && to === "/services") {
        return true;
      }
      if (slugLoaderData.type === "industry" && to === "/industries") {
        return true;
      }
      if (slugLoaderData.type === "core" && slugLoaderData.originalPath === to) {
        return true;
      }
    }
    return false;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        <SheetHeader className="border-b border-border p-4 flex flex-row items-center justify-between space-y-0">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu for Geosynthetics Africa
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="single" collapsible>
            {menus.map((m) => {
              const active = isActiveRoute(m.to);
              return (
                <AccordionItem value={m.key} key={m.key}>
                  <AccordionTrigger
                    className={`text-sm font-bold uppercase tracking-wide transition-colors ${active ? "text-primary" : "text-foreground"}`}
                  >
                    {t(`nav.${m.key}`, m.label)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <RLink
                          to={m.to}
                          onClick={() => setOpen(false)}
                          className="block py-3 text-sm font-semibold text-primary"
                        >
                          {t("nav.allCategory", "All {{category}} →", {
                            category: t(`nav.${m.key}`, m.label),
                          })}
                        </RLink>
                      </li>
                      {isLoading ? (
                        <div className="py-2 pl-2 space-y-2">
                          <Skeleton className="h-4 w-3/4 bg-muted animate-pulse" />
                          <Skeleton className="h-4 w-1/2 bg-muted animate-pulse" />
                          <Skeleton className="h-4 w-2/3 bg-muted animate-pulse" />
                        </div>
                      ) : (
                        m.columns.primary.map((item) => (
                          <li key={item.label}>
                            <RLink
                              to={item.to}
                              params={item.params}
                              onClick={() => setOpen(false)}
                              className="block py-3 text-sm text-foreground hover:text-primary"
                              activeProps={{ className: "!text-primary" }}
                            >
                              {item.label}
                            </RLink>
                          </li>
                        ))
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          <ul className="mt-2 border-t border-border pt-2">
            {SIMPLE_NAV.map((item) => {
              const active = isActiveRoute(item.to);
              const getSimpleNavKey = (label: string) => {
                if (label === "Projects") return "nav.projects";
                if (label === "Quality Assurance") return "nav.qualityAssurance";
                if (label === "Catalogue") return "nav.catalogue";
                if (label === "Resources") return "nav.resources";
                if (label === "Blog") return "nav.blog";
                if (label === "Contacts") return "nav.contacts";
                return label;
              };
              return (
                <li key={item.to}>
                  <RLink
                    to={item.to}
                    params={item.params}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {t(getSimpleNavKey(item.label), item.label)}
                  </RLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t border-border p-4">
          <Button
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer border-0"
            onClick={() => {
              setOpen(false);
              openQuickQuote();
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            {t("nav.uploadBoq", "Upload Project BOQ")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const { menus, isLoading } = useDynamicMegaMenus();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 200);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerContent = (
    <div className="flex items-center gap-4 2xl:gap-6 px-5 h-[72px]">
      <Logo />
      <DesktopNav menus={menus} isLoading={isLoading} />
      <div className="flex items-center gap-2 ml-auto xl:ml-0">
        <MobileNav menus={menus} isLoading={isLoading} />
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full relative z-40">
        <TopBar />
        <header className="bg-background border-b border-border">{headerContent}</header>
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transform transition-all duration-300 ease-in-out ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-[100%] opacity-0 pointer-events-none"
        }`}
      >
        {headerContent}
      </header>
    </>
  );
}
