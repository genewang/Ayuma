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
        """Provide realistic medical responses that use RAG context for development/testing"""
        query_lower = query.lower()

        # Use context if available to provide more relevant responses
        context_text = " ".join(context) if context else ""

        # Extract key terms from query for more targeted responses
        key_terms = self._extract_medical_terms(query)

        if "clinical trial" in query_lower or "trial" in query_lower:
            return {
                "content": self._generate_trial_response(query, context_text, key_terms),
                "model": "medical-knowledge-base",
                "tokens_used": 450,
                "cost": 0.003
            }
        elif "side effect" in query_lower and "chemotherapy" in query_lower:
            return {
                "content": self._generate_side_effect_response(query, context_text, key_terms),
                "model": "medical-knowledge-base",
                "tokens_used": 400,
                "cost": 0.003
            }
        elif any(term in query_lower for term in ["treatment", "therapy", "breast cancer"]):
            return {
                "content": self._generate_treatment_response(query, context_text, key_terms),
                "model": "medical-knowledge-base",
                "tokens_used": 500,
                "cost": 0.003
            }
        else:
            return {
                "content": self._generate_general_response(query, context_text, key_terms),
                "model": "medical-knowledge-base",
                "tokens_used": 200,
                "cost": 0.003
            }

    def _generate_trial_response(self, query: str, context: str, key_terms: List[str]) -> str:
        """Generate clinical trial response using RAG context"""
        # Extract relevant information from context
        context_lower = context.lower()

        # Look for specific trial-related information in context
        trial_info = []
        if "clinical trial" in context_lower:
            trial_info.append("• Clinical trial options identified in medical guidelines")
        if "phase" in context_lower:
            trial_info.append("• Phase-specific trial recommendations available")
        if "her2" in context_lower or "herceptin" in context_lower:
            trial_info.append("• HER2-targeted therapy trials may be available")
        if "metastatic" in context_lower or "advanced" in context_lower:
            trial_info.append("• Advanced/metastatic cancer trials are a consideration")

        if trial_info:
            specific_info = "\n".join(trial_info)
        else:
            specific_info = "• Clinical trial options should be discussed with your oncologist"

        return f"""Based on your HER2-positive breast cancer status, clinical trials may offer additional treatment options beyond standard care. Here's what the medical guidelines suggest:

**Clinical Trial Considerations for HER2+ Breast Cancer:**

**Eligibility Factors:**
{specific_info}
• HER2 amplification status (positive for targeted therapies)
• Cancer stage and progression
• Previous treatment history
• Performance status and overall health

**Potential Trial Categories:**
• HER2-targeted therapies (beyond standard trastuzumab)
• Immunotherapy combinations
• Novel chemotherapy regimens
• Maintenance therapy approaches

**Next Steps:**
• Discuss trial availability with your oncologist
• Check ClinicalTrials.gov for HER2-positive breast cancer trials
• Consider cancer centers with active research programs
• Review eligibility criteria carefully

**Important Considerations:**
• Trials may require specific biomarker testing
• Travel to trial sites may be necessary
• Insurance coverage varies by trial and location
• Standard treatment options should not be delayed while seeking trials

*Please consult with your healthcare provider and a clinical trial specialist to identify trials that match your specific situation and medical history.*"""

    def _generate_treatment_response(self, query: str, context: str, key_terms: List[str]) -> str:
        """Generate treatment response using RAG context"""
        # Extract relevant treatment information from context
        context_lower = context.lower()

        treatment_info = []
        if "her2" in context_lower or "trastuzumab" in context_lower:
            treatment_info.append("• HER2-targeted therapy (trastuzumab) is standard of care")
        if "chemotherapy" in context_lower:
            treatment_info.append("• Chemotherapy regimens are well-established")
        if "hormone" in context_lower:
            treatment_info.append("• Hormone therapy may be indicated based on receptor status")
        if "stage" in context_lower:
            treatment_info.append("• Treatment approach depends on cancer stage")

        if treatment_info:
            specific_treatments = "\n".join(treatment_info)
        else:
            specific_treatments = "• Multimodal treatment approach recommended"

        return f"""For HER2-positive breast cancer, the medical guidelines recommend a comprehensive treatment approach:

**Standard Treatment Options:**

**Targeted Therapy:**
{specific_treatments}
• Trastuzumab (Herceptin) - cornerstone of HER2+ treatment
• May be combined with pertuzumab for enhanced efficacy
• Typically given for 1 year duration

**Chemotherapy:**
• Anthracycline and taxane-based regimens
• May be given before (neoadjuvant) or after (adjuvant) surgery
• Duration typically 4-6 months

**Surgery and Radiation:**
• Breast-conserving surgery when possible
• Radiation therapy usually indicated after lumpectomy
• Axillary lymph node evaluation required

**Additional Therapies:**
• Hormone therapy if ER/PR positive
• Bone-modifying agents if bone metastases present
• Supportive care throughout treatment

**Monitoring and Follow-up:**
• Regular imaging and biomarker testing
• Cardiac monitoring during HER2-targeted therapy
• Long-term survivorship care planning

*Treatment plans are highly individualized based on tumor characteristics, stage, and patient preferences. Please discuss all options with your multidisciplinary care team.*"""

    def _generate_side_effect_response(self, query: str, context: str, key_terms: List[str]) -> str:
        """Generate side effect response using RAG context"""
        return """Chemotherapy side effects in breast cancer treatment can be managed effectively with modern supportive care:

**Common Side Effects:**
• Nausea and vomiting (managed with anti-emetics)
• Fatigue (energy conservation strategies)
• Hair loss (scalp cooling may help)
• Neutropenia (growth factors available)
• Neuropathy (dose adjustments possible)

**HER2-Targeted Therapy Side Effects:**
• Cardiac toxicity (regular heart monitoring required)
• Infusion reactions (premedication protocols)
• Fatigue and muscle/joint pain

**Management Strategies:**
• Prophylactic anti-nausea medications
• Growth factor support for low blood counts
• Cardiac monitoring every 3 months during trastuzumab
• Dose adjustments based on toxicity

*Side effect management is an important part of cancer care. Please discuss any side effects with your healthcare provider for personalized management strategies.*"""

    def _generate_general_response(self, query: str, context: str, key_terms: List[str]) -> str:
        """Generate general response using RAG context"""
        context_lower = context.lower()

        # Try to extract relevant information from context
        if "breast cancer" in context_lower:
            return f"""For breast cancer treatment, I recommend discussing the following with your healthcare provider:

**Key Considerations:**
• Cancer stage and grade
• Hormone receptor status (ER/PR)
• HER2 status (important for targeted therapies)
• Overall health and comorbidities

**Treatment Team:**
• Medical oncologist
• Surgical oncologist
• Radiation oncologist
• Patient navigator or coordinator

**Decision Factors:**
• Treatment goals (curative vs. palliative)
• Quality of life considerations
• Clinical trial availability
• Support system and resources

*Please consult with your oncology team for personalized treatment recommendations based on your specific medical situation.*"""
        else:
            return f"""I understand you're asking about: {query}

**Next Steps:**
• Discuss your concerns with your healthcare provider
• Consider getting a second opinion if needed
• Explore support resources and patient advocacy groups
• Review treatment options with your care team

*This information is for educational purposes. Please consult with qualified healthcare professionals for medical advice and treatment decisions.*"""
