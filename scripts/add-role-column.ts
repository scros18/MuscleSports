import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function addRoleColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ordify_db',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    console.log('Adding role column to users table...');

    // Add role column if it doesn't exist
    await connection.execute(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user'
    `);

    console.log('✓ Role column added successfully!');

    // Now make the user an admin
    console.log('Making leon@ordifydirect.com an admin...');
    await connection.execute(`
      UPDATE users
      SET role = 'admin', updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `, ['leon@ordifydirect.com']);

    console.log('✓ Successfully made leon@ordifydirect.com an admin!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

addRoleColumn();