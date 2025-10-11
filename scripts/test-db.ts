import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET'
    });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_USER === 'root' ? '' : (process.env.DB_PASSWORD || ''), // No password for root
      // Don't specify database initially
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Database connection successful!');

    // Try to select the database
    await connection.execute(`USE ${process.env.DB_NAME || 'ordify_db'}`);
    console.log('✅ Database selection successful!');

    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);

    await connection.end();
    console.log('✅ Connection closed successfully');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();