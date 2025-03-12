// Simple API route that returns environment variables
export default function handler(req, res) {
  // Return environment variables (excluding sensitive ones)
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    // Add any other environment variables you want to check
  };
  
  // Return the environment variables
  res.status(200).json(envVars);
}
