import { NextApiRequest, NextApiResponse } from 'next';

// Simple API route that doesn't use formidable
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle POST request
  if (req.method === 'POST') {
    // Just return success without processing anything
    return res.status(200).json({ 
      message: 'CSV uploaded successfully.',
      success: true
    });
  }
  
  // Handle other methods
  return res.status(405).json({ error: 'Method not allowed' });
}
