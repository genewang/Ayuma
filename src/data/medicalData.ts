import { TreatmentGuideline, ClinicalTrial, AssistanceProgram, Medication, MedicalNode, MedicalEdge } from '../types'

// Sample Treatment Guidelines
export const sampleGuidelines: TreatmentGuideline[] = [
  {
    id: 'asco-breast-cancer',
    condition: 'Breast Cancer',
    stage: 'Stage II',
    institution: 'ASCO',
    evidenceLevel: 'High',
    lastUpdated: new Date('2024-01-15'),
    sourceUrl: 'https://www.asco.org/guidelines',
    recommendations: [
      {
        id: 'chemo-recommendation',
        type: 'chemotherapy',
        name: 'Adjuvant Chemotherapy',
        description: 'Chemotherapy following surgery to reduce risk of recurrence',
        strength: 'strong',
        evidenceLevel: '1A',
        conditions: ['Stage II', 'Stage IIIA'],
        contraindications: ['Poor performance status', 'Severe comorbidities']
      },
      {
        id: 'hormone-recommendation',
        type: 'targeted_therapy',
        name: 'Hormone Therapy',
        description: 'For hormone receptor-positive tumors',
        strength: 'strong',
        evidenceLevel: '1A',
        conditions: ['ER/PR positive'],
        contraindications: []
      }
    ]
  },
  {
    id: 'eular-rheumatoid',
    condition: 'Rheumatoid Arthritis',
    stage: 'Moderate',
    institution: 'EULAR',
    evidenceLevel: 'High',
    lastUpdated: new Date('2024-02-20'),
    sourceUrl: 'https://www.eular.org/guidelines',
    recommendations: [
      {
        id: 'dmard-recommendation',
        type: 'targeted_therapy',
        name: 'DMARD Therapy',
        description: 'Disease-modifying antirheumatic drugs as first-line treatment',
        strength: 'strong',
        evidenceLevel: '1A',
        conditions: ['Moderate to severe RA'],
        contraindications: ['Active infection', 'Liver disease']
      }
    ]
  }
]

// Sample Clinical Trials
export const sampleTrials: ClinicalTrial[] = [
  {
    id: 'trial-001',
    nctId: 'NCT04589078',
    title: 'Phase III Study of New Immunotherapy for Advanced Breast Cancer',
    conditions: ['Breast Cancer', 'Stage IV Breast Cancer', 'Metastatic Breast Cancer'],
    interventions: ['Immunotherapy Drug X', 'Standard Chemotherapy'],
    phase: 'Phase 3',
    status: 'recruiting',
    startDate: new Date('2023-06-01'),
    completionDate: new Date('2026-12-31'),
    contactInfo: 'trial@researchcenter.edu',
    description: 'A randomized, double-blind study comparing new immunotherapy with standard care.',
    eligibility: {
      ageRange: { min: 18, max: 75 },
      gender: 'all',
      conditions: ['Breast Cancer'],
      biomarkers: ['PD-L1 positive'],
      previousTreatments: ['Chemotherapy'],
      performanceStatus: 1,
      exclusionCriteria: ['Brain metastases', 'Autoimmune disease']
    },
    locations: [
      {
        facility: 'City General Hospital',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        contact: 'Dr. Smith - (555) 123-4567',
        distance: 15
      },
      {
        facility: 'Regional Cancer Center',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        zipCode: '02101',
        contact: 'Dr. Johnson - (555) 987-6543',
        distance: 25
      }
    ]
  },
  {
    id: 'trial-002',
    nctId: 'NCT04602345',
    title: 'Phase II Trial of Novel RA Treatment',
    conditions: ['Rheumatoid Arthritis', 'Active RA'],
    interventions: ['Novel DMARD', 'Placebo'],
    phase: 'Phase 2',
    status: 'active_not_recruiting',
    startDate: new Date('2023-03-15'),
    completionDate: new Date('2025-09-30'),
    contactInfo: 'ra-trial@clinic.edu',
    description: 'Evaluating safety and efficacy of new disease-modifying agent.',
    eligibility: {
      ageRange: { min: 18, max: 65 },
      gender: 'all',
      conditions: ['Rheumatoid Arthritis'],
      biomarkers: [],
      previousTreatments: ['Methotrexate'],
      performanceStatus: 2,
      exclusionCriteria: ['Previous biologic therapy', 'Severe infections']
    },
    locations: [
      {
        facility: 'University Medical Center',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        zipCode: '60601',
        contact: 'Dr. Brown - (555) 456-7890',
        distance: 30
      }
    ]
  }
]

// Sample Assistance Programs
export const sampleAssistancePrograms: AssistanceProgram[] = [
  {
    id: 'program-001',
    name: 'CancerCare Patient Assistance',
    type: 'financial',
    category: 'Financial Aid',
    description: 'Financial assistance for cancer patients including help with treatment costs, transportation, and medications.',
    eligibility: {
      insuranceTypes: ['Medicare', 'Medicaid', 'Private'],
      conditions: ['Cancer', 'Breast Cancer', 'Lung Cancer'],
      ageRange: { min: 18, max: 100 }
    },
    applicationUrl: 'https://www.cancercare.org/financial',
    contact: '1-800-813-HOPE',
    requirements: [
      'Cancer diagnosis',
      'Financial need documentation',
      'Treatment plan from physician'
    ],
    benefits: [
      'Up to $1,000 for treatment costs',
      'Transportation assistance',
      'Medication copay support',
      'Home care services'
    ]
  },
  {
    id: 'program-002',
    name: 'Arthritis Foundation Support Network',
    type: 'support',
    category: 'Support Groups',
    description: 'Peer support groups and educational resources for arthritis patients.',
    eligibility: {
      insuranceTypes: ['Any'],
      conditions: ['Rheumatoid Arthritis', 'Osteoarthritis', 'Psoriatic Arthritis'],
      location: ['USA']
    },
    applicationUrl: 'https://www.arthritis.org/support',
    contact: '1-844-571-4357',
    requirements: [
      'Arthritis diagnosis',
      'Interest in peer support'
    ],
    benefits: [
      'Weekly support group meetings',
      'Educational workshops',
      'Online community access',
      'Resource materials'
    ]
  }
]

// Sample Medications
export const sampleMedications: Medication[] = [
  {
    id: 'med-001',
    name: 'Tamoxifen',
    genericName: 'Tamoxifen Citrate',
    dosage: '20mg',
    frequency: 'daily',
    indication: 'Hormone receptor-positive breast cancer',
    contraindications: ['Pregnancy', 'History of blood clots'],
    instructions: 'Take once daily with or without food. Complete full 5-year course.',
    schedule: {
      id: 'schedule-tamoxifen',
      times: ['08:00'],
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      duration: 1825, // 5 years in days
      startDate: new Date('2024-01-01')
    },
    interactions: [
      {
        id: 'interaction-warfarin',
        withDrug: 'Warfarin',
        severity: 'major',
        description: 'May increase anticoagulant effect',
        management: 'Monitor INR closely, adjust warfarin dose as needed',
        source: 'FDA'
      }
    ],
    sideEffects: [
      {
        name: 'Hot flashes',
        frequency: 'Common',
        severity: 'mild',
        management: 'Stay cool, dress in layers'
      },
      {
        name: 'Nausea',
        frequency: 'Occasional',
        severity: 'mild',
        management: 'Take with food'
      }
    ]
  },
  {
    id: 'med-002',
    name: 'Methotrexate',
    genericName: 'Methotrexate Sodium',
    dosage: '15mg',
    frequency: 'weekly',
    indication: 'Rheumatoid arthritis, psoriasis',
    contraindications: ['Liver disease', 'Kidney disease', 'Pregnancy'],
    instructions: 'Take once weekly. Take folic acid supplement 24 hours after dose.',
    schedule: {
      id: 'schedule-methotrexate',
      times: ['09:00'],
      days: ['friday'],
      duration: 365,
      startDate: new Date('2024-01-01')
    },
    interactions: [
      {
        id: 'interaction-nsaids',
        withDrug: 'NSAIDs',
        severity: 'moderate',
        description: 'May increase risk of kidney problems',
        management: 'Use NSAIDs cautiously, monitor kidney function',
        source: 'Lexicomp'
      }
    ],
    sideEffects: [
      {
        name: 'Nausea',
        frequency: 'Common',
        severity: 'moderate',
        management: 'Take with food, consider anti-nausea medication'
      },
      {
        name: 'Fatigue',
        frequency: 'Common',
        severity: 'mild',
        management: 'Rest when needed, maintain healthy lifestyle'
      }
    ]
  }
]

// Create initial medical flow nodes
export const initialMedicalNodes: MedicalNode[] = [
  {
    id: 'treatment-node',
    type: 'treatmentNode',
    position: { x: 100, y: 100 },
    data: {
      title: 'Treatment Guidelines',
      diagnosis: 'Breast Cancer',
      stage: 'Stage II',
      guidelines: sampleGuidelines,
      isSelected: false,
      isCompleted: false
    }
  },
  {
    id: 'trial-node',
    type: 'trialNode',
    position: { x: 400, y: 100 },
    data: {
      title: 'Clinical Trials',
      trial: sampleTrials[0],
      matchScore: 85,
      isSelected: false,
      isCompleted: false,
      isSaved: true
    }
  },
  {
    id: 'assistance-node',
    type: 'assistanceNode',
    position: { x: 700, y: 100 },
    data: {
      title: 'Patient Assistance',
      program: sampleAssistancePrograms[0],
      eligibilityScore: 90,
      isSelected: false,
      isCompleted: false,
      isSaved: false
    }
  },
  {
    id: 'medication-node',
    type: 'medicationNode',
    position: { x: 100, y: 300 },
    data: {
      title: 'Medication Management',
      medication: sampleMedications[0],
      nextDose: '08:00',
      hasInteractions: true,
      sideEffectsCount: 2,
      isSelected: false,
      isCompleted: false
    }
  }
]

// Create initial medical flow edges
export const initialMedicalEdges: MedicalEdge[] = [
  {
    id: 'treatment-to-trial',
    source: 'treatment-node',
    target: 'trial-node',
    type: 'smoothstep',
    data: {
      label: 'Explore Trials',
      reason: 'Based on treatment guidelines'
    }
  },
  {
    id: 'trial-to-assistance',
    source: 'trial-node',
    target: 'assistance-node',
    type: 'smoothstep',
    data: {
      label: 'Financial Support',
      reason: 'Trial participation may need assistance'
    }
  },
  {
    id: 'treatment-to-medication',
    source: 'treatment-node',
    target: 'medication-node',
    type: 'smoothstep',
    data: {
      label: 'Medication Therapy',
      reason: 'Guideline-recommended treatment'
    }
  },
  {
    id: 'medication-to-assistance',
    source: 'medication-node',
    target: 'assistance-node',
    type: 'smoothstep',
    data: {
      label: 'Copay Assistance',
      reason: 'Medication cost support'
    }
  }
]
