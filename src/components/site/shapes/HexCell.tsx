import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./geosynthetic-shapes.css";

gsap.registerPlugin(ScrollTrigger);

interface HexCellProps {
  className?: string;
  count?: number;
  color?: string;
  spread?: "tight" | "normal" | "wide";
  opacity?: number;
}

interface HexData {
  x: number;
  y: number;
  size: number;
  rotation: number;
}

function createHexPath(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30;
    const angleRad = (Math.PI / 180) * angleDeg;
    points.push(`${cx + size * Math.cos(angleRad)},${cy + size * Math.sin(angleRad)}`);
  }
  return `M${points.join("L")}Z`;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateHexagons(
  count: number,
  viewWidth: number,
  viewHeight: number,
  spread: string,
): HexData[] {
  const spreadMultiplier = spread === "tight" ? 0.7 : spread === "wide" ? 1.3 : 1;

  return Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 3 + 1) * viewWidth * spreadMultiplier,
    y: seededRandom(i * 3 + 2) * viewHeight,
    size: 25 + seededRandom(i * 3 + 3) * 55,
    rotation: seededRandom(i * 7) * 360,
  }));
}

/**
 * Geocell honeycomb pattern — floating hexagonal cells that rotate and drift on scroll.
 * Represents geocell confinement systems used in ground stabilization.
 */
export function HexCell({
  className = "",
  count = 12,
  color = "currentColor",
  spread = "normal",
  opacity = 0.12,
}: HexCellProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const viewWidth = 1200;
  const viewHeight = 800;

  const hexagons = useMemo(
    () => generateHexagons(count, viewWidth, viewHeight, spread),
    [count, spread],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const hexElements = container.querySelectorAll(".hex-cell");

    const context = gsap.context(() => {
      hexElements.forEach((hex, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        const speed = 0.8 + (i % 3) * 0.4;

        gsap.fromTo(
          hex,
          {
            rotation: hexagons[i]?.rotation ?? 0,
            y: -30 * speed,
          },
          {
            rotation: (hexagons[i]?.rotation ?? 0) + direction * 90,
            y: direction * 60 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: container.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5 + i * 0.1,
            },
          },
        );
      });
    }, container);

    return () => context.revert();
  }, [hexagons]);

  return (
    <div ref={containerRef} className={`geo-shape-container ${className}`}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        style={{ opacity }}
        preserveAspectRatio="xMidYMid slice"
      >
        {hexagons.map((hex, i) => (
          <g key={i} className="hex-cell" style={{ transformOrigin: `${hex.x}px ${hex.y}px` }}>
            <path
              d={createHexPath(hex.x, hex.y, hex.size)}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
            />
            <path
              d={createHexPath(hex.x, hex.y, hex.size * 0.6)}
              fill="none"
              stroke={color}
              strokeWidth="0.75"
              opacity="0.5"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
