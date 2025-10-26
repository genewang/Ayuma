import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ClinicalTrial, PatientProfile, TrialLocation } from '../types'

interface TrialState {
  // Data
  trials: ClinicalTrial[]
  eligibleTrials: ClinicalTrial[]
  savedTrials: string[] // Trial IDs

  // Search & Filter
  searchQuery: string
  filters: {
    phase?: string[]
    status?: string[]
    conditions?: string[]
    location?: string
    maxDistance?: number
  }

  // UI State
  loading: boolean
  error: string | null

  // Eligibility Questionnaire
  eligibilityAnswers: Record<string, any>
  eligibilityStep: number
  showEligibilityWizard: boolean
}

interface TrialActions {
  // Data Actions
  setTrials: (trials: ClinicalTrial[]) => void
  addTrial: (trial: ClinicalTrial) => void
  saveTrial: (trialId: string) => void
  unsaveTrial: (trialId: string) => void

  // Search & Filter Actions
  setSearchQuery: (query: string) => void
  updateFilters: (filters: Partial<TrialState['filters']>) => void
  clearFilters: () => void

  // Eligibility Actions
  setEligibilityAnswer: (question: string, answer: any) => void
  nextEligibilityStep: () => void
  prevEligibilityStep: () => void
  resetEligibilityWizard: () => void
  calculateEligibility: (profile: PatientProfile) => ClinicalTrial[]

  // UI Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleEligibilityWizard: () => void
}

export const useTrialStore = create<TrialState & TrialActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      trials: [],
      eligibleTrials: [],
      savedTrials: [],
      searchQuery: '',
      filters: {},
      loading: false,
      error: null,
      eligibilityAnswers: {},
      eligibilityStep: 0,
      showEligibilityWizard: false,

      // Data Actions
      setTrials: (trials) => set({ trials }),

      addTrial: (trial) => set((state) => ({
        trials: [...state.trials, trial]
      })),

      saveTrial: (trialId) => set((state) => ({
        savedTrials: [...state.savedTrials, trialId]
      })),

      unsaveTrial: (trialId) => set((state) => ({
        savedTrials: state.savedTrials.filter(id => id !== trialId)
      })),

      // Search & Filter Actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      updateFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),

      clearFilters: () => set({
        filters: {},
        searchQuery: ''
      }),

      // Eligibility Actions
      setEligibilityAnswer: (question, answer) => set((state) => ({
        eligibilityAnswers: {
          ...state.eligibilityAnswers,
          [question]: answer
        }
      })),

      nextEligibilityStep: () => set((state) => ({
        eligibilityStep: state.eligibilityStep + 1
      })),

      prevEligibilityStep: () => set((state) => ({
        eligibilityStep: Math.max(0, state.eligibilityStep - 1)
      })),

      resetEligibilityWizard: () => set({
        eligibilityAnswers: {},
        eligibilityStep: 0,
        showEligibilityWizard: false
      }),

      calculateEligibility: (profile) => {
        const { trials, filters, searchQuery } = get()

        let filteredTrials = trials

        // Apply search query
        if (searchQuery) {
          filteredTrials = filteredTrials.filter(trial =>
            trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trial.conditions.some(condition =>
              condition.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
        }

        // Apply filters
        if (filters.phase?.length) {
          filteredTrials = filteredTrials.filter(trial =>
            filters.phase!.includes(trial.phase)
          )
        }

        if (filters.status?.length) {
          filteredTrials = filteredTrials.filter(trial =>
            filters.status!.includes(trial.status)
          )
        }

        if (filters.conditions?.length) {
          filteredTrials = filteredTrials.filter(trial =>
            trial.conditions.some(condition =>
              filters.conditions!.includes(condition)
            )
          )
        }

        // Calculate eligibility scores and filter
        const eligibleTrials = filteredTrials
          .map(trial => ({
            trial,
            score: calculateMatchScore(trial, profile)
          }))
          .filter(({ score }) => score >= 70) // 70% match threshold
          .sort((a, b) => b.score - a.score)
          .map(({ trial }) => trial)

        set({ eligibleTrials })
        return eligibleTrials
      },

      // UI Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      toggleEligibilityWizard: () => set((state) => ({
        showEligibilityWizard: !state.showEligibilityWizard
      })),
    }),
    {
      name: 'trial-store',
    }
  )
)

// Helper function to calculate trial-patient match score
function calculateMatchScore(trial: ClinicalTrial, profile: PatientProfile): number {
  let score = 0

  // Diagnosis match (40 points)
  if (trial.conditions.includes(profile.diagnosis)) score += 40

  // Stage/condition match (20 points)
  const stageMatch = trial.conditions.some(condition =>
    condition.toLowerCase().includes(profile.stage.toLowerCase())
  )
  if (stageMatch) score += 20

  // Biomarker match (20 points)
  if (trial.eligibility.biomarkers?.length) {
    const biomarkerMatch = trial.eligibility.biomarkers.some(biomarker =>
      profile.biomarkers.includes(biomarker)
    )
    if (biomarkerMatch) score += 20
  }

  // Location match (10 points)
  if (trial.locations.some(location => isLocationNearby(location, profile.location))) {
    score += 10
  }

  // Treatment history (10 points)
  if (trial.eligibility.previousTreatments?.length) {
    const treatmentMatch = trial.eligibility.previousTreatments.some(treatment =>
      profile.previousTreatments.includes(treatment)
    )
    if (treatmentMatch) score += 10
  }

  return score
}

// Helper function to check if location is nearby
function isLocationNearby(location: TrialLocation, patientLocation: string): boolean {
  // Simple distance check - in real implementation, use geocoding
  // For now, just check if the distance is within 50 miles
  // In a real implementation, we would calculate actual distance using geocoding
  // between location and patientLocation
  if (location.distance !== undefined && location.distance <= 50) {
    return true
  }

  // Fallback: check if patientLocation is in the same state
  return location.state.toLowerCase() === patientLocation.toLowerCase()
}
