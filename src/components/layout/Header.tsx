"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from '@/components/search/Search';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-primary">
                  CopyCat Recipes
                </Link>
                
                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link href="/recipes" className="text-gray-700 hover:text-primary">
                    All Recipes
                  </Link>
                  <Link href="/brands" className="text-gray-700 hover:text-primary">
                    Brands
                  </Link>
                  <Link href="/categories" className="text-gray-700 hover:text-primary">
                    Categories
                  </Link>
                  <Link href="/about" className="text-gray-700 hover:text-primary">
                    About
                  </Link>
                </div>
                
                {/* Search */}
                <div className="hidden md:block w-full max-w-xs">
                  <Search />
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                  <div className="mr-4 w-full max-w-xs">
                    <Search />
                  </div>
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
              
              {/* Mobile menu panel */}
              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Disclosure.Button as={Link} href="/recipes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                    All Recipes
                  </Disclosure.Button>
                  <Disclosure.Button as={Link} href="/brands" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                    Brands
                  </Disclosure.Button>
                  <Disclosure.Button as={Link} href="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                    Categories
                  </Disclosure.Button>
                  <Disclosure.Button as={Link} href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100">
                    About
                  </Disclosure.Button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </header>
  );
};
