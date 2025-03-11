"use client";

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Search: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="search"
        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
        placeholder="Search recipes..."
        aria-label="Search recipes"
      />
    </div>
  );
};
