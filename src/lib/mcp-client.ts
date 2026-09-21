// MCP (Model Context Protocol) Client for Medical GuidedPath AI
// Provides standardized tool-based communication with the medical AI backend

interface MCPMessage {
  jsonrpc: "2.0"
  id?: number | string
  method?: string
  params?: any
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
}

interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
}

interface MCPResource {
  uri: string
  name: string
  description: string
  mimeType: string
}

interface MCPCallToolResult {
  content: Array<{
    type: string
    text: string
  }>
  isError?: boolean
}

export class MCPClient {
  private messageId: number = 0
  private pendingRequests: Map<number | string, {
    resolve: (value: any) => void
    reject: (error: any) => void
  }> = new Map()
  private isConnected: boolean = false
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5

  constructor(private serverURL: string = 'http://localhost:8000/mcp') {
    this.connect()
  }

  private async connect(): Promise<void> {
    try {
      // Initialize MCP connection
      await this.sendRequest({
        jsonrpc: "2.0",
        id: this.getNextId(),
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            resources: {}
          },
          clientInfo: {
            name: "medical-guidedpath-frontend",
            version: "1.0.0"
          }
        }
      })

      this.isConnected = true
      this.reconnectAttempts = 0
      console.log('MCP Client connected successfully')
    } catch (error) {
      console.error('MCP Client connection failed:', error)
      this.handleReconnect()
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.pow(2, this.reconnectAttempts) * 1000
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)
      setTimeout(() => this.connect(), delay)
    } else {
      console.error('Max reconnection attempts reached. MCP client unavailable.')
    }
  }

  private getNextId(): number {
    return ++this.messageId
  }

  private async sendRequest(message: MCPMessage): Promise<any> {
    if (!this.isConnected) {
      throw new Error('MCP Client is not connected')
    }

    const id = message.id || this.getNextId()
    message.id = id

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })

      // In a real implementation, this would use WebSocket or HTTP transport
      // For now, we'll use fetch for HTTP-based MCP communication
      fetch(this.serverURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })
        .then(response => response.json())
        .then((response: MCPMessage) => {
          this.pendingRequests.delete(id)
          
          if (response.error) {
            reject(new Error(response.error.message))
          } else {
            resolve(response.result)
          }
        })
        .catch(error => {
          this.pendingRequests.delete(id)
          reject(error)
        })
    })
  }

  async listTools(): Promise<MCPTool[]> {
    try {
      const result = await this.sendRequest({
        jsonrpc: "2.0",
        id: this.getNextId(),
        method: "tools/list"
      })
      return result.tools || []
    } catch (error) {
      console.error('Failed to list tools:', error)
      return []
    }
  }

  async callTool(toolName: string, arguments_: Record<string, any>): Promise<MCPCallToolResult> {
    try {
      const result = await this.sendRequest({
        jsonrpc: "2.0",
        id: this.getNextId(),
        method: "tools/call",
        params: {
          name: toolName,
          arguments: arguments_
        }
      })
      return result
    } catch (error) {
      console.error(`Failed to call tool ${toolName}:`, error)
      throw error
    }
  }

  async listResources(): Promise<MCPResource[]> {
    try {
      const result = await this.sendRequest({
        jsonrpc: "2.0",
        id: this.getNextId(),
        method: "resources/list"
      })
      return result.resources || []
    } catch (error) {
      console.error('Failed to list resources:', error)
      return []
    }
  }

  async readResource(uri: string): Promise<string> {
    try {
      const result = await this.sendRequest({
        jsonrpc: "2.0",
        id: this.getNextId(),
        method: "resources/read",
        params: { uri }
      })
      
      // MCP returns content as an array with type and text fields
      if (Array.isArray(result.content) && result.content[0]) {
        return result.content[0].text
      }
      return JSON.stringify(result)
    } catch (error) {
      console.error(`Failed to read resource ${uri}:`, error)
      throw error
    }
  }

  // Convenience methods for medical AI tools
  async processMedicalQuery(query: string, patientContext?: Record<string, any>): Promise<any> {
    const result = await this.callTool("process_medical_query", {
      query,
      patient_context: patientContext
    })
    
    if (result.content && result.content[0]) {
      return JSON.parse(result.content[0].text)
    }
    throw new Error('Invalid response from process_medical_query tool')
  }

  async validateMedicalQuery(query: string): Promise<any> {
    const result = await this.callTool("validate_medical_query", { query })
    
    if (result.content && result.content[0]) {
      return JSON.parse(result.content[0].text)
    }
    throw new Error('Invalid response from validate_medical_query tool')
  }

  async extractMedicalEntities(text: string): Promise<any> {
    const result = await this.callTool("extract_medical_entities", { text })
    
    if (result.content && result.content[0]) {
      return JSON.parse(result.content[0].text)
    }
    throw new Error('Invalid response from extract_medical_entities tool')
  }

  async ingestMedicalDocuments(documents: any[]): Promise<any> {
    const result = await this.callTool("ingest_medical_documents", { documents })
    
    if (result.content && result.content[0]) {
      return JSON.parse(result.content[0].text)
    }
    throw new Error('Invalid response from ingest_medical_documents tool')
  }

  async getSystemStatus(): Promise<any> {
    const result = await this.callTool("get_system_status", {})
    
    if (result.content && result.content[0]) {
      return JSON.parse(result.content[0].text)
    }
    throw new Error('Invalid response from get_system_status tool')
  }

  disconnect(): void {
    this.isConnected = false
    this.pendingRequests.clear()
    console.log('MCP Client disconnected')
  }
}

// Singleton instance
let mcpClientInstance: MCPClient | null = null

export function getMCPClient(serverURL?: string): MCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new MCPClient(serverURL)
  }
  return mcpClientInstance
}

export function resetMCPClient(): void {
  if (mcpClientInstance) {
    mcpClientInstance.disconnect()
    mcpClientInstance = null
  }
}
