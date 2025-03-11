from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class IngredientsList(BaseModel):
    items: List[str]

class NutritionalInfo(BaseModel):
    calories: Optional[int] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fat: Optional[str] = None
    sugar: Optional[str] = None
    fiber: Optional[str] = None
    sodium: Optional[str] = None

class FAQItem(BaseModel):
    question: str
    answer: str

class RecipeBase(BaseModel):
    title: str
    brand_name: str
    category: str
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    total_time: Optional[int] = None
    yield_amount: Optional[str] = Field(None, alias="yield")
    ingredients: IngredientsList
    instructions: str
    storage_instructions: Optional[str] = None
    recipe_variations: Optional[str] = None
    special_equipment: Optional[str] = None
    pro_tips: Optional[str] = None
    nutritional_info: Optional[NutritionalInfo] = None
    faq: Optional[List[FAQItem]] = None
    serving_suggestions: Optional[str] = None
    cost_comparison: Optional[str] = None
    seo_meta_description: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(RecipeBase):
    title: Optional[str] = None
    brand_name: Optional[str] = None
    category: Optional[str] = None
    ingredients: Optional[IngredientsList] = None
    instructions: Optional[str] = None

class RecipeResponse(RecipeBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
