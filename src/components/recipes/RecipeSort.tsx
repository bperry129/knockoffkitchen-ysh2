"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Sorting options
const sortOptions = [
  { id: "alphabetical", name: "Alphabetically (A-Z)" },
  { id: "alphabetical-desc", name: "Alphabetically (Z-A)" },
  { id: "newest", name: "Newest First" },
  { id: "popular", name: "Most Popular" }
];

export const RecipeSort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current search and sort parameters
  const searchQuery = searchParams?.get('search') || '';
  const sortBy = searchParams?.get('sort') || 'alphabetical';
  
  return (
    <div className="mb-8">
      <div className="flex items-center flex-wrap">
        <span className="mr-3 text-gray-700 font-medium">Sort by:</span>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <a
              key={option.id}
              href={`/recipes?${searchQuery ? `search=${encodeURIComponent(searchQuery)}&` : ''}sort=${option.id}`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sortBy === option.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {option.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
