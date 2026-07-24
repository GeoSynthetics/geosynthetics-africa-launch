import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./geosynthetic-shapes.css";

gsap.registerPlugin(ScrollTrigger);

interface GeoGridProps {
  className?: string;
  opacity?: number;
  color?: string;
  gridSize?: number;
}

interface GridNode {
  cx: number;
  cy: number;
}

function generateGridNodes(
  cols: number,
  rows: number,
  spacingX: number,
  spacingY: number,
  offsetX: number,
  offsetY: number,
): GridNode[] {
  const nodes: GridNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      nodes.push({
        cx: offsetX + col * spacingX,
        cy: offsetY + row * spacingY,
      });
    }
  }
  return nodes;
}

/**
 * Bi-axial geogrid pattern — connected node grid that stretches on scroll.
 * Mimics biaxial geogrids used in soil reinforcement.
 */
export function GeoGrid({
  className = "",
  opacity = 0.15,
  color = "currentColor",
  gridSize = 6,
}: GeoGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const spacingX = 120;
  const spacingY = 100;
  const cols = gridSize;
  const rows = gridSize;
  const svgWidth = (cols - 1) * spacingX + 80;
  const svgHeight = (rows - 1) * spacingY + 80;

  const nodes = useMemo(
    () => generateGridNodes(cols, rows, spacingX, spacingY, 40, 40),
    [cols, rows],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const nodeElements = container.querySelectorAll(".geo-grid-node");
    const svgElement = container.querySelector("svg");

    const context = gsap.context(() => {
      gsap.fromTo(
        svgElement,
        { scaleX: 0.9, scaleY: 1.05 },
        {
          scaleX: 1.1,
          scaleY: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: container.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );

      gsap.fromTo(
        nodeElements,
        { scale: 0.8 },
        {
          scale: 1.4,
          stagger: {
            each: 0.02,
            from: "center",
            grid: [rows, cols],
          },
          ease: "none",
          scrollTrigger: {
            trigger: container.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        },
      );
    }, container);

    return () => context.revert();
  }, [cols, rows]);

  const horizontalLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const verticalLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const fromNode = nodes[row * cols + col];
      const toNode = nodes[row * cols + col + 1];
      horizontalLines.push({
        x1: fromNode.cx,
        y1: fromNode.cy,
        x2: toNode.cx,
        y2: toNode.cy,
      });
    }
  }

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows - 1; row++) {
      const fromNode = nodes[row * cols + col];
      const toNode = nodes[(row + 1) * cols + col];
      verticalLines.push({
        x1: fromNode.cx,
        y1: fromNode.cy,
        x2: toNode.cx,
        y2: toNode.cy,
      });
    }
  }

  return (
    <div ref={containerRef} className={`geo-shape-container ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ opacity }}
        preserveAspectRatio="xMidYMid slice"
      >
        {horizontalLines.map((line, i) => (
          <line
            key={`h-${i}`}
            className="geo-grid-line"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
        {verticalLines.map((line, i) => (
          <line
            key={`v-${i}`}
            className="geo-grid-line"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((node, i) => (
          <circle
            key={`n-${i}`}
            className="geo-grid-node"
            cx={node.cx}
            cy={node.cy}
            r={4}
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
}
