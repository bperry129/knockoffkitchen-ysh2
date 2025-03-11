from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from database import get_db
from schemas import RecipeCreate, RecipeUpdate, RecipeResponse
import crud

app = FastAPI(title="Copycat Recipes API")

# Add CORS middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Copycat Recipes API"}

@app.post("/recipes/", response_model=RecipeResponse)
async def create_recipe(recipe: RecipeCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_recipe(db=db, recipe=recipe)

@app.get("/recipes/", response_model=List[RecipeResponse])
async def read_recipes(
    skip: int = 0, 
    limit: int = 100,
    brand_name: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    recipes = await crud.get_recipes(
        db, skip=skip, limit=limit, brand_name=brand_name, category=category
    )
    return recipes

@app.get("/recipes/{recipe_id}", response_model=RecipeResponse)
async def read_recipe(recipe_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    db_recipe = await crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.put("/recipes/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: uuid.UUID, recipe: RecipeUpdate, db: AsyncSession = Depends(get_db)
):
    db_recipe = await crud.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return await crud.update_recipe(db=db, recipe_id=recipe_id, recipe=recipe)

@app.delete("/recipes/{recipe_id}", response_model=RecipeResponse)
async def delete_recipe(recipe_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    db_recipe = await crud.delete_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.get("/brands/", response_model=List[str])
async def get_brands(db: AsyncSession = Depends(get_db)):
    # This is a simplified implementation - in a real app, you might want to use a distinct query
    recipes = await crud.get_recipes(db, limit=1000)
    brands = sorted(list(set(recipe.brand_name for recipe in recipes)))
    return brands

@app.get("/categories/", response_model=List[str])
async def get_categories(db: AsyncSession = Depends(get_db)):
    # This is a simplified implementation - in a real app, you might want to use a distinct query
    recipes = await crud.get_recipes(db, limit=1000)
    categories = sorted(list(set(recipe.category for recipe in recipes)))
    return categories
