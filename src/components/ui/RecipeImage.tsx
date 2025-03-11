"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { DEFAULT_RECIPE_IMAGE } from '@/lib/recipes';

interface RecipeImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export const RecipeImage: React.FC<RecipeImageProps> = ({
  src,
  alt,
  title,
  className = "object-cover",
}) => {
  const [imageSrc, setImageSrc] = useState(src || DEFAULT_RECIPE_IMAGE);
  const [isImageError, setIsImageError] = useState(false);
  
  // Handle image load error
  const handleImageError = () => {
    if (!isImageError) {
      setIsImageError(true);
      setImageSrc(DEFAULT_RECIPE_IMAGE);
    }
  };
  
  return (
    <Image
      src={imageSrc}
      alt={alt}
      title={title || alt} // Use title if provided, otherwise fall back to alt text
      fill
      className={className}
      unoptimized={true} // Skip optimization for all URLs to ensure onError works
      onError={handleImageError}
    />
  );
};
