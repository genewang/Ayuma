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
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { TreatmentNode, TrialNode, AssistanceNode, MedicationNode } from './nodes'
import { initialMedicalNodes, initialMedicalEdges } from '../data/medicalData'
import { useMedicalFlowStore } from '../stores/useMedicalFlowStore'
import { useTrialStore } from '../stores/useTrialStore'
import { useUserStore } from '../stores/useUserStore'
import { useMedicationStore } from '../stores/useMedicationStore'

// Define custom node types
const nodeTypes = {
  treatmentNode: TreatmentNode,
  trialNode: TrialNode,
  assistanceNode: AssistanceNode,
  medicationNode: MedicationNode,
}

const MedicalFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialMedicalNodes as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialMedicalEdges as Edge[])

  const {
    setSelectedGuideline,
    setSelectedTrial,
    setSelectedProgram,
    setSelectedMedication,
    setCurrentFlow,
    updateNodes,
    updateEdges,
    patientProfile
  } = useMedicalFlowStore()

  const { calculateEligibility } = useTrialStore()
  const { getEligiblePrograms } = useUserStore()
  const { checkInteractions } = useMedicationStore()

  // Update nodes when patient profile changes
  useEffect(() => {
    if (patientProfile) {
      // Recalculate trial eligibility
      calculateEligibility(patientProfile)

      // Get eligible assistance programs
      getEligiblePrograms(patientProfile)

      // Check medication interactions
      checkInteractions([])
    }
  }, [patientProfile, calculateEligibility, getEligiblePrograms, checkInteractions])

  // Update store when nodes change
  useEffect(() => {
    updateNodes(nodes as any)
  }, [nodes, updateNodes])

  useEffect(() => {
    updateEdges(edges as any)
  }, [edges, updateEdges])

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Handle node clicks to select items and show panels
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const nodeData = node.data as any

      // Update selection state
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === node.id,
          },
        }))
      )

      // Set selected items based on node type
      switch (node.type) {
        case 'treatmentNode':
          if (nodeData.guidelines?.length > 0) {
            setSelectedGuideline(nodeData.guidelines[0])
            setCurrentFlow('treatment')
          }
          break
        case 'trialNode':
          if (nodeData.trial) {
            setSelectedTrial(nodeData.trial)
            setCurrentFlow('trials')
          }
          break
        case 'assistanceNode':
          if (nodeData.program) {
            setSelectedProgram(nodeData.program)
            setCurrentFlow('assistance')
          }
          break
        case 'medicationNode':
          if (nodeData.medication) {
            setSelectedMedication(nodeData.medication)
            setCurrentFlow('medications')
          }
          break
      }
    },
    [setNodes, setSelectedGuideline, setSelectedTrial, setSelectedProgram, setSelectedMedication, setCurrentFlow]
  )

  // Custom edge styles
  const edgeOptions = useMemo(() => ({
    animated: false,
    style: {
      stroke: 'hsl(var(--border))',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'hsl(var(--border))',
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
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
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
          nodeBorderRadius={8}
        />
      </ReactFlow>
    </div>
  )
}

export default MedicalFlow
