import sys
import os
import logging
from patched_chroma import PersistentClient as ChromaClient

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_chroma_patch():
    """Test if our ChromaDB patch works with NumPy 2.0+"""
    try:
        # Create a test directory
        test_dir = "./test_chroma_data"
        os.makedirs(test_dir, exist_ok=True)
        
        logger.info(f"Testing ChromaDB with directory: {os.path.abspath(test_dir)}")
        
        # Initialize the patched client
        client = ChromaClient(path=test_dir)
        
        # Create a test collection
        collection = client.get_or_create_collection(
            name="test_collection",
            metadata={"hnsw:space": "cosine"}
        )
        
        # Add some test data
        test_documents = ["This is a test document", "Another test document"]
        test_embeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]]
        test_ids = ["doc1", "doc2"]
        
        collection.add(
            documents=test_documents,
            embeddings=test_embeddings,
            ids=test_ids
        )
        
        # Query the collection
        results = collection.query(
            query_embeddings=[[0.1, 0.2, 0.3]],
            n_results=1
        )
        
        logger.info("Test query results:")
        for i, doc in enumerate(results['documents'][0]):
            logger.info(f"Result {i+1}: {doc}")
        
        logger.info("✅ ChromaDB patch test passed!")
        return True
        
    except Exception as e:
        logger.error(f"❌ ChromaDB patch test failed: {e}", exc_info=True)
        return False
    finally:
        # Clean up
        try:
            client.delete_collection("test_collection")
            os.rmdir(test_dir)
        except:
            pass

if __name__ == "__main__":
    success = test_chroma_patch()
    sys.exit(0 if success else 1)
