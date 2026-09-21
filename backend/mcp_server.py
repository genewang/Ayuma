#!/usr/bin/env python3
"""
MCP Server for Medical GuidedPath AI
Exposes medical AI capabilities as MCP tools and resources
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, Resource, TextContent
import sys
import os

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# Import existing medical AI components
from main_controller import MedicalGuidedPathController

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize MCP server
app = Server("medical-guidedpath-ai")

# Global controller instance
controller: Optional[MedicalGuidedPathController] = None

async def initialize_controller():
    """Initialize the medical AI controller"""
    global controller
    if controller is None:
        controller = MedicalGuidedPathController()
        logger.info("Medical AI Controller initialized")
    return controller

@app.list_resources()
async def list_resources() -> List[Resource]:
    """List available MCP resources"""
    return [
        Resource(
            uri="medical://guidelines/status",
            name="System Status",
            description="Current status of the medical AI system",
            mimeType="application/json"
        ),
        Resource(
            uri="medical://guidelines/capilities",
            name="AI Capabilities",
            description="Available AI capabilities and models",
            mimeType="application/json"
        )
    ]

@app.read_resource()
async def read_resource(uri: str) -> str:
    """Read a specific resource"""
    ctrl = await initialize_controller()
    
    if uri == "medical://guidelines/status":
        status = await ctrl.get_system_status()
        return json.dumps(status, indent=2)
    elif uri == "medical://guidelines/capilities":
        capabilities = {
            "available_models": list(ctrl.llm_coordinator.models.keys()),
            "rag_system": "active",
            "evidence_ranking": "enabled",
            "document_processing": "available"
        }
        return json.dumps(capabilities, indent=2)
    else:
        raise ValueError(f"Unknown resource: {uri}")

@app.list_tools()
async def list_tools() -> List[Tool]:
    """List available MCP tools"""
    return [
        Tool(
            name="process_medical_query",
            description="Process a medical query using AI and RAG system with evidence-based responses",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The medical query to process"
                    },
                    "patient_context": {
                        "type": "object",
                        "description": "Optional patient context for personalized responses",
                        "properties": {
                            "cancer_type": {"type": "string"},
                            "cancer_stage": {"type": "string"},
                            "biomarkers": {"type": "array", "items": {"type": "string"}},
                            "previous_treatments": {"type": "array", "items": {"type": "string"}}
                        }
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="validate_medical_query",
            description="Validate and analyze a medical query for medical entities and complexity",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The medical query to validate"
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="ingest_medical_documents",
            description="Ingest medical documents into the knowledge base for RAG system",
            inputSchema={
                "type": "object",
                "properties": {
                    "documents": {
                        "type": "array",
                        "description": "Array of medical documents to ingest",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string"},
                                "content": {"type": "string"},
                                "metadata": {"type": "object"},
                                "source": {"type": "string"},
                                "institution": {"type": "string"},
                                "evidence_level": {"type": "string"}
                            },
                            "required": ["id", "content"]
                        }
                    }
                },
                "required": ["documents"]
            }
        ),
        Tool(
            name="get_system_status",
            description="Get current system status and performance metrics",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="extract_medical_entities",
            description="Extract medical entities (diagnoses, treatments, drugs, etc.) from text",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "Text to extract medical entities from"
                    }
                },
                "required": ["text"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """Execute a tool call"""
    ctrl = await initialize_controller()
    
    try:
        if name == "process_medical_query":
            query = arguments.get("query")
            patient_context = arguments.get("patient_context")
            
            if not query:
                raise ValueError("Query is required")
            
            result = await ctrl.process_medical_query(query, patient_context)
            return [TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        
        elif name == "validate_medical_query":
            query = arguments.get("query")
            
            if not query:
                raise ValueError("Query is required")
            
            entities = ctrl.rag_system.extract_medical_entities(query)
            validation_result = {
                "query_analysis": {
                    "entities_found": entities,
                    "query_type": "medical_treatment",
                    "complexity": "moderate",
                    "requires_citations": True
                },
                "validation_status": "valid"
            }
            return [TextContent(
                type="text",
                text=json.dumps(validation_result, indent=2)
            )]
        
        elif name == "ingest_medical_documents":
            documents = arguments.get("documents")
            
            if not documents:
                raise ValueError("Documents are required")
            
            result = await ctrl.update_medical_knowledge(documents)
            return [TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        
        elif name == "get_system_status":
            status = await ctrl.get_system_status()
            return [TextContent(
                type="text",
                text=json.dumps(status, indent=2)
            )]
        
        elif name == "extract_medical_entities":
            text = arguments.get("text")
            
            if not text:
                raise ValueError("Text is required")
            
            entities = ctrl.rag_system.extract_medical_entities(text)
            return [TextContent(
                type="text",
                text=json.dumps(entities, indent=2)
            )]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except Exception as e:
        logger.error(f"Error executing tool {name}: {e}")
        return [TextContent(
            type="text",
            text=json.dumps({
                "success": False,
                "error": str(e),
                "tool": name
            }, indent=2)
        )]

async def main():
    """Main entry point for MCP server"""
    logger.info("Starting Medical GuidedPath AI MCP Server...")
    
    # Run the MCP server with stdio transport
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
