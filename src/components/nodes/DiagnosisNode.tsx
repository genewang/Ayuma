import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Badge } from '../ui/Badge'
import { Activity, Dna } from 'lucide-react'

interface DiagnosisNodeData {
  label: string
  stage: string
  biomarkers?: string[]
  grade?: string
  tumorSize?: string
  lymphNodes?: string
  isSelected?: boolean
  isCompleted?: boolean
  metadata?: Record<string, any>
}

const DiagnosisNode: React.FC<NodeProps<DiagnosisNodeData>> = ({ data, selected }) => {
  const {
    label,
    stage,
    biomarkers = [],
    grade,
    tumorSize,
    lymphNodes,
    isSelected,
    isCompleted
  } = data

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'stage i': return 'bg-green-100 text-green-800 border-green-200'
      case 'stage ii': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'stage iii': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'stage iv': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBiomarkerColor = (biomarker: string) => {
    if (biomarker.includes('ER+') || biomarker.includes('PR+')) {
      return 'bg-pink-100 text-pink-800 border-pink-200'
    }
    if (biomarker.includes('HER2+')) {
      return 'bg-purple-100 text-purple-800 border-purple-200'
    }
    if (biomarker.includes('HER2-')) {
      return 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${selected || isSelected
          ? 'border-red-500 shadow-lg ring-2 ring-red-500/20'
          : 'border-red-200 hover:border-red-300 hover:shadow-md'
        }
        ${isCompleted ? 'bg-red-50/50' : 'bg-card'}
        min-w-[240px] max-w-[320px]
      `}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-500 border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-red-500 border-2 border-background"
      />

      {/* Node content */}
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <Activity className="w-3 h-3 text-red-600" />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {label}
          </h3>
        </div>

        {/* Stage badge */}
        <Badge className={`text-xs ${getStageColor(stage)}`}>
          {stage}
        </Badge>

        {/* Biomarkers */}
        {biomarkers.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              <Dna className="w-3 h-3 mr-1" />
              Biomarkers
            </div>
            <div className="flex flex-wrap gap-1">
              {biomarkers.map((biomarker, index) => (
                <Badge
                  key={index}
                  className={`text-xs ${getBiomarkerColor(biomarker)}`}
                >
                  {biomarker}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Grade */}
        {grade && (
          <div className="text-xs text-muted-foreground">
            <strong>Grade:</strong> {grade}
          </div>
        )}

        {/* Tumor details */}
        <div className="space-y-1 text-xs text-muted-foreground">
          {tumorSize && <div><strong>Size:</strong> {tumorSize}</div>}
          {lymphNodes && <div><strong>Lymph Nodes:</strong> {lymphNodes}</div>}
        </div>

        {/* Completion indicator */}
        {isCompleted && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiagnosisNode
