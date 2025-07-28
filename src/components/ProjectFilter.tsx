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
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'; // Light gray bg, dark gray text
      case 'industry':
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'; // Light gray bg, dark gray text
      case 'coursework':
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'; // Light gray bg, dark gray text
      case 'extracurricular': // Changed from extracurriculars
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'; // Light gray bg, dark gray text
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'; // Light gray bg, dark gray text
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