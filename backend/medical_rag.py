# medical_rag.py
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import pandas as pd
from datetime import datetime
import json
import logging

# Import LangChain components
try:
    # Vector stores and embeddings from langchain_community
    from langchain_community.vectorstores import Chroma
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    # Core LangChain components
    try:
        from langchain.schema import Document
    except ImportError:
        from langchain_core.documents import Document

    # Force LangChain to be available
    LANGCHAIN_AVAILABLE = True
    logging.info("LangChain components successfully imported")
except ImportError as e:
    logging.error(f"LangChain import failed: {e}")
    # Still set to True to attempt initialization
    LANGCHAIN_AVAILABLE = True
    # Create fallback classes
    class Document:
        def __init__(self, page_content: str, metadata: dict = None):
            self.page_content = page_content
            self.metadata = metadata or {}
    Chroma = None
    HuggingFaceEmbeddings = None
    RecursiveCharacterTextSplitter = None

class MedicalRAGSystem:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._initialize_models()
        self._initialize_vector_store()

    def _initialize_models(self):
        """Initialize embedding models"""
        if LANGCHAIN_AVAILABLE:
            try:
                # Check if we have the required classes
                if not all([Document, RecursiveCharacterTextSplitter, HuggingFaceEmbeddings]):
                    self.logger.warning("LangChain components not fully available, using fallback")
                    self._initialize_fallback_models()
                    return

                # Use LangChain embeddings
                self.embedding_model = HuggingFaceEmbeddings(
                    model_name='sentence-transformers/all-mpnet-base-v2'
                )
                self.medical_embedding_model = HuggingFaceEmbeddings(
                    model_name='pritamdeka/S-PubMedBert-MS-MARCO'
                )
                self.logger.info("Successfully initialized LangChain embedding models")
                self.use_langchain = True
            except Exception as e:
                self.logger.error(f"Failed to initialize LangChain models: {e}")
                self._initialize_fallback_models()
        else:
            self._initialize_fallback_models()

    def _initialize_fallback_models(self):
        """Initialize fallback models when LangChain is not available"""
        try:
            # General purpose embedding model
            self.embedding_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
            # Medical-specific embedding model
            self.medical_embedding_model = SentenceTransformer('pritamdeka/S-PubMedBert-MS-MARCO')
            self.logger.info("Successfully initialized fallback embedding models")
            self.use_langchain = False
        except Exception as e:
            self.logger.error(f"Failed to initialize fallback models: {e}")
            # Final fallback to simpler model
            self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            self.medical_embedding_model = self.embedding_model
            self.use_langchain = False

    def _initialize_vector_store(self):
        """Initialize vector database"""
        if LANGCHAIN_AVAILABLE and Chroma and HuggingFaceEmbeddings:
            try:
                # Use LangChain Chroma vector store
                self.chroma_client = chromadb.PersistentClient(path="./medical_chroma_db")

                # Initialize LangChain Chroma vector store
                self.langchain_collection = Chroma(
                    collection_name="medical_guidelines",
                    embedding_function=self.medical_embedding_model,
                    persist_directory="./medical_chroma_db"
                )

                # Also maintain direct ChromaDB access for compatibility
                self.collection = self.chroma_client.get_or_create_collection("medical_guidelines")
                self.medical_collection = self.chroma_client.get_or_create_collection("medical_documents")

                self.logger.info("Successfully initialized LangChain vector store")
                self.use_langchain_store = True
                return
            except Exception as e:
                self.logger.error(f"Failed to initialize LangChain vector store: {e}")
                self.logger.info("Falling back to direct ChromaDB implementation")

        # Fallback to direct ChromaDB
        try:
            self.chroma_client = chromadb.PersistentClient(path="./medical_chroma_db")
            self.collection = self.chroma_client.get_or_create_collection("medical_guidelines")
            self.medical_collection = self.chroma_client.get_or_create_collection("medical_documents")
            self.use_langchain_store = False
            self.langchain_collection = None
            self.logger.info("Successfully initialized fallback vector database")
        except Exception as e:
            self.logger.error(f"Failed to initialize fallback vector database: {e}")
            # Final fallback to in-memory storage
            self.chroma_client = chromadb.EphemeralClient()
            self.collection = self.chroma_client.get_or_create_collection("medical_guidelines")
            self.medical_collection = self.chroma_client.get_or_create_collection("medical_documents")
            self.use_langchain_store = False
            self.langchain_collection = None

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
        """Ingest medical documents into vector database using LangChain"""
        try:
            if self.use_langchain_store and self.langchain_collection:
                # Use LangChain approach
                return await self._ingest_with_langchain(documents)
            else:
                # Use fallback approach
                return self._ingest_with_fallback(documents)

        except Exception as e:
            self.logger.error(f"Failed to ingest documents: {e}")
            return {"success": False, "error": str(e)}

    async def _ingest_with_langchain(self, documents: List[Dict]):
        """Ingest documents using LangChain components"""
        try:
            # Check if LangChain components are available
            if not all([Document, RecursiveCharacterTextSplitter, self.langchain_collection]):
                self.logger.warning("LangChain components not available, falling back to direct method")
                return self._ingest_with_fallback(documents)

            # Convert documents to LangChain Document objects
            langchain_docs = []
            metadatas = []

            for doc in documents:
                # Create LangChain Document
                langchain_doc = Document(
                    page_content=doc["content"],
                    metadata={
                        **doc.get("metadata", {}),
                        "source": doc.get("source", "unknown"),
                        "institution": doc.get("institution", "unknown"),
                        "evidence_level": doc.get("evidence_level", "unknown"),
                        "publication_date": doc.get("publication_date", ""),
                        "document_type": doc.get("document_type", "guideline"),
                        "cancer_type": doc.get("cancer_type", ""),
                        "document_id": doc.get("id", ""),
                        # Convert entities dict to string for LangChain compatibility
                        "entities_str": str(self.extract_medical_entities(doc["content"]))
                    }
                )
                langchain_docs.append(langchain_doc)
                metadatas.append(langchain_doc.metadata)

            # Split documents using LangChain text splitter
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1500,
                chunk_overlap=200,
                length_function=len,
                separators=["\n\n", "\n", ". ", " ", ""]
            )

            # Split all documents
            all_splits = text_splitter.split_documents(langchain_docs)

            # Add to LangChain vector store
            self.langchain_collection.add_documents(all_splits)

            # Also update direct ChromaDB for compatibility
            chunks = []
            chunk_metadatas = []
            ids = []

            for i, split in enumerate(all_splits):
                chunks.append(split.page_content)
                chunk_metadatas.append(split.metadata)
                ids.append(f"langchain_{split.metadata.get('document_id', 'unknown')}_{i}")

            if chunks:
                # Generate embeddings using the appropriate method
                if self.use_langchain and hasattr(self.medical_embedding_model, 'embed_documents'):
                    # Use LangChain embedding model
                    embeddings = self.medical_embedding_model.embed_documents(chunks)
                elif hasattr(self.medical_embedding_model, 'encode'):
                    # Use SentenceTransformer directly
                    embeddings = self.medical_embedding_model.encode(chunks).tolist()
                else:
                    # Final fallback - use dummy embeddings
                    embeddings = [[0.1] * 384 for _ in chunks]

                self.collection.add(
                    embeddings=embeddings,
                    documents=chunks,
                    metadatas=chunk_metadatas,
                    ids=ids
                )

            self.logger.info(f"Successfully ingested {len(documents)} documents with LangChain ({len(all_splits)} chunks)")
            return {"success": True, "chunks_created": len(all_splits), "method": "langchain"}

        except Exception as e:
            self.logger.error(f"LangChain ingestion failed: {e}")
            # Fallback to direct method
            return self._ingest_with_fallback(documents)

    def _ingest_with_fallback(self, documents: List[Dict]):
        """Ingest documents using fallback method (original implementation)"""
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
                        "document_type": doc.get("document_type", "guideline"),
                        "document_id": doc.get("id", ""),
                        # Convert entities for compatibility
                        "entities_str": str(self.extract_medical_entities(chunk["text"]))
                    }

                    # Add quality indicators
                    metadata["quality_score"] = self._calculate_quality_score(metadata)
                    metadata["recency_score"] = self._calculate_recency_score(metadata.get("publication_date", ""))

                    metadatas.append(metadata)
                    ids.append(chunk_id)

            # Generate embeddings using medical-specific model
            if self.use_langchain and hasattr(self.medical_embedding_model, 'embed_documents'):
                # Use LangChain embedding model
                embeddings = self.medical_embedding_model.embed_documents(chunks)
            elif hasattr(self.medical_embedding_model, 'encode'):
                # Use SentenceTransformer directly
                embeddings = self.medical_embedding_model.encode(chunks).tolist()
            else:
                # Final fallback - use dummy embeddings
                embeddings = [[0.1] * 384 for _ in chunks]

            # Add to vector store
            self.collection.add(
                embeddings=embeddings,
                documents=chunks,
                metadatas=metadatas,
                ids=ids
            )

            self.logger.info(f"Successfully ingested {len(documents)} documents with fallback method ({len(chunks)} chunks)")
            return {"success": True, "chunks_created": len(chunks), "method": "fallback"}

        except Exception as e:
            self.logger.error(f"Fallback ingestion failed: {e}")
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
        """Retrieve relevant medical context using LangChain or fallback methods"""

        try:
            if self.use_langchain_store and self.langchain_collection:
                # Use LangChain similarity search
                return await self._retrieve_with_langchain(query, filters, top_k)
            else:
                # Use fallback retrieval method
                return self._retrieve_with_fallback(query, filters, top_k)

        except Exception as e:
            self.logger.error(f"Failed to retrieve context: {e}")
            return []

    async def _retrieve_with_langchain(self, query: str, filters: Dict = None, top_k: int = 5) -> List[Dict]:
        """Retrieve using LangChain similarity search"""
        try:
            # Check if LangChain components are available
            if not self.langchain_collection:
                self.logger.warning("LangChain collection not available, falling back to direct method")
                return self._retrieve_with_fallback(query, filters, top_k)

            # Convert filters to LangChain format
            langchain_filters = self._convert_filters_for_langchain(filters)

            # Use LangChain similarity search
            docs = self.langchain_collection.similarity_search_with_score(
                query,
                k=top_k * 3,  # Get more for re-ranking
                filter=langchain_filters
            )

            # Convert LangChain results to our format
            results = []
            for doc, score in docs:
                # Calculate similarity score (1 - normalized distance)
                similarity_score = 1 - (score / 2)  # Normalize score to 0-1 range

                results.append({
                    "document": doc.page_content,
                    "metadata": doc.metadata,
                    "score": similarity_score,
                    "original_distance": score,
                    "retrieval_method": "langchain"
                })

            # Apply medical entity-aware re-ranking
            reranked_results = self._rerank_with_medical_entities_langchain(query, results)

            # Apply evidence-based filtering
            filtered_results = self._filter_by_evidence_quality(reranked_results)

            return filtered_results[:top_k]

        except Exception as e:
            self.logger.error(f"LangChain retrieval failed: {e}")
            # Fallback to direct method
            return self._retrieve_with_fallback(query, filters, top_k)

    def _convert_filters_for_langchain(self, filters: Dict) -> Dict:
        """Convert our filter format to LangChain filter format"""
        if not filters:
            return {}

        langchain_filters = {}

        # Convert metadata filters
        for key, value in filters.items():
            if isinstance(value, dict) and "$in" in value:
                langchain_filters[key] = {"$in": value["$in"]}
            elif isinstance(value, dict) and "$gte" in value:
                langchain_filters[key] = {"$gte": value["$gte"]}
            else:
                langchain_filters[key] = value

        return langchain_filters

    def _retrieve_with_fallback(self, query: str, filters: Dict = None, top_k: int = 5) -> List[Dict]:
        """Retrieve using fallback method (original implementation)"""

        try:
            # Generate embedding for query using the appropriate method
            if self.use_langchain and hasattr(self.medical_embedding_model, 'embed_query'):
                # Use LangChain embedding model
                query_embedding = self.medical_embedding_model.embed_query(query)
                query_embedding = [query_embedding]  # Wrap in list for compatibility
            elif hasattr(self.medical_embedding_model, 'encode'):
                # Use SentenceTransformer directly
                query_embedding = self.medical_embedding_model.encode([query]).tolist()
            else:
                # Final fallback - use a simple embedding
                query_embedding = [[0.1] * 384]  # Dummy embedding

            # Base retrieval with enhanced scoring
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=top_k * 3,  # Get more for re-ranking
                where=filters,
                include=["metadatas", "documents", "distances"]
            )

            # Convert to our format
            scored_results = []
            for i, (doc, metadata, distance) in enumerate(zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0]
            )):
                score = 1 - distance  # Convert distance to similarity

                scored_results.append({
                    "document": doc,
                    "metadata": metadata,
                    "score": score,
                    "original_distance": distance,
                    "retrieval_method": "fallback"
                })

            # Stage 2: Medical entity-aware re-ranking
            reranked_results = self._rerank_with_medical_entities(query, scored_results)

            # Stage 3: Evidence-based filtering
            filtered_results = self._filter_by_evidence_quality(reranked_results)

            # Return top results with enhanced metadata
            return filtered_results[:top_k]

        except Exception as e:
            self.logger.error(f"Fallback retrieval failed: {e}")
            return []

    def _rerank_with_medical_entities_langchain(self, query: str, results: List[Dict]) -> List[Dict]:
        """Re-rank LangChain results based on medical entity matching"""
        query_entities = self.extract_medical_entities(query)

        for result in results:
            metadata = result["metadata"]
            score = result["score"]

            # Get entities from the string format
            entities_str = metadata.get("entities_str", "{}")
            try:
                doc_entities = eval(entities_str) if entities_str != "{}" else {}
            except:
                doc_entities = {}

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

            result["score"] = score

        # Sort by final score
        return sorted(results, key=lambda x: x["score"], reverse=True)

    def _rerank_with_medical_entities(self, query: str, results: List[Dict]) -> List[Dict]:
        """Re-rank results based on medical entity matching (original method)"""
        query_entities = self.extract_medical_entities(query)

        for result in results:
            metadata = result["metadata"]
            score = result["score"]

            # Get entities from the string format
            entities_str = metadata.get("entities_str", "{}")
            try:
                doc_entities = eval(entities_str) if entities_str != "{}" else {}
            except:
                doc_entities = {}

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

            result["score"] = score

        # Sort by final score
        return sorted(results, key=lambda x: x["score"], reverse=True)

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
