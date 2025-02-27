-- Plans table for hosting and service offerings
CREATE TABLE IF NOT EXISTS `plans` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,  -- text -> VARCHAR(255)
  type VARCHAR(255) NOT NULL,  -- text -> VARCHAR(255)
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_cycle VARCHAR(255) NOT NULL,  -- text -> VARCHAR(255)
  features JSON NOT NULL DEFAULT ('{}'),  -- jsonb -> JSON
  quotas JSON NOT NULL DEFAULT ('{}'),    -- jsonb -> JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS `clients` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  whmcs_client_id VARCHAR(255) UNIQUE,  -- text -> VARCHAR(255)
  enhance_client_id VARCHAR(255) UNIQUE, -- text -> VARCHAR(255)
  email VARCHAR(255) NOT NULL UNIQUE,   -- text -> VARCHAR(255)
  name VARCHAR(255) NOT NULL,          -- text -> VARCHAR(255)
  company VARCHAR(255),                -- text -> VARCHAR(255)
  phone VARCHAR(255),                  -- text -> VARCHAR(255)
  address JSON,
  status VARCHAR(255) DEFAULT 'active',  -- text -> VARCHAR(255)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table for active client services
CREATE TABLE IF NOT EXISTS `services` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  client_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255),                  -- text -> VARCHAR(255)
  status VARCHAR(255) DEFAULT 'active',    -- text -> VARCHAR(255)
  whmcs_service_id VARCHAR(255),        -- text -> VARCHAR(255)
  enhance_service_id VARCHAR(255),      -- text -> VARCHAR(255)
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES `clients`(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES `plans`(id) ON DELETE RESTRICT
);

-- Resource quotas for services
CREATE TABLE IF NOT EXISTS `quotas` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  resource_type VARCHAR(255) NOT NULL, -- text -> VARCHAR(255)
  allocated_amount DECIMAL(10,2) NOT NULL,
  used_amount DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES `services`(id) ON DELETE CASCADE
);

-- SSL certificates
CREATE TABLE IF NOT EXISTS `ssl_certificates` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255) NOT NULL,          -- text -> VARCHAR(255)
  provider VARCHAR(255) DEFAULT 'letsencrypt',  -- text -> VARCHAR(255)
  status VARCHAR(255),                  -- text -> VARCHAR(255)
  issued_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES `services`(id) ON DELETE CASCADE
);

-- Email configurations
CREATE TABLE IF NOT EXISTS `email_configs` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,         -- text -> VARCHAR(255)
  password_hash VARCHAR(255) NOT NULL,  -- text -> VARCHAR(255)
  quota_mb INTEGER DEFAULT 1000,
  status VARCHAR(255) DEFAULT 'active',  -- text -> VARCHAR(255)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES `services`(id) ON DELETE CASCADE
);

-- Databases
CREATE TABLE IF NOT EXISTS `databases` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,           -- text -> VARCHAR(255)
  username VARCHAR(255) NOT NULL,       -- text -> VARCHAR(255)
  password_hash VARCHAR(255) NOT NULL,  -- text -> VARCHAR(255)
  host VARCHAR(255) DEFAULT 'localhost', -- text -> VARCHAR(255)
  port INTEGER DEFAULT 3306,
  quota_mb INTEGER,
  status VARCHAR(255) DEFAULT 'active',   -- text -> VARCHAR(255)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES `services`(id) ON DELETE CASCADE
);

-- WordPress installations
CREATE TABLE IF NOT EXISTS `wordpress_installations` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  domain VARCHAR(255) NOT NULL,        -- text -> VARCHAR(255)
  path VARCHAR(255) DEFAULT '/',      -- text -> VARCHAR(255)
  admin_user VARCHAR(255) NOT NULL,    -- text -> VARCHAR(255)
  admin_email VARCHAR(255) NOT NULL,   -- text -> VARCHAR(255)
  db_name VARCHAR(255) NOT NULL,        -- text -> VARCHAR(255)
  db_user VARCHAR(255) NOT NULL,        -- text -> VARCHAR(255)
  db_password_hash VARCHAR(255) NOT NULL, -- text -> VARCHAR(255)
  version VARCHAR(255),               -- text -> VARCHAR(255)
  status VARCHAR(255) DEFAULT 'active', -- text -> VARCHAR(255)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES `services`(id) ON DELETE CASCADE
);

-- Backups
CREATE TABLE IF NOT EXISTS `backups` (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  service_id VARCHAR(36) NOT NULL,
  type VARCHAR(255) NOT NULL,             -- text -> VARCHAR(255)
  status VARCHAR(255) DEFAULT 'pending',     -- text -> VARCHAR(255)
  size_bytes BIGINT,
  storage_path TEXT,
  retention_days INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (service_id) REFERENCES `services`(id) ON DELETE CASCADE
);

-- Eliminăm instrucțiunile RLS (specifice PostgreSQL)
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY;

-- Indexurile (neschimbate, sunt compatibile cu MariaDB)
CREATE INDEX IF NOT EXISTS idx_services_client_id ON `services`(client_id);
CREATE INDEX IF NOT EXISTS idx_services_plan_id ON `services`(plan_id);
CREATE INDEX IF NOT EXISTS idx_quotas_service_id ON `quotas`(service_id);
CREATE INDEX IF NOT EXISTS idx_ssl_certificates_service_id ON `ssl_certificates`(service_id);
CREATE INDEX IF NOT EXISTS idx_email_configs_service_id ON `email_configs`(service_id);
CREATE INDEX IF NOT EXISTS idx_databases_service_id ON `databases`(service_id);
CREATE INDEX IF NOT EXISTS idx_wordpress_installations_service_id ON `wordpress_installations`(service_id);
CREATE INDEX IF NOT EXISTS idx_backups_service_id ON `backups`(service_id);


-- Triggere pentru updated_at (înlocuiesc funcția PostgreSQL)

DELIMITER //

CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON `plans`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON `clients`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON `services`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

CREATE TRIGGER update_ssl_certificates_updated_at
BEFORE UPDATE ON `ssl_certificates`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

CREATE TRIGGER update_email_configs_updated_at
BEFORE UPDATE ON `email_configs`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

CREATE TRIGGER update_databases_updated_at
BEFORE UPDATE ON `databases`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

CREATE TRIGGER update_wordpress_installations_updated_at
BEFORE UPDATE ON `wordpress_installations`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//

-- Nu avem un trigger pentru backups deoarece nu are coloana updated_at

DELIMITER ;