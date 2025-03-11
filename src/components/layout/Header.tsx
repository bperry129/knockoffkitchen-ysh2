"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from '@/components/search/Search';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recipeCount, setRecipeCount] = useState(0);
  
  // Fetch recipe count on component mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/recipes?action=count');
        if (response.ok) {
          const data = await response.json();
          setRecipeCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching recipe count:', error);
      }
    };
    
    fetchCount();
    
    // Set up polling to update the count every 10 seconds
    const intervalId = setInterval(fetchCount, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              CopyCat Recipes
            </Link>
            {recipeCount > 0 && (
              <span className="ml-3 bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {recipeCount} Homemade Recipes
              </span>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Search />
            <nav className="flex items-center space-x-6">
              <Link href="/recipes" className="text-gray-700 hover:text-primary-600">
                Recipes
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-primary-600">
                Brands
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary-600">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Search />
            <nav className="mt-4 flex flex-col space-y-4">
              <Link href="/recipes" className="text-gray-700 hover:text-primary-600">
                Recipes
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-primary-600">
                Brands
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary-600">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
