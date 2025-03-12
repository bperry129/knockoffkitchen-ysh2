import React from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';
import { fetchCategoryBySlug, fetchRecipes } from '@/lib/recipes';

// Define the Props type to match Next.js 15 requirements
interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await fetchCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - KnockoffKitchen.com',
      description: 'This category does not exist.',
    };
  }
  
  const canonicalUrl = `https://knockoffkitchen.com/categories/${params.slug}`;
  
  return {
    title: `Homemade ${category.name} Recipes - KnockoffKitchen.com`,
    description: `Discover delicious homemade ${category.name.toLowerCase()} recipes. ${category.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [`homemade ${category.name} recipes`, `${category.name.toLowerCase()} copycat recipes`, 'DIY recipes', 'homemade recipes'],
    openGraph: {
      title: `Homemade ${category.name} Recipes - KnockoffKitchen.com`,
      description: `Discover delicious homemade ${category.name.toLowerCase()} recipes. ${category.description}`,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: '/images/default-category.jpg',
          width: 1200,
          height: 630,
          alt: `Homemade ${category.name} Recipes`,
        },
      ],
      siteName: 'KnockoffKitchen.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Homemade ${category.name} Recipes - KnockoffKitchen.com`,
      description: `Discover delicious homemade ${category.name.toLowerCase()} recipes. ${category.description}`,
      images: ['/images/default-category.jpg'],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await fetchCategoryBySlug(params.slug);
  
  if (!category) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/categories" className="text-primary-600 hover:underline flex items-center">
              ← Back to Categories
            </Link>
          </div>
          
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Category Not Found</h2>
            <p className="text-gray-600 mb-8">
              We couldn't find the category you're looking for. Please try another category.
            </p>
            <Link 
              href="/categories" 
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  // Fetch all recipes and filter by category
  const allRecipes = await fetchRecipes();
  const recipes = allRecipes.filter(recipe => 
    recipe.category.toLowerCase() === category.name.toLowerCase()
  );
  
  return (
    <>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/categories" className="text-primary-600 hover:underline flex items-center">
              ← Back to Categories
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="relative h-64 bg-gray-200">
              {/* Placeholder for category image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {category.name} Image
              </div>
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Homemade {category.name} Recipes</h1>
              <p className="text-gray-700">
                Discover our collection of homemade {category.name.toLowerCase()} recipes. 
                {category.description}
              </p>
            </div>
          </div>
          
          {recipes.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No recipes found</h2>
              <p className="text-gray-600 mb-8">
                We couldn't find any recipes in this category. Please check back later or try another category.
              </p>
              <Link 
                href="/recipes" 
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                Browse All Recipes
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
