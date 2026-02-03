-- Add certification_image column to Certification table
-- Run this in your MySQL database (XAMPP phpMyAdmin or MySQL Workbench)

USE jp;

-- Check if column exists before adding
ALTER TABLE Certification 
ADD COLUMN IF NOT EXISTS certification_image VARCHAR(255) NULL AFTER credential_url;

-- Verify the change
DESCRIBE Certification;
