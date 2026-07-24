import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./geosynthetic-shapes.css";

gsap.registerPlugin(ScrollTrigger);

interface DrainageMeshProps {
  className?: string;
  opacity?: number;
  color?: string;
  lineSpacing?: number;
}

/**
 * Drainage composite crosshatch — diagonal lines that slide and fade on scroll.
 * Evokes geonet/drainage composite materials used in water management.
 */
export function DrainageMesh({
  className = "",
  opacity = 0.1,
  color = "currentColor",
  lineSpacing = 40,
}: DrainageMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const viewWidth = 1200;
  const viewHeight = 800;
  const lineCount = Math.ceil((viewWidth + viewHeight) / lineSpacing);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const forwardLines = container.querySelectorAll(".mesh-line-forward");
    const backwardLines = container.querySelectorAll(".mesh-line-backward");

    const context = gsap.context(() => {
      gsap.fromTo(
        forwardLines,
        { x: -40 },
        {
          x: 40,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: container.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        },
      );

      gsap.fromTo(
        backwardLines,
        { x: 30 },
        {
          x: -30,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: container.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.5,
          },
        },
      );
    }, container);

    return () => context.revert();
  }, [lineSpacing]);

  const forwardLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const backwardLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let i = 0; i < lineCount; i++) {
    const offset = i * lineSpacing;

    forwardLines.push({
      x1: offset - viewHeight,
      y1: 0,
      x2: offset,
      y2: viewHeight,
    });

    backwardLines.push({
      x1: offset,
      y1: 0,
      x2: offset - viewHeight,
      y2: viewHeight,
    });
  }

  return (
    <div ref={containerRef} className={`geo-shape-container ${className}`}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        style={{ opacity }}
        preserveAspectRatio="xMidYMid slice"
      >
        {forwardLines.map((line, i) => (
          <line
            key={`f-${i}`}
            className="mesh-line-forward"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="1"
          />
        ))}
        {backwardLines.map((line, i) => (
          <line
            key={`b-${i}`}
            className="mesh-line-backward"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="0.75"
          />
        ))}
        {forwardLines
          .filter((_, i) => i % 3 === 0)
          .map((line, i) => (
            <circle key={`dot-${i}`} cx={line.x2} cy={line.y2} r="2.5" fill={color} opacity="0.6" />
          ))}
      </svg>
    </div>
  );
}
