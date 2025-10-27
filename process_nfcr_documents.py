#!/usr/bin/env python3
# process_nfcr_documents.py
import asyncio
import logging
import sys
import os
from pathlib import Path

# Add backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from document_processor import DocumentProcessor
from main_controller import MedicalGuidedPathController

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NFCRDocumentProcessor:
    def __init__(self):
        self.document_processor = DocumentProcessor()
        self.controller = None
        self.nccn_dir = Path(__file__).parent / "nccn_guidelines"
        self.nfcr_dir = Path(__file__).parent / "nfcr-documents"

    async def initialize_system(self):
        """Initialize the RAG system"""
        try:
            self.controller = MedicalGuidedPathController()
            logger.info("RAG system initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize RAG system: {e}")
            return False

    async def process_all_documents(self, batch_size: int = 5, save_backup: bool = True):
        """Process all NCCN guidelines and NFCR documents and ingest them into the RAG system"""
        logger.info("Starting comprehensive document processing...")

        # Check directories exist
        directories_to_process = []
        if self.nccn_dir.exists():
            directories_to_process.append(str(self.nccn_dir))
            logger.info(f"NCCN Guidelines directory found: {self.nccn_dir}")
        else:
            logger.warning(f"NCCN Guidelines directory not found: {self.nccn_dir}")

        if self.nfcr_dir.exists():
            directories_to_process.append(str(self.nfcr_dir))
            logger.info(f"NFCR Documents directory found: {self.nfcr_dir}")
        else:
            logger.warning(f"NFCR Documents directory not found: {self.nfcr_dir}")

        if not directories_to_process:
            logger.error("No document directories found to process")
            return False

        # Process all documents from all directories
        all_documents = []
        for directory in directories_to_process:
            logger.info(f"Processing directory: {directory}")
            documents = self.document_processor.process_directory(directory)
            all_documents.extend(documents)
            logger.info(f"Found {len(documents)} documents in {directory}")

        if not all_documents:
            logger.error("No documents found to process")
            return False

        logger.info(f"Total documents found across all directories: {len(all_documents)}")

        # Save backup of processed documents
        if save_backup:
            backup_file = "processed_all_medical_documents_backup.json"
            self.document_processor.save_processed_documents(all_documents, backup_file)
            logger.info(f"Backup saved to {backup_file}")

        # Process documents in batches to avoid memory issues
        success_count = 0
        error_count = 0

        for i in range(0, len(all_documents), batch_size):
            batch = all_documents[i:i + batch_size]
            logger.info(f"Processing batch {i//batch_size + 1}/{(len(all_documents)-1)//batch_size + 1} ({len(batch)} documents)")

            try:
                # Ingest batch into RAG system
                result = await self.controller.update_medical_knowledge(batch)

                if result.get("success", False):
                    success_count += len(batch)
                    logger.info(f"Successfully ingested batch: {len(batch)} documents")
                else:
                    error_count += len(batch)
                    logger.error(f"Failed to ingest batch: {result.get('error', 'Unknown error')}")

                # Small delay to avoid overwhelming the system
                await asyncio.sleep(0.5)

            except Exception as e:
                error_count += len(batch)
                logger.error(f"Error processing batch: {e}")

        logger.info(f"Processing complete! Success: {success_count}, Errors: {error_count}")

        # Get system status
        try:
            status = await self.controller.get_system_status()
            logger.info(f"System status: {status}")
        except Exception as e:
            logger.error(f"Error getting system status: {e}")

        return success_count > 0

    async def process_specific_cancer_types(self, cancer_types: list, batch_size: int = 3):
        """Process documents for specific cancer types"""
        logger.info(f"Processing specific cancer types: {cancer_types}")

        # Find documents matching cancer types from both directories
        target_documents = []

        # Check both directories
        directories = [str(self.nccn_dir), str(self.nfcr_dir)]
        for directory in directories:
            if Path(directory).exists():
                for document in self.document_processor.process_directory(directory):
                    cancer_type = document.get('cancer_type', '').lower()
                    if any(ct.lower() in cancer_type for ct in cancer_types):
                        target_documents.append(document)

        if not target_documents:
            logger.warning(f"No documents found for cancer types: {cancer_types}")
            return False

        logger.info(f"Found {len(target_documents)} documents for specified cancer types")

        # Process in smaller batches for specific cancer types
        success_count = 0

        for i in range(0, len(target_documents), batch_size):
            batch = target_documents[i:i + batch_size]

            try:
                result = await self.controller.update_medical_knowledge(batch)
                if result.get("success", False):
                    success_count += len(batch)
                    logger.info(f"Successfully processed {len(batch)} documents for {cancer_types}")
                else:
                    logger.error(f"Failed to process batch: {result.get('error')}")

                await asyncio.sleep(0.3)

            except Exception as e:
                logger.error(f"Error processing cancer-specific batch: {e}")

        logger.info(f"Completed processing {success_count} documents for {cancer_types}")
        return success_count > 0

    def list_available_cancer_types(self):
        """List all available cancer types from both directories"""
        cancer_types = set()

        # Check both directories
        directories = [str(self.nccn_dir), str(self.nfcr_dir)]
        for directory in directories:
            if Path(directory).exists():
                for document in self.document_processor.process_directory(directory):
                    ct = document.get('cancer_type')
                    if ct:
                        cancer_types.add(ct)

        return sorted(list(cancer_types))

    async def test_single_document(self, document_name: str = None):
        """Test processing a single document"""
        if not document_name:
            # Pick the first PDF found from either directory
            for directory in [str(self.nccn_dir), str(self.nfcr_dir)]:
                if Path(directory).exists():
                    for file_path in Path(directory).glob("*.pdf"):
                        document_name = file_path.name
                        break
                if document_name:
                    break

        if not document_name:
            logger.error("No PDF documents found for testing")
            return False

        # Find the document in either directory
        test_doc = None
        for directory in [str(self.nccn_dir), str(self.nfcr_dir)]:
            if Path(directory).exists():
                documents = self.document_processor.process_directory(directory)
                for doc in documents:
                    if doc['file_name'] == document_name:
                        test_doc = doc
                        break
            if test_doc:
                break

        if not test_doc:
            logger.error(f"Could not process test document: {document_name}")
            return False

        logger.info(f"Testing with document: {document_name}")
        logger.info(f"Extracted text length: {len(test_doc['content'])} characters")
        logger.info(f"Cancer type detected: {test_doc.get('cancer_type', 'Unknown')}")
        logger.info(f"Institution detected: {test_doc.get('institution', 'Unknown')}")

        # Test RAG ingestion
        try:
            result = await self.controller.update_medical_knowledge([test_doc])
            if result.get("success", False):
                logger.info("Successfully ingested test document into RAG system")
                return True
            else:
                logger.error(f"Failed to ingest test document: {result.get('error')}")
                return False
        except Exception as e:
            logger.error(f"Error testing document ingestion: {e}")
            return False

async def main():
    """Main function to run the NFCR and NCCN document processing"""
    processor = NFCRDocumentProcessor()

    # Check command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == "test":
            logger.info("Running test mode...")
            success = await processor.test_single_document()
            if success:
                logger.info("Test completed successfully!")
            else:
                logger.error("Test failed!")
            return

        elif command == "list":
            logger.info("Available cancer types:")
            cancer_types = processor.list_available_cancer_types()
            for ct in cancer_types:
                print(f"  - {ct}")
            return

        elif command == "specific" and len(sys.argv) > 2:
            cancer_types = sys.argv[2].split(",")
            logger.info(f"Processing specific cancer types: {cancer_types}")
            success = await processor.process_specific_cancer_types(cancer_types)
            if success:
                logger.info("Specific cancer type processing completed!")
            else:
                logger.error("Specific cancer type processing failed!")
            return

    # Initialize system
    if not await processor.initialize_system():
        logger.error("Failed to initialize system. Exiting.")
        return

    # Process all documents
    logger.info("Processing all NFCR and NCCN documents...")
    success = await processor.process_all_documents()

    if success:
        logger.info("Document processing completed successfully!")
        logger.info("You can now query the RAG system about cancer treatments and guidelines.")
    else:
        logger.error("Document processing failed!")

if __name__ == "__main__":
    asyncio.run(main())
