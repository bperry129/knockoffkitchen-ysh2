import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Brands - CopyCat Recipes',
  description: 'Browse copycat recipes by restaurant brands. Find recipes from Olive Garden, Cheesecake Factory, Chipotle, and more of your favorite restaurant chains.',
};

// Brands data from DeepSeek-generated recipes
const brands = [
  { 
    name: "Pringles", 
    slug: "pringles", 
    image: "/images/brands/pringles.jpg",
    description: "Popular potato chip brand known for their distinctive saddle-shaped chips and tube packaging.",
    count: 1
  }
];

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Brands</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link 
            key={brand.name}
            href={`/brands/${brand.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              {/* Placeholder for brand image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {brand.name} Logo
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{brand.name}</h2>
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {brand.count} recipes
                </span>
              </div>
              <p className="text-gray-600">{brand.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
