# llm_coordinator.py
from enum import Enum
from typing import Dict, List, Optional, Any
import asyncio
from pydantic import BaseModel
import logging
import json

class ModelType(Enum):
    GPT4_MEDICAL = "gpt-4-1106-preview"  # Latest GPT-4 for complex reasoning
    GPT4_TURBO = "gpt-4-1106-preview"    # Fast GPT-4
    CLAUDE3 = "claude-3-sonnet-20240229"
    CLINICAL_BERT = "emilyalsentzer/Bio_ClinicalBERT"
    BIOBERT = "dmis-lab/biobert-v1.1"
    PUBMEDBERT = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract"
    EMBEDDING_MEDICAL = "text-embedding-ada-002"
    EMBEDDING_GENERAL = "text-embedding-ada-002"

class QueryComplexity(BaseModel):
    score: float  # 0-1 scale
    medical_specificity: float  # 0-1 scale
    entities: List[str]
    requires_reasoning: bool
    context_length_needed: int

class LLMCoordinator:
    def __init__(self):
        self.models = self._initialize_models()
        self.logger = logging.getLogger(__name__)

    def _initialize_models(self) -> Dict[ModelType, Any]:
        """Initialize all LLM models with proper configuration"""
        return {
            ModelType.GPT4_MEDICAL: {
                "client": "openai",
                "model": "gpt-4-1106-preview",
                "max_tokens": 4000,
                "temperature": 0.1,
                "cost_per_token": 0.03  # $ per 1K tokens
            },
            ModelType.GPT4_TURBO: {
                "client": "openai",
                "model": "gpt-4-1106-preview",
                "max_tokens": 2000,
                "temperature": 0.2,
                "cost_per_token": 0.03
            },
            ModelType.CLAUDE3: {
                "client": "anthropic",
                "model": "claude-3-sonnet-20240229",
                "max_tokens": 4000,
                "temperature": 0.1,
                "cost_per_token": 0.015
            },
            ModelType.CLINICAL_BERT: {
                "client": "huggingface",
                "model": "emilyalsentzer/Bio_ClinicalBERT",
                "pipeline": "text-generation",
                "max_length": 512
            },
            ModelType.BIOBERT: {
                "client": "huggingface",
                "model": "dmis-lab/biobert-v1.1",
                "pipeline": "feature-extraction"
            },
            ModelType.PUBMEDBERT: {
                "client": "huggingface",
                "model": "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract",
                "pipeline": "feature-extraction"
            }
        }

    async def analyze_query_complexity(self, query: str) -> QueryComplexity:
        """Analyze query to determine complexity and medical specificity"""
        # Use lightweight model for initial analysis
        analysis_prompt = f"""
        Analyze this medical query for complexity and specificity:
        Query: "{query}"

        Return JSON with:
        - medical_specificity: 0-1 score (1=highly medical)
        - requires_reasoning: true/false
        - estimated_context_length: number of tokens needed
        - primary_entities: list of medical entities
        """

        # Simple rule-based + lightweight model analysis
        medical_terms = self._extract_medical_terms(query)
        specificity_score = len(medical_terms) / max(len(query.split()), 1)

        reasoning_required = any(term in query.lower() for term in [
            'compare', 'recommend', 'best treatment', 'first-line',
            'alternative', 'prognosis', 'guidelines'
        ])

        return QueryComplexity(
            score=min(specificity_score * 1.5, 1.0),
            medical_specificity=specificity_score,
            entities=medical_terms,
            requires_reasoning=reasoning_required,
            context_length_needed=1000 if reasoning_required else 500
        )

    def _extract_medical_terms(self, text: str) -> List[str]:
        """Extract medical terms using simple pattern matching + model"""
        # This would be enhanced with proper medical NER
        medical_keywords = [
            'cancer', 'tumor', 'chemotherapy', 'radiation', 'surgery',
            'metastasis', 'biopsy', 'oncology', 'immunotherapy',
            'targeted therapy', 'clinical trial', 'stage', 'grade',
            'prognosis', 'survival', 'remission', 'recurrence'
        ]
        return [term for term in medical_keywords if term in text.lower()]

    async def route_query(self, query: str, context: List[str] = None) -> Dict:
        """Route query to appropriate LLM based on complexity analysis"""
        complexity = await self.analyze_query_complexity(query)

        if complexity.medical_specificity > 0.8:
            if complexity.requires_reasoning:
                # Complex medical reasoning - use best medical model
                return {
                    "model": ModelType.GPT4_MEDICAL,
                    "reason": "High medical specificity with complex reasoning",
                    "complexity": complexity
                }
            else:
                # Medical fact retrieval - use specialized medical model
                return {
                    "model": ModelType.CLINICAL_BERT,
                    "reason": "Medical fact retrieval",
                    "complexity": complexity
                }
        elif complexity.medical_specificity > 0.5:
            # Moderate medical content
            return {
                "model": ModelType.CLAUDE3,
                "reason": "Moderate medical specificity",
                "complexity": complexity
            }
        else:
            # General medical information
            return {
                "model": ModelType.GPT4_TURBO,
                "reason": "General medical information",
                "complexity": complexity
            }

    async def execute_query(self, query: str, context: List[str] = None) -> Dict:
        """Execute query using routed model"""
        routing = await self.route_query(query, context)
        model_config = self.models[routing["model"]]

        try:
            if model_config["client"] == "openai":
                return await self._call_openai(model_config, query, context)
            elif model_config["client"] == "anthropic":
                return await self._call_anthropic(model_config, query, context)
            elif model_config["client"] == "huggingface":
                return await self._call_huggingface(model_config, query, context)
        except Exception as e:
            self.logger.error(f"Model {routing['model']} failed: {e}")
            # Fallback to reliable model
            return await self._fallback_query(query, context)

    async def _call_openai(self, config: Dict, query: str, context: List[str]) -> Dict:
        """Call OpenAI models"""
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI()

            messages = []
            if context:
                messages.append({
                    "role": "system",
                    "content": f"Context: {' '.join(context)}\n\nAnswer based on this medical context."
                })

            messages.append({"role": "user", "content": query})

            response = await client.chat.completions.create(
                model=config["model"],
                messages=messages,
                max_tokens=config["max_tokens"],
                temperature=config["temperature"]
            )

            return {
                "content": response.choices[0].message.content,
                "model": config["model"],
                "tokens_used": response.usage.total_tokens,
                "cost": (response.usage.total_tokens / 1000) * config["cost_per_token"]
            }
        except Exception as e:
            self.logger.warning(f"OpenAI API not available: {e}")
            return await self._mock_response(query, context)

    async def _call_anthropic(self, config: Dict, query: str, context: List[str]) -> Dict:
        """Call Anthropic models"""
        try:
            import anthropic
            client = anthropic.Anthropic()

            context_text = " ".join(context) if context else ""
            prompt = f"Context: {context_text}\n\nQuery: {query}"

            response = client.messages.create(
                model=config["model"],
                max_tokens=config["max_tokens"],
                temperature=config["temperature"],
                messages=[{"role": "user", "content": prompt}]
            )

            return {
                "content": response.content[0].text,
                "model": config["model"],
                "tokens_used": response.usage.input_tokens + response.usage.output_tokens,
                "cost": ((response.usage.input_tokens + response.usage.output_tokens) / 1000) * config["cost_per_token"]
            }
        except Exception as e:
            self.logger.warning(f"Anthropic API not available: {e}")
            return await self._mock_response(query, context)

    async def _call_huggingface(self, config: Dict, query: str, context: List[str]) -> Dict:
        """Call HuggingFace models"""
        try:
            from transformers import pipeline

            context_text = " ".join(context) if context else ""
            full_text = f"Context: {context_text}\n\nQuery: {query}"

            generator = pipeline(
                config["pipeline"],
                model=config["model"],
                max_length=config["max_length"]
            )

            result = generator(full_text, max_length=config["max_length"])

            return {
                "content": result[0]["generated_text"] if isinstance(result[0], dict) else str(result[0]),
                "model": config["model"],
                "tokens_used": 0,  # HuggingFace doesn't provide token counts easily
                "cost": 0.001  # Minimal cost for local models
            }
        except Exception as e:
            self.logger.warning(f"HuggingFace models not available: {e}")
            return await self._mock_response(query, context)

    async def _fallback_query(self, query: str, context: List[str]) -> Dict:
        """Fallback to simple response when models fail"""
        return {
            "content": "I apologize, but I'm currently unable to process your medical query. Please consult with your healthcare provider for medical advice.",
            "model": "fallback",
            "tokens_used": 0,
            "cost": 0
        }

    async def _mock_response(self, query: str, context: List[str]) -> Dict:
        """Mock response for development/testing"""
        return {
            "content": f"This is a mock response for: {query}. In production, this would use the actual {context[0] if context else 'LLM'} model.",
            "model": "mock",
            "tokens_used": 100,
            "cost": 0.003
        }
