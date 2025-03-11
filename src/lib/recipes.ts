// Client-side recipes.ts - uses API instead of direct filesystem access

export interface Recipe {
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
export const DEFAULT_RECIPE_IMAGE = '/images/knockoff.png';

// Synchronous functions for server components
export function getRecipes(): Recipe[] {
  // This is a client-side implementation that returns an empty array
  // The actual data will be fetched from the API
  return [];
}

export function getRecipeBySlug(slug: string): Recipe | null {
  // This is a client-side implementation that returns null
  // The actual data will be fetched from the API
  return null;
}

export function getBrands(): { name: string; slug: string; count: number }[] {
  // This is a client-side implementation that returns an empty array
  // The actual data will be fetched from the API
  return [];
}

export function getBrandBySlug(slug: string): { name: string; slug: string; count: number } | null {
  // This is a client-side implementation that returns null
  // The actual data will be fetched from the API
  return null;
}

export function getRecipesByBrand(brandName: string): Recipe[] {
  // This is a client-side implementation that returns an empty array
  // The actual data will be fetched from the API
  return [];
}

// Get the base URL for API requests
const getBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Default to localhost in development
  return 'http://localhost:3000';
};

// Client-side function to fetch recipes from API
export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Client-side function to fetch a recipe by slug
export async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes?slug=${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch recipe');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipe with slug ${slug}:`, error);
    return null;
  }
}

// Client-side function to fetch brands
export async function fetchBrands(): Promise<{ name: string; slug: string; count: number }[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes?action=brands`);
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

// Client-side function to fetch a brand by slug
export async function fetchBrandBySlug(slug: string): Promise<{ name: string; slug: string; count: number } | null> {
  try {
    const brands = await fetchBrands();
    return brands.find(brand => brand.slug === slug) || null;
  } catch (error) {
    console.error(`Error fetching brand with slug ${slug}:`, error);
    return null;
  }
}

// Client-side function to fetch recipes by brand
export async function fetchRecipesByBrand(brandName: string): Promise<Recipe[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes?brand=${encodeURIComponent(brandName)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes by brand');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipes for brand ${brandName}:`, error);
    return [];
  }
}

// Client-side function to fetch recipe count
export async function fetchRecipeCount(): Promise<number> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/recipes?action=count`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe count');
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching recipe count:', error);
    return 0;
  }
}
