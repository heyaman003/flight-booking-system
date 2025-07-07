# Migration Guide: Manual Auth to Supabase Auth

This guide will help you migrate your existing users from manual authentication to Supabase authentication.

## Prerequisites

1. **Supabase Project Setup**: Make sure your Supabase project is configured with the correct environment variables
2. **Database Schema**: Ensure your `users` table is properly set up (see `SUPABASE_AUTH_SETUP.md`)
3. **Backup**: Always backup your database before running migrations

## Step 1: Check Current Migration Status

First, check which users need to be migrated:

```bash
curl -X GET http://localhost:3000/auth/migration/status
```

This will return:
```json
{
  "success": true,
  "data": {
    "total": 5,
    "migrated": 0,
    "notMigrated": 5,
    "users": [
      {
        "email": "user1@example.com",
        "migrated": false,
        "id": "123"
      },
      {
        "email": "user2@example.com", 
        "migrated": false,
        "id": "456"
      }
    ]
  }
}
```

## Step 2: Run the Migration

Execute the migration to create Supabase auth records for all existing users:

```bash
curl -X POST http://localhost:3000/auth/migration/run
```

This will:
1. Create Supabase auth records for all existing users
2. Set a temporary password (`temporary_password_123`) for each user
3. Update the user IDs in your `users` table to match Supabase UUIDs
4. Auto-confirm their email addresses

**Important**: Users will need to reset their passwords after migration.

## Step 3: Send Password Reset Emails

For each migrated user, send a password reset email:

```bash
curl -X POST http://localhost:3000/auth/migration/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com"}'
```

## Step 4: Verify Migration

Check the migration status again to confirm all users were migrated:

```bash
curl -X GET http://localhost:3000/auth/migration/status
```

You should see:
```json
{
  "success": true,
  "data": {
    "total": 5,
    "migrated": 5,
    "notMigrated": 0,
    "users": [
      {
        "email": "user1@example.com",
        "migrated": true,
        "id": "550e8400-e29b-41d4-a716-446655440000"
      }
    ]
  }
}
```

## Step 5: Test Authentication

Test that migrated users can now authenticate with Supabase:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "temporary_password_123"
  }'
```

## Step 6: Update Frontend

Update your frontend to use Supabase authentication:

1. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Update authentication calls** to use Supabase instead of your custom endpoints

3. **Remove old JWT handling code**

## Step 7: Clean Up (After Migration is Complete)

Once all users have successfully migrated and tested:

1. **Remove migration endpoints** from `auth.controller.ts`
2. **Remove MigrationService** from `auth.module.ts`
3. **Remove bcryptjs** from `package.json`
4. **Delete migration files**:
   - `src/auth/migration.service.ts`
   - `MIGRATION_GUIDE.md`

## Troubleshooting

### Common Issues

1. **"User already exists" error during migration**
   - The user already has a Supabase auth record
   - Check if the email exists in Supabase Auth dashboard
   - Skip this user or handle manually

2. **Password reset emails not sending**
   - Check Supabase email settings
   - Verify SMTP configuration
   - Check email templates

3. **Users can't login after migration**
   - Ensure they've reset their password
   - Check if email is confirmed in Supabase
   - Verify the user exists in both auth.users and your users table

### Manual Migration for Specific Users

If automatic migration fails for specific users, you can manually create them in Supabase:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and temporary password
4. Update the user ID in your database to match the Supabase UUID

### Rollback Plan

If you need to rollback:

1. **Restore database backup**
2. **Remove Supabase auth records** (if needed)
3. **Revert code changes**
4. **Restart with manual authentication**

## Security Considerations

1. **Temporary passwords**: All migrated users get the same temporary password
2. **Password reset**: Users must reset their password immediately after migration
3. **Email confirmation**: All migrated users have confirmed emails
4. **Token expiration**: Old JWT tokens will no longer work

## Post-Migration Checklist

- [ ] All users can login with new passwords
- [ ] All protected endpoints work with Supabase tokens
- [ ] Password reset functionality works
- [ ] Email templates are configured
- [ ] Old authentication code is removed
- [ ] Migration endpoints are removed
- [ ] Database is backed up
- [ ] Monitoring is in place

## Support

If you encounter issues during migration:

1. Check Supabase logs in the dashboard
2. Review application logs for errors
3. Verify environment variables are correct
4. Test with a single user first
5. Contact support if needed 