// Medical Types for GuidedPath Medical Application

export interface PatientProfile {
  id: string;
  userId: string;
  diagnosis: string;
  stage: string;
  biomarkers: string[];
  previousTreatments: string[];
  location: string;
  insurance: string;
  age?: number;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TreatmentGuideline {
  id: string;
  condition: string;
  stage: string;
  institution: 'ASCO' | 'EULAR' | 'NCCN' | 'ESMO' | 'NCCN';
  recommendations: TreatmentRecommendation[];
  evidenceLevel: string;
  lastUpdated: Date;
  sourceUrl: string;
  metadata?: Record<string, any>;
}

export interface TreatmentRecommendation {
  id: string;
  type: 'chemotherapy' | 'immunotherapy' | 'targeted_therapy' | 'surgery' | 'radiation' | 'supportive_care';
  name: string;
  description: string;
  strength: 'strong' | 'moderate' | 'weak';
  evidenceLevel: string;
  conditions?: string[];
  contraindications?: string[];
}

export interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  conditions: string[];
  interventions: string[];
  eligibility: EligibilityCriteria;
  locations: TrialLocation[];
  phase: string;
  status: 'recruiting' | 'active_not_recruiting' | 'completed' | 'suspended' | 'terminated' | 'withdrawn';
  startDate: Date;
  completionDate?: Date;
  contactInfo: string;
  description: string;
}

export interface EligibilityCriteria {
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: 'male' | 'female' | 'all';
  conditions: string[];
  biomarkers?: string[];
  previousTreatments?: string[];
  performanceStatus?: number;
  exclusionCriteria: string[];
}

export interface TrialLocation {
  facility: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  contact: string;
  distance?: number; // miles from patient
}

export interface AssistanceProgram {
  id: string;
  name: string;
  type: 'financial' | 'support' | 'insurance' | 'referral' | 'transportation' | 'medication';
  category: string;
  eligibility: AssistanceEligibility;
  applicationUrl: string;
  contact: string;
  description: string;
  requirements: string[];
  benefits: string[];
  restrictions?: string[];
}

export interface AssistanceEligibility {
  incomeRange?: {
    min: number;
    max: number;
  };
  insuranceTypes: string[];
  conditions: string[];
  location?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  schedule: MedicationSchedule;
  interactions: DrugInteraction[];
  sideEffects: SideEffect[];
  indication: string;
  contraindications: string[];
  instructions: string;
}

export interface MedicationSchedule {
  id?: string;
  times: string[]; // e.g., ["08:00", "14:00", "20:00"]
  days: string[]; // e.g., ["monday", "wednesday", "friday"]
  duration?: number; // days
  startDate: Date;
  endDate?: Date;
}

export interface DrugInteraction {
  id: string;
  withDrug: string;
  severity: 'major' | 'moderate' | 'minor';
  description: string;
  management: string;
  source: string;
}

export interface SideEffect {
  name: string;
  frequency: string;
  severity: 'mild' | 'moderate' | 'severe';
  management: string;
}

// React Flow Node Types
export interface MedicalNode {
  id: string;
  type: 'treatmentNode' | 'trialNode' | 'assistanceNode' | 'medicationNode';
  position: {
    x: number;
    y: number;
  };
  data: {
    title: string;
    description?: string;
    isSelected?: boolean;
    isCompleted?: boolean;
    metadata?: Record<string, any>;
    // Medical-specific data
    diagnosis?: string;
    stage?: string;
    guidelines?: TreatmentGuideline[];
    trial?: ClinicalTrial;
    matchScore?: number;
    isSaved?: boolean;
    program?: AssistanceProgram;
    eligibilityScore?: number;
    medication?: Medication;
    nextDose?: string;
    hasInteractions?: boolean;
    sideEffectsCount?: number;
  };
  style?: {
    background?: string;
    border?: string;
    borderRadius?: string;
  };
}

export interface MedicalEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep' | 'step' | 'straight' | 'bezier';
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
  data?: {
    label?: string;
    duration?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    reason?: string;
  };
}

// Care Plan and Flow Management
export interface MedicalCarePlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  patientProfile: PatientProfile;
  nodes: MedicalNode[];
  edges: MedicalEdge[];
  createdAt: Date;
  updatedAt: Date;
}

// UI State Types
export interface MedicalFlowState {
  // React Flow state
  nodes: MedicalNode[];
  edges: MedicalEdge[];

  // Application state
  patientProfile: PatientProfile | null;
  selectedGuideline: TreatmentGuideline | null;
  selectedTrial: ClinicalTrial | null;
  selectedProgram: AssistanceProgram | null;
  selectedMedication: Medication | null;
  currentFlow: 'treatment' | 'trials' | 'assistance' | 'medications';

  // Loading states
  loading: {
    guidelines: boolean;
    trials: boolean;
    programs: boolean;
    medications: boolean;
  };

  // Filter states
  filters: {
    trialPhase?: string[];
    trialStatus?: string[];
    programType?: string[];
    medicationSchedule?: string;
  };
}

// Legacy types (keeping for compatibility during transition)
export interface Skill {
  id: string
  name: string
  description: string
  category: string
  resources: Resource[]
  progress?: number // 0-100 percentage
}

export interface Resource {
  type: 'doc' | 'video' | 'course' | 'book' | 'tool'
  title: string
  url: string
  description?: string
}

export interface Role {
  id: string
  title: string
  description: string
  category: string
  salaryRange: {
    min: number
    max: number
  }
  skills: string[] // Array of skill IDs
  requirements?: string[]
  responsibilities?: string[]
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'principal'
  position: {
    x: number
    y: number
  }
}

export interface Roadmap {
  id: string
  userId: string
  title: string
  description?: string
  nodes: RoleNode[]
  edges: RoleEdge[]
  createdAt: Date
  updatedAt: Date
}

export interface RoleNode {
  id: string
  type: 'roleNode'
  position: {
    x: number
    y: number
  }
  data: {
    role: Role
    isSelected?: boolean
    isCompleted?: boolean
  }
  style?: {
    background?: string
    border?: string
    borderRadius?: string
  }
}

export interface RoleEdge {
  id: string
  source: string
  target: string
  type: 'smoothstep' | 'step' | 'straight' | 'bezier'
  style?: {
    stroke?: string
    strokeWidth?: number
  }
  data?: {
    label?: string
    duration?: string // e.g., "6-12 months"
    difficulty?: 'easy' | 'medium' | 'hard'
  }
}
