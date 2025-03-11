#!/usr/bin/env python
import asyncio
import aiohttp
import pandas as pd
import json
import os
import time
import random
from typing import List, Dict, Any
import logging
import sys
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("recipe_generation.log"),
        logging.StreamHandler()
    ]
)

# Constants
MAX_CONCURRENT_REQUESTS = 20  # Adjust based on API limits
OUTPUT_DIR = "recipes_output"
CHECKPOINT_FILE = "generation_checkpoint.json"
OPENROUTER_API_KEY = "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"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def generate_recipe_async(session, product_name, brand_name, image_url):
    """Async version of recipe generation using DeepSeek API"""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://copycat-recipes.com"
    }
    
    # Check if brand name is already in product name to avoid duplication
    if brand_name.lower() in product_name.lower():
        full_product_name = product_name
    else:
        full_product_name = f"{brand_name} {product_name}"
    
    # Create the prompt
    product_info = f"Generate a unique, creative homemade copycat recipe for {full_product_name}. This should closely replicate the original product using common household ingredients while allowing for customization and improved nutritional value. Be extremely detailed and thorough in your analysis of the original product's flavor profile, texture, and appearance to create an authentic copycat recipe."
    
    title_info = f"""Create a UNIQUE, CATCHY, and CREATIVE title that contains relevant SEO keywords.
Make sure the brand name appears EXACTLY ONCE in the title.
The product is '{full_product_name}' - do not repeat '{brand_name}' if it's already part of the product name.
Example formats: 
- "Ultimate Homemade {full_product_name}: Better Than The Original"
- "Secret Recipe: Authentic {full_product_name} Made At Home"
- "Perfectly Crafted DIY {full_product_name} That Will Amaze Your Friends"
"""
    
    intro_info = f"Write an EXTENSIVE, keyword-rich SEO description (at least 300-400 words) about {full_product_name}. Include phrases like 'homemade', 'make at home', 'copycat recipe', 'DIY', 'better than store-bought', etc. Thoroughly explain the history and popularity of {full_product_name}, analyze its unique flavor profile and texture characteristics, and detail the numerous benefits of making it at home (healthier ingredients, cost savings, customization options, etc.). Include personal anecdotes or stories about enjoying this product and why people love it so much. Make this introduction HIGHLY DETAILED and UNIQUE compared to other product descriptions."
    
    # Use a non-f-string for the JSON example part
    json_example = """
{
  "title": "Recipe title",
  "introduction": "Introduction text",
  "prep_time": 15,
  "cook_time": 30,
  "total_time": 45,
  "yield": "4 servings",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "instructions": ["Step 1", "Step 2"],
  "storage_instructions": "Storage instructions text",
  "pro_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "nutritional_comparison": "Nutritional comparison text",
  "faq": [
    {"q": "Question 1", "a": "Answer 1"},
    {"q": "Question 2", "a": "Answer 2"}
  ],
  "serving_suggestions": ["Suggestion 1", "Suggestion 2"],
  "cost_comparison": "Cost comparison text",
  "image_url": "URL to image"
}
"""
    
    # Combine all parts of the prompt
    prompt = f"""
{product_info}

### **Recipe Title:**
- {title_info}

### **Introduction (SEO-Optimized)**
- {intro_info}
- Mention benefits of a homemade version (healthier, customizable, cost-effective).
- Include a **personal anecdote** or a **story** to make it engaging.

### **Recipe Details**
Provide the following metadata in a structured format:
- **Prep Time:** X minutes
- **Cook Time:** X minutes
- **Total Time:** X minutes
- **Yield:** X servings

### **Ingredients**
Provide a **detailed ingredient list** in both **US and metric measurements**, maintaining accuracy and proportions.

### **Instructions**
Step-by-step cooking instructions that:
1. Explain all necessary steps clearly.
2. Include cooking techniques and timing.

### **Storage Instructions**
- Explain how long the product lasts in the fridge, freezer, or pantry.

### **Pro Tips**
Provide **3 expert-level cooking tips** to perfect the recipe.

### **Nutritional Comparison**
Create a **detailed comparison** between the homemade and store-bought version. Include specific nutritional values (calories, fat, sodium, carbs, protein, etc.) for both versions. Explain the main health benefits of the homemade version, such as reduced preservatives, artificial ingredients, sodium, or unhealthy fats. This section should be at least 100 words and very detailed.

### **Common Questions & Troubleshooting**
Include an **FAQ section** with 5-7 common questions.

### **Serving Suggestions**
List creative ways to use the homemade product.

### **Cost Comparison**
Provide a **detailed cost breakdown** with actual prices. Calculate the approximate cost of each ingredient needed for the homemade version (e.g., "$0.50 worth of flour, $0.25 worth of sugar") and the total cost per serving. Compare this to the actual retail price of the store-bought version. Include the percentage savings and the annual savings for someone who regularly consumes this product. This section should be at least 100 words with specific dollar amounts.

IMPORTANT: Format your response as a JSON object with the following structure:
{json_example}

IMPORTANT: Include the image_url in your response: {image_url}
"""
    
    data = {
        "model": "deepseek/deepseek-r1-distill-llama-70b",
        "messages": [
            {"role": "system", "content": "You are a professional chef and recipe developer specializing in creating copycat recipes of popular branded products. IMPORTANT: Do NOT duplicate brand names in your recipes. If the product name already includes the brand (e.g., 'Heinz 57 Sauce'), do not add the brand name again (avoid 'Heinz Heinz 57 Sauce'). Provide extremely detailed nutritional comparisons between homemade and store-bought versions. Include specific cost breakdowns with actual dollar amounts for both homemade ingredients and store-bought products. Your content should be keyword-rich and SEO-optimized, focusing on terms like 'homemade', 'copycat recipe', 'make at home', etc."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2500
    }
    
    # Add jitter to avoid rate limiting
    await asyncio.sleep(random.uniform(0.1, 0.5))
    
    try:
        async with session.post("https://openrouter.ai/api/v1/chat/completions", 
                               headers=headers, json=data) as response:
            if response.status != 200:
                error_text = await response.text()
                logging.error(f"API error for {product_name}: {response.status} - {error_text}")
                return None
                
            result = await response.json()
            if 'choices' in result and len(result['choices']) > 0:
                content = result['choices'][0]['message']['content']
                
                # Extract JSON content
                try:
                    json_start = content.find('{')
                    json_end = content.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_content = content[json_start:json_end]
                        recipe_data = json.loads(json_content)
                        
                        # Ensure image_url is included
                        if 'image_url' not in recipe_data:
                            recipe_data['image_url'] = image_url
                            
                        return recipe_data
                    else:
                        logging.error(f"Could not find JSON content in response for {product_name}")
                        return None
                except json.JSONDecodeError as e:
                    logging.error(f"JSON parsing error for {product_name}: {e}")
                    logging.error(f"Raw response: {content}")
                    return None
            else:
                logging.error(f"No choices in response for {product_name}")
                return None
    except Exception as e:
        logging.error(f"Request error for {product_name}: {e}")
        return None
    
    return None

def parse_recipe_data(recipe_data: Dict[str, Any]) -> Dict[str, Any]:
    """Parse and normalize the recipe data from the API response"""
    # Extract and normalize fields
    parsed_data = {}
    
    # Basic fields
    parsed_data["title"] = recipe_data.get("title", "")
    parsed_data["prep_time"] = int(recipe_data.get("prep_time", 0))
    parsed_data["cook_time"] = int(recipe_data.get("cook_time", 0))
    parsed_data["total_time"] = int(recipe_data.get("total_time", 0))
    parsed_data["yield"] = recipe_data.get("yield", "")
    
    # Convert ingredients list to the expected format
    parsed_data["ingredients"] = {"items": recipe_data.get("ingredients", [])}
    
    # Convert instructions list to a string with numbered steps
    instructions = recipe_data.get("instructions", [])
    if isinstance(instructions, list):
        parsed_data["instructions"] = "\n".join([f"{i+1}. {step}" for i, step in enumerate(instructions)])
    else:
        parsed_data["instructions"] = str(instructions)
    
    # Other fields
    parsed_data["storage_instructions"] = recipe_data.get("storage_instructions", "")
    parsed_data["pro_tips"] = "\n".join(recipe_data.get("pro_tips", []))
    parsed_data["nutritional_info"] = {"text": recipe_data.get("nutritional_comparison", "")}
    
    # Convert FAQ to the expected format
    faq_items = recipe_data.get("faq", [])
    # Ensure faq_items is properly formatted
    if isinstance(faq_items, list):
        # Make sure each FAQ item has the correct format
        formatted_faq = []
        for item in faq_items:
            # Check for both formats: {"question": "...", "answer": "..."} and {"q": "...", "a": "..."}
            if isinstance(item, dict):
                question = item.get("question") or item.get("q", "")
                answer = item.get("answer") or item.get("a", "")
                if question and answer:
                    formatted_faq.append({
                        "question": str(question),
                        "answer": str(answer)
                    })
        parsed_data["faq"] = formatted_faq
    else:
        # If it's not a list, create an empty list
        parsed_data["faq"] = []
    
    # Other fields
    parsed_data["serving_suggestions"] = "\n".join(recipe_data.get("serving_suggestions", []))
    parsed_data["cost_comparison"] = recipe_data.get("cost_comparison", "")
    parsed_data["seo_meta_description"] = recipe_data.get("introduction", "")[:160] if recipe_data.get("introduction") else ""
    parsed_data["image_url"] = recipe_data.get("image_url", "")
    
    return parsed_data

def save_recipe_to_json(recipe_data, product_name, brand_name):
    """Save recipe data to a JSON file with a clean filename"""
    if not recipe_data:
        return None
        
    # Create a safe filename
    safe_title = recipe_data.get("title", f"{brand_name}_{product_name}")
    safe_title = safe_title.replace(" ", "_").replace(":", "").replace("/", "_")
    filename = f"{safe_title}_{uuid.uuid4().hex[:8]}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Add brand name if not in recipe data
    if "brand_name" not in recipe_data:
        recipe_data["brand_name"] = brand_name
        
    # Parse and normalize the recipe data
    parsed_data = parse_recipe_data(recipe_data)
    parsed_data["brand_name"] = brand_name
    
    # Save to file
    with open(filepath, "w") as f:
        json.dump(parsed_data, f, indent=2)
        
    logging.info(f"Saved recipe to {filepath}")
    return filepath

def load_checkpoint():
    """Load checkpoint of processed products"""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            return json.load(f)
    return {"processed": []}

def save_checkpoint(processed):
    """Save checkpoint of processed products"""
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump({"processed": processed}, f)

async def process_batch(session, products, processed_ids):
    """Process a batch of products concurrently"""
    tasks = []
    for product in products:
        # Handle different column name formats
        product_name = product.get("product name", product.get("productname", ""))
        brand_name = product.get("Brand", "")
        image_url = product.get("image_url", "")
        
        product_id = product.get("id", f"{product_name}_{brand_name}")
        if product_id in processed_ids:
            logging.info(f"Skipping already processed product: {product_name}")
            continue
            
        task = asyncio.create_task(
            generate_recipe_async(
                session, 
                product_name, 
                brand_name, 
                image_url
            )
        )
        tasks.append((product, task))
    
    # Wait for all tasks to complete
    for product, task in tasks:
        try:
            # Handle different column name formats
            product_name = product.get("product name", product.get("productname", ""))
            brand_name = product.get("Brand", "")
            
            recipe_data = await task
            if recipe_data:
                save_recipe_to_json(recipe_data, product_name, brand_name)
                product_id = product.get("id", f"{product_name}_{brand_name}")
                processed_ids.append(product_id)
                # Save checkpoint after each successful recipe
                save_checkpoint(processed_ids)
        except Exception as e:
            product_name = product.get("product name", product.get("productname", ""))
            logging.error(f"Error processing {product_name}: {e}")
    
    return processed_ids

async def main(csv_path, batch_size=MAX_CONCURRENT_REQUESTS):
    """Main function to process CSV file with concurrent requests"""
    # Load CSV
    try:
        df = pd.read_csv(csv_path)
        logging.info(f"Loaded CSV with {len(df)} products")
    except Exception as e:
        logging.error(f"Error loading CSV: {e}")
        return
    
    # Add ID column if not exists
    if "id" not in df.columns:
        df["id"] = [f"product_{i}" for i in range(len(df))]
    
    # Load checkpoint
    checkpoint = load_checkpoint()
    processed_ids = checkpoint.get("processed", [])
    logging.info(f"Loaded checkpoint with {len(processed_ids)} processed products")
    
    # Convert to list of dicts
    products = df.to_dict("records")
    
    # Create batches
    total_products = len(products)
    batches = [products[i:i+batch_size] for i in range(0, total_products, batch_size)]
    logging.info(f"Split into {len(batches)} batches of size {batch_size}")
    
    # Process batches
    async with aiohttp.ClientSession() as session:
        for i, batch in enumerate(batches):
            logging.info(f"Processing batch {i+1}/{len(batches)}")
            processed_ids = await process_batch(session, batch, processed_ids)
            # Add a delay between batches to avoid rate limiting
            if i < len(batches) - 1:
                await asyncio.sleep(2)
    
    logging.info(f"Completed processing {len(processed_ids)}/{total_products} products")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python concurrent_recipe_generator.py <csv_path> [batch_size]")
        sys.exit(1)
        
    csv_path = sys.argv[1]
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else MAX_CONCURRENT_REQUESTS
    
    # Fix for Windows compatibility issue with aiodns
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main(csv_path, batch_size))
