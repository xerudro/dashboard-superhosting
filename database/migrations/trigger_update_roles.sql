-- Trigger pentru updated_at în tabela roles
DROP TRIGGER IF EXISTS update_roles_updated_at;  -- Șterge trigger-ul vechi, dacă există

DELIMITER //

CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON `roles`  --  Specificăm tabela: roles
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;  -- Fără paranteze după CURRENT_TIMESTAMP
END;
//

DELIMITER ;