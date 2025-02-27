import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anonymous key is required'),
  API_URL: z.string().url().default('https://api.superhosting.vip'),
  API_VERSION: z.string().default('v1'),
});

export type EnvConfig = z.infer<typeof envSchema>;

const getConfig = (): EnvConfig => {
  try {
    const config = {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      API_URL: import.meta.env.VITE_API_URL,
      API_VERSION: import.meta.env.VITE_API_VERSION,
    };

    const validated = envSchema.parse(config);

    // Validate Supabase URL format
    if (!validated.SUPABASE_URL.includes('.supabase.co')) {
      throw new Error('Invalid Supabase URL format');
    }

    // Validate Supabase key format (basic check)
    if (!validated.SUPABASE_ANON_KEY.includes('.')) {
      throw new Error('Invalid Supabase key format');
    }

    return validated;
  } catch (error) {
    console.error('Configuration validation failed:', error);
    throw new Error('Invalid configuration. Please check your environment variables.');
  }
};

export const config = getConfig();