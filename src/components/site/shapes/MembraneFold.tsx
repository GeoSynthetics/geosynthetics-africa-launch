import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./geosynthetic-shapes.css";

gsap.registerPlugin(ScrollTrigger);

interface MembraneFoldProps {
  className?: string;
  opacity?: number;
  color?: string;
  waveCount?: number;
}

function buildWavePath(
  viewWidth: number,
  amplitude: number,
  frequency: number,
  yOffset: number,
  phaseShift: number,
): string {
  const segments = 12;
  const segmentWidth = viewWidth / segments;
  const points: string[] = [`M0,${yOffset}`];

  for (let i = 0; i < segments; i++) {
    const x1 = i * segmentWidth + segmentWidth * 0.33;
    const x2 = i * segmentWidth + segmentWidth * 0.66;
    const x3 = (i + 1) * segmentWidth;
    const wave = Math.sin(((i + phaseShift) / segments) * Math.PI * 2 * frequency) * amplitude;
    const nextWave =
      Math.sin(((i + 1 + phaseShift) / segments) * Math.PI * 2 * frequency) * amplitude;

    points.push(
      `C${x1},${yOffset + wave} ${x2},${yOffset + nextWave} ${x3},${yOffset + nextWave * 0.8}`,
    );
  }

  return points.join(" ");
}

/**
 * Geomembrane wave/fold — undulating bezier curves that morph on scroll.
 * Represents flexible geomembrane liners used in containment systems.
 */
export function MembraneFold({
  className = "",
  opacity = 0.15,
  color = "currentColor",
  waveCount = 5,
}: MembraneFoldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const viewWidth = 1400;
  const viewHeight = 600;

  const waves = useMemo(() => {
    return Array.from({ length: waveCount }, (_, i) => ({
      amplitude: 30 + i * 15,
      frequency: 1 + i * 0.3,
      yOffset: 80 + i * ((viewHeight - 160) / (waveCount - 1 || 1)),
      phaseShift: i * 1.5,
      strokeWidth: 2.5 - i * 0.25,
    }));
  }, [waveCount, viewHeight]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;
    const waveElements = container.querySelectorAll(".membrane-wave");

    const context = gsap.context(() => {
      waveElements.forEach((wave, i) => {
        const direction = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(
          wave,
          {
            x: direction * -50 * (i + 1) * 0.4,
            scaleY: 0.8,
          },
          {
            x: direction * 50 * (i + 1) * 0.4,
            scaleY: 1.3,
            ease: "none",
            scrollTrigger: {
              trigger: container.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1 + i * 0.3,
            },
          },
        );
      });
    }, container);

    return () => context.revert();
  }, [waves]);

  return (
    <div ref={containerRef} className={`geo-shape-container ${className}`}>
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        style={{ opacity }}
        preserveAspectRatio="xMidYMid slice"
      >
        {waves.map((wave, i) => (
          <path
            key={i}
            className="membrane-wave"
            d={buildWavePath(
              viewWidth,
              wave.amplitude,
              wave.frequency,
              wave.yOffset,
              wave.phaseShift,
            )}
            fill="none"
            stroke={color}
            strokeWidth={wave.strokeWidth}
            style={{
              transformOrigin: `${viewWidth / 2}px ${wave.yOffset}px`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
