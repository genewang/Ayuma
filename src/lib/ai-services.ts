// AI Services for Medical GuidedPath Application
// Backend-integrated implementation with multi-LLM coordination

interface BackendAPIResponse {
  success: boolean
  data?: any
  error?: string
  query_id?: string
  batch_size?: number
  count?: number
  message?: string
  result?: any
}

interface Citation {
  id: number
  content: string
  source: string
  institution: string
  evidence_level: string
  study_type?: string
  publication_date: string
  confidence_score: number
  quality_score: number
  relevance_score: number
  url?: string
  doi?: string
}

interface MedicalQueryResponse {
  answer: string
  model_used: string
  citations: Citation[]
  medical_entities_found: Record<string, string[]>
  evidence_quality: string
  evidence_level_description: string
  recommendation_strength: string
  cost_estimation: number
  tokens_used: number
  timestamp: number
  processing_time: number
  query_id: string
}

class BackendAPIClient {
  private baseURL: string

  constructor(baseURL: string = 'http://localhost:8000/api') {
    this.baseURL = baseURL
  }

  async processMedicalQuery(query: string, patientContext?: Record<string, any>): Promise<MedicalQueryResponse> {
    try {
      const response = await fetch(`${this.baseURL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          patient_context: patientContext
        })
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      const result: BackendAPIResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Backend processing failed')
      }

      return result.data as MedicalQueryResponse
    } catch (error) {
      console.error('Backend API error:', error)
      throw error
    }
  }

  async validateQuery(query: string, patientContext?: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/validate-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          patient_context: patientContext
        })
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      const result: BackendAPIResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Query validation failed')
      }

      return result.data
    } catch (error) {
      console.error('Backend validation error:', error)
      throw error
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/status`)

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      const result: BackendAPIResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Status check failed')
      }

      return result.data
    } catch (error) {
      console.error('Backend status error:', error)
      throw error
    }
  }

  async ingestDocuments(documents: any[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/ingest-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents })
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      const result: BackendAPIResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Document ingestion failed')
      }

      return result
    } catch (error) {
      console.error('Backend ingestion error:', error)
      throw error
    }
  }
}

// =====================================================
// MEDICAL ENTITY RECOGNITION (BACKEND INTEGRATION)
// =====================================================

export interface MedicalEntity {
  type: 'diagnosis' | 'stage' | 'treatment' | 'medication' | 'biomarker' | 'symptom'
  value: string
  confidence: number
  context: string
}

export class MedicalEntityExtractor {
  private backendClient: BackendAPIClient

  constructor(backendURL?: string) {
    this.backendClient = new BackendAPIClient(backendURL)
  }

  async extractEntities(query: string): Promise<MedicalEntity[]> {
    try {
      const validation = await this.backendClient.validateQuery(query)

      if (validation?.query_analysis?.entities_found) {
        const entities = validation.query_analysis.entities_found
        const extractedEntities: MedicalEntity[] = []

        // Convert backend entities to frontend format
        Object.entries(entities).forEach(([type, values]) => {
          if (Array.isArray(values) && values.length > 0) {
            values.forEach((value: string) => {
              extractedEntities.push({
                type: type as MedicalEntity['type'],
                value,
                confidence: 0.8, // Backend provides high confidence entities
                context: query
              })
            })
          }
        })

        return extractedEntities.sort((a, b) => b.confidence - a.confidence)
      }

      // Fallback to local extraction if backend fails
      return this.extractEntitiesLocal(query)
    } catch (error) {
      console.warn('Backend entity extraction failed, using local fallback:', error)
      return this.extractEntitiesLocal(query)
    }
  }

  private extractEntitiesLocal(query: string): MedicalEntity[] {
    const entities: MedicalEntity[] = []
    const lowerQuery = query.toLowerCase()

    const clinicalKeywords = {
      diagnosis: ['cancer', 'carcinoma', 'adenocarcinoma', 'sarcoma', 'lymphoma', 'leukemia', 'melanoma'],
      stage: ['stage i', 'stage ii', 'stage iii', 'stage iv', 'early stage', 'advanced stage', 'metastatic'],
      treatment: ['chemotherapy', 'immunotherapy', 'radiation', 'surgery', 'targeted therapy', 'hormone therapy'],
      medication: ['tamoxifen', 'methotrexate', 'paclitaxel', 'doxorubicin', 'trastuzumab', 'pembrolizumab'],
      biomarker: ['her2', 'er', 'pr', 'pd-l1', 'egfr', 'alk', 'ros1', 'braf'],
      symptom: ['pain', 'fatigue', 'nausea', 'shortness of breath', 'weight loss', 'fever']
    }

    for (const [type, keywords] of Object.entries(clinicalKeywords)) {
      for (const keyword of keywords) {
        if (lowerQuery.includes(keyword)) {
          entities.push({
            type: type as MedicalEntity['type'],
            value: keyword,
            confidence: this.calculateConfidence(keyword, lowerQuery),
            context: this.extractContext(keyword, query)
          })
        }
      }
    }

    return entities.sort((a, b) => b.confidence - a.confidence)
  }

  private calculateConfidence(keyword: string, query: string): number {
    let confidence = 0.5

    if (query.toLowerCase().includes(keyword.toLowerCase())) {
      confidence += 0.3
    }

    const medicalContextWords = ['treatment', 'diagnosis', 'stage', 'therapy', 'patient', 'clinical']
    if (medicalContextWords.some(word => query.toLowerCase().includes(word))) {
      confidence += 0.2
    }

    return Math.min(confidence, 1.0)
  }

  private extractContext(keyword: string, query: string): string {
    const index = query.toLowerCase().indexOf(keyword.toLowerCase())
    if (index === -1) return ''

    const start = Math.max(0, index - 50)
    const end = Math.min(query.length, index + keyword.length + 50)

    return query.slice(start, end)
  }
}

// =====================================================
// RAG PIPELINE (BACKEND INTEGRATION)
// =====================================================

export interface RAGResponse {
  answer: string
  citations: Citation[]
  confidence: number
  processingTime: number
  modelUsed: string
  queryId: string
  evidenceQuality: string
  recommendationStrength: string
}

export class MedicalRAGPipeline {
  private backendClient: BackendAPIClient

  constructor(backendURL?: string) {
    this.backendClient = new BackendAPIClient(backendURL)
  }

  async processQuery(query: string, patientContext?: Record<string, any>): Promise<RAGResponse> {
    try {
      // Use backend API for processing
      const backendResponse = await this.backendClient.processMedicalQuery(query, patientContext)

      // Convert backend response to frontend format
      const response: RAGResponse = {
        answer: backendResponse.answer,
        citations: backendResponse.citations || [],
        confidence: this.calculateOverallConfidence(backendResponse),
        processingTime: backendResponse.processing_time || 0,
        modelUsed: backendResponse.model_used || 'unknown',
        queryId: backendResponse.query_id || `query_${Date.now()}`,
        evidenceQuality: backendResponse.evidence_quality || 'Unknown',
        recommendationStrength: backendResponse.recommendation_strength || 'Unknown'
      }

      return response

    } catch (error) {
      console.error('RAG pipeline error:', error)
      throw new Error('Failed to process medical query')
    }
  }

  private calculateOverallConfidence(backendResponse: MedicalQueryResponse): number {
    // Calculate confidence based on backend response
    let confidence = 0.5

    // Evidence quality contribution
    const qualityMap = {
      'Very High Quality': 0.3,
      'High Quality': 0.25,
      'Moderate Quality': 0.15,
      'Low Quality': 0.05,
      'Very Low Quality': 0.0
    }

    confidence += qualityMap[backendResponse.evidence_quality as keyof typeof qualityMap] || 0

    // Citation confidence contribution
    if (backendResponse.citations && backendResponse.citations.length > 0) {
      const avgCitationConfidence = backendResponse.citations.reduce(
        (sum, citation) => sum + citation.confidence_score, 0
      ) / backendResponse.citations.length
      confidence += (avgCitationConfidence * 0.3)
    }

    // Model confidence contribution
    const modelMap = {
      'gpt-4-1106-preview': 0.2,
      'claude-3-sonnet-20240229': 0.15,
      'gpt-4': 0.18,
      'fallback': 0.05
    }

    confidence += modelMap[backendResponse.model_used as keyof typeof modelMap] || 0.1

    return Math.min(confidence, 1.0)
  }

  async validateQuery(query: string, patientContext?: Record<string, any>): Promise<any> {
    try {
      return await this.backendClient.validateQuery(query, patientContext)
    } catch (error) {
      console.error('Query validation error:', error)
      throw error
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      return await this.backendClient.getSystemStatus()
    } catch (error) {
      console.error('System status error:', error)
      throw error
    }
  }

  async processMedicalDocuments(documents: any[]) {
    try {
      return await this.backendClient.ingestDocuments(documents)
    } catch (error) {
      console.error('Document processing error:', error)
      throw error
    }
  }
}

// =====================================================
// AI SERVICE FACTORY
// =====================================================

export class MedicalAIServiceFactory {
  private static instance: MedicalAIServiceFactory
  private ragPipeline: MedicalRAGPipeline | null = null

  static getInstance(): MedicalAIServiceFactory {
    if (!MedicalAIServiceFactory.instance) {
      MedicalAIServiceFactory.instance = new MedicalAIServiceFactory()
    }
    return MedicalAIServiceFactory.instance
  }

  async initialize(backendURL?: string) {
    this.ragPipeline = new MedicalRAGPipeline(backendURL)
  }

  async processMedicalQuery(query: string, patientContext?: Record<string, any>): Promise<RAGResponse> {
    if (!this.ragPipeline) {
      throw new Error('AI services not initialized')
    }

    return await this.ragPipeline.processQuery(query, patientContext)
  }

  async processMedicalDocuments(documents: any[]) {
    if (!this.ragPipeline) {
      throw new Error('AI services not initialized')
    }

    return await this.ragPipeline.processMedicalDocuments(documents)
  }
}

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface AIMedicalResponse {
  answer: string
  citations: Citation[]
  confidence: number
  entities: MedicalEntity[]
  modelUsed: string
}

export interface DocumentProcessingJob {
  id: string
  documents: any[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  error?: string
  createdAt: Date
  completedAt?: Date
}

export interface ModelPerformanceMetrics {
  modelName: string
  totalQueries: number
  averageResponseTime: number
  averageConfidence: number
  accuracyScore?: number
  lastUpdated: Date
}
