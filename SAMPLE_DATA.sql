-- CampuSwap Sample Data
-- Run this after the application creates the tables

-- Insert Admin User (password: admin123)
INSERT INTO users (email, password, full_name, phone_number, role, email_verified, wallet_balance, total_sales, average_rating, created_at, updated_at)
VALUES ('admin@college.edu', '$2a$10$rT9Q5kFvW0RJKw0r7Z7kKu5YJm0Y.xY1yZvj8F4K3oK5L6M7N8O9P', 'Admin User', '1234567890', 'ADMIN', true, 0.0, 0, 0.0, NOW(), NOW());

-- Insert Sample Students (password: password123)
INSERT INTO users (email, password, full_name, phone_number, role, email_verified, wallet_balance, total_sales, average_rating, created_at, updated_at) VALUES
('john@college.edu', '$2a$10$rT9Q5kFvW0RJKw0r7Z7kKu5YJm0Y.xY1yZvj8F4K3oK5L6M7N8O9P', 'John Smith', '1234567891', 'STUDENT', true, 50.0, 5, 4.5, NOW(), NOW()),
('sarah@college.edu', '$2a$10$rT9Q5kFvW0RJKw0r7Z7kKu5YJm0Y.xY1yZvj8F4K3oK5L6M7N8O9P', 'Sarah Johnson', '1234567892', 'STUDENT', true, 30.0, 3, 4.8, NOW(), NOW()),
('mike@college.edu', '$2a$10$rT9Q5kFvW0RJKw0r7Z7kKu5YJm0Y.xY1yZvj8F4K3oK5L6M7N8O9P', 'Mike Davis', '1234567893', 'STUDENT', true, 100.0, 8, 4.7, NOW(), NOW());

-- Add seller badges
INSERT INTO user_badges (user_id, badge) VALUES
(2, 'TOP_SELLER'),
(2, 'VERIFIED'),
(3, 'TOP_SELLER'),
(4, 'EXPERIENCED_SELLER'),
(4, 'TOP_SELLER');

-- Note: You'll need to create products through the UI as they require image upload
-- The application will handle that automatically
