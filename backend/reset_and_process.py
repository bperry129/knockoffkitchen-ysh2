#!/usr/bin/env python
import asyncio
import sys
import os
import logging
import subprocess

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("reset_and_process.log"),
        logging.StreamHandler()
    ]
)

async def run_delete_all_recipes():
    """Run the delete_all_recipes.py script"""
    try:
        logging.info("Deleting all recipes from the database...")
        # Import and run the delete_all_recipes function
        from delete_all_recipes import delete_all_recipes
        result = await delete_all_recipes()
        if result:
            logging.info("Successfully deleted all recipes from the database")
        else:
            logging.error("Failed to delete all recipes from the database")
            return False
        return True
    except Exception as e:
        logging.error(f"Error running delete_all_recipes.py: {e}")
        return False

async def run_concurrent_recipe_generator(csv_path, batch_size=20):
    """Run the concurrent_recipe_generator.py script"""
    try:
        logging.info(f"Processing recipes from {csv_path}...")
        # Import and run the main function from concurrent_recipe_generator
        from concurrent_recipe_generator import main
        await main(csv_path, batch_size)
        logging.info("Successfully processed recipes")
        return True
    except Exception as e:
        logging.error(f"Error running concurrent_recipe_generator.py: {e}")
        return False

async def main():
    """Main function to run the reset and process scripts"""
    # Check if CSV path is provided
    if len(sys.argv) < 2:
        logging.error("Please provide a CSV path")
        print("Usage: python reset_and_process.py <csv_path> [batch_size]")
        return
    
    csv_path = sys.argv[1]
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    
    # Check if CSV file exists
    if not os.path.exists(csv_path):
        logging.error(f"CSV file not found: {csv_path}")
        return
    
    # Run delete_all_recipes.py
    if not await run_delete_all_recipes():
        logging.error("Failed to delete all recipes, aborting")
        return
    
    # Run concurrent_recipe_generator.py
    if not await run_concurrent_recipe_generator(csv_path, batch_size):
        logging.error("Failed to process recipes")
        return
    
    logging.info("Reset and process completed successfully")

if __name__ == "__main__":
    # Fix for Windows compatibility issue with aiodns
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main())
