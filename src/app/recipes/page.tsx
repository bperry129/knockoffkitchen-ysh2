import React from 'react';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeSort } from '@/components/recipes/RecipeSort';
import { Metadata } from 'next';
import { fetchRecipes, searchRecipes, Recipe } from '@/lib/recipes';

// Define the props interface for Next.js pages
interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate dynamic metadata based on search query
export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { searchParams } = props;
  // Access searchParams safely
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  
  if (searchQuery) {
    return {
      title: `Search Results for "${searchQuery}" - KnockoffKitchen.com`,
      description: `Find homemade copycat recipes matching "${searchQuery}". Make your favorite brand products at home with our easy-to-follow recipes.`,
    };
  }
  
  return {
    title: 'All Recipes - KnockoffKitchen.com',
    description: 'Browse our collection of homemade copycat recipes from your favorite brands. Easy to follow, tested recipes that taste just like the original.',
  };
}

// Function to sort recipes based on the selected option
function sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
  const sortedRecipes = [...recipes]; // Create a copy to avoid mutating the original array
  
  switch (sortBy) {
    case 'alphabetical':
      return sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
    case 'alphabetical-desc':
      return sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));
    case 'newest':
      // Assuming newer recipes have higher IDs
      return sortedRecipes.sort((a, b) => b.id - a.id);
    case 'popular':
      // For now, we'll just use a random sort for demonstration
      // In a real app, you would sort by popularity metrics
      return sortedRecipes.sort(() => Math.random() - 0.5);
    default:
      return sortedRecipes;
  }
}

export default async function RecipesPage(
  props: PageProps
) {
  const { searchParams } = props;
  // Get search query and sort parameters
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const sortBy = typeof searchParams.sort === 'string' ? searchParams.sort : 'alphabetical';
  
  // Fetch recipes from API
  let recipes = await fetchRecipes();
  
  // Filter by search query if provided
  if (searchQuery) {
    recipes = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Sort recipes based on the selected option
  recipes = sortRecipes(recipes, sortBy);
  
  // Set page title based on search query
  const pageTitle = searchQuery 
    ? `Search Results for "${searchQuery}"`
    : "All Recipes";
  
  return (
    <>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
          
          {/* Search results info */}
          {searchQuery && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} matching "{searchQuery}"
              </p>
              <a href="/recipes" className="text-primary-600 hover:underline mt-2 inline-block">
                Clear search and view all recipes
              </a>
            </div>
          )}
          
          {/* Sorting options */}
          <RecipeSort />
          
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
