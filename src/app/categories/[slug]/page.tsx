import React from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Metadata } from 'next';

// This would typically come from a database or API
const getCategoryBySlug = (slug: string) => {
  // Data from DeepSeek-generated recipes
  const categories = {
    "chips": {
      name: "Chips",
      description: "Delicious homemade chip recipes that taste just like your favorite store-bought brands but healthier and more affordable.",
      image: "/images/chips.jpg"
    }
  };
  
  return categories[slug as keyof typeof categories] || {
    name: "Category Not Found",
    description: "This category does not exist.",
    image: "/images/default.jpg"
  };
};

// This would typically come from a database or API
const getRecipesByCategory = (category: string) => {
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
      slug: "pringles-extra-hot-chili-lime"
    }
  ];
  
  return allRecipes.filter(recipe => 
    recipe.category.toLowerCase() === category.toLowerCase()
  );
};

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  
  return {
    title: `${category.name} Recipes - CopyCat Recipes`,
    description: category.description,
    openGraph: {
      title: `${category.name} Recipes - CopyCat Recipes`,
      description: category.description,
      images: [
        {
          url: category.image || '/images/default-category.jpg',
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  const recipes = getRecipesByCategory(category.name);
  
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
              <h1 className="text-3xl font-bold mb-4">{category.name} Recipes</h1>
              <p className="text-gray-700">{category.description}</p>
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
