-- Migration: Add PayPal Payment Support to Orders Table
-- This migration adds payment tracking fields to the orders table

-- Add payment_method column (stores 'paypal', 'stripe', etc.)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) AFTER shipping_address;

-- Add payment_id column (stores PayPal transaction ID, Stripe charge ID, etc.)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255) AFTER payment_method;

-- Update status enum to include 'paid' status
ALTER TABLE orders 
MODIFY COLUMN status ENUM('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending';

-- Add index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_id ON orders(payment_id);

-- Add index on payment_method for reporting queries
CREATE INDEX IF NOT EXISTS idx_payment_method ON orders(payment_method);

-- Show updated table structure
DESCRIBE orders;
