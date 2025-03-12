"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UploadFormState {
  isUploading: boolean;
  useAI: boolean;
  limit: number;
  message: string;
  error: string;
}

const AdminDashboard: React.FC = () => {
  const [formState, setFormState] = useState<UploadFormState>({
    isUploading: false,
    useAI: true,
    limit: 0,
    message: '',
    error: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      setFormState(prev => ({
        ...prev,
        error: 'Please select a CSV file to upload'
      }));
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    // Check if file is a CSV
    if (!file.name.endsWith('.csv')) {
      setFormState(prev => ({
        ...prev,
        error: 'Please upload a CSV file'
      }));
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('use_ai', formState.useAI.toString());
    formData.append('limit', formState.limit.toString());
    
    // Set uploading state
    setFormState(prev => ({
      ...prev,
      isUploading: true,
      message: 'Uploading CSV file...',
      error: ''
    }));
    
    try {
      // Get the base URL for API requests
      const baseUrl = window.location.origin;
      
      // Upload the file
      const response = await fetch(`${baseUrl}/api/admin/upload-csv`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update state with success message
      setFormState(prev => ({
        ...prev,
        isUploading: false,
        message: data.message || 'CSV uploaded successfully. Recipe generation started in the background.',
        error: ''
      }));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh the page after a delay to show new recipes
      setTimeout(() => {
        router.refresh();
      }, 5000);
      
    } catch (error) {
      console.error('Error uploading CSV:', error);
      
      // Update state with error message
      setFormState(prev => ({
        ...prev,
        isUploading: false,
        message: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Upload CSV for Recipe Generation</h2>
      
      {/* Status Messages */}
      {formState.message && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          {formState.message}
        </div>
      )}
      
      {formState.error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {formState.error}
        </div>
      )}
      
      {/* Upload Form */}
      <form onSubmit={handleFileUpload} className="space-y-6">
        <div>
          <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700 mb-2">
            CSV File
          </label>
          <input
            type="file"
            id="csv-file"
            ref={fileInputRef}
            accept=".csv"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            disabled={formState.isUploading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload a CSV file with columns: Product, Brand, Category
          </p>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="use-ai"
            checked={formState.useAI}
            onChange={(e) => setFormState(prev => ({ ...prev, useAI: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={formState.isUploading}
          />
          <label htmlFor="use-ai" className="ml-2 block text-sm text-gray-700">
            Use AI for recipe generation (recommended)
          </label>
        </div>
        
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
            Limit (0 for no limit)
          </label>
          <input
            type="number"
            id="limit"
            min="0"
            value={formState.limit}
            onChange={(e) => setFormState(prev => ({ ...prev, limit: parseInt(e.target.value) || 0 }))}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            disabled={formState.isUploading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Limit the number of recipes to generate (0 = process all rows)
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              formState.isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={formState.isUploading}
          >
            {formState.isUploading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">CSV Format Instructions</h3>
        <p className="mb-2">Your CSV file should have the following columns:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li><strong>Product</strong>: The name of the product (e.g., "Original Potato Chips")</li>
          <li><strong>Brand</strong>: The brand name (e.g., "Pringles")</li>
          <li><strong>Category</strong>: Optional category (e.g., "Chips", "Snacks", "Cookies")</li>
        </ul>
        <p className="text-sm text-gray-500">
          Example: "Original Potato Chips,Pringles,Chips"
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
