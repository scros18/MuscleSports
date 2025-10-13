import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function addShippingAddressColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ordify_db',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    console.log('Adding shipping_address column to users table...');

    // Add shipping_address column if it doesn't exist
    await connection.execute(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS shipping_address JSON
    `);

    console.log('✓ shipping_address column added successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

addShippingAddressColumn();

