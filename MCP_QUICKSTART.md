# MCP Quick Start Guide

This guide will help you quickly test the MCP (Model Context Protocol) implementation for Medical GuidedPath AI.

## Prerequisites

- Python 3.8+ installed
- Node.js and npm installed
- Existing medical AI backend components working

## Step 1: Install MCP Dependencies

```bash
cd backend
pip install -r requirements-mcp.txt
```

## Step 2: Start the MCP Host

The MCP host provides HTTP transport for MCP communication:

```bash
cd backend
python mcp_host.py --host 0.0.0.0 --port 8001
```

You should see:
```
INFO:     Started server process [PID]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001
```

## Step 3: Test MCP Server

In a new terminal, test the MCP server implementation:

```bash
cd backend
python test_mcp_server.py
```

Expected output:
```
============================================================
Medical GuidedPath AI MCP Server Test Suite
============================================================

Initializing Medical AI Controller...
✓ Controller initialized successfully

============================================================
Testing MCP Resources
============================================================

1. Testing list_resources()...
✓ Found 2 resources:
  - System Status: medical://guidelines/status
  - AI Capabilities: medical://guidelines/capilities

2. Testing read_resource()...
✓ Read System Status:
  {"status": "healthy", "documents_indexed": 0, ...}

============================================================
Testing MCP Tools
============================================================

1. Testing list_tools()...
✓ Found 5 tools:
  - process_medical_query
  - validate_medical_query
  - ingest_medical_documents
  - get_system_status
  - extract_medical_entities

... (additional tests)

============================================================
Test Summary
============================================================
Resources: ✓ PASSED
Tools: ✓ PASSED

🎉 All tests passed!
```

## Step 4: Test MCP Client (Optional)

To test the TypeScript MCP client from the frontend:

1. Start your React development server:
```bash
npm run dev
```

2. Open browser console and test:
```javascript
import { getMCPClient } from './lib/mcp-client'

const client = getMCPClient('http://localhost:8001/mcp')

// Test listing tools
const tools = await client.listTools()
console.log('Available tools:', tools)

// Test medical query
const response = await client.processMedicalQuery(
  "What are the treatments for breast cancer?"
)
console.log('Response:', response)
```

## Step 5: Verify Health Check

Check that the MCP host is running:

```bash
curl http://localhost:8001/health
```

Expected response:
```json
{
  "status": "healthy",
  "mcp_server_running": true
}
```

## Step 6: Test MCP Protocol Directly

Test the MCP protocol endpoint directly:

```bash
curl -X POST http://localhost:8001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

Expected response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "process_medical_query",
        "description": "Process a medical query using AI and RAG system...",
        "inputSchema": {...}
      },
      ...
    ]
  }
}
```

## Troubleshooting

### MCP Host Won't Start

**Error**: `ModuleNotFoundError: No module named 'mcp'`

**Solution**: Install MCP dependencies:
```bash
pip install -r requirements-mcp.txt
```

**Error**: `ImportError: cannot import name 'Server' from 'mcp.server'`

**Solution**: Ensure you have the correct MCP version:
```bash
pip install --upgrade mcp
```

### Tests Fail

**Error**: `Failed to initialize controller`

**Solution**: Ensure all medical AI components are available:
- `main_controller.py`
- `llm_coordinator.py`
- `medical_rag.py`
- `evidence_ranker.py`

**Error**: `ChromaDB initialization failed`

**Solution**: Ensure ChromaDB directory exists:
```bash
mkdir -p backend/chroma_data
```

### Connection Issues

**Error**: `Connection refused` when calling MCP host

**Solution**: Ensure the MCP host is running on the correct port:
```bash
# Check if port 8001 is in use
lsof -i :8001

# Start MCP host on port 8001
python backend/mcp_host.py --port 8001
```

## Architecture Overview

The MCP implementation consists of three main components:

1. **MCP Server** (`backend/mcp_server.py`)
   - Exposes medical AI capabilities as MCP tools
   - Provides MCP resources for system status
   - Uses stdio transport

2. **MCP Host** (`backend/mcp_host.py`)
   - Provides HTTP transport for MCP communication
   - Bridges HTTP clients to stdio-based MCP server
   - Runs on port 8001

3. **MCP Client** (`src/lib/mcp-client.ts`)
   - TypeScript client for React frontend
   - Communicates with MCP host via HTTP
   - Provides convenience methods for medical AI tools

## Next Steps

1. **Integrate MCP Client**: Update React components to use `getMCPClient()` instead of `BackendAPIClient`
2. **Add Authentication**: Implement authentication for MCP endpoints
3. **Add WebSocket Support**: Enable real-time communication
4. **Performance Testing**: Test with high query volumes
5. **Production Deployment**: Deploy MCP host with proper infrastructure

## Documentation

For detailed architecture information, see `MCP_ARCHITECTURE.md`.
