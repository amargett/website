"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "./HoverVideo";
import { urlFor } from "../sanity/lib/image";
import { projectId, dataset } from "../sanity/env";

// Masonry via CSS grid: the grid has tiny auto-rows, and each cell's
// `grid-row-end: span N` is set from its measured height so cards pack by
// height with no fixed rows. `wide` projects also span two columns.
const ROW = 8; // px — base auto-row unit
const GAP = 18; // px — vertical gap folded into each card's span

const humanize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

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

export default function FeaturedMasonry({ projects }: { projects: any[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const layout = useCallback(() => {
    const container = ref.current;
    if (!container) return;
    (Array.from(container.children) as HTMLElement[]).forEach((cell) => {
      const card = cell.firstElementChild as HTMLElement | null;
      if (!card) return;
      const h = card.getBoundingClientRect().height;
      cell.style.gridRowEnd = `span ${Math.max(1, Math.ceil((h + GAP) / ROW))}`;
    });
  }, []);

  useEffect(() => {
    layout();

    const container = ref.current;
    const media = container
      ? Array.from(container.querySelectorAll("img, video"))
      : [];
    media.forEach((m) => {
      m.addEventListener("load", layout);
      m.addEventListener("loadeddata", layout);
    });
    window.addEventListener("resize", layout);

    // Catch late reflows (web fonts, video metadata) that change heights.
    const timers = [200, 800, 1600].map((t) => window.setTimeout(layout, t));

    return () => {
      media.forEach((m) => {
        m.removeEventListener("load", layout);
        m.removeEventListener("loadeddata", layout);
      });
      window.removeEventListener("resize", layout);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [layout, projects]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 lg:gap-x-5"
      style={{ gridAutoRows: `${ROW}px` }}
    >
      {projects.map((project: any, index: number) => {
        const wide = project.featuredLayout === "wide";
        const { imageUrl, videoUrl } = mediaUrls(project);
        return (
          <div
            key={project._id}
            className={wide ? "sm:col-span-2" : ""}
            // Placeholder span before measurement, to avoid a collapsed flash.
            style={{ gridRowEnd: "span 45" }}
          >
            <Link
              href={`/projects/${project.slug.current}`}
              className="tg-card group flex flex-col p-3 sm:p-4"
            >
              {/* file-path style header */}
              <div className="flex items-center gap-2 mb-2.5 text-xs text-[var(--tg-dim)]">
                <span className="text-[var(--tg-green)]">›</span>
                <span className="truncate">~/featured/{project.slug.current}</span>
              </div>

              {/* media keeps its natural aspect ratio — no cropping */}
              <div className="mb-2.5">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.mainMedia.alt || project.title}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg border border-[var(--tg-border)]"
                    priority={index === 0}
                  />
                ) : videoUrl ? (
                  <HoverVideo
                    src={videoUrl}
                    className="w-full h-auto rounded-lg border border-[var(--tg-border)]"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg border border-[var(--tg-border)] flex items-center justify-center bg-[rgba(236,224,203,0.02)]">
                    <span className="text-[var(--tg-dim)] text-xs">// no media</span>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <h3 className="text-sm sm:text-base font-semibold mb-1.5 text-[var(--tg-fg)] group-hover:text-[var(--tg-green)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--tg-dim)] mb-2.5 text-xs sm:text-sm leading-relaxed">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {project.category && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium border border-[var(--tg-amber)]/50 text-[var(--tg-amber)]">
                      {humanize(project.category)}
                    </span>
                  )}
                  {project.technicalSkills?.map((skill: string, i: number) => (
                    <span key={i} className="tg-chip px-1.5 py-0.5 rounded-md text-xs">
                      {humanize(skill)}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
