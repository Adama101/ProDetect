-- Seed data for ProDetect application

-- Insert sample customers
INSERT INTO customers (customer_id, first_name, last_name, email, phone, risk_rating, kyc_status) VALUES
('CUST001', 'John', 'Doe', 'john.doe@email.com', '+1234567890', 'low', 'verified'),
('CUST002', 'Jane', 'Smith', 'jane.smith@email.com', '+1234567891', 'medium', 'verified'),
('CUST003', 'Bob', 'Johnson', 'bob.johnson@email.com', '+1234567892', 'high', 'pending'),
('CUST004', 'Alice', 'Brown', 'alice.brown@email.com', '+1234567893', 'low', 'verified'),
('CUST005', 'Charlie', 'Wilson', 'charlie.wilson@email.com', '+1234567894', 'critical', 'rejected');

-- Insert sample transactions
INSERT INTO transactions (transaction_id, customer_id, amount, currency, transaction_type, channel, timestamp, status, risk_score) VALUES
('TXN001', (SELECT id FROM customers WHERE customer_id = 'CUST001'), 1000.00, 'USD', 'transfer', 'mobile', NOW() - INTERVAL '1 day', 'completed', 15),
('TXN002', (SELECT id FROM customers WHERE customer_id = 'CUST002'), 5000.00, 'USD', 'transfer', 'web', NOW() - INTERVAL '2 days', 'completed', 45),
('TXN003', (SELECT id FROM customers WHERE customer_id = 'CUST003'), 15000.00, 'USD', 'transfer', 'atm', NOW() - INTERVAL '3 days', 'flagged', 85),
('TXN004', (SELECT id FROM customers WHERE customer_id = 'CUST004'), 2500.00, 'USD', 'transfer', 'mobile', NOW() - INTERVAL '4 days', 'completed', 25),
('TXN005', (SELECT id FROM customers WHERE customer_id = 'CUST005'), 50000.00, 'USD', 'transfer', 'branch', NOW() - INTERVAL '5 days', 'blocked', 95);

-- Insert sample alerts
INSERT INTO alerts (alert_id, customer_id, transaction_id, alert_type, severity, description, risk_score, triggered_rules) VALUES
('ALT001', (SELECT id FROM customers WHERE customer_id = 'CUST003'), (SELECT id FROM transactions WHERE transaction_id = 'TXN003'), 'high_amount', 'high', 'Transaction amount exceeds threshold', 85, ARRAY['amount_limit', 'risk_customer']),
('ALT002', (SELECT id FROM customers WHERE customer_id = 'CUST005'), (SELECT id FROM transactions WHERE transaction_id = 'TXN005'), 'suspicious_activity', 'critical', 'Multiple risk factors detected', 95, ARRAY['amount_limit', 'risk_customer', 'location_mismatch']);

-- Insert sample rules
INSERT INTO rules (rule_id, name, description, category, priority, conditions, actions) VALUES
('RULE001', 'High Amount Transaction', 'Flag transactions above $10,000', 'amount', 'medium', '{"amount": {"operator": ">", "value": 10000}}', '{"action": "flag", "reason": "Amount exceeds threshold"}'),
('RULE002', 'Risk Customer Transaction', 'Block transactions from high-risk customers', 'customer', 'high', '{"customer_risk": {"operator": ">=", "value": "high"}}', '{"action": "block", "reason": "High-risk customer"}'),
('RULE003', 'Location Mismatch', 'Flag transactions from unusual locations', 'location', 'medium', '{"location_change": {"operator": "==", "value": true}}', '{"action": "flag", "reason": "Location change detected"}');



