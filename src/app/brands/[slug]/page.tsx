import React from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';
import { fetchBrandBySlug, fetchRecipesByBrand } from '@/lib/recipes';

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const brand = await fetchBrandBySlug(slug);
  
  if (!brand) {
    return {
      title: 'Brand Not Found - KnockoffKitchen.com',
      description: 'The brand you are looking for could not be found.',
    };
  }
  
  const canonicalUrl = `https://knockoffkitchen.com/brands/${slug}`;
  
  return {
    title: `Homemade ${brand.name} Copycat Recipes - KnockoffKitchen.com`,
    description: `Learn how to make homemade versions of your favorite ${brand.name} products. ${brand.count} copycat recipes available.`,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [`homemade ${brand.name} recipes`, `${brand.name} copycat recipes`, `DIY ${brand.name} products`, 'homemade brand recipes'],
    openGraph: {
      title: `Homemade ${brand.name} Copycat Recipes - KnockoffKitchen.com`,
      description: `Learn how to make homemade versions of your favorite ${brand.name} products. ${brand.count} copycat recipes available.`,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: '/images/knockoff.png',
          width: 1200,
          height: 630,
          alt: `Homemade ${brand.name} Recipes`,
        },
      ],
      siteName: 'KnockoffKitchen.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Homemade ${brand.name} Copycat Recipes - KnockoffKitchen.com`,
      description: `Learn how to make homemade versions of your favorite ${brand.name} products. ${brand.count} copycat recipes available.`,
      images: ['/images/knockoff.png'],
    },
  };
}

export default async function BrandPage({ params }) {
  const slug = params.slug;
  const brand = await fetchBrandBySlug(slug);
  
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
            <h1 className="text-3xl font-bold mb-4">Homemade {brand.name} Copycat Recipes</h1>
            <p className="text-gray-700 mb-6">
              Discover our collection of {brand.count} homemade copycat recipes from {brand.name}. 
              Make your favorite {brand.name} products at home with our easy-to-follow recipes and save money while enjoying healthier alternatives.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Popular Homemade {brand.name} Recipes</h2>
      
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
