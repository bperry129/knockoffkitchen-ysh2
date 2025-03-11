from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os

# Use the password we set up earlier with escaped special characters
DATABASE_URL = "postgresql+asyncpg://recipe_admin:Secure_P@ssw0rd_2025!@172.17.0.2/copycat_recipes_db"
engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
