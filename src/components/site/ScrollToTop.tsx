import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winScroll = window.scrollY;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          
          if (height > 0) {
            const scrolled = Math.min(100, Math.max(0, (winScroll / height) * 100));
            setProgress(scrolled);
          } else {
            setProgress(0);
          }
          
          setIsVisible(winScroll > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const size = 56;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Prevent NaN when progress is 0/undefined
  const safeProgress = Number.isNaN(progress) ? 0 : progress;
  const strokeDashoffset = Math.max(0, Math.min(circumference, circumference - (safeProgress / 100) * circumference));

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 group flex items-center justify-center transition-all duration-500 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <div className="relative h-14 w-14 bg-background rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.08)] flex items-center justify-center hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300">
        {/* Progress Circle SVG */}
        <svg height={size} width={size} className="absolute -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-border/40"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>

        {/* Text content */}
        <span className="text-[13px] font-bold text-primary select-none mt-[1px]">
          {Math.round(safeProgress)}%
        </span>
      </div>
    </button>
  );
}
