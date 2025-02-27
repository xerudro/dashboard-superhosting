
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