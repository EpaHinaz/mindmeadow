# Deployment Guide 
Quick Deployment Options
Option 1: All-in-One (Easiest)
Use Netlify for Frontend + Backend Functions

Sign up at netlify.com

Drag and drop the entire project folder to Netlify

Netlify will automatically:

Host your frontend

Provide a free HTTPS domain

Handle deployments

Limitation: Backend API won't work (frontend will use mock data)

Option 2: Full Stack Deployment (Recommended)
Step 1: Deploy Backend on Render.com
Create GitHub repository

bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/worksheetweb.git
git push -u origin main
Sign up at render.com (use GitHub login)

Create PostgreSQL Database:

Click "New +" → "PostgreSQL"

Name: worksheetweb-db

Plan: Free

Click "Create Database"

Create Web Service:

Click "New +" → "Web Service"

Connect your GitHub repository

Configure:

Name: worksheetweb-backend

Environment: Node

Build Command: npm install

Start Command: npm start

Plan: Free

Add Environment Variables:

NODE_ENV: production

DATABASE_URL: (Copy from your PostgreSQL database connection info)

JWT_SECRET: (Generate a random string)

FRONTEND_URL: (Will add after deploying frontend)

Click "Create Web Service"

Step 2: Deploy Frontend on Netlify
Sign up at netlify.com

Deploy from GitHub:

Click "New site from Git"

Select GitHub

Choose your repository

Configure build settings:

Build command: (leave empty)

Publish directory: frontend

Click "Deploy site"

Get your frontend URL: https://your-site-name.netlify.app

Step 3: Update Environment Variables
Go back to Render.com dashboard

Edit your web service

Update FRONTEND_URL to your Netlify URL

Redeploy if necessary

Step 4: Update Frontend API URL
In frontend/js/app.js, update the API_BASE_URL:

javascript
this.API_BASE_URL = 'https://worksheetweb-backend.onrender.com/api';
Commit and push changes

Netlify will automatically redeploy

Testing Your Deployment
Backend Health Check
text
https://worksheetweb-backend.onrender.com/health
API Documentation
text
https://worksheetweb-backend.onrender.com/api
Test Registration
bash
curl -X POST https://worksheetweb-backend.onrender.com/api/auth/register   -H "Content-Type: application/json"   -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "student",
    "grade_level": "5"
  }'
Alternative Hosting Options
Railway.app (Alternative to Render)
Sign up at railway.app

Connect GitHub repository

Add PostgreSQL plugin

Deploy - similar process to Render

Vercel + MongoDB Atlas
Frontend on Vercel:

bash
npm install -g vercel
vercel
Backend as Serverless Functions:

Move backend logic to /api folder

Vercel handles serverless functions

Database:

Sign up at mongodb.com

Create free cluster

Get connection string

Troubleshooting
Common Issues:
Database Connection Errors:

Check DATABASE_URL environment variable

Ensure PostgreSQL is running

Verify database credentials

CORS Errors:

Update FRONTEND_URL in backend environment variables

Check browser console for specific errors

API Not Responding:

Check Render.com logs

Verify the service is running (not sleeping)

Free services sleep after inactivity

Static Files Not Loading:

Check Netlify deployment logs

Verify file paths in HTML

Clear browser cache

Monitoring:
Render.com: View logs in dashboard

Netlify: Access logs in site settings

Browser: Use Developer Tools console

Cost Summary
Backend (Render): Free (750 hours/month)

Database (Render): Free (1GB storage)

Frontend (Netlify): Free

Total: $0/month

Scaling Up
When you need more resources:

Upgrade Render PostgreSQL to paid plan ($7/month)

Add Redis caching

Use CDN for static assets

Implement load balancing

Backup Strategy
Enable automated backups on Render PostgreSQL

Regular database exports

GitHub repository as code backup

Support
For deployment issues:

Check service provider documentation

Review error logs

Test locally first

Search for similar issues online

Your application is now live! Share the Netlify URL with users.