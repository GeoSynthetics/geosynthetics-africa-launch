import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./geosynthetic-shapes.css";

gsap.registerPlugin(ScrollTrigger);

interface FiberStrandProps {
  className?: string;
  opacity?: number;
  color?: string;
  clusterCount?: number;
}

interface FiberCluster {
  cx: number;
  cy: number;
  strandCount: number;
  maxLength: number;
  baseAngle: number;
}

interface Strand {
  clusterIndex: number;
  cx: number;
  cy: number;
  angle: number;
  length: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateClusters(count: number, viewWidth: number, viewHeight: number): FiberCluster[] {
  return Array.from({ length: count }, (_, i) => ({
    cx: viewWidth * 0.1 + seededRandom(i * 5 + 1) * viewWidth * 0.8,
    cy: viewHeight * 0.1 + seededRandom(i * 5 + 2) * viewHeight * 0.8,
    strandCount: 8 + Math.floor(seededRandom(i * 5 + 3) * 12),
    maxLength: 40 + seededRandom(i * 5 + 4) * 80,
    baseAngle: seededRandom(i * 5 + 5) * 360,
  }));
}

function generateStrands(clusters: FiberCluster[]): Strand[] {
  const strands: Strand[] = [];
  clusters.forEach((cluster, ci) => {
    for (let s = 0; s < cluster.strandCount; s++) {
      const angle =
        cluster.baseAngle +
        (360 / cluster.strandCount) * s +
        (seededRandom(ci * 100 + s) - 0.5) * 30;
      const length = cluster.maxLength * (0.4 + seededRandom(ci * 100 + s + 50) * 0.6);

      strands.push({
        clusterIndex: ci,
        cx: cluster.cx,
        cy: cluster.cy,
        angle,
        length,
      });
    }
  });

  return strands;
}

/**
 * Geotextile fiber strands — radiating lines from cluster points that spin on scroll.
 * Mimics nonwoven geotextile fiber structures used in filtration and separation.
 */
export function FiberStrand({
  className = "",
  opacity = 0.12,
  color = "currentColor",
  clusterCount = 5,
}: FiberStrandProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const viewWidth = 1200;
  const viewHeight = 800;

  const clusters = useMemo(
    () => generateClusters(clusterCount, viewWidth, viewHeight),
    [clusterCount],
  );

  const strands = useMemo(() => generateStrands(clusters), [clusters]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const clusterGroups = container.querySelectorAll(".fiber-cluster");

    const context = gsap.context(() => {
      clusterGroups.forEach((group, i) => {
        const direction = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(
          group,
          { rotation: 0 },
          {
            rotation: direction * 120,
            ease: "none",
            scrollTrigger: {
              trigger: container.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 2 + i * 0.2,
            },
          },
        );
      });
    }, container);

    return () => context.revert();
  }, [clusters]);

  return (
    <div ref={containerRef} className={`geo-shape-container ${className}`}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        style={{ opacity }}
        preserveAspectRatio="xMidYMid slice"
      >
        {clusters.map((cluster, ci) => (
          <g
            key={ci}
            className="fiber-cluster"
            style={{
              transformOrigin: `${cluster.cx}px ${cluster.cy}px`,
            }}
          >
            <circle cx={cluster.cx} cy={cluster.cy} r="4" fill={color} opacity="0.7" />

            {strands
              .filter((s) => s.clusterIndex === ci)
              .map((strand, si) => {
                const angleRad = (strand.angle * Math.PI) / 180;
                const endX = strand.cx + Math.cos(angleRad) * strand.length;
                const endY = strand.cy + Math.sin(angleRad) * strand.length;

                return (
                  <line
                    key={si}
                    className="fiber-strand"
                    x1={strand.cx}
                    y1={strand.cy}
                    x2={endX}
                    y2={endY}
                    stroke={color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}
          </g>
        ))}
      </svg>
    </div>
  );
}
