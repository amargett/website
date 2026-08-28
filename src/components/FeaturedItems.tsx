"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { mediaUrls } from "../sanity/lib/media";

// Featured projects as ballooned items on the sheet, like the parts of an
// assembly drawing. Hovering (or focusing) a card fades the project's video
// in over it; projects without video fall back to their main image. Touch
// devices get no preview — tapping the card opens the project page.

const humanize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

function ItemCard({ project, index }: { project: any; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { imageUrl, videoUrl } = mediaUrls(project);

  const play = () => {
    videoRef.current?.play().catch(() => {});
  };
  const pause = () => {
    videoRef.current?.pause();
  };

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className="ps-card"
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
