# KnockoffKitchen.com Deployment Guide

This guide will walk you through the process of deploying KnockoffKitchen.com to production using Namecheap for domain registration, Vercel for frontend hosting, and PythonAnywhere for backend hosting.

## Prerequisites

Before you begin, make sure you have:

1. A Namecheap account for domain registration
2. A Vercel account for frontend hosting
3. A PythonAnywhere account for backend hosting
4. A MongoDB Atlas account for database hosting

## Step 1: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Cluster"
   - Choose the free tier option (M0)
   - Select a cloud provider and region closest to your users
   - Click "Create Cluster"

3. **Set Up Database Access**
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Create a username and a secure password
   - Set privileges to "Read and Write to Any Database"
   - Click "Add User"

4. **Configure Network Access**
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" for now (you can restrict this later)
   - Click "Confirm"

5. **Get Connection String**
   - Once your cluster is created, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Save this connection string for later use

## Step 2: Deploy Backend to PythonAnywhere

1. **Create a PythonAnywhere Account**
   - Go to [PythonAnywhere](https://www.pythonanywhere.com/)
   - Sign up for an account (Hacker plan recommended for $5/month)

2. **Upload Backend Code**
   - In PythonAnywhere, go to the "Files" tab
   - Create a new directory called `knockoffkitchen`
   - Upload your backend files to this directory
   - Make sure to include:
     - `mongodb_main.py`
     - `mongodb_crud.py`
     - `mongodb_setup.py`
     - `generate_recipes.py`
     - `deepseek_api.py`
     - `sitemap_generator.py`
     - Any other required files

3. **Set Up a Virtual Environment**
   - Go to the "Consoles" tab
   - Start a new Bash console
   - Run the following commands:
     ```bash
     cd knockoffkitchen
     python -m venv venv
     source venv/bin/activate
     pip install fastapi uvicorn pymongo pandas requests
     ```

4. **Configure Environment Variables**
   - In the "Files" tab, create a new file called `.env` in your project directory
   - Add the following environment variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     OPENROUTER_API_KEY=your_openrouter_api_key
     ```

5. **Set Up Web App**
   - Go to the "Web" tab
   - Click "Add a new web app"
   - Choose "Manual configuration"
   - Select Python version (3.9 or higher)
   - Enter the path to your project directory
   - Configure the WSGI file to use FastAPI:
     ```python
     import sys
     import os
     
     # Add your project directory to the path
     path = '/home/yourusername/knockoffkitchen'
     if path not in sys.path:
         sys.path.append(path)
     
     # Load environment variables
     from dotenv import load_dotenv
     load_dotenv(os.path.join(path, '.env'))
     
     # Import your FastAPI app
     from mongodb_main import app
     
     # Create ASGI application
     from fastapi.middleware.wsgi import WSGIMiddleware
     application = WSGIMiddleware(app)
     ```

6. **Configure Static Files**
   - In the "Web" tab, add a static files mapping:
     - URL: `/static/`
     - Directory: `/home/yourusername/knockoffkitchen/static`

7. **Restart Web App**
   - Click the "Reload" button for your web app

## Step 3: Deploy Frontend to Vercel

1. **Push Your Code to GitHub**
   - Create a new GitHub repository
   - Push your frontend code to this repository

2. **Connect Vercel to GitHub**
   - Go to [Vercel](https://vercel.com/)
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In the Vercel project settings, add the following environment variables:
     ```
     BACKEND_API_URL=https://yourusername.pythonanywhere.com
     ```

4. **Deploy Your Project**
   - Click "Deploy"
   - Wait for the deployment to complete

5. **Verify Deployment**
   - Click on the deployment URL to verify that your site is working

## Step 4: Connect Domain to Vercel

1. **Purchase Domain on Namecheap**
   - Go to [Namecheap](https://www.namecheap.com/)
   - Search for your desired domain (e.g., knockoffkitchen.com)
   - Purchase the domain

2. **Add Domain to Vercel**
   - In your Vercel project, go to "Settings" > "Domains"
   - Add your domain (e.g., knockoffkitchen.com)
   - Vercel will provide you with nameserver information

3. **Update Nameservers on Namecheap**
   - Go to your Namecheap dashboard
   - Find your domain and click "Manage"
   - Go to "Domain" tab
   - Under "Nameservers", select "Custom DNS"
   - Enter the nameservers provided by Vercel
   - Save changes

4. **Wait for DNS Propagation**
   - DNS changes can take up to 48 hours to propagate
   - You can check the status in your Vercel domain settings

## Step 5: Set Up Admin Dashboard

1. **Access Admin Dashboard**
   - Go to your website's admin dashboard at `https://yourdomain.com/admin`

2. **Upload CSV Files**
   - Use the admin dashboard to upload CSV files for recipe generation
   - Make sure your CSV files have the required columns:
     - Product
     - Brand
     - Category (optional)

## Maintenance and Updates

### Updating the Frontend

1. Make changes to your local code
2. Push changes to GitHub
3. Vercel will automatically deploy the changes

### Updating the Backend

1. Make changes to your local code
2. Upload the updated files to PythonAnywhere
3. Reload the web app

### Database Backups

1. In MongoDB Atlas, go to "Backup"
2. Configure automated backups
3. You can also manually create backups as needed

## Troubleshooting

### Frontend Issues

- Check Vercel deployment logs for errors
- Verify environment variables are set correctly
- Test locally before deploying

### Backend Issues

- Check PythonAnywhere error logs
- Verify MongoDB connection string is correct
- Test API endpoints using a tool like Postman

### Database Issues

- Check MongoDB Atlas logs
- Verify network access settings
- Ensure database user has correct permissions

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PythonAnywhere Documentation](https://help.pythonanywhere.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Namecheap Documentation](https://www.namecheap.com/support/knowledgebase/)

## Support

If you encounter any issues during deployment, please contact support at support@knockoffkitchen.com.
