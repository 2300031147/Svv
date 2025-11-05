-- System Performance Observer Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS performance_observer;
USE performance_observer;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create performance_tests table
CREATE TABLE IF NOT EXISTS performance_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_test_date (test_date),
    INDEX idx_status (status),
    INDEX idx_device (device_used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create test_checklists table
CREATE TABLE IF NOT EXISTS test_checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checklist_id INT NOT NULL,
    item_text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_id) REFERENCES test_checklists(id) ON DELETE CASCADE,
    INDEX idx_checklist_id (checklist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create scheduled_tests table
CREATE TABLE IF NOT EXISTS scheduled_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    device_used VARCHAR(255) NOT NULL,
    browser_os VARCHAR(255) NOT NULL,
    schedule_cron VARCHAR(100) NOT NULL COMMENT 'Cron expression for scheduling',
    is_active BOOLEAN DEFAULT TRUE,
    last_run TIMESTAMP NULL,
    next_run TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_next_run (next_run)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create browser_performance_metrics table
CREATE TABLE IF NOT EXISTS browser_performance_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT,
    page_load_time DECIMAL(10,2) COMMENT 'Page load time in ms',
    dom_content_loaded DECIMAL(10,2) COMMENT 'DOMContentLoaded time in ms',
    time_to_first_byte DECIMAL(10,2) COMMENT 'TTFB in ms',
    first_contentful_paint DECIMAL(10,2) COMMENT 'FCP in ms',
    largest_contentful_paint DECIMAL(10,2) COMMENT 'LCP in ms',
    cumulative_layout_shift DECIMAL(10,4) COMMENT 'CLS score',
    first_input_delay DECIMAL(10,2) COMMENT 'FID in ms',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES performance_tests(id) ON DELETE CASCADE,
    INDEX idx_test_id (test_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for testing (optional)
-- INSERT INTO performance_tests (test_name, device_used, browser_os, response_time, cpu_usage, memory_usage, notes, status)
-- VALUES 
--     ('Login Test', 'Desktop', 'Chrome / Windows 10', 250, 45.5, 512.3, 'Login functionality test', 'Stable'),
--     ('Search Test', 'Mobile', 'Safari / iOS 15', 850, 65.2, 1024.5, 'Search feature performance', 'Lag'),
--     ('Checkout Test', 'Desktop', 'Firefox / Ubuntu 22.04', 1500, 85.7, 2048.9, 'Payment processing crashed', 'Crash');
