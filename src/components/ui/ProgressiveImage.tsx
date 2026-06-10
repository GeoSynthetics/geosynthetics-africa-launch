import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholderClassName?: string;
}

export function ProgressiveImage({ src, className, placeholderClassName, alt, ...props }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  useEffect(() => {
    if (!src) {
      setIsLoaded(false);
      setCurrentSrc("");
      return;
    }

    setIsLoaded(false);
    
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-950">
      {/* Skeleton Pulse Placeholder */}
      {!isLoaded && (
        <Skeleton 
          className={cn("absolute inset-0 w-full h-full bg-stone-900/80 animate-pulse rounded-none", placeholderClassName)} 
        />
      )}
      
      {/* Real Image loaded asynchronously */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            "transition-all duration-700 ease-out",
            isLoaded ? "opacity-75 group-hover:opacity-85 blur-0 scale-100" : "opacity-0 blur-lg scale-105",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
