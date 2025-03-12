import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchRecipeBySlug, DEFAULT_RECIPE_IMAGE } from '@/lib/recipes';
import { RecipeImage } from '@/components/ui/RecipeImage';
import Script from 'next/script';

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const recipe = await fetchRecipeBySlug(slug);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found - KnockoffKitchen.com',
      description: 'The recipe you are looking for could not be found.',
    };
  }
  
  const canonicalUrl = `https://knockoffkitchen.com/recipes/${slug}`;
  
  return {
    title: `Homemade ${recipe.title} Recipe - KnockoffKitchen.com`,
    description: `Learn how to make a homemade version of ${recipe.title}. ${recipe.seo_meta_description || ''}`,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [`homemade ${recipe.title}`, `${recipe.title} recipe`, `copycat ${recipe.title}`, `${recipe.brand_name} recipe`, `homemade ${recipe.brand_name}`, 'copycat recipe'],
    openGraph: {
      title: `Homemade ${recipe.title} Recipe - KnockoffKitchen.com`,
      description: `Learn how to make a homemade version of ${recipe.title}. ${recipe.seo_meta_description || ''}`,
      type: 'article',
      url: canonicalUrl,
      images: [
        {
          url: recipe.imageUrl || '/images/knockoff.png',
          width: 1200,
          height: 630,
          alt: `Homemade ${recipe.title} recipe - KnockoffKitchen.com`,
        },
      ],
      siteName: 'KnockoffKitchen.com',
      locale: 'en_US',
      publishedTime: new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `Homemade ${recipe.title} Recipe - KnockoffKitchen.com`,
      description: `Learn how to make a homemade version of ${recipe.title}. ${recipe.seo_meta_description || ''}`,
      images: [recipe.imageUrl || '/images/knockoff.png'],
    },
  };
}

export default async function RecipePage({ params }) {
  const slug = params.slug;
  const recipe = await fetchRecipeBySlug(slug);
  
  // Generate JSON-LD structured data for recipe
  const jsonLd = recipe ? {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: `Homemade ${recipe.title}`,
    image: recipe.imageUrl || '/images/knockoff.png',
    author: {
      '@type': 'Organization',
      name: 'KnockoffKitchen.com',
    },
    datePublished: new Date().toISOString().split('T')[0],
    description: recipe.seo_meta_description || `Learn how to make a homemade version of ${recipe.title}`,
    prepTime: `PT${recipe.prepTime.replace(/\D/g, '')}M`,
    cookTime: `PT${recipe.cookTime.replace(/\D/g, '')}M`,
    totalTime: `PT${recipe.totalTime.replace(/\D/g, '')}M`,
    keywords: `homemade ${recipe.title}, ${recipe.brand_name} recipe, copycat recipe`,
    recipeYield: recipe.yield || '4 servings',
    recipeCategory: recipe.category,
    recipeCuisine: 'American',
    recipeIngredient: recipe.ingredients.items,
    recipeInstructions: recipe.instructions.split('\n')
      .filter((line: string) => line.trim() !== '')
      .map((step: string, index: number) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text: step.replace(/^\d+\.\s*/, ''),
      })),
    nutrition: recipe.nutritional_info ? {
      '@type': 'NutritionInformation',
      text: recipe.nutritional_info.text,
    } : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '25',
    },
  } : null;
  
  // Add JSON-LD script to the page
  const jsonLdScript = jsonLd ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  ) : null;

  if (!recipe) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/recipes" className="text-primary-600 hover:underline flex items-center">
              ← Back to Recipes
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Recipe Not Found</h1>
            <p className="text-gray-700 mb-6">The recipe you are looking for could not be found.</p>
          </div>
        </div>
      </main>
    );
  }
  
  // Extract instructions as an array for rendering
  const instructionsArray = recipe.instructions.split('\n').filter(line => line.trim() !== '');
  
  // Format yield for display
  const servings = recipe.yield || "4 servings";
  
  return (
    <>
      {/* Add JSON-LD structured data */}
      {jsonLdScript}
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/recipes" className="text-primary-600 hover:underline flex items-center">
              ← Back to Recipes
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-full bg-gray-200">
                  <RecipeImage
                    src={recipe.imageUrl || DEFAULT_RECIPE_IMAGE}
                    alt={recipe.title}
                    title={`Homemade ${recipe.title} recipe - KnockoffKitchen.com`}
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-1/2 p-6">
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                  {recipe.category}
                </span>
                <h1 className="text-3xl font-bold mt-2 mb-4">{recipe.title}</h1>
                <div className="text-gray-700 mb-6">
                  {/* Use the full introduction if available, otherwise fall back to seo_meta_description */}
                  {recipe.introduction ? (
                    <div className="prose max-w-none">
                      {recipe.introduction.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p>{recipe.seo_meta_description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500">Prep Time</span>
                    <span className="font-medium">{recipe.prepTime}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500">Cook Time</span>
                    <span className="font-medium">{recipe.cookTime}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500">Total Time</span>
                    <span className="font-medium">{recipe.totalTime}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500">Servings</span>
                    <span className="font-medium">{servings}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Difficulty:</span>
                    <span className="ml-2 font-medium">{recipe.difficulty}</span>
                  </div>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                    Print Recipe
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="md:flex md:space-x-8">
                <div className="md:w-1/3 mb-8 md:mb-0">
                  <h2 className="text-xl font-bold mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.items.map((ingredient: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-primary-100 rounded-full mt-1 mr-2"></span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:w-2/3">
                  <h2 className="text-xl font-bold mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {instructionsArray.map((instruction: string, index: number) => (
                      <li key={index} className="flex">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{instruction.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ol>
                  
                  {recipe.pro_tips && (
                    <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-2">Pro Tips</h3>
                      <div className="space-y-2">
                        {recipe.pro_tips.split('\n').filter(tip => tip.trim() !== '').map((tip: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <span className="inline-block w-4 h-4 bg-primary-200 rounded-full mt-1 mr-2"></span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {recipe.nutritional_info && recipe.nutritional_info.text && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Nutritional Information</h2>
                <p className="text-gray-700">{recipe.nutritional_info.text}</p>
              </div>
            )}
            
            {/* Storage Instructions */}
            {recipe.storage_instructions && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Storage Instructions</h2>
                <p className="text-gray-700">{recipe.storage_instructions}</p>
              </div>
            )}
            
            {/* FAQ Section */}
            {recipe.faq && recipe.faq.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {recipe.faq.map((item: { question: string; answer: string }, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Serving Suggestions */}
            {recipe.serving_suggestions && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Serving Suggestions</h2>
                <p className="text-gray-700">{recipe.serving_suggestions}</p>
              </div>
            )}
            
            {/* Cost Comparison */}
            {recipe.cost_comparison && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Cost Comparison</h2>
                <p className="text-gray-700">{recipe.cost_comparison}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
