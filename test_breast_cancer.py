#!/usr/bin/env python3
# test_breast_cancer.py
import asyncio
import logging
import sys
import os
from pathlib import Path

# Add backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from document_processor import DocumentProcessor
from medical_rag import MedicalRAGSystem

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_breast_cancer():
    # Initialize the document processor
    doc_processor = DocumentProcessor()
    
    # Initialize the RAG system
    rag_system = MedicalRAGSystem()
    
    # Path to the breast cancer guideline
    breast_cancer_pdf = "nccn_guidelines/Breast Cancer.pdf"
    
    if not os.path.exists(breast_cancer_pdf):
        logger.error(f"File not found: {breast_cancer_pdf}")
        return False
    
    try:
        logger.info(f"Processing document: {breast_cancer_pdf}")
        
        # Extract text and metadata
        metadata = doc_processor.extract_metadata_from_file(breast_cancer_pdf)
        text = doc_processor.extract_text_from_file(breast_cancer_pdf)
        
        if not text or len(text.strip()) == 0:
            logger.error("Failed to extract text from the document")
            return False
            
        logger.info(f"Successfully extracted {len(text)} characters of text")
        logger.info(f"Document metadata: {metadata}")
        
        # Create a document for ingestion
        document = {
            "content": text,
            "metadata": {
                "source": breast_cancer_pdf,
                "title": os.path.basename(breast_cancer_pdf),
                "cancer_type": "Breast Cancer",
                "document_type": "Clinical Guideline",
                "publication_date": metadata.get("creation_date", ""),
                "source_organization": "NCCN"
            }
        }
        
        # Ingest the document
        logger.info("Ingesting document into the RAG system...")
        await rag_system.ingest_medical_documents([document])
        logger.info("Document successfully ingested!")
        
        # Test a query with a specific cancer type filter
        query = "What are the recommended treatments for early-stage breast cancer?"
        logger.info(f"Querying: {query}")
        
        try:
            # Add a filter for breast cancer to make the query more specific
            filters = {
                "cancer_type": "Breast Cancer"
            }
            
            results = await rag_system.retrieve_relevant_context(query, filters=filters, top_k=3)
            
            if results and len(results) > 0:
                logger.info(f"Found {len(results)} results for the query")
                for i, result in enumerate(results, 1):
                    logger.info(f"\n--- Result {i} ---")
                    # Handle different possible result formats
                    if isinstance(result, dict):
                        content = result.get('page_content') or result.get('content', 'No content')
                        metadata = result.get('metadata', {})
                        logger.info(f"Content: {str(content)[:200]}...")
                        logger.info(f"Metadata: {metadata}")
                    else:
                        logger.info(f"Result (raw): {str(result)[:300]}...")
            else:
                logger.warning("No results found for the query")
                
            # Also try a simpler query without filters
            logger.info("\nTrying a simpler query without filters...")
            simple_query = "breast cancer treatment"
            results = await rag_system.retrieve_relevant_context(simple_query, top_k=2)
            
            if results and len(results) > 0:
                logger.info(f"Found {len(results)} results for simple query")
                for i, result in enumerate(results, 1):
                    logger.info(f"\n--- Simple Result {i} ---")
                    if isinstance(result, dict):
                        content = result.get('page_content') or result.get('content', 'No content')
                        metadata = result.get('metadata', {})
                        logger.info(f"Content: {str(content)[:200]}...")
                        logger.info(f"Source: {metadata.get('source', 'N/A')}")
                    else:
                        logger.info(f"Result (raw): {str(result)[:300]}...")
            else:
                logger.warning("No results found for the simple query")
                
        except Exception as e:
            logger.error(f"Error during query: {str(e)}", exc_info=True)
            
        return True
        
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    asyncio.run(test_breast_cancer())
