"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mediaUrls } from "../sanity/lib/media";

// Featured projects as ballooned items on the sheet, like the parts of an
// assembly drawing. Hovering (or focusing) a card fades the project's video
// in over it; projects without video fall back to their main image. On touch
// devices the overlay engages while the card sits in the middle band of the
// viewport, so previews switch on and off as you scroll.

const humanize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

function ItemCard({ project, index }: { project: any; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const { imageUrl, videoUrl } = mediaUrls(project);

  const play = () => {
    videoRef.current?.play().catch(() => {});
  };
  const pause = () => {
    videoRef.current?.pause();
  };

  // Without hover, the card counts as "active" while it overlaps the middle
  // band of the viewport (the rootMargin trims 40% off the top and bottom).
  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(hover: hover)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "-40% 0px -40% 0px" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) video.play().catch(() => {});
    else video.pause();
  }, [active]);

  return (
    <Link
      ref={cardRef}
      href={`/projects/${project.slug.current}`}
      className={`ps-card${active ? " is-active" : ""}`}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      <span className="ps-card-head">
        <span className="ps-balloon">{index + 1}</span>
        <span className="ps-card-title">{project.title}</span>
      </span>
      {project.shortDescription && (
        <span className="ps-card-desc">{project.shortDescription}</span>
      )}
      <span className="ps-card-meta">
        {project.category && <b>{humanize(project.category)}</b>}
        {project.year && <> &middot; {project.year}</>}
        {project.institution && <> &middot; {project.institution}</>}
      </span>
      {(videoUrl || imageUrl) && (
        <span className="ps-preview" aria-hidden="true">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={imageUrl!}
              alt=""
              fill
              sizes="(max-width: 640px) 92vw, 320px"
              className="object-cover"
            />
          )}
        </span>
      )}
    </Link>
  );
}

export default function FeaturedItems({ projects }: { projects: any[] }) {
  return (
    <div className="ps-figures">
      {projects.map((project: any, index: number) => (
        <ItemCard key={project._id} project={project} index={index} />
      ))}
    </div>
  );
}
