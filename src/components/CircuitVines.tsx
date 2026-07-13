"use client";

// Terminal Garden — inverted circuit-tree background for the home page.
//
// The page is an upside-down tree. The TOP is the ROOTS (you're ssh'd into
// root): a few bold copper main roots leave a central trunk and fan out wide
// and flat across the width, shedding a haze of loose, mossy tendrils thick
// with copper PCB vias and solder junctions. As the roots descend they bundle
// into the trunk and
// metamorphose copper -> green, branching into a spreading canopy over the
// featured work below. Bright charge pulses run the whole descent — from a
// root tip, through the trunk, into the canopy. Everything draws in TOP -> BOTTOM.
//
// Geometry is measured on the client so the SVG maps 1:1 to pixels, and
// regenerates when the page's width/height changes.

import { useEffect, useMemo, useRef, useState } from "react";

// ---- Mangrove concept (chosen direction) ---------------------------------
const M = {
  rootFill: 1.0,        // tendril density
  rootVias: 0.85,       // copper PCB vias through the upper roots
  metamorphOrganic: 0.84,
  trunkWidth: 6.4,
  canopySpread: 480,
  branchLevels: 4,
  branchSplay: 58,
  leafDensity: 0.86,
  padDensity: 0.38,
  sparkDensity: 0.55,
  accentMix: 0.3,
  glow: 0.55,
  seed: 4173,
};

const COL = {
  copper: "#c98a3f",
  copperDeep: "#b06a2c",
  green: "var(--tg-green)",
  greenHex: "#96b85f",
  amber: "var(--tg-amber)",
  amberHex: "#e2983f",
  orange: "var(--tg-orange)",
  orangeHex: "#cf6a34",
};

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rr = (n: number) => Math.round(n * 10) / 10;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const deg = (d: number) => (d * Math.PI) / 180;

type Path = { d: string; w: number; ry: number; len: number; kind: "root" | "tendril" | "hair" | "trunk" | "branch" };
type Pad = { cx: number; cy: number; ry: number; size: number };
type CompStyle = "via" | "junction";
type Leaf = { cx: number; cy: number; ry: number; style: "blade" | CompStyle; col: string; s: number; rot: number; accent: boolean; sway: number; dur: number; del: number };
type Spark = { d: string; c: number; len: number; w: number; dur: string; delay: string };
type Blob = { cx: number; cy: number; rx: number; ry: number; op: number };
type Anchor = { x: number; y: number };
type Scene = { paths: Path[]; pads: Pad[]; leaves: Leaf[]; sparks: Spark[]; blobs: Blob[]; copperEnd: number; greenStart: number; fruitAnchors: Anchor[] };

// stepped PCB-ish segment (used for the trunk)
function pcbSeg(x1: number, y1: number, x2: number, y2: number, style: "orthogonal" | "diagonal45") {
  const dx = x2 - x1, dy = y2 - y1, adx = Math.abs(dx);
  if (adx < 1.5) return { d: `M${rr(x1)} ${rr(y1)} V${rr(y2)}`, len: Math.abs(dy) };
  if (style === "orthogonal") {
    const my = y1 + dy * 0.55;
    return { d: `M${rr(x1)} ${rr(y1)} V${rr(my)} H${rr(x2)} V${rr(y2)}`, len: Math.abs(my - y1) + adx + Math.abs(y2 - my) };
  }
  const m = Math.min(adx, Math.abs(dy)), vy = y2 - m;
  let d = `M${rr(x1)} ${rr(y1)}`;
  if (Math.abs(vy - y1) > 1) d += ` V${rr(vy)}`;
  d += ` L${rr(x2)} ${rr(y2)}`;
  return { d, len: Math.abs(vy - y1) + m * 1.414 };
}

// organic quadratic-bezier segment
function curveSeg(x1: number, y1: number, x2: number, y2: number, off: number) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / L) * off, cy = my + (dx / L) * off;
  const len = Math.hypot(cx - x1, cy - y1) + Math.hypot(x2 - cx, y2 - cy);
  return { d: `M${rr(x1)} ${rr(y1)} Q${rr(cx)} ${rr(cy)} ${rr(x2)} ${rr(y2)}`, len };
}

function generate(W: number, H: number, rootEnd: number, fruitCount: number): Scene {
  const rnd = mulberry32(M.seed);
  const cx = W / 2;
  const out: Scene = { paths: [], pads: [], leaves: [], sparks: [], blobs: [], copperEnd: 0, greenStart: 0, fruitAnchors: [] };
  const tips: Anchor[] = [];
  const topMargin = 12;
  const edge = Math.max(4, W * 0.008);
  const fill = M.rootFill;
  const curvy = 0.55 + M.metamorphOrganic * 0.5;
  const jit = (a: number) => (rnd() - 0.5) * a;

  // copper -> green resolves quickly: copper through the first ~40% of the
  // roots, fully green just after the roots reach the trunk.
  const copperEnd = rootEnd * 0.42;
  const greenStart = rootEnd + Math.min((H - rootEnd) * 0.08, 150);
  out.copperEnd = copperEnd;
  out.greenStart = greenStart;

  const leafColor = (y: number): { col: string; accent: boolean } => {
    if (y < copperEnd) return { col: COL.copperDeep, accent: false };
    const r = rnd();
    if (r < M.accentMix * 0.5) return { col: COL.amberHex, accent: true };
    if (r < M.accentMix) return { col: COL.orangeHex, accent: true };
    return { col: COL.greenHex, accent: false };
  };
  const mkLeaf = (x: number, y: number, ry: number, style: "blade" | CompStyle, forceCol?: string): Leaf => {
    const c = forceCol ? { col: forceCol, accent: false } : leafColor(y);
    return { cx: x, cy: y, ry, style, col: c.col, s: 3 + rnd() * 1.6, rot: rnd() * 60 - 30, accent: c.accent, sway: 2.5 + rnd() * 4, dur: 3.2 + rnd() * 3.2, del: 0.4 + rnd() * 3 };
  };

  // ---- PCB vias & solder junctions that ride the roots (replace foliage) ----
  // Copper/amber palette; both shapes are radial, so no rotation needed.
  const compStyle = (): CompStyle => (rnd() < 0.62 ? "via" : "junction");
  const compCol = () => {
    const r = rnd();
    if (r < 0.52) return COL.copper;
    if (r < 0.72) return COL.copperDeep;
    if (r < 0.88) return COL.amberHex;
    if (r < 0.96) return COL.orangeHex;
    return COL.greenHex;
  };
  const mkComp = (x: number, y: number, ry: number, style?: CompStyle, col?: string) =>
    out.leaves.push({
      cx: x, cy: y, ry,
      style: style ?? compStyle(),
      col: col ?? compCol(),
      s: 3 + rnd() * 1.8,
      rot: 0,
      accent: false, sway: 0, dur: 0, del: 0,
    });

  // ---- loose, mossy tendril that sprouts off a main root ----
  const tbudget = { n: 0 };
  function tendril(x0: number, y0: number, ang: number, len: number, w: number, depth: number) {
    if (tbudget.n++ > 900) return;
    const steps = 3 + Math.round(rnd() * 2);
    let cxp = x0, cyp = y0, a = ang, prev = { x: x0, y: y0 };
    for (let s = 1; s <= steps; s++) {
      a = clamp(a + (rnd() - 0.5) * deg(38), -deg(118), deg(118));
      const seglen = len / steps;
      const nx = clamp(cxp + Math.sin(a) * seglen, edge * 0.4, W - edge * 0.4);
      const ny = clamp(cyp - Math.cos(a) * seglen, topMargin - 6, y0 + 44); // signed -> drifts sideways/down
      const A = prev.y <= ny ? prev : { x: nx, y: ny };
      const B = prev.y <= ny ? { x: nx, y: ny } : prev;
      const seg = curveSeg(A.x, A.y, B.x, B.y, (rnd() - 0.5) * 9);
      out.paths.push({ d: seg.d, w, len: seg.len, ry: Math.min(A.y, B.y), kind: "tendril" });
      prev = { x: nx, y: ny }; cxp = nx; cyp = ny; w = Math.max(0.4, w * 0.84);
    }
    if (rnd() < 0.6) {
      const hx = clamp(prev.x + (rnd() - 0.5) * 14, edge * 0.4, W - edge * 0.4);
      const hy = Math.max(topMargin - 4, prev.y - (4 + rnd() * 9));
      const hA = hy <= prev.y ? { x: hx, y: hy } : prev, hB = hy <= prev.y ? prev : { x: hx, y: hy };
      const hs = curveSeg(hA.x, hA.y, hB.x, hB.y, 0);
      out.paths.push({ d: hs.d, w: 0.4, len: hs.len, ry: Math.min(hy, prev.y), kind: "tendril" });
    }
    if (rnd() < 0.34) mkComp(prev.x, prev.y, prev.y);
    if (rnd() < 0.2) mkComp(lerp(x0, prev.x, 0.55), lerp(y0, prev.y, 0.55), Math.min(y0, prev.y));
    if (depth < 2 && rnd() < 0.5 * fill)
      tendril(prev.x, prev.y, ang + (rnd() < 0.5 ? -1 : 1) * deg(26), len * 0.62, Math.max(0.4, w * 0.95), depth + 1);
  }

  // ---- one bold main root: monotonic climb from trunk to a wide target ----
  function traceRoot(x0: number, y0: number, tx: number, ty: number, baseW: number, phase: number, pexp: number) {
    const steps = 5 + Math.round(rnd() * 3);
    const amp = 4 + rnd() * 7;
    const freq = 0.9 + rnd() * 1.0;
    const pts: { x: number; y: number }[] = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const xx = x0 + (tx - x0) * Math.pow(t, pexp) + Math.sin(t * Math.PI * freq + phase) * amp * t;
      const yy = lerp(y0, ty, t);
      pts.push({ x: clamp(xx, edge * 0.5, W - edge * 0.5), y: yy });
    }
    for (let s2 = 0; s2 < pts.length - 1; s2++) {
      const lo = pts[s2], hi = pts[s2 + 1]; // hi = higher up (smaller y)
      const w = lerp(baseW, 0.7, s2 / (pts.length - 1));
      const bend = hi.x - lo.x >= 0 ? 1 : -1;
      const seg = curveSeg(hi.x, hi.y, lo.x, lo.y, bend * Math.hypot(hi.x - lo.x, hi.y - lo.y) * 0.06 * curvy);
      out.paths.push({ d: seg.d, w, len: seg.len, ry: Math.min(lo.y, hi.y), kind: "root" });
      if (s2 > 0 && rnd() < M.padDensity * 0.26) out.pads.push({ cx: hi.x, cy: hi.y, ry: hi.y, size: clamp(w * 0.7, 1.6, 3) });
      // copper vias & solder junctions strung densely along the roots
      if (hi.y < rootEnd && rnd() < M.rootVias) mkComp(hi.x, hi.y, hi.y);
      if (lo.y < rootEnd && rnd() < M.rootVias * 0.7)
        mkComp(lerp(lo.x, hi.x, 0.5), lerp(lo.y, hi.y, 0.5), Math.min(lo.y, hi.y));
      if (hi.y < rootEnd && rnd() < M.rootVias * 0.4)
        mkComp(lerp(lo.x, hi.x, 0.25), lerp(lo.y, hi.y, 0.25), Math.min(lo.y, hi.y));
      // loose tendrils all along the main
      const nt = (rnd() < fill ? 1 : 0) + (rnd() < fill * 0.85 ? 1 : 0);
      for (let td = 0; td < nt; td++) {
        const localAng = Math.atan2(hi.x - lo.x, Math.max(1, lo.y - hi.y));
        const so = rnd() < 0.5 ? -1 : 1;
        const tAng = clamp(localAng + so * deg(22 + rnd() * 82), -deg(116), deg(116));
        tendril(hi.x, hi.y, tAng, 20 + rnd() * 46, Math.max(0.5, w * 0.5), 0);
      }
    }
    // fine root-hairs at the tip
    const tip = pts[pts.length - 1], below = pts[pts.length - 2];
    const upAng = Math.atan2(tip.x - below.x, Math.max(1, below.y - tip.y));
    const hairs = 1 + (rnd() < fill * 0.45 ? 1 : 0);
    for (let h = 0; h < hairs; h++) {
      const a = upAng + (rnd() - 0.5) * deg(22);
      const hl = 7 + rnd() * 11;
      const hx = clamp(tip.x + Math.sin(a) * hl, edge * 0.5, W - edge * 0.5);
      const hy = Math.max(topMargin - 2, tip.y - Math.abs(Math.cos(a)) * hl);
      const hs = curveSeg(hx, hy, tip.x, tip.y, 0);
      out.paths.push({ d: hs.d, w: 0.6, len: hs.len, ry: Math.min(tip.y, hy), kind: "hair" });
    }
    if (rnd() < 0.7) mkComp(tip.x, tip.y, tip.y);
    return pts;
  }

  // wide, flat fan of a few bold mains
  const mainChains: { x: number; y: number }[][] = [];
  const mainN = Math.round(clamp(W / 170, 4, 11));
  const halfW = W / 2 - edge;
  for (let i = 0; i < mainN; i++) {
    const u = ((i + 0.5) / mainN) * 2 - 1;
    const ux = u === 0 ? 0 : Math.sign(u) * Math.pow(Math.abs(u), 0.6);
    const tx = clamp(cx + ux * halfW + jit((halfW / mainN) * 0.7), edge, W - edge);
    const centrality = 1 - Math.abs(u);
    const ty = topMargin + (1 - centrality) * rootEnd * 0.22 + rnd() * rootEnd * 0.07;
    const baseW = M.trunkWidth * lerp(0.6, 1.0, centrality);
    const pexp = lerp(0.88, 1.4, centrality);
    mainChains.push(traceRoot(cx, rootEnd, tx, ty, baseW, rnd() * Math.PI * 2, pexp));
  }
  out.pads.push({ cx, cy: rootEnd, ry: rootEnd, size: clamp(M.trunkWidth * 0.75, 2, 4.5) });

  // ---- trunk + spreading canopy ----
  const canopyStartY = rootEnd + Math.min(H * 0.05, 70);
  const trunk = pcbSeg(cx, rootEnd, cx, canopyStartY, "orthogonal");
  out.paths.push({ d: trunk.d, w: M.trunkWidth, len: trunk.len, ry: rootEnd, kind: "trunk" });
  out.pads.push({ cx, cy: canopyStartY, ry: canopyStartY, size: M.trunkWidth * 0.7 });

  // The canopy is a LUSH mangrove crown: a dense green fan sprouting DOWN from
  // the trunk to fill the featured-work area with foliage. The project cards
  // sit over the top of it. Denser near the trunk, broadening as it descends.
  // leave a band of open ground beneath the crown for leaves to drift through.
  const openGround = clamp(H * 0.24, 260, 640);
  const canopyBottom = Math.min(
    H - openGround,
    canopyStartY + clamp(H - canopyStartY - openGround, 380, 1200),
  );
  const canopyH = canopyBottom - canopyStartY;
  const cbudget = { n: 0 };
  const canopySpines: { x: number; y: number }[][] = [];
  const warmCol = () => {
    const r = rnd();
    return r < 0.42 ? COL.amberHex : r < 0.74 ? COL.orangeHex : r < 0.87 ? COL.copper : COL.greenHex;
  };
  const canopyLeaf = (x: number, y: number, warm?: boolean) =>
    out.leaves.push(mkLeaf(clamp(x, 4, W - 4), clamp(y, canopyStartY - 8, canopyBottom + 40), y, "blade", warm ? warmCol() : undefined));

  // The crown is a real branching tree: trunk -> boughs -> branches, clothed in
  // leaves. This is the TREE STRUCTURE; the blurred glow + scattered leaves
  // below only add body around it.
  const crownHalf = W * 0.62;                         // keep the crown bounded (no corner spokes)
  const loX = clamp(cx - crownHalf, edge, W);
  const hiX = clamp(cx + crownHalf, 0, W - edge);
  const splay0 = deg(M.branchSplay);
  const CANOPY_LEVELS = 4;

  function growBranch(x: number, y: number, angle: number, len: number, width: number, level: number, spine: { x: number; y: number }[] | null) {
    if (cbudget.n++ > 520) return;
    const ex = clamp(x + Math.sin(angle) * len, loX, hiX);
    const ey = y + Math.abs(Math.cos(angle)) * len;   // always downward
    const off = len * 0.16 * (0.4 + M.metamorphOrganic) * (Math.sin(angle) >= 0 ? 1 : -1) * (rnd() < 0.5 ? 1 : 0.6);
    const seg = curveSeg(x, y, ex, ey, off);          // parent-first -> grows downward
    out.paths.push({ d: seg.d, w: width, len: seg.len, ry: Math.min(y, ey), kind: "branch" });
    if (spine) spine.push({ x: ex, y: ey });
    if (rnd() < M.padDensity * 0.3) out.pads.push({ cx: x, cy: y, ry: y, size: clamp(width * 0.7, 1.6, 3) });
    // a leaf or two clothing the limb (sparse, so the branches stay legible)
    if (level >= 2 && rnd() < M.leafDensity * 0.55) {
      canopyLeaf(lerp(x, ex, 0.4 + rnd() * 0.5) + jit(13), lerp(y, ey, 0.4 + rnd() * 0.5) + jit(9));
    }
    if (level >= CANOPY_LEVELS || width < 0.8) {
      tips.push({ x: ex, y: ey });                      // a real branch tip a fruit can hang from
      const nleaf = 1 + (rnd() < 0.5 ? 1 : 0);          // small leaf tuft at the tip
      for (let i = 0; i < nleaf; i++) canopyLeaf(ex + jit(16), ey + jit(12));
      return;
    }
    const kids = rnd() < 0.4 ? 3 : 2;
    const deep = level / CANOPY_LEVELS;
    for (let k = 0; k < kids; k++) {
      const kf = (k / (kids - 1)) * 2 - 1;              // -1..1
      // spread wide early, curl toward straight-down deeper -> a rounded crown
      const na = clamp(angle * (0.92 - deep * 0.3) + kf * splay0 * (0.95 - deep * 0.4), -1.4, 1.4);
      growBranch(ex, ey, na, len * (0.74 + rnd() * 0.08), width * 0.7, level + 1, k === 0 ? spine : null);
    }
  }

  // the trunk splits into a few main boughs that branch out into the crown
  const baseCount = 5;
  for (let bi = 0; bi < baseCount; bi++) {
    const f0 = (bi / (baseCount - 1)) * 2 - 1;          // -1..1
    const csp: { x: number; y: number }[] = [{ x: cx, y: canopyStartY }];
    growBranch(cx, canopyStartY, f0 * splay0 * 0.85, canopyH * 0.26, M.trunkWidth * 0.82, 1, csp);
    canopySpines.push(csp);
  }


  // Pick `fruitCount` real branch tips, spread evenly across the crown, for the
  // fruit-cards to hang from. Each target x claims the nearest un-used tip.
  if (fruitCount > 0 && tips.length) {
    const band = tips.filter((t) => t.y > canopyStartY + canopyH * 0.12 && t.y < canopyStartY + canopyH * 0.72);
    const pool = band.length >= fruitCount ? band : tips;
    const used = new Set<number>();
    const need = Math.min(fruitCount, pool.length);
    for (let i = 0; i < need; i++) {
      const tx = lerp(edge + W * 0.05, W - edge - W * 0.05, need === 1 ? 0.5 : i / (need - 1));
      let best = -1, bestD = Infinity;
      for (let j = 0; j < pool.length; j++) {
        if (used.has(j)) continue;
        const d = Math.abs(pool[j].x - tx);
        if (d < bestD) { bestD = d; best = j; }
      }
      if (best >= 0) { used.add(best); out.fruitAnchors.push(pool[best]); }
    }
    out.fruitAnchors.sort((a, b) => a.x - b.x);
  }

  // falling leaves: warm leaves drifting down from the crown, through the open
  // ground below the tree, fanning wider and gathering denser toward the foot
  // of the page. Unlike canopy leaves these are free to fall past the crown all
  // the way to the bottom edge.
  const fallLeaf = (x: number, y: number) =>
    out.leaves.push(mkLeaf(clamp(x, 4, W - 4), y, y, "blade", warmCol()));
  const fallTop = canopyStartY + canopyH * 0.26;
  const fallBottom = H - 24;                            // down to the page foot
  const fallH = Math.max(80, fallBottom - fallTop);
  const fallN = Math.round(clamp((W * fallH) / 6200, 160, 820) * M.leafDensity);
  for (let i = 0; i < fallN; i++) {
    const t = Math.pow(rnd(), 0.62);                   // biased low, but fills the drop
    const y = lerp(fallTop, fallBottom, t);
    const spread = lerp(W * 0.2, W * 0.72, t);         // fan out as they fall
    const nx = (rnd() - 0.5) * 2;
    const x = clamp(cx + nx * spread, edge, W - edge);
    if (Math.abs(nx) > 0.6 && rnd() < 0.4) continue;   // thin the far edges
    fallLeaf(x, y);                                    // warm autumn tones
  }

  return out;
}

function LeafNode({ lf }: { lf: Leaf }) {
  const x = rr(lf.cx), y = rr(lf.cy), s = lf.s;
  // PCB nodes: a plated via-ring or a solid solder junction. Both bloom + pulse.
  if (lf.style !== "blade") {
    return (
      <g className="tg-rnode" data-ry={Math.round(lf.ry)} style={{ color: lf.col }}>
        {lf.style === "via" ? (
          <>
            <circle cx={x} cy={y} r={rr(s + 3)} fill={lf.col} opacity={0.16} />
            <circle cx={x} cy={y} r={rr(s)} fill="var(--tg-bg)" stroke={lf.col} strokeWidth={1.4} />
          </>
        ) : (
          <>
            <circle cx={x} cy={y} r={rr(s + 1.5)} fill={lf.col} opacity={0.14} />
            <circle cx={x} cy={y} r={rr(s * 0.6)} fill={lf.col} />
          </>
        )}
      </g>
    );
  }
  // blade leaf: a single cheap almond (foliage is dense, so one element each).
  // Rotation + drift ride on CSS custom properties so they compose cleanly.
  return (
    <ellipse
      className="tg-rleaf"
      data-ry={Math.round(lf.ry)}
      cx={x}
      cy={y}
      rx={rr(s * 1.5)}
      ry={rr(s * 0.56)}
      fill={lf.col}
      fillOpacity={0.5}
      style={{
        ["--rot" as string]: `${rr(lf.rot)}deg`,
        ["--dsway" as string]: `${rr(lf.sway)}px`,
        ["--ddur" as string]: `${rr(lf.dur)}s`,
        ["--ddel" as string]: `${rr(lf.del)}s`,
      }}
    />
  );
}

export default function CircuitVines({
  fruitCount = 0,
  onAnchors,
}: {
  fruitCount?: number;
  onAnchors?: (anchors: Anchor[]) => void;
} = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0, heroH: 0 });

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      const w = Math.round(r.width);
      const h = Math.ceil(r.height / 120) * 120;
      const header = node.parentElement?.querySelector(":scope > header") as HTMLElement | null;
      const heroH = header ? header.offsetHeight : Math.round(window.innerHeight * 0.72);
      setDims((prev) =>
        Math.abs(w - prev.w) > 4 || Math.abs(h - prev.h) >= 120 || Math.abs(heroH - prev.heroH) > 20
          ? { w, h, heroH }
          : prev,
      );
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const scene = useMemo(
    () => (dims.w > 0 && dims.h > 0 ? generate(dims.w, dims.h, dims.heroH || dims.h * 0.32, fruitCount) : null),
    [dims.w, dims.h, dims.heroH, fruitCount],
  );

  // report the branch-tip anchors up so the fruit-cards can hang from them
  useEffect(() => {
    if (scene && onAnchors) onAnchors(scene.fruitAnchors);
  }, [scene, onAnchors]);

  // Growth reveals TOP -> BOTTOM: on load a front descends from the top over
  // ~2s; afterwards scrolling extends the front further down (one-way).
  useEffect(() => {
    if (!scene) return;
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;

    const items = Array.from(svg.querySelectorAll<SVGElement>("[data-ry]"))
      .map((el) => ({ el, ry: Number(el.dataset.ry) }))
      .sort((a, b) => a.ry - b.ry);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((it) => it.el.classList.add("grown"));
      return;
    }

    let idx = 0;
    let maxFront = -Infinity;
    let done = false;
    let raf = 0;
    let ticking = false;
    const INTRO_MS = 2000;

    const scrollFront = () => window.innerHeight * 0.94 - wrap.getBoundingClientRect().top;
    const revealTo = (front: number) => {
      if (front <= maxFront) return;
      maxFront = front;
      while (idx < items.length && items[idx].ry <= front) {
        items[idx].el.classList.add("grown");
        idx++;
      }
    };

    let start: number | null = null;
    const step = (ts: number) => {
      if (start == null) start = ts;
      const p = Math.min(1, (ts - start) / INTRO_MS);
      const eased = 1 - Math.pow(1 - p, 2);
      revealTo(eased * Math.max(0, scrollFront()));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        done = true;
        revealTo(scrollFront());
      }
    };
    raf = requestAnimationFrame(step);

    const onScroll = () => {
      if (!done || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        revealTo(scrollFront());
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scene]);

  const VINE = "url(#tgVineGrad)";
  const s0 = scene ? clamp(scene.copperEnd / dims.h, 0, 0.97) : 0;
  const s1 = scene ? clamp(scene.greenStart / dims.h, s0 + 0.02, 0.99) : 1;
  const smid = clamp((s0 + s1) / 2, s0 + 0.01, s1 - 0.01);

  return (
    <div ref={wrapRef} className="tg-roots" aria-hidden="true">
      {scene && (
        <svg ref={svgRef} width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`}>
          <defs>
            <linearGradient id="tgVineGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={dims.h}>
              <stop offset="0" stopColor={COL.copperDeep} />
              <stop offset={s0} stopColor={COL.copper} />
              <stop offset={smid} stopColor={COL.amberHex} />
              <stop offset={s1} stopColor={COL.greenHex} />
              <stop offset="1" stopColor={COL.greenHex} />
            </linearGradient>
          </defs>

          {/* fine, mossy wisps behind the bold structure */}
          <g className="tg-roots-fine" strokeLinecap="round" strokeLinejoin="round">
            {scene.paths
              .filter((p) => p.kind === "tendril" || p.kind === "hair")
              .map((p, i) => (
                <path
                  key={`f${i}`}
                  className="tg-root"
                  data-ry={Math.round(p.ry)}
                  style={{ ["--len" as string]: p.len }}
                  stroke={VINE}
                  strokeWidth={p.w}
                  d={p.d}
                />
              ))}
          </g>

          {/* bold mains / trunk / canopy branches */}
          <g className="tg-roots-branches" strokeLinecap="round" strokeLinejoin="round">
            {scene.paths
              .filter((p) => p.kind === "root" || p.kind === "trunk" || p.kind === "branch")
              .map((p, i) => (
                <path
                  key={`b${i}`}
                  className="tg-root"
                  data-ry={Math.round(p.ry)}
                  style={{ ["--len" as string]: p.len }}
                  stroke={VINE}
                  strokeWidth={p.w}
                  d={p.d}
                />
              ))}
          </g>

          <g className="tg-roots-pads">
            {scene.pads.map((p, i) => (
              <rect
                key={`p${i}`}
                className="tg-rpad"
                data-ry={Math.round(p.ry)}
                x={rr(p.cx - p.size)}
                y={rr(p.cy - p.size)}
                width={rr(p.size * 2)}
                height={rr(p.size * 2)}
                transform={`rotate(45 ${rr(p.cx)} ${rr(p.cy)})`}
                fill="none"
                stroke={VINE}
                strokeWidth={1.1}
              />
            ))}
          </g>

          <g className="tg-roots-nodes">
            {scene.leaves.map((lf, i) => (
              <LeafNode key={`n${i}`} lf={lf} />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
