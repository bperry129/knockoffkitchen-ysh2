import pandas as pd
import json
import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from models import Recipe
from schemas import RecipeCreate


async def import_recipes_from_csv(
    file_path: str, 
    db: AsyncSession,
    create_recipe_func
) -> List[Recipe]:
    """
    Import recipes from a CSV file and add them to the database.
    
    Args:
        file_path: Path to the CSV file
        db: Database session
        create_recipe_func: Function to create a recipe in the database
        
    Returns:
        List of created Recipe objects
    """
    # Read CSV file
    df = pd.read_csv(file_path)
    
    # Convert DataFrame to list of dictionaries
    recipes_data = df.to_dict(orient='records')
    created_recipes = []
    
    # Process each recipe
    for recipe_data in recipes_data:
        # Process ingredients (assuming they're in a comma-separated string)
        if 'ingredients' in recipe_data and isinstance(recipe_data['ingredients'], str):
            ingredients_list = [item.strip() for item in recipe_data['ingredients'].split(',')]
            recipe_data['ingredients'] = {'items': ingredients_list}
            
        # Process nutritional info (assuming it's in a JSON string)
        if 'nutritional_info' in recipe_data and isinstance(recipe_data['nutritional_info'], str):
            try:
                recipe_data['nutritional_info'] = json.loads(recipe_data['nutritional_info'])
            except json.JSONDecodeError:
                recipe_data['nutritional_info'] = None
                
        # Process FAQ (assuming it's in a JSON string)
        if 'faq' in recipe_data and isinstance(recipe_data['faq'], str):
            try:
                recipe_data['faq'] = json.loads(recipe_data['faq'])
            except json.JSONDecodeError:
                recipe_data['faq'] = None
                
        # Create recipe
        recipe = RecipeCreate(**recipe_data)
        db_recipe = await create_recipe_func(db=db, recipe=recipe)
        created_recipes.append(db_recipe)
        
    return created_recipes


def analyze_recipes(recipes: List[Recipe]) -> Dict[str, Any]:
    """
    Perform analysis on a list of recipes.
    
    Args:
        recipes: List of Recipe objects
        
    Returns:
        Dictionary with analysis results
    """
    # Convert recipes to DataFrame
    recipes_data = []
    for recipe in recipes:
        recipe_dict = {
            'id': str(recipe.id),
            'title': recipe.title,
            'brand_name': recipe.brand_name,
            'category': recipe.category,
            'prep_time': recipe.prep_time,
            'cook_time': recipe.cook_time,
            'total_time': recipe.total_time,
            'created_at': recipe.created_at,
            'updated_at': recipe.updated_at
        }
        recipes_data.append(recipe_dict)
        
    df = pd.DataFrame(recipes_data)
    
    # Perform analysis
    analysis = {
        'total_recipes': len(df),
        'recipes_by_brand': df['brand_name'].value_counts().to_dict(),
        'recipes_by_category': df['category'].value_counts().to_dict(),
        'avg_prep_time': df['prep_time'].mean() if 'prep_time' in df else None,
        'avg_cook_time': df['cook_time'].mean() if 'cook_time' in df else None,
        'avg_total_time': df['total_time'].mean() if 'total_time' in df else None,
    }
    
    return analysis


def export_recipes_to_csv(recipes: List[Recipe], file_path: str) -> None:
    """
    Export recipes to a CSV file.
    
    Args:
        recipes: List of Recipe objects
        file_path: Path to save the CSV file
    """
    # Convert recipes to DataFrame
    recipes_data = []
    for recipe in recipes:
        recipe_dict = {
            'id': str(recipe.id),
            'title': recipe.title,
            'brand_name': recipe.brand_name,
            'category': recipe.category,
            'prep_time': recipe.prep_time,
            'cook_time': recipe.cook_time,
            'total_time': recipe.total_time,
            'yield': getattr(recipe, 'yield', None),
            'ingredients': json.dumps(recipe.ingredients) if recipe.ingredients else None,
            'instructions': recipe.instructions,
            'storage_instructions': recipe.storage_instructions,
            'recipe_variations': recipe.recipe_variations,
            'special_equipment': recipe.special_equipment,
            'pro_tips': recipe.pro_tips,
            'nutritional_info': json.dumps(recipe.nutritional_info) if recipe.nutritional_info else None,
            'faq': json.dumps(recipe.faq) if recipe.faq else None,
            'serving_suggestions': recipe.serving_suggestions,
            'cost_comparison': recipe.cost_comparison,
            'seo_meta_description': recipe.seo_meta_description,
            'created_at': recipe.created_at.isoformat() if recipe.created_at else None,
            'updated_at': recipe.updated_at.isoformat() if recipe.updated_at else None
        }
        recipes_data.append(recipe_dict)
        
    df = pd.DataFrame(recipes_data)
    df.to_csv(file_path, index=False)
