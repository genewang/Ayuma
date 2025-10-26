import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  MedicalFlowState,
  PatientProfile,
  TreatmentGuideline,
  ClinicalTrial,
  AssistanceProgram,
  Medication,
  MedicalNode,
  MedicalEdge
} from '../types'

interface MedicalFlowActions {
  // Patient Profile Actions
  setPatientProfile: (profile: PatientProfile | null) => void
  updatePatientProfile: (updates: Partial<PatientProfile>) => void

  // Selection Actions
  setSelectedGuideline: (guideline: TreatmentGuideline | null) => void
  setSelectedTrial: (trial: ClinicalTrial | null) => void
  setSelectedProgram: (program: AssistanceProgram | null) => void
  setSelectedMedication: (medication: Medication | null) => void

  // Flow Actions
  setCurrentFlow: (flow: 'treatment' | 'trials' | 'assistance' | 'medications') => void
  updateNodes: (nodes: MedicalNode[]) => void
  updateEdges: (edges: MedicalEdge[]) => void
  addNode: (node: MedicalNode) => void
  removeNode: (nodeId: string) => void
  addEdge: (edge: MedicalEdge) => void
  removeEdge: (edgeId: string) => void

  // Loading Actions
  setLoading: (key: keyof MedicalFlowState['loading'], loading: boolean) => void

  // Filter Actions
  updateFilters: (filters: Partial<MedicalFlowState['filters']>) => void

  // Care Plan Actions
  saveCarePlan: () => Promise<void>
  loadCarePlan: (id: string) => Promise<void>
  createNewCarePlan: () => void

  // Reset Actions
  resetFlow: () => void
}

export const useMedicalFlowStore = create<MedicalFlowState & MedicalFlowActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      patientProfile: null,
      selectedGuideline: null,
      selectedTrial: null,
      selectedProgram: null,
      selectedMedication: null,
      currentFlow: 'treatment',
      loading: {
        guidelines: false,
        trials: false,
        programs: false,
        medications: false,
      },
      filters: {},

      // Patient Profile Actions
      setPatientProfile: (profile) => set({ patientProfile: profile }),

      updatePatientProfile: (updates) => set((state) => ({
        patientProfile: state.patientProfile ? {
          ...state.patientProfile,
          ...updates,
          updatedAt: new Date()
        } : null
      })),

      // Selection Actions
      setSelectedGuideline: (guideline) => set({ selectedGuideline: guideline }),
      setSelectedTrial: (trial) => set({ selectedTrial: trial }),
      setSelectedProgram: (program) => set({ selectedProgram: program }),
      setSelectedMedication: (medication) => set({ selectedMedication: medication }),

      // Flow Actions
      setCurrentFlow: (flow) => set({ currentFlow: flow }),

      updateNodes: (nodes) => set({ nodes }),
      updateEdges: (edges) => set({ edges }),

      addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node]
      })),

      removeNode: (nodeId) => set((state) => ({
        nodes: state.nodes.filter(node => node.id !== nodeId)
      })),

      addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge]
      })),

      removeEdge: (edgeId) => set((state) => ({
        edges: state.edges.filter(edge => edge.id !== edgeId)
      })),

      // Loading Actions
      setLoading: (key, loading) => set((state) => ({
        loading: {
          ...state.loading,
          [key]: loading
        }
      })),

      // Filter Actions
      updateFilters: (filters) => set((state) => ({
        filters: {
          ...state.filters,
          ...filters
        }
      })),

      // Care Plan Actions
      saveCarePlan: async () => {
        const state = get()
        const carePlan = {
          userId: state.patientProfile?.userId || '',
          title: `Care Plan - ${state.patientProfile?.diagnosis || 'New Patient'}`,
          patientProfile: state.patientProfile,
          nodes: state.nodes,
          edges: state.edges,
          updatedAt: new Date()
        }

        // TODO: Implement Supabase save
        console.log('Saving care plan:', carePlan)
      },

      loadCarePlan: async (id) => {
        set({ loading: { ...get().loading, guidelines: true } })

        try {
          // TODO: Implement Supabase load
          console.log('Loading care plan:', id)
        } catch (error) {
          console.error('Error loading care plan:', error)
        } finally {
          set({ loading: { ...get().loading, guidelines: false } })
        }
      },

      createNewCarePlan: () => {
        set({
          nodes: [],
          edges: [],
          selectedGuideline: null,
          selectedTrial: null,
          selectedProgram: null,
          selectedMedication: null,
          currentFlow: 'treatment'
        })
      },

      // Reset Actions
      resetFlow: () => set({
        nodes: [],
        edges: [],
        selectedGuideline: null,
        selectedTrial: null,
        selectedProgram: null,
        selectedMedication: null,
        currentFlow: 'treatment',
        filters: {}
      }),
    }),
    {
      name: 'medical-flow-store',
    }
  )
)
