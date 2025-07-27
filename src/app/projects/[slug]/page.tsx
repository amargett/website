import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category,
  shortDescription,
  fullDescription,
  mainMedia,
  gallery,
  year,
  institution,
  publication,
  courseCode,
  role,
  organization,
  links,
  technologies
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

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  let project = null;
  
  try {
    project = await client.fetch(projectQuery, { slug: params.slug });
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">
          <p>Project not found or error loading content.</p>
        </div>
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
      case 'activities': return 'Activities';
      default: return category;
    }
  };

  const getCategorySpecificInfo = () => {
    switch (project.category) {
      case 'research':
        return project.publication && (
          <div className="text-sm text-gray-500 mb-2">
            <strong>Publication:</strong> {project.publication}
          </div>
        );
      case 'coursework':
        return project.courseCode && (
          <div className="text-sm text-gray-500 mb-2">
            <strong>Course:</strong> {project.courseCode}
          </div>
        );
      case 'industry':
        return project.role && (
          <div className="text-sm text-gray-500 mb-2">
            <strong>Role:</strong> {project.role}
          </div>
        );
      case 'activities':
        return project.organization && (
          <div className="text-sm text-gray-500 mb-2">
            <strong>Organization:</strong> {project.organization}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link href={`/${project.category}`} className="text-blue-600 hover:underline">
          ← Back to {getCategoryDisplayName(project.category)}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {getCategoryDisplayName(project.category)}
          </span>
          {project.year && (
            <span className="text-gray-500">{project.year}</span>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        {project.institution && (
          <p className="text-lg text-gray-600 mb-2">{project.institution}</p>
        )}
        {getCategorySpecificInfo()}
        <p className="text-gray-700 text-lg">{project.shortDescription}</p>
      </header>

      {/* Main Media */}
      {project.mainMedia && (
        <div className="mb-8">
          {project.mainMedia.type === 'image' && project.mainMedia.image ? (
            <Image
              src={urlFor(project.mainMedia.image)?.url() || ''}
              alt={project.mainMedia.alt}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : project.mainMedia.type === 'video' && project.mainMedia.videoUrl ? (
            <video
              src={project.mainMedia.videoUrl}
              controls
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : null}
        </div>
      )}

      {/* Full Description */}
      {project.fullDescription && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <div className="prose max-w-none">
            <PortableText value={project.fullDescription} />
          </div>
        </section>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      {project.links && project.links.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            {project.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                {item.image && (
                  <Image
                    src={urlFor(item.image)?.url() || ''}
                    alt={item.caption || `Gallery image ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                {item.caption && (
                  <p className="text-sm text-gray-600 text-center">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
} 