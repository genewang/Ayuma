# MCP Architecture for Medical GuidedPath AI

## Overview

This document describes the Model Context Protocol (MCP) implementation for the Medical GuidedPath AI system. MCP provides a standardized protocol for tool-based communication between AI clients and servers, enabling better integration and testing capabilities.

## Architecture Components

### 1. MCP Server (`backend/mcp_server.py`)

The MCP server exposes the medical AI capabilities as standardized MCP tools and resources:

**Tools Available:**
- `process_medical_query` - Process medical queries with RAG and evidence-based responses
- `validate_medical_query` - Validate and analyze medical queries for entities
- `ingest_medical_documents` - Ingest medical documents into the knowledge base
- `get_system_status` - Get system status and performance metrics
- `extract_medical_entities` - Extract medical entities from text

**Resources Available:**
- `medical://guidelines/status` - Current system status
- `medical://guidelines/capabilities` - Available AI capabilities and models

### 2. MCP Host (`backend/mcp_host.py`)

The MCP host provides HTTP transport for MCP communication, bridging between HTTP clients and the stdio-based MCP server. It runs on port 8001 by default.

**Endpoints:**
- `POST /mcp` - MCP protocol endpoint
- `GET /health` - Health check
- `GET /` - Host information

### 3. MCP Client (`src/lib/mcp-client.ts`)

The MCP client provides a TypeScript/JavaScript interface for communicating with the MCP server from the React frontend:

**Key Methods:**
- `listTools()` - List available MCP tools
- `callTool(name, arguments)` - Execute a specific tool
- `listResources()` - List available MCP resources
- `readResource(uri)` - Read a specific resource
- `processMedicalQuery(query, patientContext)` - Convenience method for medical queries
- `validateMedicalQuery(query)` - Convenience method for query validation
- `extractMedicalEntities(text)` - Convenience method for entity extraction
- `ingestMedicalDocuments(documents)` - Convenience method for document ingestion
- `getSystemStatus()` - Convenience method for system status

### 4. Configuration (`mcp-config.json`)

Configuration file for MCP server setup, specifying command, arguments, and environment variables.

## Installation and Setup

### Backend Setup

1. Install MCP dependencies:
```bash
cd backend
pip install -r requirements-mcp.txt
```

2. The MCP server requires the existing medical AI components to be available:
- `main_controller.py` - Main controller
- `llm_coordinator.py` - LLM coordination
- `medical_rag.py` - RAG system
- `evidence_ranker.py` - Evidence ranking

### Frontend Setup

The MCP client is already integrated into the frontend at `src/lib/mcp-client.ts`. No additional installation is required.

## Running the MCP System

### Option 1: Run MCP Host (Recommended)

The MCP host provides HTTP transport and is easier to integrate with web clients:

```bash
cd backend
python mcp_host.py --host 0.0.0.0 --port 8001
```

The host will start on `http://localhost:8001` and provide:
- MCP endpoint at `http://localhost:8001/mcp`
- Health check at `http://localhost:8001/health`

### Option 2: Run MCP Server Directly

For stdio-based MCP communication:

```bash
cd backend
python -m mcp_server
```

## Testing

### Backend MCP Server Tests

Test the MCP server implementation:

```bash
cd backend
python test_mcp_server.py
```

This will test:
- Resource listing and reading
- Tool listing and execution
- Medical entity extraction
- Query validation
- Medical query processing
- System status retrieval

### Frontend MCP Client Tests

Test the MCP client from the frontend:

```typescript
import { testMCPClient } from './lib/test-mcp-client'

// Run the test suite
const success = await testMCPClient()
console.log(success ? 'Tests passed' : 'Tests failed')
```

## Integration with Existing System

### Using MCP Client in React Components

Replace the existing `BackendAPIClient` with `MCPClient` for standardized tool-based communication:

```typescript
import { getMCPClient } from './lib/mcp-client'

// Get MCP client instance
const mcpClient = getMCPClient('http://localhost:8001/mcp')

// Process medical query
const response = await mcpClient.processMedicalQuery(
  "What are the treatments for breast cancer?",
  { cancer_type: "breast", stage: "II" }
)

// Extract entities
const entities = await mcpClient.extractMedicalEntities(
  "Patient has HER2-positive breast cancer"
)
```

### Migration from REST API to MCP

The existing REST API (`backend/main.py`) continues to work alongside the MCP implementation. You can gradually migrate to MCP:

1. **Phase 1**: Run both REST API (port 8000) and MCP Host (port 8001)
2. **Phase 2**: Update frontend components to use MCP client for new features
3. **Phase 3**: Gradually migrate existing features from REST to MCP
4. **Phase 4**: Deprecate REST API once fully migrated

## MCP Protocol Details

### Request Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "process_medical_query",
    "arguments": {
      "query": "What are the treatments for breast cancer?"
    }
  }
}
```

### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"answer\": \"...\", \"citations\": [...]}"
      }
    ]
  }
}
```

## Benefits of MCP Architecture

1. **Standardized Protocol**: MCP provides a standardized way to expose AI capabilities
2. **Tool-Based**: Exposes functionality as tools rather than raw API endpoints
3. **Better Testing**: Standardized tools make testing easier and more consistent
4. **Resource Management**: Built-in resource management for system status and capabilities
5. **Transport Agnostic**: Works with stdio, HTTP, WebSocket, and other transports
6. **Type Safety**: Strong typing through JSON schemas for tool inputs/outputs
7. **Discovery**: Built-in tool and resource discovery capabilities

## Troubleshooting

### MCP Server Won't Start

1. Check that all dependencies are installed: `pip install -r requirements-mcp.txt`
2. Ensure the medical AI components are available in the backend directory
3. Check that the Python path includes the project root

### MCP Client Connection Issues

1. Ensure the MCP host is running: `curl http://localhost:8001/health`
2. Check CORS settings if running from a different origin
3. Verify the MCP client URL matches the host address

### Tool Execution Failures

1. Check that the medical AI controller is properly initialized
2. Verify that the vector database (ChromaDB) is accessible
3. Check logs for specific error messages

## Future Enhancements

1. **WebSocket Transport**: Add WebSocket support for real-time communication
2. **Authentication**: Add authentication and authorization for MCP endpoints
3. **Rate Limiting**: Implement rate limiting for tool calls
4. **Caching**: Add response caching for frequently used queries
5. **Streaming**: Add streaming support for long-running tool executions
6. **Tool Composition**: Support for composing multiple tools in a single request

## References

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
