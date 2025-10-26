# main.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import logging
import json
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Medical GuidedPath AI API",
    version="1.0.0",
    description="Professional AI-powered medical guidance system with RAG and multi-LLM coordination"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global controller instance
controller = None

async def initialize_controller():
    """Initialize the controller asynchronously"""
    global controller
    try:
        from main_controller import MedicalGuidedPathController
        controller = MedicalGuidedPathController()
        logger.info("Controller initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize controller: {e}")
        return False

# Pydantic models for API
class MedicalQuery(BaseModel):
    query: str
    patient_context: Optional[Dict] = None

class BatchQuery(BaseModel):
    queries: List[str]
    patient_context: Optional[Dict] = None

class DocumentIngestion(BaseModel):
    documents: List[Dict]

class SystemStatus(BaseModel):
    status: str
    documents_indexed: int
    conversations_processed: int
    average_response_time: float
    models_available: List[str]

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Medical GuidedPath AI API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Medical GuidedPath AI API"}

@app.get("/api/status")
async def get_system_status() -> SystemStatus:
    """Get system status and performance metrics"""
    if controller is None:
        return SystemStatus(
            status="initializing",
            documents_indexed=0,
            conversations_processed=0,
            average_response_time=0,
            models_available=["mock"]
        )

    try:
        status = await controller.get_system_status()
        return SystemStatus(**status)
    except Exception as e:
        logger.error(f"Error getting system status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query")
async def process_medical_query(query: MedicalQuery):
    """Process a single medical query"""
    if controller is None:
        return {
            "success": False,
            "error": "AI system is still initializing. Please try again in a moment.",
            "data": {
                "answer": "The AI system is currently initializing. Please wait a moment and try your query again.",
                "model_used": "initializing",
                "citations": [],
                "confidence": 0,
                "processing_time": 0
            }
        }

    try:
        result = await controller.process_medical_query(
            query.query,
            query.patient_context
        )
        return {
            "success": True,
            "data": result,
            "query_id": result.get("query_id")
        }
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/batch-query")
async def process_batch_queries(batch: BatchQuery):
    """Process multiple queries in batch"""
    if controller is None:
        return {
            "success": False,
            "error": "AI system is still initializing",
            "data": []
        }

    try:
        results = await controller.batch_process_queries(
            batch.queries,
            batch.patient_context
        )
        return {
            "success": True,
            "data": results,
            "batch_size": len(results)
        }
    except Exception as e:
        logger.error(f"Error processing batch queries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest-documents")
async def ingest_medical_documents(docs: DocumentIngestion):
    """Ingest medical documents into the knowledge base"""
    if controller is None:
        return {
            "success": False,
            "error": "AI system is still initializing"
        }

    try:
        result = await controller.update_medical_knowledge(docs.documents)
        return {
            "success": True,
            "message": f"Ingested {len(docs.documents)} documents",
            "result": result
        }
    except Exception as e:
        logger.error(f"Error ingesting documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {
        "success": False,
        "error": "Internal server error",
        "details": str(exc) if logger.level <= logging.DEBUG else "Contact support"
    }

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize system on startup"""
    logger.info("Starting Medical GuidedPath AI API...")

    # Initialize controller in background
    asyncio.create_task(initialize_controller())

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Medical GuidedPath AI API...")
    if controller:
        await controller.clear_conversation_history()

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Medical GuidedPath AI API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development")
    parser.add_argument("--log-level", default="info", help="Logging level")

    args = parser.parse_args()

    # Set logging level
    numeric_level = getattr(logging, args.log_level.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f'Invalid log level: {args.log_level}')
    logging.basicConfig(level=numeric_level)

    logger.info(f"Starting server on {args.host}:{args.port}")

    uvicorn.run(
        "main:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level=args.log_level
    )
