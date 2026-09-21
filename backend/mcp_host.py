#!/usr/bin/env python3
"""
MCP Host for Medical GuidedPath AI
Manages MCP server lifecycle and provides HTTP endpoint for MCP communication
"""

import asyncio
import json
import logging
import subprocess
import sys
import os
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app for MCP host
app = FastAPI(
    title="Medical GuidedPath AI MCP Host",
    version="1.0.0",
    description="MCP Host for medical AI system with HTTP transport"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP server process
mcp_server_process: Optional[subprocess.Popen] = None

class MCPRequest(BaseModel):
    jsonrpc: str
    id: Optional[str | int] = None
    method: str
    params: Optional[Dict[str, Any]] = None

class MCPResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: Optional[str | int] = None
    result: Optional[Any] = None
    error: Optional[Dict[str, Any]] = None

async def start_mcp_server():
    """Start the MCP server as a subprocess"""
    global mcp_server_process
    
    if mcp_server_process and mcp_server_process.poll() is None:
        logger.info("MCP server already running")
        return
    
    try:
        # Start MCP server using stdio transport
        mcp_server_process = subprocess.Popen(
            [sys.executable, "-m", "mcp_server"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=0
        )
        logger.info(f"MCP server started with PID: {mcp_server_process.pid}")
    except Exception as e:
        logger.error(f"Failed to start MCP server: {e}")
        raise

async def stop_mcp_server():
    """Stop the MCP server"""
    global mcp_server_process
    
    if mcp_server_process:
        mcp_server_process.terminate()
        try:
            mcp_server_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            mcp_server_process.kill()
            mcp_server_process.wait()
        
        logger.info("MCP server stopped")
        mcp_server_process = None

@app.on_event("startup")
async def startup_event():
    """Initialize MCP host on startup"""
    logger.info("Starting Medical GuidedPath AI MCP Host...")
    await start_mcp_server()

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Medical GuidedPath AI MCP Host...")
    await stop_mcp_server()

@app.post("/mcp")
async def handle_mcp_request(request: MCPRequest) -> MCPResponse:
    """
    Handle MCP requests over HTTP transport
    This provides a bridge between HTTP clients and the stdio-based MCP server
    """
    try:
        # For now, we'll directly import and use the MCP server functions
        # In production, this would communicate with the subprocess via stdio
        from mcp_server import app as mcp_app_server
        
        # Convert HTTP request to MCP protocol
        # This is a simplified implementation - in production you'd use proper stdio communication
        response = MCPResponse(
            jsonrpc="2.0",
            id=request.id
        )
        
        # Handle different MCP methods
        if request.method == "initialize":
            response.result = {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {},
                    "resources": {}
                },
                "serverInfo": {
                    "name": "medical-guidedpath-ai",
                    "version": "1.0.0"
                }
            }
        elif request.method == "tools/list":
            from mcp_server import list_tools
            tools = await list_tools()
            response.result = {"tools": [tool.model_dump() for tool in tools]}
        elif request.method == "tools/call":
            from mcp_server import call_tool
            tool_result = await call_tool(
                request.params.get("name", ""),
                request.params.get("arguments", {})
            )
            response.result = {
                "content": [
                    {
                        "type": content.type,
                        "text": content.text
                    }
                    for content in tool_result
                ]
            }
        elif request.method == "resources/list":
            from mcp_server import list_resources
            resources = await list_resources()
            response.result = {"resources": [resource.model_dump() for resource in resources]}
        elif request.method == "resources/read":
            from mcp_server import read_resource
            content = await read_resource(request.params.get("uri", ""))
            response.result = {
                "content": [
                    {
                        "type": "text",
                        "text": content
                    }
                ]
            }
        else:
            response.error = {
                "code": -32601,
                "message": f"Method not found: {request.method}"
            }
        
        return response
    
    except Exception as e:
        logger.error(f"Error handling MCP request: {e}")
        return MCPResponse(
            jsonrpc="2.0",
            id=request.id,
            error={
                "code": -32603,
                "message": str(e)
            }
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "mcp_server_running": mcp_server_process is not None and mcp_server_process.poll() is None
    }

@app.get("/")
async def root():
    """Root endpoint with MCP host information"""
    return {
        "name": "Medical GuidedPath AI MCP Host",
        "version": "1.0.0",
        "description": "MCP Host providing HTTP transport for medical AI tools",
        "endpoints": {
            "mcp": "/mcp - MCP protocol endpoint",
            "health": "/health - Health check"
        }
    }

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Medical GuidedPath AI MCP Host")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8001, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    
    args = parser.parse_args()
    
    logger.info(f"Starting MCP Host on {args.host}:{args.port}")
    
    uvicorn.run(
        "mcp_host:app",
        host=args.host,
        port=args.port,
        reload=args.reload
    )
