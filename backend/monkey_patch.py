import sys
import numpy as np
import warnings

# Apply monkey patches before any other imports
if not hasattr(np, 'float_'):
    np.float_ = np.float64
    warnings.warn("Applied monkey patch: np.float_ = np.float64")

# Now import chromadb after patching
import chromadb

# Store the original PersistentClient
_original_persistent_client = chromadb.PersistentClient

# Create a patched version of PersistentClient
class PatchedPersistentClient(chromadb.PersistentClient):
    def __init__(self, *args, **kwargs):
        # Ensure np.float_ is patched
        if not hasattr(np, 'float_'):
            np.float_ = np.float64
        super().__init__(*args, **kwargs)

# Apply the patch
def apply_patches():
    """Apply all necessary patches"""
    chromadb.PersistentClient = PatchedPersistentClient
    return True

# Apply patches when imported
apply_patches()

# Export the patched client
Client = PatchedPersistentClient
PersistentClient = PatchedPersistentClient

# Re-export other commonly used components
from chromadb.api import API
from chromadb.api.types import *

__all__ = [
    'Client',
    'PersistentClient',
    'API',
    *[name for name in dir() if not name.startswith('_')]
]
