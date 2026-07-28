"use client";

// Terminal Garden — inverted sapling along the RIGHT edge of the home page.
//
// The reference is a skinny single-trunk sapling, flipped: the TOP of the page
// is the ROOTS (you're ssh'd into root) — copper mains fanning wide across the
// hero, shedding mossy tendrils studded with PCB vias — which bundle into a
// collar and become ONE slender trunk running down the right side. When the
// trunk reaches the featured work it turns into a tree: limbs on both sides.
// Every LEFT limb belongs to a project — it leaves the trunk above the card
// and flattens into a leaf pinned at the card's top-right corner (corners are
// measured from the real DOM, so branches land exactly). RIGHT limbs are short
// stubs toward the page edge. Past the last card the trunk tapers to the
// sapling's leader tip in the open ground, crowned with a tuft of leaves.
// Everything still grows in TOP -> BOTTOM with the scroll front, vias relay
// charge pulses, and leaves scatter in the cursor's gust.
//
// Geometry is measured on the client so the SVG maps 1:1 to pixels, and
// regenerates when the page's size or the card corners change.

import { useEffect, useMemo, useRef, useState } from "react";

const M = {
  trunkWidth: 5.4,      // collar width; tapers to ~1px at the leader tip
  accentMix: 0.3,       // warm accent share among green leaves
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

type Path = { d: string; w: number; ry: number; len: number; kind: "root" | "hair" | "trunk" | "branch" };
type Pad = { cx: number; cy: number; ry: number; size: number };
type CompStyle = "via" | "junction";
type Leaf = { cx: number; cy: number; ry: number; style: "blade" | CompStyle; col: string; s: number; rot: number; accent: boolean; sway: number; dur: number; del: number; op?: number };
type Anchor = { x: number; y: number };
type Scene = { paths: Path[]; pads: Pad[]; leaves: Leaf[]; copperEnd: number; greenStart: number };

type Pt = { x: number; y: number };
type Seg = { ax: number; ay: number; bx: number; by: number; w: number; kind: "root" | "hair" | "trunk" | "branch" };
type Sink = { segs: Seg[]; comps: Pt[] };

function generate(W: number, H: number, rootEnd: number, targets: Anchor[]): Scene {
  const rnd = mulberry32(M.seed);
  const out: Scene = { paths: [], pads: [], leaves: [], copperEnd: 0, greenStart: 0 };
  const topMargin = 12;
  const edge = Math.max(4, W * 0.008);
  const jit = (a: number) => (rnd() - 0.5) * a;

  // ---- the tree's axis: a slender trunk hugging the right edge -------------
  // Anchored to the measured card corners so branch reach stays consistent at
  // any viewport; falls back to a fixed corridor before the cards exist.
  const edgeMargin = clamp(W * 0.03, 22, 56);
  const corridor = clamp(W * 0.06, 44, 128);
  const cardsRight = targets.length
    ? Math.max(...targets.map((t) => t.x))
    : W - clamp(W * 0.16, 96, 260);
  const trunkX = Math.min(W - edgeMargin, cardsRight + corridor);

  // copper roots resolve to green just below the collar
  out.copperEnd = rootEnd * 0.5;
  out.greenStart = rootEnd + Math.min((H - rootEnd) * 0.06, 120);

  const collarY = rootEnd;
  // slimmer stem on narrow viewports so the sapling keeps its skinny look
  const trunkW = M.trunkWidth * clamp(W / 1000, 0.72, 1);
  const lowestCard = targets.length ? Math.max(...targets.map((t) => t.y)) : collarY + (H - collarY) * 0.45;
  // the leader runs deep into the open ground at the page foot
  const tipY = clamp(lowestCard + clamp(H * 0.22, 280, 640), collarY + 300, Math.max(collarY + 320, H - 60));
  const curlZone = 90;
  const swayA = clamp(W * 0.004, 2.5, 6);
  // the trunk's centerline: a gentle sway, curling slightly at the leader tip
  const trunkAt = (y: number) => {
    let x = trunkX + swayA * Math.sin(y * 0.011 + 1.35);
    if (y > tipY - curlZone) x -= (y - (tipY - curlZone)) * 0.11;
    return x;
  };

  // ---- leaves & PCB components ---------------------------------------------
  const leafColor = (y: number): { col: string; accent: boolean } => {
    if (y < out.copperEnd) return { col: COL.copperDeep, accent: false };
    const r = rnd();
    if (r < M.accentMix * 0.5) return { col: COL.amberHex, accent: true };
    if (r < M.accentMix) return { col: COL.orangeHex, accent: true };
    return { col: COL.greenHex, accent: false };
  };
  const mkLeaf = (x: number, y: number, ry: number, forceCol?: string, size?: number, op?: number): Leaf => {
    const c = forceCol ? { col: forceCol, accent: false } : leafColor(y);
    return {
      cx: x, cy: y, ry, style: "blade", col: c.col,
      s: size ?? 3 + rnd() * 1.6, rot: rnd() * 60 - 30, accent: c.accent,
      sway: 2.5 + rnd() * 4, dur: 3.2 + rnd() * 3.2, del: 0.4 + rnd() * 3, op,
    };
  };
  const compStyle = (): CompStyle => (rnd() < 0.62 ? "via" : "junction");
  const compCol = () => {
    const r = rnd();
    if (r < 0.52) return COL.copper;
    if (r < 0.72) return COL.copperDeep;
    if (r < 0.88) return COL.amberHex;
    if (r < 0.96) return COL.orangeHex;
    return COL.greenHex;
  };
  const mkComp = (x: number, y: number, ry: number, style?: CompStyle, col?: string, size?: number) =>
    out.leaves.push({
      cx: x, cy: y, ry,
      style: style ?? compStyle(),
      col: col ?? compCol(),
      s: size ?? 3 + rnd() * 1.8,
      rot: 0,
      accent: false, sway: 0, dur: 0, del: 0,
    });

  // ---- shared curve/taper machinery -----------------------------------------
  const quadPts = (p0: Pt, c: Pt, p1: Pt, n: number): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, m = 1 - t;
      pts.push({
        x: m * m * p0.x + 2 * m * t * c.x + t * t * p1.x,
        y: m * m * p0.y + 2 * m * t * c.y + t * t * p1.y,
      });
    }
    return pts;
  };
  const pushTaper = (sink: Sink, pts: Pt[], baseW: number, tipW: number, exp: number, pinch = 0, kind: Seg["kind"] = "root") => {
    for (let i = 0; i < pts.length - 1; i++) {
      const t = i / (pts.length - 2 || 1);
      let w = tipW + (baseW - tipW) * Math.pow(1 - t, exp);
      // pinch the base thin so a limb blends into the line it leaves from
      if (pinch > 0) w = Math.max(tipW, w * clamp(t / pinch, 0.35, 1));
      sink.segs.push({ ax: pts[i].x, ay: pts[i].y, bx: pts[i + 1].x, by: pts[i + 1].y, w, kind });
    }
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

  // ---- ROOTS: an exposed inner-layer trace lattice across the top -----------
  // (chosen concept R3). A field of hairline verticals drops from the page's
  // top edge, tied by sparse horizontals and via'd at grid nodes; it dissolves
  // leftward and downward until ONE bold trace survives, routes out of the
  // field with 45° chamfered bends, and becomes the trunk at the collar.
  {
    const pitch = Math.round(clamp(W / 48, 22, 36));
    const span = clamp(W * 0.5, 300, 880);
    const x0 = Math.max(edge + 6, trunkX - span);
    const yTop = topMargin;
    const yMax = Math.max(yTop + 120, Math.min(collarY * 0.58, yTop + 330));
    const bandH = yMax - yTop;
    const field: Sink = { segs: [], comps: [] };

    // vertical hairlines — denser and longer toward the trunk side
    const colBot = new Map<number, number>();
    for (let x = x0; x <= W - edge - 2; x += pitch) {
      const t = (x - x0) / Math.max(1, W - edge - x0);
      if (rnd() > 0.3 + t * 0.62) continue;
      const yEnd = yTop + bandH * (0.25 + rnd() * 0.75) * (0.45 + t * 0.55);
      field.segs.push({ ax: x, ay: yTop, bx: x, by: yEnd, w: 0.9, kind: "hair" });
      colBot.set(x, yEnd);
      // occasional 45° tail where a net was left unrouted
      if (rnd() < 0.18) {
        const sgn = pitch * 0.5 * (rnd() < 0.5 ? -1 : 1);
        field.segs.push({ ax: x, ay: yEnd, bx: x + sgn, by: yEnd + Math.abs(sgn), w: 0.9, kind: "hair" });
      }
    }
    // sparse horizontal ties between columns that reach that row
    const colXs = [...colBot.keys()];
    for (let y = yTop + pitch; y < yMax - pitch * 0.5; y += pitch) {
      const ty = (y - yTop) / bandH;
      if (rnd() > 0.62 - ty * 0.5) continue;
      const rowCols = colXs.filter((cx2) => (colBot.get(cx2) ?? 0) >= y);
      if (rowCols.length < 2) continue;
      const ia = Math.floor(rnd() * (rowCols.length - 1));
      const xa = rowCols[ia];
      const xbPool = rowCols.slice(ia + 1);
      const xb = xbPool[Math.floor(rnd() * xbPool.length)];
      if (xb - xa < pitch) continue;
      field.segs.push({ ax: xa, ay: y, bx: xb, by: y, w: 0.9, kind: "hair" });
      if (rnd() < 0.3) mkComp(xa, y, y, "via", undefined, 2.1 + rnd() * 0.7);
    }
    // vias riding some verticals at grid rows
    for (const cx2 of colXs) {
      if (rnd() > 0.3) continue;
      const bot = colBot.get(cx2)!;
      const rows = Math.floor((bot - yTop) / pitch);
      if (rows < 1) continue;
      const vy = yTop + (1 + Math.floor(rnd() * rows)) * pitch;
      if (vy < bot) mkComp(cx2, vy, vy, "via", undefined, 2.1 + rnd() * 0.7);
    }
    flushSink(field);

    // survivor traces: constant-width nets escaping the field into the collar
    const chamfer = (wp: Pt[], c: number): Pt[] => {
      const res: Pt[] = [wp[0]];
      for (let i = 1; i < wp.length - 1; i++) {
        const p = wp[i], a = wp[i - 1], b = wp[i + 1];
        const inL = Math.hypot(p.x - a.x, p.y - a.y) || 1;
        const outL = Math.hypot(b.x - p.x, b.y - p.y) || 1;
        const cc = Math.min(c, inL / 2, outL / 2);
        res.push({ x: p.x - ((p.x - a.x) / inL) * cc, y: p.y - ((p.y - a.y) / inL) * cc });
        res.push({ x: p.x + ((b.x - p.x) / outL) * cc, y: p.y + ((b.y - p.y) / outL) * cc });
      }
      res.push(wp[wp.length - 1]);
      return res;
    };
    const trace = (wp: Pt[], w: number) => {
      const s2: Sink = { segs: [], comps: [] };
      const pts = chamfer(wp, Math.min(12, pitch * 0.45));
      for (let i = 0; i < pts.length - 1; i++) {
        s2.segs.push({ ax: pts[i].x, ay: pts[i].y, bx: pts[i + 1].x, by: pts[i + 1].y, w, kind: "root" });
      }
      flushSink(s2);
    };
    const snap = (v: number) => x0 + Math.round((v - x0) / pitch) * pitch;
    const cx0 = trunkAt(collarY);

    // the main survivor: across the field, then STRAIGHT down the very side
    // into the collar — no low elbow (the side line IS the trunk's x already)
    const y1 = yTop + bandH * 0.55;
    const mx = clamp(snap(x0 + span * 0.52), x0, cx0 - pitch * 2);
    trace([
      { x: mx, y: yTop },
      { x: mx, y: y1 },
      { x: cx0, y: y1 },
      { x: cx0, y: collarY },
    ], trunkW * 0.85);
    mkComp(mx, yTop + pitch, yTop + pitch, "via", COL.copper, 2.9);
    mkComp(mx, y1, y1, "via", COL.copper, 2.5);
    mkComp(cx0, collarY * 0.8, collarY * 0.8, "via", undefined, 2.4);

    // a second net over the right shoulder, merging with a single 45° tap
    if (W - edge - cx0 > pitch * 1.2) {
      const bx = clamp(snap(Math.min(W - edge - pitch * 0.5, trunkX + (W - trunkX) * 0.5)), cx0 + pitch * 0.75, W - edge);
      const yb = Math.min(yMax + pitch * 1.5, collarY * 0.8 - pitch);
      trace([
        { x: bx, y: yTop },
        { x: bx, y: yb },
        { x: cx0, y: yb + (bx - cx0) },
      ], 2.1);
      mkComp(cx0, yb + (bx - cx0), yb + (bx - cx0), "junction", COL.copper, 2.6);
      mkComp(bx, yTop + pitch * 0.5, yTop, "via", COL.copperDeep, 2.2);
    }

    // on wide screens, a long feeder crosses the field from the far left
    if (W > 980) {
      const y3 = yTop + bandH * 0.85;
      const lx = snap(x0 + pitch);
      trace([
        { x: lx, y: yTop + pitch },
        { x: lx, y: y3 },
        { x: cx0 - pitch, y: y3 },
        { x: cx0, y: y3 + pitch },
      ], 1.6);
      mkComp(lx, yTop + pitch, yTop + pitch, "via", COL.copperDeep, 2.3);
      mkComp(cx0, y3 + pitch, y3 + pitch, "junction", COL.copper, 2.4);
    }

    // solder joint where the surviving trace becomes the trunk
    mkComp(cx0, collarY, collarY, "junction", COL.amberHex);
  }

  // ---- TRUNK: one slender stem down the right side --------------------------
  {
    const step = 24;
    const pts: Pt[] = [];
    for (let y = collarY; y < tipY; y += step) pts.push({ x: trunkAt(y), y });
    pts.push({ x: trunkAt(tipY), y: tipY });
    for (let i = 0; i < pts.length - 1; i++) {
      const t = i / (pts.length - 2 || 1);
      const w = 1.0 + (trunkW - 1.0) * Math.pow(1 - t, 1.15);
      out.paths.push({
        d: `M${rr(pts[i].x)} ${rr(pts[i].y)} L${rr(pts[i + 1].x)} ${rr(pts[i + 1].y)}`,
        w, len: Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y),
        ry: pts[i].y, kind: "trunk",
      });
    }
    // quiet junction dots + the odd pad punctuating the stem (static, no blink)
    for (let y = collarY + 170; y < tipY - 80; y += 300 + rnd() * 160) {
      mkComp(trunkAt(y), y, y, rnd() < 0.6 ? "junction" : "via", rnd() < 0.72 ? COL.greenHex : COL.amberHex);
      if (rnd() < 0.3) out.pads.push({ cx: trunkAt(y + 60), cy: y + 60, ry: y + 60, size: 2.2 });
    }
  }

  // ---- LEFT LIMBS: one branch per featured card, leaf on the corner ---------
  const sorted = [...targets].sort((a, b) => a.y - b.y);
  const branchOys: number[] = [];
  sorted.forEach((tg, i) => {
    const sink: Sink = { segs: [], comps: [] };
    const leafX = tg.x + 9, leafY = tg.y - 8;
    const reach = Math.max(24, trunkX - leafX);
    const oy = leafY - clamp(reach * 0.5, 30, 64) - (i % 2) * 10;
    branchOys.push(oy);
    const O = { x: trunkAt(oy), y: oy };
    // leaves the trunk steeply, flattens into the corner (flipped-tree limb)
    const pts = quadPts(O, { x: O.x * 0.72 + leafX * 0.28, y: leafY + 2 }, { x: leafX + 2, y: leafY }, 12);
    pushTaper(sink, pts, clamp(reach * 0.02 + 2.0, 2.2, 3.0), 0.85, 1.35, 0.1, "branch");
    flushSink(sink);
    // a couple of small leaves riding the limb
    out.leaves.push(mkLeaf(pts[5].x + jit(6), pts[5].y - 4 - rnd() * 4, oy));
    if (i % 2 === 0) out.leaves.push(mkLeaf(pts[8].x + jit(5), pts[8].y + 4 + rnd() * 3, oy));
    if (reach > 160) out.leaves.push(mkLeaf(pts[3].x, pts[3].y - 3 - rnd() * 4, oy));
    // solder joint at the trunk, pulsing junction under the corner leaf
    mkComp(O.x, O.y, oy, "junction", COL.greenHex);
    mkComp(leafX, leafY, oy, "junction", COL.greenHex);
    // the corner leaf itself — bigger, glowing, gust-reactive
    out.leaves.push({
      cx: leafX, cy: leafY, ry: oy, style: "blade",
      col: i % 3 === 1 ? COL.amberHex : COL.greenHex,
      s: 5.8 + rnd() * 0.8, rot: -28 + jit(12), accent: true,
      sway: 3 + rnd() * 3, dur: 3.4 + rnd() * 2.6, del: 0.3 + rnd() * 2,
    });
  });

  // ---- RIGHT LIMBS: short stubs toward the page edge -------------------------
  const room = W - edge - trunkX;
  if (room >= 12) {
    const stubYs: number[] = [];
    if (branchOys.length) {
      stubYs.push(branchOys[0] - 64 - rnd() * 30);
      for (let i = 0; i < branchOys.length - 1; i++) stubYs.push((branchOys[i] + branchOys[i + 1]) / 2 + jit(24));
      // (below the last card the crown block takes over — limbs on both sides)
    } else {
      for (let y = collarY + 160; y < tipY - 90; y += 190 + rnd() * 90) stubYs.push(y);
    }
    stubYs.forEach((sy0, k) => {
      const sy = clamp(sy0, collarY + 60, tipY - 50);
      const sink: Sink = { segs: [], comps: [] };
      const O = { x: trunkAt(sy), y: sy };
      const L = clamp(room * (0.5 + rnd() * 0.3), 10, 48);
      const E = { x: Math.min(W - edge, O.x + L), y: sy + 12 + rnd() * 14 };
      const pts = quadPts(O, { x: O.x + L * 0.45, y: E.y + 3 }, E, 7);
      pushTaper(sink, pts, 1.7, 0.5, 1.35, 0.12, "branch");
      flushSink(sink);
      out.leaves.push(mkLeaf(E.x + 2, E.y + jit(3), sy, undefined, 3 + rnd() * 1.2));
      if (k % 2 === 0) {
        out.leaves.push(mkLeaf(pts[4].x + 1, pts[4].y - 4, sy));
        mkComp(O.x, O.y, sy, "junction", COL.greenHex);
      }
    });
  }

  // ---- below the cards the sapling fills out: a leafy crown on both sides ---
  // (the flipped tree's top). Limbs alternate sides, longer on the open left,
  // shrinking toward the leader tip so the silhouette tapers to a point.
  {
    const crownTop = lowestCard + 70;
    const crownBot = tipY - 40;
    if (crownBot - crownTop > 80) {
      // leaves come in little fanned clusters, like the reference sapling
      const tuft = (x: number, y: number, ry: number, n: number, s0: number) => {
        for (let k = 0; k < n; k++) {
          out.leaves.push(mkLeaf(x + jit(10), y + jit(8), ry, undefined, s0 + rnd() * 1.4, 0.62 + rnd() * 0.28));
        }
      };
      // only a handful of limbs, with irregular sides and lengths — the mass
      // lives in the foliage, so the silhouette stays loose, not a tiered cone
      let side = rnd() < 0.5 ? -1 : 1;
      for (let y = crownTop + rnd() * 40; y < crownBot; y += 92 + rnd() * 48) {
        const prog = (y - crownTop) / (crownBot - crownTop);
        const sink: Sink = { segs: [], comps: [] };
        const O = { x: trunkAt(y), y };
        const maxL = side < 0
          ? clamp(W * 0.18, 100, 300)
          : Math.max(12, W - edge - O.x);
        const L = Math.max(16, maxL * (0.35 + rnd() * 0.55) * (1 - prog * 0.35));
        const E = { x: clamp(O.x + side * L, edge, W - edge), y: y + 16 + rnd() * 22 + L * 0.12 };
        const pts = quadPts(O, { x: O.x + side * L * 0.42, y: E.y + 4 }, E, 9);
        pushTaper(sink, pts, clamp(1.6 + L * 0.01, 1.8, 2.6), 0.55, 1.35, 0.12, "branch");
        flushSink(sink);
        // generous leaf clusters along the limb and at its tip
        tuft(pts[3].x, pts[3].y - 3, y, 3, 3.2);
        tuft(pts[5].x, pts[5].y - 4, y, 3, 3.4);
        tuft(pts[7].x, pts[7].y + 3, y, 3, 3.3);
        tuft(E.x + side * 4, E.y, y, 4, 3.6);
        if (rnd() < 0.3) mkComp(O.x, O.y, y, "junction", COL.greenHex);
        side = rnd() < 0.72 ? -side : side;            // mostly alternate, sometimes repeat
      }
      // leaf sprigs hugging the stem between limbs — foliage without branches
      for (let y = crownTop + 26; y < tipY - 30; y += 44 + rnd() * 34) {
        const sgn = rnd() < 0.5 ? -1 : 1;
        tuft(trunkAt(y) + sgn * (5 + rnd() * 9), y + jit(6), y, 2 + (rnd() < 0.5 ? 1 : 0), 3.1);
      }
    }
  }

  // ---- the leader tip: a small crown of leaves in the open ground -----------
  {
    const tp = { x: trunkAt(tipY), y: tipY };
    const crown: [number, number, number, string, number][] = [
      [-9, 4, -40, COL.greenHex, 4.4],
      [7, 9, 26, COL.greenHex, 4.2],
      [-3, 15, -70, COL.greenHex, 4.5],
      [10, -5, 50, COL.amberHex, 3.8],
      [-14, -3, -12, COL.greenHex, 3.5],
      [16, 3, 68, COL.greenHex, 3.9],
      [-8, 24, -28, COL.greenHex, 4.1],
    ];
    for (const [dx, dy, rot, col, s] of crown) {
      const lf = mkLeaf(tp.x + dx, tp.y + dy, tipY, col, s, 0.82);
      lf.rot = rot;
      out.leaves.push(lf);
    }
    out.leaves.push(mkLeaf(trunkAt(tipY - 58) + 8, tipY - 56, tipY - 58, COL.greenHex, 3.6, 0.7));
    out.leaves.push(mkLeaf(trunkAt(tipY - 120) - 8, tipY - 118, tipY - 120, COL.orangeHex, 3.2, 0.7));
    mkComp(tp.x, tp.y, tipY, "via", COL.greenHex);
  }

  // ---- a handful of leaves drifting off the tree into the open ground -------
  const driftTop = collarY + 220;
  const nDrift = Math.round(clamp((W * (H - driftTop)) / 140000, 8, 22));
  const warmCol = () => {
    const r = rnd();
    return r < 0.42 ? COL.amberHex : r < 0.74 ? COL.orangeHex : COL.greenHex;
  };
  for (let i = 0; i < nDrift; i++) {
    const y = lerp(driftTop, H - 30, Math.pow(rnd(), 0.7));
    const x = clamp(lerp(Math.max(edge, trunkX - W * 0.32), W - edge, rnd()), edge, W - edge);
    out.leaves.push(mkLeaf(x, y, y, warmCol(), 2.4 + rnd()));
  }
  // extra leaves settling around the crown below the cards, clustered near the
  // leader so they read as its foliage rather than confetti
  const crownDrift = Math.round(clamp(W / 55, 14, 30));
  for (let i = 0; i < crownDrift; i++) {
    const y = lerp(lowestCard + 60, Math.min(tipY + 90, H - 30), rnd());
    const spread = clamp(W * 0.22, 130, 340) * (0.3 + rnd() * 0.7);
    const x = clamp(trunkAt(Math.min(y, tipY)) + (rnd() * 2 - 1.15) * spread, edge, W - edge);
    out.leaves.push(mkLeaf(x, y, y, warmCol(), 2.8 + rnd() * 1.5));
  }

  return out;
}

function LeafNode({ lf }: { lf: Leaf }) {
  const x = rr(lf.cx), y = rr(lf.cy), s = lf.s;
  // PCB nodes: a plated via-ring or a solid solder junction — quiet, static
  // hardware (no blinking cores).
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
  // blade leaf: a single cheap almond (one element each). Rotation + drift ride
  // on CSS custom properties; the wrapping <g> carries the live gust translate
  // (see the pointer effect below) so it stacks on the CSS flutter.
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
        fillOpacity={lf.op ?? (lf.accent ? 0.85 : 0.5)}
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

export default function CircuitVines() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0, heroH: 0 });
  const [targets, setTargets] = useState<Anchor[]>([]);

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

  // Measure the featured cards' top-right corners (shared coordinate space):
  // each corner becomes a branch target with a leaf pinned on it.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    let raf = 0;
    const measure = () => {
      const wrapRect = node.getBoundingClientRect();
      const next = Array.from(document.querySelectorAll<HTMLElement>("[data-grove-card]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.right - wrapRect.left, y: r.top - wrapRect.top };
      });
      setTargets((prev) =>
        prev.length === next.length &&
        prev.every((p, i) => Math.abs(p.x - next[i].x) < 2 && Math.abs(p.y - next[i].y) < 2)
          ? prev
          : next,
      );
    };
    const queue = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    queue();
    const ro = new ResizeObserver(queue);
    ro.observe(document.documentElement);
    document.querySelectorAll<HTMLElement>("[data-grove-card]").forEach((el) => ro.observe(el));
    window.addEventListener("resize", queue, { passive: true });
    // catch late reflows (web fonts, media metadata) that shift the cards
    const timers = [250, 900, 1800].map((t) => window.setTimeout(queue, t));
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", queue);
      timers.forEach((id) => window.clearTimeout(id));
      cancelAnimationFrame(raf);
    };
  }, []);

  const targetKey = targets.map((t) => `${Math.round(t.x)},${Math.round(t.y)}`).join(";");
  const scene = useMemo(
    () => (dims.w > 0 && dims.h > 0 ? generate(dims.w, dims.h, dims.heroH || dims.h * 0.32, targets) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dims.w, dims.h, dims.heroH, targetKey],
  );

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

          {/* bold mains / trunk / limbs */}
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
