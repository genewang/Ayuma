# config.py
import os
from typing import Dict, List, Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str = ""
    openai_model: str = "gpt-4-1106-preview"
    openai_embedding_model: str = "text-embedding-ada-002"

    # Anthropic Configuration
    anthropic_api_key: str = ""

    # Vector Database Configuration
    vector_db_path: str = "./medical_chroma_db"
    collection_name: str = "medical_guidelines"

    # Medical Settings
    medical_institutions: List[str] = ["ASCO", "NCCN", "ESMO", "EULAR", "FDA", "NIH"]
    evidence_levels: List[str] = ["meta_analysis", "systematic_review", "rct", "cohort_study", "case_control", "expert_opinion"]
    confidence_threshold: float = 0.7

    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = False
    cors_origins: List[str] = ["*"]

    # Performance Settings
    max_concurrent_queries: int = 10
    max_conversation_history: int = 1000
    query_timeout: int = 60  # seconds

    # Logging
    log_level: str = "INFO"
    log_file: str = "medical_ai.log"

    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Model configurations for easy access
MODEL_CONFIGS = {
    "gpt4_medical": {
        "model": "gpt-4-1106-preview",
        "temperature": 0.1,
        "max_tokens": 4000
    },
    "gpt4_turbo": {
        "model": "gpt-4-1106-preview",
        "temperature": 0.2,
        "max_tokens": 2000
    },
    "claude3": {
        "model": "claude-3-sonnet-20240229",
        "temperature": 0.1,
        "max_tokens": 4000
    }
}

# Evidence hierarchy for ranking
EVIDENCE_HIERARCHY = {
    "meta_analysis": 1.0,
    "systematic_review": 0.95,
    "rct": 0.9,
    "randomized_controlled_trial": 0.9,
    "cohort_study": 0.7,
    "prospective_cohort": 0.75,
    "retrospective_cohort": 0.65,
    "case_control": 0.6,
    "case_series": 0.5,
    "expert_opinion": 0.4,
    "guidelines": 0.85,
    "consensus_statement": 0.8,
    "animal_study": 0.2,
    "in_vitro": 0.1,
    "preclinical": 0.15
}

# Institution weights for ranking
INSTITUTION_WEIGHTS = {
    "ASCO": 1.0,
    "NCCN": 0.95,
    "ESMO": 0.9,
    "EULAR": 0.9,
    "FDA": 0.85,
    "NIH": 0.8,
    "EMA": 0.8,
    "WHO": 0.75,
    "CDC": 0.7,
    "AHRQ": 0.75,
    "COCHRANE": 0.95,
    "UPTODATE": 0.6,
    "PUBMED": 0.5,
    "CLINICALTRIALS": 0.8
}
