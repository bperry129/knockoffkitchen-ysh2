import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Define the Recipe interface
interface Recipe {
  id: number;
  title: string;
  brand_name: string;
  category: string;
  image?: string;
  imageUrl?: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: string;
  slug: string;
  yield: string;
  ingredients: {
    items: string[];
  };
  instructions: string;
  storage_instructions: string;
  pro_tips: string;
  nutritional_info: {
    text: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  serving_suggestions: string;
  cost_comparison: string;
  seo_meta_description: string;
}

// Default placeholder image URL
const DEFAULT_RECIPE_IMAGE = '/images/default-recipe.png';

function getRecipes(): Recipe[] {
  const recipesDir = path.join(process.cwd(), 'backend', 'recipes_output');
  
  // Check if directory exists
  if (!fs.existsSync(recipesDir)) {
    console.warn(`Recipes directory not found: ${recipesDir}`);
    return [];
  }
  
  try {
    const fileNames = fs.readdirSync(recipesDir);
    const recipes = fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map((fileName, index) => {
        const filePath = path.join(recipesDir, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const recipeData = JSON.parse(fileContents);
        
        // Generate a slug from the title
        const title = recipeData.title || fileName.replace('.json', '');
        const slug = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Determine difficulty based on prep and cook time
        const prepTime = recipeData.prep_time || 0;
        const cookTime = recipeData.cook_time || 0;
        const totalTime = prepTime + cookTime;
        
        let difficulty = 'Easy';
        if (totalTime > 60) {
          difficulty = 'Hard';
        } else if (totalTime > 30) {
          difficulty = 'Medium';
        }
        
        // Format times
        const formatTime = (minutes: number) => {
          if (minutes < 60) {
            return `${minutes} min`;
          }
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
        };
        
        return {
          id: index + 1,
          ...recipeData,
          difficulty,
          slug,
          prepTime: formatTime(prepTime),
          cookTime: formatTime(cookTime),
          totalTime: formatTime(totalTime),
          category: recipeData.category || 'Condiments',
          imageUrl: recipeData.image_url || DEFAULT_RECIPE_IMAGE
        };
      });
    
    return recipes;
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
}

function getRecipeBySlug(slug: string): Recipe | null {
  const recipes = getRecipes();
  return recipes.find(recipe => recipe.slug === slug) || null;
}

// Get all unique brands from recipes
function getBrands(): { name: string; slug: string; count: number }[] {
  const recipes = getRecipes();
  const brandMap = new Map<string, number>();
  
  recipes.forEach(recipe => {
    const brand = recipe.brand_name;
    if (brand) {
      brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
    }
  });
  
  return Array.from(brandMap.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
    count
  }));
}

// Get all unique categories from recipes
function getCategories(): { name: string; slug: string; count: number; description: string }[] {
  const recipes = getRecipes();
  const categoryMap = new Map<string, number>();
  
  recipes.forEach(recipe => {
    const category = recipe.category;
    if (category) {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  });
  
  return Array.from(categoryMap.entries()).map(([name, count]) => {
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Generate a description based on the category name
    const description = `Delicious homemade ${name.toLowerCase()} recipes that taste just like your favorite store-bought brands but healthier and more affordable.`;
    
    return {
      name,
      slug,
      count,
      description
    };
  });
}

// Get recipes by brand
function getRecipesByBrand(brandName: string): Recipe[] {
  const recipes = getRecipes();
  return recipes.filter(recipe => recipe.brand_name === brandName);
}

// Search recipes by query
function searchRecipes(query: string): Recipe[] {
  const recipes = getRecipes();
  const searchTerms = query.toLowerCase().split(' ');
  
  return recipes.filter(recipe => {
    // Check if any search term is in the title, brand name, or category
    return searchTerms.some(term => 
      recipe.title.toLowerCase().includes(term) || 
      recipe.brand_name.toLowerCase().includes(term) || 
      recipe.category.toLowerCase().includes(term)
    );
  });
}

// Get suggestions for autocomplete
function getSuggestions(query: string): string[] {
  const recipes = getRecipes();
  const brands = getBrands();
  const categories = getCategories();
  const searchTerm = query.toLowerCase();
  
  // Get suggestions from recipe titles
  const titleSuggestions = recipes
    .filter(recipe => recipe.title.toLowerCase().includes(searchTerm))
    .map(recipe => recipe.title)
    .slice(0, 5);
  
  // Get suggestions from brand names
  const brandSuggestions = brands
    .filter(brand => brand.name.toLowerCase().includes(searchTerm))
    .map(brand => brand.name)
    .slice(0, 3);
  
  // Get suggestions from categories
  const categorySuggestions = categories
    .filter(category => category.name.toLowerCase().includes(searchTerm))
    .map(category => category.name)
    .slice(0, 3);
  
  // Combine and deduplicate suggestions
  return [...new Set([...titleSuggestions, ...brandSuggestions, ...categorySuggestions])].slice(0, 10);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, brand, action, query } = req.query;
  
  try {
    if (action === 'count') {
      // Return the count of recipes
      const recipes = getRecipes();
      return res.status(200).json({ count: recipes.length });
    } else if (action === 'search' && query) {
      // Search recipes by query
      const results = searchRecipes(query as string);
      return res.status(200).json(results);
    } else if (action === 'suggestions' && query) {
      // Get suggestions for autocomplete
      const suggestions = getSuggestions(query as string);
      return res.status(200).json(suggestions);
    } else if (slug) {
      // Return a specific recipe by slug
      const recipe = getRecipeBySlug(slug as string);
      if (recipe) {
        return res.status(200).json(recipe);
      } else {
        return res.status(404).json({ error: 'Recipe not found' });
      }
    } else if (brand) {
      // Return recipes by brand
      const recipes = getRecipesByBrand(brand as string);
      return res.status(200).json(recipes);
    } else if (action === 'brands') {
      // Return all brands
      const brands = getBrands();
      return res.status(200).json(brands);
    } else if (action === 'categories') {
      // Return all categories
      const categories = getCategories();
      return res.status(200).json(categories);
    } else {
      // Return all recipes
      const recipes = getRecipes();
      return res.status(200).json(recipes);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
