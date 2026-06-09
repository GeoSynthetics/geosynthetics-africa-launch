import { useState, useEffect, useMemo, useRef } from "react";
import { Link, type LinkComponentProps, useLocation } from "@tanstack/react-router";
import { buildMegaMenuFromHierarchy, getDefaultSections } from "@/lib/hierarchy-utils";
import { supabase } from "@/integrations/supabase/client";
import { Menu, Upload, X, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { useQuickQuote } from "@/hooks/use-quick-quote";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
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

type AnyLinkProps = Omit<LinkComponentProps, "to"> & { to: string; params?: Record<string, string> };
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

const MEGAMENU_CLOSE_DELAY = 1500; // milliseconds delay before closing the mega menu

function useDynamicMegaMenus() {
  const [menus, setMenus] = useState<typeof megaMenus>(megaMenus);

  useEffect(() => {
    const SECTION_KEYS = ["products", "applications", "services", "industries"] as const;

    supabase
      .from("site_config")
      .select("key, value")
      .in("key", SECTION_KEYS.map(k => `hierarchy_${k}`))
      .then(async ({ data }) => {
        if (!data || data.length === 0) return;
        const defaults = getDefaultSections();
        const sections = SECTION_KEYS.map(key => {
          const row = data.find(d => d.key === `hierarchy_${key}`);
          return (row?.value ?? defaults.find((d: any) => d.key === key)) as any;
        }).filter(Boolean);

        if (sections.length === 0) return;

        let builtMenus = buildMegaMenuFromHierarchy(sections);

        // ── Auto-hydrate featured product paths and images ────────────────────
        // Hydrate both the redirect paths to /products/$category/$family and
        // the real image_url from Supabase products.

        const slugsToHydrate = new Set<string>();

        const getProductSlug = (item: any): string | undefined => {
          if (item.params?.family) return item.params.family;
          if (item.params?.slug) return item.params.slug;
          if (typeof item.to === "string") {
            const parts = item.to.split("/").filter(Boolean);
            const last = parts[parts.length - 1];
            if (last && !last.startsWith("$")) return last;
          }
          return undefined;
        };

        const collectSlugs = (featured: any[]) => {
          for (const item of featured) {
            const slug = getProductSlug(item);
            if (slug) slugsToHydrate.add(slug);
          }
        };

        for (const menu of builtMenus) {
          if (menu.columns.featuredKind === "product" && menu.columns.featured) {
            collectSlugs(menu.columns.featured as any[]);
          }
          for (const primary of menu.columns.primary) {
            if (primary.content?.featuredKind === "product" && primary.content.featured) {
              collectSlugs(primary.content.featured as any[]);
            }
          }
        }

        if (slugsToHydrate.size > 0) {
          const { data: productData } = await supabase
            .from("products")
            .select("slug, image_url, product_categories ( slug )")
            .in("slug", Array.from(slugsToHydrate));

          const productMap = new Map<string, { image_url: string | null; category_slug: string }>();
          if (productData) {
            for (const p of productData as any[]) {
              const catSlug = Array.isArray(p.product_categories)
                ? p.product_categories[0]?.slug
                : p.product_categories?.slug;
              productMap.set(p.slug, {
                image_url: p.image_url,
                category_slug: catSlug || "geomembranes",
              });
            }
          }

          if (productMap.size > 0) {
            const hydrate = (featured: any[]) =>
              featured.map(item => {
                const slug = getProductSlug(item);
                const dbProduct = slug ? productMap.get(slug) : undefined;
                if (dbProduct) {
                  return {
                    ...item,
                    to: "/catalogue/$slug",
                    params: {
                      slug: slug,
                    },
                    image: dbProduct.image_url || item.image || "",
                  };
                }
                return item;
              });

            builtMenus = builtMenus.map(menu => ({
              ...menu,
              columns: {
                ...menu.columns,
                featured:
                  menu.columns.featuredKind === "product" && menu.columns.featured
                    ? (hydrate(menu.columns.featured as any[]) as any)
                    : menu.columns.featured,
                primary: menu.columns.primary.map(p => ({
                  ...p,
                  content: p.content
                    ? {
                      ...p.content,
                      featured:
                        p.content.featuredKind === "product" && p.content.featured
                          ? (hydrate(p.content.featured as any[]) as any)
                          : p.content.featured,
                    }
                    : p.content,
                })),
              },
            }));
          }
        }

        setMenus(builtMenus);
      });
  }, []);

  return menus;
}

function DesktopNav({ menus }: { menus: typeof megaMenus }) {
  const [value, setValue] = useState<string>("");
  const location = useLocation();
  const isInside = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="hidden xl:flex flex-1 justify-center !max-w-none min-w-0"
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
        className="!max-w-none min-w-0"
      >
        <NavigationMenuList className="gap-0">
          {menus.map((m) => (
            <NavigationMenuItem key={m.key} value={m.key}>
              <NavigationMenuTrigger className="bg-transparent px-2 2xl:px-3 whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary data-[state=open]:text-primary">
                {m.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-[1280px] max-w-[calc(100vw-2rem)] p-0 border-0 bg-transparent shadow-none">
                <MegaPanel config={m} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          {SIMPLE_NAV.map((item) => (
            <NavigationMenuItem key={item.to}>
              <NavigationMenuLink asChild>
                <RLink
                  to={item.to}
                  params={item.params}
                  className="inline-flex items-center whitespace-nowrap px-2 2xl:px-3 py-2 text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary transition"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </RLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function MobileNav({ menus }: { menus: typeof megaMenus }) {
  const [open, setOpen] = useState(false);
  const { open: openQuickQuote } = useQuickQuote();
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
            {menus.map((m) => (
              <AccordionItem value={m.key} key={m.key}>
                <AccordionTrigger className="text-sm font-bold uppercase tracking-wide">{m.label}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pl-2">
                    <li>
                      <RLink
                        to={m.to}
                        onClick={() => setOpen(false)}
                        className="block py-3 text-sm font-semibold text-primary"
                      >
                        All {m.label} →
                      </RLink>
                    </li>
                    {m.columns.primary.map((item) => (
                      <li key={item.label}>
                        <RLink
                          to={item.to}
                          params={item.params}
                          onClick={() => setOpen(false)}
                          className="block py-3 text-sm text-foreground hover:text-primary"
                        >
                          {item.label}
                        </RLink>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <ul className="mt-2 border-t border-border pt-2">
            {SIMPLE_NAV.map((item) => (
              <li key={item.to}>
                <RLink
                  to={item.to}
                  params={item.params}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-bold uppercase tracking-wide text-foreground hover:text-primary"
                >
                  {item.label}
                </RLink>
              </li>
            ))}
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
            Upload Project BOQ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UserMenu() {
  const { isAuthenticated, user, isStaff, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="hidden xl:inline-flex font-semibold uppercase tracking-wide text-xs"
      >
        <Link to="/login">
          <UserIcon className="h-4 w-4 mr-1.5" />
          Sign In
        </Link>
      </Button>
    );
  }

  const label = user?.email?.split("@")[0] ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hidden xl:inline-flex font-semibold uppercase tracking-wide text-xs"
        >
          <UserIcon className="h-4 w-4 mr-1.5" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        {isStaff && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const menus = useDynamicMegaMenus();
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
    <div className="flex items-center gap-4 2xl:gap-6 py-4 px-5">
      <Logo />
      <DesktopNav menus={menus} />
      <div className="flex items-center gap-2 ml-auto xl:ml-0">
        <MobileNav menus={menus} />
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full relative z-40">
        <TopBar />
        <header className="bg-background border-b border-border">
          {headerContent}
        </header>
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transform transition-all duration-300 ease-in-out ${isScrolled ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0 pointer-events-none"
          }`}
      >
        {headerContent}
      </header>
    </>
  );
}
