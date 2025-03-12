"""
MongoDB Atlas setup and connection utilities for KnockoffKitchen.com
"""
import os
import pymongo
from pymongo import MongoClient
from bson import ObjectId
from typing import List, Dict, Any, Optional

# MongoDB Atlas connection string (to be set as environment variable)
# Format: mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb+srv://username:password@cluster.mongodb.net/knockoffkitchen?retryWrites=true&w=majority")

# Database and collection names
DB_NAME = "knockoffkitchen"
RECIPES_COLLECTION = "recipes"
BRANDS_COLLECTION = "brands"
CATEGORIES_COLLECTION = "categories"

# Global client variable
_client = None

def get_database():
    """
    Get a connection to the MongoDB database
    """
    global _client
    try:
        if _client is None:
            _client = MongoClient(MONGODB_URI)
            # Test the connection
            _client.admin.command('ping')
            print("MongoDB connection successful")
        return _client[DB_NAME]
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        # Return a mock database for development
        return MockDatabase()

class MockDatabase:
    """Mock database for development when MongoDB is not available"""
    def __getitem__(self, name):
        return MockCollection()

class MockCollection:
    """Mock collection for development when MongoDB is not available"""
    def find(self, *args, **kwargs):
        return []
    
    def find_one(self, *args, **kwargs):
        return None
    
    def insert_one(self, *args, **kwargs):
        return MockInsertResult()
    
    def insert_many(self, *args, **kwargs):
        return []
    
    def update_one(self, *args, **kwargs):
        return MockUpdateResult()
    
    def delete_one(self, *args, **kwargs):
        return MockDeleteResult()
    
    def count_documents(self, *args, **kwargs):
        return 0
    
    def distinct(self, *args, **kwargs):
        return []
    
    def create_index(self, *args, **kwargs):
        return None

class MockInsertResult:
    """Mock insert result"""
    @property
    def inserted_id(self):
        return "mock_id"

class MockUpdateResult:
    """Mock update result"""
    @property
    def modified_count(self):
        return 0

class MockDeleteResult:
    """Mock delete result"""
    @property
    def deleted_count(self):
        return 0

def get_recipes_collection():
    """
    Get the recipes collection
    """
    db = get_database()
    return db[RECIPES_COLLECTION]

def get_brands_collection():
    """
    Get the brands collection
    """
    db = get_database()
    return db[BRANDS_COLLECTION]

def get_categories_collection():
    """
    Get the categories collection
    """
    db = get_database()
    return db[CATEGORIES_COLLECTION]

def convert_sqlalchemy_to_mongodb(recipe_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert SQLAlchemy model data to MongoDB document format
    """
    # Create a copy to avoid modifying the original
    mongo_data = recipe_data.copy()
    
    # Replace 'id' with MongoDB '_id' if needed
    if 'id' in mongo_data and '_id' not in mongo_data:
        mongo_data['_id'] = str(mongo_data['id'])
        del mongo_data['id']
    
    return mongo_data

def convert_mongodb_to_api(mongo_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB document to API response format
    """
    # Create a copy to avoid modifying the original
    api_data = mongo_doc.copy()
    
    # Convert MongoDB _id to id for API responses
    if '_id' in api_data:
        api_data['id'] = str(api_data['_id'])
        del api_data['_id']
    
    return api_data

async def migrate_data_to_mongodb(recipes: List[Dict[str, Any]]):
    """
    Migrate data from PostgreSQL to MongoDB
    """
    recipes_collection = get_recipes_collection()
    
    # Clear existing data
    recipes_collection.delete_many({})
    
    # Insert new data
    if recipes:
        # Convert data to MongoDB format
        mongo_recipes = [convert_sqlalchemy_to_mongodb(recipe) for recipe in recipes]
        
        # Insert into MongoDB
        recipes_collection.insert_many(mongo_recipes)
        
        print(f"Migrated {len(mongo_recipes)} recipes to MongoDB")
    else:
        print("No recipes to migrate")
    
    # Create indexes for better query performance
    recipes_collection.create_index("title")
    recipes_collection.create_index("brand_name")
    recipes_collection.create_index("category")
    recipes_collection.create_index("slug", unique=True)
