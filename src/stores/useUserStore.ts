import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { PatientProfile, AssistanceProgram } from '../types'

interface UserState {
  // Patient Data
  patientProfiles: PatientProfile[]
  currentProfile: PatientProfile | null

  // Assistance Programs
  assistancePrograms: AssistanceProgram[]
  savedPrograms: string[] // Program IDs

  // UI State
  loading: boolean
  error: string | null

  // Search & Filter
  programFilters: {
    type?: string[]
    category?: string[]
    location?: string
  }
}

interface UserActions {
  // Patient Profile Actions
  setPatientProfiles: (profiles: PatientProfile[]) => void
  setCurrentProfile: (profile: PatientProfile | null) => void
  addPatientProfile: (profile: Omit<PatientProfile, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePatientProfile: (id: string, updates: Partial<PatientProfile>) => void
  removePatientProfile: (id: string) => void

  // Assistance Program Actions
  setAssistancePrograms: (programs: AssistanceProgram[]) => void
  addAssistanceProgram: (program: AssistanceProgram) => void
  saveProgram: (programId: string) => void
  unsaveProgram: (programId: string) => void

  // Search & Filter Actions
  updateProgramFilters: (filters: Partial<UserState['programFilters']>) => void
  clearProgramFilters: () => void

  // Utility Actions
  getEligiblePrograms: (profile: PatientProfile) => AssistanceProgram[]
  getSavedPrograms: () => AssistanceProgram[]

  // UI Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Reset
  clearAllData: () => void
}

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      patientProfiles: [],
      currentProfile: null,
      assistancePrograms: [],
      savedPrograms: [],
      loading: false,
      error: null,
      programFilters: {},

      // Patient Profile Actions
      setPatientProfiles: (profiles) => set({ patientProfiles: profiles }),

      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      addPatientProfile: (profileData) => {
        const newProfile: PatientProfile = {
          ...profileData,
          id: `profile-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        set((state) => ({
          patientProfiles: [...state.patientProfiles, newProfile]
        }))
      },

      updatePatientProfile: (id, updates) => set((state) => ({
        patientProfiles: state.patientProfiles.map(profile =>
          profile.id === id
            ? { ...profile, ...updates, updatedAt: new Date() }
            : profile
        ),
        currentProfile: state.currentProfile?.id === id
          ? { ...state.currentProfile, ...updates, updatedAt: new Date() }
          : state.currentProfile
      })),

      removePatientProfile: (id) => set((state) => ({
        patientProfiles: state.patientProfiles.filter(profile => profile.id !== id),
        currentProfile: state.currentProfile?.id === id ? null : state.currentProfile
      })),

      // Assistance Program Actions
      setAssistancePrograms: (programs) => set({ assistancePrograms: programs }),

      addAssistanceProgram: (program) => set((state) => ({
        assistancePrograms: [...state.assistancePrograms, program]
      })),

      saveProgram: (programId) => set((state) => ({
        savedPrograms: [...state.savedPrograms, programId]
      })),

      unsaveProgram: (programId) => set((state) => ({
        savedPrograms: state.savedPrograms.filter(id => id !== programId)
      })),

      // Search & Filter Actions
      updateProgramFilters: (filters) => set((state) => ({
        programFilters: { ...state.programFilters, ...filters }
      })),

      clearProgramFilters: () => set({ programFilters: {} }),

      // Utility Actions
      getEligiblePrograms: (profile) => {
        const { assistancePrograms, programFilters } = get()

        let filteredPrograms = assistancePrograms

        // Apply filters
        if (programFilters.type?.length) {
          filteredPrograms = filteredPrograms.filter(program =>
            programFilters.type!.includes(program.type)
          )
        }

        if (programFilters.category?.length) {
          filteredPrograms = filteredPrograms.filter(program =>
            programFilters.category!.includes(program.category)
          )
        }

        // Check eligibility
        return filteredPrograms.filter(program =>
          checkProgramEligibility(program, profile)
        )
      },

      getSavedPrograms: () => {
        const { assistancePrograms, savedPrograms } = get()
        return assistancePrograms.filter(program =>
          savedPrograms.includes(program.id)
        )
      },

      // UI Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Reset
      clearAllData: () => set({
        patientProfiles: [],
        currentProfile: null,
        assistancePrograms: [],
        savedPrograms: [],
        programFilters: {}
      }),
    }),
    {
      name: 'user-store',
    }
  )
)

// Helper function to check if patient is eligible for assistance program
function checkProgramEligibility(program: AssistanceProgram, profile: PatientProfile): boolean {
  // Check condition eligibility
  if (!program.eligibility.conditions.includes(profile.diagnosis)) {
    return false
  }

  // Check insurance eligibility
  if (!program.eligibility.insuranceTypes.includes(profile.insurance)) {
    return false
  }

  // Check age eligibility
  if (program.eligibility.ageRange) {
    const { min, max } = program.eligibility.ageRange
    if (profile.age && (profile.age < min || profile.age > max)) {
      return false
    }
  }

  // Check location eligibility
  if (program.eligibility.location?.length) {
    if (!program.eligibility.location.includes(profile.location)) {
      return false
    }
  }

  // Check income eligibility (simplified)
  if (program.eligibility.incomeRange) {
    // In real implementation, would check actual income
    // For now, just check if income range is specified
    return true
  }

  return true
}
