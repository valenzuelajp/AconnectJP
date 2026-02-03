-- Add event_image column to events table
-- Run this in your MySQL database (XAMPP phpMyAdmin or MySQL Workbench)

USE jp;

-- Check if column exists before adding
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_image VARCHAR(255) NULL AFTER description;

-- Verify the change
DESCRIBE events;
