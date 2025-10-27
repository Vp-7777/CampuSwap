-- Update existing users with default coin values
UPDATE users 
SET campus_coins = 0 
WHERE campus_coins IS NULL;

UPDATE users 
SET total_referrals = 0 
WHERE total_referrals IS NULL;

-- Update existing products with default boost values
UPDATE products 
SET boosted = false 
WHERE boosted IS NULL;

-- Check if data exists
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as approved_products FROM products WHERE approval_status = 'APPROVED';

-- If no products, you need to create some through the UI or insert sample data
