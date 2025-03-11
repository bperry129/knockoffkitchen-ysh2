import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

// Map of recipe slugs to their details
const recipeDetails: Record<string, any> = {
  "ultimate-homemade-pringles-extra-hot-chili-lime-better-than-the-original": {
    title: "Ultimate Homemade Pringles Extra Hot Chili & Lime: Better Than The Original",
    description: "Discover the secret to making your favorite Pringles Extra Hot Chili & Lime at home with this easy and healthier copycat recipe. Perfect for spice lovers!",
    category: "Chips",
    image: "/images/chips.jpg",
    prepTime: "20 min",
    cookTime: "10 min",
    totalTime: "30 min",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "2 cups cornstarch",
      "1/2 cup all-purpose flour",
      "1/4 cup vegetable oil",
      "1/2 cup ice-cold water",
      "1 tsp baking powder",
      "1/2 tsp salt",
      "2 tbsp chili powder",
      "1 tsp ground cumin",
      "1 tsp smoked paprika",
      "1/2 tsp garlic powder",
      "1/2 tsp onion powder",
      "1/2 tsp cayenne pepper (or more to taste)",
      "1 tsp lime zest",
      "1 tsp citric acid (optional)",
      "1/2 tsp sugar"
    ],
    instructions: [
      "In a large mixing bowl, combine cornstarch, flour, baking powder, and salt.",
      "Gradually add vegetable oil and ice-cold water, mixing until a dough forms.",
      "Knead the dough for about 5 minutes until smooth. Divide into 2-3 portions for easier handling.",
      "Roll out each portion thinly on a lightly floured surface. Cut into triangle shapes with a knife or pastry cutter.",
      "Heat oil in a deep frying pan to 350°F (175°C). Fry chips in batches until golden, about 3-5 minutes per side.",
      "Drain chips on paper towels. While hot, toss with flavor seasoning until evenly coated.",
      "Cool completely before serving."
    ],
    tips: [
      "For extra crispiness, ensure oil reaches the correct temperature.",
      "Adjust seasoning to taste; add more lime zest for tanginess.",
      "Experiment with other seasonings like herbs or cheese powder."
    ],
    nutrition: {
      calories: 120,
      fat: 2,
      carbs: 25,
      protein: 2
    },
    storage: "Store in an airtight container at room temperature for up to 3 days.",
    faq: [
      {
        "question": "Why are my chips not crispy?",
        "answer": "Oil temperature too low; increase heat."
      },
      {
        "question": "Can I bake instead of fry?",
        "answer": "Yes, bake at 375°F (190°C) for 15-20 minutes."
      },
      {
        "question": "Where to find citric acid?",
        "answer": "Available at baking supply stores or online."
      }
    ],
    serving_suggestions: "Enjoy as a snack, use as a topping for salads, or crush for breading.",
    cost_comparison: "Homemade cost: $1.50 for 2 cups. Store-bought (5.5oz can): $2.50. Save 40% per batch. Annual savings for weekly consumption: $52.",
    nutritional_comparison: "Homemade version: 120 calories, 2g fat, 200mg sodium, 25g carbs, 2g protein per serving. Store-bought: 150 calories, 2.5g fat, 250mg sodium, 30g carbs, 2g protein. Homemade has lower calories and sodium using healthier oil."
  },
  "homemade-tortillas-chili-cheese-copycat-recipe": {
    title: "Homemade Tortillas Chili Cheese Copycat Recipe",
    description: "Create your own delicious version of Pringles Tortillas Chili Cheese chips at home with this easy-to-follow copycat recipe. Healthier, more affordable, and just as tasty!",
    category: "Chips",
    image: "/images/chips.jpg",
    prepTime: "20 min",
    cookTime: "25 min",
    totalTime: "45 min",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "2 cups masa harina (corn flour)",
      "1/2 cup all-purpose flour",
      "1 tsp salt",
      "1 tsp baking powder",
      "2 tbsp vegetable oil",
      "1 cup warm water",
      "1/4 cup cheddar cheese powder",
      "2 tbsp chili powder",
      "1 tsp garlic powder",
      "1 tsp onion powder",
      "1/2 tsp cumin",
      "1/2 tsp paprika"
    ],
    instructions: [
      "In a large bowl, mix masa harina, flour, salt, and baking powder.",
      "Add vegetable oil and warm water, mixing until a smooth dough forms.",
      "Divide the dough into small balls and roll each very thin (about 1/16 inch).",
      "Cut into chip-sized pieces and arrange on baking sheets.",
      "Bake at 375°F for 12-15 minutes until crisp and lightly golden.",
      "While still warm, sprinkle with a mixture of cheese powder, chili powder, and spices."
    ],
    tips: [
      "For extra crispiness, ensure the dough is rolled very thin.",
      "Adjust the spice level by varying the amount of chili powder.",
      "Store in an airtight container to maintain freshness."
    ],
    nutrition: {
      calories: 150,
      fat: 5,
      carbs: 22,
      protein: 3
    },
    storage: "Store in an airtight container for up to 5 days.",
    faq: [
      {
        "question": "Can I use regular cornmeal instead of masa harina?",
        "answer": "Masa harina is recommended for authentic texture, but cornmeal can work with adjusted liquid ratios."
      },
      {
        "question": "Where can I find cheese powder?",
        "answer": "Look in specialty food stores or online. Alternatively, use finely grated Parmesan cheese."
      }
    ],
    serving_suggestions: "Serve with salsa, guacamole, or your favorite dip.",
    cost_comparison: "Homemade version costs about $2.00 for four servings compared to $3.50 for store-bought, saving approximately 43%.",
    nutritional_comparison: "The homemade version contains fewer preservatives, less sodium, and no artificial colors compared to the store-bought version."
  },
  "diy-pringles-halloween-original-sour-cream-onion-cheddar-cheese-variety-a-homemade-delight": {
    title: "DIY Pringles Halloween Original Sour Cream & Onion Cheddar Cheese Variety: A Homemade Delight",
    description: "Capture the spooky fun of Pringles Halloween Original Sour Cream & Onion Cheddar Cheese Variety in the comfort of your kitchen! This beloved seasonal snack can now be made at home with healthier ingredients.",
    category: "Chips",
    image: "/images/chips.jpg",
    prepTime: "20 min",
    cookTime: "25 min",
    totalTime: "45 min",
    difficulty: "Medium",
    servings: 4,
    ingredients: [
      "2 cups all-purpose flour",
      "1/2 cup cornstarch",
      "1/4 teaspoon salt",
      "1/4 teaspoon baking powder",
      "1/4 cup unsalted butter, melted",
      "1/2 cup warm water",
      "1 tablespoon olive oil",
      "1 teaspoon onion powder",
      "1 teaspoon garlic powder",
      "1 teaspoon dried parsley",
      "1/2 teaspoon paprika",
      "1/2 teaspoon cheddar cheese powder (homemade or store-bought)",
      "1/4 teaspoon cayenne pepper (optional)"
    ],
    instructions: [
      "Preheat oven to 300°F (150°C). Line baking sheets with parchment paper.",
      "In a bowl, mix flour, cornstarch, and salt. Add baking powder and mix well.",
      "Add melted butter and mix until the mixture resembles breadcrumbs. Gradually add water, mixing until a dough forms.",
      "Knead dough for 5 minutes until smooth. Divide into 4 equal parts. Roll each into a thin sheet about 1/16 inch thick.",
      "Cut into Pringles-like curves using a cookie cutter or a knife. Place on prepared sheets.",
      "Bake for 15-20 minutes until crisp and lightly golden. Allow to cool.",
      "In a bowl, mix onion powder, garlic powder, parsley, paprika, cheese powder, and cayenne pepper.",
      "Once chips are cool, toss in the seasoning mixture until evenly coated. Enjoy!"
    ],
    tips: [
      "For the perfect Pringles shape, use a wavy cookie cutter or create curves with a knife.",
      "To enhance the cheese flavor, dehydrate shredded cheddar in a low oven until dry, then blend into powder.",
      "Experiment with seasoning ratios to balance sour cream and onion flavors to your taste."
    ],
    nutrition: {
      calories: 120,
      fat: 2,
      carbs: 25,
      protein: 2
    },
    storage: "Store in an airtight container at room temperature for up to 3 days. For crispier chips, refresh in a low oven for a few minutes before serving.",
    faq: [
      {
        "question": "Can I make these chips without baking?",
        "answer": "Yes, use a dehydrator at 135°F for 6-8 hours or fry in oil at 350°F for 3-5 minutes until crispy."
      },
      {
        "question": "How do I make cheddar cheese powder?",
        "answer": "Dehydrate shredded cheddar in a 150°F oven for 1-2 hours, then blend into a fine powder."
      }
    ],
    serving_suggestions: "Serve as a snack at Halloween parties or use as a crunchy topping for soups or salads.",
    cost_comparison: "Ingredients cost approximately $2 for 4 servings, saving about 50% compared to store-bought. Annual savings for regular consumers can reach $100.",
    nutritional_comparison: "Homemade chips offer lower sodium and no preservatives. Each serving has approximately 120 calories, 2g fat, 200mg sodium, 25g carbs, and 2g protein compared to Pringles' 150 calories, 3g fat, 300mg sodium, 30g carbs, and 2g protein per serving. Using olive oil boosts heart-healthy fats."
  }
};

// Default recipe for any slug not found in the map
const defaultRecipe = {
  title: "Homemade Pringles Chips: A Copycat Recipe",
  description: "Make delicious homemade Pringles-style chips with this easy copycat recipe. Healthier, more affordable, and customizable to your taste preferences.",
  category: "Chips",
  image: "/images/chips.jpg",
  prepTime: "15 min",
  cookTime: "20 min",
  totalTime: "35 min",
  difficulty: "Medium",
  servings: 4,
  ingredients: [
    "2 large potatoes",
    "2 tbsp vegetable oil",
    "1 tsp salt",
    "Seasonings of your choice"
  ],
  instructions: [
    "Peel and slice potatoes very thinly.",
    "Soak slices in cold water for 30 minutes, then pat dry.",
    "Toss with oil and bake at 400°F for 15-20 minutes until crispy.",
    "Sprinkle with salt and seasonings while still warm."
  ],
  tips: [
    "Use a mandoline for even slices.",
    "Make sure slices are completely dry before baking.",
    "Experiment with different seasonings."
  ],
  nutrition: {
    calories: 120,
    fat: 4,
    carbs: 20,
    protein: 2
  },
  storage: "Store in an airtight container for up to 3 days.",
  faq: [
    {
      "question": "Can I use an air fryer?",
      "answer": "Yes, air fry at 350°F for about 8-10 minutes."
    }
  ],
  serving_suggestions: "Enjoy as a snack or with your favorite dip.",
  cost_comparison: "Homemade chips cost about 75% less than store-bought versions.",
  nutritional_comparison: "Homemade chips have fewer preservatives and less sodium than commercial versions."
};

// This would typically come from a database or API
const getRecipeBySlug = (slug: string) => {
  // Try to find the recipe in our map
  return recipeDetails[slug] || defaultRecipe;
};

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = getRecipeBySlug(params.slug);
  
  return {
    title: `${recipe.title} - CopyCat Recipes`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} - CopyCat Recipes`,
      description: recipe.description,
      type: 'article',
      images: [
        {
          url: recipe.image || '/images/default-recipe.jpg',
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
  };
}

export default function RecipePage({ params }: Props) {
  const recipe = getRecipeBySlug(params.slug);
  
  return (
    <>
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
                  {/* Placeholder for recipe image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    {recipe.title} Image
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-6">
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                  {recipe.category}
                </span>
                <h1 className="text-3xl font-bold mt-2 mb-4">{recipe.title}</h1>
                <p className="text-gray-700 mb-6">{recipe.description}</p>
                
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
                    <span className="font-medium">{recipe.servings}</span>
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
                    {recipe.ingredients.map((ingredient: string, index: number) => (
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
                    {recipe.instructions.map((instruction: string, index: number) => (
                      <li key={index} className="flex">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                  
                  {recipe.tips && recipe.tips.length > 0 && (
                    <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-2">Tips</h3>
                      <ul className="space-y-2">
                        {recipe.tips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-4 h-4 bg-primary-200 rounded-full mt-1 mr-2"></span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {recipe.nutrition && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Nutrition Information</h2>
                <div className="flex flex-wrap">
                  <div className="w-1/2 md:w-1/4 p-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <span className="block text-sm text-gray-500">Calories</span>
                      <span className="font-medium">{recipe.nutrition.calories}</span>
                    </div>
                  </div>
                  <div className="w-1/2 md:w-1/4 p-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <span className="block text-sm text-gray-500">Fat (g)</span>
                      <span className="font-medium">{recipe.nutrition.fat}</span>
                    </div>
                  </div>
                  <div className="w-1/2 md:w-1/4 p-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <span className="block text-sm text-gray-500">Carbs (g)</span>
                      <span className="font-medium">{recipe.nutrition.carbs}</span>
                    </div>
                  </div>
                  <div className="w-1/2 md:w-1/4 p-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <span className="block text-sm text-gray-500">Protein (g)</span>
                      <span className="font-medium">{recipe.nutrition.protein}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Storage Instructions */}
            {recipe.storage && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Storage Instructions</h2>
                <p className="text-gray-700">{recipe.storage}</p>
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
            
            {/* Nutritional Comparison */}
            {recipe.nutritional_comparison && (
              <div className="p-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Nutritional Comparison</h2>
                <p className="text-gray-700">{recipe.nutritional_comparison}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
