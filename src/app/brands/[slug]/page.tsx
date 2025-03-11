import React from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';

// This would typically come from a database or API
const getBrandBySlug = (slug: string) => {
  // Data from DeepSeek-generated recipes
  const brands = {
    "pringles": {
      name: "Pringles",
      description: "Popular potato chip brand known for their distinctive saddle-shaped chips and tube packaging.",
      image: "/images/brands/pringles.jpg",
      website: "https://www.pringles.com"
    }
  };
  
  return brands[slug as keyof typeof brands] || {
    name: "Brand Not Found",
    description: "This brand does not exist.",
    image: "/images/brands/default.jpg",
    website: "#"
  };
};

// This would typically come from a database or API
const getRecipesByBrand = (brand: string) => {
  // Data from DeepSeek-generated recipes
  const allRecipes = [
    {
      id: 1,
      title: "Homemade Extra Hot Chili & Lime: A Copycat Recipe Better Than Store-Bought",
      category: "Chips",
      image: "/images/chips.jpg",
      prepTime: "15 min",
      cookTime: "30 min",
      difficulty: "Medium",
      slug: "pringles-extra-hot-chili-lime",
      brand: "Pringles"
    }
  ];
  
  return allRecipes.filter(recipe => 
    recipe.brand.toLowerCase() === brand.toLowerCase()
  );
};

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandBySlug(params.slug);
  
  return {
    title: `${brand.name} Copycat Recipes - CopyCat Recipes`,
    description: `Discover delicious copycat recipes from ${brand.name}. ${brand.description}`,
    openGraph: {
      title: `${brand.name} Copycat Recipes - CopyCat Recipes`,
      description: `Discover delicious copycat recipes from ${brand.name}. ${brand.description}`,
      images: [
        {
          url: brand.image || '/images/brands/default.jpg',
          width: 1200,
          height: 630,
          alt: brand.name,
        },
      ],
    },
  };
}

export default function BrandPage({ params }: Props) {
  const brand = getBrandBySlug(params.slug);
  const recipes = getRecipesByBrand(brand.name);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/brands" className="text-primary hover:underline flex items-center">
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
            <p className="text-gray-700 mb-6">{brand.description}</p>
            
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Official Website:</span>
              <a 
                href={brand.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                {brand.website}
              </a>
            </div>
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
            className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-600 transition-colors"
          >
            Browse All Recipes
          </Link>
        </div>
      )}
    </div>
  );
}
