# WorksheetWeb - Educational Platform

A kid-friendly platform where students complete worksheets online and teachers review them easily.

## Features
- Secure student & teacher logins
- Worksheets by stage, subject & level
- Easy online submissions
- Teacher dashboard for comments, marks & status
- Student dashboard to view feedback & progress
- Works on any phone, tablet or laptop

## Project Structure
worksheetweb/
├── frontend/ # Client-side application
│ ├── index.html # Main HTML file
│ ├── css/ # Stylesheets
│ ├── js/ # JavaScript modules
│ └── assets/ # Images and other assets
├── backend/ # Server-side application
│ ├── server.js # Express server
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ └── config/ # Configuration files
└── README.md # This file

text

## Quick Start

### 1. Frontend (Immediate Use)
1. Open `frontend/index.html` in your browser
2. No setup required - works immediately!

### 2. Backend Setup (For Full Functionality)

#### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (for production) or SQLite (for development)

#### Installation
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/worksheetweb

# Start development server
npm run dev
Database Setup
Install PostgreSQL

Create a database:

sql
CREATE DATABASE worksheetweb;
The application will automatically create tables on first run

Deployment
Option 1: Render.com (Recommended)
Push code to GitHub

Sign up at render.com

Create a new Web Service

Connect your GitHub repository

Add PostgreSQL database

Deploy!

Option 2: Heroku
Install Heroku CLI

Login: heroku login

Create app: heroku create worksheetweb

Add PostgreSQL: heroku addons:create heroku-postgresql:hobby-dev

Deploy: git push heroku main

Option 3: Vercel + MongoDB Atlas
Frontend on Vercel (free)

Backend as serverless functions

MongoDB Atlas for database (free 512MB)

API Endpoints
Authentication
POST /api/auth/register - Register new user

POST /api/auth/login - Login user

GET /api/auth/profile - Get user profile

Worksheets
GET /api/worksheets - List worksheets (with filters)

GET /api/worksheets/:id - Get single worksheet

POST /api/worksheets - Create new worksheet (teacher only)

Submissions
POST /api/submissions - Submit worksheet

GET /api/submissions/student/:id - Get student submissions

PUT /api/submissions/:id/grade - Grade submission

Development
Running Locally
bash
# Frontend (static files)
# Just open frontend/index.html in browser

# Backend (API server)
cd backend
npm run dev

# Server runs on http://localhost:3001
# API documentation at http://localhost:3001/api
Testing
The frontend works without backend using mock data. For full functionality, run the backend server.

Browser Support
Chrome 60+

Firefox 55+

Safari 11+

Edge 79+

Mobile browsers (iOS Safari, Chrome for Android)

License
MIT License - free for educational use

Support
For issues or questions:

Check the API documentation at /api when server is running

Review the browser console for errors

Ensure backend is running for API functionality

Contributing
This is a demo project. Feel free to fork and modify for your needs.