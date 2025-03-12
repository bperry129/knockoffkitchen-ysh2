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
    
    // Process the CSV file directly
    console.log('Processing CSV file directly');
    
    try {
      // Read the CSV file
      const csvContent = data.toString('utf-8');
      console.log('CSV content:', csvContent.substring(0, 200) + '...');
      
      // Parse the CSV content
      const rows = csvContent.split('\n').filter(row => row.trim() !== '');
      console.log(`Found ${rows.length} rows in CSV`);
      
      // Parse the header row to get column names
      const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
      console.log('CSV headers:', headers);
      
      // Check if required columns exist
      const productIndex = headers.findIndex(h => 
        h === 'product' || h === 'product name' || h === 'productname');
      const brandIndex = headers.findIndex(h => h === 'brand');
      const imageUrlIndex = headers.findIndex(h => h === 'image_url');
      
      if (productIndex === -1 || brandIndex === -1) {
        return res.status(400).json({ 
          error: 'CSV file must contain "Product" and "Brand" columns' 
        });
      }
      
      // Process the data rows
      const products = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',').map(value => value.trim());
        
        if (values.length >= Math.max(productIndex, brandIndex) + 1) {
          const product = {
            product: values[productIndex],
            brand: values[brandIndex],
            image_url: imageUrlIndex !== -1 && imageUrlIndex < values.length ? 
              values[imageUrlIndex] : undefined
          };
          products.push(product);
        }
      }
      
      console.log(`Successfully processed ${products.length} products`);
      
      // In a real implementation, you would send this data to your backend
      // or process it directly here
      
      // For now, just return success
      return res.status(200).json({
        message: `CSV uploaded successfully. Processed ${products.length} products.`,
        products: products.slice(0, 5) // Return first 5 products as preview
      });
    } catch (csvError) {
      console.error('Error processing CSV:', csvError);
      return res.status(400).json({ 
        error: 'Error processing CSV file',
        details: csvError instanceof Error ? csvError.message : undefined
      });
    }
    
  } catch (error) {
    console.error('Error handling CSV upload:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
