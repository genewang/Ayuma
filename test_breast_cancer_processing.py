#!/usr/bin/env python3
import asyncio
import logging
import os
import sys
import json
from pathlib import Path
from typing import Dict, Any, Optional, List

# Add backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from document_processor import DocumentProcessor
from medical_rag import MedicalRAGSystem

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for more detailed logs
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TestBreastCancerProcessing:
    def __init__(self):
        self.doc_processor = DocumentProcessor()
        self.rag_system = MedicalRAGSystem()
        
    async def initialize(self):
        """Initialize the RAG system and verify components"""
        logger.info("Initializing RAG system...")
        try:
            # Check if we can create the vector store directory
            os.makedirs("data/vector_store", exist_ok=True)
            logger.info("Vector store directory is ready")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize: {e}")
            return False
    
    def load_document(self, file_path: str):
        """Load and validate the document"""
        logger.info(f"Loading document: {file_path}")
        
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return None
            
        # Check file size
        file_size = os.path.getsize(file_path)
        logger.info(f"File size: {file_size} bytes")
        
        # Try loading with document processor
        document = self.doc_processor.load_document(file_path)
        
        if not document:
            logger.error("Failed to load document")
            return None
            
        logger.info(f"Successfully loaded document with {len(document.page_content)} characters")
        logger.debug(f"Document metadata: {json.dumps(document.metadata, indent=2, default=str)}")
        
        return document
    
    def prepare_document_data(self, document, file_path: str) -> Dict[str, Any]:
        """Prepare document data for ingestion"""
        doc_data = {
            "id": "breast_cancer_guidelines_2025",
            "content": document.page_content,
            "source": "NCCN Guidelines",
            "institution": "NCCN",
            "evidence_level": "1A",
            "publication_date": "2025-04-17",
            "document_type": "guideline",
            "cancer_type": "breast cancer",
            "title": "NCCN Guidelines for Breast Cancer (v4.2025)",
            "file_path": file_path,
            **document.metadata
        }
        
        # Ensure all values are serializable
        for k, v in doc_data.items():
            if v is None:
                doc_data[k] = ""
                
        return doc_data
    
    async def test_query(self, query: str, filters: Optional[Dict] = None, top_k: int = 3):
        """Test querying the RAG system"""
        if filters is None:
            filters = {"cancer_type": "breast cancer"}
            
        logger.info(f"Testing query: {query}")
        logger.info(f"Using filters: {filters}")
        
        try:
            context = await self.rag_system.retrieve_relevant_context(
                query=query,
                filters=filters,
                top_k=top_k
            )
            
            if not context:
                logger.warning("No context returned from retrieve_relevant_context")
                return
                
            logger.info(f"Context keys: {list(context.keys())}")
            
            if "documents" in context:
                docs = context["documents"]
                logger.info(f"Retrieved {len(docs)} document sets")
                
                for i, doc_set in enumerate(docs):
                    logger.info(f"--- Document Set {i+1} ---")
                    for j, doc in enumerate(doc_set[:top_k]):
                        content = doc.get("page_content", doc.get("content", "No content"))
                        logger.info(f"--- Result {j+1} ---")
                        logger.info(f"Score: {doc.get('score', 'N/A')}")
                        logger.info(f"Metadata: {json.dumps({k: v for k, v in doc.items() if k not in ['page_content', 'content']}, default=str)}")
                        logger.info(f"Content (first 200 chars): {content[:200]}...")
                        logger.info("---")
            else:
                logger.warning("No 'documents' key in context")
                logger.debug(f"Full context: {json.dumps(context, indent=2, default=str)}")
                
        except Exception as e:
            logger.error(f"Error during query: {e}", exc_info=True)
    
    async def run(self, file_path: str):
        """Run the full test pipeline"""
        if not await self.initialize():
            return False
            
        # Load the document
        document = self.load_document(file_path)
        if not document:
            return False
            
        # Prepare document data
        doc_data = self.prepare_document_data(document, file_path)
        
        # Ingest the document
        logger.info("Ingesting document into RAG system...")
        try:
            result = await self.rag_system.ingest_medical_documents([doc_data])
            logger.info(f"Ingestion result: {json.dumps(result, indent=2, default=str)}")
            
            if not result.get("success", False):
                logger.error(f"Failed to ingest document: {result.get('error', 'Unknown error')}")
                return False
                
            # Test some queries
            queries = [
                "What are the first-line treatment options for HER2-positive breast cancer?",
                "What is the recommended treatment for metastatic breast cancer?",
                "What are the NCCN guidelines for breast cancer screening?"
            ]
            
            for query in queries:
                await self.test_query(query)
                
            return True
            
        except Exception as e:
            logger.error(f"Error during ingestion: {e}", exc_info=True)
            return False

async def main():
    # Path to the Breast Cancer PDF
    pdf_path = os.path.join("nccn_guidelines", "Breast Cancer.pdf")
    
    if not os.path.exists(pdf_path):
        logger.error(f"PDF file not found: {pdf_path}")
        return
    
    # Run the test
    tester = TestBreastCancerProcessing()
    success = await tester.run(pdf_path)
    
    if success:
        logger.info("Test completed successfully!")
    else:
        logger.error("Test failed!")

if __name__ == "__main__":
    asyncio.run(main())
