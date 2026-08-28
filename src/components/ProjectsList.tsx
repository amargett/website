"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import HoverVideo from "./HoverVideo";
import { mediaUrls } from "../sanity/lib/media";

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
    return projects.filter((project) => project.category === activeFilter);
  }, [projects, activeFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(projects.map((project) => project.category))];
    // Define the desired order
    const categoryOrder = ["coursework", "industry", "research", "extracurricular"];
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
    s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        <button
          onClick={() => setActiveFilter(null)}
          className={activeFilter === null ? "ps-btn ps-btn-active" : "ps-btn"}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={activeFilter === category ? "ps-btn ps-btn-active" : "ps-btn"}
          >
            {humanize(category)}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-5">
        {filteredProjects.length === 0 && (
          <p className="ps-label">No projects found for this category.</p>
        )}
        {filteredProjects.map((project) => {
          const { imageUrl, videoUrl } = mediaUrls(project);

          return (
            <Link
              key={project._id}
              href={`/projects/${project.slug.current}`}
              className="ps-row"
            >
              <div className="ps-row-media">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.mainMedia.alt || project.title}
                    fill
                    sizes="(max-width: 760px) 92vw, 176px"
                    className="object-cover"
                  />
                ) : videoUrl ? (
                  <HoverVideo src={videoUrl} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="ps-label">No media</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="ps-row-title">{project.title}</h3>
                  <span className="ps-chip flex-shrink-0">
                    {humanize(project.category)}
                  </span>
                </div>
                <p className="ps-card-desc">{project.shortDescription}</p>
                <div className="ps-card-meta flex flex-wrap items-center gap-x-3 gap-y-1">
                  {project.institution && <b>{project.institution}</b>}
                  {project.publication && <b>{project.publication}</b>}
                  {project.courseCode && <b>{project.courseCode}</b>}
                  {project.role && <b>{project.role}</b>}
                  {project.organization && <b>{project.organization}</b>}
                  {project.year && <span>{project.year}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
