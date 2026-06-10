import { useState, useEffect } from "react";
import { Link, useRouter, type LinkComponentProps } from "@tanstack/react-router";
import * as LucideIcons from "lucide-react";

type AnyLinkProps = Omit<LinkComponentProps, "to" | "params"> & { to: string; params?: Record<string, string> };
const RLink = Link as unknown as React.ComponentType<AnyLinkProps>;

function closeMenus() {
  if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
import { useQuickQuote } from "@/hooks/use-quick-quote";
import {
  ChevronRight, BookOpen, Download, FileText, MessageCircle, PencilRuler, FileCheck, Upload,
  Layers, Grid3x3, Grid2x2, Hexagon, Sheet, Waves, Mountain, Wrench,
  Pickaxe, Droplets, Trash2, Construction, Sprout,
  Truck, HardHat, ClipboardCheck, Ship, LifeBuoy, Building2, Zap,
  Package, Globe, ShieldCheck,
} from "lucide-react";
import { megaMenus, type MegaMenuConfig, type MegaProductItem, type MegaFeatureItem } from "./mega-menu-data";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

const getIconComponent = (
  name: string | undefined,
  fallback: React.ComponentType<{ className?: string }> | undefined = BookOpen
): React.ComponentType<{ className?: string }> | undefined => {
  if (!name) return fallback;
  return (LucideIcons as any)[name] || fallback;
};

import { Skeleton } from "@/components/ui/skeleton";

interface SliderProduct {
  name: string;
  slug: string;
  image: string;
  short_description: string;
}

export function TopSellingProductsSlider({ products }: { products: SliderProduct[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
  const router = useRouter();
  
  // Track loaded state of each product image by index to avoid re-showing skeleton when sliding back
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // Reset states when products list changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFirstImageLoaded(false);
    setLoadedImages({});
  }, [products]);

  // Handle preloading current slide image or resolving immediately if no image is present
  useEffect(() => {
    if (!products || products.length === 0) return;

    const imageToLoad = products[currentIndex]?.image;
    if (!imageToLoad) {
      setIsFirstImageLoaded(true);
      setLoadedImages((prev) => ({ ...prev, [currentIndex]: true }));
      return;
    }

    if (loadedImages[currentIndex]) {
      setIsFirstImageLoaded(true);
      return;
    }

    const img = new Image();
    img.src = imageToLoad;
    img.onload = () => {
      setIsFirstImageLoaded(true);
      setLoadedImages((prev) => ({ ...prev, [currentIndex]: true }));
    };
    img.onerror = () => {
      setIsFirstImageLoaded(true);
      setLoadedImages((prev) => ({ ...prev, [currentIndex]: true }));
    };
  }, [products, currentIndex, loadedImages]);

  // Automatic rotation interval
  useEffect(() => {
    if (products.length <= 1 || isHovered || !isFirstImageLoaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length, isHovered, isFirstImageLoaded]);

  // Prefetch the active slide product detail page content to speed up transition on click
  useEffect(() => {
    if (!isFirstImageLoaded || !products || products.length === 0) return;
    
    const activeProduct = products[currentIndex];
    if (activeProduct?.slug) {
      router.preloadRoute({
        to: "/catalogue/$slug",
        params: { slug: activeProduct.slug }
      }).catch(err => {
        console.warn("Failed to prefetch route for product:", activeProduct.slug, err);
      });
    }
  }, [currentIndex, products, isFirstImageLoaded, router]);

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[180px] rounded-xl border border-dashed border-border bg-muted/20 text-center p-4">
        <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">No top selling products selected</p>
      </div>
    );
  }

  const showSkeleton = !isFirstImageLoaded;

  return (
    <div 
      className="relative w-full aspect-[4/3]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showSkeleton && (
        <div className="absolute inset-0 flex flex-col justify-end p-4 rounded-xl border border-border bg-stone-950 overflow-hidden z-20">
          <Skeleton className="absolute inset-0 w-full h-full bg-stone-900/80 animate-pulse rounded-none" />
          <div className="space-y-2.5 relative z-10">
            <Skeleton className="h-4 w-16 bg-stone-800 rounded animate-pulse" />
            <Skeleton className="h-5 w-3/4 bg-stone-800 rounded animate-pulse" />
            <Skeleton className="h-3 w-5/6 bg-stone-800 rounded animate-pulse" />
            <Skeleton className="h-3 w-2/3 bg-stone-800 rounded animate-pulse" />
          </div>
        </div>
      )}

      <div className={`w-full h-full relative ${showSkeleton ? "opacity-0" : "opacity-100 transition-opacity duration-300"}`}>
        {products.map((product, idx) => {
          const isActive = idx === currentIndex;
          return (
            <RLink
              key={product.slug}
              to="/catalogue/$slug"
              params={{ slug: product.slug }}
              onClick={closeMenus}
              className={`absolute inset-0 group block overflow-hidden rounded-xl border border-border shadow-md hover:shadow-xl hover:border-primary bg-stone-950 transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0 scale-100 pointer-events-auto z-10"
                  : "opacity-0 translate-x-6 scale-98 pointer-events-none z-0"
              }`}
            >
              {product.image ? (
                <ProgressiveImage
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                  <Package className="h-10 w-10 text-stone-600" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95 transition-opacity duration-300" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <div className="absolute top-3 left-3 bg-primary text-white font-display text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm z-10">
                  Best Seller
                </div>

                <div className="space-y-0.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h5 className="font-display text-xs font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h5>
                  {product.short_description && (
                    <p className="text-[10px] text-stone-300 line-clamp-2 font-medium leading-normal group-hover:text-white transition-colors duration-300">
                      {product.short_description}
                    </p>
                  )}
                  <div className="pt-1 flex items-center text-[9px] font-black uppercase tracking-widest text-primary gap-0.5 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View Product</span>
                    <ChevronRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </RLink>
          );
        })}

        {products.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-primary w-3" : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {products.length > 1 ? (
          <div
            key={`${currentIndex}-${isHovered}`}
            className={`absolute bottom-0 left-0 right-0 h-1 bg-primary z-20 ${
              isHovered ? "w-0 scale-x-0" : "animate-slide-progress"
            }`}
            style={{
              animationDuration: "5000ms",
            }}
          />
        ) : (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
        )}
      </div>
    </div>
  );
}

function MegaPanel({ config }: { config: MegaMenuConfig }) {
  const { open } = useQuickQuote();
  const { columns } = config;
  const [activeItem, setActiveItem] = useState(columns.primary[0]);

  const displayData = {
    secondaryTitle: activeItem?.content?.secondaryTitle || columns.secondaryTitle,
    secondary: activeItem?.content?.secondary || columns.secondary,
    featuredTitle: activeItem?.content?.featuredTitle || columns.featuredTitle,
    featuredKind: activeItem?.content?.featuredKind || columns.featuredKind,
    featured: activeItem?.content?.featured || columns.featured,
    quickActionsTitle: activeItem?.content?.quickActionsTitle || columns.quickActionsTitle,
    quickActions: activeItem?.content?.quickActions || columns.quickActions,
    topSellingProduct: activeItem?.content?.topSellingProduct,
    topSellingProducts: activeItem?.content?.topSellingProducts,
  };

  const isServiceOrAppOrIndustry = config.key === "services" || config.key === "applications" || config.key === "industries";

  return (
    <div
      data-megamenu-panel="true"
      className="w-screen max-w-[1280px] bg-popover text-popover-foreground border-t border-border shadow-2xl"
    >
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Primary list */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {columns.primaryTitle}
          </h4>
          <ul className="space-y-1">
            {columns.primary.map((item) => {
              const Icon = item.icon ? getIconComponent(item.icon, undefined) : undefined;
              const isActive = activeItem?.label === item.label;
              return (
                <li key={item.label} onMouseEnter={() => setActiveItem(item)}>
                  <RLink
                    to={item.to}
                    params={item.params}
                    onClick={closeMenus}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 ${isActive ? "bg-accent text-primary translate-x-1.5" : "text-foreground hover:bg-accent hover:text-primary hover:translate-x-1.5"
                      }`}
                  >
                    {Icon && <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"}`} />}
                    <span className="font-medium flex-1 transition-colors duration-300">{item.label}</span>
                    <ChevronRight className={`h-4 w-4 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                  </RLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Secondary list or Top Selling Product */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {isServiceOrAppOrIndustry ? "Top Selling Products" : displayData.secondaryTitle}
          </h4>
          {isServiceOrAppOrIndustry ? (
            <TopSellingProductsSlider products={displayData.topSellingProducts || (displayData.topSellingProduct ? [displayData.topSellingProduct] : [])} />
          ) : (
            <ul className="space-y-1">
              {displayData.secondary.map((item) => (
                <li key={item.label}>
                  <RLink
                    to={item.to}
                    params={item.params}
                    onClick={closeMenus}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-300 hover:translate-x-1.5"
                  >
                    {item.label}
                  </RLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Featured */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {activeItem?.label ? `Featured ${activeItem.label}` : displayData.featuredTitle}
          </h4>
          {displayData.featuredKind === "product" ? (
            <ul className="space-y-2">
              {(displayData.featured as MegaProductItem[]).map((p) => (
                <li key={p.label}>
                  <RLink
                    to={p.to}
                    params={p.params}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-all duration-300 group hover:translate-x-1.5"
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.label} className="h-12 w-12 flex-shrink-0 rounded object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="h-12 w-12 flex-shrink-0 rounded bg-surface flex items-center justify-center border border-border">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate transition-colors duration-300 group-hover:text-primary">{p.label}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{p.spec}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                  </RLink>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {(displayData.featured as MegaFeatureItem[]).map((f) => (
                <li key={f.title}>
                  <RLink to={f.to} params={f.params} onClick={closeMenus} className="flex gap-3 group transition-all duration-300 hover:translate-x-1.5">
                    <img
                      src={f.image}
                      alt=""
                      className="h-16 w-20 flex-shrink-0 rounded object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {f.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{f.description}</div>
                    </div>
                  </RLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
            {displayData.quickActionsTitle}
          </h4>
          <ul className="space-y-2">
            {displayData.quickActions.map((qa) => {
              const Icon = getIconComponent(qa.icon, BookOpen);
              const isUploadBOQ = qa.title === "Upload Project BOQ";

              const actionContent = (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{qa.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{qa.description}</div>
                  </div>
                </>
              );

              if (isUploadBOQ) {
                return (
                  <li key={qa.title}>
                    <button
                      onClick={() => {
                        closeMenus();
                        open();
                      }}
                      className="w-full flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary hover:bg-accent bg-transparent transition-all duration-300 group cursor-pointer border-0 hover:translate-x-1.5"
                    >
                      {actionContent}
                    </button>
                  </li>
                );
              }

              return (
                <li key={qa.title}>
                  <RLink
                    to={qa.to}
                    params={qa.params}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-md border border-border p-3 hover:border-primary hover:bg-accent transition-all duration-300 group hover:translate-x-1.5"
                  >
                    {actionContent}
                  </RLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Delivery Model Strip */}
      <div className="border-t border-border bg-[#F9F9F6] dark:bg-[#1E1E1C] px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Block */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              How We Deliver
            </span>
            <div className="hidden lg:block h-6 w-px bg-border/80" />
          </div>

          {/* Steps Block */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-2 md:gap-x-4 lg:gap-x-6 text-xs md:text-sm text-foreground/90 font-semibold">
            {/* Step 1: Supply */}
            <RLink
              to="/services/$slug"
              params={{ slug: "supply" }}
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover/step:border-primary group-hover/step:bg-accent/10 transition-all duration-300">
                <Package className="h-4 w-4 text-primary transition-colors duration-300" />
              </div>
              <span>Supply</span>
            </RLink>

            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />

            {/* Step 2: Delivery */}
            <RLink
              to="/services/$slug"
              params={{ slug: "logistics" }}
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover/step:border-primary group-hover/step:bg-accent/10 transition-all duration-300">
                <Globe className="h-4 w-4 text-primary transition-colors duration-300" />
              </div>
              <span>30+ country delivery</span>
            </RLink>

            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />

            {/* Step 3: Installation */}
            <RLink
              to="/services/$slug"
              params={{ slug: "installation" }}
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm group-hover/step:border-primary group-hover/step:bg-accent/10 transition-all duration-300">
                <Wrench className="h-4 w-4 text-primary transition-colors duration-300" />
              </div>
              <span>IAGI-aligned installation</span>
            </RLink>

            <ChevronRight className="h-4 w-4 text-muted-foreground/30" />

            {/* Step 4: Quality Control */}
            <RLink
              to="/quality-assurance"
              onClick={closeMenus}
              className="flex items-center gap-2.5 hover:text-primary group/step transition-colors duration-300"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm group-hover/step:bg-primary-hover group-hover/step:scale-105 transition-all duration-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold text-primary">Quality assurance</span>
            </RLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MegaMenuPanels() {
  return megaMenus.map((m) => <MegaPanel key={m.key} config={m} />);
}

export { megaMenus };
export { MegaPanel };
