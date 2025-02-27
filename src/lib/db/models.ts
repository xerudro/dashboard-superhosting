import { z } from 'zod';

// Plan Schema
export const planSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  price: z.number(),
  billing_cycle: z.string(),
  features: z.record(z.unknown()),
  quotas: z.record(z.unknown()),
  created_at: z.string(),
  updated_at: z.string(),
});

// Client Schema
export const clientSchema = z.object({
  id: z.string().uuid(),
  whmcs_client_id: z.string().optional(),
  enhance_client_id: z.string().optional(),
  email: z.string().email(),
  name: z.string(),
  company: z.string().optional(),
  phone: z.string().optional(),
  address: z.record(z.unknown()).optional(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Service Schema
export const serviceSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  domain: z.string().optional(),
  status: z.string(),
  whmcs_service_id: z.string().optional(),
  enhance_service_id: z.string().optional(),
  start_date: z.string(),
  expiry_date: z.string().optional(),
  auto_renew: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Quota Schema
export const quotaSchema = z.object({
  id: z.string().uuid(),
  service_id: z.string().uuid(),
  resource_type: z.string(),
  allocated_amount: z.number(),
  used_amount: z.number(),
  last_updated: z.string(),
});

// SSL Certificate Schema
export const sslCertificateSchema = z.object({
  id: z.string().uuid(),
  service_id: z.string().uuid(),
  domain: z.string(),
  provider: z.string(),
  status: z.string(),
  issued_at: z.string().optional(),
  expires_at: z.string().optional(),
  auto_renew: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Email Config Schema
export const emailConfigSchema = z.object({
  id: z.string().uuid(),
  service_id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string(),
  quota_mb: z.number(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Database Schema
export const databaseSchema = z.object({
  id: z.string().uuid(),
  service_id: z.string().uuid(),
  name: z.string(),
  username: z.string(),
  password_hash: z.string(),
  host: z.string(),
  port: z.number(),
  quota_mb: z.number().optional(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// WordPress Installation Schema
export const wordpressInstallationSchema = z.object({
  id: z.string().uuid(),
  service_id: z.string().uuid(),
  domain: z.string(),
  path: z.string(),
  admin_user: z.string(),
  admin_email: z.string().email(),
  db_name: z.string(),
  db_user: z.string(),
  db_password_hash: z.string(),
  version: z.string().optional(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Backup Schema
export const backupSchema = z.object({
  id: z.string().uuid(),
  service_id: z.string().uuid(),
  type: z.string(),
  status: z.string(),
  size_bytes: z.number().optional(),
  storage_path: z.string().optional(),
  retention_days: z.number(),
  created_at: z.string(),
  completed_at: z.string().optional(),
});

export type Plan = z.infer<typeof planSchema>;
export type Client = z.infer<typeof clientSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Quota = z.infer<typeof quotaSchema>;
export type SSLCertificate = z.infer<typeof sslCertificateSchema>;
export type EmailConfig = z.infer<typeof emailConfigSchema>;
export type Database = z.infer<typeof databaseSchema>;
export type WordPressInstallation = z.infer<typeof wordpressInstallationSchema>;
export type Backup = z.infer<typeof backupSchema>;