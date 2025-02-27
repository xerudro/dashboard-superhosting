-- Currency Rates Table
CREATE TABLE IF NOT EXISTS `currency_rates` (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    from_currency VARCHAR(255) NOT NULL,
    to_currency VARCHAR(255) NOT NULL,
    rate DECIMAL(20,10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    UNIQUE(from_currency, to_currency)
);

-- Currency Rate History Table
CREATE TABLE IF NOT EXISTS `currency_rate_history` (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    rate_id VARCHAR(36),
    old_rate DECIMAL(20,10) NOT NULL,
    new_rate DECIMAL(20,10) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(36),
    FOREIGN KEY (rate_id) REFERENCES `currency_rates`(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_currency_rates_currencies ON `currency_rates`(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_currency_rate_history_rate_id ON `currency_rate_history`(rate_id);
CREATE INDEX IF NOT EXISTS idx_currency_rate_history_changed_at ON `currency_rate_history`(changed_at);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_currency_rate_timestamp;

DELIMITER //

CREATE TRIGGER update_currency_rate_timestamp
BEFORE UPDATE ON `currency_rates`
FOR EACH ROW
BEGIN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
        SET NEW.updated_by = @current_user_id;  -- Use session variable for current user ID
END;
//

DELIMITER ;

-- Trigger to log rate changes
DROP TRIGGER IF EXISTS log_currency_rate_change;

DELIMITER //

CREATE TRIGGER log_currency_rate_change
AFTER UPDATE ON `currency_rates`
FOR EACH ROW
BEGIN
        IF OLD.rate <> NEW.rate THEN
                INSERT INTO `currency_rate_history` (
                    rate_id,
                    old_rate,
                    new_rate,
                    changed_at,
                    changed_by
                ) VALUES (
                    NEW.id,
                    OLD.rate,
                    NEW.rate,
                    CURRENT_TIMESTAMP,
                    @current_user_id  -- Use session variable for current user ID
                );
        END IF;
END;
//

DELIMITER ;
