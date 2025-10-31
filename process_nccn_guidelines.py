import os
import sys
import json
from pathlib import Path
from typing import List, Dict, Optional, Any
import logging
from datetime import datetime
import PyPDF2
from tqdm import tqdm

# Add the project root directory to the Python path
project_root = str(Path(__file__).parent.absolute())
sys.path.insert(0, project_root)

# Set to False to skip LangChain for now
HAS_LANGCHAIN = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("nccn_processing.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class NCCNProcessor:
    def __init__(self, nccn_dir: str, output_dir: str = "nccn_processed"):
        """Initialize the NCCN Processor with directories and models."""
        self.nccn_dir = Path(nccn_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # For now, we'll just do basic PDF processing
        self.has_langchain = False
        
        # Create metadata for NCCN guidelines
        self.base_metadata = {
            "source": "NCCN Guidelines",
            "institution": "National Comprehensive Cancer Network",
            "evidence_level": "NCCN Category 1",
            "document_type": "clinical_guideline",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
        }
    
    def extract_text_from_pdf(self, pdf_path: Path) -> Optional[Dict[str, Any]]:
        """Extract text from a PDF file using PyPDF2 as a fallback."""
        try:
            text = []
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text.append(page_text)
            
            if not text:
                logger.warning(f"No text extracted from {pdf_path.name}")
                return None
                
            return {
                "content": "\n\n".join(text),
                "metadata": {
                    **self.base_metadata,
                    "cancer_type": pdf_path.stem,
                    "file_name": pdf_path.name,
                    "file_size": os.path.getsize(pdf_path),
                    "processing_date": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path.name}: {str(e)}")
            return None
    
    def process_guidelines(self) -> List[Dict]:
        """Process all NCCN guidelines in the directory."""
        pdf_files = list(self.nccn_dir.glob("*.pdf"))
        if not pdf_files:
            logger.warning(f"No PDF files found in {self.nccn_dir}")
            return []
        
        processed_docs = []
        
        for pdf_path in tqdm(pdf_files, desc="Processing NCCN Guidelines"):
            try:
                logger.info(f"Processing {pdf_path.name}...")
                
                # Extract cancer type from filename
                cancer_type = pdf_path.stem
                
                # Use basic PDF extraction
                doc_data = self.extract_text_from_pdf(pdf_path)
                if not doc_data:
                    raise ValueError("Failed to extract text from PDF")
                
                # Save the processed text
                output_file = self.output_dir / f"{cancer_type}_processed.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(doc_data, f, ensure_ascii=False, indent=2)
                
                # RAG system integration will be handled separately
                
                processed_docs.append({
                    "file": pdf_path.name,
                    "status": "success",
                    "output_file": str(output_file),
                    "content_length": len(doc_data["content"])
                })
                
                logger.info(f"Successfully processed {pdf_path.name} (saved to {output_file})")
                
            except Exception as e:
                logger.error(f"Error processing {pdf_path.name}: {str(e)}", exc_info=True)
                processed_docs.append({
                    "file": str(pdf_path),
                    "status": "error",
                    "error": str(e)
                })
        
        return processed_docs

def main():
    # Check if NCCN directory exists
    nccn_dir = Path("nccn_guidelines")
    if not nccn_dir.exists() or not nccn_dir.is_dir():
        logger.error(f"NCCN directory not found at {nccn_dir.absolute()}")
        return
    
    # Process the guidelines
    processor = NCCNProcessor(nccn_dir)
    logger.info(f"Starting to process NCCN guidelines from {nccn_dir}")
    
    try:
        results = processor.process_guidelines()
        
        # Save processing summary
        summary = {
            "timestamp": datetime.now().isoformat(),
            "total_files": len(list(nccn_dir.glob("*.pdf"))),
            "processed_successfully": len([r for r in results if r['status'] == 'success']),
            "failed": len([r for r in results if r['status'] == 'error']),
            "details": results
        }
        
        summary_file = "nccn_processing_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Processing complete! Summary saved to {summary_file}")
        logger.info(f"Successfully processed {summary['processed_successfully']} out of {summary['total_files']} files")
        
    except Exception as e:
        logger.error(f"Fatal error during processing: {str(e)}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
