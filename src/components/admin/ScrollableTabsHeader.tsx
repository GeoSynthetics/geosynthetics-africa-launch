import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableTabsHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableTabsHeader({ children, className }: ScrollableTabsHeaderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    // Add a slight delay check to ensure layout is fully rendered
    const timer = setTimeout(checkScroll, 100);

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      clearTimeout(timer);
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 240;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full border-b border-border bg-surface/10 shrink-0",
        className,
      )}
    >
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-2 z-20 p-1.5 rounded-full bg-surface-hover/90 text-primary border border-border shadow-lg hover:bg-surface-hover hover:scale-105 transition-all focus:outline-none"
          title="Scroll Left"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div ref={scrollRef} className="w-full overflow-x-auto no-scrollbar scroll-smooth px-6">
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-2 z-20 p-1.5 rounded-full bg-surface-hover/90 text-primary border border-border shadow-lg hover:bg-surface-hover hover:scale-105 transition-all focus:outline-none"
          title="Scroll Right"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
