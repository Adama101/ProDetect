/*
  # ProDetect Database Seed Data
  
  Sample data for development and testing purposes
*/

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@prodetect.com', '$2b$10$example_hash', 'Admin', 'User', 'admin', 'IT'),
  ('550e8400-e29b-41d4-a716-446655440002', 'sarah.chen@prodetect.com', '$2b$10$example_hash', 'Sarah', 'Chen', 'compliance_officer', 'Compliance'),
  ('550e8400-e29b-41d4-a716-446655440003', 'michael.rodriguez@prodetect.com', '$2b$10$example_hash', 'Michael', 'Rodriguez', 'analyst', 'Risk'),
  ('550e8400-e29b-41d4-a716-446655440004', 'emma.thompson@prodetect.com', '$2b$10$example_hash', 'Emma', 'Thompson', 'investigator', 'Investigations');

-- Insert sample customers
INSERT INTO customers (id, customer_id, first_name, last_name, email, phone, date_of_birth, nationality, address, occupation, employer, monthly_income, kyc_status, risk_rating, risk_score, pep_status, sanctions_match) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'CUST001', 'Johnathan', 'Doe', 'j.doe@email.com', '+1-555-123-4567', '1985-03-15', 'US', '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "US"}', 'Software Engineer', 'Tech Corp Inc.', 8500.00, 'verified', 'medium', 65, false, false),
  ('650e8400-e29b-41d4-a716-446655440002', 'CUST002', 'Jane', 'Smith', 'jane.smith@email.com', '+1-555-987-6543', '1990-07-22', 'US', '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "US"}', 'Marketing Manager', 'Global Corp', 12000.00, 'verified', 'low', 25, false, false),
  ('650e8400-e29b-41d4-a716-446655440003', 'CUST003', 'Ahmed', 'Hassan', 'ahmed.hassan@email.com', '+234-801-234-5678', '1982-11-08', 'NG', '{"street": "789 Victoria Island", "city": "Lagos", "state": "Lagos", "country": "NG"}', 'Business Owner', 'Hassan Enterprises', 25000.00, 'pending', 'high', 85, false, false);

-- Insert sample transactions
INSERT INTO transactions (id, transaction_id, customer_id, amount, currency, transaction_type, channel, counterparty_name, description, status, risk_score, location) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'TXN001', '650e8400-e29b-41d4-a716-446655440001', 2500.00, 'USD', 'transfer', 'online', 'ABC Corp', 'Business payment', 'completed', 15, '{"country": "US", "city": "New York", "lat": 40.7128, "lng": -74.0060}'),
  ('750e8400-e29b-41d4-a716-446655440002', 'TXN002', '650e8400-e29b-41d4-a716-446655440001', 15000.00, 'USD', 'credit', 'online', 'Unknown Entity', 'Large deposit', 'flagged', 92, '{"country": "US", "city": "New York", "lat": 40.7128, "lng": -74.0060}'),
  ('750e8400-e29b-41d4-a716-446655440003', 'TXN003', '650e8400-e29b-41d4-a716-446655440002', 500.00, 'USD', 'payment', 'mobile', 'Amazon', 'Online purchase', 'completed', 5, '{"country": "US", "city": "Los Angeles", "lat": 34.0522, "lng": -118.2437}'),
  ('750e8400-e29b-41d4-a716-446655440004', 'TXN004', '650e8400-e29b-41d4-a716-446655440003', 50000.00, 'NGN', 'transfer', 'branch', 'International Bank', 'Cross-border transfer', 'pending', 88, '{"country": "NG", "city": "Lagos", "lat": 6.5244, "lng": 3.3792}');

-- Insert sample alerts
INSERT INTO alerts (id, alert_id, customer_id, transaction_id, alert_type, severity, status, description, risk_score, triggered_rules, assigned_to) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'ALT001', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'High Value Transaction', 'critical', 'open', 'Potential watchlist match: Johnathan K. Doe', 95, '["high_value_rule", "name_screening_rule"]', '550e8400-e29b-41d4-a716-446655440002'),
  ('850e8400-e29b-41d4-a716-446655440002', 'ALT002', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Velocity Alert', 'high', 'in_review', 'Unusual transaction pattern: High volume, low value to new beneficiary', 82, '["velocity_rule", "pattern_rule"]', '550e8400-e29b-41d4-a716-446655440003'),
  ('850e8400-e29b-41d4-a716-446655440003', 'ALT003', '650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', 'Geographic Alert', 'medium', 'open', 'Cross-border transaction to high-risk jurisdiction', 65, '["geographic_rule"]', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample cases
INSERT INTO cases (id, case_id, customer_id, alert_ids, case_type, priority, status, title, description, assigned_to) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'CASE001', '650e8400-e29b-41d4-a716-446655440001', '{"850e8400-e29b-41d4-a716-446655440001", "850e8400-e29b-41d4-a716-446655440002"}', 'aml', 'high', 'investigation', 'Suspicious Transaction Pattern Investigation', 'Customer showing unusual transaction velocity and high-value transfers', '550e8400-e29b-41d4-a716-446655440002'),
  ('950e8400-e29b-41d4-a716-446655440002', 'CASE002', '650e8400-e29b-41d4-a716-446655440003', '{"850e8400-e29b-41d4-a716-446655440003"}', 'sanctions', 'medium', 'new', 'Cross-border Transaction Review', 'Review of large cross-border transaction to high-risk jurisdiction', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample rules
INSERT INTO rules (id, rule_id, name, description, category, priority, enabled, conditions, actions, success_rate, false_positive_rate, created_by) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', 'RULE001', 'High Value Transaction Alert', 'Flags transactions above threshold amount', 'amount', 'high', true, '{"amount_threshold": 10000, "currency": "USD", "timeframe": "daily"}', '{"create_alert": true, "freeze_transaction": false, "notify_compliance": true}', 94.20, 3.80, '550e8400-e29b-41d4-a716-446655440001'),
  ('a50e8400-e29b-41d4-a716-446655440002', 'RULE002', 'Transaction Velocity Monitor', 'Detects unusual transaction frequency', 'velocity', 'critical', true, '{"max_transactions": 10, "timeframe": "1 hour", "threshold_multiplier": 3}', '{"create_alert": true, "freeze_account": true, "escalate": true}', 97.80, 1.20, '550e8400-e29b-41d4-a716-446655440001'),
  ('a50e8400-e29b-41d4-a716-446655440003', 'RULE003', 'Geographic Anomaly Detection', 'Flags transactions from unusual locations', 'geographic', 'medium', true, '{"max_distance_km": 500, "timeframe": "1 hour", "risk_countries": ["AF", "IR", "KP"]}', '{"create_alert": true, "request_verification": true}', 89.70, 8.10, '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample watchlist entries
INSERT INTO watchlists (id, list_type, source, entity_name, aliases, nationality, risk_category) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', 'sanctions', 'OFAC SDN', 'John Doe', '{"Johnny Doe", "J. Doe"}', 'US', 'high'),
  ('b50e8400-e29b-41d4-a716-446655440002', 'pep', 'Internal PEP List', 'Ahmed Hassan', '{"A. Hassan", "Hassan Ahmed"}', 'NG', 'medium'),
  ('b50e8400-e29b-41d4-a716-446655440003', 'sanctions', 'UN Sanctions', 'Suspicious Entity Corp', '{"SE Corp", "Suspicious Corp"}', 'Unknown', 'critical');

-- Insert sample behavioral models
INSERT INTO behavioral_models (id, model_id, name, description, model_type, customer_segment, version, accuracy, precision_score, recall_score, f1_score, false_positive_rate, is_active) VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', 'MODEL001', 'Digital Natives Fraud Detection', 'ML model for detecting fraud in digital-native customer segment', 'ensemble', 'digital_natives', 'v2.4.1', 94.20, 92.10, 89.30, 90.70, 3.80, true),
  ('c50e8400-e29b-41d4-a716-446655440002', 'MODEL002', 'High Net Worth AML Model', 'Specialized model for high-value customer monitoring', 'neural_network', 'high_net_worth', 'v1.8.3', 91.50, 88.90, 92.10, 90.50, 6.20, true),
  ('c50e8400-e29b-41d4-a716-446655440003', 'MODEL003', 'SME Transaction Monitoring', 'Model for small business transaction pattern analysis', 'random_forest', 'small_business', 'v1.5.2', 89.70, 87.30, 85.90, 86.60, 8.10, false);

-- Insert sample workflow templates
INSERT INTO workflow_templates (id, template_id, name, description, category, steps, automation_level, average_duration, usage_count, created_by) VALUES
  ('d50e8400-e29b-41d4-a716-446655440001', 'WF001', 'SAR Filing Workflow', 'Automated suspicious activity report preparation and filing', 'regulatory', '[{"step": 1, "name": "Initial Review", "automated": false}, {"step": 2, "name": "Evidence Collection", "automated": true}, {"step": 3, "name": "Risk Assessment", "automated": true}, {"step": 4, "name": "Report Generation", "automated": true}, {"step": 5, "name": "Legal Review", "automated": false}, {"step": 6, "name": "Submission", "automated": true}]', 75, '3 days 4 hours', 156, '550e8400-e29b-41d4-a716-446655440001'),
  ('d50e8400-e29b-41d4-a716-446655440002', 'WF002', 'Customer Onboarding', 'Enhanced customer onboarding with automated checks', 'kyc', '[{"step": 1, "name": "Document Collection", "automated": false}, {"step": 2, "name": "Identity Verification", "automated": true}, {"step": 3, "name": "Sanctions Screening", "automated": true}, {"step": 4, "name": "Risk Assessment", "automated": true}, {"step": 5, "name": "Approval", "automated": false}]', 85, '1 day 12 hours', 1247, '550e8400-e29b-41d4-a716-446655440001');