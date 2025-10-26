import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { TreatmentGuideline } from '../../types'
import { Badge } from '../ui/Badge'
import { Pill, Calendar, BookOpen } from 'lucide-react'

interface TreatmentNodeData {
  title: string
  diagnosis: string
  stage: string
  guidelines: TreatmentGuideline[]
  isSelected?: boolean
  isCompleted?: boolean
  metadata?: Record<string, any>
}

const TreatmentNode: React.FC<NodeProps<TreatmentNodeData>> = ({ data, selected }) => {
  const { title, diagnosis, stage, guidelines, isSelected, isCompleted } = data

  const getInstitutionColor = (institution: string) => {
    switch (institution) {
      case 'ASCO': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'EULAR': return 'bg-green-100 text-green-800 border-green-200'
      case 'NCCN': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ESMO': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'early': return 'bg-green-100 text-green-800 border-green-200'
      case 'stage i': return 'bg-green-100 text-green-800 border-green-200'
      case 'stage ii': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'stage iii': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'stage iv': return 'bg-red-100 text-red-800 border-red-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${selected || isSelected
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50 hover:shadow-md'
        }
        ${isCompleted ? 'bg-green-50/50' : 'bg-card'}
        min-w-[220px] max-w-[300px]
      `}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />

      {/* Node content */}
      <div className="space-y-3">
        {/* Header with icon */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Pill className="w-3 h-3 text-blue-600" />
          </div>
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {title || diagnosis}
          </h3>
        </div>

        {/* Diagnosis badge */}
        <Badge className={`text-xs ${getStageColor(stage)}`}>
          {stage}
        </Badge>

        {/* Guidelines */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            Guidelines ({guidelines.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {guidelines.slice(0, 3).map((guideline) => (
              <Badge
                key={guideline.id}
                className={`text-xs ${getInstitutionColor(guideline.institution)}`}
              >
                {guideline.institution}
              </Badge>
            ))}
            {guidelines.length > 3 && (
              <Badge className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                +{guidelines.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Evidence level */}
        {guidelines.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Evidence: {guidelines[0].evidenceLevel}
          </div>
        )}

        {/* Last updated */}
        {guidelines.length > 0 && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Updated {new Date(guidelines[0].lastUpdated).toLocaleDateString()}
          </div>
        )}

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

export default TreatmentNode
