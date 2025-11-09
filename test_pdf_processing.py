#!/usr/bin/env python3
# test_pdf_processing.py
import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from document_processor import DocumentProcessor

# Path to a test PDF file
test_pdf = "nccn_guidelines/Breast Cancer.pdf"

def test_pdf_processing():
    """Test PDF processing with the DocumentProcessor"""
    if not os.path.exists(test_pdf):
        logger.error(f"Test PDF not found: {test_pdf}")
        return False
    
    logger.info(f"Testing PDF processing with: {test_pdf}")
    
    # Initialize the document processor
    processor = DocumentProcessor()
    
    # Test text extraction
    try:
        logger.info("Testing text extraction...")
        text = processor.extract_text_from_file(test_pdf)
        if not text or not text.strip():
            logger.error("No text extracted from PDF")
            return False
            
        logger.info(f"Successfully extracted {len(text)} characters of text")
        logger.info("First 500 characters of extracted text:")
        print("-" * 80)
        print(text[:500] + "...")
        print("-" * 80)
        
        # Test document loading
        logger.info("Testing document loading...")
        doc = processor.load_document(test_pdf)
        if not doc:
            logger.error("Failed to load document")
            return False
            
        logger.info("Successfully loaded document")
        logger.info(f"Document metadata: {doc.metadata}")
        
        # Test metadata extraction
        logger.info("Testing metadata extraction...")
        metadata = processor.extract_metadata_from_file(test_pdf)
        logger.info(f"Extracted metadata: {metadata}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error during PDF processing test: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    if test_pdf_processing():
        logger.info("PDF processing test completed successfully!")
    else:
        logger.error("PDF processing test failed")
