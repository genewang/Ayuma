#!/usr/bin/env python3
"""
Test script for MCP Server implementation
Tests the MCP tools and resources for Medical GuidedPath AI
"""

import asyncio
import json
import sys
import os

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from mcp_server import (
    list_resources,
    read_resource,
    list_tools,
    call_tool,
    initialize_controller
)
from mcp.types import TextContent

async def test_mcp_resources():
    """Test MCP resources"""
    print("=" * 60)
    print("Testing MCP Resources")
    print("=" * 60)
    
    # Test list resources
    print("\n1. Testing list_resources()...")
    try:
        resources = await list_resources()
        print(f"✓ Found {len(resources)} resources:")
        for resource in resources:
            print(f"  - {resource.name}: {resource.uri}")
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    # Test read resources
    print("\n2. Testing read_resource()...")
    try:
        for resource in resources:
            content = await read_resource(resource.uri)
            print(f"✓ Read {resource.name}:")
            print(f"  {content[:200]}...")
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    return True

async def test_mcp_tools():
    """Test MCP tools"""
    print("\n" + "=" * 60)
    print("Testing MCP Tools")
    print("=" * 60)
    
    # Test list tools
    print("\n1. Testing list_tools()...")
    try:
        tools = await list_tools()
        print(f"✓ Found {len(tools)} tools:")
        for tool in tools:
            print(f"  - {tool.name}: {tool.description}")
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    # Test get_system_status tool
    print("\n2. Testing get_system_status tool...")
    try:
        result = await call_tool("get_system_status", {})
        if result and len(result) > 0:
            content = result[0]
            if isinstance(content, TextContent):
                status_data = json.loads(content.text)
                print(f"✓ System status retrieved:")
                print(f"  Status: {status_data.get('status', 'unknown')}")
                print(f"  Documents indexed: {status_data.get('documents_indexed', 0)}")
            else:
                print(f"✗ Unexpected content type: {type(content)}")
                return False
        else:
            print("✗ No result returned")
            return False
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    # Test extract_medical_entities tool
    print("\n3. Testing extract_medical_entities tool...")
    try:
        test_text = "Patient has HER2-positive breast cancer, Stage III, undergoing chemotherapy with trastuzumab"
        result = await call_tool("extract_medical_entities", {"text": test_text})
        if result and len(result) > 0:
            content = result[0]
            if isinstance(content, TextContent):
                entities = json.loads(content.text)
                print(f"✓ Entities extracted:")
                for entity_type, values in entities.items():
                    if values:
                        print(f"  {entity_type}: {values}")
            else:
                print(f"✗ Unexpected content type: {type(content)}")
                return False
        else:
            print("✗ No result returned")
            return False
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    # Test validate_medical_query tool
    print("\n4. Testing validate_medical_query tool...")
    try:
        test_query = "What are the treatment options for metastatic breast cancer?"
        result = await call_tool("validate_medical_query", {"query": test_query})
        if result and len(result) > 0:
            content = result[0]
            if isinstance(content, TextContent):
                validation = json.loads(content.text)
                print(f"✓ Query validated:")
                print(f"  Validation status: {validation.get('validation_status', 'unknown')}")
                print(f"  Query type: {validation.get('query_analysis', {}).get('query_type', 'unknown')}")
            else:
                print(f"✗ Unexpected content type: {type(content)}")
                return False
        else:
            print("✗ No result returned")
            return False
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    # Test process_medical_query tool (may take longer)
    print("\n5. Testing process_medical_query tool...")
    try:
        test_query = "What are the first-line treatments for HER2-positive breast cancer?"
        result = await call_tool("process_medical_query", {"query": test_query})
        if result and len(result) > 0:
            content = result[0]
            if isinstance(content, TextContent):
                response = json.loads(content.text)
                print(f"✓ Query processed:")
                print(f"  Model used: {response.get('model_used', 'unknown')}")
                print(f"  Evidence quality: {response.get('evidence_quality', 'unknown')}")
                print(f"  Citations: {len(response.get('citations', []))}")
                print(f"  Answer preview: {response.get('answer', '')[:100]}...")
            else:
                print(f"✗ Unexpected content type: {type(content)}")
                return False
        else:
            print("✗ No result returned")
            return False
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False
    
    return True

async def test_mcp_integration():
    """Test full MCP integration"""
    print("=" * 60)
    print("Medical GuidedPath AI MCP Server Test Suite")
    print("=" * 60)
    
    # Initialize controller
    print("\nInitializing Medical AI Controller...")
    try:
        await initialize_controller()
        print("✓ Controller initialized successfully")
    except Exception as e:
        print(f"✗ Failed to initialize controller: {e}")
        return False
    
    # Run tests
    results = []
    
    # Test resources
    results.append(("Resources", await test_mcp_resources()))
    
    # Test tools
    results.append(("Tools", await test_mcp_tools()))
    
    # Print summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All tests passed!")
        return True
    else:
        print("\n❌ Some tests failed")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_mcp_integration())
    sys.exit(0 if success else 1)
