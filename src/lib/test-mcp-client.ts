// Test script for MCP Client implementation
// Tests the MCP client communication with the medical AI backend

import { getMCPClient, resetMCPClient } from './mcp-client'

async function testMCPClient() {
  console.log('='.repeat(60))
  console.log('Medical GuidedPath AI MCP Client Test Suite')
  console.log('='.repeat(60))

  const mcpClient = getMCPClient('http://localhost:8001/mcp')

  try {
    // Test 1: List Tools
    console.log('\n1. Testing list_tools()...')
    try {
      const tools = await mcpClient.listTools()
      console.log(`✓ Found ${tools.length} tools:`)
      tools.forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.description}`)
      })
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    // Test 2: List Resources
    console.log('\n2. Testing list_resources()...')
    try {
      const resources = await mcpClient.listResources()
      console.log(`✓ Found ${resources.length} resources:`)
      resources.forEach(resource => {
        console.log(`  - ${resource.name}: ${resource.uri}`)
      })
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    // Test 3: Read System Status Resource
    console.log('\n3. Testing read_resource() for system status...')
    try {
      const statusContent = await mcpClient.readResource('medical://guidelines/status')
      const status = JSON.parse(statusContent)
      console.log('✓ System status retrieved:')
      console.log(`  Status: ${status.status}`)
      console.log(`  Documents indexed: ${status.documents_indexed}`)
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    // Test 4: Extract Medical Entities
    console.log('\n4. Testing extract_medical_entities()...')
    try {
      const testText = 'Patient has HER2-positive breast cancer, Stage III, undergoing chemotherapy with trastuzumab'
      const entities = await mcpClient.extractMedicalEntities(testText)
      console.log('✓ Entities extracted:')
      Object.entries(entities).forEach(([type, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          console.log(`  ${type}: ${values.join(', ')}`)
        }
      })
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    // Test 5: Validate Medical Query
    console.log('\n5. Testing validate_medical_query()...')
    try {
      const testQuery = 'What are the treatment options for metastatic breast cancer?'
      const validation = await mcpClient.validateMedicalQuery(testQuery)
      console.log('✓ Query validated:')
      console.log(`  Validation status: ${validation.validation_status}`)
      console.log(`  Query type: ${validation.query_analysis?.query_type}`)
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    // Test 6: Get System Status (via tool)
    console.log('\n6. Testing get_system_status()...')
    try {
      const status = await mcpClient.getSystemStatus()
      console.log('✓ System status retrieved via tool:')
      console.log(`  Status: ${status.status}`)
      console.log(`  Models available: ${status.models_available?.length || 0}`)
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    // Test 7: Process Medical Query (may take longer)
    console.log('\n7. Testing process_medical_query()...')
    try {
      const testQuery = 'What are the first-line treatments for HER2-positive breast cancer?'
      const response = await mcpClient.processMedicalQuery(testQuery)
      console.log('✓ Query processed:')
      console.log(`  Model used: ${response.model_used}`)
      console.log(`  Evidence quality: ${response.evidence_quality}`)
      console.log(`  Citations: ${response.citations?.length || 0}`)
      console.log(`  Answer preview: ${response.answer?.substring(0, 100)}...`)
    } catch (error) {
      console.error(`✗ Failed: ${error}`)
      return false
    }

    console.log('\n' + '='.repeat(60))
    console.log('Test Summary')
    console.log('='.repeat(60))
    console.log('🎉 All MCP client tests passed!')
    return true

  } catch (error) {
    console.error('\n❌ Test suite failed:', error)
    return false
  } finally {
    resetMCPClient()
  }
}

// Export test function for use in test runners
export { testMCPClient }
