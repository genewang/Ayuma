# medical_rag.py
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import pandas as pd
from datetime import datetime
import json
import logging

class MedicalRAGSystem:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._initialize_models()
        self._initialize_vector_store()

    def _initialize_models(self):
        """Initialize embedding models"""
        try:
            # General purpose embedding model
            self.embedding_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
            # Medical-specific embedding model
            self.medical_embedding_model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')
            self.logger.info("Successfully initialized embedding models")
        except Exception as e:
            self.logger.error(f"Failed to initialize embedding models: {e}")
            # Fallback to simpler model
            self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            self.medical_embedding_model = self.embedding_model

    def _initialize_vector_store(self):
        """Initialize vector database"""
        try:
            # Initialize ChromaDB
            self.chroma_client = chromadb.PersistentClient(path="./medical_chroma_db")
            self.collection = self.chroma_client.get_or_create_collection("medical_guidelines")

            # Create index for medical documents
            self.medical_collection = self.chroma_client.get_or_create_collection("medical_documents")

            self.logger.info("Successfully initialized vector database")
        except Exception as e:
            self.logger.error(f"Failed to initialize vector database: {e}")
            # Fallback to in-memory storage
            self.chroma_client = chromadb.EphemeralClient()
            self.collection = self.chroma_client.get_or_create_collection("medical_guidelines")
            self.medical_collection = self.chroma_client.get_or_create_collection("medical_documents")

    def extract_medical_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract medical entities from text using rule-based approach"""
        entities = {
            "diseases": [],
            "treatments": [],
            "drugs": [],
            "procedures": [],
            "anatomy": [],
            "biomarkers": []
        }

        text_lower = text.lower()

        # Disease patterns
        disease_patterns = [
            'cancer', 'carcinoma', 'adenocarcinoma', 'sarcoma', 'lymphoma', 'leukemia',
            'melanoma', 'tumor', 'neoplasm', 'malignancy'
        ]
        for pattern in disease_patterns:
            if pattern in text_lower:
                entities["diseases"].append(pattern)

        # Treatment patterns
        treatment_patterns = [
            'chemotherapy', 'immunotherapy', 'radiation', 'surgery', 'targeted therapy',
            'hormone therapy', 'transplant', 'biopsy'
        ]
        for pattern in treatment_patterns:
            if pattern in text_lower:
                entities["treatments"].append(pattern)

        # Drug patterns
        drug_patterns = [
            'tamoxifen', 'methotrexate', 'paclitaxel', 'doxorubicin', 'trastuzumab',
            'pembrolizumab', 'nivolumab', 'ipilimumab'
        ]
        for pattern in drug_patterns:
            if pattern in text_lower:
                entities["drugs"].append(pattern)

        # Procedure patterns
        procedure_patterns = [
            'biopsy', 'surgery', 'resection', 'lumpectomy', 'mastectomy', 'radiation',
            'imaging', 'scan', 'mri', 'ct scan', 'pet scan'
        ]
        for pattern in procedure_patterns:
            if pattern in text_lower:
                entities["procedures"].append(pattern)

        # Anatomy patterns
        anatomy_patterns = [
            'breast', 'lung', 'colon', 'prostate', 'liver', 'brain', 'lymph node',
            'bone', 'skin', 'blood'
        ]
        for pattern in anatomy_patterns:
            if pattern in text_lower:
                entities["anatomy"].append(pattern)

        # Biomarker patterns
        biomarker_patterns = [
            'her2', 'er positive', 'pr positive', 'egfr', 'alk', 'ros1', 'braf',
            'pd-l1', 'msi-h', 'tmb high'
        ]
        for pattern in biomarker_patterns:
            if pattern in text_lower:
                entities["biomarkers"].append(pattern)

        return entities

    async def ingest_medical_documents(self, documents: List[Dict]):
        """Ingest medical documents into vector database"""
        try:
            chunks = []
            metadatas = []
            ids = []

            for doc in documents:
                document_chunks = self._chunk_medical_document(doc)

                for i, chunk in enumerate(document_chunks):
                    chunk_id = f"{doc['id']}_{i}"
                    chunks.append(chunk["text"])

                    # Enhanced metadata
                    metadata = {
                        **chunk["metadata"],
                        "source": doc.get("source", "unknown"),
                        "institution": doc.get("institution", "unknown"),
                        "evidence_level": doc.get("evidence_level", "unknown"),
                        "publication_date": doc.get("publication_date", ""),
                        "chunk_index": i,
                        "document_type": doc.get("type", "guideline"),
                        "entities": self.extract_medical_entities(chunk["text"])
                    }

                    # Add quality indicators
                    metadata["quality_score"] = self._calculate_quality_score(metadata)
                    metadata["recency_score"] = self._calculate_recency_score(metadata.get("publication_date", ""))

                    metadatas.append(metadata)
                    ids.append(chunk_id)

            # Generate embeddings using medical-specific model
            embeddings = self.medical_embedding_model.encode(chunks).tolist()

            # Add to vector store
            self.collection.add(
                embeddings=embeddings,
                documents=chunks,
                metadatas=metadatas,
                ids=ids
            )

            self.logger.info(f"Successfully ingested {len(documents)} documents with {len(chunks)} chunks")
            return {"success": True, "chunks_created": len(chunks)}

        except Exception as e:
            self.logger.error(f"Failed to ingest documents: {e}")
            return {"success": False, "error": str(e)}

    def _chunk_medical_document(self, document: Dict) -> List[Dict]:
        """Chunk medical documents with semantic boundaries"""
        text = document["content"]
        chunks = []

        # Medical document specific chunking
        sections = text.split("\n\n")
        current_chunk = ""
        current_section = ""

        for section in sections:
            section = section.strip()
            if not section:
                continue

            # Check if this is a new section header
            if section.isupper() and len(section) < 100:
                # This is a section header
                if current_chunk:
                    chunks.append({
                        "text": current_chunk,
                        "metadata": {
                            "section": current_section,
                            "document_id": document["id"],
                            "chunk_type": "section"
                        }
                    })
                current_chunk = section + "\n\n"
                current_section = section
            else:
                # Add to current chunk
                if len(current_chunk + section) < 1500:
                    current_chunk += section + "\n\n"
                else:
                    # Chunk is full, save it
                    if current_chunk:
                        chunks.append({
                            "text": current_chunk,
                            "metadata": {
                                "section": current_section,
                                "document_id": document["id"],
                                "chunk_type": "content"
                            }
                        })
                    current_chunk = section + "\n\n"

        # Don't forget the last chunk
        if current_chunk:
            chunks.append({
                "text": current_chunk,
                "metadata": {
                    "section": current_section,
                    "document_id": document["id"],
                    "chunk_type": "content"
                }
            })

        return chunks

    def _calculate_quality_score(self, metadata: Dict) -> float:
        """Calculate document quality score based on metadata"""
        score = 0.5  # Base score

        # Evidence level scoring
        evidence_weights = {
            "systematic-review": 0.3,
            "meta-analysis": 0.3,
            "randomized-controlled-trial": 0.25,
            "cohort-study": 0.15,
            "case-control": 0.1,
            "expert-opinion": 0.05
        }

        evidence_level = metadata.get("evidence_level", "").lower()
        score += evidence_weights.get(evidence_level, 0)

        # Institution scoring
        institution_weights = {
            "ASCO": 0.2, "NCCN": 0.2, "ESMO": 0.15,
            "EULAR": 0.15, "FDA": 0.1, "NIH": 0.1
        }

        institution = metadata.get("institution", "").upper()
        score += institution_weights.get(institution, 0)

        return min(score, 1.0)

    def _calculate_recency_score(self, publication_date: str) -> float:
        """Calculate recency score based on publication date"""
        if not publication_date:
            return 0.5

        try:
            pub_datetime = datetime.strptime(publication_date, "%Y-%m-%d")
            current_date = datetime.now()
            years_diff = (current_date - pub_datetime).days / 365.25

            if years_diff <= 1:
                return 1.0
            elif years_diff <= 3:
                return 0.8
            elif years_diff <= 5:
                return 0.6
            elif years_diff <= 10:
                return 0.4
            else:
                return 0.2
        except:
            return 0.5

    async def retrieve_relevant_context(self, query: str, filters: Dict = None, top_k: int = 5) -> List[Dict]:
        """Retrieve relevant medical context using multi-stage retrieval"""

        try:
            # Stage 1: Semantic search
            query_embedding = self.medical_embedding_model.encode([query]).tolist()

            # Base retrieval with enhanced scoring
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=top_k * 3,  # Get more for re-ranking
                where=filters,
                include=["metadatas", "documents", "distances"]
            )

            # Stage 2: Medical entity-aware re-ranking
            reranked_results = self._rerank_with_medical_entities(query, results)

            # Stage 3: Evidence-based filtering
            filtered_results = self._filter_by_evidence_quality(reranked_results)

            # Return top results with enhanced metadata
            return filtered_results[:top_k]

        except Exception as e:
            self.logger.error(f"Failed to retrieve context: {e}")
            return []

    def _rerank_with_medical_entities(self, query: str, results: Dict) -> List[Dict]:
        """Re-rank results based on medical entity matching"""
        query_entities = self.extract_medical_entities(query)

        scored_results = []

        for i, (doc, metadata, distance) in enumerate(zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0]
        )):
            score = 1 - distance  # Convert distance to similarity

            # Boost score for entity matches
            doc_entities = metadata.get("entities", {})

            # Calculate entity overlap
            entity_overlap = 0
            for entity_type, entities in query_entities.items():
                if entities and doc_entities.get(entity_type):
                    overlap = len(set(entities) & set(doc_entities[entity_type]))
                    entity_overlap += overlap * 0.1  # Boost per entity match

            score += entity_overlap

            # Boost for quality and recency
            quality_boost = metadata.get("quality_score", 0) * 0.2
            recency_boost = metadata.get("recency_score", 0) * 0.1

            score += quality_boost + recency_boost

            scored_results.append({
                "document": doc,
                "metadata": metadata,
                "score": score,
                "original_distance": distance
            })

        # Sort by final score
        return sorted(scored_results, key=lambda x: x["score"], reverse=True)

    def _filter_by_evidence_quality(self, results: List[Dict]) -> List[Dict]:
        """Filter results based on evidence quality and source authority"""
        filtered_results = []

        for result in results:
            metadata = result["metadata"]

            # Quality threshold
            quality_score = metadata.get("quality_score", 0)
            if quality_score >= 0.4:  # Minimum quality threshold
                filtered_results.append(result)

        return sorted(filtered_results, key=lambda x: x["score"], reverse=True)
