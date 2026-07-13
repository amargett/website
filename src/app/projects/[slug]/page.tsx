import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import { urlForFile } from "../../../sanity/lib/file";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "../../../components/HoverVideo";
import { notFound } from "next/navigation";
import { projectId, dataset } from "../../../sanity/env";

// Custom components for PortableText
const ProjectImage = ({ value }: { value: any }) => {
  const imageUrl = urlFor(value.image)?.url();
  if (!imageUrl) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  };

  const aspectRatioClasses = {
    auto: 'h-auto',
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[9/16]',
    wide: 'aspect-[21/9]'
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill'
  };

  return (
    <div className={`my-8 mx-auto ${sizeClasses[value.size as keyof typeof sizeClasses] || sizeClasses.medium}`}>
      <div className={`${aspectRatioClasses[value.aspectRatio as keyof typeof aspectRatioClasses] || aspectRatioClasses.auto}`}>
        <Image
          src={imageUrl}
          alt={value.alt}
          width={800}
          height={600}
          className={`w-full rounded-lg shadow-lg bg-white ${objectFitClasses[value.objectFit as keyof typeof objectFitClasses] || objectFitClasses.cover}`}
        />
      </div>
      {value.caption && (
        <p className="text-sm text-[var(--tg-dim)] text-center mt-2 italic">{value.caption}</p>
      )}
    </div>
  );
};

const ProjectVideo = ({ value }: { value: any }) => {
  let videoUrl = null;
  
  if (value.videoFile?.asset?.url) {
    videoUrl = value.videoFile.asset.url;
  } else if (value.videoFile?.asset?._ref) {
    const assetRef = value.videoFile.asset._ref;
    const fileId = assetRef.replace('file-', '').split('-').slice(0, -1).join('-');
    videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
  } else if (value.videoUrl) {
    videoUrl = value.videoUrl;
  }

  if (!videoUrl) return null;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  };

  const aspectRatioClasses = {
    auto: 'h-auto',
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[9/16]',
    wide: 'aspect-[21/9]'
  };

  return (
    <div className={`my-8 mx-auto ${sizeClasses[value.size as keyof typeof sizeClasses] || sizeClasses.medium}`}>
      <div className={`${aspectRatioClasses[value.aspectRatio as keyof typeof aspectRatioClasses] || aspectRatioClasses.auto} relative`}>
        <HoverVideo
          src={videoUrl}
          className="w-full h-full absolute inset-0 rounded-lg shadow-lg object-cover"
        />
      </div>
      {value.caption && (
        <p className="text-sm text-[var(--tg-dim)] text-center mt-2 italic">{value.caption}</p>
      )}
    </div>
  );
};

const portableTextComponents = {
  types: {
    projectImage: ProjectImage,
    projectVideo: ProjectVideo,
  },
};

export const dynamic = "force-dynamic";

const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category,
  shortDescription,
  content,
  mainMedia,
  showMainMedia,
  technicalSkills,
  year,
  publication,
  role,
  organization
}`;

const allProjectsQuery = `*[_type == "project"]{
  _id,
  title,
  slug,
  category
}`;

export async function generateStaticParams() {
  const projects = await client.fetch(allProjectsQuery);
  return projects.map((project: any) => ({
    slug: project.slug.current,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project = null;
  
  try {
    project = await client.fetch(projectQuery, { slug });
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    // Return a working page even if Sanity fails
    return (
      <main className="tg-mono max-w-4xl mx-auto px-4 py-16 relative z-10">
        <p className="text-[var(--tg-amber)]">$ cat project.md</p>
        <p className="text-[var(--tg-dim)] text-sm mt-2">// content is loading… if this persists, check the Sanity configuration.</p>
      </main>
    );
  }

  if (!project) {
    notFound();
  }

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'research': return 'Research';
      case 'industry': return 'Industry';
      case 'coursework': return 'Coursework';
      case 'extracurricular': return 'Extracurricular';
      default: return category;
    }
  };

  const getCategorySpecificInfo = () => {
    switch (project.category) {
      case 'research':
        return project.publication && (
          <div className="tg-mono text-sm text-[var(--tg-dim)] mb-2">
            <strong>Publication:</strong> {project.publication}
          </div>
        );
      case 'coursework':
        return project.courseCode && (
          <div className="tg-mono text-sm text-[var(--tg-dim)] mb-2">
            <strong>Course:</strong> {project.courseCode}
          </div>
        );
      case 'industry':
        return project.role && (
          <div className="tg-mono text-sm text-[var(--tg-dim)] mb-2">
            <strong>Role:</strong> {project.role}
          </div>
        );
      case 'extracurricular':
        return project.organization && (
          <div className="tg-mono text-sm text-[var(--tg-dim)] mb-2">
            <strong>Organization:</strong> {project.organization}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
      {/* Back link */}
      <Link
        href="/projects"
        className="tg-mono inline-block text-sm text-[var(--tg-green)] hover:text-[var(--tg-amber)] transition-colors mb-6"
      >
        ← cd ~/projects
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="tg-mono flex items-center gap-4 mb-4 text-sm">
          <span className="px-2.5 py-1 rounded-md border border-[var(--tg-amber)]/50 text-[var(--tg-amber)] font-medium">
            {getCategoryDisplayName(project.category)}
          </span>
          {project.year && (
            <span className="text-[var(--tg-dim)]">{project.year}</span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--tg-fg)]">{project.title}</h1>
        {getCategorySpecificInfo()}
        <p className="text-[var(--tg-dim)] text-lg mb-4 leading-relaxed">{project.shortDescription}</p>
        {project.technicalSkills && project.technicalSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technicalSkills.map((skill: string, skillIndex: number) => (
              <span
                key={skillIndex}
                className="tg-chip tg-mono inline-block px-3 py-1 rounded-md text-sm"
              >
                {skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Media */}
      {project.showMainMedia && project.mainMedia && (
        <div className="mb-8">
          {(() => {
            let videoUrl = null;
            
            // Try to get the video URL from the asset directly
            if (project.mainMedia.videoFile?.asset?.url) {
              videoUrl = project.mainMedia.videoFile.asset.url;
            } else if (project.mainMedia.videoFile?.asset?._ref) {
              // Extract the file ID from the asset reference
              const assetRef = project.mainMedia.videoFile.asset._ref;
              const fileId = assetRef.replace('file-', '').split('-').slice(0, -1).join('-');
              videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
            } else if (project.mainMedia.videoUrl) {
              videoUrl = project.mainMedia.videoUrl;
            }
            
            // Debug logging for video issues
            if (project.mainMedia?.type === 'video') {
              // Video URL construction is handled in the component
            }
            
            if (project.mainMedia.type === 'image' && project.mainMedia.image) {
              return (
                <Image
                  src={urlFor(project.mainMedia.image)?.url() || ''}
                  alt={project.mainMedia.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg bg-white"
                />
              );
            } else if (project.mainMedia.type === 'video' && videoUrl) {
              return (
                <HoverVideo
                  src={videoUrl}
                  className="w-full h-auto max-h-96 rounded-lg shadow-lg"
                />
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Project Content */}
      {project.content && project.content.length > 0 && (
        <section className="mb-8">
          <div className="tg-prose max-w-none">
            <PortableText value={project.content} components={portableTextComponents} />
          </div>
        </section>
      )}






    </main>
  );
} 