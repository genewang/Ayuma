#!/usr/bin/env python3
import os
import sys
import logging
import json
from pathlib import Path
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_pdf_file(file_path: str) -> Dict[str, Any]:
    """Check if the PDF file exists and can be read"""
    result = {
        "file_exists": False,
        "file_size": 0,
        "is_pdf": False,
        "error": None
    }
    
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            result["error"] = f"File not found: {file_path}"
            return result
            
        result["file_exists"] = True
        
        # Check file size
        file_size = os.path.getsize(file_path)
        result["file_size"] = file_size
        
        if file_size == 0:
            result["error"] = "File is empty"
            return result
            
        # Check if it's a PDF file
        with open(file_path, 'rb') as f:
            header = f.read(4)
            result["is_pdf"] = (header == b'%PDF')
            
        return result
        
    except Exception as e:
        result["error"] = str(e)
        return result

def extract_text_with_pypdf(file_path: str) -> Dict[str, Any]:
    """Extract text from PDF using PyPDF2"""
    result = {
        "success": False,
        "num_pages": 0,
        "text_length": 0,
        "sample_text": "",
        "error": None
    }
    
    try:
        from pypdf import PdfReader
        
        with open(file_path, 'rb') as f:
            reader = PdfReader(f)
            num_pages = len(reader.pages)
            result["num_pages"] = num_pages
            
            text_parts = []
            for i, page in enumerate(reader.pages[:5]):  # Only read first 5 pages for sample
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                except Exception as e:
                    logger.warning(f"Error extracting text from page {i+1}: {e}")
            
            full_text = "\n\n".join(text_parts)
            result["text_length"] = len(full_text)
            result["sample_text"] = full_text[:1000]  # First 1000 chars as sample
            result["success"] = True
            
    except Exception as e:
        result["error"] = str(e)
    
    return result

def test_langchain_loading(file_path: str) -> Dict[str, Any]:
    """Test loading the document with LangChain"""
    result = {
        "success": False,
        "document_loaded": False,
        "page_content_length": 0,
        "metadata": {},
        "error": None
    }
    
    try:
        # Add backend directory to Python path
        sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
        from document_processor import DocumentProcessor
        
        processor = DocumentProcessor()
        document = processor.load_document(file_path)
        
        if document:
            result["document_loaded"] = True
            result["page_content_length"] = len(document.page_content)
            result["metadata"] = document.metadata
            result["success"] = True
        else:
            result["error"] = "Failed to load document"
            
    except Exception as e:
        result["error"] = str(e)
    
    return result

def main():
    # Path to the Breast Cancer PDF
    pdf_path = os.path.join("nccn_guidelines", "Breast Cancer.pdf")
    
    # Check if the file exists and is readable
    logger.info(f"Checking PDF file: {pdf_path}")
    file_check = check_pdf_file(pdf_path)
    print("\n=== File Check ===")
    print(json.dumps(file_check, indent=2))
    
    if not file_check.get("file_exists") or not file_check.get("is_pdf"):
        logger.error("Invalid PDF file. Please check the file path and try again.")
        return
    
    # Try to extract text with PyPDF2 directly
    logger.info("\nExtracting text with PyPDF2...")
    pdf_text = extract_text_with_pypdf(pdf_path)
    print("\n=== PyPDF2 Text Extraction ===")
    print(json.dumps({
        "success": pdf_text["success"],
        "num_pages": pdf_text["num_pages"],
        "text_length": pdf_text["text_length"],
        "sample_text": pdf_text["sample_text"],
        "error": pdf_text.get("error")
    }, indent=2))
    
    # Try loading with LangChain
    logger.info("\nTesting LangChain document loading...")
    langchain_result = test_langchain_loading(pdf_path)
    print("\n=== LangChain Loading Test ===")
    print(json.dumps(langchain_result, indent=2))
    
    # Print detailed error if any
    if not langchain_result.get("success"):
        logger.error("\nLangChain loading failed. Possible issues:")
        logger.error("1. Missing dependencies (e.g., pypdf, langchain, etc.)")
        logger.error("2. Corrupted PDF file")
        logger.error("3. Permission issues")
        logger.error(f"Error details: {langchain_result.get('error')}")
    
    print("\nDiagnosis complete!")

if __name__ == "__main__":
    main()
