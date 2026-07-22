import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationConfig {
  trigger?: HTMLElement | null;
  animation: gsap.TweenVars;
  scrollTriggerVars?: ScrollTrigger.Vars;
}

/**
 * Provides a stable helper to build GSAP ScrollTrigger animations
 * bound to a container ref. Cleans up all animations on unmount.
 */
export function useGsapScrollTrigger() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  const createScrollAnimation = useCallback(
    (
      targets: gsap.TweenTarget,
      config: ScrollAnimationConfig
    ): gsap.core.Tween | null => {
      if (typeof window === "undefined") return null;

      const triggerElement =
        config.trigger ?? containerRef.current;

      if (!triggerElement) return null;

      return gsap.to(targets, {
        ...config.animation,
        scrollTrigger: {
          trigger: triggerElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          ...config.scrollTriggerVars,
        },
      });
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    contextRef.current = gsap.context(() => {}, container);

    return () => {
      contextRef.current?.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.vars.trigger instanceof HTMLElement &&
          container.contains(trigger.vars.trigger)
        ) {
          trigger.kill();
        }
      });
    };
  }, []);

  return { containerRef, createScrollAnimation };
}
