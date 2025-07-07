# Supabase Authentication Setup Guide

This guide explains how to set up Supabase authentication with automatic user profile creation in your flight booking system.

## Overview

The system now uses Supabase for authentication instead of manual JWT handling. When users register through Supabase Auth, they automatically get a profile created in your `users` table.

## Prerequisites

1. A Supabase project
2. Environment variables configured
3. Database tables set up

## Environment Variables

Add these to your `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Setup

### Users Table

Create a `users` table in your Supabase database with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.role() = 'service_role');
```

## Authentication Flow

### 1. User Registration

When a user registers:

1. **Frontend**: Calls Supabase Auth `signUp()` method
2. **Supabase**: Creates user in `auth.users` table
3. **Webhook**: Supabase sends webhook to `/auth/webhook`
4. **Backend**: Creates user profile in `users` table
5. **Response**: Returns access token and user data

### 2. User Login

When a user logs in:

1. **Frontend**: Calls Supabase Auth `signInWithPassword()` method
2. **Backend**: Validates credentials and returns tokens
3. **Response**: Returns access token, refresh token, and user data

### 3. Token Validation

For protected routes:

1. **Frontend**: Sends access token in Authorization header
2. **Backend**: Validates token with Supabase
3. **Access**: Grants or denies access based on token validity

## API Endpoints

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user (requires auth)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/webhook` - Handle Supabase auth webhooks

### Protected Endpoints

All protected endpoints require the `Authorization: Bearer <access_token>` header.

## Webhook Setup

### 1. Configure Supabase Webhook

In your Supabase dashboard:

1. Go to **Settings** > **API**
2. Scroll to **Webhooks**
3. Add a new webhook:
   - **URL**: `https://your-domain.com/auth/webhook`
   - **Events**: Select `USER_CREATED`
   - **HTTP Method**: POST

### 2. Webhook Security

For production, implement webhook signature verification:

```typescript
// In your webhook handler
const signature = request.headers['x-supabase-signature'];
const body = request.body;

// Verify signature using your webhook secret
const isValid = verifyWebhookSignature(body, signature, webhookSecret);
if (!isValid) {
  throw new UnauthorizedException('Invalid webhook signature');
}
```

## Frontend Integration

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Initialize Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 3. Authentication Functions

```typescript
// Register
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890'
    }
  }
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## Error Handling

Common error scenarios:

1. **User already exists**: Handle with appropriate UI message
2. **Invalid credentials**: Show login error
3. **Token expired**: Automatically refresh or redirect to login
4. **Network errors**: Retry with exponential backoff

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **Webhook Verification**: Always verify webhook signatures in production
3. **Token Storage**: Store tokens securely (httpOnly cookies recommended)
4. **CORS**: Configure CORS properly for your frontend domain
5. **Rate Limiting**: Implement rate limiting on auth endpoints

## Testing

### 1. Test Registration

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Common Issues

1. **Webhook not firing**: Check webhook URL and event configuration
2. **User profile not created**: Verify webhook endpoint is accessible
3. **Token validation failing**: Check Supabase configuration
4. **CORS errors**: Configure CORS in your NestJS app

### Debug Steps

1. Check Supabase logs in dashboard
2. Monitor webhook delivery in Supabase
3. Check application logs for errors
4. Verify environment variables are loaded correctly

## Migration from Manual Auth

If migrating from manual JWT authentication:

1. Update frontend to use Supabase client
2. Remove manual JWT handling code
3. Update protected routes to use new auth guard
4. Test all authentication flows
5. Update documentation

## Support

For issues related to:
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
- **NestJS**: Check [NestJS documentation](https://docs.nestjs.com)
- **This implementation**: Check the code comments and this guide 