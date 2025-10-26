-- System Performance Observer Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS performance_observer;
USE performance_observer;

-- Create performance_tests table
CREATE TABLE IF NOT EXISTS performance_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    device_used VARCHAR(255) NOT NULL,
    browser_os VARCHAR(255) NOT NULL,
    response_time INT NOT NULL COMMENT 'Response time in milliseconds',
    cpu_usage DECIMAL(5,2) NOT NULL COMMENT 'CPU usage percentage',
    memory_usage DECIMAL(10,2) NOT NULL COMMENT 'Memory usage in MB',
    notes TEXT,
    status ENUM('Stable', 'Lag', 'Crash') NOT NULL DEFAULT 'Stable',
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_test_date (test_date),
    INDEX idx_status (status),
    INDEX idx_device (device_used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing (optional)
-- INSERT INTO performance_tests (test_name, device_used, browser_os, response_time, cpu_usage, memory_usage, notes, status)
-- VALUES 
--     ('Login Test', 'Desktop', 'Chrome / Windows 10', 250, 45.5, 512.3, 'Login functionality test', 'Stable'),
--     ('Search Test', 'Mobile', 'Safari / iOS 15', 850, 65.2, 1024.5, 'Search feature performance', 'Lag'),
--     ('Checkout Test', 'Desktop', 'Firefox / Ubuntu 22.04', 1500, 85.7, 2048.9, 'Payment processing crashed', 'Crash');
