import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Role, Roadmap, Skill } from '../types'

interface User {
  id: string
  email: string
  name?: string
}

interface AppState {
  // UI State
  selectedRole: Role | null
  isLoading: boolean
  error: string | null

  // User State
  user: User | null
  isAuthenticated: boolean

  // Roadmap State
  currentRoadmap: Roadmap | null
  savedRoadmaps: Roadmap[]

  // Skills State
  skills: Skill[]

  // Actions
  setSelectedRole: (role: Role | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUser: (user: User | null) => void
  setCurrentRoadmap: (roadmap: Roadmap | null) => void
  setSavedRoadmaps: (roadmaps: Roadmap[]) => void
  setSkills: (skills: Skill[]) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedRole: null,
      isLoading: false,
      error: null,
      user: null,
      isAuthenticated: false,
      currentRoadmap: null,
      savedRoadmaps: [],
      skills: [],

      // Actions
      setSelectedRole: (role) => set({ selectedRole: role }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setUser: (user) => set({
        user,
        isAuthenticated: !!user
      }),

      setCurrentRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),

      setSavedRoadmaps: (roadmaps) => set({ savedRoadmaps: roadmaps }),

      setSkills: (skills) => set({ skills }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        currentRoadmap: null,
        savedRoadmaps: []
      }),
    }),
    {
      name: 'guidedpath-store',
    }
  )
)
