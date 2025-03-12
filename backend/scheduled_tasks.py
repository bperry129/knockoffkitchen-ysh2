#!/usr/bin/env python3
"""
Scheduled Tasks for KnockoffKitchen.com

This script contains tasks that should be run on a schedule.
It can be executed by a cron job or a scheduled task.

Example cron entry (runs every day at 2 AM):
0 2 * * * /path/to/python /path/to/copycat-recipes/backend/scheduled_tasks.py

Example Windows Task Scheduler:
Program/script: python
Arguments: C:\path\to\copycat-recipes\backend\scheduled_tasks.py
"""

import asyncio
import logging
import os
import sys
from datetime import datetime

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(__file__), "scheduled_tasks.log")),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Import the sitemap generator
from backend.sitemap_generator import generate_sitemap


async def main():
    """
    Main function to run all scheduled tasks.
    """
    logger.info("Starting scheduled tasks")
    
    try:
        # Generate sitemap
        logger.info("Generating sitemap")
        sitemap_path = await generate_sitemap()
        logger.info(f"Sitemap generated successfully at {sitemap_path}")
        
        # Add more scheduled tasks here as needed
        # For example:
        # - Clean up old files
        # - Send reports
        # - Update search indexes
        # - etc.
        
    except Exception as e:
        logger.error(f"Error running scheduled tasks: {e}", exc_info=True)
    
    logger.info("Scheduled tasks completed")


if __name__ == "__main__":
    # Record start time
    start_time = datetime.now()
    logger.info(f"Scheduled tasks started at {start_time}")
    
    # Run the main function
    asyncio.run(main())
    
    # Record end time and duration
    end_time = datetime.now()
    duration = end_time - start_time
    logger.info(f"Scheduled tasks completed at {end_time} (duration: {duration})")
