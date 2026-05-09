import { Award, ShieldCheck, Globe, Truck, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { icon: Award, label: "IAGI Member - One of only 5 in Africa" },
  { icon: ShieldCheck, label: "B-BBEE Level 2" },
  { icon: ShieldCheck, label: "QA/QC Certified" },
  { icon: Truck, label: "Pan-African Logistics" },
];

function PartnerPortalLink() {
  const { isAuthenticated, user, isStaff, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition whitespace-nowrap"
      >
        <UserIcon className="h-3.5 w-3.5" />
        <span>Partner Portal</span>
      </Link>
    );
  }

  const label = user?.email?.split("@")[0] ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-primary transition whitespace-nowrap outline-none">
        <UserIcon className="h-3.5 w-3.5" />
        <span className="max-w-[140px] truncate">{label}</span>
        <ChevronDown className="h-3 w-3" />
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

export function TopBar() {
  return (
    <div className="bg-surface-dark text-surface-dark-foreground text-xs">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        <div className="hidden md:flex items-center gap-6 overflow-hidden">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 whitespace-nowrap opacity-90">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="md:hidden flex items-center gap-2 opacity-90">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span>Pan-African Geosynthetics Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <PartnerPortalLink />
          <button
            type="button"
            className="hidden sm:flex items-center gap-1 opacity-90 hover:opacity-100 transition"
            aria-label="Language selector"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>EN</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
