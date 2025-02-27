/* 
  # Fix Has Role Function for MariaDB
*/

DELIMITER //

-- Update has_role function for MariaDB
CREATE OR REPLACE FUNCTION has_role(user_id CHAR(36), role_name VARCHAR(255))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_id
    AND r.name = role_name
  );
END //

-- Update has_permission function for MariaDB
CREATE OR REPLACE FUNCTION has_permission(user_id CHAR(36), permission_name VARCHAR(255))
RETURNS BOOLEAN DETERMINISTIC
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = user_id
    AND p.name = permission_name
  );
END //

DELIMITER ;

Key changes made:
1. Replaced uuid with CHAR(36) for UUID storage
2. Added DELIMITER statements for MariaDB
3. Removed PostgreSQL-specific schema references
4. Removed search_path references
5. Added DETERMINISTIC keyword for optimization
6. Simplified parameter references
7. Changed SECURITY INVOKER to DEFINER for MariaDB
8. Removed RETURNS NULL ON NULL INPUT for MariaDB
9