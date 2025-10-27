-- Sample Products for CampuSwap - Indian College Marketplace
-- Run this after registering at least one user

-- First, let's assume user with ID 1 and 2 exist (testuser@example.com and another user)
-- If not, register users first before running this

-- BOOKS Category
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('Data Structures and Algorithms - Narasimha Karumanchi', 'Made Easy publication, 6th Edition. Very good condition, minimal highlighting. Perfect for GATE preparation and semester exams.', 350.00, 450.00, 'BOOKS', 'APPROVED', 'AVAILABLE', true, 'Algorithm Design Manual by Skiena', 45, 4.5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Engineering Mathematics by BS Grewal', '43rd Edition, Higher Engineering Mathematics. All pages intact, no torn pages. Excellent for first and second year engineering students.', 400.00, 550.00, 'BOOKS', 'APPROVED', 'AVAILABLE', false, NULL, 78, 4.8, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Java: The Complete Reference - Herbert Schildt', '11th Edition, covers Java SE 11. Like new condition, barely used. Great for beginners and advanced programmers.', 450.00, 650.00, 'BOOKS', 'APPROVED', 'AVAILABLE', true, 'Head First Java', 32, 4.2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Operating System Concepts by Galvin', '10th Edition (Dinosaur Book). Good condition with some notes. Essential for OS course and GATE preparation.', 500.00, 700.00, 'BOOKS', 'APPROVED', 'AVAILABLE', false, NULL, 56, 4.6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Digital Electronics - Morris Mano', '5th Edition. Excellent condition, no markings. Perfect for ECE and CSE students.', 300.00, 450.00, 'BOOKS', 'APPROVED', 'AVAILABLE', true, 'Electronics Fundamentals', 28, 4.3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ELECTRONICS Category
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('HP Laptop 15s - Intel i5 11th Gen', '8GB RAM, 512GB SSD, 15.6" FHD Display. 1 year old, perfect working condition. Includes original charger and box. Great for coding and projects.', 32000.00, 45000.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', false, NULL, 156, 4.7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Apple iPad 9th Generation 64GB', 'WiFi model, Space Gray. 6 months old, barely used. Comes with original charger and box. Perfect for notes and reading.', 24000.00, 32000.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', false, NULL, 234, 4.9, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Boat Rockerz 450 Wireless Headphones', 'Black color, 3 months old. Excellent sound quality, 15 hours battery life. All accessories included.', 800.00, 1500.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', true, 'Sony or JBL wireless headphones', 89, 4.4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Logitech MK235 Wireless Keyboard & Mouse Combo', 'Brand new condition, barely used for 2 months. Perfect for laptop users. Includes USB receiver.', 1200.00, 1800.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', false, NULL, 67, 4.5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Samsung Galaxy M32 - 6GB/128GB', 'Blue color, 8 months old. Excellent condition, no scratches. Comes with original charger and box. Battery health 95%.', 12000.00, 18000.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', false, NULL, 178, 4.6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Lenovo IdeaPad Slim 3 - Ryzen 5', '8GB RAM, 512GB SSD, 15.6" FHD. 10 months old, perfect for students. Includes charger and bag. No issues.', 35000.00, 48000.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', false, NULL, 145, 4.8, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Mi Power Bank 3i 20000mAh', 'Black, 4 months old. Fast charging, dual USB ports. Perfect for long college days and travel.', 1200.00, 1899.00, 'ELECTRONICS', 'APPROVED', 'AVAILABLE', false, NULL, 54, 4.3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- FURNITURE Category
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('Study Table with Drawer', 'Wooden study table, 3ft x 2ft. Good condition, sturdy. Perfect for hostel room or PG. One drawer for storage.', 1500.00, 2500.00, 'FURNITURE', 'APPROVED', 'AVAILABLE', false, NULL, 92, 4.2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Revolving Chair - Office/Study', 'Black mesh back, comfortable cushion. Height adjustable, smooth wheels. 6 months old, excellent condition.', 2000.00, 3500.00, 'FURNITURE', 'APPROVED', 'AVAILABLE', false, NULL, 76, 4.4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Wall Mounted Bookshelf', 'White wooden shelf, 3 tier. Can hold 20-30 books. Easy to install, all fixtures included.', 800.00, 1200.00, 'FURNITURE', 'APPROVED', 'AVAILABLE', false, NULL, 43, 4.1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Foldable Laptop Table', 'Portable, can be used on bed or floor. Adjustable height and angle. Perfect for online classes. Like new condition.', 600.00, 1000.00, 'FURNITURE', 'APPROVED', 'AVAILABLE', true, 'Any study accessories', 38, 4.0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- FASHION Category
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('Levi''s 511 Slim Fit Jeans - 32 Waist', 'Dark blue, barely worn 3-4 times. Authentic Levi''s from brand store. Perfect condition, no fading.', 1800.00, 3500.00, 'FASHION', 'APPROVED', 'AVAILABLE', false, NULL, 64, 4.5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Nike Air Max Sneakers - Size 9', 'White and black colorway. 6 months old, good condition. Comfortable for daily college wear.', 3000.00, 6000.00, 'FASHION', 'APPROVED', 'AVAILABLE', false, NULL, 112, 4.6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Wildcraft Backpack 35L', 'Black and orange, perfect for college and short trips. Multiple compartments, laptop sleeve included. 1 year old, good condition.', 1200.00, 2000.00, 'FASHION', 'APPROVED', 'AVAILABLE', false, NULL, 87, 4.4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Formal Shirt - Peter England Size M', 'Light blue, cotton blend. Worn only 2-3 times. Perfect for placements and internship interviews.', 400.00, 800.00, 'FASHION', 'APPROVED', 'AVAILABLE', true, 'Similar formal wear', 32, 4.1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Fastrack Analog Watch', 'Black dial with brown leather strap. 8 months old, working perfectly. Stylish for college and casual wear.', 800.00, 1500.00, 'FASHION', 'APPROVED', 'AVAILABLE', false, NULL, 56, 4.3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ACCESSORIES Category
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('Scientific Calculator - Casio FX-991EX', 'Latest classwiz model, barely used. Perfect for engineering exams. All functions working perfectly. Includes cover.', 1000.00, 1500.00, 'ACCESSORIES', 'APPROVED', 'AVAILABLE', false, NULL, 94, 4.7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('USB Type-C Cable 3-Pack', 'Fast charging cables, 1.5m length. Brand new, unopened pack. Compatible with all Type-C devices.', 300.00, 600.00, 'ACCESSORIES', 'APPROVED', 'AVAILABLE', false, NULL, 45, 4.2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Laptop Sleeve 15.6 inch', 'Black neoprene material, water resistant. Protects laptop from scratches. Perfect fit for most 15.6" laptops.', 400.00, 700.00, 'ACCESSORIES', 'APPROVED', 'AVAILABLE', false, NULL, 38, 4.0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Engineering Drawing Kit - Faber Castell', 'Complete set with compass, divider, protractor, scale, etc. Barely used, all items intact. Perfect for 1st year students.', 600.00, 1000.00, 'ACCESSORIES', 'APPROVED', 'AVAILABLE', true, 'Similar drawing instruments', 67, 4.5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Stationery Bundle - Notebooks & Pens', '5 single-line notebooks (240 pages each), 10 blue pens, 5 black pens. Bulk deal, perfect for semester.', 350.00, 550.00, 'ACCESSORIES', 'APPROVED', 'AVAILABLE', false, NULL, 52, 4.1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- SPORTS Category  
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('Cosco Cricket Bat - Kashmir Willow', 'Full size, good condition. Perfect for college cricket matches. Comes with bat cover.', 1200.00, 2000.00, 'SPORTS', 'APPROVED', 'AVAILABLE', false, NULL, 73, 4.3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Nivia Football Size 5', 'Official size, good condition. Used for 6 months. Perfect for college ground games.', 600.00, 1000.00, 'SPORTS', 'APPROVED', 'AVAILABLE', false, NULL, 48, 4.2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Badminton Racket - Yonex Nanoray', 'Intermediate level racket, strung and ready to play. Comes with cover. 8 months old, good condition.', 1500.00, 3000.00, 'SPORTS', 'APPROVED', 'AVAILABLE', true, 'Similar sports equipment', 65, 4.4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Gym Bag - Large Size', 'Black Adidas duffel bag, perfect for gym or sports. Multiple compartments, shoe compartment included. 1 year old.', 800.00, 1500.00, 'SPORTS', 'APPROVED', 'AVAILABLE', false, NULL, 54, 4.1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- OTHER Category
INSERT INTO products (title, description, price, suggested_price, category, approval_status, status, exchange_allowed, exchange_item, view_count, average_rating, seller_id, created_at, updated_at)
VALUES 
('Electric Kettle 1.5L', 'Prestige electric kettle, auto shut-off. Perfect for hostel - tea, coffee, maggi. 6 months old, working perfectly.', 600.00, 1000.00, 'OTHER', 'APPROVED', 'AVAILABLE', false, NULL, 82, 4.3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Mini Fridge 50L', 'Personal refrigerator, perfect for hostel room. Cooling works perfectly. 1 year old. Power efficient.', 4000.00, 7000.00, 'OTHER', 'APPROVED', 'AVAILABLE', false, NULL, 167, 4.5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Guitar - Yamaha F280 Acoustic', 'Beginners acoustic guitar, great condition. Includes soft case and spare strings. Perfect for learning. 10 months old.', 6000.00, 10000.00, 'OTHER', 'APPROVED', 'AVAILABLE', false, NULL, 134, 4.7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Table Lamp LED', 'Adjustable brightness, USB rechargeable. Perfect for late night studies. Battery lasts 4-5 hours. 3 months old.', 400.00, 800.00, 'OTHER', 'APPROVED', 'AVAILABLE', false, NULL, 43, 4.0, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Microwave Oven - IFB 20L', 'Solo microwave, perfect for hostel cooking. All functions working. 1.5 years old, good condition. Includes manual.', 3500.00, 6000.00, 'OTHER', 'APPROVED', 'AVAILABLE', false, NULL, 98, 4.4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Note: Images need to be added separately via the product upload API or by inserting into product_images table
-- Example for adding images:
-- INSERT INTO product_images (product_id, image_path) VALUES (1, '/uploads/product-1-img1.jpg');
