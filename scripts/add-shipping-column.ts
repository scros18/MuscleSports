import { Database } from '../lib/database';

async function addShippingColumn() {
  console.log('Adding shipping_address column to users table...');
  
  try {
    // Check if column already exists
    const checkSql = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'shipping_address'
    `;
    
    const existingColumns = await Database.query(checkSql) as any[];
    const columnExists = Array.isArray(existingColumns) && existingColumns.length > 0;
    
    if (!columnExists) {
      console.log('Adding shipping_address column...');
      await Database.query(`
        ALTER TABLE users 
        ADD COLUMN shipping_address TEXT DEFAULT NULL AFTER password_hash
      `);
      console.log('✓ Added shipping_address column');
    } else {
      console.log('✓ shipping_address column already exists');
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('Shipping address column is ready to use.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the migration
addShippingColumn();

