from sqlalchemy import Column, String, Integer, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    brand_name = Column(Text, nullable=False, index=True)
    category = Column(Text, nullable=False, index=True)
    prep_time = Column(Integer)
    cook_time = Column(Integer)
    total_time = Column(Integer)
    yield_amount = Column(Text, name="yield")  # "yield" is a Python keyword, so we use yield_amount
    ingredients = Column(JSONB, nullable=False)
    instructions = Column(Text, nullable=False)
    storage_instructions = Column(Text)
    recipe_variations = Column(Text)
    special_equipment = Column(Text)
    pro_tips = Column(Text)
    nutritional_info = Column(JSONB)
    faq = Column(JSONB)
    serving_suggestions = Column(Text)
    cost_comparison = Column(Text)
    seo_meta_description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
