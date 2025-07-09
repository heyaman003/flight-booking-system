import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;
  private supabaseAuth: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const serviceKey = this.configService.get<string>('supabase.serviceRoleKey');
    const anonKey = this.configService.get<string>('supabase.anonKey');

    if (!url || !serviceKey || !anonKey) {
      this.logger.error('Supabase configuration incomplete');
      throw new Error('Missing Supabase configuration');
    }

    // Service role client for admin operations
    this.supabase = createClient(url, serviceKey);
    
    // Anon client for auth operations
    this.supabaseAuth = createClient(url, anonKey);

    this.logger.log('Supabase clients initialized');
    this.testConnection();
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAuthClient(): SupabaseClient {
    return this.supabaseAuth;
  }

  // Authentication methods
  async signUp(email: string, password: string, userData?: any) {
    const { data, error } = await this.supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseAuth.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabaseAuth.auth.signOut();
    if (error) throw error;
    return { success: true };
  }

  async getUser(token: string) {
    const { data: { user }, error } = await this.supabaseAuth.auth.getUser(token);
    if (error) throw error;
    return user;
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabaseAuth.auth.refreshSession({
      refresh_token: refreshToken
    });
    if (error) throw error;
    return data;
  }

  // Create user profile in your users table
  async createUserProfile(supabaseUser: User, profileData?: any) {
    const userProfile = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      first_name: profileData?.firstName || supabaseUser.user_metadata?.first_name || '',
      last_name: profileData?.lastName || supabaseUser.user_metadata?.last_name || '',
      phone: profileData?.phone || supabaseUser.user_metadata?.phone || null,
      address: profileData?.address || null,
      city: profileData?.city || null,
      country: profileData?.country || null,
      postal_code: profileData?.postalCode || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('users')
      .insert(userProfile)
      .select()
      .single();

    if (error) {
      this.logger.error('Failed to create user profile:', error);
      throw error;
    }

    return data;
  }

  private async testConnection() {
    try {
      const { error } = await this.supabase.from('flights').select('*').limit(1);
      if (error) {
        this.logger.error('Supabase connection test failed', error);
      } else {
        this.logger.log('Supabase connection test successful');
      }
    } catch (err) {
      this.logger.error('Supabase test connection threw an error', err);
    }
  }

  async query(table: string, query?: any) {
    let queryBuilder = this.supabase.from(table).select('*');
    
    if (query) {
      Object.keys(query).forEach(key => {
        if (query[key] !== undefined && query[key] !== null) {
          queryBuilder = queryBuilder.eq(key, query[key]);
        }
      });
    }
    
    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data;
  }

  async insert(table: string, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async update(table: string, id: string, data: any) {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async updateWhere(table: string, where: Record<string, any>, data: any) {
    let queryBuilder = this.supabase.from(table).update(data);
    Object.keys(where).forEach(key => {
      queryBuilder = queryBuilder.eq(key, where[key]);
    });
    const { data: result, error } = await queryBuilder.select();
    if (error) throw error;
    return result;
  }

  async delete(table: string, id: string) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
}
