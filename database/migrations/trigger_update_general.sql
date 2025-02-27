-- roles

ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE permissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE backups ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE currency_rates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE `databases` ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE email_configs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE plans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE quotas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE ssl_certificates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE wordpress_installations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT NULL;

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

-- users
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

-- user_roles
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

-- permissions
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

-- role_permissions
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

-- backups
DROP TRIGGER IF EXISTS update_backups_updated_at;
DELIMITER //
CREATE TRIGGER update_backups_updated_at
BEFORE UPDATE ON `backups`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- clients
DROP TRIGGER IF EXISTS update_clients_updated_at;
DELIMITER //
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON `clients`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- currency_rates
DROP TRIGGER IF EXISTS update_currency_rates_updated_at;
DELIMITER //
CREATE TRIGGER update_currency_rates_updated_at
BEFORE UPDATE ON `currency_rates`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;


-- databases
DROP TRIGGER IF EXISTS update_databases_updated_at;
DELIMITER //
CREATE TRIGGER update_databases_updated_at
BEFORE UPDATE ON `databases`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- email_configs
DROP TRIGGER IF EXISTS update_email_configs_updated_at;
DELIMITER //
CREATE TRIGGER update_email_configs_updated_at
BEFORE UPDATE ON `email_configs`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- plans
DROP TRIGGER IF EXISTS update_plans_updated_at;
DELIMITER //
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON `plans`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at;
DELIMITER //
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON `profiles`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- quotas
DROP TRIGGER IF EXISTS update_quotas_updated_at;
DELIMITER //
CREATE TRIGGER update_quotas_updated_at
BEFORE UPDATE ON `quotas`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- services
DROP TRIGGER IF EXISTS update_services_updated_at;
DELIMITER //
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON `services`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- ssl_certificates
DROP TRIGGER IF EXISTS update_ssl_certificates_updated_at;
DELIMITER //
CREATE TRIGGER update_ssl_certificates_updated_at
BEFORE UPDATE ON `ssl_certificates`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;

-- wordpress_installations
DROP TRIGGER IF EXISTS update_wordpress_installations_updated_at;
DELIMITER //
CREATE TRIGGER update_wordpress_installations_updated_at
BEFORE UPDATE ON `wordpress_installations`
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END;
//
DELIMITER ;