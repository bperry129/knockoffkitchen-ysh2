# KnockoffKitchen.com SEO Guide

This guide outlines the SEO features implemented on KnockoffKitchen.com and provides instructions on how to maintain and improve them.

## Implemented SEO Features

1. **Metadata Optimization**
   - All pages include optimized titles, descriptions, and keywords
   - Recipe pages include "Homemade {productname} recipe" in metadata
   - Brand pages include "Homemade {brandname} Copycat Recipes" in metadata
   - Category pages include "Homemade {categoryname} Recipes" in metadata

2. **Structured Data (JSON-LD)**
   - Recipe pages include Recipe schema markup for rich snippets in search results
   - Includes cooking time, ingredients, instructions, and nutritional information

3. **Canonical URLs**
   - All pages have canonical URLs to prevent duplicate content issues

4. **Sitemap.xml**
   - Static sitemap.xml file in the public directory
   - Dynamic sitemap generator script to keep it updated

5. **Robots.txt**
   - Properly configured robots.txt file to guide search engines

## Maintaining SEO Features

### Automatic Sitemap Updates

The sitemap is now automatically updated in several ways:

1. **On Server Startup**: The sitemap is generated when the backend server starts.

2. **On Content Changes**: The sitemap is automatically updated whenever:
   - A new recipe is added
   - A recipe is updated
   - A recipe is deleted

3. **Manual Trigger**: You can manually trigger a sitemap update via the API:
   ```
   POST /sitemap/generate/
   ```

4. **Scheduled Updates**: A scheduled task runs daily to ensure the sitemap is up-to-date:
   - Run manually: `run_sitemap_generator.bat`
   - Set up in Windows Task Scheduler:
     1. Open Task Scheduler
     2. Create a new task
     3. Set the trigger (e.g., daily at 2 AM)
     4. Set the action: Program/script: `C:\path\to\copycat-recipes\run_sitemap_generator.bat`
     5. Save the task

These mechanisms ensure that your sitemap always reflects the current content on your site, even when adding thousands of recipes.

### Adding New Content

When adding new content, ensure that:

1. All recipe titles include "Homemade" where appropriate
2. All recipe descriptions are unique and descriptive
3. All images have proper alt text
4. All content is properly categorized

### Monitoring SEO Performance

Use tools like Google Search Console and Google Analytics to monitor:

1. Search rankings
2. Click-through rates
3. Organic traffic
4. Crawl errors

## SEO Best Practices for Future Development

1. **Page Speed Optimization**
   - Optimize images
   - Minimize CSS and JavaScript
   - Use lazy loading for images
   - Implement caching

2. **Mobile Optimization**
   - Ensure all pages are mobile-friendly
   - Test on various devices and screen sizes

3. **Content Strategy**
   - Regularly add new recipes
   - Update existing recipes with new information
   - Create blog posts about cooking techniques, ingredient substitutions, etc.

4. **Internal Linking**
   - Link between related recipes
   - Link from category pages to relevant recipes
   - Link from brand pages to relevant recipes

5. **External Linking**
   - Seek backlinks from food blogs and recipe sites
   - Share content on social media
   - Engage with food communities

## Technical SEO Implementation Details

### Recipe Schema Markup

Recipe pages include JSON-LD structured data following the [schema.org/Recipe](https://schema.org/Recipe) format. This helps search engines understand the content and display rich snippets in search results.

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Homemade Sour Patch Kids",
  "image": "https://knockoffkitchen.com/images/recipes/sour-patch-kids.jpg",
  "author": {
    "@type": "Organization",
    "name": "KnockoffKitchen.com"
  },
  "datePublished": "2025-03-12",
  "description": "Learn how to make homemade Sour Patch Kids candy that tastes just like the original but healthier.",
  "prepTime": "PT15M",
  "cookTime": "PT30M",
  "totalTime": "PT45M",
  "keywords": "homemade sour patch kids, sour patch kids recipe, copycat recipe",
  "recipeYield": "4 servings",
  "recipeCategory": "Candy",
  "recipeCuisine": "American",
  "recipeIngredient": [
    "1 cup sugar",
    "1/4 cup citric acid",
    "1/2 cup corn syrup",
    "1/4 cup water",
    "Food coloring"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "position": 1,
      "text": "Mix sugar and citric acid in a bowl."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "text": "Heat corn syrup and water in a saucepan."
    }
  ]
}
```

### Canonical URLs

All pages include a canonical URL to prevent duplicate content issues. This is implemented in the metadata for each page:

```typescript
const canonicalUrl = `https://knockoffkitchen.com/recipes/${params.slug}`;

return {
  // ...
  alternates: {
    canonical: canonicalUrl,
  },
  // ...
};
```

### Dynamic Sitemap Generation

The sitemap generator script fetches all recipes, brands, and categories from the API and generates a sitemap.xml file. This ensures that search engines can discover all content on the site.

To add new pages to the sitemap, update the `scripts/generate-sitemap.js` file.
