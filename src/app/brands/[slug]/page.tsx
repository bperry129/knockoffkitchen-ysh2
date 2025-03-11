import React from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';
import { fetchBrandBySlug, fetchRecipesByBrand, DEFAULT_RECIPE_IMAGE } from '@/lib/recipes';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await fetchBrandBySlug(params.slug);
  
  if (!brand) {
    return {
      title: 'Brand Not Found - CopyCat Recipes',
      description: 'The brand you are looking for could not be found.',
    };
  }
  
  return {
    title: `${brand.name} Copycat Recipes - CopyCat Recipes`,
    description: `Discover delicious copycat recipes from ${brand.name}. ${brand.count} recipes available.`,
    openGraph: {
      title: `${brand.name} Copycat Recipes - CopyCat Recipes`,
      description: `Discover delicious copycat recipes from ${brand.name}. ${brand.count} recipes available.`,
      images: [
        {
          url: '/images/knockoff.png',
          width: 1200,
          height: 630,
          alt: brand.name,
        },
      ],
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const brand = await fetchBrandBySlug(params.slug);
  
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/brands" className="text-primary-600 hover:underline flex items-center">
            ← Back to Brands
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
          <p className="text-gray-700 mb-6">The brand you are looking for could not be found.</p>
        </div>
      </div>
    );
  }
  
  const recipes = await fetchRecipesByBrand(brand.name);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/brands" className="text-primary-600 hover:underline flex items-center">
          ← Back to Brands
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="relative h-64 md:h-full bg-gray-200">
              {/* Placeholder for brand image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {brand.name} Logo
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{brand.name} Copycat Recipes</h1>
            <p className="text-gray-700 mb-6">
              Discover our collection of {brand.count} copycat recipes from {brand.name}. 
              Make your favorite {brand.name} products at home with our easy-to-follow recipes.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Popular {brand.name} Recipes</h2>
      
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
          <h3 className="text-2xl font-semibold mb-4">No recipes found</h3>
          <p className="text-gray-600 mb-8">
            We couldn't find any recipes for this brand. Please check back later or try another brand.
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
  );
}
