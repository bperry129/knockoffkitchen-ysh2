# KnockoffKitchen.com

KnockoffKitchen.com is a website that provides homemade copycat recipes of popular branded products. Users can search for recipes by brand, category, or keyword, and browse through a collection of recipes that taste just like the original but are healthier and more affordable.

## Features

- Browse recipes by brand or category
- Search for recipes by keyword
- View detailed recipe instructions, ingredients, and tips
- Admin dashboard for uploading CSV files to generate new recipes
- AI-powered recipe generation using DeepSeek API
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Headless UI

### Backend
- FastAPI (Python)
- MongoDB
- DeepSeek API for AI recipe generation

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/knockoffkitchen.git
   cd knockoffkitchen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   BACKEND_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/knockoffkitchen
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

5. Start the backend server:
   ```bash
   uvicorn mongodb_main:app --reload
   ```

6. The API will be available at [http://localhost:8000](http://localhost:8000).

## CSV Format for Recipe Generation

To generate recipes, you need to upload a CSV file with the following columns:

- **Product**: The name of the product (e.g., "Original Potato Chips")
- **Brand**: The brand name (e.g., "Pringles")
- **Category**: Optional category (e.g., "Chips", "Snacks", "Cookies")

Example:
```
Product,Brand,Category
Original Potato Chips,Pringles,Chips
Chocolate Chip Cookies,Famous Amos,Cookies
```

## Deployment

For production deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [DeepSeek API](https://openrouter.ai/docs) for AI recipe generation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API
- [MongoDB](https://www.mongodb.com/) for the database
