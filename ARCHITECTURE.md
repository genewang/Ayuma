# PathLink - Professional Architecture & Implementation Guide

This document outlines the comprehensive architecture and implementation specifications for the PathLink medical treatment navigation platform.

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Component Architecture Diagram](#2-component-architecture-diagram)
3. [Data Flow Architecture](#3-data-flow-architecture)
4. [User Workflow Sequence](#4-user-workflow-sequence)
5. [MCP Architecture](#5-mcp-architecture)
6. [Database Schema Architecture](#6-database-schema-architecture)
7. [Authentication & Security Flow](#7-authentication--security-flow)
8. [Clinical Trial Matching Engine](#8-clinical-trial-matching-engine)
9. [Deployment & CI/CD Pipeline](#9-deployment--cicd-pipeline)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph Frontend
        A[React + TypeScript App]
        B[React Flow Visualization]
        C[Zustand State Management]
        D[Tailwind CSS Styling]
        AC[MCP Client]
    end

    subgraph MCP Layer
        AH[MCP Host - Port 8001]
        AS[MCP Server - Tools & Resources]
    end

    subgraph Backend Services
        E[Supabase Backend]
        F[PostgreSQL Database]
        G[Authentication Service]
        H[FastAPI REST Server - Port 8000]
        MC[Medical AI Controller]
        MR[RAG System]
        LC[LLM Coordinator]
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
    A --> AC
    AC --> AH
    AH --> AS
    AS --> MC
    MC --> MR
    MC --> LC
    A --> H
    H --> MC
    A --> E
    E --> F
    E --> G
    H --> I
    H --> J
    H --> K
    H --> L
    M --> N
    M --> O
    A --> M

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

    subgraph MCP Client Layer
        AC[MCP Client]
        AD[MCP Tool Executor]
        AE[MCP Resource Reader]
    end

    subgraph MCP Server Layer
        AF[MCP Host - HTTP Transport]
        AG[MCP Server - Tool Registry]
        AH[MCP Server - Resource Registry]
    end

    subgraph AI Services Layer
        AI[Medical AI Controller]
        AJ[RAG System]
        AK[LLM Coordinator]
        AL[Evidence Ranker]
    end

    subgraph API Layer
        U[Supabase Client]
        V[Clinical Trials Service]
        W[Guidelines Service]
        X[Medication Service]
        Y[FastAPI REST Client]
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

    Q --> AC
    R --> AC
    S --> AC
    T --> AC

    AC --> AD
    AC --> AE
    AD --> AF
    AE --> AF

    AF --> AG
    AF --> AH
    AG --> AI
    AH --> AI

    AI --> AJ
    AI --> AK
    AI --> AL

    M --> U
    N --> U
    O --> U
    P --> U

    Q --> Y
    R --> Y
    S --> Y
    T --> Y
    O --> U
    P --> U

    Q --> W
    R --> V
    S --> X

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

    subgraph MCP Client Layer
        I[MCP Client]
        J[Tool Execution]
        K[Resource Reading]
    end

    subgraph MCP Server Layer
        L[MCP Host]
        M[MCP Server]
    end

    subgraph AI Processing
        N[Medical AI Controller]
        O[RAG System]
        P[LLM Coordinator]
        Q[Evidence Ranker]
    end

    subgraph Data Processing
        R[Eligibility Engine]
        S[Guideline Matcher]
        T[Trial Recommender]
        U[Interaction Checker]
    end

    subgraph Data Sources
        V[ASCO Guidelines DB]
        W[ClinicalTrials.gov]
        X[Medication Database]
        Y[Assistance Programs DB]
        Z[Vector Database]
    end

    subgraph Data Storage
        AA[Patient Care Plans]
        AB[User Preferences]
        AC[Saved Trials]
        AD[Medication History]
    end

    A --> B --> E
    C --> D
    E --> I
    I --> J
    I --> K
    J --> L
    K --> L
    L --> M
    M --> N
    N --> O
    N --> P
    N --> Q
    O --> Z

    E --> R
    E --> S
    E --> T
    E --> U

    R --> G
    S --> F
    T --> G
    U --> H

    F --> V
    G --> W
    H --> X
    H --> Y

    E --> AA
    F --> AB
    G --> AC
    H --> AD

```

## 4. User Workflow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Interface
    participant SF as State Store
    participant MC as MCP Client
    participant MH as MCP Host
    participant MS as MCP Server
    participant AI as Medical AI Controller
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
    SF->>MC: Request Treatment Info via MCP
    MC->>MH: Call MCP Tool (process_medical_query)
    MH->>MS: Execute Tool
    MS->>AI: Process Query with RAG
    AI->>AI: Retrieve from Vector DB
    AI->>AI: Generate Response with LLM
    AI-->>MS: Return AI Response
    MS-->>MH: Return Tool Result
    MH-->>MC: Return MCP Response
    MC-->>SF: Update Guidelines Store
    SF-->>UI: Display Treatment Panel

    U->>UI: Open Clinical Trials
    UI->>SF: Trigger Trial Matching
    SF->>MC: Request Trial Matching via MCP
    MC->>MH: Call MCP Tool (process_medical_query)
    MH->>MS: Execute Tool
    MS->>AI: Process Query with RAG
    AI->>EXT: Query ClinicalTrials.gov
    EXT-->>AI: Return Trial Data
    AI->>AI: Run Eligibility Algorithm
    AI-->>MS: Return Filtered Trials
    MS-->>MH: Return Tool Result
    MH-->>MC: Return MCP Response
    MC-->>SF: Update Trials Store
    SF-->>UI: Display Matching Trials

    U->>UI: Add Medications
    UI->>SF: Update Medication List
    SF->>MC: Check Drug Interactions via MCP
    MC->>MH: Call MCP Tool (extract_medical_entities)
    MH->>MS: Execute Tool
    MS->>AI: Extract Entities & Check Interactions
    AI->>EXT: Verify with Drug DB
    EXT-->>AI: Return Interactions
    AI-->>MS: Return Interaction Data
    MS-->>MH: Return Tool Result
    MH-->>MC: Return MCP Response
    MC-->>SF: Update Interaction Alerts
    SF-->>UI: Show Safety Warnings

    U->>UI: Save Care Plan
    UI->>SF: Serialize Flow State
    SF->>BE: Save Complete Plan
    BE->>DB: Store Nodes/Edges/Data
    DB-->>BE: Confirm Save
    BE-->>SF: Update Save Status
    SF-->>UI: Show Success Message
```

## 5. MCP Architecture

The Model Context Protocol (MCP) provides a standardized protocol for tool-based communication between the React frontend and the medical AI backend.

### MCP Components

```mermaid
graph TB
    subgraph Frontend
        FC[React Components]
        MC[MCP Client]
    end

    subgraph MCP Transport
        MH[MCP Host - HTTP]
        MS[MCP Server - stdio]
    end

    subgraph AI Backend
        AC[Medical AI Controller]
        RG[RAG System]
        LC[LLM Coordinator]
        ER[Evidence Ranker]
    end

    subgraph Data Layer
        VDB[Vector Database]
        MDB[Medical Documents]
    end

    FC --> MC
    MC --> MH
    MH --> MS
    MS --> AC
    AC --> RG
    AC --> LC
    AC --> ER
    RG --> VDB
    RG --> MDB
```

### MCP Tools

The MCP server exposes the following tools:

| Tool Name | Description | Input Schema |
|-----------|-------------|--------------|
| `process_medical_query` | Process medical queries with RAG and evidence-based responses | `{query: string, patient_context?: object}` |
| `validate_medical_query` | Validate and analyze medical queries for entities | `{query: string}` |
| `extract_medical_entities` | Extract medical entities from text | `{text: string}` |
| `ingest_medical_documents` | Ingest medical documents into knowledge base | `{documents: array}` |
| `get_system_status` | Get system status and performance metrics | `{}` |

### MCP Resources

The MCP server provides the following resources:

| Resource URI | Name | Description |
|--------------|------|-------------|
| `medical://guidelines/status` | System Status | Current status of the medical AI system |
| `medical://guidelines/capabilities` | AI Capabilities | Available AI capabilities and models |

### MCP Communication Flow

```mermaid
sequenceDiagram
    participant RC as React Component
    participant MC as MCP Client
    participant MH as MCP Host
    participant MS as MCP Server
    participant AI as Medical AI Controller

    RC->>MC: Call convenience method
    MC->>MH: HTTP POST /mcp
    Note over MH: JSON-RPC 2.0 Request
    MH->>MS: Execute tool via stdio
    MS->>AI: Process request
    AI->>AI: RAG retrieval + LLM generation
    AI-->>MS: Return result
    MS-->>MH: Return tool result
    MH-->>MC: JSON-RPC 2.0 Response
    MC-->>RC: Parsed result
```

### MCP vs REST API

The system supports both MCP and REST API communication:

| Aspect | MCP | REST API |
|--------|-----|----------|
| Protocol | JSON-RPC 2.0 | HTTP/REST |
| Transport | stdio + HTTP bridge | HTTP |
| Discovery | Built-in tool/resource listing | Manual API documentation |
| Type Safety | JSON schemas for inputs/outputs | OpenAPI/Swagger |
| Use Case | AI tool interactions | General API operations |
| Port | 8001 | 8000 |

### MCP Configuration

The MCP system is configured via `mcp-config.json`:

```json
{
  "mcpServers": {
    "medical-guidedpath-ai": {
      "command": "python",
      "args": ["-m", "backend.mcp_server"],
      "cwd": "/Users/jingwenwang/CascadeProjects/Ayuma"
    }
  }
}
```

For detailed MCP implementation information, see `MCP_ARCHITECTURE.md`.

## 7. Database Schema Architecture

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

## 8. Authentication & Security Flow

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

```

## 9. Clinical Trial Matching Engine

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

```

## 10. Deployment & CI/CD Pipeline

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
