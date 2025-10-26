# GuidePath AI - Professional Architecture & Implementation Guide

This document outlines the comprehensive architecture and implementation specifications for the GuidePath AI medical treatment navigation platform, based on the production system at https://www.guidedpath.app/.

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Component Architecture Diagram](#2-component-architecture-diagram)
3. [Data Flow Architecture](#3-data-flow-architecture)
4. [User Workflow Sequence](#4-user-workflow-sequence)
5. [Database Schema Architecture](#5-database-schema-architecture)
6. [Authentication & Security Flow](#6-authentication--security-flow)
7. [Clinical Trial Matching Engine](#7-clinical-trial-matching-engine)
8. [Deployment & CI/CD Pipeline](#8-deployment--cicd-pipeline)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph Frontend
        A[React + TypeScript App]
        B[React Flow Visualization]
        C[Zustand State Management]
        D[Tailwind CSS Styling]
    end

    subgraph Backend Services
        E[Supabase Backend]
        F[PostgreSQL Database]
        G[Authentication Service]
        H[Serverless Functions]
    end

    subgraph External APIs
        I[ClinicalTrials.gov API]
        J[ASCO/EULAR Guidelines API]
        K[Pharmacy Integration API]
        L[Insurance Providers API]
    end

    subgraph Hosting & Infrastructure
        M[Vercel Platform]
        N[CDN & Edge Network]
        O[Serverless Runtime]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    E --> F
    E --> G
    E --> H
    H --> I
    H --> J
    H --> K
    H --> L
    M --> N
    M --> O
    A --> M

    style A fill:#61dafb
    style E fill:#3ecf8e
    style M fill:#000000
    style I fill:#ff6b6b
```

## 2. Component Architecture Diagram

```mermaid
graph TB
    subgraph UI Components Layer
        A[MedicalFlow Component]
        B[TreatmentNode Component]
        C[TrialNode Component]
        D[AssistanceNode Component]
        E[MedicationNode Component]

        F[TreatmentPanel Component]
        G[TrialPanel Component]
        H[AssistancePanel Component]
        I[MedicationPanel Component]

        J[EligibilityWizard Component]
        K[SideEffectTracker Component]
        L[InteractionAlerts Component]
    end

    subgraph State Management Layer
        M[useMedicalFlowStore]
        N[useTrialStore]
        O[useMedicationStore]
        P[useUserStore]
    end

    subgraph Data Hooks Layer
        Q[useMedicalData]
        R[useTrialEligibility]
        S[useMedicationAlerts]
        T[useAssistancePrograms]
    end

    subgraph API Layer
        U[Supabase Client]
        V[Clinical Trials Service]
        W[Guidelines Service]
        X[Medication Service]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> H
    A --> I

    B --> M
    C --> M
    D --> M
    E --> M

    F --> Q
    G --> R
    H --> T
    I --> S

    M --> U
    N --> U
    O --> U
    P --> U

    Q --> W
    R --> V
    S --> X

    style A fill:#4dc0b5
    style M fill:#fed7d7
    style Q fill:#c3dafe
    style U fill:#b2f5ea
```

## 3. Data Flow Architecture

```mermaid
flowchart TB
    subgraph User Interface
        A[Patient Onboarding]
        B[Diagnosis Input]
        C[Treatment Flow Visualization]
        D[Interactive Panels]
    end

    subgraph State Management
        E[Patient Profile Store]
        F[Treatment Guidelines Store]
        G[Clinical Trials Store]
        H[Medication Store]
    end

    subgraph Data Processing
        I[Eligibility Engine]
        J[Guideline Matcher]
        K[Trial Recommender]
        L[Interaction Checker]
    end

    subgraph Data Sources
        M[ASCO Guidelines DB]
        N[ClinicalTrials.gov]
        O[Medication Database]
        P[Assistance Programs DB]
    end

    subgraph Data Storage
        Q[Patient Care Plans]
        R[User Preferences]
        S[Saved Trials]
        T[Medication History]
    end

    A --> B --> E
    C --> D
    E --> I
    E --> J
    E --> K
    E --> L

    I --> G
    J --> F
    K --> G
    L --> H

    F --> M
    G --> N
    H --> O
    H --> P

    E --> Q
    F --> R
    G --> S
    H --> T

    style A fill:#e9d8fd
    style E fill:#fed7d7
    style I fill:#c3dafe
    style M fill:#b2f5ea
    style Q fill:#fefcbf
```

## 4. User Workflow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Interface
    participant SF as State Store
    participant BE as Backend API
    participant DB as Database
    participant EXT as External APIs

    U->>UI: Load Application
    UI->>SF: Initialize State
    SF->>BE: Fetch User Data
    BE->>DB: Query Care Plans
    DB-->>BE: Return Patient Profile
    BE-->>SF: Initialize Patient Data
    SF-->>UI: Render Treatment Flow

    U->>UI: Select Diagnosis & Stage
    UI->>SF: Update Patient Profile
    SF->>BE: Save Patient Profile
    BE->>DB: Store/Update Profile

    U->>UI: Click Treatment Node
    UI->>SF: Set Selected Guideline
    SF->>BE: Fetch Guideline Details
    BE->>EXT: Request ASCO/EULAR Data
    EXT-->>BE: Return Guidelines
    BE-->>SF: Update Guidelines Store
    SF-->>UI: Display Treatment Panel

    U->>UI: Open Clinical Trials
    UI->>SF: Trigger Trial Matching
    SF->>BE: Request Trial Recommendations
    BE->>EXT: Query ClinicalTrials.gov
    EXT-->>BE: Return Trial Data
    BE->>BE: Run Eligibility Algorithm
    BE-->>SF: Return Filtered Trials
    SF-->>UI: Display Matching Trials

    U->>UI: Add Medications
    UI->>SF: Update Medication List
    SF->>BE: Check Drug Interactions
    BE->>EXT: Verify with Drug DB
    EXT-->>BE: Return Interactions
    BE-->>SF: Update Interaction Alerts
    SF-->>UI: Show Safety Warnings

    U->>UI: Save Care Plan
    UI->>SF: Serialize Flow State
    SF->>BE: Save Complete Plan
    BE->>DB: Store Nodes/Edges/Data
    DB-->>BE: Confirm Save
    BE-->>SF: Update Save Status
    SF-->>UI: Show Success Message
```

## 5. Database Schema Architecture

```mermaid
erDiagram
    PATIENT_PROFILE ||--o{ CARE_PLAN : has
    PATIENT_PROFILE {
        uuid id PK
        string diagnosis
        string stage
        json biomarkers
        json previous_treatments
        string location
        string insurance
        timestamp created_at
    }

    CARE_PLAN ||--o{ FLOW_NODE : contains
    CARE_PLAN ||--o{ FLOW_EDGE : contains
    CARE_PLAN {
        uuid id PK
        uuid patient_profile_id FK
        string title
        json flow_data
        timestamp created_at
        timestamp updated_at
    }

    FLOW_NODE {
        uuid id PK
        uuid care_plan_id FK
        string type
        json position
        json data
        string label
    }

    FLOW_EDGE {
        uuid id PK
        uuid care_plan_id FK
        string source
        string target
        string type
    }

    TREATMENT_GUIDELINE ||--o{ GUIDELINE_RECOMMENDATION : contains
    TREATMENT_GUIDELINE {
        uuid id PK
        string condition
        string stage
        string institution
        string evidence_level
        timestamp last_updated
    }

    GUIDELINE_RECOMMENDATION {
        uuid id PK
        uuid guideline_id FK
        string treatment
        string strength
        json evidence
    }

    CLINICAL_TRIAL ||--o{ TRIAL_LOCATION : has
    CLINICAL_TRIAL ||--o{ ELIGIBILITY_CRITERIA : has
    CLINICAL_TRIAL {
        uuid id PK
        string nct_id
        string title
        string[] conditions
        string phase
        string status
    }

    ELIGIBILITY_CRITERIA {
        uuid id PK
        uuid trial_id FK
        json inclusion_criteria
        json exclusion_criteria
        json biomarkers
    }

    MEDICATION ||--o{ DRUG_INTERACTION : has
    MEDICATION {
        uuid id PK
        string name
        string dosage
        json schedule
        json side_effects
    }

    DRUG_INTERACTION {
        uuid id PK
        uuid medication_a FK
        uuid medication_b FK
        string severity
        string description
    }
```

## 6. Authentication & Security Flow

```mermaid
flowchart TB
    subgraph Authentication Flow
        A[User Visits App] --> B{Logged In?}
        B -->|No| C[Show Login Modal]
        B -->|Yes| D[Load Patient Data]

        C --> E[Enter Credentials]
        E --> F[Supabase Auth]
        F --> G{Valid?}
        G -->|Yes| H[Create Session]
        G -->|No| I[Show Error]
        H --> D
    end

    subgraph Data Security
        J[API Request] --> K[Auth Middleware]
        K --> L{Valid Token?}
        L -->|Yes| M[Check Permissions]
        L -->|No| N[Return 401]

        M --> O{User Owns Data?}
        O -->|Yes| P[Execute Query]
        O -->|No| Q[Return 403]

        P --> R[Row Level Security]
        R --> S[Return Data]
    end

    subgraph HIPAA Compliance
        T[Data Encryption] --> U[At Rest AES-256]
        T --> V[In Transit TLS 1.3]

        W[Audit Logging] --> X[Access Logs]
        W --> Y[Data Changes]
        W --> Z[User Actions]
    end

    style A fill:#e9d8fd
    style F fill:#fed7d7
    style R fill:#c3dafe
    style T fill:#b2f5ea
```

## 7. Clinical Trial Matching Engine

```mermaid
flowchart LR
    subgraph Input
        A[Patient Profile]
        B[Diagnosis & Stage]
        C[Biomarkers]
        D[Treatment History]
        E[Location]
    end

    subgraph Matching Engine
        F[Condition Matcher]
        G[Stage Filter]
        H[Biomarker Analyzer]
        I[Treatment History Check]
        J[Location Proximity]
        K[Score Aggregator]
    end

    subgraph Output
        L[Highly Relevant >90%]
        M[Moderately Relevant 70-90%]
        N[Potentially Relevant 50-70%]
    end

    A --> F
    B --> G
    C --> H
    D --> I
    E --> J

    F --> K
    G --> K
    H --> K
    I --> K
    J --> K

    K --> L
    K --> M
    K --> N

    style A fill:#e9d8fd
    style F fill:#fed7d7
    style K fill:#c3dafe
    style L fill:#b2f5ea
```

## 8. Deployment & CI/CD Pipeline

```mermaid
flowchart TB
    subgraph Development
        A[Feature Development]
        B[Local Testing]
        C[Pull Request]
    end

    subgraph Continuous Integration
        D[Automated Tests]
        E[TypeScript Check]
        F[Build Verification]
        G[Security Scan]
    end

    subgraph Deployment
        H[Vercel Preview]
        I[Staging Environment]
        J[Production Deployment]
        K[Edge Network]
    end

    subgraph Monitoring
        L[Performance Monitoring]
        M[Error Tracking]
        N[Usage Analytics]
        O[Health Checks]
    end

    A --> B --> C
    C --> D --> E --> F --> G
    G --> H --> I --> J --> K
    J --> L --> M --> N --> O

    style A fill:#e9d8fd
    style D fill:#fed7d7
    style H fill:#c3dafe
    style L fill:#b2f5ea
```

## 9. AI/ML Architecture & RAG System

This section outlines the comprehensive AI/ML implementation including RAG (Retrieval-Augmented Generation), LLM model integration, and vector database systems.

### **RAG (Retrieval-Augmented Generation) Architecture**

```mermaid
graph TB
    subgraph Data Ingestion Pipeline
        A[Medical Guidelines PDFs]
        B[Clinical Trial Documents]
        C[Drug Databases]
        D[Treatment Protocols]

        E[Document Chunking]
        F[Text Extraction]
        G[Metadata Enrichment]
        H[Vector Embedding]
    end

    subgraph Vector Knowledge Base
        I[Pinecone/Weaviate Vector DB]
        J[Chunk Storage]
        K[Metadata Index]
        L[Embedding Cache]
    end

    subgraph Query Processing
        M[User Query]
        N[Query Understanding]
        O[Semantic Search]
        P[Context Retrieval]
    end

    subgraph LLM Integration
        Q[OpenAI GPT-4]
        R[ClinicalBERT/Specialized Models]
        S[Response Generation]
        T[Citation & Sources]
    end

    A --> E
    B --> E
    C --> E
    D --> E
    E --> F --> G --> H
    H --> I

    M --> N --> O
    O --> I
    I --> P --> S
    S --> T

    Q --> S
    R --> S

    style I fill:#ff6b6b
    style Q fill:#4ecdc4
    style R fill:#45b7d1
```

### **LLM Models Implementation**

#### **1. Primary Foundation Models**
- **GPT-4 (OpenAI)** - Primary reasoning and generation for complex medical queries
- **GPT-3.5-Turbo** - Fast responses for simpler queries and conversational interfaces
- **Claude-2/3 (Anthropic)** - Alternative model for complex medical reasoning and safety

#### **2. Specialized Medical LLMs**
- **ClinicalBERT** - Medical text understanding and entity recognition
- **BioBERT** - Biomedical literature processing and research comprehension
- **PubMedBERT** - Medical research papers and clinical study analysis
- **Custom fine-tuned models** - Domain-specific models trained on medical guidelines

#### **3. Embedding Models**
- **text-embedding-ada-002** - General text embeddings for semantic search
- **sentence-transformers/all-mpnet-base-v2** - Dense retrieval for medical documents
- **Specialized medical embeddings** - Custom embeddings for clinical text processing

#### **4. Supporting Models**
- **Intent Classification Model** - Query type and complexity assessment
- **Query Understanding Model** - Medical entity extraction and context analysis
- **Response Quality Scoring** - Medical accuracy and completeness evaluation

### **Multi-Model Routing System**

```mermaid
flowchart TD
    subgraph Input
        A[User Query] --> B[Query Analysis]
        B --> C{Medical Specificity?}
        C -->|High| D[Medical Domain Models]
        C -->|Low| E[General Models]
    end

    subgraph Medical Domain Models
        D --> F{Query Complexity?}
        F -->|High| G[GPT-4 + ClinicalBERT]
        F -->|Medium| H[ClinicalBERT + GPT-3.5]
        F -->|Low| I[ClinicalBERT Only]
    end

    subgraph General Models
        E --> J{Query Complexity?}
        J -->|High| K[GPT-4]
        J -->|Medium| L[GPT-3.5-Turbo]
        J -->|Low| M[GPT-3.5-Turbo]
    end

    G --> N[Response Generation]
    H --> N
    I --> N
    K --> N
    L --> N
    M --> N
    N --> O[Medical Validation]
    O --> P[Final Response]

    style F fill:#fed7d7
    style J fill:#c3dafe
    style N fill:#b2f5ea
```

### **Document Processing Pipeline**

```python
# Medical Document Processing Implementation
class MedicalRAGPipeline:
    def process_medical_documents(self, documents: List[MedicalDocument]):
        """Process medical documents for RAG system"""

        # Medical-aware text splitting
        chunks = self.medical_text_splitter(
            documents,
            chunk_size=1000,
            chunk_overlap=200,
            separators=["## Treatment", "## Recommendation", "\n\n", "."]
        )

        # Enrich with medical metadata
        enriched_chunks = self.add_medical_metadata(chunks, {
            'evidence_level': ['High', 'Moderate', 'Low'],
            'institution': ['ASCO', 'EULAR', 'NCCN', 'ESMO'],
            'document_type': ['guideline', 'trial', 'medication', 'protocol'],
            'last_updated': 'timestamp'
        })

        # Generate embeddings with medical context
        embeddings = self.medical_embedding_model.encode(
            enriched_chunks,
            medical_domain=True,
            normalize_embeddings=True
        )

        # Store in vector database
        self.vector_store.upsert(
            vectors=embeddings,
            metadata=enriched_chunks,
            ids=[f"med_{i}" for i in range(len(chunks))]
        )

    def medical_retrieval(self, query: str, filters: dict = None):
        """Medical document retrieval with clinical relevance"""

        # Extract medical entities from query
        medical_entities = self.extract_medical_entities(query)

        # Hybrid search: semantic + metadata filtering
        results = self.vector_store.hybrid_search(
            query_embedding=self.embedding_model.encode(query),
            filter_conditions={
                'diagnosis': medical_entities.get('diagnosis'),
                'stage': medical_entities.get('stage'),
                'treatment_type': medical_entities.get('treatment_type'),
                'institution': ['ASCO', 'EULAR', 'NCCN', 'ESMO']
            },
            top_k=5,
            rerank_by_evidence=True
        )

        return self.rank_by_medical_relevance(results)
```

### **Query Processing & Medical Entity Recognition**

```mermaid
sequenceDiagram
    participant U as User
    participant QP as Query Processor
    participant MER as Medical Entity Recognition
    participant VS as Vector Store
    participant LLM as Language Model
    participant RG as Response Generator

    U->>QP: "What treatments for metastatic breast cancer?"
    QP->>MER: Extract medical entities
    MER->>MER: Identify: diagnosis="breast cancer", stage="metastatic"
    QP->>VS: Search with filters
    VS->>VS: Retrieve relevant guidelines/chunks
    VS->>QP: Return context with metadata
    QP->>LLM: Generate response with evidence
    LLM->>RG: Format with citations
    RG->>U: Return comprehensive answer
```

### **Evidence-Based Medical Retrieval**

```python
class EvidenceBasedRetrieval:
    def __init__(self):
        self.evidence_weights = {
            'ASCO': 1.0,
            'NCCN': 0.95,
            'EULAR': 0.90,
            'ESMO': 0.85
        }

        self.evidence_levels = {
            'Level A': 1.0,
            'Level B': 0.8,
            'Level C': 0.6
        }

    def rank_by_medical_authority(self, documents: List[Document]):
        """Rank documents by medical authority and evidence level"""

        ranked_docs = []
        for doc in documents:
            authority_score = self.evidence_weights.get(
                doc.metadata.get('institution', ''), 0.5
            )

            evidence_score = self.evidence_levels.get(
                doc.metadata.get('evidence_level', ''), 0.5
            )

            recency_score = self.calculate_recency_score(
                doc.metadata.get('last_updated')
            )

            # Weighted combination
            final_score = (
                authority_score * 0.4 +
                evidence_score * 0.4 +
                recency_score * 0.2
            )

            ranked_docs.append({
                'document': doc,
                'authority_score': authority_score,
                'evidence_score': evidence_score,
                'recency_score': recency_score,
                'final_score': final_score
            })

        return sorted(ranked_docs, key=lambda x: x['final_score'], reverse=True)

    def calculate_recency_score(self, last_updated: str):
        """Calculate recency score (medical knowledge changes rapidly)"""
        if not last_updated:
            return 0.5

        age_months = (datetime.now() - datetime.fromisoformat(last_updated)).days / 30

        # Prefer documents updated within 24 months
        if age_months <= 24:
            return 1.0 - (age_months / 24) * 0.2  # Gradual decay
        else:
            return max(0.3, 1.0 - (age_months / 12) * 0.1)  # Slower decay for older docs
```

### **LLM Integration Points**

#### **1. Treatment Guidelines Enhancement**
- **Query Type**: "What are the first-line treatments for Stage III lung cancer?"
- **Models Used**: GPT-4 + ClinicalBERT
- **Process**: Retrieve NCCN/ASCO guidelines → Generate comprehensive treatment plan
- **Output**: Evidence-based recommendations with citations

#### **2. Clinical Trial Matching Intelligence**
- **Query Type**: "Find trials for my breast cancer profile"
- **Models Used**: ClinicalBERT + Custom matching model
- **Process**: Extract patient profile → Semantic search trials → Score eligibility
- **Output**: Ranked trials with eligibility explanations

#### **3. Medication Safety Analysis**
- **Query Type**: "Check interactions for my medications"
- **Models Used**: BioBERT + Drug interaction model
- **Process**: Analyze drug combinations → Cross-reference databases → Risk assessment
- **Output**: Interaction warnings with management recommendations

#### **4. Patient Assistance Intelligence**
- **Query Type**: "What financial assistance is available?"
- **Models Used**: GPT-3.5-Turbo + Entity recognition
- **Process**: Match patient profile → Search assistance programs → Generate applications
- **Output**: Personalized assistance recommendations

### **Performance Optimization Architecture**

```mermaid
graph LR
    subgraph Query Optimization
        A[Query Caching] --> B[Cache Hit Check]
        B --> C{Cache Hit?}
        C -->|Yes| D[Return Cached Response]
        C -->|No| E[LLM Processing]
    end

    subgraph Response Optimization
        E --> F[Response Generation]
        F --> G[Quality Scoring]
        G --> H{Score > Threshold?}
        H -->|Yes| I[Cache Response]
        H -->|No| J[Regenerate]
        I --> K[User Response]
        J --> F
    end

    subgraph Background Processing
        L[Document Updates] --> M[Vector DB Sync]
        M --> N[Cache Invalidation]
        N --> B
    end

    style A fill:#a8e6cf
    style G fill:#ffd93d
    style M fill:#ff6b6b
```

### **AI Integration with Existing Features**

```mermaid
flowchart TD
    subgraph AI-Enhanced Components
        A[MedicalFlow Component] --> B[AI-Powered Node Generation]
        C[TreatmentPanel] --> D[AI Guideline Summarization]
        E[TrialPanel] --> F[AI Trial Matching]
        G[MedicationPanel] --> H[AI Interaction Analysis]
        I[AssistancePanel] --> J[AI Program Matching]
    end

    subgraph AI Services
        B --> K[RAG Query Engine]
        D --> K
        F --> K
        H --> K
        J --> K
        K --> L[Vector Database]
        K --> M[LLM Models]
    end

    L --> N[Medical Documents]
    M --> O[Model Responses]

    style K fill:#4ecdc4
    style L fill:#ff6b6b
    style M fill:#45b7d1
```

### **Implementation Architecture**

```python
# Core AI Services Architecture
class MedicalAIServices:
    def __init__(self):
        self.vector_store = self.initialize_vector_store()
        self.llm_models = self.initialize_llm_models()
        self.rag_pipeline = self.initialize_rag_pipeline()

    async def process_medical_query(self, query: str, context: dict):
        """Main entry point for medical AI queries"""

        # 1. Query understanding and entity extraction
        medical_context = await self.extract_medical_context(query)

        # 2. Retrieve relevant medical knowledge
        relevant_docs = await self.rag_pipeline.retrieve(
            query=query,
            filters=medical_context,
            top_k=5
        )

        # 3. Route to appropriate LLM model
        selected_model = self.model_router.route_query(query, relevant_docs)

        # 4. Generate AI response with medical validation
        response = await selected_model.generate_response(
            query=query,
            context=relevant_docs,
            medical_constraints=True
        )

        # 5. Add citations and evidence tracking
        cited_response = self.add_medical_citations(response, relevant_docs)

        return cited_response

    def add_medical_citations(self, response: str, source_docs: List[Document]):
        """Add medical evidence citations to AI responses"""
        citations = []

        for doc in source_docs:
            citation = {
                'source': doc.metadata.get('source_url', ''),
                'institution': doc.metadata.get('institution', ''),
                'evidence_level': doc.metadata.get('evidence_level', ''),
                'last_updated': doc.metadata.get('last_updated', '')
            }
            citations.append(citation)

        return {
            'response': response,
            'citations': citations,
            'evidence_score': self.calculate_evidence_score(citations)
        }
```

### **Model Performance Metrics**

```python
class AIModelMetrics:
    def track_performance(self):
        return {
            'response_time': self.measure_response_time(),
            'accuracy_score': self.evaluate_medical_accuracy(),
            'relevance_score': self.evaluate_clinical_relevance(),
            'citation_quality': self.evaluate_citation_completeness()
        }

    def evaluate_medical_accuracy(self, response: str, ground_truth: str):
        """Medical accuracy evaluation using clinical experts or validation datasets"""
        # Implementation would use medical validation frameworks
        pass

    def evaluate_clinical_relevance(self, response: str, patient_context: dict):
        """Clinical relevance scoring based on patient profile matching"""
        relevance_factors = {
            'diagnosis_match': self.check_diagnosis_relevance(response, patient_context),
            'stage_appropriateness': self.check_stage_relevance(response, patient_context),
            'treatment_feasibility': self.check_treatment_feasibility(response, patient_context)
        }

        return sum(relevance_factors.values()) / len(relevance_factors)
```

### **Security & Compliance for AI**

```mermaid
flowchart TD
    subgraph AI Security
        A[Query Sanitization] --> B[Medical Data Filtering]
        B --> C[Response Validation]
        C --> D[Audit Logging]

        E[Model Access Control] --> F[Rate Limiting]
        F --> G[Response Filtering]

        H[Medical Compliance] --> I[HIPAA Compliance]
        I --> J[Citation Requirements]
    end

    subgraph AI Monitoring
        D --> K[Performance Metrics]
        G --> L[Usage Analytics]
        J --> M[Clinical Validation]
    end

    style A fill:#ffebee
    style H fill:#e8f5e8
    style M fill:#fff3e0
```

This comprehensive AI/ML architecture provides the foundation for intelligent medical guidance, evidence-based recommendations, and personalized healthcare navigation while maintaining the highest standards of medical accuracy and patient safety.

---

## Technical Specifications

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Visualization**: React Flow for medical pathway mapping
- **Styling**: Tailwind CSS with custom medical UI components
- **State Management**: Zustand for medical data management
- **Authentication**: Supabase Auth integration

### Backend Stack
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with RLS
- **Real-time**: Supabase real-time subscriptions
- **APIs**: RESTful APIs with external integrations

### External Integrations
- **Clinical Trials**: ClinicalTrials.gov API integration
- **Medical Guidelines**: ASCO, EULAR, NCCN, ESMO data sources
- **Pharmacy Data**: Drug interaction and medication databases
- **Insurance**: Provider integration for assistance programs

### Security & Compliance
- **Authentication**: Secure user authentication with Supabase
- **Authorization**: Row Level Security (RLS) implementation
- **Data Protection**: HIPAA-compliant data handling
- **Audit Trail**: Comprehensive logging and monitoring

This architecture ensures a scalable, secure, and maintainable platform for medical treatment navigation while providing an intuitive user experience for patients and healthcare providers.
