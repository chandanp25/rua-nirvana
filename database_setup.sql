-- Database setup for Rua Nirvana Site Visit Bookings
-- Run this SQL in your MySQL/MariaDB database

-- Create database (optional - use existing if you prefer)
-- CREATE DATABASE IF NOT EXISTS rua_nirvana;
-- USE rua_nirvana;

-- Create table for site visit bookings
CREATE TABLE IF NOT EXISTS site_visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email_address VARCHAR(100),
    visit_date DATE NOT NULL,
    purpose ENUM('Investment', 'Weekend Home', 'Agriculture', 'Other') NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_visit_date ON site_visits(visit_date);
CREATE INDEX idx_status ON site_visits(status);
CREATE INDEX idx_submitted_at ON site_visits(submitted_at);

-- Insert sample data (optional - for testing)
-- INSERT INTO site_visits (full_name, mobile_number, email_address, visit_date, purpose, ip_address) VALUES
-- ('John Doe', '+91 98765 43210', 'john@example.com', '2024-01-15', 'Investment', '127.0.0.1'),
-- ('Jane Smith', '+91 87654 32109', 'jane@example.com', '2024-01-16', 'Weekend Home', '127.0.0.1');

-- Create view for pending bookings (optional)
CREATE VIEW pending_bookings AS
SELECT 
    id,
    full_name,
    mobile_number,
    email_address,
    visit_date,
    purpose,
    submitted_at,
    ip_address
FROM site_visits 
WHERE status = 'Pending' 
ORDER BY visit_date ASC, submitted_at ASC;

-- Create view for today's bookings (optional)
CREATE VIEW todays_bookings AS
SELECT 
    id,
    full_name,
    mobile_number,
    email_address,
    visit_date,
    purpose,
    submitted_at
FROM site_visits 
WHERE visit_date = CURDATE() 
ORDER BY submitted_at ASC;

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON rua_nirvana.site_visits TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;
