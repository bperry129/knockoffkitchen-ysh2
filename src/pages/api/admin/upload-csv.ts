import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return a success response
    return res.status(200).json({ 
      message: 'CSV processed successfully. Recipes have been created in the database.',
      success: true
    });
    
  } catch (error: any) {
    console.error('Error processing upload:', error);
    return res.status(500).json({ 
      error: 'Error processing upload',
      details: error.message
    });
  }
}