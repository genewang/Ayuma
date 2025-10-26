import { useState, useCallback } from 'react'
import { MedicalAIServiceFactory, RAGResponse, AIMedicalResponse } from '../lib/ai-services'

// =====================================================
// AI HOOKS FOR REACT COMPONENTS
// =====================================================

export interface UseAIMedicalQueryOptions {
  onSuccess?: (response: RAGResponse) => void
  onError?: (error: Error) => void
  patientContext?: Record<string, any>
}

export interface UseAIDocumentProcessingOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function useAIMedicalQuery() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastResponse, setLastResponse] = useState<RAGResponse | null>(null)

  const query = useCallback(async (
    question: string,
    options: UseAIMedicalQueryOptions = {}
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get AI service instance
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      // Process the medical query
      const response = await aiService.processMedicalQuery(
        question,
        options.patientContext
      )

      setLastResponse(response)
      options.onSuccess?.(response)

      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown AI service error')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    query,
    isLoading,
    error,
    lastResponse,
    clearError: () => setError(null),
    clearResponse: () => setLastResponse(null)
  }
}

export function useAIDocumentProcessing() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const processDocuments = useCallback(async (
    documents: any[],
    options: UseAIDocumentProcessingOptions = {}
  ) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      // Get AI service instance
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      // Process the medical documents
      await aiService.processMedicalDocuments(documents)

      clearInterval(progressInterval)
      setProgress(100)

      options.onSuccess?.({ success: true, documentCount: documents.length })

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Document processing failed')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [])

  return {
    processDocuments,
    isProcessing,
    progress,
    error,
    clearError: () => setError(null),
    resetProgress: () => setProgress(0)
  }
}

export function useAIInsights() {
  const [insights, setInsights] = useState<AIMedicalResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getInsights = useCallback(async (
    medicalData: Record<string, any>,
    queryType: 'treatment' | 'trial' | 'medication' | 'assistance'
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      // Build query based on type and medical data
      let query = ''
      switch (queryType) {
        case 'treatment':
          query = `What are the recommended treatments for ${medicalData.diagnosis} stage ${medicalData.stage}?`
          break
        case 'trial':
          query = `Find clinical trials for ${medicalData.diagnosis} with ${medicalData.biomarkers?.join(', ') || 'any biomarkers'}`
          break
        case 'medication':
          query = `What medications are recommended for ${medicalData.diagnosis}?`
          break
        case 'assistance':
          query = `What assistance programs are available for ${medicalData.diagnosis} treatment?`
          break
      }

      const response = await aiService.processMedicalQuery(query, medicalData)
      const aiResponse: AIMedicalResponse = {
        answer: response.answer,
        citations: response.citations || [],
        confidence: response.confidence,
        entities: [], // Would be populated from the response
        modelUsed: response.modelUsed
      }

      setInsights(aiResponse)
      return aiResponse

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get AI insights')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getInsights,
    insights,
    isLoading,
    error,
    clearInsights: () => setInsights(null),
    clearError: () => setError(null)
  }
}

// =====================================================
// AI-POWERED MEDICAL PANEL HOOKS
// =====================================================

export function useAITreatmentPanel() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getTreatmentRecommendations = useCallback(async (
    diagnosis: string,
    stage: string,
    biomarkers?: string[]
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      const query = `What are the current treatment guidelines for ${diagnosis} stage ${stage}${biomarkers?.length ? ` with biomarkers: ${biomarkers.join(', ')}` : ''}?`

      const response = await aiService.processMedicalQuery(query)

      // Parse treatment recommendations from AI response
      const parsedRecommendations = parseTreatmentRecommendations(response.answer)
      setRecommendations(parsedRecommendations)

      return parsedRecommendations

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get treatment recommendations')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getTreatmentRecommendations,
    recommendations,
    isLoading,
    error,
    clearRecommendations: () => setRecommendations([]),
    clearError: () => setError(null)
  }
}

export function useAITrialMatching() {
  const [matchedTrials, setMatchedTrials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const findMatchingTrials = useCallback(async (
    patientProfile: Record<string, any>,
    maxDistance: number = 100
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      const query = `Find clinical trials for ${patientProfile.diagnosis} stage ${patientProfile.stage} within ${maxDistance} miles of ${patientProfile.location}`

      const response = await aiService.processMedicalQuery(query, patientProfile)

      // Parse trial matches from AI response
      const parsedTrials = parseTrialMatches(response.answer)
      setMatchedTrials(parsedTrials)

      return parsedTrials

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to find matching trials')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    findMatchingTrials,
    matchedTrials,
    isLoading,
    error,
    clearMatches: () => setMatchedTrials([]),
    clearError: () => setError(null)
  }
}

export function useAIMedicationAssistant() {
  const [interactions, setInteractions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const checkInteractions = useCallback(async (
    medications: string[],
    patientInfo?: Record<string, any>
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      const query = `Check for drug interactions between: ${medications.join(', ')}`

      const response = await aiService.processMedicalQuery(query, patientInfo)

      // Parse interactions from AI response
      const parsedInteractions = parseMedicationInteractions(response.answer)
      setInteractions(parsedInteractions)

      return parsedInteractions

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check medication interactions')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    checkInteractions,
    interactions,
    isLoading,
    error,
    clearInteractions: () => setInteractions([]),
    clearError: () => setError(null)
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function parseTreatmentRecommendations(aiResponse: string): any[] {
  // Simple parsing logic - could be enhanced with NLP
  const recommendations: any[] = []

  // Extract treatment types and descriptions
  const treatmentMatches = aiResponse.match(/(\w+):\s*([^.]+)/g)
  if (treatmentMatches) {
    treatmentMatches.forEach(match => {
      const [, treatment, description] = match.split(':')
      recommendations.push({
        treatment: treatment.trim(),
        description: description.trim(),
        confidence: 'high'
      })
    })
  }

  return recommendations
}

function parseTrialMatches(aiResponse: string): any[] {
  // Simple parsing logic for trial matches
  const trials: any[] = []

  // Extract trial information
  const trialMatches = aiResponse.match(/NCT\d+:?\s*([^.]+)/g)
  if (trialMatches) {
    trialMatches.forEach(match => {
      const trialId = match.match(/NCT\d+/)
      const description = match.replace(/NCT\d+:?\s*/, '')
      if (trialId) {
        trials.push({
          nctId: trialId[0],
          title: description.trim(),
          status: 'active',
          eligibilityScore: Math.random() * 40 + 60 // Mock score
        })
      }
    })
  }

  return trials
}

function parseMedicationInteractions(aiResponse: string): any[] {
  // Simple parsing logic for medication interactions
  const interactions: any[] = []

  // Extract interaction information
  const interactionMatches = aiResponse.match(/(\w+)\s*\+\s*(\w+):\s*([^.]+)/g)
  if (interactionMatches) {
    interactionMatches.forEach(match => {
      const [, drug1, drug2, description] = match.split(/\+|:/)
      interactions.push({
        medications: [drug1.trim(), drug2.trim()],
        severity: description.includes('major') ? 'major' :
                  description.includes('moderate') ? 'moderate' : 'minor',
        description: description.trim(),
        management: 'Monitor closely'
      })
    })
  }

  return interactions
}

// =====================================================
// AI INITIALIZATION HOOK
// =====================================================

export function useAIInitialization() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const initialize = useCallback(async (
    backendURL?: string
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()
      await aiService.initialize(backendURL)
      setIsInitialized(true)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI initialization failed')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    initialize,
    isInitialized,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

// =====================================================
// AI PERFORMANCE MONITORING HOOK
// =====================================================

export function useAIPerformance() {
  const [metrics, setMetrics] = useState({
    totalQueries: 0,
    averageResponseTime: 0,
    averageConfidence: 0,
    lastQueryTime: 0
  })

  const trackQuery = useCallback((responseTime: number, confidence: number) => {
    setMetrics(prev => ({
      totalQueries: prev.totalQueries + 1,
      averageResponseTime: (prev.averageResponseTime * prev.totalQueries + responseTime) / (prev.totalQueries + 1),
      averageConfidence: (prev.averageConfidence * prev.totalQueries + confidence) / (prev.totalQueries + 1),
      lastQueryTime: responseTime
    }))
  }, [])

  return {
    metrics,
    trackQuery,
    resetMetrics: () => setMetrics({
      totalQueries: 0,
      averageResponseTime: 0,
      averageConfidence: 0,
      lastQueryTime: 0
    })
  }
}

// =====================================================
// AI HOOKS FOR REACT COMPONENTS
// =====================================================

export interface UseAIMedicalQueryOptions {
  onSuccess?: (response: RAGResponse) => void
  onError?: (error: Error) => void
  patientContext?: Record<string, any>
}

export interface UseAIDocumentProcessingOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function useAIMedicalQuery() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastResponse, setLastResponse] = useState<RAGResponse | null>(null)

  const query = useCallback(async (
    question: string,
    options: UseAIMedicalQueryOptions = {}
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get AI service instance
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      // Process the medical query
      const response = await aiService.processMedicalQuery(
        question,
        options.patientContext
      )

      setLastResponse(response)
      options.onSuccess?.(response)

      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown AI service error')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    query,
    isLoading,
    error,
    lastResponse,
    clearError: () => setError(null),
    clearResponse: () => setLastResponse(null)
  }
}

export function useAIDocumentProcessing() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const processDocuments = useCallback(async (
    documents: any[],
    options: UseAIDocumentProcessingOptions = {}
  ) => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)

    try {
      // Get AI service instance
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      // Process the medical documents
      await aiService.processMedicalDocuments(documents)

      clearInterval(progressInterval)
      setProgress(100)

      options.onSuccess?.({ success: true, documentCount: documents.length })

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Document processing failed')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [])

  return {
    processDocuments,
    isProcessing,
    progress,
    error,
    clearError: () => setError(null),
    resetProgress: () => setProgress(0)
  }
}

export function useAIInsights() {
  const [insights, setInsights] = useState<AIMedicalResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getInsights = useCallback(async (
    medicalData: Record<string, any>,
    queryType: 'treatment' | 'trial' | 'medication' | 'assistance'
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      // Build query based on type and medical data
      let query = ''
      switch (queryType) {
        case 'treatment':
          query = `What are the recommended treatments for ${medicalData.diagnosis} stage ${medicalData.stage}?`
          break
        case 'trial':
          query = `Find clinical trials for ${medicalData.diagnosis} with ${medicalData.biomarkers?.join(', ') || 'any biomarkers'}`
          break
        case 'medication':
          query = `What medications are recommended for ${medicalData.diagnosis}?`
          break
        case 'assistance':
          query = `What assistance programs are available for ${medicalData.diagnosis} treatment?`
          break
      }

      const response = await aiService.processMedicalQuery(query, medicalData)
      const aiResponse: AIMedicalResponse = {
        answer: response.answer,
        citations: response.citations || [],
        confidence: response.confidence,
        entities: [], // Would be populated from the response
        modelUsed: response.modelUsed
      }

      setInsights(aiResponse)
      return aiResponse

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get AI insights')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getInsights,
    insights,
    isLoading,
    error,
    clearInsights: () => setInsights(null),
    clearError: () => setError(null)
  }
}

// =====================================================
// AI-POWERED MEDICAL PANEL HOOKS
// =====================================================

export function useAITreatmentPanel() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getTreatmentRecommendations = useCallback(async (
    diagnosis: string,
    stage: string,
    biomarkers?: string[]
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      const query = `What are the current treatment guidelines for ${diagnosis} stage ${stage}${biomarkers?.length ? ` with biomarkers: ${biomarkers.join(', ')}` : ''}?`

      const response = await aiService.processMedicalQuery(query)

      // Parse treatment recommendations from AI response
      const parsedRecommendations = parseTreatmentRecommendations(response.answer)
      setRecommendations(parsedRecommendations)

      return parsedRecommendations

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get treatment recommendations')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getTreatmentRecommendations,
    recommendations,
    isLoading,
    error,
    clearRecommendations: () => setRecommendations([]),
    clearError: () => setError(null)
  }
}

export function useAITrialMatching() {
  const [matchedTrials, setMatchedTrials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const findMatchingTrials = useCallback(async (
    patientProfile: Record<string, any>,
    maxDistance: number = 100
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      const query = `Find clinical trials for ${patientProfile.diagnosis} stage ${patientProfile.stage} within ${maxDistance} miles of ${patientProfile.location}`

      const response = await aiService.processMedicalQuery(query, patientProfile)

      // Parse trial matches from AI response
      const parsedTrials = parseTrialMatches(response.answer)
      setMatchedTrials(parsedTrials)

      return parsedTrials

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to find matching trials')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    findMatchingTrials,
    matchedTrials,
    isLoading,
    error,
    clearMatches: () => setMatchedTrials([]),
    clearError: () => setError(null)
  }
}

export function useAIMedicationAssistant() {
  const [interactions, setInteractions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const checkInteractions = useCallback(async (
    medications: string[],
    patientInfo?: Record<string, any>
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()

      // Initialize with backend URL if available
      const backendURL = import.meta.env.VITE_AI_BACKEND_URL
      await aiService.initialize(backendURL)

      const query = `Check for drug interactions between: ${medications.join(', ')}`

      const response = await aiService.processMedicalQuery(query, patientInfo)

      // Parse interactions from AI response
      const parsedInteractions = parseMedicationInteractions(response.answer)
      setInteractions(parsedInteractions)

      return parsedInteractions

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check medication interactions')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    checkInteractions,
    interactions,
    isLoading,
    error,
    clearInteractions: () => setInteractions([]),
    clearError: () => setError(null)
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function parseTreatmentRecommendations(aiResponse: string): any[] {
  // Simple parsing logic - could be enhanced with NLP
  const recommendations: any[] = []

  // Extract treatment types and descriptions
  const treatmentMatches = aiResponse.match(/(\w+):\s*([^.]+)/g)
  if (treatmentMatches) {
    treatmentMatches.forEach(match => {
      const [, treatment, description] = match.split(':')
      recommendations.push({
        treatment: treatment.trim(),
        description: description.trim(),
        confidence: 'high'
      })
    })
  }

  return recommendations
}

function parseTrialMatches(aiResponse: string): any[] {
  // Simple parsing logic for trial matches
  const trials: any[] = []

  // Extract trial information
  const trialMatches = aiResponse.match(/NCT\d+:?\s*([^.]+)/g)
  if (trialMatches) {
    trialMatches.forEach(match => {
      const trialId = match.match(/NCT\d+/)
      const description = match.replace(/NCT\d+:?\s*/, '')
      if (trialId) {
        trials.push({
          nctId: trialId[0],
          title: description.trim(),
          status: 'active',
          eligibilityScore: Math.random() * 40 + 60 // Mock score
        })
      }
    })
  }

  return trials
}

function parseMedicationInteractions(aiResponse: string): any[] {
  // Simple parsing logic for medication interactions
  const interactions: any[] = []

  // Extract interaction information
  const interactionMatches = aiResponse.match(/(\w+)\s*\+\s*(\w+):\s*([^.]+)/g)
  if (interactionMatches) {
    interactionMatches.forEach(match => {
      const [, drug1, drug2, description] = match.split(/\+|:/)
      interactions.push({
        medications: [drug1.trim(), drug2.trim()],
        severity: description.includes('major') ? 'major' :
                  description.includes('moderate') ? 'moderate' : 'minor',
        description: description.trim(),
        management: 'Monitor closely'
      })
    })
  }

  return interactions
}

// =====================================================
// AI INITIALIZATION HOOK
// =====================================================

export function useAIInitialization() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const initialize = useCallback(async (
    backendURL?: string
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const aiService = MedicalAIServiceFactory.getInstance()
      await aiService.initialize(backendURL)
      setIsInitialized(true)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI initialization failed')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    initialize,
    isInitialized,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

// =====================================================
// AI PERFORMANCE MONITORING HOOK
// =====================================================

export function useAIPerformance() {
  const [metrics, setMetrics] = useState({
    totalQueries: 0,
    averageResponseTime: 0,
    averageConfidence: 0,
    lastQueryTime: 0
  })

  const trackQuery = useCallback((responseTime: number, confidence: number) => {
    setMetrics(prev => ({
      totalQueries: prev.totalQueries + 1,
      averageResponseTime: (prev.averageResponseTime * prev.totalQueries + responseTime) / (prev.totalQueries + 1),
      averageConfidence: (prev.averageConfidence * prev.totalQueries + confidence) / (prev.totalQueries + 1),
      lastQueryTime: responseTime
    }))
  }, [])

  return {
    metrics,
    trackQuery,
    resetMetrics: () => setMetrics({
      totalQueries: 0,
      averageResponseTime: 0,
      averageConfidence: 0,
      lastQueryTime: 0
    })
  }
}
