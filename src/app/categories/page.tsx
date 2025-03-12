import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchCategories } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'Recipe Categories - CopyCat Recipes',
  description: 'Browse our copycat recipes by category. Find Italian, Mexican, Fast Food, Desserts, and more categories of your favorite restaurant dishes.',
};

export default async function CategoriesPage() {
  // Fetch categories from the API
  const categories = await fetchCategories();
  return (
    <>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Recipe Categories</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={`/categories/${category.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {/* Placeholder for category image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    {category.name}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {category.count} recipes
                    </span>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
