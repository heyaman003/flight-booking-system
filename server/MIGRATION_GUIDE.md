# Passenger Table Migration Guide

## Overview
This migration converts the booking system from storing passengers as JSON in the bookings table to using a separate normalized passengers table.

## Changes Made

### 1. Database Schema Changes
- **New Table**: `passengers` - stores individual passenger information
- **Updated Table**: `bookings` - removed `passengers` JSONB column
- **Enum Fix**: Updated `cabin_class` enum to match DTO values

### 2. DTO Updates
- Added missing fields to `PassengerDto`: `aadhaarNumber`, `age`, `specialRequests`
- Added proper validation for all passenger fields
- Updated validation for `dateOfBirth` to use `@IsDateString()`

### 3. Service Logic Updates
- Modified `createBooking()` to store passengers in separate table
- Updated all query methods to fetch passengers from new table
- Added helper method `mapPassengersToDto()` to reduce code duplication

## Migration Steps

### Step 1: Run Database Migrations

**First, run the cabin class enum fix:**
```sql
-- Run this in Supabase SQL Editor
-- Step 1: Check if the enum type exists and handle it properly
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
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cabin_class cabin_class NOT NULL DEFAULT 'ECONOMY';

-- Step 4: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_cabin_class ON bookings(cabin_class);
```

**Then, run the passengers table migration:**
```sql
-- Run this in Supabase SQL Editor
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

CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON passengers(booking_id);

-- Remove passengers column from bookings table
ALTER TABLE bookings DROP COLUMN IF EXISTS passengers;

-- Add any missing columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS return_flight_id UUID REFERENCES flights(id) ON DELETE RESTRICT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_flight_id ON bookings(flight_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
```

### Step 2: Update Your Backend Code
The following files have been updated:
- `src/bookings/dto/booking.dto.ts` - Updated DTOs with new fields and validation
- `src/bookings/bookings.service.ts` - Updated service logic for new table structure

### Step 3: Test the Changes
1. Restart your NestJS server
2. Test creating a new booking with passenger data
3. Verify that passengers are stored in the new table
4. Test fetching booking history to ensure passengers are returned correctly

## Data Structure

### Frontend Request Format
```json
{
  "flightId": "a0c870f5-d98a-4060-b9cd-377931cea865",
  "cabinClass": "ECONOMY",
  "passengers": [
    {
      "firstName": "Aman",
      "lastName": "Kumar",
      "dateOfBirth": "2025-07-07",
      "passportNumber": "1234567890",
      "nationality": "Indian",
      "aadhaarNumber": "12345678902",
      "age": 23,
      "specialRequests": "please avoid lunch"
    }
  ],
  "specialRequests": "Hello ji"
}
```

### Database Tables

**bookings table:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `flight_id` (UUID, Foreign Key to flights)
- `return_flight_id` (UUID, Foreign Key to flights, optional)
- `cabin_class` (cabin_class enum)
- `total_price` (FLOAT)
- `status` (TEXT)
- `booking_reference` (TEXT, unique)
- `special_requests` (TEXT, optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**passengers table:**
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key to bookings)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `date_of_birth` (DATE)
- `passport_number` (TEXT)
- `nationality` (TEXT)
- `aadhaar_number` (TEXT, optional)
- `age` (INTEGER, optional)
- `seat_number` (TEXT, optional)
- `special_requests` (TEXT, optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Benefits of This Structure
1. **Normalized Data**: Passengers are stored in their own table, reducing data redundancy
2. **Better Performance**: Queries can be optimized with proper indexes
3. **Data Integrity**: Foreign key constraints ensure data consistency
4. **Scalability**: Easier to add passenger-specific features in the future
5. **Query Flexibility**: Can easily query passengers independently of bookings

## Troubleshooting

### Common Issues:
1. **Enum Error**: If you get "invalid input value for enum cabin_class", make sure you've run the enum migration
2. **Missing Columns**: If you get column not found errors, ensure all migrations have been applied
3. **Validation Errors**: Check that all required fields are being sent from the frontend

### Rollback Plan:
If you need to rollback, you can:
1. Drop the passengers table
2. Add back the passengers JSONB column to bookings
3. Revert the service code changes 