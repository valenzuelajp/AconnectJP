-- Add middle_name column to alumni table
-- Run this in your MySQL database (XAMPP phpMyAdmin or MySQL Workbench)

USE jp;

-- Add middle_name column
ALTER TABLE alumni 
ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100) NULL AFTER first_name;

-- Verify the change
DESCRIBE alumni;
