-- Fix cabin_class enum to match the DTO values
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the enum type exists and handle it properly
-- If the enum already exists, we need to drop and recreate it
-- First, let's see what values are currently in the enum
DO $$
BEGIN
    -- Check if the enum type exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cabin_class') THEN
        -- Drop the existing enum type (this will also drop any columns using it)
        DROP TYPE cabin_class CASCADE;
    END IF;
END $$;

-- Step 2: Create the correct enum type with UPPERCASE values
CREATE TYPE cabin_class AS ENUM ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST');

-- Step 3: Update the bookings table to use the correct enum type
-- Add the cabin_class column with the correct type
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cabin_class cabin_class NOT NULL DEFAULT 'ECONOMY';

-- Step 4: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_cabin_class ON bookings(cabin_class);

-- Step 5: If you have a flights table with cabin_class, update it too
-- ALTER TABLE flights ADD COLUMN IF NOT EXISTS cabin_class cabin_class NOT NULL DEFAULT 'ECONOMY'; 