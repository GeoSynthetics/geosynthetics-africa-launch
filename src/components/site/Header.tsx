import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Upload, X, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

function DesktopNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {megaMenus.map((m) => (
          <NavigationMenuItem key={m.key}>
            <NavigationMenuTrigger className="bg-transparent text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary data-[state=open]:text-primary">
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
              <Link
                to={item.to}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary transition"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
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
            {megaMenus.map((m) => (
              <AccordionItem value={m.key} key={m.key}>
                <AccordionTrigger className="text-sm font-bold uppercase tracking-wide">
                  {m.label}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pl-2">
                    <li>
                      <Link
                        to={m.to}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm font-semibold text-primary"
                      >
                        All {m.label} →
                      </Link>
                    </li>
                    {m.columns.primary.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-foreground hover:text-primary"
                        >
                          {item.label}
                        </Link>
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
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-bold uppercase tracking-wide text-foreground hover:text-primary"
                >
                  {item.label}
                </Link>
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

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <TopBar />
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground font-semibold uppercase tracking-wide text-xs">
            <Link to="/contacts">
              Upload Project BOQ
              <Upload className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
