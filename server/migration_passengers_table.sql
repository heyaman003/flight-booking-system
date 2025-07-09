-- Migration: Create passengers table and update bookings table
-- Run this in your Supabase SQL editor

-- Step 1: Create passengers table
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  passport_number TEXT NOT NULL,
  nationality TEXT NOT NULL,
  aadhaar_number TEXT,
  age INTEGER,
  seat_number TEXT,
  special_requests TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Step 2: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON passengers(booking_id);

-- Step 3: Remove passengers column from bookings table (if it exists)
-- Note: This will lose existing passenger data if you have any
-- If you have existing data, you'll need to migrate it first
ALTER TABLE bookings DROP COLUMN IF EXISTS passengers;

-- Step 4: Add any missing columns to bookings table if needed
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_flight_id UUID REFERENCES flights(id) ON DELETE RESTRICT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_flight_id ON bookings(flight_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status); 