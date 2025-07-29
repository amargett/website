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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'research':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
      case 'industry':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
      case 'coursework':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
      case 'extracurricular': // Changed from extracurriculars
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'; // Light gray bg, dark gray text
    }
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === null
              ? 'bg-[#374151] text-white'
              : 'bg-white/80 dark:bg-[#1e293b]/80 text-[#374151] dark:text-[#e5e7eb] hover:bg-white dark:hover:bg-[#1e293b]'
          }`}
        >
          All Projects
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === category
                ? getCategoryColor(category)
                : 'bg-white/80 dark:bg-[#1e293b]/80 text-[#374151] dark:text-[#e5e7eb] hover:bg-white dark:hover:bg-[#1e293b]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-8">
        {filteredProjects.length === 0 && (
          <div className="text-center text-[#64748b]">
            <p>No projects found for this category.</p>
          </div>
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
              <article className="flex flex-col sm:flex-row gap-6 p-6 cosmic-card rounded-xl hover:shadow-xl transition-all duration-300">
                <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.mainMedia.alt}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : videoUrl ? (
                    <HoverVideo
                      src={videoUrl}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e2e8f0] dark:bg-[#334155] rounded-lg flex items-center justify-center">
                      <span className="text-[#64748b] text-sm">No media</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#374151] dark:text-[#e5e7eb] group-hover:text-[#475569] transition-colors">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-4 shadow-sm ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                  </div>
                  <p className="text-[#64748b] mb-3 leading-relaxed">
                    {project.shortDescription}
                  </p>
                  {project.technicalSkills && project.technicalSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technicalSkills.map((skill: string, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="inline-block px-2 py-1 rounded text-xs font-normal bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
                    {project.institution && (
                      <span className="text-[#475569] font-medium">
                        {project.institution}
                      </span>
                    )}
                    {project.publication && (
                      <span className="text-[#475569] font-medium">
                        {project.publication}
                      </span>
                    )}
                    {project.courseCode && (
                      <span className="text-[#475569] font-medium">
                        {project.courseCode}
                      </span>
                    )}
                    {project.role && (
                      <span className="text-[#475569] font-medium">
                        {project.role}
                      </span>
                    )}
                    {project.organization && (
                      <span className="text-[#475569] font-medium">
                        {project.organization}
                      </span>
                    )}
                    {project.year && (
                      <span>{project.year}</span>
                    )}
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