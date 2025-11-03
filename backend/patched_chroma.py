import sys
import numpy as np
import warnings

# Monkey patch numpy to handle float_ for ChromaDB
if not hasattr(np, 'float_'):
    np.float_ = np.float64
    warnings.warn("Patched np.float_ to use np.float64 for ChromaDB compatibility")

# Now import chromadb after patching
import chromadb
from chromadb.config import Settings

class PatchedChromaClient(chromadb.Client):
    """A patched version of ChromaDB client that handles NumPy 2.0+ compatibility"""
    def __init__(self, settings: Settings = None):
        super().__init__(settings)
        
    @classmethod
    def from_system(cls) -> 'PatchedChromaClient':
        """Create a client with system settings"""
        return cls()

# Export the patched client
Client = PatchedChromaClient
PersistentClient = PatchedChromaClient
HttpClient = chromadb.HttpClient

# Re-export other commonly used components
from chromadb.api import API
from chromadb.api.types import *

# Make sure we can still access the original module
sys.modules['chromadb.original'] = chromadb

# Replace the module's exports
sys.modules['chromadb'].Client = Client
sys.modules['chromadb'].PersistentClient = PersistentClient

# This ensures that when someone does 'from chromadb import Client', they get our patched version
__all__ = [
    'Client',
    'PersistentClient',
    'HttpClient',
    'API',
    *[name for name in dir() if not name.startswith('_')]
]
