#!/usr/bin/env python
import asyncio
import logging
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("direct_delete.log"),
        logging.StreamHandler()
    ]
)

async def delete_all_recipes():
    """Delete all recipes from the database using SQLAlchemy directly"""
    try:
        # Create engine
        logging.info("Creating database engine...")
        DATABASE_URL = "postgresql+asyncpg://recipe_admin:Secure_P@ssw0rd_2025!@172.17.0.2/copycat_recipes_db"
        engine = create_async_engine(DATABASE_URL, echo=True)
        
        # Connect to the database
        logging.info("Connecting to the database...")
        async with engine.begin() as conn:
            # Delete all recipes
            logging.info("Deleting all recipes...")
            result = await conn.execute(text("DELETE FROM recipes"))
            deleted_rows = result.rowcount
            logging.info(f"Deleted {deleted_rows} recipes")
            
            # Delete all categories
            logging.info("Deleting all categories...")
            result = await conn.execute(text("DELETE FROM categories"))
            deleted_rows = result.rowcount
            logging.info(f"Deleted {deleted_rows} categories")
            
            # Delete all brands
            logging.info("Deleting all brands...")
            result = await conn.execute(text("DELETE FROM brands"))
            deleted_rows = result.rowcount
            logging.info(f"Deleted {deleted_rows} brands")
        
        return True
    except Exception as e:
        logging.error(f"Error deleting data: {e}")
        return False

async def main():
    """Main function"""
    success = await delete_all_recipes()
    if success:
        logging.info("Successfully deleted all data")
    else:
        logging.error("Failed to delete data")

if __name__ == "__main__":
    # Fix for Windows compatibility issue with aiodns
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main())
