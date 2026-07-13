"use client";

// Desktop "orchard" view of the featured work: each project is a small name
// pill hanging at the end of a branch that fans down from the trunk. Hovering
// a pill floats the full project card out beside it. Small screens use the
// FeaturedMasonry grid instead (no hover on touch).

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "./HoverVideo";
import { urlFor } from "../sanity/lib/image";
import { projectId, dataset } from "../sanity/env";

const humanize = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function mediaUrls(project: any) {
  const imageUrl =
    project.mainMedia?.type === "image" && project.mainMedia.image
      ? urlFor(project.mainMedia.image)?.url()
      : null;
  let videoUrl: string | null = null;
  if (project.mainMedia?.type === "video") {
    if (project.mainMedia.videoFile?.asset?.url) {
      videoUrl = project.mainMedia.videoFile.asset.url;
    } else if (project.mainMedia.videoFile?.asset?._ref) {
      const ref = project.mainMedia.videoFile.asset._ref;
      const fileId = ref.replace("file-", "").split("-").slice(0, -1).join("-");
      videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
    } else if (project.mainMedia.videoUrl) {
      videoUrl = project.mainMedia.videoUrl;
    }
  }
  return { imageUrl, videoUrl };
}

function Popover({ project, side }: { project: any; side: "left" | "right" }) {
  const { imageUrl, videoUrl } = mediaUrls(project);
  return (
    <div className={`tg-pop tg-pop-${side}`} role="group">
      <div className="tg-pop-inner tg-card">
        <div className="tg-pop-head">
          <span className="text-[var(--tg-green)]">›</span> ~/featured/{project.slug.current}
        </div>
        <div className="tg-pop-media bg-white">
          {imageUrl ? (
            <Image src={imageUrl} alt={project.mainMedia?.alt || project.title} fill sizes="320px" className="object-cover" />
          ) : videoUrl ? (
            <div className="absolute inset-0">
              <HoverVideo src={videoUrl} className="w-full h-full" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--tg-dim)] text-[11px]">// no preview</span>
            </div>
          )}
        </div>
        <h3 className="tg-pop-title">{project.title}</h3>
        {project.shortDescription && <p className="tg-pop-desc">{project.shortDescription}</p>}
        <div className="tg-pop-tags">
          {project.category && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-[var(--tg-amber)]/50 text-[var(--tg-amber)]">
              {humanize(project.category)}
            </span>
          )}
          {project.technicalSkills?.slice(0, 4).map((skill: string, i: number) => (
            <span key={i} className="tg-chip px-1.5 py-0.5 rounded-md text-[11px]">
              {humanize(skill)}
            </span>
          ))}
        </div>
        <span className="tg-pop-open">open ↗</span>
      </div>
    </div>
  );
}

export default function FeaturedOrchard({ projects }: { projects: any[] }) {
  const N = projects.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1100);
  const [active, setActive] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Like the example: fruit-cards spread ACROSS the width at varying depths,
  // hanging from branches that fan out from the trunk. Alternating depth keeps
  // them from colliding; a little jitter keeps it organic rather than gridded.
  const marginX = 64;
  const bandY = 132;
  const nodes = projects.map((p, i) => {
    const f = N === 1 ? 0.5 : i / (N - 1);
    const jx = Math.sin(i * 9.3) * 20;
    const jy = Math.cos(i * 5.7) * 20;
    const x = clamp(lerp(marginX, w - marginX, f) + jx, 64, w - 64);
    const y = bandY + (i % 2) * 108 + jy;
    return { p, x, y, row: i % 2 };
  });
  const maxY = nodes.reduce((m, n) => Math.max(m, n.y), 0);
  const height = maxY + 200;

  return (
    <div ref={wrapRef} className="tg-orchard" style={{ height }}>
      <svg className="tg-orchard-stems" width={w} height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden="true">
        {nodes.map((n, i) => {
          // short, vertical stem dropping the card off a branch tip — like the example
          const topY = n.y - 24;
          return (
            <path
              key={i}
              className="tg-orchard-stem"
              pathLength={1}
              style={{ ["--sd" as string]: `${(1.45 + n.row * 0.28).toFixed(2)}s` }}
              d={`M${n.x.toFixed(1)} ${topY.toFixed(1)} L${n.x.toFixed(1)} ${n.y.toFixed(1)}`}
            />
          );
        })}
      </svg>

      {nodes.map((n, i) => {
        const side: "left" | "right" = n.x > w * 0.58 ? "left" : "right";
        return (
          <div
            key={n.p._id}
            className={`tg-orchard-node${active === i ? " is-active" : ""}`}
            style={{ left: `${n.x}px`, top: `${n.y}px` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((a) => (a === i ? null : a))}
          >
            <div className="tg-sprout" style={{ ["--pd" as string]: `${(1.6 + n.row * 0.28).toFixed(2)}s` }}>
              <Link
                href={`/projects/${n.p.slug.current}`}
                className="tg-fruit-card"
                onFocus={() => setActive(i)}
                onBlur={() => setActive((a) => (a === i ? null : a))}
              >
                <span className="tg-fruit-bar" aria-hidden="true" />
                <span className="tg-fruit-name">{n.p.title}</span>
                <span className="tg-fruit-line" aria-hidden="true" />
              </Link>
            </div>
            {active === i && <Popover project={n.p} side={side} />}
          </div>
        );
      })}
    </div>
  );
}
