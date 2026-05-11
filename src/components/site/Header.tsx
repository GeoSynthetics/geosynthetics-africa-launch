import { useState, useEffect, useMemo } from "react";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Menu, Upload, X, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
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

function useDynamicMegaMenus() {
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    supabase.from("site_config").select("value").eq("key", "mega_menu").maybeSingle().then(({ data }) => {
      if (data && data.value) {
        setConfig(data.value);
      }
    });
  }, []);

  const menus = useMemo(() => {
    return megaMenus.map(m => {
      if (config[m.key]) {
        return {
          ...m,
          columns: {
            ...m.columns,
            ...config[m.key]
          }
        };
      }
      return m;
    });
  }, [config]);

  return menus;
}

function DesktopNav({ menus }: { menus: typeof megaMenus }) {
  return (
    <NavigationMenu className="hidden xl:flex flex-1 justify-center !max-w-none min-w-0">
      <NavigationMenuList className="gap-0">
        {menus.map((m) => (
          <NavigationMenuItem key={m.key}>
            <NavigationMenuTrigger className="bg-transparent px-2 2xl:px-3 whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary data-[state=open]:text-primary">
              {m.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="left-1/2 -translate-x-1/2 !w-screen !max-w-[1280px] p-0 border-0 bg-transparent shadow-none">
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
  );
}

function MobileNav({ menus }: { menus: typeof megaMenus }) {
  const [open, setOpen] = useState(false);
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
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
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
                        className="block py-2 text-sm font-semibold text-primary"
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
                          className="block py-2 text-sm text-foreground hover:text-primary"
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
          <Button asChild className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
            <Link to="/contacts" onClick={() => setOpen(false)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Project BOQ
            </Link>
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

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <TopBar />
      <div className="flex items-center gap-4 2xl:gap-6 py-4 px-5">
        <Logo />
        <DesktopNav menus={menus} />
        <div className="flex items-center gap-2 ml-auto xl:ml-0">
          <Button
            asChild
            className="hidden xl:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground font-semibold uppercase tracking-wide text-xs"
          >
            <Link to="/contacts">
              Upload Project BOQ
              <Upload className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <MobileNav menus={menus} />
        </div>
      </div>
    </header>
  );
}
