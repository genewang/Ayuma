import sys
import numpy as np
from pprint import pprint

def test_numpy():
    print("Testing NumPy version and compatibility...")
    print(f"Python version: {sys.version}")
    print(f"NumPy version: {np.__version__}")
    
    # Test basic NumPy functionality
    try:
        arr = np.array([1, 2, 3], dtype=np.float64)
        print(f"Successfully created NumPy array: {arr}")
        print(f"Array dtype: {arr.dtype}")
        return True
    except Exception as e:
        print(f"Error creating NumPy array: {e}")
        return False

if __name__ == "__main__":
    success = test_numpy()
    if success:
        print("\nNumPy test passed!")
    else:
        print("\nNumPy test failed!")
