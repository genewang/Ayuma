// Medical Types for GuidedPath Medical Application
// Updated to match comprehensive database schema

// =====================================================
// CORE USER AND PROFILE TYPES
// =====================================================

export interface PatientProfile {
  id: string;
  userId: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  diagnosis: string;
  stage: string;
  biomarkers: string[];
  previousTreatments: string[];
  location: string;
  insurance: string;
  age?: number;
  gender?: string;
  performanceStatus?: number;
  comorbidities?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// CARE PLAN AND FLOW MANAGEMENT TYPES
// =====================================================

export interface CarePlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  patientProfile?: PatientProfile;
  flowData?: Record<string, any>;
  nodes: MedicalNode[];
  edges: MedicalEdge[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowNode {
  id: string;
  carePlanId: string;
  nodeId: string;
  nodeType: string;
  positionData: Record<string, any>;
  nodeData: Record<string, any>;
  label?: string;
  createdAt: Date;
}

export interface FlowEdge {
  id: string;
  carePlanId: string;
  edgeId: string;
  sourceNode: string;
  targetNode: string;
  edgeType: string;
  edgeData?: Record<string, any>;
  createdAt: Date;
}

// =====================================================
// MEDICAL KNOWLEDGE BASE TYPES
// =====================================================

export interface TreatmentGuideline {
  id: string;
  condition: string;
  stage: string;
  institution: 'ASCO' | 'EULAR' | 'NCCN' | 'ESMO';
  evidenceLevel: string;
  lastUpdated: Date;
  sourceUrl: string;
  metadata?: Record<string, any>;
  recommendations: TreatmentRecommendation[];
  createdAt: Date;
}

export interface TreatmentRecommendation {
  id: string;
  guidelineId: string;
  treatmentType: 'chemotherapy' | 'immunotherapy' | 'targeted_therapy' | 'surgery' | 'radiation' | 'supportive_care';
  treatmentName: string;
  description: string;
  strength: 'strong' | 'moderate' | 'weak';
  evidenceLevel: string;
  conditions?: string[];
  contraindications?: string[];
  sideEffects?: string[];
  createdAt: Date;
}

// =====================================================
// CLINICAL TRIALS TYPES
// =====================================================

export interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  briefTitle?: string;
  conditions: string[];
  interventions: string[];
  phase: string;
  status: 'recruiting' | 'active_not_recruiting' | 'completed' | 'suspended' | 'terminated' | 'withdrawn';
  studyType?: string;
  enrollmentCount?: number;
  startDate: Date;
  completionDate?: Date;
  primaryCompletionDate?: Date;
  lastUpdated: Date;
  sponsor?: string;
  collaborators?: string[];
  locations: TrialLocation[];
  contactInfo?: Record<string, any>;
  description: string;
  detailedDescription?: string;
  criteria?: Record<string, any>;
  eligibilityCriteria: EligibilityCriteria[];
  createdAt: Date;
}

export interface TrialLocation {
  id: string;
  trialId: string;
  facility: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  distanceMiles?: number;
  coordinates?: Record<string, any>;
  status: string;
}

export interface EligibilityCriteria {
  id: string;
  trialId: string;
  criteriaType: 'inclusion' | 'exclusion';
  category?: string;
  criteriaText: string;
  biomarkers?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
  gender?: 'male' | 'female' | 'all';
  performanceStatus?: Record<string, any>;
  previousTreatments?: string[];
}

// =====================================================
// MEDICATION MANAGEMENT TYPES
// =====================================================

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandNames?: string[];
  drugClass?: string;
  indication: string;
  dosageForms?: Record<string, any>;
  strength?: string;
  contraindications?: string[];
  warnings?: string[];
  sideEffects?: string[];
  interactions?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientMedication {
  id: string;
  userId: string;
  medicationId: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribingPhysician?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrugInteraction {
  id: string;
  medicationAId: string;
  medicationBId: string;
  medicationA: Medication;
  medicationB: Medication;
  severity: 'major' | 'moderate' | 'minor';
  description: string;
  management: string;
  source: string;
  createdAt: Date;
}

// =====================================================
// ASSISTANCE PROGRAMS TYPES
// =====================================================

export interface AssistanceProgram {
  id: string;
  name: string;
  programType: 'financial' | 'support' | 'insurance' | 'referral' | 'transportation' | 'medication';
  category?: string;
  description: string;
  eligibilityCriteria: Record<string, any>;
  benefits: string[];
  applicationUrl: string;
  contactInfo: Record<string, any>;
  requirements: string[];
  restrictions?: string[];
  coverageAreas?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssistanceApplication {
  id: string;
  userId: string;
  programId: string;
  program: AssistanceProgram;
  applicationStatus: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied';
  applicationData: Record<string, any>;
  submittedAt?: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// USER PREFERENCES AND SAVED ITEMS
// =====================================================

export interface UserPreference {
  id: string;
  userId: string;
  preferenceType: 'trials' | 'treatments' | 'medications' | 'assistance';
  preferenceKey: string;
  preferenceValue: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedTrial {
  id: string;
  userId: string;
  trialId: string;
  trial: ClinicalTrial;
  notes?: string;
  savedAt: Date;
}

// =====================================================
// SYSTEM AND AUDIT TYPES
// =====================================================

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  tableName?: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SystemConfig {
  id: string;
  configKey: string;
  configValue: Record<string, any>;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// REACT FLOW NODE TYPES
// =====================================================

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

// =====================================================
// UI STATE MANAGEMENT TYPES
// =====================================================

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

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}

// =====================================================
// CLINICAL TRIAL MATCHING TYPES
// =====================================================

export interface TrialMatchScore {
  trialId: string;
  score: number;
  breakdown: {
    diagnosisMatch: number;
    stageMatch: number;
    biomarkerMatch: number;
    locationMatch: number;
    treatmentHistoryMatch: number;
  };
  eligibilityStatus: 'eligible' | 'ineligible' | 'review_needed';
  reasons: string[];
}

// =====================================================
// SEARCH AND FILTER TYPES
// =====================================================

export interface TrialFilters {
  conditions?: string[];
  phase?: string[];
  status?: string[];
  location?: string;
  maxDistance?: number;
  biomarkers?: string[];
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female' | 'all';
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  facets?: Record<string, number>;
  searchTime: number;
}

// =====================================================
// AUTHENTICATION TYPES
// =====================================================

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: 'patient' | 'provider' | 'admin';
  createdAt: Date;
  lastSignInAt?: Date;
}

// =====================================================
// MEDICATION SCHEDULE TYPES
// =====================================================

export interface MedicationSchedule {
  id?: string;
  times: string[]; // e.g., ["08:00", "14:00", "20:00"]
  days: string[]; // e.g., ["monday", "wednesday", "friday"]
  duration?: number; // days
  startDate: Date;
  endDate?: Date;
}

export interface SideEffect {
  name: string;
  frequency: string;
  severity: 'mild' | 'moderate' | 'severe';
  management: string;
}

// =====================================================
// LEGACY TYPES (MAINTAINED FOR COMPATIBILITY)
// =====================================================

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
