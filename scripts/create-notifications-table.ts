#!/usr/bin/env tsx

import { Database } from '../lib/database';

async function createNotificationsTable() {
  try {
    console.log('Creating notifications table...');

    // Create notifications table
    await Database.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('order', 'account', 'promotion', 'system') NOT NULL DEFAULT 'system',
        \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
        action_url VARCHAR(500) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_read (\`read\`),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Notifications table created successfully!');
    
    // Check if table was created
    const tables = await Database.query("SHOW TABLES LIKE 'notifications'") as any[];
    if (tables && tables.length > 0) {
      console.log('✅ Verified: notifications table exists');
      
      // Show table structure
      const structure = await Database.query("DESCRIBE notifications") as any[];
      console.log('\nTable structure:');
      console.table(structure);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating notifications table:', error);
    process.exit(1);
  }
}

createNotificationsTable();
