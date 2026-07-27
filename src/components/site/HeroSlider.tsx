import React, { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Upload, Phone, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrainageMesh } from "@/components/site/shapes";
import heroInstallation from "@/assets/hero-installation.png";
import type { HeroSection } from "@/types/homepage";

interface HeroSliderProps {
  hero: HeroSection;
  onOpenQuote: () => void;
}

export function HeroSlider({ hero, onOpenQuote }: HeroSliderProps) {
  // Normalize images list
  const rawImages =
    hero.sliderImages && hero.sliderImages.length > 0
      ? hero.sliderImages.map((img) => (!img || img.trim() === "" ? heroInstallation : img))
      : hero.bgImage && hero.bgImage.trim() !== ""
        ? [hero.bgImage]
        : [heroInstallation];

  // Deduplicate consecutive identical images if any, fallback to heroInstallation
  const images = rawImages.length > 0 ? rawImages : [heroInstallation];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, images.length, nextSlide]);

  return (
    <section
      aria-labelledby="home-page-hero-heading"
      className="relative isolate overflow-hidden bg-surface-dark text-surface-dark-foreground min-h-[580px] md:min-h-[640px] flex flex-col justify-between"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Carousel Background Images */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } transform transition-transform duration-10000`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(8,8,10,0.88) 0%, rgba(8,8,10,0.65) 50%, rgba(8,8,10,0.3) 100%), url(${img})`,
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
            id="home-page-hero-heading"
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] tracking-tight text-white drop-shadow-sm"
          >
            {hero.headlinePrefix}{" "}
            <span className="text-primary block md:inline">{hero.headlineAccent}</span>{" "}
            {hero.headlineSuffix}
          </h1>

          {/* Tagline */}
          <p className="mt-6 text-lg md:text-xl font-display uppercase tracking-wide text-surface-dark-foreground/90 font-medium">
            {hero.tagline}
          </p>

          {/* Subtext */}
          <p className="mt-4 text-sm md:text-base text-surface-dark-foreground/80 max-w-xl leading-relaxed">
            {hero.subtext}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
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
      {images.length > 1 && (
        <div className="relative z-20 container-page pb-8 pt-4 flex items-center justify-between gap-4 border-t border-white/10 bg-gradient-to-t from-black/60 to-transparent">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {images.map((_, index) => (
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
              {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
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
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause slider" : "Play slider"}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                )}
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
