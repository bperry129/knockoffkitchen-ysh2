import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Return environment variables (excluding sensitive ones)
  const envVars = {
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };
  
  // Return the environment variables
  res.status(200).json({
    envVars,
    message: 'Environment variables retrieved successfully',
  });
}
