/**
 * Environment variables validation and configuration
 */

export interface EnvConfig {
  R2_ENDPOINT: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  NODE_ENV: 'development' | 'production' | 'test';
  ADMIN_SECRET?: string; // Admin authentication secret
}

export function validateEnv(): EnvConfig {
  const required = [
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID', 
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET'
  ] as const;
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment configuration.'
    );
  }
  
  return {
    R2_ENDPOINT: process.env.R2_ENDPOINT!,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
    R2_BUCKET: process.env.R2_BUCKET!,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    ADMIN_SECRET: process.env.ADMIN_SECRET // Optional, only used for admin mode
  };
}

// Validate environment on module load (server-side only)
let envConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
  if (!envConfig) {
    envConfig = validateEnv();
  }
  return envConfig;
}

// Export for testing
export function resetEnvConfig() {
  envConfig = null;
}
