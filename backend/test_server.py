#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, '.')

print("Testing server components...")

try:
    from main_controller import MedicalGuidedPathController
    print("✓ Main controller imported successfully")
except Exception as e:
    print(f"✗ Main controller import failed: {e}")
    sys.exit(1)

try:
    from fastapi import FastAPI
    print("✓ FastAPI imported successfully")
except Exception as e:
    print(f"✗ FastAPI import failed: {e}")
    sys.exit(1)

try:
    import uvicorn
    print("✓ Uvicorn imported successfully")
except Exception as e:
    print(f"✗ Uvicorn import failed: {e}")
    sys.exit(1)

print("All components imported successfully!")
print("Starting server on http://localhost:8000")
print("API docs will be available at http://localhost:8000/docs")

# Start the server
from main import app
uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
