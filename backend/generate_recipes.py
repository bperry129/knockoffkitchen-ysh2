import pandas as pd
import json
import random
import asyncio
import requests
import argparse
import os
import time
import uuid
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession

from database import AsyncSessionLocal
from models import Recipe
from schemas import RecipeCreate
from crud import create_recipe
from deepseek_api import generate_recipe, parse_recipe_data

# Sample ingredients for different chip types
CHIP_INGREDIENTS = {
    "Original": [
        "2 cups all-purpose flour",
        "1 tsp salt",
        "1/2 tsp baking powder",
        "2 tbsp vegetable oil",
        "1/2 cup water",
        "1 tsp potato starch",
        "1/2 tsp onion powder",
        "1/4 tsp garlic powder"
    ],
    "Sour Cream & Onion": [
        "2 cups all-purpose flour",
        "1 tsp salt",
        "1/2 tsp baking powder",
        "2 tbsp vegetable oil",
        "1/2 cup water",
        "1 tsp potato starch",
        "2 tbsp dried onion flakes",
        "1 tbsp sour cream powder",
        "1/2 tsp garlic powder",
        "1/4 tsp dried dill"
    ],
    "Cheddar Cheese": [
        "2 cups all-purpose flour",
        "1 tsp salt",
        "1/2 tsp baking powder",
        "2 tbsp vegetable oil",
        "1/2 cup water",
        "1 tsp potato starch",
        "2 tbsp cheddar cheese powder",
        "1/2 tsp onion powder",
        "1/4 tsp paprika"
    ],
    "BBQ": [
        "2 cups all-purpose flour",
        "1 tsp salt",
        "1/2 tsp baking powder",
        "2 tbsp vegetable oil",
        "1/2 cup water",
        "1 tsp potato starch",
        "1 tbsp smoked paprika",
        "1 tbsp brown sugar",
        "1 tsp onion powder",
        "1/2 tsp garlic powder",
        "1/4 tsp cayenne pepper"
    ],
    "Chili": [
        "2 cups all-purpose flour",
        "1 tsp salt",
        "1/2 tsp baking powder",
        "2 tbsp vegetable oil",
        "1/2 cup water",
        "1 tsp potato starch",
        "1 tbsp chili powder",
        "1 tsp paprika",
        "1/2 tsp cumin",
        "1/2 tsp garlic powder",
        "1/4 tsp cayenne pepper"
    ]
}

# Default ingredients if no specific flavor is matched
DEFAULT_INGREDIENTS = [
    "2 cups all-purpose flour",
    "1 tsp salt",
    "1/2 tsp baking powder",
    "2 tbsp vegetable oil",
    "1/2 cup water",
    "1 tsp potato starch",
    "1 tbsp mixed seasonings (adjust to match flavor)"
]

# Basic instructions for making homemade chips
BASIC_INSTRUCTIONS = """
1. In a large bowl, mix flour, salt, baking powder, and potato starch.
2. Add vegetable oil and mix until the mixture resembles coarse crumbs.
3. Gradually add water, mixing until a dough forms.
4. Knead the dough for about 5 minutes until smooth.
5. Divide the dough into small portions and roll each portion very thin (about 1/16 inch).
6. Cut into desired shapes or use a cookie cutter for uniform chips.
7. Mix all the seasonings in a small bowl.
8. Lightly brush the rolled dough with water and sprinkle with the seasoning mix.
9. Bake at 375°F (190°C) for 10-12 minutes or until crisp and lightly golden.
10. Allow to cool completely before serving or storing in an airtight container.
"""

# Sample nutritional info template
NUTRITIONAL_INFO_TEMPLATE = {
    "calories": lambda: random.randint(140, 180),
    "protein": lambda: f"{random.randint(1, 3)}g",
    "carbs": lambda: f"{random.randint(15, 25)}g",
    "fat": lambda: f"{random.randint(7, 12)}g",
    "sugar": lambda: f"{random.randint(0, 2)}g",
    "fiber": lambda: f"{random.randint(0, 2)}g",
    "sodium": lambda: f"{random.randint(150, 250)}mg"
}

# Sample FAQs
SAMPLE_FAQS = [
    {
        "question": "How long do homemade chips stay fresh?",
        "answer": "When stored in an airtight container, homemade chips typically stay fresh for 3-5 days."
    },
    {
        "question": "Can I use a different type of flour?",
        "answer": "Yes, you can experiment with whole wheat flour or gluten-free flour blends, though the texture may vary slightly."
    },
    {
        "question": "Can I fry these instead of baking?",
        "answer": "Absolutely! Deep fry at 350°F (175°C) for about 2-3 minutes until golden and crispy."
    },
    {
        "question": "How can I make these chips spicier?",
        "answer": "Add more cayenne pepper or a pinch of ghost pepper powder to the seasoning mix for extra heat."
    },
    {
        "question": "Can I make these in advance for a party?",
        "answer": "Yes, you can make them 1-2 days in advance and store in an airtight container."
    }
]

def fetch_product_info(product_name, brand_name):
    """Return mock product information without making a network request"""
    print(f"Using mock product info for: {brand_name} {product_name}")
    return {
        "title": f"{brand_name} {product_name}",
        "description": f"Delicious {product_name} chips from {brand_name}.",
        "ingredients": "Potatoes, Vegetable Oil, Salt, and various seasonings."
    }

def get_ingredients_for_flavor(product_name):
    """Get appropriate ingredients based on the product flavor"""
    for flavor, ingredients in CHIP_INGREDIENTS.items():
        if flavor.lower() in product_name.lower():
            return ingredients
    return DEFAULT_INGREDIENTS

def generate_nutritional_info():
    """Generate random nutritional information"""
    return {key: value() for key, value in NUTRITIONAL_INFO_TEMPLATE.items()}

def get_random_faqs(count=3):
    """Get a random selection of FAQs"""
    return random.sample(SAMPLE_FAQS, min(count, len(SAMPLE_FAQS)))

# Predefined categories for automatic categorization
PRODUCT_CATEGORIES = {
    "Sauce": ["sauce", "ketchup", "mustard", "mayo", "dressing", "gravy", "marinade"],
    "Condiments": ["relish", "pickle", "spread", "jam", "jelly", "honey", "syrup"],
    "Chips": ["chips", "crisps", "crackers", "wafers"],
    "Cookies": ["cookie", "biscuit", "wafer", "oreo", "shortbread"],
    "Candy": ["candy", "chocolate", "gum", "mint", "sweet", "lollipop", "toffee"],
    "Beverages": ["drink", "soda", "pop", "juice", "tea", "coffee", "water", "beer", "wine"],
    "Snacks": ["snack", "popcorn", "pretzel", "nuts", "trail mix", "granola"],
    "Baked Goods": ["bread", "roll", "bun", "muffin", "cake", "pastry", "donut", "bagel"],
    "Breakfast": ["cereal", "oatmeal", "pancake", "waffle", "syrup"],
    "Dairy": ["milk", "cheese", "yogurt", "butter", "cream", "ice cream"],
    "Desserts": ["dessert", "pudding", "pie", "brownie", "ice cream"],
    "Frozen Foods": ["frozen", "pizza", "ice cream", "popsicle"],
    "Meat": ["beef", "chicken", "pork", "turkey", "sausage", "bacon", "ham"],
    "Seafood": ["fish", "shrimp", "crab", "lobster", "salmon", "tuna"],
    "Spices": ["spice", "seasoning", "herb", "salt", "pepper"],
    "Pasta": ["pasta", "noodle", "spaghetti", "macaroni", "ramen"]
}

def categorize_product(product_name, brand_name, provided_category=None):
    """
    Automatically categorize a product based on its name and brand
    
    Args:
        product_name: Name of the product
        brand_name: Name of the brand
        provided_category: Category provided in the data (if any)
        
    Returns:
        String containing the determined category
    """
    # If a category was provided and it's not empty, use it as a starting point
    if provided_category and provided_category.strip():
        # Check if the provided category matches or is similar to one of our predefined categories
        for category, keywords in PRODUCT_CATEGORIES.items():
            if provided_category.lower() in [cat.lower() for cat in [category] + keywords]:
                return category
    
    # If no category was provided or it didn't match our predefined categories,
    # try to determine the category based on the product name
    product_full = f"{product_name} {brand_name}".lower()
    
    for category, keywords in PRODUCT_CATEGORIES.items():
        for keyword in keywords:
            if keyword.lower() in product_full:
                return category
    
    # If no match was found, return a default category
    return "Other"

def generate_recipe_data(product_name, brand_name, category=None):
    """Generate recipe data for a product"""
    # Automatically categorize the product if no category is provided or if it's empty
    if not category or not category.strip():
        category = categorize_product(product_name, brand_name)
    else:
        # Try to standardize the provided category
        category = categorize_product(product_name, brand_name, category)
    
    # Get basic ingredients based on flavor
    ingredients = get_ingredients_for_flavor(product_name)
    
    # Fetch additional product information from external API
    product_info = fetch_product_info(product_name, brand_name)
    
    # Enhance recipe description if product info is available
    description = f"Learn how to make delicious homemade {product_name} chips that taste just like the original {brand_name} version but healthier and more affordable."
    if product_info and 'description' in product_info:
        description = f"{description} {product_info['description']}"
    
    return {
        "title": f"Homemade {product_name} Copycat Recipe",
        "brand_name": brand_name,
        "category": category,
        "prep_time": random.randint(15, 30),
        "cook_time": random.randint(10, 20),
        "total_time": random.randint(30, 50),
        "yield": f"{random.randint(4, 8)} servings",  # Use 'yield' as the alias defined in schemas.py
        "ingredients": {"items": ingredients},
        "instructions": BASIC_INSTRUCTIONS,
        "storage_instructions": "Store in an airtight container for up to 5 days.",
        "recipe_variations": "Try adding different herbs and spices to create your own unique flavors.",
        "special_equipment": "Rolling pin, baking sheets, parchment paper",
        "pro_tips": "For extra crispy chips, roll the dough as thin as possible without tearing.",
        "nutritional_info": generate_nutritional_info(),
        "faq": get_random_faqs(),
        "serving_suggestions": "Serve with your favorite dip or enjoy on their own.",
        "cost_comparison": f"Homemade version costs approximately 60% less than store-bought {product_name}.",
        "seo_meta_description": description
    }

def save_recipe_to_json(recipe_data, output_dir="recipes_output"):
    """Save recipe data to a JSON file"""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate a unique filename based on the recipe title
    safe_title = recipe_data["title"].replace(" ", "_").replace(":", "").replace("/", "_")
    filename = f"{safe_title}_{uuid.uuid4().hex[:8]}.json"
    filepath = os.path.join(output_dir, filename)
    
    # Save the recipe data to a JSON file
    with open(filepath, "w") as f:
        json.dump(recipe_data, f, indent=2)
    
    print(f"Saved recipe to {filepath}")
    return filepath

async def process_csv(csv_path, limit=None, dry_run=False, use_ai=True):
    """Process CSV file and generate recipes"""
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        # Try reading with different separator if standard comma doesn't work
        try:
            df = pd.read_csv(csv_path, sep=None, engine='python')
        except Exception as e:
            print(f"Still couldn't read the file: {e}")
            return
    
    print(f"Successfully read CSV file with {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")
    
    # Check if the expected columns exist
    required_columns = ['Product', 'Brand', 'Category']
    if not all(col in df.columns for col in required_columns):
        print(f"CSV is missing required columns. Available columns: {df.columns.tolist()}")
        # Try to infer column names if they're not exactly as expected
        if len(df.columns) >= 3:
            print("Attempting to use the first three columns as Product, Brand, and Category")
            df.columns = required_columns + list(df.columns[3:])
        else:
            print("Not enough columns in the CSV file")
            return
    
    # Limit the number of rows if specified
    if limit and limit > 0:
        df = df.head(limit)
        print(f"Processing limited to {limit} rows")
    
    # Process each row
    if not dry_run:
        # Process each row and save to JSON files
        for index, row in df.iterrows():
            try:
                product_name = row['Product']
                brand_name = row['Brand']
                provided_category = row['Category']
                
                # Automatically categorize the product
                category = categorize_product(product_name, brand_name, provided_category)
                
                print(f"Processing: {product_name} - {brand_name} - Category: {category} (Original: {provided_category})")
                
                # Generate recipe data based on AI or template
                if use_ai:
                    try:
                        print(f"Generating recipe using DeepSeek API...")
                        ai_recipe_data = generate_recipe(product_name, brand_name, category)
                        
                        if ai_recipe_data:
                            print(f"AI recipe data received, parsing...")
                            # Parse and normalize the AI-generated recipe data
                            recipe_data = parse_recipe_data(ai_recipe_data)
                            
                            # Add brand and category information
                            recipe_data["brand_name"] = brand_name
                            
                            # Use the automatically categorized category
                            recipe_data["category"] = category
                            
                            print(f"Successfully generated AI recipe for {product_name}")
                        else:
                            print(f"Failed to generate AI recipe for {product_name}, falling back to template")
                            recipe_data = generate_recipe_data(product_name, brand_name, category)
                    except Exception as e:
                        import traceback
                        print(f"Error in AI recipe generation: {e}")
                        print(f"Traceback: {traceback.format_exc()}")
                        print(f"Falling back to template-based generation")
                        recipe_data = generate_recipe_data(product_name, brand_name, category)
                else:
                    # Use template-based generation
                    print(f"Using template-based generation for {product_name}...")
                    recipe_data = generate_recipe_data(product_name, brand_name, category)
                
                # Save recipe to JSON file
                filepath = save_recipe_to_json(recipe_data)
                print(f"Saved recipe for {product_name} to {filepath}")
                
                # Add a small delay between API requests to avoid rate limiting
                if use_ai and index < len(df) - 1:
                    print("Waiting 2 seconds before next API request...")
                    time.sleep(2)
                
            except Exception as e:
                print(f"Error processing row {index}: {e}")
    else:
        # Dry run mode - just print what would be processed
        for index, row in df.iterrows():
            product_name = row['Product']
            brand_name = row['Brand']
            category = row['Category']
            print(f"Would process: {product_name} - {brand_name} - {category}")
    
    print("Recipe generation complete!")

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description='Generate copycat recipes from a CSV file of products')
    parser.add_argument('--csv', type=str, default=r"C:\Users\bperr\Desktop\pringles_products_clean.csv",
                        help='Path to the CSV file containing product data')
    parser.add_argument('--limit', type=int, default=3,  # Changed default to 3
                        help='Limit the number of recipes to generate (0 for all)')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='Run without saving to database (default: True)')
    parser.add_argument('--save', action='store_true',
                        help='Save recipes to JSON files (overrides --dry-run)')
    parser.add_argument('--no-ai', action='store_true',
                        help='Disable AI-based recipe generation (use template-based generation instead)')
    return parser.parse_args()

async def main():
    """Main function to parse arguments and process CSV"""
    args = parse_args()
    
    # Validate CSV file path
    if not os.path.exists(args.csv):
        print(f"Error: CSV file not found at {args.csv}")
        return
    
    # Determine whether to use AI-based recipe generation
    use_ai = not args.no_ai
    
    # Determine whether to save recipes
    dry_run = args.dry_run
    if args.save:
        dry_run = False
        print("Save mode enabled - recipes will be saved to JSON files")
    else:
        print("Dry run mode enabled - recipes will NOT be saved")
    
    await process_csv(args.csv, args.limit, dry_run, use_ai)

if __name__ == "__main__":
    asyncio.run(main())
