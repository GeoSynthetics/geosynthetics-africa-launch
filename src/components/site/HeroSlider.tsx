import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Upload, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrainageMesh } from "@/components/site/shapes";
import heroInstallation from "@/assets/hero-installation.png";
import type { HeroSection, HeroSlide } from "@/types/homepage";

interface HeroSliderProps {
  hero: HeroSection;
  onOpenQuote: () => void;
  autoPlayInterval?: number;
}

export function HeroSlider({
  hero,
  onOpenQuote,
  autoPlayInterval = hero.autoPlayInterval ?? 5000,
}: HeroSliderProps) {
  // Normalize slides list (supporting both simple string URLs and HeroSlide objects)
  const activeSlides = React.useMemo(() => {
    const rawSlides = hero.sliderImages && hero.sliderImages.length > 0 ? hero.sliderImages : [];

    if (rawSlides.length === 0) {
      // Fallback if no sliderImages configured
      return [
        {
          image: hero.bgImage && hero.bgImage.trim() !== "" ? hero.bgImage : heroInstallation,
          titlePrefix: hero.headlinePrefix,
          titleAccent: hero.headlineAccent,
          titleSuffix: hero.headlineSuffix,
          subtitle: hero.tagline,
          description: hero.subtext,
        },
      ];
    }

    return rawSlides.map((slide) => {
      if (typeof slide === "string") {
        return {
          image: !slide || slide.trim() === "" ? heroInstallation : slide,
          titlePrefix: hero.headlinePrefix,
          titleAccent: hero.headlineAccent,
          titleSuffix: hero.headlineSuffix,
          subtitle: hero.tagline,
          description: hero.subtext,
        };
      }
      return {
        image: !slide.image || slide.image.trim() === "" ? heroInstallation : slide.image,
        titlePrefix:
          slide.titlePrefix && slide.titlePrefix.trim() !== ""
            ? slide.titlePrefix
            : hero.headlinePrefix,
        titleAccent:
          slide.titleAccent && slide.titleAccent.trim() !== ""
            ? slide.titleAccent
            : hero.headlineAccent,
        titleSuffix:
          slide.titleSuffix && slide.titleSuffix.trim() !== ""
            ? slide.titleSuffix
            : hero.headlineSuffix,
        subtitle: slide.subtitle && slide.subtitle.trim() !== "" ? slide.subtitle : hero.tagline,
        description:
          slide.description && slide.description.trim() !== "" ? slide.description : hero.subtext,
      };
    });
  }, [
    hero.sliderImages,
    hero.bgImage,
    hero.headlinePrefix,
    hero.headlineAccent,
    hero.headlineSuffix,
    hero.tagline,
    hero.subtext,
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, activeSlides.length, nextSlide, autoPlayInterval]);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <section
      aria-labelledby="home-page-hero-heading"
      className="relative isolate overflow-hidden bg-surface-dark text-surface-dark-foreground min-h-[580px] md:min-h-[640px] flex flex-col justify-between"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Carousel Background Images */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } transform transition-transform duration-10000`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(8,8,10,0.98) 0%, rgba(8,8,10,0.88) 35%, rgba(8,8,10,0.5) 70%, rgba(8,8,10,0) 100%), url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Shapes Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <DrainageMesh opacity={0.14} color="#ffffff" lineSpacing={40} />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 container-page py-20 md:py-28 my-auto">
        <div className="max-w-3xl">
          {/* Headline */}
          <h1
            key={`headline-${currentIndex}`}
            id="home-page-hero-heading"
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] tracking-tight text-white drop-shadow-sm animate-hero-text"
          >
            {currentSlide.titlePrefix}{" "}
            <span className="text-primary block md:inline">{currentSlide.titleAccent}</span>{" "}
            {currentSlide.titleSuffix}
          </h1>

          {/* Tagline */}
          <p
            key={`tagline-${currentIndex}`}
            className="mt-6 text-lg md:text-xl font-display uppercase tracking-wide text-surface-dark-foreground/90 font-medium animate-hero-text animation-delay-100"
          >
            {currentSlide.subtitle}
          </p>

          {/* Subtext */}
          <p
            key={`subtext-${currentIndex}`}
            className="mt-4 text-sm md:text-base text-surface-dark-foreground/80 max-w-xl leading-relaxed animate-hero-text animation-delay-200"
          >
            {currentSlide.description}
          </p>

          {/* Action Buttons */}
          <div
            key={`buttons-${currentIndex}`}
            className="mt-8 flex flex-wrap gap-3 animate-hero-text animation-delay-300"
          >
            {hero.btn1Text && (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-primary-foreground uppercase font-bold tracking-wide cursor-pointer border-0 shadow-lg transition-transform active:scale-95"
                onClick={onOpenQuote}
              >
                <Upload className="mr-2 h-4 w-4" />
                {hero.btn1Text}
              </Button>
            )}

            {hero.btn2Text && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-surface-dark/40 backdrop-blur-md border-surface-dark-foreground/40 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide transition-all"
              >
                <Link to={hero.btn2Url as any}>{hero.btn2Text}</Link>
              </Button>
            )}

            {hero.btn3Text && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-surface-dark/40 backdrop-blur-md border-surface-dark-foreground/40 text-surface-dark-foreground hover:bg-surface-dark-foreground hover:text-surface-dark uppercase font-bold tracking-wide transition-all"
              >
                <Link to={hero.btn3Url as any}>
                  <Phone className="mr-2 h-4 w-4" />
                  {hero.btn3Text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Slider Controls & Indicators Footer Bar */}
      {activeSlides.length > 1 && (
        <div className="relative z-20 container-page pb-8 pt-4 flex items-center justify-between gap-4 border-t border-white/10 bg-gradient-to-t from-black/60 to-transparent">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter & Prev/Next Navigation Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-white/80 font-bold">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(activeSlides.length).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-primary hover:border-primary transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-primary hover:border-primary transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
