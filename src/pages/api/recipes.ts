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

// Get recipes by brand
function getRecipesByBrand(brandName: string): Recipe[] {
  const recipes = getRecipes();
  return recipes.filter(recipe => recipe.brand_name === brandName);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, brand, action } = req.query;
  
  try {
    if (action === 'count') {
      // Return the count of recipes
      const recipes = getRecipes();
      return res.status(200).json({ count: recipes.length });
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
