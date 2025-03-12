// Simple API route that just returns success
export default function handler(req, res) {
  // Return success response
  res.status(200).json({ 
    message: 'CSV uploaded successfully.',
    success: true
  });
}
