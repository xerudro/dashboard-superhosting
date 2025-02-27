-- Create profiles table
CREATE TABLE IF NOT EXISTS `profiles` (
  id BINARY(16) PRIMARY KEY,
  name VARCHAR(255),
  avatar_url VARCHAR(255),
  phone VARCHAR(255),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES `users`(id) ON DELETE CASCADE  --  Referința către tabela users
);

-- NU avem nevoie de RLS (Row Level Security) în MariaDB.  Șterge:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY ...;

-- Trigger pentru updated_at
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