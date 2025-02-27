import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import { toast } from 'react-hot-toast';

export class Database {
  private static instance: Database;
  private client: SupabaseClient;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second
  private connectionTimeout: number = 10000; // 10 seconds
  private isInitialized: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private lastError: Error | null = null;

  private constructor() {
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    this.client = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        global: {
          headers: { 'Content-Type': 'application/json' }
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    );

    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('NetworkError')) {
        this.handleNetworkError();
      }
    });

    this.client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.handleSignOut();
      } else if (event === 'SIGNED_IN' && session) {
        this.initialize().catch(console.error);
      }
    });
  }

  private handleNetworkError() {
    if (!this.isInitialized) return;
    
    toast.error('Network connection lost. Retrying...', {
      id: 'network-error',
      duration: 3000
    });
    
    this.reconnect();
  }

  private handleSignOut() {
    this.isInitialized = false;
    this.connectionPromise = null;
    this.lastError = null;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  private async retry<T>(operation: () => Promise<T>, retries = this.maxRetries): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (this.maxRetries - retries + 1)));
        return this.retry(operation, retries - 1);
      }
      throw error;
    }
  }

  async initialize(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        const { data: { session }, error: sessionError } = await this.client.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          const isHealthy = await this.healthCheck();
          if (!isHealthy) {
            throw new Error('Database health check failed');
          }
        }
        
        this.isInitialized = true;
        this.lastError = null;
        resolve();
      } catch (error) {
        console.error('Failed to initialize database:', error);
        this.lastError = error instanceof Error ? error : new Error('Unknown error');
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  async healthCheck(): Promise<boolean> {
    try {
      return await this.retry(async () => {
        const { data, error } = await this.client
          .from('profiles')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is ok
          throw error;
        }
        return true;
      });
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  async reconnect(): Promise<void> {
    this.connectionPromise = null;
    try {
      await this.client.auth.refreshSession();
      const isHealthy = await this.healthCheck();
      
      if (isHealthy) {
        this.isInitialized = true;
        this.lastError = null;
        toast.success('Successfully reconnected to database');
      } else {
        throw new Error('Failed to verify database connection');
      }
    } catch (error) {
      console.error('Failed to reconnect to database:', error);
      this.lastError = error instanceof Error ? error : new Error('Failed to reconnect');
      toast.error('Failed to reconnect to database. Retrying...');
      
      // Schedule automatic retry
      setTimeout(() => {
        this.reconnect().catch(console.error);
      }, this.retryDelay);
      
      throw error;
    }
  }

  async createProfile(userId: string, data: { name: string }): Promise<void> {
    try {
      await this.initialize();
      const { error } = await this.client
        .from('profiles')
        .insert({
          id: userId,
          name: data.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<{
    name: string;
    avatar_url: string;
    phone: string;
    address: string;
  }>): Promise<void> {
    try {
      await this.initialize();
      const { error } = await this.client
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      await this.initialize();
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No profile found
          // Create default profile
          await this.createProfile(userId, { name: '' });
          return { id: userId, name: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        }
        throw error;
      }
      return data;
    } catch (error) {
      if (this.lastError) {
        // If we have a previous error, try reconnecting first
        await this.reconnect();
        return this.getProfile(userId); // Retry after reconnection
      }
      console.error('Failed to get profile:', error);
      throw error;
    }
  }
}