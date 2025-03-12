"""
FastAPI main application with MongoDB backend for KnockoffKitchen.com
"""
from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import os
import uuid
import pandas as pd
import tempfile
import asyncio
import json

# Import MongoDB utilities
from mongodb_crud import (
    create_recipe,
    get_recipes,
    get_recipe,
    get_recipe_by_slug,
    update_recipe,
    delete_recipe,
    get_brands,
    get_categories,
    get_recipe_count
)

# Import recipe generation utilities
from generate_recipes import process_csv
from sitemap_generator import generate_sitemap

app = FastAPI(title="KnockoffKitchen.com API")

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
    return {"message": "Welcome to the KnockoffKitchen.com API"}

@app.post("/recipes/", status_code=201)
async def create_recipe_endpoint(recipe_data: Dict[str, Any], background_tasks: BackgroundTasks):
    """
    Create a new recipe
    """
    new_recipe = await create_recipe(recipe_data)
    
    # Update sitemap after creating a new recipe
    background_tasks.add_task(generate_sitemap)
    
    return new_recipe

@app.get("/recipes/")
async def read_recipes(
    skip: int = 0, 
    limit: int = 100,
    brand_name: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None
):
    """
    Get recipes with optional filtering
    """
    recipes = await get_recipes(
        skip=skip, 
        limit=limit, 
        brand_name=brand_name, 
        category=category,
        search_query=search
    )
    return recipes

@app.get("/recipes/count")
async def get_count():
    """
    Get the total number of recipes
    """
    count = await get_recipe_count()
    return {"count": count}

@app.get("/recipes/{recipe_id}")
async def read_recipe(recipe_id: str):
    """
    Get a recipe by ID
    """
    db_recipe = await get_recipe(recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.get("/recipes/slug/{slug}")
async def read_recipe_by_slug(slug: str):
    """
    Get a recipe by slug
    """
    db_recipe = await get_recipe_by_slug(slug)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@app.put("/recipes/{recipe_id}")
async def update_recipe_endpoint(
    recipe_id: str, recipe_data: Dict[str, Any], background_tasks: BackgroundTasks
):
    """
    Update a recipe
    """
    db_recipe = await get_recipe(recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    updated_recipe = await update_recipe(recipe_id, recipe_data)
    
    # Update sitemap after updating a recipe
    background_tasks.add_task(generate_sitemap)
    
    return updated_recipe

@app.delete("/recipes/{recipe_id}")
async def delete_recipe_endpoint(recipe_id: str, background_tasks: BackgroundTasks):
    """
    Delete a recipe
    """
    db_recipe = await delete_recipe(recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Update sitemap after deleting a recipe
    background_tasks.add_task(generate_sitemap)
    
    return db_recipe

@app.get("/brands/")
async def get_brands_endpoint():
    """
    Get all brands
    """
    brands = await get_brands()
    return brands

@app.get("/categories/")
async def get_categories_endpoint():
    """
    Get all categories
    """
    categories = await get_categories()
    return categories

@app.post("/sitemap/generate/", status_code=202)
async def generate_sitemap_endpoint(background_tasks: BackgroundTasks):
    """
    Endpoint to manually trigger sitemap generation
    """
    background_tasks.add_task(generate_sitemap)
    return {"message": "Sitemap generation started in the background"}

@app.post("/admin/upload-csv/")
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    use_ai: bool = Form(True),
    limit: int = Form(0)
):
    """
    Upload a CSV file for recipe generation
    """
    # Create a temporary file to store the uploaded CSV
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp_file:
        # Write the uploaded file content to the temporary file
        content = await file.read()
        temp_file.write(content)
        temp_file.flush()
        
        # Process the CSV file in the background
        background_tasks.add_task(
            process_csv_background,
            temp_file.name,
            limit,
            False,  # Not a dry run
            use_ai
        )
    
    return {"message": "CSV upload received. Recipe generation started in the background."}

async def process_csv_background(csv_path, limit, dry_run, use_ai):
    """
    Process CSV file in the background
    """
    try:
        await process_csv(csv_path, limit, dry_run, use_ai)
        
        # Clean up the temporary file
        os.unlink(csv_path)
        
        # Update sitemap after processing
        await generate_sitemap()
        
        print("CSV processing completed successfully")
    except Exception as e:
        print(f"Error processing CSV: {e}")

# Generate sitemap on startup
@app.on_event("startup")
async def startup_event():
    try:
        await generate_sitemap()
    except Exception as e:
        print(f"Error generating sitemap: {e}")
        print("Continuing startup without sitemap generation")
