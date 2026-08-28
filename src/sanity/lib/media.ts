import { urlFor } from "./image";
import { projectId, dataset } from "../env";

// A Sanity file asset _ref looks like "file-<id>-<ext>" — the real extension
// is the last segment, so use it (a hardcoded ".mp4" 404s for .mov uploads).
export function fileUrlFromRef(ref: string): string {
  const parts = ref.replace("file-", "").split("-");
  const ext = parts.pop();
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${parts.join("-")}.${ext}`;
}

export function videoUrlFor(media: any): string | null {
  if (!media) return null;
  if (media.videoFile?.asset?.url) return media.videoFile.asset.url;
  if (media.videoFile?.asset?._ref) return fileUrlFromRef(media.videoFile.asset._ref);
  if (media.videoUrl) return media.videoUrl;
  return null;
}

export function mediaUrls(project: any): {
  imageUrl: string | null;
  videoUrl: string | null;
} {
  const imageUrl =
    project.mainMedia?.type === "image" && project.mainMedia.image
      ? urlFor(project.mainMedia.image)?.url() || null
      : null;
  const videoUrl =
    project.mainMedia?.type === "video" ? videoUrlFor(project.mainMedia) : null;
  return { imageUrl, videoUrl };
}
