import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const key = this.configService.get<string>('supabase.serviceRoleKey');

    if (!url || !key) {
      this.logger.error('Supabase URL or Service Role Key not found in config');
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(url, key);

    // Log the initialization
    this.logger.log('Supabase client initialized');

    // Optionally test a lightweight query
    this.testConnection();
  }

  getClient(): SupabaseClient {
    return this.supabase;
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

  async delete(table: string, id: string) {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
}
