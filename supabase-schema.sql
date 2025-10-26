# Comprehensive Database Schema for GuidePath AI Medical Platform
# Based on professional architecture specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE USER MANAGEMENT TABLES
-- =====================================================

-- Patient Profiles (Enhanced)
CREATE TABLE IF NOT EXISTS patient_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  diagnosis TEXT,
  stage TEXT,
  biomarkers JSONB,
  previous_treatments JSONB,
  location TEXT,
  insurance TEXT,
  age INTEGER,
  gender TEXT,
  performance_status INTEGER,
  comorbidities JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CARE PLAN MANAGEMENT TABLES
-- =====================================================

-- Care Plans (Enhanced)
CREATE TABLE IF NOT EXISTS care_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  patient_profile JSONB,
  flow_data JSONB,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flow Nodes
CREATE TABLE IF NOT EXISTS flow_nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  care_plan_id UUID REFERENCES care_plans NOT NULL,
  node_id TEXT NOT NULL,
  node_type TEXT NOT NULL,
  position_data JSONB NOT NULL,
  node_data JSONB NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flow Edges
CREATE TABLE IF NOT EXISTS flow_edges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  care_plan_id UUID REFERENCES care_plans NOT NULL,
  edge_id TEXT NOT NULL,
  source_node TEXT NOT NULL,
  target_node TEXT NOT NULL,
  edge_type TEXT DEFAULT 'smoothstep',
  edge_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MEDICAL KNOWLEDGE BASE TABLES
-- =====================================================

-- Treatment Guidelines
CREATE TABLE IF NOT EXISTS treatment_guidelines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  condition TEXT NOT NULL,
  stage TEXT NOT NULL,
  institution TEXT NOT NULL,
  evidence_level TEXT,
  last_updated TIMESTAMPTZ,
  source_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guideline Recommendations
CREATE TABLE IF NOT EXISTS guideline_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guideline_id UUID REFERENCES treatment_guidelines NOT NULL,
  treatment_type TEXT NOT NULL,
  treatment_name TEXT NOT NULL,
  description TEXT,
  strength TEXT,
  evidence_level TEXT,
  conditions JSONB,
  contraindications JSONB,
  side_effects JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CLINICAL TRIALS TABLES
-- =====================================================

-- Clinical Trials
CREATE TABLE IF NOT EXISTS clinical_trials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nct_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  brief_title TEXT,
  conditions TEXT[],
  interventions TEXT[],
  phase TEXT,
  status TEXT,
  study_type TEXT,
  enrollment_count INTEGER,
  start_date DATE,
  completion_date DATE,
  primary_completion_date DATE,
  last_updated TIMESTAMPTZ,
  sponsor TEXT,
  collaborators TEXT[],
  locations JSONB,
  contact_info JSONB,
  description TEXT,
  detailed_description TEXT,
  criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trial Locations
CREATE TABLE IF NOT EXISTS trial_locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trial_id UUID REFERENCES clinical_trials NOT NULL,
  facility TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT,
  zip_code TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  distance_miles DECIMAL,
  coordinates JSONB,
  status TEXT DEFAULT 'active'
);

-- Eligibility Criteria
CREATE TABLE IF NOT EXISTS eligibility_criteria (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trial_id UUID REFERENCES clinical_trials NOT NULL,
  criteria_type TEXT NOT NULL, -- 'inclusion' or 'exclusion'
  category TEXT,
  criteria_text TEXT NOT NULL,
  biomarkers JSONB,
  age_range JSONB,
  gender TEXT,
  performance_status JSONB,
  previous_treatments JSONB
);

-- =====================================================
-- MEDICATION MANAGEMENT TABLES
-- =====================================================

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  brand_names TEXT[],
  drug_class TEXT,
  indication TEXT,
  dosage_forms JSONB,
  strength TEXT,
  contraindications JSONB,
  warnings JSONB,
  side_effects JSONB,
  interactions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient Medications
CREATE TABLE IF NOT EXISTS patient_medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  medication_id UUID REFERENCES medications NOT NULL,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,
  prescribing_physician TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drug Interactions
CREATE TABLE IF NOT EXISTS drug_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  medication_a_id UUID REFERENCES medications NOT NULL,
  medication_b_id UUID REFERENCES medications NOT NULL,
  severity TEXT NOT NULL, -- 'major', 'moderate', 'minor'
  description TEXT,
  management TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ASSISTANCE PROGRAMS TABLES
-- =====================================================

-- Assistance Programs
CREATE TABLE IF NOT EXISTS assistance_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  program_type TEXT NOT NULL, -- 'financial', 'support', 'insurance', 'referral', 'transportation', 'medication'
  category TEXT,
  description TEXT,
  eligibility_criteria JSONB,
  benefits JSONB,
  application_url TEXT,
  contact_info JSONB,
  requirements JSONB,
  restrictions JSONB,
  coverage_areas TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient Applications
CREATE TABLE IF NOT EXISTS assistance_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  program_id UUID REFERENCES assistance_programs NOT NULL,
  application_status TEXT DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'approved', 'denied'
  application_data JSONB,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER PREFERENCES AND SAVED ITEMS
-- =====================================================

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  preference_type TEXT NOT NULL, -- 'trials', 'treatments', 'medications', 'assistance'
  preference_key TEXT NOT NULL,
  preference_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Trials
CREATE TABLE IF NOT EXISTS saved_trials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  trial_id UUID REFERENCES clinical_trials NOT NULL,
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SYSTEM AND AUDIT TABLES
-- =====================================================

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Configuration
CREATE TABLE IF NOT EXISTS system_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Patient profiles indexes
CREATE INDEX IF NOT EXISTS idx_patient_profiles_diagnosis ON patient_profiles(diagnosis);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_stage ON patient_profiles(stage);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_location ON patient_profiles(location);

-- Care plans indexes
CREATE INDEX IF NOT EXISTS idx_care_plans_user_id ON care_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_care_plans_active ON care_plans(user_id, is_active);

-- Clinical trials indexes
CREATE INDEX IF NOT EXISTS idx_clinical_trials_conditions ON clinical_trials USING GIN(conditions);
CREATE INDEX IF NOT EXISTS idx_clinical_trials_status ON clinical_trials(status);
CREATE INDEX IF NOT EXISTS idx_clinical_trials_phase ON clinical_trials(phase);

-- Trial locations indexes
CREATE INDEX IF NOT EXISTS idx_trial_locations_city ON trial_locations(city);
CREATE INDEX IF NOT EXISTS idx_trial_locations_state ON trial_locations(state);
CREATE INDEX IF NOT EXISTS idx_trial_locations_country ON trial_locations(country);

-- Medications indexes
CREATE INDEX IF NOT EXISTS idx_medications_name ON medications(name);
CREATE INDEX IF NOT EXISTS idx_medications_generic ON medications(generic_name);

-- Assistance programs indexes
CREATE INDEX IF NOT EXISTS idx_assistance_programs_type ON assistance_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_assistance_programs_category ON assistance_programs(category);
CREATE INDEX IF NOT EXISTS idx_assistance_programs_active ON assistance_programs(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE guideline_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE drug_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Patient Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON patient_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON patient_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON patient_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Care Plans: Users can only access their own care plans
CREATE POLICY "Users can view own care plans" ON care_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own care plans" ON care_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own care plans" ON care_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own care plans" ON care_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Flow Nodes and Edges: Users can only access nodes/edges of their care plans
CREATE POLICY "Users can view own flow nodes" ON flow_nodes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_plans
      WHERE care_plans.id = flow_nodes.care_plan_id
      AND care_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own flow nodes" ON flow_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM care_plans
      WHERE care_plans.id = flow_nodes.care_plan_id
      AND care_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own flow edges" ON flow_edges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM care_plans
      WHERE care_plans.id = flow_edges.care_plan_id
      AND care_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own flow edges" ON flow_edges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM care_plans
      WHERE care_plans.id = flow_edges.care_plan_id
      AND care_plans.user_id = auth.uid()
    )
  );

-- Medical data: Public read access for medical knowledge
CREATE POLICY "Anyone can read treatment guidelines" ON treatment_guidelines
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read guideline recommendations" ON guideline_recommendations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read clinical trials" ON clinical_trials
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read trial locations" ON trial_locations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read eligibility criteria" ON eligibility_criteria
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read medications" ON medications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read drug interactions" ON drug_interactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read assistance programs" ON assistance_programs
  FOR SELECT USING (true);

-- User-specific medical data: Users can only access their own data
CREATE POLICY "Users can manage own medications" ON patient_medications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own assistance applications" ON assistance_applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved trials" ON saved_trials
  FOR ALL USING (auth.uid() = user_id);

-- Audit log: Only system can write, users can read their own entries
CREATE POLICY "System can write audit logs" ON audit_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own audit logs" ON audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.patient_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_patient_profiles_updated_at
  BEFORE UPDATE ON patient_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_care_plans_updated_at
  BEFORE UPDATE ON care_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assistance_programs_updated_at
  BEFORE UPDATE ON assistance_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_medications_updated_at
  BEFORE UPDATE ON patient_medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assistance_applications_updated_at
  BEFORE UPDATE ON assistance_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to audit data changes
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_patient_profiles
  AFTER INSERT OR UPDATE OR DELETE ON patient_profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_care_plans
  AFTER INSERT OR UPDATE OR DELETE ON care_plans
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_patient_medications
  AFTER INSERT OR UPDATE OR DELETE ON patient_medications
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert sample medical institutions
INSERT INTO treatment_guidelines (condition, stage, institution, evidence_level, last_updated, source_url) VALUES
('Breast Cancer', 'Stage II', 'ASCO', 'High', NOW() - INTERVAL '30 days', 'https://www.asco.org/guidelines/breast-cancer'),
('Rheumatoid Arthritis', 'Moderate', 'EULAR', 'High', NOW() - INTERVAL '15 days', 'https://www.eular.org/guidelines'),
('Breast Cancer', 'Stage II', 'NCCN', 'High', NOW() - INTERVAL '20 days', 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419')
ON CONFLICT DO NOTHING;

-- Insert sample medications
INSERT INTO medications (name, generic_name, drug_class, indication) VALUES
('Tamoxifen', 'Tamoxifen Citrate', 'Selective Estrogen Receptor Modulator', 'Hormone receptor-positive breast cancer'),
('Methotrexate', 'Methotrexate Sodium', 'Antimetabolite', 'Rheumatoid arthritis, cancer treatment')
ON CONFLICT DO NOTHING;

-- Insert system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('clinical_trials_sync_enabled', 'true', 'Enable automatic synchronization with ClinicalTrials.gov'),
('max_trial_distance_miles', '100', 'Maximum distance for trial location matching'),
('min_trial_match_score', '70', 'Minimum score for trial recommendations')
ON CONFLICT DO NOTHING;
