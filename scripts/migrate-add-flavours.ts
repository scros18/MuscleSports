import dotenv from 'dotenv';
import { Database } from '../lib/database';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateFlavoursColumns() {
  try {
    console.log('🔄 Adding flavours and flavour_images columns to products table...');

    // Check if columns already exist
    const columns = await Database.query(
      `SHOW COLUMNS FROM products LIKE 'flavours'`
    ) as any[];

    if (columns.length > 0) {
      console.log('✅ Column "flavours" already exists, skipping migration.');
      return;
    }

    // Add flavours column
    await Database.query(
      `ALTER TABLE products ADD COLUMN flavours JSON DEFAULT NULL AFTER in_stock`
    );
    console.log('✅ Added column: flavours');

    // Add flavour_images column
    await Database.query(
      `ALTER TABLE products ADD COLUMN flavour_images JSON DEFAULT NULL AFTER flavours`
    );
    console.log('✅ Added column: flavour_images');

    console.log('\n✅ Migration complete! Database is ready for Tropicana import.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateFlavoursColumns()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
