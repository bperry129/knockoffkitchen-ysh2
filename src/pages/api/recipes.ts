import { NextApiRequest, NextApiResponse } from 'next';

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

// Fetch recipes from PythonAnywhere API
async function getRecipes(): Promise<Recipe[]> {
  try {
    const backendUrl = process.env.BACKEND_API_URL || 'https://bperry129.pythonanywhere.com';
    const response = await fetch(`${backendUrl}/recipes`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const recipes = data.recipes || [];
    
    // Transform the data to match the Recipe interface
    return recipes.map((recipe: any, index: number) => {
      // Determine difficulty based on prep and cook time
      const prepTime = recipe.prep_time || 0;
      const cookTime = recipe.cook_time || 0;
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
        id: recipe.id || index + 1,
        title: recipe.title || '',
        brand_name: recipe.brand_name || '',
        category: recipe.category || 'Uncategorized',
        difficulty,
        slug: recipe.slug || '',
        prepTime: formatTime(prepTime),
        cookTime: formatTime(cookTime),
        totalTime: formatTime(totalTime),
        yield: recipe.yield || '4 servings',
        ingredients: recipe.ingredients || { items: [] },
        instructions: recipe.instructions || '',
        storage_instructions: recipe.storage_instructions || '',
        pro_tips: recipe.pro_tips || '',
        nutritional_info: recipe.nutritional_info || { text: '' },
        faq: recipe.faq || [],
        serving_suggestions: recipe.serving_suggestions || '',
        cost_comparison: recipe.cost_comparison || '',
        seo_meta_description: recipe.seo_meta_description || '',
        imageUrl: recipe.image_url || DEFAULT_RECIPE_IMAGE
      };
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Get a recipe by slug
async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const recipes = await getRecipes();
    return recipes.find(recipe => recipe.slug === slug) || null;
  } catch (error) {
    console.error(`Error getting recipe by slug ${slug}:`, error);
    return null;
  }
}

// Get all unique brands from recipes
async function getBrands(): Promise<{ name: string; slug: string; count: number }[]> {
  try {
    const recipes = await getRecipes();
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
  } catch (error) {
    console.error('Error getting brands:', error);
    return [];
  }
}

// Get all unique categories from recipes
async function getCategories(): Promise<{ name: string; slug: string; count: number; description: string }[]> {
  try {
    const recipes = await getRecipes();
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
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

// Get recipes by brand
async function getRecipesByBrand(brandName: string): Promise<Recipe[]> {
  try {
    const recipes = await getRecipes();
    return recipes.filter(recipe => recipe.brand_name === brandName);
  } catch (error) {
    console.error(`Error getting recipes by brand ${brandName}:`, error);
    return [];
  }
}

// Search recipes by query
async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const recipes = await getRecipes();
    const searchTerms = query.toLowerCase().split(' ');
    
    return recipes.filter(recipe => {
      // Check if any search term is in the title, brand name, or category
      return searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term) || 
        recipe.brand_name.toLowerCase().includes(term) || 
        recipe.category.toLowerCase().includes(term)
      );
    });
  } catch (error) {
    console.error(`Error searching recipes with query ${query}:`, error);
    return [];
  }
}

// Get suggestions for autocomplete
async function getSuggestions(query: string): Promise<string[]> {
  try {
    const recipes = await getRecipes();
    const brands = await getBrands();
    const categories = await getCategories();
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
  } catch (error) {
    console.error(`Error getting suggestions for query ${query}:`, error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, brand, action, query } = req.query;
  
  try {
    if (action === 'count') {
      // Return the count of recipes
      const recipes = await getRecipes();
      return res.status(200).json({ count: recipes.length });
    } else if (action === 'search' && query) {
      // Search recipes by query
      const results = await searchRecipes(query as string);
      return res.status(200).json(results);
    } else if (action === 'suggestions' && query) {
      // Get suggestions for autocomplete
      const suggestions = await getSuggestions(query as string);
      return res.status(200).json(suggestions);
    } else if (slug) {
      // Return a specific recipe by slug
      const recipe = await getRecipeBySlug(slug as string);
      if (recipe) {
        return res.status(200).json(recipe);
      } else {
        return res.status(404).json({ error: 'Recipe not found' });
      }
    } else if (brand) {
      // Return recipes by brand
      const recipes = await getRecipesByBrand(brand as string);
      return res.status(200).json(recipes);
    } else if (action === 'brands') {
      // Return all brands
      const brands = await getBrands();
      return res.status(200).json(brands);
    } else if (action === 'categories') {
      // Return all categories
      const categories = await getCategories();
      return res.status(200).json(categories);
    } else {
      // Return all recipes
      const recipes = await getRecipes();
      return res.status(200).json(recipes);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
