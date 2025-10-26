import React, { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Import custom node components
import {
  DiagnosisNode,
  DecisionNode,
  OutcomeNode,
  TreatmentNode,
  TrialNode,
  MedicationNode
} from './nodes'

// Import AI-powered panels
import TreatmentPanel from './panels/TreatmentPanel'
import TrialPanel from './panels/TrialPanel'
import MedicationPanel from './panels/MedicationPanel'

// Import stores
import { useMedicalFlowStore } from '../stores/useMedicalFlowStore'

// Custom node types
const nodeTypes = {
  diagnosis: DiagnosisNode,
  treatment: TreatmentNode,
  trial: TrialNode,
  medication: MedicationNode,
  decision: DecisionNode,
  outcome: OutcomeNode,
}

// Initial nodes for a sample breast cancer pathway
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'diagnosis',
    position: { x: 250, y: 25 },
    data: {
      label: 'Breast Cancer Diagnosis',
      stage: 'Stage II',
      biomarkers: ['ER+', 'PR+', 'HER2-'],
      grade: 'Grade 2',
      tumorSize: '2.5 cm',
      lymphNodes: '1/3 positive'
    },
  },
  {
    id: '2',
    type: 'decision',
    position: { x: 100, y: 175 },
    data: {
      label: 'Treatment Decision Point',
      question: 'Consider surgical options',
      options: ['Lumpectomy', 'Mastectomy'],
    },
  },
  {
    id: '3',
    type: 'treatment',
    position: { x: 25, y: 325 },
    data: {
      label: 'Surgery',
      type: 'Lumpectomy',
      details: 'Breast-conserving surgery with sentinel lymph node biopsy',
      duration: '2-3 hours',
      recovery: '1-2 weeks',
    },
  },
  {
    id: '4',
    type: 'treatment',
    position: { x: 175, y: 325 },
    data: {
      label: 'Alternative Surgery',
      type: 'Mastectomy',
      details: 'Complete breast removal with reconstruction option',
      duration: '3-4 hours',
      recovery: '3-4 weeks',
    },
  },
  {
    id: '5',
    type: 'decision',
    position: { x: 100, y: 475 },
    data: {
      label: 'Adjuvant Therapy Decision',
      question: 'Based on pathology and biomarkers',
      options: ['Chemotherapy', 'Hormone Therapy', 'Radiation'],
    },
  },
  {
    id: '6',
    type: 'treatment',
    position: { x: 25, y: 625 },
    data: {
      label: 'Chemotherapy',
      type: 'AC-T Protocol',
      details: 'Doxorubicin + Cyclophosphamide → Paclitaxel',
      cycles: '4 AC + 4 T',
      duration: '16-20 weeks',
      sideEffects: ['Hair loss', 'Nausea', 'Fatigue'],
    },
  },
  {
    id: '7',
    type: 'treatment',
    position: { x: 175, y: 625 },
    data: {
      label: 'Hormone Therapy',
      type: 'Tamoxifen',
      details: 'ER/PR positive breast cancer treatment',
      duration: '5-10 years',
      sideEffects: ['Hot flashes', 'Mood changes'],
    },
  },
  {
    id: '8',
    type: 'treatment',
    position: { x: 325, y: 625 },
    data: {
      label: 'Radiation Therapy',
      type: 'External Beam',
      details: 'Targeted radiation to breast and regional nodes',
      sessions: '25-30',
      duration: '5-6 weeks',
      sideEffects: ['Skin changes', 'Fatigue'],
    },
  },
  {
    id: '9',
    type: 'trial',
    position: { x: 475, y: 475 },
    data: {
      label: 'Clinical Trial Option',
      nctId: 'NCT04538742',
      title: 'Immunotherapy in Early Breast Cancer',
      phase: 'Phase II',
      eligibility: 'HER2- breast cancer',
      location: 'Within 50 miles',
    },
  },
  {
    id: '10',
    type: 'outcome',
    position: { x: 250, y: 775 },
    data: {
      label: 'Expected Outcomes',
      survival: '5-year: 90-95%',
      recurrence: '10-15%',
      qualityOfLife: 'Good with proper support',
      followUp: 'Every 3-6 months',
    },
  },
]

// Initial edges connecting the pathway
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', label: 'Recommended' },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', label: 'Alternative' },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', label: 'If indicated' },
  { id: 'e5-7', source: '5', target: '7', type: 'smoothstep', label: 'ER/PR+' },
  { id: 'e5-8', source: '5', target: '8', type: 'smoothstep', label: 'Post-lumpectomy' },
  { id: 'e5-9', source: '5', target: '9', type: 'smoothstep', label: 'Research option' },
  { id: 'e6-10', source: '6', target: '10', type: 'smoothstep' },
  { id: 'e7-10', source: '7', target: '10', type: 'smoothstep' },
  { id: 'e8-10', source: '8', target: '10', type: 'smoothstep' },
  { id: 'e9-10', source: '9', target: '10', type: 'smoothstep' },
]

interface MedicalPathwayVisualizationProps {
  patientData?: any
  onNodeClick?: (node: Node) => void
  onEdgeClick?: (edge: Edge) => void
}

const MedicalPathwayVisualization: React.FC<MedicalPathwayVisualizationProps> = ({
  patientData,
  onNodeClick,
  onEdgeClick,
}) => {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onNodesChange = useCallback((changes: any[]) => {
    setNodes((nds: Node[]) =>
      changes.reduce((acc: Node[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter((node: Node) => node.id !== change.id)
        }
        if (change.type === 'add') {
          return [...acc, change.item]
        }
        return acc
      }, nds)
    )
  }, [])

  // Store integration
  const {
    setSelectedGuideline,
    setSelectedTrial,
    setSelectedMedication,
    patientProfile,
    setPatientProfile,
    selectedGuideline,
    selectedTrial,
    selectedMedication
  } = useMedicalFlowStore()

  // Update patient profile from props if provided
  React.useEffect(() => {
    if (patientData && !patientProfile) {
      setPatientProfile({
        id: 'temp-id',
        userId: 'temp-user-id',
        diagnosis: patientData.diagnosis || '',
        stage: patientData.stage || '',
        biomarkers: patientData.biomarkers || [],
        previousTreatments: patientData.previousTreatments || [],
        location: patientData.location || '',
        insurance: patientData.insurance || '',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  }, [patientData, patientProfile, setPatientProfile])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClickHandler = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick?.(node)

      // Update store based on node type
      switch (node.type) {
        case 'treatment':
          setSelectedGuideline({
            id: node.id,
            institution: 'NCCN',
            condition: 'Breast Cancer',
            stage: node.data.stage || 'All Stages',
            recommendations: [],
            evidenceLevel: 'High',
            lastUpdated: new Date(),
            sourceUrl: '#',
            createdAt: new Date()
          })
          break
        case 'trial':
          setSelectedTrial({
            id: node.id,
            nctId: node.data.nctId || '',
            title: node.data.title || '',
            phase: node.data.phase || 'Phase II',
            status: 'recruiting',
            conditions: ['Breast Cancer'],
            interventions: ['Immunotherapy'],
            locations: [],
            eligibilityCriteria: [],
            startDate: new Date(),
            primaryCompletionDate: new Date(),
            lastUpdated: new Date(),
            sponsor: 'Test Sponsor',
            description: 'Clinical trial for breast cancer treatment',
            createdAt: new Date()
          })
          break
        case 'medication':
          setSelectedMedication({
            id: node.id,
            name: node.data.name || 'Sample Medication',
            genericName: 'Generic Version',
            brandNames: ['Brand Name'],
            drugClass: 'Chemotherapy',
            indication: node.data.description || 'Cancer treatment',
            dosageForms: {},
            strength: 'Standard dose',
            contraindications: [],
            warnings: [],
            sideEffects: ['Nausea', 'Fatigue'],
            interactions: {},
            createdAt: new Date(),
            updatedAt: new Date()
          })
          break
      }
    },
    [onNodeClick, setSelectedGuideline, setSelectedTrial, setSelectedMedication]
  )

  const onEdgeClickHandler = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      onEdgeClick?.(edge)
    },
    [onEdgeClick]
  )

  // Custom edge styles for medical pathways
  const edgeOptions = useMemo(() => ({
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#3b82f6',
    },
  }), [])

  return (
    <div className="w-full h-full relative">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges.map(edge => ({ ...edge, ...edgeOptions }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClickHandler}
          onEdgeClick={onEdgeClickHandler}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <Background />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'diagnosis': return '#ef4444'
                case 'treatment': return '#10b981'
                case 'trial': return '#8b5cf6'
                case 'medication': return '#f59e0b'
                case 'decision': return '#3b82f6'
                case 'outcome': return '#6b7280'
                default: return '#6b7280'
              }
            }}
          />

          {/* AI-Powered Panels */}
          <Panel position="top-right">
            <div className="flex flex-col gap-2">
              {selectedGuideline && (
                <TreatmentPanel />
              )}
              {selectedTrial && (
                <TrialPanel />
              )}
              {selectedMedication && (
                <MedicationPanel />
              )}
            </div>
          </Panel>

          {/* Pathway Controls */}
          <Panel position="top-left">
            <div className="bg-white p-4 rounded-lg shadow-lg border">
              <h3 className="font-semibold text-gray-800 mb-2">Medical Pathway</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Diagnosis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Decision Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Treatments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Clinical Trials</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Outcomes</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Patient Context Panel */}
          {patientProfile && (
            <Panel position="bottom-left">
              <div className="bg-white p-4 rounded-lg shadow-lg border max-w-xs">
                <h3 className="font-semibold text-gray-800 mb-2">Patient Profile</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Diagnosis:</strong> {patientProfile.diagnosis}</div>
                  <div><strong>Stage:</strong> {patientProfile.stage}</div>
                  <div><strong>Biomarkers:</strong> {patientProfile.biomarkers?.join(', ') || 'None'}</div>
                  <div><strong>Treatments:</strong> {patientProfile.previousTreatments?.join(', ') || 'None'}</div>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export default MedicalPathwayVisualization
