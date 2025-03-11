from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from typing import List, Optional, Dict, Any
import uuid

from models import Recipe
from schemas import RecipeCreate, RecipeUpdate

async def get_recipe(db: AsyncSession, recipe_id: uuid.UUID):
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    return result.scalars().first()

async def get_recipes(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 100,
    brand_name: Optional[str] = None,
    category: Optional[str] = None
):
    query = select(Recipe)
    
    if brand_name:
        query = query.where(Recipe.brand_name == brand_name)
    if category:
        query = query.where(Recipe.category == category)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def create_recipe(db: AsyncSession, recipe: RecipeCreate):
    # Convert Pydantic model to dict, handling the 'yield' field
    recipe_data = recipe.model_dump(by_alias=True)
    
    # Handle the 'yield' field separately since it's a Python reserved word
    if 'yield' in recipe_data:
        yield_value = recipe_data.pop('yield')
        recipe_data['yield_amount'] = yield_value
    
    db_recipe = Recipe(**recipe_data)
    db.add(db_recipe)
    await db.commit()
    await db.refresh(db_recipe)
    return db_recipe

async def update_recipe(db: AsyncSession, recipe_id: uuid.UUID, recipe: RecipeUpdate):
    # Convert Pydantic model to dict, excluding None values and handling the 'yield' field
    recipe_data = {k: v for k, v in recipe.model_dump(by_alias=True).items() if v is not None}
    
    # Handle the 'yield' field separately since it's a Python reserved word
    if 'yield' in recipe_data:
        yield_value = recipe_data.pop('yield')
        recipe_data['yield_amount'] = yield_value
    
    await db.execute(
        update(Recipe)
        .where(Recipe.id == recipe_id)
        .values(**recipe_data)
    )
    await db.commit()
    return await get_recipe(db, recipe_id)

async def delete_recipe(db: AsyncSession, recipe_id: uuid.UUID):
    recipe = await get_recipe(db, recipe_id)
    if recipe:
        await db.execute(delete(Recipe).where(Recipe.id == recipe_id))
        await db.commit()
    return recipe
