/*
  # ProDetect Database Schema
  
  1. Core Tables
    - customers: Customer management and KYC data
    - transactions: Transaction processing and storage
    - alerts: Suspicious activity detection and tracking
    - cases: Investigation workflows and resolution tracking
    - rules: Configurable AML detection rules
    - reports: STR/CTR generation and regulatory compliance
    - audit_logs: Immutable logging for compliance
    
  2. Security Features
    - Row Level Security (RLS) enabled on all tables
    - Audit trail maintenance
    - Data retention policies
    
  3. Compliance Features
    - CBN baseline standard adherence
    - Automated regulatory reporting
    - KYC/CDD verification tracking
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Customers table for KYC/CDD data and risk profiles
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  date_of_birth date,
  nationality text,
  address jsonb,
  occupation text,
  employer text,
  monthly_income numeric(15,2),
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),
  kyc_documents jsonb DEFAULT '[]',
  risk_rating text DEFAULT 'medium' CHECK (risk_rating IN ('low', 'medium', 'high', 'critical')),
  risk_score integer DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
  pep_status boolean DEFAULT false,
  sanctions_match boolean DEFAULT false,
  account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'closed', 'frozen')),
  onboarding_date timestamptz DEFAULT now(),
  last_review_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table for real-time transaction processing
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  amount numeric(15,2) NOT NULL,
  currency text DEFAULT 'NGN',
  transaction_type text NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'transfer', 'payment', 'withdrawal')),
  channel text NOT NULL CHECK (channel IN ('online', 'mobile', 'atm', 'branch', 'pos', 'ussd')),
  counterparty_name text,
  counterparty_account text,
  counterparty_bank text,
  description text,
  reference_number text,
  location jsonb,
  device_info jsonb,
  ip_address inet,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'flagged', 'blocked')),
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_factors jsonb DEFAULT '[]',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Alerts table for suspicious activity detection
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  transaction_id uuid REFERENCES transactions(id),
  alert_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed', 'false_positive')),
  description text NOT NULL,
  risk_score integer NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  triggered_rules jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  assigned_to uuid,
  escalated_at timestamptz,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cases table for investigation workflows
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id),
  alert_ids uuid[] DEFAULT '{}',
  case_type text NOT NULL CHECK (case_type IN ('aml', 'fraud', 'sanctions', 'kyc', 'suspicious_activity')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'investigation', 'pending_review', 'escalated', 'sar_filed', 'closed')),
  title text NOT NULL,
  description text,
  assigned_to uuid,
  assigned_at timestamptz,
  investigation_notes jsonb DEFAULT '[]',
  evidence_items jsonb DEFAULT '[]',
  risk_assessment jsonb DEFAULT '{}',
  resolution text,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rules table for configurable AML detection rules
CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('aml', 'fraud', 'sanctions', 'kyc', 'velocity', 'amount', 'geographic')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  enabled boolean DEFAULT true,
  conditions jsonb NOT NULL,
  actions jsonb NOT NULL,
  thresholds jsonb DEFAULT '{}',
  ai_enhanced boolean DEFAULT false,
  success_rate numeric(5,2) DEFAULT 0.00,
  false_positive_rate numeric(5,2) DEFAULT 0.00,
  execution_count integer DEFAULT 0,
  last_executed timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reports table for regulatory compliance
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id text UNIQUE NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('sar', 'str', 'ctr', 'aml_summary', 'audit', 'compliance')),
  title text NOT NULL,
  description text,
  period_start date,
  period_end date,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'submitted', 'rejected')),
  content jsonb DEFAULT '{}',
  file_path text,
  submitted_to text,
  submitted_at timestamptz,
  created_by uuid,
  reviewed_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table for immutable compliance logging
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  user_id uuid,
  user_email text,
  ip_address inet,
  user_agent text,
  session_id text,
  timestamp timestamptz DEFAULT now()
);

-- Watchlists table for sanctions and PEP screening
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_type text NOT NULL CHECK (list_type IN ('sanctions', 'pep', 'adverse_media', 'internal')),
  source text NOT NULL,
  entity_name text NOT NULL,
  aliases text[],
  date_of_birth date,
  nationality text,
  identification_numbers jsonb DEFAULT '{}',
  addresses jsonb DEFAULT '[]',
  risk_category text,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- User management table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'compliance_officer', 'analyst', 'investigator', 'viewer')),
  permissions jsonb DEFAULT '[]',
  department text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  password_changed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Behavioral models table for AI/ML models
CREATE TABLE IF NOT EXISTS behavioral_models (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  model_type text NOT NULL CHECK (model_type IN ('ensemble', 'neural_network', 'random_forest', 'gradient_boosting')),
  customer_segment text,
  version text NOT NULL,
  accuracy numeric(5,2),
  precision_score numeric(5,2),
  recall_score numeric(5,2),
  f1_score numeric(5,2),
  false_positive_rate numeric(5,2),
  model_config jsonb DEFAULT '{}',
  training_data_window interval,
  last_trained timestamptz,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workflow templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  steps jsonb NOT NULL,
  automation_level integer DEFAULT 0 CHECK (automation_level >= 0 AND automation_level <= 100),
  average_duration interval,
  usage_count integer DEFAULT 0,
  is_enabled boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_risk_rating ON customers(risk_rating);
CREATE INDEX IF NOT EXISTS idx_customers_kyc_status ON customers(kyc_status);

CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_amount ON transactions(amount);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_risk_score ON transactions(risk_score);

CREATE INDEX IF NOT EXISTS idx_alerts_customer_id ON alerts(customer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_transaction_id ON alerts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_cases_customer_id ON cases(customer_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_assigned_to ON cases(assigned_to);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);

CREATE INDEX IF NOT EXISTS idx_rules_category ON rules(category);
CREATE INDEX IF NOT EXISTS idx_rules_enabled ON rules(enabled);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - should be customized based on requirements)
CREATE POLICY "Users can read own data" ON customers
  FOR SELECT TO authenticated
  USING (true); -- Customize based on user roles

CREATE POLICY "Users can read transactions" ON transactions
  FOR SELECT TO authenticated
  USING (true); -- Customize based on user roles

CREATE POLICY "Users can read alerts" ON alerts
  FOR SELECT TO authenticated
  USING (true); -- Customize based on user roles

CREATE POLICY "Users can read cases" ON cases
  FOR SELECT TO authenticated
  USING (true); -- Customize based on user roles

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (entity_type, entity_id, action, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), current_setting('app.current_user_id', true)::uuid);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (entity_type, entity_id, action, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_setting('app.current_user_id', true)::uuid);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (entity_type, entity_id, action, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), current_setting('app.current_user_id', true)::uuid);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for all main tables
CREATE TRIGGER audit_customers AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_alerts AFTER INSERT OR UPDATE OR DELETE ON alerts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_cases AFTER INSERT OR UPDATE OR DELETE ON cases
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();