import { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { Database } from './db';
import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export interface User {
  id: string;
  name: string;
  email: string;
  raw_user_meta_data?: {
    role?: string;
    name?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to validate user role
export const validateUserRole = (user: User | null): boolean => {
  if (!user) return false;
  
  try {
    const role = user.raw_user_meta_data?.role?.toLowerCase();
    if (!role) return false;
    
    // Only allow 'admin' and 'superadmin' roles
    return ['admin', 'superadmin'].includes(role);
  } catch (error) {
    console.error('Error validating user role:', error);
    return false;
  }
};

// Helper function to check if user is super admin
export const isSuperAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  try {
    const role = user.raw_user_meta_data?.role?.toLowerCase();
    return role === 'superadmin';
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

// Helper function to initialize Supabase client
export const initSupabase = () => {
  return createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
};

// Helper function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};