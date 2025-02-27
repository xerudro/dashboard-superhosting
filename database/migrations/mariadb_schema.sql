-- Plans table for hosting and service offerings
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'hosting', 'vps', 'email', etc.
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL, -- 'monthly', 'yearly', etc.
  features TEXT NOT NULL DEFAULT ('{}'),
  quotas TEXT NOT NULL DEFAULT ('{}'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  whmcs_client_id VARCHAR(100) UNIQUE,
  enhance_client_id VARCHAR(100) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table for active client services
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  client_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  whmcs_service_id VARCHAR(100),
  enhance_service_id VARCHAR(100),
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP NULL,  --  Am adăugat NULL aici, deoarece nu avea o valoare default
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Resource quotas for services
CREATE TABLE IF NOT EXISTS quotas (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- 'disk', 'bandwidth', 'email', etc.
  allocated_amount NUMERIC NOT NULL,
  used_amount NUMERIC DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- SSL certificates
CREATE TABLE IF NOT EXISTS ssl_certificates (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  provider VARCHAR(50) DEFAULT 'letsencrypt',
  status VARCHAR(20),
  issued_at TIMESTAMP NULL,  --  Am adăugat NULL aici
  expires_at TIMESTAMP NULL,  --  Am adăugat NULL aici
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Email configurations
CREATE TABLE IF NOT EXISTS email_configs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  quota_mb INTEGER DEFAULT 1000,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- MySQL databases
CREATE TABLE IF NOT EXISTS `databases` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  name VARCHAR(64) NOT NULL,
  username VARCHAR(32) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  host VARCHAR(255) DEFAULT 'localhost',
  port INTEGER DEFAULT 3306,
  quota_mb INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- WordPress installations
CREATE TABLE IF NOT EXISTS wordpress_installations (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  path VARCHAR(255) DEFAULT '/',
  admin_user VARCHAR(255) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  db_name VARCHAR(64) NOT NULL,
  db_user VARCHAR(32) NOT NULL,
  db_password_hash VARCHAR(255) NOT NULL,
  version VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Backups
CREATE TABLE IF NOT EXISTS backups (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'full', 'database', 'files'
  status VARCHAR(20) DEFAULT 'pending',
  size_bytes BIGINT,
  storage_path TEXT,
  retention_days INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL, -- Am adaugat NULL aici
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Nu mai avem nevoie de:
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY;  (specific PostgreSQL)
-- CREATE POLICY ...;                         (specific PostgreSQL)
-- Sunt comentate/sterse, nu se executa in MariaDB

-- Indexurile sunt OK si in MariaDB, le lasam asa cum erau:
CREATE INDEX IF NOT EXISTS idx_services_client_id ON services(client_id);
CREATE INDEX IF NOT EXISTS idx_services_plan_id ON services(plan_id);
CREATE INDEX IF NOT EXISTS idx_quotas_service_id ON quotas(service_id);
CREATE INDEX IF NOT EXISTS idx_ssl_certificates_service_id ON ssl_certificates(service_id);
CREATE INDEX IF NOT EXISTS idx_email_configs_service_id ON email_configs(service_id);
CREATE INDEX IF NOT EXISTS idx_databases_service_id ON `databases`(service_id);
CREATE INDEX IF NOT EXISTS idx_wordpress_installations_service_id ON wordpress_installations(service_id);
CREATE INDEX IF NOT EXISTS idx_backups_service_id ON backups(service_id);