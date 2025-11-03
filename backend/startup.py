"""
Startup script that applies necessary patches before importing other modules.
"""
import os
import sys
import numpy as np
import warnings

# Apply numpy patches before any other imports
if not hasattr(np, 'float_'):
    np.float_ = np.float64
    warnings.warn("Patched np.float_ to use np.float64 for compatibility")

# Now import the main application
from main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("startup:app", host="0.0.0.0", port=8000, reload=True)
