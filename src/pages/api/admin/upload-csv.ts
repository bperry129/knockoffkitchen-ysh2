import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = new formidable.IncomingForm({
      keepExtensions: true
    });
    
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    // Get the uploaded file
    const fileField = files.file;
    
    if (!fileField) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Handle both single file and array of files
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    
    // Check if file is a CSV
    if (!file.originalFilename?.endsWith('.csv')) {
      return res.status(400).json({ error: 'Please upload a CSV file' });
    }
    
    // Get form parameters
    const useAIValue = Array.isArray(fields.use_ai) ? fields.use_ai[0] : fields.use_ai;
    const useAI = useAIValue === 'true';
    
    const limitValue = Array.isArray(fields.limit) ? fields.limit[0] : fields.limit;
    const limit = parseInt(limitValue || '0') || 0;
    
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Create a new file path
    const newFilePath = path.join(tempDir, `upload_${Date.now()}.csv`);
    
    // Copy the file to the new location
    const readFile = promisify(fs.readFile);
    const writeFile = promisify(fs.writeFile);
    
    const data = await readFile(file.filepath);
    await writeFile(newFilePath, data);
    
    // Forward the request to the backend API
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    
    // Create form data for the backend API
    const formData = new FormData();
    formData.append('file', new Blob([data], { type: 'text/csv' }), file.originalFilename || 'upload.csv');
    formData.append('use_ai', useAI.toString());
    formData.append('limit', limit.toString());
    
    // Send the request to the backend API
    const response = await fetch(`${apiUrl}/admin/upload-csv`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Return the response from the backend API
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('Error handling CSV upload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
