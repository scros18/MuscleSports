-- Email Verification Migration
-- Run this file to add email verification columns to your users table
-- Usage: mysql -u YOUR_USER -p YOUR_DATABASE < scripts/email-verification-migration.sql

USE ordify_db;

-- Add email_verified column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Add verification_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) NULL;

-- Add verification_token_expires column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token_expires DATETIME NULL;

-- Add index on verification_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_token 
ON users (verification_token);

-- Verify the changes
DESCRIBE users;

-- Show success message
SELECT '✅ Email verification columns added successfully!' AS Status;

