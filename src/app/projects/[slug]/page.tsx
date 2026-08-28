import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "../../../components/HoverVideo";
import { notFound } from "next/navigation";
import { videoUrlFor } from "../../../sanity/lib/media";

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
          className={`w-full border border-[var(--line)] bg-white ${objectFitClasses[value.objectFit as keyof typeof objectFitClasses] || objectFitClasses.cover}`}
        />
      </div>
      {value.caption && (
        <p className="text-sm text-[var(--dim)] text-center mt-2 italic">{value.caption}</p>
      )}
    </div>
  );
};

const ProjectVideo = ({ value }: { value: any }) => {
  const videoUrl = videoUrlFor(value);

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
          className="w-full h-full absolute inset-0 border border-[var(--line)] object-cover"
        />
      </div>
      {value.caption && (
        <p className="text-sm text-[var(--dim)] text-center mt-2 italic">{value.caption}</p>
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
    return (
      <main>
        <p className="ps-label">
          Content is loading&hellip; if this persists, check the Sanity configuration.
        </p>
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
    const info = (() => {
      switch (project.category) {
        case 'research': return project.publication && ['Publication', project.publication];
        case 'coursework': return project.courseCode && ['Course', project.courseCode];
        case 'industry': return project.role && ['Role', project.role];
        case 'extracurricular': return project.organization && ['Organization', project.organization];
        default: return null;
      }
    })();
    if (!info) return null;
    return (
      <div className="ps-card-meta !mt-0 mb-3">
        {info[0]}: <b>{info[1]}</b>
      </div>
    );
  };

  return (
    <main className="max-w-4xl">
      {/* Back link */}
      <Link href="/projects" className="ps-index-link inline-block mb-8">
        &larr; Project index
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="ps-chip">{getCategoryDisplayName(project.category)}</span>
          {project.year && <span className="ps-label">{project.year}</span>}
        </div>
        <h1 className="ps-h1 mb-4">{project.title}</h1>
        {getCategorySpecificInfo()}
        <p className="ps-card-desc !text-base mb-4">{project.shortDescription}</p>
        {project.technicalSkills && project.technicalSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technicalSkills.map((skill: string, skillIndex: number) => (
              <span key={skillIndex} className="ps-chip">
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
            const videoUrl = videoUrlFor(project.mainMedia);

            if (project.mainMedia.type === 'image' && project.mainMedia.image) {
              return (
                <Image
                  src={urlFor(project.mainMedia.image)?.url() || ''}
                  alt={project.mainMedia.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-96 object-contain border border-[var(--line)] bg-white"
                />
              );
            } else if (project.mainMedia.type === 'video' && videoUrl) {
              return (
                <HoverVideo
                  src={videoUrl}
                  className="w-full h-auto max-h-96 border border-[var(--line)]"
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
          <div className="ps-prose max-w-none">
            <PortableText value={project.content} components={portableTextComponents} />
          </div>
        </section>
      )}
    </main>
  );
}
