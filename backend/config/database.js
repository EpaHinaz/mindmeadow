const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    
    // Initialize database tables if they don't exist
    await initTables();
    
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    throw error;
  }
};

// Initialize database tables
const initTables = async () => {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'parent')),
        grade_level VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Worksheets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS worksheets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        level VARCHAR(50) NOT NULL,
        stage VARCHAR(100) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags TEXT[] DEFAULT '{}'
      )
    `);

    // Submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        worksheet_id INTEGER REFERENCES worksheets(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        answers TEXT NOT NULL,
        score DECIMAL(5,2),
        feedback TEXT,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'graded')),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        graded_at TIMESTAMP,
        graded_by INTEGER REFERENCES users(id)
      )
    `);

    // Sample data insertion (only in development)
    if (process.env.NODE_ENV === 'development') {
      await seedSampleData(client);
    }

    console.log('Database tables initialized');
  } finally {
    client.release();
  }
};

// Seed sample data
const seedSampleData = async (client) => {
  try {
    // Check if we already have worksheets
    const { rows } = await client.query('SELECT COUNT(*) FROM worksheets');
    if (parseInt(rows[0].count) === 0) {
      console.log('Seeding sample data...');
      
      // Insert sample worksheets
      await client.query(`
        INSERT INTO worksheets (title, subject, description, content, level, stage, tags) VALUES
        ('Basic Fractions', 'math', 'Learn to identify and compare simple fractions', 'Fraction worksheet content...', 'Beginner', 'Elementary', ARRAY['fractions', 'math', 'elementary']),
        ('Grammar Essentials', 'english', 'Practice with nouns, verbs, and sentence structure', 'Grammar worksheet content...', 'Intermediate', 'Middle School', ARRAY['grammar', 'english', 'middle-school']),
        ('Solar System', 'science', 'Explore planets and celestial bodies', 'Science worksheet content...', 'Beginner', 'Elementary', ARRAY['science', 'solar-system', 'planets']),
        ('Algebra Basics', 'math', 'Introduction to variables and simple equations', 'Algebra worksheet content...', 'Intermediate', 'Middle School', ARRAY['algebra', 'math', 'equations']),
        ('Ancient Civilizations', 'history', 'Explore early human societies and cultures', 'History worksheet content...', 'Intermediate', 'Middle School', ARRAY['history', 'ancient', 'civilizations'])
      `);
      
      console.log('Sample data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
};

module.exports = { pool, connectDB };