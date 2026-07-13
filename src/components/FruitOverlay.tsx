"use client";

// Desktop fruit-cards, positioned on the tree's real branch-tip anchors (shared
// coordinate space with CircuitVines), so each card hangs off an actual branch.
// Hovering a card floats out the full project card beside it.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "./HoverVideo";
import { urlFor } from "../sanity/lib/image";
import { projectId, dataset } from "../sanity/env";

type Anchor = { x: number; y: number };

const humanize = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

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

export default function FruitOverlay({ projects, anchors }: { projects: any[]; anchors: Anchor[] }) {
  const [active, setActive] = useState<number | null>(null);
  if (!anchors.length) return null;
  const xs = anchors.map((a) => a.x);
  const mid = (Math.min(...xs) + Math.max(...xs)) / 2;

  return (
    <div className="tg-fruit-overlay hidden lg:block" aria-label="Featured work">
      {projects.map((p, i) => {
        const a = anchors[i];
        if (!a) return null;
        const side: "left" | "right" = a.x > mid ? "left" : "right";
        return (
          <div
            key={p._id}
            className={`tg-orchard-node${active === i ? " is-active" : ""}`}
            style={{ left: `${a.x}px`, top: `${a.y}px` }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((v) => (v === i ? null : v))}
          >
            <div className="tg-sprout" style={{ ["--pd" as string]: `${(1.8 + i * 0.12).toFixed(2)}s` }}>
              <Link
                href={`/projects/${p.slug.current}`}
                className="tg-fruit-card"
                onFocus={() => setActive(i)}
                onBlur={() => setActive((v) => (v === i ? null : v))}
              >
                <span className="tg-fruit-bar" aria-hidden="true" />
                <span className="tg-fruit-name">{p.title}</span>
                <span className="tg-fruit-line" aria-hidden="true" />
              </Link>
            </div>
            {active === i && <Popover project={p} side={side} />}
          </div>
        );
      })}
    </div>
  );
}
