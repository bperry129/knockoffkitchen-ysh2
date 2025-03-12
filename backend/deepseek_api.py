import requests
import os
import json
import time
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variables
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_recipe(product_name, brand_name, category=None):
    """
    Generate a recipe using OpenRouter's DeepSeek model
    
    Args:
        product_name: Name of the product
        brand_name: Name of the brand
        category: Category of the product
        
    Returns:
        Dict containing the recipe data or None if an error occurred
    """
    # Create the prompt with the product and brand information
    product_info = f"Generate a unique, creative homemade copycat recipe for {brand_name} {product_name}. This should closely replicate the original product using common household ingredients while allowing for customization and improved nutritional value. Be extremely detailed and thorough in your analysis of the original product's flavor profile, texture, and appearance to create an authentic copycat recipe."
    
    # Include category information if provided
    if category:
        product_info += f" This recipe belongs to the '{category}' category."
    else:
        product_info += " IMPORTANT: You must categorize this recipe into ONE of the following categories based on the product type: Sauce, Condiments, Chips, Cookies, Candy, Beverages, Snacks, Baked Goods, Breakfast, Dairy, Desserts, Frozen Foods, Meat, Seafood, Spices, Pasta, Soups, Dips, Dressings, Jams & Preserves, Pickles, Bread, Crackers, Cereal, or Other. Choose the most specific and appropriate category that best describes this product."
    title_info = f"Create a UNIQUE, CATCHY, and CREATIVE title that contains relevant SEO keywords. ALWAYS include the brand name before the product name, but make each title distinctly different from other recipes. Be creative with adjectives and phrases. Example formats: \"Ultimate Homemade {brand_name} {product_name}: Better Than The Original\", \"Secret Recipe: Authentic {brand_name} {product_name} Made At Home\", \"Perfectly Crispy DIY {brand_name} {product_name} That Will Amaze Your Friends\", etc."
    intro_info = f"Write an EXTENSIVE, keyword-rich SEO description (at least 500-600 words) about {brand_name} {product_name}. Include phrases like 'homemade', 'make at home', 'copycat recipe', 'DIY', 'better than store-bought', 'kitchen hack', 'secret recipe', 'restaurant quality', 'gourmet', 'authentic taste', 'family favorite', 'crowd-pleaser', 'budget-friendly', 'pantry staples', 'easy recipe', 'perfect replica', 'taste test approved', 'customizable', 'allergen-free option', 'healthier alternative', 'no preservatives', 'fresh ingredients', 'artisanal', 'handcrafted', etc. Thoroughly explain the history and popularity of {brand_name} {product_name}, analyze its unique flavor profile and texture characteristics in great detail, and extensively cover the numerous benefits of making it at home (healthier ingredients, cost savings, customization options, allergen control, freshness, etc.). Include personal anecdotes or stories about enjoying this product and why people love it so much. Discuss how this recipe compares to the original product and what makes it special. Include regional variations or cultural significance if applicable. Describe the sensory experience in vivid detail - the aroma, texture, mouthfeel, and flavor notes. Mention seasonal variations or special occasions when this recipe is particularly popular. Discuss any nostalgic connections people have with the original product and how making it at home can recreate those memories. Make this introduction HIGHLY DETAILED and UNIQUE compared to other product descriptions, with strategic keyword placement throughout the text. Use varied sentence structures and engaging language to keep readers interested while maintaining excellent SEO value."
    
    # Use a non-f-string for the JSON example part
    json_example = """
{
  "title": "Recipe title",
  "category": "Recipe category (e.g., Sauce, Condiments, Chips, Cookies, etc.)",
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
  "cost_comparison": "Cost comparison text"
}
"""
    
    # Combine all parts of the prompt
    prompt = f"""
{product_info}

### **Recipe Category:**
- If not already specified, suggest an appropriate category for this recipe from the following options: Sauce, Condiments, Chips, Cookies, Candy, Beverages, Snacks, Baked Goods, Breakfast, Dairy, Desserts, Frozen Foods, Meat, Seafood, Spices, Pasta, or Other.
- Explain briefly why this category is appropriate for this product.

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
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://knockoffkitchen.com"  # Replace with your site URL
    }
    
    data = {
        "model": "deepseek/deepseek-r1-distill-llama-70b",
        "messages": [
            {"role": "system", "content": "You are a professional chef and recipe developer specializing in creating copycat recipes of popular branded products. ALWAYS include the brand name with the product name in all references (e.g., 'Pringles Extra Hot Chili & Lime' not just 'Extra Hot Chili & Lime'). Provide extremely detailed nutritional comparisons between homemade and store-bought versions. Include specific cost breakdowns with actual dollar amounts for both homemade ingredients and store-bought products. Your content should be keyword-rich and SEO-optimized, focusing on terms like 'homemade', 'copycat recipe', 'make at home', 'DIY', 'kitchen hack', 'secret recipe', 'restaurant quality', 'gourmet', 'authentic taste', etc. Create unique, engaging content with high keyword density but natural-sounding text. Use variations of keywords and long-tail phrases throughout. Include detailed descriptions of flavors, textures, and aromas. Incorporate relevant semantic keywords to boost SEO value. Structure content with proper headings and subheadings for readability and SEO. IMPORTANT: You must accurately categorize each recipe into ONE specific category from the provided list based on the product type. Choose the most specific and appropriate category that best describes the product."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 2500
    }
    
    try:
        print(f"Sending request to OpenRouter for {product_name} by {brand_name}...")
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=data)
        
        # Print detailed response information for debugging
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        # Try to print response body even if it's not valid JSON
        try:
            print(f"Response body preview: {response.text[:500]}...")
        except Exception as e:
            print(f"Could not print response body: {e}")
        
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        result = response.json()
        if 'choices' in result and len(result['choices']) > 0:
            content = result['choices'][0]['message']['content']
            
            # Try to parse the JSON response
            try:
                # Find JSON content (in case there's additional text)
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_content = content[json_start:json_end]
                    recipe_data = json.loads(json_content)
                    return recipe_data
                else:
                    print(f"Could not find JSON content in response for {product_name}")
                    return None
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON response for {product_name}: {e}")
                print(f"Raw response: {content}")
                return None
        else:
            print(f"No choices in response for {product_name}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Error making request to OpenRouter for {product_name}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error generating recipe for {product_name}: {e}")
        return None

def parse_recipe_data(recipe_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse and normalize the recipe data from the API response
    
    Args:
        recipe_data: Raw recipe data from the API
        
    Returns:
        Normalized recipe data ready for database insertion
    """
    # Extract and normalize fields
    parsed_data = {}
    
    # Basic fields
    parsed_data["title"] = recipe_data.get("title", "")
    
    # Extract category if provided by the AI
    if "category" in recipe_data:
        parsed_data["category"] = recipe_data.get("category", "")
    parsed_data["prep_time"] = int(recipe_data.get("prep_time", 0))
    parsed_data["cook_time"] = int(recipe_data.get("cook_time", 0))
    parsed_data["total_time"] = int(recipe_data.get("total_time", 0))
    parsed_data["yield"] = recipe_data.get("yield", "")  # Use 'yield' as the alias defined in schemas.py
    
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
    
    # Store the full introduction text and a truncated version for SEO meta tags
    parsed_data["introduction"] = recipe_data.get("introduction", "")
    parsed_data["seo_meta_description"] = recipe_data.get("introduction", "")[:160] if recipe_data.get("introduction") else ""
    
    return parsed_data
