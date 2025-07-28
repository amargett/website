'use client';

import React, { useState } from 'react';

interface ProjectFilterProps {
  categories: string[];
  onFilterChange: (category: string | null) => void;
}

export default function ProjectFilter({ categories, onFilterChange }: ProjectFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (category: string | null) => {
    setActiveFilter(category);
    onFilterChange(category);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'research':
        return 'bg-[#0a4a5a] text-white hover:bg-[#0a4a5a]/80';
      case 'industry':
        return 'bg-[#0a5a52] text-white hover:bg-[#0a5a52]/80';
      case 'coursework':
        return 'bg-[#f97316] text-white hover:bg-[#f97316]/80';
      case 'extracurriculars':
        return 'bg-[#8b5cf6] text-white hover:bg-[#8b5cf6]/80';
      default:
        return 'bg-[#64748b] text-white hover:bg-[#64748b]/80';
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => handleFilterClick(null)}
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
          onClick={() => handleFilterClick(category)}
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
  );
} 