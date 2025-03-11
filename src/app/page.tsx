import Image from "next/image";
import Link from "next/link";

// Featured recipe from DeepSeek AI
const featuredRecipes = [
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

// Popular categories from DeepSeek-generated recipes
const popularCategories = [
  { name: "Chips", slug: "chips", image: "/images/chips.jpg" }
];

export default function Home() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Cook Your Favorite Restaurant Dishes at Home
              </h1>
              <p className="text-xl mb-8">
                Discover delicious copycat recipes of famous restaurant dishes that taste just like the original.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/recipes" 
                  className="bg-white text-primary-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Browse Recipes
                </Link>
                <Link 
                  href="/categories" 
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
                >
                  View Categories
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Recipes */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    {/* Placeholder for recipe image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      {recipe.title} Image
                    </div>
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
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="mr-3">Prep: {recipe.prepTime}</span>
                      <span className="mr-3">Cook: {recipe.cookTime}</span>
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link 
                href="/recipes" 
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                View All Recipes
              </Link>
            </div>
          </div>
        </section>
        
        {/* Popular Categories */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category) => (
                <Link 
                  key={category.name}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32 bg-gray-200">
                    {/* Placeholder for category image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-3 text-center font-medium">
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-12 bg-primary-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Get New Recipes Weekly</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss a new copycat recipe. We'll send you our latest recipes every week.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-r-md font-medium hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
