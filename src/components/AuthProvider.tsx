import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext, User, initSupabase, isValidEmail, isValidPassword } from '../lib/auth';
import { Database } from '../lib/db';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const supabase = initSupabase();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            name: session.user.user_metadata.name || '',
            email: session.user.email || '',
            raw_user_meta_data: session.user.user_metadata
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata.name || '',
          email: session.user.email || '',
          raw_user_meta_data: session.user.user_metadata
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      if (!authUser) throw new Error('No user returned from authentication');

      const userData = {
        id: authUser.id,
        name: authUser.user_metadata.name || '',
        email: authUser.email || '',
        raw_user_meta_data: authUser.user_metadata
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);

      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
      }

      // Validate name
      if (!name || name.length < 2) {
        throw new Error('Please enter a valid name (minimum 2 characters)');
      }

      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Please login instead.');
        }
        throw error;
      }

      if (!authUser) throw new Error('No user returned from registration');

      const userData = {
        id: authUser.id,
        name: name,
        email: authUser.email || '',
        raw_user_meta_data: {
          name,
          role: 'user'
        }
      };

      // Create initial profile
      const db = Database.getInstance();
      await db.getClient()
        .from('profiles')
        .insert({
          id: authUser.id,
          name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Account created successfully! Welcome aboard.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};