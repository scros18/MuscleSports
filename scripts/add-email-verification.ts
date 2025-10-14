import { Database } from '../lib/database';

async function addEmailVerificationColumns() {
  console.log('🔧 Adding email verification columns to users table...');
  
  try {
    // Add email_verified column
    await Database.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Added email_verified column');

    // Add verification_token column
    await Database.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) NULL
    `);
    console.log('✅ Added verification_token column');

    // Add verification_token_expires column
    await Database.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS verification_token_expires DATETIME NULL
    `);
    console.log('✅ Added verification_token_expires column');

    // Add index on verification_token for faster lookups
    await Database.query(`
      CREATE INDEX IF NOT EXISTS idx_verification_token 
      ON users (verification_token)
    `);
    console.log('✅ Added index on verification_token');

    console.log('');
    console.log('🎉 Email verification columns added successfully!');
    console.log('');
    console.log('📧 Email verification system is now ready to use.');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding email verification columns:', error);
    console.error('');
    console.error('Make sure your database is running and accessible.');
    process.exit(1);
  }
}

addEmailVerificationColumns();

