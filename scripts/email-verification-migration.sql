-- Email Verification Migration
-- Run this file to add email verification columns to your users table
-- Usage: mysql -u YOUR_USER -p YOUR_DATABASE < scripts/email-verification-migration.sql

USE ecommerce;

-- Add email_verified column (ignore if exists)
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Add verification_token column (ignore if exists)
ALTER TABLE users 
ADD COLUMN verification_token VARCHAR(255) NULL;

-- Add verification_token_expires column (ignore if exists)
ALTER TABLE users 
ADD COLUMN verification_token_expires DATETIME NULL;

-- Add index on verification_token for faster lookups
ALTER TABLE users
ADD INDEX idx_verification_token (verification_token);

-- Verify the changes
DESCRIBE users;

-- Show success message
SELECT '✅ Email verification columns added successfully!' AS Status;

