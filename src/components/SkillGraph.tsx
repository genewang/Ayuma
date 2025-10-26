import React, { useCallback, useMemo, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import RoleNode from './nodes/RoleNode'
import { initialNodes, initialEdges } from '../data/initialData'
import { useAppStore } from '../stores/useAppStore'

// Define custom node types
const nodeTypes = {
  roleNode: RoleNode,
}

const SkillGraph: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[])
  const { setSelectedRole, setSkills } = useAppStore()

  // Initialize skills in store
  useEffect(() => {
    setSkills(initialNodes[0]?.data?.role?.skills?.map((skillId: string) => ({
      id: skillId,
      name: skillId,
      description: `Skills for ${skillId}`,
      category: 'General',
      resources: [],
      progress: Math.floor(Math.random() * 100)
    })) || [])
  }, [setSkills])

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Handle node clicks to select roles
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const roleData = (node.data as any)?.role
      if (roleData) {
        setSelectedRole(roleData)
      }

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === node.id,
          },
        }))
      )
    },
    [setNodes, setSelectedRole]
  )

  // Custom edge styles
  const edgeOptions = useMemo(() => ({
    animated: false,
    style: {
      stroke: 'hsl(var(--border))',
      strokeWidth: 2,
    },
  }), [])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
      >
        {/* Background pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--muted-foreground))"
        />

        {/* Controls for zoom, fit view, etc. */}
        <Controls
          className="bg-card border-border"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />

        {/* Mini map */}
        <MiniMap
          nodeColor="hsl(var(--primary))"
          nodeStrokeWidth={2}
          maskColor="hsl(var(--muted) / 0.5)"
          className="bg-card border-border"
        />
      </ReactFlow>
    </div>
  )
}

export default SkillGraph
