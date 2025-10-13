import dotenv from 'dotenv';
import { Database } from '../lib/database';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function addStrengthsColumn() {
  try {
    console.log('Adding strengths column to products table...');
    
    const connection = await Database.getConnection();
    try {
      // Add strengths column (JSON) to products table
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS strengths JSON
      `);
      
      console.log('✅ Successfully added strengths column to products table!');
    } finally {
      connection.release();
    }
    
  } catch (error: any) {
    // If column already exists, that's okay
    if (error.message && error.message.includes('Duplicate column')) {
      console.log('ℹ️  Strengths column already exists');
    } else {
      console.error('❌ Failed to add strengths column:', error);
      process.exit(1);
    }
  }
}

addStrengthsColumn();

