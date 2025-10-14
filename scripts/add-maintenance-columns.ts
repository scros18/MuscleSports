import { Database } from '../lib/database';

async function addMaintenanceColumns() {
  console.log('Adding maintenance mode columns to business_settings table...');
  
  try {
    // Check if columns already exist
    const checkSql = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'business_settings' 
      AND COLUMN_NAME IN ('is_maintenance_mode', 'maintenance_message', 'estimated_time')
    `;
    
    const existingColumns = await Database.query(checkSql) as any[];
    const existingColumnNames = Array.isArray(existingColumns) 
      ? existingColumns.map((row: any) => row.COLUMN_NAME)
      : [];
    
    // Add is_maintenance_mode column if it doesn't exist
    if (!existingColumnNames.includes('is_maintenance_mode')) {
      console.log('Adding is_maintenance_mode column...');
      await Database.query(`
        ALTER TABLE business_settings 
        ADD COLUMN is_maintenance_mode TINYINT(1) DEFAULT 0 AFTER social_media
      `);
      console.log('✓ Added is_maintenance_mode column');
    } else {
      console.log('✓ is_maintenance_mode column already exists');
    }
    
    // Add maintenance_message column if it doesn't exist
    if (!existingColumnNames.includes('maintenance_message')) {
      console.log('Adding maintenance_message column...');
      await Database.query(`
        ALTER TABLE business_settings 
        ADD COLUMN maintenance_message TEXT DEFAULT NULL AFTER is_maintenance_mode
      `);
      console.log('✓ Added maintenance_message column');
    } else {
      console.log('✓ maintenance_message column already exists');
    }
    
    // Add estimated_time column if it doesn't exist
    if (!existingColumnNames.includes('estimated_time')) {
      console.log('Adding estimated_time column...');
      await Database.query(`
        ALTER TABLE business_settings 
        ADD COLUMN estimated_time VARCHAR(255) DEFAULT NULL AFTER maintenance_message
      `);
      console.log('✓ Added estimated_time column');
    } else {
      console.log('✓ estimated_time column already exists');
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('Maintenance mode columns are ready to use.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the migration
addMaintenanceColumns();

