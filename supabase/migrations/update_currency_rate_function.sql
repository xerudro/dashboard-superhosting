/*
  # Update Currency Rate Function

  1. Changes
    - Adapted PostgreSQL function to MariaDB trigger syntax
    - Removed Postgres-specific auth.uid() function
    - Adjusted timestamp handling for MariaDB
*/

DELIMITER //

CREATE OR REPLACE TRIGGER update_currency_rate_before_update
BEFORE UPDATE ON currency_rate
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
    SET NEW.updated_by = @current_user_id; -- @current_user_id is a MariaDB session variable

DELIMITER ;
    
    The  update_currency_rate_function.sql  file contains a MariaDB trigger that updates the  updated_at  and  updated_by  columns of the  currency_rate  table. The trigger is defined as follows: 
    CREATE OR REPLACE TRIGGER update_currency_rate_before_update