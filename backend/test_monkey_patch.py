import sys
import os
import numpy as np
from monkey_patch import apply_patches

def test_monkey_patch():
    print("Testing NumPy monkey patch...")
    
    # Check if np.float_ exists
    if not hasattr(np, 'float_'):
        print("❌ np.float_ is not defined")
        return False
    
    print(f"✅ np.float_ is defined as: {np.float_}")
    
    # Test if we can create a ChromaDB client
    try:
        from chromadb import PersistentClient
        
        test_dir = "./test_chroma_data"
        os.makedirs(test_dir, exist_ok=True)
        
        print(f"\nTesting ChromaDB with directory: {os.path.abspath(test_dir)}")
        
        # This should work with our monkey patch
        client = PersistentClient(path=test_dir)
        collection = client.get_or_create_collection("test_collection")
        
        print("✅ Successfully created ChromaDB client and collection")
        
        # Clean up
        client.delete_collection("test_collection")
        os.rmdir(test_dir)
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing ChromaDB: {e}")
        return False

if __name__ == "__main__":
    # Apply patches
    apply_patches()
    
    # Run tests
    success = test_monkey_patch()
    
    if success:
        print("\n✅ All tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)
