'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HoverVideo from './HoverVideo';
import { urlFor } from '../sanity/lib/image';
import { urlForFile } from '../sanity/lib/file';
import { projectId, dataset } from '../sanity/env';

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  mainMedia: any;
  category: string;
  technicalSkills?: string[];
  year: number;
  institution?: string;
  publication?: string;
  courseCode?: string;
  role?: string;
  organization?: string;
}

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!activeFilter) return projects;
    return projects.filter(project => project.category === activeFilter);
  }, [projects, activeFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(projects.map(project => project.category))];
    // Define the desired order
    const categoryOrder = ['coursework', 'industry', 'research', 'extracurricular'];
    return uniqueCategories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.toLowerCase());
      const bIndex = categoryOrder.indexOf(b.toLowerCase());
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [projects]);

  const humanize = (s: string) =>
    s.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
            activeFilter === null ? 'tg-btn tg-btn-active' : 'tg-btn'
          }`}
        >
          all
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              activeFilter === category ? 'tg-btn tg-btn-active' : 'tg-btn'
            }`}
          >
            {humanize(category)}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.length === 0 && (
          <p className="tg-mono text-[var(--tg-dim)] text-sm">// no projects found for this category.</p>
        )}
        {filteredProjects.map((project) => {
          const imageUrl = project.mainMedia?.type === 'image' && project.mainMedia.image 
            ? urlFor(project.mainMedia.image)?.url() 
            : null;
          
          // Try different approaches for video URL construction
          let videoUrl = null;
          if (project.mainMedia?.type === 'video') {
            if (project.mainMedia.videoFile?.asset?.url) {
              videoUrl = project.mainMedia.videoFile.asset.url;
            } else if (project.mainMedia.videoFile?.asset?._ref) {
              const assetRef = project.mainMedia.videoFile.asset._ref;
              // Extract the file ID from the asset reference
              const fileId = assetRef.replace('file-', '').split('-').slice(0, -1).join('-');
              videoUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.mp4`;
            } else if (project.mainMedia.videoUrl) {
              videoUrl = project.mainMedia.videoUrl;
            }
          }

          // Debug logging for video issues
          if (project.mainMedia?.type === 'video') {
            // Video URL construction is handled in the component
          }

          return (
            <Link 
              key={project._id} 
              href={`/projects/${project.slug.current}`}
              className="group"
            >
              <article className="tg-card flex flex-col sm:flex-row gap-6 p-5">
                <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.mainMedia.alt}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover rounded-lg border border-[var(--tg-border)] bg-white"
                    />
                  ) : videoUrl ? (
                    <HoverVideo
                      src={videoUrl}
                      className="w-full h-full object-cover rounded-lg border border-[var(--tg-border)]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg border border-[var(--tg-border)] flex items-center justify-center bg-[rgba(236,224,203,0.02)]">
                      <span className="tg-mono text-[var(--tg-dim)] text-sm">// no media</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-[var(--tg-fg)] group-hover:text-[var(--tg-green)] transition-colors">
                      {project.title}
                    </h3>
                    <span className="tg-mono px-2.5 py-1 rounded-md text-xs font-medium flex-shrink-0 border border-[var(--tg-amber)]/50 text-[var(--tg-amber)]">
                      {humanize(project.category)}
                    </span>
                  </div>
                  <p className="text-[var(--tg-dim)] mb-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                  {project.technicalSkills && project.technicalSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technicalSkills.map((skill: string, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="tg-chip tg-mono inline-block px-2 py-1 rounded-md text-xs"
                        >
                          {humanize(skill)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="tg-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--tg-dim)]">
                    {project.institution && (
                      <span className="text-[var(--tg-teal)]">{project.institution}</span>
                    )}
                    {project.publication && (
                      <span className="text-[var(--tg-teal)]">{project.publication}</span>
                    )}
                    {project.courseCode && (
                      <span className="text-[var(--tg-teal)]">{project.courseCode}</span>
                    )}
                    {project.role && (
                      <span className="text-[var(--tg-teal)]">{project.role}</span>
                    )}
                    {project.organization && (
                      <span className="text-[var(--tg-teal)]">{project.organization}</span>
                    )}
                    {project.year && <span>{project.year}</span>}
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 