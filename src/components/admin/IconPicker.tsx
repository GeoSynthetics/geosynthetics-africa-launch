import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Search } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Extract all valid icon names from lucide-react exports
const ALL_ICON_NAMES = Object.keys(LucideIcons).filter((key) => {
  const exportValue = (LucideIcons as any)[key];
  return (
    /^[A-Z]/.test(key) &&
    (typeof exportValue === "object" || typeof exportValue === "function") &&
    key !== "createReactComponent"
  );
});

// A simple subsequence fuzzy match helper
function fuzzyMatch(name: string, query: string): boolean {
  const q = query.toLowerCase();
  const n = name.toLowerCase();
  let qIdx = 0;
  for (let i = 0; i < n.length; i++) {
    if (n[i] === q[qIdx]) {
      qIdx++;
      if (qIdx === q.length) return true;
    }
  }
  return false;
}

const LOCAL_STORAGE_KEY = "icon-picker-recent-icons";
const MAX_RECENT_ICONS = 6;

export function IconPicker({
  value,
  onChange,
  placeholder = "Select icon...",
  className,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(100);
  const [recentIcons, setRecentIcons] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load recent icons when popover opens or component mounts
  useEffect(() => {
    if (open) {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRecentIcons(parsed.filter((name) => ALL_ICON_NAMES.includes(name)));
          }
        }
      } catch (e) {
        console.warn("Failed to parse recent icons from localStorage", e);
      }
    }
  }, [open]);

  // Reset visible count when search changes or popover opens/closes
  useEffect(() => {
    setVisibleCount(100);
  }, [search, open]);

  // Filter icons based on search query, returning all matches prioritized by match type
  const allFilteredIcons = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return ALL_ICON_NAMES;
    }

    // First check standard search (substring matches)
    const standardMatches = ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(query));

    // If it's not found in standard matches, search the rest of the icons using fuzzy matching
    const standardMatchSet = new Set(standardMatches);
    const restMatches = ALL_ICON_NAMES.filter(
      (name) => !standardMatchSet.has(name) && fuzzyMatch(name, query),
    );

    return [...standardMatches, ...restMatches];
  }, [search]);

  // Slice list for performance
  const displayedIcons = useMemo(() => {
    return allFilteredIcons.slice(0, visibleCount);
  }, [allFilteredIcons, visibleCount]);

  // Callback ref for Infinite Scroll / Lazy Loading intersection observer
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node && typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setVisibleCount((prev) => Math.min(prev + 100, allFilteredIcons.length));
            }
          },
          { threshold: 0.1 },
        );
        observer.observe(node);
        observerRef.current = observer;
        (node as any)._intersectionObserver = observer;
      }
    },
    [allFilteredIcons.length],
  );

  // Resolve the selected icon component dynamically
  const SelectedIconComponent = useMemo(() => {
    if (!value) return null;
    return (LucideIcons as any)[value] || null;
  }, [value]);

  const handleSelect = (iconName: string) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const recents: string[] = stored ? JSON.parse(stored) : [];
      const updated = [iconName, ...recents.filter((name) => name !== iconName)].slice(
        0,
        MAX_RECENT_ICONS,
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save recent icon to localStorage", e);
    }
    onChange(iconName);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left font-normal h-9 px-3 bg-background border-border hover:bg-accent/50 text-xs truncate cursor-pointer",
              !value && "text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {SelectedIconComponent ? (
                <SelectedIconComponent className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center text-[10px]">
                  ?
                </span>
              )}
              <span className="truncate">{value || placeholder}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClear(e as any);
                    }
                  }}
                  className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer flex items-center justify-center"
                  title="Clear icon"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] p-0 bg-popover border border-border rounded-lg shadow-xl z-50"
          align="start"
        >
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full border-0 bg-transparent p-0 text-xs focus-visible:ring-0 placeholder:text-muted-foreground/60"
              autoFocus
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearch("")}
                className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {recentIcons.length > 0 && !search && (
            <div className="border-b border-border p-2 bg-muted/10">
              <div className="text-[10px] text-muted-foreground font-semibold px-1 mb-1.5 uppercase tracking-wider">
                Recently Used
              </div>
              <div className="grid grid-cols-6 gap-1">
                {recentIcons.map((name) => {
                  const Icon = (LucideIcons as any)[name];
                  if (!Icon) return null;
                  const isSelected = value === name;

                  return (
                    <button
                      key={`recent-${name}`}
                      type="button"
                      onClick={() => handleSelect(name)}
                      onMouseEnter={() => setHoveredIcon(name)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      title={`${name} (Recent)`}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border border-transparent transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-accent hover:text-primary hover:scale-105 text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <ScrollArea className="h-[220px]">
            {displayedIcons.length > 0 ? (
              <div className="grid grid-cols-6 gap-1 p-2">
                {displayedIcons.map((name) => {
                  const Icon = (LucideIcons as any)[name];
                  if (!Icon) return null;
                  const isSelected = value === name;

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelect(name)}
                      onMouseEnter={() => setHoveredIcon(name)}
                      onMouseLeave={() => setHoveredIcon(null)}
                      title={name}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border border-transparent transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-accent hover:text-primary hover:scale-105 text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </button>
                  );
                })}
                {allFilteredIcons.length > displayedIcons.length && (
                  <div
                    ref={loadMoreRef}
                    className="col-span-6 h-8 flex items-center justify-center text-[10px] text-muted-foreground/50 py-2"
                  >
                    Loading more...
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground italic">
                No matching icons found
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-border p-2 bg-surface/30 min-h-[28px] flex items-center justify-between text-[10px] text-muted-foreground font-semibold px-3 uppercase tracking-wider rounded-b-lg">
            {hoveredIcon ? (
              <span className="text-primary truncate">{hoveredIcon}</span>
            ) : value ? (
              <span>
                Selected: <strong className="text-foreground">{value}</strong>
              </span>
            ) : (
              <span>Hover an icon to see name</span>
            )}
            <span className="text-muted-foreground/50">
              {displayedIcons.length} of {allFilteredIcons.length} shown
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
