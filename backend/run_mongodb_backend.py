#!/usr/bin/env python
"""
Script to run the MongoDB backend for KnockoffKitchen.com
"""
import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def main():
    """Run the MongoDB backend server"""
    # Check if MongoDB URI is set
    if not os.environ.get("MONGODB_URI"):
        print("Error: MONGODB_URI environment variable is not set.")
        print("Please create a .env file with your MongoDB connection string.")
        print("Example: MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>")
        sys.exit(1)
    
    # Check if OpenRouter API key is set
    if not os.environ.get("OPENROUTER_API_KEY"):
        print("Warning: OPENROUTER_API_KEY environment variable is not set.")
        print("AI recipe generation will not work without an OpenRouter API key.")
        print("Example: OPENROUTER_API_KEY=<your-api-key>")
    
    # Run the server
    print("Starting KnockoffKitchen.com MongoDB backend...")
    uvicorn.run(
        "mongodb_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    main()
