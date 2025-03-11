import React from 'react';
import Link from 'next/link';
import { fetchRecipes, fetchBrands } from '@/lib/recipes';

export default async function HomePage() {
  // Fetch recipes and brands
  const recipes = await fetchRecipes();
  const brands = await fetchBrands();
  
  // Get featured recipes (latest 3)
  const featuredRecipes = recipes.slice(0, 3);
  
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Make Your Favorite Brand Products at Home
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover copycat recipes of popular brand products. Save money, customize ingredients, and enjoy homemade versions of your favorites.
          </p>
          <Link
            href="/recipes"
            className="bg-white text-primary-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      {recipe.title}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                    {recipe.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">
                    <Link href={`/recipes/${recipe.slug}`} className="hover:text-primary-600">
                      {recipe.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.seo_meta_description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">Prep: {recipe.prepTime}</span>
                    <span className="mr-3">Cook: {recipe.cookTime}</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/recipes"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Brands</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.slice(0, 8).map((brand) => (
              <Link
                key={brand.name}
                href={`/brands/${brand.slug}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
                <p className="text-gray-600 text-sm">{brand.count} recipes</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/brands"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              View All Brands
            </Link>
          </div>
        </div>
      </section>

      {/* Why Make Copycat Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Make Copycat Recipes?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Making your favorite products at home can be significantly cheaper than buying them from stores.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Healthier Options</h3>
              <p className="text-gray-600">
                Control the ingredients to reduce preservatives, sodium, and unhealthy additives.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize to Taste</h3>
              <p className="text-gray-600">
                Adjust flavors, spice levels, and ingredients to suit your personal preferences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
