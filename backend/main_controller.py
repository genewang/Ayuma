# main_controller.py
from typing import Dict, List, Optional
import asyncio
from llm_coordinator import LLMCoordinator, QueryComplexity
from medical_rag import MedicalRAGSystem
from evidence_ranker import EvidenceBasedRanker
import logging
import json
import time

class MedicalGuidedPathController:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.llm_coordinator = LLMCoordinator()
        self.rag_system = MedicalRAGSystem()
        self.evidence_ranker = EvidenceBasedRanker()
        self.conversation_history = []

        # Log LangChain integration status
        self.logger.info(f"Medical RAG System initialized with LangChain support: {self.rag_system.use_langchain_store if hasattr(self.rag_system, 'use_langchain_store') else 'Unknown'}")

    async def process_medical_query(self, query: str, patient_context: Dict = None) -> Dict:
        """Main method to process medical queries with full pipeline"""

        start_time = time.time()

        try:
            # Step 1: Extract medical entities
            medical_entities = self.rag_system.extract_medical_entities(query)
            self.logger.info(f"Extracted entities: {medical_entities}")

            # Step 2: Multi-stage retrieval
            filters = self._build_retrieval_filters(medical_entities, patient_context)
            retrieved_docs = await self.rag_system.retrieve_relevant_context(query, filters)

            self.logger.info(f"Retrieved {len(retrieved_docs)} relevant documents")

            # Step 3: Evidence-based ranking
            if retrieved_docs:
                ranked_docs = self.evidence_ranker.rank_documents(retrieved_docs, medical_entities)
            else:
                ranked_docs = []

            # Step 4: Model routing and execution
            context_texts = [doc["document"] for doc in ranked_docs[:3]]  # Top 3 documents
            response = await self.llm_coordinator.execute_query(query, context_texts)

            # Step 5: Format response with citations
            formatted_response = self._format_response_with_citations(
                response, ranked_docs, medical_entities
            )

            # Add performance metrics
            processing_time = time.time() - start_time
            formatted_response["processing_time"] = processing_time
            formatted_response["query_id"] = f"query_{int(time.time())}"

            # Store in conversation history
            self.conversation_history.append({
                "query": query,
                "response": formatted_response,
                "timestamp": time.time(),
                "patient_context": patient_context,
                "processing_time": processing_time,
                "documents_retrieved": len(retrieved_docs)
            })

            # Keep only last 100 conversations for memory management
            if len(self.conversation_history) > 100:
                self.conversation_history = self.conversation_history[-100:]

            return formatted_response

        except Exception as e:
            self.logger.error(f"Error processing medical query: {e}")
            processing_time = time.time() - start_time
            return {
                "answer": "I apologize, but I encountered an error while processing your medical query. Please consult with your healthcare provider for medical advice.",
                "model_used": "error",
                "citations": [],
                "medical_entities_found": {},
                "evidence_quality": "Error",
                "cost_estimation": 0,
                "timestamp": time.time(),
                "processing_time": processing_time,
                "error": str(e)
            }

    def _build_retrieval_filters(self, entities: Dict, patient_context: Dict) -> Dict:
        """Build filters for vector database query"""
        filters = {}

        # Entity-based filters
        if entities.get("diseases"):
            filters["disease"] = {"$in": entities["diseases"]}

        if entities.get("treatments"):
            filters["treatment"] = {"$in": entities["treatments"]}

        if entities.get("biomarkers"):
            filters["biomarkers"] = {"$in": entities["biomarkers"]}

        # Patient context filters
        if patient_context:
            if patient_context.get("cancer_type"):
                filters["cancer_type"] = patient_context["cancer_type"]
            if patient_context.get("cancer_stage"):
                filters["stage"] = patient_context["cancer_stage"]
            if patient_context.get("biomarkers"):
                filters["biomarkers"] = {"$in": patient_context["biomarkers"]}
            if patient_context.get("previous_treatments"):
                filters["treatment"] = {"$in": patient_context["previous_treatments"]}

        # Always prefer higher evidence levels and recent publications
        filters["quality_score"] = {"$gte": 0.4}  # Minimum quality threshold

        # Institution preferences
        preferred_institutions = ["ASCO", "NCCN", "ESMO", "EULAR", "FDA", "NIH"]
        if not filters.get("institution"):
            filters["institution"] = {"$in": preferred_institutions}

        return filters

    def _format_response_with_citations(self, response: Dict, documents: List[Dict], entities: Dict) -> Dict:
        """Format response with proper citations and evidence grading"""

        citations = []
        for i, doc in enumerate(documents[:5]):  # Top 5 documents as citations
            metadata = doc.get("metadata", {})

            citations.append({
                "id": i + 1,
                "content": doc["document"][:300] + "..." if len(doc["document"]) > 300 else doc["document"],
                "source": metadata.get("source", "Unknown"),
                "institution": metadata.get("institution", "Unknown"),
                "evidence_level": metadata.get("evidence_level", "Unknown"),
                "study_type": metadata.get("study_type", "Unknown"),
                "publication_date": metadata.get("publication_date", "Unknown"),
                "confidence_score": round(doc.get("final_score", 0), 3),
                "quality_score": round(metadata.get("quality_score", 0), 3),
                "relevance_score": round(doc.get("relevance_score", 0), 3),
                "url": metadata.get("url", ""),
                "doi": metadata.get("doi", "")
            })

        # Calculate overall evidence quality
        overall_quality = self._calculate_overall_evidence_quality(documents)

        return {
            "answer": response["content"],
            "model_used": response["model"],
            "citations": citations,
            "medical_entities_found": entities,
            "evidence_quality": overall_quality,
            "evidence_level_description": self.evidence_ranker.get_evidence_level_description(
                sum(doc.get("evidence_score", 0) for doc in documents) / max(len(documents), 1)
            ),
            "recommendation_strength": self.evidence_ranker.get_recommendation_strength(
                sum(doc.get("final_score", 0) for doc in documents) / max(len(documents), 1)
            ),
            "cost_estimation": response.get("cost", 0),
            "tokens_used": response.get("tokens_used", 0),
            "timestamp": time.time()
        }

    def _calculate_overall_evidence_quality(self, documents: List[Dict]) -> str:
        """Calculate overall evidence quality grade"""
        if not documents:
            return "No Evidence Available"

        avg_score = sum(doc.get("final_score", 0) for doc in documents) / len(documents)

        if avg_score >= 0.9:
            return "Very High Quality"
        elif avg_score >= 0.8:
            return "High Quality"
        elif avg_score >= 0.7:
            return "Moderate Quality"
        elif avg_score >= 0.5:
            return "Low Quality"
        else:
            return "Very Low Quality"

    async def batch_process_queries(self, queries: List[str], patient_context: Dict = None) -> List[Dict]:
        """Process multiple queries efficiently"""
        tasks = []
        for query in queries:
            task = self.process_medical_query(query, patient_context)
            tasks.append(task)

        return await asyncio.gather(*tasks)

    async def get_conversation_history(self, limit: int = 10) -> List[Dict]:
        """Get recent conversation history"""
        return self.conversation_history[-limit:] if self.conversation_history else []

    async def clear_conversation_history(self):
        """Clear conversation history"""
        self.conversation_history.clear()
        self.logger.info("Conversation history cleared")

    async def get_system_status(self) -> Dict:
        """Get system status and performance metrics"""
        try:
            # Get collection stats
            collection_stats = 0
            try:
                if hasattr(self.rag_system, 'collection') and self.rag_system.collection:
                    collection_stats = self.rag_system.collection.count()
            except Exception:
                pass

            # Calculate average response times from history
            recent_conversations = [c for c in self.conversation_history[-20:] if 'processing_time' in c]
            avg_response_time = sum(c['processing_time'] for c in recent_conversations) / len(recent_conversations) if recent_conversations else 0

            # Get LangChain integration status
            langchain_status = {
                "langchain_available": getattr(self.rag_system, 'use_langchain_store', False),
                "embedding_model": getattr(self.rag_system, 'use_langchain', False),
                "processing_method": "LangChain" if getattr(self.rag_system, 'use_langchain_store', False) else "Fallback"
            }

            return {
                "status": "healthy",
                "documents_indexed": collection_stats,
                "conversations_processed": len(self.conversation_history),
                "average_response_time": round(avg_response_time, 2),
                "models_available": list(self.llm_coordinator.models.keys()),
                "langchain_integration": langchain_status,
                "timestamp": time.time()
            }
        except Exception as e:
            self.logger.error(f"Error getting system status: {e}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": time.time()
            }

    async def update_medical_knowledge(self, documents: List[Dict]) -> Dict:
        """Update medical knowledge base with new documents"""
        try:
            result = await self.rag_system.ingest_medical_documents(documents)
            self.logger.info(f"Knowledge base updated: {result}")
            return result
        except Exception as e:
            self.logger.error(f"Error updating knowledge base: {e}")
            return {"success": False, "error": str(e)}
