-- Insert initial currency rates
INSERT INTO `currency_rates` (from_currency, to_currency, rate) VALUES
  ('EUR', 'USD', 1.0850),
  ('EUR', 'RON', 4.9750),
  ('USD', 'EUR', 0.9217),
  ('USD', 'RON', 4.5850),
  ('RON', 'EUR', 0.2010),
  ('RON', 'USD', 0.2181)
ON DUPLICATE KEY UPDATE
  rate = VALUES(rate),
  updated_at = CURRENT_TIMESTAMP;