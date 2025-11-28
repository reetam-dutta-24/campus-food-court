-- Campus Food Court Database Schema
-- DevOps Project UCT512

-- Create database
CREATE DATABASE IF NOT EXISTS foodcourt_db;
USE foodcourt_db;

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS vendors;

-- Vendors/Food Stalls Table
CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    contact_number VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_rating (rating)
);

-- Menu Items Table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    is_available BOOLEAN DEFAULT true,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    INDEX idx_vendor (vendor_id),
    INDEX idx_available (is_available),
    INDEX idx_category (category)
);

-- Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15),
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    order_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    INDEX idx_vendor (vendor_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    INDEX idx_order (order_id)
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert Vendors
INSERT INTO vendors (name, cuisine, rating, contact_number, is_active) VALUES 
('Burger Hub', 'Fast Food', 4.5, '9876543210', true),
('Pizza Corner', 'Italian', 4.7, '9876543211', true),
('Desi Dhaba', 'Indian', 4.3, '9876543212', true),
('Sandwich Station', 'Continental', 4.4, '9876543213', true),
('Juice Junction', 'Beverages', 4.6, '9876543214', true),
('Chinese Wok', 'Chinese', 4.2, '9876543215', true),
('Coffee Cafe', 'Beverages', 4.8, '9876543216', true);

-- Insert Menu Items for Burger Hub (vendor_id = 1)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(1, 'Classic Burger', 'Beef patty with lettuce, tomato and sauce', 120.00, 'Burgers', true),
(1, 'Cheese Burger', 'Classic burger with extra cheese', 150.00, 'Burgers', true),
(1, 'Veggie Burger', 'Healthy vegetarian patty', 110.00, 'Burgers', true),
(1, 'Chicken Burger', 'Grilled chicken fillet', 140.00, 'Burgers', true),
(1, 'French Fries', 'Crispy golden fries', 60.00, 'Sides', true),
(1, 'Onion Rings', 'Crunchy onion rings', 70.00, 'Sides', true),
(1, 'Coke', 'Chilled soft drink', 40.00, 'Beverages', true);

-- Insert Menu Items for Pizza Corner (vendor_id = 2)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(2, 'Margherita Pizza', 'Classic Italian pizza with tomato and cheese', 200.00, 'Pizza', true),
(2, 'Pepperoni Pizza', 'Loaded with pepperoni slices', 280.00, 'Pizza', true),
(2, 'Veggie Supreme', 'Fresh vegetables and cheese', 250.00, 'Pizza', true),
(2, 'Chicken BBQ Pizza', 'BBQ chicken with onions', 300.00, 'Pizza', true),
(2, 'Garlic Bread', 'Toasted bread with garlic butter', 80.00, 'Sides', true),
(2, 'Pasta Alfredo', 'Creamy white sauce pasta', 180.00, 'Pasta', true),
(2, 'Garlic Breadsticks', 'Crispy breadsticks', 90.00, 'Sides', true);

-- Insert Menu Items for Desi Dhaba (vendor_id = 3)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(3, 'Dal Makhani', 'Creamy black lentils', 130.00, 'Main Course', true),
(3, 'Paneer Tikka', 'Grilled cottage cheese', 180.00, 'Starters', true),
(3, 'Butter Chicken', 'Rich tomato gravy with chicken', 220.00, 'Main Course', true),
(3, 'Chicken Biryani', 'Aromatic rice with chicken', 200.00, 'Rice', true),
(3, 'Naan', 'Indian flatbread', 30.00, 'Bread', true),
(3, 'Roti', 'Wheat flatbread', 20.00, 'Bread', true),
(3, 'Raita', 'Yogurt with cucumber', 50.00, 'Sides', true),
(3, 'Veg Biryani', 'Vegetable biryani', 160.00, 'Rice', true);

-- Insert Menu Items for Sandwich Station (vendor_id = 4)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(4, 'Club Sandwich', 'Triple decker delight', 140.00, 'Sandwiches', true),
(4, 'Grilled Cheese Sandwich', 'Classic comfort food', 100.00, 'Sandwiches', true),
(4, 'Veggie Wrap', 'Healthy vegetable wrap', 120.00, 'Wraps', true),
(4, 'Chicken Wrap', 'Grilled chicken wrap', 150.00, 'Wraps', true),
(4, 'Caesar Salad', 'Fresh green salad', 130.00, 'Salads', true);

-- Insert Menu Items for Juice Junction (vendor_id = 5)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(5, 'Mango Shake', 'Fresh mango milkshake', 80.00, 'Shakes', true),
(5, 'Banana Shake', 'Creamy banana shake', 70.00, 'Shakes', true),
(5, 'Orange Juice', 'Fresh squeezed orange juice', 60.00, 'Juices', true),
(5, 'Watermelon Juice', 'Refreshing watermelon juice', 50.00, 'Juices', true),
(5, 'Smoothie Bowl', 'Healthy fruit bowl', 150.00, 'Healthy', true),
(5, 'Green Smoothie', 'Spinach and fruit blend', 120.00, 'Healthy', true);

-- Insert Menu Items for Chinese Wok (vendor_id = 6)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(6, 'Veg Fried Rice', 'Stir-fried rice with vegetables', 120.00, 'Rice', true),
(6, 'Chicken Fried Rice', 'Fried rice with chicken', 150.00, 'Rice', true),
(6, 'Veg Noodles', 'Stir-fried noodles', 110.00, 'Noodles', true),
(6, 'Chicken Noodles', 'Noodles with chicken', 140.00, 'Noodles', true),
(6, 'Manchurian', 'Fried balls in sauce', 130.00, 'Starters', true),
(6, 'Spring Rolls', 'Crispy vegetable rolls', 100.00, 'Starters', true);

-- Insert Menu Items for Coffee Cafe (vendor_id = 7)
INSERT INTO menu_items (vendor_id, name, description, price, category, is_available) VALUES 
(7, 'Cappuccino', 'Espresso with steamed milk', 90.00, 'Coffee', true),
(7, 'Latte', 'Smooth espresso drink', 100.00, 'Coffee', true),
(7, 'Americano', 'Strong black coffee', 80.00, 'Coffee', true),
(7, 'Cold Coffee', 'Iced coffee drink', 110.00, 'Cold Beverages', true),
(7, 'Hot Chocolate', 'Rich chocolate drink', 100.00, 'Hot Beverages', true),
(7, 'Croissant', 'Buttery pastry', 70.00, 'Snacks', true),
(7, 'Muffin', 'Chocolate muffin', 60.00, 'Snacks', true);

-- Insert Sample Orders
INSERT INTO orders (vendor_id, customer_name, customer_phone, total_amount, status, order_number) VALUES 
(1, 'Rahul Sharma', '9876543201', 270.00, 'delivered', 'ORD001'),
(2, 'Priya Singh', '9876543202', 280.00, 'preparing', 'ORD002'),
(3, 'Amit Kumar', '9876543203', 350.00, 'ready', 'ORD003'),
(1, 'Neha Gupta', '9876543204', 180.00, 'pending', 'ORD004'),
(4, 'Vikram Patel', '9876543205', 260.00, 'delivered', 'ORD005'),
(5, 'Anjali Verma', '9876543206', 150.00, 'ready', 'ORD006');

-- Insert Sample Order Items
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES 
(1, 1, 2, 120.00),  -- 2x Classic Burger
(1, 5, 1, 60.00),   -- 1x French Fries
(2, 10, 1, 280.00), -- 1x Pepperoni Pizza
(3, 17, 1, 130.00), -- 1x Dal Makhani
(3, 19, 1, 220.00); -- 1x Butter Chicken

-- Create Views for Better Querying
CREATE OR REPLACE VIEW vendor_summary AS
SELECT 
    v.id,
    v.name,
    v.cuisine,
    v.rating,
    COUNT(DISTINCT m.id) as total_menu_items,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue
FROM vendors v
LEFT JOIN menu_items m ON v.id = m.vendor_id
LEFT JOIN orders o ON v.id = o.vendor_id
WHERE v.is_active = true
GROUP BY v.id, v.name, v.cuisine, v.rating;

-- Success message
SELECT 'Database setup completed successfully!' as Message;
SELECT COUNT(*) as Total_Vendors FROM vendors;
SELECT COUNT(*) as Total_Menu_Items FROM menu_items;
SELECT COUNT(*) as Total_Orders FROM orders;