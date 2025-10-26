import { createClient } from '@supabase/supabase-js'

// These should be set in environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types matching the comprehensive schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patient_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          diagnosis: string | null
          stage: string | null
          biomarkers: any
          previous_treatments: any
          location: string | null
          insurance: string | null
          age: number | null
          gender: string | null
          performance_status: number | null
          comorbidities: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          diagnosis?: string | null
          stage?: string | null
          biomarkers?: any
          previous_treatments?: any
          location?: string | null
          insurance?: string | null
          age?: number | null
          gender?: string | null
          performance_status?: number | null
          comorbidities?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          diagnosis?: string | null
          stage?: string | null
          biomarkers?: any
          previous_treatments?: any
          location?: string | null
          insurance?: string | null
          age?: number | null
          gender?: string | null
          performance_status?: number | null
          comorbidities?: any
          created_at?: string
          updated_at?: string
        }
      }
      care_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          patient_profile: any
          flow_data: any
          nodes: any
          edges: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          patient_profile?: any
          flow_data?: any
          nodes: any
          edges: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          patient_profile?: any
          flow_data?: any
          nodes?: any
          edges?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      flow_nodes: {
        Row: {
          id: string
          care_plan_id: string
          node_id: string
          node_type: string
          position_data: any
          node_data: any
          label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          care_plan_id: string
          node_id: string
          node_type: string
          position_data: any
          node_data: any
          label?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          care_plan_id?: string
          node_id?: string
          node_type?: string
          position_data?: any
          node_data?: any
          label?: string | null
          created_at?: string
        }
      }
      flow_edges: {
        Row: {
          id: string
          care_plan_id: string
          edge_id: string
          source_node: string
          target_node: string
          edge_type: string
          edge_data: any
          created_at: string
        }
        Insert: {
          id?: string
          care_plan_id: string
          edge_id: string
          source_node: string
          target_node: string
          edge_type?: string
          edge_data?: any
          created_at?: string
        }
        Update: {
          id?: string
          care_plan_id?: string
          edge_id?: string
          source_node?: string
          target_node?: string
          edge_type?: string
          edge_data?: any
          created_at?: string
        }
      }
      treatment_guidelines: {
        Row: {
          id: string
          condition: string
          stage: string
          institution: string
          evidence_level: string | null
          last_updated: string | null
          source_url: string | null
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          condition: string
          stage: string
          institution: string
          evidence_level?: string | null
          last_updated?: string | null
          source_url?: string | null
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          condition?: string
          stage?: string
          institution?: string
          evidence_level?: string | null
          last_updated?: string | null
          source_url?: string | null
          metadata?: any
          created_at?: string
        }
      }
      guideline_recommendations: {
        Row: {
          id: string
          guideline_id: string
          treatment_type: string
          treatment_name: string
          description: string | null
          strength: string | null
          evidence_level: string | null
          conditions: any
          contraindications: any
          side_effects: any
          created_at: string
        }
        Insert: {
          id?: string
          guideline_id: string
          treatment_type: string
          treatment_name: string
          description?: string | null
          strength?: string | null
          evidence_level?: string | null
          conditions?: any
          contraindications?: any
          side_effects?: any
          created_at?: string
        }
        Update: {
          id?: string
          guideline_id?: string
          treatment_type?: string
          treatment_name?: string
          description?: string | null
          strength?: string | null
          evidence_level?: string | null
          conditions?: any
          contraindications?: any
          side_effects?: any
          created_at?: string
        }
      }
      clinical_trials: {
        Row: {
          id: string
          nct_id: string
          title: string
          brief_title: string | null
          conditions: string[]
          interventions: string[]
          phase: string | null
          status: string | null
          study_type: string | null
          enrollment_count: number | null
          start_date: string | null
          completion_date: string | null
          primary_completion_date: string | null
          last_updated: string | null
          sponsor: string | null
          collaborators: string[] | null
          locations: any
          contact_info: any
          description: string
          detailed_description: string | null
          criteria: any
          created_at: string
        }
        Insert: {
          id?: string
          nct_id: string
          title: string
          brief_title?: string | null
          conditions: string[]
          interventions: string[]
          phase?: string | null
          status?: string | null
          study_type?: string | null
          enrollment_count?: number | null
          start_date?: string | null
          completion_date?: string | null
          primary_completion_date?: string | null
          last_updated?: string | null
          sponsor?: string | null
          collaborators?: string[] | null
          locations?: any
          contact_info?: any
          description: string
          detailed_description?: string | null
          criteria?: any
          created_at?: string
        }
        Update: {
          id?: string
          nct_id?: string
          title?: string
          brief_title?: string | null
          conditions?: string[]
          interventions?: string[]
          phase?: string | null
          status?: string | null
          study_type?: string | null
          enrollment_count?: number | null
          start_date?: string | null
          completion_date?: string | null
          primary_completion_date?: string | null
          last_updated?: string | null
          sponsor?: string | null
          collaborators?: string[] | null
          locations?: any
          contact_info?: any
          description?: string
          detailed_description?: string | null
          criteria?: any
          created_at?: string
        }
      }
      trial_locations: {
        Row: {
          id: string
          trial_id: string
          facility: string
          city: string | null
          state: string | null
          country: string | null
          zip_code: string | null
          contact_person: string | null
          contact_phone: string | null
          contact_email: string | null
          distance_miles: number | null
          coordinates: any
          status: string
        }
        Insert: {
          id?: string
          trial_id: string
          facility: string
          city?: string | null
          state?: string | null
          country?: string | null
          zip_code?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          distance_miles?: number | null
          coordinates?: any
          status?: string
        }
        Update: {
          id?: string
          trial_id?: string
          facility?: string
          city?: string | null
          state?: string | null
          country?: string | null
          zip_code?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          distance_miles?: number | null
          coordinates?: any
          status?: string
        }
      }
      eligibility_criteria: {
        Row: {
          id: string
          trial_id: string
          criteria_type: string
          category: string | null
          criteria_text: string
          biomarkers: any
          age_range: any
          gender: string | null
          performance_status: any
          previous_treatments: any
        }
        Insert: {
          id?: string
          trial_id: string
          criteria_type: string
          category?: string | null
          criteria_text: string
          biomarkers?: any
          age_range?: any
          gender?: string | null
          performance_status?: any
          previous_treatments?: any
        }
        Update: {
          id?: string
          trial_id?: string
          criteria_type?: string
          category?: string | null
          criteria_text?: string
          biomarkers?: any
          age_range?: any
          gender?: string | null
          performance_status?: any
          previous_treatments?: any
        }
      }
      medications: {
        Row: {
          id: string
          name: string
          generic_name: string | null
          brand_names: string[] | null
          drug_class: string | null
          indication: string | null
          dosage_forms: any
          strength: string | null
          contraindications: any
          warnings: any
          side_effects: any
          interactions: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          generic_name?: string | null
          brand_names?: string[] | null
          drug_class?: string | null
          indication?: string | null
          dosage_forms?: any
          strength?: string | null
          contraindications?: any
          warnings?: any
          side_effects?: any
          interactions?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          generic_name?: string | null
          brand_names?: string[] | null
          drug_class?: string | null
          indication?: string | null
          dosage_forms?: any
          strength?: string | null
          contraindications?: any
          warnings?: any
          side_effects?: any
          interactions?: any
          created_at?: string
          updated_at?: string
        }
      }
      patient_medications: {
        Row: {
          id: string
          user_id: string
          medication_id: string
          dosage: string | null
          frequency: string | null
          start_date: string | null
          end_date: string | null
          prescribing_physician: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medication_id: string
          dosage?: string | null
          frequency?: string | null
          start_date?: string | null
          end_date?: string | null
          prescribing_physician?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_id?: string
          dosage?: string | null
          frequency?: string | null
          start_date?: string | null
          end_date?: string | null
          prescribing_physician?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      drug_interactions: {
        Row: {
          id: string
          medication_a_id: string
          medication_b_id: string
          severity: string
          description: string | null
          management: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_a_id: string
          medication_b_id: string
          severity: string
          description?: string | null
          management?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_a_id?: string
          medication_b_id?: string
          severity?: string
          description?: string | null
          management?: string | null
          source?: string | null
          created_at?: string
        }
      }
      assistance_programs: {
        Row: {
          id: string
          name: string
          program_type: string
          category: string | null
          description: string | null
          eligibility_criteria: any
          benefits: any
          application_url: string | null
          contact_info: any
          requirements: any
          restrictions: any
          coverage_areas: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          program_type: string
          category?: string | null
          description?: string | null
          eligibility_criteria?: any
          benefits?: any
          application_url?: string | null
          contact_info?: any
          requirements?: any
          restrictions?: any
          coverage_areas?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          program_type?: string
          category?: string | null
          description?: string | null
          eligibility_criteria?: any
          benefits?: any
          application_url?: string | null
          contact_info?: any
          requirements?: any
          restrictions?: any
          coverage_areas?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assistance_applications: {
        Row: {
          id: string
          user_id: string
          program_id: string
          application_status: string
          application_data: any
          submitted_at: string | null
          reviewed_at: string | null
          approved_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id: string
          application_status?: string
          application_data?: any
          submitted_at?: string | null
          reviewed_at?: string | null
          approved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string
          application_status?: string
          application_data?: any
          submitted_at?: string | null
          reviewed_at?: string | null
          approved_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preference_type: string
          preference_key: string
          preference_value: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preference_type: string
          preference_key: string
          preference_value?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preference_type?: string
          preference_key?: string
          preference_value?: any
          created_at?: string
          updated_at?: string
        }
      }
      saved_trials: {
        Row: {
          id: string
          user_id: string
          trial_id: string
          notes: string | null
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trial_id: string
          notes?: string | null
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trial_id?: string
          notes?: string | null
          saved_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: any
          new_values: any
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: any
          new_values?: any
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: any
          new_values?: any
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      system_config: {
        Row: {
          id: string
          config_key: string
          config_value: any
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          config_key: string
          config_value?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          config_key?: string
          config_value?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
