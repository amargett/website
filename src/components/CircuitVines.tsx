// Decorative circuit-vine "tree" for the Terminal Garden hero.
// A trunk rooted at the base sprouts branches that fan up and out — part
// PCB trace, part decision tree — with colorful pulsing nodes at the tips.
// Tall canopy fills the upper-right and reaches the top; low limbs sweep
// up-and-left into the empty lower-left (kept clear of the terminal +
// booting label at upper-left). Taller viewBox so it fills the hero and
// preserveAspectRatio="meet" so the whole tree always shows (never cropped).
// Purely presentational; animated via CSS classes in globals.css.

type Branch = {
  d: string;
  stroke: string;
  len: number;
  delay: string;
  width?: number;
};

type NodeSpec = { cx: number; cy: number; r: number; fill: string; delay: string };

// Trunk + limbs + branches, drawn from the base outward
const BRANCHES: Branch[] = [
  // trunk
  { d: "M900 620 V398", stroke: "var(--tg-green)", len: 240, delay: "0.15s", width: 3 },
  // two main limbs off the first fork
  { d: "M900 400 C838 338 800 298 742 248", stroke: "var(--tg-green)", len: 240, delay: "0.7s", width: 2.8 },
  { d: "M900 400 C962 342 1006 298 1072 244", stroke: "var(--tg-green)", len: 240, delay: "0.75s", width: 2.8 },
  // left-limb canopy (reaching up toward the top)
  { d: "M742 248 C685 188 648 150 612 112", stroke: "var(--tg-teal)", len: 210, delay: "1.2s" },
  { d: "M742 248 C750 172 744 100 702 42", stroke: "var(--tg-amber)", len: 240, delay: "1.35s" },
  { d: "M742 248 C778 178 812 118 832 66", stroke: "var(--tg-green)", len: 230, delay: "1.3s" },
  { d: "M742 248 C690 220 655 190 622 158", stroke: "var(--tg-teal)", len: 160, delay: "1.45s" },
  // right-limb canopy (reaching up + far right)
  { d: "M1072 244 C1132 184 1162 150 1180 116", stroke: "var(--tg-orange)", len: 210, delay: "1.2s" },
  { d: "M1072 244 C1032 174 1006 104 1000 44", stroke: "var(--tg-green)", len: 240, delay: "1.35s" },
  { d: "M1072 244 C1098 174 1118 108 1130 58", stroke: "var(--tg-teal)", len: 230, delay: "1.3s" },
  { d: "M1072 244 C1138 236 1194 232 1242 228", stroke: "var(--tg-amber)", len: 180, delay: "1.45s" },
  // inner short branch
  { d: "M896 384 C884 320 884 250 888 190", stroke: "var(--tg-orange)", len: 200, delay: "1.5s", width: 2 },
  // lower limbs (right): straight extending branches, like the canopy above
  { d: "M900 470 C1003 400 1107 345 1210 300", stroke: "var(--tg-orange)", len: 420, delay: "1.5s", width: 2.4 },
  { d: "M900 516 C1020 477 1140 451 1260 430", stroke: "var(--tg-amber)", len: 440, delay: "1.6s", width: 2.4 },
  { d: "M900 560 C993 535 1087 515 1180 500", stroke: "var(--tg-teal)", len: 340, delay: "1.55s", width: 2.4 },
  // lower limbs (left): mirror the right, offset down so they alternate vertically
  { d: "M900 493 C797 423 693 368 590 323", stroke: "var(--tg-orange)", len: 420, delay: "1.5s", width: 2.4 },
  { d: "M900 539 C780 500 660 474 540 453", stroke: "var(--tg-amber)", len: 440, delay: "1.6s", width: 2.4 },
  { d: "M900 583 C807 558 713 538 620 523", stroke: "var(--tg-teal)", len: 340, delay: "1.55s", width: 2.4 },
  // leaf stems at the tips
  { d: "M702 42 q11 -7 12 -20", stroke: "var(--tg-amber)", len: 50, delay: "2.4s", width: 1.6 },
  { d: "M1180 116 q14 -4 17 -16", stroke: "var(--tg-orange)", len: 50, delay: "2.5s", width: 1.6 },
  { d: "M1000 44 q-3 -15 -16 -18", stroke: "var(--tg-green)", len: 50, delay: "2.6s", width: 1.6 },
  { d: "M1210 300 q13 -4 15 -16", stroke: "var(--tg-orange)", len: 50, delay: "2.5s", width: 1.6 },
  { d: "M1260 430 q14 -2 17 -13", stroke: "var(--tg-amber)", len: 50, delay: "2.55s", width: 1.6 },
  { d: "M1180 500 q14 0 18 -11", stroke: "var(--tg-teal)", len: 50, delay: "2.5s", width: 1.6 },
  { d: "M590 323 q-13 -4 -15 -16", stroke: "var(--tg-orange)", len: 50, delay: "2.5s", width: 1.6 },
  { d: "M540 453 q-14 -2 -17 -13", stroke: "var(--tg-amber)", len: 50, delay: "2.55s", width: 1.6 },
  { d: "M620 523 q-14 0 -18 -11", stroke: "var(--tg-teal)", len: 50, delay: "2.5s", width: 1.6 },
];

const NODES: NodeSpec[] = [
  { cx: 900, cy: 400, r: 6, fill: "var(--tg-green)", delay: "0.6s" }, // first fork
  { cx: 702, cy: 40, r: 7, fill: "var(--tg-amber)", delay: "2.2s" },
  { cx: 612, cy: 110, r: 6, fill: "var(--tg-teal)", delay: "2.0s" },
  { cx: 832, cy: 64, r: 7, fill: "var(--tg-green)", delay: "2.1s" },
  { cx: 622, cy: 152, r: 5, fill: "var(--tg-teal)", delay: "2.1s" },
  { cx: 1000, cy: 42, r: 7, fill: "var(--tg-green)", delay: "2.2s" },
  { cx: 1130, cy: 56, r: 6, fill: "var(--tg-teal)", delay: "2.1s" },
  { cx: 1180, cy: 114, r: 6, fill: "var(--tg-orange)", delay: "2.0s" },
  { cx: 1244, cy: 228, r: 6, fill: "var(--tg-amber)", delay: "2.1s" },
  { cx: 1210, cy: 300, r: 6, fill: "var(--tg-orange)", delay: "2.3s" },
  { cx: 1260, cy: 430, r: 5, fill: "var(--tg-amber)", delay: "2.4s" },
  { cx: 1180, cy: 500, r: 6, fill: "var(--tg-teal)", delay: "2.3s" },
  // left lower nodes — mirror the right horizontally, offset down to alternate
  { cx: 590, cy: 323, r: 6, fill: "var(--tg-orange)", delay: "2.3s" },
  { cx: 540, cy: 453, r: 5, fill: "var(--tg-amber)", delay: "2.4s" },
  { cx: 620, cy: 523, r: 6, fill: "var(--tg-teal)", delay: "2.3s" },
  { cx: 888, cy: 188, r: 4, fill: "var(--tg-orange)", delay: "2.1s" },
];

export default function CircuitVines({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`tg-traces ${className}`}
      viewBox="0 0 1280 620"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g strokeLinecap="round" strokeLinejoin="round" opacity={0.72}>
        {BRANCHES.map((b, i) => (
          <path
            key={`b${i}`}
            className="tg-trace"
            style={{ ["--len" as string]: b.len, ["--delay" as string]: b.delay }}
            stroke={b.stroke}
            strokeWidth={b.width ?? 2.6}
            fill="none"
            d={b.d}
          />
        ))}
      </g>

      {NODES.map((n, i) => (
        <g key={`n${i}`} className="tg-node" style={{ ["--delay" as string]: n.delay }}>
          <circle cx={n.cx} cy={n.cy} r={n.r + 4} fill={n.fill} opacity={0.18} />
          <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
        </g>
      ))}
    </svg>
  );
}
