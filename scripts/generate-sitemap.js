#!/usr/bin/env node

/**
 * Dynamic Sitemap Generator for KnockoffKitchen.com
 * 
 * This script generates a sitemap.xml file that includes:
 * - All static pages
 * - All recipe pages
 * - All brand pages
 * - All category pages
 * 
 * Run this script periodically (e.g., daily) to keep the sitemap up to date.
 * You can set up a cron job or use a CI/CD pipeline to automate this.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Base URL of the website
const BASE_URL = 'https://knockoffkitchen.com';

// API endpoints
const API_URL = 'http://localhost:3000/api';

// Output file path
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static pages with their change frequency and priority
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/recipes', changefreq: 'daily', priority: '0.9' },
  { url: '/brands', changefreq: 'weekly', priority: '0.8' },
  { url: '/categories', changefreq: 'weekly', priority: '0.8' },
  { url: '/about', changefreq: 'monthly', priority: '0.5' },
  { url: '/contact', changefreq: 'monthly', priority: '0.5' },
];

/**
 * Generate sitemap XML content
 */
async function generateSitemap() {
  try {
    // Fetch all recipes, brands, and categories
    const [recipes, brands, categories] = await Promise.all([
      fetchRecipes(),
      fetchBrands(),
      fetchCategories(),
    ]);

    // Start XML content
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      xmlContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xmlContent += `    <priority>${page.priority}</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    // Add recipe pages
    recipes.forEach(recipe => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/recipes/${recipe.slug}</loc>\n`;
      xmlContent += `    <changefreq>monthly</changefreq>\n`;
      xmlContent += `    <priority>0.7</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    // Add brand pages
    brands.forEach(brand => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/brands/${brand.slug}</loc>\n`;
      xmlContent += `    <changefreq>monthly</changefreq>\n`;
      xmlContent += `    <priority>0.6</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    // Add category pages
    categories.forEach(category => {
      xmlContent += `  <url>\n`;
      xmlContent += `    <loc>${BASE_URL}/categories/${category.slug}</loc>\n`;
      xmlContent += `    <changefreq>monthly</changefreq>\n`;
      xmlContent += `    <priority>0.6</priority>\n`;
      xmlContent += `  </url>\n`;
    });

    // End XML content
    xmlContent += '</urlset>';

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, xmlContent);
    console.log(`Sitemap generated successfully at ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

/**
 * Fetch all recipes from the API
 */
async function fetchRecipes() {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Fetch all brands from the API
 */
async function fetchBrands() {
  try {
    const response = await axios.get(`${API_URL}/recipes?action=brands`);
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

/**
 * Fetch all categories from the API
 */
async function fetchCategories() {
  try {
    const response = await axios.get(`${API_URL}/recipes?action=categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Run the script
generateSitemap();
