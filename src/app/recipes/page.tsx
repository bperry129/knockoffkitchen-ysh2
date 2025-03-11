import React from 'react';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Recipes - CopyCat Recipes',
  description: 'Browse our collection of copycat recipes from your favorite restaurants. Easy to follow, tested recipes that taste just like the original.',
};

// Function to extract recipe information from filename
function extractRecipeInfo(filename: string): { title: string; slug: string } {
  // Remove .json extension
  const nameWithoutExt = filename.replace('.json', '');
  
  // Remove the UUID part (typically 8 characters after the last underscore)
  const titleWithoutUUID = nameWithoutExt.replace(/_[a-f0-9]{8}$/, '');
  
  // Extract title and slug
  let title = titleWithoutUUID
    .replace(/_/g, ' ')
    .replace(/Homemade_/g, 'Homemade ');
  
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return {
    title,
    slug
  };
}

// DeepSeek AI-generated recipes
const recipeFilenames = [
  "Ultimate_Homemade_Pringles_Extra_Hot_Chili_&_Lime_Better_Than_The_Original_018b2846.json",
  "Homemade_Tortillas_Chili_Cheese_Copycat_Recipe_ae4793d2.json",
  "DIY_Pringles_Halloween_Original_Sour_Cream_&_Onion_Cheddar_Cheese_Variety_A_Homemade_Delight_a4be6818.json"
];

const recipes = recipeFilenames.map((filename, index) => {
  const { title, slug } = extractRecipeInfo(filename);
  return {
    id: index + 1,
    title,
    category: "Chips",
    image: "/images/chips.jpg", // Placeholder image
    prepTime: "15-20 min",
    cookTime: "20-30 min",
    difficulty: "Medium",
    slug
  };
});

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

export default function RecipesPage() {
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
