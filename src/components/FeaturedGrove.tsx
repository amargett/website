import Image from "next/image";
import Link from "next/link";
import HoverVideo from "./HoverVideo";
import { urlFor } from "../sanity/lib/image";
import { projectId, dataset } from "../sanity/env";

// The featured "grove": wide horizontal cards stacked down the page, one per
// project. Each card's top-right corner is a branch target for the sapling
// (CircuitVines measures the [data-grove-card] elements and pins a leaf on the
// corner), so the cards stay in normal document flow at every breakpoint.

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

export default function FeaturedGrove({ projects }: { projects: any[] }) {
  return (
    <div className="tg-grove">
      {projects.map((project: any, index: number) => {
        const { imageUrl, videoUrl } = mediaUrls(project);
        return (
          <Link
            key={project._id}
            href={`/projects/${project.slug.current}`}
            data-grove-card
            className="tg-card tg-row-card group"
          >
            <div className="tg-row-media">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={project.mainMedia?.alt || project.title}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 38vw, 360px"
                  className="object-cover"
                  priority={index === 0}
                />
              ) : videoUrl ? (
                <div className="absolute inset-0">
                  <HoverVideo src={videoUrl} className="w-full h-full" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--tg-dim)] text-[11px]">// no media</span>
                </div>
              )}
            </div>

            <div className="tg-row-body">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--tg-dim)]">
                <span className="text-[var(--tg-green)]">›</span>
                <span className="truncate">~/featured/{project.slug.current}</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--tg-fg)] group-hover:text-[var(--tg-green)] transition-colors leading-snug">
                {project.title}
              </h3>
              {project.shortDescription && (
                <p className="text-[var(--tg-dim)] text-[11px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {project.shortDescription}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                {project.category && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-[var(--tg-amber)]/50 text-[var(--tg-amber)]">
                    {humanize(project.category)}
                  </span>
                )}
                {project.technicalSkills?.slice(0, 5).map((skill: string, i: number) => (
                  <span key={i} className="tg-chip px-1.5 py-0.5 rounded-md text-[11px]">
                    {humanize(skill)}
                  </span>
                ))}
              </div>
              <span className="tg-row-open">open ↗</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
