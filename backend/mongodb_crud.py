"""
CRUD operations for MongoDB
"""
from typing import List, Dict, Any, Optional
from bson import ObjectId
import uuid

from mongodb_setup import (
    get_recipes_collection,
    get_brands_collection,
    get_categories_collection,
    convert_mongodb_to_api
)

async def create_recipe(recipe_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new recipe in MongoDB
    """
    recipes_collection = get_recipes_collection()
    
    # Generate a unique ID if not provided
    if '_id' not in recipe_data:
        recipe_data['_id'] = str(uuid.uuid4())
    
    # Insert the recipe
    result = recipes_collection.insert_one(recipe_data)
    
    # Get the inserted document
    inserted_id = result.inserted_id
    inserted_doc = recipes_collection.find_one({"_id": inserted_id})
    
    # Convert to API format
    return convert_mongodb_to_api(inserted_doc)

async def get_recipes(
    skip: int = 0,
    limit: int = 100,
    brand_name: Optional[str] = None,
    category: Optional[str] = None,
    search_query: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Get recipes from MongoDB with optional filtering
    """
    recipes_collection = get_recipes_collection()
    
    # Build query filter
    query_filter = {}
    
    if brand_name:
        query_filter["brand_name"] = brand_name
    
    if category:
        query_filter["category"] = category
    
    if search_query:
        # Text search across multiple fields
        query_filter["$or"] = [
            {"title": {"$regex": search_query, "$options": "i"}},
            {"brand_name": {"$regex": search_query, "$options": "i"}},
            {"category": {"$regex": search_query, "$options": "i"}}
        ]
    
    # Execute query
    cursor = recipes_collection.find(query_filter).skip(skip).limit(limit)
    
    # Convert to list and API format
    recipes = [convert_mongodb_to_api(doc) for doc in cursor]
    
    return recipes

async def get_recipe(recipe_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a recipe by ID
    """
    recipes_collection = get_recipes_collection()
    
    # Find the recipe
    recipe = recipes_collection.find_one({"_id": recipe_id})
    
    if recipe:
        return convert_mongodb_to_api(recipe)
    
    return None

async def get_recipe_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    """
    Get a recipe by slug
    """
    recipes_collection = get_recipes_collection()
    
    # Find the recipe
    recipe = recipes_collection.find_one({"slug": slug})
    
    if recipe:
        return convert_mongodb_to_api(recipe)
    
    return None

async def update_recipe(recipe_id: str, recipe_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update a recipe
    """
    recipes_collection = get_recipes_collection()
    
    # Remove _id from update data if present
    update_data = recipe_data.copy()
    if '_id' in update_data:
        del update_data['_id']
    
    # Update the recipe
    result = recipes_collection.update_one(
        {"_id": recipe_id},
        {"$set": update_data}
    )
    
    if result.modified_count > 0:
        # Get the updated document
        updated_doc = recipes_collection.find_one({"_id": recipe_id})
        return convert_mongodb_to_api(updated_doc)
    
    return None

async def delete_recipe(recipe_id: str) -> Optional[Dict[str, Any]]:
    """
    Delete a recipe
    """
    recipes_collection = get_recipes_collection()
    
    # Get the recipe before deleting
    recipe = recipes_collection.find_one({"_id": recipe_id})
    
    if recipe:
        # Delete the recipe
        recipes_collection.delete_one({"_id": recipe_id})
        return convert_mongodb_to_api(recipe)
    
    return None

async def get_brands() -> List[Dict[str, Any]]:
    """
    Get all unique brands from recipes
    """
    recipes_collection = get_recipes_collection()
    
    # Aggregate to get unique brands with counts
    pipeline = [
        {"$group": {
            "_id": "$brand_name",
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    result = recipes_collection.aggregate(pipeline)
    
    # Format the result
    brands = []
    for doc in result:
        brand_name = doc["_id"]
        if brand_name:
            # Generate slug from brand name
            slug = brand_name.lower().replace(" ", "-").replace("&", "and")
            brands.append({
                "name": brand_name,
                "slug": slug,
                "count": doc["count"]
            })
    
    return brands

async def get_categories() -> List[Dict[str, Any]]:
    """
    Get all unique categories from recipes
    """
    recipes_collection = get_recipes_collection()
    
    # Aggregate to get unique categories with counts
    pipeline = [
        {"$group": {
            "_id": "$category",
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    result = recipes_collection.aggregate(pipeline)
    
    # Format the result
    categories = []
    for doc in result:
        category_name = doc["_id"]
        if category_name:
            # Generate slug from category name
            slug = category_name.lower().replace(" ", "-").replace("&", "and")
            
            # Generate description
            description = f"Delicious homemade {category_name.lower()} recipes that taste just like your favorite store-bought brands but healthier and more affordable."
            
            categories.append({
                "name": category_name,
                "slug": slug,
                "count": doc["count"],
                "description": description
            })
    
    return categories

async def get_recipe_count() -> int:
    """
    Get the total number of recipes
    """
    recipes_collection = get_recipes_collection()
    return recipes_collection.count_documents({})
