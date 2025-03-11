#!/usr/bin/env python
import asyncio
import logging
import sys
import os
import subprocess
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from database import AsyncSessionLocal, engine
from models import Recipe

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("delete_recipes.log"),
        logging.StreamHandler()
    ]
)

async def check_database_connection():
    """Check if the database is accessible"""
    try:
        # Try to connect to the database
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")
            logging.info("Database connection successful")
            return True
    except Exception as e:
        logging.error(f"Database connection failed: {e}")
        return False

async def delete_all_recipes():
    """Delete all recipes from the database"""
    # First check if the database is accessible
    if not await check_database_connection():
        logging.error("Cannot connect to the database. Please make sure the database is running.")
        return False
    
    async with AsyncSessionLocal() as session:
        try:
            # Delete all recipes
            query = delete(Recipe)
            result = await session.execute(query)
            await session.commit()
            logging.info(f"Deleted all recipes from the database")
            return True
        except Exception as e:
            logging.error(f"Error deleting recipes: {e}")
            await session.rollback()
            return False

def run_docker_compose():
    """Run docker-compose to start the database container"""
    try:
        # Check if docker-compose.yml exists
        if not os.path.exists("../docker-compose.yml"):
            logging.error("docker-compose.yml not found")
            return False
        
        # Run docker-compose up -d
        logging.info("Starting database container with docker-compose...")
        result = subprocess.run(["docker-compose", "up", "-d"], 
                               cwd="..", 
                               capture_output=True, 
                               text=True)
        
        if result.returncode == 0:
            logging.info("Database container started successfully")
            return True
        else:
            logging.error(f"Failed to start database container: {result.stderr}")
            return False
    except Exception as e:
        logging.error(f"Error running docker-compose: {e}")
        return False

async def main():
    """Main function to delete all recipes"""
    # Check if the database is accessible
    if not await check_database_connection():
        # Try to start the database container
        logging.info("Attempting to start the database container...")
        if run_docker_compose():
            # Wait for the database to be ready
            logging.info("Waiting for the database to be ready...")
            for i in range(10):
                await asyncio.sleep(2)
                if await check_database_connection():
                    break
            else:
                logging.error("Database still not accessible after waiting")
                return False
        else:
            logging.error("Failed to start the database container")
            return False
    
    # Delete all recipes
    return await delete_all_recipes()

if __name__ == "__main__":
    # Fix for Windows compatibility issue with aiodns
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    success = asyncio.run(main())
    if success:
        logging.info("Successfully deleted all recipes")
    else:
        logging.error("Failed to delete all recipes")
