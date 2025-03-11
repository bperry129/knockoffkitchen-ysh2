import React from 'react';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';
import { fetchRecipes } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'All Recipes - CopyCat Recipes',
  description: 'Browse our collection of copycat recipes from your favorite brands. Easy to follow, tested recipes that taste just like the original.',
};

// Categories for filtering
const categories = [
  "All",
  "Chips",
  "Italian",
  "Mexican",
  "Fast Food",
  "Dessert",
  "Bakery",
  "Soup",
  "Asian",
  "Breakfast"
];

export default async function RecipesPage() {
  // Fetch recipes from API
  const recipes = await fetchRecipes();
  
  return (
    <>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">All Recipes</h1>
          
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === 'Chips'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Recipes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                category={recipe.category}
                image={recipe.image}
                imageUrl={recipe.imageUrl}
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
                difficulty={recipe.difficulty}
                slug={recipe.slug}
              />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-primary-600 text-white"
              >
                1
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                2
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                3
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}
