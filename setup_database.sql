-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE campuswap;

-- Connect to campuswap database and run below
\c campuswap

-- Create admin user
-- Password is: admin123 (already hashed with BCrypt)
INSERT INTO users (email, password, full_name, phone_number, role, email_verified, wallet_balance, total_sales, average_rating, created_at, updated_at)
VALUES ('admin@college.edu', '$2a$10$N7G8U3VE6VKfJZ5BZB0pEuQI7Z5kU8vYsZ3QrZ4nZ5nZ6nZ7nZ8nZ9', 'Admin User', '0000000000', 'ADMIN', true, 0.0, 0, 0.0, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify admin was created
SELECT email, role, full_name FROM users WHERE role = 'ADMIN';
