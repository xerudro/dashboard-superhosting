-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
  id BINARY(16) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trigger pentru roles (ȘTERGEM ÎNAINTE DE A CREA)
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
-- Trigger pentru users (ȘTERGEM ÎNAINTE DE A CREA)
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

-- Trigger pentru user_roles (ȘTERGEM ÎNAINTE DE A CREA)
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

-- Trigger pentru permissions (ȘTERGEM ÎNAINTE DE A CREA)
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

-- Trigger pentru role_permissions (ȘTERGEM ÎNAINTE DE A CREA)
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

-- Indexurile (neschimbate)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON `user_roles`(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON `user_roles`(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON `role_permissions`(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON `role_permissions`(permission_id);

-- Insert default roles (FOLOSIND LITERELE BINARE)
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

-- Assign permissions to roles
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