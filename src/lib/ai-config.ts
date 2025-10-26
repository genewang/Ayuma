// AI Services Configuration
// Provides centralized configuration for all AI/ML services

export interface AIConfig {
  // OpenAI Configuration
  openai: {
    apiKey: string
    model: string
    embeddingModel: string
    maxTokens: number
    temperature: number
  }

  // Pinecone Configuration
  pinecone: {
    apiKey: string
    indexName: string
    environment?: string
    projectId?: string
  }

  // Service Settings
  services: {
    enableRAG: boolean
    maxRetries: number
    requestTimeout: number
    cacheTTL: number
    debugMode: boolean
    mockResponses: boolean
  }

  // Medical Settings
  medical: {
    institutions: string[]
    evidenceLevels: string[]
    maxSearchResults: number
    confidenceThreshold: number
  }
}

// Default configuration values
const DEFAULT_CONFIG: AIConfig = {
  openai: {
    apiKey: '',
    model: 'gpt-4',
    embeddingModel: 'text-embedding-ada-002',
    maxTokens: 4096,
    temperature: 0.1
  },
  pinecone: {
    apiKey: '',
    indexName: 'medical-knowledge'
  },
  services: {
    enableRAG: true,
    maxRetries: 3,
    requestTimeout: 30000,
    cacheTTL: 3600000, // 1 hour
    debugMode: false,
    mockResponses: false
  },
  medical: {
    institutions: ['ASCO', 'NCCN', 'EULAR', 'ESMO'],
    evidenceLevels: ['High', 'Moderate', 'Low'],
    maxSearchResults: 10,
    confidenceThreshold: 0.7
  }
}

// Load configuration from environment variables
export function loadAIConfig(): AIConfig {
  return {
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || DEFAULT_CONFIG.openai.apiKey,
      model: import.meta.env.VITE_OPENAI_MODEL || DEFAULT_CONFIG.openai.model,
      embeddingModel: import.meta.env.VITE_OPENAI_EMBEDDING_MODEL || DEFAULT_CONFIG.openai.embeddingModel,
      maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || DEFAULT_CONFIG.openai.maxTokens.toString()),
      temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || DEFAULT_CONFIG.openai.temperature.toString())
    },
    pinecone: {
      apiKey: import.meta.env.VITE_PINECONE_API_KEY || DEFAULT_CONFIG.pinecone.apiKey,
      indexName: import.meta.env.VITE_PINECONE_INDEX_NAME || DEFAULT_CONFIG.pinecone.indexName,
      environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
      projectId: import.meta.env.VITE_PINECONE_PROJECT_ID
    },
    services: {
      enableRAG: import.meta.env.VITE_AI_ENABLE_RAG === 'true' || DEFAULT_CONFIG.services.enableRAG,
      maxRetries: parseInt(import.meta.env.VITE_AI_MAX_RETRIES || DEFAULT_CONFIG.services.maxRetries.toString()),
      requestTimeout: parseInt(import.meta.env.VITE_AI_REQUEST_TIMEOUT || DEFAULT_CONFIG.services.requestTimeout.toString()),
      cacheTTL: parseInt(import.meta.env.VITE_AI_CACHE_TTL || DEFAULT_CONFIG.services.cacheTTL.toString()),
      debugMode: import.meta.env.VITE_AI_DEBUG_MODE === 'true' || DEFAULT_CONFIG.services.debugMode,
      mockResponses: import.meta.env.VITE_AI_MOCK_RESPONSES === 'true' || DEFAULT_CONFIG.services.mockResponses
    },
    medical: {
      institutions: (import.meta.env.VITE_AI_MEDICAL_INSTITUTIONS || DEFAULT_CONFIG.medical.institutions.join(',')).split(','),
      evidenceLevels: (import.meta.env.VITE_AI_EVIDENCE_LEVELS || DEFAULT_CONFIG.medical.evidenceLevels.join(',')).split(','),
      maxSearchResults: parseInt(import.meta.env.VITE_AI_MAX_SEARCH_RESULTS || DEFAULT_CONFIG.medical.maxSearchResults.toString()),
      confidenceThreshold: parseFloat(import.meta.env.VITE_AI_CONFIDENCE_THRESHOLD || DEFAULT_CONFIG.medical.confidenceThreshold.toString())
    }
  }
}

// Validate configuration
export function validateAIConfig(config: AIConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check OpenAI configuration
  if (!config.openai.apiKey) {
    errors.push('OpenAI API key is required')
  }

  if (!config.openai.model) {
    errors.push('OpenAI model is required')
  }

  // Check Pinecone configuration
  if (!config.pinecone.apiKey) {
    errors.push('Pinecone API key is required')
  }

  if (!config.pinecone.indexName) {
    errors.push('Pinecone index name is required')
  }

  // Check service settings
  if (config.services.maxRetries < 0) {
    errors.push('Max retries must be non-negative')
  }

  if (config.services.requestTimeout < 1000) {
    errors.push('Request timeout must be at least 1000ms')
  }

  // Check medical settings
  if (config.medical.confidenceThreshold < 0 || config.medical.confidenceThreshold > 1) {
    errors.push('Confidence threshold must be between 0 and 1')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Get configuration with validation
export function getAIConfig(): AIConfig {
  const config = loadAIConfig()
  const validation = validateAIConfig(config)

  if (!validation.isValid) {
    console.error('AI Configuration validation failed:', validation.errors)

    // In development, allow operation without API keys for testing
    if (import.meta.env.DEV) {
      console.warn('Running in development mode with incomplete AI configuration')
    } else {
      throw new Error(`AI Configuration validation failed: ${validation.errors.join(', ')}`)
    }
  }

  return config
}

// Configuration singleton
let aiConfigInstance: AIConfig | null = null

export function getAIConfigInstance(): AIConfig {
  if (!aiConfigInstance) {
    aiConfigInstance = getAIConfig()
  }
  return aiConfigInstance
}

// Reset configuration (useful for testing)
export function resetAIConfig() {
  aiConfigInstance = null
}
