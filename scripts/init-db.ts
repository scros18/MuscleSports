import dotenv from 'dotenv';
import { Database } from '../lib/database';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function initDatabase() {
  try {
    console.log('Initializing database...');
    console.log('DB Config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    await Database.initTables();
    console.log('Database initialized successfully!');

    // Test the connection
    const users = await Database.getAllUsers() as any[];
    console.log(`Current users in database: ${users.length}`);

  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

initDatabase();