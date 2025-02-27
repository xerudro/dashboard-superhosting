-- Sterge tabelele si triggerele daca exista (pentru a incepe de la zero)
-- Este important sa le stergi in ordinea corecta, din cauza constrangerilor de chei externe.

DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `currency_rate_history`;
DROP TABLE IF EXISTS `currency_rates`;


-- ----------------- Roles and Permissions Tables ---------------------

-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
  id BINARY(16) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trigger pentru roles (generează automat UUID-ul la INSERT)
DROP TRIGGER IF EXISTS set_roles_id;
DELIMITER //
CREATE TRIGGER set_roles_id
BEFORE INSERT ON `roles`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
        SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  id BINARY(16) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trigger pentru users
DROP TRIGGER IF EXISTS set_users_id;
DELIMITER //
CREATE TRIGGER set_users_id
BEFORE INSERT ON `users`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
        SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS `user_roles` (
  id BINARY(16) PRIMARY KEY,
  user_id BINARY(16) NOT NULL,
  role_id BINARY(16) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id),
  FOREIGN KEY (role_id) REFERENCES `roles`(id),
  FOREIGN KEY (user_id) REFERENCES `users`(id)
);

-- Trigger pentru user_roles
DROP TRIGGER IF EXISTS set_user_roles_id;
DELIMITER //
CREATE TRIGGER set_user_roles_id
BEFORE INSERT ON `user_roles`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
         SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Create permissions table
CREATE TABLE IF NOT EXISTS `permissions` (
  id BINARY(16) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trigger pentru permissions
DROP TRIGGER IF EXISTS set_permissions_id;
DELIMITER //
CREATE TRIGGER set_permissions_id
BEFORE INSERT ON `permissions`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
        SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS `role_permissions` (
  id BINARY(16) PRIMARY KEY,
  role_id BINARY(16) NOT NULL,
  permission_id BINARY(16) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES `roles`(id),
    FOREIGN KEY (permission_id) REFERENCES `permissions`(id)
);

-- Trigger pentru role_permissions
DROP TRIGGER IF EXISTS set_role_permissions_id;

DELIMITER //
CREATE TRIGGER set_role_permissions_id
BEFORE INSERT ON `role_permissions`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
         SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Indexurile
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON `user_roles`(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON `user_roles`(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON `role_permissions`(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON `role_permissions`(permission_id);

-- Insert default roles (FOLOSIND LITERELE BINARE - înlocuiește cu UUID-urile tale)
INSERT INTO `roles` (id, name, description) VALUES
  (0x01953f667682727cac8ee07e10dde22d, 'superadmin', 'Super Administrator with full system access'),
  (0x01953f6676827e6aaae56d9d3f4b811a, 'admin', 'Administrator with limited system access'),
  (0x01953f6676827bd898d5b5066239bd72, 'user', 'Regular user')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default permissions (FOLOSIND LITERELE BINARE)
INSERT INTO `permissions` (id, name, description) VALUES
  (0x01953f6676827f5789091adf8ad85294, 'manage_users', 'Can manage users'),
  (0x01953f66768274a4a93fef08e585455c, 'manage_roles', 'Can manage roles'),
  (0x01953f66768277b191f3bf69c95b6352, 'manage_permissions', 'Can manage permissions'),
  (0x01953f667682756792977a6d1c8be9a1, 'manage_services', 'Can manage services'),
  (0x01953f6676827f85ac7c26348b380ef1, 'manage_billing', 'Can manage billing'),
  (0x01953f6676827941a1de17d5cb46fd8b, 'manage_currency', 'Can manage currency rates'),
  (0x01953f667682753680e7996cbdcdfe54, 'view_admin_dashboard', 'Can view admin dashboard'),
  (0x01953f6676827694b06db5676013f92d, 'view_reports', 'Can view reports')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Assign permissions to roles (Acesta parte nu ar trebui să necesite modificări)
INSERT IGNORE INTO `role_permissions` (role_id, permission_id)
SELECT r.id, p.id
FROM `roles` r, `permissions` p
WHERE (r.name = 'superadmin')
   OR (r.name = 'admin' AND p.name != 'manage_roles')
   OR (r.name = 'user' AND p.name IN ('view_reports'));

-- Triggere pentru updated_at (doar cele pentru UPDATE)
DROP TRIGGER IF EXISTS update_roles_updated_at;
DELIMITER //
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON `roles`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS update_users_updated_at;
DELIMITER //
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON `users`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS update_user_roles_updated_at;
DELIMITER //
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON `user_roles`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS update_permissions_updated_at;
DELIMITER //
CREATE TRIGGER update_permissions_updated_at
BEFORE UPDATE ON `permissions`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS update_role_permissions_updated_at;
DELIMITER //
CREATE TRIGGER update_role_permissions_updated_at
BEFORE UPDATE ON `role_permissions`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- ----------------- Currency Rates Tables ---------------------
CREATE TABLE IF NOT EXISTS `currency_rates` (
  id BINARY(16) PRIMARY KEY,
  from_currency VARCHAR(255) NOT NULL,
  to_currency VARCHAR(255) NOT NULL,
  rate DECIMAL(20,10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BINARY(16),
  updated_by BINARY(16),
  UNIQUE(from_currency, to_currency)
);

-- Trigger pentru a genera automat UUID-uri binare la INSERT în currency_rates
DROP TRIGGER IF EXISTS set_currency_rates_id;
DELIMITER //
CREATE TRIGGER set_currency_rates_id
BEFORE INSERT ON `currency_rates`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
        SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Currency Rate History Table
CREATE TABLE IF NOT EXISTS `currency_rate_history` (
  id BINARY(16) PRIMARY KEY,
  rate_id BINARY(16) NOT NULL,
  old_rate DECIMAL(20,10) NOT NULL,
  new_rate DECIMAL(20,10) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by BINARY(16),
  FOREIGN KEY (rate_id) REFERENCES `currency_rates`(id) ON DELETE CASCADE
);

-- Trigger pentru a genera automat UUID-uri binare la INSERT în currency_rate_history
DROP TRIGGER IF EXISTS set_currency_rate_history_id;
DELIMITER //
CREATE TRIGGER set_currency_rate_history_id
BEFORE INSERT ON `currency_rate_history`
FOR EACH ROW
BEGIN
    IF NEW.id IS NULL THEN
        SET NEW.id = UNHEX(REPLACE(UUID(), '-', ''));
    END IF;
END;
//
DELIMITER ;

-- Indexurile
CREATE INDEX IF NOT EXISTS idx_currency_rates_currencies ON `currency_rates`(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_currency_rate_history_rate_id ON `currency_rate_history`(rate_id);
CREATE INDEX IF NOT EXISTS idx_currency_rate_history_changed_at ON `currency_rate_history`(changed_at);

-- Trigger pentru a actualiza updated_at (înlocuiește funcția PostgreSQL)
DROP TRIGGER IF EXISTS update_currency_rate_timestamp;
DELIMITER //
CREATE TRIGGER update_currency_rate_timestamp
BEFORE UPDATE ON `currency_rates`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
    -- Aici setezi NEW.updated_by cu ID-ul utilizatorului curent, obținut din aplicație (PHP).
    -- Exemplu (FOARTE SIMPLIFICAT, doar pentru ilustrare):
    -- SET NEW.updated_by = @current_user_id; -- Presupunând că ai o variabilă de sesiune @current_user_id în PHP
END;
//
DELIMITER ;

-- Trigger pentru a loga modificările ratei (înlocuiește funcția PostgreSQL)
DROP TRIGGER IF EXISTS log_currency_rate_change;
DELIMITER //
CREATE TRIGGER log_currency_rate_change
AFTER UPDATE ON `currency_rates`
FOR EACH ROW
BEGIN
    IF OLD.rate <> NEW.rate THEN
        INSERT INTO `currency_rate_history` (
          id,
          rate_id,
          old_rate,
          new_rate,
          changed_at,
          changed_by
        ) VALUES (
          UNHEX(REPLACE(UUID(), '-', '')), -- Generam un ID nou
          NEW.id,
          OLD.rate,
          NEW.rate,
          CURRENT_TIMESTAMP,
          NULL -- Aici vei pune ID-ul utilizatorului, transmis ca PARAMETRU din aplicația ta PHP!
        );
    END IF;
END;
//
DELIMITER ;

-- Insert initial rates (FOLOSIM instructiuni separate pentru fiecare rand)
INSERT INTO `currency_rates` (id, from_currency, to_currency, rate) VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), 'EUR', 'USD', 1.0850)
  ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = CURRENT_TIMESTAMP;
INSERT INTO `currency_rates` (id, from_currency, to_currency, rate) VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), 'EUR', 'RON', 4.9750)
   ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = CURRENT_TIMESTAMP;
INSERT INTO `currency_rates` (id, from_currency, to_currency, rate) VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), 'USD', 'EUR', 0.9217)
   ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = CURRENT_TIMESTAMP;
INSERT INTO `currency_rates` (id, from_currency, to_currency, rate) VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), 'USD', 'RON', 4.5850)
   ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = CURRENT_TIMESTAMP;
INSERT INTO `currency_rates` (id, from_currency, to_currency, rate) VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), 'RON', 'EUR', 0.2010)
   ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = CURRENT_TIMESTAMP;
INSERT INTO `currency_rates` (id, from_currency, to_currency, rate) VALUES
  (UNHEX(REPLACE(UUID(), '-', '')), 'RON', 'USD', 0.2181)
   ON DUPLICATE KEY UPDATE rate = VALUES(rate), updated_at = CURRENT_TIMESTAMP;