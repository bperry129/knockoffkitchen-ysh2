"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DEFAULT_RECIPE_IMAGE } from '@/lib/recipes';

interface RecipeCardProps {
  id: number;
  title: string;
  category: string;
  image?: string;
  imageUrl?: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  slug: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  category,
  image,
  imageUrl,
  prepTime,
  cookTime,
  difficulty,
  slug,
}) => {
  // Use imageUrl if available, otherwise fall back to image or default
  const imageSrc = imageUrl || image || DEFAULT_RECIPE_IMAGE;
  
  return (
    <Link 
      href={`/recipes/${slug}`} 
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gray-200">
        {/* If we have an image, display it, otherwise show a placeholder */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          unoptimized={imageUrl ? true : false} // Skip optimization for external URLs
        />
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-lg font-semibold mt-1 mb-2 hover:text-primary-600">
          {title}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <span className="mr-3">Prep: {prepTime}</span>
          <span className="mr-3">Cook: {cookTime}</span>
          <span>{difficulty}</span>
        </div>
      </div>
    </Link>
  );
};
