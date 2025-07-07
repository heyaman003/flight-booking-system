import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Migrate existing users from manual auth to Supabase auth
   * This should be run once to move all existing users
   */
  async migrateExistingUsers() {
    try {
      this.logger.log('Starting user migration to Supabase...');

      // Get all existing users from your users table
      const existingUsers = await this.supabaseService.query('users', {});
      
      if (!existingUsers || existingUsers.length === 0) {
        this.logger.log('No existing users found to migrate');
        return { migrated: 0, errors: [] };
      }

      const results = {
        migrated: 0,
        errors: [] as string[],
      };

      for (const user of existingUsers) {
        try {
          // Skip if user already has a Supabase auth record
          if (user.id && user.id.includes('-')) {
            // This looks like a Supabase UUID, skip
            this.logger.log(`User ${user.email} already migrated, skipping`);
            continue;
          }

          // Create user in Supabase Auth
          const { data: authData, error: authError } = await this.supabaseService.getAuthClient().auth.admin.createUser({
            email: user.email,
            password: 'temporary_password_123', // They'll need to reset this
            email_confirm: true, // Auto-confirm email
            user_metadata: {
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              phone: user.phone || '',
            },
          });

          if (authError) {
            this.logger.error(`Failed to create Supabase user for ${user.email}:`, authError);
            results.errors.push(`Failed to create Supabase user for ${user.email}: ${authError.message}`);
            continue;
          }

          // Update the user record with the new Supabase ID
          await this.supabaseService.update('users', user.id, {
            id: authData.user.id,
            updated_at: new Date().toISOString(),
          });

          this.logger.log(`Successfully migrated user: ${user.email}`);
          results.migrated++;

        } catch (error) {
          this.logger.error(`Error migrating user ${user.email}:`, error);
          results.errors.push(`Error migrating user ${user.email}: ${error.message}`);
        }
      }

      this.logger.log(`Migration completed. Migrated: ${results.migrated}, Errors: ${results.errors.length}`);
      return results;

    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Create a temporary password reset for migrated users
   * This allows them to set a new password
   */
  async createPasswordReset(email: string) {
    try {
      const { data, error } = await this.supabaseService.getAuthClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

      if (error) {
        this.logger.error(`Failed to create password reset for ${email}:`, error);
        throw error;
      }

      this.logger.log(`Password reset email sent to ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Password reset failed:', error);
      throw error;
    }
  }

  /**
   * Get migration status
   */
  async getMigrationStatus() {
    try {
      const users = await this.supabaseService.query('users', {});
      
      const status = {
        total: users.length,
        migrated: 0,
        notMigrated: 0,
        users: [] as any[],
      };

      for (const user of users) {
        const isMigrated = user.id && user.id.includes('-'); // Supabase UUIDs contain hyphens
        
        if (isMigrated) {
          status.migrated++;
        } else {
          status.notMigrated++;
        }

        status.users.push({
          email: user.email,
          migrated: isMigrated,
          id: user.id,
        });
      }

      return status;
    } catch (error) {
      this.logger.error('Failed to get migration status:', error);
      throw error;
    }
  }
} 