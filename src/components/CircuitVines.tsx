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
type Blob = { cx: number; cy: number; rx: number; ry: number; op: number };
type Anchor = { x: number; y: number };
type Scene = { paths: Path[]; pads: Pad[]; leaves: Leaf[]; blobs: Blob[]; copperEnd: number; greenStart: number; fruitAnchors: Anchor[] };

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
  const out: Scene = { paths: [], pads: [], leaves: [], blobs: [], copperEnd: 0, greenStart: 0, fruitAnchors: [] };
  const tips: Anchor[] = [];
  const topMargin = 12;
  const edge = Math.max(4, W * 0.008);
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

  // ---- Bold tapering taproot: a shorter, wider, mirror-balanced fan that
  // converges into the collar node. Roots leave the collar with a natural flare
  // (no tight bundle) and taper hard to fine hairs; PCB vias ride each root.
  const halfW = W / 2 - edge;
  const rootHeight = Math.max(160, Math.min(rootEnd - topMargin - 8, W * 0.44));
  const rootTop = rootEnd - rootHeight;
  const nPairs = Math.round(clamp(W / 240, 4, 6));
  const baseSpread = clamp(W * 0.012, 8, 22);

  type Pt = { x: number; y: number };
  type Seg = { ax: number; ay: number; bx: number; by: number; w: number; kind: "root" | "hair" };
  type Sink = { segs: Seg[]; comps: Pt[] };

  const cubicPts = (p0: Pt, c1: Pt, c2: Pt, p3: Pt, n: number): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, m = 1 - t;
      pts.push({
        x: m * m * m * p0.x + 3 * m * m * t * c1.x + 3 * m * t * t * c2.x + t * t * t * p3.x,
        y: m * m * m * p0.y + 3 * m * m * t * c1.y + 3 * m * t * t * c2.y + t * t * t * p3.y,
      });
    }
    return pts;
  };
  const pushTaper = (sink: Sink, pts: Pt[], baseW: number, tipW: number, exp: number) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const t = i / (pts.length - 2 || 1);
      const w = tipW + (baseW - tipW) * Math.pow(1 - t, exp);
      sink.segs.push({ ax: pts[i].x, ay: pts[i].y, bx: pts[i + 1].x, by: pts[i + 1].y, w, kind: "root" });
    }
  };
  const viasAlong = (sink: Sink, pts: Pt[], pitch: number) => {
    let acc = pitch * 0.55;
    for (let i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      if (acc >= pitch) { acc = 0; sink.comps.push({ x: pts[i].x, y: pts[i].y }); }
    }
  };
  const tipHairs = (sink: Sink, pts: Pt[], n: number) => {
    const tip = pts[pts.length - 1], pen = pts[pts.length - 2];
    const ang = Math.atan2(tip.x - pen.x, pen.y - tip.y);
    for (let h = 0; h < n; h++) {
      const a = ang + (rnd() - 0.5) * deg(34);
      const hl = 10 + rnd() * 14;
      const hx = clamp(tip.x + Math.sin(a) * hl, edge * 0.5, W - edge * 0.5);
      const hy = Math.max(topMargin - 4, tip.y - Math.abs(Math.cos(a)) * hl);
      sink.segs.push({ ax: tip.x, ay: tip.y, bx: hx, by: hy, w: 0.8, kind: "hair" });
    }
  };
  const fork = (sink: Sink, pts: Pt[], w: number, depthLeft: number, level: number) => {
    if (depthLeft <= 0) return;
    const ts = level === 1 ? [0.4, 0.62, 0.82] : [0.55, 0.8];
    for (const t of ts) {
      if (level > 1 && rnd() < 0.28) continue;
      const idx = clamp(Math.round(t * (pts.length - 1)), 1, pts.length - 2);
      const base = pts[idx], prev = pts[idx - 1];
      const bang = Math.atan2(base.x - prev.x, prev.y - base.y);
      const na = bang + deg(16 + rnd() * 20) * (rnd() < 0.5 ? -1 : 1);
      const clen = lerp(rootHeight * 0.2, rootHeight * 0.36, rnd()) * (1 - level * 0.13);
      const tx = clamp(base.x + Math.sin(na) * clen, edge, W - edge);
      const ty = clamp(base.y - Math.abs(Math.cos(na)) * clen, topMargin, rootEnd);
      const cp = cubicPts(
        base,
        { x: base.x + Math.sin(bang) * clen * 0.3, y: base.y - Math.cos(bang) * clen * 0.3 },
        { x: tx - Math.sin(na) * clen * 0.3, y: ty + clen * 0.1 },
        { x: tx, y: ty }, 9,
      );
      const cw = Math.max(1.1, w * 0.62);
      pushTaper(sink, cp, cw, 0.6, 1.5);
      // vias only at the major (first-level) junctions, kept sparse
      if (level === 1) {
        sink.comps.push({ x: base.x, y: base.y });
        viasAlong(sink, cp, clamp(rootHeight * 0.34, 130, 190));
      }
      tipHairs(sink, cp, 1 + Math.floor(rnd() * 2));
      fork(sink, cp, cw, depthLeft - 1, level + 1);
    }
  };
  const genMain = (sink: Sink, side: number, rank: number) => {
    const r0 = rank / nPairs;                         // 0 center .. 1 outer
    const u = side * r0;
    const centrality = 1 - Math.abs(u);
    const baseX = cx + side * baseSpread * Math.pow(r0, 0.7);
    const tx = clamp(cx + side * Math.pow(r0, 0.62) * halfW * 0.94 + jit(W * 0.015), edge, W - edge);
    const ty = rootTop + (1 - centrality) * (rootEnd - rootTop) * 0.42 + rnd() * (rootHeight * 0.05);
    const reachY = rootEnd - ty;
    const dom = rank <= 1;
    const baseW = dom
      ? lerp(M.trunkWidth * 1.5, M.trunkWidth * 1.1, r0)
      : lerp(M.trunkWidth * 0.95, M.trunkWidth * 0.62, r0);
    const dx = Math.abs(tx - baseX);
    // leave the collar flaring outward (no tight vertical bundle), arrive along the splay
    const pts = cubicPts(
      { x: baseX, y: rootEnd },
      { x: baseX + side * dx * 0.22, y: rootEnd - reachY * 0.3 },
      { x: tx - side * dx * 0.28, y: ty + reachY * 0.12 },
      { x: tx, y: ty }, 16,
    );
    pushTaper(sink, pts, baseW, 0.7, 1.6);
    viasAlong(sink, pts, clamp(rootHeight * 0.22, 95, 155));
    tipHairs(sink, pts, 2 + Math.floor(rnd() * 3));
    fork(sink, pts, baseW, dom ? 3 : 2, 1);
    sink.comps.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });
  };
  const flushSink = (sink: Sink) => {
    for (const s of sink.segs) {
      out.paths.push({
        d: `M${rr(s.ax)} ${rr(s.ay)} L${rr(s.bx)} ${rr(s.by)}`,
        w: s.w, len: Math.hypot(s.bx - s.ax, s.by - s.ay),
        ry: Math.min(s.ay, s.by), kind: s.kind,
      });
    }
    for (const c of sink.comps) mkComp(c.x, c.y, c.y);
  };
  const mirrorSink = (sink: Sink): Sink => ({
    segs: sink.segs.map((s) => ({ ...s, ax: W - s.ax, bx: W - s.bx })),
    comps: sink.comps.map((c) => ({ x: W - c.x, y: c.y })),
  });

  // center root (unmirrored), then right-side mains mirrored to the left so the
  // fan is perfectly balanced behind the terminal.
  const center: Sink = { segs: [], comps: [] };
  genMain(center, 0, 0);
  flushSink(center);
  for (let r = 1; r <= nPairs; r++) {
    const rs: Sink = { segs: [], comps: [] };
    genMain(rs, 1, r);
    flushSink(rs);
    flushSink(mirrorSink(rs));
  }
  // the branch-point node where the trunk (tree) begins
  out.pads.push({ cx, cy: rootEnd, ry: rootEnd, size: clamp(M.trunkWidth * 0.9, 2, 5) });

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
  // PCB nodes: a plated via-ring or a solid solder junction. A lit core hops
  // node-to-node (relay current) once the node has grown in.
  if (lf.style !== "blade") {
    const RELAY_DUR = 2.1;                            // seconds — matches @keyframes tg-hop
    const phase = (((lf.cy % 260) / 260) + 1) % 1;    // phased by y -> a downward wave
    const coreHot = lf.col === COL.greenHex ? "#d3e8b4" : "#f4d7a0";
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
        <circle
          className="tg-via-core"
          cx={x}
          cy={y}
          r={rr(s * (lf.style === "via" ? 0.62 : 0.5))}
          fill={coreHot}
          style={{ ["--phase" as string]: `${(-phase * RELAY_DUR).toFixed(2)}s` }}
        />
      </g>
    );
  }
  // blade leaf: a single cheap almond (foliage is dense, so one element each).
  // Rotation + drift ride on CSS custom properties so they compose cleanly.
  // The wrapping <g> carries the live mouse-repulsion translate (see the
  // pointer effect below) so it stacks on top of the CSS drift, not against it.
  return (
    <g className="tg-leaf-wrap">
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
    </g>
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

  // Leaves scatter away from the cursor — the closer the pointer, the harder the
  // gust; a light spring floats each leaf back home once the pointer moves on.
  // Each leaf gets a per-frame translate on its wrapping <g>, so the CSS flutter
  // keeps running underneath. Only leaves near the cursor are ever written to;
  // the loop sleeps when nothing is moving.
  useEffect(() => {
    if (!scene) return;
    const svg = svgRef.current;
    if (!svg || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const groups = Array.from(svg.querySelectorAll<SVGGElement>(".tg-leaf-wrap"));
    const n = groups.length;
    if (!n) return;

    const homeX = new Float32Array(n);
    const homeY = new Float32Array(n);
    const offX = new Float32Array(n);
    const offY = new Float32Array(n);
    const velX = new Float32Array(n);
    const velY = new Float32Array(n);
    const dirty = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const leaf = groups[i].firstElementChild;
      homeX[i] = leaf ? Number(leaf.getAttribute("cx")) : 0;
      homeY[i] = leaf ? Number(leaf.getAttribute("cy")) : 0;
    }

    // Per-leaf character so a gust SCATTERS rather than shunting every leaf the
    // same way: gVar varies how hard a leaf catches the wind; phase/fr detune its
    // turbulent flutter.
    const gVar = new Float32Array(n);
    const phase = new Float32Array(n);
    const fr = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      gVar[i] = 0.6 + Math.random() * 0.85;
      phase[i] = Math.random() * Math.PI * 2;
      fr[i] = 6 + Math.random() * 7;
    }

    // Wind model (pixels / seconds). The cursor doesn't repel leaves — its MOTION
    // stirs a gust vector (gx,gy) that blows them DOWNWIND, parts them around the
    // pointer, and adds turbulent flutter. A still cursor makes no wind: the gust
    // decays away and the leaves fall calm. K/C are a soft, floaty spring so blown
    // leaves get carried and drift home rather than snapping back.
    const R = 240, R2 = R * R;
    const DOWNWIND = 5.2;      // push along the gust direction
    const PART = 1.5;         // parting away from the cursor
    const TURB = 2.1;         // turbulent cross-wind flutter
    const GUST_TAU = 0.14;    // how fast a gust dies once the cursor stops
    const GUST_MIN = 55;      // px/s below which there's effectively no wind
    const GUST_MAX = 4200;    // clamp so a hard flick can't fling leaves off-screen
    const K = 46, C = 8;
    const MAXOFF = 200, MAXOFF2 = MAXOFF * MAXOFF;

    let mx = 0, my = 0, lastCX = 0, lastCY = 0, hasMouse = false;
    let gx = 0, gy = 0;       // live gust velocity (px/s)
    let clock = 0;
    let prevCX = 0, prevCY = 0, prevTS = 0, havePrev = false;
    let raf = 0, running = false, lastT = 0;

    const frame = (t: number) => {
      let dt = lastT ? (t - lastT) / 1000 : 0.016;
      lastT = t;
      if (dt > 0.05) dt = 0.05;
      else if (dt <= 0) dt = 0.016;
      clock += dt;

      // the gust decays every frame; movement replenishes it in onMove
      const gd = Math.exp(-dt / GUST_TAU);
      gx *= gd; gy *= gd;
      const gmag = Math.hypot(gx, gy);
      const windOn = hasMouse && gmag > GUST_MIN;
      const gux = windOn ? gx / gmag : 0;
      const guy = windOn ? gy / gmag : 0;

      let anyAwake = false;
      for (let i = 0; i < n; i++) {
        let ox = offX[i], oy = offY[i], vx = velX[i], vy = velY[i];
        let ax = -K * ox - C * vx; // spring toward home + damping
        let ay = -K * oy - C * vy;
        if (windOn) {
          const dx = homeX[i] + ox - mx;
          const dy = homeY[i] + oy - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 0.001;
            const f = 1 - d / R;
            const w = f * f * gVar[i];           // proximity × how well this leaf catches wind
            ax += DOWNWIND * gx * w;             // blow downwind
            ay += DOWNWIND * gy * w;
            const inv = 1 / d;
            ax += PART * gmag * dx * inv * w;     // part around the cursor
            ay += PART * gmag * dy * inv * w;
            const turb = TURB * gmag * w * Math.sin(clock * fr[i] + phase[i]);
            ax += -guy * turb;                    // flutter across the wind
            ay += gux * turb;
          }
        }
        vx += ax * dt; vy += ay * dt;
        ox += vx * dt; oy += vy * dt;
        const m2 = ox * ox + oy * oy;
        if (m2 > MAXOFF2) {
          const sc = MAXOFF / Math.sqrt(m2);
          ox *= sc; oy *= sc;
        }
        offX[i] = ox; offY[i] = oy; velX[i] = vx; velY[i] = vy;

        if (ox > 0.2 || ox < -0.2 || oy > 0.2 || oy < -0.2 ||
            vx > 2 || vx < -2 || vy > 2 || vy < -2) {
          anyAwake = true;
          groups[i].setAttribute("transform", `translate(${ox.toFixed(2)} ${oy.toFixed(2)})`);
          dirty[i] = 1;
        } else if (dirty[i]) {
          offX[i] = 0; offY[i] = 0; velX[i] = 0; velY[i] = 0;
          groups[i].removeAttribute("transform");
          dirty[i] = 0;
        }
      }

      if (anyAwake || windOn) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        lastT = 0;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        lastT = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    let rect = svg.getBoundingClientRect();
    const refreshRect = () => { rect = svg.getBoundingClientRect(); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      lastCX = e.clientX; lastCY = e.clientY;
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      hasMouse = true;
      if (havePrev) {
        const dtE = Math.max(8, e.timeStamp - prevTS) / 1000;      // seconds
        let ivx = (e.clientX - prevCX) / dtE;                      // instantaneous px/s
        let ivy = (e.clientY - prevCY) / dtE;
        const im = Math.hypot(ivx, ivy);
        if (im > GUST_MAX) { const s = GUST_MAX / im; ivx *= s; ivy *= s; }
        // fold the flick into the gust (bias toward the newest motion)
        gx = gx * 0.35 + ivx * 0.65;
        gy = gy * 0.35 + ivy * 0.65;
      }
      prevCX = e.clientX; prevCY = e.clientY; prevTS = e.timeStamp; havePrev = true;
      wake();
    };

    const onScroll = () => {
      refreshRect();
      if (!hasMouse) return;
      mx = lastCX - rect.left; // page moved under a stationary cursor
      my = lastCY - rect.top;
      wake();
    };

    const onLeave = () => {
      hasMouse = false;
      havePrev = false;
      wake(); // let the spring float everything home
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refreshRect, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refreshRect);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf);
      for (let i = 0; i < n; i++) groups[i].removeAttribute("transform");
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

          {/* fine root-hairs behind the bold structure */}
          <g className="tg-roots-fine" strokeLinecap="round" strokeLinejoin="round">
            {scene.paths
              .filter((p) => p.kind === "hair")
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
