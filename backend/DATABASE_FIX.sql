-- CampusSwap Database Migration
-- Run this in PostgreSQL to fix the schema

-- Add new columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS campus_coins INTEGER DEFAULT 0;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS boosted BOOLEAN DEFAULT false;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMP;

-- Update existing records with default values
UPDATE users 
SET campus_coins = 0 
WHERE campus_coins IS NULL;

UPDATE users 
SET total_referrals = 0 
WHERE total_referrals IS NULL;

UPDATE products 
SET boosted = false 
WHERE boosted IS NULL;

-- Create coin_transactions table if not exists
CREATE TABLE IF NOT EXISTS coin_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create cart table if not exists
CREATE TABLE IF NOT EXISTS cart (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
);

-- Verify the changes
SELECT 'Users with coins' as check_name, COUNT(*) as count FROM users WHERE campus_coins IS NOT NULL;
SELECT 'Products count' as check_name, COUNT(*) as count FROM products;
SELECT 'Coin transactions' as check_name, COUNT(*) as count FROM coin_transactions;
SELECT 'Cart items' as check_name, COUNT(*) as count FROM cart;

-- Show sample data
SELECT id, email, full_name, campus_coins, total_referrals, referral_code 
FROM users 
LIMIT 5;
