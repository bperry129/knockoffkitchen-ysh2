"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top section with logo and recipe count */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="KnockoffKitchen.com Logo" 
                width={270} 
                height={75} 
                className="h-16 w-auto"
                priority
              />
            </Link>
            {recipeCount > 0 && (
              <div className="ml-4 bg-primary-50 text-primary-800 text-sm font-medium px-3 py-1 rounded-full border border-primary-100 flex items-center">
                <span className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <span>{recipeCount} Homemade Recipes</span>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
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
        
        {/* Bottom section with navigation and search */}
        <div className="hidden md:flex items-center justify-between py-3">
          <nav className="flex items-center">
            <Link 
              href="/recipes" 
              className="text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-primary-50 hover:text-primary-600 transition-colors border-b-2 border-transparent hover:border-primary-600 mr-2"
            >
              Recipes
            </Link>
            <Link 
              href="/brands" 
              className="text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-primary-50 hover:text-primary-600 transition-colors border-b-2 border-transparent hover:border-primary-600 mr-2"
            >
              Brands
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-primary-50 hover:text-primary-600 transition-colors border-b-2 border-transparent hover:border-primary-600 mr-2"
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-primary-50 hover:text-primary-600 transition-colors border-b-2 border-transparent hover:border-primary-600 mr-2"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-primary-50 hover:text-primary-600 transition-colors border-b-2 border-transparent hover:border-primary-600"
            >
              Contact
            </Link>
          </nav>
          <div className="w-72">
            <Search />
          </div>
        </div>
          
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg shadow-inner">
            <div className="px-4 mb-4">
              <Search />
            </div>
            <nav className="flex flex-col space-y-2 px-4">
              <Link 
                href="/recipes" 
                className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:text-primary-600 transition-colors border-l-4 border-transparent hover:border-primary-600"
              >
                Recipes
              </Link>
              <Link 
                href="/brands" 
                className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:text-primary-600 transition-colors border-l-4 border-transparent hover:border-primary-600"
              >
                Brands
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:text-primary-600 transition-colors border-l-4 border-transparent hover:border-primary-600"
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:text-primary-600 transition-colors border-l-4 border-transparent hover:border-primary-600"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:text-primary-600 transition-colors border-l-4 border-transparent hover:border-primary-600"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
