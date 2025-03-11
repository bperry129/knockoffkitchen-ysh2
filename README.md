# KnockoffKitchen.com

A web application that generates copycat recipes for popular branded food products using AI.

## Overview

KnockoffKitchen.com is a Next.js application that uses AI to generate detailed copycat recipes for popular branded food products. The application includes:

- A frontend built with Next.js, React, and Tailwind CSS
- A backend with Python and SQLAlchemy for database management
- AI-powered recipe generation using DeepSeek API
- PostgreSQL database for storing recipe data

## Features

- Browse recipes by category, brand, or search
- View detailed recipe pages with ingredients, instructions, and nutritional information
- Generate new copycat recipes using AI
- Admin interface for managing recipes and brands

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/copycat-recipes.git
   cd copycat-recipes
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/copycat_recipes_db
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

5. Set up the database:
   ```bash
   cd backend
   python -m alembic upgrade head
   ```

6. Start the development server:
   ```bash
   # In the root directory
   npm run dev
   ```

7. Start the backend server:
   ```bash
   # In the backend directory
   python run.py
   ```

## Recipe Generation

The application uses the DeepSeek API through OpenRouter to generate copycat recipes. The generation process includes:

1. Parsing product data from a CSV file
2. Generating detailed recipes with ingredients, instructions, and nutritional information
3. Saving the recipes to JSON files and/or the database

To generate recipes:
```bash
cd backend
python generate_recipes.py --csv path/to/products.csv --save
```

## Project Structure

- `/src`: Frontend code (Next.js)
  - `/app`: Next.js app router pages
  - `/components`: React components
  - `/lib`: Utility functions
- `/backend`: Backend code (Python)
  - `/migrations`: Database migrations
  - `/recipes_output`: Generated recipe JSON files
  - `models.py`: Database models
  - `schemas.py`: Pydantic schemas
  - `crud.py`: Database operations
  - `deepseek_api.py`: AI recipe generation
  - `generate_recipes.py`: Script to generate recipes

## Future Enhancements

- AI-generated images for recipes using Hugging Face
- User accounts and saved recipes
- Recipe ratings and comments
- Mobile app version

## License

[MIT](LICENSE)
