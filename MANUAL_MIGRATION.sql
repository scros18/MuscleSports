-- Manual migration SQL commands
-- Run these directly in your MySQL database if the npm scripts don't work

-- 1. Add maintenance mode columns to business_settings
ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS is_maintenance_mode TINYINT(1) DEFAULT 0 AFTER social_media;

ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS maintenance_message TEXT DEFAULT NULL AFTER is_maintenance_mode;

ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS estimated_time VARCHAR(255) DEFAULT NULL AFTER maintenance_message;

-- 2. Add shipping_address column to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS shipping_address TEXT DEFAULT NULL AFTER password_hash;

-- Verify the columns were added
SHOW COLUMNS FROM business_settings;
SHOW COLUMNS FROM users;

