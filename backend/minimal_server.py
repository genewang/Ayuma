#!/usr/bin/env python3
from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Medical GuidedPath AI API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Medical GuidedPath AI API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Medical GuidedPath AI API"}

if __name__ == "__main__":
    print("Starting minimal server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
