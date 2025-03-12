"""
Generate sitemap.xml for the website
"""
import os
import asyncio
from datetime import datetime
from xml.dom import minidom
from xml.etree import ElementTree as ET

# Import MongoDB utilities
from mongodb_setup import get_recipes_collection, get_brands_collection, get_categories_collection

# Base URL for the website
BASE_URL = "https://knockoffkitchen.com"

async def generate_sitemap():
    """
    Generate sitemap.xml for the website
    """
    print("Generating sitemap.xml...")
    
    # Create root element
    root = ET.Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Add static pages
    static_pages = [
        "/",
        "/recipes",
        "/brands",
        "/categories",
        "/about",
        "/contact"
    ]
    
    for page in static_pages:
        url = ET.SubElement(root, "url")
        loc = ET.SubElement(url, "loc")
        loc.text = f"{BASE_URL}{page}"
        lastmod = ET.SubElement(url, "lastmod")
        lastmod.text = datetime.now().strftime("%Y-%m-%d")
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = "weekly"
        priority = ET.SubElement(url, "priority")
        priority.text = "0.8"
    
    # Add recipe pages
    recipes_collection = get_recipes_collection()
    recipes = list(recipes_collection.find({}, {"slug": 1}))
    
    # If no recipes found, just continue with empty list
    if not recipes:
        recipes = []
    
    for recipe in recipes:
        url = ET.SubElement(root, "url")
        loc = ET.SubElement(url, "loc")
        loc.text = f"{BASE_URL}/recipes/{recipe.get('slug')}"
        lastmod = ET.SubElement(url, "lastmod")
        lastmod.text = datetime.now().strftime("%Y-%m-%d")
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = "monthly"
        priority = ET.SubElement(url, "priority")
        priority.text = "0.7"
    
    # Add brand pages
    brands_collection = get_brands_collection()
    # Check if brands_collection is not None and has find method
    if hasattr(brands_collection, 'find'):
        brands = list(brands_collection.find({}, {"slug": 1}))
        
        for brand in brands:
            url = ET.SubElement(root, "url")
            loc = ET.SubElement(url, "loc")
            loc.text = f"{BASE_URL}/brands/{brand.get('slug')}"
            lastmod = ET.SubElement(url, "lastmod")
            lastmod.text = datetime.now().strftime("%Y-%m-%d")
            changefreq = ET.SubElement(url, "changefreq")
            changefreq.text = "monthly"
            priority = ET.SubElement(url, "priority")
            priority.text = "0.6"
    else:
        # If brands collection doesn't exist, get unique brands from recipes
        recipes_collection = get_recipes_collection()
        brands = recipes_collection.distinct("brand_name")
        
        for brand_name in brands:
            if brand_name:
                # Generate slug from brand name
                slug = brand_name.lower().replace(" ", "-").replace("&", "and")
                
                url = ET.SubElement(root, "url")
                loc = ET.SubElement(url, "loc")
                loc.text = f"{BASE_URL}/brands/{slug}"
                lastmod = ET.SubElement(url, "lastmod")
                lastmod.text = datetime.now().strftime("%Y-%m-%d")
                changefreq = ET.SubElement(url, "changefreq")
                changefreq.text = "monthly"
                priority = ET.SubElement(url, "priority")
                priority.text = "0.6"
    
    # Add category pages
    categories_collection = get_categories_collection()
    # Check if categories_collection is not None and has find method
    if hasattr(categories_collection, 'find'):
        categories = list(categories_collection.find({}, {"slug": 1}))
        
        for category in categories:
            url = ET.SubElement(root, "url")
            loc = ET.SubElement(url, "loc")
            loc.text = f"{BASE_URL}/categories/{category.get('slug')}"
            lastmod = ET.SubElement(url, "lastmod")
            lastmod.text = datetime.now().strftime("%Y-%m-%d")
            changefreq = ET.SubElement(url, "changefreq")
            changefreq.text = "monthly"
            priority = ET.SubElement(url, "priority")
            priority.text = "0.6"
    else:
        # If categories collection doesn't exist, get unique categories from recipes
        recipes_collection = get_recipes_collection()
        categories = recipes_collection.distinct("category")
        
        for category_name in categories:
            if category_name:
                # Generate slug from category name
                slug = category_name.lower().replace(" ", "-").replace("&", "and")
                
                url = ET.SubElement(root, "url")
                loc = ET.SubElement(url, "loc")
                loc.text = f"{BASE_URL}/categories/{slug}"
                lastmod = ET.SubElement(url, "lastmod")
                lastmod.text = datetime.now().strftime("%Y-%m-%d")
                changefreq = ET.SubElement(url, "changefreq")
                changefreq.text = "monthly"
                priority = ET.SubElement(url, "priority")
                priority.text = "0.6"
    
    # Create XML string
    tree = ET.ElementTree(root)
    xml_string = ET.tostring(root, encoding="utf-8")
    
    # Pretty print XML
    xml_dom = minidom.parseString(xml_string)
    pretty_xml = xml_dom.toprettyxml(indent="  ")
    
    # Save to file
    sitemap_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "sitemap.xml")
    os.makedirs(os.path.dirname(sitemap_path), exist_ok=True)
    
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(pretty_xml)
    
    print(f"Sitemap generated at {sitemap_path}")
    
    # Also save a copy to the backend directory for reference
    backend_sitemap_path = os.path.join(os.path.dirname(__file__), "sitemap.xml")
    with open(backend_sitemap_path, "w", encoding="utf-8") as f:
        f.write(pretty_xml)
    
    print(f"Sitemap copy saved at {backend_sitemap_path}")
    
    return pretty_xml

if __name__ == "__main__":
    asyncio.run(generate_sitemap())
