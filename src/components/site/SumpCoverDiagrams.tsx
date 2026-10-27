/**
 * Our own schematic drawings of a defined sump floating cover: sections of the
 * cover in an empty and a full reservoir, and plan views of the common sump
 * layouts. Drawn in SVG so they follow the site theme.
 */

const STROKE = "stroke-foreground/70";

function Float({ x, y }: { x: number; y: number }) {
  return <rect x={x - 9} y={y - 5} width={18} height={6} rx={2} className="fill-primary" />;
}

function Ballast({ x, y }: { x: number; y: number }) {
  return (
    <circle cx={x} cy={y} r={5} className="fill-foreground/80 stroke-background" strokeWidth={1} />
  );
}

/** Reservoir section: crest at y=30, floor at y=150, slopes from x=40→110 and x=490→560. */
function ReservoirShell() {
  return (
    <>
      <path d="M0 30 H40 L110 150 H490 L560 30 H600 V180 H0 Z" className="fill-amber-700/15" />
      <path
        d="M0 30 H40 L110 150 H490 L560 30 H600"
        fill="none"
        className={STROKE}
        strokeWidth={1.5}
      />
      <rect x={28} y={22} width={16} height={10} className="fill-muted-foreground/50" />
      <rect x={556} y={22} width={16} height={10} className="fill-muted-foreground/50" />
    </>
  );
}

function EmptySection() {
  const sumps = [220, 380];
  return (
    <svg
      viewBox="0 0 600 190"
      role="img"
      aria-label="Floating cover in an empty reservoir"
      className="w-full h-auto"
    >
      <ReservoirShell />
      {/* membrane lies on the floor like a fitted liner */}
      <path
        d="M36 30 L110 148 H490 L564 30"
        fill="none"
        className="stroke-primary"
        strokeWidth={3}
      />
      {sumps.map((x) => (
        <g key={x}>
          <Float x={x - 34} y={145} />
          <Ballast x={x} y={142} />
          <Float x={x + 34} y={145} />
        </g>
      ))}
    </svg>
  );
}

function FullSection() {
  const sumps = [220, 380];
  const depth = 34;
  const surface = 62;
  let d = `M36 30 L55 ${surface}`;
  for (const x of sumps) {
    d += ` H${x - 14} L${x - 3} ${surface + depth} H${x + 3} L${x + 14} ${surface}`;
  }
  d += ` H545 L564 30`;
  return (
    <svg
      viewBox="0 0 600 190"
      role="img"
      aria-label="Floating cover in a full reservoir"
      className="w-full h-auto"
    >
      <path d={`M55 ${surface} L110 150 H490 L545 ${surface} Z`} className="fill-sky-500/30" />
      <ReservoirShell />
      <path d={d} fill="none" className="stroke-primary" strokeWidth={3} strokeLinejoin="round" />
      {sumps.map((x) => (
        <g key={x}>
          <Float x={x - 22} y={surface - 1} />
          <Ballast x={x} y={surface + depth} />
          <Float x={x + 22} y={surface - 1} />
        </g>
      ))}
    </svg>
  );
}

function ForceDetail() {
  return (
    <svg
      viewBox="0 0 300 190"
      role="img"
      aria-label="Forces in a defined sump"
      className="w-full h-auto"
    >
      <defs>
        <marker
          id="sump-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 Z" className="fill-primary" />
        </marker>
      </defs>
      <rect x={0} y={70} width={300} height={120} className="fill-sky-500/30" />
      <path
        d="M0 70 H120 L144 140 H156 L180 70 H300"
        fill="none"
        className="stroke-primary"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <Float x={100} y={69} />
      <Float x={200} y={69} />
      <Ballast x={150} y={140} />
      <g className="stroke-primary" strokeWidth={2} markerEnd="url(#sump-arrow)">
        <line x1={100} y1={58} x2={100} y2={22} />
        <line x1={200} y1={58} x2={200} y2={22} />
        <line x1={150} y1={150} x2={150} y2={182} />
        <line x1={60} y1={70} x2={10} y2={70} />
        <line x1={240} y1={70} x2={290} y2={70} />
      </g>
      <g className="fill-foreground text-[11px] font-bold uppercase" style={{ fontSize: 11 }}>
        <text x={108} y={30}>
          Float lift
        </text>
        <text x={158} y={176}>
          Ballast pull
        </text>
        <text x={8} y={62}>
          Tension
        </text>
        <text x={244} y={62}>
          Tension
        </text>
      </g>
    </svg>
  );
}

function PlanView({ kind }: { kind: "profile" | "doubleY" | "x" }) {
  const lines: string[] = [];
  if (kind === "profile") {
    lines.push(
      "M30 30 H150 V190 H30 Z",
      "M10 10 L30 30",
      "M170 10 L150 30",
      "M10 210 L30 190",
      "M170 210 L150 190",
    );
  } else if (kind === "doubleY") {
    lines.push("M10 10 L90 70 L170 10", "M90 70 V150", "M10 210 L90 150 L170 210");
  } else {
    lines.push("M10 10 L170 210", "M170 10 L10 210");
  }
  const label = { profile: "Profile trace", doubleY: "Double Y", x: "X pattern" }[kind];
  return (
    <figure className="text-center">
      <svg
        viewBox="0 0 180 220"
        role="img"
        aria-label={`${label} sump layout`}
        className="w-full h-auto max-w-[160px] mx-auto"
      >
        <rect
          x={2}
          y={2}
          width={176}
          height={216}
          rx={8}
          className="fill-amber-700/10 stroke-foreground/50"
          strokeWidth={1.5}
        />
        {lines.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            className="stroke-primary"
            strokeWidth={3}
            strokeDasharray="10 5"
          />
        ))}
      </svg>
      <figcaption className="mt-2 text-xs font-bold uppercase tracking-wide">{label}</figcaption>
    </figure>
  );
}

export function SumpCoverDiagrams() {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <figure className="border border-border rounded-xl p-4 bg-surface/30">
          <EmptySection />
          <figcaption className="mt-3 text-sm">
            <span className="font-bold">Empty reservoir.</span>{" "}
            <span className="text-muted-foreground">
              The cover lies on the floor like a fitted liner. Sumps are flat and float rows are at
              their widest spacing.
            </span>
          </figcaption>
        </figure>
        <figure className="border border-border rounded-xl p-4 bg-surface/30">
          <FullSection />
          <figcaption className="mt-3 text-sm">
            <span className="font-bold">Full reservoir.</span>{" "}
            <span className="text-muted-foreground">
              Ballast tubes pull the spare material down into the sumps. The sumps hang vertically,
              the float rows close up and the cover stays taut.
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="grid gap-4 md:grid-cols-5 items-center border border-border rounded-xl p-4 bg-surface/30">
        <div className="md:col-span-2">
          <ForceDetail />
        </div>
        <div className="md:col-span-3 text-sm text-muted-foreground leading-relaxed space-y-2">
          <p className="font-bold text-foreground">How the cover stays tight</p>
          <p>
            Floats lift the cover on either side of each sump, and a sand-filled ballast tube pulls
            the middle down. The two forces tension the membrane across the reservoir and gather the
            spare material into the sump, whatever the water level.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded-sm bg-primary" /> Float
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full bg-foreground/80" /> Ballast tube
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-primary" /> Cover membrane
            </span>
          </p>
        </div>
      </div>
      <div className="border border-border rounded-xl p-4 bg-surface/30">
        <p className="text-sm font-bold">Sump layouts (plan view, reservoir empty)</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <PlanView kind="profile" />
          <PlanView kind="doubleY" />
          <PlanView kind="x" />
        </div>
      </div>
    </div>
  );
}
