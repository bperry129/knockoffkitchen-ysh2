"use client";

import React, { useState, useRef } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      showError('Please select a CSV file');
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    if (!file.name.endsWith('.csv')) {
      showError('Please upload a CSV file');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('use_ai', 'true');
    formData.append('limit', '0');
    
    setIsLoading(true);
    
    try {
      // First try the simple-upload endpoint
      showMessage('Trying simple-upload endpoint...');
      
      try {
        const simpleResponse = await fetch('/api/admin/simple-upload', {
          method: 'POST',
          body: formData
        });
        
        if (simpleResponse.ok) {
          const data = await simpleResponse.json();
          showSuccess('Simple upload successful: ' + JSON.stringify(data));
          return;
        } else {
          showMessage(`Simple upload failed with status: ${simpleResponse.status} ${simpleResponse.statusText}`);
        }
      } catch (error) {
        showMessage(`Error with simple upload: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // If that fails, try the test-upload endpoint
      showMessage('Trying test-upload endpoint...');
      
      try {
        const testResponse = await fetch('/api/admin/test-upload', {
          method: 'POST',
          body: formData
        });
        
        if (testResponse.ok) {
          const data = await testResponse.json();
          showSuccess('Test upload successful: ' + JSON.stringify(data));
          return;
        } else {
          showMessage(`Test upload failed with status: ${testResponse.status} ${testResponse.statusText}`);
        }
      } catch (error) {
        showMessage(`Error with test upload: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // If that fails, try the original upload-csv endpoint
      showMessage('Trying original upload-csv endpoint...');
      
      try {
        const originalResponse = await fetch('/api/admin/upload-csv', {
          method: 'POST',
          body: formData
        });
        
        if (originalResponse.ok) {
          const data = await originalResponse.json();
          showSuccess('Original upload successful: ' + JSON.stringify(data));
          return;
        } else {
          showMessage(`Original upload failed with status: ${originalResponse.status} ${originalResponse.statusText}`);
        }
      } catch (error) {
        showMessage(`Error with original upload: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // If all endpoints fail, try the PythonAnywhere backend directly
      showMessage('Trying PythonAnywhere backend directly...');
      
      try {
        const backendUrl = 'https://bperry129.pythonanywhere.com/admin/upload-csv';
        const backendResponse = await fetch(backendUrl, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        });
        
        if (backendResponse.ok) {
          const data = await backendResponse.json();
          showSuccess('Backend upload successful: ' + JSON.stringify(data));
          return;
        } else {
          showMessage(`Backend upload failed with status: ${backendResponse.status} ${backendResponse.statusText}`);
        }
      } catch (error) {
        showMessage(`Error with backend upload: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      showError('All upload attempts failed');
      
    } catch (error) {
      showError('Error: ' + (error instanceof Error ? error.message : String(error)));
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  function showMessage(message: string) {
    setStatus(prev => prev + '\n' + message);
    setIsSuccess(false);
    setIsError(false);
    setResult('');
  }
  
  function showSuccess(message: string) {
    setResult(message);
    setIsSuccess(true);
    setIsError(false);
    setIsLoading(false);
  }
  
  function showError(message: string) {
    setResult(message);
    setIsError(true);
    setIsSuccess(false);
    setIsLoading(false);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test CSV Upload</h1>
      
      <form onSubmit={handleFileUpload} className="mb-8">
        <div className="mb-4">
          <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
            CSV File:
          </label>
          <input
            type="file"
            id="csvFile"
            ref={fileInputRef}
            accept=".csv"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            disabled={isLoading}
            required
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test Upload'}
        </button>
      </form>
      
      {status && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md whitespace-pre-line">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <div className="text-sm font-mono">{status}</div>
        </div>
      )}
      
      {result && (
        <div className={`mb-6 p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-800' : isError ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <div className="text-sm font-mono">{result}</div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">CSV Format Instructions:</h2>
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
}
