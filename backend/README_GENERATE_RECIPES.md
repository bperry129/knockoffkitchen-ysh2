# Generate Recipes Script

This script reads product data from a CSV file and generates copycat recipes for each product, saving them as JSON files. It can use either AI-based generation via the DeepSeek API or template-based generation.

## Prerequisites

- Python 3.9+
- Required Python packages: pandas, requests, json, uuid
- OpenRouter API key (for AI-based recipe generation)

## CSV File Format

The script expects a CSV file with at least the following columns:
- `Product`: The name of the product (e.g., "Original", "Sour Cream & Onion")
- `Brand`: The brand name (e.g., "Pringles")
- `Category`: The product category (e.g., "Chips")

Example CSV content:
```
Product,Brand,Category
Original,Pringles,Chips
Sour Cream & Onion,Pringles,Chips
Cheddar Cheese,Pringles,Chips
```

## Usage

```bash
# Basic usage (uses default CSV path, dry-run mode)
python generate_recipes.py

# Specify a different CSV file
python generate_recipes.py --csv path/to/your/file.csv

# Limit the number of recipes to generate
python generate_recipes.py --limit 5

# Save recipes to JSON files (by default, the script runs in dry-run mode)
python generate_recipes.py --save

# Combine options
python generate_recipes.py --csv path/to/your/file.csv --limit 10 --save
```

## Command Line Options

- `--csv`: Path to the CSV file containing product data (default: "C:\Users\bperr\Desktop\pringles_products_clean.csv")
- `--limit`: Limit the number of recipes to generate (default: 0, which means all)
- `--dry-run`: Run without saving recipes (default: True)
- `--save`: Save recipes to JSON files (overrides --dry-run)
- `--no-ai`: Disable AI-based recipe generation (use template-based generation instead)

## How It Works

1. The script reads the specified CSV file
2. For each row, it extracts the Product, Brand, and Category
3. It generates recipe data based on the product information
4. If not in dry-run mode, it saves the recipe to a JSON file in the 'recipes_output' directory
5. It provides feedback on the process

## Recipe Generation

The script generates the following data for each recipe:
- Title (e.g., "Homemade Original Copycat Recipe")
- Brand name
- Category
- Preparation, cooking, and total time
- Yield amount
- Ingredients list based on the product flavor
- Step-by-step instructions
- Storage instructions
- Recipe variations
- Special equipment needed
- Pro tips
- Nutritional information
- FAQs
- Serving suggestions
- Cost comparison
- SEO meta description

## AI-Based Recipe Generation

By default, the script uses OpenRouter's DeepSeek model to generate detailed, creative recipes based on the product information. The AI-generated recipes include:

- Catchy, SEO-optimized titles
- Engaging introductions with product history and benefits
- Detailed ingredient lists with both US and metric measurements
- Clear step-by-step instructions
- Storage instructions
- Expert cooking tips
- Nutritional comparisons between homemade and store-bought versions
- Comprehensive FAQ sections
- Creative serving suggestions
- Cost comparisons

The AI generation provides more detailed and creative recipes than the template-based approach, but requires an OpenRouter API key. If the AI generation fails for any reason, the script will automatically fall back to template-based generation.

You can disable AI-based generation with the `--no-ai` flag, which will use the template-based approach instead.

## External API Integration

The script includes functionality to fetch additional product information from external APIs:

1. **OpenRouter API**: Used for AI-based recipe generation with the DeepSeek model. The API key is configured in the `deepseek_api.py` file.

2. **Spoonacular API**: Used to fetch additional product information. This is currently implemented as a mock response, but can be updated with a real API key for production use.

## Error Handling

The script includes robust error handling:
- It attempts to read the CSV file with different separators if the standard comma doesn't work
- It checks for required columns and attempts to infer them if they're not exactly as expected
- It catches and reports errors for individual rows, allowing the process to continue with the next row
