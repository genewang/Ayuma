import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Medication, MedicationSchedule, DrugInteraction } from '../types'

interface MedicationState {
  // Data
  medications: Medication[]
  schedules: MedicationSchedule[]
  interactions: DrugInteraction[]

  // UI State
  loading: boolean
  error: string | null

  // Schedule Management
  currentSchedule: MedicationSchedule | null
  scheduleReminders: boolean

  // Alerts
  activeAlerts: DrugInteraction[]
  sideEffectLogs: SideEffectLog[]
}

interface SideEffectLog {
  id: string
  medicationId: string
  sideEffect: string
  severity: 'mild' | 'moderate' | 'severe'
  date: Date
  notes?: string
}

interface MedicationActions {
  // Data Actions
  setMedications: (medications: Medication[]) => void
  addMedication: (medication: Medication) => void
  updateMedication: (id: string, updates: Partial<Medication>) => void
  removeMedication: (id: string) => void

  // Schedule Actions
  setCurrentSchedule: (schedule: MedicationSchedule | null) => void
  updateSchedule: (id: string, updates: Partial<MedicationSchedule>) => void
  addScheduleEntry: (medicationId: string, schedule: Omit<MedicationSchedule, 'id'>) => void
  removeScheduleEntry: (id: string) => void

  // Interaction Actions
  checkInteractions: (medications: Medication[]) => DrugInteraction[]
  setInteractions: (interactions: DrugInteraction[]) => void

  // Side Effect Actions
  logSideEffect: (log: Omit<SideEffectLog, 'id' | 'date'>) => void
  updateSideEffectLog: (id: string, updates: Partial<SideEffectLog>) => void
  removeSideEffectLog: (id: string) => void

  // Alert Actions
  setActiveAlerts: (alerts: DrugInteraction[]) => void
  dismissAlert: (interactionId: string) => void

  // Settings
  setScheduleReminders: (enabled: boolean) => void

  // UI Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Utility Actions
  getUpcomingDoses: () => Array<{ medication: Medication; time: string; schedule: MedicationSchedule }>
  getMedicationById: (id: string) => Medication | undefined
  clearAllData: () => void
}

export const useMedicationStore = create<MedicationState & MedicationActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      medications: [],
      schedules: [],
      interactions: [],
      loading: false,
      error: null,
      currentSchedule: null,
      scheduleReminders: true,
      activeAlerts: [],
      sideEffectLogs: [],

      // Data Actions
      setMedications: (medications) => set({ medications }),

      addMedication: (medication) => set((state) => ({
        medications: [...state.medications, medication]
      })),

      updateMedication: (id, updates) => set((state) => ({
        medications: state.medications.map(med =>
          med.id === id ? { ...med, ...updates } : med
        )
      })),

      removeMedication: (id) => set((state) => ({
        medications: state.medications.filter(med => med.id !== id)
      })),

      // Schedule Actions
      setCurrentSchedule: (schedule) => set({ currentSchedule: schedule }),

      updateSchedule: (id, updates) => set((state) => ({
        schedules: state.schedules.map(schedule =>
          schedule.id === id ? { ...schedule, ...updates } : schedule
        )
      })),

      addScheduleEntry: (scheduleData: MedicationSchedule) => {
        const newSchedule: MedicationSchedule = {
          ...scheduleData,
          id: scheduleData.id || `schedule-${Date.now()}`
        }

        set((state) => ({
          schedules: [...state.schedules, newSchedule]
        }))
      },

      removeScheduleEntry: (id) => set((state) => ({
        schedules: state.schedules.filter(schedule => schedule.id !== id)
      })),

      // Interaction Actions
      checkInteractions: (medications) => {
        const interactions: DrugInteraction[] = []

        for (let i = 0; i < medications.length; i++) {
          for (let j = i + 1; j < medications.length; j++) {
            const interaction = findInteraction(
              medications[i].name,
              medications[j].name
            )

            if (interaction) {
              interactions.push({
                id: `interaction-${medications[i].id}-${medications[j].id}`,
                withDrug: medications[j].name,
                ...interaction
              })
            }
          }
        }

        set({ activeAlerts: interactions })
        return interactions
      },

      setInteractions: (interactions) => set({ interactions }),

      // Side Effect Actions
      logSideEffect: (logData) => {
        const newLog: SideEffectLog = {
          ...logData,
          id: `log-${Date.now()}`,
          date: new Date()
        }

        set((state) => ({
          sideEffectLogs: [...state.sideEffectLogs, newLog]
        }))
      },

      updateSideEffectLog: (id, updates) => set((state) => ({
        sideEffectLogs: state.sideEffectLogs.map(log =>
          log.id === id ? { ...log, ...updates } : log
        )
      })),

      removeSideEffectLog: (id) => set((state) => ({
        sideEffectLogs: state.sideEffectLogs.filter(log => log.id !== id)
      })),

      // Alert Actions
      setActiveAlerts: (alerts) => set({ activeAlerts: alerts }),

      dismissAlert: (interactionId) => set((state) => ({
        activeAlerts: state.activeAlerts.filter(alert => alert.id !== interactionId)
      })),

      // Settings
      setScheduleReminders: (enabled) => set({ scheduleReminders: enabled }),

      // UI Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Utility Actions
      getUpcomingDoses: () => {
        const { medications, schedules } = get()
        const now = new Date()
        const upcoming: Array<{ medication: Medication; time: string; schedule: MedicationSchedule }> = []

        medications.forEach(medication => {
          const schedule = schedules.find(s => s.id === medication.schedule.id)
          if (schedule) {
            schedule.times.forEach(time => {
              const [hours, minutes] = time.split(':').map(Number)
              const doseTime = new Date()
              doseTime.setHours(hours, minutes, 0, 0)

              if (doseTime > now) {
                upcoming.push({
                  medication,
                  time,
                  schedule
                })
              }
            })
          }
        })

        return upcoming.sort((a, b) => {
          const timeA = a.time.split(':').map(Number)
          const timeB = b.time.split(':').map(Number)
          return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
        })
      },

      getMedicationById: (id) => {
        const { medications } = get()
        return medications.find(med => med.id === id)
      },

      clearAllData: () => set({
        medications: [],
        schedules: [],
        interactions: [],
        activeAlerts: [],
        sideEffectLogs: [],
        currentSchedule: null
      }),
    }),
    {
      name: 'medication-store',
    }
  )
)

// Helper function to find drug interactions
function findInteraction(drug1: string, drug2: string): Omit<DrugInteraction, 'id' | 'withDrug'> | null {
  // This would typically query a drug interaction database
  // For now, returning mock interactions for common cases
  const interactions = [
    {
      severity: 'major' as const,
      description: 'May increase risk of bleeding when taken together',
      management: 'Monitor for signs of bleeding, consider dose adjustment',
      source: 'FDA'
    },
    {
      severity: 'moderate' as const,
      description: 'May cause increased drowsiness when taken together',
      management: 'Use caution when driving or operating machinery',
      source: 'Lexicomp'
    }
  ]

  // Mock logic - in real implementation, this would query a drug database
  if (drug1.toLowerCase().includes('warfarin') && drug2.toLowerCase().includes('aspirin')) {
    return interactions[0]
  }

  if (drug1.toLowerCase().includes('opioid') && drug2.toLowerCase().includes('benzodiazepine')) {
    return interactions[1]
  }

  return null
}
