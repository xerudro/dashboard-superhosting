/*
  # Update Timestamp Function Fix for MariaDB

  1. Changes
    - Converted PostgreSQL trigger function to MariaDB trigger syntax
    - Adapted timestamp handling for MariaDB
*/

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_updated_at_column;

-- Create trigger for updating timestamp
DELIMITER //

CREATE TRIGGER update_updated_at_column
BEFORE UPDATE ON your_actual_table
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP();
END//

DELIMITER ;

